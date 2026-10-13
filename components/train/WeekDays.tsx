// This week, Monday to Sunday: weight days filled volt, cardio days a volt
// ring, both a filled day with a dot (the same marks as the Activity
// calendar). The whole strip opens Activity.

import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppData } from '@/contexts/AppDataContext';
import { Tap, Txt, DirIcon } from '@/components/ds';
import { activityByDay, weekDates } from '@/lib/activity';
import { space, useTokens } from '@/theme';

const DAY = 36;

export default function WeekDays({ perWeek }: { perWeek: number }) {
  const t = useTokens();
  const router = useRouter();
  const { L, language, weekdayName } = useLanguage();
  const { sessions, cardio, today } = useAppData();
  const dates = weekDates(today);
  const days = useMemo(() => activityByDay(sessions, cardio), [sessions, cardio]);
  const done = sessions.filter((s) => s.finishedAt && s.date >= dates[0] && s.date <= dates[6]).length;
  const count = L(
    { en: '{{done}}/{{total}} sessions', fr: '{{done}}/{{total}} séances', tn: '{{done}}/{{total}} حصص', tnLatn: '{{done}}/{{total}} séances' },
    { done: Math.min(done, perWeek || done), total: perWeek },
  );

  return (
    <Tap
      onPress={() => router.push('/activity')}
      pressScale={0.99}
      accessibilityLabel={`${L({ en: 'This week', fr: 'Cette semaine', tn: 'الجمعة هاذي', tnLatn: 'El jem3a hedhi' })}: ${count}. ${L({
        en: 'Open your activity',
        fr: 'Ouvrir ton activité',
        tn: 'حلّ النشاط متاعك',
        tnLatn: "7el l'activité mte3ek",
      })}`}
    >
      <View style={styles.head}>
        <Txt variant="overline" tone="secondary" style={{ flex: 1 }}>
          {L({ en: 'This week', fr: 'Cette semaine', tn: 'الجمعة هاذي', tnLatn: 'El jem3a hedhi' })}
        </Txt>
        {perWeek ? (
          <Txt variant="overline" tone={done >= perWeek ? 'accent' : 'primary'}>
            {count}
          </Txt>
        ) : null}
        <DirIcon icon={ChevronRight} size={18} color={t.textTertiary} />
      </View>
      <View style={styles.row}>
        {dates.map((d) => {
          const a = days.get(d);
          const weights = !!a?.workouts.length;
          const cardioDay = !!a?.cardio.length;
          const future = d > today;
          return (
            <View key={d} style={styles.cell}>
              <Txt variant="overline" tone={d === today ? 'primary' : 'tertiary'}>
                {weekdayName(new Date(d + 'T12:00:00'), 'narrow')}
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
                  {Number(d.slice(8))}
                </Txt>
                {weights && cardioDay ? <View style={[styles.dot, { backgroundColor: t.onAccent }]} /> : null}
              </View>
            </View>
          );
        })}
      </View>
    </Tap>
  );
}

const styles = StyleSheet.create({
  head: { flexDirection: 'row', alignItems: 'center', gap: space.sm, minHeight: 24 },
  row: { flexDirection: 'row', marginTop: space.sm },
  cell: { flex: 1, alignItems: 'center', gap: space.xs },
  day: { width: DAY, height: DAY, borderRadius: DAY / 2, alignItems: 'center', justifyContent: 'center' },
  num: { fontSize: 16, lineHeight: 20 },
  dot: { position: 'absolute', bottom: 4, width: 4, height: 4, borderRadius: 2 },
});
