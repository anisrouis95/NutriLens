// Training days: the usual week (each day: training, sometimes, or rest), this
// week's one-off changes, and a rebuild offer when the number of usual days no
// longer matches the program. The program keeps its order whatever the day.

import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { BellRing, RefreshCw } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppData } from '@/contexts/AppDataContext';
import { Button, Screen, Section, Txt, Why, useSnackbar } from '@/components/ds';
import DayDot from '@/components/train/DayDot';
import { weekDates } from '@/lib/activity';
import { dayKind, resetDay, scheduleOf, setDay, WEEK_ORDER, type DayKind } from '@/lib/schedule';
import { generateWorkoutPlan } from '@/lib/workoutGenerator';
import { radius, space, useTokens } from '@/theme';
import type { LocalizedText } from '@/lib/i18n';

const KIND_NAMES: Record<DayKind, LocalizedText> = {
  train: { en: 'Training', fr: 'Entraînement', tn: 'تمرين', tnLatn: 'Sport' },
  optional: { en: 'Sometimes', fr: 'Parfois', tn: 'ساعات', tnLatn: 'Sa3at' },
  rest: { en: 'Rest', fr: 'Repos', tn: 'راحة', tnLatn: 'Repos' },
};

export default function ScheduleScreen() {
  const t = useTokens();
  const router = useRouter();
  const snackbar = useSnackbar();
  const { L, weekdayName, formatDate } = useLanguage();
  const { profile, saveProfile, settings, updateSettings, workoutPlan, setWorkoutPlan, sessions, today } = useAppData();
  const [rebuilt, setRebuilt] = useState(false);
  if (!profile) return null;
  const schedule = scheduleOf(settings, profile);
  const usual = schedule.weekdays.length;
  const dates = weekDates(today);
  const doneOn = new Set(sessions.filter((s) => s.finishedAt).map((s) => s.date));

  // Usual week: training → sometimes → rest → training.
  const cycle = (d: number) => {
    const kind: DayKind = schedule.weekdays.includes(d) ? 'train' : schedule.optional.includes(d) ? 'optional' : 'rest';
    const next: DayKind = kind === 'train' ? 'optional' : kind === 'optional' ? 'rest' : 'train';
    updateSettings({
      schedule: {
        ...schedule,
        weekdays: next === 'train' ? [...schedule.weekdays, d].sort() : schedule.weekdays.filter((x) => x !== d),
        optional: next === 'optional' ? [...schedule.optional, d].sort() : schedule.optional.filter((x) => x !== d),
      },
    });
  };

  // This week: a date flips between training and rest; flipping back clears the change.
  const flip = (date: string) => {
    const kind = dayKind(schedule, date);
    const next = kind === 'train' ? 'rest' : 'train';
    updateSettings({ schedule: schedule.overrides[date] ? resetDay(schedule, date, today) : setDay(schedule, date, next, today) });
  };

  const rebuild = () => {
    const next = { ...profile, trainingDays: usual };
    saveProfile(next);
    setWorkoutPlan(generateWorkoutPlan(next));
    setRebuilt(true);
    snackbar.show(L({ en: 'New program ready', fr: 'Nouveau programme prêt', tn: 'البرنامج الجديد حاضر', tnLatn: 'Programme jdid 7adher' }));
  };
  const mismatch = !!workoutPlan && usual > 0 && usual !== workoutPlan.daysPerWeek && !rebuilt;

  return (
    <Screen back title={L({ en: 'Training days', fr: 'Jours d’entraînement', tn: 'أيّام التمرين', tnLatn: 'Iyem el sport' })}>
      <Txt tone="secondary">
        {L({
          en: 'Your sessions go in order (A, B, C, A…) whatever the day, so moving or skipping a day never breaks your program: the next session is simply the next one.',
          fr: 'Tes séances se suivent dans l’ordre (A, B, C, A…) quel que soit le jour : déplacer ou sauter un jour ne casse jamais ton programme, la prochaine séance est simplement la suivante.',
          tn: 'الحصص متاعك يمشيو بالترتيب (A، B، C، A…) مهما كان النهار، يعني كي تبدّل ولا تفوّت نهار البرنامج ما يتكسّرش: الحصّة الجاية هي اللي بعدها وبرّة.',
          tnLatn: 'Les séances mte3ek yemchiw bel tartib (A, B, C, A…) mahma ken e nhar, ya3ni ki tbaddel walla tfawwet nhar el programme ma yetkassarch: séance el jeya hiya eli ba3dha w barra.',
        })}
      </Txt>

      <Section title={L({ en: 'Your usual week', fr: 'Ta semaine habituelle', tn: 'الجمعة العادية متاعك', tnLatn: 'El jem3a el 3adia mte3ek' })}>
        <View style={styles.row}>
          {WEEK_ORDER.map((d) => {
            const kind: DayKind = schedule.weekdays.includes(d) ? 'train' : schedule.optional.includes(d) ? 'optional' : 'rest';
            const name = weekdayName(new Date(2026, 10, 1 + d), 'long');
            return (
              <DayDot
                key={d}
                label={weekdayName(new Date(2026, 10, 1 + d), 'short')}
                kind={kind}
                onPress={() => cycle(d)}
                a11y={`${name}: ${L(KIND_NAMES[kind])}`}
              />
            );
          })}
        </View>
        <View style={styles.legend}>
          {(['train', 'optional', 'rest'] as const).map((k) => (
            <View key={k} style={styles.legendItem}>
              <View
                style={[
                  styles.legendDot,
                  k === 'train' && { backgroundColor: t.accent },
                  k === 'optional' && { borderWidth: 2, borderColor: t.accent },
                  k === 'rest' && { backgroundColor: t.surfaceHigh },
                ]}
              />
              <Txt variant="caption" tone="secondary">
                {L(KIND_NAMES[k])}
              </Txt>
            </View>
          ))}
        </View>
        <Txt variant="caption" tone="tertiary" style={{ marginTop: space.md }}>
          {L({
            en: 'Tap a day to change it. Reminders come on training days; “sometimes” days never remind you and never count as missed.',
            fr: 'Touche un jour pour le changer. Les rappels arrivent les jours d’entraînement ; les jours « parfois » ne te rappellent rien et ne comptent jamais comme ratés.',
            tn: 'انزل على نهار باش تبدّلو. التذكيرات يجيو في أيّام التمرين؛ أيّام “ساعات” ما فيهمش تذكير وما يتحسبوش فايتين.',
            tnLatn: 'Enzel 3la nhar bech tbaddlou. Les rappels yjiw f iyem el sport; iyem “sa3at” ma fihomch rappel w ma yet7sbouch faytin.',
          })}
        </Txt>
        {mismatch ? (
          <Why
            title={L(
              {
                en: 'Your program has {{p}} sessions a week, you now train {{n}} days',
                fr: 'Ton programme a {{p}} séances par semaine, tu t’entraînes maintenant {{n}} jours',
                tn: 'البرنامج متاعك فيه {{p}} حصص في الجمعة، وانت توّا تتمرّن {{n}} أيّام',
                tnLatn: 'El programme mte3ek fih {{p}} séances fel jem3a, w enti taw tetmarren {{n}} iyem',
              },
              { p: workoutPlan?.daysPerWeek ?? 0, n: usual },
            )}
            initiallyOpen
            style={{ marginTop: space.lg }}
          >
            <Txt tone="secondary">
              {L({
                en: 'Keeping it is fine: the sessions just continue in order. A program built for your number of days spreads the muscles better across the week. Rebuilding replaces swaps you made; your history stays.',
                fr: 'Le garder, ça marche : les séances continuent dans l’ordre. Un programme fait pour ton nombre de jours répartit mieux les muscles sur la semaine. Le refaire remplace tes changements d’exercices ; ton historique reste.',
                tn: 'تخلّيه، يمشي: الحصص يكمّلو بالترتيب. أما برنامج مبني على عدد الأيّام متاعك يقسم العضلات خير على الجمعة. كي تعاودو، التبديلات اللي عملتهم يمشيو؛ التاريخ متاعك يقعد.',
                tnLatn: 'T5allih, yemchi: les séances ykammlou bel tartib. Ama programme mabni 3la 3adad el iyem mte3ek ya9sem el muscles 5ir 3al jem3a. Ki t3awdou, les changements eli 3malthom yemchiw; l historique mte3ek yo93ed.',
              })}
            </Txt>
            <Button
              variant="tonal"
              label={L(
                { en: 'Rebuild for {{n}} days', fr: 'Refaire pour {{n}} jours', tn: 'عاودو على {{n}} أيّام', tnLatn: '3awdou 3la {{n}} iyem' },
                { n: usual },
              )}
              icon={(c) => <RefreshCw size={20} color={c} />}
              onPress={rebuild}
              style={{ marginTop: space.md, alignSelf: 'flex-start' }}
            />
          </Why>
        ) : null}
      </Section>

      <Section title={L({ en: 'This week', fr: 'Cette semaine', tn: 'الجمعة هاذي', tnLatn: 'El jem3a hedhi' })}>
        <View style={styles.row}>
          {dates.map((date) => {
            // A day that passed shows what happened (done or not), not what was planned.
            const kind = date < today ? 'rest' : dayKind(schedule, date);
            const day = new Date(date + 'T12:00:00');
            return (
              <DayDot
                key={date}
                label={weekdayName(day, 'narrow')}
                sub={String(day.getDate())}
                kind={kind}
                done={doneOn.has(date)}
                today={date === today}
                onPress={date >= today ? () => flip(date) : undefined}
                a11y={`${formatDate(day, { weekday: 'long', day: 'numeric', month: 'long' })}: ${L(KIND_NAMES[kind])}`}
              />
            );
          })}
        </View>
        <Txt variant="caption" tone="tertiary" style={{ marginTop: space.md }}>
          {L({
            en: 'Tired or busy? Tap a day to make it a rest or a training day, for this week only.',
            fr: 'Fatigué ou pris ? Touche un jour pour en faire un jour de repos ou d’entraînement, pour cette semaine seulement.',
            tn: 'فشلان ولا مشغول؟ انزل على نهار باش تردّو راحة ولا تمرين، للجمعة هاذي برك.',
            tnLatn: 'Fechlan walla machghoul? Enzel 3la nhar bech traddou repos walla sport, lel jem3a hedhi bark.',
          })}
        </Txt>
      </Section>

      <Button
        variant="outlined"
        label={L({ en: 'Reminder settings', fr: 'Réglages des rappels', tn: 'إعدادات التذكير', tnLatn: 'Paramètres rappels' })}
        icon={(c) => <BellRing size={20} color={c} />}
        onPress={() => router.push('/notifications')}
        style={{ marginTop: space.xxl, alignSelf: 'flex-start' }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row' },
  legend: { flexDirection: 'row', gap: space.lg, marginTop: space.lg },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  legendDot: { width: 12, height: 12, borderRadius: radius.pill },
});
