// Languages, text picking and date/number formatting shared by the whole app.
//
//   en      English
//   fr      French
//   tn      Tunisian Darija in Arabic letters (right-to-left)
//   tnLatn  Tunisian Darija in Latin letters, the way Tunisians text
//           ("3aslema", "9addech", "barcha"; 3 = ع, 7 = ح, 9 = ق, 5 = خ, 8 = غ)
//
// Every text object carries `en` and `fr`; the Darija keys are optional and a
// missing one falls back to French, which Tunisians read alongside Darija.

export type Language = 'en' | 'fr' | 'tn' | 'tnLatn';

export const LANGUAGES: Language[] = ['en', 'fr', 'tn', 'tnLatn'];

export type Localized<T> = { en: T; fr: T; tn?: T; tnLatn?: T };
export type LocalizedText = Localized<string>;

/** Each language named in itself, for the picker. */
export const LANGUAGE_NAMES: Record<Language, { name: string; hint: string }> = {
  en: { name: 'English', hint: 'English' },
  fr: { name: 'Français', hint: 'French' },
  tn: { name: 'تونسي', hint: 'Darija · حروف عربي' },
  tnLatn: { name: 'Tounsi', hint: 'Darija · 7rouf latin' },
};

export const isLanguage = (v: unknown): v is Language => typeof v === 'string' && (LANGUAGES as string[]).includes(v);

/** Darija in Arabic letters is the one right-to-left language. */
export const isRTLLanguage = (language: Language) => language === 'tn';

/** The current language's value, falling back to French for Darija and then to English. */
export function pick<T>(value: Localized<T>, language: Language): T {
  const own = value[language];
  if (own !== undefined && (own as unknown) !== '') return own;
  if (language !== 'en' && value.fr !== undefined && (value.fr as unknown) !== '') return value.fr;
  return value.en;
}

/**
 * Locale for numbers. Darija uses French conventions (Latin digits, decimal
 * comma, thin-space thousands), which also keep a number in one piece inside
 * right-to-left text: the thin space and the comma never split it.
 */
export const numberLocale = (language: Language) => (language === 'en' ? 'en-US' : 'fr-FR');

/** Writes decimals with a comma (5,5 km/h) in every language but English. */
export const decimalComma = (language: Language) => language !== 'en';

/** Language name for AI prompts, so replies come back in the same language and script. */
export function aiLanguageName(language: Language): string {
  switch (language) {
    case 'fr':
      return 'French';
    case 'tn':
      return 'Tunisian Darija (the Tunisian Arabic dialect, not Modern Standard Arabic), written in Arabic script';
    case 'tnLatn':
      return 'Tunisian Darija (the Tunisian Arabic dialect) written in Latin letters the way Tunisians text, with digits for Arabic sounds (3 = ع, 7 = ح, 9 = ق, 5 = خ, 8 = غ), e.g. "9addech", "barcha", "ya3tik e sa77a"';
    default:
      return 'English';
  }
}

// ---------------------------------------------------------------------------
// Dates. English and French use the platform's Intl data; the two Darija
// variants use Tunisian names (months are the French-derived ones used across
// Tunisia: جانفي، فيفري…).
// ---------------------------------------------------------------------------

const DAYS: Record<'tn' | 'tnLatn', string[]> = {
  // Sunday first, like Date.getDay().
  tn: ['الأحد', 'الإثنين', 'الثلاثاء', 'الإربعاء', 'الخميس', 'الجمعة', 'السبت'],
  tnLatn: ['A7ad', 'Ethnin', 'Ethleth', 'Larb3a', 'Lekhmis', 'Jem3a', 'Sebt'],
};
const DAY_INITIALS: Record<'tn' | 'tnLatn', string[]> = {
  tn: ['ح', 'ن', 'ث', 'ر', 'خ', 'ج', 'س'],
  // The French initials printed on Tunisian calendars.
  tnLatn: ['D', 'L', 'M', 'M', 'J', 'V', 'S'],
};
const MONTHS: Record<'tn' | 'tnLatn', string[]> = {
  tn: ['جانفي', 'فيفري', 'مارس', 'أفريل', 'ماي', 'جوان', 'جويلية', 'أوت', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر'],
  tnLatn: ['Janfi', 'Fifri', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'],
};
const MONTHS_SHORT_LATN = ['Jan', 'Fif', 'Mars', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];

export interface DateParts {
  weekday?: 'long' | 'short' | 'narrow';
  day?: 'numeric';
  month?: 'long' | 'short';
  year?: 'numeric';
}

/** A day of the week on its own (calendar headers, day strips). */
export function weekdayName(date: Date, language: Language, width: 'long' | 'short' | 'narrow'): string {
  if (language === 'tn' || language === 'tnLatn') {
    return width === 'narrow' ? DAY_INITIALS[language][date.getDay()] : DAYS[language][date.getDay()];
  }
  return date.toLocaleDateString(numberLocale(language), { weekday: width });
}

/** Formats the parts asked for, in the language's own order ("الإثنين 13 أكتوبر"). */
export function formatDate(date: Date, parts: DateParts, language: Language): string {
  if (language === 'tn' || language === 'tnLatn') {
    const out: string[] = [];
    if (parts.weekday) out.push(weekdayName(date, language, parts.weekday));
    if (parts.day) out.push(String(date.getDate()));
    if (parts.month) {
      const m = date.getMonth();
      out.push(language === 'tnLatn' && parts.month === 'short' ? MONTHS_SHORT_LATN[m] : MONTHS[language][m]);
    }
    if (parts.year) out.push(String(date.getFullYear()));
    return out.join(' ');
  }
  return date.toLocaleDateString(numberLocale(language), parts);
}

/** Clock time: 24-hour (18:31) everywhere but English. */
export function formatTime(date: Date, language: Language): string {
  if (language === 'en') return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

/** Date and time of an event (last backup, last sync). */
export function formatDateTime(date: Date, language: Language): string {
  const day = formatDate(date, { day: 'numeric', month: 'short', year: 'numeric' }, language);
  return `${day}, ${formatTime(date, language)}`;
}
