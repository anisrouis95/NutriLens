// Groq (free plan: a key from console.groq.com, no card). OpenAI-style chat
// API. The model list is read live, since Groq's free models change; a model
// that turns out not to read photos is remembered and skipped for photos.

import { SECRET_KEYS, getSecret } from '@/lib/storage';
import { GeminiError, type GenerateOptions } from '@/services/aiTypes';
import { ERROR_REST, HANG_REST, isResting, quotaRest, rest, UNAVAILABLE_REST } from '@/services/aiCooldown';
import { AiTimeout, IMAGE_TIMEOUT, TEXT_TIMEOUT, timedFetch } from '@/services/aiFetch';
import { readChat, toMessages } from '@/services/openaiCompat';

const API = 'https://api.groq.com/openai/v1';
const BUILT_IN = process.env.EXPO_PUBLIC_GROQ_API_KEY || null;

/** A key pasted on this phone wins over the one built into the app. */
export async function getGroqKey(): Promise<string | null> {
  return (await getSecret(SECRET_KEYS.groqApiKey)) || BUILT_IN;
}
export const hasBuiltInGroqKey = !!BUILT_IN;

/** Speech, safety classifiers and agent systems aren't chat models for this app. */
const NOT_CHAT = /whisper|guard|tts|playai|orpheus|compound|safeguard|distil/i;
/** Fallback when the list doesn't say which models read images. */
const READS_IMAGES = /qwen|llama-4|vision|-vl\b|maverick|scout/i;
/** Best general models first: big open models, then the rest. */
const PREFERRED = [/gpt-oss-120b/i, /qwen/i, /llama-4/i, /llama-3\.3-70b/i, /kimi/i, /gpt-oss-20b/i];
const MAX_TRIES = 3;

let cache: { at: number; key: string; ids: string[]; vision: string[] } | null = null;
/** Models that answered "images not supported" this session. */
const noImages = new Set<string>();

async function models(key: string): Promise<{ ids: string[]; vision: string[] }> {
  if (cache && cache.key === key && Date.now() - cache.at < 6 * 3600_000) return cache;
  let res: Response;
  try {
    res = await timedFetch(`${API}/models`, { headers: { Authorization: `Bearer ${key}` } }, TEXT_TIMEOUT);
  } catch {
    throw new GeminiError('network', 'Could not reach Groq');
  }
  if (res.status === 401) throw new GeminiError('invalid_key', 'The Groq key was rejected');
  if (!res.ok) throw new GeminiError('server', `Groq models ${res.status}`);
  const { data } = (await res.json()) as { data: { id: string; active?: boolean; input_modalities?: string[] }[] };
  const rank = (id: string) => {
    const i = PREFERRED.findIndex((re) => re.test(id));
    return i === -1 ? PREFERRED.length : i;
  };
  const ids = data
    .filter((m) => m.active !== false && !NOT_CHAT.test(m.id))
    .map((m) => m.id)
    .sort((a, b) => rank(a) - rank(b));
  // Groq lists each model's inputs; when it doesn't, fall back to known names.
  const reads = (id: string) => {
    const inputs = data.find((m) => m.id === id)?.input_modalities;
    return inputs ? inputs.includes('image') : READS_IMAGES.test(id);
  };
  cache = { at: Date.now(), key, ids, vision: ids.filter(reads) };
  return cache;
}

export async function generateGroq(key: string, opts: GenerateOptions): Promise<{ text: string; model: string }> {
  const { messages, hasImage } = toMessages(opts);
  const all = await models(key);
  const list = hasImage ? all.vision.filter((id) => !noImages.has(id)) : all.ids;
  if (!list.length) throw new GeminiError('server', hasImage ? 'No Groq model reads photos right now' : 'No Groq model available');

  let lastError: GeminiError | null = null;
  let tries = 0;
  for (const model of list) {
    if (tries >= MAX_TRIES) break;
    const id = `groq:${model}`;
    if (await isResting(id)) continue;
    tries++;
    let res: Response;
    try {
      res = await timedFetch(`${API}/chat/completions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
        body: JSON.stringify({ model, messages, temperature: opts.temperature ?? 0.2 }),
      }, hasImage ? IMAGE_TIMEOUT : TEXT_TIMEOUT);
    } catch (e) {
      if (e instanceof AiTimeout) {
        lastError = new GeminiError('server', `${model}: no answer in time`);
        await rest(id, HANG_REST);
        continue;
      }
      throw new GeminiError('network', 'Could not reach Groq');
    }
    const body = await res.text();
    if (res.ok) {
      const { text, error } = readChat(body);
      if (text) return { text, model };
      lastError = new GeminiError('bad_response', `${model}: ${error ?? 'empty reply'}`);
      await rest(id, ERROR_REST);
      continue;
    }
    if (res.status === 401) throw new GeminiError('invalid_key', 'The Groq key was rejected');
    if (res.status === 429 || res.status === 413) {
      lastError = new GeminiError('quota', `${model}: ${body.slice(0, 200)}`);
      await rest(id, quotaRest(body));
      continue;
    }
    // Only a clear "doesn't take images" marks the model; "invalid image data" is about this photo.
    if (res.status === 400 && hasImage && /(not|doesn.t|does not) support.{0,20}(image|vision)|image.{0,20}not supported|text.only/i.test(body)) {
      noImages.add(model);
      lastError = new GeminiError('server', `${model}: doesn't read photos`);
      continue;
    }
    lastError = new GeminiError('server', `${model} ${res.status}: ${body.slice(0, 200)}`);
    await rest(id, res.status === 404 || res.status === 403 || res.status === 400 ? UNAVAILABLE_REST : ERROR_REST);
  }
  throw lastError ?? new GeminiError('quota', 'Every Groq model is resting; it will try again later');
}
