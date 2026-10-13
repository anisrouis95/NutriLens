// Activity: a month calendar of training days (weights filled volt, cardio a
// volt ring, both a filled day with a dot), the month's totals against the
// month before, what happened on the selected day, and the best lift per
// exercise this month against the best before it.

import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Activity as ActivityIcon,
  Bike,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUp,
  Dumbbell,
  Footprints,
  Gauge,
  HeartPulse,
  Orbit,
  Plus,
  Waves,
} from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppData } from '@/contexts/AppDataContext';
import { Appear, Button, Group, IconButton, Screen, Section, Tap, Txt, useFormat, DirIcon } from '@/components/ds';
import {
  activityByDay,
  liftProgress,
  monthOf,
  monthStats,
  monthWeeks,
  shiftMonth,
  workoutMinutes,
  workoutVolume,
  type DayActivity,
} from '@/lib/activity';
import { describeSegments, machineInfo, sessionMinutes } from '@/lib/cardio';
import { exerciseName, getExercise } from '@/lib/exercises';
import { space, useTokens } from '@/theme';
import type { CardioMachine, CardioSession, WorkoutSession } from '@/types';

const CARDIO_ICONS: Record<CardioMachine, typeof Gauge> = {
  treadmill: Gauge,
  walk: Footprints,
  run: ActivityIcon,
  bike: Bike,
  elliptical: Orbit,
  rower: Waves,
  stairs: ChevronsUp,
  other: HeartPulse,
};

const WEEK_COL = 44;
const DAY = 38;

export default function ActivityScreen() {
  const t = useTokens();
  const router = useRouter();
  const fmt = useFormat();
  const { L, language, formatDate, weekdayName } = useLanguage();
  const { sessions, cardio, today } = useAppData();

  const days = useMemo(() => activityByDay(sessions, cardio), [sessions, cardio]);
  const [month, setMonth] = useState(monthOf(today));
  const [selected, setSelected] = useState(today);

  const weeks = useMemo(() => monthWeeks(month), [month]);
  const stats = useMemo(() => monthStats(month, days), [month, days]);
  const prevStats = useMemo(() => monthStats(shiftMonth(month, -1), days), [month, days]);
  const lifts = useMemo(() => liftProgress(month, sessions), [month, sessions]);
  const [showAllLifts, setShowAllLifts] = useState(false);

  const monthName = (m: string) => {
    const s = formatDate(new Date(m + '-15T12:00:00'), { month: 'long', year: 'numeric' });
    return s.charAt(0).toUpperCase() + s.slice(1);
  };
  const shortMonth = (m: string) => formatDate(new Date(m + '-15T12:00:00'), { month: 'short' }).replace('.', '');

  const goMonth = (delta: number) => {
    const next = shiftMonth(month, delta);
    if (next > monthOf(today)) return;
    setMonth(next);
    // Select today in the current month, otherwise the month's last active day (or its 1st).
    if (next === monthOf(today)) setSelected(today);
    else {
      const active = [...days.keys()].filter((d) => monthOf(d) === next).sort();
      setSelected(active[active.length - 1] ?? `${next}-01`);
    }
  };

  const weekdays = useMemo(() => {
    const monday = new Date('2026-01-05T12:00:00'); // a Monday
    return Array.from({ length: 7 }, (_, i) =>
      weekdayName(new Date(monday.getTime() + i * 86400000), 'narrow'),
    );
  }, [weekdayName]);

  const day: DayActivity | undefined = days.get(selected);
  const dayTitle = (() => {
    if (selected === today) return L({ en: 'Today', fr: 'Aujourd’hui', tn: 'اليوم', tnLatn: 'Lyoum' });
    const s = formatDate(new Date(selected + 'T12:00:00'), { weekday: 'long', day: 'numeric', month: 'long' });
    return s.charAt(0).toUpperCase() + s.slice(1);
  })();

  const delta = (now: number, before: number, decimals = 0) => {
    if (!now && !before) return ' ';
    const d = now - before;
    const v = fmt(Math.abs(d), decimals);
    return L({ en: '{{d}} vs {{m}}', fr: '{{d}} vs {{m}}', tn: '{{d}} على {{m}}', tnLatn: '{{d}} vs {{m}}' }, {
      d: d === 0 ? '=' : `${d > 0 ? '+' : '−'}${v}`,
      m: shortMonth(shiftMonth(month, -1)),
    });
  };
  const hours = (min: number) => Math.round((min / 60) * 10) / 10;

  const empty = stats.activeDays === 0;
  const visibleLifts = showAllLifts ? lifts : lifts.slice(0, 6);

  return (
    <Screen
      back
      title={L({ en: 'Activity', fr: 'Activité', tn: 'النشاط', tnLatn: 'Activité' })}
      actions={
        <IconButton
          label={L({ en: 'Log cardio', fr: 'Noter du cardio', tn: 'سجّل كارديو', tnLatn: 'Sajjel cardio' })}
          onPress={() => router.push({ pathname: '/cardio', params: { date: selected <= today ? selected : today } })}
          icon={(c) => <Plus size={24} color={c} />}
        />
      }
    >
      {/* Month filter */}
      <View style={styles.monthRow}>
        <IconButton
          label={L({ en: 'Previous month', fr: 'Mois précédent', tn: 'الشهر اللي فات', tnLatn: 'Chhar eli fet' })}
          onPress={() => goMonth(-1)}
          icon={(c) => <DirIcon icon={ChevronLeft} size={24} color={c} />}
        />
        <Txt variant="title" align="center" style={{ flex: 1 }} accessibilityRole="header" accessibilityLiveRegion="polite">
          {monthName(month)}
        </Txt>
        <IconButton
          label={L({ en: 'Next month', fr: 'Mois suivant', tn: 'الشهر اللي بعدو', tnLatn: 'Chhar eli ba3dou' })}
          onPress={() => goMonth(1)}
          disabled={month >= monthOf(today)}
          icon={(c) => <DirIcon icon={ChevronRight} size={24} color={c} />}
        />
      </View>

      {/* Calendar */}
      <View style={styles.headRow}>
        {weekdays.map((w, i) => (
          <Txt key={i} variant="overline" tone="tertiary" align="center" style={styles.cell}>
            {w}
          </Txt>
        ))}
        <Txt variant="overline" tone="tertiary" align="center" style={{ width: WEEK_COL }}>
          min
        </Txt>
      </View>
      {weeks.map((week, wi) => {
        const weekMin = week.reduce((sum, d) => sum + (d ? days.get(d)?.minutes ?? 0 : 0), 0);
        return (
          <View key={wi} style={styles.weekRow}>
            {week.map((d, di) => {
              if (!d) return <View key={di} style={styles.cell} />;
              const a = days.get(d);
              const weights = !!a?.workouts.length;
              const cardioDay = !!a?.cardio.length;
              const future = d > today;
              const isSel = d === selected;
              const label = [
                formatDate(new Date(d + 'T12:00:00'), { weekday: 'long', day: 'numeric', month: 'long' }),
                weights ? L({ en: 'weights', fr: 'musculation', tn: 'حديد', tnLatn: 'musculation' }) : null,
                cardioDay ? L({ en: 'cardio', fr: 'cardio', tn: 'كارديو', tnLatn: 'cardio' }) : null,
              ]
                .filter(Boolean)
                .join(', ');
              return (
                <Tap
                  key={di}
                  onPress={() => setSelected(d)}
                  disabled={future}
                  dimWhenDisabled={false}
                  pressScale={0.92}
                  haptic="selection"
                  accessibilityLabel={label}
                  accessibilityState={{ selected: isSel }}
                  style={styles.cell}
                >
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
                      style={styles.dayNum}
                      color={weights ? t.onAccent : future ? t.textDisabled : cardioDay || d === today ? t.text : t.textSecondary}
                    >
                      {Number(d.slice(8))}
                    </Txt>
                    {weights && cardioDay ? <View style={[styles.dot, { backgroundColor: t.onAccent }]} /> : null}
                  </View>
                  <View style={[styles.selBar, { backgroundColor: isSel ? t.select : 'transparent' }]} />
                </Tap>
              );
            })}
            <Txt variant="numSmall" tone={weekMin ? 'secondary' : 'disabled'} align="center" style={{ width: WEEK_COL }}>
              {weekMin ? fmt(weekMin) : '—'}
            </Txt>
          </View>
        );
      })}
      <View style={styles.legend}>
        <LegendItem kind="weights" label={L({ en: 'Weights', fr: 'Muscu', tn: 'حديد', tnLatn: 'Muscu' })} />
        <LegendItem kind="cardio" label={L({ en: 'Cardio', fr: 'Cardio', tn: 'كارديو', tnLatn: 'Cardio' })} />
        <LegendItem kind="both" label={L({ en: 'Both', fr: 'Les deux', tn: 'الزوز', tnLatn: 'Ezzouz' })} />
      </View>

      {/* Month totals */}
      <Section title={L({ en: 'This month', fr: 'Ce mois-ci', tn: 'الشهر هذا', tnLatn: 'El chhar hedha' })}>
        {empty ? (
          <Txt tone="secondary">
            {month === monthOf(today)
              ? L({
                  en: 'Nothing logged yet this month. Your first workout fills its day here.',
                  fr: 'Rien de noté ce mois-ci. Ta première séance remplira son jour ici.',
                  tn: 'ما سجّلت شي الشهر هذا. أوّل حصّة تعمّر نهارها هوني.',
                  tnLatn: 'Ma sajjelt chay el chhar hedha. Awwel séance t3ammer nharha houni.',
                })
              : L(
                  { en: 'Nothing logged in {{m}}.', fr: 'Rien de noté en {{m}}.', tn: 'ما تسجّل شي في {{m}}.', tnLatn: 'Ma tsajjel chay fi {{m}}.' },
                  { m: monthName(month).toLowerCase() },
                )}
          </Txt>
        ) : (
          <View style={styles.statsGrid}>
            <Stat
              value={fmt(stats.workouts)}
              label={L({ en: 'Workouts', fr: 'Séances', tn: 'الحصص', tnLatn: 'Séances' })}
              note={delta(stats.workouts, prevStats.workouts)}
            />
            <Stat value={fmt(stats.cardio)} label={L({ en: 'Cardio', fr: 'Cardio', tn: 'كارديو', tnLatn: 'Cardio' })} note={delta(stats.cardio, prevStats.cardio)} />
            <Stat
              value={fmt(stats.activeDays)}
              label={L({ en: 'Active days', fr: 'Jours actifs', tn: 'أيّام نشاط', tnLatn: 'Ayyem nchat' })}
              note={delta(stats.activeDays, prevStats.activeDays)}
            />
            <Stat
              value={fmt(hours(stats.minutes), 1)}
              label={L({ en: 'Hours', fr: 'Heures', tn: 'سوايع', tnLatn: 'Swaya3' })}
              note={delta(hours(stats.minutes), hours(prevStats.minutes), 1)}
            />
            <Stat
              value={fmt(stats.volumeKg)}
              label={L({ en: 'Kg lifted', fr: 'Kg soulevés', tn: 'Kg هزّيت', tnLatn: 'Kg hazzit' })}
              note={delta(stats.volumeKg, prevStats.volumeKg)}
            />
            <Stat
              value={fmt(stats.distanceKm, 1)}
              label={L({ en: 'Km cardio', fr: 'Km cardio', tn: 'Km كارديو', tnLatn: 'Km cardio' })}
              note={delta(stats.distanceKm, prevStats.distanceKm, 1)}
            />
          </View>
        )}
      </Section>

      {/* The selected day */}
      <Section title={dayTitle}>
        {day && (day.workouts.length || day.cardio.length) ? (
          <Group>
            {day.workouts.map((w, i) => (
              <WorkoutRow key={w.id} session={w} divider={i < day.workouts.length - 1 || day.cardio.length > 0} />
            ))}
            {day.cardio.map((c, i) => (
              <CardioRow key={c.id} session={c} divider={i < day.cardio.length - 1} />
            ))}
          </Group>
        ) : (
          <Txt tone="secondary">
            {selected > today
              ? L({ en: 'Still to come.', fr: 'Pas encore arrivé.', tn: 'مازال ما جاش.', tnLatn: 'Mazel ma jech.' })
              : L({ en: 'Rest day. Nothing logged.', fr: 'Jour de repos. Rien de noté.', tn: 'نهار راحة. ما تسجّل شي.', tnLatn: 'Nhar repos. Ma tsajjel chay.' })}
          </Txt>
        )}
        {selected <= today ? (
          <Button
            label={L({ en: 'Log cardio for this day', fr: 'Noter du cardio ce jour-là', tn: 'سجّل كارديو للنهار هذا', tnLatn: 'Sajjel cardio l nhar hedha' })}
            variant="tonal"
            icon={(c) => <Plus size={18} color={c} strokeWidth={2.6} />}
            onPress={() => router.push({ pathname: '/cardio', params: { date: selected } })}
            style={{ marginTop: space.md }}
          />
        ) : null}
      </Section>

      {/* Best lift per exercise this month */}
      {lifts.length ? (
        <Section title={L({ en: 'Strength this month', fr: 'Force ce mois-ci', tn: 'القوّة الشهر هذا', tnLatn: '9owwa el chhar hedha' })}>
          <Txt variant="caption" tone="secondary" style={{ marginBottom: space.md }}>
            {L({
              en: 'Your best set of each exercise this month, against your best before it.',
              fr: 'Ta meilleure série de chaque exercice ce mois-ci, comparée à ta meilleure avant.',
              tn: 'أحسن سيري في كل تمرين الشهر هذا، مقارنة بأحسن وحدة قبلها.',
              tnLatn: 'A7sen série f kol exercice el chhar hedha, m9arna b a7sen wa7da 9balha.',
            })}
          </Txt>
          <Group>
            {visibleLifts.map((p, i) => {
              const ex = getExercise(p.exerciseId);
              const set = (s: { weightKg: number; reps: number }) =>
                s.weightKg
                  ? `${fmt(s.weightKg, Number.isInteger(s.weightKg) ? 0 : 1)} kg × ${s.reps}`
                  : `${s.reps} ${L({ en: 'reps', fr: 'rép.', tn: 'مرّات', tnLatn: 'reps' })}`;
              let change: { text: string; up: boolean };
              if (!p.before) change = { text: L({ en: 'First time', fr: 'Première fois', tn: 'أوّل مرّة', tnLatn: 'Awwel marra' }), up: false };
              else if (p.best.weightKg > p.before.weightKg)
                change = { text: `+${fmt(p.best.weightKg - p.before.weightKg, 1).replace(/[.,]0$/, '')} kg`, up: true };
              else if (p.best.weightKg === p.before.weightKg && p.best.reps > p.before.reps)
                change = { text: `+${p.best.reps - p.before.reps} ${L({ en: 'reps', fr: 'rép.', tn: 'مرّات', tnLatn: 'reps' })}`, up: true };
              else change = { text: L({ en: 'Same as before', fr: 'Comme avant', tn: 'كيف قبل', tnLatn: 'Kif 9bal' }), up: false };
              return (
                <View key={p.exerciseId} style={[styles.liftRow, i < visibleLifts.length - 1 && { borderBottomColor: t.hairline, borderBottomWidth: StyleSheet.hairlineWidth }]}>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Txt variant="bodyStrong" numberOfLines={2}>
                      {ex ? exerciseName(ex, language) : p.exerciseId}
                    </Txt>
                    <Txt variant="numSmall" tone="secondary" style={{ marginTop: 2 }}>
                      {set(p.best)}
                      {p.before ? (
                        <Txt variant="numSmall" tone="tertiary">{`  ·  ${L({ en: 'before', fr: 'avant', tn: 'قبل', tnLatn: '9bal' })} ${set(p.before)}`}</Txt>
                      ) : null}
                    </Txt>
                  </View>
                  <Txt variant="label" color={change.up ? t.accentText : t.textTertiary} style={{ textAlign: 'right' }}>
                    {change.text}
                  </Txt>
                </View>
              );
            })}
          </Group>
          {lifts.length > 6 ? (
            <Button
              label={
                showAllLifts
                  ? L({ en: 'Show less', fr: 'Voir moins', tn: 'ورّي أقل', tnLatn: 'Warri a9al' })
                  : L({ en: 'Show all {{n}}', fr: 'Voir les {{n}}', tn: 'ورّي الـ {{n}} الكل', tnLatn: 'Warri el {{n}} lkol' }, { n: lifts.length })
              }
              variant="text"
              onPress={() => setShowAllLifts((v) => !v)}
              style={{ marginTop: space.xs, marginLeft: -space.md }}
            />
          ) : null}
        </Section>
      ) : null}
    </Screen>
  );
}

function LegendItem({ kind, label }: { kind: 'weights' | 'cardio' | 'both'; label: string }) {
  const t = useTokens();
  return (
    <View style={styles.legendItem}>
      <View
        style={[
          styles.legendMark,
          kind === 'cardio' ? { borderWidth: 2, borderColor: t.accent } : { backgroundColor: t.accent },
        ]}
      >
        {kind === 'both' ? <View style={[styles.legendDot, { backgroundColor: t.onAccent }]} /> : null}
      </View>
      <Txt variant="caption" tone="secondary">
        {label}
      </Txt>
    </View>
  );
}

function Stat({ value, label, note }: { value: string; label: string; note: string }) {
  return (
    <View style={styles.stat}>
      <Txt variant="numLarge" style={styles.statValue} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Txt>
      <Txt variant="overline" tone="tertiary" numberOfLines={1}>
        {label}
      </Txt>
      <Txt variant="caption" tone="tertiary" numberOfLines={1}>
        {note}
      </Txt>
    </View>
  );
}

function WorkoutRow({ session, divider }: { session: WorkoutSession; divider: boolean }) {
  const t = useTokens();
  const fmt = useFormat();
  const { L, language } = useLanguage();
  const [open, setOpen] = useState(false);
  const done = session.sets.filter((s) => s.done);
  const minutes = workoutMinutes(session);
  const facts = [
    L({ en: '{{n}} sets', fr: '{{n}} séries', tn: '{{n}} سيريات', tnLatn: '{{n}} séries' }, { n: done.length }),
    workoutVolume(session) ? `${fmt(Math.round(workoutVolume(session)))} kg` : null,
    minutes ? `${minutes} min` : L({ en: 'not finished', fr: 'pas terminée', tn: 'ما كملتش', tnLatn: 'ma kmeltech' }),
  ]
    .filter(Boolean)
    .join(' · ');
  // Done sets grouped by exercise, in the order they were done.
  const byExercise = done.reduce<Map<string, typeof done>>((map, s) => {
    map.set(s.exerciseId, [...(map.get(s.exerciseId) ?? []), s]);
    return map;
  }, new Map());
  return (
    <View>
      <Tap
        onPress={() => setOpen((o) => !o)}
        pressScale={1}
        pressedStyle={{ backgroundColor: t.pressed }}
        accessibilityState={{ expanded: open }}
        style={styles.row}
      >
        <View style={[styles.rowIcon, { backgroundColor: t.accent }]}>
          <Dumbbell size={20} color={t.onAccent} />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Txt variant="bodyStrong" numberOfLines={1}>
            {L(session.dayName)}
          </Txt>
          <Txt variant="numSmall" tone="secondary" style={{ marginTop: 2 }}>
            {facts}
          </Txt>
        </View>
        <ChevronDown size={20} color={t.textTertiary} style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }} />
      </Tap>
      {open ? (
        <Appear offset={4} style={styles.rowBody}>
          {[...byExercise.entries()].map(([id, sets]) => {
            const ex = getExercise(id);
            return (
              <View key={id} style={{ marginBottom: space.sm }}>
                <Txt variant="label">{ex ? exerciseName(ex, language) : id}</Txt>
                <Txt variant="numSmall" tone="secondary">
                  {sets.map((s) => (s.weightKg ? `${fmt(s.weightKg, Number.isInteger(s.weightKg) ? 0 : 1)}×${s.reps}` : `${s.reps}`)).join(' · ')}
                </Txt>
              </View>
            );
          })}
        </Appear>
      ) : null}
      {divider ? <View style={[styles.divider, { backgroundColor: t.hairline }]} /> : null}
    </View>
  );
}

function CardioRow({ session, divider }: { session: CardioSession; divider: boolean }) {
  const t = useTokens();
  const router = useRouter();
  const fmt = useFormat();
  const { L } = useLanguage();
  const Icon = CARDIO_ICONS[session.machine];
  const facts = [
    `${fmt(sessionMinutes(session))} min`,
    session.distanceKm ? `${fmt(session.distanceKm, 2)} km` : null,
    `≈${fmt(session.kcal)} kcal`,
  ]
    .filter(Boolean)
    .join(' · ');
  return (
    <View>
      <Tap
        onPress={() => router.push({ pathname: '/cardio', params: { id: session.id } })}
        pressScale={1}
        pressedStyle={{ backgroundColor: t.pressed }}
        accessibilityHint={L({ en: 'Opens it to edit', fr: 'L’ouvre pour le modifier', tn: 'يحلّو باش تبدّلو', tnLatn: 'Y7ellou bech tbaddlou' })}
        style={styles.row}
      >
        <View style={[styles.rowIcon, { borderWidth: 2, borderColor: t.accent }]}>
          <Icon size={18} color={t.text} />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Txt variant="bodyStrong" numberOfLines={1}>
            {L(machineInfo(session.machine).name)}
          </Txt>
          <Txt variant="numSmall" tone="secondary" style={{ marginTop: 2 }}>
            {facts}
          </Txt>
          <Txt variant="caption" tone="tertiary" style={{ marginTop: 2 }}>
            {describeSegments(session.machine, session.segments, L, fmt)}
          </Txt>
        </View>
        <DirIcon icon={ChevronRight} size={20} color={t.textTertiary} />
      </Tap>
      {divider ? <View style={[styles.divider, { backgroundColor: t.hairline }]} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  monthRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: -space.md, marginBottom: space.sm },
  headRow: { flexDirection: 'row', alignItems: 'center', marginBottom: space.xs },
  weekRow: { flexDirection: 'row', alignItems: 'center' },
  cell: { flex: 1, alignItems: 'center', paddingVertical: 2 },
  day: { width: DAY, height: DAY, borderRadius: DAY / 2, alignItems: 'center', justifyContent: 'center' },
  dayNum: { fontSize: 17, lineHeight: 21 },
  dot: { position: 'absolute', bottom: 5, width: 4, height: 4, borderRadius: 2 },
  selBar: { width: 16, height: 3, borderRadius: 2, marginTop: 3 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', gap: space.lg, marginTop: space.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: space.xs + 2 },
  legendMark: { width: 14, height: 14, borderRadius: 7, alignItems: 'center', justifyContent: 'center' },
  legendDot: { width: 4, height: 4, borderRadius: 2 },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', rowGap: space.lg },
  stat: { width: '33.33%', paddingRight: space.sm, gap: 2 },
  statValue: { fontSize: 30, lineHeight: 34 },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingHorizontal: space.lg, paddingVertical: space.md, minHeight: 64 },
  rowIcon: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  rowBody: { paddingLeft: space.lg + 40 + space.md, paddingRight: space.lg, paddingBottom: space.sm },
  divider: { height: StyleSheet.hairlineWidth, marginLeft: space.lg + 40 + space.md },
  liftRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingHorizontal: space.lg, paddingVertical: space.md, minHeight: 64 },
});
