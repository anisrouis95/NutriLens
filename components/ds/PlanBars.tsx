// The plan reveal: what you burn against what you eat, as two bars on one
// scale. The burn bar is split into its parts (resting, movement, workouts,
// digestion) in graphite steps; the eat bar is volt. Both grow from the left
// once, then the note says what the gap means per week.

import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useReducedMotion, useSharedValue, withDelay, withTiming } from 'react-native-reanimated';
import { useEffect } from 'react';
import { motion, space, useTokens } from '@/theme';
import { Txt, useFormat } from './primitives';
import { useLanguage } from '@/contexts/LanguageContext';

export interface PlanStratum {
  key: string;
  /** Short caption, e.g. "Resting". */
  label: string;
  kcal: number;
}

/** What the gap between eating and burning means, shown under the Eat bar. */
export interface PlanBarsNote {
  /** e.g. "730 kcal". */
  amount?: string;
  /** e.g. "less than you burn". */
  text: string;
  /** e.g. "≈ 0.66 kg". */
  rate?: string;
  /** e.g. "less per week". */
  rateText?: string;
}

const BAR = 14;

function GrowBar({ fraction, delay, children }: { fraction: number; delay: number; children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const p = useSharedValue(reduce ? 1 : 0);
  useEffect(() => {
    if (!reduce) p.value = withDelay(delay, withTiming(1, { duration: motion.slow * 2, easing: motion.easeOut }));
  }, [p, delay, reduce]);
  const grow = useAnimatedStyle(() => ({ transform: [{ scaleX: p.value }] }));
  // Grows from the reading start (right to left in Darija's Arabic letters).
  const origin = useLanguage().rtl ? 'right' : 'left';
  return (
    <View style={styles.track}>
      <Animated.View style={[styles.bar, { width: `${Math.max(0, Math.min(1, fraction)) * 100}%`, transformOrigin: origin }, grow]}>{children}</Animated.View>
    </View>
  );
}

export default function PlanBars({
  burn,
  eat,
  strata,
  burnLabel,
  eatLabel,
  note,
  accessibilityLabel,
}: {
  burn: number;
  eat: number;
  strata?: PlanStratum[];
  /** Unit and meaning after the burn value, e.g. "kcal/day burned". */
  burnLabel: string;
  /** Unit and meaning after the eat value, e.g. "kcal/day to eat". */
  eatLabel: string;
  note?: PlanBarsNote;
  accessibilityLabel: string;
}) {
  const t = useTokens();
  const fmt = useFormat();
  const max = Math.max(burn, eat, 1);
  const parts = (strata ?? []).filter((s) => s.kcal > 0);
  // Graphite steps, brightest at the base (resting) so the parts read in order.
  const shades = [t.textTertiary, t.border, t.pressed, t.surfaceHigh];

  return (
    <View accessible accessibilityLabel={accessibilityLabel}>
      <View style={styles.valueRow}>
        <Txt variant="numLarge" style={styles.value}>
          {fmt(burn)}
        </Txt>
        <Txt variant="overline" tone="tertiary" style={{ flexShrink: 1 }}>
          {burnLabel}
        </Txt>
      </View>
      <GrowBar fraction={burn / max} delay={0}>
        {parts.length ? (
          <View style={styles.parts}>
            {parts.map((p, i) => (
              <View key={p.key} style={{ flex: p.kcal, backgroundColor: shades[i % shades.length] }} />
            ))}
          </View>
        ) : (
          <View style={[StyleSheet.absoluteFill, { backgroundColor: t.textTertiary }]} />
        )}
      </GrowBar>
      {parts.length ? (
        <View style={styles.legend}>
          {parts.map((p, i) => (
            <View key={p.key} style={styles.legendItem}>
              <View style={[styles.swatch, { backgroundColor: shades[i % shades.length] }]} />
              <Txt variant="caption" tone="secondary">
                {`${p.label} ${fmt(p.kcal)}`}
              </Txt>
            </View>
          ))}
        </View>
      ) : null}

      <View style={[styles.valueRow, { marginTop: space.xl }]}>
        <Txt variant="numLarge" tone="accent" style={styles.value}>
          {fmt(eat)}
        </Txt>
        <Txt variant="overline" tone="accent" style={{ flexShrink: 1 }}>
          {eatLabel}
        </Txt>
      </View>
      <GrowBar fraction={eat / max} delay={motion.slow}>
        <View style={[StyleSheet.absoluteFill, { backgroundColor: t.accent }]} />
      </GrowBar>

      {note ? (
        <View style={styles.note}>
          <Txt variant="bodyStrong">
            {note.amount ? `${note.amount} ` : ''}
            <Txt variant="body" tone="secondary">
              {note.text}
            </Txt>
          </Txt>
          {note.rateText ? (
            <Txt variant="bodyStrong" style={{ marginTop: 2 }}>
              {note.rate ? `${note.rate} ` : ''}
              <Txt variant="body" tone="secondary">
                {note.rateText}
              </Txt>
            </Txt>
          ) : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  valueRow: { flexDirection: 'row', alignItems: 'baseline', gap: space.sm, marginBottom: space.sm },
  value: { fontSize: 44, lineHeight: 48 },
  track: { height: BAR },
  bar: { height: BAR, borderRadius: BAR / 2, overflow: 'hidden' },
  parts: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, flexDirection: 'row', gap: 2 },
  legend: { flexDirection: 'row', flexWrap: 'wrap', columnGap: space.lg, rowGap: space.xs, marginTop: space.sm },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: space.xs + 2 },
  swatch: { width: 8, height: 8, borderRadius: 2 },
  note: { marginTop: space.lg },
});
