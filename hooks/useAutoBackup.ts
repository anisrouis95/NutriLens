// Automatic file backup: once a backup folder is chosen (Settings), every
// change to the user's data is written there a few seconds later, and right
// away when the app goes to the background. Failures stay silent here; the
// Settings row shows the last successful backup time.

import { useCallback, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { useAppData } from '@/contexts/AppDataContext';
import { fileBackupSupported, writeBackup } from '@/lib/fileBackup';

const DEBOUNCE_MS = 15000;

export function useBackupNow() {
  const { settings, exportSnapshot, updateSettings, today } = useAppData();
  return useCallback(
    (dirUri = settings.fileBackupDirUri) => {
      if (!dirUri) throw new Error('no folder');
      writeBackup(dirUri, exportSnapshot(), today);
      updateSettings({ fileBackupAt: new Date().toISOString() });
    },
    [settings.fileBackupDirUri, exportSnapshot, updateSettings, today],
  );
}

export function useAutoBackup() {
  const { ready, settings, profile, foods, weights, workoutPlan, sessions, cardio } = useAppData();
  const backupNow = useBackupNow();
  const latest = useRef(backupNow);
  latest.current = backupNow;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dir = settings.fileBackupDirUri;

  const flush = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    try {
      latest.current();
    } catch {
      // Folder removed or access revoked: Settings shows the stale time.
    }
  }, []);

  // Data changed (or the app just opened): back up shortly after it settles.
  useEffect(() => {
    if (!ready || !dir || !fileBackupSupported) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(flush, DEBOUNCE_MS);
  }, [ready, dir, profile, foods, weights, workoutPlan, sessions, cardio, flush]);

  // Leaving the app: write any pending change now.
  useEffect(() => {
    const sub = AppState.addEventListener('change', (state) => {
      if (state !== 'active' && timer.current) flush();
    });
    return () => {
      sub.remove();
      if (timer.current) clearTimeout(timer.current);
    };
  }, [flush]);
}
