// Health Connect (Android) — the on-device hub that Garmin Connect, Mi Fitness,
// Zepp (Amazfit), Samsung Health, Fitbit and Google's own apps write into.
// NutriLens only reads. Needs a development build (not Expo Go).

import { Platform } from 'react-native';
import { isExpoGo } from '@/lib/runtime';
import type { HealthDay, WeightEntry } from '@/types';
import { addDays, toDateKey } from '@/lib/nutritionMath';

type HCModule = typeof import('react-native-health-connect');

let hc: HCModule | null | undefined;
function load(): HCModule | null {
  if (hc !== undefined) return hc;
  if (Platform.OS !== 'android') return (hc = null);
  if (isExpoGo) return (hc = null); // not in Expo Go; requiring it would be a fatal error
  try {
    hc = require('react-native-health-connect') as HCModule;
  } catch {
    hc = null; // Expo Go: native module not present
  }
  return hc;
}

export type HealthStatus =
  | 'not_android'
  | 'needs_build'
  | 'not_installed'
  | 'update_required'
  | 'available';

const READ_TYPES = [
  'Steps',
  'ActiveCaloriesBurned',
  'TotalCaloriesBurned',
  'ExerciseSession',
  'RestingHeartRate',
  'SleepSession',
  'Weight',
  'Distance',
] as const;

export async function getHealthStatus(): Promise<HealthStatus> {
  if (Platform.OS !== 'android') return 'not_android';
  const mod = load();
  if (!mod) return 'needs_build';
  try {
    const status = await mod.getSdkStatus();
    if (status === mod.SdkAvailabilityStatus.SDK_AVAILABLE) return 'available';
    if (status === mod.SdkAvailabilityStatus.SDK_UNAVAILABLE_PROVIDER_UPDATE_REQUIRED) {
      return 'update_required';
    }
    return 'not_installed';
  } catch {
    return 'needs_build';
  }
}

/** Opens the system permission sheet. Returns the record types granted. */
export async function connectHealth(): Promise<string[]> {
  const mod = load();
  if (!mod) throw new Error('needs_build');
  const ok = await mod.initialize();
  if (!ok) throw new Error('not_installed');
  const granted = await mod.requestPermission(
    READ_TYPES.map((recordType) => ({ accessType: 'read' as const, recordType })),
  );
  return granted
    .filter((p): p is { accessType: 'read'; recordType: (typeof READ_TYPES)[number] } =>
      'recordType' in p,
    )
    .map((p) => p.recordType);
}

export function openHealthSettings() {
  load()?.openHealthConnectSettings();
}

function dayRange(date: string) {
  const start = new Date(`${date}T00:00:00`);
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return {
    operator: 'between' as const,
    startTime: start.toISOString(),
    endTime: end.toISOString(),
  };
}

async function safe<T>(fn: () => Promise<T>): Promise<T | undefined> {
  try {
    return await fn();
  } catch {
    return undefined; // permission not granted for this type, or no data
  }
}

/** Reads daily totals for the last `days` days (including today). */
export async function syncHealthDays(days = 14): Promise<HealthDay[]> {
  const mod = load();
  if (!mod) return [];
  await mod.initialize();
  const today = toDateKey();
  const dates = Array.from({ length: days }, (_, i) => addDays(today, -i));
  const now = new Date().toISOString();

  return Promise.all(
    dates.map(async (date) => {
      const timeRangeFilter = dayRange(date);
      const [steps, active, total, exercise, resting, sleep] = await Promise.all([
        safe(() => mod.aggregateRecord({ recordType: 'Steps', timeRangeFilter })),
        safe(() => mod.aggregateRecord({ recordType: 'ActiveCaloriesBurned', timeRangeFilter })),
        safe(() => mod.aggregateRecord({ recordType: 'TotalCaloriesBurned', timeRangeFilter })),
        safe(() => mod.aggregateRecord({ recordType: 'ExerciseSession', timeRangeFilter })),
        safe(() => mod.aggregateRecord({ recordType: 'RestingHeartRate', timeRangeFilter })),
        safe(() => mod.aggregateRecord({ recordType: 'SleepSession', timeRangeFilter })),
      ]);
      const day: HealthDay = { date, syncedAt: now };
      if (steps?.COUNT_TOTAL) day.steps = Math.round(steps.COUNT_TOTAL);
      if (active?.ACTIVE_CALORIES_TOTAL?.inKilocalories) {
        day.activeKcal = Math.round(active.ACTIVE_CALORIES_TOTAL.inKilocalories);
      }
      if (total?.ENERGY_TOTAL?.inKilocalories) {
        day.totalKcal = Math.round(total.ENERGY_TOTAL.inKilocalories);
      }
      if (exercise?.EXERCISE_DURATION_TOTAL?.inSeconds) {
        day.exerciseMinutes = Math.round(exercise.EXERCISE_DURATION_TOTAL.inSeconds / 60);
      }
      if (resting?.BPM_AVG) day.restingHr = Math.round(resting.BPM_AVG);
      if (sleep?.SLEEP_DURATION_TOTAL) {
        // Reported in seconds.
        day.sleepMinutes = Math.round(sleep.SLEEP_DURATION_TOTAL / 60);
      }
      return day;
    }),
  );
}

/** Weigh-ins from a smart scale or another app, one per day (latest wins). */
export async function readHealthWeights(days = 60): Promise<WeightEntry[]> {
  const mod = load();
  if (!mod) return [];
  const result = await safe(() =>
    mod.readRecords('Weight', {
      timeRangeFilter: {
        operator: 'after',
        startTime: new Date(Date.now() - days * 86400000).toISOString(),
      },
    }),
  );
  const byDay = new Map<string, { time: string; kg: number }>();
  for (const r of result?.records ?? []) {
    const kg = (r as { weight?: { inKilograms?: number } }).weight?.inKilograms;
    if (!kg) continue;
    const date = toDateKey(new Date(r.time));
    const prev = byDay.get(date);
    if (!prev || r.time > prev.time) byDay.set(date, { time: r.time, kg });
  }
  return [...byDay.entries()].map(([date, v]) => ({
    date,
    kg: Math.round(v.kg * 10) / 10,
  }));
}
