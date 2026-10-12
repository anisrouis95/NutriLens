import { useState } from 'react';
import { Platform, Share, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import Constants from 'expo-constants';
import { Download, Info, RotateCcw } from 'lucide-react-native';
import { useLanguage, type Language } from '@/contexts/LanguageContext';
import { useAppData } from '@/contexts/AppDataContext';
import { Button, Group, ListItem, Screen, Section, Segmented, Sheet, Tap, Txt, useSnackbar } from '@/components/ds';
import { space, useTokens } from '@/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const snackbar = useSnackbar();
  const { language, setLanguage, L } = useLanguage();
  const { exportSnapshot, resetAll } = useAppData();
  const [resetOpen, setResetOpen] = useState(false);
  const [resetting, setResetting] = useState(false);
  const version = Constants.expoConfig?.version ?? '1.0.0';

  const exportData = async () => {
    const json = JSON.stringify(exportSnapshot(), null, 2);
    try {
      if (Platform.OS === 'web') {
        const url = URL.createObjectURL(new Blob([json], { type: 'application/json' }));
        const a = document.createElement('a');
        a.href = url;
        a.download = `nutrilens-${new Date().toISOString().slice(0, 10)}.json`;
        a.click();
        URL.revokeObjectURL(url);
        snackbar.show(L({ en: 'Export downloaded', fr: 'Export téléchargé' }));
        return;
      }
      // Opens the Android share sheet (save to Drive, send to yourself, …).
      await Share.share({ title: 'NutriLens export', message: json });
    } catch {
      snackbar.show(L({ en: 'Could not export your data', fr: 'Impossible d’exporter tes données' }));
    }
  };

  const reset = async () => {
    setResetting(true);
    try {
      await resetAll();
      setResetOpen(false);
      router.replace('/onboarding');
    } finally {
      setResetting(false);
    }
  };

  return (
    <Screen back title={L({ en: 'Settings', fr: 'Réglages' })}>
      <Section title={L({ en: 'Language', fr: 'Langue' })} first>
        <Segmented<Language>
          value={language}
          onChange={setLanguage}
          options={[
            { value: 'en', label: 'English' },
            { value: 'fr', label: 'Français' },
          ]}
        />
      </Section>

      <Section title={L({ en: 'Your data', fr: 'Tes données' })}>
        <Group>
          <ListItem
            title={L({ en: 'Export my data', fr: 'Exporter mes données' })}
            supporting={L({
              en: 'A JSON copy of your diary, weights, plan and workouts',
              fr: 'Une copie JSON de ton journal, ton poids, ton plan et tes séances',
            })}
            leading={(c) => <Download size={22} color={c} />}
            onPress={exportData}
            chevron
            divider
          />
          <DangerRow
            title={L({ en: 'Reset all data', fr: 'Effacer toutes les données' })}
            supporting={L({ en: 'Start again from the questionnaire', fr: 'Recommencer depuis le questionnaire' })}
            onPress={() => setResetOpen(true)}
          />
        </Group>
      </Section>

      <Section title={L({ en: 'About', fr: 'À propos' })}>
        <Group>
          <ListItem
            title="NutriLens"
            supporting={L(
              { en: 'Version {{v}} · plan, eat and train with your own numbers', fr: 'Version {{v}} · planifie, mange et entraîne-toi avec tes chiffres' },
              { v: version },
            )}
            leading={(c) => <Info size={22} color={c} />}
          />
        </Group>
        <Txt variant="caption" tone="tertiary" style={{ marginTop: space.md }}>
          {L({
            en: 'NutriLens gives general guidance, not medical advice. For a health condition, talk to a doctor.',
            fr: 'NutriLens donne des repères généraux, pas un avis médical. En cas de problème de santé, parles-en à un médecin.',
          })}
        </Txt>
      </Section>

      <Sheet visible={resetOpen} onClose={() => setResetOpen(false)} title={L({ en: 'Erase everything?', fr: 'Tout effacer ?' })}>
        <Txt variant="body" tone="secondary">
          {L({
            en: 'This permanently deletes your answers, plan, food diary, weigh-ins, workouts and saved Gemini key from this phone. A cloud backup in your Google account is not touched. This cannot be undone.',
            fr: 'Cela supprime définitivement tes réponses, ton plan, ton journal, tes pesées, tes séances et ta clé Gemini de ce téléphone. Une sauvegarde sur ton compte Google n’est pas touchée. Impossible de revenir en arrière.',
          })}
        </Txt>
        <Button
          variant="danger"
          label={L({ en: 'Erase all data', fr: 'Effacer toutes les données' })}
          onPress={reset}
          loading={resetting}
          fill
          size="lg"
          style={{ marginTop: space.xl }}
        />
        <Button variant="text" label={L({ en: 'Cancel', fr: 'Annuler' })} onPress={() => setResetOpen(false)} fill style={{ marginTop: space.sm }} />
      </Sheet>
    </Screen>
  );
}

/** A list row in the danger tone (ds ListItem has no tone). */
function DangerRow({ title, supporting, onPress }: { title: string; supporting: string; onPress: () => void }) {
  const t = useTokens();
  return (
    <Tap onPress={onPress} pressScale={1} pressedStyle={{ backgroundColor: t.pressed }} accessibilityLabel={title}>
      <View style={styles.row}>
        <View style={styles.leading}>
          <RotateCcw size={22} color={t.danger} />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Txt variant="bodyStrong" tone="danger">
            {title}
          </Txt>
          <Txt variant="caption" tone="secondary" style={{ marginTop: 1 }}>
            {supporting}
          </Txt>
        </View>
      </View>
    </Tap>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.lg,
    minHeight: 64,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  leading: { width: 24, alignItems: 'center' },
});
