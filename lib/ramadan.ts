// Ramadan mode: which days are fasting days, the day's fast (Fajr → Maghrib)
// for the user's governorate, and the training and meal guidance built on it.
//
// Ramadan's dates come from the Umm al-Qura calendar. Tunisia starts the
// month by moon sighting, which can land a day either side, so the user can
// shift the dates by a day.

import type { LocalizedText } from '@/lib/i18n';
import { sunTimes } from '@/lib/prayerTimes';
import type { MealType } from '@/types';

export type RamadanMode = 'auto' | 'on' | 'off';

export interface RamadanSettings {
  /** auto: fasting days during Ramadan's dates. on: every day from now (qada, voluntary fasts). off: never. */
  mode: RamadanMode;
  /** Governorate id (prayer times). */
  city: string;
  /** Days to move the calculated start by (−1, 0, +1) to match Tunisia's moon sighting. */
  shiftDays: number;
  /** One set fewer per exercise on fasting days (heavy weights kept). */
  lighter: boolean;
  /** Days the user isn't fasting (travel, illness, period). */
  skipDates?: string[];
}

export const DEFAULT_RAMADAN: RamadanSettings = { mode: 'auto', city: 'tunis', shiftDays: 0, lighter: true };

/** Short names of the modes (Profile row, Ramadan screen). */
export const RAMADAN_MODE_NAME: Record<RamadanMode, LocalizedText> = {
  auto: { en: 'Auto', fr: 'Auto', tn: 'أوتوماتيك', tnLatn: 'Auto' },
  on: { en: 'Always', fr: 'Toujours', tn: 'ديما', tnLatn: 'Dima' },
  off: { en: 'Off', fr: 'Désactivé', tn: 'مسكّر', tnLatn: 'Msakker' },
};

/** First and last day of Ramadan, 1446–1458 AH (Umm al-Qura). */
const RAMADAN_DATES: [string, string][] = [
  ['2025-03-01', '2025-03-29'],
  ['2026-02-18', '2026-03-19'],
  ['2027-02-08', '2027-03-08'],
  ['2028-01-28', '2028-02-25'],
  ['2029-01-16', '2029-02-13'],
  ['2030-01-05', '2030-02-03'],
  ['2030-12-26', '2031-01-23'],
  ['2031-12-16', '2032-01-13'],
  ['2032-12-04', '2033-01-02'],
  ['2033-11-23', '2033-12-22'],
  ['2034-11-12', '2034-12-11'],
  ['2035-11-01', '2035-11-30'],
  ['2036-10-21', '2036-11-18'],
];

export interface Governorate {
  id: string;
  name: LocalizedText;
  lat: number;
  lng: number;
}

const gov = (id: string, en: string, tn: string, tnLatn: string, lat: number, lng: number): Governorate => ({
  id,
  name: { en, fr: en, tn, tnLatn },
  lat,
  lng,
});

/** Tunisia's 24 governorates, by their capital city. */
export const GOVERNORATES: Governorate[] = [
  gov('tunis', 'Tunis', 'تونس', 'Tounes', 36.8065, 10.1815),
  gov('ariana', 'Ariana', 'أريانة', 'Ariana', 36.8625, 10.1956),
  gov('ben_arous', 'Ben Arous', 'بن عروس', 'Ben 3arous', 36.7531, 10.2189),
  gov('manouba', 'Manouba', 'منوبة', 'Manouba', 36.8101, 10.0956),
  gov('nabeul', 'Nabeul', 'نابل', 'Nabeul', 36.4561, 10.7376),
  gov('zaghouan', 'Zaghouan', 'زغوان', 'Zaghouan', 36.4029, 10.1429),
  gov('bizerte', 'Bizerte', 'بنزرت', 'Bizerte', 37.2744, 9.8739),
  gov('beja', 'Béja', 'باجة', 'Béja', 36.7256, 9.1817),
  gov('jendouba', 'Jendouba', 'جندوبة', 'Jendouba', 36.5011, 8.7802),
  gov('kef', 'Le Kef', 'الكاف', 'El Kef', 36.1742, 8.7049),
  gov('siliana', 'Siliana', 'سليانة', 'Siliana', 36.0849, 9.3708),
  gov('sousse', 'Sousse', 'سوسة', 'Sousse', 35.8256, 10.6084),
  gov('monastir', 'Monastir', 'المنستير', 'Monastir', 35.7643, 10.8113),
  gov('mahdia', 'Mahdia', 'المهدية', 'Mahdia', 35.5047, 11.0622),
  gov('sfax', 'Sfax', 'صفاقس', 'Sfax', 34.7406, 10.7603),
  gov('kairouan', 'Kairouan', 'القيروان', 'Kairouan', 35.6781, 10.0963),
  gov('kasserine', 'Kasserine', 'القصرين', 'Kasserine', 35.1676, 8.8365),
  gov('sidi_bouzid', 'Sidi Bouzid', 'سيدي بوزيد', 'Sidi Bouzid', 35.0382, 9.4849),
  gov('gabes', 'Gabès', 'قابس', 'Gabès', 33.8815, 10.0982),
  gov('medenine', 'Médenine', 'مدنين', 'Médenine', 33.3549, 10.5055),
  gov('tataouine', 'Tataouine', 'تطاوين', 'Tataouine', 32.9297, 10.4518),
  gov('gafsa', 'Gafsa', 'قفصة', 'Gafsa', 34.425, 8.7842),
  gov('tozeur', 'Tozeur', 'توزر', 'Tozeur', 33.9197, 8.1335),
  gov('kebili', 'Kébili', 'قبلي', 'Kébili', 33.7044, 8.969),
];

export const governorate = (id: string) => GOVERNORATES.find((g) => g.id === id) ?? GOVERNORATES[0];

// ---------------------------------------------------------------------------
// Dates
// ---------------------------------------------------------------------------

const DAY = 86400000;
const toTime = (date: string) => Date.parse(date + 'T12:00:00Z');
const toDate = (time: number) => new Date(time).toISOString().slice(0, 10);
export const shiftDate = (date: string, days: number) => toDate(toTime(date) + days * DAY);
const daysBetween = (a: string, b: string) => Math.round((toTime(b) - toTime(a)) / DAY);

export interface RamadanPeriod {
  start: string;
  end: string;
  /** 1-based day of Ramadan for the date asked about. */
  day: number;
  length: number;
}

/** The Ramadan that contains `date` (after the user's shift), or null. */
export function ramadanOn(date: string, shiftDays = 0): RamadanPeriod | null {
  for (const [s, e] of RAMADAN_DATES) {
    const start = shiftDate(s, shiftDays);
    const end = shiftDate(e, shiftDays);
    if (date >= start && date <= end) {
      return { start, end, day: daysBetween(start, date) + 1, length: daysBetween(start, end) + 1 };
    }
  }
  return null;
}

/** The next Ramadan starting after `date`, with the days left until it. */
export function nextRamadan(date: string, shiftDays = 0): { start: string; end: string; daysUntil: number } | null {
  for (const [s, e] of RAMADAN_DATES) {
    const start = shiftDate(s, shiftDays);
    if (start > date) return { start, end: shiftDate(e, shiftDays), daysUntil: daysBetween(date, start) };
  }
  return null;
}

/** Whether the user fasts on `date` under their settings. */
export function isFastingDay(settings: RamadanSettings, date: string) {
  if (settings.mode === 'off' || settings.skipDates?.includes(date)) return false;
  if (settings.mode === 'on') return true;
  return !!ramadanOn(date, settings.shiftDays);
}

// ---------------------------------------------------------------------------
// The day's fast
// ---------------------------------------------------------------------------

export interface FastDay {
  date: string;
  /** Suhoor ends, the fast starts. */
  fajr: Date;
  /** The fast ends: iftar. */
  maghrib: Date;
}

export function fastDay(date: string, cityId: string): FastDay {
  const g = governorate(cityId);
  const { fajr, maghrib } = sunTimes(date, g.lat, g.lng);
  return { date, fajr, maghrib };
}

export type FastPhase = 'suhoor' | 'fasting' | 'iftar';

export interface FastNow {
  phase: FastPhase;
  /** The moment the current phase ends (Fajr, Maghrib, or tomorrow's Fajr). */
  until: Date;
  /** 0–1 through today's fast (only while fasting). */
  progress: number;
}

/**
 * Where `now` sits in the fasting day: before dawn (suhoor), during the fast,
 * or after sunset (iftar, until tomorrow's dawn).
 */
export function fastNow(today: FastDay, tomorrow: FastDay, now: Date): FastNow {
  const t = now.getTime();
  const fajr = today.fajr.getTime();
  const maghrib = today.maghrib.getTime();
  if (t < fajr) return { phase: 'suhoor', until: today.fajr, progress: 0 };
  if (t < maghrib) return { phase: 'fasting', until: today.maghrib, progress: (t - fajr) / (maghrib - fajr) };
  return { phase: 'iftar', until: tomorrow.fajr, progress: 1 };
}

/** Training windows: 60 min before iftar (short, fasted) or 90 min after it (fed, best). */
export function trainingWindows(day: FastDay) {
  return {
    beforeIftar: new Date(day.maghrib.getTime() - 60 * 60000),
    afterIftar: new Date(day.maghrib.getTime() + 90 * 60000),
  };
}

/**
 * Meal slots renamed for fasting days, in the order of the calendar day and
 * keeping the stored meal types: suhoor (before dawn) is logged as breakfast,
 * iftar as dinner, the evening as snacks. Lunch doesn't happen on a fasting day.
 */
export const RAMADAN_MEALS: { id: MealType; name: LocalizedText; add: LocalizedText }[] = [
  {
    id: 'breakfast',
    name: { en: 'Suhoor', fr: 'S’hour', tn: 'السحور', tnLatn: 'S7our' },
    add: { en: 'Add suhoor', fr: 'Ajouter le s’hour', tn: 'زيد السحور', tnLatn: 'Zid es-s7our' },
  },
  {
    id: 'dinner',
    name: { en: 'Iftar', fr: 'Iftar', tn: 'الفطور', tnLatn: 'Ftour' },
    add: { en: 'Add iftar', fr: 'Ajouter l’iftar', tn: 'زيد الفطور', tnLatn: 'Zid el ftour' },
  },
  {
    id: 'snack',
    name: { en: 'Evening', fr: 'Soirée', tn: 'السهرية', tnLatn: 'Sahria' },
    add: { en: 'Add evening food', fr: 'Ajouter la soirée', tn: 'زيد ماكلة السهرية', tnLatn: 'Zid makla mta3 sahria' },
  },
];

/** Default meal for something logged now on a fasting day. */
export function ramadanMealAt(now: Date, day: FastDay): MealType {
  const t = now.getTime();
  const fajr = day.fajr.getTime();
  if (t < fajr - 3 * 3600000) return 'snack'; // still last night's evening
  if (t < fajr + 30 * 60000) return 'breakfast'; // suhoor
  if (t < day.maghrib.getTime() + 2 * 3600000) return 'dinner'; // iftar (or logged ahead during the day)
  return 'snack';
}
