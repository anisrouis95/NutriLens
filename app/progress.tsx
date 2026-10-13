import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, { useAnimatedStyle, useDerivedValue, useReducedMotion, withDelay, withTiming } from 'react-native-reanimated';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppData } from '@/contexts/AppDataContext';
import {
  LineChart,
  ProgressLine,
  Screen,
  Section,
  Segmented,
  Txt,
  WeekBars,
  Why,
  useFormat,
  type Tone,
} from '@/components/ds';
import { addDays, daysBetween, sumNutrition, weightTrend } from '@/lib/nutritionMath';
import { motion, radius, space, useTokens } from '@/theme';

type Range = '30' | '90' | '365';

export default function ProgressScreen() {
  const t = useTokens();
  const fmt = useFormat();
  const { L, language, weekdayName, formatDate } = useLanguage();
  const { weights, foods, plan, profile, adaptive, today, health, sessions } = useAppData();
  const [range, setRange] = useState<Range>('30');
  const signed = (n: number, d = 2) => `${n > 0 ? '+' : ''}${fmt(n, d)}`;

  const trend = useMemo(() => weightTrend(weights), [weights]);
  const from = addDays(today, -Number(range));
  const visible = trend.filter((p) => p.date >= from);
  // One weigh-in is not a line yet: show the empty hint until there are two.
  const charted = visible.length >= 2 ? visible : [];

  const last = trend[trend.length - 1];
  const twoWeeksAgo = trend.filter((p) => p.date <= addDays(today, -14)).pop();
  const weeklyRate =
    last && twoWeeksAgo ? ((last.trend - twoWeeksAgo.trend) / Math.max(daysBetween(twoWeeksAgo.date, last.date), 1)) * 7 : undefined;

  // On track = the trend moves the way the plan expects (or holds steady when maintaining).
  const expected = plan?.weeklyChangeKg ?? 0;
  const onTrack =
    weeklyRate === undefined
      ? undefined
      : expected < -0.05
        ? weeklyRate < 0
        : expected > 0.05
          ? weeklyRate > 0
          : Math.abs(weeklyRate) <= 0.15;

  // Fixed vertical scale for the selected range: whole kilos around every
  // weigh-in, the trend and the goal, with an even span so the middle tick is round.
  const weightDomain = (() => {
    const ys = charted.flatMap((p) => [p.kg, p.trend]);
    if (ys.length < 2) return undefined;
    if (profile?.targetWeightKg) ys.push(profile.targetWeightKg);
    const lo = Math.floor(Math.min(...ys) - 0.5);
    let hi = Math.ceil(Math.max(...ys) + 0.5);
    if ((hi - lo) % 2) hi += 1;
    return [lo, hi] as [number, number];
  })();

  const target = plan?.targetCalories ?? 2000;
  const week = useMemo(
    () =>
      Array.from({ length: 7 }, (_, i) => {
        const date = addDays(today, i - 6);
        const consumed = Math.round(sumNutrition(foods.filter((f) => f.date === date)).calories);
        const label = weekdayName(new Date(date + 'T12:00:00'), 'short');
        return { label, consumed, date };
      }),
    [foods, today, weekdayName],
  );
  const logged = week.filter((d) => d.consumed > 0 && d.date !== today);
  const avgIntake = logged.length ? logged.reduce((s, d) => s + d.consumed, 0) / logged.length : 0;

  // Data needed before the app can measure real TDEE.
  const loggedDays28 = new Set(foods.filter((f) => f.date >= addDays(today, -28) && f.date < today).map((f) => f.date)).size;
  const weighIns28 = weights.filter((w) => w.date >= addDays(today, -28)).length;

  const steps = Object.values(health)
    .filter((h) => h.date >= addDays(today, -14) && (h.steps ?? 0) > 0)
    .sort((a, b) => a.date.localeCompare(b.date));
  const avgSteps = steps.length ? steps.reduce((s, h) => s + (h.steps ?? 0), 0) / steps.length : 0;
  const stepsTop = Math.max(2000, Math.ceil((Math.max(plan?.stepsTarget ?? 0, ...steps.map((h) => h.steps ?? 0)) * 1.1) / 2000) * 2000);

  const weeksTrained = Array.from({ length: 4 }, (_, i) => {
    const start = addDays(today, -7 * (i + 1) + 1);
    const end = addDays(today, -7 * i);
    return sessions.filter((s) => s.finishedAt && s.date >= start && s.date <= end).length;
  }).reverse();
  const trainingGoal = Math.max(profile?.trainingDays ?? 3, 1);

  const shortDate = (date: string) => formatDate(new Date(date + 'T12:00:00'), { day: 'numeric', month: 'short' });

  return (
    <Screen back title={L({ en: 'Progress', fr: 'Progression', tn: 'التقدّم', tnLatn: 'Progrès' })}>
      <Section title={L({ en: 'Weight', fr: 'Poids', tn: 'الوزن', tnLatn: 'Poids' })} first>
        <View style={styles.stats}>
          <Stat
            value={last ? fmt(last.trend, 1) : '—'}
            unit="kg"
            caption={L({ en: 'Trend', fr: 'Tendance', tn: 'الاتّجاه', tnLatn: 'Tendance' })}
            large
          />
          <Stat
            value={weeklyRate !== undefined ? signed(weeklyRate) : '—'}
            unit="kg"
            caption={L({ en: 'Per week', fr: 'Par semaine', tn: 'في الجمعة', tnLatn: 'Fel jem3a' })}
            tone={onTrack ? 'success' : 'primary'}
          />
          <Stat
            value={plan ? signed(plan.weeklyChangeKg) : '—'}
            unit="kg"
            caption={L({ en: 'Expected', fr: 'Prévu', tn: 'المتوقّع', tnLatn: 'Prévu' })}
          />
        </View>

        <View style={{ marginTop: space.xl }}>
          <Segmented<Range>
            value={range}
            onChange={setRange}
            options={[
              { value: '30', label: L({ en: '30 days', fr: '30 jours', tn: '30 يوم', tnLatn: '30 youm' }) },
              { value: '90', label: L({ en: '90 days', fr: '90 jours', tn: '90 يوم', tnLatn: '90 youm' }) },
              { value: '365', label: L({ en: '1 year', fr: '1 an', tn: '1 عام', tnLatn: '1 an' }) },
            ]}
          />
        </View>

        <View style={{ marginTop: space.lg }}>
          <LineChart
            series={[
              { points: charted.map((p) => ({ x: daysBetween(from, p.date), y: p.kg })), color: t.textTertiary, width: 0, dots: true },
              { points: charted.map((p) => ({ x: daysBetween(from, p.date), y: p.trend })), color: t.accent, width: 2.5 },
            ]}
            reference={
              profile?.targetWeightKg
                ? {
                    y: profile.targetWeightKg,
                    label: `${L({
                      en: 'goal',
                      fr: 'objectif',
                      tn: 'الهدف',
                      tnLatn: 'objectif',
                    })} ${fmt(profile.targetWeightKg, Number.isInteger(profile.targetWeightKg) ? 0 : 1)}`,
                    color: t.textSecondary,
                  }
                : undefined
            }
            yDomain={weightDomain}
            xLabel={(x) => shortDate(addDays(from, x))}
            yLabel={(y) => fmt(y)}
            emptyText={L({
              en: 'Log your weight on at least 2 days to see the chart.',
              fr: 'Note ton poids au moins 2 jours pour voir la courbe.',
              tn: 'سجّل وزنك 2 أيّام على الأقل باش تشوف الكورب.',
              tnLatn: 'Sajjel poids mte3ek 2 iyyem 3al a9al bech tchouf el courbe.',
            })}
          />
        </View>

        <Why title={L({ en: 'Dots or line?', fr: 'Points ou ligne ?', tn: 'النقط ولّا الخطّ؟', tnLatn: 'Les points walla el 5att?' })} style={{ marginTop: space.lg }}>
          <Txt variant="body" tone="secondary">
            {L({
              en: 'Dots are your daily weigh-ins — they jump around with water, salt and food in your gut. The bright line is the smoothed trend: that is your real progress. Compare the line week to week, ignore single dots.',
              fr: 'Les points sont tes pesées du jour — ils bougent avec l’eau, le sel et ce qu’il y a dans ton ventre. La ligne vive est la tendance lissée : c’est ta vraie progression. Compare la ligne d’une semaine à l’autre, ignore les points isolés.',
              tn: 'النقط هوما الوزن متاعك كل نهار — يطلعو وينزلو بالماء، الملح والماكلة اللي في كرشك. الخطّ اللي يضوّي هو الاتّجاه بلا تطلاع وتهباط: هذاك هو التقدّم الحقيقي متاعك. قارن الخطّ من جمعة لجمعة، وما تعطيش أهمية للنقط وحدها.',
              tnLatn: 'Les points houma el poids mte3ek kol nhar — yotla3ou w yahbtou bel mé, el mel7 w el makla eli f kerchek. El 5att eli ydhawi howa el tendance lissée: hedheka howa el progrès el 7a9i9i mte3ek. 9aren el 5att men jem3a l jem3a, w ma ta3tich importance lel points wa7adhom.',
            })}
          </Txt>
        </Why>
      </Section>

      <Section title={L({ en: 'Calories this week', fr: 'Calories cette semaine', tn: 'الكالوري الجمعة هاذي', tnLatn: 'Calories el jem3a hedhi' })}>
        <WeekBars days={week.map((d) => ({ label: d.label, value: d.consumed, today: d.date === today }))} target={target} />
        <Txt variant="caption" tone="tertiary" style={{ marginTop: space.sm }}>
          {L({
            en: 'Dashed line: your target. Today is the bright bar.',
            fr: 'Ligne pointillée : ta cible. Aujourd’hui, c’est la barre vive.',
            tn: 'الخطّ المقطّع: الهدف متاعك. اليوم هو العمود اللي يضوّي.',
            tnLatn: 'El 5att el m9atta3: objectif mte3ek. Lyoum howa el barre eli tdhawi.',
          })}
        </Txt>
        {logged.length ? (
          <View style={[styles.facts, { borderTopColor: t.hairline }]}>
            <Stat value={fmt(avgIntake)} unit="kcal" caption={L({
              en: 'Average on logged days',
              fr: 'Moyenne des jours notés',
              tn: 'المعدّل في الأيّام المسجّلة',
              tnLatn: 'Moyenne fel iyyem el msajla',
            })} />
            {plan ? <Stat value={fmt(plan.targetCalories)} unit="kcal" caption={L({ en: 'Target', fr: 'Cible', tn: 'الهدف', tnLatn: 'Objectif' })} /> : null}
          </View>
        ) : (
          <Txt variant="body" tone="secondary" style={{ marginTop: space.lg }}>
            {L({
              en: 'No full days logged this week yet.',
              fr: 'Aucune journée complète notée cette semaine.',
              tn: 'مازال ما سجّلت حتّى نهار كامل الجمعة هاذي.',
              tnLatn: 'Mazel ma sajjelt 7atta nhar kemel el jem3a hedhi.',
            })}
          </Txt>
        )}
      </Section>

      <Section title={L({ en: 'Your real metabolism', fr: 'Ton vrai métabolisme', tn: 'الميتابوليزم الحقيقي متاعك', tnLatn: 'Métabolisme el 7a9i9i mte3ek' })}>
        {adaptive && plan?.tdeeSource === 'adaptive' ? (
          <>
            <Txt variant="numLarge" tone="accent">
              {fmt(adaptive.tdee)}
              <Txt variant="label" tone="tertiary">{` kcal / ${L({ en: 'day', fr: 'jour', tn: 'نهار', tnLatn: 'nhar' })}`}</Txt>
            </Txt>
            <Txt variant="body" tone="secondary" style={{ marginTop: space.sm }}>
              {L(
                {
                  en: 'Measured from {{days}} logged days and {{w}} weigh-ins. Your targets now use this number instead of the formula.',
                  fr: 'Mesuré sur {{days}} jours notés et {{w}} pesées. Tes objectifs utilisent maintenant ce chiffre au lieu de la formule.',
                  tn: 'محسوب من {{days}} نهار مسجّل و {{w}} وزن. الأهداف متاعك توّا تستعمل الرقم هذا في بلاصة الفورمول.',
                  tnLatn: 'Ma7soub men {{days}} nhar msajjel w {{w}} pesées. Les objectifs mte3ek taw yesta3mlou el ra9m hedha fi blasset el formule.',
                },
                { days: adaptive.loggedDays, w: adaptive.weighIns },
              )}
            </Txt>
          </>
        ) : (
          <>
            <Txt variant="body" tone="secondary">
              {L({
                en: 'Formulas are only estimates. Log your food and weigh yourself for a few weeks and Tounsi Fit will calculate what YOUR body really burns.',
                fr: 'Les formules ne sont que des estimations. Note tes repas et pèse-toi quelques semaines et Tounsi Fit calculera ce que TON corps dépense vraiment.',
                tn: 'الفورمولات كان تقديرات. سجّل ماكلتك ووزن روحك كم جمعة و Tounsi Fit باش يحسب قدّاش بدنك إنت يحرق بالحقّ.',
                tnLatn: 'Les formules ken estimations. Sajjel maklek w ouzen rou7ek kam jem3a w Tounsi Fit bech y7seb 9addech badnek ENTI y7ra9 bel 7a9.',
              })}
            </Txt>
            <View style={{ gap: space.lg, marginTop: space.lg }}>
              <Meter label={L({ en: 'Days logged', fr: 'Jours notés', tn: 'أيّام مسجّلة', tnLatn: 'Iyyem msajla' })} value={Math.min(loggedDays28, 14)} max={14} />
              <Meter label={L({ en: 'Weigh-ins', fr: 'Pesées', tn: 'مرّات الوزن', tnLatn: 'Pesées' })} value={Math.min(weighIns28, 6)} max={6} />
            </View>
          </>
        )}
      </Section>

      {steps.length ? (
        <Section title={L({ en: 'Steps · last 14 days', fr: 'Pas · 14 derniers jours', tn: 'الخطوات · آخر 14 يوم', tnLatn: 'Pas · ekher 14 youm' })}>
          <View style={styles.stats}>
            <Stat value={fmt(avgSteps)} caption={L({ en: 'Daily average', fr: 'Moyenne par jour', tn: 'المعدّل في النهار', tnLatn: 'Moyenne fel nhar' })} large />
            {plan ? <Stat value={fmt(plan.stepsTarget)} caption={L({ en: 'Target', fr: 'Cible', tn: 'الهدف', tnLatn: 'Objectif' })} /> : null}
          </View>
          <View style={{ marginTop: space.lg }}>
            <LineChart
              series={[{ points: steps.map((h) => ({ x: daysBetween(steps[0].date, h.date), y: h.steps ?? 0 })), color: t.accent, dots: true }]}
              reference={plan ? { y: plan.stepsTarget, label: '', color: t.textSecondary } : undefined}
              height={150}
              yDomain={[0, stepsTop]}
              xLabel={(x) => shortDate(addDays(steps[0].date, x))}
              yLabel={(y) => `${fmt(y / 1000)}k`}
              emptyText={L({
                en: 'Sync at least 2 days of steps to see the chart.',
                fr: 'Synchronise au moins 2 jours de pas pour voir la courbe.',
                tn: 'اعمل مزامنة لخطوات 2 أيّام على الأقل باش تشوف الكورب.',
                tnLatn: 'A3mel synchro l pas mte3 2 iyyem 3al a9al bech tchouf el courbe.',
              })}
            />
          </View>
        </Section>
      ) : null}

      <Section title={L({ en: 'Training · last 4 weeks', fr: 'Entraînement · 4 dernières semaines', tn: 'التمرين · آخر 4 جمعات', tnLatn: 'Sport · ekher 4 jem3at' })}>
        <TrainingBars
          weeks={weeksTrained}
          goal={trainingGoal}
          labels={weeksTrained.map((_, i) =>
            i === 3 ? L({
              en: 'This wk',
              fr: 'Cette sem.',
              tn: 'هالجمعة',
              tnLatn: 'Hal jem3a',
            }) : L({
              en: '-{{n}} wk',
              fr: '-{{n}} sem.',
              tn: '-{{n}} جمعة',
              tnLatn: '-{{n}} jem3a',
            }, { n: 3 - i }),
          )}
        />
        <Txt variant="caption" tone="secondary" style={{ marginTop: space.md }}>
          {L(
            {
              en: 'Goal: {{n}} sessions per week (dashed line).',
              fr: 'Objectif : {{n}} séances par semaine (ligne pointillée).',
              tn: 'الهدف: {{n}} حصص في الجمعة (الخطّ المقطّع).',
              tnLatn: 'Objectif: {{n}} séances fel jem3a (el 5att el m9atta3).',
            },
            { n: profile?.trainingDays ?? '—' },
          )}
        </Txt>
      </Section>
    </Screen>
  );
}

function Stat({
  value,
  unit,
  caption,
  tone = 'primary',
  large,
}: {
  value: string;
  unit?: string;
  caption: string;
  tone?: Tone;
  large?: boolean;
}) {
  return (
    <View style={styles.stat}>
      <Txt variant={large ? 'numLarge' : 'numMedium'} tone={tone} numberOfLines={1} adjustsFontSizeToFit>
        {value}
        {unit ? (
          <Txt variant={large ? 'label' : 'numSmall'} tone="tertiary">
            {` ${unit}`}
          </Txt>
        ) : null}
      </Txt>
      <Txt variant="caption" tone="secondary" style={{ marginTop: 2 }}>
        {caption}
      </Txt>
    </View>
  );
}

function Meter({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <View style={{ gap: space.sm }}>
      <View style={styles.meterHead}>
        <Txt variant="label" style={{ flex: 1 }}>
          {label}
        </Txt>
        <Txt variant="numSmall" tone="secondary">
          {value}/{max}
        </Txt>
      </View>
      <ProgressLine value={value / max} height={6} />
    </View>
  );
}

/** Sessions per week against the goal; a week that meets it fills in success green. */
function TrainingBars({ weeks, goal, labels, height = 120 }: { weeks: number[]; goal: number; labels: string[]; height?: number }) {
  const t = useTokens();
  const max = Math.max(goal * 1.25, ...weeks, 1);
  return (
    <View>
      <View style={{ height, flexDirection: 'row', alignItems: 'flex-end', gap: space.md }}>
        <View pointerEvents="none" style={[styles.goalLine, { bottom: (goal / max) * height, borderColor: t.textTertiary }]} />
        {weeks.map((n, i) => (
          <TrainingBar key={i} value={n} max={max} height={height} index={i} current={i === weeks.length - 1} met={n >= goal} />
        ))}
      </View>
      <View style={{ flexDirection: 'row', gap: space.md, marginTop: space.sm }}>
        {weeks.map((n, i) => (
          <View key={i} style={{ flex: 1, alignItems: 'center' }}>
            <Txt variant="numMedium">{n}</Txt>
            <Txt variant="numSmall" tone={i === weeks.length - 1 ? 'accent' : 'tertiary'} align="center" numberOfLines={1}>
              {labels[i]}
            </Txt>
          </View>
        ))}
      </View>
    </View>
  );
}

function TrainingBar({
  value,
  max,
  height,
  index,
  current,
  met,
}: {
  value: number;
  max: number;
  height: number;
  index: number;
  current: boolean;
  met: boolean;
}) {
  const t = useTokens();
  const reduce = useReducedMotion();
  const target = (value / max) * height;
  const h = useDerivedValue(
    () => (reduce ? target : withDelay(index * 40, withTiming(target, { duration: motion.slow + 200, easing: motion.easeOut }))),
    [target, reduce],
  );
  const style = useAnimatedStyle(() => ({ height: Math.max(h.value, value > 0 ? 3 : 0) }));
  return (
    <View style={{ flex: 1, height, justifyContent: 'flex-end' }}>
      <Animated.View
        style={[
          { borderRadius: radius.sm / 2, backgroundColor: met ? t.success : t.accent, opacity: current || met ? 1 : 0.7 },
          style,
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  stats: { flexDirection: 'row', alignItems: 'flex-end', gap: space.lg },
  stat: { flex: 1, minWidth: 0 },
  facts: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: space.lg,
    marginTop: space.lg,
    paddingTop: space.md,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  meterHead: { flexDirection: 'row', alignItems: 'baseline' },
  goalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    borderTopWidth: 1.5,
    borderStyle: 'dashed',
  },
});
