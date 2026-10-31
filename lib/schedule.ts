// Training days: the usual week (Mon/Wed/Fri…), days trained only some weeks,
// and one-off changes for a date ("rest this Wednesday", "train this Sunday").
// The program itself keeps its order (A, B, C, A…) whatever the day, so moving
// or skipping a day never breaks it.

import { addDays } from '@/lib/nutritionMath';
import type { AppSettings, Profile, TrainingSchedule } from '@/types';

/** Usual days for a number of sessions a week, spread out with rest between (0 = Sunday). */
export function defaultWeekdays(perWeek: number): number[] {
  switch (Math.min(Math.max(Math.round(perWeek), 1), 6)) {
    case 1:
      return [3];
    case 2:
      return [1, 4];
    case 3:
      return [1, 3, 5];
    case 4:
      return [1, 2, 4, 5];
    case 5:
      return [1, 2, 3, 4, 5];
    default:
      return [1, 2, 3, 4, 5, 6];
  }
}

export function scheduleOf(settings: Pick<AppSettings, 'schedule'>, profile: Pick<Profile, 'trainingDays'> | null): TrainingSchedule {
  return settings.schedule ?? { weekdays: defaultWeekdays(profile?.trainingDays ?? 3), optional: [], overrides: {} };
}

export type DayKind = 'train' | 'optional' | 'rest';

const weekday = (date: string) => new Date(date + 'T12:00:00').getDay();

/** What a date is: a training day, a day trained some weeks, or a rest day. */
export function dayKind(schedule: TrainingSchedule, date: string): DayKind {
  const override = schedule.overrides[date];
  if (override) return override;
  const d = weekday(date);
  if (schedule.weekdays.includes(d)) return 'train';
  if (schedule.optional.includes(d)) return 'optional';
  return 'rest';
}

/** Makes `date` a training or rest day; back to the usual week when that matches it anyway. */
export function setDay(schedule: TrainingSchedule, date: string, kind: 'train' | 'rest', today: string): TrainingSchedule {
  const overrides = prune(schedule.overrides, today);
  const usual = schedule.weekdays.includes(weekday(date)) ? 'train' : 'rest';
  if (kind === usual) delete overrides[date];
  else overrides[date] = kind;
  return { ...schedule, overrides };
}

/** Back to the usual week for that date. */
export function resetDay(schedule: TrainingSchedule, date: string, today: string): TrainingSchedule {
  const overrides = prune(schedule.overrides, today);
  delete overrides[date];
  return { ...schedule, overrides };
}

/** One-off changes older than two weeks only clutter the backup. */
function prune(overrides: Record<string, 'train' | 'rest'>, today: string) {
  const from = addDays(today, -14);
  return Object.fromEntries(Object.entries(overrides).filter(([d]) => d >= from));
}

/** Monday-first order for day pickers. */
export const WEEK_ORDER = [1, 2, 3, 4, 5, 6, 0];

/** Training days planned in a week (its 7 dates), counting this week's changes. */
export function plannedCount(schedule: TrainingSchedule, dates: string[]): number {
  return dates.filter((d) => dayKind(schedule, d) === 'train').length;
}
