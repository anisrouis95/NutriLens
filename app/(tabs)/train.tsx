import { type ReactNode, useMemo, useState } from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from 'react-native-reanimated';
import {
  BookOpen,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Dumbbell,
  HeartPulse,
  Play,
  RefreshCw,
  TrendingUp,
} from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppData } from '@/contexts/AppDataContext';
import {
  Appear,
  Button,
  Divider,
  EmptyState,
  Group,
  NAV_BAR_SPACE,
  Screen,
  Section,
  Sheet,
  Tap,
  Txt,
  useFormat,
  useSnackbar,
  DirIcon,
} from '@/components/ds';
import MuscleMap from '@/components/exercise/MuscleMap';
import { ExerciseThumb } from '@/components/exercise/ExerciseAnimation';
import WeekDays from '@/components/train/WeekDays';
import WorkoutCard from '@/components/train/WorkoutCard';
import RamadanTrainingHint from '@/components/ramadan/RamadanTrainingHint';
import { machineInfo, sessionMinutes } from '@/lib/cardio';
import { MUSCLE_TO_SLUGS, Muscle, exerciseImageUrls, exerciseName, getExercise } from '@/lib/exercises';
import { generateWorkoutPlan, nextWorkoutDay } from '@/lib/workoutGenerator';
import { addDays } from '@/lib/nutritionMath';
import { motion, space, useTokens } from '@/theme';
import type { CardioSession, PlannedExercise, Sex, WorkoutDay, WorkoutSession } from '@/types';

const THUMB = 56;
/** Session maps stay small on Train: each body view is 400 × 0.28 = 112 dp tall. */
const MAP_SCALE = 0.28;
/** Leading icon column of a disclosure row (icon + gaps), so text and dividers line up. */
const LEADING = space.lg + 24 + space.lg;

/** "3 × 8–12 · rest 2 min" */
function usePrescription() {
  const { L } = useLanguage();
  const fmt = useFormat();
  return (pe: PlannedExercise) => {
    const min = pe.restSec / 60;
    const rest = pe.restSec >= 120 ? `${Number.isInteger(min) ? min : fmt(min, 1)} min` : `${pe.restSec} s`;
    return `${pe.sets} × ${pe.repsMin}–${pe.repsMax}${pe.timed ? ' s' : ''} · ${L({ en: 'rest', fr: 'repos', tn: 'راحة', tnLatn: 'repos' })} ${rest}`;
  };
}

/** The day's focus muscles as highlighter regions (all inked as main muscles). */
function useFocusHighlight(day: WorkoutDay) {
  return useMemo(
    () => day.focus.flatMap((m) => (MUSCLE_TO_SLUGS[m as Muscle] ?? []).map((slug) => ({ slug, intensity: 2 }))),
    [day.focus],
  );
}

function SessionMeta({ day, minutes }: { day: WorkoutDay; minutes: number }) {
  const { L } = useLanguage();
  return (
    <Txt variant="caption" tone="secondary" style={{ marginTop: 2 }}>
      {L(
        { en: '{{n}} exercises · ~{{m}} min', fr: '{{n}} exercices · ~{{m}} min', tn: '{{n}} تمارين · ~{{m}} min', tnLatn: '{{n}} exercices · ~{{m}} min' },
        { n: day.exercises.length, m: minutes },
      )}
    </Txt>
  );
}

/** Quiet done state: a drawn check and ramp text, no colour. */
function DoneThisWeek() {
  const t = useTokens();
  const { L } = useLanguage();
  return (
    <View style={styles.done}>
      <Check size={16} color={t.textSecondary} />
      <Txt variant="caption" tone="secondary">
        {L({ en: 'Done this week', fr: 'Faite cette semaine', tn: 'تعملت الجمعة هاذي', tnLatn: 'T3malet el jem3a hedhi' })}
      </Txt>
    </View>
  );
}

/** The session's exercises; each row opens the exercise with its place in the plan. */
function ExerciseRows({ day, style }: { day: WorkoutDay; style?: StyleProp<ViewStyle> }) {
  const t = useTokens();
  const router = useRouter();
  const { language } = useLanguage();
  const prescription = usePrescription();
  const rows = day.exercises.flatMap((pe, i) => {
    const ex = getExercise(pe.exerciseId);
    return ex ? [{ pe, i, ex }] : [];
  });
  if (!rows.length) return null;
  return (
    <Group style={style}>
      {rows.map(({ pe, i, ex }, n) => (
        <View key={`${pe.exerciseId}-${i}`}>
          <Tap
            onPress={() =>
              router.push({ pathname: '/exercise/[id]', params: { id: pe.exerciseId, day: day.id, index: String(i) } })
            }
            pressScale={1}
            pressedStyle={{ backgroundColor: t.pressed }}
            style={styles.exRow}
          >
            <ExerciseThumb uri={exerciseImageUrls(ex)[0]} size={THUMB} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Txt variant="bodyStrong" numberOfLines={2}>
                {exerciseName(ex, language)}
              </Txt>
              <Txt variant="numSmall" tone="secondary" style={{ marginTop: 2 }}>
                {prescription(pe)}
              </Txt>
            </View>
            <DirIcon icon={ChevronRight} size={20} color={t.textTertiary} />
          </Tap>
          {n < rows.length - 1 ? <Divider inset={space.lg + THUMB + space.md} /> : null}
        </View>
      ))}
    </Group>
  );
}

/** The first session not done this week: the photo card with the one volt action, then its exercises. */
function NextSession({ day, done, minutes }: { day: WorkoutDay; done: boolean; minutes: number }) {
  const router = useRouter();
  const { L } = useLanguage();
  return (
    <Section title={L({ en: 'Next session', fr: 'Prochaine séance', tn: 'الحصّة الجاية', tnLatn: 'Séance el jeya' })}>
      <WorkoutCard
        day={day}
        minutes={minutes}
        onStart={() => router.push({ pathname: '/workout/[dayId]', params: { dayId: day.id } })}
      />
      {done ? <DoneThisWeek /> : null}
      <ExerciseRows day={day} style={{ marginTop: space.lg }} />
    </Section>
  );
}

/** Another session of the week: one compact row that opens in place. */
function DayBlock({
  day,
  expanded,
  onToggle,
  doneThisWeek,
  minutes,
  sex,
}: {
  day: WorkoutDay;
  expanded: boolean;
  onToggle: () => void;
  doneThisWeek: boolean;
  minutes: number;
  sex?: Sex;
}) {
  const t = useTokens();
  const router = useRouter();
  const { L } = useLanguage();
  const rot = useDerivedValue(
    () => withTiming(expanded ? 180 : 0, { duration: motion.base, easing: motion.easeOut }),
    [expanded],
  );
  const chevron = useAnimatedStyle(() => ({ transform: [{ rotate: `${rot.value}deg` }] }));
  const highlight = useFocusHighlight(day);

  return (
    <View>
      <Tap
        onPress={onToggle}
        pressScale={1}
        haptic="selection"
        accessibilityState={{ expanded }}
        style={styles.dayHead}
      >
        <View style={{ flex: 1, minWidth: 0 }}>
          <Txt variant="bodyStrong" numberOfLines={2}>
            {L(day.name)}
          </Txt>
          <SessionMeta day={day} minutes={minutes} />
          {doneThisWeek ? <DoneThisWeek /> : null}
        </View>
        <Animated.View style={chevron}>
          <ChevronDown size={22} color={t.textTertiary} />
        </Animated.View>
      </Tap>

      {expanded ? (
        <Appear offset={4} style={styles.dayBody}>
          <MuscleMap data={highlight} sex={sex} scale={MAP_SCALE} showLegend={false} showSides={false} />
          <ExerciseRows day={day} style={{ marginTop: space.lg }} />
          <Button
            label={L({ en: 'Start this workout', fr: 'Commencer cette séance', tn: 'ابدا الحصّة هاذي', tnLatn: 'Ebda séance hedhi' })}
            variant="tonal"
            icon={(c) => <Play size={20} color={c} />}
            onPress={() => router.push({ pathname: '/workout/[dayId]', params: { dayId: day.id } })}
            size="lg"
            fill
            haptic="light"
            style={{ marginTop: space.lg }}
          />
        </Appear>
      ) : null}
      <Divider />
    </View>
  );
}

/** One row of the "About your program" list; opens its explanation in place. */
function Disclosure({
  title,
  icon,
  divider,
  children,
}: {
  title: string;
  icon: (color: string) => ReactNode;
  divider?: boolean;
  children: ReactNode;
}) {
  const t = useTokens();
  const [open, setOpen] = useState(false);
  const rot = useDerivedValue(() => withTiming(open ? 180 : 0, { duration: motion.base, easing: motion.easeOut }), [open]);
  const chevron = useAnimatedStyle(() => ({ transform: [{ rotate: `${rot.value}deg` }] }));
  return (
    <View>
      <Tap
        onPress={() => setOpen((o) => !o)}
        pressScale={1}
        haptic="selection"
        pressedStyle={{ backgroundColor: t.pressed }}
        accessibilityLabel={title}
        accessibilityState={{ expanded: open }}
        style={styles.discHead}
      >
        <View style={styles.discIcon}>{icon(t.textSecondary)}</View>
        <Txt variant="bodyStrong" style={{ flex: 1 }}>
          {title}
        </Txt>
        <Animated.View style={chevron}>
          <ChevronDown size={20} color={t.textTertiary} />
        </Animated.View>
      </Tap>
      {open ? (
        <Appear offset={4} style={styles.discBody}>
          {children}
        </Appear>
      ) : null}
      {divider ? <Divider inset={LEADING} /> : null}
    </View>
  );
}

export default function TrainScreen() {
  const t = useTokens();
  const router = useRouter();
  const fmt = useFormat();
  const snackbar = useSnackbar();
  const { L, language, formatDate } = useLanguage();
  const { profile, workoutPlan, setWorkoutPlan, sessions, cardio, today } = useAppData();
  // Which of the other sessions is open (the next session is always shown in full).
  const [open, setOpen] = useState<string | null>(null);
  const [confirmRebuild, setConfirmRebuild] = useState(false);

  const weekStart = useMemo(() => {
    const d = new Date(today + 'T12:00:00');
    const offset = (d.getDay() + 6) % 7; // Monday = 0
    return addDays(today, -offset);
  }, [today]);
  const finishedThisWeek = sessions.filter((s) => s.finishedAt && s.date >= weekStart);
  const doneIds = new Set(finishedThisWeek.map((s) => s.dayId));
  // Weight sessions and cardio together, newest first.
  const recent: ({ kind: 'weights'; at: string; s: WorkoutSession } | { kind: 'cardio'; at: string; c: CardioSession })[] = [
    ...sessions.filter((s) => s.finishedAt).map((s) => ({ kind: 'weights' as const, at: `${s.date} ${s.startedAt}`, s })),
    ...cardio.map((c) => ({ kind: 'cardio' as const, at: `${c.date} ${c.createdAt}`, c })),
  ]
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 5);

  const build = () => {
    if (!profile) return;
    const next = generateWorkoutPlan(profile);
    setWorkoutPlan(next);
    setOpen(null);
    return next;
  };

  const rebuild = () => {
    setConfirmRebuild(false);
    if (build()) snackbar.show(L({ en: 'New program ready', fr: 'Nouveau programme prêt', tn: 'البرنامج الجديد حاضر', tnLatn: 'Programme jdid 7adher' }));
  };

  const title = L({ en: 'Training', fr: 'Entraînement', tn: 'التمرين', tnLatn: 'Entraînement' });

  if (!workoutPlan || !profile) {
    return (
      <Screen title={title} bottomSpace={NAV_BAR_SPACE}>
        <EmptyState
          icon={(c) => <Dumbbell size={28} color={c} />}
          title={L({ en: 'No program yet', fr: 'Pas encore de programme', tn: 'مازال ما عندكش برنامج', tnLatn: 'Mazel ma 3andekch programme' })}
          body={L({
            en: 'Tounsi Fit builds one from your answers: training days, exercises, sets, reps and rest — each with the reason behind it.',
            fr: 'Tounsi Fit en crée un à partir de tes réponses : jours d’entraînement, exercices, séries, répétitions et repos — chaque choix expliqué.',
            tn: 'Tounsi Fit يبنيهولك حسب أجوبتك: أيّام التمرين، التمارين، السيريات، المرّات والراحة — كل حاجة بالسبّة متاعها.',
            tnLatn: 'Tounsi Fit yebnihoulek 7asb ejwbtek: ayyem l entraînement, exercices, séries, reps w repos — kol 7aja b sebbetha.',
          })}
          action={
            <Button
              label={L({ en: 'Build my program', fr: 'Créer mon programme', tn: 'اعمل البرنامج متاعي', tnLatn: 'A3mel programme mte3i' })}
              onPress={build}
              size="lg"
              haptic="light"
            />
          }
        />
      </Screen>
    );
  }

  // Next = the day after the last finished session (A, B, C, A…), the same as Today.
  const nextDay = nextWorkoutDay(workoutPlan, sessions);
  const otherDays = workoutPlan.days.filter((d) => d.id !== nextDay?.id);

  return (
    <View style={{ flex: 1 }}>
      <Screen title={title} subtitle={L(workoutPlan.splitName)} bottomSpace={NAV_BAR_SPACE}>
        <WeekDays perWeek={workoutPlan.daysPerWeek} />
        <View style={styles.weekActions}>
          <Button
            label={L({ en: 'Log cardio', fr: 'Noter du cardio', tn: 'سجّل كارديو', tnLatn: 'Sajjel cardio' })}
            variant="tonal"
            icon={(c) => <HeartPulse size={20} color={c} />}
            onPress={() => router.push('/cardio')}
            style={styles.grow}
          />
          <Button
            label={L({ en: 'Activity', fr: 'Activité', tn: 'النشاط', tnLatn: 'Activité' })}
            variant="tonal"
            icon={(c) => <CalendarDays size={20} color={c} />}
            onPress={() => router.push('/activity')}
            style={styles.grow}
          />
        </View>

        <RamadanTrainingHint style={{ marginTop: space.lg }} />

        {nextDay ? (
          <NextSession day={nextDay} done={doneIds.has(nextDay.id)} minutes={profile.sessionMinutes} />
        ) : null}

        {otherDays.length ? (
          <Section title={L({ en: 'Other sessions', fr: 'Autres séances', tn: 'حصص أخرى', tnLatn: 'Séances o5rin' })}>
            <Divider />
            {otherDays.map((day) => (
              <DayBlock
                key={day.id}
                day={day}
                expanded={open === day.id}
                onToggle={() => setOpen(open === day.id ? null : day.id)}
                doneThisWeek={doneIds.has(day.id)}
                minutes={profile.sessionMinutes}
                sex={profile.sex}
              />
            ))}
          </Section>
        ) : null}

        <View style={styles.buttons}>
          <Button
            label={L({ en: 'Exercise library', fr: 'Bibliothèque d’exercices', tn: 'مكتبة التمارين', tnLatn: 'Bibliothèque exercices' })}
            variant="tonal"
            icon={(c) => <BookOpen size={20} color={c} />}
            onPress={() => router.push('/library')}
            style={styles.grow}
          />
          <Button
            label={L({ en: 'Rebuild plan', fr: 'Refaire le programme', tn: 'عاود البرنامج', tnLatn: '3awed programme' })}
            variant="outlined"
            icon={(c) => <RefreshCw size={20} color={c} />}
            onPress={() => setConfirmRebuild(true)}
            style={styles.grow}
          />
        </View>

        {recent.length ? (
          <Section
            title={L({ en: 'Recent activity', fr: 'Activité récente', tn: 'آخر نشاط', tnLatn: 'E5er activité' })}
            action={
              <Button
                label={L({ en: 'See all', fr: 'Tout voir', tn: 'شوف الكل', tnLatn: 'Chouf lkol' })}
                variant="text"
                onPress={() => router.push('/activity')}
                style={{ marginRight: -space.md }}
              />
            }
          >
            <Group>
              {recent.map((item, n) => {
                if (item.kind === 'cardio') {
                  const c = item.c;
                  const cDate = formatDate(new Date(c.date + 'T12:00:00'), { weekday: 'short', day: 'numeric', month: 'short' });
                  return (
                    <View key={c.id}>
                      <Tap
                        onPress={() => router.push({ pathname: '/cardio', params: { id: c.id } })}
                        pressScale={1}
                        pressedStyle={{ backgroundColor: t.pressed }}
                        style={styles.recentRow}
                      >
                        <View style={{ flex: 1, minWidth: 0 }}>
                          <Txt variant="bodyStrong" numberOfLines={1}>
                            {L(machineInfo(c.machine).name)}
                          </Txt>
                          <Txt variant="numSmall" tone="secondary" style={{ marginTop: 2 }}>
                            {[cDate, `${fmt(sessionMinutes(c))} min`, c.distanceKm ? `${fmt(c.distanceKm, 2)} km` : null].filter(Boolean).join(' · ')}
                          </Txt>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                          <Txt variant="numLarge" style={styles.volume}>
                            {`≈${fmt(c.kcal)}`}
                          </Txt>
                          <Txt variant="overline" tone="tertiary">
                            kcal
                          </Txt>
                        </View>
                      </Tap>
                      {n < recent.length - 1 ? <Divider inset={space.lg} /> : null}
                    </View>
                  );
                }
                const s = item.s;
                const done = s.sets.filter((x) => x.done);
                const volume = done.reduce((sum, x) => sum + x.weightKg * x.reps, 0);
                const minutes = s.finishedAt ? Math.round((Date.parse(s.finishedAt) - Date.parse(s.startedAt)) / 60000) : 0;
                const date = formatDate(new Date(s.date + 'T12:00:00'), {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'short',
                });
                return (
                  <View key={s.id}>
                    <View style={styles.recentRow}>
                      <View style={{ flex: 1, minWidth: 0 }}>
                        <Txt variant="bodyStrong" numberOfLines={1}>
                          {L(s.dayName)}
                        </Txt>
                        <Txt variant="numSmall" tone="secondary" style={{ marginTop: 2 }}>
                          {`${date} · ${L({ en: '{{n}} sets', fr: '{{n}} séries', tn: '{{n}} سيريات', tnLatn: '{{n}} séries' }, { n: done.length })} · ${minutes} min`}
                        </Txt>
                      </View>
                      {volume > 0 ? (
                        <View style={{ alignItems: 'flex-end' }}>
                          <Txt variant="numLarge" style={styles.volume}>
                            {fmt(Math.round(volume))}
                          </Txt>
                          <Txt variant="overline" tone="tertiary">
                            {L({ en: 'kg lifted', fr: 'kg soulevés', tn: 'kg هزّيت', tnLatn: 'kg hazzit' })}
                          </Txt>
                        </View>
                      ) : null}
                    </View>
                    {n < recent.length - 1 ? <Divider inset={space.lg} /> : null}
                  </View>
                );
              })}
            </Group>
          </Section>
        ) : null}

        <Section title={L({ en: 'About your program', fr: 'À propos de ton programme', tn: 'على البرنامج متاعك', tnLatn: '3al programme mte3ek' })}>
          <Group>
            <Disclosure
              title={L({ en: 'Why this program?', fr: 'Pourquoi ce programme ?', tn: 'علاش البرنامج هذا؟', tnLatn: '3lech el programme hedha?' })}
              icon={(c) => <CircleHelp size={22} color={c} />}
              divider
            >
              <Txt tone="secondary">{L(workoutPlan.splitWhy)}</Txt>
            </Disclosure>
            <Disclosure
              title={L({ en: 'What about cardio?', fr: 'Et le cardio ?', tn: 'والكارديو؟', tnLatn: 'W el cardio?' })}
              icon={(c) => <HeartPulse size={22} color={c} />}
              divider
            >
              <Txt tone="secondary">{L(workoutPlan.cardio)}</Txt>
            </Disclosure>
            <Disclosure
              title={L({ en: 'How to progress', fr: 'Comment progresser', tn: 'كيفاش تتقدّم', tnLatn: 'Kifech tet9addem' })}
              icon={(c) => <TrendingUp size={22} color={c} />}
            >
              <Txt tone="secondary">
                {L({
                  en: 'Each exercise has a rep range, e.g. 8–12. Start with a weight you can do 8 times with good form and 2–3 reps left in reserve. Each session try to do one more rep. When you reach 12 on every set, add the smallest weight step and go back to 8. Tounsi Fit shows you what to aim for in each workout.',
                  fr: 'Chaque exercice a une fourchette, ex. 8–12. Commence avec une charge que tu peux soulever 8 fois proprement en gardant 2–3 répétitions en réserve. À chaque séance, essaie d’en faire une de plus. Quand tu fais 12 sur toutes les séries, ajoute le plus petit palier de poids et reviens à 8. Tounsi Fit t’indique quoi viser à chaque séance.',
                  tn: 'كل تمرين عندو عدد مرّات، مثلاً 8–12. ابدا بثقل تنجّم تهزّو 8 مرّات بطريقة صحيحة ويقعدولك 2–3 مرّات في الاحتياط. كل حصّة جرّب تزيد مرّة. كي توصل لـ 12 في السيريات الكل، زيد أصغر درجة في الثقل وارجع لـ 8. Tounsi Fit يورّيك شنوّة لازمك تعمل في كل حصّة.',
                  tnLatn: 'Kol exercice 3andou nombre de reps, mathalan 8–12. Ebda b charge tnajjem thezzha 8 marrat b tari9a s7i7a w yo93odlek 2–3 reps fel réserve. Kol séance jarreb tzid rep. Ki toussel l 12 fel séries lkol, zid a9al palier fel charge w erja3 l 8. Tounsi Fit ywarrik chnowa lazmek ta3mel f kol séance.',
                })}
              </Txt>
            </Disclosure>
          </Group>
        </Section>
      </Screen>

      <Sheet
        visible={confirmRebuild}
        onClose={() => setConfirmRebuild(false)}
        title={L({ en: 'Rebuild your program?', fr: 'Refaire ton programme ?', tn: 'نعاودو البرنامج متاعك؟', tnLatn: 'N3awdou el programme mte3ek?' })}
      >
        <Txt tone="secondary">
          {L({
            en: 'This replaces your current program (including swaps) with a fresh one from your answers. Your workout history is kept.',
            fr: 'Cela remplace ton programme actuel (y compris les remplacements) par un nouveau basé sur tes réponses. Ton historique est conservé.',
            tn: 'هذا يبدّل البرنامج متاعك (حتى التبديلات اللي عملتهم) ببرنامج جديد حسب أجوبتك. الحصص اللي عملتهم يقعدو.',
            tnLatn: 'Hedha ybaddel el programme mte3ek (7atta les changements eli 3malthom) b wa7ed jdid 7asb ejwbtek. Les séances eli 3malthom yo93dou.',
          })}
        </Txt>
        <View style={styles.sheetActions}>
          <Button
            label={L({ en: 'Rebuild program', fr: 'Refaire le programme', tn: 'عاود البرنامج', tnLatn: '3awed programme' })}
            variant="danger"
            icon={(c) => <RefreshCw size={20} color={c} />}
            onPress={rebuild}
            size="lg"
            fill
          />
          <Button
            label={L({ en: 'Cancel', fr: 'Annuler', tn: 'بطّل', tnLatn: 'Batel' })}
            variant="outlined"
            onPress={() => setConfirmRebuild(false)}
            size="lg"
            fill
          />
        </View>
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  weekActions: { flexDirection: 'row', gap: space.sm, marginTop: space.lg },
  done: { flexDirection: 'row', alignItems: 'center', gap: space.xs + 2, marginTop: space.md },
  dayHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    minHeight: 64,
    paddingVertical: space.md,
  },
  dayBody: { paddingBottom: space.xl },
  exRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    minHeight: 80,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  discHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.lg,
    minHeight: 56,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  discIcon: { width: 24, alignItems: 'center' },
  discBody: { paddingLeft: LEADING, paddingRight: space.lg, paddingBottom: space.lg },
  buttons: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, marginTop: space.xl },
  grow: { flexGrow: 1 },
  recentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    minHeight: 64,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  sheetActions: { gap: space.sm, marginTop: space.xl },
  volume: { fontSize: 26, lineHeight: 30 },
});
