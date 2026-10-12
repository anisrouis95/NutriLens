// Exercise demo: the dataset ships a start-position and an end-position photo
// for each exercise. Cross-fading between them shows the movement like a slow
// loop. With "remove animations" on, both frames sit side by side instead.
//
// The frame takes the photo's own aspect ratio (read when the first frame
// loads; the dataset is 3:2), so the photo fills it edge to edge with no
// letterbox bands. Many photos are shot on white: a thin veil of the black
// ground sits over them so they read clearly without being a bright slab.
// `bleed` drops the frame (no corners, no badges) and fades the bottom edge
// into the ground, for the full-width demo at the top of a workout page.

import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Image, type ImageLoadEventData } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, {
  cancelAnimation,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Pause, Play } from 'lucide-react-native';
import { Tap, Txt } from '@/components/ds';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion, palette, radius, space, useTokens } from '@/theme';

// Chips and the play control sit on the photo itself, on the scrim.
const SCRIM = palette.scrim;
const ON_SCRIM = palette.text;

/** free-exercise-db photos are 3:2 (850 × 567, a few 750 × 500). */
const DATASET_RATIO = 1.5;
/** Opacity of the black veil over the (often white) photos. */
const NIGHT_VEIL = 0.14;

const HOLD = 1100;
const FADE = 500;

/** Plate behind the photo (seen only while it loads) and the dusk veil over it. */
function usePlate() {
  const t = useTokens();
  return { plate: t.surfaceHigh, veil: t.ground, hairline: t.hairline, ground: t.ground };
}

function Veil({ color }: { color: string | null }) {
  if (!color) return null;
  return <View pointerEvents="none" style={[StyleSheet.absoluteFill, { backgroundColor: color, opacity: NIGHT_VEIL }]} />;
}

/** Small exercise photo, cover-fit on its plate (lists, headers). */
export function ExerciseThumb({
  uri,
  size = 56,
  recyclingKey,
}: {
  uri?: string;
  size?: number;
  recyclingKey?: string;
}) {
  const p = usePlate();
  return (
    <View
      style={[styles.thumb, { width: size, height: size, backgroundColor: p.plate, borderColor: p.hairline }]}
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          cachePolicy="disk"
          recyclingKey={recyclingKey}
          transition={120}
        />
      ) : null}
      <Veil color={p.veil} />
    </View>
  );
}

function Badge({ label, active }: { label: string; active: boolean }) {
  const t = useTokens();
  return (
    <View style={[styles.badge, { backgroundColor: active ? t.accent : SCRIM }]}>
      <Txt variant="label" color={active ? t.onAccent : ON_SCRIM} numberOfLines={1}>
        {label}
      </Txt>
    </View>
  );
}

export default function ExerciseAnimation({
  images,
  height,
  compact = false,
  bleed = false,
}: {
  images: string[];
  /** Fixed frame height. By default the frame follows the photo's aspect ratio. */
  height?: number;
  compact?: boolean;
  /** Edge to edge: no corners or badges, bottom edge fades into the ground. */
  bleed?: boolean;
}) {
  const p = usePlate();
  const { L } = useLanguage();
  const reduce = useReducedMotion();
  const fade = useSharedValue(0);
  const [playing, setPlaying] = useState(true);
  const [phase, setPhase] = useState<0 | 1>(0);
  const [ratio, setRatio] = useState(DATASET_RATIO);
  const canAnimate = images.length > 1 && !reduce;

  useEffect(() => {
    if (!canAnimate) return;
    if (!playing) {
      // Settle on the nearest frame so a paused demo shows a clean position.
      fade.value = withTiming(fade.value >= 0.5 ? 1 : 0, { duration: motion.base, easing: motion.easeOut });
      return;
    }
    const from = fade.value >= 0.5 ? 1 : 0;
    const step = (to: number) => withDelay(HOLD, withTiming(to, { duration: FADE, easing: motion.easeInOut }));
    fade.value = withRepeat(withSequence(step(1 - from), step(from)), -1, false);
    return () => cancelAnimation(fade);
  }, [canAnimate, playing, fade]);

  useAnimatedReaction(
    () => (fade.value >= 0.5 ? 1 : 0),
    (cur, prev) => {
      if (cur !== prev) runOnJS(setPhase)(cur as 0 | 1);
    },
  );

  const endFrame = useAnimatedStyle(() => ({ opacity: fade.value }));

  if (!images.length) return null;

  // Match the frame to the first photo so contain and cover coincide; clamp
  // so an odd photo can never make the frame absurdly tall or thin (cover-fit
  // then trims the edge instead of leaving bands).
  const onFirstLoad = (e: ImageLoadEventData) => {
    const { width, height: h } = e.source;
    if (!width || !h) return;
    const r = Math.min(2, Math.max(0.8, width / h));
    setRatio((prev) => (Math.abs(prev - r) > 0.01 ? r : prev));
  };

  const startLabel = `1 · ${L({ en: 'Start', fr: 'Départ' })}`;
  const endLabel = `2 · ${L({ en: 'End', fr: 'Arrivée' })}`;
  const frame = bleed
    ? [{ backgroundColor: p.plate, overflow: 'hidden' as const }]
    : [styles.frame, { backgroundColor: p.plate, borderColor: p.hairline }];
  const edgeFade = bleed ? (
    <LinearGradient
      colors={[`${p.ground}00`, p.ground]}
      style={styles.edgeFade}
      pointerEvents="none"
    />
  ) : null;
  const showBadges = !compact && !bleed;
  const size = height ? { height } : { aspectRatio: ratio };

  // Reduced motion: no loop, both positions visible at once.
  if (reduce && images.length > 1) {
    return (
      <View style={styles.pair} accessibilityLabel={L({ en: 'Start and end position', fr: 'Position de départ et d’arrivée' })}>
        {[images[0], images[1]].map((uri, i) => (
          <View key={i} style={[frame, styles.pairFrame, { aspectRatio: ratio }]}>
            <Image
              source={{ uri }}
              style={StyleSheet.absoluteFill}
              contentFit="cover"
              cachePolicy="disk"
              onLoad={i === 0 ? onFirstLoad : undefined}
            />
            <Veil color={p.veil} />
            {!compact ? (
              <View style={styles.footer}>
                <Badge label={i === 0 ? startLabel : endLabel} active={false} />
              </View>
            ) : null}
            {edgeFade}
          </View>
        ))}
      </View>
    );
  }

  if (!canAnimate) {
    return (
      <View style={[frame, styles.single, size]}>
        <Image
          source={{ uri: images[0] }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          cachePolicy="disk"
          transition={150}
          onLoad={onFirstLoad}
        />
        <Veil color={p.veil} />
        {edgeFade}
      </View>
    );
  }

  return (
    <Tap
      onPress={() => setPlaying((v) => !v)}
      pressScale={0.99}
      accessibilityLabel={
        playing
          ? L({ en: 'Movement demo, playing. Tap to pause.', fr: 'Démo du mouvement en cours. Touche pour mettre en pause.' })
          : L({ en: 'Movement demo, paused. Tap to play.', fr: 'Démo du mouvement en pause. Touche pour lancer.' })
      }
      style={[frame, styles.single, size]}
    >
      <Image
        source={{ uri: images[0] }}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        cachePolicy="disk"
        transition={150}
        onLoad={onFirstLoad}
      />
      <Animated.View style={[StyleSheet.absoluteFill, endFrame]} pointerEvents="none">
        <Image source={{ uri: images[1] }} style={StyleSheet.absoluteFill} contentFit="cover" cachePolicy="disk" />
      </Animated.View>
      <Veil color={p.veil} />
      {edgeFade}
      {showBadges ? (
        <View style={styles.footer} pointerEvents="none">
          <Badge label={startLabel} active={phase === 0} />
          <Badge label={endLabel} active={phase === 1} />
          <View style={[styles.playPill, { backgroundColor: SCRIM }]}>
            {playing ? <Pause size={18} color={ON_SCRIM} /> : <Play size={18} color={ON_SCRIM} />}
          </View>
        </View>
      ) : null}
      {bleed && !playing ? (
        <View style={[styles.pausedPill, { backgroundColor: SCRIM }]} pointerEvents="none">
          <Play size={18} color={ON_SCRIM} />
        </View>
      ) : null}
    </Tap>
  );
}

const styles = StyleSheet.create({
  thumb: {
    borderRadius: radius.sm,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  frame: {
    borderRadius: radius.md,
    borderWidth: StyleSheet.hairlineWidth,
    overflow: 'hidden',
  },
  pair: { flexDirection: 'row', gap: space.sm },
  pairFrame: { flex: 1 },
  single: { width: '100%' },
  footer: {
    position: 'absolute',
    left: space.md,
    right: space.md,
    bottom: space.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.xs + 2,
  },
  badge: {
    height: 28,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  edgeFade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 32 },
  pausedPill: {
    position: 'absolute',
    right: space.md,
    bottom: space.xl,
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playPill: {
    marginLeft: 'auto',
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
