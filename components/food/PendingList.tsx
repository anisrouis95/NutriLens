import { Fragment } from 'react';
import { StyleSheet, View } from 'react-native';
import { Minus, Plus, Sparkles, Trash2 } from 'lucide-react-native';
import {
  AnimatedNumber,
  Appear,
  Button,
  Chip,
  ChipRow,
  Divider,
  Field,
  Group,
  IconButton,
  Txt,
  useFormat,
  type Tone,
} from '@/components/ds';
import { useLanguage } from '@/contexts/LanguageContext';
import { PendingFood, fromPer100g } from '@/lib/foodSearch';
import { space, useTokens } from '@/theme';

interface Props {
  items: PendingFood[];
  onChange: (items: PendingFood[]) => void;
  onSave: () => void;
  saveLabel: string;
  tips?: string;
}

export default function PendingList({ items, onChange, onSave, saveLabel, tips }: Props) {
  const t = useTokens();
  const { L } = useLanguage();

  const update = (key: string, patch: Partial<PendingFood>) =>
    onChange(items.map((i) => (i.key === key ? { ...i, ...patch } : i)));
  const remove = (key: string) => onChange(items.filter((i) => i.key !== key));

  const totals = items.reduce(
    (acc, i) => {
      const v = fromPer100g(i.per100, i.grams);
      return {
        calories: acc.calories + v.calories,
        protein: acc.protein + v.protein,
        carbs: acc.carbs + v.carbs,
        fat: acc.fat + v.fat,
      };
    },
    { calories: 0, protein: 0, carbs: 0, fat: 0 },
  );

  const confidence = (c: NonNullable<PendingFood['confidence']>) =>
    c === 'high'
      ? { color: t.success, label: L({ en: 'confident', fr: 'fiable' }) }
      : c === 'low'
        ? { color: t.danger, label: L({ en: 'unsure — check', fr: 'incertain — vérifie' }) }
        : { color: t.accent, label: L({ en: 'estimate', fr: 'estimation' }) };

  if (!items.length) return null;

  return (
    <View>
      <Group>
        {items.map((item, index) => {
          const v = fromPer100g(item.per100, item.grams);
          const step = item.grams >= 200 ? 25 : 10;
          const conf = item.confidence ? confidence(item.confidence) : null;
          return (
            <Appear key={item.key} offset={4}>
              {index > 0 ? <Divider /> : null}
              <View style={styles.item}>
                <View style={styles.head}>
                  <View style={styles.headText}>
                    <Txt variant="bodyStrong">{item.name}</Txt>
                    {conf ? (
                      <View style={styles.confidence}>
                        <View style={[styles.dot, { backgroundColor: conf.color }]} />
                        <Txt variant="caption" tone="secondary">
                          {conf.label}
                        </Txt>
                      </View>
                    ) : null}
                  </View>
                  <View style={styles.remove}>
                    <IconButton
                      label={L({ en: 'Remove {{name}}', fr: 'Retirer {{name}}' }, { name: item.name })}
                      icon={() => <Trash2 size={20} color={t.textSecondary} />}
                      onPress={() => remove(item.key)}
                    />
                  </View>
                </View>

                {item.notes ? (
                  <Txt variant="caption" tone="secondary">
                    {item.notes}
                  </Txt>
                ) : null}

                <View style={styles.gramsRow}>
                  <View style={styles.stepper}>
                    <IconButton
                      variant="tonal"
                      size={44}
                      label={L({ en: '{{n}} g less', fr: '{{n}} g de moins' }, { n: step })}
                      icon={(c) => <Minus size={20} color={c} />}
                      onPress={() => update(item.key, { grams: Math.max(step, item.grams - step) })}
                    />
                    <Field
                      containerStyle={styles.gramsField}
                      numeric
                      unit="g"
                      value={String(Math.round(item.grams))}
                      onChangeText={(text) => {
                        const n = parseFloat(text.replace(',', '.'));
                        update(item.key, { grams: Number.isFinite(n) && n > 0 ? n : 0 });
                      }}
                      keyboardType="decimal-pad"
                      selectTextOnFocus
                      accessibilityLabel={L({ en: 'Grams of {{name}}', fr: 'Grammes de {{name}}' }, { name: item.name })}
                      style={{ textAlign: 'center' }}
                    />
                    <IconButton
                      variant="tonal"
                      size={44}
                      label={L({ en: '{{n}} g more', fr: '{{n}} g de plus' }, { n: step })}
                      icon={(c) => <Plus size={20} color={c} />}
                      onPress={() => update(item.key, { grams: item.grams + step })}
                    />
                  </View>
                  <View style={styles.kcal}>
                    <AnimatedNumber value={v.calories} variant="numLarge" />
                    <Txt variant="caption" tone="tertiary">
                      kcal
                    </Txt>
                  </View>
                </View>

                {item.servings?.length ? (
                  <ChipRow>
                    {item.servings.map((s) => (
                      <Chip
                        key={s.label}
                        label={`${s.label}${s.label.includes(String(s.grams)) ? '' : ` · ${s.grams} g`}`}
                        selected={Math.round(item.grams) === Math.round(s.grams)}
                        onPress={() => update(item.key, { grams: s.grams })}
                      />
                    ))}
                  </ChipRow>
                ) : null}

                <MacroLine protein={v.protein} carbs={v.carbs} fat={v.fat} />
              </View>
            </Appear>
          );
        })}
      </Group>

      {tips ? (
        <View style={styles.tip}>
          <Sparkles size={18} color={t.accentText} style={{ marginTop: 3 }} />
          <Txt variant="body" tone="secondary" style={{ flex: 1 }}>
            {tips}
          </Txt>
        </View>
      ) : null}

      <View style={styles.totals}>
        <View style={styles.totalRow}>
          <Txt variant="titleSmall" style={{ flex: 1 }}>
            {L({ en: 'Total', fr: 'Total' })}
          </Txt>
          <AnimatedNumber value={Math.round(totals.calories)} variant="numLarge" suffix="kcal" />
        </View>
        <MacroLine protein={totals.protein} carbs={totals.carbs} fat={totals.fat} full />
      </View>

      <Button
        label={saveLabel}
        onPress={onSave}
        disabled={items.some((i) => i.grams <= 0)}
        size="lg"
        fill
        haptic="light"
      />
    </View>
  );
}

/** "P 30 g · C 76 g · F 25 g" with each macro in its own ink. */
function MacroLine({ protein, carbs, fat, full }: { protein: number; carbs: number; fat: number; full?: boolean }) {
  const { L } = useLanguage();
  const fmt = useFormat();
  // One decimal only where it matters (a few grams), whole grams otherwise.
  const grams = (n: number) => fmt(n, n > 0 && n < 10 && !Number.isInteger(n) ? 1 : 0);
  const parts: { tone: Tone; label: string; value: number }[] = [
    { tone: 'protein', label: full ? L({ en: 'Protein', fr: 'Protéines' }) : L({ en: 'P', fr: 'P' }), value: protein },
    { tone: 'carbs', label: full ? L({ en: 'Carbs', fr: 'Glucides' }) : L({ en: 'C', fr: 'G' }), value: carbs },
    { tone: 'fat', label: full ? L({ en: 'Fat', fr: 'Lipides' }) : L({ en: 'F', fr: 'L' }), value: fat },
  ];
  return (
    <Txt variant="numSmall" tone="secondary">
      {parts.map((p, i) => (
        <Fragment key={p.tone}>
          {i > 0 ? '  ·  ' : ''}
          <Txt variant="numSmall" tone={p.tone}>
            {p.label}
          </Txt>
          {` ${grams(p.value)} g`}
        </Fragment>
      ))}
    </Txt>
  );
}

const styles = StyleSheet.create({
  item: { paddingHorizontal: space.lg, paddingVertical: space.lg, gap: space.md },
  head: { flexDirection: 'row', alignItems: 'flex-start', gap: space.sm },
  headText: { flex: 1, minWidth: 0, paddingTop: space.xs },
  confidence: { flexDirection: 'row', alignItems: 'center', gap: space.sm, marginTop: 2 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  remove: { marginRight: -space.sm, marginTop: -space.xs },
  gramsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    rowGap: space.sm,
    columnGap: space.md,
  },
  stepper: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  gramsField: { width: 96 },
  kcal: { marginLeft: 'auto', alignItems: 'flex-end' },
  tip: { flexDirection: 'row', gap: space.md, marginTop: space.lg },
  totals: { marginTop: space.xl, marginBottom: space.lg, gap: space.xs },
  totalRow: { flexDirection: 'row', alignItems: 'baseline' },
});
