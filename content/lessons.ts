/**
 * Tounsi Fit: in-app education content (lessons + glossary), English and French.
 *
 * Written for complete beginners. Mainstream, evidence-based sports-nutrition
 * consensus only (ISSN position stands, Mifflin-St Jeor, 1.6-2.2 g/kg protein,
 * 0.5-1 % bodyweight per week, progressive overload, RIR...).
 *
 * Body format (markdown-lite): paragraphs separated by a blank line ("\n\n"),
 * bullet lines start with "- ", **bold** allowed. Nothing else.
 *
 * Personalization tokens, replaced by the app with the user's own numbers:
 * {{bmr}} {{tdee}} {{targetCalories}} {{deficit}} {{weeklyChangeKg}} {{proteinG}}
 * {{fatG}} {{carbsG}} {{weightKg}} {{stepsTarget}} {{waterL}} {{weeksToGoal}}
 *
 * French strings are written with plain spaces. `frTypo` (bottom of the file)
 * turns the spaces French typography requires (before : ; ? ! and », after «,
 * inside thousands like "7 700", between a number and its unit) into
 * non-breaking spaces so they never wrap badly on small screens.
 */

import type { Localized, LocalizedText } from '@/lib/i18n';
export type { LocalizedText } from '@/lib/i18n';

export type LessonCategory = 'basics' | 'nutrition' | 'training' | 'body' | 'habits';

export interface LessonSection {
  heading: LocalizedText;
  // Markdown-lite body: paragraphs separated by a blank line ("\n\n"),
  // bullet lines start with "- ", **bold** allowed. Nothing else (no headings, links, tables, images).
  body: LocalizedText;
}

export interface Lesson {
  id: string; // kebab-case, stable
  category: LessonCategory;
  icon: string; // lucide-react-native icon component name
  minutes: number; // reading time estimate
  title: LocalizedText;
  summary: LocalizedText; // one sentence, shown on the card
  sections: LessonSection[]; // 3-6 sections
  keyTakeaways: Localized<string[]>; // 3-5 bullets, same count in every language
  related?: string[]; // ids of other lessons
}

export interface GlossaryEntry {
  id: string;
  term: LocalizedText;
  definition: LocalizedText;
  lessonId?: string;
}

import { glossaryEntries } from './lessonParts/glossary';
import { lessonsPart1 } from './lessonParts/part1';
import { lessonsPart2 } from './lessonParts/part2';
import { lessonsPart3 } from './lessonParts/part3';
import { lessonsPart4 } from './lessonParts/part4';

const rawLessons: Lesson[] = [...lessonsPart1, ...lessonsPart2, ...lessonsPart3, ...lessonsPart4];

// -----------------------------------------------------------------------------
// Glossary
// -----------------------------------------------------------------------------

const rawGlossary: GlossaryEntry[] = glossaryEntries;

// -----------------------------------------------------------------------------
// French typography (non-breaking spaces) + exports
// -----------------------------------------------------------------------------

const NBSP = ' ';

/**
 * Applies French typography to a string written with plain spaces:
 * - space before : ; ? ! » and after « becomes a non-breaking space
 * - thousands separators ("7 700") become non-breaking
 * - a number (or a {{token}}) followed by a unit ("30 g", "{{tdee}} kcal") stays together
 */
function frTypo(text: string): string {
  return text
    .replace(/ ([:;?!»])/g, NBSP + '$1')
    .replace(/« /g, '«' + NBSP)
    .replace(/(\d) (?=\d{3}(?!\d))/g, '$1' + NBSP)
    .replace(
      /(\d|\}\}) (kcal|kg|g\/kg|g|mg|ml|cl|L|cm|km|min|h|%|°C)(?![A-Za-zÀ-ÿ0-9])/g,
      '$1' + NBSP + '$2',
    );
}

const polishText = (text: LocalizedText): LocalizedText => ({ ...text, fr: frTypo(text.fr) });

const polishLesson = (lesson: Lesson): Lesson => ({
  ...lesson,
  title: polishText(lesson.title),
  summary: polishText(lesson.summary),
  sections: lesson.sections.map((section) => ({
    heading: polishText(section.heading),
    body: polishText(section.body),
  })),
  keyTakeaways: { ...lesson.keyTakeaways, fr: lesson.keyTakeaways.fr.map(frTypo) },
});

const polishGlossaryEntry = (entry: GlossaryEntry): GlossaryEntry => ({
  ...entry,
  term: polishText(entry.term),
  definition: polishText(entry.definition),
});

export const lessons: Lesson[] = rawLessons.map(polishLesson);

export const glossary: GlossaryEntry[] = rawGlossary.map(polishGlossaryEntry);

/** Recommended beginner reading order (every lesson id exactly once). */
export const lessonOrder: string[] = [
  'calories-101',
  'bmr-tdee',
  'deficit-explained',
  'scale-lies',
  'protein',
  'macros-carbs-fats',
  'reading-labels-portions',
  'hunger-tips',
  'strength-training-basics',
  'sets-reps-rir',
  'form-and-safety',
  'steps-cardio',
  'sleep-recovery',
  'water',
  'consistency-mindset',
  'plateaus-adaptation',
  'recomp-and-gaining',
  'ramadan-fasting',
];
