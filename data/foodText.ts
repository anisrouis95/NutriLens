// Text helpers shared by the food lists (foodsA.ts, foodsB.ts).

import type { LocalizedText } from '@/lib/i18n';
import type { Serving } from './foods';

/** A serving: English, French, grams, then Darija in Arabic and in Latin letters. */
export const s = (en: string, fr: string, grams: number, tn?: string, tnLatn?: string): Serving => ({
  label: { en, fr, tn, tnLatn },
  grams,
});
export const t = (en: string, fr: string, tn?: string, tnLatn?: string): LocalizedText => ({ en, fr, tn, tnLatn });

export const OIL_NOTE = t(
  'Home-recipe estimate. Oil content varies a lot between homes.',
  'Estimation recette maison. La quantité d\'huile varie beaucoup selon les foyers.',
  'تقدير على وصفة الدار. قدّاش من زيت يتبدّل برشا من دار لدار.',
  'Ta9dir 3la recette mta3 dar. 9addech men zit yetbaddel barcha men dar l dar.',
);
