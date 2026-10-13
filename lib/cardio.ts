// Cardio: the machines the log knows, which fields each one asks for, and
// the estimates (distance, calories) shown before saving.
//
// Calories follow the ACSM metabolic equations when a speed is known
// (walking below 7 km/h, running from 7 km/h or on the run setting):
//   walking VO2 = 3.5 + 0.1·S + 1.8·S·G     running VO2 = 3.5 + 0.2·S + 0.9·S·G
// with S in m/min and G the incline as a fraction; kcal/min = VO2 · kg / 1000 · 5.
// Without a speed, a MET value per machine and effort (2011 Compendium of
// Physical Activities) gives kcal/min = MET · 3.5 · kg / 200. Both are gross
// estimates and the app labels them as such.

import type { CardioEffort, CardioMachine, CardioSegment, CardioSession, LocalizedText } from '@/types';

export interface MachineInfo {
  id: CardioMachine;
  name: LocalizedText;
  /** Speed in km/h. */
  speed: boolean;
  /** Treadmill incline in %. */
  incline: boolean;
  /** Machine level / resistance. */
  level: boolean;
  /** Effort picker (when there is no speed to estimate from). */
  effort: boolean;
}

export const MACHINES: MachineInfo[] = [
  { id: 'treadmill', name: { en: 'Treadmill', fr: 'Tapis de course', tn: 'تابي رولان', tnLatn: 'Tapis roulant' }, speed: true, incline: true, level: false, effort: false },
  { id: 'walk', name: { en: 'Walk outside', fr: 'Marche dehors', tn: 'مشي برّا', tnLatn: 'Mchi berra' }, speed: true, incline: false, level: false, effort: false },
  { id: 'run', name: { en: 'Run outside', fr: 'Course dehors', tn: 'جري برّا', tnLatn: 'Jri berra' }, speed: true, incline: false, level: false, effort: false },
  { id: 'bike', name: { en: 'Bike', fr: 'Vélo', tn: 'بيسكلات', tnLatn: 'Vélo' }, speed: false, incline: false, level: true, effort: true },
  { id: 'elliptical', name: { en: 'Elliptical', fr: 'Elliptique', tn: 'إليبتيك', tnLatn: 'Elliptique' }, speed: false, incline: false, level: true, effort: true },
  { id: 'rower', name: { en: 'Rower', fr: 'Rameur', tn: 'رامور', tnLatn: 'Rameur' }, speed: false, incline: false, level: true, effort: true },
  { id: 'stairs', name: { en: 'Stair climber', fr: 'Escalier', tn: 'دروج', tnLatn: 'Escalier' }, speed: false, incline: false, level: true, effort: true },
  { id: 'other', name: { en: 'Other', fr: 'Autre', tn: 'حاجة أخرى', tnLatn: '7aja o5ra' }, speed: false, incline: false, level: false, effort: true },
];

export const machineInfo = (id: CardioMachine) => MACHINES.find((m) => m.id === id) ?? MACHINES[MACHINES.length - 1];

export const EFFORTS: { id: CardioEffort; name: LocalizedText }[] = [
  { id: 'easy', name: { en: 'Easy', fr: 'Facile', tn: 'ساهل', tnLatn: 'Sahel' } },
  { id: 'moderate', name: { en: 'Moderate', fr: 'Moyen', tn: 'متوسّط', tnLatn: 'Moyen' } },
  { id: 'hard', name: { en: 'Hard', fr: 'Dur', tn: 'صعيب', tnLatn: 'S3ib' } },
];

/** MET values by machine and effort (Compendium of Physical Activities). */
const METS: Record<CardioMachine, Record<CardioEffort, number>> = {
  treadmill: { easy: 3.5, moderate: 5, hard: 8 },
  walk: { easy: 3, moderate: 3.5, hard: 4.3 },
  run: { easy: 7, moderate: 9, hard: 11 },
  bike: { easy: 4, moderate: 6.8, hard: 8.8 },
  elliptical: { easy: 4, moderate: 5, hard: 7 },
  rower: { easy: 4.8, moderate: 7, hard: 8.5 },
  stairs: { easy: 4, moderate: 6, hard: 9 },
  other: { easy: 3.5, moderate: 5, hard: 8 },
};

/** Gross calories for one part. */
export function segmentKcal(machine: CardioMachine, seg: CardioSegment, weightKg: number): number {
  const minutes = Math.max(0, seg.minutes || 0);
  if (!minutes || !weightKg) return 0;
  const info = machineInfo(machine);
  if (info.speed && seg.speedKmh && seg.speedKmh > 0) {
    const s = (seg.speedKmh * 1000) / 60; // m/min
    const g = info.incline ? Math.max(0, (seg.inclinePct ?? 0) / 100) : 0;
    const running = machine === 'run' || seg.speedKmh >= 7;
    const vo2 = running ? 3.5 + 0.2 * s + 0.9 * s * g : 3.5 + 0.1 * s + 1.8 * s * g;
    return ((vo2 * weightKg) / 1000) * 5 * minutes;
  }
  const met = METS[machine][seg.effort ?? 'moderate'];
  return ((met * 3.5 * weightKg) / 200) * minutes;
}

export function sessionKcal(machine: CardioMachine, segments: CardioSegment[], weightKg: number) {
  return Math.round(segments.reduce((sum, seg) => sum + segmentKcal(machine, seg, weightKg), 0));
}

/** Distance from the parts that have a speed, or undefined when none do. */
export function sessionDistanceKm(machine: CardioMachine, segments: CardioSegment[]) {
  if (!machineInfo(machine).speed) return undefined;
  const withSpeed = segments.filter((s) => s.speedKmh && s.minutes);
  if (!withSpeed.length) return undefined;
  return Math.round(withSpeed.reduce((sum, s) => sum + ((s.speedKmh ?? 0) * s.minutes) / 60, 0) * 100) / 100;
}

export const sessionMinutes = (c: Pick<CardioSession, 'segments'>) => c.segments.reduce((sum, s) => sum + (s.minutes || 0), 0);

/** "20 min · 5.5 km/h · 7%  then  5 min · 6 km/h · 0%" */
export function describeSegments(
  machine: CardioMachine,
  segments: CardioSegment[],
  L: (t: LocalizedText, params?: Record<string, string | number>) => string,
  fmt: (n: number, decimals?: number) => string,
) {
  const info = machineInfo(machine);
  const num = (n: number) => fmt(n, Number.isInteger(n) ? 0 : 1);
  return segments
    .filter((s) => s.minutes)
    .map((s) => {
      const parts = [`${num(s.minutes)} min`];
      if (info.speed && s.speedKmh) parts.push(`${num(s.speedKmh)} km/h`);
      if (info.incline && s.inclinePct !== undefined) parts.push(`${num(s.inclinePct)} %`);
      if (info.level && s.level) parts.push(L({ en: 'level {{n}}', fr: 'niveau {{n}}', tn: 'نيفو {{n}}', tnLatn: 'niveau {{n}}' }, { n: num(s.level) }));
      if (info.effort && !s.speedKmh && s.effort) parts.push(L(EFFORTS.find((e) => e.id === s.effort)!.name).toLowerCase());
      return parts.join(' · ');
    })
    .join(L({ en: '  then  ', fr: '  puis  ', tn: '  ومبعد  ', tnLatn: '  w ba3d  ' }));
}
