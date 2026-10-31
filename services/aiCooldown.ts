// Remembers which AI models (or whole providers) are resting, so a request
// doesn't spend its time and the free daily allowance on a model that just
// said "quota reached" or "not available". Kept on the phone across restarts.

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@nl/ai_cooldown';
const MINUTE = 60_000;
const HOUR = 60 * MINUTE;

let until: Record<string, number> | null = null;

async function load(): Promise<Record<string, number>> {
  if (until) return until;
  try {
    until = JSON.parse((await AsyncStorage.getItem(STORAGE_KEY)) ?? '{}') as Record<string, number>;
  } catch {
    until = {};
  }
  return until;
}

function save() {
  if (!until) return;
  const now = Date.now();
  for (const k of Object.keys(until)) if (until[k] <= now) delete until[k];
  AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(until)).catch(() => {});
}

/** True while `id` (e.g. "gemini:gemini-3.8-flash" or "openrouter:*") is resting. */
export async function isResting(id: string): Promise<boolean> {
  const map = await load();
  return (map[id] ?? 0) > Date.now();
}

export async function rest(id: string, ms: number) {
  const map = await load();
  map[id] = Date.now() + ms;
  save();
}

/** Clears every rest (a key was added or changed, or the user tests on purpose). */
export async function clearRests(prefix?: string) {
  const map = await load();
  for (const k of Object.keys(map)) if (!prefix || k.startsWith(prefix)) delete map[k];
  save();
}

/**
 * How long to rest after a "too many requests" answer: the rest of a few
 * hours for a daily allowance, about a minute for a per-minute one.
 */
export function quotaRest(message: string): number {
  return /per.?day|daily|perday|rpd|requests per day|free-models-per-day|tokens per day|tpd/i.test(message) ? 3 * HOUR : MINUTE + 5000;
}

/** A model that doesn't exist or isn't open to this key: try it again tomorrow. */
export const UNAVAILABLE_REST = 24 * HOUR;
/** A model that didn't answer in time (some free models queue requests forever). */
export const HANG_REST = 6 * HOUR;
/** A server error or an empty answer: give it a short break. */
export const ERROR_REST = 5 * MINUTE;
