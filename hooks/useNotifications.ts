// Keeps the phone's reminders in step with the app (rebuilt shortly after any
// change they depend on, and when the app comes back to the foreground), and
// opens the right screen when a notification is tapped.

import { useEffect, useState } from 'react';
import { AppState } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useRouter, type Href } from 'expo-router';
import { useAppData } from '@/contexts/AppDataContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { useRamadanSettings } from '@/hooks/useRamadan';
import { notificationSettings, plannedReminders } from '@/lib/reminders';
import { scheduleOf } from '@/lib/schedule';
import { nextWorkoutDay } from '@/lib/workoutGenerator';
import { notificationsSupported, setupChannels, syncReminders } from '@/services/notifications';

export function useNotificationSync() {
  const router = useRouter();
  const { ready, profile, settings, workoutPlan, sessions, foods, weights, today } = useAppData();
  const { language } = useLanguage();
  const [ramadan] = useRamadanSettings();
  const [foregrounds, setForegrounds] = useState(0);

  useEffect(() => {
    if (!notificationsSupported) return;
    const sub = AppState.addEventListener('change', (s) => s === 'active' && setForegrounds((n) => n + 1));
    return () => sub.remove();
  }, []);

  useEffect(() => {
    if (notificationsSupported) setupChannels(language).catch(() => undefined);
  }, [language]);

  useEffect(() => {
    if (!notificationsSupported || !ready || !profile) return;
    const id = setTimeout(() => {
      const list = plannedReminders({
        now: new Date(),
        today,
        language,
        settings: notificationSettings(settings.notifications),
        schedule: scheduleOf(settings, profile),
        plan: workoutPlan,
        nextDayId: nextWorkoutDay(workoutPlan, sessions)?.id,
        sessionMinutes: profile.sessionMinutes,
        sessions,
        foods,
        weights,
        ramadan,
      });
      syncReminders(list).catch(() => undefined);
    }, 1500);
    return () => clearTimeout(id);
  }, [ready, profile, settings, workoutPlan, sessions, foods, weights, today, language, ramadan, foregrounds]);

  // A tapped notification opens its screen (also when it started the app).
  useEffect(() => {
    if (!notificationsSupported || !ready) return;
    const open = (response: Notifications.NotificationResponse | null) => {
      const url = response?.notification.request.content.data?.url;
      if (typeof url === 'string' && url) router.push(url as Href);
      // Handled: the next launch must not open it again.
      if (response) Notifications.clearLastNotificationResponse();
    };
    open(Notifications.getLastNotificationResponse());
    const sub = Notifications.addNotificationResponseReceivedListener(open);
    return () => sub.remove();
  }, [ready, router]);
}
