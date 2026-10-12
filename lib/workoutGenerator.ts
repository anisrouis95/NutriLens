// Builds a weekly training plan from the questionnaire answers. Deterministic
// on purpose: the same answers always give the same plan, and every choice
// can be explained (see splitWhy and app/(tabs)/train.tsx).

import type {
  LocalizedText,
  PlannedExercise,
  Profile,
  WorkoutDay,
  WorkoutPlan,
  WorkoutSession,
} from '@/types';
import {
  MovementSlot,
  exerciseExtras,
  slotCandidates,
} from '@/data/exerciseCuration';
import { getExercise } from '@/lib/exercises';
import { newId } from '@/lib/storage';

const COMPOUND_SLOTS = new Set<MovementSlot>([
  'squat',
  'hinge',
  'lunge',
  'glute_bridge',
  'horizontal_push',
  'incline_push',
  'vertical_push',
  'horizontal_pull',
  'vertical_pull',
]);

const CORE_SLOTS = new Set<MovementSlot>([
  'core_anti_extension',
  'core_flexion',
  'core_rotation',
]);

interface DayTemplate {
  key: string;
  name: LocalizedText;
  slots: MovementSlot[]; // priority order; trimmed to fit the session length
}

const T = {
  fullA: {
    key: 'full_a',
    name: { en: 'Full Body A', fr: 'Full Body A' },
    slots: ['squat', 'horizontal_push', 'horizontal_pull', 'hinge', 'lateral_raise', 'biceps', 'core_anti_extension', 'calves'],
  },
  fullB: {
    key: 'full_b',
    name: { en: 'Full Body B', fr: 'Full Body B' },
    slots: ['hinge', 'vertical_pull', 'incline_push', 'lunge', 'triceps', 'rear_delt', 'core_flexion', 'hamstring_curl'],
  },
  fullC: {
    key: 'full_c',
    name: { en: 'Full Body C', fr: 'Full Body C' },
    slots: ['lunge', 'horizontal_push', 'vertical_pull', 'glute_bridge', 'lateral_raise', 'biceps', 'core_rotation', 'quad_iso'],
  },
  upperA: {
    key: 'upper_a',
    name: { en: 'Upper Body A', fr: 'Haut du corps A' },
    slots: ['horizontal_push', 'horizontal_pull', 'vertical_push', 'vertical_pull', 'lateral_raise', 'biceps', 'triceps', 'rear_delt'],
  },
  upperB: {
    key: 'upper_b',
    name: { en: 'Upper Body B', fr: 'Haut du corps B' },
    slots: ['incline_push', 'vertical_pull', 'horizontal_pull', 'chest_fly', 'lateral_raise', 'triceps', 'biceps', 'rear_delt'],
  },
  lowerA: {
    key: 'lower_a',
    name: { en: 'Lower Body A', fr: 'Bas du corps A' },
    slots: ['squat', 'hinge', 'lunge', 'quad_iso', 'hamstring_curl', 'calves', 'core_anti_extension'],
  },
  lowerB: {
    key: 'lower_b',
    name: { en: 'Lower Body B', fr: 'Bas du corps B' },
    slots: ['hinge', 'squat', 'glute_bridge', 'hamstring_curl', 'quad_iso', 'calves', 'core_flexion'],
  },
  push: {
    key: 'push',
    name: { en: 'Push (chest, shoulders, triceps)', fr: 'Poussée (pecs, épaules, triceps)' },
    slots: ['horizontal_push', 'vertical_push', 'incline_push', 'chest_fly', 'lateral_raise', 'triceps', 'core_anti_extension'],
  },
  pull: {
    key: 'pull',
    name: { en: 'Pull (back, biceps)', fr: 'Tirage (dos, biceps)' },
    slots: ['vertical_pull', 'horizontal_pull', 'rear_delt', 'biceps', 'hamstring_curl', 'core_rotation'],
  },
  legs: {
    key: 'legs',
    name: { en: 'Legs', fr: 'Jambes' },
    slots: ['squat', 'hinge', 'lunge', 'quad_iso', 'hamstring_curl', 'calves', 'core_flexion'],
  },
} satisfies Record<string, DayTemplate>;

interface SplitDef {
  id: string;
  name: LocalizedText;
  why: LocalizedText;
  days: DayTemplate[];
}

function chooseSplit(profile: Profile): SplitDef {
  const days = Math.min(Math.max(profile.trainingDays, 1), 6);
  const novice = profile.experience === 'none' || profile.experience === 'beginner';

  if (days <= 2) {
    return {
      id: 'full_2',
      name: { en: 'Full body, 2×/week', fr: 'Full body, 2×/semaine' },
      why: {
        en: 'With two sessions, training the whole body each time is the only way to hit every muscle twice a week — the frequency that builds muscle fastest.',
        fr: 'Avec deux séances, travailler tout le corps à chaque fois est le seul moyen de solliciter chaque muscle deux fois par semaine — la fréquence la plus efficace.',
      },
      days: [T.fullA, T.fullB].slice(0, days),
    };
  }
  if (days === 3 && novice) {
    return {
      id: 'full_3',
      name: { en: 'Full body, 3×/week', fr: 'Full body, 3×/semaine' },
      why: {
        en: 'For beginners, practising the main movements three times a week makes you learn the technique faster and get stronger every session. Leave a rest day between sessions.',
        fr: 'Pour un débutant, répéter les mouvements de base trois fois par semaine accélère l’apprentissage de la technique et la progression. Laisse un jour de repos entre les séances.',
      },
      days: [T.fullA, T.fullB, T.fullC],
    };
  }
  if (days === 3) {
    return {
      id: 'ul_full_3',
      name: { en: 'Upper / Lower / Full body', fr: 'Haut / Bas / Full body' },
      why: {
        en: 'Three sessions with more exercises per area than full body, while still hitting every muscle about twice a week.',
        fr: 'Trois séances avec plus d’exercices par zone qu’un full body, tout en touchant chaque muscle environ deux fois par semaine.',
      },
      days: [T.upperA, T.lowerA, T.fullC],
    };
  }
  if (days === 4) {
    return {
      id: 'ul_4',
      name: { en: 'Upper / Lower, 4×/week', fr: 'Haut / Bas, 4×/semaine' },
      why: {
        en: 'The classic 4-day split: each muscle is trained twice a week with enough exercises and recovery. Example week: Mon upper, Tue lower, Thu upper, Fri lower.',
        fr: 'Le grand classique sur 4 jours : chaque muscle deux fois par semaine, avec assez d’exercices et de récupération. Exemple : lun haut, mar bas, jeu haut, ven bas.',
      },
      days: [T.upperA, T.lowerA, T.upperB, T.lowerB],
    };
  }
  if (days === 5) {
    return {
      id: 'ulppl_5',
      name: { en: 'Upper / Lower / Push / Pull / Legs', fr: 'Haut / Bas / Poussée / Tirage / Jambes' },
      why: {
        en: 'Five sessions that still hit each muscle about twice a week. Only worth it if you can recover — sleep and protein matter even more here.',
        fr: 'Cinq séances qui touchent chaque muscle environ deux fois par semaine. Ça ne vaut le coup que si tu récupères bien — sommeil et protéines encore plus importants.',
      },
      days: [T.upperA, T.lowerA, T.push, T.pull, T.legs],
    };
  }
  return {
    id: 'ppl_6',
    name: { en: 'Push / Pull / Legs ×2', fr: 'Poussée / Tirage / Jambes ×2' },
    why: {
      en: 'Six days of training, each muscle twice a week. High volume — if you feel run down, drop to four days; results will barely change.',
      fr: 'Six jours d’entraînement, chaque muscle deux fois par semaine. Gros volume — si tu te sens épuisé, passe à quatre jours ; les résultats changeront à peine.',
    },
    days: [T.push, T.pull, T.legs, { ...T.push, key: 'push_b' }, { ...T.pull, key: 'pull_b' }, { ...T.legs, key: 'legs_b' }],
  };
}

function availableCandidates(slot: MovementSlot, profile: Profile): string[] {
  const list = slotCandidates[slot]?.[profile.equipment] ?? [];
  return list.filter((id) => {
    if (!getExercise(id)) return false;
    const avoid = exerciseExtras[id]?.avoidIf ?? [];
    return !avoid.some((l) => profile.limitations.includes(l));
  });
}

function prescription(
  slot: MovementSlot,
  exerciseId: string,
  profile: Profile,
): Pick<PlannedExercise, 'sets' | 'repsMin' | 'repsMax' | 'restSec' | 'timed'> {
  const extra = exerciseExtras[exerciseId];
  const compound = COMPOUND_SLOTS.has(slot);
  const novice = profile.experience === 'none';

  if (extra?.timed) {
    const [lo, hi] = extra.repRange ?? [30, 60];
    // Long efforts (cardio machines, walks) are one continuous bout.
    const long = lo >= 120;
    return {
      sets: long ? 1 : novice ? 2 : 3,
      repsMin: novice && !long ? Math.max(10, Math.round(lo * 0.7)) : lo,
      repsMax: hi,
      timed: true,
      restSec: long ? 0 : 60,
    };
  }
  if (profile.goal === 'strength' && compound) {
    return { sets: novice ? 3 : 4, repsMin: 4, repsMax: 6, restSec: 180 };
  }
  if (compound) {
    const [lo, hi] = extra?.repRange ?? [6, 10];
    return { sets: 3, repsMin: lo, repsMax: hi, restSec: 120 };
  }
  const [lo, hi] = extra?.repRange ?? (CORE_SLOTS.has(slot) ? [10, 15] : [10, 15]);
  return { sets: novice ? 2 : 3, repsMin: lo, repsMax: hi, restSec: 75 };
}

/** Rough minutes an exercise takes: work + rest per set, plus setup. */
function minutesFor(p: Pick<PlannedExercise, 'sets' | 'restSec'>) {
  return (p.sets * (45 + p.restSec) + 90) / 60;
}

export function generateWorkoutPlan(profile: Profile): WorkoutPlan {
  const split = chooseSplit(profile);
  const novice = profile.experience === 'none' || profile.experience === 'beginner';
  const budget = Math.max(profile.sessionMinutes - 8, 15); // ~8 min warm-up
  const slotUse = new Map<MovementSlot, number>();

  const days: WorkoutDay[] = split.days.map((tpl) => {
    const used = new Set<string>();
    const exercises: PlannedExercise[] = [];
    let minutes = 0;

    for (const slot of tpl.slots) {
      const candidates = availableCandidates(slot, profile).filter((id) => !used.has(id));
      if (!candidates.length) continue;

      // Beginners repeat the same big lifts to learn them; everything else rotates.
      const occurrence = slotUse.get(slot) ?? 0;
      const index =
        novice && COMPOUND_SLOTS.has(slot) ? 0 : occurrence % candidates.length;
      const exerciseId = candidates[index];
      const rx = prescription(slot, exerciseId, profile);

      const cost = minutesFor(rx);
      // Always keep at least 3 exercises; then stop when the time budget is used.
      if (exercises.length >= 3 && minutes + cost > budget) break;

      minutes += cost;
      used.add(exerciseId);
      slotUse.set(slot, occurrence + 1);
      exercises.push({
        exerciseId,
        slot,
        ...rx,
        alternatives: candidates.filter((id) => id !== exerciseId).slice(0, 3),
      });
    }

    const focus = new Set<string>();
    for (const e of exercises) {
      for (const m of getExercise(e.exerciseId)?.primaryMuscles ?? []) focus.add(m);
    }
    return { id: tpl.key, name: tpl.name, focus: [...focus], exercises };
  });

  return {
    id: newId(),
    createdAt: new Date().toISOString(),
    splitId: split.id,
    splitName: split.name,
    splitWhy: split.why,
    daysPerWeek: split.days.length,
    days,
    cardio: cardioAdvice(profile),
  };
}

function cardioAdvice(profile: Profile): LocalizedText {
  if (profile.goal === 'lose_fat') {
    return {
      en: 'Your main "cardio" is daily steps — they burn more over a week than most gym cardio. Add 1–2 easy 20–30 min sessions (brisk walk, bike, swim) if you enjoy them. Keep cardio away from right before leg days.',
      fr: 'Ton principal « cardio », ce sont les pas quotidiens — ils brûlent plus sur la semaine que la plupart des séances de cardio. Ajoute 1 à 2 séances faciles de 20–30 min (marche rapide, vélo, natation) si tu aimes. Évite le cardio juste avant les jours jambes.',
    };
  }
  if (profile.goal === 'build_muscle' || profile.goal === 'strength') {
    return {
      en: 'Keep 2 easy cardio sessions of 20 min a week for heart health; it will not hurt your muscle gains if it stays easy. Keep walking daily.',
      fr: 'Garde 2 séances de cardio faciles de 20 min par semaine pour la santé du cœur ; ça ne freinera pas la prise de muscle si ça reste facile. Continue à marcher chaque jour.',
    };
  }
  return {
    en: 'Aim for 150 minutes of moderate activity a week (e.g. 5 × 30 min brisk walks) on top of your strength sessions.',
    fr: 'Vise 150 minutes d’activité modérée par semaine (par ex. 5 × 30 min de marche rapide) en plus de tes séances de musculation.',
  };
}

/**
 * Double progression: once every set reaches the top of the rep range,
 * suggest adding weight; otherwise aim for one more rep.
 */
export function progressionHint(
  planned: PlannedExercise,
  lastSets: { reps: number; weightKg: number }[],
): { kind: 'add_weight' | 'add_reps' | 'first_time'; weightKg?: number } {
  if (!lastSets.length) return { kind: 'first_time' };
  const allTop = lastSets.length >= planned.sets && lastSets.every((s) => s.reps >= planned.repsMax);
  const heaviest = Math.max(...lastSets.map((s) => s.weightKg));
  if (allTop && !planned.timed) {
    const step = heaviest >= 40 ? 2.5 : heaviest > 0 ? 1 : 0;
    return { kind: 'add_weight', weightKg: heaviest + step };
  }
  return { kind: 'add_reps', weightKg: heaviest };
}

/**
 * The session to do next: the plan's days rotate in order (A, B, C, A…),
 * continuing after the last finished session, whatever the week.
 */
export function nextWorkoutDay(plan: WorkoutPlan | null | undefined, sessions: WorkoutSession[]): WorkoutDay | undefined {
  if (!plan?.days.length) return undefined;
  const last = sessions
    .filter((s) => s.finishedAt && plan.days.some((d) => d.id === s.dayId))
    .sort((a, b) => a.startedAt.localeCompare(b.startedAt))
    .pop();
  if (!last) return plan.days[0];
  const idx = plan.days.findIndex((d) => d.id === last.dayId);
  return plan.days[(idx + 1) % plan.days.length];
}
