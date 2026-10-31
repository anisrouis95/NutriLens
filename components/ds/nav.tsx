// Bottom navigation (5 destinations: Today, Train, Food, Learn, Profile).
// The active tab is a volt circle sitting on the bar's top edge, ringed in
// the ground colour so it reads as a notch cut into the bar. Tapping another
// tab slides the circle over on a spring (with a small squash as it leaves),
// the old icon drops back into the bar and the new one rises into the circle.
// Every icon keeps its label underneath.

import React, { useEffect, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { BookOpenText, Camera, CircleUser, Dumbbell, House, Salad } from 'lucide-react-native';
import { fonts, motion, space, useTokens } from '@/theme';
import { useLanguage } from '@/contexts/LanguageContext';
import { Tap, Txt } from './primitives';
import type { LocalizedText } from '@/lib/i18n';

// Minimal shape of the props the router hands to a custom tab bar. Declared
// locally so the app doesn't import navigation internals that SDK 58 moves.
export interface TabBarProps {
  state: { index: number; routes: { key: string; name: string }[] };
  navigation: {
    emit: (event: { type: 'tabPress'; target: string; canPreventDefault: true }) => { defaultPrevented: boolean };
    navigate: (name: string) => void;
  };
}

const TABS: Record<string, LocalizedText & { icon: typeof House }> = {
  index: { icon: House, en: 'Today', fr: 'Aujourd’hui', tn: 'اليوم', tnLatn: 'Lyoum' },
  train: { icon: Dumbbell, en: 'Train', fr: 'Sport', tn: 'تمرين', tnLatn: 'Sport' },
  food: { icon: Salad, en: 'Food', fr: 'Repas', tn: 'ماكلة', tnLatn: 'Makla' },
  learn: { icon: BookOpenText, en: 'Learn', fr: 'Apprendre', tn: 'تعلّم', tnLatn: 'Ta3allem' },
  profile: { icon: CircleUser, en: 'Profile', fr: 'Profil', tn: 'البروفيل', tnLatn: 'Profil' },
};

export const NAV_BAR_HEIGHT = 72;

/** The volt circle, and the ground-coloured ring around it that cuts the notch. */
const CIRCLE = 54;
const RING = 6;
const OUTER = CIRCLE + RING * 2;
/** How far the circle rises above the bar's top edge. */
const RISE = 24;
/** Where an icon sits in the bar, and how far the active one lifts into the circle. */
const ICON = 24;
const ICON_TOP = 12;
const LIFT = ICON_TOP + ICON / 2 + RISE - OUTER / 2;

const SLIDE = { damping: 15, stiffness: 170, mass: 0.9 };

export function NavBar({ state, navigation }: TabBarProps) {
  const t = useTokens();
  const insets = useSafeAreaInsets();
  const reduce = useReducedMotion();
  const { L, rtl } = useLanguage();
  const routes = state.routes.filter((r) => TABS[r.name]);
  const active = Math.max(0, routes.findIndex((r) => r.key === state.routes[state.index]?.key));

  const [width, setWidth] = useState(0);
  const slot = routes.length ? width / routes.length : 0;
  // Right to left, the first tab sits at the right edge and the circle travels left.
  const target = (active * slot + (slot - OUTER) / 2) * (rtl ? -1 : 1);
  const x = useSharedValue(target);
  const squash = useSharedValue(1);
  const placed = useSharedValue(false);

  useEffect(() => {
    if (!width) return;
    if (reduce || !placed.value) {
      // First layout (or reduced motion): put the circle in place without travelling.
      x.value = target;
      placed.value = true;
      return;
    }
    x.value = withSpring(target, SLIDE);
    squash.value = withSequence(withTiming(1.14, { duration: 110 }), withSpring(1, SLIDE));
  }, [target, width, reduce, x, squash, placed]);

  const circle = useAnimatedStyle(() => ({
    opacity: placed.value ? 1 : 0,
    transform: [{ translateX: x.value }, { scaleX: squash.value }, { scaleY: 2 - squash.value }],
  }));

  return (
    <View
      onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)}
      style={[
        styles.bar,
        { height: NAV_BAR_HEIGHT + insets.bottom, paddingBottom: insets.bottom, backgroundColor: t.ground, borderTopColor: t.hairline },
      ]}
      accessibilityRole="tablist"
    >
      {width ? (
        <Animated.View pointerEvents="none" style={[styles.circle, { borderColor: t.ground, backgroundColor: t.accent }, circle]} />
      ) : null}
      {routes.map((route, i) => {
        const focused = i === active;
        const tab = TABS[route.name];
        return (
          <NavItem
            key={route.key}
            label={L(tab)}
            Icon={tab.icon}
            focused={focused}
            onPress={() => {
              const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
              if (!focused && !event.defaultPrevented) navigation.navigate(route.name);
            }}
          />
        );
      })}
    </View>
  );
}

function NavItem({ label, Icon, focused, onPress }: { label: string; Icon: typeof House; focused: boolean; onPress: () => void }) {
  const t = useTokens();
  const reduce = useReducedMotion();
  // 0 = resting in the bar, 1 = lifted into the circle.
  const p = useDerivedValue(
    () => (reduce ? (focused ? 1 : 0) : focused ? withSpring(1, SLIDE) : withTiming(0, { duration: motion.base, easing: motion.easeOut })),
    [focused, reduce],
  );
  const lift = useAnimatedStyle(() => ({ transform: [{ translateY: -LIFT * p.value }] }));
  const rest = useAnimatedStyle(() => ({ opacity: 1 - Math.min(1, p.value * 1.6) }));
  const lit = useAnimatedStyle(() => ({ opacity: Math.min(1, Math.max(0, (p.value - 0.35) * 1.6)) }));
  return (
    <Tap
      onPress={onPress}
      haptic="selection"
      pressScale={0.94}
      accessibilityRole="tab"
      accessibilityState={{ selected: focused }}
      accessibilityLabel={label}
      style={styles.item}
    >
      <Animated.View style={[styles.icon, lift]}>
        {/* Grey in the bar, ink on volt once it reaches the circle (cross-faded so it never vanishes mid-way). */}
        <Animated.View style={[StyleSheet.absoluteFill, styles.center, rest]}>
          <Icon size={ICON} color={t.textTertiary} strokeWidth={2} />
        </Animated.View>
        <Animated.View style={[StyleSheet.absoluteFill, styles.center, lit]}>
          <Icon size={ICON} color={t.onAccent} strokeWidth={2.4} />
        </Animated.View>
      </Animated.View>
      <Txt
        variant="caption"
        tone={focused ? 'primary' : 'tertiary'}
        style={{ fontFamily: focused ? fonts.uiBold : fonts.uiMedium, fontSize: 12, marginTop: 6 }}
        numberOfLines={1}
      >
        {label}
      </Txt>
    </Tap>
  );
}

// ---------------------------------------------------------------------------
// Extended FAB
// ---------------------------------------------------------------------------

export function Fab({
  label,
  onPress,
  icon,
  extended = false,
  bottom,
}: {
  label: string;
  onPress: () => void;
  icon?: (color: string) => React.ReactNode;
  /** Collapse to icon-only (e.g. while scrolling down). */
  extended?: boolean;
  bottom?: number;
}) {
  const t = useTokens();
  const insets = useSafeAreaInsets();
  const reduce = useReducedMotion();
  const enter = useSharedValue(reduce ? 1 : 0);
  useEffect(() => {
    enter.value = withSpring(1, motion.settleSpring);
  }, [enter]);
  const p = useDerivedValue(() => withTiming(extended ? 1 : 0, { duration: motion.base, easing: motion.easeOut }), [extended]);
  const box = useAnimatedStyle(() => ({
    opacity: enter.value,
    transform: [{ scale: 0.8 + enter.value * 0.2 }],
  }));
  const text = useAnimatedStyle(() => ({ opacity: p.value, maxWidth: p.value * 200, marginLeft: p.value * space.sm }));
  return (
    <Animated.View style={[styles.fabHost, { bottom: bottom ?? NAV_BAR_HEIGHT + insets.bottom + space.lg }, box]}>
      <Tap
        onPress={onPress}
        haptic="light"
        accessibilityLabel={label}
        style={[styles.fab, { backgroundColor: t.accent, shadowColor: t.shadow }]}
        pressedStyle={{ backgroundColor: t.accentStrong }}
      >
        {icon ? icon(t.onAccent) : <Camera size={24} color={t.onAccent} strokeWidth={2.2} />}
        <Animated.View style={[{ overflow: 'hidden' }, text]}>
          <Txt variant="label" color={t.onAccent} numberOfLines={1} style={styles.fabLabel}>
            {label}
          </Txt>
        </Animated.View>
      </Tap>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bar: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: 'row',
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  circle: {
    position: 'absolute',
    top: -RISE,
    start: 0,
    width: OUTER,
    height: OUTER,
    borderRadius: OUTER / 2,
    borderWidth: RING,
  },
  item: { flex: 1, alignItems: 'center', paddingTop: ICON_TOP, paddingHorizontal: 2 },
  icon: { width: ICON + 8, height: ICON, zIndex: 1 },
  center: { alignItems: 'center', justifyContent: 'center' },
  fabHost: { position: 'absolute', right: space.lg },
  fab: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    minWidth: 60,
    paddingHorizontal: 18,
    borderRadius: 30,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.45,
    shadowRadius: 14,
    elevation: 8,
  },
  fabLabel: { fontFamily: fonts.uiHeavy, fontSize: 14, letterSpacing: 0.6, textTransform: 'uppercase' },
});
