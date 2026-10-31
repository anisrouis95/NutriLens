// Exercise swaps: what can replace an exercise, worked out live from the
// curated lists so it always respects today's answers (equipment and painful
// joints), even for a program built before those answers changed.
//
// Two kinds of replacement, best first:
//   same movement: the same slot of the program (a lunge for a lunge)
//   same muscles:  another curated exercise for the same main muscles
//                  (a hip thrust for a step-up when the knees hurt)

import { exerciseExtras, slotCandidates, type MovementSlot } from '@/data/exerciseCuration';
import { getExercise } from '@/lib/exercises';
import type { LocalizedText } from '@/lib/i18n';
import type { Limitation, Profile } from '@/types';

export const LIMITATION_NAMES: Record<Limitation, LocalizedText> = {
  knees: { en: 'Knees', fr: 'Genoux', tn: 'الركايب', tnLatn: 'Rkayeb' },
  lower_back: { en: 'Lower back', fr: 'Bas du dos', tn: 'لوطة الظهر', tnLatn: 'Bas du dos' },
  shoulders: { en: 'Shoulders', fr: 'Épaules', tn: 'الكتاف', tnLatn: 'Ktef' },
  wrists: { en: 'Wrists', fr: 'Poignets', tn: 'المعاصم', tnLatn: 'Poignets' },
};

export interface SwapOption {
  id: string;
  reason: 'same_move' | 'same_muscles';
  /** Main muscles it shares with the exercise being replaced. */
  shared: string[];
}

export interface SwapOptions {
  options: SwapOption[];
  /** Replacements left out because they load a painful joint. */
  hiddenByLimits: number;
  /** The painful joints the current exercise loads (an old program can still hold one). */
  currentConflicts: Limitation[];
}

const MAX_SAME_MUSCLES = 6;

/** The user's painful joints that an exercise loads. */
export function conflicts(id: string, profile: Pick<Profile, 'limitations'>): Limitation[] {
  const avoid = exerciseExtras[id]?.avoidIf ?? [];
  return avoid.filter((l) => profile.limitations.includes(l));
}

const isSlot = (slot: string): slot is MovementSlot => slot in slotCandidates;

/**
 * Replacements for `currentId` in program slot `slot`. `exclude` holds the
 * exercises already in the same session, so a swap never doubles one up.
 */
export function swapOptions(
  currentId: string,
  slot: string,
  profile: Pick<Profile, 'equipment' | 'limitations'>,
  exclude: string[] = [],
): SwapOptions {
  const current = getExercise(currentId);
  const skip = new Set([currentId, ...exclude]);
  let hiddenByLimits = 0;
  const usable = (id: string) => {
    if (skip.has(id) || !getExercise(id)) return false;
    if (conflicts(id, profile).length) {
      hiddenByLimits++;
      return false;
    }
    return true;
  };

  const primary = new Set<string>(current?.primaryMuscles ?? []);
  const sharedWith = (id: string) => (getExercise(id)?.primaryMuscles ?? []).filter((m) => primary.has(m));

  const sameMove = isSlot(slot) ? [...new Set(slotCandidates[slot][profile.equipment])].filter(usable) : [];
  sameMove.forEach((id) => skip.add(id));

  // Every curated exercise for this equipment, ranked by muscles in common, then easiest first.
  // Cardio and strength never stand in for each other (a treadmill walk "works the quads" too).
  const cardio = slot === 'conditioning';
  const pool = [
    ...new Set(
      (Object.entries(slotCandidates) as [MovementSlot, (typeof slotCandidates)[MovementSlot]][])
        .filter(([s]) => (s === 'conditioning') === cardio)
        .flatMap(([, byEquipment]) => byEquipment[profile.equipment]),
    ),
  ];
  const sameMuscles = pool
    .filter((id) => !skip.has(id) && sharedWith(id).length > 0)
    .filter(usable)
    .sort(
      (a, b) =>
        sharedWith(b).length - sharedWith(a).length ||
        (exerciseExtras[a]?.difficulty ?? 2) - (exerciseExtras[b]?.difficulty ?? 2),
    )
    .slice(0, MAX_SAME_MUSCLES);

  return {
    options: [
      ...sameMove.map((id) => ({ id, reason: 'same_move' as const, shared: sharedWith(id) })),
      ...sameMuscles.map((id) => ({ id, reason: 'same_muscles' as const, shared: sharedWith(id) })),
    ],
    hiddenByLimits,
    currentConflicts: conflicts(currentId, profile),
  };
}
