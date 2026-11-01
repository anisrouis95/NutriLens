// Sets as the lock screen knows them, and its button presses applied back to
// a workout. A set's key is "exerciseId#n" (its n-th set in the session):
// sets are only ever added after an exercise's last set, so the key keeps
// pointing at the same set while the session goes on.

import type { LiveEvent } from '@/modules/live-timer';
import type { LoggedSet, WorkoutSession } from '@/types';

export function setKey(sets: LoggedSet[], index: number): string {
  const id = sets[index].exerciseId;
  let n = 0;
  for (let i = 0; i <= index; i++) if (sets[i].exerciseId === id) n++;
  return `${id}#${n}`;
}

export function indexOfKey(sets: LoggedSet[], key: string): number {
  const at = key.lastIndexOf('#');
  const id = key.slice(0, at);
  const n = Number(key.slice(at + 1));
  let seen = 0;
  for (let i = 0; i < sets.length; i++) {
    if (sets[i].exerciseId !== id) continue;
    if (++seen === n) return i;
  }
  return -1;
}

/**
 * The presses in order: Start stamps the set, Done logs it at its target
 * weight and reps (the lock screen can't type), Easy/Good/Hard rates it.
 * Presses for sets the workout no longer has (swapped meanwhile) are skipped.
 */
export function applyLiveEvents(session: WorkoutSession, events: LiveEvent[]): WorkoutSession {
  let sets = session.sets;
  for (const e of events) {
    const i = indexOfKey(sets, e.key);
    if (i < 0) continue;
    const patch: Partial<LoggedSet> =
      e.type === 'start'
        ? { startedAt: e.at }
        : e.type === 'done'
          ? { done: true, doneAt: e.at, startedAt: e.startedAt ?? sets[i].startedAt }
          : { effort: e.effort };
    sets = sets.map((x, k) => (k === i ? { ...x, ...patch } : x));
  }
  return sets === session.sets ? session : { ...session, sets };
}

export interface SessionTiming {
  /** Seconds lifting (Start → Done) over the timed sets. */
  lifting: number;
  /** Real rests between a set's Done and the next Start, in seconds. */
  rests: number[];
}

/** Lifting time and real rests from the stamped sets. */
export function sessionTiming(sets: LoggedSet[]): SessionTiming {
  const done = sets.filter((s) => s.done && s.doneAt).sort((a, b) => (a.doneAt ?? 0) - (b.doneAt ?? 0));
  let lifting = 0;
  const rests: number[] = [];
  for (let i = 0; i < done.length; i++) {
    const s = done[i];
    if (s.startedAt && s.doneAt && s.doneAt > s.startedAt) lifting += (s.doneAt - s.startedAt) / 1000;
    const next = done[i + 1];
    // Only gaps a person rests in: under 15 minutes (longer means a break or a forgotten tap).
    if (next?.startedAt && s.doneAt && next.startedAt > s.doneAt && next.startedAt - s.doneAt < 15 * 60000) {
      rests.push((next.startedAt - s.doneAt) / 1000);
    }
  }
  return { lifting: Math.round(lifting), rests };
}

/** Seconds per rep of a timed set, when it says something (3+ reps, not a forgotten Done). */
export function secondsPerRep(set: LoggedSet): number | null {
  if (!set.startedAt || !set.doneAt || set.reps < 3) return null;
  const spr = (set.doneAt - set.startedAt) / 1000 / set.reps;
  return spr > 0 && spr < 8 ? spr : null;
}
