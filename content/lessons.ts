/**
 * NutriLens: in-app education content (lessons + glossary), English and French.
 *
 * Written for complete beginners. Mainstream, evidence-based sports-nutrition
 * consensus only (ISSN position stands, Mifflin-St Jeor, 1.6-2.2 g/kg protein,
 * 0.5-1 % bodyweight per week, progressive overload, RIR...).
 *
 * Body format (markdown-lite): paragraphs separated by a blank line ("\n\n"),
 * bullet lines start with "- ", **bold** allowed. Nothing else.
 *
 * Personalization tokens, replaced by the app with the user's own numbers:
 * {{bmr}} {{tdee}} {{targetCalories}} {{deficit}} {{weeklyChangeKg}} {{proteinG}}
 * {{fatG}} {{carbsG}} {{weightKg}} {{stepsTarget}} {{waterL}} {{weeksToGoal}}
 *
 * French strings are written with plain spaces. `frTypo` (bottom of the file)
 * turns the spaces French typography requires (before : ; ? ! and », after «,
 * inside thousands like "7 700", between a number and its unit) into
 * non-breaking spaces so they never wrap badly on small screens.
 */

export type LocalizedText = { en: string; fr: string };

export type LessonCategory = 'basics' | 'nutrition' | 'training' | 'body' | 'habits';

export interface LessonSection {
  heading: LocalizedText;
  // Markdown-lite body: paragraphs separated by a blank line ("\n\n"),
  // bullet lines start with "- ", **bold** allowed. Nothing else (no headings, links, tables, images).
  body: LocalizedText;
}

export interface Lesson {
  id: string; // kebab-case, stable
  category: LessonCategory;
  icon: string; // lucide-react-native icon component name
  minutes: number; // reading time estimate
  title: LocalizedText;
  summary: LocalizedText; // one sentence, shown on the card
  sections: LessonSection[]; // 3-6 sections
  keyTakeaways: { en: string[]; fr: string[] }; // 3-5 bullets, same count in both languages
  related?: string[]; // ids of other lessons
}

export interface GlossaryEntry {
  id: string;
  term: LocalizedText;
  definition: LocalizedText;
  lessonId?: string;
}

/** Joins blocks (paragraphs or bullet lists) with a blank line. */
const md = (...blocks: string[]): string => blocks.join('\n\n');

/** Builds one bullet-list block ("- item" lines). */
const ul = (...items: string[]): string => items.map((item) => '- ' + item).join('\n');

const rawLessons: Lesson[] = [
  // ---------------------------------------------------------------------------
  // 1. Calories 101
  // ---------------------------------------------------------------------------
  {
    id: 'calories-101',
    category: 'basics',
    icon: 'Flame',
    minutes: 4,
    title: {
      en: 'Calories 101: the master rule',
      fr: 'Les calories : la règle de base',
    },
    summary: {
      en: 'What a calorie actually is, and why energy in versus energy out decides whether your weight goes up or down.',
      fr: "Ce qu'est vraiment une calorie, et pourquoi l'équilibre entre ce que tu manges et ce que tu dépenses décide de l'évolution de ton poids.",
    },
    sections: [
      {
        heading: { en: 'What is a calorie?', fr: "C'est quoi, une calorie ?" },
        body: {
          en: md(
            'A calorie is simply a unit of energy, the way a kilometer is a unit of distance. The “calories” on food labels are really kilocalories (kcal): the energy needed to warm 1 liter of water by 1 °C.',
            'Each macronutrient carries a fixed amount of energy per gram:',
            ul(
              '**Protein:** 4 kcal per gram',
              '**Carbohydrates:** 4 kcal per gram',
              '**Fat:** 9 kcal per gram',
              '**Alcohol:** 7 kcal per gram',
            ),
            "That's why one tablespoon of olive oil (almost pure fat, about 120 kcal) holds as much energy as two oranges.",
          ),
          fr: md(
            "Une calorie, c'est simplement une unité d'énergie, comme le kilomètre est une unité de distance. Les « calories » indiquées sur les étiquettes sont en réalité des kilocalories (kcal) : l'énergie nécessaire pour réchauffer 1 litre d'eau de 1 °C.",
            "Chaque macronutriment apporte une quantité fixe d'énergie par gramme :",
            ul(
              '**Protéines :** 4 kcal par gramme',
              '**Glucides :** 4 kcal par gramme',
              '**Lipides (graisses) :** 9 kcal par gramme',
              '**Alcool :** 7 kcal par gramme',
            ),
            "C'est pour ça qu'une cuillère à soupe d'huile d'olive (presque 100 % de gras, environ 120 kcal) apporte autant d'énergie que deux oranges.",
          ),
        },
      },
      {
        heading: { en: 'Energy in vs energy out', fr: 'Énergie qui entre, énergie qui sort' },
        body: {
          en: md(
            'Your body spends energy all day long: to keep your heart beating, to breathe, to walk, to train, even to digest. Over weeks, one of three things happens:',
            ul(
              '**You eat more than you burn:** the extra is stored, mostly as fat, and your weight goes up.',
              '**You eat less than you burn:** your body covers the gap from its reserves, and your weight goes down.',
              '**You eat about what you burn:** your weight stays roughly stable. This is called **maintenance**.',
            ),
            "This is the master rule of body weight. No food, meal timing or supplement escapes it. When low-carb diets, intermittent fasting or “clean eating” work for weight loss, it's because they help you eat less overall.",
          ),
          fr: md(
            "Ton corps dépense de l'énergie toute la journée : pour faire battre ton cœur, respirer, marcher, t'entraîner et même digérer. Sur plusieurs semaines, trois situations sont possibles :",
            ul(
              '**Tu manges plus que tu ne dépenses :** le surplus est stocké, surtout sous forme de graisse, et ton poids monte.',
              "**Tu manges moins que tu ne dépenses :** ton corps puise dans ses réserves pour combler l'écart, et ton poids baisse.",
              "**Tu manges à peu près autant que tu dépenses :** ton poids reste stable. C'est ce qu'on appelle la **maintenance**.",
            ),
            "C'est la règle d'or du poids. Aucun aliment, aucun horaire de repas, aucun complément n'y échappe. Quand le low-carb, le jeûne intermittent ou le « manger propre » font maigrir, c'est parce qu'ils t'aident à manger moins au total.",
          ),
        },
      },
      {
        heading: { en: "Why it doesn't feel that simple", fr: 'Pourquoi ça paraît plus compliqué' },
        body: {
          en: md(
            "The rule is simple; living it is harder. Hunger, sleep, stress and how much you move all push on both sides of the balance. And from one day to the next, the scale mixes fat with water and food still in your gut (see “Why the scale lies”). That's why the rule shows up over weeks, not over a single day.",
          ),
          fr: md(
            "La règle est simple, l'appliquer l'est moins. La faim, le sommeil, le stress et ton niveau d'activité jouent des deux côtés de la balance. Et d'un jour à l'autre, la balance mélange le gras avec l'eau et les aliments encore dans ton ventre (voir la leçon « Pourquoi la balance ment »). C'est pour ça que la règle se vérifie sur des semaines, pas sur une seule journée.",
          ),
        },
      },
      {
        heading: { en: 'Food quality still matters', fr: 'La qualité des aliments compte quand même' },
        body: {
          en: md(
            'Calories decide your weight. The kind of food you eat decides how easy it is to stay on target, and how healthy and energetic you feel along the way.',
            "For example, 500 kcal of grilled chicken, rice and salad keeps you full for hours. 500 kcal of pastries is gone in five minutes, and you're hungry again soon after. Same energy, very different experience.",
            'Build most of your meals from protein, vegetables, fruit, legumes and whole grains, and keep room for the foods you love. No food is forbidden; each one just has a calorie cost.',
          ),
          fr: md(
            "Les calories décident de ton poids. Le type d'aliments que tu choisis décide à quel point c'est facile de tenir ton objectif, et influence ton énergie, ta satiété et ta santé en chemin.",
            'Par exemple, 500 kcal de poulet grillé, de riz et de salade te calent pendant des heures. 500 kcal de pâtisseries disparaissent en cinq minutes, et la faim revient vite. Même énergie, expérience très différente.',
            "Construis la plupart de tes repas avec des protéines, des légumes, des fruits, des légumineuses et des céréales complètes, et garde de la place pour ce que tu aimes. Aucun aliment n'est interdit : chacun a simplement un « coût » en calories.",
          ),
        },
      },
      {
        heading: { en: 'How NutriLens uses this', fr: 'Ce que fait NutriLens avec ça' },
        body: {
          en: md(
            'The app estimates that your body burns about **{{tdee}} kcal per day**, and sets your daily target at **{{targetCalories}} kcal**. Log what you eat, weigh yourself regularly, and the app will refine these numbers from your real data over time.',
          ),
          fr: md(
            "L'appli estime que ton corps dépense environ **{{tdee}} kcal par jour** et fixe ton objectif quotidien à **{{targetCalories}} kcal**. Note ce que tu manges, pèse-toi régulièrement, et l'appli affinera ces chiffres avec tes vraies données au fil du temps.",
          ),
        },
      },
    ],
    keyTakeaways: {
      en: [
        'A calorie is a unit of energy; food labels show kilocalories (kcal).',
        'Protein and carbs have 4 kcal/g, fat 9 kcal/g, alcohol 7 kcal/g.',
        'Eating less than you burn, over weeks, is what makes you lose weight. No diet escapes this.',
        'Food quality decides how full, energetic and healthy you feel while you do it.',
      ],
      fr: [
        "Une calorie est une unité d'énergie ; les étiquettes affichent des kilocalories (kcal).",
        'Protéines et glucides : 4 kcal/g ; lipides : 9 kcal/g ; alcool : 7 kcal/g.',
        "Manger moins que ce que tu dépenses, sur plusieurs semaines, c'est ce qui fait perdre du poids. Aucun régime n'y échappe.",
        'La qualité des aliments décide de ta satiété, de ton énergie et de ta santé pendant le processus.',
      ],
    },
    related: ['bmr-tdee', 'deficit-explained', 'hunger-tips'],
  },

  // ---------------------------------------------------------------------------
  // 2. BMR & TDEE
  // ---------------------------------------------------------------------------
  {
    id: 'bmr-tdee',
    category: 'basics',
    icon: 'Calculator',
    minutes: 5,
    title: {
      en: 'BMR & TDEE: how much you really burn',
      fr: 'BMR et TDEE : combien tu dépenses vraiment',
    },
    summary: {
      en: 'The four parts of your daily energy use, how the app estimated yours, and how it gets more accurate over time.',
      fr: "Les quatre composantes de ta dépense quotidienne, comment l'appli a estimé la tienne, et comment elle devient plus précise avec le temps.",
    },
    sections: [
      {
        heading: { en: 'Your engine at rest: BMR', fr: 'Le moteur au repos : le BMR' },
        body: {
          en: md(
            "Your **BMR** (basal metabolic rate) is the energy your body uses just to stay alive at complete rest: heart, lungs, brain, kidneys, keeping you warm. Even if you stayed in bed all day, you'd burn it.",
            'For most people, BMR is the biggest part of the day: around 60–70% of everything you burn. Yours is estimated at about **{{bmr}} kcal per day**.',
          ),
          fr: md(
            "Ton **BMR** (métabolisme de base) est l'énergie que ton corps utilise juste pour rester en vie, au repos complet : cœur, poumons, cerveau, reins, maintien de la température. Même si tu restais au lit toute la journée, tu la dépenserais.",
            "Pour la plupart des gens, c'est la plus grosse part de la journée : environ 60 à 70 % de tout ce que tu brûles. Le tien est estimé à environ **{{bmr}} kcal par jour**.",
          ),
        },
      },
      {
        heading: { en: 'The other three pieces', fr: 'Les trois autres pièces' },
        body: {
          en: md(
            'On top of BMR, three things add up to your **TDEE** (total daily energy expenditure):',
            ul(
              "**NEAT** (non-exercise activity): walking, standing, cleaning, fidgeting, taking the stairs. It varies hugely between people, easily from 200 to over 800 kcal per day, and it's the piece you can increase most easily.",
              '**TEF** (thermic effect of food): the energy used to digest, about 10% of what you eat. Protein costs the most to digest.',
              '**Exercise:** your gym sessions, runs, football. Often smaller than people think: a solid hour of lifting burns roughly 200–400 kcal.',
            ),
            "Add it all up and your estimated TDEE is about **{{tdee}} kcal per day**. That's your maintenance level: eat this much on average and your weight should stay roughly stable.",
          ),
          fr: md(
            'En plus du BMR, trois éléments forment ta **TDEE** (dépense énergétique totale journalière) :',
            ul(
              "**NEAT** (activité hors sport) : marcher, rester debout, faire le ménage, bouger sur ta chaise, prendre les escaliers. Elle varie énormément d'une personne à l'autre, facilement de 200 à plus de 800 kcal par jour, et c'est la partie la plus facile à augmenter.",
              "**TEF** (effet thermique des aliments) : l'énergie utilisée pour digérer, environ 10 % de ce que tu manges. Les protéines sont les plus coûteuses à digérer.",
              "**Sport :** tes séances de muscu, tes footings, ton match de foot. Souvent moins que ce qu'on imagine : une bonne heure de musculation brûle en gros 200 à 400 kcal.",
            ),
            "Au total, ta TDEE estimée est d'environ **{{tdee}} kcal par jour**. C'est ton niveau de maintenance : si tu manges ça en moyenne, ton poids devrait rester à peu près stable.",
          ),
        },
      },
      {
        heading: { en: 'How the app estimated your numbers', fr: "Comment l'appli a calculé tes chiffres" },
        body: {
          en: md(
            'NutriLens uses the **Mifflin-St Jeor equation**, one of the most reliable formulas available. It uses your weight ({{weightKg}} kg), height, age and sex to estimate your BMR, then multiplies it by an activity factor (from about 1.2 for a desk job with little movement to about 1.9 for physical work plus hard training) to get your TDEE.',
            "It's a good starting point, but it's still an estimate. Two people with the same stats can differ by 10% or more, that's 200–300 kcal per day, because of muscle mass, genetics and how much they move without noticing.",
          ),
          fr: md(
            "NutriLens utilise l'**équation de Mifflin-St Jeor**, l'une des formules les plus fiables. Elle part de ton poids ({{weightKg}} kg), ta taille, ton âge et ton sexe pour estimer ton BMR, puis le multiplie par un facteur d'activité (d'environ 1,2 pour un travail de bureau avec peu de mouvement à environ 1,9 pour un métier physique plus un entraînement intense) pour obtenir ta TDEE.",
            "C'est un bon point de départ, mais ça reste une estimation. Deux personnes avec les mêmes mensurations peuvent différer de 10 % ou plus, soit 200 à 300 kcal par jour, à cause de leur masse musculaire, de leur génétique et de tout ce qu'elles bougent sans s'en rendre compte.",
          ),
        },
      },
      {
        heading: { en: 'How it gets more accurate', fr: 'Comment ça devient plus précis' },
        body: {
          en: md(
            'Your real data beats any formula. After 2–3 weeks of consistent logging and regular weigh-ins, the app compares what you actually ate with how your weight trend actually moved.',
            "Example: if you averaged 2,000 kcal per day and your trend stayed flat, your real maintenance is about 2,000 kcal, whatever the formula said. If you lost 0.5 kg per week on that intake, you're burning roughly 550 kcal more than you eat (0.5 × 7,700 ÷ 7).",
            'The more honestly and consistently you log, the better this adjustment works. Rough logging on most days beats perfect logging on a few.',
          ),
          fr: md(
            "Tes vraies données valent mieux que n'importe quelle formule. Après 2 à 3 semaines de saisie régulière et de pesées fréquentes, l'appli compare ce que tu as réellement mangé avec l'évolution réelle de ta courbe de poids.",
            "Exemple : si tu as mangé en moyenne 2 000 kcal par jour et que ta courbe est restée plate, ta vraie maintenance est d'environ 2 000 kcal, quoi qu'en dise la formule. Si tu as perdu 0,5 kg par semaine avec ces apports, tu dépenses environ 550 kcal de plus que ce que tu manges (0,5 × 7 700 ÷ 7).",
            "Plus tu notes honnêtement et régulièrement, mieux cet ajustement fonctionne. Une saisie approximative la plupart des jours vaut mieux qu'une saisie parfaite de temps en temps.",
          ),
        },
      },
      {
        heading: { en: 'Your TDEE moves', fr: 'Ta TDEE bouge' },
        body: {
          en: md(
            "Your TDEE isn't fixed. It drops a little as you lose weight (a lighter body costs less to run), and it rises with more steps or more muscle. That's why the app recalculates as you go.",
          ),
          fr: md(
            "Ta TDEE n'est pas figée. Elle baisse un peu quand tu perds du poids (un corps plus léger coûte moins cher à faire fonctionner) et elle augmente si tu marches plus ou si tu prends du muscle. C'est pour ça que l'appli recalcule au fur et à mesure.",
          ),
        },
      },
    ],
    keyTakeaways: {
      en: [
        'BMR ({{bmr}} kcal) is what you burn at rest; TDEE ({{tdee}} kcal) adds daily movement, digestion and exercise.',
        'NEAT, your everyday movement like walking, is the most variable piece and the easiest to increase.',
        'Formulas can be off by 10% or more: treat the first numbers as a starting point.',
        'After 2–3 weeks of logging, your real weight trend tells the app your true maintenance.',
      ],
      fr: [
        'Le BMR ({{bmr}} kcal) est ce que tu brûles au repos ; ta TDEE ({{tdee}} kcal) y ajoute le mouvement quotidien, la digestion et le sport.',
        'La NEAT, ton activité de tous les jours comme la marche, est la partie la plus variable et la plus facile à augmenter.',
        'Les formules peuvent se tromper de 10 % ou plus : prends les premiers chiffres comme un point de départ.',
        "Après 2 à 3 semaines de saisie, ta vraie courbe de poids indique à l'appli ta maintenance réelle.",
      ],
    },
    related: ['calories-101', 'deficit-explained', 'steps-cardio', 'plateaus-adaptation'],
  },

  // ---------------------------------------------------------------------------
  // 3. Deficit explained
  // ---------------------------------------------------------------------------
  {
    id: 'deficit-explained',
    category: 'basics',
    icon: 'TrendingDown',
    minutes: 5,
    title: {
      en: 'Calorie deficits, explained',
      fr: 'Le déficit calorique, expliqué',
    },
    summary: {
      en: 'How eating a bit less than you burn turns into fat loss, how fast is sensible, and why slower usually wins.',
      fr: 'Comment manger un peu moins que ce que tu dépenses fait fondre le gras, à quel rythme avancer, et pourquoi plus lent est souvent plus efficace.',
    },
    sections: [
      {
        heading: { en: 'What a deficit is', fr: "C'est quoi, un déficit ?" },
        body: {
          en: md(
            'A **calorie deficit** means eating less energy than your body burns. To cover the missing energy, your body uses its reserves, mainly stored fat.',
            'Your plan: your body burns about {{tdee}} kcal per day and your target is {{targetCalories}} kcal. That leaves a daily gap of about **{{deficit}} kcal**.',
          ),
          fr: md(
            "Être en **déficit calorique**, c'est manger moins d'énergie que ce que ton corps dépense. Pour combler le manque, il puise dans ses réserves, principalement la graisse stockée.",
            "Ton plan : ton corps dépense environ {{tdee}} kcal par jour et ton objectif est de {{targetCalories}} kcal. Ça laisse un écart quotidien d'environ **{{deficit}} kcal**.",
          ),
        },
      },
      {
        heading: { en: 'From calories to kilograms', fr: 'Des calories aux kilos' },
        body: {
          en: md(
            'A handy rule of thumb: **about 7,700 kcal ≈ 1 kg of body fat**. So a deficit of 500 kcal per day adds up to 3,500 kcal per week, or roughly 0.45 kg of fat.',
            'With your gap of {{deficit}} kcal per day, the app expects a change of about **{{weeklyChangeKg}} kg per week**, which puts your goal roughly **{{weeksToGoal}} weeks** away.',
            'Treat this as a rough forecast, not a promise:',
            ul(
              'The first 1–2 weeks often drop faster, because you also lose some water and stored carbs, not just fat.',
              'As you get lighter, you burn a little less, so progress naturally slows.',
              'Day-to-day water swings can hide fat loss for a week or two.',
            ),
          ),
          fr: md(
            'Une règle pratique : **environ 7 700 kcal ≈ 1 kg de graisse corporelle**. Un déficit de 500 kcal par jour représente donc 3 500 kcal par semaine, soit environ 0,45 kg de graisse.',
            "Avec ton écart de {{deficit}} kcal par jour, l'appli prévoit une évolution d'environ **{{weeklyChangeKg}} kg par semaine**, ce qui place ton objectif à environ **{{weeksToGoal}} semaines**.",
            "Vois ça comme une prévision approximative, pas comme une promesse :",
            ul(
              "Au début (les 1 à 2 premières semaines), le poids descend souvent plus vite, car tu perds aussi de l'eau et des glucides stockés, pas seulement du gras.",
              'En t\'allégeant, tu dépenses un peu moins, donc la progression ralentit naturellement.',
              "Les variations d'eau d'un jour à l'autre peuvent masquer la perte de gras pendant une semaine ou deux.",
            ),
          ),
        },
      },
      {
        heading: { en: "Why faster isn't better", fr: "Pourquoi plus vite n'est pas mieux" },
        body: {
          en: md(
            "It's tempting to slash calories to get it over with. Very large deficits usually backfire:",
            ul(
              "**More muscle loss**, especially if protein is low and you don't lift.",
              '**Stronger hunger and cravings**, which make binges and giving up more likely.',
              '**Low energy:** worse workouts, worse mood, worse sleep.',
              '**A bigger drop in everyday movement**, without you even noticing.',
            ),
            'The best deficit is the one you can keep for months.',
          ),
          fr: md(
            "C'est tentant de couper les calories au maximum pour en finir vite. Mais les gros déficits se retournent souvent contre toi :",
            ul(
              '**Plus de perte musculaire**, surtout si tu manges peu de protéines et que tu ne fais pas de musculation.',
              "**Une faim et des envies plus fortes**, ce qui rend les craquages et l'abandon plus probables.",
              "**Moins d'énergie :** séances moins bonnes, humeur et sommeil en baisse.",
              '**Une baisse plus marquée de tes mouvements quotidiens**, sans même que tu le remarques.',
            ),
            "Le meilleur déficit, c'est celui que tu peux tenir pendant des mois.",
          ),
        },
      },
      {
        heading: { en: 'A sensible speed', fr: 'Un rythme raisonnable' },
        body: {
          en: md(
            "Mainstream guidance is to lose about **0.5–1% of your bodyweight per week**. For example, at 80 kg that's 0.4–0.8 kg per week. If you have a lot to lose, the upper end is fine; as you get leaner, aim closer to 0.5%.",
            'Safety floor: don\'t go below about **1,200 kcal per day for women or 1,500 kcal per day for men** without medical supervision. If you are pregnant or breastfeeding, have a medical condition, or have a history of disordered eating, talk to a doctor before dieting.',
          ),
          fr: md(
            "La recommandation courante est de perdre environ **0,5 à 1 % de ton poids par semaine**. Par exemple, à 80 kg, ça fait 0,4 à 0,8 kg par semaine. Si tu as beaucoup à perdre, le haut de la fourchette convient ; plus ton taux de gras baisse, plus il vaut mieux viser 0,5 %.",
            "Limite de sécurité : ne descends pas sous environ **1 200 kcal par jour pour une femme ou 1 500 kcal par jour pour un homme** sans suivi médical. Si tu es enceinte ou allaites, si tu as un problème de santé ou des antécédents de troubles alimentaires, parles-en à un médecin avant de commencer un régime.",
          ),
        },
      },
      {
        heading: { en: 'Gaining instead? Flip it', fr: 'Tu veux prendre du poids ? On inverse' },
        body: {
          en: md(
            'To build muscle, you do the opposite: eat a small **surplus**, about 200–300 kcal above maintenance, while training hard. A bigger surplus mostly adds fat, not extra muscle. See the lesson on recomposition and gaining.',
          ),
          fr: md(
            "Pour construire du muscle, on fait l'inverse : un petit **surplus**, environ 200 à 300 kcal au-dessus de la maintenance, avec un entraînement sérieux. Un surplus plus gros ajoute surtout du gras, pas plus de muscle. Voir la leçon sur la recomposition et la prise de muscle.",
          ),
        },
      },
    ],
    keyTakeaways: {
      en: [
        'A deficit means eating less than you burn; your body covers the gap with stored fat.',
        '“7,700 kcal ≈ 1 kg of fat” is a useful rough rule, not an exact law.',
        'Aim to lose 0.5–1% of your bodyweight per week; slower usually means more muscle kept and less hunger.',
        "Don't go below ~1,200 kcal (women) or ~1,500 kcal (men) without medical supervision.",
      ],
      fr: [
        "Un déficit, c'est manger moins que ce que tu dépenses : ton corps comble l'écart avec sa graisse stockée.",
        '« 7 700 kcal ≈ 1 kg de gras » est une règle approximative utile, pas une loi exacte.',
        'Vise une perte de 0,5 à 1 % de ton poids par semaine : plus lent signifie souvent plus de muscle préservé et moins de faim.',
        'Ne descends pas sous ~1 200 kcal (femmes) ou ~1 500 kcal (hommes) sans suivi médical.',
      ],
    },
    related: ['bmr-tdee', 'scale-lies', 'protein', 'plateaus-adaptation', 'recomp-and-gaining'],
  },

  // ---------------------------------------------------------------------------
  // 4. Why the scale lies
  // ---------------------------------------------------------------------------
  {
    id: 'scale-lies',
    category: 'body',
    icon: 'Scale',
    minutes: 4,
    title: {
      en: 'Why the scale lies (and how to read it)',
      fr: 'Pourquoi la balance ment (et comment la lire)',
    },
    summary: {
      en: "Your weight can swing 1–2 kg from one day to the next without any change in fat. Here's why, and how to see the real trend.",
      fr: "Ton poids peut varier de 1 à 2 kg d'un jour à l'autre sans que ton gras change. Voici pourquoi, et comment voir la vraie tendance.",
    },
    sections: [
      {
        heading: { en: 'Daily swings are normal', fr: 'Les variations quotidiennes sont normales' },
        body: {
          en: md(
            "Your body weight isn't just fat and muscle. It also includes water, food being digested and stored carbs, and those change every day. Swings of **0.5–2 kg from one morning to the next** are completely normal, even when your fat hasn't changed at all.",
            'The main culprits:',
            ul(
              '**Salt:** a salty meal (restaurant food, sauces, cured meats) can make you hold extra water for a day or two.',
              '**Carbs:** each gram of stored carbohydrate (glycogen) is stored with about 3 g of water. A high-carb day can add 1 kg or more on the scale.',
              "**Digestion:** what's still in your gut weighs something, often 0.5–1 kg.",
              '**Hormones:** many women hold 1–2 kg of extra water in the days before their period.',
              '**Training:** a hard or new workout causes temporary water retention while muscles repair.',
              "**Creatine:** if you start taking it, expect +0.5–1.5 kg of water in your muscles in the first weeks. That's not fat.",
            ),
          ),
          fr: md(
            "Ton poids, ce n'est pas que du gras et du muscle. Il comprend aussi de l'eau, les aliments en cours de digestion et les glucides stockés, et tout ça change chaque jour. Des écarts de **0,5 à 2 kg d'un matin à l'autre** sont tout à fait normaux, même si ton gras n'a pas bougé.",
            'Les principaux responsables :',
            ul(
              "**Le sel :** un repas salé (restaurant, sauces, charcuterie) peut te faire retenir de l'eau pendant un ou deux jours.",
              "**Les glucides :** chaque gramme de glucides stockés (le glycogène) est stocké avec environ 3 g d'eau. Une journée riche en glucides peut ajouter 1 kg ou plus sur la balance.",
              '**La digestion :** ce qui est encore dans ton intestin pèse, souvent 0,5 à 1 kg.',
              "**Les hormones :** beaucoup de femmes retiennent 1 à 2 kg d'eau en plus dans les jours qui précèdent leurs règles.",
              "**L'entraînement :** une séance difficile ou nouvelle provoque une rétention d'eau temporaire pendant que les muscles se réparent.",
              "**La créatine :** si tu commences à en prendre, attends-toi à +0,5 à 1,5 kg d'eau dans les muscles les premières semaines. Ce n'est pas du gras.",
            ),
          ),
        },
      },
      {
        heading: { en: 'How to weigh yourself', fr: 'Comment te peser' },
        body: {
          en: md(
            'To reduce the noise, keep the conditions identical:',
            ul(
              'In the **morning**, after using the toilet, before eating or drinking.',
              'Same scale, on a hard flat floor, in the same (minimal) clothing.',
              'Ideally **every day or most days**. More data points make the average more reliable, and each single number matters less.',
            ),
          ),
          fr: md(
            'Pour réduire le bruit, garde toujours les mêmes conditions :',
            ul(
              'Le **matin**, après un passage aux toilettes, avant de manger ou de boire.',
              'Même balance, posée sur un sol dur et plat, avec la même tenue (légère).',
              'Idéalement **tous les jours ou presque**. Plus tu as de mesures, plus la moyenne est fiable, et moins chaque chiffre isolé compte.',
            ),
          ),
        },
      },
      {
        heading: { en: 'Trust the trend, not the day', fr: 'Fais confiance à la tendance, pas au jour' },
        body: {
          en: md(
            "A single weigh-in is noisy. What matters is the **weekly average** or the trend line the app draws. Compare this week's average with last week's, not Tuesday with Wednesday.",
            "If your target is about {{weeklyChangeKg}} kg per week, you won't see that every day. You'll see ups and downs, with an average that slowly moves in the right direction.",
          ),
          fr: md(
            "Une pesée seule est bruitée. Ce qui compte, c'est la **moyenne de la semaine** ou la courbe de tendance tracée par l'appli. Compare la moyenne de cette semaine à celle de la semaine dernière, pas mardi à mercredi.",
            "Si ton objectif est d'environ {{weeklyChangeKg}} kg par semaine, tu ne le verras pas chaque jour. Tu verras des hauts et des bas, avec une moyenne qui avance doucement dans la bonne direction.",
          ),
        },
      },
      {
        heading: { en: 'The fake plateau', fr: 'Le faux plateau' },
        body: {
          en: md(
            "Sometimes the scale stays stuck for 1–2 weeks even though you're in a deficit. Often fat loss is happening, but water retention is masking it (stress, poor sleep, a new training block, the menstrual cycle). Then one day it drops suddenly.",
            'A real plateau is a flat trend for **3–4 weeks** with consistent logging. Before that, keep going. The lesson on plateaus explains what to do next.',
          ),
          fr: md(
            "Parfois, la balance reste bloquée 1 à 2 semaines alors que tu es bien en déficit. Souvent, la perte de gras a bien lieu, mais une rétention d'eau la masque (stress, mauvais sommeil, nouveau programme, cycle menstruel). Puis un jour, ça descend d'un coup.",
            "Un vrai plateau, c'est une tendance plate pendant **3 à 4 semaines** avec une saisie régulière. Avant ça, continue. La leçon sur les plateaux explique quoi faire ensuite.",
          ),
        },
      },
      {
        heading: { en: 'Other ways to measure', fr: "D'autres façons de mesurer" },
        body: {
          en: md(
            'The scale is just one tool. A waist measurement once a week (at the navel, belly relaxed), progress photos in the same light every 2–4 weeks, how your clothes fit and how your lifts progress tell you a lot too.',
          ),
          fr: md(
            "La balance n'est qu'un outil. Ton tour de taille une fois par semaine (au niveau du nombril, ventre relâché), des photos dans la même lumière toutes les 2 à 4 semaines, tes vêtements et la progression de tes charges en disent beaucoup aussi.",
          ),
        },
      },
    ],
    keyTakeaways: {
      en: [
        'Daily swings of 0.5–2 kg are mostly water, food and stored carbs, not fat.',
        'Weigh in the morning after the toilet, before eating, in the same conditions.',
        'Judge progress by your weekly average or trend line, never by one weigh-in.',
        'A flat trend for 1–2 weeks is often hidden water; a real plateau lasts 3–4 weeks.',
      ],
      fr: [
        "Des variations de 0,5 à 2 kg par jour viennent surtout de l'eau, des aliments et des glucides stockés, pas du gras.",
        'Pèse-toi le matin, après les toilettes, avant de manger, toujours dans les mêmes conditions.',
        'Juge tes progrès sur la moyenne de la semaine ou la courbe de tendance, jamais sur une seule pesée.',
        "Une tendance plate pendant 1 à 2 semaines cache souvent de l'eau ; un vrai plateau dure 3 à 4 semaines.",
      ],
    },
    related: ['deficit-explained', 'plateaus-adaptation', 'water', 'consistency-mindset'],
  },

  // ---------------------------------------------------------------------------
  // 5. Protein
  // ---------------------------------------------------------------------------
  {
    id: 'protein',
    category: 'nutrition',
    icon: 'Beef',
    minutes: 5,
    title: {
      en: "Protein: your most important macro",
      fr: "Les protéines : ton macro le plus important",
    },
    summary: {
      en: "Why your target is {{proteinG}} g per day, what protein does for your muscles and hunger, and easy ways to reach it.",
      fr: "Pourquoi ton objectif est de {{proteinG}} g par jour, ce que les protéines font pour tes muscles et ta faim, et comment l'atteindre facilement.",
    },
    sections: [
      {
        heading: { en: "Why protein matters so much", fr: "Pourquoi les protéines comptent autant" },
        body: {
          en: md(
            "Protein is the building material for muscle, and in a deficit it's your best insurance. When you eat less than you burn, your body can break down muscle as well as fat. Enough protein, combined with strength training, tells your body to keep the muscle and burn fat instead.",
            "It also helps with hunger: protein is the most filling macronutrient, and your body uses about 20–30% of its calories just to digest it.",
          ),
          fr: md(
            "Les protéines sont les matériaux de construction du muscle, et en déficit, c'est ta meilleure assurance. Quand tu manges moins que ce que tu dépenses, ton corps peut puiser dans le muscle autant que dans le gras. Assez de protéines, avec de la musculation, l'incite à garder le muscle et à brûler plutôt le gras.",
            "Elles aident aussi contre la faim : c'est le macronutriment le plus rassasiant, et ton corps utilise environ 20 à 30 % de leurs calories rien que pour les digérer.",
          ),
        },
      },
      {
        heading: { en: "Your target: {{proteinG}} g per day", fr: "Ton objectif : {{proteinG}} g par jour" },
        body: {
          en: md(
            "Research on people who train supports **1.6–2.2 g of protein per kg of bodyweight per day**, with the upper part of the range most useful during a deficit. Your target is **{{proteinG}} g per day**.",
            "Don't chase it to the gram: landing within 10–20 g of it on most days is great. If you have a lot of fat to lose, basing protein on your goal weight is a common and sensible adjustment.",
            "For healthy people, these intakes are considered safe. If you have kidney disease, ask your doctor what amount is right for you.",
          ),
          fr: md(
            "Les études sur les personnes qui s'entraînent recommandent **1,6 à 2,2 g de protéines par kg de poids de corps et par jour**, le haut de la fourchette étant le plus utile en déficit. Ton objectif est de **{{proteinG}} g par jour**.",
            "Pas besoin de viser au gramme près : être à 10–20 g près la plupart des jours, c'est très bien. Si tu as beaucoup de gras à perdre, calculer tes protéines à partir de ton poids objectif est un ajustement courant et raisonnable.",
            "Pour une personne en bonne santé, ces apports sont considérés comme sûrs. Si tu as une maladie rénale, demande à ton médecin la quantité qui te convient.",
          ),
        },
      },
      {
        heading: { en: "Spread it over the day", fr: "Répartis-les sur la journée" },
        body: {
          en: md(
            "Your body uses protein best when it's spread over 3–5 meals, with roughly **25–40 g per meal**. Splitting {{proteinG}} g over four meals means about a quarter of it at each one.",
            "Tip: start each meal with your protein, so you don't fill up on everything else first.",
          ),
          fr: md(
            "Ton corps utilise mieux les protéines quand elles sont réparties sur 3 à 5 repas, avec environ **25 à 40 g par repas**. Répartir {{proteinG}} g sur quatre repas, c'est environ un quart à chaque repas.",
            "Astuce : commence chaque repas par ta portion de protéines, pour ne pas remplir ton estomac avec le reste avant d'y arriver.",
          ),
        },
      },
      {
        heading: { en: "Easy protein sources", fr: "Des sources faciles" },
        body: {
          en: md(
            "Approximate protein content (cooked or ready to eat):",
            ul(
              "**Eggs:** about 6 g per egg",
              "**Chicken or turkey breast:** about 30 g per 100 g",
              "**Canned tuna:** about 25 g per 100 g drained (if it's in oil, drain it well to save calories)",
              "**Sardines:** about 20–25 g per 100 g, plus healthy omega-3 fats",
              "**Lean meat or fish (dorade, sea bass):** about 20–25 g per 100 g",
              "**Ricotta:** about 10–12 g per 100 g",
              "**Plain yogurt:** about 4–5 g per pot; Greek-style or skyr: about 8–10 g per 100 g",
              "**Lben or milk:** about 3 g per 100 ml, so a 25 cl glass gives about 8 g",
              "**Chickpeas, lentils, beans (cooked):** about 8–9 g per 100 g, with lots of fiber",
            ),
            "A scoop of **whey protein** gives about 20–25 g. It's optional, well studied and safe for healthy people: just a convenient way to fill a gap, not a requirement.",
          ),
          fr: md(
            "Teneur approximative en protéines (cuit ou prêt à manger) :",
            ul(
              "**Œufs :** environ 6 g par œuf",
              "**Blanc de poulet ou de dinde :** environ 30 g pour 100 g",
              "**Thon en boîte :** environ 25 g pour 100 g égoutté (s'il est à l'huile, égoutte-le bien pour économiser des calories)",
              "**Sardines :** environ 20 à 25 g pour 100 g, avec en prime de bonnes graisses oméga-3",
              "**Viande maigre ou poisson (dorade, loup) :** environ 20 à 25 g pour 100 g",
              "**Ricotta :** environ 10 à 12 g pour 100 g",
              "**Yaourt nature :** environ 4 à 5 g par pot ; yaourt grec ou skyr : environ 8 à 10 g pour 100 g",
              "**Lben ou lait :** environ 3 g pour 100 ml, donc un verre de 25 cl apporte environ 8 g",
              "**Pois chiches, lentilles, haricots (cuits) :** environ 8 à 9 g pour 100 g, avec beaucoup de fibres",
            ),
            "Une dose de **whey** (protéine en poudre) apporte environ 20 à 25 g. C'est facultatif, très étudié et sans danger pour une personne en bonne santé : juste un moyen pratique de compléter, pas une obligation.",
          ),
        },
      },
      {
        heading: { en: "Simple swaps", fr: "Petites astuces" },
        body: {
          en: md(
            ul(
              "Add 2–3 eggs or a can of tuna to a salad or sandwich.",
              "Pick ricotta or yogurt as a snack instead of biscuits.",
              "Add chickpeas or lentils to soups (chorba, lablabi) and stews.",
              "Keep boiled eggs in the fridge for when hunger strikes.",
            ),
          ),
          fr: md(
            ul(
              "Ajoute 2 ou 3 œufs ou une boîte de thon à une salade ou un sandwich.",
              "Choisis de la ricotta ou un yaourt en collation plutôt que des biscuits.",
              "Mets des pois chiches ou des lentilles dans tes soupes (chorba, lablabi) et tes plats mijotés.",
              "Garde des œufs durs au frigo pour les petites faims.",
            ),
          ),
        },
      },
    ],
    keyTakeaways: {
      en: [
        "Protein plus strength training helps you keep muscle while you lose fat.",
        "Your target is {{proteinG}} g per day; within 10–20 g of it is good enough.",
        "Spread it over 3–5 meals of roughly 25–40 g each.",
        "Eggs, chicken, tuna, sardines, yogurt, ricotta and legumes get you there; whey is optional.",
      ],
      fr: [
        "Protéines + musculation t'aident à garder ton muscle pendant que tu perds du gras.",
        "Ton objectif est de {{proteinG}} g par jour ; à 10–20 g près, c'est suffisant.",
        "Répartis-les sur 3 à 5 repas d'environ 25 à 40 g chacun.",
        "Œufs, poulet, thon, sardines, yaourt, ricotta et légumineuses suffisent ; la whey est facultative.",
      ],
    },
    related: ['macros-carbs-fats', 'strength-training-basics', 'hunger-tips', 'ramadan-fasting'],
  },

  // ---------------------------------------------------------------------------
  // 6. Carbs and fats
  // ---------------------------------------------------------------------------
  {
    id: 'macros-carbs-fats',
    category: 'nutrition',
    icon: 'Wheat',
    minutes: 4,
    title: {
      en: "Carbs and fats: there's no bad macro",
      fr: "Glucides et lipides : aucun macro n'est mauvais",
    },
    summary: {
      en: "What your {{carbsG}} g of carbs and {{fatG}} g of fat do, and why you don't need to cut either one out.",
      fr: "À quoi servent tes {{carbsG}} g de glucides et tes {{fatG}} g de lipides, et pourquoi tu n'as besoin d'en supprimer aucun.",
    },
    sections: [
      {
        heading: { en: "The three macros", fr: "Les trois macros" },
        body: {
          en: md(
            "Calories come from three macronutrients: protein, carbohydrates and fat. Once your protein is set ({{proteinG}} g), the rest of your calories are split between carbs and fat. Your plan: about **{{carbsG}} g of carbs** and **{{fatG}} g of fat** per day.",
            "For weight loss, total calories matter most. The split mainly affects how you feel, how you train and how easy the plan is to follow.",
          ),
          fr: md(
            "Les calories viennent de trois macronutriments : les protéines, les glucides et les lipides. Une fois tes protéines fixées ({{proteinG}} g), le reste de tes calories se partage entre glucides et lipides. Ton plan : environ **{{carbsG}} g de glucides** et **{{fatG}} g de lipides** par jour.",
            "Pour perdre du poids, ce sont surtout les calories totales qui comptent. La répartition joue surtout sur ton ressenti, tes entraînements et la facilité à suivre le plan.",
          ),
        },
      },
      {
        heading: { en: "Fat: don't go too low", fr: "Les lipides : ne descends pas trop bas" },
        body: {
          en: md(
            "Fat is essential. Your body needs it to make hormones (including testosterone and estrogen), to absorb vitamins A, D, E and K, and to build healthy cells.",
            "A common minimum is about **0.6–0.8 g per kg of bodyweight**, or roughly **20–25% of calories**. Going very low for months can disturb your hormones and, in women, the menstrual cycle.",
            "Favor olive oil, nuts, olives, avocado, eggs and oily fish like sardines. Just remember fat is dense: 9 kcal per gram, so portions add up fast.",
          ),
          fr: md(
            "Les graisses sont indispensables. Ton corps en a besoin pour fabriquer des hormones (dont la testostérone et les œstrogènes), absorber les vitamines A, D, E et K, et construire des cellules saines.",
            "Un minimum courant est d'environ **0,6 à 0,8 g par kg de poids de corps**, soit à peu près **20 à 25 % des calories**. Descendre très bas pendant des mois peut perturber tes hormones et, chez les femmes, le cycle menstruel.",
            "Privilégie l'huile d'olive, les noix et amandes, les olives, l'avocat, les œufs et les poissons gras comme la sardine. Rappelle-toi juste que le gras est dense : 9 kcal par gramme, les portions montent vite.",
          ),
        },
      },
      {
        heading: { en: "Carbs: fuel, not the enemy", fr: "Les glucides : du carburant, pas un ennemi" },
        body: {
          en: md(
            "Carbs are your body's preferred fuel for hard effort. They're stored in your muscles and liver as **glycogen** and power your heavier sets and faster runs. With equal calories and protein, low-carb diets don't burn more fat; they simply suit some people's appetite better.",
            "Good choices: oats, rice, potatoes, couscous, whole-wheat or barley bread, pasta, fruit, legumes. Eating some carbs in the meal before or after training usually helps performance.",
          ),
          fr: md(
            "Les glucides sont le carburant préféré de ton corps pour les efforts intenses. Ils sont stockés dans tes muscles et ton foie sous forme de **glycogène** et alimentent tes séries lourdes et tes sprints. À calories et protéines égales, le low-carb ne fait pas perdre plus de gras ; il convient simplement mieux à l'appétit de certaines personnes.",
            "Bons choix : flocons d'avoine, riz, pommes de terre, couscous, pain complet ou pain d'orge, pâtes, fruits, légumineuses. Manger des glucides au repas avant ou après l'entraînement aide généralement tes performances.",
          ),
        },
      },
      {
        heading: { en: "Fiber: the quiet hero", fr: "Les fibres : le héros discret" },
        body: {
          en: md(
            "Fiber is a type of carb you don't fully digest. It keeps you full, feeds healthy gut bacteria and supports digestion and heart health. Aim for about **25–35 g per day**. Vegetables, fruit, legumes, whole grains and oats are your best sources. If you eat little fiber today, increase it gradually and drink enough water to avoid bloating.",
          ),
          fr: md(
            "Les fibres sont des glucides que tu ne digères pas complètement. Elles rassasient, nourrissent les bonnes bactéries de l'intestin et soutiennent la digestion et la santé du cœur. Vise environ **25 à 35 g par jour**. Légumes, fruits, légumineuses, céréales complètes et flocons d'avoine sont tes meilleures sources. Si tu en manges peu aujourd'hui, augmente progressivement et bois assez d'eau pour éviter les ballonnements.",
          ),
        },
      },
      {
        heading: { en: "Flexible, not strict", fr: "Flexible, pas rigide" },
        body: {
          en: md(
            "Calories and protein are the numbers to hit. Carbs and fat can swing from day to day: a day with more fat and fewer carbs, or the reverse, is fine as long as total calories stay on target and fat doesn't stay very low.",
          ),
          fr: md(
            "Les calories et les protéines sont les chiffres à atteindre. Glucides et lipides peuvent varier d'un jour à l'autre : une journée avec plus de lipides et moins de glucides, ou l'inverse, ça va, tant que le total des calories reste dans l'objectif et que les lipides ne restent pas très bas.",
          ),
        },
      },
    ],
    keyTakeaways: {
      en: [
        "Your plan: about {{carbsG}} g of carbs and {{fatG}} g of fat; calories and protein matter most.",
        "Keep fat at least around 0.6–0.8 g/kg (about 20–25% of calories) for healthy hormones.",
        "Carbs fuel hard training; they don't make you gain fat on their own.",
        "Aim for 25–35 g of fiber per day from vegetables, fruit, legumes and whole grains.",
      ],
      fr: [
        "Ton plan : environ {{carbsG}} g de glucides et {{fatG}} g de lipides ; les calories et les protéines comptent le plus.",
        "Garde au moins 0,6 à 0,8 g de lipides par kg (environ 20 à 25 % des calories) pour des hormones en bonne santé.",
        "Les glucides alimentent tes entraînements intenses ; ils ne font pas grossir à eux seuls.",
        "Vise 25 à 35 g de fibres par jour grâce aux légumes, fruits, légumineuses et céréales complètes.",
      ],
    },
    related: ['protein', 'calories-101', 'reading-labels-portions', 'hunger-tips'],
  },

  // ---------------------------------------------------------------------------
  // 7. Labels, portions and hidden calories
  // ---------------------------------------------------------------------------
  {
    id: 'reading-labels-portions',
    category: 'nutrition',
    icon: 'ScanLine',
    minutes: 5,
    title: {
      en: "Labels, portions and hidden calories",
      fr: "Étiquettes, portions et calories cachées",
    },
    summary: {
      en: "How to read a nutrition label, why a kitchen scale is worth two weeks of your time, and where calories like to hide.",
      fr: "Comment lire une étiquette nutritionnelle, pourquoi une balance de cuisine vaut bien deux semaines d'efforts, et où se cachent les calories.",
    },
    sections: [
      {
        heading: { en: "Per 100 g vs per serving", fr: "Pour 100 g ou par portion" },
        body: {
          en: md(
            "Most labels show values **per 100 g** (or 100 ml), and sometimes **per serving**. The per-100 g column is the reliable one for comparing foods. Servings are often smaller than what people really eat.",
            "Example: breakfast cereal at 380 kcal per 100 g, with a “serving” of 30 g = 114 kcal. But a bowl poured by eye is often 60–80 g, so 230–300 kcal before the milk.",
            "Labels are also allowed some margin: the real value can differ by about **±20%**. That's fine; small errors average out over weeks.",
          ),
          fr: md(
            "La plupart des étiquettes indiquent les valeurs **pour 100 g** (ou 100 ml), et parfois **par portion**. La colonne pour 100 g est la plus fiable pour comparer. Les portions indiquées sont souvent plus petites que ce qu'on mange vraiment.",
            "Exemple : des céréales à 380 kcal pour 100 g, avec une « portion » de 30 g = 114 kcal. Mais un bol versé à l'œil fait souvent 60 à 80 g, donc 230 à 300 kcal avant même le lait.",
            "Les étiquettes ont aussi droit à une marge : la valeur réelle peut s'écarter d'environ **±20 %**. Ce n'est pas grave, les petites erreurs se compensent sur plusieurs semaines.",
          ),
        },
      },
      {
        heading: { en: "The kitchen scale trick", fr: "L'astuce de la balance de cuisine" },
        body: {
          en: md(
            "Judging portions by eye is hard: people often underestimate what they eat by 20–40%. A cheap kitchen scale fixes this.",
            "Weigh your food for **about two weeks**: rice, pasta, bread, oil, nuts, cheese. You'll quickly learn what 150 g of cooked rice or 30 g of almonds looks like. After that you can estimate far better, and just weigh now and then to check.",
          ),
          fr: md(
            "Évaluer les portions à l'œil, c'est difficile : on sous-estime souvent ce qu'on mange de 20 à 40 %. Une petite balance de cuisine règle le problème.",
            "Pèse tes aliments pendant **environ deux semaines** : riz, pâtes, pain, huile, fruits secs, fromage. Tu apprendras vite à quoi ressemblent 150 g de riz cuit ou 30 g d'amandes. Ensuite, tu estimeras beaucoup mieux, et il suffira de vérifier de temps en temps.",
          ),
        },
      },
      {
        heading: { en: "Olive oil: the biggest hidden source", fr: "L'huile d'olive : la source cachée n° 1" },
        body: {
          en: md(
            "Olive oil is healthy, and it's also the most calorie-dense food in your kitchen:",
            ul("**1 tablespoon ≈ 120 kcal**", "**1 teaspoon ≈ 40 kcal**"),
            "In Tunisian cooking, oil adds up fast. A pot of ojja, mloukhia or a stew can easily hold 4–6 tablespoons (500–700 kcal) shared across a few plates. A generous drizzle on lablabi, salade méchouia or couscous can be 1–2 tablespoons on its own.",
            "You don't need to cut it out. Measure it with a spoon instead of pouring from the bottle, and log it.",
          ),
          fr: md(
            "L'huile d'olive est bonne pour la santé, et c'est aussi l'aliment le plus calorique de ta cuisine :",
            ul("**1 cuillère à soupe ≈ 120 kcal**", "**1 cuillère à café ≈ 40 kcal**"),
            "Dans la cuisine tunisienne, l'huile s'accumule vite. Une marmite d'ojja, de mloukhia ou un ragoût peut facilement contenir 4 à 6 cuillères à soupe (500 à 700 kcal) partagées sur quelques assiettes. Un généreux filet sur un lablabi, une salade méchouia ou un couscous peut représenter 1 à 2 cuillères à soupe à lui seul.",
            "Pas besoin de la supprimer. Mesure-la avec une cuillère au lieu de verser directement de la bouteille, et note-la.",
          ),
        },
      },
      {
        heading: { en: "Other hidden calories", fr: "Les autres calories cachées" },
        body: {
          en: md(
            ul(
              "**Bread:** a whole baguette is roughly 550–700 kcal depending on its size; a quarter is about 150 kcal. Mlawi and other breads cooked with oil carry more.",
              "**Sauces and spreads:** mayonnaise, harissa topped with oil, butter, chocolate spread.",
              "**Sugary drinks:** a can of soda is about 140 kcal, a glass of juice about 100–120 kcal. Each teaspoon of sugar in tea or coffee adds about 16–20 kcal, and that adds up over several glasses.",
              "**Nuts and dried fruit:** great foods, but dense. A handful of almonds (30 g) is about 180 kcal, one date about 20–25 kcal.",
              "**Fried food:** frying adds oil you can't see (brik, fries, fritters).",
            ),
          ),
          fr: md(
            ul(
              "**Le pain :** une baguette entière fait environ 550 à 700 kcal selon sa taille ; un quart, environ 150 kcal. Le mlawi et les autres pains cuits avec de l'huile en contiennent plus.",
              "**Sauces et pâtes à tartiner :** mayonnaise, harissa recouverte d'huile, beurre, pâte à tartiner au chocolat.",
              "**Boissons sucrées :** une canette de soda fait environ 140 kcal, un verre de jus environ 100 à 120 kcal. Chaque cuillère à café de sucre dans le thé ou le café ajoute environ 16 à 20 kcal, et ça s'additionne sur plusieurs verres.",
              "**Fruits secs et oléagineux :** excellents, mais denses. Une poignée d'amandes (30 g) fait environ 180 kcal, une datte environ 20 à 25 kcal.",
              "**La friture :** frire ajoute de l'huile invisible (brik, frites, beignets).",
            ),
          ),
        },
      },
      {
        heading: { en: "How photo scans work", fr: "Comment fonctionne l'analyse photo" },
        body: {
          en: md(
            "When you photograph a meal, NutriLens identifies the foods, estimates portion sizes from the picture and uses typical nutrition values. It's a fast, useful estimate, but it can't see everything:",
            ul(
              "It can't see **oil** soaked into the food or hidden under it.",
              "It can't see **sugar** dissolved in a drink or sauce.",
              "Portion size is hard to judge from a photo: a deep plate can look like a shallow one.",
            ),
            "After each scan, check the portion and add any oil, butter or sugar it may have missed. Ten seconds of correction makes a big difference.",
          ),
          fr: md(
            "Quand tu prends un repas en photo, NutriLens identifie les aliments, estime les portions à partir de l'image et utilise des valeurs nutritionnelles typiques. C'est une estimation rapide et utile, mais elle ne voit pas tout :",
            ul(
              "Elle ne voit pas l'**huile** absorbée par les aliments ou cachée au fond de l'assiette.",
              "Elle ne voit pas le **sucre** dissous dans une boisson ou une sauce.",
              "La taille d'une portion est difficile à juger sur une photo : une assiette creuse peut ressembler à une assiette plate.",
            ),
            "Après chaque analyse, vérifie la portion et ajoute l'huile, le beurre ou le sucre qui ont pu lui échapper. Dix secondes de correction font une vraie différence.",
          ),
        },
      },
    ],
    keyTakeaways: {
      en: [
        "Use the per-100 g column; package servings are often smaller than real portions.",
        "Weigh your food for about two weeks to train your eye.",
        "Olive oil is about 120 kcal per tablespoon: measure it with a spoon and log it.",
        "Photo scans are estimates: check the portion and add hidden oil or sugar.",
      ],
      fr: [
        "Fie-toi à la colonne pour 100 g ; les portions des emballages sont souvent plus petites que les vraies.",
        "Pèse tes aliments pendant environ deux semaines pour entraîner ton œil.",
        "L'huile d'olive, c'est environ 120 kcal par cuillère à soupe : mesure-la et note-la.",
        "L'analyse photo donne une estimation : vérifie la portion et ajoute l'huile ou le sucre cachés.",
      ],
    },
    related: ['calories-101', 'hunger-tips', 'macros-carbs-fats', 'consistency-mindset'],
  },

  // ---------------------------------------------------------------------------
  // 8. Managing hunger
  // ---------------------------------------------------------------------------
  {
    id: 'hunger-tips',
    category: 'habits',
    icon: 'Apple',
    minutes: 5,
    title: {
      en: "Managing hunger in real life",
      fr: "Gérer la faim au quotidien",
    },
    summary: {
      en: "Practical ways to feel full on fewer calories, from volume eating to bread, sweet tea and family meals.",
      fr: "Des astuces concrètes pour avoir moins faim avec moins de calories : volume, pain, thé sucré et repas de famille.",
    },
    sections: [
      {
        heading: { en: "Some hunger is normal", fr: "Un peu de faim, c'est normal" },
        body: {
          en: md(
            "Feeling a little hungry before meals is normal in a deficit; it doesn't mean something is wrong. The goal isn't zero hunger, it's hunger you can live with. These habits make a big difference.",
          ),
          fr: md(
            "Avoir un peu faim avant les repas est normal en déficit : ça ne veut pas dire que quelque chose ne va pas. Le but n'est pas de ne jamais avoir faim, mais d'avoir une faim gérable. Ces habitudes font une grosse différence.",
          ),
        },
      },
      {
        heading: { en: "More food for fewer calories", fr: "Manger plus pour moins de calories" },
        body: {
          en: md(
            ul(
              "**Protein first:** start each meal with your protein; it's the most filling macro.",
              "**Half the plate in vegetables:** salade tunisienne (tomato, cucumber, onion), grilled peppers, roasted or steamed vegetables. Lots of food, few calories.",
              "**Soup:** a bowl of chorba or vegetable soup before the main dish takes the edge off hunger.",
              "**Fruit over juice:** an orange fills you up; a glass of orange juice doesn't.",
              "**Fiber:** legumes, oats and whole grains digest slowly and keep you full longer.",
            ),
          ),
          fr: md(
            ul(
              "**Les protéines d'abord :** commence chaque repas par ta portion de protéines, c'est le macro le plus rassasiant.",
              "**La moitié de l'assiette en légumes :** salade tunisienne (tomate, concombre, oignon), poivrons grillés, légumes rôtis ou vapeur. Beaucoup de volume, peu de calories.",
              "**La soupe :** un bol de chorba ou de soupe de légumes avant le plat principal calme la faim.",
              "**Le fruit plutôt que le jus :** une orange cale ; un verre de jus d'orange, beaucoup moins.",
              "**Les fibres :** légumineuses, flocons d'avoine et céréales complètes se digèrent lentement et tiennent au corps plus longtemps.",
            ),
          ),
        },
      },
      {
        heading: { en: "Everyday Tunisian habits", fr: "Les habitudes du quotidien en Tunisie" },
        body: {
          en: md(
            ul(
              "**Bread with every meal:** keep it, but decide your portion before you start (for example a quarter of a baguette), and don't use it to mop up the oil at the bottom of the plate. Whole-wheat or barley bread is more filling.",
              "**Sweet tea:** cut the sugar step by step, from 4 teaspoons to 3, then 2. Your taste adapts within a few weeks. Sweeteners are a fine option too.",
              "**Pastries and sweets:** no need to ban them. Plan them: if you know there'll be makroudh or baklawa with coffee, fit it into the day and keep the other meals lighter.",
              "**Ramadan iftar:** break the fast with water, dates and soup, pause, then eat your main plate. The Ramadan lesson has more.",
            ),
          ),
          fr: md(
            ul(
              "**Le pain à chaque repas :** garde-le, mais décide de ta portion avant de commencer (par exemple un quart de baguette), et évite de saucer l'huile au fond de l'assiette. Le pain complet ou d'orge cale davantage.",
              "**Le thé sucré :** réduis le sucre petit à petit, de 4 cuillères à café à 3, puis à 2. Ton goût s'habitue en quelques semaines. Les édulcorants sont aussi une option valable.",
              "**Pâtisseries et douceurs :** pas besoin de les interdire. Planifie-les : si tu sais qu'il y aura du makroudh ou de la baklawa avec le café, intègre-les dans ta journée et allège les autres repas.",
              "**L'iftar du Ramadan :** romps le jeûne avec de l'eau, des dattes et une soupe, fais une pause, puis mange ton plat principal. La leçon sur le Ramadan en dit plus.",
            ),
          ),
        },
      },
      {
        heading: { en: "Plan ahead", fr: "Anticipe" },
        body: {
          en: md(
            "Hunger wins when there's no plan. Log your main meals in the morning or the night before, keep easy snacks around (yogurt, fruit, boiled eggs, lben), and don't skip lunch only to reach dinner starving.",
          ),
          fr: md(
            "La faim gagne quand il n'y a pas de plan. Note tes repas principaux le matin ou la veille, garde des collations faciles sous la main (yaourt, fruit, œufs durs, lben), et évite de sauter le déjeuner pour arriver au dîner avec une faim de loup.",
          ),
        },
      },
      {
        heading: { en: "Eating out, family meals and weekends", fr: "Restaurants, repas de famille et week-ends" },
        body: {
          en: md(
            ul(
              "Choose grilled over fried, ask for the sauce on the side, and serve yourself one plate.",
              "A polite “no thanks, I've had enough” is allowed. So is enjoying the meal.",
              "Weekends often erase the weekday deficit. You don't need to be perfect; just stay roughly on target.",
              "One big meal doesn't ruin anything. Go back to normal at the next meal; no need to starve yourself to compensate.",
            ),
          ),
          fr: md(
            ul(
              "Préfère le grillé au frit, demande la sauce à part et sers-toi une seule assiette.",
              "Dire poliment « non merci, j'ai assez mangé » est permis. Profiter du repas aussi.",
              "Les week-ends effacent souvent le déficit de la semaine. Pas besoin de perfection : reste à peu près dans ton objectif.",
              "Un gros repas ne gâche rien. Reprends normalement au repas suivant, sans te priver pour compenser.",
            ),
          ),
        },
      },
      {
        heading: { en: "Sleep and stress", fr: "Sommeil et stress" },
        body: {
          en: md(
            "Short sleep raises hunger hormones and cravings, and stress does too. Getting 7–9 hours of sleep is one of the easiest hunger fixes there is.",
          ),
          fr: md(
            "Le manque de sommeil augmente les hormones de la faim et les envies de sucré, et le stress aussi. Dormir 7 à 9 heures est l'une des solutions les plus simples contre la faim.",
          ),
        },
      },
    ],
    keyTakeaways: {
      en: [
        "Start with protein and fill half your plate with vegetables or soup.",
        "Decide your bread portion in advance and measure the oil.",
        "Plan treats into your day instead of banning them.",
        "Plan your meals and sleep 7–9 hours to keep hunger manageable.",
      ],
      fr: [
        "Commence par les protéines et remplis la moitié de ton assiette de légumes ou de soupe.",
        "Décide de ta portion de pain à l'avance et mesure l'huile.",
        "Planifie tes plaisirs dans la journée au lieu de les interdire.",
        "Organise tes repas et dors 7 à 9 heures pour garder la faim sous contrôle.",
      ],
    },
    related: ['protein', 'reading-labels-portions', 'sleep-recovery', 'ramadan-fasting'],
  },

  // ---------------------------------------------------------------------------
  // 9. Strength training basics
  // ---------------------------------------------------------------------------
  {
    id: 'strength-training-basics',
    category: 'training',
    icon: 'Dumbbell',
    minutes: 5,
    title: {
      en: "Strength training: why and how to start",
      fr: "La musculation : pourquoi et comment commencer",
    },
    summary: {
      en: "Why lifting matters even when your goal is fat loss, and the principle behind all progress: progressive overload.",
      fr: "Pourquoi soulever des poids compte même si ton but est de perdre du gras, et le principe derrière tout progrès : la surcharge progressive.",
    },
    sections: [
      {
        heading: { en: "Why lift if you want to lose fat?", fr: "Pourquoi faire de la muscu si tu veux perdre du gras ?" },
        body: {
          en: md(
            "In a deficit, your body loses weight from somewhere. If it has no reason to keep muscle, part of that weight comes from muscle. Strength training gives it that reason. Combined with enough protein, it means most of what you lose is fat.",
            "The result: at the same weight, you look firmer and more athletic, not just like a smaller version of yourself. Lifting also strengthens bones and joints, improves blood sugar control and makes daily life easier. And muscle burns a bit more energy than fat, though the effect is smaller than often claimed (roughly 10–15 kcal per kg of muscle per day).",
          ),
          fr: md(
            "En déficit, ton corps perd du poids quelque part. S'il n'a aucune raison de garder ses muscles, une partie de ce poids viendra du muscle. La musculation lui donne cette raison. Avec assez de protéines, la plus grande partie de ce que tu perds sera du gras.",
            "Résultat : à poids égal, ton corps paraît plus ferme et plus athlétique, pas juste une version plus petite de toi-même. La musculation renforce aussi les os et les articulations, améliore la gestion du sucre dans le sang et facilite la vie de tous les jours. Et le muscle brûle un peu plus d'énergie que le gras, même si l'effet est plus faible qu'on ne le dit souvent (environ 10 à 15 kcal par kg de muscle et par jour).",
          ),
        },
      },
      {
        heading: { en: "Progressive overload", fr: "La surcharge progressive" },
        body: {
          en: md(
            "Muscles adapt to what you ask of them. To keep improving, you need to ask a bit more over time: that's **progressive overload**. You can do it by:",
            ul(
              "Adding weight (for example from 40 kg to 42.5 kg)",
              "Doing more reps with the same weight",
              "Adding a set",
              "Improving your technique and range of motion",
            ),
            "Small, regular increases beat big jumps. Logging your workouts is how you know you're progressing.",
          ),
          fr: md(
            "Tes muscles s'adaptent à ce que tu leur demandes. Pour continuer à progresser, il faut leur en demander un peu plus avec le temps : c'est la **surcharge progressive**. Tu peux y arriver de plusieurs façons :",
            ul(
              "Ajouter du poids (par exemple passer de 40 à 42,5 kg)",
              "Faire plus de répétitions avec le même poids",
              "Ajouter une série",
              "Améliorer ta technique et ton amplitude de mouvement",
            ),
            "De petites augmentations régulières valent mieux que de gros sauts. Noter tes séances, c'est ce qui te permet de savoir si tu progresses.",
          ),
        },
      },
      {
        heading: { en: "Compound vs isolation exercises", fr: "Exercices polyarticulaires ou d'isolation" },
        body: {
          en: md(
            ul(
              "**Compound exercises** work several muscles and joints at once: squats, deadlifts and other hip hinges, bench press, overhead press, rows, pull-ups or lat pulldowns, lunges. They give the most results for your time and should be the core of your plan.",
              "**Isolation exercises** target one muscle: biceps curls, triceps extensions, lateral raises, leg curls, calf raises. They're useful extras to bring up specific muscles.",
            ),
            "A solid beginner session: 3–5 compound exercises plus 1–2 isolation exercises.",
          ),
          fr: md(
            ul(
              "Les **exercices polyarticulaires** (ou composés) font travailler plusieurs muscles et articulations à la fois : squat, soulevé de terre et autres charnières de hanche, développé couché, développé militaire, rowing, tractions ou tirage vertical, fentes. Ils donnent le plus de résultats pour ton temps et doivent former la base de ton programme.",
              "Les **exercices d'isolation** ciblent un seul muscle : curl biceps, extensions triceps, élévations latérales, leg curl, mollets. Ce sont des compléments utiles pour développer des muscles précis.",
            ),
            "Une bonne séance de débutant : 3 à 5 exercices polyarticulaires et 1 ou 2 exercices d'isolation.",
          ),
        },
      },
      {
        heading: { en: "Beginner gains are real", fr: "Les progrès du débutant sont bien réels" },
        body: {
          en: md(
            "If you've never trained seriously, you'll progress fast. The first months bring quick strength gains (largely your nervous system learning the movements) and visible muscle growth, even while losing fat. Enjoy it: it's some of the best motivation you'll ever get.",
          ),
          fr: md(
            "Si tu n'as jamais fait de musculation sérieusement, tu vas progresser vite. Les premiers mois apportent des gains de force rapides (surtout parce que ton système nerveux apprend les mouvements) et une prise de muscle visible, même en perdant du gras. Profites-en : c'est l'une des meilleures motivations qui soient.",
          ),
        },
      },
      {
        heading: { en: "How often to train", fr: "À quelle fréquence s'entraîner" },
        body: {
          en: md(
            ul(
              "**2–3 full-body sessions per week** is ideal for most beginners, with at least one rest day in between.",
              "Aim to train each muscle group about **twice a week**.",
              "Sessions of 45–75 minutes are plenty.",
            ),
            "Consistency beats the perfect program: a simple plan followed for a year beats a perfect plan abandoned after a month.",
          ),
          fr: md(
            ul(
              "**2 à 3 séances full-body par semaine**, c'est idéal pour la plupart des débutants, avec au moins un jour de repos entre deux séances.",
              "Vise à travailler chaque groupe musculaire environ **deux fois par semaine**.",
              "Des séances de 45 à 75 minutes suffisent largement.",
            ),
            "La régularité compte plus que le programme parfait : un plan simple suivi pendant un an bat un plan parfait abandonné au bout d'un mois.",
          ),
        },
      },
    ],
    keyTakeaways: {
      en: [
        "Lifting during a deficit helps make sure most of the weight you lose is fat, not muscle.",
        "Progress comes from progressive overload: a bit more weight, reps or sets over time.",
        "Build sessions around compound exercises, with isolation work as extras.",
        "2–3 full-body sessions per week is an ideal start.",
      ],
      fr: [
        "Faire de la musculation en déficit aide à ce que la majorité du poids perdu soit du gras, pas du muscle.",
        "Le progrès vient de la surcharge progressive : un peu plus de poids, de répétitions ou de séries avec le temps.",
        "Construis tes séances autour des exercices polyarticulaires, avec l'isolation en complément.",
        "2 à 3 séances full-body par semaine, c'est le départ idéal.",
      ],
    },
    related: ['sets-reps-rir', 'form-and-safety', 'protein', 'recomp-and-gaining'],
  },

  // ---------------------------------------------------------------------------
  // 10. Sets, reps and RIR
  // ---------------------------------------------------------------------------
  {
    id: 'sets-reps-rir',
    category: 'training',
    icon: 'Repeat',
    minutes: 5,
    title: {
      en: "Sets, reps and effort (RIR)",
      fr: "Séries, répétitions et effort (RIR)",
    },
    summary: {
      en: "The vocabulary of a workout, how hard each set should feel, and a simple system for knowing when to add weight.",
      fr: "Le vocabulaire d'une séance, l'intensité à viser sur chaque série, et une méthode simple pour savoir quand augmenter la charge.",
    },
    sections: [
      {
        heading: { en: "The basic vocabulary", fr: "Le vocabulaire de base" },
        body: {
          en: md(
            ul(
              "A **rep** (repetition) is one complete movement: lowering and lifting the bar once.",
              "A **set** is a group of reps done without stopping, for example 10 reps.",
              "**Rest** is the break between sets.",
            ),
            "So “3 × 8–12” means 3 sets of 8 to 12 reps.",
          ),
          fr: md(
            ul(
              "Une **répétition** (ou « rep ») est un mouvement complet : descendre et remonter la barre une fois.",
              "Une **série** est un groupe de répétitions enchaînées sans pause, par exemple 10 répétitions.",
              "Le **repos** est la pause entre deux séries.",
            ),
            "Donc « 3 × 8–12 » veut dire 3 séries de 8 à 12 répétitions.",
          ),
        },
      },
      {
        heading: { en: "How many reps and sets?", fr: "Combien de répétitions et de séries ?" },
        body: {
          en: md(
            "Muscles grow across a wide range of reps, roughly 5 to 30, as long as the sets are hard. In practice:",
            ul(
              "**6–10 reps** for big compound lifts (squat, bench press, rows)",
              "**8–15 reps** for smaller and isolation exercises",
            ),
            "For weekly volume, research supports about **10–20 hard sets per muscle group per week** for growth. Beginners do great at the lower end: around 10 sets per muscle per week is plenty to start.",
            "**Rest:** about 2–3 minutes for heavy compound lifts, 1–2 minutes for isolation exercises. Resting enough lets you do more quality reps.",
          ),
          fr: md(
            "Les muscles se développent sur une large plage de répétitions, environ 5 à 30, à condition que les séries soient difficiles. En pratique :",
            ul(
              "**6 à 10 répétitions** pour les gros exercices polyarticulaires (squat, développé couché, rowing)",
              "**8 à 15 répétitions** pour les petits exercices et l'isolation",
            ),
            "Côté volume, la recherche soutient environ **10 à 20 séries difficiles par groupe musculaire et par semaine** pour la croissance. Les débutants progressent très bien dans le bas de la fourchette : environ 10 séries par muscle et par semaine suffisent pour commencer.",
            "**Repos :** environ 2 à 3 minutes pour les gros exercices lourds, 1 à 2 minutes pour l'isolation. Bien récupérer te permet de faire plus de répétitions de qualité.",
          ),
        },
      },
      {
        heading: { en: "RIR: reps in reserve", fr: "Le RIR : les répétitions en réserve" },
        body: {
          en: md(
            "**RIR** means “reps in reserve”: how many more reps you could have done before failing. It's how you measure effort.",
            ul(
              "**RIR 0:** you couldn't do a single more rep (that's failure).",
              "**RIR 2:** you stopped with about 2 good reps left in the tank.",
            ),
            "For most sets, aim to **stop with 1–3 reps left in the tank**. That's hard enough to grow, without the extra fatigue and injury risk of going to failure every time. On isolation exercises and machines, going closer to failure is fine.",
            "You may also see **RPE** (rate of perceived exertion, out of 10): RPE 8 ≈ 2 reps left, RPE 9 ≈ 1 rep left, RPE 10 = failure.",
            "Beginners usually underestimate how much they have left. Now and then, on a safe exercise like a machine, push one set to failure to learn where your real limit is.",
          ),
          fr: md(
            "**RIR** signifie « reps in reserve », les répétitions en réserve : combien de répétitions tu aurais encore pu faire avant l'échec. C'est ta façon de mesurer l'effort.",
            ul(
              "**RIR 0 :** impossible de faire une répétition de plus (c'est l'échec).",
              "**RIR 2 :** tu stoppes la série avec encore environ 2 bonnes répétitions en réserve.",
            ),
            "Sur la plupart des séries, vise à **t'arrêter en gardant 1 à 3 répétitions en réserve**. C'est assez dur pour progresser, sans la fatigue et le risque de blessure supplémentaires de l'échec à chaque série. Sur l'isolation et les machines, s'approcher davantage de l'échec ne pose pas de problème.",
            "Tu croiseras aussi le **RPE** (effort perçu, sur 10) : RPE 8 ≈ 2 répétitions en réserve, RPE 9 ≈ 1, RPE 10 = échec.",
            "Les débutants sous-estiment souvent ce qu'il leur reste. De temps en temps, sur un exercice sans risque comme une machine, pousse une série jusqu'à l'échec pour découvrir ta vraie limite.",
          ),
        },
      },
      {
        heading: { en: "Double progression", fr: "La double progression" },
        body: {
          en: md(
            "A simple way to know when to add weight:",
            ul(
              "Pick a rep range, for example 8–12, and a weight you can lift for 8 good reps.",
              "Each session, try to add a rep or two.",
              "When you reach **the top of the range (12) on all sets** with good form, add weight: about 2.5–5 kg for lower-body lifts, 1–2.5 kg for upper-body lifts.",
              "Your reps drop back to around 8; build them up again.",
            ),
            "Example, 3 sets at 40 kg: 9, 8, 8 → the next week 11, 10, 9 → then 12, 12, 12 → move up to 42.5 kg.",
          ),
          fr: md(
            "Une méthode simple pour savoir quand augmenter la charge :",
            ul(
              "Choisis une plage de répétitions, par exemple 8 à 12, et un poids que tu peux soulever 8 fois proprement.",
              "À chaque séance, essaie d'ajouter une ou deux répétitions.",
              "Quand tu atteins **le haut de la plage (12) sur toutes les séries** avec une bonne technique, ajoute du poids : environ 2,5 à 5 kg pour le bas du corps, 1 à 2,5 kg pour le haut du corps.",
              "Tes répétitions redescendent vers 8 ; fais-les remonter à nouveau.",
            ),
            "Exemple, 3 séries à 40 kg : 9, 8, 8 → la semaine suivante 11, 10, 9 → puis 12, 12, 12 → passage à 42,5 kg.",
          ),
        },
      },
      {
        heading: { en: "Track everything", fr: "Note tout" },
        body: {
          en: md(
            "Log the weight, the reps and how hard it felt for every set. Without a log you're guessing; with one, you can see exactly when to push and when you're stuck.",
          ),
          fr: md(
            "Note le poids, les répétitions et la difficulté ressentie pour chaque série. Sans carnet, tu devines ; avec, tu vois exactement quand pousser et quand tu stagnes.",
          ),
        },
      },
    ],
    keyTakeaways: {
      en: [
        "A rep is one movement, a set is a group of reps, rest is the break between sets.",
        "Aim for about 10–20 hard sets per muscle per week; beginners can start around 10.",
        "Stop most sets with 1–3 reps left in the tank (RIR 1–3).",
        "Double progression: reach the top of your rep range on all sets, then add weight.",
      ],
      fr: [
        "Une répétition est un mouvement, une série un groupe de répétitions, le repos la pause entre les séries.",
        "Vise environ 10 à 20 séries difficiles par muscle et par semaine ; les débutants peuvent commencer autour de 10.",
        "Arrête la plupart des séries avec 1 à 3 répétitions en réserve (RIR 1 à 3).",
        "Double progression : atteins le haut de ta plage de répétitions sur toutes les séries, puis ajoute du poids.",
      ],
    },
    related: ['strength-training-basics', 'form-and-safety', 'sleep-recovery'],
  },

  // ---------------------------------------------------------------------------
  // 11. Form and safety
  // ---------------------------------------------------------------------------
  {
    id: 'form-and-safety',
    category: 'training',
    icon: 'ShieldCheck',
    minutes: 5,
    title: {
      en: "Good form and training safely",
      fr: "Bonne technique et sécurité",
    },
    summary: {
      en: "How to warm up, learn technique, tell good effort from bad pain, and adapt exercises around sensitive joints.",
      fr: "Comment s'échauffer, apprendre la technique, distinguer l'effort d'une mauvaise douleur, et adapter les exercices aux articulations sensibles.",
    },
    sections: [
      {
        heading: { en: "Warm up properly", fr: "Bien s'échauffer" },
        body: {
          en: md(
            "A good warm-up takes 5–10 minutes:",
            ul(
              "**5 minutes of light cardio** (bike, brisk walk, rowing machine) to raise your body temperature.",
              "**2–3 ramp-up sets** for your first exercise: for example, if your working weight is 60 kg, do 10 reps with the empty bar, 5 with 40 kg, 3 with 50 kg, then start.",
            ),
            "You don't need a long stretching routine before lifting. A few dynamic movements for the joints you'll use are enough.",
          ),
          fr: md(
            "Un bon échauffement prend 5 à 10 minutes :",
            ul(
              "**5 minutes de cardio léger** (vélo, marche rapide, rameur) pour faire monter la température du corps.",
              "**2 à 3 séries de montée en charge** sur ton premier exercice : par exemple, si ta charge de travail est de 60 kg, fais 10 répétitions avec la barre à vide, puis 5 répétitions avec 40 kg, 3 avec 50 kg, et commence.",
            ),
            "Pas besoin d'une longue séance d'étirements avant de soulever. Quelques mouvements dynamiques pour les articulations que tu vas utiliser suffisent.",
          ),
        },
      },
      {
        heading: { en: "Learn the technique first", fr: "Apprends d'abord la technique" },
        body: {
          en: md(
            "For the first weeks, choose weights that let you focus on the movement. Film your sets from the side, compare them with good tutorial videos, or ask an experienced coach to check your squat, deadlift and presses.",
            "The basics for almost every exercise:",
            ul(
              "**Control the weight:** lower it in about 2–3 seconds, no bouncing or dropping.",
              "**A full, pain-free range of motion.**",
              "**Brace your core** (deep breath, tight belly) on heavy lifts.",
              "**The same technique on every rep.** If your form breaks down, the set is over.",
            ),
          ),
          fr: md(
            "Les premières semaines, choisis des charges qui te laissent te concentrer sur le mouvement. Filme-toi de profil, compare avec de bonnes vidéos explicatives, ou demande à un coach expérimenté de vérifier ton squat, ton soulevé de terre et tes développés.",
            "Les bases pour presque tous les exercices :",
            ul(
              "**Contrôle la charge :** descends en 2 à 3 secondes environ, sans rebond ni chute.",
              "**Une amplitude complète et sans douleur.**",
              "**Gaine ton tronc** (grande inspiration, ventre serré) sur les charges lourdes.",
              "**La même technique à chaque répétition.** Si la technique se dégrade, la série est terminée.",
            ),
          ),
        },
      },
      {
        heading: { en: "Effort vs pain", fr: "Effort ou douleur ?" },
        body: {
          en: md(
            "Training should feel hard. It shouldn't hurt in the wrong way.",
            ul(
              "**Normal:** burning in the muscle, heavy breathing, shaking at the end of a hard set, soreness 1–3 days later (DOMS).",
              "**Not normal:** sharp or stabbing pain, pain inside a joint, pain that changes how you move, numbness or tingling, pain that gets worse from session to session.",
            ),
            "If you feel the second kind, stop the exercise. Don't push through it.",
          ),
          fr: md(
            "L'entraînement doit être dur. Il ne doit pas faire mal de la mauvaise façon.",
            ul(
              "**Normal :** brûlure dans le muscle, respiration forte, tremblements en fin de série difficile, courbatures 1 à 3 jours après (DOMS).",
              "**Pas normal :** douleur vive ou en coup de poignard, douleur dans une articulation, douleur qui change ta façon de bouger, engourdissement ou fourmillements, douleur qui s'aggrave de séance en séance.",
            ),
            "Si tu ressens le deuxième type, arrête l'exercice. Ne force pas.",
          ),
        },
      },
      {
        heading: { en: "Working around sensitive areas", fr: "Contourner les zones sensibles" },
        body: {
          en: md(
            "Pain on one exercise doesn't mean you stop training that muscle. Find a pain-free variation:",
            ul(
              "**Knees:** box squats to a comfortable depth, leg press, step-ups, plus Romanian deadlifts and hip thrusts for the back of the legs.",
              "**Lower back:** goblet squats, chest-supported rows, hip thrusts, leg press; bring hinge movements back gradually with light weights.",
              "**Shoulders:** a neutral grip (palms facing each other), landmine press, incline press instead of overhead press, cable work, and a slightly shorter range of motion.",
            ),
            "If pain lasts more than a week or two, or comes from an injury, see a doctor or physiotherapist.",
          ),
          fr: md(
            "Avoir mal sur un exercice ne veut pas dire arrêter de travailler ce muscle. Trouve une variante sans douleur :",
            ul(
              "**Genoux :** box squat à une profondeur confortable, presse à cuisses, step-ups, et soulevé de terre roumain ou hip thrust pour l'arrière des jambes.",
              "**Bas du dos :** goblet squat, rowing poitrine appuyée, hip thrust, presse à cuisses ; réintroduis les charnières de hanche progressivement avec des charges légères.",
              "**Épaules :** prise neutre (paumes face à face), landmine press, développé incliné au lieu du développé militaire, travail à la poulie, et une amplitude légèrement réduite.",
            ),
            "Si la douleur dure plus d'une à deux semaines, ou vient d'une blessure, consulte un médecin ou un kinésithérapeute.",
          ),
        },
      },
      {
        heading: { en: "When to stop for the day", fr: "Quand arrêter la séance" },
        body: {
          en: md(
            "Stop the session if you feel dizzy or sick, or have chest pain or unusual shortness of breath, and get medical advice. If you have a heart condition or high blood pressure, or are pregnant, check with your doctor before starting a new program.",
          ),
          fr: md(
            "Arrête la séance en cas de vertiges, de nausée, de douleur dans la poitrine ou d'essoufflement inhabituel, et demande un avis médical. Si tu as un problème cardiaque, de l'hypertension ou si tu es enceinte, parles-en à ton médecin avant de commencer un nouveau programme.",
          ),
        },
      },
    ],
    keyTakeaways: {
      en: [
        "Warm up with light cardio and 2–3 lighter ramp-up sets.",
        "Learn technique with moderate weights and control every rep.",
        "Muscle burn and soreness are normal; sharp or joint pain means stop.",
        "Swap to a pain-free variation instead of skipping a muscle; see a physio if pain lasts.",
      ],
      fr: [
        "Échauffe-toi avec du cardio léger et 2 à 3 séries de montée en charge.",
        "Apprends la technique avec des charges modérées et contrôle chaque répétition.",
        "La brûlure musculaire et les courbatures sont normales ; une douleur vive ou articulaire veut dire stop.",
        "Passe à une variante sans douleur plutôt que d'abandonner un muscle ; consulte un kiné si la douleur persiste.",
      ],
    },
    related: ['strength-training-basics', 'sets-reps-rir', 'sleep-recovery'],
  },

  // ---------------------------------------------------------------------------
  // 12. Steps and cardio
  // ---------------------------------------------------------------------------
  {
    id: 'steps-cardio',
    category: 'training',
    icon: 'Footprints',
    minutes: 5,
    title: {
      en: "Steps and cardio",
      fr: "Les pas et le cardio",
    },
    summary: {
      en: "Why daily steps quietly drive fat loss, how to use cardio well, and why your watch's calorie number is only a guess.",
      fr: "Pourquoi tes pas quotidiens font discrètement fondre le gras, comment bien utiliser le cardio, et pourquoi les calories affichées par ta montre ne sont qu'une estimation.",
    },
    sections: [
      {
        heading: { en: "Steps: the underrated fat-loss tool", fr: "Les pas : l'outil sous-estimé" },
        body: {
          en: md(
            "Remember NEAT: all the movement outside the gym. Walking is its biggest and easiest part. Depending on your weight and pace, **1,000 steps burn roughly 30–50 kcal**. Going from 4,000 to 10,000 steps a day can mean 200–300 extra kcal burned every day, with little extra hunger or fatigue.",
            "Your target is **{{stepsTarget}} steps per day**. If you're far from it, build up gradually: add about 1,000–2,000 steps per day each week.",
          ),
          fr: md(
            "Souviens-toi de la NEAT : tout le mouvement en dehors de la salle. La marche en est la partie la plus importante et la plus facile. Selon ton poids et ton allure, **1 000 pas brûlent environ 30 à 50 kcal**. Passer de 4 000 à 10 000 pas par jour peut représenter 200 à 300 kcal de plus chaque jour, sans beaucoup plus de faim ni de fatigue.",
            "Ton objectif est de **{{stepsTarget}} pas par jour**. Si tu en es loin, augmente progressivement : environ 1 000 à 2 000 pas par jour de plus chaque semaine.",
          ),
        },
      },
      {
        heading: { en: "Easy ways to walk more", fr: "Des façons simples de marcher plus" },
        body: {
          en: md(
            ul(
              "A 10–15 minute walk after meals (also good for digestion and blood sugar)",
              "Phone calls on foot",
              "Stairs instead of the elevator",
              "Getting off the bus or metro one stop early, or parking further away",
              "An evening walk once the summer heat drops",
            ),
            "During a diet, your body tends to move less without you noticing. Tracking your steps (your watch or phone can send them to the app through Health Connect) keeps NEAT from quietly dropping.",
          ),
          fr: md(
            ul(
              "Une marche de 10 à 15 minutes après les repas (bon aussi pour la digestion et la glycémie)",
              "Téléphoner en marchant",
              "Les escaliers plutôt que l'ascenseur",
              "Descendre un arrêt plus tôt du bus ou du métro, ou se garer plus loin",
              "Une balade le soir, quand la chaleur de l'été retombe",
            ),
            "Pendant un régime, ton corps a tendance à moins bouger sans que tu t'en rendes compte. Suivre tes pas (ta montre ou ton téléphone peut les envoyer à l'appli via Health Connect) évite que ta NEAT baisse en silence.",
          ),
        },
      },
      {
        heading: { en: "Types of cardio", fr: "Les types de cardio" },
        body: {
          en: md(
            ul(
              "**Low intensity (zone 2):** brisk walking, easy cycling, light jogging. You can still talk in full sentences. Easy to recover from and great for heart health.",
              "**High intensity (intervals):** short hard efforts with easy breaks, for example 30 seconds fast, 90 seconds easy, 6–10 times. Time-efficient, but more tiring and harder to recover from.",
            ),
            "Rough heart-rate zones: estimate your maximum heart rate as **220 minus your age**; it's only a rough guide, often off by 10 beats or more. Zone 2 is about 60–70% of that; intervals push you above 80–85%.",
            "For health, aim for about **150 minutes of moderate cardio per week** (or 75 minutes of vigorous). Cardio helps your heart and burns extra calories, but your diet sets the pace of fat loss and lifting protects your muscle.",
          ),
          fr: md(
            ul(
              "**Basse intensité (zone 2) :** marche rapide, vélo tranquille, footing léger. Tu peux encore parler en phrases complètes. Facile à récupérer et excellent pour le cœur.",
              "**Haute intensité (fractionné) :** de courts efforts intenses avec des pauses faciles, par exemple 30 secondes vite, 90 secondes tranquille, 6 à 10 fois. Efficace en peu de temps, mais plus fatigant et plus dur à récupérer.",
            ),
            "Zones de fréquence cardiaque, en gros : estime ta fréquence cardiaque maximale à **220 moins ton âge** ; ce n'est qu'un repère approximatif, souvent faux de 10 battements ou plus. La zone 2 correspond à environ 60 à 70 % de ce chiffre ; le fractionné te fait monter au-delà de 80 à 85 %.",
            "Pour la santé, vise environ **150 minutes de cardio modéré par semaine** (ou 75 minutes de cardio intense). Le cardio aide ton cœur et brûle des calories en plus, mais c'est ton alimentation qui fixe le rythme de la perte de gras, et la musculation qui protège ton muscle.",
          ),
        },
      },
      {
        heading: { en: "Don't eat back your watch's calories", fr: "Ne remange pas les calories de ta montre" },
        body: {
          en: md(
            "Smartwatches and gym machines estimate calories burned, and they're often **off by 20–40%**, usually too high. If your watch says a run burned 600 kcal, the real number may be closer to 400. Step counts are fairly reliable; calorie estimates are the shaky part.",
            "Your plan's activity level already includes your usual training. If you want to eat more on very active days, eat back **at most about half** of the extra calories your watch shows. The app's adjustment from your real weight trend takes care of the rest.",
          ),
          fr: md(
            "Les montres connectées et les machines de salle estiment les calories brûlées, et elles se trompent souvent de **20 à 40 %**, généralement vers le haut. Si ta montre annonce 600 kcal pour un footing, le vrai chiffre est peut-être plus proche de 400. Le nombre de pas est assez fiable ; c'est l'estimation des calories qui l'est beaucoup moins.",
            "Le niveau d'activité de ton plan inclut déjà tes entraînements habituels. Si tu veux manger plus les jours très actifs, ne remange **qu'environ la moitié, au maximum,** des calories supplémentaires affichées par ta montre. L'ajustement de l'appli à partir de ta vraie courbe de poids fait le reste.",
          ),
        },
      },
    ],
    keyTakeaways: {
      en: [
        "Daily steps are an easy, low-stress way to burn more: aim for {{stepsTarget}} per day.",
        "Zone 2 (you can still talk) is easy to recover from; intervals are efficient but tiring.",
        "Aim for about 150 minutes of moderate cardio per week for heart health.",
        "Watch calorie estimates are often 20–40% too high; eat back half at most.",
      ],
      fr: [
        "Les pas quotidiens sont un moyen simple et peu fatigant de dépenser plus : vise {{stepsTarget}} pas par jour.",
        "La zone 2 (tu peux encore parler) se récupère facilement ; le fractionné est efficace mais fatigant.",
        "Vise environ 150 minutes de cardio modéré par semaine pour la santé du cœur.",
        "Les calories des montres sont souvent surestimées de 20 à 40 % : n'en remange que la moitié au maximum.",
      ],
    },
    related: ['bmr-tdee', 'strength-training-basics', 'plateaus-adaptation', 'water'],
  },

  // ---------------------------------------------------------------------------
  // 13. Sleep and recovery
  // ---------------------------------------------------------------------------
  {
    id: 'sleep-recovery',
    category: 'habits',
    icon: 'Moon',
    minutes: 4,
    title: {
      en: "Sleep and recovery",
      fr: "Sommeil et récupération",
    },
    summary: {
      en: "Sleep is when your body rebuilds; skimping on it makes you hungrier and weaker. Here's how to recover well.",
      fr: "C'est pendant le sommeil que ton corps se reconstruit ; en manquer augmente ta faim et fait baisser tes performances. Voici comment bien récupérer.",
    },
    sections: [
      {
        heading: { en: "Sleep controls your hunger", fr: "Le sommeil contrôle ta faim" },
        body: {
          en: md(
            "Even a few short nights change your appetite hormones: **ghrelin** (which makes you hungry) goes up and **leptin** (which signals fullness) goes down. In studies, sleep-deprived people often eat a few hundred kcal more the next day, and crave sugary, fatty foods more.",
            "Sleep also affects what you lose: in one well-known study, dieters who slept about 5.5 hours lost noticeably less fat and more lean mass than when they slept 8.5 hours on the same diet.",
          ),
          fr: md(
            "Même quelques nuits courtes modifient tes hormones de l'appétit : la **ghréline** (qui donne faim) augmente et la **leptine** (qui signale la satiété) baisse. Dans les études, les personnes en manque de sommeil mangent souvent quelques centaines de kcal de plus le lendemain, et ont davantage envie d'aliments sucrés et gras.",
            "Le sommeil influence aussi ce que tu perds : dans une étude connue, des personnes au régime qui dormaient environ 5,5 heures ont perdu nettement moins de gras et plus de masse maigre que lorsqu'elles dormaient 8,5 heures, avec le même régime.",
          ),
        },
      },
      {
        heading: { en: "Muscles grow between sessions", fr: "Les muscles se construisent entre les séances" },
        body: {
          en: md(
            "Training is the signal; recovery is when you actually get stronger. Muscles repair and grow in the 24–72 hours after a session, especially during deep sleep.",
            "Aim for **7–9 hours per night**. Helpful habits:",
            ul(
              "Similar bed and wake times, even on weekends",
              "A cool, dark, quiet room (in summer, a fan or air conditioning helps a lot)",
              "No caffeine (coffee, strong tea, energy drinks) in the 6–8 hours before bed",
              "Less screen time in the last 30–60 minutes",
            ),
          ),
          fr: md(
            "L'entraînement envoie le signal ; c'est pendant la récupération que tu progresses vraiment. Les muscles se réparent et se développent dans les 24 à 72 heures après une séance, surtout pendant le sommeil profond.",
            "Vise **7 à 9 heures par nuit**. Quelques habitudes utiles :",
            ul(
              "Des heures de coucher et de lever régulières, même le week-end",
              "Une chambre fraîche, sombre et calme (en été, un ventilateur ou la clim aide beaucoup)",
              "Pas de caféine (café, thé fort, boissons énergisantes) dans les 6 à 8 heures avant le coucher",
              "Moins d'écrans dans les 30 à 60 dernières minutes",
            ),
          ),
        },
      },
      {
        heading: { en: "Rest days", fr: "Les jours de repos" },
        body: {
          en: md(
            "Rest days aren't lazy; they're part of the program. Training each muscle hard about twice a week, with at least 48 hours in between, works well for most people. On rest days, walking and light activity are great: they help recovery and keep your steps up.",
          ),
          fr: md(
            "Les jours de repos ne sont pas de la paresse : ils font partie du programme. Travailler chaque muscle intensément environ deux fois par semaine, avec au moins 48 heures entre deux séances, convient à la plupart des gens. Les jours de repos, la marche et l'activité légère sont parfaites : elles aident à récupérer et maintiennent tes pas.",
          ),
        },
      },
      {
        heading: { en: "Deloads", fr: "Les semaines de décharge (deload)" },
        body: {
          en: md(
            "After several weeks of hard training, fatigue builds up. A **deload** is a planned easier week: keep the same exercises, but cut the number of sets roughly in half and stay further from failure (around 3–4 reps in reserve).",
            "Beginners rarely need them on a fixed schedule. Take one every 6–10 weeks, or when you notice: lifts going down for 2 or more sessions, aching joints, poor sleep, or no motivation at all.",
          ),
          fr: md(
            "Après plusieurs semaines d'entraînement intense, la fatigue s'accumule. Une **décharge** (ou deload) est une semaine plus légère planifiée : garde les mêmes exercices, mais réduis le nombre de séries de moitié environ et reste plus loin de l'échec (environ 3 à 4 répétitions en réserve).",
            "Les débutants en ont rarement besoin selon un calendrier fixe. Fais-en une toutes les 6 à 10 semaines, ou quand tu remarques : des charges qui baissent pendant 2 séances ou plus, des articulations douloureuses, un mauvais sommeil, ou plus aucune motivation.",
          ),
        },
      },
      {
        heading: { en: "Stress counts too", fr: "Le stress compte aussi" },
        body: {
          en: md(
            "Work stress, exams or family pressure draw on the same recovery system as training. High stress can increase water retention (hiding fat loss on the scale), hunger and fatigue. In stressful weeks, it's smarter to cut training volume a little than to push harder.",
          ),
          fr: md(
            "Le stress au travail, les examens ou les tensions familiales puisent dans le même système de récupération que l'entraînement. Un stress élevé peut augmenter la rétention d'eau (ce qui masque la perte de gras sur la balance), la faim et la fatigue. Les semaines stressantes, il est plus malin de réduire un peu le volume d'entraînement que de forcer davantage.",
          ),
        },
      },
    ],
    keyTakeaways: {
      en: [
        "Short sleep increases hunger and cravings, and makes you lose more muscle in a deficit.",
        "Aim for 7–9 hours with a regular schedule, a cool dark room and no late caffeine.",
        "Rest days and occasional deload weeks are part of progress, not a break from it.",
        "In stressful weeks, train a little less rather than more.",
      ],
      fr: [
        "Le manque de sommeil augmente la faim et les envies, et fait perdre plus de muscle en déficit.",
        "Vise 7 à 9 heures avec des horaires réguliers, une chambre fraîche et sombre, et pas de caféine tardive.",
        "Les jours de repos et les semaines de décharge font partie du progrès, ce ne sont pas des pauses.",
        "Les semaines stressantes, entraîne-toi un peu moins plutôt que plus.",
      ],
    },
    related: ['hunger-tips', 'sets-reps-rir', 'plateaus-adaptation'],
  },

  // ---------------------------------------------------------------------------
  // 14. Water
  // ---------------------------------------------------------------------------
  {
    id: 'water',
    category: 'habits',
    icon: 'Droplets',
    minutes: 3,
    title: {
      en: "Water and hydration",
      fr: "L'eau et l'hydratation",
    },
    summary: {
      en: "How much to drink, why you need more in the Tunisian summer, and how water affects the number on the scale.",
      fr: "Combien boire, pourquoi il en faut plus pendant l'été tunisien, et comment l'eau joue sur le chiffre de la balance.",
    },
    sections: [
      {
        heading: { en: "How much to drink", fr: "Combien boire" },
        body: {
          en: md(
            "A practical guideline is about **30–35 ml per kg of bodyweight**. At {{weightKg}} kg, your target is about **{{waterL}} L per day**. Water, tea, coffee, lben and milk all count, and food (fruit, vegetables, soups) provides a good share too.",
            "You don't need to force it. Spread it over the day: a glass when you wake up, one with each meal, and a bottle during training.",
          ),
          fr: md(
            "Un repère pratique : environ **30 à 35 ml par kg de poids de corps**. À {{weightKg}} kg, ton objectif est d'environ **{{waterL}} L par jour**. L'eau, le thé, le café, le lben et le lait comptent tous, et l'alimentation (fruits, légumes, soupes) en apporte une bonne part.",
            "Pas besoin de te forcer. Répartis sur la journée : un verre au réveil, un à chaque repas, et une bouteille pendant l'entraînement.",
          ),
        },
      },
      {
        heading: { en: "Heat and training", fr: "Chaleur et entraînement" },
        body: {
          en: md(
            "You need more when you sweat. In the Tunisian summer, at 35–40 °C, you can lose a lot of water without noticing.",
            ul(
              "During training, drink about **0.5–1 L per hour**, more if you sweat heavily.",
              "On very hot days or after long, sweaty sessions, add a little salt or electrolytes to your food or water; sweat costs you sodium too.",
              "Train in the cooler hours (early morning or evening) when you can.",
            ),
          ),
          fr: md(
            "Tu as besoin de plus quand tu transpires. Pendant l'été tunisien, avec 35 à 40 °C, tu peux perdre beaucoup d'eau sans t'en rendre compte.",
            ul(
              "Pendant l'entraînement, bois environ **0,5 à 1 L par heure**, plus si tu transpires beaucoup.",
              "Les jours de forte chaleur ou après de longues séances très transpirantes, ajoute un peu de sel ou des électrolytes à ton alimentation ou à ton eau : la sueur fait aussi perdre du sodium.",
              "Entraîne-toi aux heures les plus fraîches (tôt le matin ou le soir) quand c'est possible.",
            ),
          ),
        },
      },
      {
        heading: { en: "How to check", fr: "Comment vérifier" },
        body: {
          en: md(
            "The simplest signs:",
            ul(
              "**Pale yellow urine:** you're well hydrated.",
              "**Dark urine, headache, dizziness, dry mouth, fatigue:** drink more.",
            ),
            "Thirst is a decent guide for most people, but in the heat and during exercise it can lag behind.",
          ),
          fr: md(
            "Les signes les plus simples :",
            ul(
              "**Urine jaune pâle :** ton hydratation est bonne.",
              "**Urine foncée, mal de tête, vertiges, bouche sèche, fatigue :** bois davantage.",
            ),
            "La soif est un assez bon guide pour la plupart des gens, mais par forte chaleur et pendant l'effort, elle peut arriver en retard.",
          ),
        },
      },
      {
        heading: { en: "Water and the scale", fr: "L'eau et la balance" },
        body: {
          en: md(
            "Drinking more water doesn't add fat. It can move the scale by a few hundred grams from day to day, but that's just water passing through. And, oddly, dehydration can make your body hold on to water.",
            "Water helps with hunger too: thirst is sometimes mistaken for hunger, and a glass of water before a meal can help you feel full sooner.",
          ),
          fr: md(
            "Boire plus d'eau ne fait pas prendre de gras. Ça peut faire bouger la balance de quelques centaines de grammes d'un jour à l'autre, mais c'est juste de l'eau de passage. Et paradoxalement, la déshydratation peut pousser ton corps à retenir l'eau.",
            "L'eau aide aussi contre la faim : on confond parfois soif et faim, et un verre d'eau avant le repas aide à atteindre la satiété plus vite.",
          ),
        },
      },
      {
        heading: { en: "Don't overdo it", fr: "N'en fais pas trop" },
        body: {
          en: md(
            "More isn't always better. Drinking huge amounts very fast (well over 1 L per hour for several hours) can dilute the sodium in your blood, which is dangerous. If you have a kidney or heart condition, follow your doctor's advice on fluids.",
          ),
          fr: md(
            "Plus n'est pas toujours mieux. Boire d'énormes quantités très vite (nettement plus de 1 L par heure pendant plusieurs heures) peut diluer le sodium dans le sang, ce qui est dangereux. Si tu as un problème rénal ou cardiaque, suis les conseils de ton médecin sur les liquides.",
          ),
        },
      },
    ],
    keyTakeaways: {
      en: [
        "Aim for about {{waterL}} L per day; tea, milk, lben, soups and fruit count too.",
        "Drink more in the heat and during training: roughly 0.5–1 L per hour of sweaty exercise.",
        "Pale yellow urine is a simple sign you're drinking enough.",
        "Water doesn't add fat; day-to-day water changes on the scale are just noise.",
      ],
      fr: [
        "Vise environ {{waterL}} L par jour ; le thé, le lait, le lben, les soupes et les fruits comptent aussi.",
        "Bois plus par forte chaleur et pendant l'entraînement : environ 0,5 à 1 L par heure d'effort transpirant.",
        "Une urine jaune pâle est un signe simple que tu bois assez.",
        "L'eau ne fait pas grossir ; ses variations sur la balance d'un jour à l'autre ne sont que du bruit.",
      ],
    },
    related: ['scale-lies', 'ramadan-fasting', 'steps-cardio'],
  },

  // ---------------------------------------------------------------------------
  // 15. Plateaus and adaptation
  // ---------------------------------------------------------------------------
  {
    id: 'plateaus-adaptation',
    category: 'body',
    icon: 'Hourglass',
    minutes: 5,
    title: {
      en: "Plateaus and metabolic adaptation",
      fr: "Plateaux et adaptation métabolique",
    },
    summary: {
      en: "Why fat loss slows down over time, how to tell a real plateau from a fake one, and what to do about it.",
      fr: "Pourquoi la perte de gras ralentit avec le temps, comment distinguer un vrai plateau d'un faux, et quoi faire.",
    },
    sections: [
      {
        heading: { en: "Why progress slows", fr: "Pourquoi les progrès ralentissent" },
        body: {
          en: md(
            "As you lose weight, your daily burn slowly drops. Three reasons:",
            ul(
              "**A lighter body costs less to run.** Every kilo lost lowers your BMR and makes movement a little cheaper.",
              "**You move less without noticing.** Fewer steps, less fidgeting: NEAT often drops during a diet.",
              "**Adaptive thermogenesis.** When food is scarcer, your body becomes a bit more energy-efficient.",
            ),
            "The good news: this adaptation is real but usually **modest**, often in the range of a few percent of your daily burn. Your metabolism isn't “broken” or in “starvation mode”. Your deficit just gets a bit smaller over time.",
          ),
          fr: md(
            "En perdant du poids, ta dépense quotidienne baisse doucement. Trois raisons :",
            ul(
              "**Un corps plus léger coûte moins cher à faire tourner.** Chaque kilo perdu fait baisser ton BMR et rend chaque mouvement un peu moins coûteux.",
              "**Tu bouges moins sans t'en rendre compte.** Moins de pas, moins de petits mouvements : la NEAT baisse souvent pendant un régime.",
              "**La thermogenèse adaptative.** Quand la nourriture se fait plus rare, ton corps devient un peu plus économe en énergie.",
            ),
            "La bonne nouvelle : cette adaptation est réelle mais généralement **modeste**, souvent de l'ordre de quelques pour cent de ta dépense quotidienne. Ton métabolisme n'est ni « cassé » ni en « mode famine ». Ton déficit devient simplement un peu plus petit avec le temps.",
          ),
        },
      },
      {
        heading: { en: "Real plateau or fake one?", fr: "Vrai ou faux plateau ?" },
        body: {
          en: md(
            "Most “plateaus” are water hiding fat loss (see “Why the scale lies”). Before changing anything, check:",
            ul(
              "Has your **weekly average** been flat for **3–4 weeks**?",
              "Have you been **logging honestly**, including oil, drinks, snacks and weekends?",
              "Have your **steps** dropped?",
              "Is your waist measurement unchanged too?",
            ),
            "If the answer to the first question is yes and your logging has been consistent, it's a real plateau.",
          ),
          fr: md(
            "La plupart des « plateaux » sont de l'eau qui masque la perte de gras (voir la leçon « Pourquoi la balance ment »). Avant de changer quoi que ce soit, vérifie :",
            ul(
              "Ta **moyenne hebdomadaire** est-elle stable depuis **3 à 4 semaines** ?",
              "As-tu **tout noté honnêtement**, y compris l'huile, les boissons, les grignotages et les week-ends ?",
              "Tes **pas** ont-ils baissé ?",
              "Ton tour de taille est-il lui aussi inchangé ?",
            ),
            "Si la réponse à la première question est oui et que ta saisie a été régulière, c'est un vrai plateau.",
          ),
        },
      },
      {
        heading: { en: "What to do", fr: "Quoi faire" },
        body: {
          en: md(
            "Pick one small change and give it 2–3 weeks:",
            ul(
              "**Lower calories by about 100–200 kcal per day**, or",
              "**Add about 2,000 steps per day** (roughly 60–100 kcal).",
            ),
            "Don't slash calories dramatically, and stay above the safety floor (around 1,200 kcal for women and 1,500 kcal for men without medical supervision). NutriLens also updates your TDEE from your real weight trend, and it's worth recalculating your targets after every 4–5 kg lost.",
          ),
          fr: md(
            "Choisis un seul petit changement et laisse-lui 2 à 3 semaines :",
            ul(
              "**Baisser les calories d'environ 100 à 200 kcal par jour**, ou",
              "**Ajouter environ 2 000 pas par jour** (environ 60 à 100 kcal).",
            ),
            "Ne coupe pas les calories de façon drastique, et reste au-dessus de la limite de sécurité (environ 1 200 kcal pour une femme et 1 500 kcal pour un homme sans suivi médical). NutriLens met aussi à jour ta TDEE à partir de ta vraie courbe de poids, et il vaut la peine de recalculer tes objectifs tous les 4 à 5 kg perdus.",
          ),
        },
      },
      {
        heading: { en: "Diet breaks and refeeds", fr: "Pauses diète et refeeds" },
        body: {
          en: md(
            "Long diets are tiring. Two tools can help:",
            ul(
              "**Diet break:** 1–2 weeks eating at maintenance (around your current TDEE), every 8–12 weeks of dieting.",
              "**Refeed:** one or two higher-calorie days per week, with the extra mostly from carbs.",
            ),
            "The evidence that they “boost” metabolism is mixed; their main benefit is mental: a rest from dieting, better training and easier adherence. Expect the scale to go up a little during a break, from food and glycogen water. That's not fat coming back.",
          ),
          fr: md(
            "Les longs régimes sont fatigants. Deux outils peuvent aider :",
            ul(
              "**La pause diète :** 1 à 2 semaines à la maintenance (autour de ta TDEE actuelle), toutes les 8 à 12 semaines de régime.",
              "**Le refeed :** un ou deux jours par semaine avec plus de calories, le supplément venant surtout des glucides.",
            ),
            "Les preuves qu'ils « relancent » le métabolisme sont mitigées ; leur principal intérêt est mental : une pause dans le régime, de meilleurs entraînements et plus de facilité à tenir. Attends-toi à ce que la balance monte un peu pendant une pause, à cause de la nourriture et de l'eau liée au glycogène. Ce n'est pas du gras qui revient.",
          ),
        },
      },
      {
        heading: { en: "Patience", fr: "La patience" },
        body: {
          en: md(
            "Fat loss isn't linear. Your forecast of about {{weeksToGoal}} weeks is a guide, not a deadline. Keep the habits going and judge your progress month by month.",
          ),
          fr: md(
            "La perte de gras n'est pas linéaire. Ta prévision d'environ {{weeksToGoal}} semaines est un repère, pas une échéance. Garde tes habitudes et juge tes progrès mois par mois.",
          ),
        },
      },
    ],
    keyTakeaways: {
      en: [
        "Your daily burn drops as you lose weight; metabolic adaptation is real but usually modest.",
        "A real plateau is a flat weekly average for 3–4 weeks with honest logging.",
        "Fix it with one small change: 100–200 kcal less per day or about 2,000 more steps.",
        "Diet breaks and refeeds mainly help you stick with it; a small scale bump after them is water.",
      ],
      fr: [
        "Ta dépense baisse quand tu perds du poids ; l'adaptation métabolique est réelle mais généralement modeste.",
        "Un vrai plateau, c'est une moyenne hebdomadaire stable pendant 3 à 4 semaines avec une saisie honnête.",
        "Corrige avec un seul petit changement : 100 à 200 kcal de moins par jour ou environ 2 000 pas de plus.",
        "Pauses diète et refeeds aident surtout à tenir ; la petite hausse sur la balance qui suit, c'est de l'eau.",
      ],
    },
    related: ['scale-lies', 'bmr-tdee', 'deficit-explained', 'consistency-mindset'],
  },

  // ---------------------------------------------------------------------------
  // 16. Recomposition and gaining
  // ---------------------------------------------------------------------------
  {
    id: 'recomp-and-gaining',
    category: 'body',
    icon: 'TrendingUp',
    minutes: 5,
    title: {
      en: "Recomposition and gaining muscle",
      fr: "Recomposition et prise de muscle",
    },
    summary: {
      en: "Losing fat and gaining muscle at the same time, how big a surplus to use for building, and realistic rates of muscle gain.",
      fr: "Perdre du gras et prendre du muscle en même temps, quel surplus viser pour construire, et à quel rythme le muscle se gagne vraiment.",
    },
    sections: [
      {
        heading: { en: "Body recomposition", fr: "La recomposition corporelle" },
        body: {
          en: md(
            "**Recomposition** means losing fat and gaining muscle at the same time. Your weight may barely move while your body visibly changes: waist down, strength and muscle up.",
            "It works best for:",
            ul(
              "**Beginners** who have never lifted seriously",
              "**Returners** coming back after a break (muscle comes back faster the second time)",
              "People with **more body fat** to lose",
            ),
            "The recipe: lift hard 2–4 times a week with progressive overload, eat enough protein ({{proteinG}} g per day), and eat around maintenance or in a small deficit. In this phase, track your waist, photos and strength, not just the scale.",
          ),
          fr: md(
            "La **recomposition**, c'est perdre du gras et gagner du muscle en même temps. Ton poids peut à peine bouger alors que ton corps change visiblement : tour de taille en baisse, force et muscles en hausse.",
            "Elle fonctionne le mieux chez :",
            ul(
              "Les **débutants** qui n'ont jamais fait de musculation sérieusement",
              "Les personnes qui **reprennent** après une pause (le muscle revient plus vite la deuxième fois)",
              "Les personnes qui ont **plus de gras** à perdre",
            ),
            "La recette : de la musculation intense 2 à 4 fois par semaine avec une surcharge progressive, assez de protéines ({{proteinG}} g par jour), et des calories autour de la maintenance ou en léger déficit. Pendant cette phase, suis ton tour de taille, tes photos et ta force, pas seulement la balance.",
          ),
        },
      },
      {
        heading: { en: "Lean bulking: a small surplus", fr: "La prise de masse sèche : un petit surplus" },
        body: {
          en: md(
            "Once your body fat is reasonably low and you have some training experience, building more muscle is easier with a **small surplus**:",
            ul(
              "About **200–300 kcal above maintenance** (roughly 5–10% above your TDEE)",
              "A weight gain of about **1–1.5% of bodyweight per month** for beginners (at 70 kg: about 0.7–1 kg per month), roughly half that for intermediates",
            ),
            "A bigger surplus doesn't build muscle faster. Your body can only build muscle at a limited speed; the extra becomes fat you'll have to lose later.",
          ),
          fr: md(
            "Une fois que ton taux de gras est raisonnable et que tu as un peu d'expérience, construire plus de muscle est plus facile avec un **petit surplus** :",
            ul(
              "Environ **200 à 300 kcal au-dessus de la maintenance** (environ 5 à 10 % de plus que ta TDEE)",
              "Une prise de poids d'environ **1 à 1,5 % du poids de corps par mois** pour un débutant (à 70 kg : environ 0,7 à 1 kg par mois), à peu près moitié moins pour un pratiquant intermédiaire",
            ),
            "Un surplus plus gros ne construit pas le muscle plus vite. Ton corps ne peut fabriquer du muscle qu'à une vitesse limitée ; le reste devient du gras que tu devras perdre plus tard.",
          ),
        },
      },
      {
        heading: { en: "How fast can you build muscle?", fr: "À quelle vitesse peut-on prendre du muscle ?" },
        body: {
          en: md(
            "Rough, best-case ranges when training, eating and sleep are all in place:",
            ul(
              "**Year 1:** about 0.5–1 kg of muscle per month for men, roughly half that for women",
              "**Year 2:** about half the rate of year 1",
              "**Year 3 and beyond:** slower still; progress comes in small gains per year",
            ),
            "Genetics, age, sleep and consistency all change these numbers. Real results are often below the best case, and that's normal.",
          ),
          fr: md(
            "Des fourchettes approximatives, dans le meilleur des cas (entraînement, alimentation et sommeil au point) :",
            ul(
              "**1re année :** environ 0,5 à 1 kg de muscle par mois pour un homme, à peu près la moitié pour une femme",
              "**2e année :** environ la moitié du rythme de la première année",
              "**3e année et après :** encore plus lent ; les progrès se comptent en petits gains par an",
            ),
            "La génétique, l'âge, le sommeil et la régularité changent ces chiffres. Les résultats réels sont souvent en dessous du meilleur cas, et c'est normal.",
          ),
        },
      },
      {
        heading: { en: "How your weight will change", fr: "Comment ton poids va évoluer" },
        body: {
          en: md(
            "Building muscle means the scale goes up slowly, and part of that gain is fat and water too. That's expected. If your waist grows much faster than your strength, your surplus is too big: cut it by 100–200 kcal. If the scale hasn't moved in 2–3 weeks, add 100–200 kcal.",
          ),
          fr: md(
            "Prendre du muscle signifie que la balance monte lentement, et une partie de cette hausse est aussi du gras et de l'eau. C'est attendu. Si ton tour de taille augmente beaucoup plus vite que ta force, ton surplus est trop gros : baisse-le de 100 à 200 kcal. Si la balance n'a pas bougé depuis 2 à 3 semaines, ajoute 100 à 200 kcal.",
          ),
        },
      },
      {
        heading: { en: "Which phase should you choose?", fr: "Quelle phase choisir ?" },
        body: {
          en: md(
            ul(
              "**Lots of fat to lose:** start with a deficit; as a beginner you'll probably build muscle anyway.",
              "**Little fat but little muscle (“skinny fat”), or brand new to lifting:** recomposition at maintenance is a great place to start.",
              "**Already lean and wanting more size:** a lean bulk with a small surplus.",
            ),
            "Whatever you choose, the training and protein stay the same. Only the calories change.",
          ),
          fr: md(
            ul(
              "**Beaucoup de gras à perdre :** commence par un déficit ; comme tu débutes, tu prendras probablement du muscle quand même.",
              "**Peu de gras mais peu de muscle (« skinny fat »), ou tout début en musculation :** la recomposition à la maintenance est un excellent point de départ.",
              "**Taux de gras déjà bas et envie de plus de volume :** une prise de masse sèche avec un petit surplus.",
            ),
            "Quelle que soit la phase, l'entraînement et les protéines restent les mêmes. Seules les calories changent.",
          ),
        },
      },
    ],
    keyTakeaways: {
      en: [
        "Beginners and returners can lose fat and gain muscle at the same time (recomposition).",
        "For a lean bulk, use a small surplus of about 200–300 kcal per day.",
        "Best case, expect about 0.5–1 kg of muscle per month in year one (men), about half for women, then slower.",
        "Training and protein stay the same in every phase; only calories change.",
      ],
      fr: [
        "Les débutants et les personnes qui reprennent peuvent perdre du gras et prendre du muscle en même temps (recomposition).",
        "Pour une prise de masse sèche, vise un petit surplus d'environ 200 à 300 kcal par jour.",
        "Dans le meilleur des cas, compte environ 0,5 à 1 kg de muscle par mois la première année (hommes), environ moitié moins pour les femmes, puis plus lentement.",
        "L'entraînement et les protéines restent les mêmes dans chaque phase ; seules les calories changent.",
      ],
    },
    related: ['deficit-explained', 'strength-training-basics', 'protein', 'sets-reps-rir'],
  },

  // ---------------------------------------------------------------------------
  // 17. Ramadan and fasting
  // ---------------------------------------------------------------------------
  {
    id: 'ramadan-fasting',
    category: 'habits',
    icon: 'MoonStar',
    minutes: 5,
    title: {
      en: "Ramadan and fasting: eating and training well",
      fr: "Ramadan et jeûne : bien manger et s'entraîner",
    },
    summary: {
      en: "Practical ways to hit your protein, stay hydrated and keep training during Ramadan or any fasting schedule.",
      fr: "Des conseils pratiques pour atteindre tes protéines, bien t'hydrater et continuer à t'entraîner pendant le Ramadan ou tout autre jeûne.",
    },
    sections: [
      {
        heading: { en: "Your goals still work", fr: "Tes objectifs restent valables" },
        body: {
          en: md(
            "Ramadan is a special month, and your progress doesn't have to pause. Calories and protein add up over the whole day, whether you eat across 16 hours or only between iftar and suhoor. Some people find a deficit easier during Ramadan; others find it harder because of the evening feasts. Both are normal.",
            "A realistic goal for the month: **keep your muscle and strength**, keep your weight stable or slowly going down, and finish the month healthy and full of energy.",
            "If you have diabetes or another medical condition, take regular medication, or are pregnant or breastfeeding, talk with your doctor about fasting safely.",
          ),
          fr: md(
            "Le Ramadan est un mois à part, et tes progrès n'ont pas à s'arrêter. Les calories et les protéines s'additionnent sur toute la journée, que tu manges sur 16 heures ou seulement entre l'iftar et le s'hour. Certaines personnes trouvent le déficit plus facile pendant le Ramadan, d'autres plus difficile à cause des grandes tablées du soir. Les deux sont normaux.",
            "Un objectif réaliste pour le mois : **garder ton muscle et ta force**, un poids stable ou en légère baisse, et finir le mois en bonne santé, avec un bon niveau d'énergie.",
            "Si tu es diabétique ou as un autre problème de santé, si tu prends un traitement régulier, ou si tu es enceinte ou allaites, parle avec ton médecin de la façon de jeûner en toute sécurité.",
          ),
        },
      },
      {
        heading: { en: "Hitting your protein", fr: "Atteindre tes protéines" },
        body: {
          en: md(
            "Fitting {{proteinG}} g of protein into a few hours takes a plan. Split it across three moments:",
            ul(
              "**Iftar:** chorba with meat or chicken, then a main plate with a good protein portion (grilled chicken, fish, meat, eggs in an ojja).",
              "**Evening snack (after taraweeh):** yogurt, ricotta, lben, a protein shake, or a sandwich with tuna or eggs.",
              "**Suhoor:** eggs, cheese or ricotta, yogurt, with slow carbs like oats or whole-wheat bread to keep you going.",
            ),
          ),
          fr: md(
            "Caser {{proteinG}} g de protéines en quelques heures, ça se prépare. Répartis-les sur trois moments :",
            ul(
              "**Iftar :** une chorba avec de la viande ou du poulet, puis un plat principal avec une bonne portion de protéines (poulet grillé, poisson, viande, œufs dans une ojja).",
              "**Collation du soir (après les tarawih) :** yaourt, ricotta, lben, un shake protéiné, ou un sandwich au thon ou aux œufs.",
              "**S'hour :** œufs, fromage ou ricotta, yaourt, avec des glucides lents comme les flocons d'avoine ou le pain complet pour tenir.",
            ),
          ),
        },
      },
      {
        heading: { en: "Hydration", fr: "L'hydratation" },
        body: {
          en: md(
            "You need your full {{waterL}} L in a short window, so spread it out: 2 glasses at iftar, then roughly a glass every hour until suhoor, and 1–2 glasses at suhoor. Downing 2 liters right before dawn doesn't work well.",
            "Go easy on very salty foods at suhoor (pickles, olives, salty cheese, cured meats), and on coffee and strong tea, which can disturb your sleep. Soups, watermelon, cucumber and yogurt help too.",
          ),
          fr: md(
            "Tu dois boire tes {{waterL}} L sur une courte période, alors étale : 2 verres à l'iftar, puis environ un verre par heure jusqu'au s'hour, et 1 à 2 verres au s'hour. Avaler 2 litres juste avant l'aube ne marche pas bien.",
            "Limite les aliments très salés au s'hour (torchi, olives, fromages salés, charcuterie), ainsi que le café et le thé fort, qui peuvent perturber ton sommeil. Les soupes, la pastèque, le concombre et le yaourt aident aussi.",
          ),
        },
      },
      {
        heading: { en: "When to train", fr: "Quand s'entraîner" },
        body: {
          en: md(
            "Pick the time that fits your energy and schedule:",
            ul(
              "**Before iftar (30–90 minutes before):** you can eat right after training. Keep sessions short and moderate, especially in the heat, and skip intense cardio.",
              "**After iftar or after taraweeh:** you've eaten and drunk, so performance is usually best. Wait 1–2 hours after a big meal.",
            ),
            "Keep the weights heavy, but you can cut volume by 20–30% (for example 3 sets instead of 4). Aim to maintain your strength rather than set new records. If you feel dizzy or unwell while fasting, stop.",
          ),
          fr: md(
            "Choisis le moment qui correspond à ton énergie et à ton emploi du temps :",
            ul(
              "**Avant l'iftar (30 à 90 minutes avant) :** tu peux manger juste après la séance. Garde des séances courtes et modérées, surtout par la chaleur, et évite le cardio intense.",
              "**Après l'iftar ou après les tarawih :** tu as mangé et bu, donc tes performances sont généralement meilleures. Attends 1 à 2 heures après un gros repas.",
            ),
            "Garde des charges lourdes, mais tu peux réduire le volume de 20 à 30 % (par exemple 3 séries au lieu de 4). Vise à maintenir ta force plutôt qu'à battre des records. Si tu as des vertiges ou te sens mal pendant le jeûne, arrête.",
          ),
        },
      },
      {
        heading: { en: "Go easy at iftar", fr: "Doucement à l'iftar" },
        body: {
          en: md(
            "After a long fast, it's easy to eat a whole day's calories in 20 minutes. A calmer approach:",
            ul(
              "Break the fast with water and 1–3 dates.",
              "Have soup, then take a pause (for example for maghrib prayer).",
              "Then eat your main plate slowly.",
            ),
            "Brik, fried dishes and Ramadan sweets like zlabia and makroudh are part of the month. Enjoy them in portions you've planned, and log them honestly; your weekly average is what counts. Outside Ramadan, intermittent fasting (like 16:8) works for some people simply because it helps them eat less; it doesn't burn extra fat on its own.",
          ),
          fr: md(
            "Après une longue journée de jeûne, il est facile de manger les calories d'une journée entière en 20 minutes. Une approche plus calme :",
            ul(
              "Romps le jeûne avec de l'eau et 1 à 3 dattes.",
              "Prends une soupe, puis fais une pause (par exemple pour la prière du maghrib).",
              "Ensuite, mange ton plat principal lentement.",
            ),
            "La brik, les fritures et les douceurs du Ramadan comme la zlabia et le makroudh font partie du mois. Profites-en avec des portions prévues à l'avance, et note-les honnêtement : c'est ta moyenne de la semaine qui compte. En dehors du Ramadan, le jeûne intermittent (comme le 16/8) fonctionne chez certaines personnes simplement parce qu'il les aide à manger moins ; il ne brûle pas de gras en plus à lui seul.",
          ),
        },
      },
    ],
    keyTakeaways: {
      en: [
        "Calories and protein add up over the whole day, even in a short eating window.",
        "Split your protein across iftar, an evening snack and suhoor.",
        "Spread your water from iftar to suhoor instead of drinking it all at once.",
        "Train before iftar (short, moderate) or after iftar or taraweeh (best performance), and aim to maintain strength.",
        "Break the fast with water, dates and soup, then pause before the main plate.",
      ],
      fr: [
        "Les calories et les protéines s'additionnent sur toute la journée, même sur une courte fenêtre de repas.",
        "Répartis tes protéines entre l'iftar, une collation le soir et le s'hour.",
        "Étale ton eau de l'iftar au s'hour au lieu de tout boire d'un coup.",
        "Entraîne-toi avant l'iftar (court et modéré) ou après l'iftar ou les tarawih (meilleures performances), en visant à maintenir ta force.",
        "Romps le jeûne avec de l'eau, des dattes et une soupe, puis fais une pause avant le plat principal.",
      ],
    },
    related: ['protein', 'water', 'hunger-tips', 'consistency-mindset'],
  },

  // ---------------------------------------------------------------------------
  // 18. Consistency and mindset
  // ---------------------------------------------------------------------------
  {
    id: 'consistency-mindset',
    category: 'habits',
    icon: 'Brain',
    minutes: 4,
    title: {
      en: "Consistency beats perfection",
      fr: "La régularité bat la perfection",
    },
    summary: {
      en: "How to keep going when life gets messy: the 80/20 rule, missed days, honest logging and watching trends.",
      fr: "Comment continuer quand la vie devient compliquée : la règle des 80/20, les jours ratés, la saisie honnête et les tendances.",
    },
    sections: [
      {
        heading: { en: "The 80/20 rule", fr: "La règle des 80/20" },
        body: {
          en: md(
            "You don't need to be perfect. If about **80% of your days** are close to your plan, with mostly filling, nutritious food, the other 20% can be birthdays, weddings, Eid, a dinner out or just a lazy day. Results come from what you do most of the time, not every single day.",
            "The same goes for food choices: build most meals from protein, vegetables, fruit, legumes and whole grains, and leave room for the foods you enjoy.",
          ),
          fr: md(
            "Tu n'as pas besoin de perfection. Si environ **80 % de tes journées** sont proches de ton plan, avec surtout des aliments rassasiants et nutritifs, les 20 % restants peuvent être des anniversaires, des mariages, l'Aïd, un resto ou juste une journée tranquille. Les résultats viennent de ce que tu fais la plupart du temps, pas de chaque journée.",
            "C'est pareil pour les choix alimentaires : construis la plupart de tes repas avec des protéines, des légumes, des fruits, des légumineuses et des céréales complètes, et garde de la place pour ce que tu aimes.",
          ),
        },
      },
      {
        heading: { en: "The all-or-nothing trap", fr: "Le piège du tout ou rien" },
        body: {
          en: md(
            "What derails most people isn't one big meal. It's what comes after: “Today's ruined anyway, I'll restart on Monday.” Then the weekend turns into a week.",
            "Look at the math. A deficit of 500 kcal per day gives you about 3,500 kcal over a week. One day where you eat 1,000 kcal more than planned still leaves 2,500 kcal of deficit. One meal can't undo a week of work; giving up for days can.",
            "So after an off day, just go back to normal at the next meal. No punishment, no skipped meals, no extra hour of cardio.",
          ),
          fr: md(
            "Ce qui fait dérailler la plupart des gens, ce n'est pas un gros repas. C'est ce qui vient après : « De toute façon, la journée est fichue, je reprends lundi. » Et le week-end devient une semaine.",
            "Fais le calcul. Un déficit de 500 kcal par jour représente environ 3 500 kcal sur une semaine. Une journée où tu manges 1 000 kcal de plus que prévu laisse encore 2 500 kcal de déficit. Un repas ne peut pas effacer une semaine d'efforts ; abandonner pendant plusieurs jours, si.",
            "Donc après une journée moins bonne, reprends simplement normalement au repas suivant. Pas de punition, pas de repas sauté, pas d'heure de cardio en plus.",
          ),
        },
      },
      {
        heading: { en: "Log honestly, not perfectly", fr: "Note honnêtement, pas parfaitement" },
        body: {
          en: md(
            "Logging isn't a test you pass or fail. It's data. A rough estimate of a big family meal is far more useful than a blank day. Log the pastry, the extra bread, the sweet tea. Nobody is judging; the numbers just help the app find your real maintenance and help you spot patterns.",
            "If you're unsure about a portion, guess a little high. Most of us underestimate.",
          ),
          fr: md(
            "Noter ce que tu manges n'est pas un examen qu'on réussit ou qu'on rate. Ce sont des données. Une estimation approximative d'un grand repas de famille est bien plus utile qu'une journée vide. Note la pâtisserie, le pain en plus, le thé sucré. Personne ne juge : les chiffres aident juste l'appli à trouver ta vraie maintenance et t'aident à repérer tes habitudes.",
            "Si tu hésites sur une portion, estime un peu large. On a presque tous tendance à sous-estimer.",
          ),
        },
      },
      {
        heading: { en: "Trends, not days", fr: "Les tendances, pas les jours" },
        body: {
          en: md(
            "One day of eating, one weigh-in, one bad workout: none of them matters much on its own. Look at your **weekly averages**: average calories, average weight, total sets. If the week trends in the right direction, you're winning.",
            "With a target of {{targetCalories}} kcal per day, you don't need every day to be exact. A weekly average close to it does the job.",
          ),
          fr: md(
            "Une journée de repas, une pesée, une mauvaise séance : aucune ne compte beaucoup à elle seule. Regarde tes **moyennes hebdomadaires** : calories moyennes, poids moyen, nombre total de séries. Si la semaine va dans la bonne direction, tu gagnes.",
            "Avec un objectif de {{targetCalories}} kcal par jour, pas besoin que chaque journée soit exacte. Une moyenne de la semaine proche de cet objectif fait le travail.",
          ),
        },
      },
      {
        heading: { en: "Build habits that last", fr: "Construis des habitudes qui durent" },
        body: {
          en: md(
            "Start with one or two habits, like hitting your protein and your {{stepsTarget}} steps, before adding more. Habits that feel easy are the ones you keep.",
            "And if food or weight starts to feel stressful or obsessive, it's okay to take a break from tracking and talk to a professional. Your health comes first.",
          ),
          fr: md(
            "Commence par une ou deux habitudes, comme atteindre tes protéines et tes {{stepsTarget}} pas, avant d'en ajouter d'autres. Les habitudes qui paraissent faciles sont celles qu'on garde.",
            "Et si la nourriture ou le poids deviennent une source de stress ou d'obsession, c'est tout à fait acceptable de faire une pause dans le suivi et d'en parler à un professionnel. Ta santé passe avant tout.",
          ),
        },
      },
    ],
    keyTakeaways: {
      en: [
        "Aim to be on plan about 80% of the time; the rest is life.",
        "After an off day, go back to normal at the next meal: no punishment, no compensation.",
        "Honest, rough logging beats blank days or perfect logging that doesn't last.",
        "Judge progress by weekly averages, not individual days.",
      ],
      fr: [
        "Vise à suivre ton plan environ 80 % du temps ; le reste, c'est la vie.",
        "Après une journée moins bonne, reprends normalement au repas suivant : ni punition, ni compensation.",
        "Une saisie honnête et approximative vaut mieux que des journées vides ou une saisie parfaite qui ne dure pas.",
        "Juge tes progrès sur les moyennes de la semaine, pas sur des journées isolées.",
      ],
    },
    related: ['scale-lies', 'hunger-tips', 'plateaus-adaptation'],
  },
];

// -----------------------------------------------------------------------------
// Glossary
// -----------------------------------------------------------------------------

const rawGlossary: GlossaryEntry[] = [
  {
    id: 'calorie',
    term: { en: "Calorie", fr: "Calorie" },
    definition: {
      en: "A unit of energy. In nutrition, “calories” almost always means kilocalories (kcal): the energy in food and the energy your body burns.",
      fr: "Une unité d'énergie. En nutrition, « calories » veut presque toujours dire kilocalories (kcal) : l'énergie contenue dans les aliments et celle que ton corps dépense.",
    },
    lessonId: 'calories-101',
  },
  {
    id: 'kcal',
    term: { en: "kcal (kilocalorie)", fr: "kcal (kilocalorie)" },
    definition: {
      en: "1,000 calories, the unit used on food labels. Protein and carbs give 4 kcal/g, fat 9 kcal/g, alcohol 7 kcal/g.",
      fr: "1 000 calories, l'unité utilisée sur les étiquettes. Protéines et glucides : 4 kcal/g ; lipides : 9 kcal/g ; alcool : 7 kcal/g.",
    },
    lessonId: 'calories-101',
  },
  {
    id: 'bmr',
    term: { en: "BMR (basal metabolic rate)", fr: "BMR (métabolisme de base)" },
    definition: {
      en: "The energy your body uses at complete rest just to stay alive. Usually 60–70% of your daily burn.",
      fr: "L'énergie que ton corps utilise au repos complet, juste pour rester en vie. En général 60 à 70 % de ta dépense quotidienne.",
    },
    lessonId: 'bmr-tdee',
  },
  {
    id: 'tdee',
    term: { en: "TDEE (total daily energy expenditure)", fr: "TDEE (dépense énergétique totale)" },
    definition: {
      en: "Everything you burn in a day: BMR + everyday movement (NEAT) + digestion (TEF) + exercise. Eating this much keeps your weight stable.",
      fr: "Tout ce que tu dépenses en une journée : BMR + mouvements du quotidien (NEAT) + digestion (TEF) + sport. Manger cette quantité garde ton poids stable.",
    },
    lessonId: 'bmr-tdee',
  },
  {
    id: 'neat',
    term: { en: "NEAT (non-exercise activity thermogenesis)", fr: "NEAT (activité physique hors sport)" },
    definition: {
      en: "Energy burned by movement that isn't formal exercise: walking, standing, chores, fidgeting. It varies a lot between people and is easy to raise with more steps.",
      fr: "L'énergie dépensée par les mouvements qui ne sont pas du sport : marcher, rester debout, faire le ménage, bouger. Elle varie beaucoup d'une personne à l'autre et s'augmente facilement en marchant plus.",
    },
    lessonId: 'bmr-tdee',
  },
  {
    id: 'tef',
    term: { en: "TEF (thermic effect of food)", fr: "TEF (effet thermique des aliments)" },
    definition: {
      en: "The energy used to digest food, about 10% of what you eat. Protein has the highest TEF (20–30% of its calories).",
      fr: "L'énergie utilisée pour digérer, environ 10 % de ce que tu manges. Les protéines ont le TEF le plus élevé (20 à 30 % de leurs calories).",
    },
    lessonId: 'bmr-tdee',
  },
  {
    id: 'maintenance',
    term: { en: "Maintenance calories", fr: "Calories de maintenance" },
    definition: {
      en: "The daily intake at which your weight stays stable over time; roughly equal to your TDEE.",
      fr: "L'apport quotidien avec lequel ton poids reste stable dans le temps ; à peu près égal à ta TDEE.",
    },
    lessonId: 'bmr-tdee',
  },
  {
    id: 'deficit',
    term: { en: "Calorie deficit", fr: "Déficit calorique" },
    definition: {
      en: "Eating less energy than you burn. Your body covers the gap from its reserves, mainly fat. Required for fat loss.",
      fr: "Manger moins d'énergie que ce que tu dépenses. Ton corps comble l'écart avec ses réserves, surtout le gras. Indispensable pour perdre du gras.",
    },
    lessonId: 'deficit-explained',
  },
  {
    id: 'surplus',
    term: { en: "Calorie surplus", fr: "Surplus calorique" },
    definition: {
      en: "Eating more energy than you burn. A small surplus (about 200–300 kcal per day) supports muscle gain, which is called a lean bulk; a large one mostly adds fat.",
      fr: "Manger plus d'énergie que ce que tu dépenses. Un petit surplus (environ 200 à 300 kcal par jour) favorise la prise de muscle, on parle de prise de masse sèche ; un gros surplus ajoute surtout du gras.",
    },
    lessonId: 'recomp-and-gaining',
  },
  {
    id: 'macro',
    term: { en: "Macro (macronutrient)", fr: "Macro (macronutriment)" },
    definition: {
      en: "The three nutrients that provide calories: protein, carbohydrates and fat. Alcohol also has calories, but it isn't a nutrient you need.",
      fr: "Les trois nutriments qui apportent des calories : protéines, glucides et lipides. L'alcool apporte aussi des calories, mais ce n'est pas un nutriment dont tu as besoin.",
    },
    lessonId: 'macros-carbs-fats',
  },
  {
    id: 'protein',
    term: { en: "Protein", fr: "Protéines" },
    definition: {
      en: "The macro that builds and repairs muscle: 4 kcal per gram and the most filling one. Most people who train do well with 1.6–2.2 g per kg of bodyweight.",
      fr: "Le macro qui construit et répare le muscle : 4 kcal par gramme, et le plus rassasiant. La plupart des personnes qui s'entraînent s'en sortent bien avec 1,6 à 2,2 g par kg de poids de corps.",
    },
    lessonId: 'protein',
  },
  {
    id: 'carbohydrate',
    term: { en: "Carbohydrates (carbs)", fr: "Glucides" },
    definition: {
      en: "Your body's main fuel for intense effort: 4 kcal per gram. Found in grains, bread, rice, potatoes, fruit, legumes and sugar.",
      fr: "Le carburant principal du corps pour les efforts intenses : 4 kcal par gramme. On en trouve dans les céréales, le pain, le riz, les pommes de terre, les fruits, les légumineuses et le sucre.",
    },
    lessonId: 'macros-carbs-fats',
  },
  {
    id: 'fat',
    term: { en: "Fat (lipids)", fr: "Lipides (graisses)" },
    definition: {
      en: "Essential for hormones, vitamin absorption and healthy cells: 9 kcal per gram, the most energy-dense macro. A common minimum is 0.6–0.8 g per kg of bodyweight.",
      fr: "Indispensables pour les hormones, l'absorption des vitamines et des cellules saines : 9 kcal par gramme, le macro le plus dense en énergie. Un minimum courant est de 0,6 à 0,8 g par kg de poids de corps.",
    },
    lessonId: 'macros-carbs-fats',
  },
  {
    id: 'fiber',
    term: { en: "Fiber", fr: "Fibres" },
    definition: {
      en: "Plant carbohydrates you don't fully digest. They keep you full and support gut and heart health. Aim for about 25–35 g per day.",
      fr: "Des glucides végétaux que tu ne digères pas complètement. Elles rassasient et soutiennent la santé de l'intestin et du cœur. Vise environ 25 à 35 g par jour.",
    },
    lessonId: 'macros-carbs-fats',
  },
  {
    id: 'glycogen',
    term: { en: "Glycogen", fr: "Glycogène" },
    definition: {
      en: "The stored form of carbs in your muscles and liver. Each gram is stored with about 3 g of water, which is why carb intake changes the scale quickly.",
      fr: "La forme de stockage des glucides dans tes muscles et ton foie. Chaque gramme est stocké avec environ 3 g d'eau, d'où les variations rapides sur la balance selon les glucides consommés.",
    },
    lessonId: 'scale-lies',
  },
  {
    id: 'water-weight',
    term: { en: "Water weight", fr: "Poids de l'eau" },
    definition: {
      en: "Short-term weight changes caused by water (salt, carbs, hormones, training, stress). It can hide or exaggerate fat loss for days, sometimes weeks.",
      fr: "Les variations de poids à court terme dues à l'eau (sel, glucides, hormones, entraînement, stress). Elles peuvent masquer ou exagérer la perte de gras pendant des jours, parfois des semaines.",
    },
    lessonId: 'scale-lies',
  },
  {
    id: 'trend-weight',
    term: { en: "Trend weight", fr: "Poids tendance" },
    definition: {
      en: "A smoothed average of your daily weigh-ins that filters out water noise and shows where your weight is really heading.",
      fr: "Une moyenne lissée de tes pesées quotidiennes qui filtre le bruit lié à l'eau et montre où va vraiment ton poids.",
    },
    lessonId: 'scale-lies',
  },
  {
    id: 'body-fat-percentage',
    term: { en: "Body fat %", fr: "Taux de masse grasse (%)" },
    definition: {
      en: "The share of your bodyweight that is fat. Smart scales and photos only give rough estimates; the change over time is more useful than the exact number.",
      fr: "La part de ton poids qui est du gras. Les balances connectées et les photos ne donnent que des estimations ; l'évolution dans le temps compte plus que le chiffre exact.",
    },
    lessonId: 'recomp-and-gaining',
  },
  {
    id: 'lean-mass',
    term: { en: "Lean mass", fr: "Masse maigre" },
    definition: {
      en: "Everything in your body that isn't fat: muscle, bones, organs, water. In a deficit, the goal is to keep as much of it as possible.",
      fr: "Tout ce qui, dans ton corps, n'est pas du gras : muscles, os, organes, eau. En déficit, le but est d'en garder le plus possible.",
    },
    lessonId: 'recomp-and-gaining',
  },
  {
    id: 'recomposition',
    term: { en: "Body recomposition", fr: "Recomposition corporelle" },
    definition: {
      en: "Losing fat and gaining muscle at the same time, usually at around maintenance calories. Works best for beginners, returners and people with more fat to lose.",
      fr: "Perdre du gras et prendre du muscle en même temps, généralement avec des calories proches de la maintenance. Fonctionne le mieux chez les débutants, les personnes qui reprennent et celles qui ont plus de gras à perdre.",
    },
    lessonId: 'recomp-and-gaining',
  },
  {
    id: 'progressive-overload',
    term: { en: "Progressive overload", fr: "Surcharge progressive" },
    definition: {
      en: "Gradually asking more of your muscles over time (more weight, reps or sets). The core principle behind getting stronger and building muscle.",
      fr: "Demander progressivement plus à tes muscles avec le temps (plus de poids, de répétitions ou de séries). Le principe de base pour gagner en force et en muscle.",
    },
    lessonId: 'strength-training-basics',
  },
  {
    id: 'compound-exercise',
    term: { en: "Compound exercise", fr: "Exercice polyarticulaire" },
    definition: {
      en: "A movement that works several joints and muscles at once, such as squats, deadlifts, presses, rows and pull-ups.",
      fr: "Un mouvement qui fait travailler plusieurs articulations et muscles à la fois, comme le squat, le soulevé de terre, les développés, le rowing et les tractions.",
    },
    lessonId: 'strength-training-basics',
  },
  {
    id: 'isolation-exercise',
    term: { en: "Isolation exercise", fr: "Exercice d'isolation" },
    definition: {
      en: "A movement that targets one muscle through one joint, such as biceps curls, lateral raises or leg curls.",
      fr: "Un mouvement qui cible un seul muscle via une seule articulation, comme le curl biceps, les élévations latérales ou le leg curl.",
    },
    lessonId: 'strength-training-basics',
  },
  {
    id: 'hypertrophy',
    term: { en: "Hypertrophy", fr: "Hypertrophie" },
    definition: {
      en: "Muscle growth. Driven by hard sets, progressive overload, enough protein and good recovery.",
      fr: "La croissance musculaire. Elle vient des séries difficiles, de la surcharge progressive, d'assez de protéines et d'une bonne récupération.",
    },
    lessonId: 'strength-training-basics',
  },
  {
    id: 'rep',
    term: { en: "Rep (repetition)", fr: "Répétition (rep)" },
    definition: {
      en: "One complete movement of an exercise, for example lowering and lifting the bar once.",
      fr: "Un mouvement complet d'un exercice, par exemple descendre et remonter la barre une fois.",
    },
    lessonId: 'sets-reps-rir',
  },
  {
    id: 'set',
    term: { en: "Set", fr: "Série" },
    definition: {
      en: "A group of reps done without stopping. “3 × 10” means 3 sets of 10 reps.",
      fr: "Un groupe de répétitions enchaînées sans pause. « 3 × 10 » veut dire 3 séries de 10 répétitions.",
    },
    lessonId: 'sets-reps-rir',
  },
  {
    id: 'rir',
    term: { en: "RIR (reps in reserve)", fr: "RIR (répétitions en réserve)" },
    definition: {
      en: "How many more reps you could have done before failure, the point where you can't complete another rep. Stopping most sets at RIR 1–3 is the sweet spot.",
      fr: "Le nombre de répétitions que tu aurais encore pu faire avant l'échec, le moment où tu ne peux plus terminer une répétition. Arrêter la plupart des séries à RIR 1 à 3, c'est l'idéal.",
    },
    lessonId: 'sets-reps-rir',
  },
  {
    id: 'rpe',
    term: { en: "RPE (rate of perceived exertion)", fr: "RPE (effort perçu)" },
    definition: {
      en: "Effort rated on a 1–10 scale. RPE 10 = failure, RPE 9 ≈ 1 rep left, RPE 8 ≈ 2 reps left.",
      fr: "L'effort noté sur une échelle de 1 à 10. RPE 10 = échec, RPE 9 ≈ 1 répétition en réserve, RPE 8 ≈ 2 répétitions en réserve.",
    },
    lessonId: 'sets-reps-rir',
  },
  {
    id: 'rest-interval',
    term: { en: "Rest interval", fr: "Temps de repos" },
    definition: {
      en: "The break between sets: about 2–3 minutes for heavy compound lifts, 1–2 minutes for isolation exercises.",
      fr: "La pause entre deux séries : environ 2 à 3 minutes pour les gros exercices polyarticulaires, 1 à 2 minutes pour l'isolation.",
    },
    lessonId: 'sets-reps-rir',
  },
  {
    id: 'training-volume',
    term: { en: "Training volume", fr: "Volume d'entraînement" },
    definition: {
      en: "How much work you do, usually counted as hard sets per muscle per week. About 10–20 is a good range for growth; beginners can start near 10.",
      fr: "La quantité de travail que tu fais, souvent comptée en séries difficiles par muscle et par semaine. Environ 10 à 20 est une bonne fourchette pour progresser ; les débutants peuvent commencer autour de 10.",
    },
    lessonId: 'sets-reps-rir',
  },
  {
    id: 'double-progression',
    term: { en: "Double progression", fr: "Double progression" },
    definition: {
      en: "A simple way to progress: add reps within a range (for example 8–12) until you reach the top on all sets, then add weight and start again.",
      fr: "Une façon simple de progresser : ajoute des répétitions dans une plage (par exemple 8 à 12) jusqu'à atteindre le haut sur toutes les séries, puis ajoute du poids et recommence.",
    },
    lessonId: 'sets-reps-rir',
  },
  {
    id: 'warm-up',
    term: { en: "Warm-up", fr: "Échauffement" },
    definition: {
      en: "5–10 minutes of light cardio plus a few lighter ramp-up sets before your working sets. It prepares your body and lets you rehearse the technique.",
      fr: "5 à 10 minutes de cardio léger plus quelques séries plus légères de montée en charge avant tes séries de travail. Il prépare ton corps et te permet de répéter la technique.",
    },
    lessonId: 'form-and-safety',
  },
  {
    id: 'doms',
    term: { en: "DOMS (delayed-onset muscle soreness)", fr: "Courbatures (DOMS)" },
    definition: {
      en: "The muscle soreness you feel 1–3 days after a new or hard workout. Normal and harmless; it isn't a measure of how good the session was.",
      fr: "Les douleurs musculaires ressenties 1 à 3 jours après une séance nouvelle ou difficile. Normales et sans danger ; elles ne mesurent pas la qualité de la séance.",
    },
    lessonId: 'form-and-safety',
  },
  {
    id: 'deload',
    term: { en: "Deload", fr: "Décharge (deload)" },
    definition: {
      en: "A planned easier week (about half the sets, further from failure) that lets fatigue drop before you train hard again.",
      fr: "Une semaine plus légère planifiée (environ moitié moins de séries, plus loin de l'échec) qui laisse la fatigue retomber avant de reprendre fort.",
    },
    lessonId: 'sleep-recovery',
  },
  {
    id: 'cardio',
    term: { en: "Cardio", fr: "Cardio" },
    definition: {
      en: "Exercise that raises your heart rate for a sustained time: walking, running, cycling, swimming, intervals. Great for heart health, and it adds to your daily burn.",
      fr: "Un exercice qui fait monter ton rythme cardiaque de façon soutenue : marche, course, vélo, natation, fractionné. Excellent pour le cœur, et il augmente ta dépense quotidienne.",
    },
    lessonId: 'steps-cardio',
  },
  {
    id: 'heart-rate-zone',
    term: { en: "Heart-rate zone", fr: "Zone de fréquence cardiaque" },
    definition: {
      en: "A heart-rate range expressed as a share of your maximum (roughly 220 minus your age). Zone 2 is about 60–70%: you can still talk in full sentences.",
      fr: "Une plage de fréquence cardiaque exprimée en pourcentage de ton maximum (en gros 220 moins ton âge). La zone 2 correspond à environ 60 à 70 % : tu peux encore parler en phrases complètes.",
    },
    lessonId: 'steps-cardio',
  },
  {
    id: 'step-count',
    term: { en: "Step count", fr: "Nombre de pas" },
    definition: {
      en: "The number of steps you take per day, measured by your phone or watch. A simple way to track and raise your NEAT.",
      fr: "Le nombre de pas que tu fais par jour, mesuré par ton téléphone ou ta montre. Un moyen simple de suivre et d'augmenter ta NEAT.",
    },
    lessonId: 'steps-cardio',
  },
  {
    id: 'health-connect',
    term: { en: "Health Connect", fr: "Health Connect" },
    definition: {
      en: "Android's hub for health data. It collects steps, workouts, sleep and weight from your watch and phone apps, so apps like NutriLens can read them in one place if you allow it.",
      fr: "Le centre de données santé d'Android. Il regroupe les pas, les entraînements, le sommeil et le poids venant de ta montre et de tes applis, pour que des applis comme NutriLens puissent les lire au même endroit si tu l'autorises.",
    },
    lessonId: 'steps-cardio',
  },
  {
    id: 'adaptive-thermogenesis',
    term: { en: "Adaptive thermogenesis", fr: "Thermogenèse adaptative" },
    definition: {
      en: "The small drop in energy use, beyond what weight loss alone explains, that happens when you diet. Real but usually modest; one reason progress slows over time.",
      fr: "La légère baisse de dépense énergétique, au-delà de ce qu'explique la perte de poids seule, qui se produit pendant un régime. Réelle mais généralement modeste ; c'est l'une des raisons du ralentissement des progrès.",
    },
    lessonId: 'plateaus-adaptation',
  },
  {
    id: 'diet-break-refeed',
    term: { en: "Diet break / refeed", fr: "Pause diète / refeed" },
    definition: {
      en: "A planned period of eating more: 1–2 weeks at maintenance for a diet break, or 1–2 higher-carb days for a refeed. Mainly helps you stay on track during a long diet.",
      fr: "Une période planifiée où tu manges plus : 1 à 2 semaines à la maintenance pour une pause diète, ou 1 à 2 jours plus riches en glucides pour un refeed. Aide surtout à tenir pendant un long régime.",
    },
    lessonId: 'plateaus-adaptation',
  },
];

// -----------------------------------------------------------------------------
// French typography (non-breaking spaces) + exports
// -----------------------------------------------------------------------------

const NBSP = ' ';

/**
 * Applies French typography to a string written with plain spaces:
 * - space before : ; ? ! » and after « becomes a non-breaking space
 * - thousands separators ("7 700") become non-breaking
 * - a number (or a {{token}}) followed by a unit ("30 g", "{{tdee}} kcal") stays together
 */
function frTypo(text: string): string {
  return text
    .replace(/ ([:;?!»])/g, NBSP + '$1')
    .replace(/« /g, '«' + NBSP)
    .replace(/(\d) (?=\d{3}(?!\d))/g, '$1' + NBSP)
    .replace(
      /(\d|\}\}) (kcal|kg|g\/kg|g|mg|ml|cl|L|cm|km|min|h|%|°C)(?![A-Za-zÀ-ÿ0-9])/g,
      '$1' + NBSP + '$2',
    );
}

const polishText = (text: LocalizedText): LocalizedText => ({ en: text.en, fr: frTypo(text.fr) });

const polishLesson = (lesson: Lesson): Lesson => ({
  ...lesson,
  title: polishText(lesson.title),
  summary: polishText(lesson.summary),
  sections: lesson.sections.map((section) => ({
    heading: polishText(section.heading),
    body: polishText(section.body),
  })),
  keyTakeaways: { en: lesson.keyTakeaways.en, fr: lesson.keyTakeaways.fr.map(frTypo) },
});

const polishGlossaryEntry = (entry: GlossaryEntry): GlossaryEntry => ({
  ...entry,
  term: polishText(entry.term),
  definition: polishText(entry.definition),
});

export const lessons: Lesson[] = rawLessons.map(polishLesson);

export const glossary: GlossaryEntry[] = rawGlossary.map(polishGlossaryEntry);

/** Recommended beginner reading order (every lesson id exactly once). */
export const lessonOrder: string[] = [
  'calories-101',
  'bmr-tdee',
  'deficit-explained',
  'scale-lies',
  'protein',
  'macros-carbs-fats',
  'reading-labels-portions',
  'hunger-tips',
  'strength-training-basics',
  'sets-reps-rir',
  'form-and-safety',
  'steps-cardio',
  'sleep-recovery',
  'water',
  'consistency-mindset',
  'plateaus-adaptation',
  'recomp-and-gaining',
  'ramadan-fasting',
];
