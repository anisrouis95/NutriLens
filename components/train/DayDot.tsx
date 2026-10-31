// One day of a week row: volt for training, a volt ring for "sometimes",
// plain for rest; a finished workout fills it whatever the plan said.

import { StyleSheet, View } from 'react-native';
import { Tap, Txt } from '@/components/ds';
import type { DayKind } from '@/lib/schedule';
import { space, useTokens } from '@/theme';

const DOT = 38;

/** A day button: volt for training, a volt ring for sometimes, plain for rest. */
export default function DayDot({ label, sub, kind, done, today, onPress, a11y }: { label: string; sub?: string; kind: DayKind; done?: boolean; today?: boolean; onPress?: () => void; a11y: string }) {
  const t = useTokens();
  const filled = kind === 'train' || done;
  return (
    <Tap onPress={onPress} haptic="selection" pressScale={0.92} accessibilityLabel={a11y} style={styles.cell}>
      <Txt variant="overline" tone={today ? 'primary' : 'tertiary'}>
        {label}
      </Txt>
      <View
        style={[
          styles.dot,
          { backgroundColor: filled ? t.accent : t.surfaceHigh },
          kind === 'optional' && !done && { backgroundColor: 'transparent', borderWidth: 2, borderColor: t.accent },
          today && !filled && kind !== 'optional' && { borderWidth: 1, borderColor: t.textTertiary },
        ]}
      >
        {sub ? (
          <Txt variant="numLarge" style={styles.num} color={filled ? t.onAccent : t.textSecondary}>
            {sub}
          </Txt>
        ) : null}
      </View>
    </Tap>
  );
}

const styles = StyleSheet.create({
  cell: { flex: 1, alignItems: 'center', gap: space.xs, paddingVertical: space.xs },
  dot: { width: DOT, height: DOT, borderRadius: DOT / 2, alignItems: 'center', justifyContent: 'center' },
  num: { fontSize: 16, lineHeight: 20 },
});
