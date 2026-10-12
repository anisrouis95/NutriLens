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

export type LocalizedText = { en: string; fr: string };

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

const t = (en: string, fr: string): LocalizedText => ({ en, fr });

// ---------------------------------------------------------------------------
// Slot descriptions (plain language for a beginner)
// ---------------------------------------------------------------------------

export const slotInfo: Record<MovementSlot, SlotInfo> = {
  squat: {
    name: t("Squat", "Squat"),
    description: t(
      "Bending hips and knees to sit down and stand back up. Builds thighs and glutes.",
      "Plier hanches et genoux pour s'asseoir puis se relever. Muscle les cuisses et les fessiers.",
    ),
  },
  hinge: {
    name: t("Hip hinge", "Charnière de hanche"),
    description: t(
      "Pushing the hips back with a flat back, then standing tall. Trains hamstrings, glutes and lower back.",
      "Reculer les hanches dos plat, puis se redresser. Travaille l'arrière des cuisses, les fessiers et le bas du dos.",
    ),
  },
  lunge: {
    name: t("Lunge / single leg", "Fente / une jambe"),
    description: t(
      "One leg does most of the work at a time. Builds legs and balance, and evens out left-right differences.",
      "Une jambe travaille à la fois. Muscle les jambes, améliore l'équilibre et corrige les différences gauche-droite.",
    ),
  },
  glute_bridge: {
    name: t("Glute bridge", "Pont fessier"),
    description: t(
      "Lifting the hips while lying on your back. Targets the glutes with very little stress on the back.",
      "Monter les hanches allongé sur le dos. Cible les fessiers en ménageant le dos.",
    ),
  },
  horizontal_push: {
    name: t("Chest press", "Poussée horizontale"),
    description: t(
      "Pushing a weight (or yourself) away from your chest. Works chest, front shoulders and triceps.",
      "Pousser une charge (ou ton corps) devant la poitrine. Travaille pectoraux, avant des épaules et triceps.",
    ),
  },
  incline_push: {
    name: t("Incline press", "Poussée inclinée"),
    description: t(
      "Pushing upward at an angle, between a chest press and an overhead press. Emphasises the upper chest.",
      "Pousser vers le haut en diagonale, entre développé couché et développé épaules. Insiste sur le haut des pectoraux.",
    ),
  },
  vertical_push: {
    name: t("Overhead press", "Poussée verticale"),
    description: t(
      "Pushing a weight up over your head. Builds the shoulders and triceps.",
      "Pousser une charge au-dessus de la tête. Muscle les épaules et les triceps.",
    ),
  },
  horizontal_pull: {
    name: t("Row", "Tirage horizontal (rowing)"),
    description: t(
      "Pulling a weight toward your belly. Thickens the upper back and helps posture.",
      "Tirer une charge vers le ventre. Épaissit le haut du dos et améliore la posture.",
    ),
  },
  vertical_pull: {
    name: t("Vertical pull", "Tirage vertical"),
    description: t(
      "Pulling from above your head down toward your chest. Widens the back (lats) and works the biceps.",
      "Tirer du haut vers la poitrine. Élargit le dos (grands dorsaux) et travaille les biceps.",
    ),
  },
  chest_fly: {
    name: t("Chest fly", "Écarté pectoraux"),
    description: t(
      "A hugging motion with almost straight arms. Isolates the chest muscles.",
      "Un mouvement d'enlacement bras presque tendus. Isole les pectoraux.",
    ),
  },
  lateral_raise: {
    name: t("Lateral raise", "Élévation latérale"),
    description: t(
      "Raising the arms out to the sides. Builds the side of the shoulders for a wider look.",
      "Monter les bras sur les côtés. Développe le côté des épaules pour une carrure plus large.",
    ),
  },
  rear_delt: {
    name: t("Rear shoulders", "Arrière des épaules"),
    description: t(
      "Opening the arms backward. Strengthens the back of the shoulders and balances all the pushing.",
      "Ouvrir les bras vers l'arrière. Renforce l'arrière des épaules et équilibre les exercices de poussée.",
    ),
  },
  biceps: {
    name: t("Biceps curl", "Curl biceps"),
    description: t(
      "Bending the elbow against resistance. Builds the front of the upper arm.",
      "Plier le coude contre une résistance. Muscle l'avant du bras.",
    ),
  },
  triceps: {
    name: t("Triceps", "Triceps"),
    description: t(
      "Straightening the elbow against resistance. Builds the back of the arm, most of its size.",
      "Tendre le coude contre une résistance. Muscle l'arrière du bras, qui fait l'essentiel de son volume.",
    ),
  },
  quad_iso: {
    name: t("Quad focus", "Quadriceps (ciblé)"),
    description: t(
      "Extra work for the front of the thighs, mainly by straightening the knee.",
      "Travail en plus pour l'avant des cuisses, surtout en tendant le genou.",
    ),
  },
  hamstring_curl: {
    name: t("Hamstring curl", "Leg curl (ischios)"),
    description: t(
      "Bending the knee to bring the heel toward the glutes. Targets the back of the thighs.",
      "Plier le genou pour ramener le talon vers les fesses. Cible l'arrière des cuisses.",
    ),
  },
  calves: {
    name: t("Calves", "Mollets"),
    description: t(
      "Rising up onto your toes. Strengthens the calves and ankles.",
      "Monter sur la pointe des pieds. Renforce les mollets et les chevilles.",
    ),
  },
  core_anti_extension: {
    name: t("Core bracing", "Gainage"),
    description: t(
      "Keeping your trunk rigid so the lower back doesn't arch. Builds a strong core that protects your back.",
      "Garder le tronc rigide sans creuser le dos. Construit une sangle abdominale qui protège le dos.",
    ),
  },
  core_flexion: {
    name: t("Ab crunch", "Abdos (enroulement)"),
    description: t(
      "Curling the ribs and hips toward each other. Works the front abs (six-pack).",
      "Rapprocher les côtes et le bassin. Travaille les grands droits (les tablettes).",
    ),
  },
  core_rotation: {
    name: t("Obliques & rotation", "Obliques et rotation"),
    description: t(
      "Twisting, or resisting a twist or a side bend. Works the obliques on the sides of your waist.",
      "Tourner, ou résister à une rotation ou une inclinaison. Travaille les obliques sur les côtés de la taille.",
    ),
  },
  conditioning: {
    name: t("Cardio", "Cardio"),
    description: t(
      "Steady or interval effort that raises your heart rate. Improves fitness and recovery between sets.",
      "Effort continu ou fractionné qui fait monter le cœur. Améliore l'endurance et la récupération.",
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

export const exerciseExtras: Record<string, ExerciseExtra> = {
  // ----- Squat -----
  'Leg_Press': {
    nameFr: "Presse à cuisses",
    cues: [
      t("Feet shoulder-width in the middle of the platform.", "Pieds largeur d'épaules, au milieu du plateau."),
      t("Lower until knees reach about 90°, lower back stays on the pad.", "Descends jusqu'à environ 90°, le bas du dos reste collé au dossier."),
      t("Knees follow your toes, never cave inward.", "Les genoux suivent la pointe des pieds, jamais vers l'intérieur."),
      t("Press through your whole foot; don't lock the knees at the top.", "Pousse avec tout le pied, sans verrouiller les genoux en haut."),
    ],
    mistakes: [
      t("Going so deep that the hips curl up off the seat.", "Descendre si bas que le bassin décolle du siège."),
      t("Snapping the knees straight at the top.", "Verrouiller violemment les genoux en haut."),
      t("Pushing through the toes instead of the whole foot.", "Pousser sur les orteils au lieu de tout le pied."),
    ],
    difficulty: 1,
    repRange: [10, 15],
  },
  'Goblet_Squat': {
    nameFr: "Squat gobelet",
    cues: [
      t("Hug one dumbbell (or a loaded backpack) against your chest.", "Tiens un haltère (ou un sac à dos chargé) contre ta poitrine."),
      t("Sit down between your heels, chest proud, elbows inside knees.", "Descends entre tes talons, poitrine fière, coudes à l'intérieur des genoux."),
      t("Brace your stomach like someone is about to poke it.", "Gaine ton ventre comme si quelqu'un allait te le pousser."),
      t("Push the floor away through your whole foot to stand.", "Pousse le sol avec tout le pied pour remonter."),
    ],
    mistakes: [
      t("Heels lifting off the floor.", "Talons qui se soulèvent du sol."),
      t("Rounding the back at the bottom.", "Arrondir le dos en bas du mouvement."),
      t("Letting the weight drift away from the chest.", "Laisser le poids s'éloigner de la poitrine."),
    ],
    difficulty: 1,
    avoidIf: ['knees'],
    repRange: [8, 12],
  },
  'Dumbbell_Squat_To_A_Bench': {
    nameFr: "Squat sur banc avec haltères",
    cues: [
      t("Stand in front of a bench or chair, dumbbells at your sides.", "Place-toi devant un banc ou une chaise, haltères le long du corps."),
      t("Push hips back and sit down until you lightly touch the seat.", "Recule les fesses et descends jusqu'à effleurer le siège."),
      t("Keep chest up and knees in line with your toes.", "Garde la poitrine haute et les genoux dans l'axe des pieds."),
      t("Stand back up without rocking or bouncing off the bench.", "Remonte sans te balancer ni rebondir sur le banc."),
    ],
    mistakes: [
      t("Plopping down and fully relaxing on the seat.", "S'affaler et se relâcher complètement sur le siège."),
      t("Leaning far forward to get back up.", "Se pencher très en avant pour se relever."),
    ],
    difficulty: 1,
    repRange: [8, 12],
  },
  'Smith_Machine_Squat': {
    nameFr: "Squat à la Smith machine",
    cues: [
      t("Bar rests on your upper back muscles, not on your neck.", "La barre repose sur le haut du dos, pas sur la nuque."),
      t("Feet slightly in front of the bar, shoulder-width apart.", "Pieds légèrement devant la barre, écartés largeur d'épaules."),
      t("Brace, then sit down as if onto a chair.", "Gaine-toi, puis descends comme pour t'asseoir sur une chaise."),
      t("Set the safety stops just below your lowest point.", "Règle les sécurités juste sous ton point le plus bas."),
    ],
    mistakes: [
      t("Feet right under the bar, pushing knees far forward.", "Pieds sous la barre, ce qui pousse trop les genoux en avant."),
      t("Forgetting to rotate the hooks to lock the bar.", "Oublier de tourner les crochets pour bloquer la barre."),
    ],
    difficulty: 2,
    avoidIf: ['knees'],
    repRange: [8, 12],
  },
  'Hack_Squat': {
    nameFr: "Hack squat (machine)",
    cues: [
      t("Back and shoulders stay flat against the pads.", "Dos et épaules restent collés aux coussins."),
      t("Feet shoulder-width in the middle of the platform.", "Pieds largeur d'épaules, au milieu du plateau."),
      t("Lower slowly, push back up through the middle of your foot.", "Descends lentement, remonte en poussant avec le milieu du pied."),
    ],
    mistakes: [
      t("Bouncing out of the bottom position.", "Rebondir en bas du mouvement."),
      t("Heels lifting off the platform.", "Talons qui décollent du plateau."),
      t("Knees collapsing inward on the way up.", "Genoux qui rentrent vers l'intérieur en remontant."),
    ],
    difficulty: 2,
    avoidIf: ['knees'],
    repRange: [8, 12],
  },
  'Barbell_Squat': {
    nameFr: "Squat à la barre",
    cues: [
      t("Bar on upper back; squeeze shoulder blades to make a shelf.", "Barre sur le haut du dos, serre les omoplates pour faire un support."),
      t("Big breath and brace your stomach before each rep.", "Grande inspiration et ventre gainé avant chaque répétition."),
      t("Sit down between your heels, knees pushed out over toes.", "Descends entre tes talons, genoux poussés au-dessus des orteils."),
      t("Always squat inside a rack with the safety bars set.", "Squatte toujours dans une cage avec les sécurités réglées."),
    ],
    mistakes: [
      t("Rounding the lower back at the bottom.", "Arrondir le bas du dos en bas."),
      t("Knees caving in when standing up.", "Genoux qui rentrent en remontant."),
      t("Adding weight before the movement feels solid.", "Ajouter du poids avant que le geste soit solide."),
    ],
    difficulty: 3,
    avoidIf: ['knees', 'lower_back', 'shoulders'],
    repRange: [6, 10],
  },
  'Dumbbell_Squat': {
    nameFr: "Squat avec haltères",
    cues: [
      t("Dumbbells hang at your sides, arms long and relaxed.", "Les haltères pendent le long du corps, bras relâchés."),
      t("Feet shoulder-width, toes slightly turned out.", "Pieds largeur d'épaules, pointes légèrement vers l'extérieur."),
      t("Sit back and down, chest up, until thighs are near parallel.", "Descends en arrière, poitrine haute, cuisses presque parallèles au sol."),
      t("Push the floor away to stand tall.", "Pousse le sol pour te redresser complètement."),
    ],
    mistakes: [
      t("Looking down and rounding the back.", "Regarder le sol et arrondir le dos."),
      t("Dumbbells swinging or pulling you forward.", "Haltères qui se balancent ou te tirent vers l'avant."),
    ],
    difficulty: 1,
    avoidIf: ['knees'],
    repRange: [8, 12],
  },
  'Plie_Dumbbell_Squat': {
    nameFr: "Squat sumo avec haltère",
    cues: [
      t("Wide stance, toes out, one dumbbell hanging between your legs.", "Pieds écartés, pointes vers l'extérieur, un haltère entre les jambes."),
      t("Keep your torso upright as you lower straight down.", "Garde le buste droit en descendant à la verticale."),
      t("Push your knees out in the direction of your toes.", "Pousse les genoux dans la direction des orteils."),
      t("Squeeze your glutes as you stand up.", "Serre les fessiers en remontant."),
    ],
    mistakes: [
      t("Knees caving in toward each other.", "Genoux qui se rapprochent l'un de l'autre."),
      t("Leaning forward instead of staying upright.", "Se pencher en avant au lieu de rester droit."),
    ],
    difficulty: 1,
    avoidIf: ['knees'],
    repRange: [10, 15],
  },
  'Bodyweight_Squat': {
    nameFr: "Squat au poids du corps",
    cues: [
      t("Feet shoulder-width, arms forward for balance.", "Pieds largeur d'épaules, bras devant toi pour l'équilibre."),
      t("Sit back as if onto a chair, chest up.", "Recule les fesses comme pour t'asseoir, poitrine haute."),
      t("Knees track over your toes, heels stay down.", "Genoux au-dessus des orteils, talons au sol."),
      t("Sore knees? Squat down to a chair and stand back up.", "Genoux sensibles ? Descends jusqu'à une chaise puis remonte."),
    ],
    mistakes: [
      t("Heels rising off the floor.", "Talons qui se soulèvent."),
      t("Only bending the knees, not pushing the hips back.", "Plier seulement les genoux sans reculer les hanches."),
      t("Rushing reps and bouncing at the bottom.", "Enchaîner trop vite et rebondir en bas."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },
  'Freehand_Jump_Squat': {
    nameFr: "Squat sauté",
    cues: [
      t("Arms crossed, squat down, then jump straight up.", "Bras croisés, descends en squat, puis saute droit vers le haut."),
      t("Land softly on the balls of your feet, knees bent.", "Atterris en douceur sur l'avant du pied, genoux fléchis."),
      t("Reset your balance before the next jump.", "Retrouve ton équilibre avant le saut suivant."),
    ],
    mistakes: [
      t("Landing stiff-legged with a loud thud.", "Atterrir jambes raides avec un gros bruit."),
      t("Knees caving inward on landing.", "Genoux qui rentrent à l'atterrissage."),
    ],
    difficulty: 2,
    avoidIf: ['knees'],
    repRange: [8, 12],
  },
  'Squats_-_With_Bands': {
    nameFr: "Squat avec élastique",
    cues: [
      t("Stand on the band, handles held at shoulder height.", "Debout sur l'élastique, poignées à hauteur d'épaules."),
      t("Sit back and down, chest proud, elbows under hands.", "Descends en arrière, poitrine fière, coudes sous les mains."),
      t("Drive up hard; the band gets tougher near the top.", "Remonte fort : l'élastique résiste plus vers le haut."),
    ],
    mistakes: [
      t("Letting the band pull your shoulders forward.", "Laisser l'élastique t'enrouler les épaules vers l'avant."),
      t("Feet too close together, so the band slips.", "Pieds trop serrés, l'élastique glisse."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },

  // ----- Hinge -----
  'Stiff-Legged_Dumbbell_Deadlift': {
    nameFr: "Soulevé de terre jambes tendues aux haltères",
    cues: [
      t("Soft knees, then push your hips back like closing a door.", "Genoux souples, puis recule les hanches comme pour fermer une porte."),
      t("Weights slide close along your thighs and shins.", "Les poids glissent près des cuisses et des tibias."),
      t("Keep a flat back; stop when the back of your thighs stretches.", "Dos plat ; arrête quand l'arrière des cuisses s'étire."),
      t("No dumbbells? Hold a loaded backpack in front of you.", "Pas d'haltères ? Tiens un sac à dos chargé devant toi."),
    ],
    mistakes: [
      t("Rounding the back to reach lower.", "Arrondir le dos pour descendre plus bas."),
      t("Bending the knees a lot, turning it into a squat.", "Plier beaucoup les genoux, ça devient un squat."),
      t("Letting the weights drift away from the legs.", "Laisser les poids s'éloigner des jambes."),
    ],
    difficulty: 2,
    avoidIf: ['lower_back'],
    repRange: [8, 12],
  },
  'Pull_Through': {
    nameFr: "Pull-through à la poulie",
    cues: [
      t("Face away from a low pulley, rope between your legs.", "Dos à la poulie basse, corde entre les jambes."),
      t("Push hips back, arms long and relaxed.", "Recule les hanches, bras longs et relâchés."),
      t("Drive hips forward and squeeze your glutes to stand.", "Pousse les hanches vers l'avant et serre les fessiers pour te redresser."),
      t("Arms only hold the rope; the hips do the work.", "Les bras tiennent juste la corde, les hanches travaillent."),
    ],
    mistakes: [
      t("Pulling the rope up with the arms.", "Tirer la corde avec les bras."),
      t("Squatting down instead of hinging at the hips.", "S'accroupir au lieu de basculer depuis les hanches."),
      t("Leaning back at the top.", "Se pencher en arrière en haut."),
    ],
    difficulty: 1,
    repRange: [10, 15],
  },
  'Hyperextensions_Back_Extensions': {
    nameFr: "Extensions du dos (banc à 45°)",
    cues: [
      t("Pad just below your hip bones so you can bend freely.", "Coussin juste sous les hanches pour pouvoir te plier librement."),
      t("Lower with a flat back, then rise by squeezing your glutes.", "Descends dos plat, puis remonte en serrant les fessiers."),
      t("Stop when your body forms a straight line.", "Arrête quand ton corps forme une ligne droite."),
    ],
    mistakes: [
      t("Swinging up and over-arching at the top.", "Remonter avec élan et trop se cambrer en haut."),
      t("Pad set so high it blocks the hips.", "Coussin réglé si haut qu'il bloque les hanches."),
    ],
    difficulty: 1,
    avoidIf: ['lower_back'],
    repRange: [10, 15],
  },
  'Romanian_Deadlift': {
    nameFr: "Soulevé de terre roumain (barre)",
    cues: [
      t("Start standing, bar against your thighs, knees slightly bent.", "Pars debout, barre contre les cuisses, genoux légèrement fléchis."),
      t("Push hips back; the bar slides down your legs.", "Recule les hanches, la barre glisse le long des jambes."),
      t("Shoulders back and spine flat the whole time.", "Épaules en arrière et dos plat tout du long."),
      t("Drive hips forward to stand, squeezing your glutes.", "Pousse les hanches vers l'avant pour remonter, fessiers serrés."),
    ],
    mistakes: [
      t("Rounding the back once the bar passes the knees.", "Arrondir le dos quand la barre passe les genoux."),
      t("Bar drifting away from the legs.", "Barre qui s'éloigne des jambes."),
      t("Locking the knees completely straight.", "Verrouiller complètement les genoux."),
    ],
    difficulty: 3,
    avoidIf: ['lower_back'],
    repRange: [6, 10],
  },
  'Trap_Bar_Deadlift': {
    nameFr: "Soulevé de terre à la trap bar",
    cues: [
      t("Stand centered inside the bar, handles beside your ankles.", "Place-toi au centre de la barre, poignées à côté des chevilles."),
      t("Hips back, chest up, grip the handles hard.", "Hanches en arrière, poitrine haute, poignées bien serrées."),
      t("Brace, then push the floor away to stand.", "Gaine-toi, puis pousse le sol pour te relever."),
      t("Lower under control along the same path.", "Redescends en contrôle sur le même trajet."),
    ],
    mistakes: [
      t("Jerking the bar off the floor.", "Arracher la barre du sol d'un coup."),
      t("Rounding the back at the start.", "Arrondir le dos au départ."),
    ],
    difficulty: 2,
    avoidIf: ['lower_back'],
    repRange: [6, 10],
  },
  'Barbell_Deadlift': {
    nameFr: "Soulevé de terre classique (barre)",
    cues: [
      t("Bar over the middle of your foot, shins close to it.", "Barre au-dessus du milieu du pied, tibias proches de la barre."),
      t("Squeeze the bar and take the slack out before lifting.", "Serre la barre et mets-la en tension avant de tirer."),
      t("Push the floor away, bar dragging up your legs.", "Pousse le sol, la barre remonte en frôlant les jambes."),
      t("Stand tall at the top without leaning back.", "Redresse-toi en haut sans te pencher en arrière."),
    ],
    mistakes: [
      t("Rounded back during the lift.", "Dos arrondi pendant la levée."),
      t("Hips shooting up first, legs straightening too early.", "Hanches qui montent en premier, jambes tendues trop tôt."),
      t("Bar starting too far in front of the feet.", "Barre placée trop loin devant les pieds."),
    ],
    difficulty: 3,
    avoidIf: ['lower_back'],
    repRange: [5, 8],
  },
  'Kettlebell_One-Legged_Deadlift': {
    nameFr: "Soulevé de terre sur une jambe",
    cues: [
      t("Weight or backpack in one hand, stand on the same-side leg.", "Poids ou sac dans une main, debout sur la jambe du même côté."),
      t("Hinge forward as your free leg reaches straight back.", "Penche-toi en avant pendant que l'autre jambe recule tendue."),
      t("Keep hips square to the floor and back flat.", "Garde les hanches face au sol et le dos plat."),
      t("Lightly touch a wall for balance at first.", "Au début, touche un mur pour garder l'équilibre."),
    ],
    mistakes: [
      t("Opening the hip and twisting sideways.", "Ouvrir la hanche et pivoter sur le côté."),
      t("Bending the standing knee into a squat.", "Plier la jambe d'appui comme un squat."),
    ],
    difficulty: 2,
    repRange: [8, 12],
    unilateral: true,
  },
  'Superman': {
    nameFr: "Superman",
    cues: [
      t("Lie face down, arms stretched out in front.", "Allongé sur le ventre, bras tendus devant toi."),
      t("Lift arms, chest and legs a few centimetres, glutes squeezed.", "Soulève bras, buste et jambes de quelques centimètres, fessiers serrés."),
      t("Look at the floor to keep your neck long.", "Regarde le sol pour garder la nuque alignée."),
      t("Hold two seconds, then lower slowly.", "Tiens deux secondes, puis redescends lentement."),
    ],
    mistakes: [
      t("Yanking up high and crunching the lower back.", "Monter trop haut d'un coup en écrasant le bas du dos."),
      t("Throwing the head back.", "Rejeter la tête en arrière."),
    ],
    difficulty: 1,
    avoidIf: ['lower_back'],
    repRange: [10, 15],
  },
  'Band_Good_Morning': {
    nameFr: "Good morning avec élastique",
    cues: [
      t("Stand on the band, loop the other end behind your neck.", "Debout sur l'élastique, passe l'autre bout derrière la nuque."),
      t("Soft knees, push hips back with a flat back.", "Genoux souples, recule les hanches en gardant le dos plat."),
      t("Stand tall by driving your hips forward.", "Redresse-toi en poussant les hanches vers l'avant."),
    ],
    mistakes: [
      t("Rounding the back as you bend over.", "Arrondir le dos en te penchant."),
      t("Band sitting on the neck bones instead of the upper back.", "Élastique sur les os du cou au lieu du haut du dos."),
    ],
    difficulty: 1,
    avoidIf: ['lower_back'],
    repRange: [12, 20],
  },
  'Band_Good_Morning_Pull_Through': {
    nameFr: "Good morning élastique (pull-through)",
    cues: [
      t("Anchor the band to a post and step away until it's tight.", "Fixe l'élastique à un poteau et éloigne-toi jusqu'à ce qu'il soit tendu."),
      t("Hands keep the band in place across your upper back.", "Tes mains maintiennent l'élastique sur le haut du dos."),
      t("Push your butt back as far as possible, back flat.", "Recule les fesses le plus loin possible, dos plat."),
      t("Drive hips forward to stand, squeezing your glutes.", "Pousse les hanches vers l'avant pour te redresser, fessiers serrés."),
    ],
    mistakes: [
      t("Bending the knees too much.", "Trop plier les genoux."),
      t("Rounding the back near the bottom.", "Arrondir le dos en bas."),
    ],
    difficulty: 2,
    avoidIf: ['lower_back'],
    repRange: [12, 20],
  },
  'Hip_Extension_with_Bands': {
    nameFr: "Extension de hanche avec élastique",
    cues: [
      t("Band around one ankle, anchored low in front of you.", "Élastique autour d'une cheville, attaché en bas devant toi."),
      t("Hold a support, chest up, standing knee slightly bent.", "Tiens un appui, poitrine haute, jambe d'appui légèrement fléchie."),
      t("Push the leg straight back by squeezing your glute.", "Pousse la jambe tendue en arrière en serrant le fessier."),
      t("Return slowly, no swinging.", "Reviens lentement, sans élan."),
    ],
    mistakes: [
      t("Arching the lower back to lift the leg higher.", "Cambrer le bas du dos pour monter la jambe plus haut."),
      t("Leaning the torso far forward.", "Pencher fortement le buste en avant."),
    ],
    difficulty: 1,
    repRange: [12, 20],
    unilateral: true,
  },

  // ----- Lunge / single leg -----
  'Dumbbell_Rear_Lunge': {
    nameFr: "Fente arrière avec haltères",
    cues: [
      t("Take a big step back, torso tall.", "Fais un grand pas en arrière, buste droit."),
      t("Lower until the back knee nearly touches the floor.", "Descends jusqu'à ce que le genou arrière frôle le sol."),
      t("Push through the front heel to return.", "Pousse dans le talon avant pour revenir."),
      t("No dumbbells? Do it bodyweight or wear a backpack.", "Pas d'haltères ? Fais-le au poids du corps ou avec un sac à dos."),
    ],
    mistakes: [
      t("Front knee caving inward.", "Genou avant qui rentre vers l'intérieur."),
      t("Feet in one line like on a tightrope.", "Pieds alignés comme sur un fil."),
    ],
    difficulty: 2,
    avoidIf: ['knees'],
    repRange: [8, 12],
    unilateral: true,
  },
  'Dumbbell_Step_Ups': {
    nameFr: "Step-up avec haltères",
    cues: [
      t("Use a stable box or bench at knee height or lower.", "Utilise une box ou un banc stable, à hauteur de genou maximum."),
      t("Whole foot on the box, push through that heel.", "Pied entier sur la box, pousse dans ce talon."),
      t("Stand tall at the top, then step down slowly.", "Redresse-toi en haut, puis redescends lentement."),
    ],
    mistakes: [
      t("Pushing off the bottom foot to cheat.", "Pousser avec le pied au sol pour tricher."),
      t("Box so high your hip sinks below your knee.", "Box si haute que la hanche passe sous le genou."),
    ],
    difficulty: 2,
    avoidIf: ['knees'],
    repRange: [8, 12],
    unilateral: true,
  },
  'Dumbbell_Lunges': {
    nameFr: "Fentes avant avec haltères",
    cues: [
      t("Step forward, then drop the back knee straight down.", "Avance d'un pas, puis descends le genou arrière à la verticale."),
      t("Feet hip-width apart, like standing on train tracks.", "Pieds écartés largeur de hanches, comme sur des rails."),
      t("Push through the front foot to step back.", "Pousse avec le pied avant pour revenir."),
    ],
    mistakes: [
      t("Front heel lifting off the floor.", "Talon avant qui se soulève."),
      t("Torso leaning far forward.", "Buste trop penché en avant."),
    ],
    difficulty: 2,
    avoidIf: ['knees'],
    repRange: [8, 12],
    unilateral: true,
  },
  'Smith_Single-Leg_Split_Squat': {
    nameFr: "Fente bulgare à la Smith machine",
    cues: [
      t("Bar on upper back, back foot resting on a bench behind you.", "Barre sur le haut du dos, pied arrière posé sur un banc."),
      t("Front foot far enough that the knee stays over the foot.", "Pied avant assez loin pour que le genou reste au-dessus du pied."),
      t("Lower straight down, push up through the front heel.", "Descends à la verticale, remonte en poussant le talon avant."),
    ],
    mistakes: [
      t("Front foot too close to the bench.", "Pied avant trop près du banc."),
      t("Pushing with the back leg.", "Pousser avec la jambe arrière."),
    ],
    difficulty: 2,
    avoidIf: ['knees'],
    repRange: [8, 12],
    unilateral: true,
  },
  'Split_Squat_with_Dumbbells': {
    nameFr: "Fente bulgare avec haltères",
    cues: [
      t("Rear foot laces-down on a bench or chair behind you.", "Pied arrière posé, lacets vers le bas, sur un banc ou une chaise."),
      t("Drop the back knee straight down, torso tall.", "Descends le genou arrière à la verticale, buste droit."),
      t("Front knee follows your toes.", "Le genou avant suit la pointe du pied."),
      t("Start bodyweight; add dumbbells or a backpack later.", "Commence au poids du corps, ajoute haltères ou sac à dos ensuite."),
    ],
    mistakes: [
      t("Hopping the front foot around to find balance.", "Sautiller avec le pied avant pour trouver l'équilibre."),
      t("Rear support so high it strains the back hip.", "Support arrière si haut qu'il tire sur la hanche arrière."),
    ],
    difficulty: 2,
    avoidIf: ['knees'],
    repRange: [8, 12],
    unilateral: true,
  },
  'Step-up_with_Knee_Raise': {
    nameFr: "Step-up avec montée de genou",
    cues: [
      t("Use a low, stable step; knee height or lower.", "Utilise une marche basse et stable, hauteur de genou maximum."),
      t("Push through the heel on the step to stand up.", "Pousse dans le talon posé sur la marche pour monter."),
      t("Drive the other knee up to hip height, then step down.", "Monte l'autre genou à hauteur de hanche, puis redescends."),
      t("Knees sensitive? Use an even lower step.", "Genoux sensibles ? Prends une marche encore plus basse."),
    ],
    mistakes: [
      t("Springing off the bottom foot.", "Prendre de l'élan avec le pied au sol."),
      t("Knee caving in as you step up.", "Genou qui rentre en montant."),
    ],
    difficulty: 1,
    repRange: [10, 15],
    unilateral: true,
  },
  'Bodyweight_Walking_Lunge': {
    nameFr: "Fentes marchées au poids du corps",
    cues: [
      t("Hands on hips, take a long step forward.", "Mains sur les hanches, fais un grand pas en avant."),
      t("Lower until the back knee almost touches the floor.", "Descends jusqu'à ce que le genou arrière frôle le sol."),
      t("Drive through the front heel and step into the next lunge.", "Pousse dans le talon avant et enchaîne la fente suivante."),
    ],
    mistakes: [
      t("Steps too short, so the front heel lifts.", "Pas trop courts, le talon avant décolle."),
      t("Wobbling side to side.", "Tanguer de gauche à droite."),
    ],
    difficulty: 1,
    avoidIf: ['knees'],
    repRange: [8, 12],
    unilateral: true,
  },

  // ----- Glute bridge -----
  'Barbell_Glute_Bridge': {
    nameFr: "Pont fessier avec barre",
    cues: [
      t("Roll the bar over your hips; use a pad or towel.", "Fais rouler la barre sur les hanches, avec un coussin ou une serviette."),
      t("Feet flat, knees bent, heels close to your butt.", "Pieds à plat, genoux pliés, talons proches des fesses."),
      t("Drive through your heels, squeeze glutes hard at the top.", "Pousse dans les talons, serre fort les fessiers en haut."),
      t("Ribs down: lift with the hips, not by arching.", "Côtes basses : monte avec les hanches, pas en cambrant."),
    ],
    mistakes: [
      t("Over-arching the lower back at the top.", "Trop cambrer le bas du dos en haut."),
      t("Pushing through the toes so the thighs take over.", "Pousser sur les orteils, les cuisses prennent le relais."),
    ],
    difficulty: 2,
    repRange: [8, 12],
  },
  'Barbell_Hip_Thrust': {
    nameFr: "Hip thrust avec barre",
    cues: [
      t("Upper back on a bench edge, padded bar over your hips.", "Haut du dos sur le bord d'un banc, barre protégée sur les hanches."),
      t("Shins vertical at the top, chin slightly tucked.", "Tibias verticaux en haut, menton légèrement rentré."),
      t("Drive hips up until your body is flat like a table.", "Monte les hanches jusqu'à former une table."),
      t("Pause one second and squeeze your glutes.", "Marque une seconde en haut en serrant les fessiers."),
    ],
    mistakes: [
      t("Arching the lower back instead of extending the hips.", "Cambrer le bas du dos au lieu d'ouvrir les hanches."),
      t("Feet too far away, so the hamstrings cramp.", "Pieds trop loin, l'arrière des cuisses crampe."),
      t("Bench sliding during the set.", "Banc qui glisse pendant la série."),
    ],
    difficulty: 2,
    repRange: [8, 12],
  },
  'Butt_Lift_Bridge': {
    nameFr: "Pont fessier",
    cues: [
      t("Lie on your back, knees bent, feet flat hip-width apart.", "Sur le dos, genoux pliés, pieds à plat largeur de hanches."),
      t("Push through your heels to lift your hips.", "Pousse dans tes talons pour monter les hanches."),
      t("Squeeze your glutes for one second at the top.", "Serre les fessiers une seconde en haut."),
      t("Want more? Rest a dumbbell or backpack on your hips.", "Envie de plus ? Pose un haltère ou un sac sur tes hanches."),
    ],
    mistakes: [
      t("Arching the back instead of using the glutes.", "Cambrer le dos au lieu d'utiliser les fessiers."),
      t("Dropping down fast without control.", "Redescendre vite sans contrôle."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },
  'Single_Leg_Glute_Bridge': {
    nameFr: "Pont fessier sur une jambe",
    cues: [
      t("One foot flat, other knee pulled toward your chest.", "Un pied au sol, l'autre genou ramené vers la poitrine."),
      t("Push through the planted heel to raise your hips.", "Pousse dans le talon au sol pour monter les hanches."),
      t("Keep hips level; don't let one side drop.", "Garde le bassin à l'horizontale, sans pencher d'un côté."),
    ],
    mistakes: [
      t("Hips twisting or tilting.", "Bassin qui tourne ou penche."),
      t("Pushing through the toes.", "Pousser sur les orteils."),
    ],
    difficulty: 1,
    repRange: [10, 15],
    unilateral: true,
  },
  'Thigh_Abductor': {
    nameFr: "Machine à abducteurs",
    cues: [
      t("Sit tall, pads on the outside of your knees.", "Assieds-toi droit, coussins à l'extérieur des genoux."),
      t("Push your legs apart smoothly, pause, return slowly.", "Écarte les jambes sans à-coup, pause, reviens lentement."),
      t("Lean slightly forward to feel your glutes more.", "Penche-toi un peu en avant pour mieux sentir les fessiers."),
    ],
    mistakes: [
      t("Letting the weight stack slam back.", "Laisser les poids retomber brutalement."),
      t("Short, fast reps with momentum.", "Répétitions courtes et rapides avec élan."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },
  'One-Legged_Cable_Kickback': {
    nameFr: "Kickback fessier à la poulie",
    cues: [
      t("Ankle strap on, face the machine, hold the frame.", "Sangle à la cheville, face à la machine, tiens le cadre."),
      t("Kick the leg back and slightly up using your glute.", "Pousse la jambe en arrière et un peu vers le haut avec le fessier."),
      t("Keep abs tight so your back doesn't arch.", "Garde le ventre serré pour ne pas cambrer."),
    ],
    mistakes: [
      t("Swinging the leg with momentum.", "Balancer la jambe avec élan."),
      t("Arching the lower back at the end.", "Cambrer le bas du dos en fin de mouvement."),
    ],
    difficulty: 1,
    repRange: [12, 15],
    unilateral: true,
  },
  'Glute_Kickback': {
    nameFr: "Kickback fessier à quatre pattes",
    cues: [
      t("On all fours, hands under shoulders, knees under hips.", "À quatre pattes, mains sous les épaules, genoux sous les hanches."),
      t("Keep the knee bent and press the heel toward the ceiling.", "Garde le genou plié et pousse le talon vers le plafond."),
      t("Stop when your thigh lines up with your back.", "Arrête quand la cuisse est alignée avec le dos."),
      t("Wrists sore? Rest on your forearms instead.", "Poignets sensibles ? Appuie-toi sur les avant-bras."),
    ],
    mistakes: [
      t("Arching the back to kick higher.", "Cambrer le dos pour monter plus haut."),
      t("Rotating the hip open to the side.", "Ouvrir la hanche sur le côté."),
    ],
    difficulty: 1,
    repRange: [12, 20],
    unilateral: true,
  },
  'Hip_Lift_with_Band': {
    nameFr: "Pont fessier avec élastique",
    cues: [
      t("Band across your hips, ends pinned by your hands or heavy objects.", "Élastique sur les hanches, bouts tenus par les mains ou des objets lourds."),
      t("Feet flat, push through your heels into the band.", "Pieds à plat, pousse dans les talons contre l'élastique."),
      t("Squeeze glutes at the top, then lower slowly.", "Serre les fessiers en haut, puis redescends lentement."),
    ],
    mistakes: [
      t("Arching the back instead of lifting the hips.", "Cambrer le dos au lieu de monter les hanches."),
      t("Band slipping off the hips.", "Élastique qui glisse des hanches."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },
  'Monster_Walk': {
    nameFr: "Marche du monstre (élastique)",
    cues: [
      t("Band around knees or ankles, slight squat position.", "Élastique aux genoux ou aux chevilles, en demi-squat."),
      t("Take small steps while keeping tension on the band.", "Fais de petits pas en gardant l'élastique tendu."),
      t("Push knees out; never let your feet come together.", "Pousse les genoux vers l'extérieur, ne rapproche jamais les pieds."),
    ],
    mistakes: [
      t("Standing up straight and losing tension.", "Se redresser complètement et perdre la tension."),
      t("Waddling with the upper body.", "Se dandiner avec le haut du corps."),
    ],
    difficulty: 1,
    repRange: [10, 15],
    unilateral: true,
  },

  // ----- Horizontal push -----
  'Machine_Bench_Press': {
    nameFr: "Développé couché à la machine",
    cues: [
      t("Adjust the seat so handles line up with mid-chest.", "Règle le siège pour que les poignées soient à mi-poitrine."),
      t("Shoulder blades pinched back against the pad.", "Omoplates serrées contre le dossier."),
      t("Push the handles forward without locking elbows hard.", "Pousse les poignées devant sans verrouiller les coudes."),
      t("Return slowly until you feel a chest stretch.", "Reviens lentement jusqu'à sentir l'étirement des pectoraux."),
    ],
    mistakes: [
      t("Shoulders rolling forward off the pad.", "Épaules qui décollent du dossier vers l'avant."),
      t("Seat set too low or too high.", "Siège réglé trop bas ou trop haut."),
    ],
    difficulty: 1,
    repRange: [8, 12],
  },
  'Dumbbell_Bench_Press': {
    nameFr: "Développé couché aux haltères",
    cues: [
      t("Kick the dumbbells up from your knees as you lie back.", "Monte les haltères avec les genoux en t'allongeant."),
      t("Shoulder blades squeezed together, feet flat on the floor.", "Omoplates serrées, pieds à plat au sol."),
      t("Lower to chest level, elbows about 45° from your body.", "Descends au niveau de la poitrine, coudes à environ 45° du corps."),
      t("Press up and slightly together.", "Pousse vers le haut en rapprochant légèrement les haltères."),
    ],
    mistakes: [
      t("Elbows flared straight out to the sides.", "Coudes écartés à angle droit du corps."),
      t("Bouncing the weights at the bottom.", "Rebondir en bas du mouvement."),
      t("Dropping the dumbbells carelessly at the end.", "Lâcher les haltères n'importe comment à la fin."),
    ],
    difficulty: 2,
    repRange: [8, 12],
  },
  'Cable_Chest_Press': {
    nameFr: "Développé pectoraux à la poulie assis",
    cues: [
      t("Sit tall with the handles at chest height.", "Assieds-toi droit, poignées à hauteur de poitrine."),
      t("Press forward and together, squeezing your chest.", "Pousse devant toi en rapprochant les mains, pectoraux serrés."),
      t("Keep shoulder blades back throughout.", "Garde les omoplates en arrière tout du long."),
    ],
    mistakes: [
      t("Shoulders shrugging up toward the ears.", "Épaules qui montent vers les oreilles."),
      t("Letting the handles pull the arms back too far.", "Laisser les poignées tirer les bras trop en arrière."),
    ],
    difficulty: 1,
    repRange: [8, 12],
  },
  'Dumbbell_Bench_Press_with_Neutral_Grip': {
    nameFr: "Développé couché haltères prise neutre",
    cues: [
      t("Palms face each other the whole time.", "Paumes face à face pendant tout le mouvement."),
      t("Elbows stay close, about 30° from your body.", "Coudes près du corps, environ 30°."),
      t("Lower to chest level, then press straight up.", "Descends au niveau de la poitrine, puis pousse vers le haut."),
    ],
    mistakes: [
      t("Banging the dumbbells together at the top.", "Entrechoquer les haltères en haut."),
      t("Arching the back off the bench.", "Décoller le dos du banc en se cambrant."),
    ],
    difficulty: 2,
    repRange: [8, 12],
  },
  'Barbell_Bench_Press_-_Medium_Grip': {
    nameFr: "Développé couché à la barre",
    cues: [
      t("Eyes under the bar, grip just wider than shoulders.", "Yeux sous la barre, mains un peu plus larges que les épaules."),
      t("Squeeze shoulder blades and plant your feet before unracking.", "Serre les omoplates et ancre les pieds avant de décrocher."),
      t("Lower to the bottom of your chest, elbows about 45°.", "Descends vers le bas des pectoraux, coudes à environ 45°."),
      t("Always use safety bars or a spotter.", "Utilise toujours des sécurités ou un partenaire."),
    ],
    mistakes: [
      t("Bouncing the bar off the chest.", "Faire rebondir la barre sur la poitrine."),
      t("Butt lifting off the bench.", "Fesses qui décollent du banc."),
      t("Wrists bent far back under the bar.", "Poignets trop cassés en arrière sous la barre."),
    ],
    difficulty: 3,
    avoidIf: ['shoulders'],
    repRange: [6, 10],
  },
  'Pushups': {
    nameFr: "Pompes",
    cues: [
      t("Hands under shoulders, body straight from head to heels.", "Mains sous les épaules, corps droit de la tête aux talons."),
      t("Brace your stomach and squeeze glutes so hips don't sag.", "Gaine le ventre et serre les fessiers pour ne pas creuser."),
      t("Lower your chest to a fist's height, elbows angled back.", "Descends la poitrine à un poing du sol, coudes vers l'arrière."),
      t("Wrists hurt? Use fists or push-up handles.", "Mal aux poignets ? Fais-les sur les poings ou des poignées."),
    ],
    mistakes: [
      t("Hips sagging toward the floor.", "Hanches qui s'affaissent vers le sol."),
      t("Elbows flared straight out.", "Coudes écartés à angle droit."),
      t("Half reps where only the head dips.", "Demi-répétitions où seule la tête descend."),
    ],
    difficulty: 2,
    avoidIf: ['wrists'],
    repRange: [6, 15],
  },
  'Dumbbell_Floor_Press': {
    nameFr: "Développé au sol avec haltères",
    cues: [
      t("Lie on the floor, knees bent, dumbbells over your chest.", "Allongé au sol, genoux pliés, haltères au-dessus de la poitrine."),
      t("Lower until your upper arms gently touch the floor.", "Descends jusqu'à ce que les bras touchent doucement le sol."),
      t("Pause, then press up without bouncing.", "Marque une pause, puis pousse sans rebondir."),
    ],
    mistakes: [
      t("Slamming the elbows into the floor.", "Taper les coudes contre le sol."),
      t("Elbows flared wide.", "Coudes trop écartés."),
    ],
    difficulty: 1,
    repRange: [8, 12],
  },
  'Incline_Push-Up': {
    nameFr: "Pompes inclinées (mains surélevées)",
    cues: [
      t("Hands on a sturdy table, counter or bench edge.", "Mains sur une table solide, un plan de travail ou un banc."),
      t("Walk your feet back, body straight like a plank.", "Recule les pieds, corps gainé comme une planche."),
      t("Lower your chest to the edge, then push away.", "Descends la poitrine vers le bord, puis repousse."),
      t("Wrists sore? Grip the edge to keep them straight.", "Poignets sensibles ? Agrippe le bord pour les garder droits."),
    ],
    mistakes: [
      t("Using a table that can slide or tip.", "Utiliser une table qui glisse ou bascule."),
      t("Hips sticking up or sagging.", "Fesses trop hautes ou hanches qui s'affaissent."),
    ],
    difficulty: 1,
    repRange: [8, 15],
  },
  'Isometric_Wipers': {
    nameFr: "Pompes essuie-glace",
    cues: [
      t("Start in a wide push-up position.", "Pars en position de pompe, mains larges."),
      t("Shift your body toward one hand, bending that elbow.", "Décale ton corps vers une main en pliant ce coude."),
      t("Push back to center, then go to the other side.", "Reviens au centre, puis pars de l'autre côté."),
    ],
    mistakes: [
      t("Hips sagging during the shift.", "Hanches qui s'affaissent pendant le transfert."),
      t("Moving too fast with no control.", "Aller trop vite sans contrôle."),
    ],
    difficulty: 3,
    avoidIf: ['wrists', 'shoulders'],
    repRange: [5, 10],
    unilateral: true,
  },
  'Bench_Press_-_With_Bands': {
    nameFr: "Développé couché avec élastique",
    cues: [
      t("Band under the bench, or behind your back on the floor.", "Élastique sous le banc, ou derrière ton dos au sol."),
      t("Press the handles up from chest level, palms forward.", "Pousse les poignées depuis la poitrine, paumes vers l'avant."),
      t("Lower slowly until elbows reach 90°.", "Redescends lentement jusqu'à 90° aux coudes."),
    ],
    mistakes: [
      t("Band slipping because it isn't secured.", "Élastique mal fixé qui glisse."),
      t("Letting the band snap your arms down.", "Laisser l'élastique ramener les bras d'un coup."),
    ],
    difficulty: 1,
    repRange: [10, 15],
  },

  // ----- Incline push -----
  'Leverage_Incline_Chest_Press': {
    nameFr: "Développé incliné à la machine",
    cues: [
      t("Set the seat so handles start near your upper chest.", "Règle le siège pour que les poignées partent du haut des pectoraux."),
      t("Chest up, shoulder blades back on the pad.", "Poitrine sortie, omoplates contre le dossier."),
      t("Press up and forward; return just short of the stops.", "Pousse vers le haut et l'avant, reviens sans reposer la charge."),
    ],
    mistakes: [
      t("Shoulders rolling forward at the top.", "Épaules qui s'enroulent en haut."),
      t("Letting the weight crash down between reps.", "Laisser retomber la charge entre les répétitions."),
    ],
    difficulty: 1,
    repRange: [8, 12],
  },
  'Incline_Dumbbell_Press': {
    nameFr: "Développé incliné aux haltères",
    cues: [
      t("Bench at about 30°, not steeper.", "Banc incliné à environ 30°, pas plus."),
      t("Dumbbells start at upper chest, elbows slightly tucked.", "Haltères au haut de la poitrine, coudes légèrement rentrés."),
      t("Press up over your upper chest, not over your face.", "Pousse au-dessus du haut de la poitrine, pas du visage."),
    ],
    mistakes: [
      t("Bench too steep, turning it into a shoulder press.", "Banc trop redressé, ça devient un développé épaules."),
      t("Arching the back to lift more.", "Se cambrer pour soulever plus."),
    ],
    difficulty: 2,
    repRange: [8, 12],
  },
  'Incline_Cable_Chest_Press': {
    nameFr: "Développé incliné à la poulie",
    cues: [
      t("Sit tall, handles starting at upper chest height.", "Assis bien droit, poignées au niveau du haut des pectoraux."),
      t("Press up and together on a slight upward angle.", "Pousse en rapprochant les mains, légèrement vers le haut."),
      t("Control the return and keep shoulders down.", "Contrôle le retour, épaules basses."),
    ],
    mistakes: [
      t("Shrugging the shoulders up.", "Hausser les épaules."),
      t("Rushing the lowering phase.", "Bâcler la phase de descente."),
    ],
    difficulty: 1,
    repRange: [8, 12],
  },
  'Incline_Dumbbell_Bench_With_Palms_Facing_In': {
    nameFr: "Développé incliné haltères prise neutre",
    cues: [
      t("Bench at about 30°, palms facing each other.", "Banc à environ 30°, paumes face à face."),
      t("Elbows close to your body as you lower.", "Coudes près du corps en descendant."),
      t("Press straight up over your upper chest.", "Pousse à la verticale au-dessus du haut des pectoraux."),
    ],
    mistakes: [
      t("Flaring the elbows and losing the neutral grip.", "Écarter les coudes et perdre la prise neutre."),
      t("Lowering too fast.", "Descendre trop vite."),
    ],
    difficulty: 2,
    repRange: [8, 12],
  },
  'Smith_Machine_Incline_Bench_Press': {
    nameFr: "Développé incliné à la Smith machine",
    cues: [
      t("Bench at 30°, positioned so the bar meets your upper chest.", "Banc à 30°, placé pour que la barre arrive au haut des pectoraux."),
      t("Grip slightly wider than shoulders, wrists straight.", "Mains un peu plus larges que les épaules, poignets droits."),
      t("Set the safety stops just above your chest.", "Règle les sécurités juste au-dessus de ta poitrine."),
    ],
    mistakes: [
      t("Bench placed so the bar comes down toward the neck.", "Banc mal placé, la barre descend vers le cou."),
      t("Elbows flared out at 90°.", "Coudes écartés à 90°."),
    ],
    difficulty: 2,
    avoidIf: ['shoulders'],
    repRange: [8, 12],
  },
  'Barbell_Incline_Bench_Press_-_Medium_Grip': {
    nameFr: "Développé incliné à la barre",
    cues: [
      t("Bench at about 30°, eyes under the bar.", "Banc à environ 30°, yeux sous la barre."),
      t("Shoulder blades squeezed, feet planted.", "Omoplates serrées, pieds bien ancrés."),
      t("Lower to your upper chest, press back up in a straight line.", "Descends au haut des pectoraux, remonte en ligne droite."),
      t("Use safety bars or a spotter.", "Utilise des sécurités ou un partenaire."),
    ],
    mistakes: [
      t("Bouncing the bar off the chest.", "Faire rebondir la barre sur la poitrine."),
      t("Lifting the hips off the bench.", "Décoller les fesses du banc."),
    ],
    difficulty: 3,
    avoidIf: ['shoulders'],
    repRange: [6, 10],
  },
  'Push-Ups_With_Feet_Elevated': {
    nameFr: "Pompes pieds surélevés",
    cues: [
      t("Feet on a chair or bench, hands on the floor.", "Pieds sur une chaise ou un banc, mains au sol."),
      t("Keep a straight line from head to heels.", "Garde une ligne droite de la tête aux talons."),
      t("Lower your upper chest toward the floor, then push up.", "Descends le haut de la poitrine vers le sol, puis pousse."),
      t("Higher feet make it harder; start low.", "Plus les pieds sont hauts, plus c'est dur : commence bas."),
    ],
    mistakes: [
      t("Hips piking up or sagging.", "Fesses qui montent ou hanches qui s'affaissent."),
      t("Head dropping before the chest.", "La tête qui descend avant la poitrine."),
    ],
    difficulty: 2,
    avoidIf: ['wrists'],
    repRange: [6, 12],
  },
  'Decline_Push-Up': {
    nameFr: "Pompes déclinées",
    cues: [
      t("Feet on a box or bench, hands wider than shoulders.", "Pieds sur une box ou un banc, mains plus larges que les épaules."),
      t("Brace your core so your body stays in one line.", "Gaine le tronc pour garder le corps aligné."),
      t("Lower until your nose nearly touches the floor.", "Descends jusqu'à ce que le nez frôle le sol."),
      t("Wrists hurt? Use fists or push-up handles.", "Mal aux poignets ? Utilise les poings ou des poignées."),
    ],
    mistakes: [
      t("Lower back sagging.", "Bas du dos qui se creuse."),
      t("Partial reps.", "Répétitions incomplètes."),
    ],
    difficulty: 2,
    avoidIf: ['wrists'],
    repRange: [6, 12],
  },

  // ----- Vertical push -----
  'Machine_Shoulder_Military_Press': {
    nameFr: "Développé épaules à la machine",
    cues: [
      t("Set the seat so handles start at shoulder level.", "Règle le siège pour que les poignées partent des épaules."),
      t("Back flat against the pad, stomach braced.", "Dos collé au dossier, ventre gainé."),
      t("Press up without shrugging, lower with control.", "Pousse sans hausser les épaules, redescends en contrôle."),
    ],
    mistakes: [
      t("Arching the back off the pad.", "Décoller le dos en se cambrant."),
      t("Locking out with a jerk.", "Verrouiller les bras d'un coup sec."),
    ],
    difficulty: 1,
    repRange: [8, 12],
  },
  'Seated_Dumbbell_Press': {
    nameFr: "Développé épaules assis aux haltères",
    cues: [
      t("Bench upright; kick the dumbbells up from your thighs.", "Banc droit, monte les haltères avec l'aide des cuisses."),
      t("Start at ear level, elbows slightly in front of you.", "Pars à hauteur des oreilles, coudes un peu devant toi."),
      t("Press up until arms are straight, without clanking.", "Pousse jusqu'à bras tendus, sans entrechoquer."),
      t("Keep ribs down; don't lean back.", "Côtes basses, ne te penche pas en arrière."),
    ],
    mistakes: [
      t("Arching the lower back to push.", "Cambrer le bas du dos pour pousser."),
      t("Lowering only halfway.", "Ne redescendre qu'à moitié."),
    ],
    difficulty: 2,
    repRange: [8, 12],
  },
  'Seated_Cable_Shoulder_Press': {
    nameFr: "Développé épaules à la poulie assis",
    cues: [
      t("Sit tall, handles beside your shoulders, elbows at 90°.", "Assis droit, poignées près des épaules, coudes à 90°."),
      t("Press up and slightly together.", "Pousse vers le haut en rapprochant légèrement les mains."),
      t("Lower slowly back to shoulder height.", "Redescends lentement à hauteur d'épaules."),
    ],
    mistakes: [
      t("Shrugging the shoulders to the ears.", "Hausser les épaules vers les oreilles."),
      t("Leaning back to finish the rep.", "Se pencher en arrière pour finir la répétition."),
    ],
    difficulty: 1,
    repRange: [8, 12],
  },
  'Standing_Palms-In_Dumbbell_Press': {
    nameFr: "Développé épaules debout prise neutre",
    cues: [
      t("Palms face each other, elbows pointing forward.", "Paumes face à face, coudes vers l'avant."),
      t("Squeeze glutes and abs to stay stacked.", "Serre fessiers et abdos pour rester bien aligné."),
      t("Press straight up, finishing with biceps near your ears.", "Pousse à la verticale, biceps près des oreilles en haut."),
    ],
    mistakes: [
      t("Leaning back as the set gets hard.", "Se pencher en arrière quand ça devient dur."),
      t("Using the legs to bounce the weight.", "Utiliser les jambes pour donner de l'élan."),
    ],
    difficulty: 2,
    repRange: [8, 12],
  },
  'Standing_Military_Press': {
    nameFr: "Développé militaire debout (barre)",
    cues: [
      t("Bar on your front shoulders, grip just outside them.", "Barre sur l'avant des épaules, mains juste à l'extérieur."),
      t("Squeeze glutes and brace so you don't lean back.", "Serre fessiers et abdos pour ne pas te cambrer."),
      t("Tilt your head back slightly, press the bar straight up.", "Recule un peu la tête, pousse la barre à la verticale."),
      t("Finish with the bar over the middle of your feet.", "Termine avec la barre au-dessus du milieu des pieds."),
    ],
    mistakes: [
      t("Over-arching the lower back.", "Trop cambrer le bas du dos."),
      t("Pushing the bar out in front of the body.", "Pousser la barre trop en avant du corps."),
    ],
    difficulty: 3,
    avoidIf: ['shoulders', 'lower_back'],
    repRange: [6, 10],
  },
  'Standing_Dumbbell_Press': {
    nameFr: "Développé épaules debout aux haltères",
    cues: [
      t("Dumbbells at head height, elbows out at about 90°.", "Haltères à hauteur de tête, coudes écartés à environ 90°."),
      t("Brace your stomach and squeeze your glutes.", "Gaine le ventre et serre les fessiers."),
      t("Press up without leaning back or using your legs.", "Pousse sans te pencher en arrière ni utiliser les jambes."),
    ],
    mistakes: [
      t("Bending the knees to bounce the weights up.", "Plier les genoux pour faire rebondir les poids."),
      t("Lowering only to forehead height.", "Redescendre seulement au niveau du front."),
    ],
    difficulty: 2,
    repRange: [8, 12],
  },
  'Standing_Alternating_Dumbbell_Press': {
    nameFr: "Développé épaules alterné debout",
    cues: [
      t("Both dumbbells at your shoulders, palms forward.", "Deux haltères aux épaules, paumes vers l'avant."),
      t("Press one arm up while the other stays still.", "Pousse un bras pendant que l'autre reste immobile."),
      t("Don't lean sideways; keep your torso stacked.", "Ne penche pas sur le côté, garde le buste aligné."),
    ],
    mistakes: [
      t("Leaning away from the pressing arm.", "Se pencher à l'opposé du bras qui pousse."),
      t("Letting the resting arm drift down.", "Laisser le bras au repos descendre."),
    ],
    difficulty: 1,
    repRange: [8, 12],
    unilateral: true,
  },
  'Arnold_Dumbbell_Press': {
    nameFr: "Développé Arnold",
    cues: [
      t("Start with palms facing you at chin height.", "Pars paumes vers toi, à hauteur du menton."),
      t("Rotate palms forward as you press up.", "Tourne les paumes vers l'avant en poussant."),
      t("Reverse the rotation slowly on the way down.", "Inverse la rotation lentement en redescendant."),
    ],
    mistakes: [
      t("Rushing the rotation with momentum.", "Faire la rotation trop vite avec élan."),
      t("Arching the back to finish.", "Se cambrer pour finir."),
    ],
    difficulty: 2,
    avoidIf: ['shoulders'],
    repRange: [8, 12],
  },
  'Shoulder_Press_-_With_Bands': {
    nameFr: "Développé épaules avec élastique",
    cues: [
      t("Stand on the band, handles at shoulder height.", "Debout sur l'élastique, poignées à hauteur d'épaules."),
      t("Squeeze glutes and abs, press straight up.", "Serre fessiers et abdos, pousse à la verticale."),
      t("Lower slowly; don't let the band pull you down.", "Redescends lentement, ne te laisse pas tirer par l'élastique."),
    ],
    mistakes: [
      t("Leaning back as you press.", "Se pencher en arrière en poussant."),
      t("Feet too narrow, so the band rolls.", "Pieds trop serrés, l'élastique roule."),
    ],
    difficulty: 1,
    repRange: [10, 15],
  },

  // ----- Horizontal pull -----
  'Seated_Cable_Rows': {
    nameFr: "Tirage horizontal assis à la poulie",
    cues: [
      t("Sit tall, knees soft, chest up.", "Assis droit, genoux souples, poitrine haute."),
      t("Pull the handle to your belly, elbows close to your sides.", "Tire la poignée vers le nombril, coudes près du corps."),
      t("Squeeze your shoulder blades, then return slowly.", "Serre les omoplates, puis reviens lentement."),
    ],
    mistakes: [
      t("Rocking the torso back and forth.", "Balancer le buste d'avant en arrière."),
      t("Shrugging the shoulders up.", "Hausser les épaules."),
      t("Rounding the back on the return.", "Arrondir le dos au retour."),
    ],
    difficulty: 1,
    repRange: [8, 12],
  },
  'Leverage_Iso_Row': {
    nameFr: "Rowing à la machine",
    cues: [
      t("Adjust the seat so handles are at chest level.", "Règle le siège pour avoir les poignées à hauteur de poitrine."),
      t("Chest on the pad, pull your elbows straight back.", "Poitrine contre le coussin, tire les coudes vers l'arrière."),
      t("Pause and squeeze your shoulder blades.", "Marque une pause en serrant les omoplates."),
    ],
    mistakes: [
      t("Pulling with the hands instead of the elbows.", "Tirer avec les mains au lieu des coudes."),
      t("Leaning back off the chest pad.", "Décoller la poitrine du coussin."),
    ],
    difficulty: 1,
    repRange: [8, 12],
  },
  'Dumbbell_Incline_Row': {
    nameFr: "Rowing haltères sur banc incliné",
    cues: [
      t("Lie chest-down on an incline bench, arms hanging.", "Allongé poitrine contre un banc incliné, bras pendants."),
      t("Row the dumbbells to your sides, palms facing in.", "Tire les haltères vers tes flancs, paumes vers l'intérieur."),
      t("Keep your chest glued to the pad.", "Garde la poitrine collée au banc."),
    ],
    mistakes: [
      t("Lifting the chest off the bench to cheat.", "Décoller la poitrine pour tricher."),
      t("Shrugging instead of rowing.", "Hausser les épaules au lieu de tirer."),
    ],
    difficulty: 1,
    repRange: [8, 12],
  },
  'One-Arm_Dumbbell_Row': {
    nameFr: "Rowing unilatéral avec haltère",
    cues: [
      t("One hand and one knee on a bench, back flat.", "Une main et un genou sur un banc, dos plat."),
      t("Pull the weight toward your hip, not your shoulder.", "Tire le poids vers ta hanche, pas vers l'épaule."),
      t("Lower until your arm is straight and the shoulder stretches.", "Redescends bras tendu en laissant l'épaule s'étirer."),
      t("No dumbbell? Row a loaded backpack.", "Pas d'haltère ? Tire un sac à dos chargé."),
    ],
    mistakes: [
      t("Twisting the torso to heave the weight up.", "Tourner le buste pour arracher le poids."),
      t("Rounding the back.", "Arrondir le dos."),
    ],
    difficulty: 1,
    repRange: [8, 12],
    unilateral: true,
  },
  'T-Bar_Row_with_Handle': {
    nameFr: "Rowing T-bar",
    cues: [
      t("Straddle the bar and hinge forward with a flat back.", "Jambes de chaque côté de la barre, penché en avant, dos plat."),
      t("Pull the handle to your lower chest.", "Tire la poignée vers le bas de la poitrine."),
      t("Keep the same torso angle throughout.", "Garde le même angle de buste tout du long."),
    ],
    mistakes: [
      t("Standing up as you pull.", "Se redresser en tirant."),
      t("Rounding the back under load.", "Arrondir le dos sous la charge."),
    ],
    difficulty: 2,
    avoidIf: ['lower_back'],
    repRange: [6, 10],
  },
  'Bent_Over_Barbell_Row': {
    nameFr: "Rowing barre buste penché",
    cues: [
      t("Hinge until your torso is near 45°, back flat.", "Penche-toi à environ 45°, dos plat."),
      t("Pull the bar to your belly button.", "Tire la barre vers le nombril."),
      t("Elbows go back, shoulder blades squeeze.", "Les coudes partent en arrière, les omoplates se serrent."),
      t("Lower under control and stay braced.", "Redescends en contrôle en restant gainé."),
    ],
    mistakes: [
      t("Jerking the bar up with the hips.", "Donner un coup de hanches pour monter la barre."),
      t("Rounding the lower back.", "Arrondir le bas du dos."),
    ],
    difficulty: 3,
    avoidIf: ['lower_back'],
    repRange: [6, 10],
  },
  'Bent_Over_Two-Dumbbell_Row_With_Palms_In': {
    nameFr: "Rowing haltères buste penché prise neutre",
    cues: [
      t("Hinge forward, back flat, palms facing each other.", "Penche-toi, dos plat, paumes face à face."),
      t("Row both dumbbells toward your hips.", "Tire les deux haltères vers les hanches."),
      t("Keep your neck neutral, eyes on the floor.", "Garde la nuque neutre, regard vers le sol."),
    ],
    mistakes: [
      t("Standing up a little more each rep.", "Se redresser un peu plus à chaque répétition."),
      t("Rounding the back.", "Arrondir le dos."),
    ],
    difficulty: 2,
    avoidIf: ['lower_back'],
    repRange: [8, 12],
  },
  'Bent_Over_Two-Dumbbell_Row': {
    nameFr: "Rowing haltères buste penché",
    cues: [
      t("Hinge forward with soft knees and a flat back.", "Penche-toi genoux souples, dos plat."),
      t("Pull elbows back, dumbbells toward your lower ribs.", "Tire les coudes en arrière, haltères vers les côtes basses."),
      t("Squeeze your shoulder blades at the top.", "Serre les omoplates en haut."),
    ],
    mistakes: [
      t("Jerking the weights with the body.", "Donner des à-coups avec le corps."),
      t("Rounding the lower back.", "Arrondir le bas du dos."),
    ],
    difficulty: 2,
    avoidIf: ['lower_back'],
    repRange: [8, 12],
  },
  'Inverted_Row': {
    nameFr: "Rowing inversé (sous une table)",
    cues: [
      t("Lie under a sturdy table or low bar and grip the edge.", "Allonge-toi sous une table solide ou une barre basse, saisis le bord."),
      t("Body straight, heels on the floor.", "Corps droit, talons au sol."),
      t("Pull your chest up to your hands, squeeze shoulder blades.", "Tire ta poitrine vers tes mains, serre les omoplates."),
      t("Too hard? Bend your knees.", "Trop dur ? Plie les genoux."),
    ],
    mistakes: [
      t("Using a table that can tip over.", "Utiliser une table qui peut basculer."),
      t("Hips sagging toward the floor.", "Hanches qui tombent vers le sol."),
    ],
    difficulty: 2,
    repRange: [6, 12],
  },
  'Suspended_Row': {
    nameFr: "Rowing avec sangles",
    cues: [
      t("Use straps, or a towel looped around a sturdy pole.", "Utilise des sangles, ou une serviette autour d'un poteau solide."),
      t("Lean back with straight arms, body in one line.", "Penche-toi en arrière bras tendus, corps aligné."),
      t("Pull your chest to your hands, elbows close.", "Tire ta poitrine vers tes mains, coudes près du corps."),
      t("Walk your feet forward to make it harder.", "Avance les pieds pour rendre l'exercice plus dur."),
    ],
    mistakes: [
      t("Hips dropping back.", "Fesses qui partent en arrière."),
      t("Trusting an anchor that isn't solid.", "Faire confiance à un point d'ancrage peu solide."),
    ],
    difficulty: 1,
    repRange: [8, 15],
  },
  'Inverted_Row_with_Straps': {
    nameFr: "Rowing inversé avec sangles",
    cues: [
      t("Hang straps or a rope from a solid anchor.", "Accroche des sangles ou une corde à un point solide."),
      t("Lie back underneath, arms straight, heels down.", "Allonge-toi dessous, bras tendus, talons au sol."),
      t("Pull your chest to your hands, then lower slowly.", "Tire ta poitrine vers tes mains, puis redescends lentement."),
    ],
    mistakes: [
      t("Letting the hips sag.", "Laisser les hanches s'affaisser."),
      t("Shrugging the shoulders toward the ears.", "Hausser les épaules vers les oreilles."),
    ],
    difficulty: 2,
    repRange: [6, 12],
  },

  // ----- Vertical pull -----
  'Wide-Grip_Lat_Pulldown': {
    nameFr: "Tirage vertical prise large",
    cues: [
      t("Thighs locked under the pads, grip wider than shoulders.", "Cuisses bloquées sous les boudins, mains plus larges que les épaules."),
      t("Lean back slightly and pull the bar to your upper chest.", "Penche-toi un peu en arrière, tire la barre vers le haut de la poitrine."),
      t("Think: drive your elbows into your back pockets.", "Imagine envoyer tes coudes dans tes poches arrière."),
      t("Let the bar rise slowly until your arms are straight.", "Laisse remonter la barre lentement jusqu'à bras tendus."),
    ],
    mistakes: [
      t("Swinging back to yank the weight down.", "Se balancer en arrière pour arracher le poids."),
      t("Pulling the bar behind the neck.", "Tirer la barre derrière la nuque."),
    ],
    difficulty: 1,
    repRange: [8, 12],
  },
  'Close-Grip_Front_Lat_Pulldown': {
    nameFr: "Tirage vertical prise serrée",
    cues: [
      t("Hands about shoulder-width, knees under the pads.", "Mains environ largeur d'épaules, genoux sous les boudins."),
      t("Chest up, pull the bar to your collarbone.", "Poitrine sortie, tire la barre vers les clavicules."),
      t("Squeeze your back at the bottom, return slowly.", "Serre le dos en bas, remonte lentement."),
    ],
    mistakes: [
      t("Using arms and momentum instead of the back.", "Tirer avec les bras et l'élan au lieu du dos."),
      t("Shrugging at the top.", "Hausser les épaules en haut."),
    ],
    difficulty: 1,
    repRange: [8, 12],
  },
  'Underhand_Cable_Pulldowns': {
    nameFr: "Tirage vertical prise supination",
    cues: [
      t("Palms facing you, hands shoulder-width.", "Paumes vers toi, mains largeur d'épaules."),
      t("Pull the bar to your upper chest, elbows down and back.", "Tire la barre vers le haut de la poitrine, coudes vers le bas."),
      t("Keep your torso steady with a slight lean back.", "Buste stable, légèrement incliné en arrière."),
    ],
    mistakes: [
      t("Leaning way back so it becomes a row.", "Se pencher très en arrière, ça devient un rowing."),
      t("Not straightening the arms at the top.", "Ne pas tendre les bras en haut."),
    ],
    difficulty: 1,
    repRange: [8, 12],
  },
  'Band_Assisted_Pull-Up': {
    nameFr: "Traction assistée avec élastique",
    cues: [
      t("Loop a band over the bar, knee or foot in the loop.", "Passe un élastique sur la barre, genou ou pied dans la boucle."),
      t("Start from straight arms, shoulders pulled down.", "Pars bras tendus, épaules abaissées."),
      t("Pull your chest toward the bar until your chin clears it.", "Tire ta poitrine vers la barre jusqu'à passer le menton."),
      t("Switch to a lighter band as you get stronger.", "Prends un élastique plus léger en progressant."),
    ],
    mistakes: [
      t("Kicking and swinging to get up.", "Donner des coups de jambes pour monter."),
      t("Half reps without straightening the arms.", "Demi-répétitions sans tendre les bras."),
    ],
    difficulty: 2,
    avoidIf: ['shoulders'],
    repRange: [5, 10],
  },
  'Chin-Up': {
    nameFr: "Traction en supination (chin-up)",
    cues: [
      t("Palms facing you, hands shoulder-width.", "Paumes vers toi, mains largeur d'épaules."),
      t("Start from a dead hang with your stomach braced.", "Pars suspendu bras tendus, ventre gainé."),
      t("Pull until your chin clears the bar.", "Tire jusqu'à passer le menton au-dessus de la barre."),
      t("Lower slowly, about three seconds down.", "Redescends lentement, en trois secondes environ."),
    ],
    mistakes: [
      t("Kipping or swinging the legs.", "Prendre de l'élan avec les jambes."),
      t("Craning the neck to reach the bar.", "Tendre le cou pour atteindre la barre."),
    ],
    difficulty: 3,
    avoidIf: ['shoulders'],
    repRange: [3, 8],
  },
  'Pullups': {
    nameFr: "Tractions",
    cues: [
      t("Grip just wider than shoulders, palms facing away.", "Mains un peu plus larges que les épaules, paumes vers l'avant."),
      t("Pull your shoulders down first, then elbows to your ribs.", "Abaisse d'abord les épaules, puis tire les coudes vers les côtes."),
      t("Chin over the bar, then lower all the way down.", "Menton au-dessus de la barre, puis redescends complètement."),
    ],
    mistakes: [
      t("Swinging to get the chin over.", "Se balancer pour passer le menton."),
      t("Stopping halfway on the way down.", "S'arrêter à mi-chemin en descendant."),
    ],
    difficulty: 3,
    avoidIf: ['shoulders'],
    repRange: [3, 8],
  },
  'Bent-Arm_Dumbbell_Pullover': {
    nameFr: "Pull-over haltère bras fléchis",
    cues: [
      t("Upper back across a bench, hips low, feet flat.", "Haut du dos en travers du banc, hanches basses, pieds à plat."),
      t("Hold one dumbbell over your chest, elbows slightly bent.", "Tiens un haltère au-dessus de la poitrine, coudes un peu fléchis."),
      t("Lower it behind your head until your back stretches.", "Descends-le derrière la tête jusqu'à sentir le dos s'étirer."),
      t("Pull it back over your chest using your back.", "Ramène-le au-dessus de la poitrine avec le dos."),
    ],
    mistakes: [
      t("Going too deep and straining the shoulders.", "Descendre trop loin et forcer sur les épaules."),
      t("Hips rising during the rep.", "Hanches qui remontent pendant le mouvement."),
    ],
    difficulty: 2,
    avoidIf: ['shoulders'],
    repRange: [10, 15],
  },
  'Straight-Arm_Dumbbell_Pullover': {
    nameFr: "Pull-over haltère bras tendus",
    cues: [
      t("Lie across a bench with a dumbbell held over your chest.", "En travers d'un banc, haltère au-dessus de la poitrine."),
      t("Arms nearly straight, lower in an arc behind your head.", "Bras presque tendus, descends en arc derrière la tête."),
      t("Stop at a comfortable stretch, then pull back up.", "Arrête à un étirement confortable, puis remonte."),
    ],
    mistakes: [
      t("Bending the elbows a lot, turning it into a triceps move.", "Plier beaucoup les coudes, ça devient un exercice de triceps."),
      t("Using a weight that's too heavy.", "Prendre un poids trop lourd."),
    ],
    difficulty: 2,
    avoidIf: ['shoulders'],
    repRange: [10, 15],
  },

  // ----- Chest fly -----
  'Butterfly': {
    nameFr: "Pec deck (butterfly)",
    cues: [
      t("Set the seat so your arms are parallel to the floor.", "Règle le siège pour avoir les bras parallèles au sol."),
      t("Back flat on the pad, slight bend in the elbows.", "Dos collé au dossier, coudes légèrement fléchis."),
      t("Bring the handles together, squeezing your chest.", "Rapproche les poignées en serrant les pectoraux."),
      t("Open slowly and stop at a comfortable stretch.", "Ouvre lentement et arrête à un étirement confortable."),
    ],
    mistakes: [
      t("Letting the arms fly back too far.", "Laisser les bras partir trop loin en arrière."),
      t("Shoulders rolling forward.", "Épaules qui s'enroulent vers l'avant."),
    ],
    difficulty: 1,
    repRange: [10, 15],
  },
  'Cable_Crossover': {
    nameFr: "Écarté à la poulie vis-à-vis",
    cues: [
      t("Pulleys high, step forward into a split stance.", "Poulies en haut, avance d'un pas en position fendue."),
      t("Slight elbow bend, as if hugging a big tree.", "Coudes légèrement fléchis, comme pour enlacer un gros arbre."),
      t("Bring your hands together below your chest and squeeze.", "Rapproche les mains sous la poitrine et serre."),
    ],
    mistakes: [
      t("Bending the elbows into a pressing motion.", "Plier les coudes et pousser comme un développé."),
      t("Leaning too far forward.", "Se pencher trop en avant."),
    ],
    difficulty: 2,
    repRange: [10, 15],
  },
  'Low_Cable_Crossover': {
    nameFr: "Écarté poulie basse",
    cues: [
      t("Pulleys low, palms forward, arms down by your sides.", "Poulies en bas, paumes vers l'avant, bras le long du corps."),
      t("Sweep your hands up and together to upper-chest height.", "Remonte les mains en les rapprochant jusqu'au haut des pectoraux."),
      t("Keep your elbows soft and fixed.", "Garde les coudes souples et fixes."),
    ],
    mistakes: [
      t("Shrugging as the hands rise.", "Hausser les épaules quand les mains montent."),
      t("Swinging with the body.", "Se balancer avec le corps."),
    ],
    difficulty: 1,
    repRange: [10, 15],
  },
  'Dumbbell_Flyes': {
    nameFr: "Écarté couché aux haltères",
    cues: [
      t("Lie on a flat bench, dumbbells over your chest, palms in.", "Allongé sur un banc plat, haltères au-dessus, paumes face à face."),
      t("Slight elbow bend, open your arms wide in an arc.", "Coudes légèrement fléchis, ouvre les bras en arc."),
      t("Stop when your elbows reach about bench level.", "Arrête quand les coudes arrivent au niveau du banc."),
      t("Squeeze back up like hugging a barrel.", "Remonte comme si tu enlaçais un tonneau."),
    ],
    mistakes: [
      t("Going too heavy and turning it into a press.", "Prendre trop lourd et transformer en développé."),
      t("Dropping the arms too low.", "Descendre les bras trop bas."),
    ],
    difficulty: 2,
    avoidIf: ['shoulders'],
    repRange: [10, 15],
  },
  'Incline_Dumbbell_Flyes': {
    nameFr: "Écarté incliné aux haltères",
    cues: [
      t("Bench at about 30°, dumbbells over your upper chest.", "Banc à environ 30°, haltères au-dessus du haut des pectoraux."),
      t("Open your arms in a wide arc, elbows soft.", "Ouvre les bras en grand arc, coudes souples."),
      t("Bring them back together without clanking.", "Rapproche-les sans les entrechoquer."),
    ],
    mistakes: [
      t("Lowering until the shoulders feel pinched.", "Descendre jusqu'à sentir les épaules pincer."),
      t("Turning it into a press.", "Le transformer en développé."),
    ],
    difficulty: 2,
    avoidIf: ['shoulders'],
    repRange: [10, 15],
  },
  'Isometric_Chest_Squeezes': {
    nameFr: "Contraction isométrique des pectoraux",
    cues: [
      t("Press your palms together in front of your chest.", "Presse les paumes l'une contre l'autre devant la poitrine."),
      t("Elbows bent at 90°, push hard and feel your chest tighten.", "Coudes à 90°, pousse fort et sens tes pectoraux se contracter."),
      t("Keep breathing; don't hold your breath.", "Continue de respirer, ne bloque pas ton souffle."),
    ],
    mistakes: [
      t("Holding your breath.", "Bloquer la respiration."),
      t("Shrugging the shoulders up.", "Hausser les épaules."),
    ],
    difficulty: 1,
    repRange: [10, 20],
    timed: true,
  },
  'Push-Up_Wide': {
    nameFr: "Pompes mains écartées",
    cues: [
      t("Hands wider than shoulders, fingers pointing forward.", "Mains plus écartées que les épaules, doigts vers l'avant."),
      t("Lower your chest down between your hands.", "Descends la poitrine entre tes mains."),
      t("Keep your body rigid like a plank.", "Garde le corps rigide comme une planche."),
      t("Too hard? Put your hands on a table.", "Trop dur ? Pose les mains sur une table."),
    ],
    mistakes: [
      t("Hands so wide that the shoulders pinch.", "Mains si écartées que les épaules pincent."),
      t("Hips sagging.", "Hanches qui s'affaissent."),
    ],
    difficulty: 2,
    avoidIf: ['wrists', 'shoulders'],
    repRange: [8, 15],
  },
  'Cross_Over_-_With_Bands': {
    nameFr: "Écarté avec élastique",
    cues: [
      t("Anchor the band behind you at chest height.", "Fixe l'élastique derrière toi à hauteur de poitrine."),
      t("Arms out in a T, elbows slightly bent.", "Bras en T, coudes légèrement fléchis."),
      t("Bring your hands together in front and squeeze your chest.", "Rapproche les mains devant toi et serre les pectoraux."),
    ],
    mistakes: [
      t("Bending the elbows into a press.", "Plier les coudes comme un développé."),
      t("Letting the band yank your arms back.", "Laisser l'élastique tirer les bras en arrière."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },

  // ----- Lateral raise -----
  'Side_Lateral_Raise': {
    nameFr: "Élévations latérales",
    cues: [
      t("Light dumbbells at your sides, slight bend in the elbows.", "Haltères légers le long du corps, coudes un peu fléchis."),
      t("Raise your arms out to shoulder height, like pouring water.", "Monte les bras sur les côtés jusqu'aux épaules, comme pour verser de l'eau."),
      t("Lead with the elbows; shoulders stay down.", "Les coudes mènent, les épaules restent basses."),
      t("No dumbbells? Use full water bottles.", "Pas d'haltères ? Utilise des bouteilles d'eau pleines."),
    ],
    mistakes: [
      t("Swinging the body to lift heavier weights.", "Se balancer pour soulever plus lourd."),
      t("Shrugging the shoulders up to the ears.", "Hausser les épaules vers les oreilles."),
      t("Raising the arms above shoulder height.", "Monter les bras au-dessus des épaules."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },
  'Seated_Side_Lateral_Raise': {
    nameFr: "Élévations latérales assis",
    cues: [
      t("Sit at the end of a bench, feet flat, back tall.", "Assis au bout d'un banc, pieds à plat, dos droit."),
      t("Raise the dumbbells out to the sides up to shoulder height.", "Monte les haltères sur les côtés jusqu'aux épaules."),
      t("Lower slowly; don't let them rest at the bottom.", "Redescends lentement sans poser les poids en bas."),
    ],
    mistakes: [
      t("Leaning back to cheat.", "Se pencher en arrière pour tricher."),
      t("Going too heavy.", "Prendre trop lourd."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },
  'Standing_Low-Pulley_Deltoid_Raise': {
    nameFr: "Élévation latérale à la poulie basse",
    cues: [
      t("Stand side-on to a low pulley, handle in your far hand.", "De profil à la poulie basse, poignée dans la main opposée."),
      t("Raise the arm across and out to shoulder height.", "Monte le bras en diagonale jusqu'à hauteur d'épaule."),
      t("Hold the machine with your free hand for balance.", "Tiens la machine avec la main libre pour l'équilibre."),
    ],
    mistakes: [
      t("Leaning away to yank the cable.", "Se pencher pour arracher le câble."),
      t("Shrugging the working shoulder.", "Hausser l'épaule qui travaille."),
    ],
    difficulty: 1,
    repRange: [12, 20],
    unilateral: true,
  },
  'One-Arm_Side_Laterals': {
    nameFr: "Élévation latérale unilatérale",
    cues: [
      t("Hold a sturdy support with your free hand.", "Tiens un appui solide avec la main libre."),
      t("Raise the weight out to shoulder height, elbow soft.", "Monte le poids sur le côté jusqu'à l'épaule, coude souple."),
      t("No dumbbell? Use a water bottle or a light bag.", "Pas d'haltère ? Prends une bouteille d'eau ou un sac léger."),
    ],
    mistakes: [
      t("Swinging the torso.", "Balancer le buste."),
      t("Lifting by shrugging the shoulder.", "Monter en haussant l'épaule."),
    ],
    difficulty: 1,
    repRange: [12, 20],
    unilateral: true,
  },
  'Dumbbell_Scaption': {
    nameFr: "Élévation en Y aux haltères (scaption)",
    cues: [
      t("Thumbs up, arms slightly in front of your body.", "Pouces vers le haut, bras légèrement devant toi."),
      t("Raise your arms in a shallow V up to shoulder height.", "Monte les bras en V jusqu'à hauteur d'épaules."),
      t("Use light weights and move slowly.", "Prends des poids légers et bouge lentement."),
    ],
    mistakes: [
      t("Shrugging the shoulders.", "Hausser les épaules."),
      t("Using weights that are too heavy.", "Utiliser des poids trop lourds."),
    ],
    difficulty: 1,
    repRange: [12, 15],
  },
  'Lateral_Raise_-_With_Bands': {
    nameFr: "Élévations latérales avec élastique",
    cues: [
      t("Stand on the band, handles at your sides.", "Debout sur l'élastique, poignées le long du corps."),
      t("Raise your arms out to shoulder height, elbows soft.", "Monte les bras sur les côtés jusqu'aux épaules, coudes souples."),
      t("Lower slowly while resisting the band.", "Redescends lentement en résistant à l'élastique."),
    ],
    mistakes: [
      t("Shrugging as the band gets tight.", "Hausser les épaules quand l'élastique se tend."),
      t("Leaning to one side.", "Se pencher sur le côté."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },
  'Upright_Row_-_With_Bands': {
    nameFr: "Tirage menton avec élastique",
    cues: [
      t("Stand on the band, hands slightly narrower than shoulders.", "Debout sur l'élastique, mains un peu plus serrées que les épaules."),
      t("Lead with the elbows, pull to lower-chest height.", "Les coudes mènent, tire jusqu'au bas de la poitrine."),
      t("Stop before your elbows go above your shoulders.", "Arrête avant que les coudes dépassent les épaules."),
    ],
    mistakes: [
      t("Pulling the hands up to the chin and pinching the shoulders.", "Monter les mains au menton en pinçant les épaules."),
      t("Bending the wrists sharply.", "Casser fortement les poignets."),
    ],
    difficulty: 1,
    avoidIf: ['shoulders', 'wrists'],
    repRange: [12, 15],
  },

  // ----- Rear delts -----
  'Reverse_Machine_Flyes': {
    nameFr: "Oiseau à la machine (reverse pec deck)",
    cues: [
      t("Face the pad, handles at shoulder height.", "Face au dossier, poignées à hauteur d'épaules."),
      t("Sweep your arms out and back in a wide arc.", "Ouvre les bras vers l'arrière en grand arc."),
      t("Keep shoulders down and pause at the back.", "Épaules basses, marque une pause en arrière."),
    ],
    mistakes: [
      t("Pinching the shoulder blades so hard it becomes a row.", "Trop serrer les omoplates, ça devient un tirage."),
      t("Using momentum.", "Utiliser l'élan."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },
  'Face_Pull': {
    nameFr: "Face pull à la poulie",
    cues: [
      t("Rope on a high pulley, at face height or above.", "Corde sur une poulie haute, à hauteur du visage ou plus."),
      t("Pull the rope toward your eyes, hands splitting apart.", "Tire la corde vers les yeux en écartant les mains."),
      t("Finish like a double-biceps pose, elbows high.", "Finis comme une pose double biceps, coudes hauts."),
    ],
    mistakes: [
      t("Leaning back and pulling with bodyweight.", "Se pencher en arrière et tirer avec le poids du corps."),
      t("Elbows dropping into a low row.", "Coudes qui descendent comme un rowing."),
    ],
    difficulty: 2,
    repRange: [12, 15],
  },
  'Cable_Rear_Delt_Fly': {
    nameFr: "Oiseau à la poulie haute",
    cues: [
      t("Cross the cables: left hand holds the right cable.", "Croise les câbles : la main gauche tient le câble droit."),
      t("Arms nearly straight, pull out and back into a T.", "Bras presque tendus, ouvre vers l'arrière jusqu'en T."),
      t("Return slowly to the crossed position.", "Reviens lentement en position croisée."),
    ],
    mistakes: [
      t("Bending the elbows and rowing.", "Plier les coudes et tirer comme un rowing."),
      t("Going too heavy.", "Prendre trop lourd."),
    ],
    difficulty: 2,
    repRange: [12, 20],
  },
  'Bent_Over_Dumbbell_Rear_Delt_Raise_With_Head_On_Bench': {
    nameFr: "Oiseau haltères, front sur le banc",
    cues: [
      t("Bend forward and rest your forehead on a bench or chair back.", "Penche-toi et pose le front sur un banc ou un dossier de chaise."),
      t("Raise light weights out to the sides, elbows soft.", "Monte des poids légers sur les côtés, coudes souples."),
      t("Think of pushing the weights out toward the walls.", "Imagine pousser les poids vers les murs."),
      t("No dumbbells? Use full water bottles.", "Pas d'haltères ? Prends des bouteilles d'eau pleines."),
    ],
    mistakes: [
      t("Squeezing the shoulder blades instead of using the rear shoulders.", "Serrer les omoplates au lieu d'utiliser l'arrière des épaules."),
      t("Swinging the weights up.", "Lancer les poids avec élan."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },
  'Reverse_Flyes': {
    nameFr: "Oiseau allongé sur banc incliné",
    cues: [
      t("Lie chest-down on an incline bench, palms facing in.", "Allongé poitrine contre un banc incliné, paumes face à face."),
      t("Raise your arms out to the sides in an arc.", "Monte les bras sur les côtés en arc de cercle."),
      t("Keep the slight elbow bend fixed.", "Garde la légère flexion des coudes fixe."),
    ],
    mistakes: [
      t("Lifting the chest off the bench.", "Décoller la poitrine du banc."),
      t("So heavy that the elbows bend a lot.", "Trop lourd, les coudes se plient beaucoup."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },
  'Seated_Bent-Over_Rear_Delt_Raise': {
    nameFr: "Oiseau assis buste penché",
    cues: [
      t("Sit on the edge of a bench or chair, chest over knees.", "Assis au bord d'un banc ou d'une chaise, buste sur les genoux."),
      t("Raise the weights out to the sides, elbows soft.", "Monte les poids sur les côtés, coudes souples."),
      t("No dumbbells? Use full water bottles.", "Pas d'haltères ? Utilise des bouteilles d'eau pleines."),
    ],
    mistakes: [
      t("Sitting up as you lift.", "Se redresser en levant."),
      t("Shrugging the shoulders.", "Hausser les épaules."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },
  'Band_Pull_Apart': {
    nameFr: "Écartement d'élastique (band pull-apart)",
    cues: [
      t("Hold the band at shoulder height, arms straight.", "Tiens l'élastique à hauteur d'épaules, bras tendus."),
      t("Pull it apart until it touches your chest.", "Écarte-le jusqu'à ce qu'il touche ta poitrine."),
      t("Keep shoulders down, return slowly.", "Épaules basses, reviens lentement."),
    ],
    mistakes: [
      t("Bending the elbows.", "Plier les coudes."),
      t("Arching the back to finish.", "Se cambrer pour finir."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },
  'Back_Flyes_-_With_Bands': {
    nameFr: "Oiseau debout avec élastique",
    cues: [
      t("Anchor the band in front of you at chest height.", "Fixe l'élastique devant toi à hauteur de poitrine."),
      t("Arms straight ahead, open them out to your sides.", "Bras tendus devant, ouvre-les sur les côtés."),
      t("Pause, then return slowly.", "Marque une pause, puis reviens lentement."),
    ],
    mistakes: [
      t("Letting the band pull you forward.", "Se laisser tirer vers l'avant par l'élastique."),
      t("Shrugging the shoulders.", "Hausser les épaules."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },
  'External_Rotation_with_Band': {
    nameFr: "Rotation externe avec élastique",
    cues: [
      t("Band at elbow height, elbow tucked against your side.", "Élastique à hauteur du coude, coude collé au corps."),
      t("Rotate your forearm outward like opening a door.", "Fais pivoter l'avant-bras vers l'extérieur, comme une porte."),
      t("A rolled towel under the elbow helps.", "Une serviette roulée sous le coude aide."),
    ],
    mistakes: [
      t("Elbow drifting away from the body.", "Coude qui s'éloigne du corps."),
      t("Twisting the torso.", "Tourner le buste."),
    ],
    difficulty: 1,
    repRange: [12, 20],
    unilateral: true,
  },

  // ----- Biceps -----
  'Dumbbell_Bicep_Curl': {
    nameFr: "Curl biceps aux haltères",
    cues: [
      t("Stand tall, elbows pinned to your sides.", "Debout bien droit, coudes collés au corps."),
      t("Curl up while turning your palms toward your shoulders.", "Monte en tournant les paumes vers les épaules."),
      t("Lower slowly until your arms are straight.", "Redescends lentement jusqu'à bras tendus."),
    ],
    mistakes: [
      t("Swinging the body to lift the weight.", "Balancer le corps pour monter le poids."),
      t("Elbows drifting forward.", "Coudes qui avancent."),
      t("Not lowering all the way.", "Ne pas redescendre complètement."),
    ],
    difficulty: 1,
    repRange: [10, 15],
  },
  'Hammer_Curls': {
    nameFr: "Curl marteau",
    cues: [
      t("Palms face each other, like holding hammers.", "Paumes face à face, comme si tu tenais des marteaux."),
      t("Elbows stay still at your sides.", "Coudes immobiles le long du corps."),
      t("Curl up, squeeze, then lower slowly.", "Monte, serre, puis redescends lentement."),
    ],
    mistakes: [
      t("Swinging with the hips.", "Prendre de l'élan avec les hanches."),
      t("Shoulders rolling forward at the top.", "Épaules qui s'enroulent en haut."),
    ],
    difficulty: 1,
    repRange: [10, 15],
  },
  'Standing_Biceps_Cable_Curl': {
    nameFr: "Curl biceps à la poulie basse",
    cues: [
      t("Bar on a low pulley, palms up, hands shoulder-width.", "Barre sur la poulie basse, paumes vers le haut, largeur d'épaules."),
      t("Elbows fixed at your sides, curl toward your chest.", "Coudes fixes le long du corps, monte vers la poitrine."),
      t("Lower slowly; the cable keeps tension the whole way.", "Redescends lentement, le câble garde la tension."),
    ],
    mistakes: [
      t("Leaning back to finish reps.", "Se pencher en arrière pour finir."),
      t("Elbows moving forward.", "Coudes qui avancent."),
    ],
    difficulty: 1,
    repRange: [10, 15],
  },
  'Machine_Bicep_Curl': {
    nameFr: "Curl biceps à la machine",
    cues: [
      t("Set the seat so your armpits rest on top of the pad.", "Règle le siège pour que les aisselles reposent sur le coussin."),
      t("Curl the handles up and squeeze at the top.", "Monte les poignées et serre en haut."),
      t("Lower all the way with control.", "Redescends complètement en contrôle."),
    ],
    mistakes: [
      t("Lifting the elbows off the pad.", "Décoller les coudes du coussin."),
      t("Partial range of motion.", "Amplitude incomplète."),
    ],
    difficulty: 1,
    repRange: [10, 15],
  },
  'EZ-Bar_Curl': {
    nameFr: "Curl à la barre EZ",
    cues: [
      t("Grip the angled parts of the bar, palms up.", "Saisis les parties inclinées de la barre, paumes vers le haut."),
      t("Elbows pinned, curl the bar toward your upper chest.", "Coudes collés, monte la barre vers le haut de la poitrine."),
      t("Lower slowly to full extension.", "Redescends lentement jusqu'à bras tendus."),
    ],
    mistakes: [
      t("Rocking the hips to swing the bar.", "Balancer les hanches pour lancer la barre."),
      t("Lifting the elbows at the top.", "Lever les coudes en haut."),
    ],
    difficulty: 1,
    repRange: [8, 12],
  },
  'Barbell_Curl': {
    nameFr: "Curl à la barre droite",
    cues: [
      t("Shoulder-width grip, palms up.", "Mains largeur d'épaules, paumes vers le haut."),
      t("Stand tall, elbows tight to your ribs.", "Debout bien droit, coudes serrés contre les côtes."),
      t("Curl up without leaning back, then lower slowly.", "Monte sans te pencher en arrière, puis redescends lentement."),
    ],
    mistakes: [
      t("Swinging with the lower back.", "Se balancer avec le bas du dos."),
      t("Wrists curling back under the load.", "Poignets qui cassent sous la charge."),
    ],
    difficulty: 2,
    avoidIf: ['wrists'],
    repRange: [8, 12],
  },
  'Dumbbell_Alternate_Bicep_Curl': {
    nameFr: "Curl alterné aux haltères",
    cues: [
      t("Curl one arm at a time, turning the palm up.", "Monte un bras à la fois en tournant la paume vers le haut."),
      t("Keep the resting arm straight and still.", "Garde le bras au repos tendu et immobile."),
      t("Elbows stay by your sides.", "Les coudes restent près du corps."),
    ],
    mistakes: [
      t("Twisting the torso with each rep.", "Tourner le buste à chaque répétition."),
      t("Rushing the lowering phase.", "Redescendre trop vite."),
    ],
    difficulty: 1,
    repRange: [10, 15],
    unilateral: true,
  },
  'Concentration_Curls': {
    nameFr: "Curl concentré assis",
    cues: [
      t("Sit with the back of your upper arm against your inner thigh.", "Assis, l'arrière du bras contre l'intérieur de la cuisse."),
      t("Curl the weight up; only the forearm moves.", "Monte le poids, seul l'avant-bras bouge."),
      t("Squeeze at the top, then lower slowly.", "Serre en haut, puis redescends lentement."),
      t("No dumbbell? Use a backpack, or a band under your foot.", "Pas d'haltère ? Prends un sac à dos ou un élastique sous le pied."),
    ],
    mistakes: [
      t("Lifting the elbow off the thigh.", "Décoller le coude de la cuisse."),
      t("Leaning back to help the lift.", "Se pencher en arrière pour aider."),
    ],
    difficulty: 1,
    repRange: [10, 15],
    unilateral: true,
  },
  'Incline_Dumbbell_Curl': {
    nameFr: "Curl incliné aux haltères",
    cues: [
      t("Lie back on a bench at about 45°, arms hanging.", "Allongé sur un banc à environ 45°, bras pendants."),
      t("Curl up while keeping your elbows pointing down.", "Monte en gardant les coudes pointés vers le sol."),
      t("Use lighter weights; the stretch makes it harder.", "Prends plus léger, l'étirement rend l'exercice plus dur."),
    ],
    mistakes: [
      t("Elbows swinging forward.", "Coudes qui partent vers l'avant."),
      t("Head and shoulders coming off the bench.", "Tête et épaules qui décollent du banc."),
    ],
    difficulty: 2,
    repRange: [10, 15],
  },
  'Standing_Concentration_Curl': {
    nameFr: "Curl concentré debout",
    cues: [
      t("Lean forward, working arm hanging straight down.", "Penche-toi en avant, le bras qui travaille pend à la verticale."),
      t("Curl up while keeping the upper arm still.", "Monte en gardant le haut du bras immobile."),
      t("No dumbbell? Use a backpack, or a band under your foot.", "Pas d'haltère ? Prends un sac à dos ou un élastique sous le pied."),
    ],
    mistakes: [
      t("Swinging the arm.", "Balancer le bras."),
      t("Rounding the back while leaning.", "Arrondir le dos en se penchant."),
    ],
    difficulty: 1,
    repRange: [10, 15],
    unilateral: true,
  },

  // ----- Triceps -----
  'Triceps_Pushdown_-_Rope_Attachment': {
    nameFr: "Extension triceps à la poulie (corde)",
    cues: [
      t("Rope on a high pulley, elbows glued to your sides.", "Corde sur la poulie haute, coudes collés au corps."),
      t("Push down and spread the rope ends at the bottom.", "Pousse vers le bas et écarte la corde en fin de mouvement."),
      t("Only the forearms move; come back up to 90°.", "Seuls les avant-bras bougent, remonte jusqu'à 90°."),
    ],
    mistakes: [
      t("Elbows flaring or drifting forward.", "Coudes qui s'écartent ou avancent."),
      t("Leaning over the rope to use bodyweight.", "Se pencher sur la corde pour utiliser son poids."),
    ],
    difficulty: 1,
    repRange: [10, 15],
  },
  'Triceps_Pushdown': {
    nameFr: "Extension triceps à la poulie (barre)",
    cues: [
      t("Grip the bar with elbows tucked at your sides.", "Saisis la barre, coudes collés au corps."),
      t("Push down until your arms are straight, then squeeze.", "Pousse jusqu'à bras tendus, puis serre."),
      t("Let the bar rise slowly to chest height.", "Laisse remonter la barre lentement à hauteur de poitrine."),
    ],
    mistakes: [
      t("Shoulders rolling forward to push.", "Épaules qui s'enroulent pour pousser."),
      t("Letting the weight yank your hands up.", "Laisser la charge remonter les mains d'un coup."),
    ],
    difficulty: 1,
    repRange: [10, 15],
  },
  'Cable_Rope_Overhead_Triceps_Extension': {
    nameFr: "Extension triceps au-dessus de la tête à la poulie",
    cues: [
      t("Face away from a low pulley, rope behind your head.", "Dos à la poulie basse, corde derrière la tête."),
      t("Elbows point forward, close to your head.", "Coudes vers l'avant, proches de la tête."),
      t("Straighten your arms overhead, then lower slowly.", "Tends les bras au-dessus de la tête, puis redescends lentement."),
    ],
    mistakes: [
      t("Elbows flaring wide.", "Coudes qui s'écartent."),
      t("Arching the lower back.", "Cambrer le bas du dos."),
    ],
    difficulty: 2,
    avoidIf: ['shoulders'],
    repRange: [10, 15],
  },
  'Tricep_Dumbbell_Kickback': {
    nameFr: "Kickback triceps",
    cues: [
      t("Hinge forward with a flat back; rest a hand on a bench if needed.", "Penche-toi dos plat, une main sur un banc si besoin."),
      t("Upper arm parallel to the floor and still.", "Haut du bras parallèle au sol et immobile."),
      t("Straighten your arm back and squeeze for a second.", "Tends le bras vers l'arrière et serre une seconde."),
    ],
    mistakes: [
      t("Swinging the upper arm.", "Balancer le haut du bras."),
      t("Using a weight that's too heavy.", "Prendre un poids trop lourd."),
    ],
    difficulty: 1,
    repRange: [12, 15],
  },
  'EZ-Bar_Skullcrusher': {
    nameFr: "Barre au front (barre EZ)",
    cues: [
      t("Lie on a bench, bar over your chest, arms straight.", "Allongé sur un banc, barre au-dessus de la poitrine, bras tendus."),
      t("Bend only the elbows, lowering the bar toward your forehead.", "Plie seulement les coudes, barre vers le front."),
      t("Elbows point to the ceiling, not out to the sides.", "Les coudes pointent vers le plafond, pas sur les côtés."),
    ],
    mistakes: [
      t("Elbows flaring out.", "Coudes qui s'écartent."),
      t("Going too heavy and losing control.", "Prendre trop lourd et perdre le contrôle."),
    ],
    difficulty: 2,
    repRange: [8, 12],
  },
  'Close-Grip_Barbell_Bench_Press': {
    nameFr: "Développé couché prise serrée",
    cues: [
      t("Hands shoulder-width on the bar, not touching.", "Mains largeur d'épaules sur la barre, sans se toucher."),
      t("Elbows tucked close as you lower to your lower chest.", "Coudes près du corps en descendant vers le bas des pectoraux."),
      t("Press up by straightening your arms.", "Pousse en tendant les bras."),
      t("Use safety bars or a spotter.", "Utilise des sécurités ou un partenaire."),
    ],
    mistakes: [
      t("Grip so narrow that the wrists bend.", "Prise si serrée que les poignets se tordent."),
      t("Elbows flaring out.", "Coudes qui s'écartent."),
    ],
    difficulty: 3,
    avoidIf: ['wrists'],
    repRange: [6, 10],
  },
  'Seated_Triceps_Press': {
    nameFr: "Extension triceps assis avec haltère",
    cues: [
      t("Sit with back support, one dumbbell overhead in both hands.", "Assis dos calé, un haltère au-dessus de la tête à deux mains."),
      t("Elbows stay close to your head.", "Les coudes restent près de la tête."),
      t("Lower it behind your head, then straighten your arms.", "Descends-le derrière la tête, puis tends les bras."),
    ],
    mistakes: [
      t("Elbows flaring wide.", "Coudes qui s'écartent."),
      t("Arching the lower back.", "Cambrer le bas du dos."),
    ],
    difficulty: 1,
    avoidIf: ['shoulders'],
    repRange: [10, 15],
  },
  'Lying_Dumbbell_Tricep_Extension': {
    nameFr: "Extension triceps couché aux haltères",
    cues: [
      t("Lie on a bench, dumbbells over your chest, palms in.", "Allongé sur un banc, haltères au-dessus de la poitrine, paumes face à face."),
      t("Bend your elbows, lowering the weights beside your head.", "Plie les coudes, haltères à côté de la tête."),
      t("Keep upper arms still and straighten back up.", "Garde le haut des bras immobile et remonte en tendant."),
    ],
    mistakes: [
      t("Upper arms moving back and forth.", "Haut des bras qui bouge d'avant en arrière."),
      t("Lowering too fast near your face.", "Descendre trop vite près du visage."),
    ],
    difficulty: 2,
    repRange: [10, 15],
  },
  'Bench_Dips': {
    nameFr: "Dips sur banc (ou chaise)",
    cues: [
      t("Hands on the edge of a sturdy bench or chair behind you.", "Mains sur le bord d'un banc ou d'une chaise solide derrière toi."),
      t("Keep your hips close to the bench, elbows pointing back.", "Fesses près du banc, coudes vers l'arrière."),
      t("Lower until elbows reach about 90°, then push up.", "Descends jusqu'à environ 90° aux coudes, puis remonte."),
      t("Bend your knees to make it easier.", "Plie les genoux pour faciliter."),
    ],
    mistakes: [
      t("Dipping too deep and straining the shoulders.", "Descendre trop bas et forcer sur les épaules."),
      t("Shoulders shrugging up to the ears.", "Épaules qui montent vers les oreilles."),
    ],
    difficulty: 1,
    avoidIf: ['shoulders', 'wrists'],
    repRange: [8, 15],
  },
  'Incline_Push-Up_Close-Grip': {
    nameFr: "Pompes inclinées mains serrées",
    cues: [
      t("Hands close together on a sturdy table or bench edge.", "Mains rapprochées sur le bord d'une table solide ou d'un banc."),
      t("Elbows brush your ribs as you lower.", "Les coudes frôlent les côtes en descendant."),
      t("Body straight; push away until your arms are straight.", "Corps droit, repousse jusqu'à bras tendus."),
    ],
    mistakes: [
      t("Elbows flaring out.", "Coudes qui s'écartent."),
      t("Hips sagging.", "Hanches qui s'affaissent."),
    ],
    difficulty: 1,
    repRange: [8, 15],
  },
  'Body_Tricep_Press': {
    nameFr: "Extension triceps au poids du corps",
    cues: [
      t("Hands on a sturdy table edge, step your feet back.", "Mains sur le bord d'une table solide, recule les pieds."),
      t("Bend only the elbows, bringing your forehead toward your hands.", "Plie seulement les coudes, front vers les mains."),
      t("Straighten your arms to push back up.", "Tends les bras pour remonter."),
      t("Feet further back makes it harder.", "Plus les pieds sont loin, plus c'est dur."),
    ],
    mistakes: [
      t("Turning it into a push-up with flared elbows.", "En faire une pompe avec les coudes écartés."),
      t("Hips sagging.", "Hanches qui s'affaissent."),
    ],
    difficulty: 2,
    avoidIf: ['wrists'],
    repRange: [8, 15],
  },
  'Push-Ups_-_Close_Triceps_Position': {
    nameFr: "Pompes mains serrées (triceps)",
    cues: [
      t("Hands under your chest, close together.", "Mains sous la poitrine, rapprochées."),
      t("Elbows stay tight to your ribs.", "Les coudes restent collés aux côtes."),
      t("Drop to your knees if you lose form.", "Passe sur les genoux si tu perds la technique."),
    ],
    mistakes: [
      t("Elbows flaring out.", "Coudes qui s'écartent."),
      t("Hips sagging.", "Hanches qui s'affaissent."),
    ],
    difficulty: 2,
    avoidIf: ['wrists'],
    repRange: [6, 12],
  },
  'Speed_Band_Overhead_Triceps': {
    nameFr: "Extension triceps au-dessus de la tête avec élastique",
    cues: [
      t("Stand on the band and hold it behind your head.", "Debout sur l'élastique, tiens-le derrière la tête."),
      t("Elbows point up and stay close to your head.", "Coudes vers le haut, proches de la tête."),
      t("Straighten your arms overhead, then lower slowly.", "Tends les bras au-dessus de la tête, puis redescends lentement."),
    ],
    mistakes: [
      t("Elbows drifting forward.", "Coudes qui partent vers l'avant."),
      t("Arching the back.", "Se cambrer."),
    ],
    difficulty: 1,
    avoidIf: ['shoulders'],
    repRange: [12, 20],
  },
  'Band_Skull_Crusher': {
    nameFr: "Barre au front avec élastique",
    cues: [
      t("Anchor the band low, behind your head.", "Fixe l'élastique en bas, derrière ta tête."),
      t("Upper arms vertical; bend the elbows to bring hands back.", "Bras verticaux, plie les coudes pour ramener les mains."),
      t("Straighten your arms fully, then return slowly.", "Tends complètement les bras, puis reviens lentement."),
    ],
    mistakes: [
      t("Upper arms swinging.", "Haut des bras qui bouge."),
      t("Elbows flaring out.", "Coudes qui s'écartent."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },

  // ----- Quad focus -----
  'Leg_Extensions': {
    nameFr: "Leg extension (machine)",
    cues: [
      t("Line your knee up with the machine's pivot point.", "Aligne le genou avec l'axe de la machine."),
      t("Pad on your lower shin, just above the ankle.", "Coussin sur le bas du tibia, juste au-dessus de la cheville."),
      t("Straighten your legs, squeeze your thighs, lower slowly.", "Tends les jambes, serre les cuisses, redescends lentement."),
      t("Knees sensitive? Go light and use a shorter range.", "Genoux sensibles ? Charge légère et amplitude réduite."),
    ],
    mistakes: [
      t("Kicking the weight up with momentum.", "Lancer la charge avec élan."),
      t("Hips lifting off the seat.", "Fesses qui décollent du siège."),
    ],
    difficulty: 1,
    repRange: [10, 15],
  },
  'Single-Leg_Leg_Extension': {
    nameFr: "Leg extension unilatéral",
    cues: [
      t("Same setup as the leg extension, one leg at a time.", "Même réglage qu'au leg extension, une jambe à la fois."),
      t("Straighten the leg fully and pause at the top.", "Tends la jambe complètement et marque une pause en haut."),
      t("Start each set with your weaker leg.", "Commence chaque série par ta jambe la plus faible."),
    ],
    mistakes: [
      t("Twisting the hips to lift.", "Tourner le bassin pour soulever."),
      t("Dropping the weight quickly.", "Laisser retomber la charge vite."),
    ],
    difficulty: 1,
    repRange: [10, 15],
    unilateral: true,
  },
  'Single-Leg_High_Box_Squat': {
    nameFr: "Squat unilatéral sur marche haute",
    cues: [
      t("Stand on a sturdy step with one leg, holding a support.", "Debout sur une marche solide avec une jambe, en tenant un appui."),
      t("Slowly lower the free heel toward the floor.", "Descends lentement le talon libre vers le sol."),
      t("Push through the standing heel to rise.", "Pousse dans le talon d'appui pour remonter."),
      t("Keep the working knee over your toes.", "Garde le genou qui travaille au-dessus des orteils."),
    ],
    mistakes: [
      t("Knee caving inward.", "Genou qui rentre vers l'intérieur."),
      t("Pushing off the floor with the free foot.", "Pousser sur le sol avec le pied libre."),
    ],
    difficulty: 2,
    avoidIf: ['knees'],
    repRange: [8, 12],
    unilateral: true,
  },
  'Hip_Flexion_with_Band': {
    nameFr: "Flexion de hanche avec élastique",
    cues: [
      t("Band around one ankle, anchored low behind you.", "Élastique à une cheville, attaché en bas derrière toi."),
      t("Stand tall and hold a support if needed.", "Tiens-toi droit, avec un appui si besoin."),
      t("Drive the knee up to hip height, pause, lower slowly.", "Monte le genou à hauteur de hanche, pause, redescends lentement."),
    ],
    mistakes: [
      t("Leaning back to lift the knee.", "Se pencher en arrière pour monter le genou."),
      t("Letting the band snap the leg back.", "Laisser l'élastique ramener la jambe d'un coup."),
    ],
    difficulty: 1,
    repRange: [12, 20],
    unilateral: true,
  },

  // ----- Hamstring curl -----
  'Seated_Leg_Curl': {
    nameFr: "Leg curl assis",
    cues: [
      t("Knees lined up with the pivot, lap pad snug on your thighs.", "Genoux alignés avec l'axe, coussin bien serré sur les cuisses."),
      t("Curl your heels down and back as far as possible.", "Ramène les talons vers l'arrière le plus loin possible."),
      t("Return slowly; don't let the weight slam.", "Reviens lentement, sans laisser claquer la charge."),
    ],
    mistakes: [
      t("Lap pad too loose, so the hips lift.", "Coussin trop lâche, les hanches se soulèvent."),
      t("Short, fast reps.", "Répétitions courtes et rapides."),
    ],
    difficulty: 1,
    repRange: [10, 15],
  },
  'Lying_Leg_Curls': {
    nameFr: "Leg curl allongé",
    cues: [
      t("Lie face down with the pad just above your heels.", "Allongé sur le ventre, coussin juste au-dessus des talons."),
      t("Keep your hips pressed into the bench.", "Garde les hanches plaquées contre le banc."),
      t("Curl your heels toward your glutes, then lower slowly.", "Ramène les talons vers les fessiers, puis redescends lentement."),
    ],
    mistakes: [
      t("Hips rising off the bench.", "Hanches qui décollent du banc."),
      t("Kicking the weight up with momentum.", "Lancer la charge avec élan."),
    ],
    difficulty: 1,
    repRange: [10, 15],
  },
  'Standing_Leg_Curl': {
    nameFr: "Leg curl debout unilatéral",
    cues: [
      t("Pad behind your lower calf, hands on the handles.", "Coussin derrière le bas du mollet, mains sur les poignées."),
      t("Curl your heel toward your glute, hips still.", "Ramène le talon vers le fessier, bassin immobile."),
      t("Lower slowly back to a straight leg.", "Redescends lentement jusqu'à jambe tendue."),
    ],
    mistakes: [
      t("Swinging the hips.", "Balancer le bassin."),
      t("Lifting the thigh forward.", "Avancer la cuisse."),
    ],
    difficulty: 1,
    repRange: [10, 15],
    unilateral: true,
  },
  'Ball_Leg_Curl': {
    nameFr: "Leg curl sur ballon de gym",
    cues: [
      t("Lie on your back with your heels on a stability ball.", "Sur le dos, talons posés sur un ballon de gym."),
      t("Lift your hips, then roll the ball toward your butt.", "Monte les hanches, puis roule le ballon vers tes fesses."),
      t("Keep your hips high the whole time.", "Garde les hanches hautes tout du long."),
    ],
    mistakes: [
      t("Hips dropping as you curl.", "Hanches qui retombent pendant le curl."),
      t("Rolling the ball too fast.", "Rouler le ballon trop vite."),
    ],
    difficulty: 2,
    repRange: [8, 12],
  },
  'Glute_Ham_Raise': {
    nameFr: "Glute ham raise (machine)",
    cues: [
      t("Knees just behind the pad, feet locked in.", "Genoux juste derrière le coussin, pieds bloqués."),
      t("Keep a straight line from knees to head.", "Garde une ligne droite des genoux à la tête."),
      t("Pull yourself up with your hamstrings, toes pressing the plate.", "Remonte avec l'arrière des cuisses, orteils contre la plaque."),
    ],
    mistakes: [
      t("Bending at the hips instead of the knees.", "Plier les hanches au lieu des genoux."),
      t("Dropping down without control.", "Redescendre sans contrôle."),
    ],
    difficulty: 3,
    avoidIf: ['knees'],
    repRange: [5, 10],
  },
  'Platform_Hamstring_Slides': {
    nameFr: "Glissés ischios avec serviette",
    cues: [
      t("Lie on your back on a smooth floor, towel under one heel.", "Sur le dos, sur un sol lisse, serviette sous un talon."),
      t("Slide the heel toward your butt by bending the knee.", "Fais glisser le talon vers tes fesses en pliant le genou."),
      t("Slide back out slowly.", "Ramène la jambe lentement."),
      t("Lift your hips slightly to make it harder.", "Soulève un peu les hanches pour corser."),
    ],
    mistakes: [
      t("Using a floor that grips, like carpet.", "Utiliser un sol qui accroche, comme la moquette."),
      t("Rushing the return.", "Revenir trop vite."),
    ],
    difficulty: 1,
    repRange: [8, 15],
    unilateral: true,
  },
  'Floor_Glute-Ham_Raise': {
    nameFr: "Nordic curl au sol",
    cues: [
      t("Kneel on a cushion, ankles anchored under a sofa or by a partner.", "À genoux sur un coussin, chevilles bloquées sous un canapé ou par un partenaire."),
      t("Body straight from knees to head.", "Corps droit des genoux à la tête."),
      t("Lower forward as slowly as you can.", "Descends vers l'avant le plus lentement possible."),
      t("Catch yourself with your hands and push back up.", "Rattrape-toi avec les mains et repousse pour remonter."),
    ],
    mistakes: [
      t("Bending at the hips to cheat.", "Plier les hanches pour tricher."),
      t("Using an anchor that isn't stable.", "Utiliser un point d'ancrage pas stable."),
    ],
    difficulty: 3,
    avoidIf: ['knees'],
    repRange: [3, 8],
  },
  'Seated_Band_Hamstring_Curl': {
    nameFr: "Leg curl assis avec élastique",
    cues: [
      t("Anchor the band low in front, loop it behind your ankles.", "Fixe l'élastique en bas devant toi, boucle derrière les chevilles."),
      t("Sit on a chair or bench with legs straight.", "Assis sur une chaise ou un banc, jambes tendues."),
      t("Curl your heels under the seat, then return slowly.", "Ramène les talons sous le siège, puis reviens lentement."),
    ],
    mistakes: [
      t("Band slipping off the ankles.", "Élastique qui glisse des chevilles."),
      t("Letting the band snap the legs forward.", "Laisser l'élastique tirer les jambes d'un coup."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },

  // ----- Calves -----
  'Standing_Calf_Raises': {
    nameFr: "Mollets debout à la machine",
    cues: [
      t("Balls of your feet on the block, heels hanging off.", "Avant des pieds sur la cale, talons dans le vide."),
      t("Lower your heels for a deep stretch and pause.", "Descends les talons pour un bon étirement, puis pause."),
      t("Rise as high as you can and squeeze.", "Monte le plus haut possible et serre."),
    ],
    mistakes: [
      t("Bouncing quickly with no pause.", "Rebondir vite sans pause."),
      t("Bending the knees to help.", "Plier les genoux pour aider."),
    ],
    difficulty: 1,
    avoidIf: ['lower_back'],
    repRange: [12, 20],
  },
  'Seated_Calf_Raise': {
    nameFr: "Mollets assis à la machine",
    cues: [
      t("Pad snug on your lower thighs, balls of feet on the block.", "Coussin serré sur le bas des cuisses, avant des pieds sur la cale."),
      t("Lower your heels fully, then push up high.", "Descends complètement les talons, puis pousse haut."),
      t("Pause one second at the top.", "Marque une seconde en haut."),
    ],
    mistakes: [
      t("Tiny, fast reps.", "Petites répétitions rapides."),
      t("Rolling onto the little toes.", "Rouler sur les petits orteils."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },
  'Calf_Press_On_The_Leg_Press_Machine': {
    nameFr: "Mollets à la presse",
    cues: [
      t("Balls of your feet on the platform edge, legs nearly straight.", "Avant des pieds au bord du plateau, jambes presque tendues."),
      t("Push the platform with your toes, then lower slowly.", "Pousse le plateau avec les orteils, puis redescends lentement."),
      t("Keep the safety handles within reach.", "Garde les sécurités à portée de main."),
    ],
    mistakes: [
      t("Feet slipping off the platform.", "Pieds qui glissent du plateau."),
      t("Bending the knees to move the weight.", "Plier les genoux pour bouger la charge."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },
  'Smith_Machine_Calf_Raise': {
    nameFr: "Mollets debout à la Smith machine",
    cues: [
      t("Bar on your upper back, balls of your feet on a step.", "Barre sur le haut du dos, avant des pieds sur une cale."),
      t("Lower your heels for a stretch, then rise up high.", "Descends les talons pour étirer, puis monte haut."),
      t("Move slowly and pause at the top.", "Bouge lentement et marque une pause en haut."),
    ],
    mistakes: [
      t("Bouncing out of the stretch.", "Rebondir en bas."),
      t("Rounding the back under the bar.", "Arrondir le dos sous la barre."),
    ],
    difficulty: 1,
    avoidIf: ['lower_back'],
    repRange: [12, 20],
  },
  'Standing_Dumbbell_Calf_Raise': {
    nameFr: "Mollets debout (haltères ou poids du corps)",
    cues: [
      t("Balls of your feet on a step, heels hanging off.", "Avant des pieds sur une marche, talons dans le vide."),
      t("Hold a wall for balance; add dumbbells or a backpack later.", "Tiens un mur pour l'équilibre, ajoute haltères ou sac à dos ensuite."),
      t("Lower slowly, then rise as high as possible.", "Descends lentement, puis monte le plus haut possible."),
      t("Too easy? Do one leg at a time.", "Trop facile ? Fais-le sur une jambe."),
    ],
    mistakes: [
      t("Bouncing at the bottom.", "Rebondir en bas."),
      t("Rolling onto the outer edge of the feet.", "Rouler sur le bord extérieur des pieds."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },
  'Dumbbell_Seated_One-Leg_Calf_Raise': {
    nameFr: "Mollets assis unilatéral avec haltère",
    cues: [
      t("Sit with the ball of one foot on a block or thick book.", "Assis, l'avant d'un pied sur une cale ou un gros livre."),
      t("Rest a dumbbell or backpack on that knee.", "Pose un haltère ou un sac à dos sur ce genou."),
      t("Raise the heel high, then lower slowly.", "Monte le talon haut, puis redescends lentement."),
    ],
    mistakes: [
      t("Too small a range of motion.", "Amplitude trop petite."),
      t("Pushing the weight up with your hand.", "Pousser le poids avec la main."),
    ],
    difficulty: 1,
    repRange: [12, 20],
    unilateral: true,
  },
  'Calf_Raises_-_With_Bands': {
    nameFr: "Mollets avec élastique",
    cues: [
      t("Band under the balls of your feet, handles at your shoulders.", "Élastique sous l'avant des pieds, poignées aux épaules."),
      t("Rise onto your toes and squeeze for a second.", "Monte sur la pointe des pieds et serre une seconde."),
      t("Lower slowly with control.", "Redescends lentement en contrôle."),
    ],
    mistakes: [
      t("Bouncing quickly.", "Rebondir vite."),
      t("Leaning forward.", "Se pencher en avant."),
    ],
    difficulty: 1,
    repRange: [15, 25],
  },

  // ----- Core: anti-extension -----
  'Plank': {
    nameFr: "Gainage (planche)",
    cues: [
      t("Forearms under shoulders, body straight from head to heels.", "Avant-bras sous les épaules, corps droit de la tête aux talons."),
      t("Brace your stomach like someone is about to poke it.", "Gaine ton ventre comme si quelqu'un allait te le pousser."),
      t("Squeeze your glutes and tuck your ribs down.", "Serre les fessiers et rentre les côtes."),
      t("Too hard? Drop to your knees.", "Trop dur ? Pose les genoux."),
    ],
    mistakes: [
      t("Hips sagging toward the floor.", "Hanches qui s'affaissent vers le sol."),
      t("Butt piked up high.", "Fesses trop hautes."),
      t("Holding your breath.", "Bloquer la respiration."),
    ],
    difficulty: 1,
    repRange: [20, 45],
    timed: true,
  },
  'Dead_Bug': {
    nameFr: "Dead bug",
    cues: [
      t("On your back, arms up, knees bent at 90° over your hips.", "Sur le dos, bras vers le plafond, genoux à 90° au-dessus des hanches."),
      t("Press your lower back into the floor.", "Plaque le bas du dos au sol."),
      t("Slowly extend the opposite arm and leg, then switch.", "Tends lentement le bras et la jambe opposés, puis change."),
      t("Breathe out as you extend.", "Expire en tendant."),
    ],
    mistakes: [
      t("Lower back arching off the floor.", "Bas du dos qui décolle du sol."),
      t("Moving too fast.", "Aller trop vite."),
    ],
    difficulty: 1,
    repRange: [6, 10],
    unilateral: true,
  },
  'Exercise_Ball_Pull-In': {
    nameFr: "Ramené de genoux sur ballon",
    cues: [
      t("Push-up position with your shins on a stability ball.", "Position de pompe, tibias posés sur un ballon de gym."),
      t("Pull your knees toward your chest, rolling the ball in.", "Ramène les genoux vers la poitrine en roulant le ballon."),
      t("Keep hips level and roll back out slowly.", "Garde le bassin stable et ressors lentement."),
    ],
    mistakes: [
      t("Hips sagging when the legs extend.", "Hanches qui s'affaissent quand les jambes se tendent."),
      t("Shoulders drifting behind the hands.", "Épaules qui reculent derrière les mains."),
    ],
    difficulty: 2,
    avoidIf: ['wrists'],
    repRange: [8, 15],
  },
  'Ab_Roller': {
    nameFr: "Roue abdominale",
    cues: [
      t("Start on your knees with the roller under your shoulders.", "Commence à genoux, roue sous les épaules."),
      t("Brace hard and roll out only as far as you control.", "Gaine fort et roule seulement jusqu'où tu contrôles."),
      t("Pull back with your abs, not your hips.", "Reviens avec les abdos, pas avec les hanches."),
    ],
    mistakes: [
      t("Lower back sagging at full extension.", "Bas du dos qui se creuse en extension."),
      t("Rolling out too far too soon.", "Rouler trop loin trop tôt."),
    ],
    difficulty: 3,
    avoidIf: ['lower_back', 'shoulders'],
    repRange: [5, 10],
  },
  'Butt-Ups': {
    nameFr: "Planche avec montée de bassin",
    cues: [
      t("Start in a forearm plank.", "Pars en planche sur les avant-bras."),
      t("Squeeze your abs and lift your hips toward the ceiling.", "Serre les abdos et monte les fesses vers le plafond."),
      t("Lower slowly back to a straight plank.", "Redescends lentement en planche droite."),
    ],
    mistakes: [
      t("Letting the back sag between reps.", "Laisser le dos se creuser entre les répétitions."),
      t("Rushing up and down.", "Monter et descendre trop vite."),
    ],
    difficulty: 1,
    repRange: [10, 15],
  },
  'Spider_Crawl': {
    nameFr: "Planche araignée (genou au coude)",
    cues: [
      t("Hold a push-up position, body straight.", "Tiens une position de pompe, corps droit."),
      t("Bring one knee out to the side toward your elbow.", "Ramène un genou sur le côté vers ton coude."),
      t("Return and switch sides; hips stay low.", "Reviens et change de côté, hanches basses."),
    ],
    mistakes: [
      t("Hips popping up high.", "Fesses qui montent haut."),
      t("Rushing and losing the plank.", "Aller trop vite et perdre le gainage."),
    ],
    difficulty: 2,
    avoidIf: ['wrists'],
    repRange: [6, 10],
    unilateral: true,
  },

  // ----- Core: flexion -----
  'Crunches': {
    nameFr: "Crunchs",
    cues: [
      t("Knees bent, feet flat, fingertips lightly by your ears.", "Genoux pliés, pieds à plat, bouts des doigts près des oreilles."),
      t("Curl your shoulders off the floor, ribs toward hips.", "Décolle les épaules du sol, côtes vers le bassin."),
      t("Exhale as you curl up, then lower slowly.", "Expire en montant, puis redescends lentement."),
    ],
    mistakes: [
      t("Pulling on the neck with your hands.", "Tirer sur la nuque avec les mains."),
      t("Sitting all the way up with momentum.", "Monter jusqu'en haut avec élan."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },
  'Reverse_Crunch': {
    nameFr: "Crunch inversé",
    cues: [
      t("On your back, hips and knees bent at 90°.", "Sur le dos, hanches et genoux à 90°."),
      t("Curl your hips off the floor, knees toward your chest.", "Décolle le bassin du sol, genoux vers la poitrine."),
      t("Lower slowly; don't swing the legs.", "Redescends lentement, sans balancer les jambes."),
    ],
    mistakes: [
      t("Swinging the legs to create momentum.", "Balancer les jambes pour prendre de l'élan."),
      t("Arching the back as the legs lower.", "Cambrer le dos en descendant les jambes."),
    ],
    difficulty: 1,
    repRange: [10, 15],
  },
  'Cable_Crunch': {
    nameFr: "Crunch à la poulie haute",
    cues: [
      t("Kneel under a high pulley, rope beside your ears.", "À genoux sous la poulie haute, corde près des oreilles."),
      t("Keep hips still and curl your ribs toward your hips.", "Bassin immobile, enroule les côtes vers le bassin."),
      t("Round your spine; don't just bow at the hips.", "Enroule la colonne, ne te plie pas seulement aux hanches."),
    ],
    mistakes: [
      t("Sitting back on the heels to pull with bodyweight.", "S'asseoir sur les talons pour tirer avec son poids."),
      t("Pulling with the arms.", "Tirer avec les bras."),
    ],
    difficulty: 2,
    avoidIf: ['lower_back'],
    repRange: [10, 15],
  },
  'Knee_Hip_Raise_On_Parallel_Bars': {
    nameFr: "Relevés de genoux à la chaise romaine",
    cues: [
      t("Forearms on the pads, back pressed against the back pad.", "Avant-bras sur les appuis, dos plaqué au dossier."),
      t("Raise your knees toward your chest, curling the pelvis up.", "Monte les genoux vers la poitrine en enroulant le bassin."),
      t("Lower slowly without swinging.", "Redescends lentement sans te balancer."),
    ],
    mistakes: [
      t("Swinging the legs.", "Balancer les jambes."),
      t("Lifting the legs without curling the hips.", "Lever les jambes sans enrouler le bassin."),
    ],
    difficulty: 2,
    repRange: [8, 15],
  },
  'Exercise_Ball_Crunch': {
    nameFr: "Crunch sur ballon de gym",
    cues: [
      t("Lower back on the ball, feet planted wide.", "Bas du dos sur le ballon, pieds bien écartés au sol."),
      t("Curl your ribs toward your hips, then stretch back.", "Enroule les côtes vers le bassin, puis étire-toi en arrière."),
      t("Cross your arms on your chest to protect your neck.", "Croise les bras sur la poitrine pour protéger la nuque."),
    ],
    mistakes: [
      t("Rolling the ball instead of curling the spine.", "Faire rouler le ballon au lieu d'enrouler la colonne."),
      t("Feet too close together, losing balance.", "Pieds trop serrés, perte d'équilibre."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },
  'Leg_Pull-In': {
    nameFr: "Ramené de genoux allongé",
    cues: [
      t("Lie on your back, legs straight, hands by your sides.", "Sur le dos, jambes tendues, mains le long du corps."),
      t("Pull your knees to your chest, then extend the legs out.", "Ramène les genoux vers la poitrine, puis tends les jambes."),
      t("Keep your lower back pressed down.", "Garde le bas du dos plaqué au sol."),
    ],
    mistakes: [
      t("Lower back arching as the legs extend.", "Bas du dos qui se cambre quand les jambes se tendent."),
      t("Kicking fast with no control.", "Donner des coups de jambes sans contrôle."),
    ],
    difficulty: 1,
    repRange: [10, 15],
  },
  'Tuck_Crunch': {
    nameFr: "Crunch jambes levées",
    cues: [
      t("Legs up, thighs vertical, ankles crossed.", "Jambes levées, cuisses verticales, chevilles croisées."),
      t("Curl your shoulders up toward your knees.", "Monte les épaules vers les genoux."),
      t("Exhale on the way up, lower slowly.", "Expire en montant, redescends lentement."),
    ],
    mistakes: [
      t("Pulling on the neck.", "Tirer sur la nuque."),
      t("Legs dropping during the set.", "Jambes qui descendent pendant la série."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },

  // ----- Core: rotation -----
  'Pallof_Press': {
    nameFr: "Pallof press",
    cues: [
      t("Stand side-on to a cable set at chest height.", "De profil à la poulie, câble à hauteur de poitrine."),
      t("Handle at your chest; step out until there's tension.", "Poignée contre la poitrine, écarte-toi jusqu'à sentir la tension."),
      t("Press your arms straight out and resist turning.", "Tends les bras devant toi en résistant à la rotation."),
      t("Hold two seconds, then bring it back slowly.", "Tiens deux secondes, puis ramène lentement."),
    ],
    mistakes: [
      t("Letting the torso twist toward the cable.", "Laisser le buste tourner vers le câble."),
      t("Standing too close, with no tension.", "Être trop près, sans tension."),
    ],
    difficulty: 1,
    repRange: [8, 12],
    unilateral: true,
  },
  'Standing_Cable_Wood_Chop': {
    nameFr: "Bûcheron à la poulie (haut vers bas)",
    cues: [
      t("Cable high, side-on, both hands on the handle.", "Câble en haut, de profil, deux mains sur la poignée."),
      t("Pull diagonally down across your body to the far knee.", "Tire en diagonale vers le bas, jusqu'au genou opposé."),
      t("Pivot the back foot and turn through hips and chest.", "Pivote le pied arrière et tourne avec hanches et buste."),
    ],
    mistakes: [
      t("Pulling only with the arms.", "Tirer uniquement avec les bras."),
      t("Rounding the lower back.", "Arrondir le bas du dos."),
    ],
    difficulty: 2,
    repRange: [10, 15],
    unilateral: true,
  },
  'Standing_Cable_Lift': {
    nameFr: "Bûcheron inversé à la poulie (bas vers haut)",
    cues: [
      t("Cable low, side-on, start in a half squat.", "Câble en bas, de profil, pars en demi-squat."),
      t("Lift diagonally up and across your body, arms long.", "Monte en diagonale à travers le corps, bras longs."),
      t("Stand and rotate together; control the return.", "Redresse-toi en tournant, contrôle le retour."),
    ],
    mistakes: [
      t("Yanking with the arms.", "Arracher avec les bras."),
      t("Twisting at the knees instead of the hips.", "Tordre les genoux au lieu des hanches."),
    ],
    difficulty: 2,
    repRange: [10, 15],
    unilateral: true,
  },
  'Side_Bridge': {
    nameFr: "Gainage latéral (planche de côté)",
    cues: [
      t("Lie on your side, elbow under shoulder, feet stacked.", "Sur le côté, coude sous l'épaule, pieds l'un sur l'autre."),
      t("Lift your hips so your body forms a straight line.", "Monte les hanches pour former une ligne droite."),
      t("Too hard? Bend your knees and keep them down.", "Trop dur ? Plie les genoux et garde-les au sol."),
    ],
    mistakes: [
      t("Hips sagging toward the floor.", "Hanches qui tombent vers le sol."),
      t("Chest rolling forward.", "Buste qui bascule vers l'avant."),
    ],
    difficulty: 1,
    avoidIf: ['shoulders'],
    repRange: [20, 40],
    timed: true,
    unilateral: true,
  },
  'Air_Bike': {
    nameFr: "Crunch vélo",
    cues: [
      t("Lower back pressed down, hands lightly by your head.", "Bas du dos plaqué, mains légèrement près de la tête."),
      t("Bring one elbow toward the opposite knee as the other leg extends.", "Approche un coude du genou opposé pendant que l'autre jambe se tend."),
      t("Go slowly; rotate the shoulder, not just the elbow.", "Va lentement, tourne l'épaule, pas seulement le coude."),
    ],
    mistakes: [
      t("Yanking the neck with the hands.", "Tirer la nuque avec les mains."),
      t("Pedaling fast with no real rotation.", "Pédaler vite sans vraie rotation."),
    ],
    difficulty: 1,
    repRange: [10, 15],
    unilateral: true,
  },
  'Cross-Body_Crunch': {
    nameFr: "Crunch croisé coude-genou",
    cues: [
      t("Knees bent, feet flat, hands loosely behind your head.", "Genoux pliés, pieds à plat, mains derrière la tête sans serrer."),
      t("Curl up, bringing one elbow across toward the opposite knee.", "Enroule-toi en amenant un coude vers le genou opposé."),
      t("Lower slowly and switch sides.", "Redescends lentement et change de côté."),
    ],
    mistakes: [
      t("Pulling the head forward.", "Tirer la tête vers l'avant."),
      t("Moving only the elbow, not the shoulder.", "Bouger seulement le coude, pas l'épaule."),
    ],
    difficulty: 1,
    repRange: [10, 15],
    unilateral: true,
  },
  'Russian_Twist': {
    nameFr: "Rotations russes (Russian twist)",
    cues: [
      t("Sit with knees bent and lean back into a V, chest proud.", "Assis genoux pliés, penche-toi en arrière en V, poitrine fière."),
      t("Rotate your shoulders side to side, hands together.", "Tourne les épaules d'un côté à l'autre, mains jointes."),
      t("Hold a dumbbell to make it harder.", "Tiens un haltère pour corser."),
    ],
    mistakes: [
      t("Rounding the back into a slump.", "Arrondir le dos et s'affaisser."),
      t("Moving only the arms, not the torso.", "Bouger seulement les bras, pas le buste."),
    ],
    difficulty: 2,
    avoidIf: ['lower_back'],
    repRange: [10, 15],
    unilateral: true,
  },
  'Alternate_Heel_Touchers': {
    nameFr: "Touchers de talons alternés",
    cues: [
      t("On your back, knees bent, feet wide apart.", "Sur le dos, genoux pliés, pieds écartés."),
      t("Lift your shoulders slightly and reach side to side to your heels.", "Décolle un peu les épaules, touche un talon puis l'autre."),
      t("Keep shoulders off the floor for the whole set.", "Garde les épaules décollées pendant toute la série."),
    ],
    mistakes: [
      t("Dropping the head between reps.", "Reposer la tête entre les répétitions."),
      t("Pulling the neck forward.", "Tirer la nuque vers l'avant."),
    ],
    difficulty: 1,
    repRange: [10, 20],
    unilateral: true,
  },

  // ----- Conditioning -----
  'Walking_Treadmill': {
    nameFr: "Marche sur tapis (inclinée)",
    cues: [
      t("Set a brisk pace and a slight incline.", "Choisis un rythme soutenu et une légère inclinaison."),
      t("Stand tall and let your arms swing naturally.", "Tiens-toi droit et laisse les bras se balancer."),
      t("Don't hang on the rails; slow down instead.", "Ne t'accroche pas aux barres, ralentis plutôt."),
      t("You should be able to talk, but not sing.", "Tu dois pouvoir parler, mais pas chanter."),
    ],
    mistakes: [
      t("Leaning on the handrails.", "S'appuyer sur les rambardes."),
      t("Incline so steep that you hunch over.", "Inclinaison si forte qu'on se penche en avant."),
    ],
    difficulty: 1,
    repRange: [600, 1200],
    timed: true,
  },
  'Bicycling_Stationary': {
    nameFr: "Vélo d'appartement",
    cues: [
      t("Seat height: slight knee bend at the bottom of the pedal stroke.", "Hauteur de selle : genou légèrement plié en bas du pédalage."),
      t("Keep a steady, comfortable cadence.", "Garde une cadence régulière et confortable."),
      t("Add resistance gradually, not all at once.", "Augmente la résistance progressivement."),
    ],
    mistakes: [
      t("Seat too low, so the knees feel cramped.", "Selle trop basse, genoux écrasés."),
      t("Hips rocking side to side.", "Bassin qui se balance."),
    ],
    difficulty: 1,
    repRange: [600, 1200],
    timed: true,
  },
  'Elliptical_Trainer': {
    nameFr: "Vélo elliptique",
    cues: [
      t("Stand tall, pushing and pulling the handles.", "Tiens-toi droit, pousse et tire les poignées."),
      t("Keep your heels down with smooth strides.", "Talons posés, foulées fluides."),
      t("Pick a pace you could hold for 15 minutes.", "Choisis un rythme que tu pourrais tenir 15 minutes."),
    ],
    mistakes: [
      t("Leaning heavily on the handles.", "S'appuyer lourdement sur les poignées."),
      t("Staying up on your toes the whole time.", "Rester sur la pointe des pieds."),
    ],
    difficulty: 1,
    repRange: [600, 1200],
    timed: true,
  },
  'Recumbent_Bike': {
    nameFr: "Vélo semi-allongé",
    cues: [
      t("Sit back fully and adjust the seat for a slight knee bend.", "Dos bien calé, règle le siège pour un genou légèrement plié."),
      t("Pedal at a steady pace where you can still talk.", "Pédale à un rythme régulier où tu peux encore parler."),
      t("A great choice if your back or knees are sensitive.", "Idéal si ton dos ou tes genoux sont sensibles."),
    ],
    mistakes: [
      t("Seat too close, so the knees bend too much.", "Siège trop près, genoux trop pliés."),
      t("Resistance too high at the start.", "Résistance trop forte au début."),
    ],
    difficulty: 1,
    repRange: [600, 1200],
    timed: true,
  },
  'Rowing_Stationary': {
    nameFr: "Rameur",
    cues: [
      t("Order: legs push, then lean back, then arms pull.", "Ordre : jambes, puis buste en arrière, puis bras."),
      t("Return: arms, then body, then bend the knees.", "Retour : bras, puis buste, puis plie les genoux."),
      t("Keep your back straight, not rounded.", "Garde le dos droit, pas arrondi."),
    ],
    mistakes: [
      t("Pulling with the arms before the legs push.", "Tirer avec les bras avant de pousser avec les jambes."),
      t("Rounding the back at the front of the stroke.", "Arrondir le dos à l'avant du mouvement."),
    ],
    difficulty: 2,
    avoidIf: ['lower_back'],
    repRange: [300, 900],
    timed: true,
  },
  'Stairmaster': {
    nameFr: "Simulateur d'escalier (Stairmaster)",
    cues: [
      t("Start slow with your whole foot on each step.", "Commence lentement, pied entier sur chaque marche."),
      t("Stand tall; hands only lightly on the rails.", "Tiens-toi droit, mains juste posées sur les barres."),
      t("Push through your heels.", "Pousse dans les talons."),
    ],
    mistakes: [
      t("Hanging on the rails with straight arms.", "S'appuyer sur les barres bras tendus."),
      t("Tiny steps on your toes.", "Petits pas sur la pointe des pieds."),
    ],
    difficulty: 2,
    avoidIf: ['knees'],
    repRange: [300, 900],
    timed: true,
  },
  'Mountain_Climbers': {
    nameFr: "Mountain climbers (grimpeurs)",
    cues: [
      t("High plank, hands under your shoulders.", "Planche bras tendus, mains sous les épaules."),
      t("Drive one knee toward your chest, then switch.", "Ramène un genou vers la poitrine, puis change."),
      t("Keep your hips low and level.", "Garde les hanches basses et stables."),
      t("Start slow, then speed up.", "Commence lentement, puis accélère."),
    ],
    mistakes: [
      t("Butt bouncing up high.", "Fesses qui montent haut."),
      t("Shoulders drifting behind the hands.", "Épaules qui reculent derrière les mains."),
    ],
    difficulty: 1,
    avoidIf: ['wrists'],
    repRange: [20, 40],
    timed: true,
  },
  'Star_Jump': {
    nameFr: "Sauts en étoile",
    cues: [
      t("Quarter squat, then jump up spreading arms and legs.", "Petit squat, puis saute en écartant bras et jambes."),
      t("Bring your limbs back in before landing.", "Ramène bras et jambes avant d'atterrir."),
      t("Land softly with bent knees.", "Atterris en douceur, genoux fléchis."),
    ],
    mistakes: [
      t("Landing with straight, stiff legs.", "Atterrir jambes tendues et raides."),
      t("Knees caving in on landing.", "Genoux qui rentrent à l'atterrissage."),
    ],
    difficulty: 2,
    avoidIf: ['knees'],
    repRange: [20, 40],
    timed: true,
  },
  'Fast_Skipping': {
    nameFr: "Skipping rapide",
    cues: [
      t("Skip with a quick step-hop rhythm.", "Sautille avec un rythme pas-saut rapide."),
      t("Stay light and close to the ground.", "Reste léger et proche du sol."),
      t("Swing your arms in rhythm with your legs.", "Balance les bras au rythme des jambes."),
    ],
    mistakes: [
      t("Jumping high instead of moving quickly.", "Sauter haut au lieu d'aller vite."),
      t("Landing flat-footed and heavy.", "Atterrir pied à plat et lourdement."),
    ],
    difficulty: 1,
    avoidIf: ['knees'],
    repRange: [20, 40],
    timed: true,
  },
  'Trail_Running_Walking': {
    nameFr: "Marche rapide / footing en extérieur",
    cues: [
      t("Start with a brisk walk; jog only when that feels easy.", "Commence par marcher vite, ne cours que quand c'est facile."),
      t("Wear good shoes and take short steps downhill.", "Porte de bonnes chaussures et fais de petits pas en descente."),
      t("Breathe steadily; you should be able to talk.", "Respire régulièrement, tu dois pouvoir parler."),
    ],
    mistakes: [
      t("Going too fast, too soon.", "Partir trop vite, trop tôt."),
      t("Long, pounding strides downhill.", "Grandes foulées lourdes en descente."),
    ],
    difficulty: 1,
    repRange: [900, 1800],
    timed: true,
  },
};
