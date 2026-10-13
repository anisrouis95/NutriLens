// Ramadan mode state for screens: today's fast for the user's governorate,
// where "now" sits in it (ticking every 30 s), and the settings setter.

import { useCallback, useEffect, useMemo, useState } from 'react';
import { useAppData } from '@/contexts/AppDataContext';
import {
  DEFAULT_RAMADAN,
  fastDay,
  fastNow,
  governorate,
  isFastingDay,
  nextRamadan,
  ramadanOn,
  shiftDate,
  trainingWindows,
  type RamadanSettings,
} from '@/lib/ramadan';

export function useNow(intervalMs = 30000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}

export function useRamadanSettings() {
  const { settings, updateSettings } = useAppData();
  const value = useMemo<RamadanSettings>(() => ({ ...DEFAULT_RAMADAN, ...settings.ramadan }), [settings.ramadan]);
  const update = useCallback(
    (patch: Partial<RamadanSettings>) => updateSettings({ ramadan: { ...value, ...patch } }),
    [updateSettings, value],
  );
  return [value, update] as const;
}

/** Everything a screen needs to show Ramadan mode. `fasting` is false on non-fasting days. */
export function useRamadan() {
  const { today } = useAppData();
  const [settings, update] = useRamadanSettings();
  const now = useNow();
  const fasting = isFastingDay(settings, today);
  const period = ramadanOn(today, settings.shiftDays);
  const next = period ? null : nextRamadan(today, settings.shiftDays);
  const day = useMemo(() => fastDay(today, settings.city), [today, settings.city]);
  const tomorrow = useMemo(() => fastDay(shiftDate(today, 1), settings.city), [today, settings.city]);
  return {
    settings,
    update,
    fasting,
    /** Ramadan's dates contain today (whatever the mode). */
    period,
    /** The coming Ramadan, when today is outside one. */
    next,
    city: governorate(settings.city),
    day,
    tomorrow,
    now,
    state: fastNow(day, tomorrow, now),
    windows: trainingWindows(day),
    /** Not fasting today although it's a fasting day by the calendar (travel, illness, period). */
    skippedToday: !!settings.skipDates?.includes(today),
  };
}
