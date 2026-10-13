// Layout: screen shell with a Material top bar whose large title collapses
// into the bar on scroll, sections, list items, the "why" disclosure,
// empty states, skeletons and the lesson rich-text renderer.

import React, { useEffect, useState } from 'react';
import { RefreshControlProps, ScrollViewProps, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, {
  Extrapolation,
  interpolate,
  interpolateColor,
  runOnJS,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { ArrowLeft, ChevronDown, ChevronRight, Info, TriangleAlert } from 'lucide-react-native';
import { motion, radius, space, useTokens } from '@/theme';
import { Appear, DirIcon, IconButton, Tap, Txt } from './primitives';
import { useLanguage } from '@/contexts/LanguageContext';

export const TOP_BAR_HEIGHT = 64;
/** Space the floating navigation bar needs at the bottom of tab screens. */
export const NAV_BAR_SPACE = 104;

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export interface ScreenProps {
  title?: string;
  /** Large title shown under the bar that collapses into it on scroll. */
  largeTitle?: boolean;
  subtitle?: string;
  back?: boolean;
  onBack?: () => void;
  actions?: React.ReactNode;
  children: React.ReactNode;
  scroll?: boolean;
  padded?: boolean;
  /** Extra bottom space (tab screens pass NAV_BAR_SPACE). */
  bottomSpace?: number;
  footer?: React.ReactNode;
  contentStyle?: StyleProp<ViewStyle>;
  refreshControl?: React.ReactElement<RefreshControlProps>;
  keyboardShouldPersistTaps?: ScrollViewProps['keyboardShouldPersistTaps'];
  /** Called when the content scrolls away from the top, and back (e.g. to collapse a FAB). */
  onScrolledChange?: (scrolled: boolean) => void;
}

export function Screen({
  title,
  largeTitle = true,
  subtitle,
  back,
  onBack,
  actions,
  children,
  scroll = true,
  padded = true,
  bottomSpace = space.xxl,
  footer,
  contentStyle,
  refreshControl,
  keyboardShouldPersistTaps = 'handled',
  onScrolledChange,
}: ScreenProps) {
  const t = useTokens();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const { L } = useLanguage();
  const y = useSharedValue(0);
  const scrolled = useSharedValue(false);
  const onScroll = useAnimatedScrollHandler((e) => {
    y.value = e.contentOffset.y;
    // Report only threshold crossings, never every frame.
    const past = e.contentOffset.y > 24;
    if (onScrolledChange && past !== scrolled.value) {
      scrolled.value = past;
      runOnJS(onScrolledChange)(past);
    }
  });

  const showLarge = largeTitle && !!title;
  const barStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(
      interpolate(y.value, [0, 24], [0, 1], Extrapolation.CLAMP),
      [0, 1],
      [t.ground, t.surfaceLow],
    ),
  }));
  const smallTitle = useAnimatedStyle(() => ({
    opacity: showLarge ? interpolate(y.value, [28, 60], [0, 1], Extrapolation.CLAMP) : 1,
    transform: [{ translateY: showLarge ? interpolate(y.value, [28, 60], [6, 0], Extrapolation.CLAMP) : 0 }],
  }));
  const largeStyle = useAnimatedStyle(() => ({
    opacity: interpolate(y.value, [0, 48], [1, 0], Extrapolation.CLAMP),
    transform: [{ translateY: interpolate(y.value, [0, 48], [0, -6], Extrapolation.CLAMP) }],
  }));

  const hasBar = back || !!actions || !!title;
  const pad = padded ? space.gutter : 0;

  const header = showLarge ? (
    <Animated.View style={[{ paddingHorizontal: space.gutter, paddingTop: space.xs, paddingBottom: space.lg }, largeStyle]}>
      <Txt variant="headline" accessibilityRole="header">
        {title}
      </Txt>
      {subtitle ? (
        <Txt variant="body" tone="secondary" style={{ marginTop: space.xs }}>
          {subtitle}
        </Txt>
      ) : null}
    </Animated.View>
  ) : null;

  return (
    <View style={{ flex: 1, backgroundColor: t.ground }}>
      {hasBar ? (
        <Animated.View style={[styles.bar, { paddingTop: insets.top, height: TOP_BAR_HEIGHT + insets.top }, barStyle]}>
          {back ? (
            <IconButton
              label={L({ en: 'Back', fr: 'Retour', tn: 'ارجع', tnLatn: 'Erja3' })}
              onPress={onBack ?? (() => (router.canGoBack() ? router.back() : router.replace('/')))}
              icon={(c) => <DirIcon icon={ArrowLeft} size={24} color={c} />}
            />
          ) : (
            <View style={{ width: space.sm }} />
          )}
          <Animated.View style={[{ flex: 1, paddingHorizontal: space.sm }, smallTitle]}>
            {title ? (
              <Txt variant="title" numberOfLines={1}>
                {title}
              </Txt>
            ) : null}
          </Animated.View>
          <View style={styles.actions}>{actions}</View>
        </Animated.View>
      ) : (
        <View style={{ height: insets.top, backgroundColor: t.ground }} />
      )}
      {scroll ? (
        <Animated.ScrollView
          onScroll={onScroll}
          scrollEventThrottle={16}
          keyboardShouldPersistTaps={keyboardShouldPersistTaps}
          refreshControl={refreshControl}
          contentContainerStyle={[{ paddingBottom: bottomSpace + insets.bottom }, contentStyle]}
        >
          {header}
          <View style={{ paddingHorizontal: pad }}>{children}</View>
        </Animated.ScrollView>
      ) : (
        <View style={[{ flex: 1, paddingHorizontal: pad }, contentStyle]}>
          {header}
          {children}
        </View>
      )}
      {footer ? (
        <View style={[styles.footer, { paddingBottom: insets.bottom + space.md, backgroundColor: t.ground, borderTopColor: t.hairline }]}>
          {footer}
        </View>
      ) : null}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Section
// ---------------------------------------------------------------------------

export function Section({
  title,
  action,
  children,
  style,
  first,
}: {
  title?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  first?: boolean;
}) {
  return (
    <View style={[{ marginTop: first ? 0 : space.xxl }, style]}>
      {title ? (
        <View style={styles.sectionHead}>
          <Txt variant="title" accessibilityRole="header" style={{ flex: 1 }}>
            {title}
          </Txt>
          {action}
        </View>
      ) : null}
      {children}
    </View>
  );
}

/** A grouped surface for list items (one level only — never nest these). */
export function Group({ children, style }: { children: React.ReactNode; style?: StyleProp<ViewStyle> }) {
  const t = useTokens();
  return (
    <View style={[{ backgroundColor: t.surface, borderRadius: radius.md, overflow: 'hidden' }, style]}>{children}</View>
  );
}

// ---------------------------------------------------------------------------
// List item
// ---------------------------------------------------------------------------

export function ListItem({
  title,
  supporting,
  supportingIcon,
  leading,
  trailing,
  onPress,
  chevron,
  divider,
  dense,
}: {
  title: string;
  supporting?: string;
  /** Small drawn icon before the supporting line (e.g. a check for "done today"). */
  supportingIcon?: (color: string) => React.ReactNode;
  leading?: (color: string) => React.ReactNode;
  trailing?: React.ReactNode;
  onPress?: () => void;
  chevron?: boolean;
  divider?: boolean;
  dense?: boolean;
}) {
  const t = useTokens();
  const body = (
    <View style={[styles.item, { minHeight: dense ? 52 : 64 }]}>
      {leading ? <View style={styles.itemLeading}>{leading(t.textSecondary)}</View> : null}
      <View style={{ flex: 1, minWidth: 0 }}>
        <Txt variant="bodyStrong" numberOfLines={2}>
          {title}
        </Txt>
        {supporting ? (
          <View style={[styles.supportingRow, { marginTop: 1 }]}>
            {supportingIcon ? <View style={{ marginTop: 2 }}>{supportingIcon(t.textSecondary)}</View> : null}
            <Txt variant="caption" tone="secondary" numberOfLines={2} style={{ flex: 1 }}>
              {supporting}
            </Txt>
          </View>
        ) : null}
      </View>
      {trailing}
      {chevron ? <DirIcon icon={ChevronRight} size={20} color={t.textTertiary} /> : null}
    </View>
  );
  return (
    <View>
      {onPress ? (
        <Tap onPress={onPress} pressScale={1} pressedStyle={{ backgroundColor: t.pressed }}>
          {body}
        </Tap>
      ) : (
        body
      )}
      {divider ? (
        <View style={{ height: StyleSheet.hairlineWidth, backgroundColor: t.hairline, marginLeft: leading ? 56 : space.lg }} />
      ) : null}
    </View>
  );
}

// ---------------------------------------------------------------------------
// "Why?" disclosure
// ---------------------------------------------------------------------------

export function Why({
  title,
  children,
  initiallyOpen = false,
  tone = 'info',
  style,
}: {
  title: string;
  children: React.ReactNode;
  initiallyOpen?: boolean;
  tone?: 'info' | 'warning';
  style?: StyleProp<ViewStyle>;
}) {
  const t = useTokens();
  const [open, setOpen] = useState(initiallyOpen);
  const rot = useDerivedValue(() => withTiming(open ? 180 : 0, { duration: motion.base, easing: motion.easeOut }), [open]);
  const chevron = useAnimatedStyle(() => ({ transform: [{ rotate: `${rot.value}deg` }] }));
  const accent = tone === 'warning' ? t.danger : t.accentText;
  const Icon = tone === 'warning' ? TriangleAlert : Info;
  return (
    <View style={[styles.why, { backgroundColor: tone === 'warning' ? t.dangerSoft : t.surface }, style]}>
      <Tap
        onPress={() => setOpen(!open)}
        pressScale={1}
        accessibilityState={{ expanded: open }}
        style={styles.whyHead}
      >
        <Icon size={18} color={accent} />
        <Txt variant="label" style={{ flex: 1 }}>
          {title}
        </Txt>
        <Animated.View style={chevron}>
          <ChevronDown size={18} color={t.textTertiary} />
        </Animated.View>
      </Tap>
      {open ? (
        <Appear offset={4} style={styles.whyBody}>
          {children}
        </Appear>
      ) : null}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Empty state & skeleton
// ---------------------------------------------------------------------------

export function EmptyState({
  icon,
  title,
  body,
  action,
}: {
  icon?: (color: string) => React.ReactNode;
  title: string;
  body?: string;
  action?: React.ReactNode;
}) {
  const t = useTokens();
  return (
    <View style={styles.empty}>
      {icon?.(t.textTertiary)}
      <Txt variant="bodyStrong" align="center" style={{ marginTop: space.sm }}>
        {title}
      </Txt>
      {body ? (
        <Txt variant="caption" tone="secondary" align="center" style={{ marginTop: space.xs, maxWidth: 300 }}>
          {body}
        </Txt>
      ) : null}
      {action ? <View style={{ marginTop: space.lg }}>{action}</View> : null}
    </View>
  );
}

export function Skeleton({ width, height = 16, style }: { width?: number | `${number}%`; height?: number; style?: StyleProp<ViewStyle> }) {
  const t = useTokens();
  const reduce = useReducedMotion();
  const o = useSharedValue(0.55);
  useEffect(() => {
    if (!reduce) o.value = withRepeat(withTiming(1, { duration: 700 }), -1, true);
  }, [o, reduce]);
  const pulse = useAnimatedStyle(() => ({ opacity: o.value }));
  return (
    <Animated.View
      style={[{ width: width ?? '100%', height, borderRadius: radius.sm, backgroundColor: t.surfaceHigh }, pulse, style]}
    />
  );
}

// ---------------------------------------------------------------------------
// Rich text (lessons, coach answers): blank-line paragraphs, "- " bullets, **bold**
// ---------------------------------------------------------------------------

export function RichText({ text }: { text: string }) {
  const t = useTokens();
  const blocks = text.split(/\n\s*\n/);
  const inline = (line: string, key: string) =>
    line.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
      part.startsWith('**') && part.endsWith('**') ? (
        <Txt key={`${key}-${i}`} variant="bodyStrong">
          {part.slice(2, -2)}
        </Txt>
      ) : (
        <Txt key={`${key}-${i}`}>{part}</Txt>
      ),
    );
  return (
    <View style={{ gap: space.md }}>
      {blocks.map((block, bi) => {
        const lines = block.split('\n').filter((l) => l.trim());
        if (lines.length && lines.every((l) => l.trim().startsWith('- '))) {
          return (
            <View key={bi} style={{ gap: space.sm }}>
              {lines.map((l, li) => (
                <View key={li} style={{ flexDirection: 'row', gap: space.md }}>
                  <View style={[styles.bullet, { backgroundColor: t.accent }]} />
                  <Txt style={{ flex: 1 }}>{inline(l.trim().slice(2), `${bi}-${li}`)}</Txt>
                </View>
              ))}
            </View>
          );
        }
        return <Txt key={bi}>{inline(lines.join(' '), String(bi))}</Txt>;
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: space.xs,
    zIndex: 10,
  },
  actions: { flexDirection: 'row', alignItems: 'center', paddingRight: space.xs },
  footer: {
    paddingHorizontal: space.gutter,
    paddingTop: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  sectionHead: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: space.md,
    minHeight: 28,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.lg,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  itemLeading: { width: 24, alignItems: 'center' },
  supportingRow: { flexDirection: 'row', alignItems: 'flex-start', gap: space.xs },
  why: { borderRadius: radius.md, overflow: 'hidden' },
  whyHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.sm,
    paddingHorizontal: space.lg,
    minHeight: 48,
  },
  whyBody: { paddingHorizontal: space.lg, paddingBottom: space.lg },
  empty: { alignItems: 'center', paddingVertical: space.xxl, paddingHorizontal: space.lg },
  bullet: { width: 6, height: 6, borderRadius: 3, marginTop: 9 },
});
