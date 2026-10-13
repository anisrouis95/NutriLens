// The questionnaire: one question per screen, shared-axis slides between
// steps, single-choice answers advance on their own, numbers are picked on a
// ruler, and the end plays the one authored moment: the plan being built.

import { type ReactNode, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { BackHandler, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withTiming } from 'react-native-reanimated';
import {
  ArrowLeft,
  Building2,
  Cable,
  Dumbbell,
  Flame,
  Footprints,
  HardHat,
  HeartPulse,
  Laptop,
  Leaf,
  Mars,
  PersonStanding,
  Repeat,
  Scale,
  Sprout,
  TreeDeciduous,
  TreePine,
  Trophy,
  Venus,
} from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppData } from '@/contexts/AppDataContext';
import { RestoreEntry } from '@/components/backup/GoogleBackup';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { exerciseImageUrls, getExercise } from '@/lib/exercises';
import {
  AnimatedNumber,
  Appear,
  Button,
  hapticTap,
  Chip,
  ChipRow,
  Field,
  IconButton,
  OptionTile,
  RulerPicker,
  Segmented,
  StampCheck,
  Toggle,
  Txt,
  Why,
  useFormat,
  StoryBars,
  DirIcon,
} from '@/components/ds';
import type {
  DietPref,
  EquipmentProfile,
  Experience,
  Goal,
  JobActivity,
  Limitation,
  LocalizedText,
  Pace,
  Profile,
  Sex,
} from '@/types';
import { bmi, computePlan } from '@/lib/nutritionMath';
import { generateWorkoutPlan } from '@/lib/workoutGenerator';
import { motion, radius, space, useTokens } from '@/theme';
import { LanguagePicker } from '@/components/settings/LanguagePicker';

type Icon = typeof Flame;

/** A line already computed in the current language, shown as is in every language. */
const same = (s: string): LocalizedText => ({ en: s, fr: s, tn: s, tnLatn: s });

type Draft = {
  name: string;
  goal?: Goal;
  sex?: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  targetWeightKg?: number;
  bodyFatPct: string;
  job?: JobActivity;
  dailySteps?: number;
  pace: Pace;
  experience?: Experience;
  trainingDays: number;
  sessionMinutes: number;
  equipment?: EquipmentProfile;
  limitations: Limitation[];
  dietPrefs: DietPref[];
  mealsPerDay: number;
  fastingEnabled: boolean;
  fastingStart: string;
  fastingEnd: string;
};

const GOALS: { id: Goal; icon: Icon; title: LocalizedText; desc: LocalizedText }[] = [
  {
    id: 'lose_fat',
    icon: Flame,
    title: { en: 'Lose fat', fr: 'Perdre du gras', tn: 'نقّص الشحم', tnLatn: 'Na99es el gras' },
    desc: {
      en: 'Get leaner while keeping your muscle.',
      fr: 'Affiner ta silhouette en gardant tes muscles.',
      tn: 'ولّي أنحف وحافظ على عضلاتك.',
      tnLatn: 'Walli an7af w 7afedh 3la muscles mte3ek.',
    },
  },
  {
    id: 'build_muscle',
    icon: Dumbbell,
    title: { en: 'Build muscle', fr: 'Prendre du muscle', tn: 'ابني العضلات', tnLatn: 'Ebni muscle' },
    desc: {
      en: 'Gain size with a small calorie surplus.',
      fr: 'Prendre du volume avec un léger surplus.',
      tn: 'كبّر بدنك بشويّة كالوري زايدين.',
      tnLatn: 'Kabber badnek b chwaya calories zeydin.',
    },
  },
  {
    id: 'recomp',
    icon: Repeat,
    title: { en: 'Lose fat and build muscle', fr: 'Perdre du gras et prendre du muscle', tn: 'نقّص الشحم وابني العضلات', tnLatn: 'Na99es el gras w ebni muscle' },
    desc: {
      en: 'Works best for beginners and people returning to training.',
      fr: 'Marche surtout pour les débutants et les reprises.',
      tn: 'تنفع أكثر للمبتدئين واللي راجعين للسبور.',
      tnLatn: 'Tenfa3 akther lel débutants w eli rej3in lel sport.',
    },
  },
  {
    id: 'strength',
    icon: Trophy,
    title: { en: 'Get stronger', fr: 'Devenir plus fort', tn: 'ولّي أقوى', tnLatn: 'Walli a9wa' },
    desc: {
      en: 'Lift heavier on the big movements.',
      fr: 'Soulever plus lourd sur les grands mouvements.',
      tn: 'ارفع أثقل في الحركات الكبار.',
      tnLatn: 'Erfa3 at9al fel mouvements el kbar.',
    },
  },
  {
    id: 'maintain',
    icon: Scale,
    title: { en: 'Maintain my weight', fr: 'Maintenir mon poids', tn: 'نحافظ على وزني', tnLatn: 'N7afedh 3la poids mte3i' },
    desc: {
      en: 'Stay where you are and build good habits.',
      fr: 'Rester stable et prendre de bonnes habitudes.',
      tn: 'ابقى كيف ما إنت وابني عادات باهية.',
      tnLatn: 'Ab9a kima enti w ebni 3adet behia.',
    },
  },
  {
    id: 'health',
    icon: HeartPulse,
    title: { en: 'Feel healthier and fitter', fr: 'Être en meilleure forme', tn: 'نحس روحي خير وفي فورمة', tnLatn: 'N7es rou7i 5ir w fi forme' },
    desc: {
      en: 'More energy and fitness, no number to hit.',
      fr: 'Plus d’énergie et de forme, sans chiffre à atteindre.',
      tn: 'طاقة وفورمة أكثر، بلاش رقم لازم توصلو.',
      tnLatn: 'Énergie w forme akther, blech ra9m lazem touslou.',
    },
  },
];

const JOBS: { id: JobActivity; icon: Icon; title: LocalizedText; desc: LocalizedText }[] = [
  {
    id: 'desk',
    icon: Laptop,
    title: { en: 'Mostly sitting', fr: 'Surtout assis', tn: 'أغلب الوقت قاعد', tnLatn: 'A8leb el wa9t 9a3ed' },
    desc: { en: 'Office, studying, driving.', fr: 'Bureau, études, conduite.', tn: 'بيرو، قراية، سواقة.', tnLatn: 'Bureau, 9raya, swe9a.' },
  },
  {
    id: 'standing',
    icon: PersonStanding,
    title: { en: 'Often on my feet', fr: 'Souvent debout', tn: 'برشا وقت واقف', tnLatn: 'Barcha wa9t wa9ef' },
    desc: {
      en: 'Shop, teaching, cooking, nursing.',
      fr: 'Commerce, enseignement, cuisine, soins.',
      tn: 'حانوت، تقرية، طياب، تمريض.',
      tnLatn: '7anout, ta9rya, tyeb, tamridh.',
    },
  },
  {
    id: 'physical',
    icon: HardHat,
    title: { en: 'Physical work', fr: 'Travail physique', tn: 'خدمة بالبدن', tnLatn: '5edma bel badan' },
    desc: { en: 'Building sites, farming, warehouse.', fr: 'Chantier, agriculture, entrepôt.', tn: 'شانطي، فلاحة، ديبو.', tnLatn: 'Chantier, fle7a, dépôt.' },
  },
];

const STEP_BANDS: { value: number; label: LocalizedText }[] = [
  { value: 2500, label: { en: 'Under 3,000', fr: 'Moins de 3 000', tn: 'أقل من 3000', tnLatn: 'A9al men 3000' } },
  { value: 4500, label: { en: '3,000 – 6,000', fr: '3 000 – 6 000', tn: '3000 – 6000', tnLatn: '3000 – 6000' } },
  { value: 7500, label: { en: '6,000 – 9,000', fr: '6 000 – 9 000', tn: '6000 – 9000', tnLatn: '6000 – 9000' } },
  { value: 10500, label: { en: '9,000 – 12,000', fr: '9 000 – 12 000', tn: '9000 – 12000', tnLatn: '9000 – 12000' } },
  { value: 13500, label: { en: 'Over 12,000', fr: 'Plus de 12 000', tn: 'أكثر من 12000', tnLatn: 'Akther men 12000' } },
];

const EXPERIENCE: { id: Experience; icon: Icon; title: LocalizedText; desc: LocalizedText }[] = [
  {
    id: 'none',
    icon: Sprout,
    title: { en: 'Never trained', fr: 'Jamais entraîné', tn: 'عمري ما تمرّنت', tnLatn: '3omri ma tmarrent' },
    desc: {
      en: 'I have never followed a gym program.',
      fr: 'Je n’ai jamais suivi de programme.',
      tn: 'عمري ما تبّعت برنامج في السالة.',
      tnLatn: '3omri ma tba3t programme fel salle.',
    },
  },
  {
    id: 'beginner',
    icon: Leaf,
    title: { en: 'Under 6 months', fr: 'Moins de 6 mois', tn: 'أقل من 6 شهور', tnLatn: 'A9al men 6 chhour' },
    desc: { en: 'Or I stopped a long time ago.', fr: 'Ou j’ai arrêté depuis longtemps.', tn: 'ولا حبست من زمان.', tnLatn: 'Walla 7bast men zmen.' },
  },
  {
    id: 'intermediate',
    icon: TreeDeciduous,
    title: { en: '6 months – 2 years', fr: '6 mois – 2 ans', tn: '6 شهور – 2 سنين', tnLatn: '6 chhour – 2 snin' },
    desc: {
      en: 'I know the main lifts and train regularly.',
      fr: 'Je connais les exercices de base.',
      tn: 'نعرف التمارين الأساسية ونتمرّن ديما.',
      tnLatn: 'Na3ref les exercices de base w netmarren dima.',
    },
  },
  {
    id: 'advanced',
    icon: TreePine,
    title: { en: 'More than 2 years', fr: 'Plus de 2 ans', tn: 'أكثر من 2 سنين', tnLatn: 'Akther men 2 snin' },
    desc: {
      en: 'Consistent training, progress has slowed.',
      fr: 'Entraînement régulier, la progression ralentit.',
      tn: 'نتمرّن ديما، والتقدّم ولّى بطيء.',
      tnLatn: 'Netmarren dima, w el progrès walla bti.',
    },
  },
];

const EQUIPMENT: { id: EquipmentProfile; icon: Icon; title: LocalizedText; desc: LocalizedText }[] = [
  {
    id: 'gym',
    icon: Building2,
    title: { en: 'A gym', fr: 'Une salle de sport', tn: 'سالة سبور', tnLatn: 'Salle de sport' },
    desc: {
      en: 'Machines, cables, barbells and dumbbells.',
      fr: 'Machines, poulies, barres et haltères.',
      tn: 'ماكينات، بوليات، بارّات وهالتيرات.',
      tnLatn: 'Machines, poulies, barres w haltères.',
    },
  },
  {
    id: 'dumbbells',
    icon: Dumbbell,
    title: { en: 'Dumbbells at home', fr: 'Des haltères à la maison', tn: 'هالتيرات في الدار', tnLatn: 'Haltères fel dar' },
    desc: {
      en: 'Adjustable dumbbells and a bench or chair.',
      fr: 'Des haltères réglables et un banc ou une chaise.',
      tn: 'هالتيرات يتبدّل ثقلهم وبانك ولا كرسي.',
      tnLatn: 'Haltères réglables w banc walla korsi.',
    },
  },
  {
    id: 'bands',
    icon: Cable,
    title: { en: 'Resistance bands', fr: 'Des élastiques', tn: 'لاستيكات', tnLatn: 'Élastiques' },
    desc: { en: 'Bands plus my bodyweight.', fr: 'Des élastiques et mon poids du corps.', tn: 'لاستيكات ووزن بدني.', tnLatn: 'Élastiques w poids badni.' },
  },
  {
    id: 'bodyweight',
    icon: PersonStanding,
    title: { en: 'Nothing', fr: 'Rien du tout', tn: 'حتى شي', tnLatn: '7atta chay' },
    desc: { en: 'Floor, a wall, a sturdy table.', fr: 'Le sol, un mur, une table solide.', tn: 'القاعة، حيط، طاولة صحيحة.', tnLatn: 'El 9a3a, 7it, tawla s7i7a.' },
  },
];

const LIMITATIONS: { id: Limitation; label: LocalizedText }[] = [
  { id: 'knees', label: { en: 'Knees', fr: 'Genoux', tn: 'الركايب', tnLatn: 'Rkayeb' } },
  { id: 'lower_back', label: { en: 'Lower back', fr: 'Bas du dos', tn: 'لوطة الظهر', tnLatn: 'Bas du dos' } },
  { id: 'shoulders', label: { en: 'Shoulders', fr: 'Épaules', tn: 'الكتاف', tnLatn: 'Ktef' } },
  { id: 'wrists', label: { en: 'Wrists', fr: 'Poignets', tn: 'المعاصم', tnLatn: 'Poignets' } },
];

const DIET_PREFS: { id: DietPref; label: LocalizedText }[] = [
  { id: 'halal', label: { en: 'Halal', fr: 'Halal', tn: 'حلال', tnLatn: 'Halal' } },
  { id: 'vegetarian', label: { en: 'Vegetarian', fr: 'Végétarien', tn: 'نباتي', tnLatn: 'Végétarien' } },
  { id: 'lactose_free', label: { en: 'Lactose-free', fr: 'Sans lactose', tn: 'بلاش لاكتوز', tnLatn: 'Blech lactose' } },
  { id: 'gluten_free', label: { en: 'Gluten-free', fr: 'Sans gluten', tn: 'بلاش غلوتين', tnLatn: 'Blech gluten' } },
  { id: 'no_seafood', label: { en: 'No seafood', fr: 'Sans fruits de mer', tn: 'بلاش فواكه البحر', tnLatn: 'Blech fruits de mer' } },
];

type StepId =
  | 'welcome'
  | 'goal'
  | 'sex'
  | 'age'
  | 'height'
  | 'weight'
  | 'target'
  | 'activity'
  | 'pace'
  | 'experience'
  | 'schedule'
  | 'equipment'
  | 'limits'
  | 'food';

function fromProfile(p: Profile | null): Draft {
  return {
    name: p?.name ?? '',
    goal: p?.goal,
    sex: p?.sex,
    age: p?.age ?? 25,
    heightCm: p?.heightCm ?? 172,
    weightKg: p?.weightKg ?? 75,
    targetWeightKg: p?.targetWeightKg,
    bodyFatPct: p?.bodyFatPct ? String(p.bodyFatPct) : '',
    job: p?.job,
    dailySteps: p?.dailySteps,
    pace: p?.pace ?? 'moderate',
    experience: p?.experience,
    trainingDays: p?.trainingDays ?? 3,
    sessionMinutes: p?.sessionMinutes ?? 60,
    equipment: p?.equipment,
    limitations: p?.limitations ?? [],
    dietPrefs: p?.dietPrefs ?? [],
    mealsPerDay: p?.mealsPerDay ?? 3,
    fastingEnabled: p?.fasting.enabled ?? false,
    fastingStart: p?.fasting.startTime ?? '20:00',
    fastingEnd: p?.fasting.endTime ?? '12:00',
  };
}

/** Fasting patterns by eating-window length; the fast starts when the window closes. */
const FAST_PATTERNS = [
  { id: '16:8', window: 8, label: { en: '16:8', fr: '16:8', tn: '16:8', tnLatn: '16:8' } },
  { id: '18:6', window: 6, label: { en: '18:6', fr: '18:6', tn: '18:6', tnLatn: '18:6' } },
  { id: '20:4', window: 4, label: { en: '20:4', fr: '20:4', tn: '20:4', tnLatn: '20:4' } },
  { id: 'omad', window: 1, label: { en: 'One meal a day', fr: 'Un repas par jour', tn: 'ماكلة وحدة في النهار', tnLatn: 'Makla wa7da fel nhar' } },
] as const;
type FastPatternId = (typeof FAST_PATTERNS)[number]['id'] | 'custom';
const OMAD = FAST_PATTERNS[3];

/** Reads "18:00", "18", "1800", "18h30" or "6.30" as minutes after midnight. */
function parseTime(text: string): number | null {
  const s = text.trim().toLowerCase();
  let h: number;
  let m = 0;
  const sep = s.match(/^(\d{1,2})\s*[:h.]\s*(\d{2})?$/);
  if (sep) {
    h = Number(sep[1]);
    m = sep[2] ? Number(sep[2]) : 0;
  } else if (/^\d{1,2}$/.test(s)) {
    h = Number(s);
  } else if (/^\d{3,4}$/.test(s)) {
    h = Number(s.slice(0, -2));
    m = Number(s.slice(-2));
  } else {
    return null;
  }
  return h > 23 || m > 59 ? null : h * 60 + m;
}

/** Minutes after midnight (wrapping past it) as "HH:MM". */
function clock(minutes: number): string {
  const v = ((minutes % 1440) + 1440) % 1440;
  return `${String(Math.floor(v / 60)).padStart(2, '0')}:${String(v % 60).padStart(2, '0')}`;
}

/** Which pattern a fast-start / eating-start pair matches. */
function patternOf(fastStart: string, eatStart: string): FastPatternId {
  const f = parseTime(fastStart);
  const e = parseTime(eatStart);
  if (f === null || e === null) return 'custom';
  const window = (f - e + 1440) % 1440;
  return FAST_PATTERNS.find((p) => p.window * 60 === window)?.id ?? 'custom';
}

/**
 * Material shared-axis X between steps: a short slide plus fade, reversed when
 * going back. Driven by shared values (not layout animations) so it behaves
 * the same on Android and in the web preview.
 */
function StepTransition({ stepKey, dir, children }: { stepKey: string; dir: 1 | -1; children: ReactNode }) {
  const reduce = useReducedMotion();
  // Forward slides in from the reading end: the right in LTR, the left in RTL.
  const side = useLanguage().rtl ? -1 : 1;
  const p = useSharedValue(1);
  useEffect(() => {
    p.value = 0;
    p.value = withTiming(1, { duration: reduce ? 120 : 320, easing: motion.easeOut });
  }, [stepKey, p, reduce]);
  const style = useAnimatedStyle(() => ({
    opacity: p.value,
    transform: [{ translateX: reduce ? 0 : (1 - p.value) * 36 * dir * side }],
  }));
  return <Animated.View style={style}>{children}</Animated.View>;
}

const AUTO_ADVANCE_MS = 320;

/** Welcome: the movement the app is about, full width, fading into black. */
function WelcomePhoto() {
  const t = useTokens();
  const squat = getExercise('Barbell_Squat');
  const uri = squat ? exerciseImageUrls(squat)[1] : undefined;
  return (
    <View style={[styles.welcomePhoto, { backgroundColor: t.surfaceHigh }]} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {uri ? <Image source={{ uri }} style={StyleSheet.absoluteFill} contentFit="cover" contentPosition="top" cachePolicy="disk" transition={200} /> : null}
      <LinearGradient colors={[`${t.ground}00`, `${t.ground}D9`]} locations={[0.45, 1]} style={StyleSheet.absoluteFill} />
    </View>
  );
}

export default function OnboardingScreen() {
  const t = useTokens();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const fmt = useFormat();
  const reduce = useReducedMotion();
  const { L, language } = useLanguage();
  const { profile, saveProfile, setWorkoutPlan } = useAppData();
  const { edit } = useLocalSearchParams<{ edit?: string }>();

  const [draft, setDraft] = useState<Draft>(() => fromProfile(profile));
  const [stepIndex, setStepIndex] = useState(0);
  const [dir, setDir] = useState<1 | -1>(1);
  const [building, setBuilding] = useState(false);
  const advanceTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastStepAt = useRef(0);
  const [fastPattern, setFastPattern] = useState<FastPatternId>(() => patternOf(draft.fastingStart, draft.fastingEnd));
  // Said once Continue is tapped on an unfinished step, instead of a dead button.
  const [hint, setHint] = useState<string | null>(null);
  const set = (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch }));

  const hasWeightGoal = draft.goal === 'lose_fat' || draft.goal === 'build_muscle' || draft.goal === 'recomp';
  const hasPace = draft.goal === 'lose_fat' || draft.goal === 'build_muscle';

  const steps = useMemo<StepId[]>(() => {
    const s: StepId[] = ['welcome', 'goal', 'sex', 'age', 'height', 'weight'];
    if (hasWeightGoal) s.push('target');
    s.push('activity');
    if (hasPace) s.push('pace');
    s.push('experience', 'schedule', 'equipment', 'limits', 'food');
    return s;
  }, [hasWeightGoal, hasPace]);

  const step = steps[Math.min(stepIndex, steps.length - 1)];
  const bodyFat = parseFloat(draft.bodyFatPct.replace(',', '.'));
  const target = draft.targetWeightKg;

  const targetError = (() => {
    if (step !== 'target' || !target) return null;
    if (draft.goal === 'lose_fat' && target >= draft.weightKg)
      return L({
        en: 'For fat loss the target must be below your current weight.',
        fr: 'Pour perdre du gras, l’objectif doit être sous ton poids actuel.',
        tn: 'باش تنقّص الشحم، الهدف لازم يكون تحت الوزن متاعك توّا.',
        tnLatn: "Bech tna99es el gras, l'objectif lazem ykoun ta7t el poids mte3ek taw.",
      });
    if (draft.goal === 'build_muscle' && target <= draft.weightKg)
      return L({
        en: 'For muscle gain the target must be above your current weight.',
        fr: 'Pour prendre du muscle, l’objectif doit dépasser ton poids actuel.',
        tn: 'باش تزيد عضلات، الهدف لازم يكون فوق الوزن متاعك توّا.',
        tnLatn: "Bech tzid muscle, l'objectif lazem ykoun fou9 el poids mte3ek taw.",
      });
    return null;
  })();

  const canContinue = (() => {
    switch (step) {
      case 'welcome':
        return draft.name.trim().length > 0;
      case 'goal':
        return !!draft.goal;
      case 'sex':
        return !!draft.sex;
      case 'target':
        return !targetError && !(draft.bodyFatPct && (!Number.isFinite(bodyFat) || bodyFat < 4 || bodyFat > 60));
      case 'activity':
        return !!draft.job && !!draft.dailySteps;
      case 'experience':
        return !!draft.experience;
      case 'equipment':
        return !!draft.equipment;
      case 'food':
        return !draft.fastingEnabled || (parseTime(draft.fastingStart) !== null && parseTime(draft.fastingEnd) !== null);
      default:
        return true;
    }
  })();

  const buildProfile = useCallback(
    (d: Draft): Profile => {
      const now = new Date().toISOString();
      const weightGoal = d.goal === 'lose_fat' || d.goal === 'build_muscle' || d.goal === 'recomp';
      const bf = parseFloat(d.bodyFatPct.replace(',', '.'));
      return {
        name: d.name.trim(),
        sex: d.sex ?? 'male',
        age: Math.round(d.age),
        heightCm: Math.round(d.heightCm),
        weightKg: Math.round(d.weightKg * 10) / 10,
        targetWeightKg: weightGoal && d.targetWeightKg ? Math.round(d.targetWeightKg * 10) / 10 : undefined,
        bodyFatPct: Number.isFinite(bf) ? bf : undefined,
        goal: d.goal ?? 'health',
        pace: d.pace,
        job: d.job ?? 'desk',
        dailySteps: d.dailySteps ?? 5000,
        experience: d.experience ?? 'beginner',
        trainingDays: d.trainingDays,
        sessionMinutes: d.sessionMinutes,
        equipment: d.equipment ?? 'gym',
        limitations: d.limitations,
        dietPrefs: d.dietPrefs,
        mealsPerDay: d.mealsPerDay,
        fasting: {
          enabled: d.fastingEnabled,
          startTime: clock(parseTime(d.fastingStart) ?? 20 * 60),
          endTime: clock(parseTime(d.fastingEnd) ?? 12 * 60),
        },
        createdAt: profile?.createdAt ?? now,
        updatedAt: now,
      };
    },
    [profile?.createdAt],
  );

  /** Applies a fasting pattern around the eating start (one meal a day defaults to 18:00). */
  const applyPattern = (p: (typeof FAST_PATTERNS)[number]) => {
    const keep = parseTime(draft.fastingEnd);
    const eat = p.id === 'omad' && fastPattern !== 'omad' ? 18 * 60 : (keep ?? 12 * 60);
    setFastPattern(p.id);
    set({
      fastingEnabled: true,
      fastingEnd: clock(eat),
      fastingStart: clock(eat + p.window * 60),
      mealsPerDay: p.id === 'omad' ? 1 : draft.mealsPerDay === 1 ? 2 : draft.mealsPerDay,
    });
  };

  const setMealsPerDay = (n: number) => {
    if (n === 1) return applyPattern(OMAD);
    if (fastPattern === 'omad' && draft.fastingEnabled) {
      // More than one meal no longer fits a one-hour window: widen it to 16:8.
      const eat = parseTime(draft.fastingEnd) ?? 12 * 60;
      setFastPattern('16:8');
      set({ mealsPerDay: n, fastingEnd: clock(eat), fastingStart: clock(eat + 8 * 60) });
      return;
    }
    set({ mealsPerDay: n });
  };

  /** Editing the eating start keeps the chosen pattern's window. */
  const setEatStart = (text: string) => {
    const p = FAST_PATTERNS.find((x) => x.id === fastPattern);
    const eat = parseTime(text);
    set(p && eat !== null ? { fastingEnd: text, fastingStart: clock(eat + p.window * 60) } : { fastingEnd: text });
  };

  const tidyTime = (key: 'fastingStart' | 'fastingEnd') => {
    const v = parseTime(draft[key]);
    if (v !== null) set({ [key]: clock(v) });
  };

  const go = (delta: 1 | -1) => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    lastStepAt.current = Date.now();
    setDir(delta);
    setStepIndex((i) => Math.min(Math.max(i + delta, 0), steps.length - 1));
  };

  /** What still blocks the current step, in words. */
  const missing = (): string => {
    switch (step) {
      case 'welcome':
        return L({ en: 'Type your first name to continue.', fr: 'Écris ton prénom pour continuer.', tn: 'اكتب اسمك باش تكمّل.', tnLatn: 'Ekteb esmek bech tkammel.' });
      case 'target':
        return (
          targetError ??
          L({
            en: 'Body fat must be between 4 and 60 %, or leave it empty.',
            fr: 'La masse grasse doit être entre 4 et 60 %, ou laisse vide.',
            tn: 'الشحم لازم يكون بين 4 و 60 %، ولا خلّيه فارغ.',
            tnLatn: 'El gras lazem ykoun bin 4 w 60 %, walla 5allih fere8.',
          })
        );
      case 'activity':
        return !draft.job
          ? L({
            en: 'Pick what most of your days look like.',
            fr: 'Choisis à quoi ressemblent la plupart de tes journées.',
            tn: 'اختار كيفاش تعدّي أغلب أيّامك.',
            tnLatn: '5tar kifech t3addi a8leb iyamek.',
          })
          : L({
            en: 'Pick your usual daily steps too.',
            fr: 'Choisis aussi ton nombre de pas habituel.',
            tn: 'اختار زادة قدّاش تمشي عادة في النهار.',
            tnLatn: '5tar zeda 9addech temchi 3adatan fel nhar.',
          });
      case 'food':
        return L({
          en: 'Enter the fasting times like 18:00.',
          fr: 'Écris les heures de jeûne comme 18:00.',
          tn: 'اكتب أوقات الصيام كيما 18:00.',
          tnLatn: 'Ekteb aw9at e siyem kima 18:00.',
        });
      default:
        return L({ en: 'Pick one answer to continue.', fr: 'Choisis une réponse pour continuer.', tn: 'اختار جواب باش تكمّل.', tnLatn: '5tar jweb bech tkammel.' });
    }
  };

  const next = () => {
    // A second tap that lands just after a step change (or an auto-advance)
    // must not skip the question that just appeared.
    if (Date.now() - lastStepAt.current < 300) return;
    if (!canContinue) {
      hapticTap('warning');
      setHint(missing());
      return;
    }
    if (stepIndex >= steps.length - 1) {
      setBuilding(true);
      return;
    }
    go(1);
  };

  const back = useCallback(() => {
    if (building) return true;
    if (stepIndex === 0) {
      if (edit && router.canGoBack()) router.back();
      return !!edit;
    }
    go(-1);
    return true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepIndex, building, edit, router]);

  // Android back steps through the questionnaire instead of leaving it.
  useEffect(() => {
    const sub = BackHandler.addEventListener('hardwareBackPress', back);
    return () => sub.remove();
  }, [back]);

  /** Single-choice answers move on by themselves once the selection lands. */
  const choose = (patch: Partial<Draft>) => {
    set(patch);
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
    advanceTimer.current = setTimeout(() => go(1), reduce ? 120 : AUTO_ADVANCE_MS);
  };

  useEffect(() => () => {
    if (advanceTimer.current) clearTimeout(advanceTimer.current);
  }, []);

  // The hint belongs to one attempt: clear it on a new step or once the step is complete.
  useEffect(() => {
    setHint(null);
  }, [step]);
  useEffect(() => {
    if (canContinue) setHint(null);
  }, [canContinue]);

  // Sensible ruler defaults once sex is known (only if the user hasn't moved them).
  useEffect(() => {
    if (profile || !draft.sex) return;
    setDraft((d) =>
      d.heightCm === 172 && d.weightKg === 75
        ? { ...d, heightCm: d.sex === 'female' ? 162 : 176, weightKg: d.sex === 'female' ? 63 : 78 }
        : d,
    );
  }, [draft.sex, profile]);

  const pacePreview = (pace: Pace) => {
    if (!draft.goal) return '';
    const preview = computePlan({ ...buildProfile(draft), pace });
    const kg = fmt(Math.abs(preview.weeklyChangeKg), 2);
    const verb = preview.weeklyChangeKg < 0 ? L({ en: 'lose', fr: 'perdre', tn: 'تنقّص', tnLatn: 'tna99es' }) : L({ en: 'gain', fr: 'prendre', tn: 'تزيد', tnLatn: 'tzid' });
    return L(
      {
        en: '≈ {{kcal}} kcal a day · {{verb}} ~{{kg}} kg a week',
        fr: '≈ {{kcal}} kcal par jour · {{verb}} ~{{kg}} kg par semaine',
        tn: '≈ {{kcal}} kcal في النهار · {{verb}} ~{{kg}} kg في الجمعة',
        tnLatn: '≈ {{kcal}} kcal fel nhar · {{verb}} ~{{kg}} kg fel jem3a',
      },
      { kcal: fmt(preview.targetCalories), verb, kg },
    );
  };

  const currentBmi = bmi(draft.weightKg, draft.heightCm);
  const healthy = [18.5, 24.9].map((b) => Math.round(b * (draft.heightCm / 100) ** 2));

  const title = (text: string, why?: string) => (
    <View style={{ marginBottom: space.xl }}>
      <Txt variant="headline" accessibilityRole="header">
        {text}
      </Txt>
      {why ? (
        <Txt variant="body" tone="secondary" style={{ marginTop: space.sm }}>
          {why}
        </Txt>
      ) : null}
    </View>
  );

  const tiles = <T extends string>(
    items: { id: T; icon?: Icon; title: LocalizedText; desc?: LocalizedText }[],
    value: T | undefined,
    onPick: (id: T) => void,
  ) => (
    <View style={{ gap: space.sm }}>
      {items.map((o) => (
        <OptionTile
          key={o.id}
          title={L(o.title)}
          description={o.desc ? L(o.desc) : undefined}
          selected={value === o.id}
          onPress={() => onPick(o.id)}
          leading={o.icon ? (c) => {
            const I = o.icon as Icon;
            return <I size={22} color={c} />;
          } : undefined}
        />
      ))}
    </View>
  );

  const renderStep = () => {
    switch (step) {
      case 'welcome':
        return (
          <>
            <WelcomePhoto />
            {/* First thing a new user can do: pick their language (Darija included). */}
            {!edit ? (
              <View style={{ marginBottom: space.lg }}>
                <LanguagePicker compact />
              </View>
            ) : null}
            {title(
              L({
                en: 'Know exactly what to eat and how to train.',
                fr: 'Sache exactement quoi manger et comment t’entraîner.',
                tn: 'اعرف بالضبط شنوّة تاكل وكيفاش تتمرّن.',
                tnLatn: 'A3ref bel dhabt chnowa takel w kifech tetmarren.',
              }),
              L({
                en: 'A few questions, about two minutes. Tounsi Fit works out what your body burns, how much to eat, how fast you can realistically change, and a training program for your equipment — then explains every number.',
                fr: 'Quelques questions, environ deux minutes. Tounsi Fit calcule ce que ton corps dépense, combien manger, à quelle vitesse tu peux changer, et un programme adapté à ton matériel — puis explique chaque chiffre.',
                tn: 'شويّة أسئلة، تقريب دقيقتين. Tounsi Fit يحسب قدّاش يحرق بدنك، قدّاش تاكل، قدّاش من زربة تنجّم تتبدّل بالمعقول، وبرنامج تمرين على قد الماتريال متاعك — ومن بعد يفسّرلك كل رقم.',
                tnLatn: 'Chwaya questions, ta9riban d9i9tin. Tounsi Fit ya7seb 9addech ya7ra9 badnek, 9addech takel, 9addech men zerba tnajjem tetbaddel bel ma39oul, w programme sport 3la 9ad el matériel mte3ek — w men ba3d yfassarlek kol ra9m.',
              }),
            )}
            <Field
              label={L({ en: 'Your first name', fr: 'Ton prénom', tn: 'اسمك', tnLatn: 'Esmek' })}
              value={draft.name}
              onChangeText={(v) => set({ name: v })}
              placeholder={L({ en: 'Anis', fr: 'Anis', tn: 'أنيس', tnLatn: 'Anis' })}
              autoFocus={!edit && Platform.OS !== 'web'}
              returnKeyType="next"
              onSubmitEditing={() => canContinue && next()}
            />
            {!edit ? <RestoreEntry /> : null}
          </>
        );

      case 'goal':
        return (
          <>
            {title(
              L({ en: 'What do you want most?', fr: 'Que veux-tu le plus ?', tn: 'شنوّة تحب أكثر حاجة؟', tnLatn: 'Chnowa t7eb akther 7aja?' }),
              L({
                en: 'This decides whether you eat below, at or above what you burn. You can change it later.',
                fr: 'Ça décide si tu manges moins, autant ou plus que ce que tu dépenses. Modifiable plus tard.',
                tn: 'هذا يقرّر كان باش تاكل أقل، قد، ولا أكثر من اللي تحرقو. تنجّم تبدّلو من بعد.',
                tnLatn: 'Hedha y9arrer ken bech tekel a9al, 9ad, walla akther men eli ta7r9ou. Tnajjem tbaddlou men ba3d.',
              }),
            )}
            {tiles(GOALS, draft.goal, (id) => choose({ goal: id }))}
          </>
        );

      case 'sex':
        return (
          <>
            {title(
              L({ en: 'Your sex', fr: 'Ton sexe', tn: 'راجل ولا مرا؟', tnLatn: 'Rajel walla mra?' }),
              L({
                en: 'Used only by the formula that estimates what your body burns at rest.',
                fr: 'Utilisé uniquement par la formule qui estime ce que ton corps brûle au repos.',
                tn: 'تستعملو كان الفورمول اللي تحسب قدّاش يحرق بدنك وانت مرتاح.',
                tnLatn: 'Testa3mlou ken el formule eli t7seb 9addech ya7ra9 badnek w enti merte7.',
              }),
            )}
            {tiles(
              [
                { id: 'male' as Sex, icon: Mars, title: { en: 'Male', fr: 'Homme', tn: 'راجل', tnLatn: 'Rajel' } },
                { id: 'female' as Sex, icon: Venus, title: { en: 'Female', fr: 'Femme', tn: 'مرا', tnLatn: 'Mra' } },
              ],
              draft.sex,
              (id) => choose({ sex: id }),
            )}
          </>
        );

      case 'age':
        return (
          <>
            {title(
              L({ en: 'How old are you?', fr: 'Quel âge as-tu ?', tn: 'قدّاش عمرك؟', tnLatn: '9addech 3omrek?' }),
              L({
                en: 'Metabolism slows a little every decade.',
                fr: 'Le métabolisme ralentit un peu à chaque décennie.',
                tn: 'الميتابوليزم يبطى شويّة كل عشرة سنين.',
                tnLatn: 'El métabolisme yabta chwaya kol 3achra snin.',
              }),
            )}
            <RulerPicker
              value={draft.age}
              onChange={(v) => set({ age: v })}
              min={14}
              max={90}
              step={1}
              labelEvery={10}
              unit={L({ en: 'years', fr: 'ans', tn: 'سنة', tnLatn: 'sna' })}
            />
          </>
        );

      case 'height':
        return (
          <>
            {title(L({ en: 'How tall are you?', fr: 'Quelle est ta taille ?', tn: 'قدّاش طولك؟', tnLatn: '9addech toulek?' }))}
            <RulerPicker value={draft.heightCm} onChange={(v) => set({ heightCm: v })} min={130} max={220} step={1} labelEvery={10} unit="cm" />
          </>
        );

      case 'weight':
        return (
          <>
            {title(
              L({ en: 'What do you weigh?', fr: 'Combien pèses-tu ?', tn: 'قدّاش توزن؟', tnLatn: '9addech touzen?' }),
              L({
                en: 'Ideally this morning, before eating.',
                fr: 'Idéalement ce matin, avant de manger.',
                tn: 'الأحسن اليوم الصباح، قبل ما تاكل.',
                tnLatn: 'El a7sen lyoum e sbe7, 9bal ma takel.',
              }),
            )}
            <RulerPicker value={draft.weightKg} onChange={(v) => set({ weightKg: v })} min={35} max={200} step={0.5} labelEvery={10} decimals={1} unit="kg" />
            <Txt variant="caption" tone="secondary" align="center" style={{ marginTop: space.xl }}>
              {L(
                {
                  en: 'BMI {{bmi}} · a typical healthy range for your height is {{lo}}–{{hi}} kg. BMI ignores muscle, so treat it as a rough guide.',
                  fr: 'IMC {{bmi}} · la fourchette « normale » pour ta taille va de {{lo}} à {{hi}} kg. L’IMC ignore les muscles : c’est un repère approximatif.',
                  tn: 'IMC {{bmi}} · الوزن الصحّي العادي لطولك بين {{lo}}–{{hi}} kg. الـ IMC ما يحسبش العضلات، على هذاكا خوذو كان باش تاخو فكرة.',
                  tnLatn: "IMC {{bmi}} · el poids s7i el 3adi l toulek bin {{lo}}–{{hi}} kg. L'IMC ma y7sebch el muscle, 3la hedheka 5oudhou ken bech te5ou fekra.",
                },
                { bmi: fmt(currentBmi, 1), lo: healthy[0], hi: healthy[1] },
              )}
            </Txt>
          </>
        );

      case 'target': {
        const suggestion = Math.round(draft.weightKg * (draft.goal === 'build_muscle' ? 1.06 : 0.9) * 2) / 2;
        return (
          <>
            {title(
              L({ en: 'Where do you want to get to?', fr: 'Où veux-tu arriver ?', tn: 'وين تحب توصل؟', tnLatn: 'Win t7eb tousel?' }),
              L(
                {
                  en: 'Optional. A good first milestone is often 5–10% of your weight; the healthy range for your height is {{lo}}–{{hi}} kg.',
                  fr: 'Facultatif. Un bon premier palier : 5 à 10 % de ton poids ; la fourchette « normale » pour ta taille va de {{lo}} à {{hi}} kg.',
                  tn: 'موش لازم. مرحلة أولى باهية غالبا 5–10% من وزنك؛ الوزن الصحّي لطولك بين {{lo}}–{{hi}} kg.',
                  tnLatn: 'Mouch lazem. Étape loula behia 8aleban 5–10% men poids mte3ek; el poids s7i l toulek bin {{lo}}–{{hi}} kg.',
                },
                { lo: healthy[0], hi: healthy[1] },
              ),
            )}
            {target ? (
              <>
                <RulerPicker value={target} onChange={(v) => set({ targetWeightKg: v })} min={35} max={200} step={0.5} labelEvery={10} decimals={1} unit="kg" />
                {targetError ? (
                  <Txt variant="caption" tone="danger" align="center" style={{ marginTop: space.lg }}>
                    {targetError}
                  </Txt>
                ) : null}
                <Button
                  label={L({ en: 'No target for now', fr: 'Pas d’objectif pour l’instant', tn: 'ما عنديش هدف توّا', tnLatn: 'Ma 3andich objectif taw' })}
                  variant="text"
                  onPress={() => set({ targetWeightKg: undefined })}
                  style={{ alignSelf: 'center', marginTop: space.lg }}
                />
              </>
            ) : (
              <Button
                label={L({ en: 'Set a target weight', fr: 'Fixer un poids objectif', tn: 'حطّ وزن هدف', tnLatn: '7ott poids objectif' })}
                variant="tonal"
                fill
                size="lg"
                onPress={() => set({ targetWeightKg: suggestion })}
              />
            )}
            <Why
              title={L({ en: 'I know my body fat %', fr: 'Je connais ma masse grasse', tn: 'نعرف نسبة الشحم متاعي', tnLatn: 'Na3ref nesbet el gras mte3i' })}
              style={{ marginTop: space.xxl }}
            >
              <Txt variant="caption" tone="secondary" style={{ marginBottom: space.md }}>
                {L({
                  en: 'Only if it comes from a real measurement (DEXA, calipers by a coach). The app then uses a formula that is more accurate for very muscular or lean people. Bathroom scales are often off by 5% or more — leaving it empty is better than guessing.',
                  fr: 'Seulement si elle vient d’une vraie mesure (DEXA, pince par un coach). L’app utilise alors une formule plus précise pour les personnes très musclées ou sèches. Les balances d’impédance se trompent souvent de 5 % ou plus — mieux vaut laisser vide que deviner.',
                  tn: 'كان كي يكون جاي من قيس حقيقي (DEXA، بانس عند كوتش). وقتها الآب تستعمل فورمول أدق للناس اللي عندهم برشا عضلات ولا ضعاف. الميزان متاع الدار ياسر مرّات يغلط بـ 5% ولا أكثر — خير تخلّيه فارغ من إنك تخمّن.',
                  tnLatn: "Ken ki ykoun jey men 9yes 7a9i9i (DEXA, pince 3and coach). Wa9tha l'app testa3mel formule précise akther lel nes eli 3andhom barcha muscle walla dh3af. El mizen mta3 e dar yeser marrat y8lot b 5% walla akther — 5ir t5allih fere8 men ennek t5ammen.",
                })}
              </Txt>
              <Field value={draft.bodyFatPct} onChangeText={(v) => set({ bodyFatPct: v })} placeholder="—" unit="%" keyboardType="decimal-pad" numeric />
            </Why>
          </>
        );
      }

      case 'activity':
        return (
          <>
            {title(
              L({
                en: 'How active is a normal day?',
                fr: 'Quelle est ton activité au quotidien ?',
                tn: 'قدّاش تتحرّك في نهار عادي؟',
                tnLatn: '9addech tet7arrek fi nhar 3adi?',
              }),
              L({
                en: 'Movement outside the gym can differ by 500–1,000 kcal a day between two people. Once your watch is connected, real steps replace this answer.',
                fr: 'Le mouvement hors salle peut varier de 500 à 1 000 kcal par jour entre deux personnes. Une fois ta montre connectée, tes vrais pas remplacent cette réponse.',
                tn: 'الحركة برّا السالة تنجّم تختلف بـ 500–1000 kcal في النهار بين زوز أشخاص. كي تربط المونتر متاعك، الخطوات الحقيقية تعوّض الجواب هذا.',
                tnLatn: 'El 7arka barra el salle tnajjem tetbaddel b 500–1000 kcal fel nhar bin zouz ach5as. Ki torbot el montre mte3ek, les pas el 7a9i9iyin y3awdhou el jweb hedha.',
              }),
            )}
            {tiles(JOBS, draft.job, (id) => set({ job: id }))}
            <Txt variant="titleSmall" style={{ marginTop: space.xxl, marginBottom: space.md }}>
              {L({ en: 'Steps on a normal day', fr: 'Pas par jour en temps normal', tn: 'الخطوات في نهار عادي', tnLatn: 'Les pas fi nhar 3adi' })}
            </Txt>
            <ChipRow>
              {STEP_BANDS.map((b) => (
                <Chip key={b.value} label={L(b.label)} selected={draft.dailySteps === b.value} onPress={() => set({ dailySteps: b.value })} />
              ))}
            </ChipRow>
            <Txt variant="caption" tone="tertiary" style={{ marginTop: space.md }}>
              {L({
                en: 'Your phone’s health app shows this.',
                fr: 'L’app santé de ton téléphone l’indique.',
                tn: 'تطبيقة الصحّة في تليفونك تورّيهولك.',
                tnLatn: "L'app mta3 sa77a fi telifounek twarrihoulek.",
              })}
            </Txt>
          </>
        );

      case 'pace':
        return (
          <>
            {title(
              draft.goal === 'lose_fat'
                ? L({
                  en: 'How fast do you want to lose?',
                  fr: 'À quelle vitesse veux-tu perdre ?',
                  tn: 'قدّاش من زربة تحب تنقّص؟',
                  tnLatn: '9addech men zerba t7eb tna99es?',
                })
                : L({
                  en: 'How fast do you want to gain?',
                  fr: 'À quelle vitesse veux-tu prendre ?',
                  tn: 'قدّاش من زربة تحب تزيد؟',
                  tnLatn: '9addech men zerba t7eb tzid?',
                }),
              draft.goal === 'lose_fat'
                ? L({
                    en: 'Faster is not better: beyond about 1% of your weight a week, hunger, tiredness and muscle loss climb. Most people do best with moderate.',
                    fr: 'Plus vite n’est pas mieux : au-delà d’environ 1 % de ton poids par semaine, faim, fatigue et perte de muscle augmentent. Modéré convient à la plupart.',
                    tn: 'الزربة موش ديما خير: كي تفوت تقريب 1% من وزنك في الجمعة، الجوع، التعب وخسارة العضلات يزيدو. أغلب الناس يلقاو روحهم خير في المتوسّط.',
                    tnLatn: 'El zerba mouch dima 5ir: ki tfout ta9riban 1% men poids mte3ek fel jem3a, el jou3, et-ta3b w 5sara mta3 el muscle yzidou. A8leb ennes yl9aw rou7hom 5ir fel modéré.',
                  })
                : L({
                    en: 'Your body builds only so much muscle a month; a bigger surplus mostly adds fat.',
                    fr: 'Ton corps construit une quantité limitée de muscle par mois ; un plus gros surplus ajoute surtout du gras.',
                    tn: 'بدنك يبني كمية محدودة من العضلات في الشهر؛ كان تزيد برشا كالوري أغلبها يولّي شحم.',
                    tnLatn: 'Badnek yabni ken 9adr m7doud men el muscle fel chhar; ken tzid barcha calories a8lebhom ywalliw gras.',
                  }),
            )}
            {tiles(
              [
                { id: 'relaxed' as Pace, title: { en: 'Relaxed', fr: 'Tranquille', tn: 'على مهلك', tnLatn: '3la mahlek' }, desc: same(pacePreview('relaxed')) },
                {
                  id: 'moderate' as Pace,
                  title: { en: 'Moderate — recommended', fr: 'Modéré — recommandé', tn: 'متوسّط — ننصحوك بيه', tnLatn: 'Modéré — nensa7ouk bih' },
                  desc: same(pacePreview('moderate')),
                },
                {
                  id: 'fast' as Pace,
                  title: { en: 'Fast — for a deadline', fr: 'Rapide — pour une échéance', tn: 'بالزربة — لموعد قريب', tnLatn: 'Bel zerba — l maw3ed 9rib' },
                  desc: same(pacePreview('fast')),
                },
              ],
              draft.pace,
              (id) => choose({ pace: id }),
            )}
          </>
        );

      case 'experience':
        return (
          <>
            {title(L({ en: 'Experience with weights', fr: 'Ton expérience en musculation', tn: 'قدّاش عندك في الحديد؟', tnLatn: '9addech 3andek fel muscu?' }))}
            {tiles(EXPERIENCE, draft.experience, (id) => choose({ experience: id }))}
          </>
        );

      case 'schedule':
        return (
          <>
            {title(
              L({
                en: 'How often can you really train?',
                fr: 'Combien de fois peux-tu vraiment t’entraîner ?',
                tn: 'قدّاش من مرّة تنجّم تتمرّن بالحق؟',
                tnLatn: '9addech men marra tnajjem tetmarren bel 7a9?',
              }),
              L({
                en: 'Three sessions done every week beat five done half the time.',
                fr: 'Trois séances faites chaque semaine valent mieux que cinq une semaine sur deux.',
                tn: 'ثلاثة حصص كل جمعة خير من خمسة جمعة إيه وجمعة لا.',
                tnLatn: 'Thletha séances kol jem3a 5ir men 5amsa jem3a ey w jem3a le.',
              }),
            )}
            <Txt variant="label" tone="secondary" style={{ marginBottom: space.sm }}>
              {L({ en: 'Sessions per week', fr: 'Séances par semaine', tn: 'حصص في الجمعة', tnLatn: 'Séances fel jem3a' })}
            </Txt>
            <Segmented
              options={[1, 2, 3, 4, 5, 6].map((d) => ({ value: String(d), label: String(d) }))}
              value={String(draft.trainingDays)}
              onChange={(v) => set({ trainingDays: Number(v) })}
            />
            <Txt variant="label" tone="secondary" style={{ marginTop: space.xl, marginBottom: space.sm }}>
              {L({ en: 'Minutes per session', fr: 'Minutes par séance', tn: 'دقايق في الحصّة', tnLatn: 'Minutes fel séance' })}
            </Txt>
            <Segmented
              options={[30, 45, 60, 75, 90].map((m) => ({ value: String(m), label: String(m) }))}
              value={String(draft.sessionMinutes)}
              onChange={(v) => set({ sessionMinutes: Number(v) })}
            />
          </>
        );

      case 'equipment':
        return (
          <>
            {title(
              L({ en: 'Where will you train?', fr: 'Où vas-tu t’entraîner ?', tn: 'وين باش تتمرّن؟', tnLatn: 'Win bech tetmarren?' }),
              L({
                en: 'Every exercise in your plan will match what you have.',
                fr: 'Chaque exercice de ton plan correspondra à ton matériel.',
                tn: 'كل تمرين في البرنامج متاعك باش يكون على قد اللي عندك.',
                tnLatn: 'Kol exercice fel programme mte3ek bech ykoun 3la 9ad eli 3andek.',
              }),
            )}
            {tiles(EQUIPMENT, draft.equipment, (id) => choose({ equipment: id }))}
          </>
        );

      case 'limits':
        return (
          <>
            {title(
              L({
                en: 'Any pain or old injuries?',
                fr: 'Des douleurs ou anciennes blessures ?',
                tn: 'عندك وجيعة ولا بليسور قديمة؟',
                tnLatn: '3andek waji3a walla blessure 9dima?',
              }),
              L({
                en: 'Exercises that usually stress these areas are swapped for friendlier ones.',
                fr: 'Les exercices qui sollicitent ces zones sont remplacés par des alternatives plus douces.',
                tn: 'التمارين اللي عادة يتعبو البلايص هاذم نبدّلوهم بتمارين أرطب.',
                tnLatn: 'Les exercices eli 3adatan yta3bou leblayes hedhom nbaddlouhom b exercices artab.',
              }),
            )}
            <View style={{ gap: space.sm }}>
              {LIMITATIONS.map((l) => {
                const on = draft.limitations.includes(l.id);
                return (
                  <OptionTile
                    key={l.id}
                    multi
                    title={L(l.label)}
                    selected={on}
                    onPress={() => set({ limitations: on ? draft.limitations.filter((x) => x !== l.id) : [...draft.limitations, l.id] })}
                  />
                );
              })}
            </View>
            <Why
              title={L({ en: 'If something hurts right now', fr: 'Si quelque chose fait mal en ce moment', tn: 'كان عندك وجيعة توّا', tnLatn: 'Ken 3andek waji3a taw' })}
              tone="warning"
              style={{ marginTop: space.xl }}
            >
              <Txt variant="caption" tone="secondary">
                {L({
                  en: 'Tounsi Fit is not a doctor. Sharp pain, swelling or numbness should be checked by a doctor or physiotherapist before you train it.',
                  fr: 'Tounsi Fit n’est pas un médecin. Une douleur vive, un gonflement ou un engourdissement doivent être vus par un médecin ou un kiné avant de l’entraîner.',
                  tn: 'Tounsi Fit موش طبيب. الوجيعة القوية، النفخة ولا التنميل لازم يشوفهم طبيب ولا كينيه قبل ما تخدم عليهم.',
                  tnLatn: 'Tounsi Fit mouch tbib. El waji3a el 9wiya, en-nef5a walla et-tanmil lazem ychoufhom tbib walla kiné 9bal ma t5dem 3lihom.',
                })}
              </Txt>
            </Why>
          </>
        );

      case 'food':
        return (
          <>
            {title(L({ en: 'How you eat', fr: 'Ta façon de manger', tn: 'كيفاش تاكل', tnLatn: 'Kifech takel' }))}
            <Txt variant="label" tone="secondary" style={{ marginBottom: space.sm }}>
              {L({ en: 'Preferences (optional)', fr: 'Préférences (facultatif)', tn: 'اختياراتك (موش لازم)', tnLatn: '5tiyaratek (mouch lazem)' })}
            </Txt>
            <ChipRow>
              {DIET_PREFS.map((d) => {
                const on = draft.dietPrefs.includes(d.id);
                return (
                  <Chip
                    key={d.id}
                    label={L(d.label)}
                    selected={on}
                    onPress={() => set({ dietPrefs: on ? draft.dietPrefs.filter((x) => x !== d.id) : [...draft.dietPrefs, d.id] })}
                  />
                );
              })}
            </ChipRow>
            <Txt variant="label" tone="secondary" style={{ marginTop: space.xl, marginBottom: space.sm }}>
              {L({ en: 'Meals per day', fr: 'Repas par jour', tn: 'ماكلات في النهار', tnLatn: 'Maklet fel nhar' })}
            </Txt>
            <Segmented
              options={[1, 2, 3, 4, 5].map((m) => ({ value: String(m), label: String(m) }))}
              value={String(draft.mealsPerDay)}
              onChange={(v) => setMealsPerDay(Number(v))}
            />
            <View style={[styles.toggleRow, { borderColor: t.hairline }]}>
              <View style={{ flex: 1 }}>
                <Txt variant="bodyStrong">{L({ en: 'Intermittent fasting', fr: 'Jeûne intermittent', tn: 'الصيام المتقطّع', tnLatn: 'Jeûne intermittent' })}</Txt>
                <Txt variant="caption" tone="secondary">
                  {L({
                    en: 'Just a way to organise meals; it works through the calories you end up eating.',
                    fr: 'Juste une façon d’organiser les repas ; il agit via les calories mangées au final.',
                    tn: 'طريقة برك باش تنظّم الماكلة؛ يخدم بالكالوري اللي تاكلها في الآخر.',
                    tnLatn: 'Tari9a bark bech tnadhem el makla; ya5dem bel calories eli takelha fel e5er.',
                  })}
                </Txt>
              </View>
              <Toggle
                value={draft.fastingEnabled}
                onChange={(v) => {
                  set({ fastingEnabled: v, ...(!v && draft.mealsPerDay === 1 ? { mealsPerDay: 2 } : null) });
                  if (v) setFastPattern(patternOf(draft.fastingStart, draft.fastingEnd));
                }}
                label={L({ en: 'Intermittent fasting', fr: 'Jeûne intermittent', tn: 'الصيام المتقطّع', tnLatn: 'Jeûne intermittent' })}
              />
            </View>
            {draft.fastingEnabled ? (
              <Appear style={{ gap: space.md }}>
                <ChipRow>
                  {FAST_PATTERNS.map((p) => (
                    <Chip key={p.id} label={L(p.label)} selected={fastPattern === p.id} onPress={() => applyPattern(p)} />
                  ))}
                  <Chip
                    label={L({ en: 'Custom', fr: 'Personnalisé', tn: 'على كيفك', tnLatn: '3la kifek' })}
                    selected={fastPattern === 'custom'}
                    onPress={() => setFastPattern('custom')}
                  />
                </ChipRow>
                {fastPattern === 'custom' ? (
                  <View style={{ flexDirection: 'row', gap: space.md }}>
                    <Field
                      containerStyle={{ flex: 1 }}
                      label={L({ en: 'Fast starts', fr: 'Début du jeûne', tn: 'الصيام يبدا', tnLatn: 'E siyem yebda' })}
                      value={draft.fastingStart}
                      onChangeText={(v) => set({ fastingStart: v })}
                      onBlur={() => tidyTime('fastingStart')}
                      placeholder="20:00"
                      numeric
                    />
                    <Field
                      containerStyle={{ flex: 1 }}
                      label={L({ en: 'Eating starts', fr: 'Reprise des repas', tn: 'الماكلة تبدا', tnLatn: 'El makla tebda' })}
                      value={draft.fastingEnd}
                      onChangeText={(v) => set({ fastingEnd: v })}
                      onBlur={() => tidyTime('fastingEnd')}
                      placeholder="12:00"
                      numeric
                    />
                  </View>
                ) : (
                  <Field
                    label={
                      fastPattern === 'omad'
                        ? L({ en: 'You eat at', fr: 'Tu manges à', tn: 'وقت الماكلة', tnLatn: 'Wa9t el makla' })
                        : L({ en: 'Eating starts', fr: 'Reprise des repas', tn: 'الماكلة تبدا', tnLatn: 'El makla tebda' })
                    }
                    value={draft.fastingEnd}
                    onChangeText={setEatStart}
                    onBlur={() => tidyTime('fastingEnd')}
                    placeholder={fastPattern === 'omad' ? '18:00' : '12:00'}
                    numeric
                  />
                )}
                {(() => {
                  const f = parseTime(draft.fastingStart);
                  const e = parseTime(draft.fastingEnd);
                  if (f === null || e === null) return null;
                  const eatMin = (f - e + 1440) % 1440;
                  return (
                    <Txt variant="caption" tone="secondary">
                      {L(
                        {
                          en: 'You eat {{from}}–{{to}} ({{eat}}), then fast until {{from}} the next day ({{fast}}).',
                          fr: 'Tu manges de {{from}} à {{to}} ({{eat}}), puis tu jeûnes jusqu’à {{from}} le lendemain ({{fast}}).',
                          tn: 'تاكل من {{from}} لـ {{to}} ({{eat}})، ومن بعد تصوم حتى لـ {{from}} النهار اللي بعدو ({{fast}}).',
                          tnLatn: 'Takel men {{from}} l {{to}} ({{eat}}), w men ba3d tsoum 7atta l {{from}} el nhar eli ba3dou ({{fast}}).',
                        },
                        {
                          from: clock(e),
                          to: clock(f),
                          eat: `${Math.round((eatMin / 60) * 10) / 10} h`,
                          fast: `${Math.round(((1440 - eatMin) / 60) * 10) / 10} h`,
                        },
                      )}
                    </Txt>
                  );
                })()}
              </Appear>
            ) : null}
          </>
        );
    }
  };

  if (building) {
    return (
      <BuildingPlan
        profile={buildProfile(draft)}
        onDone={(p) => {
          saveProfile(p);
          setWorkoutPlan(generateWorkoutPlan(p));
          router.replace({ pathname: '/plan', params: { fresh: '1' } });
        }}
      />
    );
  }

  const isLast = stepIndex >= steps.length - 1;
  const autoSteps: StepId[] = ['goal', 'sex', 'pace', 'experience', 'equipment'];
  const showContinue = !autoSteps.includes(step) || canContinue;

  return (
    <View style={{ flex: 1, backgroundColor: t.ground, paddingTop: insets.top }}>
      <View style={styles.header}>
        <IconButton
          label={L({ en: 'Back', fr: 'Retour', tn: 'ارجع', tnLatn: 'Erja3' })}
          onPress={back}
          disabled={stepIndex === 0 && !edit}
          icon={(c) => <DirIcon icon={ArrowLeft} size={24} color={stepIndex === 0 && !edit ? 'transparent' : c} />}
        />
        <View style={{ flex: 1 }}>
          <StoryBars segments={steps.map((_, i) => (i <= stepIndex ? 1 : 0))} current={stepIndex} height={4} />
        </View>
        <Txt variant="numSmall" tone="tertiary" numberOfLines={1} style={{ minWidth: 52, textAlign: 'right', paddingRight: space.lg }}>
          {stepIndex + 1}/{steps.length}
        </Txt>
      </View>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <StepTransition stepKey={step} dir={dir}>
            {renderStep()}
          </StepTransition>
        </ScrollView>
        {showContinue ? (
          <View style={[styles.footer, { paddingBottom: insets.bottom + space.md }]}>
            {hint ? (
              <Appear key={hint} offset={4}>
                <Txt variant="caption" tone="danger" align="center" style={{ marginBottom: space.sm }} accessibilityLiveRegion="polite">
                  {hint}
                </Txt>
              </Appear>
            ) : null}
            <Button
              label={
                isLast
                  ? L({ en: 'Build my plan', fr: 'Créer mon plan', tn: 'اعمل البرنامج متاعي', tnLatn: 'A3mel el programme mte3i' })
                  : step === 'target' && !target
                    ? L({ en: 'Skip', fr: 'Passer', tn: 'فوّت', tnLatn: 'Fawwet' })
                    : L({ en: 'Continue', fr: 'Continuer', tn: 'كمّل', tnLatn: 'Kammel' })
              }
              onPress={next}
              inactive={!canContinue}
              fill
              size="lg"
              haptic="light"
            />
          </View>
        ) : null}
      </KeyboardAvoidingView>
    </View>
  );
}

// ---------------------------------------------------------------------------
// The authored moment: the plan assembling itself from the answers
// ---------------------------------------------------------------------------

function BuildingPlan({ profile, onDone }: { profile: Profile; onDone: (p: Profile) => void }) {
  const t = useTokens();
  const insets = useSafeAreaInsets();
  const reduce = useReducedMotion();
  const { L } = useLanguage();
  const plan = useMemo(() => computePlan(profile), [profile]);
  const [shown, setShown] = useState(reduce ? 4 : 0);

  useEffect(() => {
    if (reduce) return;
    const timers = [450, 1150, 1850, 2550].map((ms, i) => setTimeout(() => setShown(i + 1), ms));
    return () => timers.forEach(clearTimeout);
  }, [reduce]);

  const equipment = {
    gym: { en: 'the gym', fr: 'la salle', tn: 'السالة', tnLatn: 'el salle' },
    dumbbells: { en: 'your dumbbells', fr: 'tes haltères', tn: 'الهالتيرات متاعك', tnLatn: 'les haltères mte3ek' },
    bands: { en: 'your bands', fr: 'tes élastiques', tn: 'اللاستيكات متاعك', tnLatn: 'les élastiques mte3ek' },
    bodyweight: { en: 'bodyweight only', fr: 'le poids du corps', tn: 'وزن البدن برك', tnLatn: 'poids el badan bark' },
  }[profile.equipment];

  const rows: { label: string; value?: number; unit?: string }[] = [
    {
      label: L({ en: 'What your body burns at rest', fr: 'Ce que ton corps brûle au repos', tn: 'اللي يحرقو بدنك وانت مرتاح', tnLatn: 'Eli ya7r9ou badnek w enti merte7' }),
      value: plan.bmr,
      unit: 'kcal',
    },
    {
      label: L({
        en: 'Plus your daily movement and training',
        fr: 'Plus ton activité et tes séances',
        tn: 'زايد الحركة والتمارين متاعك',
        tnLatn: 'Zeyed el 7arka w les séances mte3ek',
      }),
      value: plan.tdee,
      unit: 'kcal',
    },
    {
      label: L({
        en: 'Your daily target, at a safe pace',
        fr: 'Ta cible quotidienne, à un rythme sûr',
        tn: 'الهدف متاعك في النهار، بريتم ما يضرّكش',
        tnLatn: "L'objectif mte3ek fel nhar, b rythme ma ydhorrekch",
      }),
      value: plan.targetCalories,
      unit: 'kcal',
    },
    {
      label: L(
        { en: 'Exercises chosen for {{eq}}', fr: 'Exercices choisis pour {{eq}}', tn: 'تمارين مختارة على قد {{eq}}', tnLatn: 'Exercices m5tarin 3la 9ad {{eq}}' },
        { eq: L(equipment) },
      ),
    },
  ];

  return (
    <View style={[styles.building, { backgroundColor: t.ground, paddingTop: insets.top + space.xxxl, paddingBottom: insets.bottom + space.lg }]}>
      <StoryBars segments={[0, 1, 2, 3].map((i) => (i < shown ? 1 : 0))} current={shown} height={6} style={{ marginBottom: space.xxl }} />
      <Txt variant="headline" style={{ marginBottom: space.xl }}>
        {L({
          en: 'Building your plan, {{name}}',
          fr: 'Ton plan se construit, {{name}}',
          tn: 'قاعدين نحضّرو البرنامج متاعك يا {{name}}',
          tnLatn: '9a3din n7adhrou el programme mte3ek ya {{name}}',
        }, { name: profile.name })}
      </Txt>
      <View style={{ gap: space.lg, flex: 1 }}>
        {rows.map((r, i) =>
          i < shown ? (
            <Appear key={i} duration={motion.slow} style={styles.buildRow}>
              <StampCheck done size={32} label={r.label} />
              <Txt variant="body" tone="secondary" style={{ flex: 1 }}>
                {r.label}
              </Txt>
              {r.value !== undefined ? <AnimatedNumber value={r.value} variant="numMedium" suffix={r.unit} /> : null}
            </Appear>
          ) : null,
        )}
      </View>
      <Button
        label={L({ en: 'See my plan', fr: 'Voir mon plan', tn: 'ورّيني البرنامج متاعي', tnLatn: 'Warrini el programme mte3i' })}
        onPress={() => onDone(profile)}
        disabled={shown < 4}
        fill
        size="lg"
        haptic="medium"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  header: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingLeft: space.xs, height: 64 },
  content: { paddingHorizontal: space.xl, paddingTop: space.lg, paddingBottom: space.xxxl },
  welcomePhoto: { height: 220, borderRadius: radius.lg, overflow: 'hidden', marginBottom: space.xl },
  footer: { paddingHorizontal: space.xl, paddingTop: space.md },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.lg,
    marginTop: space.xl,
    marginBottom: space.lg,
    paddingTop: space.xl,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  building: { flex: 1, paddingHorizontal: space.xl },
  buildRow: { flexDirection: 'row', alignItems: 'center', gap: space.md },
});
