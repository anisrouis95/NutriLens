// Offline database of generic (unbranded) foods and home-cooked dishes, with a
// focus on Tunisian / Maghreb food. Branded products come from Open Food Facts.
//
// Conventions
// - All nutrient values are per 100 g of food AS EATEN (ml ≈ g for drinks).
// - `carbs` = available carbohydrates (EU / CIQUAL convention: fiber is NOT
//   included in carbs). Energy ≈ 4·protein + 4·carbs + 9·fat + 2·fiber.
// - Single ingredients follow USDA FoodData Central (SR Legacy) and the French
//   ANSES CIQUAL table. Composite dishes are estimated from typical Tunisian home
//   recipes (ingredient-by-ingredient sums); see `note` where oil dominates.
// - Serving grams are edible grams (bones, shells, pits removed).

import type { LocalizedText } from '@/lib/i18n';
export type { LocalizedText } from '@/lib/i18n';

export type FoodCategory =
  | 'grain'
  | 'bread'
  | 'protein'
  | 'fish'
  | 'dairy'
  | 'egg'
  | 'legume'
  | 'vegetable'
  | 'fruit'
  | 'nut'
  | 'fat'
  | 'sweet'
  | 'snack'
  | 'drink'
  | 'dish'
  | 'condiment'
  | 'fastfood';

export interface Per100g {
  kcal: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

export interface Serving {
  label: LocalizedText;
  grams: number; // edible grams for that serving (ml ≈ g for drinks)
}

export interface LocalFood {
  id: string; // snake_case, stable, unique
  name: LocalizedText;
  aliases: string[]; // lowercase search terms
  category: FoodCategory;
  per100g: Per100g; // as eaten
  servings: Serving[]; // 1–4 realistic servings, most common first
  tunisian?: boolean; // Tunisian / Maghreb dishes & products
  note?: LocalizedText;
}

import { localFoodsA } from './foodsA';
import { localFoodsB } from './foodsB';

export const localFoods: LocalFood[] = [...localFoodsA, ...localFoodsB];
