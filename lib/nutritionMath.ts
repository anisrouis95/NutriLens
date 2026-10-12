// The nutrition engine. Everything here is a pure function so the numbers the
// app shows can always be explained step by step (see app/plan.tsx and the
// Learn lessons, which reuse these exact values).

import type {
  FoodEntry,
  Goal,
  NutritionPlan,
  PlanWarning,
  Profile,
  WeightEntry,
} from '@/types';

/** Rough energy content of 1 kg of body-weight change (mostly fat tissue). */
export const KCAL_PER_KG = 7700;

const TEF_FRACTION = 0.1;
const CALORIE_FLOOR = { male: 1500, female: 1200 } as const;

/** Share of BMR burned by non-walking daily activity (standing, fidgeting, chores, work). */
const JOB_FACTOR = { desk: 0.05, standing: 0.18, physical: 0.35 } as const;

/** Weekly fat-loss rate as a fraction of body weight. */
const LOSS_RATE = { relaxed: 0.005, moderate: 0.0075, fast: 0.01 } as const;

const PROTEIN_PER_KG: Record<Goal, number> = {
  lose_fat: 2.0,
  recomp: 2.0,
  build_muscle: 1.8,
  strength: 1.8,
  maintain: 1.6,
  health: 1.6,
};

const round = (n: number, step = 1) => Math.round(n / step) * step;
const clamp = (n: number, min: number, max: number) =>
  Math.min(Math.max(n, min), max);

export function bmi(weightKg: number, heightCm: number): number {
  const m = heightCm / 100;
  return weightKg / (m * m);
}

/** Mifflin-St Jeor, or Katch-McArdle when a body-fat estimate is known. */
export function basalMetabolicRate(p: {
  sex: Profile['sex'];
  age: number;
  heightCm: number;
  weightKg: number;
  bodyFatPct?: number;
}): number {
  if (p.bodyFatPct && p.bodyFatPct > 3 && p.bodyFatPct < 60) {
    const leanMass = p.weightKg * (1 - p.bodyFatPct / 100);
    return 370 + 21.6 * leanMass;
  }
  const base = 10 * p.weightKg + 6.25 * p.heightCm - 5 * p.age;
  return p.sex === 'male' ? base + 5 : base - 161;
}

/** Net calories from walking: ~0.5 kcal per kg per km, stride ≈ 41.5% of height. */
export function stepsCalories(
  steps: number,
  weightKg: number,
  heightCm: number,
): number {
  const km = (steps * heightCm * 0.415) / 100000;
  return 0.5 * weightKg * km;
}

/** Average daily net burn from resistance training (~3.5 METs). */
export function trainingCalories(
  sessionsPerWeek: number,
  sessionMinutes: number,
  weightKg: number,
): number {
  const perSession = (3.5 - 1) * weightKg * (sessionMinutes / 60);
  return (perSession * sessionsPerWeek) / 7;
}

export function recommendedSteps(currentSteps: number): number {
  if (currentSteps >= 12000) return round(currentSteps, 500);
  return clamp(round(currentSteps + 2000, 500), 7000, 12000);
}

/** Protein is based on goal weight for higher BMIs, otherwise it overshoots. */
function proteinReferenceKg(profile: Profile): number {
  const currentBmi = bmi(profile.weightKg, profile.heightCm);
  if (currentBmi <= 30) return profile.weightKg;
  const m = profile.heightCm / 100;
  const bmi25 = 25 * m * m;
  const goal =
    profile.targetWeightKg && profile.targetWeightKg < profile.weightKg
      ? profile.targetWeightKg
      : bmi25;
  return Math.min(profile.weightKg, Math.max(goal, bmi25));
}

export interface PlanOptions {
  /** Measured average steps (e.g. from Health Connect) to use instead of the questionnaire answer. */
  measuredSteps?: number;
  /** Data-driven TDEE from the user's own logs; overrides the formula. */
  adaptiveTdee?: number;
}

function energyParts(profile: Profile, steps: number) {
  const bmr = basalMetabolicRate(profile);
  const neat =
    bmr * JOB_FACTOR[profile.job] +
    stepsCalories(steps, profile.weightKg, profile.heightCm);
  const exercise = trainingCalories(
    profile.trainingDays,
    profile.sessionMinutes,
    profile.weightKg,
  );
  return { bmr, neat, exercise, tdee: (bmr + neat + exercise) / (1 - TEF_FRACTION) };
}

/** TDEE from the formula only (ignores any adaptive estimate). */
export function formulaTdee(profile: Profile, measuredSteps?: number): number {
  return energyParts(profile, measuredSteps ?? profile.dailySteps).tdee;
}

export function computePlan(
  profile: Profile,
  options: PlanOptions = {},
): NutritionPlan {
  const warnings: PlanWarning[] = [];
  const steps = options.measuredSteps ?? profile.dailySteps;
  const currentBmi = bmi(profile.weightKg, profile.heightCm);

  const { bmr, neat, exercise, tdee: fTdee } = energyParts(profile, steps);
  const tdee = options.adaptiveTdee ?? fTdee;
  const tef = tdee * TEF_FRACTION;

  // Daily calorie delta relative to TDEE (positive = deficit).
  let dailyDelta = 0;
  switch (profile.goal) {
    case 'lose_fat': {
      if (currentBmi < 20) warnings.push('low_bmi');
      const weeklyKg = profile.weightKg * LOSS_RATE[profile.pace];
      dailyDelta = (weeklyKg * KCAL_PER_KG) / 7;
      // More stored fat tolerates a larger deficit without muscle loss.
      const capFraction =
        (currentBmi >= 30 ? 0.35 : currentBmi >= 25 ? 0.3 : 0.25) +
        (profile.pace === 'fast' ? 0.05 : 0);
      const cap = tdee * capFraction;
      if (dailyDelta > cap) {
        // Only tell the user when the cap meaningfully slows their chosen pace.
        if (dailyDelta > cap * 1.1) warnings.push('deficit_capped');
        dailyDelta = cap;
      }
      break;
    }
    case 'recomp':
      // Lean people recomp at maintenance; with more fat, a deficit plus
      // lifting still builds muscle while the fat comes off.
      dailyDelta = tdee * (currentBmi >= 30 ? 0.2 : currentBmi >= 25 ? 0.12 : 0);
      break;
    case 'build_muscle': {
      const base =
        profile.experience === 'intermediate'
          ? 0.07
          : profile.experience === 'advanced'
            ? 0.05
            : 0.1;
      const paceAdj =
        profile.pace === 'relaxed' ? -0.03 : profile.pace === 'fast' ? 0.03 : 0;
      dailyDelta = -tdee * Math.max(base + paceAdj, 0.03);
      break;
    }
    case 'strength':
      dailyDelta = currentBmi < 25 ? -tdee * 0.05 : 0;
      break;
    default:
      dailyDelta = 0;
  }

  let targetCalories = tdee - dailyDelta;
  const floor = CALORIE_FLOOR[profile.sex];
  if (targetCalories < floor) {
    targetCalories = floor;
    dailyDelta = tdee - floor;
    warnings.push('floor_applied');
  }
  targetCalories = round(targetCalories, 10);
  dailyDelta = round(tdee - targetCalories);

  // Macros
  const refKg = proteinReferenceKg(profile);
  if (refKg < profile.weightKg) warnings.push('high_bmi_protein');
  // Above BMI 25 part of the body weight is fat, so per-kg protein is a bit lower.
  const proteinPerKg =
    PROTEIN_PER_KG[profile.goal] -
    (currentBmi >= 25 && PROTEIN_PER_KG[profile.goal] > 1.8 ? 0.2 : 0) +
    (profile.goal === 'lose_fat' && profile.pace === 'fast' ? 0.2 : 0);
  const protein = round(refKg * proteinPerKg, 5);
  let fat = clamp(
    0.7 * refKg,
    (targetCalories * 0.22) / 9,
    (targetCalories * 0.32) / 9,
  );
  let carbs = (targetCalories - protein * 4 - fat * 9) / 4;
  if (carbs < 50) {
    // Tight budget: drop fat towards its healthy minimum before carbs vanish.
    fat = Math.max(0.6 * refKg, (targetCalories - protein * 4 - 50 * 4) / 9);
    carbs = Math.max((targetCalories - protein * 4 - fat * 9) / 4, 0);
  }
  fat = round(fat, 5);
  carbs = round(Math.max((targetCalories - protein * 4 - fat * 9) / 4, 0), 5);
  const fiber = Math.max(25, round((targetCalories / 1000) * 14));

  const weeklyChangeKg = -((dailyDelta * 7) / KCAL_PER_KG);

  if (profile.targetWeightKg) {
    const m = profile.heightCm / 100;
    if (profile.targetWeightKg / (m * m) < 18.5) warnings.push('target_unrealistic');
  }

  const plan: NutritionPlan = {
    bmr: round(bmr),
    neat: round(neat),
    exercise: round(exercise),
    tef: round(tef),
    tdee: round(tdee, 10),
    targetCalories,
    dailyDelta,
    weeklyChangeKg: Math.round(weeklyChangeKg * 100) / 100,
    macros: { protein, carbs, fat, fiber },
    waterMl: round(
      clamp(
        33 * profile.weightKg + (350 * profile.trainingDays) / 7,
        1500,
        4000,
      ),
      100,
    ),
    stepsTarget: recommendedSteps(steps),
    bmi: Math.round(currentBmi * 10) / 10,
    warnings: profile.mealsPerDay === 1 ? [...warnings, 'one_meal'] : warnings,
    tdeeSource: options.adaptiveTdee ? 'adaptive' : 'formula',
  };

  const projection = projectWeight(profile, options);
  const reached = projection.findIndex((p) => p.reached);
  if (reached >= 0) plan.weeksToGoal = reached;

  return plan;
}

export interface ProjectionPoint {
  week: number;
  kg: number;
  reached: boolean;
}

/**
 * Week-by-week projection that recomputes the plan as weight changes, so the
 * curve flattens like real progress does (smaller body = smaller deficit).
 */
export function projectWeight(
  profile: Profile,
  options: PlanOptions = {},
  maxWeeks = 156,
): ProjectionPoint[] {
  const target = profile.targetWeightKg;
  const losing = profile.goal === 'lose_fat' || profile.goal === 'recomp';
  const gaining = profile.goal === 'build_muscle' || profile.goal === 'strength';
  const points: ProjectionPoint[] = [
    { week: 0, kg: profile.weightKg, reached: false },
  ];
  if (!target || (!losing && !gaining)) return points;

  // An adaptive TDEE is only measured at today's weight; keep its ratio to
  // the formula as the weight moves.
  const ratio = options.adaptiveTdee
    ? options.adaptiveTdee / formulaTdee(profile, options.measuredSteps)
    : 1;
  // Drop the target so computePlan doesn't recurse back into projectWeight.
  const { targetWeightKg: _target, ...base } = profile;

  let kg = profile.weightKg;
  for (let week = 1; week <= maxWeeks; week++) {
    const atWeight = { ...base, weightKg: kg } as Profile;
    const p = computePlan(atWeight, {
      measuredSteps: options.measuredSteps,
      adaptiveTdee:
        ratio === 1 ? undefined : formulaTdee(atWeight, options.measuredSteps) * ratio,
    });
    kg += p.weeklyChangeKg;
    const reached = losing ? kg <= target : kg >= target;
    points.push({ week, kg: Math.round(kg * 10) / 10, reached });
    if (reached || Math.abs(p.weeklyChangeKg) < 0.01) break;
  }
  return points;
}

// ---------------------------------------------------------------------------
// Logged-data helpers
// ---------------------------------------------------------------------------

export function sumNutrition(entries: FoodEntry[]) {
  return entries.reduce(
    (acc, e) => ({
      calories: acc.calories + e.calories,
      protein: acc.protein + e.protein,
      carbs: acc.carbs + e.carbs,
      fat: acc.fat + e.fat,
      fiber: acc.fiber + (e.fiber ?? 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0, fiber: 0 },
  );
}

/** Exponentially smoothed weight trend (hides day-to-day water noise). */
export function weightTrend(
  weights: WeightEntry[],
  alpha = 0.1,
): { date: string; kg: number; trend: number }[] {
  const sorted = [...weights].sort((a, b) => a.date.localeCompare(b.date));
  let trend: number | undefined;
  let prevDate: string | undefined;
  return sorted.map((w) => {
    if (trend === undefined || !prevDate) {
      trend = w.kg;
    } else {
      // Apply the smoothing once per elapsed day so gaps are handled fairly.
      const days = Math.max(1, daysBetween(prevDate, w.date));
      const a = 1 - Math.pow(1 - alpha, days);
      trend = trend + a * (w.kg - trend);
    }
    prevDate = w.date;
    return { date: w.date, kg: w.kg, trend: Math.round(trend * 100) / 100 };
  });
}

export function daysBetween(a: string, b: string): number {
  const da = new Date(a + 'T12:00:00');
  const db = new Date(b + 'T12:00:00');
  return Math.round((db.getTime() - da.getTime()) / 86400000);
}

export interface AdaptiveTdeeResult {
  tdee: number;
  avgIntake: number;
  weeklyChangeKg: number;
  loggedDays: number;
  weighIns: number;
  /** 0..1 — how much the estimate is trusted relative to the formula. */
  confidence: number;
}

/**
 * Estimate real maintenance calories from what was eaten and how the weight
 * trend moved: TDEE ≈ average intake − (trend change × 7700 / days).
 * Needs ≥14 logged days and ≥6 weigh-ins spread over ≥14 days.
 */
export function estimateAdaptiveTdee(
  foods: FoodEntry[],
  weights: WeightEntry[],
  formulaTdee: number,
  today: string,
  windowDays = 28,
): AdaptiveTdeeResult | null {
  const start = addDays(today, -windowDays);
  const byDay = new Map<string, number>();
  for (const f of foods) {
    if (f.date > start && f.date < today) {
      byDay.set(f.date, (byDay.get(f.date) ?? 0) + f.calories);
    }
  }
  // Ignore obviously incomplete days (forgot to log most meals).
  const days = [...byDay.values()].filter((kcal) => kcal >= 800);
  const recentWeights = weights.filter((w) => w.date > start && w.date <= today);
  if (days.length < 14 || recentWeights.length < 6) return null;

  const trend = weightTrend(recentWeights);
  const span = daysBetween(trend[0].date, trend[trend.length - 1].date);
  if (span < 14) return null;

  // Least-squares slope of the trend line (kg per day).
  const xs = trend.map((t) => daysBetween(trend[0].date, t.date));
  const ys = trend.map((t) => t.trend);
  const n = xs.length;
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0;
  let den = 0;
  for (let i = 0; i < n; i++) {
    num += (xs[i] - mx) * (ys[i] - my);
    den += (xs[i] - mx) ** 2;
  }
  const slopePerDay = den === 0 ? 0 : num / den;

  const avgIntake = days.reduce((a, b) => a + b, 0) / days.length;
  const raw = avgIntake - slopePerDay * KCAL_PER_KG;
  const bounded = clamp(raw, formulaTdee * 0.65, formulaTdee * 1.35);
  const confidence = Math.min(1, days.length / windowDays) * (bounded === raw ? 1 : 0.5);
  const blended = formulaTdee * (1 - confidence) + bounded * confidence;

  return {
    tdee: round(blended, 10),
    avgIntake: round(avgIntake),
    weeklyChangeKg: Math.round(slopePerDay * 7 * 100) / 100,
    loggedDays: days.length,
    weighIns: recentWeights.length,
    confidence: Math.round(confidence * 100) / 100,
  };
}

export function addDays(date: string, delta: number): string {
  const d = new Date(date + 'T12:00:00');
  d.setDate(d.getDate() + delta);
  return toDateKey(d);
}

export function toDateKey(d: Date = new Date()): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}
