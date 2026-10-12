// Live workout, one exercise per page. Built for the gym floor: story bars
// across the top show the whole session, each page opens with the moving
// demo, then the set table in big numerals, and a fixed dock holds the one
// action (LOG SET, then NEXT EXERCISE, then FINISH) under the thumb. While
// resting, the rest clock takes the dock's Up next slot.

import { memo, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Keyboard,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useReducedMotion } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, ArrowRight, ChevronRight, Dumbbell, Info, Plus, Timer, TrendingUp } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppData } from '@/contexts/AppDataContext';
import {
  Button,
  EmptyState,
  IconButton,
  ProgressLine,
  Screen,
  Sheet,
  StampCheck,
  StoryBars,
  Tap,
  Txt,
  Why,
  hapticTap,
  useFormat,
  useSnackbar,
} from '@/components/ds';
import ExerciseAnimation, { ExerciseThumb } from '@/components/exercise/ExerciseAnimation';
import { Exercise, exerciseImageUrls, exerciseName, getExercise } from '@/lib/exercises';
import { progressionHint } from '@/lib/workoutGenerator';
import { newId } from '@/lib/storage';
import { fonts, radius, space, useTokens } from '@/theme';
import type { LoggedSet, PlannedExercise, WorkoutSession } from '@/types';

const SET_COL = 60;
const CHECK = 44;
/** The demo fills most of the width's height; the name sits on its faded lower part. */
const PHOTO_HEIGHT = 0.9;
/** Keeps a number and its unit on one line ("60 kg", "× 12"). */
const NB = '\u00A0';

/** Long exercise names step down in size so the whole name stays readable. */
function nameSize(name: string) {
  if (name.length <= 16) return null;
  if (name.length <= 26) return { fontSize: 34, lineHeight: 38 };
  return { fontSize: 29, lineHeight: 33 };
}

type Row = { s: LoggedSet; i: number };
type Page = { pe: PlannedExercise; ex: Exercise; rows: Row[] };

// ---------------------------------------------------------------------------
// Big editable numeral: keeps the typed text (so "62." or "62,5" survive while
// typing) and resyncs when the value changes from outside (weight carry-over).
// ---------------------------------------------------------------------------

function NumInput({
  value,
  onChange,
  placeholder,
  decimal,
  unit,
  color,
  label,
}: {
  value: number;
  onChange: (v: number) => void;
  placeholder: string;
  decimal?: boolean;
  unit: string;
  color: string;
  label: string;
}) {
  const t = useTokens();
  const { language } = useLanguage();
  const show = (v: number) => (v ? (language === 'fr' ? String(v).replace('.', ',') : String(v)) : '');
  const parse = (s: string) => (decimal ? parseFloat(s.replace(',', '.')) : parseInt(s, 10)) || 0;
  const [text, setText] = useState(() => show(value));
  const [focused, setFocused] = useState(false);
  useEffect(() => {
    if (parse(text) !== value) setText(show(value));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);
  return (
    <View style={[styles.num, { borderBottomColor: focused ? t.accent : t.border }]}>
      <TextInput
        value={text}
        onChangeText={(s) => {
          setText(s);
          onChange(parse(s));
        }}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        placeholderTextColor={t.textTertiary}
        keyboardType={decimal ? 'decimal-pad' : 'number-pad'}
        selectTextOnFocus
        maxLength={5}
        accessibilityLabel={label}
        selectionColor={t.accent}
        cursorColor={t.accent}
        maxFontSizeMultiplier={1.25}
        style={[styles.numInput, { color }]}
      />
      <Txt variant="overline" tone="tertiary" style={styles.numUnit}>
        {unit}
      </Txt>
    </View>
  );
}

// ---------------------------------------------------------------------------
// One set row. The next set to log is volt; done sets stamp a volt check.
// ---------------------------------------------------------------------------

function SetRow({
  n,
  set,
  current,
  timed,
  repsPlaceholder,
  onWeight,
  onReps,
  onToggle,
}: {
  n: number;
  set: LoggedSet;
  current: boolean;
  timed?: boolean;
  repsPlaceholder: string;
  onWeight: (kg: number) => void;
  onReps: (reps: number) => void;
  onToggle: () => void;
}) {
  const t = useTokens();
  const { L } = useLanguage();
  const ink = current ? t.accentText : set.done ? t.text : t.textSecondary;
  return (
    <View style={[styles.setRow, { borderBottomColor: t.hairline }]}>
      <Txt variant="overline" color={current ? t.text : t.textTertiary} style={{ width: SET_COL }}>
        {L({ en: 'Set {{n}}', fr: 'Série {{n}}' }, { n })}
      </Txt>
      <NumInput
        value={set.weightKg}
        onChange={onWeight}
        placeholder="0"
        decimal
        unit="kg"
        color={ink}
        label={L({ en: 'Set {{n}} weight in kg', fr: 'Série {{n}}, charge en kg' }, { n })}
      />
      <NumInput
        value={set.reps}
        onChange={onReps}
        placeholder={repsPlaceholder}
        unit={timed ? 's' : L({ en: 'reps', fr: 'rép.' })}
        color={ink}
        label={
          timed
            ? L({ en: 'Set {{n}} seconds', fr: 'Série {{n}}, secondes' }, { n })
            : L({ en: 'Set {{n}} reps', fr: 'Série {{n}}, répétitions' }, { n })
        }
      />
      <StampCheck
        done={set.done}
        onPress={onToggle}
        size={CHECK}
        label={L({ en: 'Set {{n}} done', fr: 'Série {{n}} faite' }, { n })}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// One exercise page
// ---------------------------------------------------------------------------

const ExercisePage = memo(function ExercisePage({
  page,
  width,
  bottomSpace,
  hint,
  last,
  showWarmup,
  onUpdate,
  onToggle,
  onAdd,
  onForm,
}: {
  page: Page;
  width: number;
  bottomSpace: number;
  hint: ReturnType<typeof progressionHint>;
  last: LoggedSet[];
  showWarmup: boolean;
  onUpdate: (globalIndex: number, patch: Partial<LoggedSet>) => void;
  onToggle: (globalIndex: number, restSec: number) => void;
  onAdd: (exerciseId: string) => void;
  onForm: (exerciseId: string) => void;
}) {
  const t = useTokens();
  const fmt = useFormat();
  const { L, language } = useLanguage();
  const { pe, ex, rows } = page;
  const kg = (n: number) => fmt(n, Number.isInteger(n) ? 0 : 1);
  const unit = pe.timed ? 's' : L({ en: 'reps', fr: 'rép.' });
  const min = pe.restSec / 60;
  const rest = pe.restSec >= 120 ? `${Number.isInteger(min) ? min : fmt(min, 1)}${NB}min` : `${pe.restSec}${NB}s`;
  const currentRow = rows.findIndex(({ s }) => !s.done);

  // Best set of the last session: heaviest weight, then most reps.
  const best = [...last].sort((a, b) => b.weightKg - a.weightKg || b.reps - a.reps)[0];
  const lastText = best
    ? L(
        { en: 'Last {{v}}', fr: 'Dernière fois {{v}}' },
        { v: best.weightKg ? `${kg(best.weightKg)}${NB}kg${NB}×${NB}${best.reps}` : `${best.reps}${NB}${unit}` },
      )
    : L({ en: 'First time', fr: 'Première fois' });

  const hintText =
    hint.kind === 'first_time'
      ? L(
          {
            en: 'First time: pick a weight you could lift ~{{max}} times, do {{min}} clean reps, note it.',
            fr: 'Première fois : prends une charge que tu pourrais soulever ~{{max}} fois, fais {{min}} répétitions propres, note-la.',
          },
          { min: pe.repsMin, max: pe.repsMax + 3 },
        )
      : hint.kind === 'add_weight'
        ? L(
            { en: 'You hit the top last time — go up to {{kg}} kg today.', fr: 'Tu as atteint le haut la dernière fois — monte à {{kg}} kg aujourd’hui.' },
            { kg: kg(hint.weightKg ?? 0) },
          )
        : L({ en: 'Beat last time by one rep on at least one set.', fr: 'Fais une répétition de plus que la dernière fois sur au moins une série.' });

  return (
    <ScrollView
      style={{ width }}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="on-drag"
      contentContainerStyle={{ paddingBottom: bottomSpace }}
    >
      <View style={{ height: Math.round(width * PHOTO_HEIGHT) }}>
        <ExerciseAnimation images={exerciseImageUrls(ex)} height={Math.round(width * PHOTO_HEIGHT)} bleed />
        {/* The lower 40% fades to the ground; the name and its prescription sit on it. */}
        <LinearGradient
          colors={[`${t.ground}00`, `${t.ground}B3`, t.ground]}
          locations={[0, 0.55, 1]}
          style={styles.photoFade}
          pointerEvents="none"
        />
        <View style={styles.nameBlock} pointerEvents="box-none">
          <View style={styles.nameRow} pointerEvents="box-none">
            <Txt variant="display" numberOfLines={3} style={[{ flex: 1 }, nameSize(exerciseName(ex, language))]} accessibilityRole="header">
              {exerciseName(ex, language)}
            </Txt>
            <IconButton
              label={L({ en: 'How to do it', fr: 'Comment le faire' })}
              variant="tonal"
              onPress={() => onForm(pe.exerciseId)}
              icon={(c) => <Info size={22} color={c} />}
            />
          </View>
          <Txt variant="overline" tone="secondary" style={{ marginTop: space.xs }}>
            {`${pe.sets}${NB}×${NB}${pe.repsMin}–${pe.repsMax}${NB}${unit} · ${L({ en: 'rest', fr: 'repos' })}${NB}${rest} · ${lastText}`}
          </Txt>
        </View>
      </View>

      <View style={styles.pageBody}>
        <View style={[styles.table, { borderTopColor: t.hairline }]}>
          {rows.map(({ s, i }, n) => (
            <SetRow
              // Sets only get appended within an exercise, so the per-exercise
              // position is a stable key (global indexes shift when sets are added).
              key={n}
              n={n + 1}
              set={s}
              current={n === currentRow}
              timed={pe.timed}
              repsPlaceholder={String(pe.repsMin)}
              onWeight={(w) => onUpdate(i, { weightKg: w })}
              onReps={(r) => onUpdate(i, { reps: r })}
              onToggle={() => onToggle(i, pe.restSec)}
            />
          ))}
        </View>
        <Button
          label={L({ en: 'Add set', fr: 'Ajouter une série' })}
          variant="text"
          icon={(c) => <Plus size={18} color={c} strokeWidth={2.6} />}
          onPress={() => onAdd(pe.exerciseId)}
          style={{ marginTop: space.xs, marginLeft: -space.md }}
        />

        {showWarmup ? (
          <Why title={L({ en: 'Warm up first (5–8 min)', fr: 'Échauffe-toi d’abord (5–8 min)' })} style={{ marginTop: space.md }}>
            <Txt tone="secondary">
              {L({
                en: 'A few minutes of brisk walking or bike, then 1–2 light sets of this exercise at ~50% of the working weight.',
                fr: 'Quelques minutes de marche rapide ou de vélo, puis 1 à 2 séries légères de cet exercice à ~50 % de la charge de travail.',
              })}
            </Txt>
          </Why>
        ) : null}

        <View style={styles.hint}>
          <TrendingUp size={18} color={t.accentText} style={{ marginTop: 1 }} />
          <Txt variant="caption" tone="secondary" style={{ flex: 1 }}>
            {hintText}
          </Txt>
        </View>
        <Txt variant="caption" tone="tertiary" style={{ marginTop: space.lg }}>
          {L({
            en: 'Bodyweight exercise? Leave kg at 0. Stop a set if you feel sharp pain — effort burns, pain stabs.',
            fr: 'Exercice au poids du corps ? Laisse 0 kg. Arrête une série en cas de douleur vive — l’effort brûle, la douleur pique.',
          })}
        </Txt>
      </View>
    </ScrollView>
  );
});

// ---------------------------------------------------------------------------
// Dock pieces: the rest clock and the Up next row share one slot.
// ---------------------------------------------------------------------------

function RestStrip({ left, fraction, onAdd, onSkip }: { left: number; fraction: number; onAdd: () => void; onSkip: () => void }) {
  const t = useTokens();
  const { L } = useLanguage();
  const over = left === 0;
  const clock = `${Math.floor(left / 60)}:${String(left % 60).padStart(2, '0')}`;
  const action = (label: string, onPress: () => void, a11y: string) => (
    <Tap
      onPress={onPress}
      pressScale={0.94}
      haptic="light"
      hitSlop={4}
      accessibilityLabel={a11y}
      pressedStyle={{ backgroundColor: t.pressed }}
      style={[styles.restAction, { backgroundColor: t.surfaceHigh }]}
    >
      <Txt variant="label" style={styles.restActionLabel} numberOfLines={1}>
        {label}
      </Txt>
    </Tap>
  );
  return (
    <View style={styles.slot}>
      <View style={styles.restRow} accessibilityLiveRegion="polite">
        <Timer size={20} color={over ? t.accentText : t.textSecondary} />
        <Txt variant="overline" color={over ? t.accentText : t.textSecondary} style={{ flex: 1 }} numberOfLines={1}>
          {over ? L({ en: 'Go! Next set', fr: 'C’est reparti !' }) : L({ en: 'Rest', fr: 'Repos' })}
        </Txt>
        <Txt variant="numLarge" color={over ? t.accentText : t.text} style={styles.restClock}>
          {clock}
        </Txt>
        {action('+30 s', onAdd, L({ en: 'Add 30 seconds', fr: 'Ajouter 30 secondes' }))}
        {action(L({ en: 'Skip', fr: 'Passer' }), onSkip, L({ en: 'Skip rest', fr: 'Passer le repos' }))}
      </View>
      <ProgressLine value={fraction} height={3} />
    </View>
  );
}

function UpNext({ next, onPress }: { next?: Page; onPress: () => void }) {
  const t = useTokens();
  const { L, language } = useLanguage();
  if (!next) {
    return (
      <View style={[styles.slot, styles.upNext, { backgroundColor: t.surface }]}>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Txt variant="bodyStrong" numberOfLines={1}>
            {L({ en: 'Last exercise', fr: 'Dernier exercice' })}
          </Txt>
          <Txt variant="caption" tone="tertiary" numberOfLines={1}>
            {L({ en: 'Then finish and save your workout', fr: 'Ensuite, termine et enregistre ta séance' })}
          </Txt>
        </View>
      </View>
    );
  }
  const nextName = exerciseName(next.ex, language);
  return (
    <Tap
      onPress={onPress}
      pressScale={0.98}
      haptic="selection"
      accessibilityLabel={L({ en: 'Up next: {{name}}', fr: 'Ensuite : {{name}}' }, { name: nextName })}
      pressedStyle={{ backgroundColor: t.pressed }}
      style={[styles.slot, styles.upNext, { backgroundColor: t.surface }]}
    >
      <ExerciseThumb uri={exerciseImageUrls(next.ex)[0]} size={44} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Txt variant="bodyStrong" numberOfLines={2}>
          <Txt variant="bodyStrong" tone="tertiary">
            {L({ en: 'Up next · ', fr: 'Ensuite · ' })}
          </Txt>
          {nextName}
        </Txt>
        {nextName.length <= 16 ? (
          <Txt variant="caption" tone="tertiary" numberOfLines={1}>
            {L({ en: 'Swipe or tap when this one is done', fr: 'Glisse ou touche quand celui-ci est fini' })}
          </Txt>
        ) : null}
      </View>
      <ChevronRight size={20} color={t.textTertiary} />
    </Tap>
  );
}

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function WorkoutScreen() {
  const t = useTokens();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const snackbar = useSnackbar();
  const reduce = useReducedMotion();
  const fmt = useFormat();
  const { L, language } = useLanguage();
  const { workoutPlan, sessions, saveSession, deleteSession, today } = useAppData();
  const { dayId } = useLocalSearchParams<{ dayId: string }>();
  const day = workoutPlan?.days.find((d) => d.id === dayId);

  // Last completed sets per exercise, for targets and pre-filled weights.
  const lastSets = useMemo(() => {
    const map = new Map<string, LoggedSet[]>();
    const finished = sessions
      .filter((s) => s.finishedAt)
      .sort((a, b) => b.startedAt.localeCompare(a.startedAt));
    for (const s of finished) {
      for (const set of s.sets) {
        if (!set.done || map.has(set.exerciseId + '#done')) continue;
        const list = map.get(set.exerciseId) ?? [];
        list.push(set);
        map.set(set.exerciseId, list);
      }
      // Only keep the most recent session for each exercise.
      for (const id of new Set(s.sets.map((x) => x.exerciseId))) map.set(id + '#done', []);
    }
    return map;
  }, [sessions]);

  const [session, setSession] = useState<WorkoutSession | null>(() => {
    if (!day) return null;
    const unfinished = sessions.find((s) => s.dayId === day.id && !s.finishedAt && s.date === today);
    if (unfinished) return unfinished;
    const sets: LoggedSet[] = day.exercises.flatMap((pe) => {
      const hint = progressionHint(pe, lastSets.get(pe.exerciseId) ?? []);
      return Array.from({ length: pe.sets }, () => ({
        exerciseId: pe.exerciseId,
        reps: pe.repsMin,
        weightKg: hint.weightKg ?? 0,
        done: false,
      }));
    });
    return {
      id: newId(),
      date: today,
      dayId: day.id,
      dayName: day.name,
      startedAt: new Date().toISOString(),
      sets,
    };
  });

  // Persist progress so leaving the screen doesn't lose the workout.
  useEffect(() => {
    if (session && session.sets.some((s) => s.done)) saveSession(session);
  }, [session, saveSession]);

  const pages: Page[] = useMemo(() => {
    if (!day || !session) return [];
    const indexed = session.sets.map((s, i) => ({ s, i }));
    return day.exercises.flatMap((pe) => {
      const ex = getExercise(pe.exerciseId);
      return ex ? [{ pe, ex, rows: indexed.filter(({ s }) => s.exerciseId === pe.exerciseId) }] : [];
    });
  }, [day, session]);

  // Open on the first exercise with sets left (a resumed workout picks up where it stopped).
  const [index, setIndex] = useState(() => Math.max(0, pages.findIndex((p) => p.rows.some(({ s }) => !s.done))));
  const indexRef = useRef(index);
  const listRef = useRef<FlatList<Page>>(null);
  const goTo = (i: number) => {
    const next = Math.min(Math.max(i, 0), pages.length - 1);
    indexRef.current = next;
    setIndex(next);
    listRef.current?.scrollToIndex({ index: next, animated: !reduce });
  };

  // Rest timer
  const [restEnd, setRestEnd] = useState<number | null>(null);
  const [restTotal, setRestTotal] = useState(0);
  const [now, setNow] = useState(Date.now());
  const notified = useRef(false);
  useEffect(() => {
    if (!restEnd) return;
    notified.current = false;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [restEnd]);
  const restLeft = restEnd ? Math.max(0, Math.round((restEnd - now) / 1000)) : 0;
  useEffect(() => {
    if (restEnd && restLeft === 0 && !notified.current) {
      notified.current = true;
      hapticTap('success');
      const ended = restEnd;
      // Hide after 1.5 s unless a new rest started meanwhile.
      setTimeout(() => setRestEnd((e) => (e === ended ? null : e)), 1500);
    }
  }, [restLeft, restEnd]);

  // Session clock, refreshed twice a minute.
  const [clockNow, setClockNow] = useState(Date.now());
  useEffect(() => {
    const id = setInterval(() => setClockNow(Date.now()), 30000);
    return () => clearInterval(id);
  }, []);

  // The dock steps aside while the keyboard is up so the typed numeral stays visible.
  const [keyboard, setKeyboard] = useState(false);
  useEffect(() => {
    const show = Keyboard.addListener('keyboardDidShow', () => setKeyboard(true));
    const hide = Keyboard.addListener('keyboardDidHide', () => setKeyboard(false));
    return () => {
      show.remove();
      hide.remove();
    };
  }, []);

  const [finishOpen, setFinishOpen] = useState(false);

  if (!day || !session || !pages.length) {
    return (
      <Screen back title={L({ en: 'Workout', fr: 'Séance' })} largeTitle={false}>
        <EmptyState
          icon={(c) => <Dumbbell size={28} color={c} />}
          title={L({ en: 'Workout not found.', fr: 'Séance introuvable.' })}
          body={L({
            en: 'Your program may have been rebuilt. Pick a session from the Train tab.',
            fr: 'Ton programme a peut-être été refait. Choisis une séance dans l’onglet Sport.',
          })}
        />
      </Screen>
    );
  }

  const updateSet = (globalIndex: number, patch: Partial<LoggedSet>) =>
    setSession((s) => {
      if (!s) return s;
      const target = s.sets[globalIndex];
      return {
        ...s,
        sets: s.sets.map((x, i) => {
          if (i === globalIndex) return { ...x, ...patch };
          // A new weight carries over to the remaining, not-yet-done sets.
          if (
            patch.weightKg !== undefined &&
            i > globalIndex &&
            x.exerciseId === target.exerciseId &&
            !x.done &&
            x.weightKg === target.weightKg
          ) {
            return { ...x, weightKg: patch.weightKg };
          }
          return x;
        }),
      };
    });

  const toggleDone = (globalIndex: number, restSec: number) => {
    const set = session.sets[globalIndex];
    updateSet(globalIndex, { done: !set.done });
    if (!set.done) {
      // StampCheck gives a success haptic with its stamp; without motion it doesn't.
      if (reduce) hapticTap('light');
      setRestEnd(Date.now() + restSec * 1000);
      setRestTotal(restSec);
      setNow(Date.now());
    }
  };

  const addSet = (exerciseId: string) =>
    setSession((s) => {
      if (!s) return s;
      const lastIdx = s.sets.map((x) => x.exerciseId).lastIndexOf(exerciseId);
      const template = s.sets[lastIdx];
      const sets = [...s.sets];
      sets.splice(lastIdx + 1, 0, { ...template, done: false });
      return { ...s, sets };
    });

  const doneSets = session.sets.filter((s) => s.done);
  const doneCount = doneSets.length;
  const total = session.sets.length;
  const minutes = Math.max(0, Math.round((clockNow - Date.parse(session.startedAt)) / 60000));
  const volume = doneSets.reduce((sum, x) => sum + x.weightKg * x.reps, 0);

  const finish = () => {
    if (doneCount === 0) {
      deleteSession(session.id);
      snackbar.show(L({ en: 'No sets logged — nothing saved', fr: 'Aucune série notée — rien n’a été enregistré' }));
      router.back();
      return;
    }
    setFinishOpen(true);
  };

  const complete = () => {
    const finished = { ...session, finishedAt: new Date().toISOString(), sets: session.sets };
    saveSession(finished);
    setFinishOpen(false);
    snackbar.show(L({ en: 'Workout saved · {{n}} sets', fr: 'Séance enregistrée · {{n}} séries' }, { n: doneCount }));
    router.back();
  };

  const restFraction = restEnd && restTotal ? Math.max(0, (restEnd - now) / (restTotal * 1000)) : 0;

  const page = pages[index] ?? pages[0];
  const nextRowPos = page.rows.findIndex(({ s }) => !s.done);
  const isLast = index === pages.length - 1;
  const name = exerciseName(page.ex, language);
  const dockAction =
    nextRowPos >= 0
      ? {
          label: L({ en: 'Log set {{n}}', fr: 'Valider la série {{n}}' }, { n: nextRowPos + 1 }),
          a11y: L({ en: 'Log set {{n}} of {{name}}', fr: 'Valider la série {{n}} de {{name}}' }, { n: nextRowPos + 1, name }),
          onPress: () => toggleDone(page.rows[nextRowPos].i, page.pe.restSec),
          icon: undefined,
        }
      : !isLast
        ? {
            label: L({ en: 'Next exercise', fr: 'Exercice suivant' }),
            a11y: L({ en: 'Next exercise', fr: 'Exercice suivant' }),
            onPress: () => goTo(index + 1),
            icon: (c: string) => <ArrowRight size={20} color={c} strokeWidth={2.6} />,
          }
        : {
            label: L({ en: 'Finish workout', fr: 'Terminer la séance' }),
            a11y: L({ en: 'Finish workout', fr: 'Terminer la séance' }),
            onPress: finish,
            icon: undefined,
          };

  const DOCK = 56 + space.sm + 64 + space.md * 2;
  const bottomSpace = DOCK + insets.bottom + space.xl;

  return (
    <View style={{ flex: 1, backgroundColor: t.ground }}>
      {/* Story bars and the session line, on black above the demo. */}
      <View style={[styles.band, { paddingTop: insets.top + space.xs }]}>
        <StoryBars
          segments={pages.map((p) => p.rows.filter(({ s }) => s.done).length / Math.max(1, p.rows.length))}
          current={index}
          onPress={goTo}
          labels={pages.map((p, i) =>
            L({ en: 'Exercise {{n}}: {{name}}', fr: 'Exercice {{n}} : {{name}}' }, { n: i + 1, name: exerciseName(p.ex, language) }),
          )}
          style={styles.bars}
        />
        <View style={styles.bandRow}>
          <IconButton
            label={L({ en: 'Back', fr: 'Retour' })}
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            icon={(c) => <ArrowLeft size={24} color={c} />}
          />
          <View style={{ flex: 1, minWidth: 0, alignItems: 'center' }}>
            <Txt variant="overline" align="center" numberOfLines={1}>
              {L(day.name)}
            </Txt>
            <Txt variant="overline" tone="tertiary" align="center" numberOfLines={1}>
              {L(
                { en: '{{done}}/{{total}} sets · {{m}} min', fr: '{{done}}/{{total}} séries · {{m}} min' },
                { done: doneCount, total, m: minutes },
              )}
            </Txt>
          </View>
          <Button
            label={L({ en: 'Finish', fr: 'Terminer' })}
            variant="outlined"
            onPress={finish}
            haptic="light"
            style={styles.finish}
          />
        </View>
      </View>

      <FlatList
        ref={listRef}
        data={pages}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyExtractor={(p) => p.pe.exerciseId}
        getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
        initialScrollIndex={index}
        windowSize={3}
        scrollEventThrottle={32}
        onScroll={(e) => {
          const i = Math.round(e.nativeEvent.contentOffset.x / width);
          if (i !== indexRef.current && i >= 0 && i < pages.length) {
            indexRef.current = i;
            setIndex(i);
          }
        }}
        renderItem={({ item, index: i }) => (
          <ExercisePage
            page={item}
            width={width}
            bottomSpace={bottomSpace}
            hint={progressionHint(item.pe, lastSets.get(item.pe.exerciseId) ?? [])}
            last={lastSets.get(item.pe.exerciseId) ?? []}
            showWarmup={i === 0 && doneCount === 0}
            onUpdate={updateSet}
            onToggle={toggleDone}
            onAdd={addSet}
            onForm={(id) =>
              router.push({ pathname: '/exercise/[id]', params: { id, day: day.id, index: String(day.exercises.indexOf(item.pe)) } })
            }
          />
        )}
      />

      {!keyboard ? (
        <View style={[styles.dock, { paddingBottom: insets.bottom + space.md, backgroundColor: t.ground, borderTopColor: t.hairline }]}>
          {restEnd ? (
            <RestStrip
              left={restLeft}
              fraction={restFraction}
              onAdd={() => {
                setRestEnd((e) => (e ? e + 30000 : e));
                setRestTotal((s) => s + 30);
              }}
              onSkip={() => setRestEnd(null)}
            />
          ) : (
            <UpNext next={pages[index + 1]} onPress={() => goTo(index + 1)} />
          )}
          <Button
            label={dockAction.label}
            accessibilityLabel={dockAction.a11y}
            icon={dockAction.icon}
            onPress={dockAction.onPress}
            size="lg"
            fill
            haptic="medium"
            style={{ marginTop: space.sm }}
          />
        </View>
      ) : null}

      <Sheet visible={finishOpen} onClose={() => setFinishOpen(false)} title={L({ en: 'Finish workout?', fr: 'Terminer la séance ?' })}>
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Txt variant="numLarge">{`${doneCount}/${total}`}</Txt>
            <Txt variant="overline" tone="tertiary">
              {L({ en: 'Sets', fr: 'Séries' })}
            </Txt>
          </View>
          <View style={styles.stat}>
            <Txt variant="numLarge">{fmt(Math.round(volume))}</Txt>
            <Txt variant="overline" tone="tertiary">
              {L({ en: 'Kg lifted', fr: 'Kg soulevés' })}
            </Txt>
          </View>
          <View style={styles.stat}>
            <Txt variant="numLarge">{String(minutes)}</Txt>
            <Txt variant="overline" tone="tertiary">
              min
            </Txt>
          </View>
        </View>
        <View style={{ marginTop: space.lg }}>
          <ProgressLine value={total ? doneCount / total : 0} />
        </View>
        {doneCount < total ? (
          <Txt variant="caption" tone="secondary" style={{ marginTop: space.md }}>
            {L({
              en: 'Only ticked sets count in your history and next targets.',
              fr: 'Seules les séries cochées comptent dans ton historique et tes prochains objectifs.',
            })}
          </Txt>
        ) : null}
        <View style={styles.sheetActions}>
          <Button label={L({ en: 'Save workout', fr: 'Enregistrer la séance' })} onPress={complete} size="lg" fill haptic="light" />
          <Button
            label={L({ en: 'Keep going', fr: 'Continuer' })}
            variant="outlined"
            onPress={() => setFinishOpen(false)}
            size="lg"
            fill
          />
        </View>
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  band: { paddingHorizontal: space.sm },
  bars: { paddingHorizontal: space.sm },
  bandRow: { flexDirection: 'row', alignItems: 'center', gap: space.xs, paddingBottom: space.xs },
  finish: { paddingHorizontal: space.lg, marginRight: space.xs },
  pageBody: { paddingHorizontal: space.gutter },
  photoFade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '40%' },
  nameBlock: { position: 'absolute', left: space.gutter, right: space.gutter, bottom: space.sm },
  nameRow: { flexDirection: 'row', alignItems: 'flex-end', gap: space.md },
  table: { marginTop: space.md, borderTopWidth: StyleSheet.hairlineWidth },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    minHeight: 64,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  num: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: space.xs,
    borderBottomWidth: 1,
    marginVertical: space.sm,
  },
  numInput: {
    fontFamily: fonts.display,
    fontSize: 30,
    lineHeight: 38,
    minWidth: 28,
    maxWidth: 92,
    paddingVertical: 0,
    paddingHorizontal: 0,
    includeFontPadding: false,
  },
  numUnit: { flexShrink: 1 },
  hint: { flexDirection: 'row', alignItems: 'flex-start', gap: space.sm, marginTop: space.lg },
  dock: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: space.gutter,
    paddingTop: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  slot: { minHeight: 64, justifyContent: 'center' },
  upNext: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    borderRadius: radius.md,
    paddingHorizontal: space.md,
    paddingVertical: space.sm,
  },
  restRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm, marginBottom: space.sm },
  restClock: { marginRight: space.xs },
  restAction: {
    minHeight: 48,
    minWidth: 52,
    paddingHorizontal: space.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radius.pill,
  },
  restActionLabel: { fontFamily: fonts.uiHeavy, textTransform: 'uppercase', letterSpacing: 0.4 },
  stats: { flexDirection: 'row', gap: space.lg },
  stat: { flex: 1, gap: 2 },
  sheetActions: { gap: space.sm, marginTop: space.xl },
});
