// Material 3 navigation bar (4 destinations, training second) with a graphite
// active indicator, and the volt FAB for snapping a meal.

import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { BookOpenText, Camera, Dumbbell, House, Salad } from 'lucide-react-native';
import { fonts, motion, radius, space, useTokens } from '@/theme';
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
  food: { icon: Salad, en: 'Food', fr: 'Repas', tn: 'ماكلة', tnLatn: 'Makla' },
  train: { icon: Dumbbell, en: 'Train', fr: 'Sport', tn: 'تمرين', tnLatn: 'Sport' },
  learn: { icon: BookOpenText, en: 'Learn', fr: 'Apprendre', tn: 'تعلّم', tnLatn: 'Ta3allem' },
};

export const NAV_BAR_HEIGHT = 80;

export function NavBar({ state, navigation }: TabBarProps) {
  const t = useTokens();
  const insets = useSafeAreaInsets();
  const { L } = useLanguage();
  const routes = state.routes.filter((r) => TABS[r.name]);
  return (
    <View
      style={[
        styles.bar,
        { height: NAV_BAR_HEIGHT + insets.bottom, paddingBottom: insets.bottom, backgroundColor: t.ground, borderTopColor: t.hairline },
      ]}
      accessibilityRole="tablist"
    >
      {routes.map((route) => {
        const focused = state.routes[state.index]?.key === route.key;
        const tab = TABS[route.name];
        const label = L(tab);
        return (
          <NavItem
            key={route.key}
            label={label}
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
  const p = useDerivedValue(() => (reduce ? (focused ? 1 : 0) : withTiming(focused ? 1 : 0, { duration: motion.base, easing: motion.easeOut })), [focused, reduce]);
  const pill = useAnimatedStyle(() => ({
    opacity: p.value,
    transform: [{ scaleX: 0.5 + p.value * 0.5 }],
  }));
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
      <View style={styles.iconWrap}>
        <Animated.View style={[styles.pill, { backgroundColor: t.surfaceHigh }, pill]} />
        {/* Positioned so it paints above the pill on web too. */}
        <View style={{ position: 'relative', zIndex: 1 }}>
          <Icon size={22} color={focused ? t.text : t.textTertiary} strokeWidth={focused ? 2.4 : 2} />
        </View>
      </View>
      <Txt variant="caption" tone={focused ? 'primary' : 'tertiary'} style={{ fontFamily: focused ? fonts.uiBold : fonts.uiMedium, fontSize: 12, marginTop: 4 }} numberOfLines={1}>
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
    paddingTop: space.md,
  },
  item: { flex: 1, alignItems: 'center' },
  iconWrap: { width: 64, height: 32, alignItems: 'center', justifyContent: 'center' },
  pill: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: radius.pill },
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
