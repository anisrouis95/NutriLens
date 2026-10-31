// OpenRouter (OpenAI-style chat API). Only models priced at zero are used, so
// a key without credits keeps working on the free daily allowance (about 50
// requests a day for the whole key) and is never charged. The free catalogue
// changes often, so it is read live; a model closed to apps like this one
// ("only available on agentic harnesses") is skipped, not taken as a bad key.

import { SECRET_KEYS, getSecret } from '@/lib/storage';
import { GeminiError, type GenerateOptions } from '@/services/aiTypes';
import { ERROR_REST, HANG_REST, isResting, quotaRest, rest, UNAVAILABLE_REST } from '@/services/aiCooldown';
import { AiTimeout, IMAGE_TIMEOUT, TEXT_TIMEOUT, timedFetch } from '@/services/aiFetch';
import { readChat, toMessages } from '@/services/openaiCompat';

const API = 'https://openrouter.ai/api/v1';

/** Best photo and French skills first; the live list fills in the rest. */
const PREFERRED = [/gemma-4-31b/i, /gemma-4/i, /gemma/i, /gemini/i, /qwen.*vl/i, /llama-4/i, /mistral-small/i, /nemotron.*omni/i];
const ROUTER = 'openrouter/free';
/** Free entries that aren't general assistants (classifiers, music, agent-only models). */
const NOT_ASSISTANTS = /safety|guard|moderation|lyria|music|embed|inkling/i;
/** Each try spends one of the key's ~50 free requests a day: two models, then the free router. */
const MAX_MODELS = 2;

const HEADERS = { 'Content-Type': 'application/json', 'X-Title': 'Tounsi Fit' };

/**
 * Set in `.env` (git-ignored) so the key doesn't have to be typed on the phone.
 * It is baked into the app's JavaScript, so keep this key's credit limit at $0
 * on OpenRouter: even if someone pulled it out, it can only use free models.
 */
export const BUILT_IN_OPENROUTER_KEY = process.env.EXPO_PUBLIC_OPENROUTER_API_KEY || null;

/** A key pasted on this phone wins over the built-in one. */
export async function getOpenRouterKey(): Promise<string | null> {
  return (await getSecret(SECRET_KEYS.openRouterApiKey)) || BUILT_IN_OPENROUTER_KEY;
}

interface ModelInfo {
  id: string;
  pricing?: { prompt?: string; completion?: string };
  architecture?: { input_modalities?: string[]; output_modalities?: string[] };
}

let cache: { at: number; text: string[]; vision: string[] } | null = null;

/** Free models from OpenRouter's live catalogue, cached for 6 hours. */
async function freeModels(needsImage: boolean): Promise<string[]> {
  if (!cache || Date.now() - cache.at > 6 * 3600_000) {
    let res: Response;
    try {
      res = await timedFetch(`${API}/models`, {}, TEXT_TIMEOUT);
    } catch {
      throw new GeminiError('network', 'Could not reach OpenRouter');
    }
    if (!res.ok) throw new GeminiError('server', `OpenRouter models ${res.status}`);
    const { data } = (await res.json()) as { data: ModelInfo[] };
    const free = data.filter(
      (m) =>
        (m.id.endsWith(':free') || m.id === ROUTER) &&
        !NOT_ASSISTANTS.test(m.id) &&
        Number(m.pricing?.prompt ?? 1) === 0 &&
        Number(m.pricing?.completion ?? 1) === 0 &&
        (m.architecture?.output_modalities ?? ['text']).includes('text'),
    );
    const rank = (id: string) => {
      if (id === ROUTER) return PREFERRED.length + 1;
      const i = PREFERRED.findIndex((re) => re.test(id));
      return i === -1 ? PREFERRED.length : i;
    };
    const sorted = free.sort((a, b) => rank(a.id) - rank(b.id)).map((m) => m.id);
    const vision = free.filter((m) => m.architecture?.input_modalities?.includes('image')).map((m) => m.id);
    cache = { at: Date.now(), text: sorted, vision: sorted.filter((id) => vision.includes(id)) };
  }
  return needsImage ? cache.vision : cache.text;
}

/** The reply from the first free model that answers. */
export async function generateOpenRouter(key: string, opts: GenerateOptions): Promise<{ text: string; model: string }> {
  // The key's free daily allowance is shared by every model: when it's spent, rest the whole provider.
  if (await isResting('openrouter:*')) throw new GeminiError('quota', 'OpenRouter’s free requests for today are used up');
  const { messages, hasImage } = toMessages(opts);
  const models = await freeModels(hasImage);
  if (!models.length) throw new GeminiError('server', 'OpenRouter has no free model for this right now');

  const candidates: string[] = [];
  for (const m of models) {
    if (m === ROUTER || candidates.length >= MAX_MODELS) continue;
    if (!(await isResting(`openrouter:${m}`))) candidates.push(m);
  }
  if (models.includes(ROUTER)) candidates.push(ROUTER);

  let lastError: GeminiError | null = null;
  for (const model of candidates) {
    const id = `openrouter:${model}`;
    let res: Response;
    try {
      res = await timedFetch(`${API}/chat/completions`, {
        method: 'POST',
        headers: { ...HEADERS, Authorization: `Bearer ${key}` },
        body: JSON.stringify({ model, messages, temperature: opts.temperature ?? 0.2 }),
      }, hasImage ? IMAGE_TIMEOUT : TEXT_TIMEOUT);
    } catch (e) {
      if (e instanceof AiTimeout) {
        lastError = new GeminiError('server', `${model}: no answer in time`);
        await rest(id, HANG_REST);
        continue;
      }
      throw new GeminiError('network', 'Could not reach OpenRouter');
    }
    const body = await res.text();
    if (res.ok) {
      const { text, error } = readChat(body);
      if (text) return { text, model };
      lastError = new GeminiError('server', `${model}: ${error ?? 'empty reply'}`);
      await rest(id, ERROR_REST);
      continue;
    }
    // Only a 401 means the key itself is wrong; a 403 is one model closed to this app.
    if (res.status === 401) throw new GeminiError('invalid_key', 'The OpenRouter key was rejected');
    if (res.status === 404 && /data policy|privacy/i.test(body)) {
      // Free endpoints need "allow training / logging" in the account's privacy settings.
      lastError = new GeminiError('data_policy', body.slice(0, 200));
      continue;
    }
    if (res.status === 402 || res.status === 429) {
      lastError = new GeminiError('quota', `${model}: ${body.slice(0, 200)}`);
      if (/free-models-per-day|per day|daily/i.test(body)) {
        await rest('openrouter:*', quotaRest(body));
        break;
      }
      await rest(id, quotaRest(body));
      continue;
    }
    lastError = new GeminiError('server', `${model} ${res.status}: ${body.slice(0, 200)}`);
    await rest(id, res.status === 403 || res.status === 404 || res.status === 400 ? UNAVAILABLE_REST : ERROR_REST);
  }
  throw lastError ?? new GeminiError('server', 'No OpenRouter model answered');
}
