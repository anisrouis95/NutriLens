// Calisthenics ladders: each bodyweight movement as steps from easiest to
// hardest. Progress means moving up a step when every set reaches the top of
// its range and none felt Hard (checked when a workout is saved).
//
// The program keeps its slots; a training style decides which slots become a
// ladder (`applyStyle`, once, when the style or the program changes), and the
// current step of each ladder fills those slots when the program is read
// (`withLadderSteps`), so one level-up updates every session at once.

import type { LocalizedText } from '@/lib/i18n';
import type { MovementSlot } from '@/data/exerciseCuration';
import { availableCandidates, prescription } from '@/lib/workoutGenerator';
import type { Limitation, PlannedExercise, Profile, TrainingStyle, WorkoutPlan } from '@/types';

export type LadderId = 'push' | 'row' | 'pull' | 'dip' | 'core' | 'legs';

export interface LadderStep {
  id: string;
  reps: [number, number];
  /** Reps are seconds (holds). */
  timed?: boolean;
  avoidIf?: Limitation[];
}

export interface Ladder {
  id: LadderId;
  name: LocalizedText;
  steps: LadderStep[];
}

export const LADDERS: Record<LadderId, Ladder> = {
  push: {
    id: 'push',
    name: { en: 'Push-ups', fr: 'Pompes', tn: 'البومب', tnLatn: 'Pompes' },
    steps: [
      { id: 'TF_Wall_Push-Up', reps: [10, 20] },
      { id: 'Incline_Push-Up', reps: [8, 15] },
      { id: 'Pushups', reps: [6, 12] },
      { id: 'Push-Ups_With_Feet_Elevated', reps: [6, 12] },
      { id: 'Push-Ups_-_Close_Triceps_Position', reps: [6, 12] },
      { id: 'Single-Arm_Push-Up', reps: [3, 8] },
    ],
  },
  row: {
    id: 'row',
    name: { en: 'Rows', fr: 'Tirages horizontaux', tn: 'الجبد الأفقي', tnLatn: 'Rowing' },
    steps: [
      { id: 'Suspended_Row', reps: [8, 15] },
      { id: 'Inverted_Row', reps: [6, 12] },
      { id: 'Inverted_Row_with_Straps', reps: [10, 15] },
    ],
  },
  pull: {
    id: 'pull',
    name: { en: 'Pull-ups', fr: 'Tractions', tn: 'التراكسيون', tnLatn: 'Tractions' },
    steps: [
      { id: 'TF_Dead_Hang', reps: [15, 45], timed: true },
      { id: 'Scapular_Pull-Up', reps: [6, 12] },
      { id: 'TF_Negative_Pull-Up', reps: [3, 6] },
      { id: 'Band_Assisted_Pull-Up', reps: [5, 10] },
      { id: 'Chin-Up', reps: [3, 8] },
      { id: 'Pullups', reps: [3, 10] },
    ],
  },
  dip: {
    id: 'dip',
    name: { en: 'Dips', fr: 'Dips', tn: 'الديبس', tnLatn: 'Dips' },
    steps: [
      { id: 'TF_Bar_Support_Hold', reps: [10, 30], timed: true, avoidIf: ['shoulders'] },
      { id: 'TF_Negative_Dip', reps: [3, 6], avoidIf: ['shoulders'] },
      { id: 'Dips_-_Triceps_Version', reps: [5, 10], avoidIf: ['shoulders'] },
      { id: 'Ring_Dips', reps: [3, 8], avoidIf: ['shoulders'] },
    ],
  },
  core: {
    id: 'core',
    name: { en: 'Core', fr: 'Gainage', tn: 'الكرش', tnLatn: 'Gainage' },
    steps: [
      { id: 'Dead_Bug', reps: [8, 12] },
      { id: 'Plank', reps: [20, 45], timed: true },
      { id: 'TF_Hollow_Hold', reps: [15, 40], timed: true },
      { id: 'Knee_Hip_Raise_On_Parallel_Bars', reps: [8, 15] },
      { id: 'Hanging_Leg_Raise', reps: [5, 12] },
    ],
  },
  legs: {
    id: 'legs',
    name: { en: 'Legs', fr: 'Jambes', tn: 'الساقين', tnLatn: 'Jambes' },
    steps: [
      { id: 'Butt_Lift_Bridge', reps: [12, 20] },
      { id: 'Single_Leg_Glute_Bridge', reps: [8, 15] },
      { id: 'Bodyweight_Squat', reps: [10, 20], avoidIf: ['knees'] },
      { id: 'Split_Squats', reps: [8, 12], avoidIf: ['knees'] },
      { id: 'Bodyweight_Walking_Lunge', reps: [8, 12], avoidIf: ['knees'] },
    ],
  },
};

export const LADDER_ORDER: LadderId[] = ['push', 'row', 'pull', 'dip', 'core', 'legs'];

/** Which program slots become which ladder, per style. Legs stay on weights in Mixed. */
const SLOT_LADDER: Record<Exclude<TrainingStyle, 'weights'>, Partial<Record<MovementSlot, LadderId>>> = {
  mixed: {
    horizontal_push: 'push',
    incline_push: 'push',
    horizontal_pull: 'row',
    vertical_pull: 'pull',
    triceps: 'dip',
    core_anti_extension: 'core',
    core_flexion: 'core',
  },
  calisthenics: {
    horizontal_push: 'push',
    incline_push: 'push',
    vertical_push: 'push',
    horizontal_pull: 'row',
    vertical_pull: 'pull',
    triceps: 'dip',
    core_anti_extension: 'core',
    core_flexion: 'core',
    squat: 'legs',
    lunge: 'legs',
    glute_bridge: 'legs',
    hinge: 'legs',
  },
};

const isLadder = (id: string | undefined): id is LadderId => !!id && id in LADDERS;

const usable = (step: LadderStep, profile: Pick<Profile, 'limitations'>) => !step.avoidIf?.some((l) => profile.limitations.includes(l));

/** The step to train at `index`: the nearest usable one (lower first) when that step loads a painful joint. */
export function stepAt(ladderId: LadderId, index: number, profile: Pick<Profile, 'limitations'>): { index: number; step: LadderStep } | null {
  const steps = LADDERS[ladderId].steps;
  const from = Math.min(Math.max(0, index), steps.length - 1);
  for (let i = from; i >= 0; i--) if (usable(steps[i], profile)) return { index: i, step: steps[i] };
  for (let i = from + 1; i < steps.length; i++) if (usable(steps[i], profile)) return { index: i, step: steps[i] };
  return null;
}

/** The next usable step up, or null at the top. */
export function nextStep(ladderId: LadderId, index: number, profile: Pick<Profile, 'limitations'>) {
  const steps = LADDERS[ladderId].steps;
  for (let i = index + 1; i < steps.length; i++) if (usable(steps[i], profile)) return { index: i, step: steps[i] };
  return null;
}

export function previousStep(ladderId: LadderId, index: number, profile: Pick<Profile, 'limitations'>) {
  const steps = LADDERS[ladderId].steps;
  for (let i = index - 1; i >= 0; i--) if (usable(steps[i], profile)) return { index: i, step: steps[i] };
  return null;
}

function stepPrescription(step: LadderStep): Pick<PlannedExercise, 'sets' | 'repsMin' | 'repsMax' | 'restSec' | 'timed'> {
  return { sets: 3, repsMin: step.reps[0], repsMax: step.reps[1], timed: step.timed, restSec: step.timed ? 60 : 90 };
}

/**
 * Marks the slots the style turns into ladders (one per ladder and day), and
 * puts weights back on slots it no longer covers. Run when the style or the
 * program changes; a hand-made swap afterwards takes an exercise off its ladder.
 */
export function applyStyle(plan: WorkoutPlan, profile: Profile, style: TrainingStyle): WorkoutPlan {
  const map = style === 'weights' ? {} : SLOT_LADDER[style];
  return {
    ...plan,
    style,
    days: plan.days.map((day) => {
      const used = new Set<LadderId>();
      const ids = new Set(day.exercises.map((e) => e.exerciseId));
      const exercises = day.exercises.map((e) => {
        const ladder = map[e.slot as MovementSlot];
        if (ladder && !used.has(ladder)) {
          used.add(ladder);
          return { ...e, ladder };
        }
        if (!e.ladder) return e;
        const { ladder: _, ...rest } = e;
        // Leaving a ladder: the program's own exercise when it is still stored there,
        // else the slot's usual exercise for this equipment.
        if (!ladderStepOf(e.exerciseId)) return rest;
        const back = availableCandidates(e.slot as MovementSlot, profile).find((id) => !ids.has(id)) ?? e.exerciseId;
        ids.add(back);
        return { ...rest, exerciseId: back, ...prescription(e.slot as MovementSlot, back, profile) };
      });
      return { ...day, exercises };
    }),
  };
}

/** Fills every ladder slot with its current step. Returns the same plan when nothing changes. */
export function withLadderSteps(plan: WorkoutPlan, profile: Profile, steps: Record<string, number> | undefined): WorkoutPlan {
  let changed = false;
  const days = plan.days.map((day) => {
    let dayChanged = false;
    const exercises = day.exercises.map((e) => {
      if (!isLadder(e.ladder)) return e;
      const at = stepAt(e.ladder, steps?.[e.ladder] ?? 0, profile);
      if (!at) return e;
      const rx = stepPrescription(at.step);
      if (e.exerciseId === at.step.id && e.repsMin === rx.repsMin && e.repsMax === rx.repsMax && !!e.timed === !!rx.timed) return e;
      dayChanged = true;
      return { ...e, exerciseId: at.step.id, ...rx, alternatives: [] };
    });
    if (!dayChanged) return day;
    changed = true;
    return { ...day, exercises };
  });
  return changed ? { ...plan, days } : plan;
}

export interface TestAnswers {
  /** Push-ups on the floor in one go: 0, 1–5, 6–12, 13+ */
  push: 0 | 1 | 2 | 3;
  /** 0 = can't hang 30 s, 1 = hangs but no pull-up, 2 = 1–3 pull-ups, 3 = 4+ */
  pull: 0 | 1 | 2 | 3;
  /** 0 = can't hold on the bars, 1 = holds but no dip, 2 = 1–5 dips, 3 = 6+ */
  dip: 0 | 1 | 2 | 3;
  /** 0 = plank under 30 s, 1 = 30–60 s, 2 = over 60 s */
  core: 0 | 1 | 2;
}

/** Starting steps from the short test. Heavier bodies start pull-ups and dips a step lower. */
export function startingSteps(a: TestAnswers, profile: Pick<Profile, 'weightKg' | 'heightCm' | 'limitations'>): Record<LadderId, number> {
  const bmi = profile.weightKg / (profile.heightCm / 100) ** 2;
  const heavy = profile.weightKg >= 90 || bmi >= 30 ? 1 : 0;
  const pull = [0, 1, 3, 4][a.pull];
  return {
    push: a.push,
    row: a.pull === 0 ? 0 : a.pull === 3 ? 2 : 1,
    pull: Math.max(0, pull - heavy),
    dip: Math.max(0, a.dip - heavy),
    core: a.core,
    legs: profile.limitations.includes('knees') ? 0 : 2,
  };
}

/** The ladder an exercise is a step of, and which step. */
export function ladderStepOf(exerciseId: string): { ladder: LadderId; index: number } | null {
  for (const id of LADDER_ORDER) {
    const index = LADDERS[id].steps.findIndex((s) => s.id === exerciseId);
    if (index >= 0) return { ladder: id, index };
  }
  return null;
}

/**
 * Ladders to move up after a saved workout: every set of the step done, each
 * at the top of its range (reps or seconds), none rated Hard. One step per
 * ladder per workout.
 */
export function levelUps(
  done: { ladder?: string; sets: { reps: number; done: boolean; effort?: string }[]; repsMax: number }[],
  steps: Record<string, number> | undefined,
  profile: Pick<Profile, 'limitations'>,
): { ladder: LadderId; index: number; id: string }[] {
  const out: { ladder: LadderId; index: number; id: string }[] = [];
  for (const e of done) {
    if (!isLadder(e.ladder) || out.some((u) => u.ladder === e.ladder)) continue;
    const reached = e.sets.length > 0 && e.sets.every((s) => s.done && s.reps >= e.repsMax && s.effort !== 'hard');
    if (!reached) continue;
    const at = stepAt(e.ladder, steps?.[e.ladder] ?? 0, profile);
    const next = at && nextStep(e.ladder, at.index, profile);
    if (next) out.push({ ladder: e.ladder, index: next.index, id: next.step.id });
  }
  return out;
}
