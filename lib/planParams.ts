import type { NutritionPlan, Profile } from '@/types';
import { numberLocale, type Language } from '@/lib/i18n';

/** Values substituted into lesson text placeholders like {{tdee}}. */
export function planParams(
  plan: NutritionPlan | null,
  profile: Profile | null,
  language: Language,
): Record<string, string | number> {
  const fmt = (n: number, digits = 0) => {
    const s = n.toLocaleString(numberLocale(language), {
      maximumFractionDigits: digits,
      minimumFractionDigits: digits,
    });
    return s;
  };
  // Sensible example values when the questionnaire hasn't been done yet.
  if (!plan || !profile) {
    return {
      bmr: fmt(1700),
      tdee: fmt(2400),
      targetCalories: fmt(1900),
      deficit: fmt(500),
      weeklyChangeKg: fmt(0.45, 2),
      proteinG: 150,
      fatG: 65,
      carbsG: 200,
      weightKg: 80,
      stepsTarget: fmt(8000),
      waterL: fmt(2.6, 1),
      weeksToGoal: 16,
    };
  }
  return {
    bmr: fmt(plan.bmr),
    tdee: fmt(plan.tdee),
    targetCalories: fmt(plan.targetCalories),
    deficit: fmt(Math.abs(plan.dailyDelta)),
    weeklyChangeKg: fmt(Math.abs(plan.weeklyChangeKg), 2),
    proteinG: plan.macros.protein,
    fatG: plan.macros.fat,
    carbsG: plan.macros.carbs,
    weightKg: fmt(profile.weightKg, 1),
    stepsTarget: fmt(plan.stepsTarget),
    waterL: fmt(plan.waterMl / 1000, 1),
    weeksToGoal: plan.weeksToGoal ?? '—',
  };
}
