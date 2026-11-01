// Which reminders to schedule, and their exact words, for the next weeks.
// Pure: services/notifications.ts hands the list to the phone. Rebuilt every
// time the app opens or something they depend on changes (a workout saved,
// a meal logged, a setting), so their content is always current.

import { formatTime, pick, type Language, type LocalizedText } from '@/lib/i18n';
import { addDays } from '@/lib/nutritionMath';
import { dayKind } from '@/lib/schedule';
import { fastDay, isFastingDay, type RamadanSettings } from '@/lib/ramadan';
import type { FoodEntry, MealType, NotificationSettings, TrainingSchedule, WeightEntry, WorkoutPlan, WorkoutSession } from '@/types';

export const DEFAULT_NOTIFICATIONS: NotificationSettings = {
  rest: true,
  ongoing: true,
  training: true,
  trainingTime: '17:00',
  weighIn: true,
  weighInDay: 1,
  weighInTime: '08:00',
  meals: false,
  mealTimes: { breakfast: '09:00', lunch: '13:00', dinner: '20:00' },
  ramadan: true,
};

export const notificationSettings = (saved?: Partial<NotificationSettings>): NotificationSettings => ({
  ...DEFAULT_NOTIFICATIONS,
  ...saved,
  mealTimes: { ...DEFAULT_NOTIFICATIONS.mealTimes, ...saved?.mealTimes },
});

/** Android notification channels; each can also be switched off in the phone's settings. */
export type ChannelId = 'workout-live' | 'rest-over' | 'training' | 'weigh-in' | 'meals' | 'ramadan';

export interface Reminder {
  /** Stable per kind and date, so a rebuild replaces rather than duplicates. */
  id: string;
  channel: ChannelId;
  at: Date;
  title: string;
  body: string;
  /** Screen to open when tapped. */
  url: string;
}

/** How far ahead reminders are scheduled (a phone keeps them through reboots). */
export const HORIZON_DAYS = 21;

const fill = (text: string, params: Record<string, string | number>) =>
  text.replace(/\{\{(\w+)\}\}/g, (m, k) => (params[k] !== undefined ? String(params[k]) : m));

const at = (date: string, hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  const d = new Date(date + 'T00:00:00');
  d.setHours(h, m, 0, 0);
  return d;
};

const COPY = {
  training: {
    en: 'Training day: {{day}}',
    fr: 'Jour d’entraînement : {{day}}',
    tn: 'نهار تمرين: {{day}}',
    tnLatn: 'Nhar sport: {{day}}',
  },
  trainingBody: {
    en: '{{n}} exercises, about {{m}} min. Tired? Start a lighter session from the Train tab.',
    fr: '{{n}} exercices, environ {{m}} min. Fatigué ? Lance une séance plus légère depuis l’onglet Sport.',
    tn: '{{n}} تمارين، قريب {{m}} min. فشلان؟ ابدا حصّة أخفّ من صفحة التمرين.',
    tnLatn: '{{n}} exercices, 9rib {{m}} min. Fechlan? Ebda séance a5af men page Sport.',
  },
  weighIn: { en: 'Weigh-in', fr: 'Pesée', tn: 'وقت الميزان', tnLatn: 'Wa9t el mizen' },
  weighInBody: {
    en: 'Before breakfast, after the toilet, same scale. The weekly trend is what counts, not one day.',
    fr: 'Avant le petit-déjeuner, après les toilettes, même balance. C’est la tendance de la semaine qui compte, pas un jour.',
    tn: 'قبل فطور الصباح، بعد بيت الراحة، بنفس الميزان. الاتّجاه متاع الجمعة هو اللي يهم، موش نهار وحدو.',
    tnLatn: '9bal ftour sbe7, ba3d bit ra7a, b nafs el mizen. El tendance mta3 el jem3a hiya eli tehem, mouch nhar wa7dou.',
  },
  meal: {
    breakfast: { en: 'Log your breakfast', fr: 'Note ton petit-déjeuner', tn: 'سجّل فطور الصباح', tnLatn: 'Sajjel ftour sbe7' },
    lunch: { en: 'Log your lunch', fr: 'Note ton déjeuner', tn: 'سجّل الغداء', tnLatn: 'Sajjel el 8de' },
    dinner: { en: 'Log your dinner', fr: 'Note ton dîner', tn: 'سجّل العشاء', tnLatn: 'Sajjel el 3cha' },
  } as Record<'breakfast' | 'lunch' | 'dinner', LocalizedText>,
  mealBody: {
    en: 'A photo is enough: Tounsi Fit reads the plate for you.',
    fr: 'Une photo suffit : Tounsi Fit lit l’assiette pour toi.',
    tn: 'تصويرة تكفي: Tounsi Fit يقرالك الصحن.',
    tnLatn: 'Taswira tekfi: Tounsi Fit ya9ralek e sa7n.',
  },
  suhoor: { en: 'Suhoor ends at {{t}}', fr: 'Le shour se termine à {{t}}', tn: 'السحور يوفى على {{t}}', tnLatn: 'Shour youfa 3la {{t}}' },
  suhoorBody: {
    en: '30 minutes left to eat and drink. Water and protein first.',
    fr: 'Plus que 30 minutes pour manger et boire. L’eau et les protéines d’abord.',
    tn: 'بقات 30 دقيقة باش تاكل وتشرب. الماء والبروتين قبل كل شي.',
    tnLatn: 'B9at 30 d9i9a bech tekel w tochrob. El me w el protéines 9bal kol chay.',
  },
  iftar: { en: 'Iftar: {{t}}', fr: 'Iftar : {{t}}', tn: 'الفطور: {{t}}', tnLatn: 'Ftour: {{t}}' },
  iftarBody: {
    en: 'Saha ftourek! Water and dates first, then a normal meal. Log it to keep your day on track.',
    fr: 'Saha ftourek ! D’abord de l’eau et des dattes, puis un repas normal. Note-le pour garder ta journée sur la bonne voie.',
    tn: 'صحّة فطورك! الماء والتمر الأوّل، ومبعد ماكلة عادية. سجّلها باش يبقى نهارك مضبوط.',
    tnLatn: 'Sa77a ftourek! El me w tmar lowel, w ba3d makla 3adia. Sajjelha bech yab9a nharek madhbout.',
  },
} satisfies Record<string, LocalizedText | Record<string, LocalizedText>>;

export interface ReminderInput {
  now: Date;
  today: string;
  language: Language;
  settings: NotificationSettings;
  schedule: TrainingSchedule;
  plan: WorkoutPlan | null;
  /** The program day to do next (A, B, C… continues from the last session). */
  nextDayId?: string;
  sessionMinutes: number;
  sessions: WorkoutSession[];
  foods: FoodEntry[];
  weights: WeightEntry[];
  ramadan: RamadanSettings;
}

/** Every reminder to schedule from now to the horizon. */
export function plannedReminders(input: ReminderInput): Reminder[] {
  const { now, today, language: lang, settings: s, schedule, plan } = input;
  const L = (t: LocalizedText, params: Record<string, string | number> = {}) => fill(pick(t, lang), params);
  const out: Reminder[] = [];
  const push = (r: Reminder) => {
    if (r.at.getTime() > now.getTime() + 30000) out.push(r);
  };

  const trainedToday = input.sessions.some((x) => x.date === today && x.finishedAt);
  const weighedToday = input.weights.some((w) => w.date === today);
  const ateToday = new Set<MealType>(input.foods.filter((f) => f.date === today).map((f) => f.meal));

  // The program's days in order from the next one: each planned training day gets the next of them.
  const days = plan?.days ?? [];
  let rotation = Math.max(0, days.findIndex((d) => d.id === input.nextDayId));

  for (let i = 0; i < HORIZON_DAYS; i++) {
    const date = addDays(today, i);
    const fasting = s.ramadan && input.ramadan.mode !== 'off' && isFastingDay(input.ramadan, date);

    // Today counts as a session to come only while its reminder is still ahead (done or past: the next day takes it).
    const ahead = i > 0 || (!trainedToday && at(date, s.trainingTime).getTime() > now.getTime());
    if (dayKind(schedule, date) === 'train' && days.length && ahead) {
      const day = days[rotation % days.length];
      rotation++;
      if (s.training) {
        push({
          id: `rem-training-${date}`,
          channel: 'training',
          at: at(date, s.trainingTime),
          title: L(COPY.training, { day: pick(day.name, lang) }),
          body: L(COPY.trainingBody, { n: day.exercises.length, m: input.sessionMinutes }),
          url: '/train',
        });
      }
    }

    if (s.weighIn && new Date(date + 'T12:00:00').getDay() === s.weighInDay && !(i === 0 && weighedToday)) {
      push({ id: `rem-weigh-${date}`, channel: 'weigh-in', at: at(date, s.weighInTime), title: L(COPY.weighIn), body: L(COPY.weighInBody), url: '/' });
    }

    // Meal reminders pause on fasting days: suhoor and iftar take their place.
    if (s.meals && !fasting) {
      for (const meal of ['breakfast', 'lunch', 'dinner'] as const) {
        if (i === 0 && ateToday.has(meal)) continue;
        push({ id: `rem-meal-${meal}-${date}`, channel: 'meals', at: at(date, s.mealTimes[meal]), title: L(COPY.meal[meal]), body: L(COPY.mealBody), url: '/food' });
      }
    }

    if (fasting) {
      const fast = fastDay(date, input.ramadan.city);
      const suhoor = new Date(fast.fajr.getTime() - 30 * 60000);
      push({ id: `rem-suhoor-${date}`, channel: 'ramadan', at: suhoor, title: L(COPY.suhoor, { t: formatTime(fast.fajr, lang) }), body: L(COPY.suhoorBody), url: '/ramadan' });
      push({ id: `rem-iftar-${date}`, channel: 'ramadan', at: fast.maghrib, title: L(COPY.iftar, { t: formatTime(fast.maghrib, lang) }), body: L(COPY.iftarBody), url: '/food' });
    }
  }
  return out;
}
