import { useEffect, useState } from 'react';
import { Linking, Platform, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ExternalLink, KeyRound, ListChecks, MoonStar, RefreshCw, Settings } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppData } from '@/contexts/AppDataContext';
import {
  Button,
  Field,
  Group,
  ListItem,
  RichText,
  Screen,
  Section,
  Txt,
  Why,
  useFormat,
  useSnackbar,
} from '@/components/ds';
import { SECRET_KEYS, deleteSecret, getSecret, setSecret } from '@/lib/storage';
import { GeminiError, testGeminiKey } from '@/services/gemini';
import { BUILT_IN_OPENROUTER_KEY, testOpenRouterKey } from '@/services/openrouter';
import { connectHealth, openHealthSettings } from '@/services/healthConnect';
import { useHealthSync } from '@/hooks/useHealthSync';
import { GoogleBackupSection } from '@/components/backup/GoogleBackup';
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

  // --- Gemini key -----------------------------------------------------------
  const [hasKey, setHasKey] = useState(false);
  const [keyInput, setKeyInput] = useState('');
  const [keyState, setKeyState] = useState<'idle' | 'testing' | 'ok' | 'bad' | 'quota' | 'offline'>('idle');
  // The provider's own reason when a test fails, so a problem can be diagnosed from the screen.
  const [keyDetail, setKeyDetail] = useState<string | null>(null);
  useEffect(() => {
    getSecret(SECRET_KEYS.geminiApiKey).then((k) => setHasKey(!!k));
  }, []);

  const saveKey = async () => {
    const key = keyInput.trim();
    if (!key) return;
    await setSecret(SECRET_KEYS.geminiApiKey, key);
    setHasKey(true);
    setKeyInput('');
    await runKeyTest();
  };
  const runKeyTest = async () => {
    setKeyState('testing');
    setKeyDetail(null);
    try {
      await testGeminiKey();
      setKeyState('ok');
    } catch (e) {
      const code = e instanceof GeminiError ? e.code : 'server';
      setKeyState(code === 'quota' ? 'quota' : code === 'network' ? 'offline' : 'bad');
      setKeyDetail(errorDetail(e));
    }
  };
  const removeKey = async () => {
    await deleteSecret(SECRET_KEYS.geminiApiKey);
    setHasKey(false);
    setKeyState('idle');
    snackbar.show(L({
      en: 'Key removed from this phone',
      fr: 'Clé supprimée de ce téléphone',
      tn: 'الـ key تنحّات من التليفون هذا',
      tnLatn: 'El key tna77et mel téléphone hedha',
    }));
  };

  // --- OpenRouter key (alternative / fallback AI provider) ------------------
  const [hasOrKey, setHasOrKey] = useState(false);
  const [orInput, setOrInput] = useState('');
  const [orState, setOrState] = useState<'idle' | 'testing' | 'ok' | 'bad' | 'offline' | 'policy' | 'quota'>('idle');
  const [orDetail, setOrDetail] = useState<string | null>(null);
  useEffect(() => {
    getSecret(SECRET_KEYS.openRouterApiKey).then((k) => setHasOrKey(!!k));
  }, []);
  const runOrTest = async () => {
    setOrState('testing');
    setOrDetail(null);
    try {
      await testOpenRouterKey();
      setOrState('ok');
    } catch (e) {
      const code = e instanceof GeminiError ? e.code : 'server';
      setOrDetail(errorDetail(e));
      setOrState(
        code === 'network' ? 'offline' : code === 'data_policy' ? 'policy' : code === 'quota' ? 'quota' : code === 'invalid_key' ? 'bad' : 'offline',
      );
    }
  };
  const saveOrKey = async () => {
    const key = orInput.trim();
    if (!key) return;
    await setSecret(SECRET_KEYS.openRouterApiKey, key);
    setHasOrKey(true);
    setOrInput('');
    await runOrTest();
  };
  const removeOrKey = async () => {
    await deleteSecret(SECRET_KEYS.openRouterApiKey);
    setHasOrKey(false);
    setOrState('idle');
    snackbar.show(L({
      en: 'Key removed from this phone',
      fr: 'Clé supprimée de ce téléphone',
      tn: 'الـ key تنحّات من التليفون هذا',
      tnLatn: 'El key tna77et mel téléphone hedha',
    }));
  };

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

  // --- Status lines ---------------------------------------------------------
  const keyStatus: { text: string; color: string } = !hasKey
    ? { text: L({ en: 'Not set up', fr: 'Non configuré', tn: 'مازال ما تحطّش', tnLatn: 'Mazel ma t7attech' }), color: t.textDisabled }
    : keyState === 'ok'
      ? { text: L({ en: 'Gemini connected', fr: 'Gemini connecté', tn: 'Gemini مربوط', tnLatn: 'Gemini marbout' }), color: t.success }
      : keyState === 'bad'
        ? { text: L({
          en: 'Key rejected — check it',
          fr: 'Clé refusée — vérifie-la',
          tn: 'الـ key مرفوضة — ثبّت فيها',
          tnLatn: 'El key marfoudha — thabbet fiha',
        }), color: t.danger }
        : keyState === 'testing'
          ? { text: L({
            en: 'Testing your key…',
            fr: 'Test de ta clé…',
            tn: 'قاعدين نجرّبو الـ key متاعك…',
            tnLatn: '9a3din njarrbou el key mte3ek…',
          }), color: t.textTertiary }
          : keyState === 'quota'
            ? { text: L({
              en: 'Key OK, free limit reached for now',
              fr: 'Clé OK, limite gratuite atteinte pour le moment',
              tn: 'الـ key باهية، أما وصلت للحدّ المجّاني توّا',
              tnLatn: 'El key behya, ama wselt lel limite gratuite taw',
            }), color: t.textTertiary }
            : keyState === 'offline'
              ? { text: L({
                en: 'Key saved (offline, not tested)',
                fr: 'Clé enregistrée (hors ligne, non testée)',
                tn: 'الـ key تسجّلت (ما فمّاش كونيكسيون، ما تجرّبتش)',
                tnLatn: 'El key tsajlet (ma fammech connexion, ma tjarrbetch)',
              }), color: t.textTertiary }
              : { text: L({ en: 'Key saved', fr: 'Clé enregistrée', tn: 'الـ key تسجّلت', tnLatn: 'El key tsajlet' }), color: t.textTertiary };

  const builtInOr = !hasOrKey && !!BUILT_IN_OPENROUTER_KEY;
  const orStatus: { text: string; color: string } = !hasOrKey && !builtInOr
    ? { text: L({
      en: 'OpenRouter: not set up',
      fr: 'OpenRouter : non configuré',
      tn: 'OpenRouter: مازال ما تحطّش',
      tnLatn: 'OpenRouter: mazel ma t7attech',
    }), color: t.textDisabled }
    : builtInOr && orState === 'idle'
      ? { text: L({
        en: 'Using the built-in OpenRouter key',
        fr: 'Clé OpenRouter intégrée utilisée',
        tn: 'قاعدين نستعملو الـ key متاع OpenRouter اللي في التطبيق',
        tnLatn: '9a3din nesta3mlou el key OpenRouter eli fel app',
      }), color: t.textTertiary }
    : orState === 'ok'
      ? { text: L({
        en: 'OpenRouter connected (free models)',
        fr: 'OpenRouter connecté (modèles gratuits)',
        tn: 'OpenRouter مربوط (موديلات مجّانية)',
        tnLatn: 'OpenRouter marbout (modèles gratuits)',
      }), color: t.success }
      : orState === 'bad'
        ? { text: L({
          en: 'OpenRouter key rejected — check it',
          fr: 'Clé OpenRouter refusée — vérifie-la',
          tn: 'الـ key متاع OpenRouter مرفوضة — ثبّت فيها',
          tnLatn: 'El key mte3 OpenRouter marfoudha — thabbet fiha',
        }), color: t.danger }
        : orState === 'testing'
          ? { text: L({
            en: 'Testing your key…',
            fr: 'Test de ta clé…',
            tn: 'قاعدين نجرّبو الـ key متاعك…',
            tnLatn: '9a3din njarrbou el key mte3ek…',
          }), color: t.textTertiary }
          : orState === 'policy'
            ? { text: L({
              en: 'Key OK: allow free models in OpenRouter’s privacy settings',
              fr: 'Clé OK : autorise les modèles gratuits dans la confidentialité d’OpenRouter',
              tn: 'الـ key باهية: اسمح بالموديلات المجّانية في إعدادات الخصوصية متاع OpenRouter',
              tnLatn: 'El key behya: esma7 bel modèles gratuits fel paramètres de confidentialité mte3 OpenRouter',
            }), color: t.danger }
            : orState === 'quota'
              ? { text: L({
                en: 'Key OK, free limit reached for today',
                fr: 'Clé OK, limite gratuite atteinte pour aujourd’hui',
                tn: 'الـ key باهية، أما وصلت للحدّ المجّاني متاع اليوم',
                tnLatn: 'El key behya, ama wselt lel limite gratuite mte3 lyoum',
              }), color: t.textTertiary }
              : orState === 'offline'
            ? { text: L({
              en: 'OpenRouter key saved (could not test it now)',
              fr: 'Clé OpenRouter enregistrée (test impossible pour l’instant)',
              tn: 'الـ key متاع OpenRouter تسجّلت (ما نجّمناش نجرّبوها توّا)',
              tnLatn: 'El key mte3 OpenRouter tsajlet (ma najjamnech njarrbouha taw)',
            }), color: t.textTertiary }
            : { text: L({
              en: 'OpenRouter key saved',
              fr: 'Clé OpenRouter enregistrée',
              tn: 'الـ key متاع OpenRouter تسجّلت',
              tnLatn: 'El key mte3 OpenRouter tsajlet',
            }), color: t.textTertiary };

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

  const keySteps = [
    L({
      en: 'Open aistudio.google.com and sign in with your Google account.',
      fr: 'Ouvre aistudio.google.com et connecte-toi avec ton compte Google.',
      tn: 'حلّ aistudio.google.com وادخل بحساب Google متاعك.',
      tnLatn: '7ell aistudio.google.com w connecti b compte Google mte3ek.',
    }),
    L({
      en: 'Tap “Get API key” → “Create API key”.',
      fr: 'Touche « Get API key » → « Create API key ».',
      tn: 'انزل على “Get API key” → “Create API key”.',
      tnLatn: 'Enzel 3la “Get API key” → “Create API key”.',
    }),
    L({
      en: 'Copy it and paste it below. It is stored encrypted on this phone only.',
      fr: 'Copie-la et colle-la ci-dessous. Elle est chiffrée et reste sur ce téléphone.',
      tn: 'كوبيها وكوليها لتحت. تتسجّل مشفّرة في التليفون هذا برك.',
      tnLatn: 'Copiha w colliha louta. Tetsajjel mchaffra fel téléphone hedha bark.',
    }),
  ];

  return (
    <Screen back title={profile.name || L({ en: 'Profile', fr: 'Profil', tn: 'البروفيل', tnLatn: 'Profil' })}>
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
        <StatusRow color={keyStatus.color} text={keyStatus.text} />
        {keyDetail ? <ErrorDetail text={keyDetail} /> : null}
        {!hasKey ? (
          <>
            <Txt variant="caption" tone="secondary" style={{ marginTop: space.md }}>
              {L({ en: 'Free, no card needed:', fr: 'Gratuit, sans carte bancaire :', tn: 'بلاش، من غير كارطة بنكية:', tnLatn: 'Blech, men 8ir carte bancaire:' })}
            </Txt>
            <View style={{ gap: space.sm, marginTop: space.sm }}>
              {keySteps.map((s, i) => (
                <View key={i} style={styles.step}>
                  <Txt variant="numSmall" tone="tertiary" style={styles.stepNumber}>
                    {i + 1}
                  </Txt>
                  <Txt variant="caption" tone="secondary" style={{ flex: 1 }}>
                    {s}
                  </Txt>
                </View>
              ))}
            </View>
            <Button
              variant="outlined"
              label={L({ en: 'Open Google AI Studio', fr: 'Ouvrir Google AI Studio', tn: 'حلّ Google AI Studio', tnLatn: '7ell Google AI Studio' })}
              icon={(c) => <ExternalLink size={20} color={c} />}
              onPress={() => Linking.openURL('https://aistudio.google.com/apikey')}
              style={{ marginTop: space.lg }}
            />
            <Field
              containerStyle={{ marginTop: space.lg }}
              label={L({ en: 'Your Gemini API key', fr: 'Ta clé API Gemini', tn: 'الـ Gemini API key متاعك', tnLatn: 'El Gemini API key mte3ek' })}
              leading={<KeyRound size={20} color={t.textTertiary} />}
              value={keyInput}
              onChangeText={setKeyInput}
              placeholder="AIza…"
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
            />
            <Button
              label={L({ en: 'Save & test', fr: 'Enregistrer et tester', tn: 'سجّل وجرّب', tnLatn: 'Sajjel w jarreb' })}
              onPress={saveKey}
              disabled={!keyInput.trim()}
              style={{ marginTop: space.md }}
            />
          </>
        ) : (
          <View style={[styles.buttonRow, { marginTop: space.md }]}>
            <Button variant="tonal" label={L({ en: 'Test', fr: 'Tester', tn: 'جرّب', tnLatn: 'Jarreb' })} onPress={runKeyTest} loading={keyState === 'testing'} />
            <Button variant="text" label={L({ en: 'Remove key', fr: 'Supprimer la clé', tn: 'نحّي الـ key', tnLatn: 'Na77i el key' })} onPress={removeKey} />
          </View>
        )}
        <View style={[styles.orBlock, { borderTopColor: t.hairline }]}>
          <Txt variant="bodyStrong">{L({ en: 'Or use OpenRouter', fr: 'Ou utilise OpenRouter', tn: 'ولّا استعمل OpenRouter', tnLatn: 'Walla esta3mel OpenRouter' })}</Txt>
          <Txt variant="caption" tone="secondary" style={{ marginTop: 2, marginBottom: space.sm }}>
            {L({
              en: 'Works instead of Gemini, or takes over when Gemini’s free limit runs out. Tounsi Fit only uses OpenRouter’s free models, so nothing is charged.',
              fr: 'Remplace Gemini, ou prend le relais quand la limite gratuite de Gemini est atteinte. Tounsi Fit n’utilise que les modèles gratuits d’OpenRouter : rien n’est facturé.',
              tn: 'يخدم في بلاصة Gemini، ولّا يشدّ البلاصة كي يوفى الحدّ المجّاني متاع Gemini. Tounsi Fit يستعمل كان الموديلات المجّانية متاع OpenRouter، يعني ما تخلّص حتّى شي.',
              tnLatn: 'Ye5dem fi blasset Gemini, walla yched el blasa ki youfa el limite gratuite mte3 Gemini. Tounsi Fit yesta3mel ken les modèles gratuits mte3 OpenRouter, ya3ni ma t5alles 7atta chay.',
            })}
          </Txt>
          <StatusRow color={orStatus.color} text={orStatus.text} />
          {orDetail ? <ErrorDetail text={orDetail} /> : null}
          {builtInOr ? (
            <View style={[styles.buttonRow, { marginTop: space.md }]}>
              {orState === 'policy' ? (
                <Button
                  label={L({ en: 'Open privacy settings', fr: 'Ouvrir la confidentialité', tn: 'حلّ إعدادات الخصوصية', tnLatn: '7ell la confidentialité' })}
                  icon={(c) => <ExternalLink size={20} color={c} />}
                  onPress={() => Linking.openURL('https://openrouter.ai/settings/privacy')}
                />
              ) : null}
              <Button variant="tonal" label={L({ en: 'Test', fr: 'Tester', tn: 'جرّب', tnLatn: 'Jarreb' })} onPress={runOrTest} loading={orState === 'testing'} />
            </View>
          ) : !hasOrKey ? (
            <>
              <Field
                containerStyle={{ marginTop: space.md }}
                label={L({ en: 'Your OpenRouter API key', fr: 'Ta clé API OpenRouter', tn: 'الـ OpenRouter API key متاعك', tnLatn: 'El OpenRouter API key mte3ek' })}
                leading={<KeyRound size={20} color={t.textTertiary} />}
                value={orInput}
                onChangeText={setOrInput}
                placeholder="sk-or-…"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
              />
              <Button
                label={L({ en: 'Save & test', fr: 'Enregistrer et tester', tn: 'سجّل وجرّب', tnLatn: 'Sajjel w jarreb' })}
                onPress={saveOrKey}
                disabled={!orInput.trim()}
                style={{ marginTop: space.md }}
              />
            </>
          ) : (
            <View style={[styles.buttonRow, { marginTop: space.md }]}>
              {orState === 'policy' ? (
                <Button
                  label={L({ en: 'Open privacy settings', fr: 'Ouvrir la confidentialité', tn: 'حلّ إعدادات الخصوصية', tnLatn: '7ell la confidentialité' })}
                  icon={(c) => <ExternalLink size={20} color={c} />}
                  onPress={() => Linking.openURL('https://openrouter.ai/settings/privacy')}
                />
              ) : null}
              <Button variant="tonal" label={L({ en: 'Test', fr: 'Tester', tn: 'جرّب', tnLatn: 'Jarreb' })} onPress={runOrTest} loading={orState === 'testing'} />
              <Button variant="text" label={L({ en: 'Remove key', fr: 'Supprimer la clé', tn: 'نحّي الـ key', tnLatn: 'Na77i el key' })} onPress={removeOrKey} />
            </View>
          )}
        </View>
        <Why title={L({
          en: 'Is it really free? What about privacy?',
          fr: 'C’est vraiment gratuit ? Et la confidentialité ?',
          tn: 'بالحقّ بلاش؟ والخصوصية؟',
          tnLatn: 'Bel 7a9 blech? W el confidentialité?',
        })} style={{ marginTop: space.lg }}>
          <Txt variant="body" tone="secondary">
            {L({
              en: 'Gemini’s free tier allows a limited number of requests per minute and per day — plenty for logging your own meals. Google may use free-tier requests (your meal photos and questions) to improve its products, so don’t send anything private. Nothing is charged because no payment method is attached.\n\nOpenRouter’s free models allow about 50 requests a day on an account without credits. The companies running those free models may log or train on what you send, and OpenRouter asks you to allow that in its privacy settings first.',
              fr: 'La version gratuite de Gemini autorise un nombre limité de requêtes par minute et par jour — largement assez pour tes propres repas. Google peut utiliser les requêtes gratuites (photos de repas et questions) pour améliorer ses produits : n’envoie rien de privé. Rien n’est facturé puisqu’aucun moyen de paiement n’est associé.\n\nLes modèles gratuits d’OpenRouter permettent environ 50 requêtes par jour sur un compte sans crédits. Les sociétés qui font tourner ces modèles gratuits peuvent enregistrer ou utiliser ce que tu envoies, et OpenRouter demande d’abord de l’autoriser dans ses réglages de confidentialité.',
              tn: 'النسخة المجّانية متاع Gemini تسمح بعدد محدود من الطلبات في الدقيقة وفي النهار — يكفي ويزيد باش تسجّل ماكلتك. Google ينجّم يستعمل الطلبات المجّانية (تصاور ماكلتك والأسئلة متاعك) باش يحسّن منتوجاتو، يعني ما تبعث حتّى حاجة خاصّة. ما تخلّص حتّى شي خاطر ما فمّا حتّى طريقة خلاص مربوطة.\n\nالموديلات المجّانية متاع OpenRouter تسمح بـ 50 طلب تقريب في النهار على كونت من غير كريدي. الشركات اللي تخدّم الموديلات المجّانية هاذوما تنجّم تسجّل ولّا تستعمل اللي تبعثو، و OpenRouter يطلب منك تسمح بهذا في إعدادات الخصوصية متاعو قبل.',
              tnLatn: 'El version gratuite mte3 Gemini tesma7 b 3add m7doud mel requêtes fel minute w fel nhar — yekfi w yzid bech tsajjel maklek. Google ynajjem yesta3mel les requêtes gratuites (tsawer maklek w les questions mte3ek) bech y7assen les produits mte3ou, ya3ni ma teb3ath 7atta 7aja privée. Ma t5alles 7atta chay 5ater ma fammech 7atta moyen de paiement marbout.\n\nLes modèles gratuits mte3 OpenRouter yesma7ou b 50 requête ta9riban fel nhar 3la compte men 8ir crédits. Les sociétés eli ye5dmou les modèles gratuits hedhom ynajmou ysajlou walla yesta3mlou eli teb3athou, w OpenRouter yotlob menek tesma7 b hedha fel paramètres de confidentialité mte3ou 9bal.',
            })}
          </Txt>
        </Why>
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

/** A provider error, trimmed for display (keys never appear in these messages). */
function errorDetail(e: unknown): string {
  const raw = e instanceof Error ? e.message : String(e);
  return raw.replace(/sk-[A-Za-z0-9-]{8,}/g, 'sk-…').replace(/\s+/g, ' ').trim().slice(0, 220);
}

function ErrorDetail({ text }: { text: string }) {
  return (
    <Txt variant="caption" tone="tertiary" selectable style={{ marginTop: space.xs, marginLeft: 20 }}>
      {text}
    </Txt>
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
  orBlock: { marginTop: space.xl, paddingTop: space.lg, borderTopWidth: StyleSheet.hairlineWidth },
  inlineText: { marginLeft: -space.md, marginTop: space.xs },
  status: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  dot: { width: 8, height: 8, borderRadius: 4 },
  step: { flexDirection: 'row', gap: space.sm },
  stepNumber: { width: 16, marginTop: 1 },
});
