// Lock-screen presses reach the workout: the open workout screen takes them
// itself (it registers in `liveWorkout.take`); otherwise they're applied to
// the saved unfinished session. Opening the app after Android closed it during
// a workout goes straight back to that workout.

import { useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { useRouter } from 'expo-router';
import { useAppData } from '@/contexts/AppDataContext';
import { applyLiveEvents } from '@/lib/liveEvents';
import { drainLive, liveTimerAvailable, onLiveEvent, peekLive, stopLive } from '@/modules/live-timer';

/** Set by the open workout screen: it drains and applies the presses with its own rules. */
export const liveWorkout: { take: (() => void) | null } = { take: null };

export function useLiveWorkoutSync() {
  const router = useRouter();
  const { ready, sessions, saveSession } = useAppData();
  const latest = useRef(sessions);
  latest.current = sessions;
  const started = useRef(false);

  useEffect(() => {
    if (!ready || !liveTimerAvailable) return;
    const apply = () => {
      if (liveWorkout.take) {
        liveWorkout.take();
        return;
      }
      const events = drainLive();
      if (!events.length) return;
      const live = peekLive();
      const session = latest.current.find((s) => !s.finishedAt && s.dayId === live?.dayId);
      if (session) saveSession(applyLiveEvents(session, events));
    };

    if (!started.current) {
      started.current = true;
      const live = peekLive();
      if (live) {
        // The workout screen drains the presses when it opens.
        if (latest.current.some((s) => !s.finishedAt && s.dayId === live.dayId)) {
          setTimeout(() => router.push({ pathname: '/workout/[dayId]', params: { dayId: live.dayId } }), 0);
        } else {
          stopLive();
        }
      }
    }

    const state = AppState.addEventListener('change', (s) => s === 'active' && apply());
    const off = onLiveEvent(apply);
    return () => {
      state.remove();
      off();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);
}
