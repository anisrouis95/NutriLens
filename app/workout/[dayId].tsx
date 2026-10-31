// Live workout, one exercise per page. Built for the gym floor: story bars
// across the top show the whole session, each page opens with the moving
// demo, then the set table in big numerals, and a fixed dock holds the one
// action (LOG SET, then NEXT EXERCISE, then FINISH) under the thumb. While
// resting, the rest clock takes the dock's Up next slot.

import { memo, useEffect, useMemo, useRef, useState } from 'react';
import {
  FlatList,
  Keyboard,
  KeyboardAvoidingView,
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
import { ArrowLeft, ArrowLeftRight, ArrowRight, ChevronRight, Dumbbell, Info, Plus, Timer, TrendingUp } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { decimalComma } from '@/lib/i18n';
import { isFastingDay } from '@/lib/ramadan';
import { useRamadanSettings } from '@/hooks/useRamadan';
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
  DirIcon,
} from '@/components/ds';
import ExerciseAnimation, { ExerciseThumb } from '@/components/exercise/ExerciseAnimation';
import { Exercise, exerciseImageUrls, exerciseName, getExercise } from '@/lib/exercises';
import { prescription, swapInPlan } from '@/lib/workoutGenerator';
import { afterRatedSet, historyFor, targetFor, type Adjustment, type PastSession, type Target } from '@/lib/coach';
import { levelUps } from '@/lib/ladders';
import SwapSheet from '@/components/train/SwapSheet';
import { conflicts, LIMITATION_NAMES } from '@/lib/swap';
import { EFFORT_HELP, EFFORT_NAMES, NOTE_COPY, reasonCopy } from '@/components/train/coachCopy';
import { notificationSettings } from '@/lib/reminders';
import { cancelRestOver, liveClear, liveRest, liveSession, scheduleRestOver } from '@/services/notifications';
import type { MovementSlot } from '@/data/exerciseCuration';
import { newId } from '@/lib/storage';
import { fonts, radius, space, useTokens } from '@/theme';
import type { Effort, LoggedSet, PlannedExercise, Profile, WorkoutDay, WorkoutSession } from '@/types';

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
/** What a rated set changed for the sets after it (`n` = its number). */
type Note = { n: number; change: Adjustment };
/** The "how was it?" row above the rest clock. */
const EFFORT_HEIGHT = 72;
/** One exercise of the session: `planIndex`/`planId` locate it in the program, `pe` is what is done today (after a swap). */
type Page = { pe: PlannedExercise; ex: Exercise; rows: Row[]; planIndex: number; planId: string };

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
  const show = (v: number) => (v ? (decimalComma(language) ? String(v).replace('.', ',') : String(v)) : '');
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
        {L({ en: 'Set {{n}}', fr: 'Série {{n}}', tn: 'سيري {{n}}', tnLatn: 'Série {{n}}' }, { n })}
      </Txt>
      <NumInput
        value={set.weightKg}
        onChange={onWeight}
        placeholder="0"
        decimal
        unit="kg"
        color={ink}
        label={L({ en: 'Set {{n}} weight in kg', fr: 'Série {{n}}, charge en kg', tn: 'سيري {{n}}، الثقل بالـ kg', tnLatn: 'Série {{n}}, charge b kg' }, { n })}
      />
      <NumInput
        value={set.reps}
        onChange={onReps}
        placeholder={repsPlaceholder}
        unit={timed ? 's' : L({ en: 'reps', fr: 'rép.', tn: 'مرّات', tnLatn: 'reps' })}
        color={ink}
        label={
          timed
            ? L({ en: 'Set {{n}} seconds', fr: 'Série {{n}}, secondes', tn: 'سيري {{n}}، ثواني', tnLatn: 'Série {{n}}, secondes' }, { n })
            : L({ en: 'Set {{n}} reps', fr: 'Série {{n}}, répétitions', tn: 'سيري {{n}}، مرّات', tnLatn: 'Série {{n}}, reps' }, { n })
        }
      />
      <StampCheck
        done={set.done}
        onPress={onToggle}
        size={CHECK}
        label={L({ en: 'Set {{n}} done', fr: 'Série {{n}} faite', tn: 'سيري {{n}} تعملت', tnLatn: 'Série {{n}} t3malet' }, { n })}
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
  target,
  note,
  showWarmup,
  onUpdate,
  onToggle,
  onAdd,
  onForm,
  onSwap,
}: {
  page: Page;
  width: number;
  bottomSpace: number;
  target: Target;
  /** What the last rated set changed in the sets below it. */
  note?: Note;
  showWarmup: boolean;
  onUpdate: (globalIndex: number, patch: Pick<Partial<LoggedSet>, 'weightKg' | 'reps'>) => void;
  onToggle: (globalIndex: number, restSec: number) => void;
  onAdd: (page: Page) => void;
  onForm: (exerciseId: string) => void;
  onSwap: (page: Page) => void;
}) {
  const t = useTokens();
  const fmt = useFormat();
  const { L, language, rtl } = useLanguage();
  const { pe, ex, rows } = page;
  const { profile } = useAppData();
  const hardOn = profile ? conflicts(pe.exerciseId, profile) : [];
  const kg = (n: number) => fmt(n, Number.isInteger(n) ? 0 : 1);
  const unit = pe.timed ? 's' : L({ en: 'reps', fr: 'rép.', tn: 'مرّات', tnLatn: 'reps' });
  const min = pe.restSec / 60;
  const rest = pe.restSec >= 120 ? `${Number.isInteger(min) ? min : fmt(min, 1)}${NB}min` : `${pe.restSec}${NB}s`;
  const currentRow = rows.findIndex(({ s }) => !s.done);

  const last = target.last?.sets ?? [];
  // Best set of the last session: heaviest weight, then most reps.
  const best = [...last].sort((a, b) => b.weightKg - a.weightKg || b.reps - a.reps)[0];
  const lastText = best
    ? L(
        { en: 'Last {{v}}', fr: 'Dernière fois {{v}}', tn: 'آخر مرّة {{v}}', tnLatn: 'E5er marra {{v}}' },
        { v: best.weightKg ? `${kg(best.weightKg)}${NB}kg${NB}×${NB}${best.reps}` : `${best.reps}${NB}${unit}` },
      )
    : L({ en: 'First time', fr: 'Première fois', tn: 'أوّل مرّة', tnLatn: 'Awwel marra' });

  // Today's target: "25 kg × 10 · 10 · 10" (or reps only), and the reason for it.
  const repsLine = target.reps.join(' · ');
  const targetLine =
    target.reason.kind === 'first_time' && target.reason.bodyweight
      ? `${pe.repsMin}–${pe.repsMax}${NB}${unit}`
      : target.reason.kind === 'first_time'
      ? L({ en: 'Set 1 is a test · {{r}} {{u}}', fr: 'Série 1 = test · {{r}} {{u}}', tn: 'السيري 1 تجربة · {{r}} {{u}}', tnLatn: 'Série 1 test · {{r}} {{u}}' }, { r: pe.repsMin, u: unit })
      : target.weightKg
        ? `${kg(target.weightKg)}${NB}kg${NB}×${NB}${repsLine}`
        : `${repsLine}${NB}${unit}`;
  const reasonText = L(reasonCopy(target.reason, !!pe.timed), {
    min: pe.repsMin,
    max: pe.repsMax,
    // The test weight leaves about 7 reps in the tank (lib/coach.ts reads Easy there as 6).
    test: Math.max(15, pe.repsMin + 7),
    kg: 'weightKg' in target.reason ? kg(target.reason.weightKg) : '',
    from: 'from' in target.reason ? kg(target.reason.from) : '',
    to: 'to' in target.reason ? kg(target.reason.to) : '',
    days: target.reason.kind === 'comeback' ? target.reason.days : '',
  });
  const noteText = note
    ? L(NOTE_COPY[note.change.kind], {
        n: note.n,
        kg: 'weightKg' in note.change ? kg(note.change.weightKg) : '',
        reps: 'reps' in note.change ? note.change.reps : '',
      })
    : null;

  return (
    <ScrollView
      style={{ width, direction: rtl ? 'rtl' : 'ltr' }}
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
            <View style={styles.nameActions}>
              <IconButton
                label={L({ en: 'Swap exercise', fr: 'Changer d’exercice', tn: 'بدّل التمرين', tnLatn: 'Baddel l exercice' })}
                variant="tonal"
                onPress={() => onSwap(page)}
                icon={(c) => <ArrowLeftRight size={22} color={c} />}
              />
              <IconButton
                label={L({ en: 'How to do it', fr: 'Comment le faire', tn: 'كيفاش تعملو', tnLatn: 'Kifech ta3mlou' })}
                variant="tonal"
                onPress={() => onForm(pe.exerciseId)}
                icon={(c) => <Info size={22} color={c} />}
              />
            </View>
          </View>
          {hardOn.length ? (
            <Txt variant="label" tone="danger" style={{ marginTop: space.xs }}>
              {L(
                { en: 'Hard on your {{parts}}: swap it ⇄', fr: 'Difficile pour tes {{parts}} : remplace-le ⇄', tn: 'يتعب {{parts}} متاعك: بدّلو ⇄', tnLatn: 'Yta3eb {{parts}} mte3ek: baddlou ⇄' },
                { parts: hardOn.map((l) => L(LIMITATION_NAMES[l])).join(', ').toLowerCase() },
              )}
            </Txt>
          ) : null}
          <Txt variant="overline" tone="secondary" style={{ marginTop: space.xs }}>
            {`${pe.sets}${NB}×${NB}${pe.repsMin}–${pe.repsMax}${NB}${unit} · ${L({ en: 'rest', fr: 'repos', tn: 'راحة', tnLatn: 'repos' })}${NB}${rest} · ${lastText}`}
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
          label={L({ en: 'Add set', fr: 'Ajouter une série', tn: 'زيد سيري', tnLatn: 'Zid série' })}
          variant="text"
          icon={(c) => <Plus size={18} color={c} strokeWidth={2.6} />}
          onPress={() => onAdd(page)}
          style={{ marginTop: space.xs, marginLeft: -space.md }}
        />

        {showWarmup ? (
          <Why
            title={L({ en: 'Warm up first (5–8 min)', fr: 'Échauffe-toi d’abord (5–8 min)', tn: 'سخّن روحك قبل (5–8 min)', tnLatn: 'Sa55en rou7ek 9bal (5–8 min)' })}
            style={{ marginTop: space.md }}
          >
            <Txt tone="secondary">
              {L({
                en: 'A few minutes of brisk walking or bike, then 1–2 light sets of this exercise at ~50% of the working weight.',
                fr: 'Quelques minutes de marche rapide ou de vélo, puis 1 à 2 séries légères de cet exercice à ~50 % de la charge de travail.',
                tn: 'شويّة دقايق مشي بالزربة ولا بيسكلات، ومبعد 1–2 سيريات خفاف من التمرين هذا بـ ~50% من الثقل متاع الخدمة.',
                tnLatn: 'Chwaya d9aye9 mchi bel zerba wala vélo, w ba3d 1–2 séries 5fef mel exercice hedha b ~50% mel charge mta3 l 5edma.',
              })}
            </Txt>
          </Why>
        ) : null}

        {noteText ? (
          <View style={[styles.note, { backgroundColor: t.accentSoft }]} accessibilityLiveRegion="polite">
            <Txt variant="label" color={t.accentText}>
              {noteText}
            </Txt>
          </View>
        ) : null}

        <View style={[styles.target, { borderColor: t.hairline }]}>
          <View style={styles.targetHead}>
            <TrendingUp size={18} color={t.accentText} />
            <Txt variant="overline" tone="secondary">
              {L({ en: 'Today', fr: 'Aujourd’hui', tn: 'اليوم', tnLatn: 'Lyoum' })}
            </Txt>
          </View>
          <Txt variant="numMedium" style={{ marginTop: space.xs }}>
            {targetLine}
          </Txt>
          <Txt variant="caption" tone="secondary" style={{ marginTop: space.xs }}>
            {reasonText}
          </Txt>
        </View>
        <Why
          title={L({ en: 'How hard should a set be?', fr: 'Une série doit être dure comment ?', tn: 'قدّاش لازم تكون السيري صعيبة؟', tnLatn: '9addech lazem tkoun série s3iba?' })}
          style={{ marginTop: space.md }}
        >
          <Txt tone="secondary">
            {L({
              en: 'Stop each set with about 2 good reps left: that is “Good”. Only the last reps should be a fight. After each set, tell the app how it felt: Easy (4 or more reps left) raises the next sets, Hard (0–1 left, or you failed) lowers them. Next session starts from what you did today.',
              fr: 'Arrête chaque série en gardant environ 2 bonnes répétitions en réserve : c’est « Bien ». Seules les dernières répétitions doivent être un combat. Après chaque série, dis à l’app comment c’était : Facile (4 répétitions ou plus en réserve) augmente les séries suivantes, Dur (0–1 en réserve, ou échec) les baisse. La prochaine séance part de ce que tu as fait aujourd’hui.',
              tn: 'وقّف كل سيري وانت مازال تنجّم تعمل قريب 2 مرّات نظاف: هذا “مليح”. كان المرّات الأخرانين لازم يكونو صعاب. بعد كل سيري، قول للتطبيق كيفاش جاتك: ساهل (مازال تنجّم 4 ولا أكثر) يطلّع السيريات الجايين، صعيب (0–1 ولا ما كمّلتش) يهبّطهم. الحصّة الجاية تبدا من اللي عملتو اليوم.',
              tnLatn: 'Wa99ef kol série w enti mazelt tnajjem ta3mel 9rib 2 reps ndhaf: hedha “Mli7”. Ken les reps le5ranin lazem ykounou s3ab. Ba3d kol série, 9oul lel app kifech jatek: Sehel (mazelt tnajjem 4 walla akther) ytalla3 les séries el jeyin, S3ib (0–1 walla ma kammaltech) yhabbathom. Séance el jeya tebda men eli 3maltou lyoum.',
            })}
          </Txt>
        </Why>
        <Txt variant="caption" tone="tertiary" style={{ marginTop: space.lg }}>
          {L({
            en: 'Bodyweight exercise? Leave kg at 0. Stop a set if you feel sharp pain — effort burns, pain stabs.',
            fr: 'Exercice au poids du corps ? Laisse 0 kg. Arrête une série en cas de douleur vive — l’effort brûle, la douleur pique.',
            tn: 'تمرين بوزن بدنك؟ خلّي kg على 0. وقّف السيري كان تحسّ بوجيعة قويّة — المجهود يحرقك، الوجيعة تنغزك.',
            tnLatn: 'Exercice b poids el corps? 5alli kg 3al 0. Wa99ef série ken t7ess b wji3a 9wiya — l effort y7ar9ek, l wji3a ten8zek.',
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
          {over
            ? L({ en: 'Go! Next set', fr: 'C’est reparti !', tn: 'هيّا! السيري الجاية', tnLatn: 'Hayya! Série jeya' })
            : L({ en: 'Rest', fr: 'Repos', tn: 'راحة', tnLatn: 'Repos' })}
        </Txt>
        <Txt variant="numLarge" color={over ? t.accentText : t.text} style={styles.restClock}>
          {clock}
        </Txt>
        {action('+30 s', onAdd, L({ en: 'Add 30 seconds', fr: 'Ajouter 30 secondes', tn: 'زيد 30 ثانية', tnLatn: 'Zid 30 secondes' }))}
        {action(
          L({ en: 'Skip', fr: 'Passer', tn: 'فوّت', tnLatn: 'Fawwet' }),
          onSkip,
          L({ en: 'Skip rest', fr: 'Passer le repos', tn: 'فوّت الراحة', tnLatn: 'Fawwet repos' }),
        )}
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
            {L({ en: 'Last exercise', fr: 'Dernier exercice', tn: 'آخر تمرين', tnLatn: 'E5er exercice' })}
          </Txt>
          <Txt variant="caption" tone="tertiary" numberOfLines={1}>
            {L({
              en: 'Then finish and save your workout',
              fr: 'Ensuite, termine et enregistre ta séance',
              tn: 'ومبعد كمّل وسجّل الحصّة',
              tnLatn: 'W ba3d kammel w sajjel séance',
            })}
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
      accessibilityLabel={L({ en: 'Up next: {{name}}', fr: 'Ensuite : {{name}}', tn: 'اللي بعدو: {{name}}', tnLatn: 'Eli ba3dou: {{name}}' }, { name: nextName })}
      pressedStyle={{ backgroundColor: t.pressed }}
      style={[styles.slot, styles.upNext, { backgroundColor: t.surface }]}
    >
      <ExerciseThumb uri={exerciseImageUrls(next.ex)[0]} size={44} />
      <View style={{ flex: 1, minWidth: 0 }}>
        <Txt variant="bodyStrong" numberOfLines={2}>
          <Txt variant="bodyStrong" tone="tertiary">
            {L({ en: 'Up next · ', fr: 'Ensuite · ', tn: 'اللي بعدو · ', tnLatn: 'Eli ba3dou · ' })}
          </Txt>
          {nextName}
        </Txt>
        {nextName.length <= 16 ? (
          <Txt variant="caption" tone="tertiary" numberOfLines={1}>
            {L({
              en: 'Swipe or tap when this one is done',
              fr: 'Glisse ou touche quand celui-ci est fini',
              tn: 'زلّق ولا اكبس كي تكمّل هذا',
              tnLatn: 'Zalle9 wala ekbes ki tkammel hedha',
            })}
          </Txt>
        ) : null}
      </View>
      <DirIcon icon={ChevronRight} size={20} color={t.textTertiary} />
    </Tap>
  );
}

/** The exercise done today for a program entry: the program's, or the one swapped in for this session only. */
function todaysExercise(planned: PlannedExercise, session: Pick<WorkoutSession, 'swaps'>, profile: Profile): PlannedExercise {
  const id = session.swaps?.[planned.exerciseId];
  if (!id || id === planned.exerciseId || !getExercise(id)) return planned;
  // Swapped for today only: off its calisthenics ladder too (it can't level the ladder up).
  return { ...planned, ladder: undefined, exerciseId: id, ...prescription(planned.slot as MovementSlot, id, profile) };
}

/** Sets for an exercise, filled with the coach's target. */
function freshSets(pe: PlannedExercise, target: Target, count: number): LoggedSet[] {
  return Array.from({ length: count }, (_, i) => ({
    exerciseId: pe.exerciseId,
    reps: target.reps[i] ?? target.reps[target.reps.length - 1] ?? pe.repsMin,
    weightKg: target.weightKg,
    done: false,
  }));
}

/**
 * Brings a session in line with the program (the ⓘ page can swap an exercise
 * mid-workout): exercises it lacks get their sets, sets not done for exercises
 * that left it go, done sets always stay. Sets attached to no exercise (left
 * by the old Add set bug) are dropped. Returns the same object if nothing changes.
 */
function reconcile(
  session: WorkoutSession,
  day: WorkoutDay,
  profile: Profile,
  setsFor: (pe: PlannedExercise) => LoggedSet[],
): WorkoutSession {
  const todays = day.exercises.map((planned) => todaysExercise(planned, session, profile));
  const ids = new Set(todays.map((pe) => pe.exerciseId));
  const kept = session.sets.filter((x) => x.exerciseId && (x.done || ids.has(x.exerciseId)));
  const missing = todays.filter((pe) => !kept.some((x) => x.exerciseId === pe.exerciseId));
  if (kept.length === session.sets.length && !missing.length) return session;
  return { ...session, sets: [...kept, ...missing.flatMap(setsFor)] };
}

/** One tap after a set: how it felt. Shown in the dock until answered or the next set is logged. */
function EffortRow({ n, onRate }: { n: number; onRate: (effort: Effort) => void }) {
  const t = useTokens();
  const { L } = useLanguage();
  return (
    <View style={styles.effort}>
      <Txt variant="overline" tone="secondary" numberOfLines={1}>
        {L({ en: 'How was set {{n}}?', fr: 'Série {{n}}, c’était comment ?', tn: 'كيفاش جاتك السيري {{n}}؟', tnLatn: 'Kifech jatek série {{n}}?' }, { n })}
      </Txt>
      <View style={styles.effortButtons}>
        {(['easy', 'good', 'hard'] as const).map((e) => (
          <Tap
            key={e}
            onPress={() => onRate(e)}
            haptic="selection"
            pressScale={0.95}
            accessibilityLabel={`${L(EFFORT_NAMES[e])}: ${L(EFFORT_HELP[e])}`}
            pressedStyle={{ backgroundColor: t.pressed }}
            style={[styles.effortButton, { backgroundColor: t.surfaceHigh }]}
          >
            <Txt variant="label" numberOfLines={1}>
              {L(EFFORT_NAMES[e])}
            </Txt>
          </Tap>
        ))}
      </View>
    </View>
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
  const { workoutPlan, setWorkoutPlan, profile, sessions, saveSession, deleteSession, today, settings, updateSettings } = useAppData();
  const { dayId, light } = useLocalSearchParams<{ dayId: string; light?: string }>();
  const day = workoutPlan?.days.find((d) => d.id === dayId);
  // Ramadan mode on a fasting day, or "tired today" from the Train tab: a lighter session.
  const [ramadan] = useRamadanSettings();
  const lighter = (ramadan.lighter && isFastingDay(ramadan, today)) || light === '1';

  // Each exercise's past sessions, newest first (this unfinished one never counts).
  const historyOf = useMemo(() => {
    const cache = new Map<string, PastSession[]>();
    return (id: string) => {
      let h = cache.get(id);
      if (!h) {
        h = historyFor(id, sessions);
        cache.set(id, h);
      }
      return h;
    };
  }, [sessions]);
  // Lighter (Ramadan fasting day, or "tired today"): one set fewer, never below 2.
  const count = (pe: PlannedExercise) => (lighter && pe.sets > 2 ? pe.sets - 1 : pe.sets);
  const targetOf = (pe: PlannedExercise, n: number) => targetFor(pe, n, historyOf(pe.exerciseId), { today, steps: settings.kgSteps });
  const setsFor = (pe: PlannedExercise) => freshSets(pe, targetOf(pe, count(pe)), count(pe));

  const [session, setSession] = useState<WorkoutSession | null>(() => {
    if (!day) return null;
    const unfinished = sessions.find((s) => s.dayId === day.id && !s.finishedAt && s.date === today);
    if (unfinished) return profile ? reconcile(unfinished, day, profile, setsFor) : unfinished;
    return {
      id: newId(),
      date: today,
      dayId: day.id,
      dayName: day.name,
      startedAt: new Date().toISOString(),
      sets: day.exercises.flatMap(setsFor),
    };
  });

  // The program changed while this screen was open (a swap from the ⓘ page): every exercise keeps its sets.
  useEffect(() => {
    if (day && profile) setSession((s) => (s ? reconcile(s, day, profile, setsFor) : s));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day, profile]);

  // Persist progress so leaving the screen doesn't lose the workout.
  useEffect(() => {
    if (session && session.sets.some((s) => s.done)) saveSession(session);
  }, [session, saveSession]);

  const pages: Page[] = useMemo(() => {
    if (!day || !session || !profile) return [];
    const indexed = session.sets.map((s, i) => ({ s, i }));
    return day.exercises.flatMap((planned, planIndex) => {
      const pe = todaysExercise(planned, session, profile);
      const ex = getExercise(pe.exerciseId);
      const rows = indexed.filter(({ s }) => s.exerciseId === pe.exerciseId);
      // The prescription shows the sets of this session when Ramadan mode trimmed them.
      const shown = rows.length < pe.sets ? { ...pe, sets: rows.length } : pe;
      return ex ? [{ pe: shown, ex, rows, planIndex, planId: planned.exerciseId }] : [];
    });
  }, [day, session, profile]);

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

  // The phone's notification for this workout: the rest countdown while resting, else the next set.
  const ns = notificationSettings(settings.notifications);
  /** "Leg Press, set 2: 30 kg × 10" for the first set still to do, skipping `skip` (the one just logged). */
  const upNext = (skip?: number) => {
    const start = Math.max(0, pages.findIndex((p) => p.rows.some(({ i }) => i === skip)));
    for (const p of [...pages.slice(start), ...pages.slice(0, start)]) {
      const n = p.rows.findIndex(({ s, i }) => !s.done && i !== skip);
      if (n < 0) continue;
      const s = p.rows[n].s;
      const unitText = p.pe.timed ? 's' : L({ en: 'reps', fr: 'rép.', tn: 'مرّات', tnLatn: 'reps' });
      return L(
        { en: 'Next: {{name}}, set {{n}} · {{what}}', fr: 'Ensuite : {{name}}, série {{n}} · {{what}}', tn: 'اللي بعدو: {{name}}، سيري {{n}} · {{what}}', tnLatn: 'Eli ba3dou: {{name}}, série {{n}} · {{what}}' },
        { name: exerciseName(p.ex, language), n: n + 1, what: s.weightKg ? `${fmt(s.weightKg, Number.isInteger(s.weightKg) ? 0 : 1)} kg × ${s.reps}` : `${s.reps} ${unitText}` },
      );
    }
    return L({ en: 'Last set done: finish and save your workout.', fr: 'Dernière série faite : termine et enregistre ta séance.', tn: 'آخر سيري تعملت: كمّل وسجّل الحصّة.', tnLatn: 'E5er série t3malet: kammel w sajjel séance.' });
  };
  const restTitle = day ? L({ en: 'Rest · {{day}}', fr: 'Repos · {{day}}', tn: 'راحة · {{day}}', tnLatn: 'Repos · {{day}}' }, { day: L(day.name) }) : '';
  const restOverTitle = L({ en: 'Rest over: go!', fr: 'Repos fini : c’est reparti !', tn: 'الراحة وفات: هيّا!', tnLatn: 'El repos wfé: hayya!' });
  /** Countdown on the lock screen and the buzz at its end. */
  const announceRest = (endAt: number, skip?: number) => {
    if (!ns.rest) return;
    const next = upNext(skip);
    liveRest(endAt, restTitle, next);
    scheduleRestOver(endAt, restOverTitle, next).catch(() => undefined);
  };
  const doneNow = session?.sets.filter((s) => s.done).length ?? 0;
  const totalNow = session?.sets.length ?? 0;
  useEffect(() => {
    if (!day || restEnd) return;
    if (!ns.ongoing) {
      liveClear();
      return;
    }
    liveSession(
      L({ en: '{{day}} · {{done}}/{{total}} sets', fr: '{{day}} · {{done}}/{{total}} séries', tn: '{{day}} · {{done}}/{{total}} سيريات', tnLatn: '{{day}} · {{done}}/{{total}} séries' }, { day: L(day.name), done: doneNow, total: totalNow }),
      upNext(),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [day, restEnd, ns.ongoing, doneNow, totalNow, language]);
  // Leaving the workout (saved or not) takes its notification and pending alert with it.
  useEffect(
    () => () => {
      liveClear();
      cancelRestOver();
    },
    [],
  );

  const [finishOpen, setFinishOpen] = useState(false);
  const [swapPage, setSwapPage] = useState<Page | null>(null);
  // The set just logged, waiting for "how was it?", and what rated sets changed per exercise.
  const [rating, setRating] = useState<number | null>(null);
  const [notes, setNotes] = useState<Record<string, Note>>({});

  if (!day || !session || !pages.length) {
    return (
      <Screen back title={L({ en: 'Workout', fr: 'Séance', tn: 'حصّة', tnLatn: 'Séance' })} largeTitle={false}>
        <EmptyState
          icon={(c) => <Dumbbell size={28} color={c} />}
          title={L({ en: 'Workout not found.', fr: 'Séance introuvable.', tn: 'الحصّة مش موجودة.', tnLatn: 'Séance mech mawjouda.' })}
          body={L({
            en: 'Your program may have been rebuilt. Pick a session from the Train tab.',
            fr: 'Ton programme a peut-être été refait. Choisis une séance dans l’onglet Sport.',
            tn: 'ممكن البرنامج متاعك تعاود. اختار حصّة من صفحة التمرين.',
            tnLatn: 'Momken el programme mte3ek t3awed. E5tar séance mel page Sport.',
          })}
        />
      </Screen>
    );
  }

  const patchSet = (globalIndex: number, patch: Partial<LoggedSet>) =>
    setSession((s) => (s ? { ...s, sets: s.sets.map((x, i) => (i === globalIndex ? { ...x, ...patch } : x)) } : s));

  /** Typing in a set fills the sets below it that aren't done and weren't typed in. */
  const editSet = (globalIndex: number, patch: Pick<Partial<LoggedSet>, 'weightKg' | 'reps'>) =>
    setSession((s) => {
      if (!s) return s;
      const id = s.sets[globalIndex].exerciseId;
      return {
        ...s,
        sets: s.sets.map((x, i) => {
          if (i === globalIndex) return { ...x, ...patch, manual: true };
          if (i > globalIndex && x.exerciseId === id && !x.done && !x.manual) return { ...x, ...patch };
          return x;
        }),
      };
    });

  const toggleDone = (globalIndex: number, restSec: number) => {
    const set = session.sets[globalIndex];
    patchSet(globalIndex, set.done ? { done: false, effort: undefined } : { done: true });
    if (!set.done) {
      // StampCheck gives a success haptic with its stamp; without motion it doesn't.
      if (reduce) hapticTap('light');
      const endAt = Date.now() + restSec * 1000;
      setRestEnd(endAt);
      setRestTotal(restSec);
      setNow(Date.now());
      setRating(globalIndex);
      if (restSec > 0) announceRest(endAt, globalIndex);
    } else if (rating === globalIndex) {
      setRating(null);
    }
  };

  /** Records how a set felt, and moves the sets still to come up or down when it calls for it. */
  const rate = (effort: Effort) => {
    if (rating === null) return;
    const globalIndex = rating;
    setRating(null);
    const set = { ...session.sets[globalIndex], effort };
    const ratedPage = pages.find((p) => p.rows.some(({ i }) => i === globalIndex));
    if (!ratedPage) {
      patchSet(globalIndex, { effort });
      return;
    }
    const n = ratedPage.rows.findIndex(({ i }) => i === globalIndex);
    const target = targetOf(ratedPage.pe, ratedPage.rows.length);
    const change = afterRatedSet(ratedPage.pe, set, target.reps[n] ?? ratedPage.pe.repsMin, target.step, !target.last);
    const follows = (x: LoggedSet, i: number) => !!change && i > globalIndex && x.exerciseId === set.exerciseId && !x.done && !x.manual;
    setSession((s) =>
      s
        ? {
            ...s,
            sets: s.sets.map((x, i) => {
              if (i === globalIndex) return { ...x, effort };
              if (!change || !follows(x, i)) return x;
              if (change.kind === 'calibrated') return { ...x, weightKg: change.weightKg, reps: change.reps };
              if (change.kind === 'more_reps') return { ...x, reps: change.reps };
              return { ...x, weightKg: change.weightKg };
            }),
          }
        : s,
    );
    if (change && session.sets.some(follows)) setNotes((prev) => ({ ...prev, [set.exerciseId]: { n: n + 1, change } }));
  };

  const addSet = (page: Page) =>
    setSession((s) => {
      if (!s) return s;
      const id = page.pe.exerciseId;
      const at = s.sets.map((x) => x.exerciseId).lastIndexOf(id);
      // No set for it at all: start from today's target.
      if (at < 0) return { ...s, sets: [...s.sets, ...freshSets(page.pe, targetOf(page.pe, 1), 1)] };
      const { reps, weightKg } = s.sets[at];
      const sets = [...s.sets];
      sets.splice(at + 1, 0, { exerciseId: id, reps, weightKg, done: false });
      return { ...s, sets };
    });

  /**
   * Swaps an exercise in today's session; with `inProgram`, in the program too.
   * Sets not yet done move to the new exercise; logged sets stay as they were.
   */
  const swapExercise = (page: Page, newExerciseId: string, inProgram: boolean) => {
    if (!profile || !workoutPlan) return;
    const oldId = page.pe.exerciseId;
    const next: PlannedExercise = {
      ...page.pe,
      ladder: undefined,
      exerciseId: newExerciseId,
      ...prescription(page.pe.slot as MovementSlot, newExerciseId, profile),
    };
    const left = page.rows.filter(({ s }) => !s.done).length;
    const target = targetOf(next, left || count(next));
    setSession((s) => {
      if (!s) return s;
      let moved = 0;
      let sets = s.sets.map((x) => {
        if (x.exerciseId !== oldId || x.done) return x;
        const reps = target.reps[moved] ?? next.repsMin;
        moved++;
        return { exerciseId: newExerciseId, reps, weightKg: target.weightKg, done: false };
      });
      // Every set was already done: the new exercise starts with its own sets after them.
      if (!moved) {
        const at = sets.map((x) => x.exerciseId).lastIndexOf(oldId) + 1;
        sets = [...sets.slice(0, at), ...freshSets(next, target, count(next)), ...sets.slice(at)];
      }
      const swaps = { ...s.swaps };
      if (inProgram) delete swaps[page.planId];
      else swaps[page.planId] = newExerciseId;
      return { ...s, sets, swaps };
    });
    setNotes(({ [oldId]: _, ...rest }) => rest);
    if (inProgram) setWorkoutPlan(swapInPlan(workoutPlan, day.id, page.planIndex, newExerciseId, profile));
    setSwapPage(null);
    snackbar.show(
      inProgram
        ? L({ en: 'Swapped, today and in your program', fr: 'Remplacé, aujourd’hui et dans ton programme', tn: 'تبدّل، اليوم وفي البرنامج متاعك', tnLatn: 'Tbaddel, lyoum w fel programme mte3ek' })
        : L({ en: 'Swapped for today', fr: 'Remplacé pour aujourd’hui', tn: 'تبدّل لليوم', tnLatn: 'Tbaddel l lyoum' }),
    );
  };

  const doneSets = session.sets.filter((s) => s.done);
  const doneCount = doneSets.length;
  const total = session.sets.length;
  const minutes = Math.max(0, Math.round((clockNow - Date.parse(session.startedAt)) / 60000));
  const volume = doneSets.reduce((sum, x) => sum + x.weightKg * x.reps, 0);

  const finish = () => {
    if (doneCount === 0) {
      deleteSession(session.id);
      snackbar.show(L({
        en: 'No sets logged — nothing saved',
        fr: 'Aucune série notée — rien n’a été enregistré',
        tn: 'ما سجّلت حتى سيري — ما تسجّل شي',
        tnLatn: 'Ma sajjelt 7atta série — ma tsajjel chay',
      }));
      router.back();
      return;
    }
    setFinishOpen(true);
  };

  const complete = () => {
    const finished = { ...session, finishedAt: new Date().toISOString(), sets: session.sets };
    saveSession(finished);
    setFinishOpen(false);
    // Calisthenics: a step done at the top of its range on every set moves its ladder up.
    const ups = profile
      ? levelUps(
          pages.map((p) => ({ ladder: p.pe.ladder, sets: p.rows.map(({ s }) => s), repsMax: p.pe.repsMax })),
          settings.ladderSteps,
          profile,
        )
      : [];
    if (ups.length) updateSettings({ ladderSteps: { ...settings.ladderSteps, ...Object.fromEntries(ups.map((u) => [u.ladder, u.index])) } });
    const upName = ups[0] ? getExercise(ups[0].id) : undefined;
    snackbar.show(
      upName
        ? L(
            { en: 'Saved · Level up: {{name}} next time', fr: 'Enregistrée · Niveau suivant : {{name}} la prochaine fois', tn: 'تسجّلت · طلعت درجة: {{name}} المرّة الجاية', tnLatn: 'Tsajjlet · Tla3t daraja: {{name}} l marra el jeya' },
            { name: exerciseName(upName, language) },
          )
        : L(
            { en: 'Workout saved · {{n}} sets', fr: 'Séance enregistrée · {{n}} séries', tn: 'الحصّة تسجّلت · {{n}} سيريات', tnLatn: 'Séance tsajjlet · {{n}} séries' },
            { n: doneCount },
          ),
      {
        label: L({ en: 'Add cardio', fr: 'Ajouter du cardio', tn: 'زيد كارديو', tnLatn: 'Zid cardio' }),
        onPress: () => router.push('/cardio'),
      },
    );
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
          label: L({ en: 'Log set {{n}}', fr: 'Valider la série {{n}}', tn: 'سجّل السيري {{n}}', tnLatn: 'Sajjel série {{n}}' }, { n: nextRowPos + 1 }),
          a11y: L(
            {
              en: 'Log set {{n}} of {{name}}',
              fr: 'Valider la série {{n}} de {{name}}',
              tn: 'سجّل السيري {{n}} متاع {{name}}',
              tnLatn: 'Sajjel série {{n}} mta3 {{name}}',
            },
            { n: nextRowPos + 1, name },
          ),
          onPress: () => toggleDone(page.rows[nextRowPos].i, page.pe.restSec),
          icon: undefined,
        }
      : !isLast
        ? {
            label: L({ en: 'Next exercise', fr: 'Exercice suivant', tn: 'التمرين اللي بعدو', tnLatn: 'Exercice eli ba3dou' }),
            a11y: L({ en: 'Next exercise', fr: 'Exercice suivant', tn: 'التمرين اللي بعدو', tnLatn: 'Exercice eli ba3dou' }),
            onPress: () => goTo(index + 1),
            icon: (c: string) => <DirIcon icon={ArrowRight} size={20} color={c} strokeWidth={2.6} />,
          }
        : {
            label: L({ en: 'Finish workout', fr: 'Terminer la séance', tn: 'كمّل الحصّة', tnLatn: 'Kammel séance' }),
            a11y: L({ en: 'Finish workout', fr: 'Terminer la séance', tn: 'كمّل الحصّة', tnLatn: 'Kammel séance' }),
            onPress: finish,
            icon: undefined,
          };

  const ratingRow = rating !== null ? pages.flatMap((p) => p.rows.map(({ i }, n) => (i === rating ? n + 1 : 0))).find(Boolean) : undefined;
  const DOCK = 56 + space.sm + 64 + space.md * 2 + (ratingRow ? EFFORT_HEIGHT : 0);
  const bottomSpace = DOCK + insets.bottom + space.xl;

  return (
    // Shortens the exercise pages while the keyboard is up, so the set being
    // typed scrolls into view above it (Android no longer resizes the window).
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1, backgroundColor: t.ground }}>
      {/* Story bars and the session line, on black above the demo. */}
      <View style={[styles.band, { paddingTop: insets.top + space.xs }]}>
        <StoryBars
          segments={pages.map((p) => p.rows.filter(({ s }) => s.done).length / Math.max(1, p.rows.length))}
          current={index}
          onPress={goTo}
          labels={pages.map((p, i) =>
            L(
              { en: 'Exercise {{n}}: {{name}}', fr: 'Exercice {{n}} : {{name}}', tn: 'تمرين {{n}}: {{name}}', tnLatn: 'Exercice {{n}}: {{name}}' },
              { n: i + 1, name: exerciseName(p.ex, language) },
            ),
          )}
          style={styles.bars}
        />
        <View style={styles.bandRow}>
          <IconButton
            label={L({ en: 'Back', fr: 'Retour', tn: 'ارجع', tnLatn: 'Erja3' })}
            onPress={() => (router.canGoBack() ? router.back() : router.replace('/'))}
            icon={(c) => <DirIcon icon={ArrowLeft} size={24} color={c} />}
          />
          <View style={{ flex: 1, minWidth: 0, alignItems: 'center' }}>
            <Txt variant="overline" align="center" numberOfLines={1}>
              {L(day.name)}
            </Txt>
            <Txt variant="overline" tone="tertiary" align="center" numberOfLines={1}>
              {L(
                {
                  en: '{{done}}/{{total}} sets · {{m}} min',
                  fr: '{{done}}/{{total}} séries · {{m}} min',
                  tn: '{{done}}/{{total}} سيريات · {{m}} min',
                  tnLatn: '{{done}}/{{total}} séries · {{m}} min',
                },
                { done: doneCount, total, m: minutes },
              )}
            </Txt>
          </View>
          <Button
            label={L({ en: 'Finish', fr: 'Terminer', tn: 'كمّل', tnLatn: 'Kammel' })}
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
        // The pager always scrolls left to right (its offsets drive the page index);
        // each page lays itself out in the reading direction.
        style={{ direction: 'ltr' }}
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
            target={targetOf(item.pe, item.rows.length)}
            note={notes[item.pe.exerciseId]}
            showWarmup={i === 0 && doneCount === 0}
            onUpdate={editSet}
            onToggle={toggleDone}
            onAdd={addSet}
            onForm={(id) => router.push({ pathname: '/exercise/[id]', params: { id, day: day.id, index: String(item.planIndex) } })}
            onSwap={setSwapPage}
          />
        )}
      />

      {swapPage ? (
        <SwapSheet
          visible
          onClose={() => setSwapPage(null)}
          currentId={swapPage.pe.exerciseId}
          slot={swapPage.pe.slot}
          exclude={pages.filter((p) => p.planIndex !== swapPage.planIndex).map((p) => p.pe.exerciseId)}
          canKeepInSession
          ladder={swapPage.pe.ladder}
          onPick={(id, inProgram) => swapExercise(swapPage, id, inProgram)}
        />
      ) : null}

      {!keyboard ? (
        <View style={[styles.dock, { paddingBottom: insets.bottom + space.md, backgroundColor: t.ground, borderTopColor: t.hairline }]}>
          {ratingRow ? <EffortRow n={ratingRow} onRate={rate} /> : null}
          {restEnd ? (
            <RestStrip
              left={restLeft}
              fraction={restFraction}
              onAdd={() => {
                if (restEnd) announceRest(restEnd + 30000);
                setRestEnd((e) => (e ? e + 30000 : e));
                setRestTotal((s) => s + 30);
              }}
              onSkip={() => {
                cancelRestOver();
                setRestEnd(null);
              }}
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

      <Sheet
        visible={finishOpen}
        onClose={() => setFinishOpen(false)}
        title={L({ en: 'Finish workout?', fr: 'Terminer la séance ?', tn: 'تكمّل الحصّة؟', tnLatn: 'Tkammel séance?' })}
      >
        <View style={styles.stats}>
          <View style={styles.stat}>
            <Txt variant="numLarge">{`${doneCount}/${total}`}</Txt>
            <Txt variant="overline" tone="tertiary">
              {L({ en: 'Sets', fr: 'Séries', tn: 'سيريات', tnLatn: 'Séries' })}
            </Txt>
          </View>
          <View style={styles.stat}>
            <Txt variant="numLarge">{fmt(Math.round(volume))}</Txt>
            <Txt variant="overline" tone="tertiary">
              {L({ en: 'Kg lifted', fr: 'Kg soulevés', tn: 'Kg هزّيت', tnLatn: 'Kg hazzit' })}
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
              tn: 'كان السيريات اللي علّمت عليهم يتحسبو في التاريخ متاعك والأهداف الجاية.',
              tnLatn: 'Ken les séries eli 3allamt 3lihom yet7sbou fel historique mte3ek w l objectifs el jeyin.',
            })}
          </Txt>
        ) : null}
        <View style={styles.sheetActions}>
          <Button
            label={L({ en: 'Save workout', fr: 'Enregistrer la séance', tn: 'سجّل الحصّة', tnLatn: 'Sajjel séance' })}
            onPress={complete}
            size="lg"
            fill
            haptic="light"
          />
          <Button
            label={L({ en: 'Keep going', fr: 'Continuer', tn: 'واصل', tnLatn: 'Wassel' })}
            variant="outlined"
            onPress={() => setFinishOpen(false)}
            size="lg"
            fill
          />
        </View>
      </Sheet>
    </KeyboardAvoidingView>
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
  nameActions: { flexDirection: 'row', gap: space.sm },
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
  note: { borderRadius: radius.md, paddingHorizontal: space.md, paddingVertical: space.sm, marginTop: space.md },
  target: { borderTopWidth: StyleSheet.hairlineWidth, borderBottomWidth: StyleSheet.hairlineWidth, paddingVertical: space.md, marginTop: space.lg },
  targetHead: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  effort: { height: EFFORT_HEIGHT - space.sm, justifyContent: 'space-between', marginBottom: space.sm },
  effortButtons: { flexDirection: 'row', gap: space.sm },
  effortButton: { flex: 1, height: 40, borderRadius: radius.pill, alignItems: 'center', justifyContent: 'center' },
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
