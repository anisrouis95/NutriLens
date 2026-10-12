// Horizontal ruler for picking a body measurement without the keyboard:
// swipe to the value, it snaps per tick with a selection haptic; ± buttons
// give precise steps (and work with a mouse in the web preview).
//
// Only user scrolling may change the value. Scrolls the component makes
// itself (initial position, ± buttons) declare where they will land, and every
// scroll event until they arrive is ignored — otherwise intermediate positions
// would feed back into the value.

import React, { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { NativeScrollEvent, NativeSyntheticEvent, ScrollView, StyleSheet, View } from 'react-native';
import { Minus, Plus } from 'lucide-react-native';
import Svg, { Defs, LinearGradient, Rect, Stop } from 'react-native-svg';
import { radius, space, useTokens } from '@/theme';
import { Tap, Txt, hapticTap, useFormat } from './primitives';

const TICK = 12; // px between ticks

interface Props {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  unit: string;
  /** Label every n-th step (on round values). */
  labelEvery?: number;
  decimals?: number;
  /** Colour behind the ruler, so its edges can fade into it (defaults to the screen ground). */
  backdrop?: string;
}

const FADE = 56; // px of fade at each end, wider than a label

export default function RulerPicker({ value, onChange, min, max, step, unit, labelEvery = 10, decimals = 0, backdrop }: Props) {
  const t = useTokens();
  const fadeTo = backdrop ?? t.ground;
  const fadeId = `ruler-fade-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`;
  const fmt = useFormat();
  const scroller = useRef<ScrollView>(null);
  const [width, setWidth] = useState(0);
  const count = Math.round((max - min) / step);
  const indexOf = useCallback((v: number) => Math.round((Math.min(Math.max(v, min), max) - min) / step), [min, max, step]);
  const ticks = useMemo(() => Array.from({ length: count + 1 }, (_, i) => i), [count]);

  const lastIndex = useRef(indexOf(value));
  const initialized = useRef(false);
  const expected = useRef<{ x: number; until: number } | null>(null);

  const scrollToIndex = useCallback((i: number, animated: boolean) => {
    const x = i * TICK;
    expected.current = { x, until: Date.now() + (animated ? 700 : 300) };
    scroller.current?.scrollTo({ x, animated });
  }, []);

  // Follow value changes made outside the ruler (± buttons, parent resets).
  useEffect(() => {
    if (!initialized.current) return;
    const i = indexOf(value);
    if (i !== lastIndex.current) {
      lastIndex.current = i;
      scrollToIndex(i, true);
    }
  }, [value, indexOf, scrollToIndex]);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (!initialized.current) return;
    const x = e.nativeEvent.contentOffset.x;
    const exp = expected.current;
    if (exp) {
      if (Math.abs(x - exp.x) < 2 || Date.now() > exp.until) expected.current = null;
      return;
    }
    const i = Math.min(Math.max(Math.round(x / TICK), 0), count);
    if (i !== lastIndex.current) {
      lastIndex.current = i;
      hapticTap('selection');
      onChange(Math.round((min + i * step) * 100) / 100);
    }
  };

  // The tick marks never depend on the current value, so build them once:
  // scrolling (which changes the value every tick) then re-renders only the
  // readout instead of hundreds of views.
  const tickMarks = useMemo(
    () =>
      ticks.map((i) => {
        // Major ticks sit on round values (20, 30 …), not on min + n.
        const v = min + i * step;
        const isMultiple = (u: number) => Math.abs(v / u - Math.round(v / u)) < 1e-6;
        const major = isMultiple(labelEvery * step);
        const mid = !major && isMultiple((labelEvery * step) / 2);
        return (
          <View key={i} style={{ width: TICK, alignItems: 'center' }}>
            <View
              style={{
                width: major ? 2 : 1.5,
                height: major ? 30 : mid ? 22 : 14,
                borderRadius: 1,
                backgroundColor: major ? t.textSecondary : t.border,
              }}
            />
            {major ? (
              <View style={styles.tickLabel}>
                <Txt variant="numSmall" tone="tertiary">
                  {fmt(v, 0)}
                </Txt>
              </View>
            ) : null}
          </View>
        );
      }),
    [ticks, min, step, labelEvery, t.textSecondary, t.border, fmt],
  );

  const nudge = (dir: 1 | -1) => {
    onChange(Math.round(Math.min(Math.max(value + dir * step, min), max) * 100) / 100);
  };

  return (
    <View>
      <View style={styles.readout}>
        <Tap onPress={() => nudge(-1)} accessibilityLabel="−" style={[styles.nudge, { backgroundColor: t.surfaceHigh }]} haptic="selection">
          <Minus size={20} color={t.text} />
        </Tap>
        <View style={styles.value} accessibilityLiveRegion="polite">
          <Txt variant="numHero">{fmt(value, decimals)}</Txt>
          <Txt variant="titleSmall" tone="secondary" style={{ marginLeft: 6, marginBottom: 8 }}>
            {unit}
          </Txt>
        </View>
        <Tap onPress={() => nudge(1)} accessibilityLabel="+" style={[styles.nudge, { backgroundColor: t.surfaceHigh }]} haptic="selection">
          <Plus size={20} color={t.text} />
        </Tap>
      </View>

      <View style={styles.rulerWrap} onLayout={(e) => setWidth(e.nativeEvent.layout.width)}>
        {width > 0 ? (
          <ScrollView
            ref={scroller}
            horizontal
            showsHorizontalScrollIndicator={false}
            snapToInterval={TICK}
            decelerationRate="fast"
            onScroll={onScroll}
            scrollEventThrottle={16}
            onScrollBeginDrag={() => {
              expected.current = null;
            }}
            onContentSizeChange={() => {
              if (initialized.current) return;
              initialized.current = true;
              const i = indexOf(value);
              lastIndex.current = i;
              scrollToIndex(i, false);
            }}
            contentContainerStyle={{ paddingHorizontal: width / 2 - TICK / 2 }}
          >
            {tickMarks}
          </ScrollView>
        ) : null}
        {/* Edges fade into the backdrop so ticks and labels never end in a hard cut. */}
        {width > 0 ? (
          <Svg pointerEvents="none" width={width} height={64} style={styles.fade}>
            <Defs>
              <LinearGradient id={fadeId} x1="0" y1="0" x2="1" y2="0">
                <Stop offset="0" stopColor={fadeTo} stopOpacity={1} />
                <Stop offset={String(FADE / width)} stopColor={fadeTo} stopOpacity={0} />
                <Stop offset={String(1 - FADE / width)} stopColor={fadeTo} stopOpacity={0} />
                <Stop offset="1" stopColor={fadeTo} stopOpacity={1} />
              </LinearGradient>
            </Defs>
            <Rect x={0} y={0} width={width} height={64} fill={`url(#${fadeId})`} />
          </Svg>
        ) : null}
        {/* centre indicator */}
        <View pointerEvents="none" style={[styles.indicator, { left: width / 2 - 1.5, backgroundColor: t.accent }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  readout: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: space.lg },
  value: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'center', flex: 1 },
  nudge: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center' },
  rulerWrap: { height: 64, justifyContent: 'flex-start' },
  tickLabel: { position: 'absolute', top: 34, left: TICK / 2 - 24, width: 48, alignItems: 'center' },
  indicator: { position: 'absolute', top: -6, width: 3, height: 44, borderRadius: radius.pill },
  fade: { position: 'absolute', left: 0, top: 0 },
});
