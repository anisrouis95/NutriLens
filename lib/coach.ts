// The weight coach: what to put on the bar (or machine) for each set, from
// the exercise's history and how each set felt. Pure functions, so the same
// history always gives the same advice and every number can be explained.
//
// Effort is asked after each set (Easy / Good / Hard) and read as reps left
// in the tank (RIR). The aim of every working set is Good: about 2 reps left.

import { getExercise } from '@/lib/exercises';
import type { Effort, LoggedSet, PlannedExercise, WorkoutSession } from '@/types';

/** Reps left in the tank for each answer; a skipped answer counts as Good. */
export const RIR: Record<Effort, number> = { easy: 4, good: 2, hard: 0.5 };
const TARGET_RIR = 2;

/** One past session of an exercise: its done sets, in order. */
export interface PastSession {
  date: string;
  sets: LoggedSet[];
}

/** Done sets of an exercise per finished session, newest first. */
export function historyFor(exerciseId: string, sessions: WorkoutSession[], skipSessionId?: string): PastSession[] {
  return sessions
    .filter((s) => s.finishedAt && s.id !== skipSessionId)
    .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
    .map((s) => ({ date: s.date, sets: s.sets.filter((x) => x.done && x.exerciseId === exerciseId) }))
    .filter((p) => p.sets.length > 0);
}

/** Estimated one-rep max (Epley), counting the reps that were left in the tank. */
export function e1rm(kg: number, reps: number, effort?: Effort): number {
  return kg * (1 + (reps + RIR[effort ?? 'good']) / 30);
}

/** The weight that leaves about 2 reps in the tank for `reps` reps. */
function weightFor(oneRepMax: number, reps: number): number {
  return oneRepMax / (1 + (reps + TARGET_RIR) / 30);
}

/** Default weight jumps by equipment (machines and cables move by a plate of the stack). */
const STEP_BY_EQUIPMENT: Record<string, number> = {
  machine: 5,
  cable: 5,
  barbell: 2.5,
  'e-z curl bar': 2.5,
  dumbbell: 2,
  kettlebells: 4,
  'medicine ball': 1,
};

/** No load to add: progress is in reps, then in harder variations. */
export function isBodyweight(exerciseId: string): boolean {
  const eq = getExercise(exerciseId)?.equipment ?? null;
  return eq === null || eq === 'body only' || eq === 'bands' || eq === 'exercise ball' || eq === 'foam roll';
}

/**
 * The weight step of an exercise: the one set for it, else the smallest jump
 * between weights logged for it (25 then 30 means 5 kg), else the equipment's.
 */
export function weightStep(exerciseId: string, history: PastSession[], custom?: Record<string, number>): number {
  const set = custom?.[exerciseId];
  if (set && set > 0) return set;
  const weights = [...new Set(history.flatMap((p) => p.sets.map((s) => s.weightKg)).filter((w) => w > 0))].sort((a, b) => a - b);
  let learned = Infinity;
  for (let i = 1; i < weights.length; i++) learned = Math.min(learned, weights[i] - weights[i - 1]);
  if (learned >= 0.5 && learned <= 10) return round(learned, 0.25);
  return STEP_BY_EQUIPMENT[getExercise(exerciseId)?.equipment ?? ''] ?? 2.5;
}

function round(v: number, step: number) {
  return Math.round(v / step) * step;
}

/** Rounds to the machine's steps; never below one step. */
export function snap(kg: number, step: number, mode: 'down' | 'nearest' = 'nearest'): number {
  const n = mode === 'down' ? Math.floor(kg / step + 1e-6) : Math.round(kg / step);
  return Math.max(step, +(n * step).toFixed(2));
}

const daysBetween = (a: string, b: string) => Math.round((Date.parse(b + 'T12:00:00') - Date.parse(a + 'T12:00:00')) / 86400000);

export type TargetReason =
  /** Never done: set 1 is a test, the app fills the rest from it (bodyweight: just the range). */
  | { kind: 'first_time'; bodyweight: boolean }
  /** Every set reached the top of the range: heavier today. */
  | { kind: 'add_weight'; from: number; to: number; easy: boolean }
  /** Same weight, one more rep than last time. */
  | { kind: 'add_reps'; weightKg: number }
  /** It felt hard or fell short once: same weight, the bottom of the range. */
  | { kind: 'repeat'; weightKg: number }
  /** Short of the range twice at this weight: lighter, then build back. */
  | { kind: 'drop'; from: number; to: number }
  /** No progress for three sessions: a 10 % reset. */
  | { kind: 'deload'; from: number; to: number }
  /** Back after a break. */
  | { kind: 'comeback'; days: number; from: number; to: number }
  /** Bodyweight: more reps (or seconds) than last time. */
  | { kind: 'more_reps' }
  /** Bodyweight at the top of the range: time for a harder variation. */
  | { kind: 'top_reached' };

export interface Target {
  /** 0 for bodyweight, or when the first set has to find it. */
  weightKg: number;
  /** Target reps (or seconds) for each set. */
  reps: number[];
  step: number;
  reason: TargetReason;
  /** The sets of the last session, for "last time" lines. */
  last?: PastSession;
}

const clampReps = (r: number, pe: Pick<PlannedExercise, 'repsMin' | 'repsMax'>) => Math.min(pe.repsMax, Math.max(pe.repsMin, r));

/** Today's weight and reps for each set of an exercise. */
export function targetFor(
  pe: Pick<PlannedExercise, 'exerciseId' | 'sets' | 'repsMin' | 'repsMax' | 'timed'>,
  count: number,
  history: PastSession[],
  opts: { today: string; steps?: Record<string, number> },
): Target {
  const step = weightStep(pe.exerciseId, history, opts.steps);
  const flat = (r: number) => Array.from({ length: count }, () => r);
  const last = history[0];
  if (!last) return { weightKg: 0, reps: flat(pe.repsMin), step, reason: { kind: 'first_time', bodyweight: !!pe.timed || isBodyweight(pe.exerciseId) } };

  // Working sets: the heaviest weight of the session (lighter ones were warm-ups or drops).
  const top = Math.max(...last.sets.map((s) => s.weightKg));
  const work = last.sets.filter((s) => s.weightKg === top);
  const reached = work.length >= Math.min(pe.sets, count) && work.every((s) => s.reps >= pe.repsMax);
  const hard = work.some((s) => s.effort === 'hard');
  const easy = work.every((s) => s.effort === 'easy');
  const short = work.some((s) => s.reps < pe.repsMin);
  const perSet = (bump: number) =>
    Array.from({ length: count }, (_, i) => clampReps((work[i] ?? work[work.length - 1]).reps + bump, pe));

  // Bodyweight, or holds and cardio in seconds: progress is in reps (or seconds).
  if (top === 0 || pe.timed) {
    if (reached && !hard) return { weightKg: top, reps: flat(pe.repsMax), step, reason: { kind: 'top_reached' }, last };
    return { weightKg: top, reps: perSet(pe.timed ? 5 : 1), step, reason: { kind: 'more_reps' }, last };
  }

  const gap = daysBetween(last.date, opts.today);
  if (gap > 15) {
    const to = snap(top * (gap > 30 ? 0.8 : 0.9), step, 'down');
    return { weightKg: Math.min(to, top), reps: flat(pe.repsMin), step, reason: { kind: 'comeback', days: gap, from: top, to }, last };
  }

  if (reached && !hard) {
    // All easy: the estimate decides, up to two steps and never more than +10 %.
    const best = Math.max(...work.map((s) => e1rm(s.weightKg, s.reps, s.effort)));
    const jumps = easy ? Math.min(2, Math.max(1, Math.floor((weightFor(best, pe.repsMin) - top) / step))) : 1;
    const to = Math.min(top + jumps * step, Math.max(top + step, snap(top * 1.1, step, 'down')));
    return { weightKg: to, reps: flat(pe.repsMin), step, reason: { kind: 'add_weight', from: top, to, easy: jumps > 1 }, last };
  }

  if (short || hard) {
    const before = history[1];
    const strugglingBefore =
      before &&
      Math.max(...before.sets.map((s) => s.weightKg)) === top &&
      before.sets.filter((s) => s.weightKg === top).some((s) => s.reps < pe.repsMin || s.effort === 'hard');
    if (strugglingBefore) {
      const to = Math.min(snap(top * 0.9, step, 'down'), Math.max(step, top - step));
      return { weightKg: to, reps: flat(pe.repsMin), step, reason: { kind: 'drop', from: top, to }, last };
    }
    return { weightKg: top, reps: flat(pe.repsMin), step, reason: { kind: 'repeat', weightKg: top }, last };
  }

  // Three sessions at this weight without more total reps: reset 10 % and climb again.
  const sameWeight = history.slice(0, 3).filter((p) => Math.max(...p.sets.map((s) => s.weightKg)) === top);
  if (sameWeight.length === 3) {
    const total = (p: PastSession) => p.sets.filter((s) => s.weightKg === top).reduce((sum, s) => sum + s.reps, 0);
    if (total(sameWeight[0]) <= total(sameWeight[2])) {
      const to = Math.min(snap(top * 0.9, step, 'down'), Math.max(step, top - step));
      return { weightKg: to, reps: flat(pe.repsMin), step, reason: { kind: 'deload', from: top, to }, last };
    }
  }

  return { weightKg: top, reps: perSet(1), step, reason: { kind: 'add_reps', weightKg: top }, last };
}

export type Adjustment =
  /** First time: set 1 found the working weight. */
  | { kind: 'calibrated'; weightKg: number; reps: number }
  | { kind: 'easier'; weightKg: number }
  | { kind: 'harder'; weightKg: number }
  /** Bodyweight set that felt easy: more reps on the next sets. */
  | { kind: 'more_reps'; reps: number };

/**
 * What the sets still to come should change to after a rated set, or null.
 * `firstTime`: the exercise has no history, so this set calibrates the rest.
 */
export function afterRatedSet(
  pe: Pick<PlannedExercise, 'repsMin' | 'repsMax' | 'timed'>,
  set: LoggedSet,
  targetReps: number,
  step: number,
  firstTime: boolean,
): Adjustment | null {
  if (!set.effort || pe.timed) return null;
  if (set.weightKg === 0) {
    if (set.effort === 'easy' && set.reps >= targetReps && set.reps < pe.repsMax) {
      return { kind: 'more_reps', reps: Math.min(pe.repsMax, set.reps + 2) };
    }
    return null;
  }
  if (firstTime) {
    // The test set was meant to be light (a weight for ~15 reps), so Easy there means more left than usual.
    const left = set.effort === 'easy' ? 6 : RIR[set.effort];
    let kg = snap(weightFor(set.weightKg * (1 + (set.reps + left) / 30), pe.repsMin), step, 'down');
    // Easy always goes up at least a step; Hard short of the range at least a step down.
    if (set.effort === 'easy') kg = Math.max(kg, set.weightKg + step);
    if (set.effort === 'hard' && set.reps < pe.repsMin) kg = Math.min(kg, Math.max(step, set.weightKg - step));
    if (Math.abs(kg - set.weightKg) < step / 2) return null;
    return { kind: 'calibrated', weightKg: kg, reps: pe.repsMin };
  }
  if (set.effort === 'easy' && set.reps >= targetReps) return { kind: 'harder', weightKg: set.weightKg + step };
  if (set.effort === 'hard' && set.reps < pe.repsMin && set.weightKg - step > 0) {
    return { kind: 'easier', weightKg: +(set.weightKg - step).toFixed(2) };
  }
  return null;
}
