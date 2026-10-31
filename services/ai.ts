// The app's AI: one entry point that tries every free provider it has a key
// for, in order (Gemini, then Groq, then OpenRouter), and moves on when one is
// out of free requests, down, or has no model for the job. Keys come from the
// phone (pasted in Profile) or are built into the app from `.env`.

import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
import { GeminiError, type AiAnswer, type GenerateOptions, type ProviderId } from '@/services/aiTypes';
import { clearRests } from '@/services/aiCooldown';
import { generateGemini, getGeminiKey } from '@/services/gemini';
import { generateGroq, getGroqKey } from '@/services/groq';
import { generateOpenRouter, getOpenRouterKey } from '@/services/openrouter';

export { GeminiError } from '@/services/aiTypes';
export type { AiAnswer, GeminiContent, GeminiErrorCode, ProviderId } from '@/services/aiTypes';

type Provider = {
  id: ProviderId;
  name: string;
  key: () => Promise<string | null>;
  run: (key: string, opts: GenerateOptions) => Promise<{ text: string; model: string }>;
};

export const PROVIDERS: Provider[] = [
  { id: 'gemini', name: 'Gemini', key: getGeminiKey, run: generateGemini },
  { id: 'groq', name: 'Groq', key: getGroqKey, run: generateGroq },
  { id: 'openrouter', name: 'OpenRouter', key: getOpenRouterKey, run: generateOpenRouter },
];

let last: AiAnswer | null = null;
/** The provider and model behind the latest answer. */
export const lastAnswer = () => last;

/** Picks the error that says the most when every provider failed. */
function summarize(errors: { provider: Provider; error: GeminiError }[]): GeminiError {
  const detail = errors.map((e) => `${e.provider.name}: ${e.error.message}`).join(' · ').slice(0, 600);
  const codes = errors.map((e) => e.error.code);
  const code =
    codes.every((c) => c === 'network')
      ? 'network'
      : codes.includes('blocked')
        ? 'blocked'
        : codes.includes('quota')
          ? 'quota'
          : codes.every((c) => c === 'invalid_key')
            ? 'invalid_key'
            : codes.includes('data_policy') && codes.length === 1
              ? 'data_policy'
              : codes.includes('bad_response')
                ? 'bad_response'
                : 'server';
  return new GeminiError(code, detail);
}

/** Reply text from the first provider that answers. `only` limits the run to one provider (Profile tests). */
export async function generate(opts: GenerateOptions, only?: ProviderId): Promise<string> {
  const errors: { provider: Provider; error: GeminiError }[] = [];
  let anyKey = false;
  for (const provider of PROVIDERS) {
    if (only && provider.id !== only) continue;
    const key = await provider.key();
    if (!key) continue;
    anyKey = true;
    try {
      const { text, model } = await provider.run(key, opts);
      last = { provider: provider.id, model };
      return text;
    } catch (e) {
      errors.push({ provider, error: e instanceof GeminiError ? e : new GeminiError('server', String(e).slice(0, 200)) });
    }
  }
  if (!anyKey) throw new GeminiError('no_key', 'No AI key set');
  throw summarize(errors);
}

export async function generateJSON<T>(opts: GenerateOptions): Promise<T> {
  const text = await generate(opts);
  const cleaned = text.replace(/^```(?:json)?\s*|\s*```$/g, '').trim();
  // Some models wrap the JSON in a sentence; fall back to the outermost object.
  const first = cleaned.indexOf('{');
  const lastBrace = cleaned.lastIndexOf('}');
  for (const candidate of [cleaned, first >= 0 && lastBrace > first ? cleaned.slice(first, lastBrace + 1) : '']) {
    if (!candidate) continue;
    try {
      return JSON.parse(candidate) as T;
    } catch {
      // try the next form
    }
  }
  throw new GeminiError('bad_response', 'Could not read the AI response');
}

/**
 * One tiny request, for the Profile test button. A test on purpose clears
 * the rests first, so it shows how things stand right now.
 */
export async function testAI(only?: ProviderId): Promise<AiAnswer> {
  await clearRests(only ? `${only}:` : undefined);
  await generate({ contents: [{ role: 'user', parts: [{ text: 'Reply with the single word OK.' }] }] }, only);
  return last!;
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
