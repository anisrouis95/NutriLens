// Controls: chips, segmented control, switch, text field, option tile,
// stepper and progress line. All animate state changes, never decoration.

import React, { useEffect, useState } from 'react';
import {
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Check, Minus, Plus } from 'lucide-react-native';
import { arabicFonts, fonts, hasArabic, motion, radius, space, typeScale, useTokens } from '@/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tap, Txt, hapticTap } from './primitives';

const timing = { duration: motion.base, easing: motion.easeOut };

// ---------------------------------------------------------------------------
// Chip
// ---------------------------------------------------------------------------

export function Chip({
  label,
  selected,
  onPress,
  icon,
  style,
  multiline,
}: {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  icon?: (color: string) => React.ReactNode;
  style?: StyleProp<ViewStyle>;
  /** Long labels wrap instead of truncating (e.g. suggested questions). */
  multiline?: boolean;
}) {
  const t = useTokens();
  const p = useDerivedValue(() => withTiming(selected ? 1 : 0, timing), [selected]);
  const animated = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(p.value, [0, 1], [t.surfaceHigh, t.select]),
    borderColor: interpolateColor(p.value, [0, 1], [t.hairline, t.select]),
  }));
  // Selection is inverted ink: a white pill with black text.
  const fg = selected ? t.onSelect : t.text;
  const body = (
    <Animated.View style={[styles.chip, multiline ? styles.chipMulti : styles.chipSingle, animated]}>
      {selected ? <Check size={15} color={fg} strokeWidth={2.6} /> : icon?.(fg)}
      <Txt variant="label" color={fg} numberOfLines={multiline ? 3 : 1} style={multiline ? { flexShrink: 1 } : undefined}>
        {label}
      </Txt>
    </Animated.View>
  );
  // Read-only chips are labels, not disabled controls: no press, no dimming.
  if (!onPress) return <View style={style}>{body}</View>;
  return (
    <Tap onPress={onPress} haptic="selection" accessibilityState={{ selected }} hitSlop={6} style={style}>
      {body}
    </Tap>
  );
}

export function ChipRow({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  return <View style={[styles.chipRow, style]}>{children}</View>;
}

// ---------------------------------------------------------------------------
// Segmented control (sliding indicator)
// ---------------------------------------------------------------------------

export function Segmented<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  const t = useTokens();
  const { rtl } = useLanguage();
  const [width, setWidth] = useState(0);
  const index = Math.max(0, options.findIndex((o) => o.value === value));
  // Segments share the inner width (container minus its 3px padding each side).
  const segment = Math.max(width - 6, 0) / options.length;
  // Right to left, the first segment sits at the right edge and the pill slides left.
  const x = useDerivedValue(() => withSpring(index * segment * (rtl ? -1 : 1), motion.pressSpring), [index, segment, rtl]);
  const indicator = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));
  return (
    <View
      onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
      style={[styles.segmented, { backgroundColor: t.surface, borderColor: t.hairline }]}
      accessibilityRole="tablist"
    >
      {width > 0 ? (
        <Animated.View
          // Selection is inverted ink: a white pill under black text.
          style={[styles.segmentIndicator, { width: segment, backgroundColor: t.select, borderColor: t.select }, indicator]}
        />
      ) : null}
      {options.map((o) => (
        <Tap
          key={o.value}
          onPress={() => onChange(o.value)}
          haptic="selection"
          pressScale={1}
          accessibilityRole="tab"
          accessibilityState={{ selected: o.value === value }}
          style={styles.segment}
        >
          <Txt variant="label" color={o.value === value ? t.onSelect : t.textSecondary} numberOfLines={1}>
            {o.label}
          </Txt>
        </Tap>
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Switch (Material 3 shape)
// ---------------------------------------------------------------------------

export function Toggle({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) {
  const t = useTokens();
  const { rtl } = useLanguage();
  const dir = rtl ? -1 : 1;
  const p = useDerivedValue(() => withTiming(value ? 1 : 0, timing), [value]);
  const track = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(p.value, [0, 1], [t.surfaceHigh, t.accent]),
    borderColor: interpolateColor(p.value, [0, 1], [t.border, t.accent]),
  }));
  const thumb = useAnimatedStyle(() => {
    const size = 16 + p.value * 8;
    return {
      width: size,
      height: size,
      borderRadius: size / 2,
      transform: [{ translateX: (6 + p.value * 18 - (size - 16) / 2) * dir }],
      backgroundColor: interpolateColor(p.value, [0, 1], [t.textTertiary, t.onAccent]),
    };
  });
  return (
    <Tap
      onPress={() => onChange(!value)}
      haptic="selection"
      pressScale={1}
      accessibilityRole="switch"
      accessibilityLabel={label}
      accessibilityState={{ checked: value }}
      hitSlop={8}
    >
      <Animated.View style={[styles.switchTrack, track]}>
        <Animated.View style={thumb} />
      </Animated.View>
    </Tap>
  );
}

// ---------------------------------------------------------------------------
// Text field
// ---------------------------------------------------------------------------

export interface FieldProps extends TextInputProps {
  label?: string;
  unit?: string;
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
  numeric?: boolean;
  /** Tighter side padding for narrow fields set three to a row. */
  compact?: boolean;
}

export function Field({ label, unit, leading, trailing, containerStyle, numeric, compact, style, onFocus, onBlur, ...rest }: FieldProps) {
  const t = useTokens();
  const [focused, setFocused] = useState(false);
  const p = useDerivedValue(() => withTiming(focused ? 1 : 0, timing), [focused]);
  const border = useAnimatedStyle(() => ({
    borderColor: interpolateColor(p.value, [0, 1], [t.border, t.accent]),
  }));
  return (
    <View style={containerStyle}>
      {label ? (
        <Txt variant="label" tone="secondary" style={{ marginBottom: space.xs }}>
          {label}
        </Txt>
      ) : null}
      <Animated.View style={[styles.field, compact && styles.fieldCompact, { backgroundColor: t.surface }, border]}>
        {leading}
        <TextInput
          placeholderTextColor={t.textTertiary}
          selectionColor={t.accent}
          cursorColor={t.accent}
          onFocus={(e) => {
            setFocused(true);
            onFocus?.(e);
          }}
          onBlur={(e) => {
            setFocused(false);
            onBlur?.(e);
          }}
          style={[
            numeric ? typeScale.numMedium : typeScale.body,
            styles.fieldInput,
            { color: t.text, fontFamily: numeric ? fonts.uiSemi : fonts.ui },
            // Arabic typed or shown (Darija placeholders, Arabic food names).
            hasArabic(rest.value || rest.placeholder) ? { fontFamily: arabicFonts[numeric ? fonts.uiSemi : fonts.ui] } : null,
            style,
          ]}
          {...rest}
        />
        {unit ? (
          <Txt variant="label" tone="tertiary">
            {unit}
          </Txt>
        ) : null}
        {trailing}
      </Animated.View>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Option tile — big single/multi choice used by the questionnaire
// ---------------------------------------------------------------------------

export function OptionTile({
  title,
  description,
  selected,
  onPress,
  leading,
  multi,
}: {
  title: string;
  description?: string;
  selected: boolean;
  onPress: () => void;
  leading?: (color: string) => React.ReactNode;
  multi?: boolean;
}) {
  const t = useTokens();
  const reduce = useReducedMotion();
  const p = useDerivedValue(() => withTiming(selected ? 1 : 0, timing), [selected]);
  const box = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(p.value, [0, 1], [t.surface, t.surfaceHigh]),
    borderColor: interpolateColor(p.value, [0, 1], [t.hairline, t.select]),
  }));
  const mark = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(p.value, [0, 1], ['transparent', t.select]),
    borderColor: interpolateColor(p.value, [0, 1], [t.border, t.select]),
  }));
  const tick = useAnimatedStyle(() => ({
    opacity: p.value,
    transform: [{ scale: reduce ? 1 : 0.4 + p.value * 0.6 }, { rotate: `${(1 - p.value) * -25}deg` }],
  }));
  return (
    <Tap
      onPress={onPress}
      haptic="selection"
      pressScale={0.985}
      accessibilityRole={multi ? 'checkbox' : 'radio'}
      accessibilityState={{ checked: selected }}
    >
      <Animated.View style={[styles.tile, box]}>
        {leading ? <View style={styles.tileLeading}>{leading(selected ? t.text : t.textSecondary)}</View> : null}
        <View style={{ flex: 1 }}>
          <Txt variant="bodyStrong">{title}</Txt>
          {description ? (
            <Txt variant="caption" tone="secondary" style={{ marginTop: 2 }}>
              {description}
            </Txt>
          ) : null}
        </View>
        <Animated.View style={[multi ? styles.tileBox : styles.tileRadio, mark]}>
          <Animated.View style={tick}>
            <Check size={14} color={t.onSelect} strokeWidth={3} />
          </Animated.View>
        </Animated.View>
      </Animated.View>
    </Tap>
  );
}

// ---------------------------------------------------------------------------
// Stepper
// ---------------------------------------------------------------------------

export function Stepper({
  value,
  onChange,
  step = 1,
  min = 0,
  max = 9999,
  format = (v: number) => String(v),
}: {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
  format?: (v: number) => string;
}) {
  const t = useTokens();
  const round = (v: number) => Math.round(v * 100) / 100;
  return (
    <View style={styles.stepper}>
      <Tap
        onPress={() => onChange(round(Math.max(min, value - step)))}
        haptic="selection"
        disabled={value <= min}
        accessibilityLabel="−"
        style={[styles.stepButton, { backgroundColor: t.surfaceHigh }]}
      >
        <Minus size={18} color={t.text} />
      </Tap>
      <Txt variant="numMedium" style={{ minWidth: 64, textAlign: 'center' }}>
        {format(value)}
      </Txt>
      <Tap
        onPress={() => onChange(round(Math.min(max, value + step)))}
        haptic="selection"
        disabled={value >= max}
        accessibilityLabel="+"
        style={[styles.stepButton, { backgroundColor: t.surfaceHigh }]}
      >
        <Plus size={18} color={t.text} />
      </Tap>
    </View>
  );
}

// ---------------------------------------------------------------------------
// Progress line
// ---------------------------------------------------------------------------

export function ProgressLine({
  value,
  color,
  overColor,
  height = 6,
  track,
}: {
  value: number; // 0..1, may exceed 1
  color?: string;
  overColor?: string;
  height?: number;
  track?: string;
}) {
  const t = useTokens();
  const [width, setWidth] = useState(0);
  const clamped = Math.min(Math.max(value, 0), 1);
  const w = useDerivedValue(
    () => withTiming(clamped * width, { duration: motion.slow + 180, easing: motion.easeOut }),
    [clamped, width],
  );
  const bar = useAnimatedStyle(() => ({ width: w.value }));
  const fill = value > 1.02 && overColor ? overColor : (color ?? t.accent);
  return (
    <View
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      style={{ height, borderRadius: height / 2, backgroundColor: track ?? t.track, overflow: 'hidden' }}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: Math.round(clamped * 100) }}
    >
      <Animated.View style={[{ height: '100%', borderRadius: height / 2, backgroundColor: fill }, bar]} />
    </View>
  );
}

/** Small helper so selection feedback fires once per value change. */
export function useSelectionHaptic(value: unknown) {
  const [prev, setPrev] = useState(value);
  useEffect(() => {
    if (value !== prev) {
      hapticTap('selection');
      setPrev(value);
    }
  }, [value, prev]);
}

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 14,
    borderWidth: 1,
  },
  chipSingle: { height: 36, borderRadius: radius.pill },
  chipMulti: { minHeight: 40, paddingVertical: 10, borderRadius: radius.lg },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm },
  segmented: {
    flexDirection: 'row',
    height: 44,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 3,
  },
  segmentIndicator: {
    position: 'absolute',
    top: 3,
    start: 3,
    bottom: 3,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
  },
  segment: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  switchTrack: {
    width: 52,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    minHeight: 52,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: space.lg,
  },
  fieldCompact: { paddingHorizontal: space.md, gap: space.xs },
  fieldInput: { flex: 1, minWidth: 0, paddingVertical: 12 },
  tile: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    minHeight: 64,
    paddingVertical: space.md,
    paddingHorizontal: space.lg,
    borderRadius: radius.md,
    borderWidth: 1.5,
  },
  tileLeading: { width: 28, alignItems: 'center' },
  tileRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileBox: {
    width: 24,
    height: 24,
    borderRadius: 7,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  stepButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
