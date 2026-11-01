// Notifications on the phone: Android channels, the permission, the reminders
// planned by lib/reminders.ts, and the "rest over" alert for phones without the
// lock-screen workout (modules/live-timer posts that one itself). Everything is
// local: no server, no account, nothing leaves the phone. All calls are no-ops
// on the web preview.

import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { pick, type Language, type LocalizedText } from '@/lib/i18n';
import type { ChannelId, Reminder } from '@/lib/reminders';

export const notificationsSupported = Platform.OS === 'android' || Platform.OS === 'ios';
export const VOLT = '#D9FF3D';
const REST_ID = 'rest-over';
const TEST_ID = 'test';

const CHANNELS: Record<ChannelId, { name: LocalizedText; description: LocalizedText; importance: Notifications.AndroidImportance; buzz?: boolean; silent?: boolean }> = {
  // Silent but not "low": Android keeps it expanded on the lock screen, buttons showing.
  'workout-live': {
    name: { en: 'Workout in progress', fr: 'Séance en cours', tn: 'حصّة قاعدة', tnLatn: 'Séance 9a3da' },
    description: {
      en: 'Your next set with Start and Done buttons, and the rest countdown, on the lock screen while you train.',
      fr: 'Ta prochaine série avec les boutons Commencer et Fait, et le compte à rebours du repos, sur l’écran de verrouillage pendant la séance.',
      tn: 'السيري الجاية بالبوطونات ابدا وكمّلت، والعدّ متاع الراحة، على شاشة القفل وقت التمرين.',
      tnLatn: 'Série el jeya bel boutons Ebda w Kammalt, w el compte à rebours mta3 el repos, 3la écran el 9fel wa9t el sport.',
    },
    importance: Notifications.AndroidImportance.DEFAULT,
    silent: true,
  },
  'rest-over': {
    name: { en: 'Rest timer', fr: 'Minuteur de repos', tn: 'وقت الراحة', tnLatn: 'Wa9t el repos' },
    description: {
      en: 'Buzzes when your rest is over.',
      fr: 'Vibre quand ton repos est fini.',
      tn: 'يرعش كي توفى الراحة.',
      tnLatn: 'Yer3ach ki youfa el repos.',
    },
    importance: Notifications.AndroidImportance.HIGH,
    buzz: true,
  },
  training: {
    name: { en: 'Training days', fr: 'Jours d’entraînement', tn: 'أيّام التمرين', tnLatn: 'Iyem el sport' },
    description: {
      en: 'A reminder on your training days.',
      fr: 'Un rappel les jours d’entraînement.',
      tn: 'تذكير في أيّام التمرين.',
      tnLatn: 'Tadhkir f iyem el sport.',
    },
    importance: Notifications.AndroidImportance.DEFAULT,
  },
  'weigh-in': {
    name: { en: 'Weigh-in', fr: 'Pesée', tn: 'الميزان', tnLatn: 'El mizen' },
    description: { en: 'Your weekly weigh-in.', fr: 'Ta pesée de la semaine.', tn: 'الميزان متاع الجمعة.', tnLatn: 'El mizen mta3 el jem3a.' },
    importance: Notifications.AndroidImportance.DEFAULT,
  },
  meals: {
    name: { en: 'Meals', fr: 'Repas', tn: 'الماكلة', tnLatn: 'Makla' },
    description: {
      en: 'Reminders to log meals you have not logged yet.',
      fr: 'Rappels pour noter les repas pas encore notés.',
      tn: 'تذكير باش تسجّل الماكلة اللي مازلت ما سجّلتهاش.',
      tnLatn: 'Tadhkir bech tsajjel el makla eli mazelt ma sajjelthech.',
    },
    importance: Notifications.AndroidImportance.DEFAULT,
  },
  ramadan: {
    name: { en: 'Ramadan', fr: 'Ramadan', tn: 'رمضان', tnLatn: 'Romdhan' },
    description: {
      en: 'End of suhoor and iftar for your governorate.',
      fr: 'Fin du shour et iftar pour ton gouvernorat.',
      tn: 'آخر السحور ووقت الفطور حسب ولايتك.',
      tnLatn: 'E5er shour w wa9t el ftour 7asb wileytek.',
    },
    importance: Notifications.AndroidImportance.HIGH,
    buzz: true,
  },
};

/** Creates (or renames, after a language change) the channels. Android shows them in the app's settings. */
export async function setupChannels(language: Language) {
  if (Platform.OS !== 'android') return;
  // 1.2.0's low-importance workout channel: replaced by 'workout-live' (importance can't change).
  await Notifications.deleteNotificationChannelAsync('workout').catch(() => undefined);
  for (const [id, c] of Object.entries(CHANNELS)) {
    await Notifications.setNotificationChannelAsync(id, {
      name: pick(c.name, language),
      description: pick(c.description, language),
      importance: c.importance,
      lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
      lightColor: VOLT,
      enableVibrate: !c.silent && (!!c.buzz || c.importance >= Notifications.AndroidImportance.DEFAULT),
      vibrationPattern: c.buzz ? [0, 400, 200, 400] : undefined,
      sound: !c.silent && c.importance >= Notifications.AndroidImportance.DEFAULT ? 'default' : null,
      showBadge: false,
    });
  }
}

export type Permission = 'granted' | 'undetermined' | 'denied' | 'unsupported';

export async function permission(): Promise<Permission> {
  if (!notificationsSupported) return 'unsupported';
  const p = await Notifications.getPermissionsAsync();
  return p.granted ? 'granted' : p.canAskAgain ? 'undetermined' : 'denied';
}

/** Asks once; Android 13+ shows the prompt only after a channel exists. */
export async function requestPermission(language: Language): Promise<Permission> {
  if (!notificationsSupported) return 'unsupported';
  await setupChannels(language);
  const p = await Notifications.requestPermissionsAsync();
  return p.granted ? 'granted' : p.canAskAgain ? 'undetermined' : 'denied';
}

// Rest alerts stay quiet while the app is on screen: the workout screen has its own clock and buzz.
if (notificationsSupported) {
  Notifications.setNotificationHandler({
    handleNotification: async (n) => {
      const rest = n.request.identifier === REST_ID;
      return { shouldShowBanner: !rest, shouldShowList: !rest, shouldPlaySound: !rest, shouldSetBadge: false };
    },
  });
}

let lastSynced = '';

/** Replaces the scheduled reminders with `list`; skips the work when nothing changed. */
export async function syncReminders(list: Reminder[]) {
  if (!notificationsSupported) return;
  if ((await permission()) !== 'granted') return;
  const key = JSON.stringify(list.map((r) => [r.id, r.at.getTime(), r.title, r.body]));
  if (key === lastSynced) return;
  lastSynced = key;
  const scheduled = await Notifications.getAllScheduledNotificationsAsync();
  await Promise.all(
    scheduled.filter((n) => n.identifier.startsWith('rem-')).map((n) => Notifications.cancelScheduledNotificationAsync(n.identifier)),
  );
  for (const r of list) {
    await Notifications.scheduleNotificationAsync({
      identifier: r.id,
      content: { title: r.title, body: r.body, data: { url: r.url }, color: VOLT },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: r.at, channelId: r.channel },
    });
  }
}

/** Forget the last sync so the next one rebuilds everything (after the permission is granted). */
export function resetReminderSync() {
  lastSynced = '';
}

/** The buzz at the end of a rest. Exact when the phone allows exact alarms. */
export async function scheduleRestOver(endAt: number, title: string, body: string) {
  if (!notificationsSupported || (await permission()) !== 'granted') return;
  await cancelRestOver();
  await Notifications.scheduleNotificationAsync({
    identifier: REST_ID,
    content: { title, body, color: VOLT, priority: Notifications.AndroidNotificationPriority.HIGH, data: { url: null } },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.DATE, date: new Date(endAt), channelId: 'rest-over' },
  });
}

export async function cancelRestOver() {
  if (!notificationsSupported) return;
  await Notifications.cancelScheduledNotificationAsync(REST_ID).catch(() => undefined);
  await Notifications.dismissNotificationAsync(REST_ID).catch(() => undefined);
}

/** A notification 10 seconds from now: time to lock the phone and see it there. */
export async function sendTest(title: string, body: string) {
  if (!notificationsSupported) return;
  await Notifications.scheduleNotificationAsync({
    identifier: TEST_ID,
    content: { title, body, color: VOLT, data: { url: '/notifications' } },
    trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: 10, channelId: 'training' },
  });
}
