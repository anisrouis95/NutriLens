import { useCallback, useEffect, useState } from 'react';
import { useAppData } from '@/contexts/AppDataContext';
import {
  HealthStatus,
  getHealthStatus,
  readHealthWeights,
  syncHealthDays,
} from '@/services/healthConnect';

const AUTO_SYNC_MS = 15 * 60 * 1000;

/** Pulls steps, calories, sleep and weigh-ins from Health Connect. */
export function useHealthSync(auto = false) {
  const { settings, updateSettings, mergeHealthDays, weights, logWeight } = useAppData();
  const [status, setStatus] = useState<HealthStatus | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getHealthStatus().then(setStatus);
  }, []);

  const sync = useCallback(async () => {
    setSyncing(true);
    setError(null);
    try {
      const days = await syncHealthDays(14);
      mergeHealthDays(days);
      // Import weigh-ins from a smart scale / another app for days not logged here.
      const known = new Set(weights.map((w) => w.date));
      const imported = await readHealthWeights(60);
      for (const w of imported.sort((a, b) => a.date.localeCompare(b.date))) {
        if (!known.has(w.date)) logWeight(w.kg, w.date);
      }
      updateSettings({ lastHealthSyncAt: new Date().toISOString() });
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setSyncing(false);
    }
  }, [mergeHealthDays, weights, logWeight, updateSettings]);

  useEffect(() => {
    if (!auto || !settings.healthConnectEnabled || status !== 'available') return;
    const last = settings.lastHealthSyncAt ? Date.parse(settings.lastHealthSyncAt) : 0;
    if (Date.now() - last > AUTO_SYNC_MS) sync();
    // Only on mount / when the connection becomes available.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [auto, settings.healthConnectEnabled, status]);

  return { status, syncing, error, sync };
}
