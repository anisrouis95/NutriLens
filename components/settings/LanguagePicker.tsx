// Language choice: four options, each named in itself. Moving to or from
// Darija in Arabic letters flips the layout direction, which needs a restart,
// so that switch is confirmed first (in both the current and the new language).

import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button, Chip, ChipRow, OptionTile, Sheet, Txt } from '@/components/ds';
import { isRTLLanguage, LANGUAGE_NAMES, LANGUAGES, pick, type Language, type LocalizedText } from '@/lib/i18n';
import { space } from '@/theme';

const RESTART: { toRtl: LocalizedText; toLtr: LocalizedText } = {
  toRtl: {
    en: 'The app restarts to show everything right to left.',
    fr: 'L’app redémarre pour tout afficher de droite à gauche.',
    tn: 'التطبيق باش يتسكّر و يتحلّ وحدو، باش كل شي يولّي من اليمين لليسار.',
    tnLatn: "L'app bech tetsakker w tet7all wa7adha, bech kol chay ywalli mel imin lel isar.",
  },
  toLtr: {
    en: 'The app restarts to show everything left to right.',
    fr: 'L’app redémarre pour tout afficher de gauche à droite.',
    tn: 'التطبيق باش يتسكّر و يتحلّ وحدو، باش كل شي يولّي من اليسار لليمين.',
    tnLatn: "L'app bech tetsakker w tet7all wa7adha, bech kol chay ywalli mel isar lel imin.",
  },
};

const SWITCH: LocalizedText = { en: 'Switch', fr: 'Changer', tn: 'بدّل', tnLatn: 'Baddel' };
const CANCEL: LocalizedText = { en: 'Cancel', fr: 'Annuler', tn: 'بطّل', tnLatn: 'Batel' };

/** Which script each Darija option uses, said in that option's own language. */
const SCRIPT_HINT: Partial<Record<Language, string>> = {
  tn: 'الدارجة التونسية بالحروف العربية',
  tnLatn: 'Darija tounsia b 7rouf latin (3, 7, 9…)',
};

export function LanguagePicker({ compact }: { compact?: boolean }) {
  const { language, setLanguage } = useLanguage();
  const [pending, setPending] = useState<Language | null>(null);

  const choose = (next: Language) => {
    if (next === language) return;
    if (isRTLLanguage(next) !== isRTLLanguage(language)) setPending(next);
    else setLanguage(next);
  };

  const notice = pending ? (isRTLLanguage(pending) ? RESTART.toRtl : RESTART.toLtr) : null;

  return (
    <>
      {compact ? (
        <ChipRow>
          {LANGUAGES.map((l) => (
            <Chip key={l} label={LANGUAGE_NAMES[l].name} selected={l === language} onPress={() => choose(l)} />
          ))}
        </ChipRow>
      ) : (
        <View style={styles.tiles}>
          {LANGUAGES.map((l) => (
            <OptionTile
              key={l}
              title={LANGUAGE_NAMES[l].name}
              description={SCRIPT_HINT[l]}
              selected={l === language}
              onPress={() => choose(l)}
            />
          ))}
        </View>
      )}
      <Sheet visible={!!pending} onClose={() => setPending(null)} title={pending ? LANGUAGE_NAMES[pending].name : undefined}>
        {pending && notice ? (
          <View style={{ gap: space.sm }}>
            {/* Said in the new language, then in the current one if it differs. */}
            <Txt variant="body">{pick(notice, pending)}</Txt>
            {pick(notice, language) !== pick(notice, pending) ? (
              <Txt variant="caption" tone="secondary">
                {pick(notice, language)}
              </Txt>
            ) : null}
            <View style={styles.actions}>
              <Button variant="outlined" label={pick(CANCEL, language)} onPress={() => setPending(null)} style={{ flex: 1 }} />
              <Button
                label={pick(SWITCH, pending)}
                onPress={() => {
                  const next = pending;
                  setPending(null);
                  setLanguage(next);
                }}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        ) : null}
      </Sheet>
    </>
  );
}

const styles = StyleSheet.create({
  tiles: { gap: space.sm },
  actions: { flexDirection: 'row', gap: space.sm, marginTop: space.lg },
});
