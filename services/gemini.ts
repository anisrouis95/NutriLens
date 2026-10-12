// AI client. Gemini (Google AI Studio free tier, no billing account) is the
// main provider; an OpenRouter key works instead of it, or as the fallback
// when Gemini's free quota for the day runs out.
// Uses the REST `generateContent` endpoint directly so it works in Expo Go,
// dev builds and the web preview without native modules.

import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { SECRET_KEYS, getSecret } from '@/lib/storage';
import { GeminiError, type GenerateOptions } from '@/services/aiTypes';
import { generateOpenRouter, getOpenRouterKey } from '@/services/openrouter';

const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Tried in order. Free-tier quotas are per model, so falling back on a 429
 * also stretches the daily allowance.
 */
const MODELS = ['gemini-3.8-flash', 'gemini-3.5-flash', 'gemini-2.5-flash'];

export { GeminiError } from '@/services/aiTypes';
export type { GeminiContent, GeminiErrorCode } from '@/services/aiTypes';

const envKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

export async function getGeminiKey(): Promise<string | null> {
  const stored = await getSecret(SECRET_KEYS.geminiApiKey);
  return stored || envKey || null;
}

async function callModel(
  model: string,
  key: string,
  opts: GenerateOptions,
  withThinkingConfig: boolean,
): Promise<Response> {
  const generationConfig: Record<string, unknown> = {
    temperature: opts.temperature ?? 0.2,
  };
  if (opts.responseSchema) {
    generationConfig.responseMimeType = 'application/json';
    generationConfig.responseSchema = opts.responseSchema;
  }
  // Gemini 3 models take a thinking level; low keeps scans fast.
  if (withThinkingConfig && model.startsWith('gemini-3')) {
    generationConfig.thinkingConfig = { thinkingLevel: 'low' };
  }
  const body: Record<string, unknown> = {
    contents: opts.contents,
    generationConfig,
  };
  if (opts.system) body.systemInstruction = { parts: [{ text: opts.system }] };

  return fetch(`${ENDPOINT}/${model}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': key },
    body: JSON.stringify(body),
  });
}

/** Returns the reply text from whichever provider has a key (Gemini first). */
export async function generate(opts: GenerateOptions): Promise<string> {
  const [gemini, openRouter] = await Promise.all([getGeminiKey(), getOpenRouterKey()]);
  if (!gemini && !openRouter) throw new GeminiError('no_key', 'No AI key set');
  if (!gemini) return generateOpenRouter(openRouter!, opts);
  try {
    return await generateGemini(gemini, opts);
  } catch (e) {
    const recoverable = e instanceof GeminiError && (e.code === 'quota' || e.code === 'server');
    if (openRouter && recoverable) return generateOpenRouter(openRouter, opts);
    throw e;
  }
}

/** Gemini only, trying fallback models when needed. */
async function generateGemini(key: string, opts: GenerateOptions): Promise<string> {

  let lastError: GeminiError | null = null;
  for (const model of MODELS) {
    let res: Response;
    try {
      res = await callModel(model, key, opts, true);
      if (res.status === 400) {
        const text = await res.clone().text();
        if (/thinking/i.test(text)) res = await callModel(model, key, opts, false);
      }
    } catch {
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
      if (!text) throw new GeminiError('bad_response', 'Empty response');
      return text;
    }

    const errText = await res.text();
    if (res.status === 400 && /API key not valid|API_KEY_INVALID/i.test(errText)) {
      throw new GeminiError('invalid_key', 'The Gemini API key is not valid');
    }
    if (res.status === 401 || res.status === 403) {
      throw new GeminiError('invalid_key', errText.slice(0, 200));
    }
    if (res.status === 404 || res.status === 429) {
      lastError = new GeminiError(
        res.status === 429 ? 'quota' : 'server',
        `${model}: ${errText.slice(0, 200)}`,
      );
      continue; // try the next model
    }
    lastError = new GeminiError('server', `${model} ${res.status}: ${errText.slice(0, 200)}`);
    if (res.status < 500) break;
  }
  throw lastError ?? new GeminiError('server', 'All models failed');
}

export async function generateJSON<T>(opts: GenerateOptions): Promise<T> {
  const text = await generate(opts);
  const cleaned = text.replace(/^```(?:json)?\s*|\s*```$/g, '').trim();
  // Some models wrap the JSON in a sentence; fall back to the outermost object.
  const first = cleaned.indexOf('{');
  const last = cleaned.lastIndexOf('}');
  for (const candidate of [cleaned, first >= 0 && last > first ? cleaned.slice(first, last + 1) : '']) {
    if (!candidate) continue;
    try {
      return JSON.parse(candidate) as T;
    } catch {
      // try the next form
    }
  }
  throw new GeminiError('bad_response', 'Could not read the AI response');
}

/** Downscale a photo to keep requests small and fast (≈150–300 KB). */
export async function imageToBase64(uri: string, maxWidth = 1024): Promise<string> {
  const context = ImageManipulator.manipulate(uri);
  context.resize({ width: maxWidth });
  const image = await context.renderAsync();
  const result = await image.saveAsync({
    format: SaveFormat.JPEG,
    compress: 0.7,
    base64: true,
  });
  if (!result.base64) throw new GeminiError('bad_response', 'Could not encode photo');
  return result.base64;
}

/** Quick connectivity/key check used by the settings screen (Gemini only). */
export async function testGeminiKey(): Promise<void> {
  const key = await getGeminiKey();
  if (!key) throw new GeminiError('no_key', 'No Gemini API key set');
  await generateGemini(key, {
    contents: [{ role: 'user', parts: [{ text: 'Reply with the single word OK.' }] }],
  });
}
