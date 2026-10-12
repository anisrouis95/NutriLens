import { useEffect, useState } from 'react';
import { Linking, Platform, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ExternalLink, KeyRound, ListChecks, LogOut, RefreshCw, Settings } from 'lucide-react-native';
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
  Sheet,
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
import { googleSignInAvailability, signInWithGoogle, signOut, useAuthUser } from '@/services/auth';
import { backupToCloud, restoreFromCloud } from '@/services/cloudSync';
import { space, useTokens } from '@/theme';

const GOAL_NAMES = {
  lose_fat: { en: 'Lose fat', fr: 'Perdre du gras' },
  build_muscle: { en: 'Build muscle', fr: 'Prendre du muscle' },
  recomp: { en: 'Recomposition', fr: 'Recomposition' },
  strength: { en: 'Get stronger', fr: 'Devenir plus fort' },
  maintain: { en: 'Maintain', fr: 'Maintien' },
  health: { en: 'Health & fitness', fr: 'Santé et forme' },
};

export default function ProfileScreen() {
  const t = useTokens();
  const router = useRouter();
  const fmt = useFormat();
  const snackbar = useSnackbar();
  const { L, language } = useLanguage();
  const { profile, plan, settings, updateSettings, exportSnapshot, importSnapshot } = useAppData();
  const { status: healthStatus, syncing, sync, error: syncError } = useHealthSync();
  const user = useAuthUser();
  const locale = language === 'fr' ? 'fr-FR' : 'en-US';
  const fmtDay = (iso: string) => new Date(iso).toLocaleDateString(locale, { dateStyle: 'medium' });
  const fmtDate = (iso?: string) => (iso ? new Date(iso).toLocaleString(locale, { dateStyle: 'medium', timeStyle: 'short' }) : '—');

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
    snackbar.show(L({ en: 'Key removed from this phone', fr: 'Clé supprimée de ce téléphone' }));
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
    snackbar.show(L({ en: 'Key removed from this phone', fr: 'Clé supprimée de ce téléphone' }));
  };

  // --- Health Connect -------------------------------------------------------
  const [healthMessage, setHealthMessage] = useState<string | null>(null);
  const connect = async () => {
    setHealthMessage(null);
    try {
      const granted = await connectHealth();
      if (!granted.length) {
        setHealthMessage(L({ en: 'No permission was granted.', fr: 'Aucune autorisation accordée.' }));
        return;
      }
      updateSettings({ healthConnectEnabled: true });
      await sync();
      snackbar.show(L({ en: 'Watch data connected', fr: 'Données de la montre connectées' }));
    } catch (e) {
      setHealthMessage(e instanceof Error ? e.message : String(e));
    }
  };

  // --- Google account & backup ----------------------------------------------
  const signInState = googleSignInAvailability();
  const [cloudBusy, setCloudBusy] = useState<'signin' | 'signout' | 'backup' | 'restore' | null>(null);
  const [cloudError, setCloudError] = useState<string | null>(null);
  const [restoreOpen, setRestoreOpen] = useState(false);

  /** Runs a cloud action; a returned string is confirmed in the snackbar, a thrown error stays inline. */
  const runCloud = async (kind: 'signin' | 'signout' | 'backup' | 'restore', fn: () => Promise<string | void>) => {
    setCloudBusy(kind);
    setCloudError(null);
    try {
      const done = await fn();
      if (done) snackbar.show(done);
    } catch (e) {
      setCloudError(e instanceof Error ? e.message : String(e));
    } finally {
      setCloudBusy(null);
    }
  };
  const backup = (silent = false) =>
    runCloud('backup', async () => {
      if (!user) return;
      await backupToCloud(user.uid, exportSnapshot());
      updateSettings({ lastBackupAt: new Date().toISOString(), cloudBackupEnabled: true });
      return silent ? undefined : L({ en: 'Backup saved', fr: 'Sauvegarde effectuée' });
    });
  const restore = () => {
    setRestoreOpen(false);
    return runCloud('restore', async () => {
      if (!user) return;
      const snap = await restoreFromCloud(user.uid);
      if (!snap) return L({ en: 'No backup found for this account.', fr: 'Aucune sauvegarde pour ce compte.' });
      importSnapshot(snap);
      return L({ en: 'Restored backup from {{date}}', fr: 'Sauvegarde du {{date}} restaurée' }, { date: fmtDay(snap.exportedAt) });
    });
  };
  const signIn = () =>
    runCloud('signin', async () => {
      const u = await signInWithGoogle();
      return u?.email ? L({ en: 'Signed in as {{e}}', fr: 'Connecté : {{e}}' }, { e: u.email }) : undefined;
    });
  const leave = () =>
    runCloud('signout', async () => {
      await signOut();
      return L({ en: 'Signed out', fr: 'Déconnecté' });
    });

  // Automatic daily backup while signed in.
  useEffect(() => {
    if (!user || !settings.cloudBackupEnabled) return;
    const last = settings.lastBackupAt ? Date.parse(settings.lastBackupAt) : 0;
    if (Date.now() - last > 24 * 3600 * 1000) backup(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, settings.cloudBackupEnabled]);

  if (!profile || !plan) return null;

  const kg = (n: number) => fmt(n, Number.isInteger(n) ? 0 : 1);

  // --- Status lines ---------------------------------------------------------
  const keyStatus: { text: string; color: string } = !hasKey
    ? { text: L({ en: 'Not set up', fr: 'Non configuré' }), color: t.textDisabled }
    : keyState === 'ok'
      ? { text: L({ en: 'Gemini connected', fr: 'Gemini connecté' }), color: t.success }
      : keyState === 'bad'
        ? { text: L({ en: 'Key rejected — check it', fr: 'Clé refusée — vérifie-la' }), color: t.danger }
        : keyState === 'testing'
          ? { text: L({ en: 'Testing your key…', fr: 'Test de ta clé…' }), color: t.textTertiary }
          : keyState === 'quota'
            ? { text: L({ en: 'Key OK, free limit reached for now', fr: 'Clé OK, limite gratuite atteinte pour le moment' }), color: t.textTertiary }
            : keyState === 'offline'
              ? { text: L({ en: 'Key saved (offline, not tested)', fr: 'Clé enregistrée (hors ligne, non testée)' }), color: t.textTertiary }
              : { text: L({ en: 'Key saved', fr: 'Clé enregistrée' }), color: t.textTertiary };

  const builtInOr = !hasOrKey && !!BUILT_IN_OPENROUTER_KEY;
  const orStatus: { text: string; color: string } = !hasOrKey && !builtInOr
    ? { text: L({ en: 'OpenRouter: not set up', fr: 'OpenRouter : non configuré' }), color: t.textDisabled }
    : builtInOr && orState === 'idle'
      ? { text: L({ en: 'Using the built-in OpenRouter key', fr: 'Clé OpenRouter intégrée utilisée' }), color: t.textTertiary }
    : orState === 'ok'
      ? { text: L({ en: 'OpenRouter connected (free models)', fr: 'OpenRouter connecté (modèles gratuits)' }), color: t.success }
      : orState === 'bad'
        ? { text: L({ en: 'OpenRouter key rejected — check it', fr: 'Clé OpenRouter refusée — vérifie-la' }), color: t.danger }
        : orState === 'testing'
          ? { text: L({ en: 'Testing your key…', fr: 'Test de ta clé…' }), color: t.textTertiary }
          : orState === 'policy'
            ? { text: L({ en: 'Key OK: allow free models in OpenRouter’s privacy settings', fr: 'Clé OK : autorise les modèles gratuits dans la confidentialité d’OpenRouter' }), color: t.danger }
            : orState === 'quota'
              ? { text: L({ en: 'Key OK, free limit reached for today', fr: 'Clé OK, limite gratuite atteinte pour aujourd’hui' }), color: t.textTertiary }
              : orState === 'offline'
            ? { text: L({ en: 'OpenRouter key saved (could not test it now)', fr: 'Clé OpenRouter enregistrée (test impossible pour l’instant)' }), color: t.textTertiary }
            : { text: L({ en: 'OpenRouter key saved', fr: 'Clé OpenRouter enregistrée' }), color: t.textTertiary };

  const linked = settings.healthConnectEnabled && healthStatus === 'available';
  const healthText =
    healthStatus === null
      ? L({ en: 'Checking Health Connect…', fr: 'Vérification de Health Connect…' })
      : healthStatus === 'available'
        ? settings.healthConnectEnabled
          ? L({ en: 'Health Connect linked', fr: 'Health Connect relié' })
          : L({ en: 'Health Connect available', fr: 'Health Connect disponible' })
        : healthStatus === 'needs_build'
          ? L({ en: 'Needs the installed app (not Expo Go)', fr: 'Nécessite l’app installée (pas Expo Go)' })
          : healthStatus === 'not_android'
            ? L({ en: 'Android only', fr: 'Android uniquement' })
            : healthStatus === 'update_required'
              ? L({ en: 'Update Health Connect in the Play Store', fr: 'Mets à jour Health Connect sur le Play Store' })
              : L({ en: 'Install Health Connect from the Play Store', fr: 'Installe Health Connect depuis le Play Store' });
  const healthColor = linked ? t.success : healthStatus === 'update_required' || healthStatus === 'not_installed' ? t.danger : t.textTertiary;

  const keySteps = [
    L({
      en: 'Open aistudio.google.com and sign in with your Google account.',
      fr: 'Ouvre aistudio.google.com et connecte-toi avec ton compte Google.',
    }),
    L({ en: 'Tap “Get API key” → “Create API key”.', fr: 'Touche « Get API key » → « Create API key ».' }),
    L({
      en: 'Copy it and paste it below. It is stored encrypted on this phone only.',
      fr: 'Copie-la et colle-la ci-dessous. Elle est chiffrée et reste sur ce téléphone.',
    }),
  ];

  return (
    <Screen back title={profile.name || L({ en: 'Profile', fr: 'Profil' })}>
      <Txt variant="numMedium" tone="secondary">
        {`${profile.age} ${L({ en: 'y', fr: 'ans' })} · ${fmt(profile.heightCm)} cm · ${kg(profile.weightKg)} kg`}
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
        {L({ en: ' sessions / week', fr: ' séances / semaine' })}
      </Txt>
      <View style={[styles.buttonRow, { marginTop: space.lg }]}>
        <Button
          variant="tonal"
          label={L({ en: 'Update my answers', fr: 'Modifier mes réponses' })}
          icon={(c) => <ListChecks size={20} color={c} />}
          onPress={() => router.push({ pathname: '/onboarding', params: { edit: '1' } })}
        />
        <Button variant="outlined" label={L({ en: 'My plan', fr: 'Mon plan' })} onPress={() => router.push('/plan')} />
      </View>
      <Txt variant="caption" tone="tertiary" style={{ marginTop: space.md }}>
        {L({
          en: 'Redo the questions whenever something changes (new gym, more free time, new goal). Your history is kept.',
          fr: 'Refais le questionnaire dès que quelque chose change (nouvelle salle, plus de temps, nouvel objectif). Ton historique est conservé.',
        })}
      </Txt>

      {/* AI */}
      <Section title={L({ en: 'AI food scanning & coach', fr: 'Scan IA des repas & coach' })}>
        <StatusRow color={keyStatus.color} text={keyStatus.text} />
        {keyDetail ? <ErrorDetail text={keyDetail} /> : null}
        {!hasKey ? (
          <>
            <Txt variant="caption" tone="secondary" style={{ marginTop: space.md }}>
              {L({ en: 'Free, no card needed:', fr: 'Gratuit, sans carte bancaire :' })}
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
              label={L({ en: 'Open Google AI Studio', fr: 'Ouvrir Google AI Studio' })}
              icon={(c) => <ExternalLink size={20} color={c} />}
              onPress={() => Linking.openURL('https://aistudio.google.com/apikey')}
              style={{ marginTop: space.lg }}
            />
            <Field
              containerStyle={{ marginTop: space.lg }}
              label={L({ en: 'Your Gemini API key', fr: 'Ta clé API Gemini' })}
              leading={<KeyRound size={20} color={t.textTertiary} />}
              value={keyInput}
              onChangeText={setKeyInput}
              placeholder="AIza…"
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry
            />
            <Button
              label={L({ en: 'Save & test', fr: 'Enregistrer et tester' })}
              onPress={saveKey}
              disabled={!keyInput.trim()}
              style={{ marginTop: space.md }}
            />
          </>
        ) : (
          <View style={[styles.buttonRow, { marginTop: space.md }]}>
            <Button variant="tonal" label={L({ en: 'Test', fr: 'Tester' })} onPress={runKeyTest} loading={keyState === 'testing'} />
            <Button variant="text" label={L({ en: 'Remove key', fr: 'Supprimer la clé' })} onPress={removeKey} />
          </View>
        )}
        <View style={[styles.orBlock, { borderTopColor: t.hairline }]}>
          <Txt variant="bodyStrong">{L({ en: 'Or use OpenRouter', fr: 'Ou utilise OpenRouter' })}</Txt>
          <Txt variant="caption" tone="secondary" style={{ marginTop: 2, marginBottom: space.sm }}>
            {L({
              en: 'Works instead of Gemini, or takes over when Gemini’s free limit runs out. NutriLens only uses OpenRouter’s free models, so nothing is charged.',
              fr: 'Remplace Gemini, ou prend le relais quand la limite gratuite de Gemini est atteinte. NutriLens n’utilise que les modèles gratuits d’OpenRouter : rien n’est facturé.',
            })}
          </Txt>
          <StatusRow color={orStatus.color} text={orStatus.text} />
          {orDetail ? <ErrorDetail text={orDetail} /> : null}
          {builtInOr ? (
            <View style={[styles.buttonRow, { marginTop: space.md }]}>
              {orState === 'policy' ? (
                <Button
                  label={L({ en: 'Open privacy settings', fr: 'Ouvrir la confidentialité' })}
                  icon={(c) => <ExternalLink size={20} color={c} />}
                  onPress={() => Linking.openURL('https://openrouter.ai/settings/privacy')}
                />
              ) : null}
              <Button variant="tonal" label={L({ en: 'Test', fr: 'Tester' })} onPress={runOrTest} loading={orState === 'testing'} />
            </View>
          ) : !hasOrKey ? (
            <>
              <Field
                containerStyle={{ marginTop: space.md }}
                label={L({ en: 'Your OpenRouter API key', fr: 'Ta clé API OpenRouter' })}
                leading={<KeyRound size={20} color={t.textTertiary} />}
                value={orInput}
                onChangeText={setOrInput}
                placeholder="sk-or-…"
                autoCapitalize="none"
                autoCorrect={false}
                secureTextEntry
              />
              <Button
                label={L({ en: 'Save & test', fr: 'Enregistrer et tester' })}
                onPress={saveOrKey}
                disabled={!orInput.trim()}
                style={{ marginTop: space.md }}
              />
            </>
          ) : (
            <View style={[styles.buttonRow, { marginTop: space.md }]}>
              {orState === 'policy' ? (
                <Button
                  label={L({ en: 'Open privacy settings', fr: 'Ouvrir la confidentialité' })}
                  icon={(c) => <ExternalLink size={20} color={c} />}
                  onPress={() => Linking.openURL('https://openrouter.ai/settings/privacy')}
                />
              ) : null}
              <Button variant="tonal" label={L({ en: 'Test', fr: 'Tester' })} onPress={runOrTest} loading={orState === 'testing'} />
              <Button variant="text" label={L({ en: 'Remove key', fr: 'Supprimer la clé' })} onPress={removeOrKey} />
            </View>
          )}
        </View>
        <Why title={L({ en: 'Is it really free? What about privacy?', fr: 'C’est vraiment gratuit ? Et la confidentialité ?' })} style={{ marginTop: space.lg }}>
          <Txt variant="body" tone="secondary">
            {L({
              en: 'Gemini’s free tier allows a limited number of requests per minute and per day — plenty for logging your own meals. Google may use free-tier requests (your meal photos and questions) to improve its products, so don’t send anything private. Nothing is charged because no payment method is attached.\n\nOpenRouter’s free models allow about 50 requests a day on an account without credits. The companies running those free models may log or train on what you send, and OpenRouter asks you to allow that in its privacy settings first.',
              fr: 'La version gratuite de Gemini autorise un nombre limité de requêtes par minute et par jour — largement assez pour tes propres repas. Google peut utiliser les requêtes gratuites (photos de repas et questions) pour améliorer ses produits : n’envoie rien de privé. Rien n’est facturé puisqu’aucun moyen de paiement n’est associé.\n\nLes modèles gratuits d’OpenRouter permettent environ 50 requêtes par jour sur un compte sans crédits. Les sociétés qui font tourner ces modèles gratuits peuvent enregistrer ou utiliser ce que tu envoies, et OpenRouter demande d’abord de l’autoriser dans ses réglages de confidentialité.',
            })}
          </Txt>
        </Why>
      </Section>

      {/* Health Connect */}
      <Section title={L({ en: 'Phone & watch', fr: 'Téléphone et montre' })}>
        <StatusRow color={healthColor} text={healthText} />
        {settings.lastHealthSyncAt ? (
          <Txt variant="caption" tone="tertiary" style={{ marginTop: space.xs, marginLeft: 20 }}>
            {L({ en: 'Last sync: {{d}}', fr: 'Dernière synchro : {{d}}' }, { d: fmtDate(settings.lastHealthSyncAt) })}
          </Txt>
        ) : null}
        {healthStatus === 'available' ? (
          settings.healthConnectEnabled ? (
            <View style={[styles.buttonRow, { marginTop: space.md }]}>
              <Button
                variant="tonal"
                label={L({ en: 'Sync now', fr: 'Synchroniser' })}
                icon={(c) => <RefreshCw size={20} color={c} />}
                onPress={sync}
                loading={syncing}
              />
              <Button variant="outlined" label={L({ en: 'Permissions', fr: 'Autorisations' })} onPress={openHealthSettings} />
            </View>
          ) : (
            <Button
              label={L({ en: 'Connect Health Connect', fr: 'Connecter Health Connect' })}
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
            label={L({ en: 'Stop using watch data', fr: 'Ne plus utiliser la montre' })}
            onPress={() => updateSettings({ healthConnectEnabled: false })}
            style={styles.inlineText}
          />
        ) : null}
        <Why
          title={L({ en: 'Make your watch send data to Health Connect', fr: 'Faire envoyer les données de ta montre à Health Connect' })}
          style={{ marginTop: space.lg }}
        >
          <RichText
            text={L({
              en: 'First, let your watch app write into Health Connect (menu names change between app versions, so look for “Health Connect” in its settings):\n\n- Garmin: Garmin Connect app → settings → Connected apps → Health Connect.\n- Xiaomi / Redmi: Mi Fitness app → profile → third-party / add accounts → Health Connect.\n- Amazfit: Zepp app → profile → add accounts → Health Connect.\n- Allow at least steps, calories, sleep and heart rate.\n\nThen come back here and tap “Connect”. NutriLens only reads; it never changes your data. Google Fit is being shut down, so Health Connect is how your phone and watch share data now. Your Google account is used separately, for backup (below).',
              fr: 'D’abord, autorise l’app de ta montre à écrire dans Health Connect (les noms de menus changent selon les versions : cherche « Health Connect » dans ses réglages) :\n\n- Garmin : app Garmin Connect → paramètres → applications connectées → Health Connect.\n- Xiaomi / Redmi : app Mi Fitness → profil → données tierces / ajouter des comptes → Health Connect.\n- Amazfit : app Zepp → profil → ajouter des comptes → Health Connect.\n- Autorise au moins les pas, les calories, le sommeil et la fréquence cardiaque.\n\nReviens ensuite ici et touche « Connecter ». NutriLens lit uniquement ; il ne modifie jamais tes données. Google Fit est en cours de fermeture : c’est désormais Health Connect qui relie ton téléphone et ta montre. Ton compte Google sert séparément, à la sauvegarde (ci-dessous).',
            })}
          />
        </Why>
      </Section>

      {/* Google account */}
      <Section title={L({ en: 'Google account & backup', fr: 'Compte Google et sauvegarde' })}>
        {user ? (
          <>
            <StatusRow color={t.success} text={user.email ?? L({ en: 'Signed in', fr: 'Connecté' })} />
            <Txt variant="caption" tone="tertiary" style={{ marginTop: space.xs, marginLeft: 20 }}>
              {L(
                { en: 'Last backup: {{d}} · automatic once a day', fr: 'Dernière sauvegarde : {{d}} · automatique une fois par jour' },
                { d: fmtDate(settings.lastBackupAt) },
              )}
            </Txt>
            <View style={[styles.buttonRow, { marginTop: space.md }]}>
              <Button
                variant="tonal"
                label={L({ en: 'Back up now', fr: 'Sauvegarder' })}
                onPress={() => backup()}
                loading={cloudBusy === 'backup'}
                disabled={!!cloudBusy && cloudBusy !== 'backup'}
              />
              <Button
                variant="outlined"
                label={L({ en: 'Restore', fr: 'Restaurer' })}
                onPress={() => setRestoreOpen(true)}
                loading={cloudBusy === 'restore'}
                disabled={!!cloudBusy && cloudBusy !== 'restore'}
              />
            </View>
            <Button
              variant="text"
              label={L({ en: 'Sign out', fr: 'Se déconnecter' })}
              icon={(c) => <LogOut size={20} color={c} />}
              onPress={leave}
              loading={cloudBusy === 'signout'}
              style={styles.inlineText}
            />
          </>
        ) : signInState === 'ready' ? (
          <>
            <Txt variant="body" tone="secondary">
              {L({
                en: 'Sign in to back up your diary, weights, plan and workouts to your own Google account (Firebase, free). Restore them on a new phone.',
                fr: 'Connecte-toi pour sauvegarder ton journal, ton poids, ton plan et tes séances sur ton propre compte Google (Firebase, gratuit). Restaure-les sur un nouveau téléphone.',
              })}
            </Txt>
            <Button
              label={L({ en: 'Sign in with Google', fr: 'Se connecter avec Google' })}
              onPress={signIn}
              loading={cloudBusy === 'signin'}
              style={{ marginTop: space.lg }}
            />
          </>
        ) : (
          <Txt variant="caption" tone="secondary">
            {signInState === 'needs_build'
              ? L({
                  en: 'Google sign-in works in the installed NutriLens app (development build), not in Expo Go. See SETUP.md in the project.',
                  fr: 'La connexion Google fonctionne dans l’app NutriLens installée (build de développement), pas dans Expo Go. Voir SETUP.md dans le projet.',
                })
              : L({
                  en: 'Google sign-in needs EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID in the .env file. See SETUP.md in the project.',
                  fr: 'La connexion Google nécessite EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID dans le fichier .env. Voir SETUP.md dans le projet.',
                })}
          </Txt>
        )}
        {cloudError ? (
          <Txt variant="caption" tone="danger" style={{ marginTop: space.sm }}>
            {cloudError}
          </Txt>
        ) : null}
      </Section>

      <Group style={{ marginTop: space.xxl }}>
        <ListItem
          title={L({ en: 'Appearance, language & data', fr: 'Apparence, langue et données' })}
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
          })}
        </Txt>
      ) : null}

      <Sheet visible={restoreOpen} onClose={() => setRestoreOpen(false)} title={L({ en: 'Restore your backup?', fr: 'Restaurer ta sauvegarde ?' })}>
        <Txt variant="body" tone="secondary">
          {L({
            en: 'This replaces the diary, weights, plan and workouts on this phone with the copy saved in your Google account. Anything logged here since that backup will be lost.',
            fr: 'Cela remplace le journal, le poids, le plan et les séances de ce téléphone par la copie enregistrée sur ton compte Google. Tout ce que tu as noté ici depuis cette sauvegarde sera perdu.',
          })}
        </Txt>
        <Button variant="danger" label={L({ en: 'Replace with my backup', fr: 'Remplacer par ma sauvegarde' })} onPress={restore} fill size="lg" style={{ marginTop: space.xl }} />
        <Button variant="text" label={L({ en: 'Cancel', fr: 'Annuler' })} onPress={() => setRestoreOpen(false)} fill style={{ marginTop: space.sm }} />
      </Sheet>
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
