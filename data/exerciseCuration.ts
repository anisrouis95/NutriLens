/**
 * Curated exercise layer on top of free-exercise-db (data/exercises.json, public domain).
 *
 * - slotCandidates: for each movement slot and equipment profile, exercise ids ordered
 *   best-first for a complete beginner (simplest / safest / easiest to learn, good stimulus).
 * - exerciseExtras: French name, coaching cues, common mistakes, difficulty, limitation
 *   flags and default hypertrophy rep range for every id used in slotCandidates.
 *
 * Every id below exists verbatim in data/exercises.json.
 *
 * Notes on home profiles:
 * - `bodyweight` assumes floor, wall, a sturdy table/chair/door and a backpack. Where the
 *   dataset has no zero-equipment version, a dumbbell exercise is used and its cues explain
 *   the household substitute (loaded backpack, water bottles).
 * - `bands` includes everything from `bodyweight` plus resistance bands.
 * - `dumbbells` includes a pair of adjustable dumbbells, a bench/chair and bodyweight moves.
 *
 * Rep ranges: `timed: true` means the range is in seconds (planks, holds, cardio).
 * `unilateral: true` means the range is per side.
 */

import type { LocalizedText } from '@/lib/i18n';
export type { LocalizedText } from '@/lib/i18n';

export type EquipmentProfile = 'gym' | 'dumbbells' | 'bodyweight' | 'bands';

export type Limitation = 'knees' | 'lower_back' | 'shoulders' | 'wrists';

export type MovementSlot =
  | 'squat'
  | 'hinge'
  | 'lunge'
  | 'glute_bridge'
  | 'horizontal_push'
  | 'incline_push'
  | 'vertical_push'
  | 'horizontal_pull'
  | 'vertical_pull'
  | 'chest_fly'
  | 'lateral_raise'
  | 'rear_delt'
  | 'biceps'
  | 'triceps'
  | 'quad_iso'
  | 'hamstring_curl'
  | 'calves'
  | 'core_anti_extension'
  | 'core_flexion'
  | 'core_rotation'
  | 'conditioning';

export interface SlotInfo {
  name: LocalizedText;
  description: LocalizedText;
}

export interface ExerciseExtra {
  nameFr: string;
  cues: LocalizedText[];
  mistakes: LocalizedText[];
  difficulty: 1 | 2 | 3;
  avoidIf?: Limitation[];
  repRange?: [number, number];
  timed?: boolean;
  unilateral?: boolean;
}

import { t } from './text';
import { exerciseExtrasA } from './exerciseExtrasA';
import { exerciseExtrasB } from './exerciseExtrasB';

// ---------------------------------------------------------------------------
// Slot descriptions (plain language for a beginner)
// ---------------------------------------------------------------------------

export const slotInfo: Record<MovementSlot, SlotInfo> = {
  squat: {
    name: t("Squat", "Squat", "سكوات", "Squat"),
    description: t(
      "Bending hips and knees to sit down and stand back up. Builds thighs and glutes.",
      "Plier hanches et genoux pour s'asseoir puis se relever. Muscle les cuisses et les fessiers.",
      "تطوي جنابك وركايبك كيما كان باش تقعد، ومبعد توقف. يكبّر الفخاذ والفيسيي.",
      "Ttawi jnabek w rkaybek kima ken bech to93ed, w mba3d to9ef. Ykabber el fkhedh w les fessiers.",
    ),
  },
  hinge: {
    name: t("Hip hinge", "Charnière de hanche", "الطوية من الجناب", "Twiya mel jnab"),
    description: t(
      "Pushing the hips back with a flat back, then standing tall. Trains hamstrings, glutes and lower back.",
      "Reculer les hanches dos plat, puis se redresser. Travaille l'arrière des cuisses, les fessiers et le bas du dos.",
      "ترجّع جنابك لتالي وظهرك دريت، ومبعد توقف دريت. يخدم الفخذ من تالي، الفيسيي والظهر من لوطة.",
      "Trajja3 jnabek lteli w dharek dret, w mba3d to9ef dret. Yekhdem les ischios, les fessiers w dharek mel louta.",
    ),
  },
  lunge: {
    name: t("Lunge / single leg", "Fente / une jambe", "فونت / ساق وحدة", "Fente / sa9 wa7da"),
    description: t(
      "One leg does most of the work at a time. Builds legs and balance, and evens out left-right differences.",
      "Une jambe travaille à la fois. Muscle les jambes, améliore l'équilibre et corrige les différences gauche-droite.",
      "ساق وحدة تخدم أكثر الخدمة في كل مرّة. يقوّي الساقين والتوازن، ويعدّل الفرق بين اليمين واليسار.",
      "Sa9 wa7da tekhdem akther el khedma f kol marra. Y9awwi sa9ik w el équilibre, w y3addel el far9 bin l imin w l isar.",
    ),
  },
  glute_bridge: {
    name: t("Glute bridge", "Pont fessier", "بون فيسيي", "Pont fessier"),
    description: t(
      "Lifting the hips while lying on your back. Targets the glutes with very little stress on the back.",
      "Monter les hanches allongé sur le dos. Cible les fessiers en ménageant le dos.",
      "تطلّع جنابك وانت متمدّد على ظهرك. يخدم الفيسيي من غير ما يتعّب الظهر.",
      "Ttala3 jnabek w enti metmadded 3la dharek. Yekhdem les fessiers men 8ir ma yta33eb edhar.",
    ),
  },
  horizontal_push: {
    name: t("Chest press", "Poussée horizontale", "دزّ بالصدر", "Dezz b sder"),
    description: t(
      "Pushing a weight (or yourself) away from your chest. Works chest, front shoulders and triceps.",
      "Pousser une charge (ou ton corps) devant la poitrine. Travaille pectoraux, avant des épaules et triceps.",
      "تدزّ ثقل (ولا بدنك) بعيد على صدرك. يخدم الصدر، الكتاف من قدّام والتريسيبس.",
      "Tdezz charge (walla badnek) b3id 3la sadrek. Yekhdem sder, ktef men 9oddem w triceps.",
    ),
  },
  incline_push: {
    name: t("Incline press", "Poussée inclinée", "دزّ مايل", "Dezz mayel"),
    description: t(
      "Pushing upward at an angle, between a chest press and an overhead press. Emphasises the upper chest.",
      "Pousser vers le haut en diagonale, entre développé couché et développé épaules. Insiste sur le haut des pectoraux.",
      "تدزّ لفوق بالمايل، بين دزّ الصدر ودزّ فوق الراس. يركّز على الصدر من فوق.",
      "Tdezz lel fou9 bel mayel, bin dezz sder w dezz fou9 ras. Yrakkez 3al sder mel fou9.",
    ),
  },
  vertical_push: {
    name: t("Overhead press", "Poussée verticale", "دزّ فوق الراس", "Dezz fou9 ras"),
    description: t(
      "Pushing a weight up over your head. Builds the shoulders and triceps.",
      "Pousser une charge au-dessus de la tête. Muscle les épaules et les triceps.",
      "تدزّ ثقل لفوق راسك. يكبّر الكتاف والتريسيبس.",
      "Tdezz charge l fou9 rasek. Ykabber el ktef w triceps.",
    ),
  },
  horizontal_pull: {
    name: t("Row", "Tirage horizontal (rowing)", "جبد للكرش", "Jbed lel krech"),
    description: t(
      "Pulling a weight toward your belly. Thickens the upper back and helps posture.",
      "Tirer une charge vers le ventre. Épaissit le haut du dos et améliore la posture.",
      "تجبد ثقل لكرشك. يخشّن الظهر من فوق ويصلّح الوقفة.",
      "Tejbed charge l krechek. Ykhachchen dharek mel fou9 w ysalla7 el wa9fa.",
    ),
  },
  vertical_pull: {
    name: t("Vertical pull", "Tirage vertical", "جبد من فوق", "Jbed mel fou9"),
    description: t(
      "Pulling from above your head down toward your chest. Widens the back (lats) and works the biceps.",
      "Tirer du haut vers la poitrine. Élargit le dos (grands dorsaux) et travaille les biceps.",
      "تجبد من فوق راسك لصدرك. يعرّض الظهر (الدورسو) ويخدم البيسيبس.",
      "Tejbed men fou9 rasek l sadrek. Y3arredh dharek (les dorsaux) w yekhdem el biceps.",
    ),
  },
  chest_fly: {
    name: t("Chest fly", "Écarté pectoraux", "إيكارتي صدر", "Écarté sder"),
    description: t(
      "A hugging motion with almost straight arms. Isolates the chest muscles.",
      "Un mouvement d'enlacement bras presque tendus. Isole les pectoraux.",
      "حركة كيما كان تعنّق حدّ، ويديك تقريب ممدودين. تخدم عضلات الصدر وحدها.",
      "7arka kima ken t3anne9 7add, w yeddik ta9rib mamdoudin. Tekhdem muscles sder wa7dhom.",
    ),
  },
  lateral_raise: {
    name: t("Lateral raise", "Élévation latérale", "تطليع على الجناب", "Élévation latérale"),
    description: t(
      "Raising the arms out to the sides. Builds the side of the shoulders for a wider look.",
      "Monter les bras sur les côtés. Développe le côté des épaules pour une carrure plus large.",
      "تطلّع يديك على الجناب. يكبّر الكتاف من الجنب باش تبان أعرض.",
      "Ttala3 yeddik 3al jnab. Ykabber el ktef mel jnab bech tben a3radh.",
    ),
  },
  rear_delt: {
    name: t("Rear shoulders", "Arrière des épaules", "الكتاف من تالي", "Ktef men teli"),
    description: t(
      "Opening the arms backward. Strengthens the back of the shoulders and balances all the pushing.",
      "Ouvrir les bras vers l'arrière. Renforce l'arrière des épaules et équilibre les exercices de poussée.",
      "تحلّ يديك لتالي. يقوّي الكتاف من تالي ويعادل التمارين متاع الدزّ.",
      "T7ell yeddik lteli. Y9awwi el ktef men teli w y3adel les exercices mta3 dezz.",
    ),
  },
  biceps: {
    name: t("Biceps curl", "Curl biceps", "كورل بيسيبس", "Curl biceps"),
    description: t(
      "Bending the elbow against resistance. Builds the front of the upper arm.",
      "Plier le coude contre une résistance. Muscle l'avant du bras.",
      "تطوي المرفق ضدّ ثقل. يكبّر الذراع من قدّام.",
      "Ttawi el morfe9 dhed charge. Ykabber dhra3ek men 9oddem.",
    ),
  },
  triceps: {
    name: t("Triceps", "Triceps", "تريسيبس", "Triceps"),
    description: t(
      "Straightening the elbow against resistance. Builds the back of the arm, most of its size.",
      "Tendre le coude contre une résistance. Muscle l'arrière du bras, qui fait l'essentiel de son volume.",
      "تمدّ المرفق ضدّ ثقل. يكبّر الذراع من تالي، اللي هو أغلب حجمو.",
      "Tmedd el morfe9 dhed charge. Ykabber dhra3ek men teli, eli houwa akther 7ajmou.",
    ),
  },
  quad_iso: {
    name: t("Quad focus", "Quadriceps (ciblé)", "الفخذ من قدّام", "Quadriceps"),
    description: t(
      "Extra work for the front of the thighs, mainly by straightening the knee.",
      "Travail en plus pour l'avant des cuisses, surtout en tendant le genou.",
      "خدمة زايدة للفخاذ من قدّام، أكثر شي كي تمدّ الركبة.",
      "Khedma zeyda lel fkhedh men 9oddem, akther chay ki tmedd el rokba.",
    ),
  },
  hamstring_curl: {
    name: t("Hamstring curl", "Leg curl (ischios)", "الفخذ من تالي (leg curl)", "Leg curl (ischios)"),
    description: t(
      "Bending the knee to bring the heel toward the glutes. Targets the back of the thighs.",
      "Plier le genou pour ramener le talon vers les fesses. Cible l'arrière des cuisses.",
      "تطوي الركبة باش تجيب الكعب للفيسيي. يخدم الفخاذ من تالي.",
      "Ttawi el rokba bech tjib el ka3b lel fessiers. Yekhdem el fkhedh men teli.",
    ),
  },
  calves: {
    name: t("Calves", "Mollets", "المولي", "Mollets"),
    description: t(
      "Rising up onto your toes. Strengthens the calves and ankles.",
      "Monter sur la pointe des pieds. Renforce les mollets et les chevilles.",
      "تطلع على صوابع ساقيك. يقوّي المولي والكعبات.",
      "Tetla3 3la swaba3 sa9ik. Y9awwi les mollets w el ka3bet.",
    ),
  },
  core_anti_extension: {
    name: t("Core bracing", "Gainage", "شدّ الكرش", "Gainage"),
    description: t(
      "Keeping your trunk rigid so the lower back doesn't arch. Builds a strong core that protects your back.",
      "Garder le tronc rigide sans creuser le dos. Construit une sangle abdominale qui protège le dos.",
      "تخلّي بدنك مشدود باش ظهرك من لوطة ما يتكمبراش. يبني عضلات كرش قويّة تحمي ظهرك.",
      "Tkhalli badnek machdoud bech dharek mel louta ma yetcambrach. Yebni muscles krech 9wiya t7mi dharek.",
    ),
  },
  core_flexion: {
    name: t("Ab crunch", "Abdos (enroulement)", "كرانش (أبدو)", "Abdos (crunch)"),
    description: t(
      "Curling the ribs and hips toward each other. Works the front abs (six-pack).",
      "Rapprocher les côtes et le bassin. Travaille les grands droits (les tablettes).",
      "تقرّب ضلوعك وجنابك لبعضهم. يخدم الأبدو من قدّام (التابليت).",
      "T9arreb dhlou3ek w jnabek l ba3dhhom. Yekhdem les abdos men 9oddem (les tablettes).",
    ),
  },
  core_rotation: {
    name: t("Obliques & rotation", "Obliques et rotation", "الأوبليك والدوران", "Obliques w rotation"),
    description: t(
      "Twisting, or resisting a twist or a side bend. Works the obliques on the sides of your waist.",
      "Tourner, ou résister à une rotation ou une inclinaison. Travaille les obliques sur les côtés de la taille.",
      "تدوّر، ولا تقاوم الدوران ولا الميلة على الجنب. يخدم الأوبليك على جناب وسطك.",
      "Tdawwer, walla t9awem el dawaran walla el mila 3al jnab. Yekhdem les obliques 3la jnab wostek.",
    ),
  },
  conditioning: {
    name: t("Cardio", "Cardio", "كارديو", "Cardio"),
    description: t(
      "Steady or interval effort that raises your heart rate. Improves fitness and recovery between sets.",
      "Effort continu ou fractionné qui fait monter le cœur. Améliore l'endurance et la récupération.",
      "مجهود ثابت ولا بالفترات يطلّع دقّات قلبك. يطوّر النفس ويخلّيك ترتاح أسرع بين السيريات.",
      "Effort theb walla b fractionné ytala3 battements 9albek. Ytawwer ennefs w ykhallik terte7 asra3 bin les séries.",
    ),
  },
};

// ---------------------------------------------------------------------------
// Candidates per slot x equipment profile (best-first for a beginner)
// ---------------------------------------------------------------------------

export const slotCandidates: Record<MovementSlot, Record<EquipmentProfile, string[]>> = {
  squat: {
    gym: ['Leg_Press', 'Goblet_Squat', 'Dumbbell_Squat_To_A_Bench', 'Smith_Machine_Squat', 'Hack_Squat', 'Barbell_Squat'],
    dumbbells: ['Goblet_Squat', 'Dumbbell_Squat_To_A_Bench', 'Dumbbell_Squat', 'Plie_Dumbbell_Squat', 'Bodyweight_Squat'],
    bodyweight: ['Bodyweight_Squat', 'Goblet_Squat', 'Freehand_Jump_Squat'],
    bands: ['Squats_-_With_Bands', 'Bodyweight_Squat', 'Goblet_Squat', 'Freehand_Jump_Squat'],
  },
  hinge: {
    gym: ['Stiff-Legged_Dumbbell_Deadlift', 'Pull_Through', 'Hyperextensions_Back_Extensions', 'Romanian_Deadlift', 'Trap_Bar_Deadlift', 'Barbell_Deadlift'],
    dumbbells: ['Stiff-Legged_Dumbbell_Deadlift', 'Kettlebell_One-Legged_Deadlift', 'Superman'],
    bodyweight: ['Stiff-Legged_Dumbbell_Deadlift', 'Kettlebell_One-Legged_Deadlift', 'Superman'],
    bands: ['Band_Good_Morning', 'Band_Good_Morning_Pull_Through', 'Stiff-Legged_Dumbbell_Deadlift', 'Kettlebell_One-Legged_Deadlift', 'Hip_Extension_with_Bands'],
  },
  lunge: {
    gym: ['Dumbbell_Rear_Lunge', 'Dumbbell_Step_Ups', 'Dumbbell_Lunges', 'Smith_Single-Leg_Split_Squat', 'Split_Squat_with_Dumbbells', 'Step-up_with_Knee_Raise'],
    dumbbells: ['Dumbbell_Rear_Lunge', 'Dumbbell_Step_Ups', 'Dumbbell_Lunges', 'Split_Squat_with_Dumbbells', 'Step-up_with_Knee_Raise'],
    bodyweight: ['Bodyweight_Walking_Lunge', 'Step-up_with_Knee_Raise', 'Dumbbell_Rear_Lunge', 'Split_Squat_with_Dumbbells'],
    bands: ['Bodyweight_Walking_Lunge', 'Step-up_with_Knee_Raise', 'Dumbbell_Rear_Lunge', 'Split_Squat_with_Dumbbells'],
  },
  glute_bridge: {
    gym: ['Barbell_Glute_Bridge', 'Barbell_Hip_Thrust', 'Butt_Lift_Bridge', 'Single_Leg_Glute_Bridge', 'Thigh_Abductor', 'One-Legged_Cable_Kickback'],
    dumbbells: ['Butt_Lift_Bridge', 'Single_Leg_Glute_Bridge', 'Glute_Kickback'],
    bodyweight: ['Butt_Lift_Bridge', 'Single_Leg_Glute_Bridge', 'Glute_Kickback'],
    bands: ['Hip_Lift_with_Band', 'Butt_Lift_Bridge', 'Monster_Walk', 'Single_Leg_Glute_Bridge', 'Hip_Extension_with_Bands'],
  },
  horizontal_push: {
    gym: ['Machine_Bench_Press', 'Dumbbell_Bench_Press', 'Cable_Chest_Press', 'Dumbbell_Bench_Press_with_Neutral_Grip', 'Barbell_Bench_Press_-_Medium_Grip', 'Pushups'],
    dumbbells: ['Dumbbell_Bench_Press', 'Dumbbell_Floor_Press', 'Dumbbell_Bench_Press_with_Neutral_Grip', 'Incline_Push-Up', 'Pushups'],
    bodyweight: ['Incline_Push-Up', 'Pushups', 'Isometric_Wipers'],
    bands: ['Incline_Push-Up', 'Bench_Press_-_With_Bands', 'Pushups', 'Isometric_Wipers'],
  },
  incline_push: {
    gym: ['Leverage_Incline_Chest_Press', 'Incline_Dumbbell_Press', 'Incline_Cable_Chest_Press', 'Incline_Dumbbell_Bench_With_Palms_Facing_In', 'Smith_Machine_Incline_Bench_Press', 'Barbell_Incline_Bench_Press_-_Medium_Grip'],
    dumbbells: ['Incline_Dumbbell_Press', 'Incline_Dumbbell_Bench_With_Palms_Facing_In', 'Push-Ups_With_Feet_Elevated'],
    bodyweight: ['Push-Ups_With_Feet_Elevated', 'Decline_Push-Up'],
    bands: ['Push-Ups_With_Feet_Elevated', 'Decline_Push-Up'],
  },
  vertical_push: {
    gym: ['Machine_Shoulder_Military_Press', 'Seated_Dumbbell_Press', 'Seated_Cable_Shoulder_Press', 'Standing_Palms-In_Dumbbell_Press', 'Standing_Military_Press'],
    dumbbells: ['Seated_Dumbbell_Press', 'Standing_Dumbbell_Press', 'Standing_Palms-In_Dumbbell_Press', 'Standing_Alternating_Dumbbell_Press', 'Arnold_Dumbbell_Press'],
    bodyweight: ['Decline_Push-Up', 'Push-Ups_With_Feet_Elevated'],
    bands: ['Shoulder_Press_-_With_Bands', 'Decline_Push-Up', 'Push-Ups_With_Feet_Elevated'],
  },
  horizontal_pull: {
    gym: ['Seated_Cable_Rows', 'Leverage_Iso_Row', 'Dumbbell_Incline_Row', 'One-Arm_Dumbbell_Row', 'T-Bar_Row_with_Handle', 'Bent_Over_Barbell_Row'],
    dumbbells: ['One-Arm_Dumbbell_Row', 'Dumbbell_Incline_Row', 'Bent_Over_Two-Dumbbell_Row_With_Palms_In', 'Bent_Over_Two-Dumbbell_Row', 'Inverted_Row'],
    bodyweight: ['Inverted_Row', 'One-Arm_Dumbbell_Row', 'Suspended_Row', 'Inverted_Row_with_Straps'],
    bands: ['Inverted_Row', 'One-Arm_Dumbbell_Row', 'Suspended_Row', 'Inverted_Row_with_Straps'],
  },
  vertical_pull: {
    gym: ['Wide-Grip_Lat_Pulldown', 'Close-Grip_Front_Lat_Pulldown', 'Underhand_Cable_Pulldowns', 'Band_Assisted_Pull-Up', 'Chin-Up', 'Pullups'],
    // No bar at home: pullovers are the closest lat-dominant option, the row is a fallback.
    dumbbells: ['Bent-Arm_Dumbbell_Pullover', 'Straight-Arm_Dumbbell_Pullover', 'One-Arm_Dumbbell_Row'],
    bodyweight: ['Suspended_Row', 'Inverted_Row_with_Straps', 'Inverted_Row'],
    bands: ['Suspended_Row', 'Inverted_Row_with_Straps', 'Inverted_Row'],
  },
  chest_fly: {
    gym: ['Butterfly', 'Cable_Crossover', 'Low_Cable_Crossover', 'Dumbbell_Flyes', 'Incline_Dumbbell_Flyes'],
    dumbbells: ['Dumbbell_Flyes', 'Incline_Dumbbell_Flyes', 'Isometric_Chest_Squeezes'],
    bodyweight: ['Push-Up_Wide', 'Isometric_Chest_Squeezes'],
    bands: ['Cross_Over_-_With_Bands', 'Isometric_Chest_Squeezes', 'Push-Up_Wide'],
  },
  lateral_raise: {
    gym: ['Side_Lateral_Raise', 'Seated_Side_Lateral_Raise', 'Standing_Low-Pulley_Deltoid_Raise', 'One-Arm_Side_Laterals', 'Dumbbell_Scaption'],
    dumbbells: ['Side_Lateral_Raise', 'Seated_Side_Lateral_Raise', 'One-Arm_Side_Laterals', 'Dumbbell_Scaption'],
    // Done with water bottles or a light bag (see cues).
    bodyweight: ['Side_Lateral_Raise', 'One-Arm_Side_Laterals'],
    bands: ['Lateral_Raise_-_With_Bands', 'One-Arm_Side_Laterals', 'Upright_Row_-_With_Bands'],
  },
  rear_delt: {
    gym: ['Reverse_Machine_Flyes', 'Face_Pull', 'Cable_Rear_Delt_Fly', 'Bent_Over_Dumbbell_Rear_Delt_Raise_With_Head_On_Bench', 'Reverse_Flyes'],
    dumbbells: ['Bent_Over_Dumbbell_Rear_Delt_Raise_With_Head_On_Bench', 'Reverse_Flyes', 'Seated_Bent-Over_Rear_Delt_Raise'],
    // Done with water bottles (see cues).
    bodyweight: ['Seated_Bent-Over_Rear_Delt_Raise', 'Bent_Over_Dumbbell_Rear_Delt_Raise_With_Head_On_Bench'],
    bands: ['Band_Pull_Apart', 'Back_Flyes_-_With_Bands', 'External_Rotation_with_Band', 'Seated_Bent-Over_Rear_Delt_Raise'],
  },
  biceps: {
    gym: ['Dumbbell_Bicep_Curl', 'Hammer_Curls', 'Standing_Biceps_Cable_Curl', 'Machine_Bicep_Curl', 'EZ-Bar_Curl', 'Barbell_Curl'],
    dumbbells: ['Dumbbell_Bicep_Curl', 'Hammer_Curls', 'Dumbbell_Alternate_Bicep_Curl', 'Concentration_Curls', 'Incline_Dumbbell_Curl'],
    // One-arm curls with a loaded backpack or a band under the foot (see cues).
    bodyweight: ['Concentration_Curls', 'Standing_Concentration_Curl'],
    bands: ['Concentration_Curls', 'Standing_Concentration_Curl'],
  },
  triceps: {
    gym: ['Triceps_Pushdown_-_Rope_Attachment', 'Triceps_Pushdown', 'Cable_Rope_Overhead_Triceps_Extension', 'Tricep_Dumbbell_Kickback', 'EZ-Bar_Skullcrusher', 'Close-Grip_Barbell_Bench_Press'],
    dumbbells: ['Seated_Triceps_Press', 'Tricep_Dumbbell_Kickback', 'Lying_Dumbbell_Tricep_Extension', 'Bench_Dips'],
    bodyweight: ['Incline_Push-Up_Close-Grip', 'Body_Tricep_Press', 'Bench_Dips', 'Push-Ups_-_Close_Triceps_Position'],
    bands: ['Speed_Band_Overhead_Triceps', 'Band_Skull_Crusher', 'Incline_Push-Up_Close-Grip', 'Body_Tricep_Press', 'Bench_Dips'],
  },
  quad_iso: {
    gym: ['Leg_Extensions', 'Single-Leg_Leg_Extension'],
    // No leg-extension machine at home: quad-dominant single-leg work instead.
    dumbbells: ['Dumbbell_Step_Ups', 'Step-up_with_Knee_Raise', 'Single-Leg_High_Box_Squat'],
    bodyweight: ['Step-up_with_Knee_Raise', 'Single-Leg_High_Box_Squat'],
    bands: ['Step-up_with_Knee_Raise', 'Hip_Flexion_with_Band', 'Single-Leg_High_Box_Squat'],
  },
  hamstring_curl: {
    gym: ['Seated_Leg_Curl', 'Lying_Leg_Curls', 'Standing_Leg_Curl', 'Ball_Leg_Curl', 'Glute_Ham_Raise'],
    dumbbells: ['Platform_Hamstring_Slides', 'Floor_Glute-Ham_Raise'],
    bodyweight: ['Platform_Hamstring_Slides', 'Floor_Glute-Ham_Raise'],
    bands: ['Seated_Band_Hamstring_Curl', 'Platform_Hamstring_Slides', 'Floor_Glute-Ham_Raise'],
  },
  calves: {
    gym: ['Standing_Calf_Raises', 'Seated_Calf_Raise', 'Calf_Press_On_The_Leg_Press_Machine', 'Smith_Machine_Calf_Raise', 'Standing_Dumbbell_Calf_Raise'],
    dumbbells: ['Standing_Dumbbell_Calf_Raise', 'Dumbbell_Seated_One-Leg_Calf_Raise'],
    bodyweight: ['Standing_Dumbbell_Calf_Raise', 'Dumbbell_Seated_One-Leg_Calf_Raise'],
    bands: ['Calf_Raises_-_With_Bands', 'Standing_Dumbbell_Calf_Raise'],
  },
  core_anti_extension: {
    gym: ['Plank', 'Dead_Bug', 'Exercise_Ball_Pull-In', 'Ab_Roller'],
    dumbbells: ['Plank', 'Dead_Bug', 'Butt-Ups', 'Spider_Crawl'],
    bodyweight: ['Plank', 'Dead_Bug', 'Butt-Ups', 'Spider_Crawl'],
    bands: ['Plank', 'Dead_Bug', 'Butt-Ups', 'Spider_Crawl'],
  },
  core_flexion: {
    gym: ['Crunches', 'Reverse_Crunch', 'Cable_Crunch', 'Knee_Hip_Raise_On_Parallel_Bars', 'Exercise_Ball_Crunch'],
    dumbbells: ['Crunches', 'Reverse_Crunch', 'Leg_Pull-In', 'Tuck_Crunch'],
    bodyweight: ['Crunches', 'Reverse_Crunch', 'Leg_Pull-In', 'Tuck_Crunch'],
    bands: ['Crunches', 'Reverse_Crunch', 'Leg_Pull-In', 'Tuck_Crunch'],
  },
  core_rotation: {
    gym: ['Pallof_Press', 'Standing_Cable_Wood_Chop', 'Standing_Cable_Lift', 'Side_Bridge', 'Air_Bike'],
    dumbbells: ['Side_Bridge', 'Air_Bike', 'Cross-Body_Crunch', 'Russian_Twist'],
    bodyweight: ['Side_Bridge', 'Air_Bike', 'Cross-Body_Crunch', 'Alternate_Heel_Touchers'],
    bands: ['Side_Bridge', 'Air_Bike', 'Cross-Body_Crunch', 'Alternate_Heel_Touchers'],
  },
  conditioning: {
    gym: ['Walking_Treadmill', 'Bicycling_Stationary', 'Elliptical_Trainer', 'Recumbent_Bike', 'Rowing_Stationary', 'Stairmaster'],
    dumbbells: ['Mountain_Climbers', 'Star_Jump', 'Fast_Skipping', 'Trail_Running_Walking'],
    bodyweight: ['Mountain_Climbers', 'Star_Jump', 'Fast_Skipping', 'Trail_Running_Walking'],
    bands: ['Mountain_Climbers', 'Star_Jump', 'Fast_Skipping', 'Trail_Running_Walking'],
  },
};

// ---------------------------------------------------------------------------
// Per-exercise coaching data
// ---------------------------------------------------------------------------

export const exerciseExtras: Record<string, ExerciseExtra> = { ...exerciseExtrasA, ...exerciseExtrasB };
