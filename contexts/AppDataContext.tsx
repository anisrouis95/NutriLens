import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {
  AppSettings,
  FoodEntry,
  HealthDay,
  NutritionPlan,
  Profile,
  WeightEntry,
  WorkoutPlan,
  WorkoutSession,
} from '@/types';
import {
  STORAGE_KEYS,
  clearAppData,
  loadJSON,
  newId,
  saveJSON,
} from '@/lib/storage';
import {
  AdaptiveTdeeResult,
  addDays,
  computePlan,
  estimateAdaptiveTdee,
  formulaTdee,
  toDateKey,
} from '@/lib/nutritionMath';

export interface AppDataSnapshot {
  version: 1;
  exportedAt: string;
  profile: Profile | null;
  foods: FoodEntry[];
  weights: WeightEntry[];
  workoutPlan: WorkoutPlan | null;
  sessions: WorkoutSession[];
}

interface AppDataContextType {
  ready: boolean;
  today: string;
  profile: Profile | null;
  plan: NutritionPlan | null;
  adaptive: AdaptiveTdeeResult | null;
  measuredSteps?: number;
  saveProfile: (profile: Profile) => void;

  foods: FoodEntry[];
  foodsForDate: (date: string) => FoodEntry[];
  addFoods: (entries: Omit<FoodEntry, 'id' | 'createdAt'>[]) => void;
  updateFood: (id: string, patch: Partial<FoodEntry>) => void;
  deleteFood: (id: string) => void;

  weights: WeightEntry[];
  logWeight: (kg: number, date?: string) => void;
  deleteWeight: (date: string) => void;

  workoutPlan: WorkoutPlan | null;
  setWorkoutPlan: (plan: WorkoutPlan | null) => void;
  sessions: WorkoutSession[];
  saveSession: (session: WorkoutSession) => void;
  deleteSession: (id: string) => void;

  health: Record<string, HealthDay>;
  mergeHealthDays: (days: HealthDay[]) => void;

  settings: AppSettings;
  updateSettings: (patch: Partial<AppSettings>) => void;

  exportSnapshot: () => AppDataSnapshot;
  importSnapshot: (snapshot: AppDataSnapshot) => void;
  resetAll: () => Promise<void>;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

const DEFAULT_SETTINGS: AppSettings = {
  healthConnectEnabled: false,
  cloudBackupEnabled: false,
};

/** Persists `value` under `key` whenever it changes after the initial load. */
function usePersist(key: string, value: unknown, ready: boolean) {
  const first = useRef(true);
  useEffect(() => {
    if (!ready) return;
    if (first.current) {
      first.current = false;
      return;
    }
    saveJSON(key, value);
  }, [key, value, ready]);
}

export function AppDataProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [foods, setFoods] = useState<FoodEntry[]>([]);
  const [weights, setWeights] = useState<WeightEntry[]>([]);
  const [workoutPlan, setWorkoutPlanState] = useState<WorkoutPlan | null>(null);
  const [sessions, setSessions] = useState<WorkoutSession[]>([]);
  const [health, setHealth] = useState<Record<string, HealthDay>>({});
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [today, setToday] = useState(toDateKey());

  useEffect(() => {
    (async () => {
      const [p, f, w, wp, s, h, st] = await Promise.all([
        loadJSON<Profile | null>(STORAGE_KEYS.profile, null),
        loadJSON<FoodEntry[]>(STORAGE_KEYS.foods, []),
        loadJSON<WeightEntry[]>(STORAGE_KEYS.weights, []),
        loadJSON<WorkoutPlan | null>(STORAGE_KEYS.workoutPlan, null),
        loadJSON<WorkoutSession[]>(STORAGE_KEYS.sessions, []),
        loadJSON<Record<string, HealthDay>>(STORAGE_KEYS.health, {}),
        loadJSON<AppSettings>(STORAGE_KEYS.settings, DEFAULT_SETTINGS),
      ]);
      setProfile(p);
      setFoods(f);
      setWeights(w);
      setWorkoutPlanState(wp);
      setSessions(s);
      setHealth(h);
      setSettings({ ...DEFAULT_SETTINGS, ...st });
      setReady(true);
    })();
  }, []);

  // Roll the date over at midnight while the app stays open.
  useEffect(() => {
    const timer = setInterval(() => {
      const now = toDateKey();
      setToday((prev) => (prev === now ? prev : now));
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  usePersist(STORAGE_KEYS.profile, profile, ready);
  usePersist(STORAGE_KEYS.foods, foods, ready);
  usePersist(STORAGE_KEYS.weights, weights, ready);
  usePersist(STORAGE_KEYS.workoutPlan, workoutPlan, ready);
  usePersist(STORAGE_KEYS.sessions, sessions, ready);
  usePersist(STORAGE_KEYS.health, health, ready);
  usePersist(STORAGE_KEYS.settings, settings, ready);

  // Average steps measured by the phone/watch over the last 14 days.
  const measuredSteps = useMemo(() => {
    if (!settings.healthConnectEnabled) return undefined;
    const from = addDays(today, -14);
    const values = Object.values(health)
      .filter((d) => d.date >= from && d.date < today && (d.steps ?? 0) > 0)
      .map((d) => d.steps as number);
    if (values.length < 7) return undefined;
    return Math.round(values.reduce((a, b) => a + b, 0) / values.length);
  }, [health, today, settings.healthConnectEnabled]);

  const adaptive = useMemo(() => {
    if (!profile) return null;
    return estimateAdaptiveTdee(
      foods,
      weights,
      formulaTdee(profile, measuredSteps),
      today,
    );
  }, [profile, foods, weights, today, measuredSteps]);

  const plan = useMemo(() => {
    if (!profile) return null;
    return computePlan(profile, {
      measuredSteps,
      adaptiveTdee: adaptive && adaptive.confidence >= 0.5 ? adaptive.tdee : undefined,
    });
  }, [profile, measuredSteps, adaptive]);

  const saveProfile = useCallback((p: Profile) => {
    setProfile({ ...p, updatedAt: new Date().toISOString() });
  }, []);

  const foodsForDate = useCallback(
    (date: string) =>
      foods
        .filter((f) => f.date === date)
        .sort((a, b) => a.createdAt.localeCompare(b.createdAt)),
    [foods],
  );

  const addFoods = useCallback(
    (entries: Omit<FoodEntry, 'id' | 'createdAt'>[]) => {
      const now = new Date().toISOString();
      setFoods((prev) => [
        ...prev,
        ...entries.map((e) => ({ ...e, id: newId(), createdAt: now })),
      ]);
    },
    [],
  );

  const updateFood = useCallback((id: string, patch: Partial<FoodEntry>) => {
    setFoods((prev) => prev.map((f) => (f.id === id ? { ...f, ...patch } : f)));
  }, []);

  const deleteFood = useCallback((id: string) => {
    setFoods((prev) => prev.filter((f) => f.id !== id));
  }, []);

  const logWeight = useCallback(
    (kg: number, date?: string) => {
      const day = date ?? toDateKey();
      setWeights((prev) => {
        const next = prev.filter((w) => w.date !== day);
        next.push({ date: day, kg });
        next.sort((a, b) => a.date.localeCompare(b.date));
        return next;
      });
      // Keep the profile weight in sync with the most recent weigh-in.
      setProfile((p) => {
        if (!p) return p;
        const latest = weights.reduce(
          (max, w) => (w.date > max ? w.date : max),
          '',
        );
        if (day < latest) return p;
        return { ...p, weightKg: kg, updatedAt: new Date().toISOString() };
      });
    },
    [weights],
  );

  const deleteWeight = useCallback((date: string) => {
    setWeights((prev) => prev.filter((w) => w.date !== date));
  }, []);

  const setWorkoutPlan = useCallback((wp: WorkoutPlan | null) => {
    setWorkoutPlanState(wp);
  }, []);

  const saveSession = useCallback((session: WorkoutSession) => {
    setSessions((prev) => {
      const exists = prev.some((s) => s.id === session.id);
      return exists
        ? prev.map((s) => (s.id === session.id ? session : s))
        : [...prev, session];
    });
  }, []);

  const deleteSession = useCallback((id: string) => {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  const mergeHealthDays = useCallback((days: HealthDay[]) => {
    setHealth((prev) => {
      const next = { ...prev };
      for (const d of days) next[d.date] = { ...next[d.date], ...d };
      return next;
    });
  }, []);

  const updateSettings = useCallback((patch: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...patch }));
  }, []);

  const exportSnapshot = useCallback(
    (): AppDataSnapshot => ({
      version: 1,
      exportedAt: new Date().toISOString(),
      profile,
      foods,
      weights,
      workoutPlan,
      sessions,
    }),
    [profile, foods, weights, workoutPlan, sessions],
  );

  const importSnapshot = useCallback((snap: AppDataSnapshot) => {
    setProfile(snap.profile ?? null);
    setFoods(snap.foods ?? []);
    setWeights(snap.weights ?? []);
    setWorkoutPlanState(snap.workoutPlan ?? null);
    setSessions(snap.sessions ?? []);
  }, []);

  const resetAll = useCallback(async () => {
    await clearAppData();
    setProfile(null);
    setFoods([]);
    setWeights([]);
    setWorkoutPlanState(null);
    setSessions([]);
    setHealth({});
    setSettings(DEFAULT_SETTINGS);
  }, []);

  const value: AppDataContextType = {
    ready,
    today,
    profile,
    plan,
    adaptive,
    measuredSteps,
    saveProfile,
    foods,
    foodsForDate,
    addFoods,
    updateFood,
    deleteFood,
    weights,
    logWeight,
    deleteWeight,
    workoutPlan,
    setWorkoutPlan,
    sessions,
    saveSession,
    deleteSession,
    health,
    mergeHealthDays,
    settings,
    updateSettings,
    exportSnapshot,
    importSnapshot,
    resetAll,
  };

  return (
    <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
  );
}

export function useAppData() {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
}
