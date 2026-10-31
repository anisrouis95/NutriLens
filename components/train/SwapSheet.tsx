// The swap list: replacements for one exercise, same movement first, then
// exercises for the same muscles, never one that loads a painful joint the
// user named in the questionnaire. In a session it can also change the program.

import { useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View, useWindowDimensions } from 'react-native';
import { ArrowLeftRight, TriangleAlert } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppData } from '@/contexts/AppDataContext';
import { Divider, Sheet, Tap, Toggle, Txt } from '@/components/ds';
import { ExerciseThumb } from '@/components/exercise/ExerciseAnimation';
import { exerciseImageUrls, exerciseName, getExercise, MUSCLE_NAMES, type Muscle } from '@/lib/exercises';
import { LIMITATION_NAMES, swapOptions } from '@/lib/swap';
import { radius, space, useTokens } from '@/theme';
import type { LocalizedText } from '@/lib/i18n';

const T = {
  title: { en: 'Swap exercise', fr: 'Changer d’exercice', tn: 'بدّل التمرين', tnLatn: 'Baddel l exercice' },
  replacing: {
    en: 'Instead of {{name}}: the same movement first, then exercises for the same muscles.',
    fr: 'À la place de {{name}} : d’abord le même mouvement, puis des exercices pour les mêmes muscles.',
    tn: 'في بلاصة {{name}}: الأوّل نفس الحركة، ومن بعد تمارين لنفس العضلات.',
    tnLatn: 'Fi blasset {{name}}: lowel nafs el 7arka, w ba3d exercices l nafs les muscles.',
  },
  currentConflict: {
    en: 'Not recommended for your {{parts}}: pick one below.',
    fr: 'Déconseillé pour tes {{parts}} : choisis-en un ci-dessous.',
    tn: 'موش منصوح بيه لـ {{parts}} متاعك: اختار واحد من لوطة.',
    tnLatn: 'Moch mansou7 bih l {{parts}} mte3ek: 5tar wa7ed men louta.',
  },
  hidden: {
    en: '{{n}} hidden because they load your {{parts}}.',
    fr: '{{n}} masqués car ils sollicitent tes {{parts}}.',
    tn: '{{n}} مخبّيين خاطر يتعبو {{parts}} متاعك.',
    tnLatn: '{{n}} m5abyin 5ater yta3bou {{parts}} mte3ek.',
  },
  program: { en: 'Also change my program', fr: 'Changer aussi mon programme', tn: 'بدّل في البرنامج زادة', tnLatn: 'Baddel fel programme zeda' },
  programHint: {
    en: 'Off: only today’s session changes.',
    fr: 'Désactivé : seule la séance du jour change.',
    tn: 'مسكّر: كان حصّة اليوم تتبدّل.',
    tnLatn: 'Msakker: ken séance lyoum tetbaddel.',
  },
  sameMove: { en: 'Same movement', fr: 'Même mouvement', tn: 'نفس الحركة', tnLatn: 'Nafs el 7arka' },
  sameMuscles: { en: 'Same muscles', fr: 'Mêmes muscles', tn: 'نفس العضلات', tnLatn: 'Nafs les muscles' },
  none: {
    en: 'No safe replacement with your equipment. Ask the coach, or skip this exercise today.',
    fr: 'Aucun remplacement sûr avec ton matériel. Demande au coach, ou saute cet exercice aujourd’hui.',
    tn: 'ما فماش تعويض آمن بالماتريال متاعك. سقسي الكوتش، ولا فوّت التمرين هذا اليوم.',
    tnLatn: 'Ma famech ta3widh amen bel matériel mte3ek. Sa9si el coach, walla fawwet l exercice hedha lyoum.',
  },
} satisfies Record<string, LocalizedText>;

export default function SwapSheet({
  visible,
  onClose,
  currentId,
  slot,
  exclude,
  canKeepInSession,
  onPick,
}: {
  visible: boolean;
  onClose: () => void;
  currentId: string;
  slot: string;
  /** Other exercises of the same session. */
  exclude: string[];
  /** In a running session: offer "only today" as well as "change my program". */
  canKeepInSession?: boolean;
  onPick: (newId: string, inProgram: boolean) => void;
}) {
  const t = useTokens();
  const { height } = useWindowDimensions();
  const { L, language } = useLanguage();
  const { profile } = useAppData();
  const [inProgram, setInProgram] = useState(true);

  const result = useMemo(
    () => (profile ? swapOptions(currentId, slot, profile, exclude) : null),
    [currentId, slot, profile, exclude],
  );
  const current = getExercise(currentId);
  if (!profile || !result || !current) return null;

  // Mid-sentence, so lower case ("your knees"); Arabic has no case.
  const parts = (list: string[]) => list.map((l) => L(LIMITATION_NAMES[l as keyof typeof LIMITATION_NAMES])).join(', ').toLowerCase();
  const muscles = (ids: string[]) => ids.map((m) => L(MUSCLE_NAMES[m as Muscle])).join(', ');

  return (
    <Sheet visible={visible} onClose={onClose} title={L(T.title)}>
      <Txt variant="caption" tone="secondary">
        {L(T.replacing, { name: exerciseName(current, language) })}
      </Txt>
      {result.currentConflicts.length ? (
        <View style={[styles.warning, { backgroundColor: t.dangerSoft }]}>
          <TriangleAlert size={18} color={t.danger} />
          <Txt variant="label" color={t.danger} style={{ flex: 1 }}>
            {L(T.currentConflict, { parts: parts(result.currentConflicts) })}
          </Txt>
        </View>
      ) : null}

      {canKeepInSession ? (
        <View style={styles.toggleRow}>
          <View style={{ flex: 1 }}>
            <Txt variant="bodyStrong">{L(T.program)}</Txt>
            <Txt variant="caption" tone="tertiary">
              {L(T.programHint)}
            </Txt>
          </View>
          <Toggle value={inProgram} onChange={setInProgram} label={L(T.program)} />
        </View>
      ) : null}

      <ScrollView style={{ maxHeight: height * 0.5, marginTop: space.md }} contentContainerStyle={{ paddingBottom: space.sm }}>
        {result.options.length ? (
          result.options.map((o, n) => {
            const ex = getExercise(o.id);
            if (!ex) return null;
            const startsGroup = n === 0 || result.options[n - 1].reason !== o.reason;
            return (
              <View key={o.id}>
                {startsGroup ? (
                  <Txt variant="overline" tone="tertiary" style={{ marginTop: n === 0 ? 0 : space.lg, marginBottom: space.xs }}>
                    {L(o.reason === 'same_move' ? T.sameMove : T.sameMuscles)}
                  </Txt>
                ) : (
                  <Divider inset={56 + space.md} />
                )}
                <Tap
                  onPress={() => onPick(o.id, !canKeepInSession || inProgram)}
                  pressScale={0.99}
                  pressedStyle={{ backgroundColor: t.pressed }}
                  style={styles.row}
                  accessibilityLabel={`${exerciseName(ex, language)}. ${muscles(ex.primaryMuscles)}`}
                >
                  <ExerciseThumb uri={exerciseImageUrls(ex)[0]} size={56} />
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Txt variant="bodyStrong" numberOfLines={2}>
                      {exerciseName(ex, language)}
                    </Txt>
                    <Txt variant="caption" tone="secondary" numberOfLines={1} style={{ marginTop: 2 }}>
                      {muscles(ex.primaryMuscles)}
                    </Txt>
                  </View>
                  <ArrowLeftRight size={20} color={t.accentText} />
                </Tap>
              </View>
            );
          })
        ) : (
          <Txt tone="secondary">{L(T.none)}</Txt>
        )}
        {result.hiddenByLimits ? (
          <Txt variant="caption" tone="tertiary" style={{ marginTop: space.lg }}>
            {L(T.hidden, { n: result.hiddenByLimits, parts: parts(profile.limitations) })}
          </Txt>
        ) : null}
      </ScrollView>
    </Sheet>
  );
}

const styles = StyleSheet.create({
  warning: { flexDirection: 'row', alignItems: 'center', gap: space.sm, borderRadius: radius.md, padding: space.md, marginTop: space.md },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: space.lg, marginTop: space.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingVertical: space.sm, borderRadius: radius.md },
});
