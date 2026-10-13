import { useEffect, useMemo, useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Trash2 } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppData } from '@/contexts/AppDataContext';
import {
  AnimatedNumber,
  Appear,
  Button,
  Chip,
  ChipRow,
  Fab,
  Field,
  Group,
  ListItem,
  NAV_BAR_SPACE,
  ProgressLine,
  Screen,
  Section,
  Sheet,
  Tap,
  Txt,
  useFormat,
  useSnackbar,
  type Tone,
} from '@/components/ds';
import { addDays, sumNutrition } from '@/lib/nutritionMath';
import { isFastingDay, RAMADAN_MEALS } from '@/lib/ramadan';
import { useRamadanSettings } from '@/hooks/useRamadan';
import { radius, space, useTokens } from '@/theme';
import type { FoodEntry, LocalizedText, MealType } from '@/types';

const MEALS: (LocalizedText & { id: MealType; add: LocalizedText })[] = [
  {
    id: 'breakfast',
    en: 'Breakfast',
    fr: 'Petit-déjeuner',
    tn: 'فطور الصباح',
    tnLatn: 'Ftour sbe7',
    add: { en: 'Add breakfast', fr: 'Ajouter le petit-déjeuner', tn: 'زيد فطور الصباح', tnLatn: 'Zid ftour sbe7' },
  },
  {
    id: 'lunch',
    en: 'Lunch',
    fr: 'Déjeuner',
    tn: 'الغدا',
    tnLatn: '8de',
    add: { en: 'Add lunch', fr: 'Ajouter le déjeuner', tn: 'زيد الغدا', tnLatn: 'Zid el 8de' },
  },
  {
    id: 'dinner',
    en: 'Dinner',
    fr: 'Dîner',
    tn: 'العشا',
    tnLatn: '3cha',
    add: { en: 'Add dinner', fr: 'Ajouter le dîner', tn: 'زيد العشا', tnLatn: 'Zid el 3cha' },
  },
  {
    id: 'snack',
    en: 'Snacks',
    fr: 'Collations',
    tn: 'لمجة',
    tnLatn: 'Lemja',
    add: { en: 'Add a snack', fr: 'Ajouter une collation', tn: 'زيد لمجة', tnLatn: 'Zid lemja' },
  },
];

const ONE_MEAL = {
  en: 'Your meal',
  fr: 'Ton repas',
  tn: 'الماكلة متاعك',
  tnLatn: 'Makeltek',
  add: { en: 'Add your meal', fr: 'Ajouter ton repas', tn: 'زيد الماكلة متاعك', tnLatn: 'Zid makeltek' },
};

/**
 * The meal sections for a day. On a fasting day: suhoor, iftar, the evening
 * (stored as breakfast, dinner, snack), with lunch only if something is in it.
 */
function mealsFor(fasting: boolean, entries: FoodEntry[]) {
  if (!fasting) return MEALS;
  const ramadan = RAMADAN_MEALS.map((m) => ({ id: m.id, ...m.name, add: m.add }));
  return entries.some((e) => e.meal === 'lunch') ? [...ramadan, MEALS[1]] : ramadan;
}

/** Where the numbers came from, worded so a beginner can judge how exact they are. */
const SOURCE_LABEL: Record<FoodEntry['source'], LocalizedText> = {
  photo: { en: 'AI photo estimate', fr: 'estimé par photo', tn: 'تقدير IA بالتصويرة', tnLatn: 'ta9dir IA bel photo' },
  barcode: { en: 'from the label', fr: 'd’après l’étiquette', tn: 'من الإتيكات', tnLatn: 'mel étiquette' },
  search: { en: 'food list', fr: 'liste d’aliments', tn: 'ليستة الماكلة', tnLatn: 'liste el makla' },
  manual: { en: 'entered by hand', fr: 'saisi à la main', tn: 'مكتوب باليد', tnLatn: 'mektoub bel yed' },
  ai_text: { en: 'AI estimate', fr: 'estimé par l’IA', tn: 'تقدير الـIA', tnLatn: 'ta9dir IA' },
  quick: { en: 'quick add', fr: 'ajout rapide', tn: 'زيد بالفيسع', tnLatn: 'zid bel fisa3' },
};

/** Macro initials (French: Protéines, Glucides, Lipides). */
const LETTER = {
  protein: { en: 'P', fr: 'P', tn: 'ب', tnLatn: 'P' },
  carbs: { en: 'C', fr: 'G', tn: 'ن', tnLatn: 'G' },
  fat: { en: 'F', fr: 'L', tn: 'د', tnLatn: 'L' },
};

/** How far back the day strip can be swiped, in weeks. */
const WEEKS_BACK = 12;

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

/** Rescales every nutrient of a weighed entry to a new portion. */
function scaleEntry(entry: FoodEntry, grams: number): Partial<FoodEntry> {
  const f = grams / (entry.grams || grams);
  const r = (n: number) => Math.round(n * f * 10) / 10;
  return {
    grams: Math.round(grams),
    calories: Math.round(entry.calories * f),
    protein: r(entry.protein),
    carbs: r(entry.carbs),
    fat: r(entry.fat),
    fiber: entry.fiber !== undefined ? r(entry.fiber) : undefined,
  };
}

export default function FoodScreen() {
  const t = useTokens();
  const router = useRouter();
  const fmt = useFormat();
  const snackbar = useSnackbar();
  const { L, language, formatDate } = useLanguage();
  const { foods, foodsForDate, today, plan, profile, addFoods, updateFood, deleteFood } = useAppData();
  const [ramadan] = useRamadanSettings();
  const [date, setDate] = useState(today);
  const [editing, setEditing] = useState<FoodEntry | null>(null);
  const [sheetOpen, setSheetOpen] = useState(false);

  const entries = useMemo(() => foodsForDate(date), [foodsForDate, date]);
  const totals = useMemo(() => sumNutrition(entries), [entries]);
  const loggedDays = useMemo(() => new Set(foods.map((f) => f.date)), [foods]);
  const target = plan?.targetCalories ?? 2000;

  const dateLabel =
    date === today
      ? L({ en: 'Today', fr: 'Aujourd’hui', tn: 'اليوم', tnLatn: 'Lyoum' })
      : date === addDays(today, -1)
        ? L({ en: 'Yesterday', fr: 'Hier', tn: 'البارح', tnLatn: 'Lbera7' })
        : capitalize(
            formatDate(new Date(date + 'T12:00:00'), { weekday: 'long', day: 'numeric', month: 'long' }),
          );

  const fastingDay = isFastingDay(ramadan, date);
  const oneMeal = profile?.mealsPerDay === 1 && !fastingDay;
  const eaten = totals.calories;
  const diff = eaten - target;
  const over = diff > 0;

  const addTo = (meal?: MealType) =>
    router.push({ pathname: '/scan', params: meal ? { meal, date } : { date } });

  const openEdit = (entry: FoodEntry) => {
    setEditing(entry);
    setSheetOpen(true);
  };

  const macroLine = (e: FoodEntry) =>
    [
      e.grams ? `${fmt(e.grams)} g` : null,
      `${L(LETTER.protein)} ${fmt(Math.round(e.protein))}`,
      `${L(LETTER.carbs)} ${fmt(Math.round(e.carbs))}`,
      `${L(LETTER.fat)} ${fmt(Math.round(e.fat))}`,
      L(SOURCE_LABEL[e.source]),
    ]
      .filter(Boolean)
      .join(' · ');

  const macroTargets: { key: string; label: string; tone: Tone; value: number; target?: number }[] = [
    { key: 'p', label: L({ en: 'Protein', fr: 'Protéines', tn: 'بروتين', tnLatn: 'Protéines' }), tone: 'protein', value: totals.protein, target: plan?.macros.protein },
    { key: 'c', label: L({ en: 'Carbs', fr: 'Glucides', tn: 'نشويات', tnLatn: 'Glucides' }), tone: 'carbs', value: totals.carbs, target: plan?.macros.carbs },
    { key: 'f', label: L({ en: 'Fat', fr: 'Lipides', tn: 'دهون', tnLatn: 'Lipides' }), tone: 'fat', value: totals.fat, target: plan?.macros.fat },
    { key: 'fi', label: L({ en: 'Fiber', fr: 'Fibres', tn: 'ألياف', tnLatn: 'Fibres' }), tone: 'secondary', value: totals.fiber, target: plan?.macros.fiber },
  ];

  return (
    <View style={{ flex: 1 }}>
      <Screen title={L({
        en: 'Food diary',
        fr: 'Journal alimentaire',
        tn: 'جورنال الماكلة',
        tnLatn: 'Journal el makla',
      })} subtitle={dateLabel} bottomSpace={NAV_BAR_SPACE + 92}>
        <DayStrip today={today} selected={date} onSelect={setDate} logged={loggedDays} />

        {/* Day summary */}
        <View style={styles.summary}>
          <View style={styles.summaryTop}>
            <View style={styles.eatenRow}>
              <AnimatedNumber value={eaten} variant="numLarge" />
              <Txt variant="numMedium" tone="tertiary">
                {' / '}
                {fmt(target)} kcal
              </Txt>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Txt variant="numLarge" tone={over ? 'danger' : 'accent'}>
                {fmt(Math.abs(diff))}
              </Txt>
              <Txt variant="overline" tone={over ? 'danger' : 'secondary'}>
                {over ? L({ en: 'over', fr: 'au-dessus', tn: 'زايد', tnLatn: 'zeyed' }) : L({ en: 'left', fr: 'restant', tn: 'باقي', tnLatn: 'b9a' })}
              </Txt>
            </View>
          </View>
          <View style={{ marginTop: space.md }}>
            <ProgressLine value={target > 0 ? eaten / target : 0} overColor={t.danger} height={6} />
          </View>
          <View style={styles.macros}>
            {macroTargets.map((m) => (
              <View key={m.key} style={{ flex: 1, minWidth: 0 }}>
                <Txt variant="overline" tone={m.tone} numberOfLines={1}>
                  {m.label}
                </Txt>
                <Txt variant="numSmall" numberOfLines={1}>
                  {fmt(Math.round(m.value))}
                  <Txt variant="numSmall" tone="tertiary">
                    /{m.target !== undefined ? fmt(m.target) : '—'} g
                  </Txt>
                </Txt>
              </View>
            ))}
          </View>
        </View>

        {/* Meals. Rows fade in when they mount (a new entry, or another day's list). */}
        {mealsFor(fastingDay, entries).filter((meal) => !oneMeal || meal.id === 'dinner' || entries.some((e) => e.meal === meal.id)).map((m) => {
          // One meal a day: a single "Your meal" section instead of empty breakfast/lunch slots.
          const meal = oneMeal && m.id === 'dinner' ? { ...m, ...ONE_MEAL } : m;
          const items = entries.filter((e) => e.meal === meal.id);
          const kcal = items.reduce((s, e) => s + e.calories, 0);
          return (
            <Section
              key={meal.id}
              title={L(meal)}
              action={
                items.length ? (
                  <View style={styles.mealAction}>
                    <Txt variant="numSmall" tone="secondary">
                      {fmt(kcal)} kcal
                    </Txt>
                    <Button
                      variant="text"
                      label={L({ en: 'Add', fr: 'Ajouter', tn: 'زيد', tnLatn: 'Zid' })}
                      icon={(c) => <Plus size={20} color={c} />}
                      onPress={() => addTo(meal.id)}
                      style={{ marginRight: -space.md }}
                    />
                  </View>
                ) : undefined
              }
            >
              {items.length ? (
                <Group>
                  {items.map((e, i) => (
                    <Appear key={e.id} offset={4}>
                      <ListItem
                        title={e.name}
                        supporting={macroLine(e)}
                        trailing={<Txt variant="numMedium">{fmt(e.calories)}</Txt>}
                        onPress={() => openEdit(e)}
                        divider={i < items.length - 1}
                      />
                    </Appear>
                  ))}
                </Group>
              ) : (
                <Appear key={`empty-${date}`} offset={0}>
                  <Tap
                    onPress={() => addTo(meal.id)}
                    pressScale={1}
                    accessibilityLabel={L(meal.add)}
                    style={[styles.emptyRow, { borderColor: t.border }]}
                    pressedStyle={{ backgroundColor: t.pressed }}
                  >
                    <Plus size={20} color={t.textTertiary} />
                    <Txt variant="body" tone="secondary" style={{ flex: 1 }}>
                      {L(meal.add)}
                    </Txt>
                  </Tap>
                </Appear>
              )}
            </Section>
          );
        })}
      </Screen>

      <Fab label={L({
        en: 'Snap meal',
        fr: 'Photo du repas',
        tn: 'صوّر الماكلة',
        tnLatn: 'Sawwer el makla',
      })} onPress={() => router.push({ pathname: '/scan', params: { date } })} />

      <EditEntrySheet
        entry={editing}
        visible={sheetOpen && !!editing}
        onClose={() => setSheetOpen(false)}
        onSave={(patch) => {
          if (editing) updateFood(editing.id, patch);
          setSheetOpen(false);
        }}
        onDelete={() => {
          if (!editing) return;
          const { id, createdAt: _createdAt, ...rest } = editing;
          deleteFood(id);
          setSheetOpen(false);
          snackbar.show(L({ en: 'Entry deleted', fr: 'Aliment supprimé', tn: 'الماكلة تفسخت', tnLatn: 'El makla tfass5et' }), {
            label: L({ en: 'Undo', fr: 'Annuler', tn: 'رجّع', tnLatn: 'Rajja3' }),
            onPress: () => addFoods([rest]),
          });
        }}
      />
    </View>
  );
}

// ---------------------------------------------------------------------------
// Day strip: 7 days per page (last 6 days + today), swipe right for earlier weeks.
// ---------------------------------------------------------------------------

function DayStrip({
  today,
  selected,
  onSelect,
  logged,
}: {
  today: string;
  selected: string;
  onSelect: (date: string) => void;
  logged: Set<string>;
}) {
  const t = useTokens();
  const { L, language, formatDate, weekdayName } = useLanguage();
  const [width, setWidth] = useState(0);
  const scroller = useRef<ScrollView>(null);
  const days = useMemo(
    () => Array.from({ length: WEEKS_BACK * 7 }, (_, i) => addDays(today, i - (WEEKS_BACK * 7 - 1))),
    [today],
  );
  const weeks = useMemo(() => Array.from({ length: WEEKS_BACK }, (_, w) => days.slice(w * 7, w * 7 + 7)), [days]);
  // Each page keeps a small inset so the outer days don't touch the bezel
  // (still ≥ 49 dp per day on a 360 dp phone).
  const cell = (width - space.sm * 2) / 7;

  // Land on the current week whenever the strip is (re)measured or the day rolls over.
  useEffect(() => {
    if (width > 0) scroller.current?.scrollToEnd({ animated: false });
  }, [width, today]);

  return (
    <View
      // Bleeds to the screen edges so each day keeps a ≥48 dp target on narrow phones.
      style={{ marginHorizontal: -space.gutter, height: 68 }}
      onLayout={(e) => setWidth(e.nativeEvent.layout.width)}
      accessibilityRole="tablist"
    >
      {width > 0 ? (
        <ScrollView
          ref={scroller}
          horizontal
          pagingEnabled
          // A left-to-right timeline in every language: its offsets assume it.
          style={{ direction: 'ltr' }}
          showsHorizontalScrollIndicator={false}
          contentOffset={{ x: (WEEKS_BACK - 1) * width, y: 0 }}
          onContentSizeChange={() => scroller.current?.scrollToEnd({ animated: false })}
        >
          {weeks.map((week) => (
            <View key={week[0]} style={{ width, flexDirection: 'row', paddingHorizontal: space.sm }}>
              {week.map((d) => {
                const on = d === selected;
                const dt = new Date(d + 'T12:00:00');
                return (
                  <Tap
                    key={d}
                    onPress={() => onSelect(d)}
                    haptic="selection"
                    pressScale={0.94}
                    accessibilityRole="tab"
                    accessibilityState={{ selected: on }}
                    accessibilityLabel={
                      d === today
                        ? L({ en: 'Today', fr: 'Aujourd’hui', tn: 'اليوم', tnLatn: 'Lyoum' })
                        : formatDate(dt, { weekday: 'long', day: 'numeric', month: 'long' })
                    }
                    style={{ width: cell, height: 68, paddingHorizontal: 3 }}
                  >
                    <View
                      style={[
                        styles.day,
                        {
                          // Selection is inverted ink: a white pill under black text.
                          backgroundColor: on ? t.select : 'transparent',
                          borderColor: on ? t.select : 'transparent',
                        },
                      ]}
                    >
                      <Txt variant="caption" color={on ? t.onSelect : t.textTertiary}>
                        {weekdayName(dt, 'narrow')}
                      </Txt>
                      <Txt variant="numMedium" color={on ? t.onSelect : d === today ? t.text : t.textSecondary}>
                        {dt.getDate()}
                      </Txt>
                      <View
                        style={[
                          styles.loggedDot,
                          { backgroundColor: logged.has(d) ? (on ? t.onSelect : t.accent) : 'transparent' },
                        ]}
                      />
                    </View>
                  </Tap>
                );
              })}
            </View>
          ))}
        </ScrollView>
      ) : null}
    </View>
  );
}

// ---------------------------------------------------------------------------
// Edit sheet
// ---------------------------------------------------------------------------

function EditEntrySheet({
  entry,
  visible,
  onClose,
  onSave,
  onDelete,
}: {
  entry: FoodEntry | null;
  visible: boolean;
  onClose: () => void;
  onSave: (patch: Partial<FoodEntry>) => void;
  onDelete: () => void;
}) {
  const fmt = useFormat();
  const { L } = useLanguage();
  const [ramadan] = useRamadanSettings();
  const [grams, setGrams] = useState('');
  const [kcal, setKcal] = useState('');
  const [meal, setMeal] = useState<MealType>('lunch');

  // Reset the form whenever the sheet opens on an entry.
  useEffect(() => {
    if (!visible || !entry) return;
    setGrams(entry.grams ? String(entry.grams) : '');
    setKcal(String(entry.calories));
    setMeal(entry.meal);
  }, [visible, entry]);

  const g = parseFloat(grams.replace(',', '.'));
  const rescaled = entry?.grams && Number.isFinite(g) && g > 0 ? scaleEntry(entry, g) : null;

  const save = () => {
    if (!entry) return;
    if (entry.grams && Number.isFinite(g) && g > 0 && g !== entry.grams) {
      // Scale every nutrient with the new portion.
      onSave({ meal, ...scaleEntry(entry, g) });
      return;
    }
    const k = parseFloat(kcal.replace(',', '.'));
    onSave({ meal, calories: Number.isFinite(k) && k >= 0 ? Math.round(k) : entry.calories });
  };

  return (
    <Sheet visible={visible} onClose={onClose} title={entry?.name}>
      {entry ? (
        <View>
          {entry.note ? (
            <Txt variant="caption" tone="secondary" style={{ marginTop: -space.sm, marginBottom: space.lg }}>
              {entry.note}
            </Txt>
          ) : null}
          {entry.grams ? (
            <>
              <Field
                label={L({ en: 'Portion', fr: 'Portion', tn: 'بورسيون', tnLatn: 'Portion' })}
                unit="g"
                numeric
                value={grams}
                onChangeText={setGrams}
                keyboardType="decimal-pad"
                selectTextOnFocus
              />
              {rescaled ? (
                <Txt variant="numSmall" tone="secondary" style={{ marginTop: space.sm }}>
                  {fmt(rescaled.calories ?? 0)} kcal · {L(LETTER.protein)} {fmt(Math.round(rescaled.protein ?? 0))} · {L(LETTER.carbs)}{' '}
                  {fmt(Math.round(rescaled.carbs ?? 0))} · {L(LETTER.fat)} {fmt(Math.round(rescaled.fat ?? 0))}
                </Txt>
              ) : null}
            </>
          ) : (
            <Field
              label={L({ en: 'Calories', fr: 'Calories', tn: 'كالوري', tnLatn: 'Calories' })}
              unit="kcal"
              numeric
              value={kcal}
              onChangeText={setKcal}
              keyboardType="decimal-pad"
              selectTextOnFocus
            />
          )}

          <Txt variant="label" tone="secondary" style={{ marginTop: space.xl, marginBottom: space.sm }}>
            {L({ en: 'Meal', fr: 'Repas', tn: 'الماكلة', tnLatn: 'Makla' })}
          </Txt>
          <ChipRow>
            {mealsFor(!!entry && isFastingDay(ramadan, entry.date), entry && entry.meal === 'lunch' ? [entry] : []).map((m) => (
              <Chip key={m.id} label={L(m)} selected={meal === m.id} onPress={() => setMeal(m.id)} />
            ))}
          </ChipRow>

          <View style={styles.sheetButtons}>
            <Button
              variant="danger"
              label={L({ en: 'Delete', fr: 'Supprimer', tn: 'فسّخ', tnLatn: 'Fasa5' })}
              icon={(c) => <Trash2 size={20} color={c} />}
              onPress={onDelete}
              style={{ flex: 1 }}
            />
            <Button label={L({ en: 'Save', fr: 'Enregistrer', tn: 'سجّل', tnLatn: 'Sajjel' })} onPress={save} haptic="light" style={{ flex: 1.4 }} />
          </View>
        </View>
      ) : null}
    </Sheet>
  );
}

const styles = StyleSheet.create({
  day: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  loggedDot: { width: 4, height: 4, borderRadius: 2, marginTop: 2 },
  summary: { marginTop: space.xl },
  summaryTop: { flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', gap: space.lg },
  eatenRow: { flexDirection: 'row', alignItems: 'baseline', flexShrink: 1, flexWrap: 'wrap' },
  macros: { flexDirection: 'row', gap: space.sm, marginTop: space.lg },
  mealAction: { flexDirection: 'row', alignItems: 'center', gap: space.xs },
  emptyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    minHeight: 52,
    paddingHorizontal: space.lg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderStyle: 'dashed',
  },
  sheetButtons: { flexDirection: 'row', gap: space.md, marginTop: space.xl },
});
