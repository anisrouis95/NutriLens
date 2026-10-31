// This week, Monday to Sunday: weight days filled volt, cardio days a volt
// ring, both a filled day with a dot (the same marks as the Activity
// calendar). Under each day, a small mark for the plan: volt = training day,
// ring = "sometimes". The heading opens Activity; a day from today on opens a
// sheet to make it a training or rest day for this week only.

import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { CalendarDays, ChevronRight } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppData } from '@/contexts/AppDataContext';
import { Button, DirIcon, Sheet, Tap, Txt } from '@/components/ds';
import { activityByDay, weekDates } from '@/lib/activity';
import { dayKind, plannedCount, resetDay, scheduleOf, setDay } from '@/lib/schedule';
import { space, useTokens } from '@/theme';

const DAY = 36;

export default function WeekDays() {
  const t = useTokens();
  const router = useRouter();
  const { L, weekdayName, formatDate } = useLanguage();
  const { profile, settings, updateSettings, sessions, cardio, today } = useAppData();
  const [editing, setEditing] = useState<string | null>(null);
  const schedule = scheduleOf(settings, profile);
  const dates = weekDates(today);
  const days = useMemo(() => activityByDay(sessions, cardio), [sessions, cardio]);
  const done = sessions.filter((s) => s.finishedAt && s.date >= dates[0] && s.date <= dates[6]).length;
  const perWeek = plannedCount(schedule, dates);
  const count = L(
    { en: '{{done}}/{{total}} sessions', fr: '{{done}}/{{total}} séances', tn: '{{done}}/{{total}} حصص', tnLatn: '{{done}}/{{total}} séances' },
    { done, total: perWeek },
  );

  const kind = editing ? dayKind(schedule, editing) : 'rest';
  const changed = editing ? !!schedule.overrides[editing] : false;
  const close = () => setEditing(null);

  return (
    <View>
      <Tap
        onPress={() => router.push('/activity')}
        pressScale={0.99}
        accessibilityLabel={`${L({ en: 'This week', fr: 'Cette semaine', tn: 'الجمعة هاذي', tnLatn: 'El jem3a hedhi' })}: ${count}. ${L({
          en: 'Open your activity',
          fr: 'Ouvrir ton activité',
          tn: 'حلّ النشاط متاعك',
          tnLatn: "7el l'activité mte3ek",
        })}`}
        style={styles.head}
      >
        <Txt variant="overline" tone="secondary" style={{ flex: 1 }}>
          {L({ en: 'This week', fr: 'Cette semaine', tn: 'الجمعة هاذي', tnLatn: 'El jem3a hedhi' })}
        </Txt>
        {perWeek ? (
          <Txt variant="overline" tone={done >= perWeek ? 'accent' : 'primary'}>
            {count}
          </Txt>
        ) : null}
        <DirIcon icon={ChevronRight} size={18} color={t.textTertiary} />
      </Tap>
      <View style={styles.row}>
        {dates.map((d) => {
          const a = days.get(d);
          const weights = !!a?.workouts.length;
          const cardioDay = !!a?.cardio.length;
          const future = d > today;
          const plan = dayKind(schedule, d);
          const date = new Date(d + 'T12:00:00');
          return (
            <Tap
              key={d}
              onPress={d >= today ? () => setEditing(d) : () => router.push('/activity')}
              pressScale={0.92}
              haptic="selection"
              accessibilityLabel={`${formatDate(date, { weekday: 'long', day: 'numeric', month: 'long' })}${plan === 'train' ? `, ${L({ en: 'training day', fr: 'jour d’entraînement', tn: 'نهار تمرين', tnLatn: 'nhar sport' })}` : ''}`}
              style={styles.cell}
            >
              <Txt variant="overline" tone={d === today ? 'primary' : 'tertiary'}>
                {weekdayName(date, 'narrow')}
              </Txt>
              <View
                style={[
                  styles.day,
                  weights && { backgroundColor: t.accent },
                  !weights && cardioDay && { borderWidth: 2, borderColor: t.accent },
                  !weights && !cardioDay && d === today && { borderWidth: 1, borderColor: t.textTertiary },
                ]}
              >
                <Txt
                  variant="numLarge"
                  style={styles.num}
                  color={weights ? t.onAccent : future ? t.textDisabled : cardioDay || d === today ? t.text : t.textSecondary}
                >
                  {String(date.getDate())}
                </Txt>
                {weights && cardioDay ? <View style={[styles.dot, { backgroundColor: t.onAccent }]} /> : null}
              </View>
              {/* The plan: volt for a training day still to do, a ring for "sometimes", grey for one that passed. */}
              <View
                style={[
                  styles.plan,
                  plan === 'train' && !weights && { backgroundColor: d < today ? t.textTertiary : t.accent },
                  plan === 'optional' && !weights && { borderWidth: 1, borderColor: t.accent },
                ]}
              />
            </Tap>
          );
        })}
      </View>

      <Sheet
        visible={!!editing}
        onClose={close}
        title={editing ? formatDate(new Date(editing + 'T12:00:00'), { weekday: 'long', day: 'numeric', month: 'long' }) : ''}
      >
        <Txt tone="secondary">
          {kind === 'train'
            ? L({ en: 'A training day.', fr: 'Un jour d’entraînement.', tn: 'نهار تمرين.', tnLatn: 'Nhar sport.' })
            : kind === 'optional'
              ? L({ en: 'A day you train some weeks.', fr: 'Un jour où tu t’entraînes certaines semaines.', tn: 'نهار تتمرّن فيه ساعات.', tnLatn: 'Nhar tetmarren fih sa3at.' })
              : L({ en: 'A rest day.', fr: 'Un jour de repos.', tn: 'نهار راحة.', tnLatn: 'Nhar repos.' })}
          {changed ? ` ${L({ en: '(this week only)', fr: '(cette semaine seulement)', tn: '(الجمعة هاذي برك)', tnLatn: '(el jem3a hedhi bark)' })}` : ''}
        </Txt>
        <View style={styles.actions}>
          {editing && kind === 'train' ? (
            <Button
              label={L({ en: 'Make it a rest day', fr: 'En faire un jour de repos', tn: 'ردّو نهار راحة', tnLatn: 'Raddou nhar repos' })}
              onPress={() => {
                updateSettings({ schedule: setDay(schedule, editing, 'rest', today) });
                close();
              }}
              size="lg"
              fill
            />
          ) : editing ? (
            <Button
              label={L({ en: 'Train this day', fr: 'M’entraîner ce jour-là', tn: 'نتمرّن النهار هذا', tnLatn: 'Netmarren e nhar hedha' })}
              onPress={() => {
                updateSettings({ schedule: setDay(schedule, editing, 'train', today) });
                close();
              }}
              size="lg"
              fill
            />
          ) : null}
          {editing && changed ? (
            <Button
              variant="outlined"
              label={L({ en: 'Back to my usual week', fr: 'Revenir à ma semaine habituelle', tn: 'ارجع للجمعة العادية', tnLatn: 'Erja3 lel jem3a el 3adia' })}
              onPress={() => {
                updateSettings({ schedule: resetDay(schedule, editing, today) });
                close();
              }}
              size="lg"
              fill
            />
          ) : null}
          <Button
            variant="text"
            label={L({ en: 'Change my usual days', fr: 'Changer mes jours habituels', tn: 'بدّل الأيّام العادية متاعي', tnLatn: 'Baddel iyemi el 3adia' })}
            icon={(c) => <CalendarDays size={20} color={c} />}
            onPress={() => {
              close();
              router.push('/schedule');
            }}
          />
        </View>
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: space.sm, minHeight: 24 },
  row: { flexDirection: 'row', marginTop: space.sm },
  cell: { flex: 1, alignItems: 'center', gap: space.xs },
  day: { width: DAY, height: DAY, borderRadius: DAY / 2, alignItems: 'center', justifyContent: 'center' },
  num: { fontSize: 16, lineHeight: 20 },
  dot: { position: 'absolute', bottom: 4, width: 4, height: 4, borderRadius: 2 },
  plan: { width: 6, height: 6, borderRadius: 3 },
  actions: { gap: space.sm, marginTop: space.xl },
});
