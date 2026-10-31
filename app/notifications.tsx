// Notifications: the permission, what the phone shows during a workout, the
// reminders (training days, weigh-in, meals, Ramadan) with their times, and
// the phone settings that decide whether they arrive on time.

import { useCallback, useEffect, useState } from 'react';
import { AppState, Linking, Platform, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { BellRing, CalendarDays, Dumbbell, MoonStar, Scale, Timer, Utensils, Watch } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppData } from '@/contexts/AppDataContext';
import { Button, Chip, ChipRow, Group, ListItem, RichText, Screen, Section, Stepper, Toggle, Txt, Why, useSnackbar } from '@/components/ds';
import { useRamadanSettings } from '@/hooks/useRamadan';
import { governorate } from '@/lib/ramadan';
import { notificationSettings } from '@/lib/reminders';
import { scheduleOf, WEEK_ORDER } from '@/lib/schedule';
import {
  notificationsSupported,
  permission,
  requestPermission,
  resetReminderSync,
  sendTest,
  type Permission,
} from '@/services/notifications';
import {
  canScheduleExactAlarms,
  isIgnoringBatteryOptimizations,
  liveTimerAvailable,
  openBatterySettings,
  openExactAlarmSettings,
  openNotificationSettings,
} from '@/modules/live-timer';
import type { LocalizedText } from '@/lib/i18n';
import { space, useTokens } from '@/theme';
import type { NotificationSettings } from '@/types';

const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return h * 60 + m;
};
const fromMinutes = (v: number) => `${String(Math.floor(v / 60)).padStart(2, '0')}:${String(v % 60).padStart(2, '0')}`;

/** Phone makers whose battery savers hold notifications back, and where to stop them (menu names vary by version). */
const MAKER_TIPS: { match: RegExp; name: string; steps: LocalizedText }[] = [
  {
    match: /samsung/i,
    name: 'Samsung',
    steps: {
      en: '- Settings → Battery → Background usage limits → Never sleeping apps → add Tounsi Fit.\n- Settings → Notifications → Lock screen notifications → show content, so the rest timer and reminders show in full.',
      fr: '- Paramètres → Batterie → Limites d’utilisation en arrière-plan → Applications jamais en veille → ajoute Tounsi Fit.\n- Paramètres → Notifications → Notifications de l’écran de verrouillage → afficher le contenu, pour voir le minuteur et les rappels en entier.',
      tn: '- Paramètres → Batterie → Limites d’utilisation en arrière-plan → Applications jamais en veille → زيد Tounsi Fit.\n- Paramètres → Notifications → Notifications de l’écran de verrouillage → اختار تورّي المحتوى، باش يبان الوقت والتذكيرات كاملين.',
      tnLatn: '- Paramètres → Batterie → Limites d’utilisation en arrière-plan → Applications jamais en veille → zid Tounsi Fit.\n- Paramètres → Notifications → Notifications de l’écran de verrouillage → e5tar afficher le contenu, bech yban el minuteur w les rappels kamlin.',
    },
  },
  {
    match: /xiaomi|redmi|poco/i,
    name: 'Xiaomi',
    steps: {
      en: '- Settings → Apps → Manage apps → Tounsi Fit → Autostart: on.\n- Same page → Battery saver → No restrictions.\n- Same page → Notifications → allow on the lock screen.',
      fr: '- Paramètres → Applications → Gérer les applications → Tounsi Fit → Démarrage auto : activé.\n- Même page → Économiseur de batterie → Aucune restriction.\n- Même page → Notifications → autoriser sur l’écran de verrouillage.',
      tn: '- Paramètres → Applications → Gérer les applications → Tounsi Fit → Démarrage auto: شعّلو.\n- نفس الصفحة → Économiseur de batterie → Aucune restriction.\n- نفس الصفحة → Notifications → اسمح بيهم على شاشة القفل.',
      tnLatn: '- Paramètres → Applications → Gérer les applications → Tounsi Fit → Démarrage auto: cha33lou.\n- Nafs el page → Économiseur de batterie → Aucune restriction.\n- Nafs el page → Notifications → esma7 bihom 3la écran el 9fel.',
    },
  },
  {
    match: /huawei|honor/i,
    name: 'Huawei / Honor',
    steps: {
      en: '- Settings → Battery → App launch → Tounsi Fit → Manage manually → allow all three.',
      fr: '- Paramètres → Batterie → Lancement d’applications → Tounsi Fit → Gérer manuellement → tout autoriser.',
      tn: '- Paramètres → Batterie → Lancement d’applications → Tounsi Fit → Gérer manuellement → اسمح بالثلاثة.',
      tnLatn: '- Paramètres → Batterie → Lancement d’applications → Tounsi Fit → Gérer manuellement → esma7 bel thletha.',
    },
  },
  {
    match: /oppo|oneplus|realme|vivo|iqoo/i,
    name: 'Oppo / OnePlus / Realme / Vivo',
    steps: {
      en: '- Settings → Battery → (App battery management) → Tounsi Fit → allow background activity, don’t optimize.',
      fr: '- Paramètres → Batterie → (Gestion de la batterie des applis) → Tounsi Fit → autoriser l’activité en arrière-plan, ne pas optimiser.',
      tn: '- Paramètres → Batterie → (Gestion de la batterie des applis) → Tounsi Fit → اسمح بالخدمة في الخلفية، بلاش optimisation.',
      tnLatn: '- Paramètres → Batterie → (Gestion de la batterie des applis) → Tounsi Fit → esma7 bel 5edma fel arrière-plan, blech optimisation.',
    },
  },
];

const OTHER_PHONE: LocalizedText = {
  en: '- Settings → Apps → Tounsi Fit → Battery → Unrestricted.',
  fr: '- Paramètres → Applications → Tounsi Fit → Batterie → Sans restriction.',
  tn: '- Paramètres → Applications → Tounsi Fit → Batterie → Sans restriction (بلاش حدود).',
  tnLatn: '- Paramètres → Applications → Tounsi Fit → Batterie → Sans restriction.',
};

export default function NotificationsScreen() {
  const t = useTokens();
  const router = useRouter();
  const snackbar = useSnackbar();
  const { L, language, weekdayName, formatTime } = useLanguage();
  const { profile, settings, updateSettings } = useAppData();
  const [ramadan] = useRamadanSettings();
  const ns = notificationSettings(settings.notifications);
  const schedule = scheduleOf(settings, profile);

  // Phone state, read again whenever the user comes back from the phone's settings.
  const [perm, setPerm] = useState<Permission>('undetermined');
  const [exact, setExact] = useState(true);
  const [battery, setBattery] = useState(true);
  const refresh = useCallback(() => {
    permission().then(setPerm);
    setExact(canScheduleExactAlarms());
    setBattery(isIgnoringBatteryOptimizations());
  }, []);
  useEffect(() => {
    refresh();
    const sub = AppState.addEventListener('change', (s) => s === 'active' && refresh());
    return () => sub.remove();
  }, [refresh]);

  const ask = async () => {
    const p = await requestPermission(language);
    setPerm(p);
    if (p === 'granted') resetReminderSync();
    return p;
  };

  /** Saves a change; switching something on asks for the permission first if needed. */
  const set = (patch: Partial<NotificationSettings>, turningOn = false) => {
    updateSettings({ notifications: { ...ns, ...patch } });
    if (turningOn && perm === 'undetermined') ask();
  };

  const time = (hhmm: string) => {
    const d = new Date();
    d.setHours(Number(hhmm.slice(0, 2)), Number(hhmm.slice(3, 5)), 0, 0);
    return formatTime(d);
  };
  const TimeRow = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
    <View style={styles.timeRow}>
      <Txt variant="body" tone="secondary" style={{ flex: 1 }}>
        {label}
      </Txt>
      <Stepper value={toMinutes(value)} onChange={(v) => onChange(fromMinutes(v))} step={15} min={0} max={23 * 60 + 45} format={(v) => time(fromMinutes(v))} />
    </View>
  );

  const days = WEEK_ORDER.filter((d) => schedule.weekdays.includes(d))
    .map((d) => weekdayName(new Date(2026, 10, 1 + d), 'short'))
    .join(', ');
  const maker = Platform.OS === 'android' ? String((Platform.constants as { Manufacturer?: string; Brand?: string }).Manufacturer ?? '') : '';
  const tip = MAKER_TIPS.find((m) => m.match.test(maker));

  const on = perm === 'granted';
  const statusText =
    perm === 'unsupported'
      ? L({ en: 'Notifications work in the app installed on your phone.', fr: 'Les notifications marchent dans l’app installée sur ton téléphone.', tn: 'الإشعارات يخدمو في التطبيق المركّب على التليفون.', tnLatn: 'Les notifications ye5dmou fel app mrakba 3al téléphone.' })
      : on
        ? L({ en: 'Notifications are on', fr: 'Les notifications sont activées', tn: 'الإشعارات خدّامين', tnLatn: 'Les notifications 5addamin' })
        : perm === 'denied'
          ? L({ en: 'Notifications are blocked in your phone’s settings', fr: 'Les notifications sont bloquées dans les réglages du téléphone', tn: 'الإشعارات مسكّرين في إعدادات التليفون', tnLatn: 'Les notifications msakrin fel paramètres mta3 el téléphone' })
          : L({ en: 'Notifications are off', fr: 'Les notifications sont désactivées', tn: 'الإشعارات مسكّرين', tnLatn: 'Les notifications msakrin' });

  return (
    <Screen back title={L({ en: 'Notifications', fr: 'Notifications', tn: 'الإشعارات', tnLatn: 'Notifications' })}>
      <View style={styles.status}>
        <View style={[styles.dot, { backgroundColor: on ? t.success : perm === 'denied' ? t.danger : t.textTertiary }]} />
        <Txt variant="bodyStrong" style={{ flex: 1 }}>
          {statusText}
        </Txt>
      </View>
      {notificationsSupported ? (
        <View style={styles.buttons}>
          {perm === 'undetermined' ? (
            <Button label={L({ en: 'Allow notifications', fr: 'Autoriser les notifications', tn: 'اسمح بالإشعارات', tnLatn: 'Esma7 bel notifications' })} icon={(c) => <BellRing size={20} color={c} />} onPress={ask} />
          ) : null}
          {perm === 'denied' ? (
            <Button
              label={L({ en: 'Open phone settings', fr: 'Ouvrir les réglages', tn: 'حلّ الإعدادات', tnLatn: '7el les paramètres' })}
              onPress={() => (openNotificationSettings() ? undefined : Linking.openSettings())}
            />
          ) : null}
          {on ? (
            <Button
              variant="tonal"
              label={L({ en: 'Send a test notification', fr: 'Envoyer une notification test', tn: 'ابعث إشعار تجربة', tnLatn: 'Eb3ath notification test' })}
              icon={(c) => <BellRing size={20} color={c} />}
              onPress={async () => {
                await sendTest(
                  L({ en: 'Tounsi Fit notifications work', fr: 'Les notifications Tounsi Fit marchent', tn: 'إشعارات Tounsi Fit يخدمو', tnLatn: 'Les notifications Tounsi Fit ye5dmou' }),
                  L({
                    en: 'This is how reminders will look on your lock screen.',
                    fr: 'Voilà à quoi ressembleront les rappels sur l’écran de verrouillage.',
                    tn: 'هكّا باش يبانو التذكيرات على شاشة القفل.',
                    tnLatn: 'Hakka bech ybanou les rappels 3la écran el 9fel.',
                  }),
                );
                snackbar.show(L({ en: 'Coming in 10 seconds: lock your phone now', fr: 'Arrive dans 10 secondes : verrouille ton téléphone', tn: 'جاي بعد 10 ثواني: سكّر التليفون توّا', tnLatn: 'Jey ba3d 10 secondes: sakker el téléphone taw' }));
              }}
            />
          ) : null}
        </View>
      ) : null}

      <Section title={L({ en: 'During a workout', fr: 'Pendant la séance', tn: 'وقت الحصّة', tnLatn: 'Wa9t el séance' })}>
        <Group>
          <ListItem
            title={L({ en: 'Rest timer', fr: 'Minuteur de repos', tn: 'وقت الراحة', tnLatn: 'Wa9t el repos' })}
            supporting={L({
              en: 'A countdown on the lock screen, a buzz at the end.',
              fr: 'Un décompte sur l’écran de verrouillage, une vibration à la fin.',
              tn: 'عدّ على شاشة القفل، ورعشة كي توفى.',
              tnLatn: '3add 3la écran el 9fel, w ra3cha ki youfa.',
            })}
            leading={(c) => <Timer size={22} color={c} />}
            trailing={<Toggle value={ns.rest} onChange={(v) => set({ rest: v }, v)} label={L({ en: 'Rest timer', fr: 'Minuteur de repos', tn: 'وقت الراحة', tnLatn: 'Wa9t el repos' })} />}
            divider
          />
          <ListItem
            title={L({ en: 'Workout in progress', fr: 'Séance en cours', tn: 'حصّة قاعدة', tnLatn: 'Séance 9a3da' })}
            supporting={L({
              en: 'Your next set, in the notification shade while you train.',
              fr: 'Ta prochaine série, dans le volet des notifications pendant la séance.',
              tn: 'السيري الجاية، في الإشعارات وقت التمرين.',
              tnLatn: 'Série el jeya, fel notifications wa9t el sport.',
            })}
            leading={(c) => <Dumbbell size={22} color={c} />}
            trailing={<Toggle value={ns.ongoing} onChange={(v) => set({ ongoing: v }, v)} label={L({ en: 'Workout in progress', fr: 'Séance en cours', tn: 'حصّة قاعدة', tnLatn: 'Séance 9a3da' })} />}
          />
        </Group>
      </Section>

      <Section title={L({ en: 'Reminders', fr: 'Rappels', tn: 'التذكيرات', tnLatn: 'Les rappels' })}>
        <Group>
          <ListItem
            title={L({ en: 'Training days', fr: 'Jours d’entraînement', tn: 'أيّام التمرين', tnLatn: 'Iyem el sport' })}
            supporting={days || '—'}
            leading={(c) => <CalendarDays size={22} color={c} />}
            trailing={<Toggle value={ns.training} onChange={(v) => set({ training: v }, v)} label={L({ en: 'Training days', fr: 'Jours d’entraînement', tn: 'أيّام التمرين', tnLatn: 'Iyem el sport' })} />}
          />
          {ns.training ? (
            <View style={styles.inner}>
              <TimeRow label={L({ en: 'At', fr: 'À', tn: 'على', tnLatn: '3la' })} value={ns.trainingTime} onChange={(v) => set({ trainingTime: v })} />
              <Button
                variant="text"
                label={L({ en: 'Change my training days', fr: 'Changer mes jours', tn: 'بدّل أيّام التمرين', tnLatn: 'Baddel iyem el sport' })}
                onPress={() => router.push('/schedule')}
                style={{ marginLeft: -space.md }}
              />
            </View>
          ) : null}
          <ListItem
            title={L({ en: 'Weekly weigh-in', fr: 'Pesée de la semaine', tn: 'الميزان كل جمعة', tnLatn: 'El mizen kol jem3a' })}
            supporting={`${weekdayName(new Date(2026, 10, 1 + ns.weighInDay), 'long')} · ${time(ns.weighInTime)}`}
            leading={(c) => <Scale size={22} color={c} />}
            trailing={<Toggle value={ns.weighIn} onChange={(v) => set({ weighIn: v }, v)} label={L({ en: 'Weekly weigh-in', fr: 'Pesée de la semaine', tn: 'الميزان كل جمعة', tnLatn: 'El mizen kol jem3a' })} />}
          />
          {ns.weighIn ? (
            <View style={styles.inner}>
              <ChipRow>
                {WEEK_ORDER.map((d) => (
                  <Chip key={d} label={weekdayName(new Date(2026, 10, 1 + d), 'short')} selected={ns.weighInDay === d} onPress={() => set({ weighInDay: d })} />
                ))}
              </ChipRow>
              <TimeRow label={L({ en: 'At', fr: 'À', tn: 'على', tnLatn: '3la' })} value={ns.weighInTime} onChange={(v) => set({ weighInTime: v })} />
            </View>
          ) : null}
          <ListItem
            title={L({ en: 'Meals', fr: 'Repas', tn: 'الماكلة', tnLatn: 'Makla' })}
            supporting={L({
              en: 'Only for a meal not logged yet that day.',
              fr: 'Seulement pour un repas pas encore noté ce jour-là.',
              tn: 'كان للماكلة اللي مازلت ما سجّلتهاش في النهار هذاك.',
              tnLatn: 'Ken lel makla eli mazelt ma sajjelthech fel nhar hedhaka.',
            })}
            leading={(c) => <Utensils size={22} color={c} />}
            trailing={<Toggle value={ns.meals} onChange={(v) => set({ meals: v }, v)} label={L({ en: 'Meals', fr: 'Repas', tn: 'الماكلة', tnLatn: 'Makla' })} />}
          />
          {ns.meals ? (
            <View style={styles.inner}>
              <TimeRow label={L({ en: 'Breakfast', fr: 'Petit-déjeuner', tn: 'فطور الصباح', tnLatn: 'Ftour sbe7' })} value={ns.mealTimes.breakfast} onChange={(v) => set({ mealTimes: { ...ns.mealTimes, breakfast: v } })} />
              <TimeRow label={L({ en: 'Lunch', fr: 'Déjeuner', tn: 'الغداء', tnLatn: 'El 8de' })} value={ns.mealTimes.lunch} onChange={(v) => set({ mealTimes: { ...ns.mealTimes, lunch: v } })} />
              <TimeRow label={L({ en: 'Dinner', fr: 'Dîner', tn: 'العشاء', tnLatn: 'El 3cha' })} value={ns.mealTimes.dinner} onChange={(v) => set({ mealTimes: { ...ns.mealTimes, dinner: v } })} />
            </View>
          ) : null}
          {ramadan.mode !== 'off' ? (
            <ListItem
              title={L({ en: 'Suhoor and iftar', fr: 'Shour et iftar', tn: 'السحور والفطور', tnLatn: 'Shour w ftour' })}
              supporting={L(
                { en: 'On fasting days, for {{city}}.', fr: 'Les jours de jeûne, pour {{city}}.', tn: 'في أيّام الصيام، لـ {{city}}.', tnLatn: 'F iyem e siyem, l {{city}}.' },
                { city: L(governorate(ramadan.city).name) },
              )}
              leading={(c) => <MoonStar size={22} color={c} />}
              trailing={<Toggle value={ns.ramadan} onChange={(v) => set({ ramadan: v }, v)} label={L({ en: 'Suhoor and iftar', fr: 'Shour et iftar', tn: 'السحور والفطور', tnLatn: 'Shour w ftour' })} />}
            />
          ) : null}
        </Group>
      </Section>

      {liveTimerAvailable ? (
        <Section title={L({ en: 'Make them arrive on time', fr: 'Pour qu’elles arrivent à l’heure', tn: 'باش يوصلو في الوقت', tnLatn: 'Bech youslou fel wa9t' })}>
          <Group>
            <ListItem
              title={L({ en: 'Exact alarms', fr: 'Alarmes exactes', tn: 'منبّهات بالدقّة', tnLatn: 'Alarmes exactes' })}
              supporting={
                exact
                  ? L({ en: 'Allowed: the rest alert buzzes on the second.', fr: 'Autorisées : l’alerte de repos vibre à la seconde.', tn: 'مسموح: تنبيه الراحة يرعش في الثانية بالضبط.', tnLatn: 'Masmou7: l alerte mta3 el repos ter3ach fel seconde bedhabt.' })
                  : L({
                      en: 'Off: the rest alert can come a little late. Tap to allow “Alarms & reminders”.',
                      fr: 'Désactivées : l’alerte de repos peut arriver un peu en retard. Touche pour autoriser « Alarmes et rappels ».',
                      tn: 'مسكّرة: تنبيه الراحة ينجّم يجي متأخّر شويّة. انزل باش تسمح بـ “Alarmes et rappels”.',
                      tnLatn: 'Msakra: l alerte mta3 el repos tnajjem tji m2a5ra chwaya. Enzel bech tesma7 b “Alarmes et rappels”.',
                    })
              }
              leading={(c) => <Timer size={22} color={c} />}
              onPress={exact ? undefined : () => openExactAlarmSettings()}
              chevron={!exact}
              divider
            />
            <ListItem
              title={L({ en: 'Battery saving', fr: 'Économie de batterie', tn: 'توفير البطارية', tnLatn: 'Économie batterie' })}
              supporting={
                battery
                  ? L({ en: 'Tounsi Fit is not restricted.', fr: 'Tounsi Fit n’est pas limité.', tn: 'Tounsi Fit موش محدود.', tnLatn: 'Tounsi Fit mouch m7doud.' })
                  : L({
                      en: 'Restricted: reminders can be held back. Tap, find Tounsi Fit, choose “Don’t optimise” or “Unrestricted”.',
                      fr: 'Limité : les rappels peuvent être retenus. Touche, trouve Tounsi Fit, choisis « Ne pas optimiser » ou « Sans restriction ».',
                      tn: 'محدود: التذكيرات ينجّمو يتأخّرو. انزل، لوّج على Tounsi Fit، واختار “Ne pas optimiser” ولا “Sans restriction”.',
                      tnLatn: 'M7doud: les rappels ynajjmou yet2a5rou. Enzel, lawwej 3la Tounsi Fit, w e5tar “Ne pas optimiser” walla “Sans restriction”.',
                    })
              }
              leading={(c) => <BellRing size={22} color={c} />}
              onPress={battery ? undefined : () => openBatterySettings()}
              chevron={!battery}
            />
          </Group>
          <Why
            title={L(
              { en: 'On your {{phone}}', fr: 'Sur ton {{phone}}', tn: 'على {{phone}} متاعك', tnLatn: '3la {{phone}} mte3ek' },
              { phone: tip?.name ?? L({ en: 'phone', fr: 'téléphone', tn: 'التليفون', tnLatn: 'téléphone' }) },
            )}
            style={{ marginTop: space.lg }}
          >
            <RichText
              text={`${L({
                en: 'Some phones put apps to sleep to save battery, which delays or hides reminders. Menu names change between versions:',
                fr: 'Certains téléphones endorment les applis pour économiser la batterie, ce qui retarde ou cache les rappels. Les noms des menus changent selon les versions :',
                tn: 'برشا تليفونات يرقّدو التطبيقات باش يوفّرو البطارية، وهذا يأخّر ولا يخبّي التذكيرات. أسامي المنيو تتبدّل من نسخة لنسخة:',
                tnLatn: 'Barcha téléphonet yra99dou les apps bech ywaffrou el batterie, w hedha y2a55er walla y5abbi les rappels. Asemi el menu yetbaddlou men version l version:',
              })}\n\n${L(tip?.steps ?? OTHER_PHONE)}`}
            />
          </Why>
        </Section>
      ) : null}

      <View style={[styles.watch, { borderColor: t.hairline }]}>
        <Watch size={20} color={t.textSecondary} />
        <Txt variant="caption" tone="secondary" style={{ flex: 1 }}>
          {L({
            en: 'Garmin, Amazfit and other watches show these notifications too when Tounsi Fit is allowed in the watch app’s notification settings.',
            fr: 'Garmin, Amazfit et les autres montres affichent aussi ces notifications quand Tounsi Fit est autorisé dans les réglages de notifications de l’app de la montre.',
            tn: 'Garmin و Amazfit والمونترات الأخرى يورّيو الإشعارات هاذم زادة كي تسمح لـ Tounsi Fit في إعدادات الإشعارات متاع تطبيق المونتر.',
            tnLatn: 'Garmin w Amazfit w les montres lo5rin ywarriw les notifications hedhom zeda ki tesma7 l Tounsi Fit fel paramètres notifications mta3 l app mta3 el montre.',
          })}
        </Txt>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  status: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  dot: { width: 8, height: 8, borderRadius: 4 },
  buttons: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, marginTop: space.lg },
  inner: { paddingLeft: 56, paddingRight: space.lg, paddingBottom: space.md, gap: space.sm },
  timeRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 48 },
  watch: { flexDirection: 'row', gap: space.md, marginTop: space.xxl, paddingTop: space.lg, borderTopWidth: StyleSheet.hairlineWidth },
});
