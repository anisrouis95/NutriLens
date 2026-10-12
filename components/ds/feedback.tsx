// Feedback: bottom sheet, snackbar and the stamped check used when a set or
// a meal is logged ("states stamp, they don't vanish").

import React, { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { BackHandler, KeyboardAvoidingView, Modal, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { Check } from 'lucide-react-native';
import { fonts, motion, radius, space, useTokens } from '@/theme';
import { Tap, Txt, hapticTap } from './primitives';

// ---------------------------------------------------------------------------
// Bottom sheet
// ---------------------------------------------------------------------------

export function Sheet({
  visible,
  onClose,
  title,
  children,
}: {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}) {
  const t = useTokens();
  const insets = useSafeAreaInsets();
  const reduce = useReducedMotion();
  const [mounted, setMounted] = useState(visible);
  const progress = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      progress.value = withTiming(1, { duration: reduce ? 0 : motion.slow, easing: motion.easeOut });
    } else if (mounted) {
      progress.value = withTiming(0, { duration: reduce ? 0 : motion.base, easing: motion.easeOut }, (done) => {
        if (done) runOnJS(setMounted)(false);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible]);

  const backdrop = useAnimatedStyle(() => ({ opacity: progress.value }));
  const panel = useAnimatedStyle(() => ({ transform: [{ translateY: (1 - progress.value) * 520 }] }));

  if (!mounted) return null;
  return (
    <Modal visible transparent statusBarTranslucent animationType="none" onRequestClose={onClose}>
      <Animated.View style={[StyleSheet.absoluteFill, { backgroundColor: t.scrim }, backdrop]}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityLabel="Close" />
      </Animated.View>
      {/* Lifts the sheet above the keyboard when a field inside it is focused. */}
      <KeyboardAvoidingView behavior="padding" style={styles.sheetHost} pointerEvents="box-none">
        <Animated.View
          style={[styles.sheet, { backgroundColor: t.surfaceHigh, paddingBottom: insets.bottom + space.lg }, panel]}
        >
          <View style={[styles.handle, { backgroundColor: t.border }]} />
          {title ? (
            <Txt variant="title" style={{ marginBottom: space.lg }}>
              {title}
            </Txt>
          ) : null}
          {children}
        </Animated.View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

// ---------------------------------------------------------------------------
// Snackbar
// ---------------------------------------------------------------------------

interface SnackbarMessage {
  id: number;
  text: string;
  action?: { label: string; onPress: () => void };
}

const SnackbarContext = createContext<{ show: (text: string, action?: SnackbarMessage['action']) => void } | null>(null);

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const t = useTokens();
  const insets = useSafeAreaInsets();
  const reduce = useReducedMotion();
  const [message, setMessage] = useState<SnackbarMessage | null>(null);
  const p = useSharedValue(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const hide = useCallback(() => {
    p.value = withTiming(0, { duration: reduce ? 0 : motion.base, easing: motion.easeOut }, (done) => {
      if (done) runOnJS(setMessage)(null);
    });
  }, [p, reduce]);

  const show = useCallback(
    (text: string, action?: SnackbarMessage['action']) => {
      if (timer.current) clearTimeout(timer.current);
      setMessage({ id: Date.now(), text, action });
      p.value = 0;
      p.value = withTiming(1, { duration: reduce ? 0 : motion.slow, easing: motion.easeOut });
      timer.current = setTimeout(hide, action ? 5000 : 3200);
    },
    [hide, p, reduce],
  );

  const style = useAnimatedStyle(() => ({
    opacity: p.value,
    transform: [{ translateY: (1 - p.value) * 24 }],
  }));

  return (
    <SnackbarContext.Provider value={{ show }}>
      {children}
      {message ? (
        <Animated.View
          pointerEvents="box-none"
          style={[styles.snackHost, { bottom: insets.bottom + 96 }, style]}
          accessibilityLiveRegion="polite"
        >
          <View style={[styles.snack, { backgroundColor: t.text }]}>
            <Txt variant="label" color={t.ground} style={{ flex: 1 }}>
              {message.text}
            </Txt>
            {message.action ? (
              <Tap
                onPress={() => {
                  message.action?.onPress();
                  hide();
                }}
                hitSlop={8}
              >
                <Txt variant="label" color={t.ground} style={styles.snackAction}>
                  {message.action.label}
                </Txt>
              </Tap>
            ) : null}
          </View>
        </Animated.View>
      ) : null}
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const ctx = useContext(SnackbarContext);
  if (!ctx) throw new Error('useSnackbar must be used within SnackbarProvider');
  return ctx;
}

// ---------------------------------------------------------------------------
// Stamp check — a done state that lands with weight and stays visible
// ---------------------------------------------------------------------------

export function StampCheck({
  done,
  onPress,
  size = 44,
  label,
}: {
  done: boolean;
  onPress?: () => void;
  size?: number;
  label: string;
}) {
  const t = useTokens();
  const reduce = useReducedMotion();
  const scale = useSharedValue(1);
  // Round at rest, checked or not; the tilt is spent only on the landing stamp.
  const tilt = useSharedValue(0);
  const prev = useRef(done);
  useEffect(() => {
    if (done && !prev.current && !reduce) {
      scale.value = withSequence(withTiming(1.22, { duration: 90 }), withSpring(1, motion.settleSpring));
      tilt.value = withSequence(withTiming(-12, { duration: 90 }), withSpring(0, motion.settleSpring));
      hapticTap('success');
    }
    prev.current = done;
  }, [done, reduce, scale, tilt]);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { rotate: `${tilt.value}deg` }],
  }));
  return (
    <Tap
      onPress={onPress}
      pressScale={0.9}
      accessibilityRole="checkbox"
      accessibilityState={{ checked: done }}
      accessibilityLabel={label}
      hitSlop={4}
    >
      <Animated.View
        style={[
          {
            width: size,
            height: size,
            borderRadius: size / 2,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: done ? t.accent : 'transparent',
            borderWidth: done ? 0 : 1.5,
            borderColor: t.border,
          },
          style,
        ]}
      >
        <Check size={size * 0.46} color={done ? t.onAccent : t.textSecondary} strokeWidth={done ? 3 : 2.2} />
      </Animated.View>
    </Tap>
  );
}

/** Android hardware back closes an open overlay first. */
export function useBackToClose(open: boolean, close: () => void) {
  useEffect(() => {
    if (!open) return;
    const sub = BackHandler.addEventListener('hardwareBackPress', () => {
      close();
      return true;
    });
    return () => sub.remove();
  }, [open, close]);
}

const styles = StyleSheet.create({
  sheetHost: { flex: 1, justifyContent: 'flex-end' },
  sheet: {
    borderTopLeftRadius: radius.lg + 8,
    borderTopRightRadius: radius.lg + 8,
    paddingHorizontal: space.xl,
    paddingTop: space.md,
    maxHeight: '88%',
  },
  handle: { width: 36, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: space.lg },
  snackHost: { position: 'absolute', left: space.lg, right: space.lg },
  snack: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.lg,
    minHeight: 48,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
    borderRadius: radius.sm,
  },
  snackAction: { fontFamily: fonts.uiHeavy, letterSpacing: 0.6, textTransform: 'uppercase' },
});
