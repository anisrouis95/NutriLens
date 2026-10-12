import { LocalFood, localFoods } from '@/data/foods';
import type { FoodEntry, FoodSource, LocalizedText } from '@/types';

export interface Per100 {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

/**
 * A food waiting to be added to the diary (from any source). Nutrition is
 * stored per 100 g so the portion can be edited freely.
 */
export interface PendingFood {
  key: string;
  name: string;
  grams: number;
  per100: Per100;
  source: FoodSource;
  servings?: { label: string; grams: number }[];
  confidence?: 'high' | 'medium' | 'low';
  notes?: string;
}

export function per100From(values: {
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}): Per100 {
  const f = values.grams > 0 ? 100 / values.grams : 1;
  return {
    kcal: values.calories * f,
    protein: values.protein * f,
    carbs: values.carbs * f,
    fat: values.fat * f,
    fiber: (values.fiber ?? 0) * f,
  };
}

export function pendingToEntry(
  p: PendingFood,
  date: string,
  meal: FoodEntry['meal'],
): Omit<FoodEntry, 'id' | 'createdAt'> {
  return {
    date,
    meal,
    name: p.name,
    grams: Math.round(p.grams),
    source: p.source,
    note: p.notes,
    ...fromPer100g(p.per100, p.grams),
  };
}

export const normalizeText = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/œ/g, 'oe')
    .trim();

const index = localFoods.map((food) => ({
  food,
  terms: [food.name.en, food.name.fr, ...food.aliases].map(normalizeText),
}));

export function searchLocalFoods(query: string, limit = 25): LocalFood[] {
  const q = normalizeText(query);
  if (!q) return [];
  const words = q.split(/\s+/).filter(Boolean);
  const scored: { food: LocalFood; score: number }[] = [];
  for (const { food, terms } of index) {
    let best = Infinity;
    for (const term of terms) {
      if (term === q) best = Math.min(best, 0);
      else if (term.startsWith(q)) best = Math.min(best, 1);
      else if (term.split(/[\s,()-]+/).some((w) => w.startsWith(q))) best = Math.min(best, 2);
      else if (words.every((w) => term.includes(w))) best = Math.min(best, 3);
    }
    if (best < Infinity) scored.push({ food, score: best + (food.tunisian ? -0.1 : 0) });
  }
  return scored
    .sort((a, b) => a.score - b.score || a.food.name.en.localeCompare(b.food.name.en))
    .slice(0, limit)
    .map((s) => s.food);
}

export function fromPer100g(
  per100g: Per100,
  grams: number,
): { calories: number; protein: number; carbs: number; fat: number; fiber: number } {
  const f = grams / 100;
  const r1 = (n: number) => Math.round(n * f * 10) / 10;
  return {
    calories: Math.round(per100g.kcal * f),
    protein: r1(per100g.protein),
    carbs: r1(per100g.carbs),
    fat: r1(per100g.fat),
    fiber: r1(per100g.fiber ?? 0),
  };
}

let keyCounter = 0;
export const pendingKey = () => `p${Date.now()}_${keyCounter++}`;

const pick = (t: LocalizedText, language: 'en' | 'fr') => t[language] || t.en;

export function localToPending(food: LocalFood, language: 'en' | 'fr'): PendingFood {
  const servings = food.servings.map((s) => ({ label: pick(s.label, language), grams: s.grams }));
  return {
    key: pendingKey(),
    name: pick(food.name, language),
    grams: servings[0]?.grams ?? 100,
    per100: food.per100g,
    source: 'search',
    servings,
    notes: food.note ? pick(food.note, language) : undefined,
  };
}

export function packagedToPending(
  food: {
    name: string;
    brand?: string;
    per100g: Per100;
    servingGrams?: number;
    servingLabel?: string;
  },
  source: FoodSource,
): PendingFood {
  const servings = food.servingGrams
    ? [{ label: food.servingLabel || `${food.servingGrams} g`, grams: food.servingGrams }]
    : [];
  return {
    key: pendingKey(),
    name: food.brand ? `${food.name} (${food.brand})` : food.name,
    grams: food.servingGrams ?? 100,
    per100: food.per100g,
    source,
    servings: [...servings, { label: '100 g', grams: 100 }],
  };
}

export function entryToPending(entry: FoodEntry): PendingFood {
  const grams = entry.grams && entry.grams > 0 ? entry.grams : 100;
  return {
    key: pendingKey(),
    name: entry.name,
    grams,
    per100: per100From({ ...entry, grams }),
    source: entry.source,
  };
}

/** Distinct foods the user logged recently, newest first, for one-tap re-adding. */
export function recentFoods(entries: FoodEntry[], limit = 20): FoodEntry[] {
  const seen = new Set<string>();
  const out: FoodEntry[] = [];
  for (const e of [...entries].sort((a, b) => b.createdAt.localeCompare(a.createdAt))) {
    const k = normalizeText(e.name);
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(e);
    if (out.length >= limit) break;
  }
  return out;
}

export function guessMeal(date = new Date()): FoodEntry['meal'] {
  const h = date.getHours();
  if (h < 11) return 'breakfast';
  if (h < 16) return 'lunch';
  if (h >= 18 && h < 23) return 'dinner';
  return 'snack';
}
