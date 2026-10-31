import { useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ListChecks, MoonStar, RefreshCw, Settings } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppData } from '@/contexts/AppDataContext';
import {
  Button,
  Group,
  ListItem,
  RichText,
  Screen,
  Section,
  Txt,
  Why,
  useFormat,
  useSnackbar,
  NAV_BAR_SPACE,
} from '@/components/ds';
import { connectHealth, openHealthSettings } from '@/services/healthConnect';
import { useHealthSync } from '@/hooks/useHealthSync';
import { GoogleBackupSection } from '@/components/backup/GoogleBackup';
import { AiSettings } from '@/components/ai/AiSettings';
import { useRamadanSettings } from '@/hooks/useRamadan';
import { governorate, RAMADAN_MODE_NAME } from '@/lib/ramadan';
import { space, useTokens } from '@/theme';

const GOAL_NAMES = {
  lose_fat: { en: 'Lose fat', fr: 'Perdre du gras', tn: 'نقّص الشحم', tnLatn: 'Na9es el gras' },
  build_muscle: { en: 'Build muscle', fr: 'Prendre du muscle', tn: 'ابني العضلات', tnLatn: 'Ebni el muscles' },
  recomp: { en: 'Recomposition', fr: 'Recomposition', tn: 'شحم أقل، عضل أكثر', tnLatn: 'A9al gras, akther muscle' },
  strength: { en: 'Get stronger', fr: 'Devenir plus fort', tn: 'ولّي أقوى', tnLatn: 'Walli a9wa' },
  maintain: { en: 'Maintain', fr: 'Maintien', tn: 'حافظ على وزنك', tnLatn: '7afedh 3al poids' },
  health: { en: 'Health & fitness', fr: 'Santé et forme', tn: 'صحّة وفورمة', tnLatn: 'Sa77a w forme' },
};

export default function ProfileScreen() {
  const t = useTokens();
  const router = useRouter();
  const fmt = useFormat();
  const snackbar = useSnackbar();
  const { L, language, formatDateTime } = useLanguage();
  const { profile, plan, settings, updateSettings } = useAppData();
  const [ramadan] = useRamadanSettings();
  const { status: healthStatus, syncing, sync, error: syncError } = useHealthSync();
  const fmtDate = (iso?: string) => (iso ? formatDateTime(new Date(iso)) : '—');

  // --- Health Connect -------------------------------------------------------
  const [healthMessage, setHealthMessage] = useState<string | null>(null);
  const connect = async () => {
    setHealthMessage(null);
    try {
      const granted = await connectHealth();
      if (!granted.length) {
        setHealthMessage(L({ en: 'No permission was granted.', fr: 'Aucune autorisation accordée.', tn: 'ما عطيت حتّى إذن.', tnLatn: 'Ma 3tit 7atta autorisation.' }));
        return;
      }
      updateSettings({ healthConnectEnabled: true });
      await sync();
      snackbar.show(L({ en: 'Watch data connected', fr: 'Données de la montre connectées', tn: 'داتا المونتر تربطت', tnLatn: 'Les données mte3 el montre trabtou' }));
    } catch (e) {
      setHealthMessage(e instanceof Error ? e.message : String(e));
    }
  };

  if (!profile || !plan) return null;

  const kg = (n: number) => fmt(n, Number.isInteger(n) ? 0 : 1);

  const linked = settings.healthConnectEnabled && healthStatus === 'available';
  const healthText =
    healthStatus === null
      ? L({ en: 'Checking Health Connect…', fr: 'Vérification de Health Connect…', tn: 'قاعدين نثبّتو في Health Connect…', tnLatn: '9a3din nthabtou f Health Connect…' })
      : healthStatus === 'available'
        ? settings.healthConnectEnabled
          ? L({ en: 'Health Connect linked', fr: 'Health Connect relié', tn: 'Health Connect مربوط', tnLatn: 'Health Connect marbout' })
          : L({ en: 'Health Connect available', fr: 'Health Connect disponible', tn: 'Health Connect موجود', tnLatn: 'Health Connect mawjoud' })
        : healthStatus === 'needs_build'
          ? L({
            en: 'Needs the installed app (not Expo Go)',
            fr: 'Nécessite l’app installée (pas Expo Go)',
            tn: 'يلزمك التطبيق المركّب (موش Expo Go)',
            tnLatn: "Yelzmek l'app mrakba (mouch Expo Go)",
          })
          : healthStatus === 'not_android'
            ? L({ en: 'Android only', fr: 'Android uniquement', tn: 'Android برك', tnLatn: 'Android bark' })
            : healthStatus === 'update_required'
              ? L({
                en: 'Update Health Connect in the Play Store',
                fr: 'Mets à jour Health Connect sur le Play Store',
                tn: 'اعمل ميزاجور لـ Health Connect في Play Store',
                tnLatn: 'A3mel mise à jour l Health Connect fel Play Store',
              })
              : L({
                en: 'Install Health Connect from the Play Store',
                fr: 'Installe Health Connect depuis le Play Store',
                tn: 'ركّب Health Connect من Play Store',
                tnLatn: 'Rakkeb Health Connect mel Play Store',
              });
  const healthColor = linked ? t.success : healthStatus === 'update_required' || healthStatus === 'not_installed' ? t.danger : t.textTertiary;

  return (
    <Screen bottomSpace={NAV_BAR_SPACE} title={profile.name || L({ en: 'Profile', fr: 'Profil', tn: 'البروفيل', tnLatn: 'Profil' })}>
      <Txt variant="numMedium" tone="secondary">
        {`${profile.age} ${L({ en: 'y', fr: 'ans', tn: 'سنة', tnLatn: 'sna' })} · ${fmt(profile.heightCm)} cm · ${kg(profile.weightKg)} kg`}
        {profile.targetWeightKg ? ` → ${kg(profile.targetWeightKg)} kg` : ''}
      </Txt>
      <Txt variant="body" tone="secondary" style={{ marginTop: space.xs }}>
        {L(GOAL_NAMES[profile.goal])}
        {' · '}
        <Txt variant="numMedium" tone="secondary">
          {fmt(plan.targetCalories)}
        </Txt>
        {' kcal · '}
        <Txt variant="numMedium" tone="secondary">
          {profile.trainingDays}
        </Txt>
        {L({ en: ' sessions / week', fr: ' séances / semaine', tn: ' حصص / جمعة', tnLatn: ' séances / jem3a' })}
      </Txt>
      <View style={[styles.buttonRow, { marginTop: space.lg }]}>
        <Button
          variant="tonal"
          label={L({ en: 'Update my answers', fr: 'Modifier mes réponses', tn: 'بدّل جواباتي', tnLatn: 'Baddel jwebeti' })}
          icon={(c) => <ListChecks size={20} color={c} />}
          onPress={() => router.push({ pathname: '/onboarding', params: { edit: '1' } })}
        />
        <Button variant="outlined" label={L({ en: 'My plan', fr: 'Mon plan', tn: 'برنامجي', tnLatn: 'Programme mte3i' })} onPress={() => router.push('/plan')} />
      </View>
      <Txt variant="caption" tone="tertiary" style={{ marginTop: space.md }}>
        {L({
          en: 'Redo the questions whenever something changes (new gym, more free time, new goal). Your history is kept.',
          fr: 'Refais le questionnaire dès que quelque chose change (nouvelle salle, plus de temps, nouvel objectif). Ton historique est conservé.',
          tn: 'عاود الأسئلة كل ما تتبدّل حاجة (سالة جديدة، وقت فاضي أكثر، هدف جديد). كل شي سجّلتو يقعد.',
          tnLatn: '3awed les questions kol ma tetbaddel 7aja (salle jdida, wa9t fadhi akther, objectif jdid). Kol chay sajjeltou yo93ed.',
        })}
      </Txt>

      {/* AI */}
      <Section title={L({ en: 'AI food scanning & coach', fr: 'Scan IA des repas & coach', tn: 'سكان الماكلة بالـ IA والكوتش', tnLatn: 'Scan el makla bel IA w coach' })}>
        <AiSettings />
      </Section>

      {/* Health Connect */}
      <Section title={L({ en: 'Phone & watch', fr: 'Téléphone et montre', tn: 'التليفون والمونتر', tnLatn: 'Téléphone w montre' })}>
        <StatusRow color={healthColor} text={healthText} />
        {settings.lastHealthSyncAt ? (
          <Txt variant="caption" tone="tertiary" style={{ marginTop: space.xs, marginLeft: 20 }}>
            {L({
              en: 'Last sync: {{d}}',
              fr: 'Dernière synchro : {{d}}',
              tn: 'آخر مزامنة: {{d}}',
              tnLatn: 'Ekher synchro: {{d}}',
            }, { d: fmtDate(settings.lastHealthSyncAt) })}
          </Txt>
        ) : null}
        {healthStatus === 'available' ? (
          settings.healthConnectEnabled ? (
            <View style={[styles.buttonRow, { marginTop: space.md }]}>
              <Button
                variant="tonal"
                label={L({ en: 'Sync now', fr: 'Synchroniser', tn: 'اعمل مزامنة', tnLatn: 'A3mel synchro' })}
                icon={(c) => <RefreshCw size={20} color={c} />}
                onPress={sync}
                loading={syncing}
              />
              <Button variant="outlined" label={L({ en: 'Permissions', fr: 'Autorisations', tn: 'الصلاحيات', tnLatn: 'Autorisations' })} onPress={openHealthSettings} />
            </View>
          ) : (
            <Button
              label={L({ en: 'Connect Health Connect', fr: 'Connecter Health Connect', tn: 'اربط Health Connect', tnLatn: 'Orbot Health Connect' })}
              onPress={connect}
              loading={syncing}
              style={{ marginTop: space.md }}
            />
          )
        ) : null}
        {healthMessage || syncError ? (
          <Txt variant="caption" tone="danger" style={{ marginTop: space.sm }}>
            {healthMessage || syncError}
          </Txt>
        ) : null}
        {settings.healthConnectEnabled ? (
          <Button
            variant="text"
            label={L({ en: 'Stop using watch data', fr: 'Ne plus utiliser la montre', tn: 'وقّف داتا المونتر', tnLatn: 'Wa99ef les données mte3 el montre' })}
            onPress={() => updateSettings({ healthConnectEnabled: false })}
            style={styles.inlineText}
          />
        ) : null}
        <Why
          title={L({
            en: 'Make your watch send data to Health Connect',
            fr: 'Faire envoyer les données de ta montre à Health Connect',
            tn: 'خلّي المونتر تبعث الداتا لـ Health Connect',
            tnLatn: '5alli el montre teb3ath les données l Health Connect',
          })}
          style={{ marginTop: space.lg }}
        >
          <RichText
            text={L({
              en: 'First, let your watch app write into Health Connect (menu names change between app versions, so look for “Health Connect” in its settings):\n\n- Garmin: Garmin Connect app → settings → Connected apps → Health Connect.\n- Xiaomi / Redmi: Mi Fitness app → profile → third-party / add accounts → Health Connect.\n- Amazfit: Zepp app → profile → add accounts → Health Connect.\n- Allow at least steps, calories, sleep and heart rate.\n\nThen come back here and tap “Connect”. Tounsi Fit only reads; it never changes your data. Google Fit is being shut down, so Health Connect is how your phone and watch share data now. Your Google account is used separately, for backup (below).',
              fr: 'D’abord, autorise l’app de ta montre à écrire dans Health Connect (les noms de menus changent selon les versions : cherche « Health Connect » dans ses réglages) :\n\n- Garmin : app Garmin Connect → paramètres → applications connectées → Health Connect.\n- Xiaomi / Redmi : app Mi Fitness → profil → données tierces / ajouter des comptes → Health Connect.\n- Amazfit : app Zepp → profil → ajouter des comptes → Health Connect.\n- Autorise au moins les pas, les calories, le sommeil et la fréquence cardiaque.\n\nReviens ensuite ici et touche « Connecter ». Tounsi Fit lit uniquement ; il ne modifie jamais tes données. Google Fit est en cours de fermeture : c’est désormais Health Connect qui relie ton téléphone et ta montre. Ton compte Google sert séparément, à la sauvegarde (ci-dessous).',
              tn: 'الأوّل، خلّي التطبيق متاع المونتر يكتب في Health Connect (أسامي المنيو تتبدّل من نسخة لنسخة، يعني لوّج على “Health Connect” في الإعدادات متاعو):\n\n- Garmin: تطبيق Garmin Connect → الإعدادات → التطبيقات المربوطة → Health Connect.\n- Xiaomi / Redmi: تطبيق Mi Fitness → البروفيل → تطبيقات أخرى / زيد كونتات → Health Connect.\n- Amazfit: تطبيق Zepp → البروفيل → زيد كونتات → Health Connect.\n- اسمح على الأقل بالخطوات، الكالوري، النوم ودقّات القلب.\n\nمبعد ارجع لهنا وانزل على “اربط”. Tounsi Fit يقرا برك؛ عمرو ما يبدّل الداتا متاعك. Google Fit قاعد يتسكّر، يعني توّا Health Connect هو اللي يخلّي التليفون والمونتر يتقاسمو الداتا. حساب Google متاعك يتستعمل وحدو، للنسخة الاحتياطية (لتحت).',
              tnLatn: "Lowel, 5alli l'app mte3 el montre tekteb f Health Connect (asemi el menu yetbaddlou men version l version, ya3ni lawwej 3la “Health Connect” fel paramètres mte3ha):\n\n- Garmin: app Garmin Connect → paramètres → applications connectées → Health Connect.\n- Xiaomi / Redmi: app Mi Fitness → profil → données tierces / ajouter des comptes → Health Connect.\n- Amazfit: app Zepp → profil → ajouter des comptes → Health Connect.\n- Esma7 3al a9al bel pas, calories, noum w de99at el 9alb.\n\nMba3d erja3 lehna w enzel 3la “Orbot”. Tounsi Fit ya9ra bark; 3omrou ma ybaddel les données mte3ek. Google Fit 9a3ed yetsakker, ya3ni taw Health Connect howa eli y5alli el téléphone w el montre yet9asmou les données. Compte Google mte3ek yetsta3mel wa7dou, lel sauvegarde (louta).",
            })}
          />
        </Why>
      </Section>

      {/* Google account */}
      <Section title={L({
        en: 'Google account & backup',
        fr: 'Compte Google et sauvegarde',
        tn: 'حساب Google والنسخة الاحتياطية',
        tnLatn: 'Compte Google w sauvegarde',
      })}>
        <GoogleBackupSection />
      </Section>

      <Group style={{ marginTop: space.xxl }}>
        <ListItem
          title={L({ en: 'Ramadan', fr: 'Ramadan', tn: 'رمضان', tnLatn: 'Romdhan' })}
          supporting={`${L(RAMADAN_MODE_NAME[ramadan.mode])} · ${L(governorate(ramadan.city).name)}`}
          leading={(c) => <MoonStar size={22} color={c} />}
          onPress={() => router.push('/ramadan')}
          chevron
          divider
        />
        <ListItem
          title={L({
            en: 'Language, backups & data',
            fr: 'Langue, sauvegardes et données',
            tn: 'اللغة، النسخ الاحتياطية والداتا',
            tnLatn: 'Lougha, sauvegardes w données',
          })}
          leading={(c) => <Settings size={22} color={c} />}
          onPress={() => router.push('/settings')}
          chevron
        />
      </Group>
      {Platform.OS === 'web' ? (
        <Txt variant="caption" tone="tertiary" align="center" style={{ marginTop: space.lg }}>
          {L({
            en: 'Web preview — camera, Health Connect and Google sign-in behave differently on the phone.',
            fr: 'Aperçu web — l’appareil photo, Health Connect et Google se comportent différemment sur le téléphone.',
            tn: 'نسخة الويب — الكاميرا، Health Connect والدخول بـ Google يخدمو بطريقة أخرى على التليفون.',
            tnLatn: 'Version web — el caméra, Health Connect w connexion Google ye5dmou b tari9a o5ra 3al téléphone.',
          })}
        </Txt>
      ) : null}

    </Screen>
  );
}

function StatusRow({ color, text }: { color: string; text: string }) {
  return (
    <View style={styles.status}>
      <View style={[styles.dot, { backgroundColor: color }]} />
      <Txt variant="bodyStrong" style={{ flex: 1 }}>
        {text}
      </Txt>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonRow: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: space.sm },
  inlineText: { marginLeft: -space.md, marginTop: space.xs },
  status: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  dot: { width: 8, height: 8, borderRadius: 4 },
});
