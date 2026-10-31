// Gemini (Google AI Studio free tier: no billing account, available in
// Tunisia). The model list is read live from the API, so a model Google
// renames or retires never breaks the app; each model has its own free daily
// allowance, so moving down the list also stretches the day.
// REST only, so it runs in Expo Go, dev builds and the web preview alike.

import { SECRET_KEYS, getSecret } from '@/lib/storage';
import { GeminiError, type GenerateOptions } from '@/services/aiTypes';
import { ERROR_REST, HANG_REST, isResting, quotaRest, rest, UNAVAILABLE_REST } from '@/services/aiCooldown';
import { AiTimeout, hasImagePart, IMAGE_TIMEOUT, TEXT_TIMEOUT, timedFetch } from '@/services/aiFetch';

const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Tried first: on a free key these answered in about 2 s (checked
 * 2026-10-15), while the newest Flash models (3.8, 3.7) queued requests
 * without answering. Everything else in the live list follows, newest first.
 */
const PROVEN = ['gemini-3.6-flash', 'gemini-3.5-flash', 'gemini-3-flash-preview', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite'];
/** Plain Flash and Flash-Lite chat models (not image, speech, live or embedding variants). */
const FLASH = /^gemini-(\d+(?:\.\d+)?)-flash(-lite)?(-preview(?:-[\w-]+)?)?$/;
/** At most this many models per request: the rest wait for the next provider. */
const MAX_TRIES = 4;

const BUILT_IN = process.env.EXPO_PUBLIC_GEMINI_API_KEY || null;

/** A key pasted on this phone wins over the one built into the app. */
export async function getGeminiKey(): Promise<string | null> {
  return (await getSecret(SECRET_KEYS.geminiApiKey)) || BUILT_IN;
}
export const hasBuiltInGeminiKey = !!BUILT_IN;

let cache: { at: number; key: string; models: string[] } | null = null;

/** Proven models first (in that order), then Flash before Flash-Lite, newest first, previews last. */
function rank(ids: string[]): string[] {
  const score = (id: string) => {
    const proven = PROVEN.indexOf(id);
    if (proven >= 0) return 10_000 - proven;
    const m = FLASH.exec(id)!;
    return (m[3] ? 0 : 1000) + (m[2] ? 0 : 500) + Number(m[1]) * 10;
  };
  return ids.filter((id) => FLASH.test(id)).sort((a, b) => score(b) - score(a));
}

async function models(key: string): Promise<string[]> {
  if (cache && cache.key === key && Date.now() - cache.at < 6 * 3600_000) return cache.models;
  let ids: string[] = [];
  try {
    const res = await timedFetch(`${ENDPOINT}?pageSize=200`, { headers: { 'x-goog-api-key': key } }, TEXT_TIMEOUT);
    if (res.status === 400 || res.status === 401 || res.status === 403) {
      const text = await res.text();
      if (/API key not valid|API_KEY_INVALID|PERMISSION_DENIED|unregistered callers/i.test(text) || res.status === 401) {
        throw new GeminiError('invalid_key', 'The Gemini API key is not valid');
      }
    } else if (res.ok) {
      const json = (await res.json()) as { models?: { name: string; supportedGenerationMethods?: string[] }[] };
      ids = (json.models ?? [])
        .filter((m) => m.supportedGenerationMethods?.includes('generateContent'))
        .map((m) => m.name.replace(/^models\//, ''));
    }
  } catch (e) {
    if (e instanceof GeminiError) throw e;
    throw new GeminiError('network', 'Could not reach Gemini');
  }
  const ranked = rank(ids);
  const list = ranked.length ? ranked : PROVEN;
  cache = { at: Date.now(), key, models: list };
  return list;
}

function body(model: string, opts: GenerateOptions, thinking: boolean) {
  const generationConfig: Record<string, unknown> = { temperature: opts.temperature ?? 0.2 };
  if (opts.responseSchema) {
    generationConfig.responseMimeType = 'application/json';
    generationConfig.responseSchema = opts.responseSchema;
  }
  // Gemini 3 models take a thinking level; low keeps scans fast.
  if (thinking && /^gemini-[3-9]/.test(model)) generationConfig.thinkingConfig = { thinkingLevel: 'low' };
  const b: Record<string, unknown> = { contents: opts.contents, generationConfig };
  if (opts.system) b.systemInstruction = { parts: [{ text: opts.system }] };
  return JSON.stringify(b);
}

const call = (model: string, key: string, opts: GenerateOptions, thinking: boolean) =>
  timedFetch(
    `${ENDPOINT}/${model}:generateContent`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
      body: body(model, opts, thinking),
    },
    hasImagePart(opts.contents) ? IMAGE_TIMEOUT : TEXT_TIMEOUT,
  );

/** The reply from the first Gemini model that answers, skipping resting ones. */
export async function generateGemini(key: string, opts: GenerateOptions): Promise<{ text: string; model: string }> {
  const list = await models(key);
  let lastError: GeminiError | null = null;
  let tries = 0;
  for (const model of list) {
    if (tries >= MAX_TRIES) break;
    const id = `gemini:${model}`;
    if (await isResting(id)) continue;
    tries++;

    let res: Response;
    try {
      res = await call(model, key, opts, true);
      if (res.status === 400) {
        const text = await res.clone().text();
        if (/thinking/i.test(text)) res = await call(model, key, opts, false);
      }
      // One quick retry when Google is briefly overloaded.
      if (res.status === 503 || res.status === 500) {
        await new Promise((r) => setTimeout(r, 1200));
        res = await call(model, key, opts, true);
      }
    } catch (e) {
      if (e instanceof AiTimeout) {
        lastError = new GeminiError('server', `${model}: no answer in time`);
        await rest(id, HANG_REST);
        continue;
      }
      throw new GeminiError('network', 'Could not reach Gemini');
    }

    if (res.ok) {
      const json = await res.json();
      const candidate = json?.candidates?.[0];
      if (json?.promptFeedback?.blockReason || candidate?.finishReason === 'SAFETY') {
        throw new GeminiError('blocked', 'The request was blocked');
      }
      const text: string = (candidate?.content?.parts ?? [])
        .filter((p: { text?: string; thought?: boolean }) => p.text && !p.thought)
        .map((p: { text: string }) => p.text)
        .join('');
      if (text) return { text, model };
      lastError = new GeminiError('bad_response', `${model}: empty response`);
      await rest(id, ERROR_REST);
      continue;
    }

    const errText = await res.text();
    if (/API key not valid|API_KEY_INVALID/i.test(errText) || res.status === 401) {
      throw new GeminiError('invalid_key', 'The Gemini API key is not valid');
    }
    if (res.status === 429) {
      lastError = new GeminiError('quota', `${model}: ${errText.slice(0, 200)}`);
      await rest(id, quotaRest(errText));
      continue;
    }
    if (res.status === 404 || res.status === 403 || res.status === 400) {
      // Not open to this key, retired, or doesn't take this kind of request.
      lastError = new GeminiError('server', `${model} ${res.status}: ${errText.slice(0, 200)}`);
      await rest(id, UNAVAILABLE_REST);
      continue;
    }
    lastError = new GeminiError('server', `${model} ${res.status}: ${errText.slice(0, 200)}`);
    await rest(id, ERROR_REST);
  }
  throw lastError ?? new GeminiError('quota', 'Every Gemini model is resting; it will try again later');
}
