// Shared domain types for Tounsi Fit.

export type { LocalizedText } from '@/lib/i18n';
import type { LocalizedText } from '@/lib/i18n';
import type { RamadanSettings } from '@/lib/ramadan';

export type Sex = 'male' | 'female';
export type Goal =
  | 'lose_fat'
  | 'build_muscle'
  | 'recomp'
  | 'maintain'
  | 'strength'
  | 'health';
export type Pace = 'relaxed' | 'moderate' | 'fast';
export type JobActivity = 'desk' | 'standing' | 'physical';
export type Experience = 'none' | 'beginner' | 'intermediate' | 'advanced';
export type EquipmentProfile = 'gym' | 'dumbbells' | 'bodyweight' | 'bands';
export type Limitation = 'knees' | 'lower_back' | 'shoulders' | 'wrists';
export type DietPref =
  | 'halal'
  | 'vegetarian'
  | 'lactose_free'
  | 'gluten_free'
  | 'no_seafood';

export interface FastingSettings {
  enabled: boolean;
  startTime: string; // HH:MM, when the fast starts (evening)
  endTime: string; // HH:MM, when eating starts again
}

export interface Profile {
  name: string;
  sex: Sex;
  age: number;
  heightCm: number;
  weightKg: number;
  targetWeightKg?: number;
  bodyFatPct?: number;
  goal: Goal;
  pace: Pace;
  job: JobActivity;
  dailySteps: number; // typical steps per day right now
  experience: Experience;
  trainingDays: number; // sessions per week the user can commit to
  sessionMinutes: number;
  equipment: EquipmentProfile;
  limitations: Limitation[];
  dietPrefs: DietPref[];
  mealsPerDay: number;
  fasting: FastingSettings;
  createdAt: string;
  updatedAt: string;
}

export interface MacroTargets {
  protein: number;
  carbs: number;
  fat: number;
  fiber: number;
}

export type PlanWarning =
  | 'floor_applied' // calories were raised to the safety floor
  | 'deficit_capped' // requested pace was too aggressive and was capped
  | 'target_unrealistic' // target weight implies BMI < 18.5
  | 'low_bmi' // current BMI already low for a fat-loss goal
  | 'high_bmi_protein' // protein based on goal weight because BMI > 30
  | 'one_meal'; // one meal a day: protein in a single sitting needs planning

export interface NutritionPlan {
  bmr: number;
  neat: number; // daily-life movement (job + steps)
  exercise: number; // average daily burn from planned training
  tef: number; // thermic effect of food
  tdee: number;
  targetCalories: number;
  /** Positive = deficit (eating below TDEE), negative = surplus. */
  dailyDelta: number;
  /** Expected bodyweight change per week in kg (negative = loss). */
  weeklyChangeKg: number;
  weeksToGoal?: number;
  macros: MacroTargets;
  waterMl: number;
  stepsTarget: number;
  bmi: number;
  warnings: PlanWarning[];
  /** 'formula' until enough logged data exists, then 'adaptive'. */
  tdeeSource: 'formula' | 'adaptive';
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';
export type FoodSource =
  | 'photo'
  | 'barcode'
  | 'search'
  | 'manual'
  | 'ai_text'
  | 'quick';

export interface NutritionValues {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

export interface FoodEntry extends NutritionValues {
  id: string;
  date: string; // YYYY-MM-DD (local)
  meal: MealType;
  name: string;
  grams?: number;
  servingLabel?: string;
  source: FoodSource;
  createdAt: string;
  note?: string;
}

export interface WeightEntry {
  date: string; // YYYY-MM-DD
  kg: number;
}

export interface PlannedExercise {
  exerciseId: string;
  slot: string;
  sets: number;
  repsMin: number;
  repsMax: number;
  timed?: boolean; // reps are seconds
  restSec: number;
  alternatives: string[];
}

export interface WorkoutDay {
  id: string;
  name: LocalizedText;
  focus: string[]; // muscle groups emphasised (free-exercise-db vocabulary)
  exercises: PlannedExercise[];
}

export interface WorkoutPlan {
  id: string;
  createdAt: string;
  splitId: string;
  splitName: LocalizedText;
  splitWhy: LocalizedText;
  daysPerWeek: number;
  days: WorkoutDay[];
  cardio: LocalizedText;
}

export interface LoggedSet {
  exerciseId: string;
  reps: number;
  weightKg: number;
  done: boolean;
}

export interface WorkoutSession {
  id: string;
  date: string;
  dayId: string;
  dayName: LocalizedText;
  startedAt: string;
  finishedAt?: string;
  sets: LoggedSet[];
}

/** Cardio machines and outdoor activities the cardio log knows. */
export type CardioMachine = 'treadmill' | 'walk' | 'run' | 'bike' | 'elliptical' | 'rower' | 'stairs' | 'other';
export type CardioEffort = 'easy' | 'moderate' | 'hard';

/** One steady part of a cardio session (e.g. 20 min at 5.5 km/h, incline 7%). */
export interface CardioSegment {
  minutes: number;
  /** km/h (treadmill, walk, run). */
  speedKmh?: number;
  /** Treadmill incline, %. */
  inclinePct?: number;
  /** Level or resistance as shown on the machine (bike, elliptical, rower, stairs). */
  level?: number;
  /** How hard it felt, for parts without a speed (drives the calorie estimate). */
  effort?: CardioEffort;
}

export interface CardioSession {
  id: string;
  date: string;
  machine: CardioMachine;
  segments: CardioSegment[];
  /** Estimates fixed at save time (body weight then), so history never shifts. */
  kcal: number;
  distanceKm?: number;
  createdAt: string;
  updatedAt?: string;
}

export interface HealthDay {
  date: string;
  steps?: number;
  activeKcal?: number;
  totalKcal?: number;
  exerciseMinutes?: number;
  restingHr?: number;
  sleepMinutes?: number;
  syncedAt: string;
}

export interface AppSettings {
  geminiApiKey?: string; // stored in SecureStore on device, never synced
  healthConnectEnabled: boolean;
  cloudBackupEnabled: boolean;
  lastBackupAt?: string;
  /** Google account (Firebase uid) this phone's data is linked to; cloud backup runs only for it. */
  cloudSyncedUid?: string;
  lastHealthSyncAt?: string;
  readLessons?: string[];
  /** Folder (Android storage access URI) the automatic backup file is written to. */
  fileBackupDirUri?: string;
  /** Readable name of that folder, for the settings row. */
  fileBackupDirName?: string;
  fileBackupAt?: string;
  /** Ramadan mode (fasting days, prayer times, lighter sessions). */
  ramadan?: RamadanSettings;
}
