// Data views: macro bars, a line chart that draws in, and weekly bars that
// grow to their values. Fixed scales so periods compare honestly.

import React, { useEffect, useMemo, useState } from 'react';
import { LayoutChangeEvent, StyleSheet, View } from 'react-native';
import Animated, {
  useAnimatedProps,
  useAnimatedStyle,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, Line, Path, Text as SvgText } from 'react-native-svg';
import { fonts, motion, radius, space, useTokens } from '@/theme';
import { Txt } from './primitives';
import { ProgressLine } from './controls';

const AnimatedPath = Animated.createAnimatedComponent(Path);

// ---------------------------------------------------------------------------
// Macro bars
// ---------------------------------------------------------------------------

export function MacroBars({
  items,
  columns = false,
}: {
  items: { label: string; eaten: number; target: number; color: string }[];
  /** Side by side, one slim bar per macro (compact, for the Today hero). */
  columns?: boolean;
}) {
  const t = useTokens();
  if (columns) {
    return (
      <View style={styles.macroColumns}>
        {items.map((m) => (
          <View key={m.label} style={{ flex: 1, gap: 6, minWidth: 0 }}>
            <Txt variant="numLarge" numberOfLines={1}>
              {Math.round(m.eaten)}
              <Txt variant="label" tone="tertiary">{` /${m.target}`}</Txt>
            </Txt>
            <Txt variant="overline" tone="tertiary" numberOfLines={1}>
              {m.label}
            </Txt>
            <ProgressLine value={m.target ? m.eaten / m.target : 0} color={m.color} overColor={t.danger} height={3} />
          </View>
        ))}
      </View>
    );
  }
  return (
    <View style={{ gap: space.md }}>
      {items.map((m) => (
        <View key={m.label} style={{ gap: 6 }}>
          <View style={styles.macroHead}>
            <Txt variant="label" style={{ flex: 1 }}>
              {m.label}
            </Txt>
            <Txt variant="numSmall" tone="secondary">
              {Math.round(m.eaten)}
              <Txt variant="numSmall" tone="tertiary">{` / ${m.target} g`}</Txt>
            </Txt>
          </View>
          <ProgressLine value={m.target ? m.eaten / m.target : 0} color={m.color} overColor={t.danger} height={6} />
        </View>
      ))}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Line chart (draws in)
// ---------------------------------------------------------------------------

export interface Series {
  points: { x: number; y: number }[];
  color: string;
  dots?: boolean;
  width?: number;
  dashed?: boolean;
}

const PAD = { top: 14, right: 12, bottom: 24, left: 36 };

export function LineChart({
  series,
  height = 200,
  reference,
  xLabel,
  yLabel = (y) => y.toFixed(0),
  emptyText,
  yDomain,
}: {
  series: Series[];
  height?: number;
  reference?: { y: number; label: string; color: string };
  xLabel?: (x: number) => string;
  yLabel?: (y: number) => string;
  emptyText?: string;
  /** Fix the vertical scale (e.g. across weeks) instead of fitting the data. */
  yDomain?: [number, number];
}) {
  const t = useTokens();
  const reduce = useReducedMotion();
  const [width, setWidth] = useState(0);
  const draw = useSharedValue(0);
  const all = series.flatMap((s) => s.points);
  const key = all.map((p) => `${p.x}:${p.y}`).join('|');

  useEffect(() => {
    draw.value = 0;
    draw.value = withTiming(1, { duration: reduce ? 0 : 900, easing: motion.easeOut });
  }, [key, width, reduce, draw]);

  const geo = useMemo(() => {
    if (all.length < 2 || width === 0) return null;
    const xs = all.map((p) => p.x);
    const ys = all.map((p) => p.y).concat(reference ? [reference.y] : []);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    let [minY, maxY] = yDomain ?? [Math.min(...ys), Math.max(...ys)];
    if (!yDomain) {
      const pad = Math.max((maxY - minY) * 0.12, 0.5);
      minY -= pad;
      maxY += pad;
    }
    const innerW = Math.max(width - PAD.left - PAD.right, 1);
    const innerH = height - PAD.top - PAD.bottom;
    const sx = (x: number) => PAD.left + ((x - minX) / Math.max(maxX - minX, 1)) * innerW;
    const sy = (y: number) => PAD.top + (1 - (y - minY) / (maxY - minY || 1)) * innerH;
    const paths = series.map((s) => {
      const pts = [...s.points].sort((a, b) => a.x - b.x).map((p) => ({ x: sx(p.x), y: sy(p.y) }));
      let len = 0;
      for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
      const d = pts.map((p, i) => `${i ? 'L' : 'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
      return { d, len: Math.max(len, 1), pts };
    });
    return { minX, maxX, minY, maxY, sx, sy, paths };
  }, [all, width, height, reference, series, yDomain]);

  if (all.length < 2) {
    return (
      <View style={[styles.chartEmpty, { height }]}>
        <Txt variant="caption" tone="tertiary" align="center">
          {emptyText}
        </Txt>
      </View>
    );
  }

  const ticks = geo ? [0, 0.5, 1].map((f) => geo.minY + (geo.maxY - geo.minY) * f) : [];
  const xTicks = geo ? [geo.minX, Math.round((geo.minX + geo.maxX) / 2), geo.maxX] : [];

  return (
    <View onLayout={(e: LayoutChangeEvent) => setWidth(e.nativeEvent.layout.width)} style={{ height }}>
      {geo ? (
        <Svg width={width} height={height}>
          {ticks.map((v, i) => (
            <Line key={i} x1={PAD.left} x2={width - PAD.right} y1={geo.sy(v)} y2={geo.sy(v)} stroke={t.hairline} strokeWidth={1} />
          ))}
          {ticks.map((v, i) => (
            <SvgText key={`t${i}`} x={PAD.left - 8} y={geo.sy(v) + 4} fontSize={11} fontFamily={fonts.uiSemi} fill={t.textTertiary} textAnchor="end">
              {yLabel(v)}
            </SvgText>
          ))}
          {xLabel
            ? xTicks.map((x, i) => (
                <SvgText
                  key={`x${i}`}
                  x={geo.sx(x)}
                  y={height - 6}
                  fontSize={11}
                  fontFamily={fonts.uiSemi}
                  fill={t.textTertiary}
                  textAnchor={i === 0 ? 'start' : i === 2 ? 'end' : 'middle'}
                >
                  {xLabel(x)}
                </SvgText>
              ))
            : null}
          {reference ? (
            <>
              <Line
                x1={PAD.left}
                x2={width - PAD.right}
                y1={geo.sy(reference.y)}
                y2={geo.sy(reference.y)}
                stroke={reference.color}
                strokeDasharray="5 5"
                strokeWidth={1.5}
              />
              {reference.label ? (
                <SvgText x={width - PAD.right} y={geo.sy(reference.y) - 6} fontSize={11} fontFamily={fonts.uiSemi} fill={reference.color} textAnchor="end">
                  {reference.label}
                </SvgText>
              ) : null}
            </>
          ) : null}
          {series.map((s, i) => (
            <DrawnPath key={i} d={geo.paths[i].d} len={geo.paths[i].len} color={s.color} width={s.width ?? 2.5} draw={draw} dashed={s.dashed} />
          ))}
          {series
            .filter((s) => s.dots)
            .flatMap((s, si) =>
              geo.paths[series.indexOf(s)].pts.map((p, pi) => (
                <Circle key={`${si}-${pi}`} cx={p.x} cy={p.y} r={2.6} fill={s.color} opacity={0.75} />
              )),
            )}
        </Svg>
      ) : null}
    </View>
  );
}

function DrawnPath({
  d,
  len,
  color,
  width,
  draw,
  dashed,
}: {
  d: string;
  len: number;
  color: string;
  width: number;
  draw: { value: number };
  dashed?: boolean;
}) {
  const props = useAnimatedProps(() => ({ strokeDashoffset: len * (1 - draw.value) }));
  if (width === 0) return null;
  return (
    <AnimatedPath
      d={d}
      stroke={color}
      strokeWidth={width}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeDasharray={dashed ? '6 5' : `${len} ${len}`}
      animatedProps={dashed ? undefined : props}
    />
  );
}

// ---------------------------------------------------------------------------
// Week bars (calories per day vs target)
// ---------------------------------------------------------------------------

export function WeekBars({
  days,
  target,
  height = 150,
}: {
  days: { label: string; value: number; today?: boolean }[];
  target: number;
  height?: number;
}) {
  const t = useTokens();
  const max = Math.max(target * 1.3, ...days.map((d) => d.value), 1);
  const targetY = (target / max) * height;
  return (
    <View>
      <View style={{ height, flexDirection: 'row', alignItems: 'flex-end', gap: space.sm }}>
        <View
          pointerEvents="none"
          style={[styles.targetLine, { bottom: targetY, borderColor: t.textTertiary }]}
        />
        {days.map((d, i) => (
          <Bar key={i} value={d.value} max={max} height={height} index={i} today={d.today} over={d.value > target * 1.05} />
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: space.sm, marginTop: space.sm }}>
        {days.map((d, i) => (
          <Txt key={i} variant="numSmall" tone={d.today ? 'accent' : 'tertiary'} align="center" style={{ flex: 1 }}>
            {d.label}
          </Txt>
        ))}
      </View>
    </View>
  );
}

function Bar({ value, max, height, index, today, over }: { value: number; max: number; height: number; index: number; today?: boolean; over?: boolean }) {
  const t = useTokens();
  const reduce = useReducedMotion();
  const h = useDerivedValue(
    () =>
      reduce
        ? (value / max) * height
        : withDelay(index * 40, withTiming((value / max) * height, { duration: motion.slow + 200, easing: motion.easeOut })),
    [value, max, height, reduce],
  );
  const style = useAnimatedStyle(() => ({ height: Math.max(h.value, value > 0 ? 3 : 0) }));
  const color = over ? t.danger : today ? t.accent : t.border;
  return (
    <View style={{ flex: 1, height, justifyContent: 'flex-end' }}>
      <Animated.View style={[{ borderRadius: radius.sm / 2, backgroundColor: value > 0 ? color : t.track }, style]} />
    </View>
  );
}

const styles = StyleSheet.create({
  macroHead: { flexDirection: 'row', alignItems: 'baseline' },
  macroColumns: { flexDirection: 'row', gap: space.lg },
  chartEmpty: { alignItems: 'center', justifyContent: 'center', paddingHorizontal: space.xl },
  targetLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: 1.5,
    borderStyle: 'dashed',
  },
});
