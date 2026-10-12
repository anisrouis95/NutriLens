// OpenRouter client (OpenAI-compatible chat API), used as a second AI provider
// next to Gemini. It only ever picks models priced at zero, so a key without
// credits keeps working on the free daily allowance and is never charged.
// REST only, so it runs in Expo Go, dev builds and the web preview alike.

import { SECRET_KEYS, getSecret } from '@/lib/storage';
import { GeminiError, type GenerateOptions } from '@/services/aiTypes';

const API = 'https://openrouter.ai/api/v1';

/**
 * Tried first when they are free and available (best photo and French skills
 * first); the live list fills in the rest, and OpenRouter's own free router
 * comes last as a catch-all.
 */
const PREFERRED = [/gemma-4-31b/i, /gemma-4/i, /gemma/i, /gemini/i, /qwen.*vl/i, /llama-4/i, /mistral-small/i, /inkling/i, /nemotron.*omni/i];
const ROUTER = 'openrouter/free';
/** Free entries that aren't general assistants (classifiers, music). */
const NOT_ASSISTANTS = /safety|guard|moderation|lyria|music|embed/i;

const HEADERS = { 'Content-Type': 'application/json', 'X-Title': 'NutriLens' };

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

/** Free models from OpenRouter's live catalogue (free models come and go), cached for 6 hours. */
async function freeModels(needsImage: boolean): Promise<string[]> {
  if (!cache || Date.now() - cache.at > 6 * 3600_000) {
    const res = await fetch(`${API}/models`);
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

type Message = {
  role: 'system' | 'user' | 'assistant';
  content: string | ({ type: 'text'; text: string } | { type: 'image_url'; image_url: { url: string } })[];
};

function toMessages(opts: GenerateOptions): { messages: Message[]; hasImage: boolean } {
  let hasImage = false;
  let system = opts.system ?? '';
  if (opts.responseSchema) {
    // Free models rarely support structured output, so the schema goes in the prompt.
    system += `\n\nReply with ONE JSON object only (no prose, no code fences) that matches this schema:\n${JSON.stringify(opts.responseSchema)}`;
  }
  const messages: Message[] = system ? [{ role: 'system', content: system.trim() }] : [];
  for (const c of opts.contents) {
    const parts = c.parts.map((p) => {
      if ('text' in p) return { type: 'text' as const, text: p.text };
      hasImage = true;
      return { type: 'image_url' as const, image_url: { url: `data:${p.inlineData.mimeType};base64,${p.inlineData.data}` } };
    });
    messages.push({ role: c.role === 'model' ? 'assistant' : 'user', content: parts });
  }
  return { messages, hasImage };
}

/** Returns the reply text from the first free model that answers. */
export async function generateOpenRouter(key: string, opts: GenerateOptions): Promise<string> {
  const { messages, hasImage } = toMessages(opts);
  let models: string[];
  try {
    models = await freeModels(hasImage);
  } catch (e) {
    throw e instanceof GeminiError ? e : new GeminiError('network', 'Could not reach OpenRouter');
  }
  if (!models.length) throw new GeminiError('server', 'OpenRouter has no free model for this right now');

  let lastError: GeminiError | null = null;
  // A few of the best free models, then the free router as the last resort.
  const order = [...models.filter((m) => m !== ROUTER).slice(0, 3), ...(models.includes(ROUTER) ? [ROUTER] : [])];
  for (const model of order) {
    let res: Response;
    try {
      res = await fetch(`${API}/chat/completions`, {
        method: 'POST',
        headers: { ...HEADERS, Authorization: `Bearer ${key}` },
        body: JSON.stringify({ model, messages, temperature: opts.temperature ?? 0.2 }),
      });
    } catch {
      throw new GeminiError('network', 'Could not reach OpenRouter');
    }
    const body = await res.text();
    if (res.ok) {
      let text = '';
      try {
        const json = JSON.parse(body);
        if (json?.error) {
          lastError = new GeminiError('server', `${model}: ${String(json.error.message ?? '').slice(0, 200)}`);
          continue;
        }
        const content = json?.choices?.[0]?.message?.content;
        text = typeof content === 'string' ? content : Array.isArray(content) ? content.map((c: { text?: string }) => c.text ?? '').join('') : '';
      } catch {
        // fall through to the empty check
      }
      if (text.trim()) return text;
      lastError = new GeminiError('bad_response', `${model}: empty reply`);
      continue;
    }
    if (res.status === 401 || res.status === 403) {
      throw new GeminiError('invalid_key', 'The OpenRouter key was rejected');
    }
    if (res.status === 404 && /data policy|privacy/i.test(body)) {
      // Free endpoints need "allow training / logging" in the account's privacy settings.
      lastError = new GeminiError('data_policy', body.slice(0, 200));
      continue;
    }
    if (res.status === 402 || res.status === 429) {
      lastError = new GeminiError('quota', `${model}: ${body.slice(0, 200)}`);
      continue;
    }
    lastError = new GeminiError('server', `${model} ${res.status}: ${body.slice(0, 200)}`);
  }
  throw lastError ?? new GeminiError('server', 'No OpenRouter model answered');
}

/**
 * Checks the key, then makes one tiny request through the free models, so a
 * privacy-setting or quota problem shows up here rather than at the first
 * meal photo (it uses one request of the daily allowance).
 */
export async function testOpenRouterKey(): Promise<void> {
  const key = await getOpenRouterKey();
  if (!key) throw new GeminiError('no_key', 'No OpenRouter key set');
  let res: Response;
  try {
    res = await fetch(`${API}/key`, { headers: { ...HEADERS, Authorization: `Bearer ${key}` } });
  } catch {
    throw new GeminiError('network', 'Could not reach OpenRouter');
  }
  if (res.status === 401 || res.status === 403) throw new GeminiError('invalid_key', 'The OpenRouter key was rejected');
  if (!res.ok) throw new GeminiError('server', `OpenRouter ${res.status}`);
  await generateOpenRouter(key, {
    contents: [{ role: 'user', parts: [{ text: 'Reply with the single word OK.' }] }],
  });
}
