// Activity history: what happened on each day (weight sessions and cardio),
// month grids for the calendar, month totals, and the best lift per exercise
// in a month against everything before it.

import type { CardioSession, LoggedSet, WorkoutSession } from '@/types';
import { addDays } from '@/lib/nutritionMath';
import { sessionMinutes } from '@/lib/cardio';

/** A weight session counts once at least one set was ticked (finished or not). */
export const isWorkout = (s: WorkoutSession) => s.sets.some((x) => x.done);

/** Minutes between start and finish, capped so a session left open overnight can't inflate totals. */
export function workoutMinutes(s: WorkoutSession) {
  if (!s.finishedAt) return 0;
  const m = Math.round((Date.parse(s.finishedAt) - Date.parse(s.startedAt)) / 60000);
  return Math.min(Math.max(m, 1), 180);
}

export const workoutVolume = (s: WorkoutSession) =>
  s.sets.filter((x) => x.done).reduce((sum, x) => sum + x.weightKg * x.reps, 0);

export interface DayActivity {
  workouts: WorkoutSession[];
  cardio: CardioSession[];
  minutes: number;
}

/** Everything per date ("YYYY-MM-DD"). */
export function activityByDay(sessions: WorkoutSession[], cardio: CardioSession[]) {
  const map = new Map<string, DayActivity>();
  const day = (date: string) => {
    let d = map.get(date);
    if (!d) map.set(date, (d = { workouts: [], cardio: [], minutes: 0 }));
    return d;
  };
  for (const s of sessions) {
    if (!isWorkout(s)) continue;
    const d = day(s.date);
    d.workouts.push(s);
    d.minutes += workoutMinutes(s);
  }
  for (const c of cardio) {
    const d = day(c.date);
    d.cardio.push(c);
    d.minutes += sessionMinutes(c);
  }
  for (const d of map.values()) {
    d.workouts.sort((a, b) => a.startedAt.localeCompare(b.startedAt));
    d.cardio.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }
  return map;
}

/** "2026-10" */
export const monthOf = (date: string) => date.slice(0, 7);

export function shiftMonth(month: string, delta: number) {
  const [y, m] = month.split('-').map(Number);
  const d = new Date(Date.UTC(y, m - 1 + delta, 1));
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

/** The month as weeks of 7 dates (Monday first); days of other months are null. */
export function monthWeeks(month: string): (string | null)[][] {
  const first = `${month}-01`;
  const lead = (new Date(first + 'T12:00:00').getDay() + 6) % 7;
  const weeks: (string | null)[][] = [];
  let week: (string | null)[] = Array.from({ length: lead }, () => null);
  for (let d = first; monthOf(d) === month; d = addDays(d, 1)) {
    week.push(d);
    if (week.length === 7) {
      weeks.push(week);
      week = [];
    }
  }
  if (week.length) weeks.push([...week, ...Array.from({ length: 7 - week.length }, () => null)]);
  return weeks;
}

/** Monday..Sunday of the week containing `date`. */
export function weekDates(date: string) {
  const offset = (new Date(date + 'T12:00:00').getDay() + 6) % 7;
  const monday = addDays(date, -offset);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

export interface MonthStats {
  workouts: number;
  cardio: number;
  activeDays: number;
  minutes: number;
  volumeKg: number;
  distanceKm: number;
  cardioKcal: number;
  cardioMinutes: number;
}

export function monthStats(month: string, days: Map<string, DayActivity>): MonthStats {
  const out: MonthStats = { workouts: 0, cardio: 0, activeDays: 0, minutes: 0, volumeKg: 0, distanceKm: 0, cardioKcal: 0, cardioMinutes: 0 };
  for (const [date, d] of days) {
    if (monthOf(date) !== month) continue;
    if (d.workouts.length || d.cardio.length) out.activeDays++;
    out.workouts += d.workouts.length;
    out.cardio += d.cardio.length;
    out.minutes += d.minutes;
    for (const w of d.workouts) out.volumeKg += workoutVolume(w);
    for (const c of d.cardio) {
      out.distanceKm += c.distanceKm ?? 0;
      out.cardioKcal += c.kcal;
      out.cardioMinutes += sessionMinutes(c);
    }
  }
  out.volumeKg = Math.round(out.volumeKg);
  out.distanceKm = Math.round(out.distanceKm * 10) / 10;
  return out;
}

export interface LiftProgress {
  exerciseId: string;
  best: { weightKg: number; reps: number };
  /** Best before this month; undefined the first month an exercise appears. */
  before?: { weightKg: number; reps: number };
  lastDate: string;
}

const better = (a: LoggedSet, b?: { weightKg: number; reps: number }) =>
  !b || a.weightKg > b.weightKg || (a.weightKg === b.weightKg && a.reps > b.reps);

/** Best set per exercise in `month`, with the best set from all earlier months. */
export function liftProgress(month: string, sessions: WorkoutSession[]): LiftProgress[] {
  const now = new Map<string, LiftProgress>();
  const before = new Map<string, { weightKg: number; reps: number }>();
  for (const s of sessions) {
    const m = monthOf(s.date);
    if (m > month) continue;
    for (const set of s.sets) {
      if (!set.done) continue;
      if (m < month) {
        if (better(set, before.get(set.exerciseId))) before.set(set.exerciseId, { weightKg: set.weightKg, reps: set.reps });
        continue;
      }
      const cur = now.get(set.exerciseId);
      if (!cur) {
        now.set(set.exerciseId, { exerciseId: set.exerciseId, best: { weightKg: set.weightKg, reps: set.reps }, lastDate: s.date });
      } else {
        if (better(set, cur.best)) cur.best = { weightKg: set.weightKg, reps: set.reps };
        if (s.date > cur.lastDate) cur.lastDate = s.date;
      }
    }
  }
  return [...now.values()]
    .map((p) => ({ ...p, before: before.get(p.exerciseId) }))
    .sort((a, b) => b.lastDate.localeCompare(a.lastDate));
}
