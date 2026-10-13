// Access layer over the public-domain free-exercise-db dataset
// (https://github.com/yuhonas/free-exercise-db, Unlicense).

import type { Slug } from 'react-native-body-highlighter';
import type { LocalizedText } from '@/types';
import exercisesData from '@/data/exercises.json';
import { exerciseExtras } from '@/data/exerciseCuration';
import type { Language } from '@/lib/i18n';

export type Muscle =
  | 'abdominals'
  | 'hamstrings'
  | 'calves'
  | 'shoulders'
  | 'adductors'
  | 'glutes'
  | 'quadriceps'
  | 'biceps'
  | 'forearms'
  | 'abductors'
  | 'triceps'
  | 'chest'
  | 'lower back'
  | 'traps'
  | 'middle back'
  | 'lats'
  | 'neck';

export interface Exercise {
  id: string;
  name: string;
  force: 'push' | 'pull' | 'static' | null;
  level: 'beginner' | 'intermediate' | 'expert';
  mechanic: 'compound' | 'isolation' | null;
  equipment: string | null;
  primaryMuscles: Muscle[];
  secondaryMuscles: Muscle[];
  instructions: string[];
  category: string;
  images: string[];
}

export const exercises = exercisesData as Exercise[];
const byId = new Map(exercises.map((e) => [e.id, e]));

const IMAGE_BASE =
  'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';

export function getExercise(id: string): Exercise | undefined {
  return byId.get(id);
}

export function exerciseImageUrls(exercise: Exercise): string[] {
  return exercise.images.map((path) => IMAGE_BASE + path);
}

/** Exercise name: French for French and both Darija variants (the names Tunisian gyms use). */
export function exerciseName(exercise: Exercise, language: Language): string {
  if (language !== 'en') return exerciseExtras[exercise.id]?.nameFr ?? exercise.name;
  return exercise.name;
}

/** Which highlighter regions represent each dataset muscle. */
export const MUSCLE_TO_SLUGS: Record<Muscle, Slug[]> = {
  abdominals: ['abs', 'obliques'],
  hamstrings: ['hamstring'],
  calves: ['calves'],
  shoulders: ['deltoids'],
  adductors: ['adductors'],
  glutes: ['gluteal'],
  quadriceps: ['quadriceps'],
  biceps: ['biceps'],
  forearms: ['forearm'],
  abductors: ['gluteal'],
  triceps: ['triceps'],
  chest: ['chest'],
  'lower back': ['lower-back'],
  traps: ['trapezius'],
  'middle back': ['upper-back'],
  lats: ['upper-back'],
  neck: ['neck'],
};

/** Reverse map used when the user taps a body region to filter exercises. */
export const SLUG_TO_MUSCLES: Partial<Record<Slug, Muscle[]>> = {
  abs: ['abdominals'],
  obliques: ['abdominals'],
  hamstring: ['hamstrings'],
  calves: ['calves'],
  deltoids: ['shoulders'],
  adductors: ['adductors'],
  gluteal: ['glutes', 'abductors'],
  quadriceps: ['quadriceps'],
  biceps: ['biceps'],
  forearm: ['forearms'],
  triceps: ['triceps'],
  chest: ['chest'],
  'lower-back': ['lower back'],
  trapezius: ['traps'],
  'upper-back': ['lats', 'middle back'],
  neck: ['neck'],
};

export const MUSCLE_NAMES: Record<Muscle, LocalizedText> = {
  abdominals: { en: 'Abs', fr: 'Abdominaux', tn: 'عضلات الكرش', tnLatn: 'Abdos' },
  hamstrings: { en: 'Hamstrings', fr: 'Ischio-jambiers', tn: 'تالي الفخذ', tnLatn: 'Ischios' },
  calves: { en: 'Calves', fr: 'Mollets', tn: 'الربلة', tnLatn: 'Mollets' },
  shoulders: { en: 'Shoulders', fr: 'Épaules', tn: 'الكتاف', tnLatn: 'Épaules' },
  adductors: { en: 'Inner thighs', fr: 'Adducteurs', tn: 'داخل الفخذ', tnLatn: 'Adducteurs' },
  glutes: { en: 'Glutes', fr: 'Fessiers', tn: 'الفسّة', tnLatn: 'Fessiers' },
  quadriceps: { en: 'Quads (front thighs)', fr: 'Quadriceps', tn: 'الكوادريسبس (قدّام الفخذ)', tnLatn: 'Quadriceps (9odem el fa5dh)' },
  biceps: { en: 'Biceps', fr: 'Biceps', tn: 'البيسبس', tnLatn: 'Biceps' },
  forearms: { en: 'Forearms', fr: 'Avant-bras', tn: 'الذراع', tnLatn: 'Avant-bras' },
  abductors: { en: 'Outer hips', fr: 'Abducteurs', tn: 'برّا الفخذ', tnLatn: 'Abducteurs' },
  triceps: { en: 'Triceps', fr: 'Triceps', tn: 'التريسبس', tnLatn: 'Triceps' },
  chest: { en: 'Chest', fr: 'Pectoraux', tn: 'الصدر', tnLatn: 'Pectoraux' },
  'lower back': { en: 'Lower back', fr: 'Bas du dos', tn: 'تحت الظهر', tnLatn: 'Lombaires' },
  traps: { en: 'Traps', fr: 'Trapèzes', tn: 'الترابيز', tnLatn: 'Trapèzes' },
  'middle back': { en: 'Mid back', fr: 'Milieu du dos', tn: 'وسط الظهر', tnLatn: 'Milieu du dos' },
  lats: { en: 'Lats (back width)', fr: 'Grand dorsal', tn: 'الدورسال (عرض الظهر)', tnLatn: 'Dorsaux (3ordh edhahr)' },
  neck: { en: 'Neck', fr: 'Cou', tn: 'الرقبة', tnLatn: 'Cou' },
};

/** Plain-language description of what each muscle does — shown on tap. */
export const MUSCLE_ROLES: Record<Muscle, LocalizedText> = {
  abdominals: {
    en: 'Brace and bend your trunk; protect your lower back when lifting.',
    fr: 'Gainent et fléchissent le tronc ; protègent le bas du dos.',
    tn: 'يشدّو الوسط ويطويوه؛ يحميو تحت ظهرك كي ترفع.',
    tnLatn: 'Ychaddou el wost w yetwiwah; y7emiw ta7t dhahrek ki terfa3.',
  },
  hamstrings: {
    en: 'Bend the knee and extend the hip — key for running and hinging.',
    fr: 'Fléchissent le genou et étendent la hanche — essentiels pour courir.',
    tn: 'يطويو الركبة ويمدّو الحوض — مهمّين للجري وكي تطبّس.',
    tnLatn: 'Yetwiw er rokba w ymeddou el 7oudh — mouhemmin lel jri w ki ttabbes.',
  },
  calves: {
    en: 'Point your foot and push off the ground when you walk or jump.',
    fr: 'Tendent le pied et propulsent quand tu marches ou sautes.',
    tn: 'يمدّو ساقك ويدزّوك من الأرض كي تمشي ولا تنقز.',
    tnLatn: 'Ymeddou sa9ek w ydezzouk mel ardh ki temchi wala ten9ez.',
  },
  shoulders: {
    en: 'Lift your arms forward, sideways and back; give the shoulders their shape.',
    fr: 'Lèvent les bras devant, sur le côté et derrière ; dessinent les épaules.',
    tn: 'يهزّو ذراعاتك لقدّام، على الجنب ولتالي؛ يعطيو للكتاف شكلهم.',
    tnLatn: 'Yhezzou dhra3atek l 9odem, 3al jneb w l tali; ya3tiw lel ktef chakelhom.',
  },
  adductors: {
    en: 'Pull the legs together and stabilise squats.',
    fr: 'Rapprochent les jambes et stabilisent le squat.',
    tn: 'يلمّو الساقين لبعضهم ويثبّتو السكوات.',
    tnLatn: 'Ylemmou essa9in l ba3dhhom w ythabtou el squat.',
  },
  glutes: {
    en: 'The biggest muscle: extends the hip, powers squats, stairs and sprints.',
    fr: 'Le plus gros muscle : étend la hanche, propulse squats, escaliers et sprints.',
    tn: 'أكبر عضلة: تمدّ الحوض وتعطي القوّة للسكوات، الدروج والسبرينت.',
    tnLatn: 'Akbar muscle: tmedd el 7oudh w ta3ti el 9owwa lel squat, edrouj w sprint.',
  },
  quadriceps: {
    en: 'Straighten the knee — the main muscle in squats, lunges and stairs.',
    fr: 'Tendent le genou — muscle principal des squats, fentes et escaliers.',
    tn: 'يمدّو الركبة — العضلة الأساسية في السكوات، الفونت والدروج.',
    tnLatn: 'Ymeddou er rokba — el muscle el asesi fel squat, les fentes w edrouj.',
  },
  biceps: {
    en: 'Bend the elbow and help every pulling movement.',
    fr: 'Fléchissent le coude et aident à chaque mouvement de tirage.',
    tn: 'يطويو المرفق ويعاونو في كل حركة فيها تجبيد.',
    tnLatn: 'Yetwiw el merfe9 w y3awnou f kol 7arka fiha tejbid.',
  },
  forearms: {
    en: 'Grip strength — holding weights, bags and bars.',
    fr: 'Force de préhension — tenir les poids, les sacs, la barre.',
    tn: 'قوّة الشدّة — باش تشدّ الحديد، الشكاير والبار.',
    tnLatn: '9owwet ech-chedda — bech tchedd el 7did, e chkayer w el barre.',
  },
  abductors: {
    en: 'Move the leg out to the side and keep your knees from caving in.',
    fr: 'Écartent la jambe et empêchent les genoux de rentrer.',
    tn: 'يحلّو الساق على الجنب وما يخلّيوش ركابيك يدخلو لداخل.',
    tnLatn: 'Y7ellou essa9 3al jneb w ma y5alliwch rkabik yod5lou l dekhel.',
  },
  triceps: {
    en: 'Straighten the elbow — two-thirds of your upper-arm size.',
    fr: 'Tendent le coude — deux tiers du volume du bras.',
    tn: 'يمدّو المرفق — ثلثين من حجم ذراعك.',
    tnLatn: 'Ymeddou el merfe9 — thoulthin men 7ajm dhra3ek.',
  },
  chest: {
    en: 'Push things away from you and bring the arms across the body.',
    fr: 'Poussent devant toi et rapprochent les bras devant le corps.',
    tn: 'يدزّو الحاجات لقدّامك ويلمّو ذراعاتك قدّام بدنك.',
    tnLatn: 'Ydezzou el 7ajet l 9odemek w ylemmou dhra3atek 9odem bdenek.',
  },
  'lower back': {
    en: 'Keep the spine straight when you bend and lift.',
    fr: 'Maintiennent la colonne droite quand tu te penches et soulèves.',
    tn: 'يخلّيو سلسلة ظهرك مقادّة كي تطبّس وترفع.',
    tnLatn: 'Y5alliw selslet dhahrek m9adda ki ttabbes w terfa3.',
  },
  traps: {
    en: 'Shrug and stabilise the shoulder blades; support the neck.',
    fr: 'Haussent et stabilisent les omoplates ; soutiennent le cou.',
    tn: 'يهزّو الكتاف ويثبّتو اللوحات؛ يشدّو الرقبة.',
    tnLatn: 'Yhezzou lektef w ythabtou el lou7at; ychaddou er ra9ba.',
  },
  'middle back': {
    en: 'Squeeze the shoulder blades together — good posture.',
    fr: 'Serrent les omoplates — une bonne posture.',
    tn: 'يلمّو لوحات الكتاف لبعضهم — وقفة صحيحة.',
    tnLatn: 'Ylemmou lou7at lektef l ba3dhhom — wa9fa s7i7a.',
  },
  lats: {
    en: 'Pull your arms down and back — give the back its V shape.',
    fr: 'Tirent les bras vers le bas et l’arrière — donnent le dos en V.',
    tn: 'يجبدو ذراعاتك للتحت ولتالي — يعطيو للظهر شكل V.',
    tnLatn: 'Yejbdou dhra3atek lel ta7t w l tali — ya3tiw lel dhahr chakl V.',
  },
  neck: {
    en: 'Hold and move your head.',
    fr: 'Tiennent et bougent la tête.',
    tn: 'يشدّو راسك ويحرّكوه.',
    tnLatn: 'Ychaddou rasek w y7arkouh.',
  },
};

export const EQUIPMENT_NAMES: Record<string, LocalizedText> = {
  'body only': { en: 'Bodyweight', fr: 'Poids du corps', tn: 'وزن البدن', tnLatn: 'Poids du corps' },
  machine: { en: 'Machine', fr: 'Machine', tn: 'ماشينة', tnLatn: 'Machine' },
  other: { en: 'Other', fr: 'Autre', tn: 'حاجة أخرى', tnLatn: 'Autre' },
  'foam roll': { en: 'Foam roller', fr: 'Rouleau', tn: 'رولو', tnLatn: 'Rouleau' },
  kettlebells: { en: 'Kettlebell', fr: 'Kettlebell', tn: 'كيتلبال', tnLatn: 'Kettlebell' },
  dumbbell: { en: 'Dumbbells', fr: 'Haltères', tn: 'هالتار', tnLatn: 'Haltères' },
  cable: { en: 'Cable', fr: 'Poulie', tn: 'بولي', tnLatn: 'Poulie' },
  barbell: { en: 'Barbell', fr: 'Barre', tn: 'بار', tnLatn: 'Barre' },
  bands: { en: 'Bands', fr: 'Élastiques', tn: 'لاستيك', tnLatn: 'Élastiques' },
  'medicine ball': { en: 'Medicine ball', fr: 'Médecine-ball', tn: 'ميديسين بول', tnLatn: 'Médecine-ball' },
  'exercise ball': { en: 'Swiss ball', fr: 'Ballon suisse', tn: 'بالون سويسري', tnLatn: 'Ballon suisse' },
  'e-z curl bar': { en: 'EZ bar', fr: 'Barre EZ', tn: 'بار EZ', tnLatn: 'Barre EZ' },
};

export const LEVEL_NAMES: Record<Exercise['level'], LocalizedText> = {
  beginner: { en: 'Beginner', fr: 'Débutant', tn: 'مبتدئ', tnLatn: 'Débutant' },
  intermediate: { en: 'Intermediate', fr: 'Intermédiaire', tn: 'متوسّط', tnLatn: 'Intermédiaire' },
  expert: { en: 'Advanced', fr: 'Avancé', tn: 'متقدّم', tnLatn: 'Avancé' },
};

/** Body-highlighter data: primary muscles strong, secondary muscles light. */
export function bodyHighlightData(exercise: Pick<Exercise, 'primaryMuscles' | 'secondaryMuscles'>) {
  const seen = new Map<Slug, number>();
  for (const m of exercise.secondaryMuscles) {
    for (const slug of MUSCLE_TO_SLUGS[m] ?? []) seen.set(slug, 1);
  }
  for (const m of exercise.primaryMuscles) {
    for (const slug of MUSCLE_TO_SLUGS[m] ?? []) seen.set(slug, 2);
  }
  return [...seen.entries()].map(([slug, intensity]) => ({ slug, intensity }));
}

/** Muscles whose regions are on the back view of the body. */
const BACK_MUSCLES = new Set<Muscle>([
  'hamstrings',
  'glutes',
  'lower back',
  'traps',
  'middle back',
  'lats',
  'triceps',
  'calves',
  'abductors',
]);

export function bestBodySide(exercise: Pick<Exercise, 'primaryMuscles'>): 'front' | 'back' {
  const back = exercise.primaryMuscles.filter((m) => BACK_MUSCLES.has(m)).length;
  return back > exercise.primaryMuscles.length / 2 ? 'back' : 'front';
}

export interface ExerciseFilter {
  query?: string;
  muscles?: Muscle[];
  equipment?: string[];
  level?: Exercise['level'];
  category?: string;
  curatedOnly?: boolean;
}

const normalize = (s: string) =>
  s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');

export function searchExercises(filter: ExerciseFilter): Exercise[] {
  const q = filter.query ? normalize(filter.query) : '';
  const results = exercises.filter((e) => {
    if (filter.curatedOnly && !exerciseExtras[e.id]) return false;
    if (filter.category && e.category !== filter.category) return false;
    if (filter.level && e.level !== filter.level) return false;
    if (filter.equipment?.length && !filter.equipment.includes(e.equipment ?? 'other')) {
      return false;
    }
    if (
      filter.muscles?.length &&
      !e.primaryMuscles.some((m) => filter.muscles!.includes(m))
    ) {
      return false;
    }
    if (q) {
      const fr = exerciseExtras[e.id]?.nameFr ?? '';
      if (!normalize(e.name).includes(q) && !normalize(fr).includes(q)) return false;
    }
    return true;
  });
  // Coach-curated, beginner-friendly exercises first.
  const score = (e: Exercise) =>
    (exerciseExtras[e.id] ? 0 : 10) +
    (e.level === 'beginner' ? 0 : e.level === 'intermediate' ? 1 : 2);
  return results.sort((a, b) => score(a) - score(b) || a.name.localeCompare(b.name));
}
