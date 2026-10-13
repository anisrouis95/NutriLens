// The session card: a full-width photo of the session's first exercise fading
// into black, the session name in Anton, its length, and one volt action.
// Today and Train lead with it.

import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { Check, Play } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button, Txt } from '@/components/ds';
import { exerciseImageUrls, getExercise } from '@/lib/exercises';
import { radius, space, useTokens } from '@/theme';
import type { WorkoutDay } from '@/types';

export default function WorkoutCard({
  day,
  minutes,
  onStart,
  cta,
  done,
  height = 264,
}: {
  day: WorkoutDay;
  minutes: number;
  onStart: () => void;
  /** Button label (defaults to "Start workout"). */
  cta?: string;
  /** Session already finished today: a quiet tag and a tonal button. */
  done?: boolean;
  height?: number;
}) {
  const t = useTokens();
  const { L } = useLanguage();
  const first = day.exercises.map((pe) => getExercise(pe.exerciseId)).find(Boolean);
  const images = first ? exerciseImageUrls(first) : [];
  // The end position usually shows the effort of the movement best.
  const photo = images[1] ?? images[0];
  return (
    <View style={[styles.card, { height, backgroundColor: t.surfaceHigh }]}>
      {photo ? (
        <Image
          source={{ uri: photo }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          contentPosition="top"
          cachePolicy="disk"
          transition={200}
          accessibilityIgnoresInvertColors
        />
      ) : null}
      <LinearGradient
        colors={[`${t.ground}00`, `${t.ground}8C`, `${t.ground}F0`]}
        locations={[0.18, 0.5, 1]}
        style={StyleSheet.absoluteFill}
        pointerEvents="none"
      />
      <View style={styles.body}>
        {done ? (
          <View style={styles.tag}>
            <Check size={14} color={t.accentText} strokeWidth={3} />
            <Txt variant="overline" tone="accent">
              {L({ en: 'Done today · next up', fr: 'Faite aujourd’hui · ensuite', tn: 'كمّلت اليوم · اللي بعدها', tnLatn: 'Kammelt lyoum · eli ba3dha' })}
            </Txt>
          </View>
        ) : null}
        <Txt variant="display" numberOfLines={2} style={styles.name}>
          {L(day.name)}
        </Txt>
        <Txt variant="label" tone="secondary">
          {L(
            { en: '{{n}} exercises · ~{{m}} min', fr: '{{n}} exercices · ~{{m}} min', tn: '{{n}} تمارين · ~{{m}} min', tnLatn: '{{n}} exercices · ~{{m}} min' },
            { n: day.exercises.length, m: minutes },
          )}
        </Txt>
        <Button
          label={cta ?? L({ en: 'Start workout', fr: 'Commencer la séance', tn: 'ابدا الحصّة', tnLatn: 'Ebda séance' })}
          variant={done ? 'tonal' : 'filled'}
          icon={(c) => <Play size={18} color={c} fill={c} />}
          onPress={onStart}
          haptic="light"
          style={styles.cta}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, overflow: 'hidden' },
  body: { position: 'absolute', left: space.lg + 2, right: space.lg + 2, bottom: space.lg },
  tag: { flexDirection: 'row', alignItems: 'center', gap: space.xs + 2, marginBottom: space.xs },
  name: { marginBottom: 2 },
  cta: { marginTop: space.md },
});
