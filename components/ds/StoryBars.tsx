// Story bars: a row of thin segments, one per step (exercise in a workout,
// session in a week, step of the questionnaire). Each fills in volt as its
// part is done; the current segment's track brightens. Segments can be
// tapped to jump when `onPress` is given.

import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Animated, { useAnimatedStyle, useDerivedValue, useReducedMotion, withTiming } from 'react-native-reanimated';
import { motion, space, useTokens } from '@/theme';
import { Tap } from './primitives';
import { useLanguage } from '@/contexts/LanguageContext';

function Segment({
  value,
  current,
  height,
  color,
  track,
  currentTrack,
}: {
  value: number;
  current: boolean;
  height: number;
  color: string;
  track: string;
  currentTrack: string;
}) {
  const reduce = useReducedMotion();
  const clamped = Math.min(Math.max(value, 0), 1);
  const p = useDerivedValue(
    () => (reduce ? clamped : withTiming(clamped, { duration: motion.slow, easing: motion.easeOut })),
    [clamped, reduce],
  );
  const fill = useAnimatedStyle(() => ({ transform: [{ scaleX: p.value }] }));
  // Fills from the reading start: the left, or the right in Darija's Arabic letters.
  const origin = useLanguage().rtl ? 'right' : 'left';
  return (
    <View style={[styles.segment, { height, borderRadius: height / 2, backgroundColor: current ? currentTrack : track }]}>
      <Animated.View style={[styles.fill, { backgroundColor: color, borderRadius: height / 2, transformOrigin: origin }, fill]} />
    </View>
  );
}

export function StoryBars({
  segments,
  current,
  height = 4,
  color,
  track,
  onPress,
  labels,
  style,
}: {
  /** Fill of each segment, 0..1. */
  segments: number[];
  current?: number;
  height?: number;
  color?: string;
  track?: string;
  onPress?: (index: number) => void;
  /** Accessibility label per segment (used when tappable). */
  labels?: string[];
  style?: StyleProp<ViewStyle>;
}) {
  const t = useTokens();
  const fillColor = color ?? t.accent;
  const trackColor = track ?? t.track;
  const currentTrack = track ? track : t.border;
  return (
    <View style={[styles.row, style]} accessibilityRole={onPress ? undefined : 'progressbar'}>
      {segments.map((v, i) => {
        const bar = (
          <Segment
            value={v}
            current={i === current}
            height={height}
            color={fillColor}
            track={trackColor}
            currentTrack={currentTrack}
          />
        );
        if (!onPress) {
          return (
            <View key={i} style={styles.cell}>
              {bar}
            </View>
          );
        }
        return (
          <Tap
            key={i}
            onPress={() => onPress(i)}
            haptic="selection"
            pressScale={1}
            accessibilityLabel={labels?.[i]}
            accessibilityState={{ selected: i === current }}
            // The bar is thin; the touch area is a full 24dp strip around it.
            style={[styles.cell, styles.tapCell]}
          >
            {bar}
          </Tap>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', gap: space.xs },
  cell: { flex: 1, minWidth: 0 },
  tapCell: { height: 24, justifyContent: 'center' },
  segment: { overflow: 'hidden' },
  fill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 },
});
