// Primitives: themed text, pressable with spring feedback, buttons, dividers
// and animated numbers. Every screen builds from these.

import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  PressableProps,
  StyleProp,
  StyleSheet,
  Text,
  TextProps,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';
import type { LucideIcon, LucideProps } from 'lucide-react-native';
import { arabicTextStyle, fonts, hasArabic, motion, radius, space, typeScale, TypeVariant, useTokens } from '@/theme';
import { useLanguage } from '@/contexts/LanguageContext';

// ---------------------------------------------------------------------------
// Text
// ---------------------------------------------------------------------------

export type Tone =
  | 'primary'
  | 'secondary'
  | 'tertiary'
  | 'disabled'
  | 'accent'
  | 'onAccent'
  | 'danger'
  | 'success'
  | 'protein'
  | 'carbs'
  | 'fat';

export function useToneColor(tone: Tone) {
  const t = useTokens();
  const map: Record<Tone, string> = {
    primary: t.text,
    secondary: t.textSecondary,
    tertiary: t.textTertiary,
    disabled: t.textDisabled,
    accent: t.accentText,
    onAccent: t.onAccent,
    danger: t.danger,
    success: t.success,
    protein: t.protein,
    carbs: t.carbs,
    fat: t.fat,
  };
  return map[tone];
}

export interface TxtProps extends TextProps {
  variant?: TypeVariant;
  tone?: Tone;
  color?: string;
  align?: 'left' | 'center' | 'right';
}

export function Txt({ variant = 'body', tone = 'primary', color, align, style, children, ...rest }: TxtProps) {
  const toneColor = useToneColor(tone);
  const isNumber = variant.startsWith('num');
  // Arabic letters get the Arabic faces (Anton and Inter have none).
  const arabic = hasArabic(children) ? arabicTextStyle(StyleSheet.flatten([typeScale[variant], style])) : null;
  return (
    <Text
      // Big numerals must not blow out their layout at large font scales.
      maxFontSizeMultiplier={isNumber ? 1.25 : 1.6}
      style={[typeScale[variant], { color: color ?? toneColor, textAlign: align }, style, arabic]}
      {...rest}
    >
      {children}
    </Text>
  );
}

const FLIP = { transform: [{ scaleX: -1 }] };

/** A left/right pointing icon (back, next, chevrons), mirrored when the layout runs right to left. */
export function DirIcon({ icon: Icon, ...props }: { icon: LucideIcon } & LucideProps) {
  const { rtl } = useLanguage();
  // The flip sits on a wrapper: on the SVG itself the web renderer mirrors around its corner.
  return rtl ? (
    <View style={FLIP}>
      <Icon {...props} />
    </View>
  ) : (
    <Icon {...props} />
  );
}

// ---------------------------------------------------------------------------
// Tap — pressable with a quick spring press and optional haptic
// ---------------------------------------------------------------------------

export interface TapProps extends Omit<PressableProps, 'style'> {
  style?: StyleProp<ViewStyle>;
  pressedStyle?: StyleProp<ViewStyle>;
  /** Scale while pressed (1 disables). */
  pressScale?: number;
  haptic?: 'light' | 'medium' | 'selection';
  /** Fade to 45% when disabled (components with their own disabled colours turn this off). */
  dimWhenDisabled?: boolean;
  children?: React.ReactNode;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export function hapticTap(kind: 'light' | 'medium' | 'selection' | 'success' | 'warning') {
  if (Platform.OS === 'web') return;
  if (kind === 'selection') Haptics.selectionAsync();
  else if (kind === 'success') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  else if (kind === 'warning') Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
  else Haptics.impactAsync(kind === 'medium' ? Haptics.ImpactFeedbackStyle.Medium : Haptics.ImpactFeedbackStyle.Light);
}

export function Tap({
  style,
  pressedStyle,
  pressScale = 0.97,
  haptic,
  onPressIn,
  onPressOut,
  onPress,
  disabled,
  dimWhenDisabled = true,
  children,
  ...rest
}: TapProps) {
  const reduce = useReducedMotion();
  const scale = useSharedValue(1);
  const [pressed, setPressed] = useState(false);
  const animated = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  return (
    <AnimatedPressable
      accessibilityRole="button"
      disabled={disabled}
      onPressIn={(e) => {
        setPressed(true);
        if (!reduce && pressScale !== 1) scale.value = withSpring(pressScale, motion.pressSpring);
        onPressIn?.(e);
      }}
      onPressOut={(e) => {
        setPressed(false);
        scale.value = withSpring(1, motion.pressSpring);
        onPressOut?.(e);
      }}
      onPress={(e) => {
        if (haptic) hapticTap(haptic);
        onPress?.(e);
      }}
      style={[animated, style, pressed && pressedStyle, disabled && dimWhenDisabled && { opacity: 0.45 }]}
      {...rest}
    >
      {children}
    </AnimatedPressable>
  );
}

// ---------------------------------------------------------------------------
// Buttons
// ---------------------------------------------------------------------------

export type ButtonVariant = 'filled' | 'tonal' | 'outlined' | 'text' | 'danger';

export interface ButtonProps {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: 'md' | 'lg';
  icon?: (color: string) => React.ReactNode;
  disabled?: boolean;
  /**
   * Looks disabled but still takes the tap, so the screen can say what is
   * missing instead of a press that silently does nothing.
   */
  inactive?: boolean;
  loading?: boolean;
  fill?: boolean;
  style?: StyleProp<ViewStyle>;
  haptic?: 'light' | 'medium' | 'selection';
  /** Spoken label when it should say more than the visible text. */
  accessibilityLabel?: string;
}

export function Button({
  label,
  onPress,
  variant = 'filled',
  size = 'md',
  icon,
  disabled,
  inactive,
  loading,
  fill,
  style,
  haptic,
  accessibilityLabel,
}: ButtonProps) {
  const t = useTokens();
  // Material 3 disabled look: a neutral container and faint label, so a
  // button that can't act never reads as a dimmed-but-live volt one.
  const off = (disabled || inactive) && !loading && variant !== 'text';
  const bg = off ? (variant === 'outlined' ? 'transparent' : t.surfaceHigh) : {
    filled: t.accent,
    tonal: t.surfaceHigh,
    outlined: 'transparent',
    text: 'transparent',
    danger: t.dangerSoft,
  }[variant];
  const fg = off ? t.textDisabled : {
    filled: t.onAccent,
    tonal: t.text,
    outlined: t.text,
    text: t.accentText,
    danger: t.danger,
  }[variant];
  const pressedBg = off ? t.surfaceHigh : {
    filled: t.accentStrong,
    tonal: t.pressed,
    outlined: t.surface,
    text: t.surface,
    danger: t.dangerSoft,
  }[variant];
  return (
    <Tap
      onPress={onPress}
      disabled={disabled || loading}
      dimWhenDisabled={variant === 'text'}
      haptic={inactive ? undefined : haptic}
      accessibilityLabel={accessibilityLabel ?? label}
      style={[
        styles.button,
        {
          height: size === 'lg' ? 56 : 48,
          paddingHorizontal: variant === 'text' ? space.md : space.xl,
          backgroundColor: bg,
          borderColor: variant === 'outlined' ? t.border : 'transparent',
          borderWidth: variant === 'outlined' ? 1 : 0,
          alignSelf: fill ? 'stretch' : 'flex-start',
        },
        style,
      ]}
      pressedStyle={{ backgroundColor: pressedBg }}
    >
      {loading ? (
        <ActivityIndicator color={fg} />
      ) : (
        <>
          {icon?.(fg)}
          <Txt variant="label" color={fg} style={[styles.buttonLabel, { fontSize: size === 'lg' ? 15 : 14 }]} numberOfLines={1}>
            {label}
          </Txt>
        </>
      )}
    </Tap>
  );
}

export function IconButton({
  icon,
  onPress,
  label,
  variant = 'ghost',
  size = 48,
  disabled,
}: {
  icon: (color: string) => React.ReactNode;
  onPress: () => void;
  label: string;
  variant?: 'ghost' | 'tonal' | 'filled';
  size?: number;
  disabled?: boolean;
}) {
  const t = useTokens();
  const off = disabled && variant === 'filled';
  const bg = off ? t.surfaceHigh : variant === 'tonal' ? t.surfaceHigh : variant === 'filled' ? t.accent : 'transparent';
  const fg = off ? t.textTertiary : variant === 'filled' ? t.onAccent : t.text;
  return (
    <Tap
      onPress={onPress}
      disabled={disabled}
      dimWhenDisabled={!off}
      accessibilityLabel={label}
      pressScale={0.92}
      hitSlop={4}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: bg,
      }}
      pressedStyle={{ backgroundColor: variant === 'filled' ? t.accentStrong : t.pressed }}
    >
      {icon(fg)}
    </Tap>
  );
}

// ---------------------------------------------------------------------------
// Layout helpers
// ---------------------------------------------------------------------------

export function Divider({ inset = 0, style }: { inset?: number; style?: StyleProp<ViewStyle> }) {
  const t = useTokens();
  return <View style={[{ height: StyleSheet.hairlineWidth, backgroundColor: t.hairline, marginLeft: inset }, style]} />;
}

export function Gap({ size = space.lg }: { size?: number }) {
  return <View style={{ height: size }} />;
}

// ---------------------------------------------------------------------------
// Animated numbers
// ---------------------------------------------------------------------------

/** Tweens a displayed number to its new value (ease-out), JS-driven so it works everywhere. */
export function useCountUp(value: number, duration: number = motion.count) {
  const reduce = useReducedMotion();
  const [display, setDisplay] = useState(value);
  const from = useRef(value);
  const raf = useRef<number | null>(null);

  useEffect(() => {
    if (reduce) {
      setDisplay(value);
      from.current = value;
      return;
    }
    const start = from.current;
    const delta = value - start;
    if (delta === 0) return;
    const t0 = Date.now();
    const tick = () => {
      const p = Math.min(1, (Date.now() - t0) / duration);
      const eased = 1 - Math.pow(2, -10 * p); // exponential ease-out
      const v = start + delta * (p === 1 ? 1 : eased);
      setDisplay(v);
      from.current = v;
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
    };
  }, [value, duration, reduce]);

  return display;
}

export function AnimatedNumber({
  value,
  decimals = 0,
  variant = 'numLarge',
  tone,
  color,
  prefix = '',
  suffix,
  style,
}: {
  value: number;
  decimals?: number;
  variant?: TypeVariant;
  tone?: Tone;
  color?: string;
  prefix?: string;
  suffix?: string;
  style?: TxtProps['style'];
}) {
  const { locale } = useLanguage();
  const shown = useCountUp(value);
  const text = shown.toLocaleString(locale, {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  });
  return (
    <Txt variant={variant} tone={tone} color={color} style={style}>
      {prefix}
      {text}
      {suffix ? <Txt variant="label" tone="secondary">{` ${suffix}`}</Txt> : null}
    </Txt>
  );
}

/** Locale-aware number formatting for static text. */
export function useFormat() {
  const { locale } = useLanguage();
  // Stable per locale so memoised lists (e.g. ruler ticks) don't rebuild on every render.
  return useCallback(
    (n: number, decimals = 0) =>
      n.toLocaleString(locale, { maximumFractionDigits: decimals, minimumFractionDigits: decimals }),
    [locale],
  );
}

/**
 * Fades (and optionally lifts) content in when it mounts. Use this instead of
 * Reanimated `entering=` layout animations, which leave content hidden in the
 * web preview; shared values behave the same everywhere.
 */
export function Appear({
  children,
  delay = 0,
  offset = 8,
  duration = motion.base,
  style,
}: {
  children: React.ReactNode;
  delay?: number;
  offset?: number;
  duration?: number;
  style?: StyleProp<ViewStyle>;
}) {
  const reduce = useReducedMotion();
  const p = useSharedValue(reduce ? 1 : 0);
  useEffect(() => {
    if (reduce) return;
    const timer = setTimeout(() => {
      p.value = withTiming(1, { duration, easing: motion.easeOut });
    }, delay);
    return () => clearTimeout(timer);
  }, [p, delay, duration, reduce]);
  const animated = useAnimatedStyle(() => ({
    opacity: p.value,
    transform: [{ translateY: (1 - p.value) * offset }],
  }));
  return <Animated.View style={[animated, style]}>{children}</Animated.View>;
}

/** Fades/slides a value change, for small swaps like a label. */
export function useFadeOnChange(dep: unknown) {
  const o = useSharedValue(1);
  useEffect(() => {
    o.value = 0.2;
    o.value = withTiming(1, { duration: motion.base, easing: motion.easeOut });
  }, [dep, o]);
  return useAnimatedStyle(() => ({ opacity: o.value }));
}

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.sm,
    borderRadius: radius.pill,
  },
  // Kinetic buttons speak in heavy tracked capitals.
  buttonLabel: { fontFamily: fonts.uiHeavy, letterSpacing: 0.6, textTransform: 'uppercase' },
});
