// NutriLens design tokens — "Kinetic Black".
// The training-app standard played straight: a black ground, graphite
// surfaces, off-white ink, one volt accent for every action, progress and
// the current set, and inverted white pills for selection. Three data inks
// for the macros. Never use raw hex in screens: read from useTokens().

import { Easing } from 'react-native-reanimated';

const kinetic = {
  scheme: 'dark' as const,
  // Neutral ramp (ground → text). Contrast vs ground: text ≈18:1,
  // textSecondary ≈10:1, textTertiary ≈5.6:1, textDisabled ≈2.9:1.
  ground: '#0A0A0A',
  surfaceLow: '#101010',
  surface: '#141414',
  surfaceHigh: '#1F1F1F',
  pressed: '#2A2A2A',
  /** Empty part of progress bars and story segments. */
  track: '#262626',
  hairline: '#232323',
  border: '#3A3A3A',
  textDisabled: '#5C5C5C',
  textTertiary: '#8A8A8A',
  textSecondary: '#B3B3B3',
  text: '#F5F5F5',

  // Volt: every action, progress, the current set.
  accent: '#D9FF3D',
  accentStrong: '#C6EC2A', // pressed
  accentDeep: '#9DBF1C',
  accentSoft: '#1D2309', // volt wash behind volt ink
  accentText: '#D9FF3D', // volt used as text on the ground
  onAccent: '#0A0A0A',

  // Selection: inverted ink (white pill, black text).
  select: '#F5F5F5',
  onSelect: '#0A0A0A',

  // Data inks
  protein: '#FF7A59', // coral
  carbs: '#4FC3F7', // sky
  fat: '#B794F6', // lilac
  proteinSoft: '#2B1712',
  carbsSoft: '#0F2430',
  fatSoft: '#231A31',

  // States
  success: '#D9FF3D',
  successSoft: '#1D2309',
  danger: '#FF5A4E',
  dangerSoft: '#2E1210',
  info: '#7AB8FF',
  infoSoft: '#10202E',

  scrim: 'rgba(0, 0, 0, 0.72)',
  /** Over photos: legibility gradient stops. */
  photoTop: 'rgba(0, 0, 0, 0.55)',
  shadow: '#000000',
};

export type Palette = typeof kinetic;
/** One world, dark only (the light scheme was retired with the Kinetic Black redesign). */
export const palette: Palette = kinetic;

export const space = {
  xxs: 2,
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  /** Screen gutter. */
  gutter: 20,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const radius = {
  sm: 8,
  md: 14,
  lg: 20,
  pill: 999,
} as const;

export const fonts = {
  ui: 'Inter-Regular',
  uiMedium: 'Inter-Medium',
  uiSemi: 'Inter-SemiBold',
  uiBold: 'Inter-Bold',
  uiHeavy: 'Inter-ExtraBold',
  display: 'Anton',
} as const;

const tabular = ['tabular-nums'] as ('tabular-nums')[];

/**
 * Type scale (sp). Anton, uppercase, for titles and every big number; Inter for
 * words and small data. `overline` is the tracked uppercase label (SET 1, EATEN).
 */
export const typeScale = {
  display: { fontFamily: fonts.display, fontSize: 40, lineHeight: 44, letterSpacing: 0.2, textTransform: 'uppercase' as const },
  headline: { fontFamily: fonts.display, fontSize: 34, lineHeight: 38, letterSpacing: 0.2, textTransform: 'uppercase' as const },
  title: { fontFamily: fonts.display, fontSize: 22, lineHeight: 27, letterSpacing: 0.3, textTransform: 'uppercase' as const },
  titleSmall: { fontFamily: fonts.uiBold, fontSize: 17, lineHeight: 23, letterSpacing: -0.1 },
  body: { fontFamily: fonts.ui, fontSize: 16, lineHeight: 24, letterSpacing: 0 },
  bodyStrong: { fontFamily: fonts.uiSemi, fontSize: 16, lineHeight: 22, letterSpacing: -0.1 },
  label: { fontFamily: fonts.uiSemi, fontSize: 14, lineHeight: 19, letterSpacing: 0 },
  caption: { fontFamily: fonts.ui, fontSize: 13, lineHeight: 18, letterSpacing: 0 },
  overline: { fontFamily: fonts.uiHeavy, fontSize: 12, lineHeight: 16, letterSpacing: 1, textTransform: 'uppercase' as const },
  numHero: { fontFamily: fonts.display, fontSize: 76, lineHeight: 80, letterSpacing: -0.5 },
  numLarge: { fontFamily: fonts.display, fontSize: 32, lineHeight: 36, letterSpacing: 0 },
  numMedium: { fontFamily: fonts.uiSemi, fontSize: 16, lineHeight: 22, letterSpacing: 0, fontVariant: tabular },
  numSmall: { fontFamily: fonts.uiSemi, fontSize: 13, lineHeight: 18, letterSpacing: 0.2, fontVariant: tabular },
} as const;

export type TypeVariant = keyof typeof typeScale;

/** Motion: exponential ease-out for state changes; springs only for touch feedback. */
export const motion = {
  fast: 160,
  base: 220,
  slow: 320,
  count: 650,
  easeOut: Easing.out(Easing.exp),
  easeInOut: Easing.inOut(Easing.cubic),
  pressSpring: { damping: 18, stiffness: 320, mass: 0.6 },
  settleSpring: { damping: 14, stiffness: 120, mass: 1 },
} as const;
