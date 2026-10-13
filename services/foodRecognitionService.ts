// Food recognition from a photo or a text description, powered by Gemini.

import { generateJSON, imageToBase64 } from '@/services/gemini';
import { aiLanguageName, type Language } from '@/lib/i18n';

export type Confidence = 'high' | 'medium' | 'low';

export interface RecognizedFood {
  id: string;
  name: string;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
  confidence: Confidence;
  notes?: string;
}

export interface RecognitionResult {
  isFood: boolean;
  dishName: string;
  items: RecognizedFood[];
  tips?: string;
}

interface RawItem {
  name: string;
  grams: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  confidence: Confidence;
  notes?: string;
}

interface RawResult {
  is_food: boolean;
  dish_name: string;
  items: RawItem[];
  tips?: string;
}

const SCHEMA = {
  type: 'OBJECT',
  properties: {
    is_food: { type: 'BOOLEAN' },
    dish_name: { type: 'STRING', description: 'Short name for the whole meal' },
    items: {
      type: 'ARRAY',
      items: {
        type: 'OBJECT',
        properties: {
          name: { type: 'STRING' },
          grams: { type: 'NUMBER', description: 'Estimated edible weight of this portion in grams' },
          calories: { type: 'NUMBER', description: 'kcal for this portion' },
          protein: { type: 'NUMBER', description: 'grams for this portion' },
          carbs: { type: 'NUMBER', description: 'grams for this portion' },
          fat: { type: 'NUMBER', description: 'grams for this portion' },
          fiber: { type: 'NUMBER', description: 'grams for this portion' },
          confidence: { type: 'STRING', enum: ['high', 'medium', 'low'] },
          notes: { type: 'STRING', description: 'Assumptions, e.g. cooking oil amount, or a likely alternative' },
        },
        required: ['name', 'grams', 'calories', 'protein', 'carbs', 'fat', 'confidence'],
      },
    },
    tips: { type: 'STRING', description: 'One short sentence on what to double-check, e.g. hidden oil' },
  },
  required: ['is_food', 'dish_name', 'items'],
};

function systemPrompt(language: Language) {
  return `You are the nutrition analyst inside a calorie-tracking app. The user lives in Tunisia and is learning to track calories for the first time, so accuracy matters more than politeness.

Identify every food and drink and estimate each portion's edible weight in grams and its nutrition for THAT portion.

Rules:
- Recognise Tunisian and Maghreb dishes by their usual name (couscous, lablabi, ojja, kafteji, brik, fricassé, mloukhia, makrouna, chakchouka, salade méchouia, salade tunisienne, kamounia, chorba frik, mlawi, chapati, tabouna, bambalouni, makroudh, etc.) as well as any other cuisine.
- Use scale cues to judge portions: a dinner plate is about 26 cm, a fork about 19 cm, a Tunisian baguette about 250 g, a tea glass about 100 ml.
- Cooking fat is the most commonly missed calorie source. When a dish is normally cooked or dressed with oil (Tunisian home cooking uses a lot of olive oil), either include it in the dish or list it as a separate item, and state the assumed amount in notes.
- Bread served with the meal counts. Sweetened drinks count (Tunisian tea is often very sweet).
- Calories must be consistent with the macros (protein 4, carbs 4, fat 9 kcal per gram, within about 10%).
- Prefer realistic home-cooked or café portions over "diet" portions.
- If you are unsure between two foods, choose the most likely and mention the alternative in notes, with confidence "low".
- If the image or text contains no food or drink, set is_food to false and return an empty items list.
- Write every name, note and tip in ${aiLanguageName(language)}.`;
}

let counter = 0;
function normalize(raw: RawResult): RecognitionResult {
  const items = (raw.items ?? [])
    .filter((i) => i && i.name && Number.isFinite(i.calories))
    .map((i) => ({
      id: `ai_${Date.now()}_${counter++}`,
      name: i.name,
      grams: Math.max(1, Math.round(i.grams || 0)),
      calories: Math.max(0, Math.round(i.calories)),
      protein: Math.max(0, Math.round((i.protein || 0) * 10) / 10),
      carbs: Math.max(0, Math.round((i.carbs || 0) * 10) / 10),
      fat: Math.max(0, Math.round((i.fat || 0) * 10) / 10),
      fiber: Math.max(0, Math.round((i.fiber || 0) * 10) / 10),
      confidence: i.confidence ?? 'medium',
      notes: i.notes || undefined,
    }));
  return {
    isFood: raw.is_food !== false && items.length > 0,
    dishName: raw.dish_name || '',
    items,
    tips: raw.tips || undefined,
  };
}

export async function recognizeFoodFromPhoto(
  imageUri: string,
  language: Language,
  hint?: string,
): Promise<RecognitionResult> {
  const data = await imageToBase64(imageUri);
  const prompt = hint?.trim()
    ? `Analyse this meal. The user adds: "${hint.trim()}"`
    : 'Analyse this meal.';
  const raw = await generateJSON<RawResult>({
    system: systemPrompt(language),
    responseSchema: SCHEMA,
    contents: [
      {
        role: 'user',
        parts: [{ inlineData: { mimeType: 'image/jpeg', data } }, { text: prompt }],
      },
    ],
  });
  return normalize(raw);
}

export async function recognizeFoodFromText(
  description: string,
  language: Language,
): Promise<RecognitionResult> {
  const raw = await generateJSON<RawResult>({
    system: systemPrompt(language),
    responseSchema: SCHEMA,
    contents: [
      {
        role: 'user',
        parts: [{ text: `The user describes what they ate: "${description.trim()}"` }],
      },
    ],
  });
  return normalize(raw);
}

/** Scale a recognized item to a new gram weight, keeping its proportions. */
export function scaleFood<T extends { grams: number; calories: number; protein: number; carbs: number; fat: number; fiber: number }>(
  item: T,
  grams: number,
): T {
  const f = item.grams > 0 ? grams / item.grams : 1;
  return {
    ...item,
    grams,
    calories: Math.round(item.calories * f),
    protein: Math.round(item.protein * f * 10) / 10,
    carbs: Math.round(item.carbs * f * 10) / 10,
    fat: Math.round(item.fat * f * 10) / 10,
    fiber: Math.round(item.fiber * f * 10) / 10,
  };
}
