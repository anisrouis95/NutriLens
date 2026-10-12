// Front and back body views with the worked muscles inked in volt.
// Primary muscles carry the strongest contrast against the graphite body,
// helpers sit one step quieter in deep volt.
//
// Every part that is not worked — head and hair included — is tinted from the
// graphite ramp. The library's body assets carry their own grey `color` per part
// (which beats `defaultFill`), so the map passes an explicit ramp colour for
// every slug it does not highlight.

import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import Body, { ExtendedBodyPart, Slug } from 'react-native-body-highlighter';
import { Txt } from '@/components/ds';
import { useLanguage } from '@/contexts/LanguageContext';
import { space, useTokens } from '@/theme';
import type { Sex } from '@/types';

/** Every region the male and female front/back assets draw. */
const ALL_SLUGS: Slug[] = [
  'abs',
  'adductors',
  'ankles',
  'biceps',
  'calves',
  'chest',
  'deltoids',
  'feet',
  'forearm',
  'gluteal',
  'hamstring',
  'hands',
  'hair',
  'head',
  'knees',
  'lower-back',
  'neck',
  'obliques',
  'quadriceps',
  'tibialis',
  'trapezius',
  'triceps',
  'upper-back',
];

/** Unscaled height of one body view in the library (width is half of it). */
export const BODY_HEIGHT = 400;

export function useMuscleColors() {
  const t = useTokens();
  return {
    primary: t.accent,
    helper: t.accentDeep,
    body: t.surfaceHigh,
    outline: t.border,
  };
}

export default function MuscleMap({
  data,
  sex = 'male',
  scale = 0.75,
  onPress,
  showLegend = true,
  showSides = true,
}: {
  data: ExtendedBodyPart[];
  sex?: Sex;
  /** Each view is 400 × scale dp tall and 200 × scale dp wide. */
  scale?: number;
  onPress?: (part: ExtendedBodyPart) => void;
  showLegend?: boolean;
  /** "Front" / "Back" captions under the views. Off for compact inline maps. */
  showSides?: boolean;
}) {
  const { L } = useLanguage();
  const c = useMuscleColors();

  // Worked parts keep their intensity (→ volt tones); everything else gets an
  // explicit ramp colour so the asset greys never show.
  const painted = useMemo<ExtendedBodyPart[]>(() => {
    const worked = new Set(data.map((p) => p.slug).filter(Boolean));
    return [...ALL_SLUGS.filter((slug) => !worked.has(slug)).map((slug) => ({ slug, color: c.body })), ...data];
  }, [data, c.body]);

  // The library maps intensity 1 → colors[0], intensity 2 → colors[1].
  const common = {
    data: painted,
    gender: sex,
    scale,
    colors: [c.helper, c.primary],
    defaultFill: c.body,
    border: c.outline,
    onBodyPartPress: onPress,
  };
  return (
    <View>
      <View style={[styles.row, !showSides && styles.rowTight]}>
        <View style={[styles.side, showSides && styles.sideFlex]}>
          <Body {...common} side="front" />
          {showSides ? (
            <Txt variant="caption" tone="tertiary" style={styles.sideLabel}>
              {L({ en: 'Front', fr: 'Devant' })}
            </Txt>
          ) : null}
        </View>
        <View style={[styles.side, showSides && styles.sideFlex]}>
          <Body {...common} side="back" />
          {showSides ? (
            <Txt variant="caption" tone="tertiary" style={styles.sideLabel}>
              {L({ en: 'Back', fr: 'Dos' })}
            </Txt>
          ) : null}
        </View>
      </View>
      {showLegend ? (
        <View style={styles.legend}>
          <View style={styles.legendItem}>
            <View style={[styles.swatch, { backgroundColor: c.primary }]} />
            <Txt variant="caption" tone="secondary">
              {L({ en: 'Main muscles', fr: 'Muscles principaux' })}
            </Txt>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.swatch, { backgroundColor: c.helper }]} />
            <Txt variant="caption" tone="secondary">
              {L({ en: 'Helpers', fr: 'Muscles d’appoint' })}
            </Txt>
          </View>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'center' },
  rowTight: { gap: space.xs },
  side: { alignItems: 'center' },
  sideFlex: { flex: 1 },
  sideLabel: { marginTop: space.xs },
  legend: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', columnGap: space.lg, rowGap: space.xs, marginTop: space.md },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  swatch: { width: 10, height: 10, borderRadius: 5 },
});
