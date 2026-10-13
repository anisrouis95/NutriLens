// Google account backup (Firebase, free). Signing in links this phone to the
// account's backup without ever overwriting it by accident:
//   - the account has no backup      → this phone's data is uploaded
//   - this phone has no data yet     → the account's backup is restored
//   - both have data                 → the user chooses which one to keep
// Only after that choice ("synced") does useCloudBackup upload changes.

import { useCallback, useEffect, useRef, useState } from 'react';
import { AppState } from 'react-native';
import { useAppData, type AppDataSnapshot } from '@/contexts/AppDataContext';
import { googleSignInAvailability, signInWithGoogle, signOut, useAuthUser } from '@/services/auth';
import { backupToCloud, restoreFromCloud } from '@/services/cloudSync';

const DEBOUNCE_MS = 20000;

const hasData = (s: Pick<AppDataSnapshot, 'profile' | 'sessions' | 'foods' | 'cardio'>) =>
  !!s.profile && (s.sessions.length > 0 || s.foods.length > 0 || (s.cardio?.length ?? 0) > 0);

/** Counts shown before a restore or a keep-which choice. */
export function snapshotCounts(s: Pick<AppDataSnapshot, 'sessions' | 'foods' | 'cardio' | 'weights'>) {
  return {
    workouts: s.sessions.filter((x) => x.sets.some((set) => set.done)).length,
    cardio: s.cardio?.length ?? 0,
    foods: s.foods.length,
    weighIns: s.weights.length,
  };
}

export type SyncResult = 'uploaded' | 'restored' | 'choose' | 'cancelled';

export function useGoogleSync() {
  const user = useAuthUser();
  const { exportSnapshot, importSnapshot, updateSettings, settings } = useAppData();
  const [busy, setBusy] = useState<'signin' | 'signout' | 'backup' | 'restore' | null>(null);
  const [error, setError] = useState<string | null>(null);
  /** The account's backup when both it and this phone have data: the user picks one. */
  const [choice, setChoice] = useState<{ uid: string; cloud: AppDataSnapshot } | null>(null);

  const markSynced = useCallback(
    (uid: string) => updateSettings({ cloudSyncedUid: uid, cloudBackupEnabled: true }),
    [updateSettings],
  );
  const upload = useCallback(
    async (uid: string) => {
      await backupToCloud(uid, exportSnapshot());
      updateSettings({ lastBackupAt: new Date().toISOString() });
    },
    [exportSnapshot, updateSettings],
  );

  /** Compares this phone with the account's backup (see the header). */
  const link = useCallback(
    async (uid: string): Promise<SyncResult> => {
      const cloud = await restoreFromCloud(uid);
      const local = exportSnapshot();
      if (!cloud || !hasData(cloud)) {
        markSynced(uid);
        if (hasData(local)) await upload(uid);
        return 'uploaded';
      }
      if (!hasData(local)) {
        importSnapshot(cloud);
        markSynced(uid);
        return 'restored';
      }
      setChoice({ uid, cloud });
      return 'choose';
    },
    [exportSnapshot, importSnapshot, markSynced, upload],
  );

  const run = useCallback(async <T,>(kind: NonNullable<typeof busy>, fn: () => Promise<T>): Promise<T | undefined> => {
    setBusy(kind);
    setError(null);
    try {
      return await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      return undefined;
    } finally {
      setBusy(null);
    }
  }, []);

  const signIn = useCallback(
    () =>
      run('signin', async () => {
        const u = await signInWithGoogle();
        if (!u) return 'cancelled' as SyncResult;
        return link(u.uid);
      }),
    [run, link],
  );

  const backupNow = useCallback(() => run('backup', async () => (user ? upload(user.uid) : undefined)), [run, upload, user]);

  /** Re-checks the account (e.g. a sign-in from before this flow existed). */
  const relink = useCallback(() => run('restore', async () => (user ? link(user.uid) : undefined)), [run, link, user]);

  /** Replaces this phone's data with the account's backup (explicit restore). */
  const restoreNow = useCallback(
    () =>
      run('restore', async () => {
        if (!user) return 'none' as const;
        const cloud = await restoreFromCloud(user.uid);
        if (!cloud || !hasData(cloud)) return 'none' as const;
        importSnapshot(cloud);
        markSynced(user.uid);
        return 'restored' as const;
      }),
    [run, user, importSnapshot, markSynced],
  );

  const keepCloud = useCallback(() => {
    if (!choice) return;
    importSnapshot(choice.cloud);
    markSynced(choice.uid);
    setChoice(null);
  }, [choice, importSnapshot, markSynced]);

  const keepPhone = useCallback(
    () =>
      run('backup', async () => {
        if (!choice) return;
        markSynced(choice.uid);
        await upload(choice.uid);
        setChoice(null);
      }),
    [run, choice, markSynced, upload],
  );

  const leave = useCallback(
    () =>
      run('signout', async () => {
        await signOut();
        updateSettings({ cloudSyncedUid: undefined });
      }),
    [run, updateSettings],
  );

  return {
    user,
    availability: googleSignInAvailability(),
    synced: !!user && settings.cloudSyncedUid === user.uid,
    busy,
    error,
    choice,
    signIn,
    backupNow,
    relink,
    restoreNow,
    keepCloud,
    keepPhone,
    dismissChoice: () => setChoice(null),
    leave,
  };
}

/**
 * Uploads changes to the linked Google account about 20 s after they settle,
 * and right away when the app goes to the background. Mounted once, at the root.
 */
export function useCloudBackup() {
  const user = useAuthUser();
  const { ready, settings, updateSettings, exportSnapshot, profile, foods, weights, workoutPlan, sessions, cardio } = useAppData();
  const active = ready && !!user && !!profile && settings.cloudBackupEnabled && settings.cloudSyncedUid === user.uid;
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latest = useRef<() => Promise<void>>(async () => {});
  latest.current = async () => {
    if (!user) return;
    await backupToCloud(user.uid, exportSnapshot());
    updateSettings({ lastBackupAt: new Date().toISOString() });
  };

  const flush = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    timer.current = null;
    // Offline or a server hiccup: the next change (or the next app start) tries again.
    latest.current().catch(() => {});
  }, []);

  useEffect(() => {
    if (!active) return;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(flush, DEBOUNCE_MS);
  }, [active, profile, foods, weights, workoutPlan, sessions, cardio, flush]);

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
