import type { LocalizedText } from '@/lib/i18n';

/** A text in English, French, then Darija in Arabic letters and in Latin letters. */
export const t = (en: string, fr: string, tn?: string, tnLatn?: string): LocalizedText => ({ en, fr, tn, tnLatn });
