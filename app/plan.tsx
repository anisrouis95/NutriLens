import { useMemo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Dumbbell, Footprints, Moon, Utensils } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppData } from '@/contexts/AppDataContext';
import {
  Button,
  Group,
  LineChart,
  ListItem,
  Screen,
  Section,
  Txt,
  Why,
  useFormat,
} from '@/components/ds';
import PlanBars, { type PlanBarsNote } from '@/components/ds/PlanBars';
import { KCAL_PER_KG, projectWeight, stepsCalories } from '@/lib/nutritionMath';
import type { PlanWarning } from '@/types';
import { radius, space, useTokens } from '@/theme';

const WARNINGS: Record<PlanWarning, { en: string; fr: string }> = {
  floor_applied: {
    en: 'Your calculated target was below the safe minimum, so it was raised. Going lower without medical supervision risks muscle loss, nutrient deficiencies and burnout. To lose faster, move more instead of eating less.',
    fr: 'Ta cible calculée était sous le minimum de sécurité, elle a donc été relevée. Descendre plus bas sans suivi médical expose à la perte musculaire, aux carences et à l’épuisement. Pour aller plus vite, bouge plus plutôt que de manger moins.',
  },
  deficit_capped: {
    en: 'The pace you chose would need a deficit too big for your body. It was capped so you keep your muscle and your energy.',
    fr: 'Le rythme choisi demanderait un déficit trop grand pour ton corps. Il a été plafonné pour préserver tes muscles et ton énergie.',
  },
  target_unrealistic: {
    en: 'Your target weight is under a BMI of 18.5 for your height, which counts as underweight. Consider a higher target — you can adjust it any time.',
    fr: 'Ton poids visé correspond à un IMC inférieur à 18,5 pour ta taille, considéré comme une insuffisance pondérale. Envisage un objectif plus haut — modifiable à tout moment.',
  },
  low_bmi: {
    en: 'You are already lean for your height. Building muscle (recomposition) will change how you look more than losing weight.',
    fr: 'Tu es déjà mince pour ta taille. Prendre du muscle (recomposition) changera plus ton apparence que perdre du poids.',
  },
  one_meal: {
    en: 'One meal a day works if the totals add up, but your protein target is a lot for one sitting. Start the meal with the protein (meat, fish, eggs, legumes, dairy), use the rest of your eating hour for a yogurt or a second protein dish, and train in the hours before you eat so the meal doubles as recovery.',
    fr: 'Un repas par jour marche si les totaux y sont, mais ta cible de protéines est beaucoup pour un seul repas. Commence par les protéines (viande, poisson, œufs, légumineuses, laitages), garde le reste de ton heure pour un yaourt ou un deuxième plat protéiné, et entraîne-toi dans les heures avant de manger pour que le repas serve aussi de récupération.',
  },
  high_bmi_protein: {
    en: 'Protein is based on a goal weight rather than your current weight: the extra weight is mostly fat, which needs no protein.',
    fr: 'Les protéines sont calculées sur un poids objectif plutôt que ton poids actuel : le surplus est surtout du gras, qui n’a pas besoin de protéines.',
  },
};

export default function PlanScreen() {
  const t = useTokens();
  const router = useRouter();
  const fmt = useFormat();
  const { L, language } = useLanguage();
  const { profile, plan, adaptive, measuredSteps, workoutPlan } = useAppData();
  const { fresh } = useLocalSearchParams<{ fresh?: string }>();

  const projection = useMemo(
    () =>
      profile
        ? projectWeight(profile, {
            measuredSteps,
            adaptiveTdee: plan?.tdeeSource === 'adaptive' ? plan.tdee : undefined,
          })
        : [],
    [profile, plan, measuredSteps],
  );

  if (!profile || !plan) {
    return (
      <Screen title={L({ en: 'Your plan', fr: 'Ton plan' })} back>
        <Button label={L({ en: 'Answer the questions', fr: 'Répondre aux questions' })} onPress={() => router.replace('/onboarding')} />
      </Screen>
    );
  }

  const goalDate =
    plan.weeksToGoal !== undefined
      ? new Date(Date.now() + plan.weeksToGoal * 7 * 86400000).toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
          month: 'long',
          year: 'numeric',
        })
      : undefined;

  const stepsKcal = Math.round(stepsCalories(2000, profile.weightKg, profile.heightCm));
  const kgPerMonth = (kcal: number) => fmt((kcal * 30) / KCAL_PER_KG, 1);

  const macroKcal = {
    protein: plan.macros.protein * 4,
    carbs: plan.macros.carbs * 4,
    fat: plan.macros.fat * 9,
  };
  const macroTotal = macroKcal.protein + macroKcal.carbs + macroKcal.fat || 1;
  const pct = (kcal: number) => {
    const n = Math.round((kcal / macroTotal) * 100);
    return language === 'fr' ? `${n} %` : `${n}%`;
  };
  const macros = [
    { key: 'protein', label: L({ en: 'Protein', fr: 'Protéines' }), g: plan.macros.protein, kcal: macroKcal.protein, color: t.protein },
    { key: 'carbs', label: L({ en: 'Carbs', fr: 'Glucides' }), g: plan.macros.carbs, kcal: macroKcal.carbs, color: t.carbs },
    { key: 'fat', label: L({ en: 'Fat', fr: 'Lipides' }), g: plan.macros.fat, kcal: macroKcal.fat, color: t.fat },
  ];

  const parts = [
    {
      key: 'resting',
      label: L({ en: 'Resting metabolism', fr: 'Métabolisme de base' }),
      short: L({ en: 'Resting', fr: 'Repos' }),
      value: plan.bmr,
      why: L({
        en: 'What your body burns doing nothing at all — breathing, heart, brain, keeping warm. From your sex, age, height and weight.',
        fr: 'Ce que ton corps brûle sans rien faire — respirer, cœur, cerveau, chaleur. Calculé avec ton sexe, âge, taille et poids.',
      }),
    },
    {
      key: 'movement',
      label: L({ en: 'Daily movement', fr: 'Mouvement quotidien' }),
      short: L({ en: 'Movement', fr: 'Mouvement' }),
      value: plan.neat,
      why: L(
        {
          en: 'Walking ~{{steps}} steps and your daytime activity. The part you can change most easily.',
          fr: 'Marcher ~{{steps}} pas et ton activité de la journée. La partie la plus facile à augmenter.',
        },
        { steps: fmt(measuredSteps ?? profile.dailySteps) },
      ),
    },
    {
      key: 'workouts',
      label: L({ en: 'Workouts, per day', fr: 'Séances, par jour' }),
      short: L({ en: 'Workouts', fr: 'Séances' }),
      value: plan.exercise,
      why: L(
        {
          en: '{{d}} sessions of {{m}} min a week, spread over 7 days. Lifting burns less than people think — its real job is keeping and building muscle.',
          fr: '{{d}} séances de {{m}} min par semaine, réparties sur 7 jours. La musculation brûle moins qu’on ne croit — son vrai rôle est de garder et construire du muscle.',
        },
        { d: profile.trainingDays, m: profile.sessionMinutes },
      ),
    },
    {
      key: 'digestion',
      label: L({ en: 'Digesting food', fr: 'Digestion' }),
      short: L({ en: 'Digestion', fr: 'Digestion' }),
      value: plan.tef,
      why: L({
        en: 'About 10% of what you eat is burned just digesting it. Protein costs the most.',
        fr: 'Environ 10 % de ce que tu manges est brûlé rien qu’en le digérant. Les protéines coûtent le plus.',
      }),
    },
  ];
  // Measured from logged data: the formula parts no longer add up to it.
  const measured = plan.tdeeSource === 'adaptive' && !!adaptive;

  // The bars: burn (TDEE) against eat (target). The difference uses the two
  // numbers it shows, so the arithmetic on screen always adds up.
  const diff = plan.tdee - plan.targetCalories; // > 0 deficit, < 0 surplus
  const diffVars = {
    burn: fmt(plan.tdee),
    eat: fmt(plan.targetCalories),
    d: fmt(Math.abs(diff)),
    kg: fmt(Math.abs(plan.weeklyChangeKg), 2),
  };
  const vesselNote: PlanBarsNote =
    diff > 0
      ? {
          amount: `${diffVars.d} kcal`,
          text: L({ en: 'less than you burn', fr: 'de moins que ta dépense' }),
          rate: `≈ ${diffVars.kg} kg`,
          rateText: L({ en: 'less per week', fr: 'de moins par semaine' }),
        }
      : diff < 0
        ? {
            amount: `${diffVars.d} kcal`,
            text: L({ en: 'more than you burn', fr: 'de plus que ta dépense' }),
            rate: `≈ ${diffVars.kg} kg`,
            rateText: L({ en: 'more per week', fr: 'de plus par semaine' }),
          }
        : {
            text: L({ en: 'The same as you burn', fr: 'Autant que ta dépense' }),
            rateText: L({ en: 'Your weight should hold steady', fr: 'Ton poids devrait rester stable' }),
          };
  const vesselA11y =
    diff > 0
      ? L(
          {
            en: 'You burn about {{burn}} kcal a day. Eat {{eat}} kcal a day: {{d}} kcal less, about {{kg}} kg less per week.',
            fr: 'Tu dépenses environ {{burn}} kcal par jour. Mange {{eat}} kcal par jour : {{d}} kcal de moins, environ {{kg}} kg de moins par semaine.',
          },
          diffVars,
        )
      : diff < 0
        ? L(
            {
              en: 'You burn about {{burn}} kcal a day. Eat {{eat}} kcal a day: {{d}} kcal more, about {{kg}} kg more per week.',
              fr: 'Tu dépenses environ {{burn}} kcal par jour. Mange {{eat}} kcal par jour : {{d}} kcal de plus, environ {{kg}} kg de plus par semaine.',
            },
            diffVars,
          )
        : L(
            {
              en: 'You burn about {{burn}} kcal a day. Eat the same, {{eat}} kcal a day, and your weight should hold steady.',
              fr: 'Tu dépenses environ {{burn}} kcal par jour. Mange autant, {{eat}} kcal par jour, et ton poids devrait rester stable.',
            },
            diffVars,
          );

  return (
    <Screen
      title={fresh ? L({ en: 'Your plan, {{name}}', fr: 'Ton plan, {{name}}' }, { name: profile.name }) : L({ en: 'Your plan', fr: 'Ton plan' })}
      subtitle={L({ en: 'Every number comes from your answers. Open any “why” to see how.', fr: 'Chaque chiffre vient de tes réponses. Ouvre un « pourquoi » pour voir comment.' })}
      back={!fresh}
      footer={fresh ? <Button label={L({ en: 'Let’s start', fr: 'C’est parti' })} onPress={() => router.replace('/(tabs)')} fill size="lg" haptic="medium" /> : undefined}
    >
      {/* Plan reveal: what you burn, what you eat, and how that splits into macros */}
      <View style={[styles.hero, { borderBottomColor: t.hairline }]}>
        <PlanBars
          burn={plan.tdee}
          eat={plan.targetCalories}
          strata={measured ? undefined : parts.map((p) => ({ key: p.key, label: p.short, kcal: p.value }))}
          burnLabel={L({ en: 'kcal/day burned', fr: 'kcal/jour dépensées' })}
          eatLabel={L({ en: 'kcal/day to eat', fr: 'kcal/jour à manger' })}
          note={vesselNote}
          accessibilityLabel={vesselA11y}
        />

        <View style={styles.split}>
          {macros
            .filter((m) => m.kcal > 0)
            .map((m) => (
              <View key={m.key} style={{ flex: m.kcal, backgroundColor: m.color }} />
            ))}
        </View>
        <View style={styles.macroRows}>
          {macros.map((m) => (
            <View key={m.key} style={styles.macroRow}>
              <View style={[styles.swatch, { backgroundColor: m.color }]} />
              <Txt variant="body" style={{ flex: 1 }}>
                {m.label}
              </Txt>
              <Txt variant="numMedium">
                {fmt(m.g)}
                <Txt variant="numSmall" tone="secondary">
                  {' g'}
                </Txt>
              </Txt>
              <Txt variant="numSmall" tone="tertiary" align="right" style={styles.pct}>
                {pct(m.kcal)}
              </Txt>
            </View>
          ))}
        </View>
        <Why title={L({ en: 'Why these macros?', fr: 'Pourquoi ces macros ?' })} style={{ marginTop: space.lg }}>
          <Txt variant="body" tone="secondary">
            {L(
              {
                en: 'Protein first ({{p}} g ≈ {{pk}} g per kg): it protects your muscle while your body changes and keeps you full. At least {{f}} g of fat for hormones and vitamins. Carbs fill the rest — they fuel your training. Also aim for ~{{fiber}} g of fiber and {{water}} L of water a day.',
                fr: 'Les protéines d’abord ({{p}} g ≈ {{pk}} g par kg) : elles protègent tes muscles pendant la transformation et rassasient. Au moins {{f}} g de lipides pour les hormones et les vitamines. Les glucides complètent — c’est le carburant de tes séances. Vise aussi ~{{fiber}} g de fibres et {{water}} L d’eau par jour.',
              },
              {
                p: plan.macros.protein,
                pk: fmt(plan.macros.protein / profile.weightKg, 1),
                f: plan.macros.fat,
                fiber: plan.macros.fiber,
                water: fmt(plan.waterMl / 1000, 1),
              },
            )}
          </Txt>
        </Why>
      </View>

      {/* What you burn */}
      <Section title={L({ en: 'What you burn each day', fr: 'Ce que tu dépenses chaque jour' })}>
        {measured && adaptive ? (
          <Txt variant="body" tone="secondary">
            {L(
              {
                en: 'Measured from your own data: over {{days}} logged days you ate {{intake}} kcal on average while your weight trend moved {{change}} kg a week. So you really burn about {{tdee}} kcal a day — better than any formula.',
                fr: 'Mesuré avec tes propres données : sur {{days}} jours notés tu as mangé {{intake}} kcal en moyenne pendant que ta tendance bougeait de {{change}} kg par semaine. Tu dépenses donc réellement environ {{tdee}} kcal par jour — mieux que n’importe quelle formule.',
              },
              { days: adaptive.loggedDays, intake: fmt(adaptive.avgIntake), change: fmt(adaptive.weeklyChangeKg, 2), tdee: fmt(plan.tdee) },
            )}
          </Txt>
        ) : (
          <>
            <View style={{ gap: space.lg }}>
              {parts.map((p) => (
                <View key={p.key}>
                  <View style={styles.partHead}>
                    <Txt variant="bodyStrong" style={{ flex: 1 }}>
                      {p.label}
                    </Txt>
                    <Txt variant="numMedium">{fmt(p.value)}</Txt>
                  </View>
                  <Txt variant="caption" tone="secondary">
                    {p.why}
                  </Txt>
                </View>
              ))}
            </View>
            <View style={[styles.total, { borderTopColor: t.hairline }]}>
              <Txt variant="bodyStrong" style={{ flex: 1 }}>
                {L({ en: 'Total burned', fr: 'Dépense totale' })}
              </Txt>
              <Txt variant="numLarge">{fmt(plan.tdee)}</Txt>
            </View>
            <Txt variant="caption" tone="tertiary" style={{ marginTop: space.sm }}>
              {L({
                en: 'Formulas can be off by 10–15% for any one person. After 2–3 weeks of logging food and weighing yourself, NutriLens recalculates this from your real results.',
                fr: 'Les formules peuvent se tromper de 10 à 15 % selon les personnes. Après 2–3 semaines à noter tes repas et te peser, NutriLens recalcule tout avec tes vrais résultats.',
              })}
            </Txt>
          </>
        )}
      </Section>

      {/* Timeline */}
      {profile.targetWeightKg && projection.length > 1 ? (
        <Section title={L({ en: 'Your timeline', fr: 'Ta trajectoire' })}>
          <Txt variant="body" tone="secondary" style={{ marginBottom: space.lg }}>
            {plan.weeksToGoal !== undefined && goalDate
              ? L(
                  { en: 'At this pace you reach {{target}} kg in about {{weeks}} weeks — around {{date}}.', fr: 'À ce rythme tu atteins {{target}} kg en environ {{weeks}} semaines — vers {{date}}.' },
                  { target: fmt(profile.targetWeightKg, 1), weeks: plan.weeksToGoal, date: goalDate },
                )
              : L({
                  en: 'Your target is more than three years away at this pace. Pick a first milestone closer to your current weight.',
                  fr: 'Ton objectif est à plus de trois ans à ce rythme. Fixe-toi un premier palier plus proche de ton poids actuel.',
                })}
          </Txt>
          <LineChart
            series={[{ points: projection.map((p) => ({ x: p.week, y: p.kg })), color: t.accent }]}
            reference={{ y: profile.targetWeightKg, label: `${fmt(profile.targetWeightKg, 1)} kg`, color: t.textSecondary }}
            xLabel={(x) => (language === 'fr' ? `S${x}` : `W${x}`)}
            yLabel={(y) => y.toFixed(0)}
          />
          <Why title={L({ en: 'Why the curve flattens', fr: 'Pourquoi la courbe s’aplatit' })} style={{ marginTop: space.md }}>
            <Txt variant="body" tone="secondary">
              {L({
                en: 'A lighter body burns less, so the same plan gives slightly slower progress over time. Real life is bumpier: water can hide fat loss for 1–2 weeks. Judge progress on the weekly trend, not on single days.',
                fr: 'Un corps plus léger dépense moins, donc le même plan donne des progrès un peu plus lents avec le temps. La réalité est plus irrégulière : l’eau peut masquer la perte de gras 1 à 2 semaines. Juge sur la tendance de la semaine, pas sur un jour.',
              })}
            </Txt>
          </Why>
        </Section>
      ) : null}

      {plan.warnings.length ? (
        <View style={{ gap: space.sm, marginTop: space.xl }}>
          {plan.warnings.map((w) => (
            <Why key={w} title={L({ en: 'Adjusted for your safety', fr: 'Ajusté pour ta sécurité' })} tone="warning" initiallyOpen>
              <Txt variant="body" tone="secondary">
                {L(WARNINGS[w])}
              </Txt>
            </Why>
          ))}
        </View>
      ) : null}

      {/* Levers */}
      <Section title={L({ en: 'What you can do to get there', fr: 'Ce que tu peux faire pour y arriver' })}>
        <View style={{ gap: space.xl }}>
          {[
            {
              Icon: Utensils,
              title: L({ en: 'Eat to your target', fr: 'Manger selon ta cible' }),
              body: L(
                {
                  en: 'Log what you eat, even roughly. Every 200 kcal a day is about {{kg}} kg a month. Weigh oil, bread and rice for the first two weeks — that is where most hidden calories are.',
                  fr: 'Note ce que tu manges, même approximativement. Chaque 200 kcal par jour ≈ {{kg}} kg par mois. Pèse l’huile, le pain et le riz les deux premières semaines — c’est là que se cachent la plupart des calories.',
                },
                { kg: kgPerMonth(200) },
              ),
            },
            {
              Icon: Footprints,
              title: L({ en: 'Walk {{s}} steps a day', fr: 'Marcher {{s}} pas par jour' }, { s: fmt(plan.stepsTarget) }),
              body: L(
                {
                  en: '2,000 extra steps (~20 minutes) burn about {{kcal}} kcal for you — {{kg}} kg a month without eating less.',
                  fr: '2 000 pas de plus (~20 minutes) te font brûler environ {{kcal}} kcal — {{kg}} kg par mois sans manger moins.',
                },
                { kcal: stepsKcal, kg: kgPerMonth(stepsKcal) },
              ),
            },
            {
              Icon: Dumbbell,
              title: L({ en: 'Train {{n}}× a week', fr: 'T’entraîner {{n}}× par semaine' }, { n: profile.trainingDays }),
              body: L({
                en: 'Strength training tells your body to keep or build muscle. Without it, up to a third of the weight you lose can be muscle.',
                fr: 'La musculation dit à ton corps de garder ou construire du muscle. Sans elle, jusqu’à un tiers du poids perdu peut être du muscle.',
              }),
            },
            {
              Icon: Moon,
              title: L({ en: 'Sleep 7–9 hours', fr: 'Dormir 7 à 9 heures' }),
              body: L({
                en: 'Short sleep raises hunger and cravings and makes workouts harder. The most underrated part of any plan.',
                fr: 'Le manque de sommeil augmente la faim et les fringales et rend les séances plus dures. La partie la plus sous-estimée de tout plan.',
              }),
            },
          ].map(({ Icon, title, body }) => (
            <View key={title} style={styles.lever}>
              <Icon size={22} color={t.textSecondary} style={{ marginTop: 2 }} />
              <View style={{ flex: 1 }}>
                <Txt variant="bodyStrong">{title}</Txt>
                <Txt variant="body" tone="secondary" style={{ marginTop: 2 }}>
                  {body}
                </Txt>
              </View>
            </View>
          ))}
        </View>
      </Section>

      {workoutPlan ? (
        <Section title={L({ en: 'Your training program', fr: 'Ton programme d’entraînement' })}>
          <Group>
            <ListItem
              title={L(workoutPlan.splitName)}
              supporting={workoutPlan.days.map((d) => L(d.name)).join(' · ')}
              leading={(c) => <Dumbbell size={22} color={c} />}
              onPress={() => router.push('/(tabs)/train')}
              chevron
            />
          </Group>
          <Txt variant="caption" tone="secondary" style={{ marginTop: space.md }}>
            {L(workoutPlan.splitWhy)}
          </Txt>
        </Section>
      ) : null}

      <Txt variant="caption" tone="tertiary" style={{ marginTop: space.xxl }}>
        {L({
          en: 'NutriLens gives general fitness guidance, not medical advice. If you have a medical condition, are pregnant, or have a history of eating disorders, talk to a doctor before changing how you eat.',
          fr: 'NutriLens donne des conseils généraux de remise en forme, pas des avis médicaux. Si tu as une maladie, es enceinte ou as des antécédents de troubles alimentaires, parle à un médecin avant de changer ton alimentation.',
        })}
      </Txt>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: { paddingTop: space.sm, paddingBottom: space.xl, borderBottomWidth: StyleSheet.hairlineWidth },
  split: { flexDirection: 'row', gap: 2, height: 10, borderRadius: radius.pill, overflow: 'hidden', marginTop: space.xl },
  macroRows: { marginTop: space.md, gap: space.sm },
  macroRow: { flexDirection: 'row', alignItems: 'center', gap: space.md, minHeight: 28 },
  swatch: { width: 10, height: 10, borderRadius: 3 },
  pct: { minWidth: 44 },
  partHead: { flexDirection: 'row', alignItems: 'baseline' },
  total: { flexDirection: 'row', alignItems: 'baseline', marginTop: space.lg, paddingTop: space.md, borderTopWidth: StyleSheet.hairlineWidth },
  lever: { flexDirection: 'row', gap: space.lg },
});
