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
import type { LocalizedText } from '@/lib/i18n';

const WARNINGS: Record<PlanWarning, LocalizedText> = {
  floor_applied: {
    en: 'Your calculated target was below the safe minimum, so it was raised. Going lower without medical supervision risks muscle loss, nutrient deficiencies and burnout. To lose faster, move more instead of eating less.',
    fr: 'Ta cible calculée était sous le minimum de sécurité, elle a donc été relevée. Descendre plus bas sans suivi médical expose à la perte musculaire, aux carences et à l’épuisement. Pour aller plus vite, bouge plus plutôt que de manger moins.',
    tn: 'الهدف اللي تحسب كان تحت الحدّ الأدنى الآمن، على هذاكا طلّعناه. كان تهبط أكثر بلاش متابعة طبيب، تخاطر تخسر عضلات، يجيك نقص في الفيتامينات وتتعب برشا. باش تنقص أسرع، تحرّك أكثر عوض ما تاكل أقل.',
    tnLatn: "L'objectif eli tt7seb ken ta7t el minimum el sécurisé, 3la hedheka tala3neh. Ken tahbet akther blech suivi médical, t5ater t5ser muscle, yjik manque fel vitamines w tet3eb barcha. Bech tan9os asra3, t7arrek akther 3oudh ma tekel a9al.",
  },
  deficit_capped: {
    en: 'The pace you chose would need a deficit too big for your body. It was capped so you keep your muscle and your energy.',
    fr: 'Le rythme choisi demanderait un déficit trop grand pour ton corps. Il a été plafonné pour préserver tes muscles et ton énergie.',
    tn: 'الريتم اللي اخترتو يحتاج ديفيسيت كبير برشا على بدنك. حدّدناه باش تحافظ على عضلاتك وعلى الطاقة متاعك.',
    tnLatn: 'El rythme eli 5tartou yest7a9 déficit kbir barcha 3la badnek. 7addednah bech t7afedh 3la muscles mte3ek w 3al énergie mte3ek.',
  },
  target_unrealistic: {
    en: 'Your target weight is under a BMI of 18.5 for your height, which counts as underweight. Consider a higher target — you can adjust it any time.',
    fr: 'Ton poids visé correspond à un IMC inférieur à 18,5 pour ta taille, considéré comme une insuffisance pondérale. Envisage un objectif plus haut — modifiable à tout moment.',
    tn: 'الوزن اللي تحب توصلو تحت IMC 18,5 بالنسبة لطولك، يعني وزن ناقص. فكّر في هدف أعلى — تنجّم تبدّلو وقتلي تحب.',
    tnLatn: 'El poids eli t7eb touslou ta7t IMC 18,5 l 9ad toulek, ya3ni poids na9es. Fakker f objectif a3la — tnajjem tbaddlou wa9telli t7eb.',
  },
  low_bmi: {
    en: 'You are already lean for your height. Building muscle (recomposition) will change how you look more than losing weight.',
    fr: 'Tu es déjà mince pour ta taille. Prendre du muscle (recomposition) changera plus ton apparence que perdre du poids.',
    tn: 'إنت أصلا ضعيف بالنسبة لطولك. كي تبني العضلات (ريكومبوزيسيون) الشكل متاعك باش يتبدّل أكثر من كي تنقص في الوزن.',
    tnLatn: 'Enti déjà dh3if l 9ad toulek. Ki tabni muscle (recomposition) chaklek bech yetbaddel akther men ki tan9os fel poids.',
  },
  one_meal: {
    en: 'One meal a day works if the totals add up, but your protein target is a lot for one sitting. Start the meal with the protein (meat, fish, eggs, legumes, dairy), use the rest of your eating hour for a yogurt or a second protein dish, and train in the hours before you eat so the meal doubles as recovery.',
    fr: 'Un repas par jour marche si les totaux y sont, mais ta cible de protéines est beaucoup pour un seul repas. Commence par les protéines (viande, poisson, œufs, légumineuses, laitages), garde le reste de ton heure pour un yaourt ou un deuxième plat protéiné, et entraîne-toi dans les heures avant de manger pour que le repas serve aussi de récupération.',
    tn: 'ماكلة وحدة في النهار تمشي كان المجموع يوصل، أما البروتين اللي لازمك برشا لقعدة وحدة. ابدا الماكلة بالبروتين (لحم، حوت، عظم، قطانية، منتوجات الحليب)، والوقت اللي يبقى من ساعة الماكلة استعملو لياغورت ولا صحن بروتين ثاني، وتمرّن في السوايع اللي قبل ما تاكل باش الماكلة تنفعك زادة للريكيبيراسيون.',
    tnLatn: 'Makla wa7da fel nhar temchi ken el total youssel, ama el protéines eli lazmek barcha l 9a3da wa7da. Ebda el makla bel protéines (l7am, 7out, 3dham, 9tania, produits laitiers), w el wa9t eli yab9a men se3et el makla esta3mlou l yaourt walla sa7n protéines thèni, w tmarren fel swaye3 eli 9bal ma tekel bech el makla tenf3ek zeda lel récupération.',
  },
  high_bmi_protein: {
    en: 'Protein is based on a goal weight rather than your current weight: the extra weight is mostly fat, which needs no protein.',
    fr: 'Les protéines sont calculées sur un poids objectif plutôt que ton poids actuel : le surplus est surtout du gras, qui n’a pas besoin de protéines.',
    tn: 'البروتين محسوب على وزن الهدف موش على الوزن متاعك توّا: الوزن الزايد أغلبو شحم، والشحم ما يستحقش بروتين.',
    tnLatn: 'El protéines m7soubin 3la poids objectif mouch 3al poids mte3ek taw: el poids ezzeyed a8lbou gras, w el gras ma yest7a99ech protéines.',
  },
};

export default function PlanScreen() {
  const t = useTokens();
  const router = useRouter();
  const fmt = useFormat();
  const { L, language, formatDate } = useLanguage();
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
      <Screen title={L({ en: 'Your plan', fr: 'Ton plan', tn: 'البرنامج متاعك', tnLatn: 'Programme mte3ek' })} back>
        <Button
          label={L({ en: 'Answer the questions', fr: 'Répondre aux questions', tn: 'جاوب على الأسئلة', tnLatn: 'Jaweb 3al questions' })}
          onPress={() => router.replace('/onboarding')}
        />
      </Screen>
    );
  }

  const goalDate =
    plan.weeksToGoal !== undefined
      ? formatDate(new Date(Date.now() + plan.weeksToGoal * 7 * 86400000), {
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
    return language === 'en' ? `${n}%` : `${n} %`;
  };
  const macros = [
    { key: 'protein', label: L({ en: 'Protein', fr: 'Protéines', tn: 'بروتين', tnLatn: 'Protéines' }), g: plan.macros.protein, kcal: macroKcal.protein, color: t.protein },
    { key: 'carbs', label: L({ en: 'Carbs', fr: 'Glucides', tn: 'نشويات', tnLatn: 'Glucides' }), g: plan.macros.carbs, kcal: macroKcal.carbs, color: t.carbs },
    { key: 'fat', label: L({ en: 'Fat', fr: 'Lipides', tn: 'دهون', tnLatn: 'Lipides' }), g: plan.macros.fat, kcal: macroKcal.fat, color: t.fat },
  ];

  const parts = [
    {
      key: 'resting',
      label: L({ en: 'Resting metabolism', fr: 'Métabolisme de base', tn: 'الميتابوليزم في الراحة', tnLatn: 'Métabolisme de base' }),
      short: L({ en: 'Resting', fr: 'Repos', tn: 'راحة', tnLatn: 'Repos' }),
      value: plan.bmr,
      why: L({
        en: 'What your body burns doing nothing at all — breathing, heart, brain, keeping warm. From your sex, age, height and weight.',
        fr: 'Ce que ton corps brûle sans rien faire — respirer, cœur, cerveau, chaleur. Calculé avec ton sexe, âge, taille et poids.',
        tn: 'اللي يحرقو بدنك وانت ما تعمل حتى شي — التنفّس، القلب، المخ، السخانة. محسوب من الجنس، العمر، الطول والوزن متاعك.',
        tnLatn: 'Eli ya7r9ou badnek w enti ma ta3mel 7atta chay — e tnaffos, el 9alb, el mo5, e s5ana. M7soub mel sexe, el 3omr, e toul wel poids mte3ek.',
      }),
    },
    {
      key: 'movement',
      label: L({ en: 'Daily movement', fr: 'Mouvement quotidien', tn: 'الحركة اليومية', tnLatn: '7arka kol nhar' }),
      short: L({ en: 'Movement', fr: 'Mouvement', tn: 'حركة', tnLatn: '7arka' }),
      value: plan.neat,
      why: L(
        {
          en: 'Walking ~{{steps}} steps and your daytime activity. The part you can change most easily.',
          fr: 'Marcher ~{{steps}} pas et ton activité de la journée. La partie la plus facile à augmenter.',
          tn: 'تمشي ~{{steps}} خطوة والنشاط متاعك في النهار. الجزء اللي تنجّم تبدّلو بالساهل.',
          tnLatn: "Temchi ~{{steps}} pas w l'activité mte3ek fel nhar. El partie eli tnajjem tbaddelha bel sehel.",
        },
        { steps: fmt(measuredSteps ?? profile.dailySteps) },
      ),
    },
    {
      key: 'workouts',
      label: L({ en: 'Workouts, per day', fr: 'Séances, par jour', tn: 'الحصص، في النهار', tnLatn: 'Séances, fel nhar' }),
      short: L({ en: 'Workouts', fr: 'Séances', tn: 'حصص', tnLatn: 'Séances' }),
      value: plan.exercise,
      why: L(
        {
          en: '{{d}} sessions of {{m}} min a week, spread over 7 days. Lifting burns less than people think — its real job is keeping and building muscle.',
          fr: '{{d}} séances de {{m}} min par semaine, réparties sur 7 jours. La musculation brûle moins qu’on ne croit — son vrai rôle est de garder et construire du muscle.',
          tn: '{{d}} حصص متاع {{m}} min في الجمعة، مقسومين على 7 أيّام. الحديد يحرق أقل من اللي يتصوّرو الناس — خدمتو الحقيقية يحافظ على العضلات ويبنيهم.',
          tnLatn: '{{d}} séances mta3 {{m}} min fel jem3a, m9soumin 3la 7 iyem. El muscu ta7ra9 a9al men eli ytsawrou ennes — 5edmetha el 7a9i9iya t7afedh 3al muscle w tabnih.',
        },
        { d: profile.trainingDays, m: profile.sessionMinutes },
      ),
    },
    {
      key: 'digestion',
      label: L({ en: 'Digesting food', fr: 'Digestion', tn: 'هضم الماكلة', tnLatn: 'Hadhm el makla' }),
      short: L({ en: 'Digestion', fr: 'Digestion', tn: 'هضم', tnLatn: 'Digestion' }),
      value: plan.tef,
      why: L({
        en: 'About 10% of what you eat is burned just digesting it. Protein costs the most.',
        fr: 'Environ 10 % de ce que tu manges est brûlé rien qu’en le digérant. Les protéines coûtent le plus.',
        tn: 'تقريب 10% من اللي تاكلو يتحرق كان في الهضم. البروتين هو اللي ياخو أكثر.',
        tnLatn: 'Ta9riban 10% men eli takelou yet7ra9 ken fel hadhm. El protéines houma eli ye5dhou akther.',
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
          text: L({ en: 'less than you burn', fr: 'de moins que ta dépense', tn: 'أقل من اللي تحرقو', tnLatn: 'a9al men eli ta7r9ou' }),
          rate: `≈ ${diffVars.kg} kg`,
          rateText: L({ en: 'less per week', fr: 'de moins par semaine', tn: 'أقل في الجمعة', tnLatn: 'a9al fel jem3a' }),
        }
      : diff < 0
        ? {
            amount: `${diffVars.d} kcal`,
            text: L({ en: 'more than you burn', fr: 'de plus que ta dépense', tn: 'أكثر من اللي تحرقو', tnLatn: 'akther men eli ta7r9ou' }),
            rate: `≈ ${diffVars.kg} kg`,
            rateText: L({ en: 'more per week', fr: 'de plus par semaine', tn: 'أكثر في الجمعة', tnLatn: 'akther fel jem3a' }),
          }
        : {
            text: L({ en: 'The same as you burn', fr: 'Autant que ta dépense', tn: 'قد ما تحرق', tnLatn: '9ad ma ta7ra9' }),
            rateText: L({
              en: 'Your weight should hold steady',
              fr: 'Ton poids devrait rester stable',
              tn: 'المفروض الوزن متاعك يبقى كيف ما هو',
              tnLatn: 'El mafroudh el poids mte3ek yab9a kima houwa',
            }),
          };
  const vesselA11y =
    diff > 0
      ? L(
          {
            en: 'You burn about {{burn}} kcal a day. Eat {{eat}} kcal a day: {{d}} kcal less, about {{kg}} kg less per week.',
            fr: 'Tu dépenses environ {{burn}} kcal par jour. Mange {{eat}} kcal par jour : {{d}} kcal de moins, environ {{kg}} kg de moins par semaine.',
            tn: 'تحرق تقريب {{burn}} kcal في النهار. كول {{eat}} kcal في النهار: {{d}} kcal أقل، تقريب {{kg}} kg أقل في الجمعة.',
            tnLatn: 'Ta7ra9 ta9riban {{burn}} kcal fel nhar. Koul {{eat}} kcal fel nhar: {{d}} kcal a9al, ta9riban {{kg}} kg a9al fel jem3a.',
          },
          diffVars,
        )
      : diff < 0
        ? L(
            {
              en: 'You burn about {{burn}} kcal a day. Eat {{eat}} kcal a day: {{d}} kcal more, about {{kg}} kg more per week.',
              fr: 'Tu dépenses environ {{burn}} kcal par jour. Mange {{eat}} kcal par jour : {{d}} kcal de plus, environ {{kg}} kg de plus par semaine.',
              tn: 'تحرق تقريب {{burn}} kcal في النهار. كول {{eat}} kcal في النهار: {{d}} kcal أكثر، تقريب {{kg}} kg أكثر في الجمعة.',
              tnLatn: 'Ta7ra9 ta9riban {{burn}} kcal fel nhar. Koul {{eat}} kcal fel nhar: {{d}} kcal akther, ta9riban {{kg}} kg akther fel jem3a.',
            },
            diffVars,
          )
        : L(
            {
              en: 'You burn about {{burn}} kcal a day. Eat the same, {{eat}} kcal a day, and your weight should hold steady.',
              fr: 'Tu dépenses environ {{burn}} kcal par jour. Mange autant, {{eat}} kcal par jour, et ton poids devrait rester stable.',
              tn: 'تحرق تقريب {{burn}} kcal في النهار. كول قدّو، {{eat}} kcal في النهار، والمفروض الوزن متاعك يبقى كيف ما هو.',
              tnLatn: 'Ta7ra9 ta9riban {{burn}} kcal fel nhar. Koul 9addou, {{eat}} kcal fel nhar, w el mafroudh el poids mte3ek yab9a kima houwa.',
            },
            diffVars,
          );

  return (
    <Screen
      title={
        fresh
          ? L({ en: 'Your plan, {{name}}', fr: 'Ton plan, {{name}}', tn: 'البرنامج متاعك يا {{name}}', tnLatn: 'Programme mte3ek ya {{name}}' }, { name: profile.name })
          : L({ en: 'Your plan', fr: 'Ton plan', tn: 'البرنامج متاعك', tnLatn: 'Programme mte3ek' })
      }
      subtitle={L({
        en: 'Every number comes from your answers. Open any “why” to see how.',
        fr: 'Chaque chiffre vient de tes réponses. Ouvre un « pourquoi » pour voir comment.',
        tn: 'كل رقم جاي من الأجوبة متاعك. حلّ أي “علاش” باش تشوف كيفاش.',
        tnLatn: 'Kol ra9m jey men ejwbtek. 7el ay “3lech” bech tchouf kifech.',
      })}
      back={!fresh}
      footer={
        fresh ? (
          <Button
            label={L({ en: 'Let’s start', fr: 'C’est parti', tn: 'يلّا نبداو', tnLatn: 'Yalla nebdew' })}
            onPress={() => router.replace('/(tabs)')}
            fill
            size="lg"
            haptic="medium"
          />
        ) : undefined
      }
    >
      {/* Plan reveal: what you burn, what you eat, and how that splits into macros */}
      <View style={[styles.hero, { borderBottomColor: t.hairline }]}>
        <PlanBars
          burn={plan.tdee}
          eat={plan.targetCalories}
          strata={measured ? undefined : parts.map((p) => ({ key: p.key, label: p.short, kcal: p.value }))}
          burnLabel={L({ en: 'kcal/day burned', fr: 'kcal/jour dépensées', tn: 'kcal/نهار تحرقهم', tnLatn: 'kcal/nhar ta7ra9hom' })}
          eatLabel={L({ en: 'kcal/day to eat', fr: 'kcal/jour à manger', tn: 'kcal/نهار تاكلهم', tnLatn: 'kcal/nhar takelhom' })}
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
        <Why title={L({ en: 'Why these macros?', fr: 'Pourquoi ces macros ?', tn: 'علاش الماكرو هاذم؟', tnLatn: '3lech les macros hedhom?' })} style={{ marginTop: space.lg }}>
          <Txt variant="body" tone="secondary">
            {L(
              {
                en: 'Protein first ({{p}} g ≈ {{pk}} g per kg): it protects your muscle while your body changes and keeps you full. At least {{f}} g of fat for hormones and vitamins. Carbs fill the rest — they fuel your training. Also aim for ~{{fiber}} g of fiber and {{water}} L of water a day.',
                fr: 'Les protéines d’abord ({{p}} g ≈ {{pk}} g par kg) : elles protègent tes muscles pendant la transformation et rassasient. Au moins {{f}} g de lipides pour les hormones et les vitamines. Les glucides complètent — c’est le carburant de tes séances. Vise aussi ~{{fiber}} g de fibres et {{water}} L d’eau par jour.',
                tn: 'البروتين قبل كل شي ({{p}} g ≈ {{pk}} g لكل kg): يحمي عضلاتك وبدنك يتبدّل ويشبّعك. على الأقل {{f}} g دهون للهرمونات والفيتامينات. النشويات يكمّلو الباقي — هوما البنزين متاع التمارين متاعك. وحاول زادة توصل لـ ~{{fiber}} g ألياف و {{water}} L ماء في النهار.',
                tnLatn: 'El protéines 9bal kol chay ({{p}} g ≈ {{pk}} g l kol kg): t7mi muscles mte3ek w badnek yetbaddel w tchabba3ek. 3al a9al {{f}} g lipides lel hormones wel vitamines. El glucides ykammlou el be9i — houma el essence mta3 séances mte3ek. W 7awel zeda tousel l ~{{fiber}} g fibres w {{water}} L mé fel nhar.',
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
      <Section title={L({ en: 'What you burn each day', fr: 'Ce que tu dépenses chaque jour', tn: 'شنوّة تحرق كل نهار', tnLatn: 'Chnowa ta7ra9 kol nhar' })}>
        {measured && adaptive ? (
          <Txt variant="body" tone="secondary">
            {L(
              {
                en: 'Measured from your own data: over {{days}} logged days you ate {{intake}} kcal on average while your weight trend moved {{change}} kg a week. So you really burn about {{tdee}} kcal a day — better than any formula.',
                fr: 'Mesuré avec tes propres données : sur {{days}} jours notés tu as mangé {{intake}} kcal en moyenne pendant que ta tendance bougeait de {{change}} kg par semaine. Tu dépenses donc réellement environ {{tdee}} kcal par jour — mieux que n’importe quelle formule.',
                tn: 'محسوب من الداتا متاعك: في {{days}} نهار سجّلتهم كليت في المعدّل {{intake}} kcal والوزن متاعك تحرّك {{change}} kg في الجمعة. يعني بالحق تحرق تقريب {{tdee}} kcal في النهار — خير من أي فورمول.',
                tnLatn: 'M7soub mel données mte3ek: f {{days}} nhar sajjelthom klit en moyenne {{intake}} kcal w tendance el poids mte3ek t7arket {{change}} kg fel jem3a. Ya3ni bel 7a9 ta7ra9 ta9riban {{tdee}} kcal fel nhar — 5ir men ay formule.',
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
                {L({ en: 'Total burned', fr: 'Dépense totale', tn: 'المجموع اللي تحرقو', tnLatn: 'Total eli ta7r9ou' })}
              </Txt>
              <Txt variant="numLarge">{fmt(plan.tdee)}</Txt>
            </View>
            <Txt variant="caption" tone="tertiary" style={{ marginTop: space.sm }}>
              {L({
                en: 'Formulas can be off by 10–15% for any one person. After 2–3 weeks of logging food and weighing yourself, Tounsi Fit recalculates this from your real results.',
                fr: 'Les formules peuvent se tromper de 10 à 15 % selon les personnes. Après 2–3 semaines à noter tes repas et te peser, Tounsi Fit recalcule tout avec tes vrais résultats.',
                tn: 'الفورمولات تنجّم تغلط بـ 10–15% حسب الشخص. بعد 2–3 جماعي وانت تسجّل الماكلة وتوزن روحك، Tounsi Fit يعاود يحسب هذا من النتايج الحقيقية متاعك.',
                tnLatn: 'Les formules tnajjem t8let b 10–15% 7asb el ch5es. Ba3d 2–3 jmé3i w enti tsajjel el makla w touzen rou7ek, Tounsi Fit y3awed ya7seb hedha men les résultats el 7a9i9iya mte3ek.',
              })}
            </Txt>
          </>
        )}
      </Section>

      {/* Timeline */}
      {profile.targetWeightKg && projection.length > 1 ? (
        <Section title={L({ en: 'Your timeline', fr: 'Ta trajectoire', tn: 'المسار متاعك', tnLatn: 'Trajectoire mte3ek' })}>
          <Txt variant="body" tone="secondary" style={{ marginBottom: space.lg }}>
            {plan.weeksToGoal !== undefined && goalDate
              ? L(
                  {
                    en: 'At this pace you reach {{target}} kg in about {{weeks}} weeks — around {{date}}.',
                    fr: 'À ce rythme tu atteins {{target}} kg en environ {{weeks}} semaines — vers {{date}}.',
                    tn: 'بالريتم هذا توصل لـ {{target}} kg في تقريب {{weeks}} جمعة — حوالي {{date}}.',
                    tnLatn: 'B rythme hedha tousel l {{target}} kg fi ta9riban {{weeks}} jem3a — 7awéli {{date}}.',
                  },
                  { target: fmt(profile.targetWeightKg, 1), weeks: plan.weeksToGoal, date: goalDate },
                )
              : L({
                  en: 'Your target is more than three years away at this pace. Pick a first milestone closer to your current weight.',
                  fr: 'Ton objectif est à plus de trois ans à ce rythme. Fixe-toi un premier palier plus proche de ton poids actuel.',
                  tn: 'بالريتم هذا الهدف متاعك بعيد أكثر من ثلاثة سنين. اختار مرحلة أولى أقرب للوزن متاعك توّا.',
                  tnLatn: "B rythme hedha l'objectif mte3ek b3id akther men thletha snin. 5tar étape loula a9rab lel poids mte3ek taw.",
                })}
          </Txt>
          <LineChart
            series={[{ points: projection.map((p) => ({ x: p.week, y: p.kg })), color: t.accent }]}
            reference={{ y: profile.targetWeightKg, label: `${fmt(profile.targetWeightKg, 1)} kg`, color: t.textSecondary }}
            xLabel={(x) => (language === 'en' ? `W${x}` : language === 'fr' ? `S${x}` : `${x}`)}
            yLabel={(y) => y.toFixed(0)}
          />
          <Why
            title={L({ en: 'Why the curve flattens', fr: 'Pourquoi la courbe s’aplatit', tn: 'علاش الكورب تبطى', tnLatn: '3lech el courbe tabta' })}
            style={{ marginTop: space.md }}
          >
            <Txt variant="body" tone="secondary">
              {L({
                en: 'A lighter body burns less, so the same plan gives slightly slower progress over time. Real life is bumpier: water can hide fat loss for 1–2 weeks. Judge progress on the weekly trend, not on single days.',
                fr: 'Un corps plus léger dépense moins, donc le même plan donne des progrès un peu plus lents avec le temps. La réalité est plus irrégulière : l’eau peut masquer la perte de gras 1 à 2 semaines. Juge sur la tendance de la semaine, pas sur un jour.',
                tn: 'البدن الخفيف يحرق أقل، على هذاكا نفس البرنامج يعطي تقدّم أبطأ شويّة مع الوقت. وفي الحقيقة الأمور تطلع وتهبط: الماء ينجّم يخبّي نقصان الشحم 1–2 جمعة. احكم على التقدّم بالترند متاع الجمعة، موش بنهار وحدو.',
                tnLatn: 'El badan el 5fif ya7ra9 a9al, 3la hedheka nafs el programme ya3ti progrès abta chwaya m3a el wa9t. W fel 7a9i9a el omour tetla3 w tahbet: el mé ynajjem y5abbi n9as el gras 1–2 jem3a. A7kom 3al progrès b tendance el jem3a, mouch b nhar wa7dou.',
              })}
            </Txt>
          </Why>
        </Section>
      ) : null}

      {plan.warnings.length ? (
        <View style={{ gap: space.sm, marginTop: space.xl }}>
          {plan.warnings.map((w) => (
            <Why
              key={w}
              title={L({ en: 'Adjusted for your safety', fr: 'Ajusté pour ta sécurité', tn: 'تبدّل على خاطر صحّتك', tnLatn: 'Tbaddel 3la 5ater sa77tek' })}
              tone="warning"
              initiallyOpen
            >
              <Txt variant="body" tone="secondary">
                {L(WARNINGS[w])}
              </Txt>
            </Why>
          ))}
        </View>
      ) : null}

      {/* Levers */}
      <Section title={L({
        en: 'What you can do to get there',
        fr: 'Ce que tu peux faire pour y arriver',
        tn: 'شنوّة تنجّم تعمل باش توصل',
        tnLatn: 'Chnowa tnajjem ta3mel bech tousel',
      })}>
        <View style={{ gap: space.xl }}>
          {[
            {
              Icon: Utensils,
              title: L({ en: 'Eat to your target', fr: 'Manger selon ta cible', tn: 'كول على قد الهدف متاعك', tnLatn: "Koul 3la 9ad l'objectif mte3ek" }),
              body: L(
                {
                  en: 'Log what you eat, even roughly. Every 200 kcal a day is about {{kg}} kg a month. Weigh oil, bread and rice for the first two weeks — that is where most hidden calories are.',
                  fr: 'Note ce que tu manges, même approximativement. Chaque 200 kcal par jour ≈ {{kg}} kg par mois. Pèse l’huile, le pain et le riz les deux premières semaines — c’est là que se cachent la plupart des calories.',
                  tn: 'سجّل اللي تاكلو، حتى بالتقريب. كل 200 kcal في النهار تساوي تقريب {{kg}} kg في الشهر. اوزن الزيت، الخبز والروز في أوّل جمعتين — غادي وين تتخبّى أغلب الكالوري.',
                  tnLatn: 'Sajjel eli takelou, 7atta bel ta9rib. Kol 200 kcal fel nhar tsawi ta9riban {{kg}} kg fel chhar. Ouzen e zit, el khobz wel rouz fi awwel jem3tin — 8adi win tet5abba a8leb les calories.',
                },
                { kg: kgPerMonth(200) },
              ),
            },
            {
              Icon: Footprints,
              title: L({
                en: 'Walk {{s}} steps a day',
                fr: 'Marcher {{s}} pas par jour',
                tn: 'امشي {{s}} خطوة في النهار',
                tnLatn: 'Emchi {{s}} pas fel nhar',
              }, { s: fmt(plan.stepsTarget) }),
              body: L(
                {
                  en: '2,000 extra steps (~20 minutes) burn about {{kcal}} kcal for you — {{kg}} kg a month without eating less.',
                  fr: '2 000 pas de plus (~20 minutes) te font brûler environ {{kcal}} kcal — {{kg}} kg par mois sans manger moins.',
                  tn: '2000 خطوة زايدة (~20 min) تحرقلك تقريب {{kcal}} kcal — {{kg}} kg في الشهر بلاش ما تنقّص من الماكلة.',
                  tnLatn: '2000 pas zeydin (~20 min) ya7r9oulek ta9riban {{kcal}} kcal — {{kg}} kg fel chhar blech ma tna99es mel makla.',
                },
                { kcal: stepsKcal, kg: kgPerMonth(stepsKcal) },
              ),
            },
            {
              Icon: Dumbbell,
              title: L({
                en: 'Train {{n}}× a week',
                fr: 'T’entraîner {{n}}× par semaine',
                tn: 'تمرّن {{n}}× في الجمعة',
                tnLatn: 'Tmarren {{n}}× fel jem3a',
              }, { n: profile.trainingDays }),
              body: L({
                en: 'Strength training tells your body to keep or build muscle. Without it, up to a third of the weight you lose can be muscle.',
                fr: 'La musculation dit à ton corps de garder ou construire du muscle. Sans elle, jusqu’à un tiers du poids perdu peut être du muscle.',
                tn: 'تمارين القوّة تقول لبدنك يحافظ على العضلات ولا يبني. بلاشها، حتى الثلث من الوزن اللي تنقصو ينجّم يكون عضلات.',
                tnLatn: 'El muscu t9oul l badnek y7afedh 3al muscle walla yabni. Blech biha, 7atta theleth el poids eli tan9sou ynajjem ykoun muscle.',
              }),
            },
            {
              Icon: Moon,
              title: L({ en: 'Sleep 7–9 hours', fr: 'Dormir 7 à 9 heures', tn: 'ارقد 7–9 سوايع', tnLatn: 'Or9od 7–9 swaye3' }),
              body: L({
                en: 'Short sleep raises hunger and cravings and makes workouts harder. The most underrated part of any plan.',
                fr: 'Le manque de sommeil augmente la faim et les fringales et rend les séances plus dures. La partie la plus sous-estimée de tout plan.',
                tn: 'قلّة النوم تزيد في الجوع والشهوة وتصعّب الحصص. أكثر حاجة مظلومة في أي برنامج.',
                tnLatn: '9illet e noum tzid fel jou3 wel chahwa w tsa33eb les séances. Akther 7aja madhlouma fi ay programme.',
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
        <Section title={L({ en: 'Your training program', fr: 'Ton programme d’entraînement', tn: 'برنامج التمرين متاعك', tnLatn: 'Programme sport mte3ek' })}>
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
          en: 'Tounsi Fit gives general fitness guidance, not medical advice. If you have a medical condition, are pregnant, or have a history of eating disorders, talk to a doctor before changing how you eat.',
          fr: 'Tounsi Fit donne des conseils généraux de remise en forme, pas des avis médicaux. Si tu as une maladie, es enceinte ou as des antécédents de troubles alimentaires, parle à un médecin avant de changer ton alimentation.',
          tn: 'Tounsi Fit يعطيك نصايح عامة في الرياضة، موش نصايح طبية. كان عندك مرض، ولا حامل، ولا عندك تاريخ مع اضطرابات الماكلة، احكي مع طبيب قبل ما تبدّل الماكلة متاعك.',
          tnLatn: 'Tounsi Fit ya3tik nsaye7 3amma fel sport, mouch nsaye7 médicales. Ken 3andek mardh, walla 7amel, walla 3andek historique m3a troubles alimentaires, a7ki m3a tbib 9bal ma tbaddel makeltek.',
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
