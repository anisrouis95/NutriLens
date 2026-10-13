// Backup / restore of the local data to Firestore under the signed-in user.
// Layout: users/{uid}/backup/{meta | foods_YYYY-MM | sessions_YYYY | cardio_YYYY}.
// Meals are split per month and workouts per year, which keeps every document
// far below Firestore's 1 MiB limit. Restore reads any of these by prefix, so
// older per-year meal documents still restore.

import { collection, doc, getDocs, writeBatch } from 'firebase/firestore';
import { getDb } from '@/utils/firebaseConfig';
import type { AppDataSnapshot } from '@/contexts/AppDataContext';
import type { CardioSession, FoodEntry, WorkoutSession } from '@/types';

// Firestore rejects `undefined` values; a JSON round-trip drops them.
const clean = <T,>(value: T): T => JSON.parse(JSON.stringify(value));

function groupBy<T extends { date: string }>(items: T[], chars: 4 | 7): Record<string, T[]> {
  const out: Record<string, T[]> = {};
  for (const item of items) {
    const key = item.date.slice(0, chars);
    (out[key] ??= []).push(item);
  }
  return out;
}
const groupByYear = <T extends { date: string }>(items: T[]) => groupBy(items, 4);
const groupByMonth = <T extends { date: string }>(items: T[]) => groupBy(items, 7);

export async function backupToCloud(uid: string, snapshot: AppDataSnapshot): Promise<void> {
  const base = collection(getDb(), 'users', uid, 'backup');
  const existing = await getDocs(base);
  const batch = writeBatch(getDb());

  const written = new Set<string>(['meta']);
  batch.set(
    doc(base, 'meta'),
    clean({
      version: snapshot.version,
      exportedAt: snapshot.exportedAt,
      profile: snapshot.profile,
      workoutPlan: snapshot.workoutPlan,
      weights: snapshot.weights,
      settings: snapshot.settings ?? null,
    }),
  );
  for (const [month, items] of Object.entries(groupByMonth(snapshot.foods))) {
    batch.set(doc(base, `foods_${month}`), clean({ items }));
    written.add(`foods_${month}`);
  }
  for (const [year, items] of Object.entries(groupByYear(snapshot.sessions))) {
    batch.set(doc(base, `sessions_${year}`), clean({ items }));
    written.add(`sessions_${year}`);
  }
  for (const [year, items] of Object.entries(groupByYear(snapshot.cardio ?? []))) {
    batch.set(doc(base, `cardio_${year}`), clean({ items }));
    written.add(`cardio_${year}`);
  }
  // Remove year documents that no longer exist locally (e.g. after a reset).
  existing.forEach((d) => {
    if (!written.has(d.id)) batch.delete(d.ref);
  });
  await batch.commit();
}

export async function restoreFromCloud(uid: string): Promise<AppDataSnapshot | null> {
  const snap = await getDocs(collection(getDb(), 'users', uid, 'backup'));
  if (snap.empty) return null;
  const result: AppDataSnapshot = {
    version: 2,
    exportedAt: new Date().toISOString(),
    profile: null,
    foods: [],
    weights: [],
    workoutPlan: null,
    sessions: [],
    cardio: [],
  };
  snap.forEach((d) => {
    const data = d.data();
    if (d.id === 'meta') {
      result.exportedAt = data.exportedAt ?? result.exportedAt;
      result.profile = data.profile ?? null;
      result.workoutPlan = data.workoutPlan ?? null;
      result.weights = data.weights ?? [];
      if (data.settings) result.settings = data.settings;
    } else if (d.id.startsWith('foods_')) {
      result.foods.push(...((data.items ?? []) as FoodEntry[]));
    } else if (d.id.startsWith('sessions_')) {
      result.sessions.push(...((data.items ?? []) as WorkoutSession[]));
    } else if (d.id.startsWith('cardio_')) {
      result.cardio!.push(...((data.items ?? []) as CardioSession[]));
    }
  });
  return result;
}
