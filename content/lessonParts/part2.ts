// Lessons, part 2 (lessons 6-10: carbs & fats, labels, hunger, strength basics, sets & reps). Assembled in content/lessons.ts.

import type { Lesson } from '../lessons';
import { md, ul } from './md';

export const lessonsPart2: Lesson[] = [
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
      tn: "النشويات والدهون: ما ثمّاش ماكرو خايب",
      tnLatn: "Glucides w lipides: ma thammech macro 5ayeb",
    },
    summary: {
      en: "What your {{carbsG}} g of carbs and {{fatG}} g of fat do, and why you don't need to cut either one out.",
      fr: "À quoi servent tes {{carbsG}} g de glucides et tes {{fatG}} g de lipides, et pourquoi tu n'as besoin d'en supprimer aucun.",
      tn: "شنوّة يعملو الـ {{carbsG}} g نشويات والـ {{fatG}} g دهون متاعك، وعلاش ما يلزمكش تنحّي حتى واحد فيهم.",
      tnLatn: "Chnowa ya3mlou el {{carbsG}} g glucides wel {{fatG}} g lipides mte3ek, w 3lech ma yelzmekch tna77i 7atta wa7ed fihom.",
    },
    sections: [
      {
        heading: { en: "The three macros", fr: "Les trois macros", tn: "الثلاثة ماكرو", tnLatn: "Ethletha macros" },
        body: {
          en: md(
            "Calories come from three macronutrients: protein, carbohydrates and fat. Once your protein is set ({{proteinG}} g), the rest of your calories are split between carbs and fat. Your plan: about **{{carbsG}} g of carbs** and **{{fatG}} g of fat** per day.",
            "For weight loss, total calories matter most. The split mainly affects how you feel, how you train and how easy the plan is to follow.",
          ),
          fr: md(
            "Les calories viennent de trois macronutriments : les protéines, les glucides et les lipides. Une fois tes protéines fixées ({{proteinG}} g), le reste de tes calories se partage entre glucides et lipides. Ton plan : environ **{{carbsG}} g de glucides** et **{{fatG}} g de lipides** par jour.",
            "Pour perdre du poids, ce sont surtout les calories totales qui comptent. La répartition joue surtout sur ton ressenti, tes entraînements et la facilité à suivre le plan.",
          ),
          tn: md(
            "الكالوري تجي من ثلاثة ماكرو: البروتين، النشويات والدهون. كي تثبّت البروتين متاعك ({{proteinG}} g)، الباقي مالكالوري يتقسم بين النشويات والدهون. البرنامج متاعك: تقريب **{{carbsG}} g نشويات** و**{{fatG}} g دهون** في النهار.",
            "باش تنقّص في الوزن، الحاجة الأهمّ هي مجموع الكالوري. التقسيمة تأثّر خاصّة على كيفاش تحسّ روحك، كيفاش تتمرّن وقدّاش البرنامج ساهل باش تتبّعو.",
          ),
          tnLatn: md(
            "El calories yjiw men thletha macros: protéines, glucides w lipides. Ki tthabbet el protéines mte3ek ({{proteinG}} g), el ba9i mel calories yet9assem bin glucides w lipides. Programme mte3ek: ta9rib **{{carbsG}} g glucides** w **{{fatG}} g lipides** fel nhar.",
            "Bech tna99es fel poids, el 7aja el ahamm hiya total el calories. El ta9sima tbaddel 5assatan fi kifech t7ess rou7ek, kifech tetmarren w 9addech el programme sehel bech tetba3ou.",
          ),
        },
      },
      {
        heading: { en: "Fat: don't go too low", fr: "Les lipides : ne descends pas trop bas", tn: "الدهون: ما تهبّطهمش برشا", tnLatn: "Lipides: ma thabbethomch barcha" },
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
          tn: md(
            "الدهون ضرورية. بدنك يستحقّها باش يصنع الهرمونات (منهم التستوستيرون والأستروجين)، باش يمتصّ الفيتامينات A، D، E و K، وباش يبني خلايا صحيحة.",
            "أقلّ كمية ينصحو بيها عادة هي تقريب **0,6–0,8 g على كل kg من وزنك**، ولا تقريب **20–25% مالكالوري**. كان تهبّطهم برشا لمدّة شهور، تنجّم تخلوض الهرمونات متاعك، وعند النساء، الدورة الشهرية.",
            "اختار زيت الزيتون، اللوز والجوز، الزيتون، الأفوكا، العظم والحوت الأزرق كيف السردينة. أما تفكّر اللي الدهون تقيلة: 9 kcal في الغرام، يعني الكميات تطلع بالفيسع.",
          ),
          tnLatn: md(
            "El lipides lazmin. Bdenek yesta7a99hom bech ysna3 el hormones (menhom testostérone w œstrogènes), bech yemtass el vitamines A, D, E w K, w bech yebni cellules s7i7a.",
            "A9al kammiya ynass7ou biha 3ada hiya ta9rib **0,6–0,8 g 3la kol kg mel poids mte3ek**, walla ta9rib **20–25% mel calories**. Ken thabbethom barcha l chhoura, tnajjem t5alwedh el hormones mte3ek, w 3and ennsa, el cycle menstruel.",
            "A5tar zit zitoun, louz w jouz, zitoun, avocat, 3dham w 7out azre9 kima sardina. Ama tfakker elli el lipides t9al: 9 kcal fel gramme, ya3ni el portions yetla3ou bel fisa3.",
          ),
        },
      },
      {
        heading: { en: "Carbs: fuel, not the enemy", fr: "Les glucides : du carburant, pas un ennemi", tn: "النشويات: هي البنزين، موش العدو", tnLatn: "Glucides: houma l'essence, mouch el 3dou" },
        body: {
          en: md(
            "Carbs are your body's preferred fuel for hard effort. They're stored in your muscles and liver as **glycogen** and power your heavier sets and faster runs. With equal calories and protein, low-carb diets don't burn more fat; they simply suit some people's appetite better.",
            "Good choices: oats, rice, potatoes, couscous, whole-wheat or barley bread, pasta, fruit, legumes. Eating some carbs in the meal before or after training usually helps performance.",
          ),
          fr: md(
            "Les glucides sont le carburant préféré de ton corps pour les efforts intenses. Ils sont stockés dans tes muscles et ton foie sous forme de **glycogène** et alimentent tes séries lourdes et tes sprints. À calories et protéines égales, le low-carb ne fait pas perdre plus de gras ; il convient simplement mieux à l'appétit de certaines personnes.",
            "Bons choix : flocons d'avoine, riz, pommes de terre, couscous, pain complet ou pain d'orge, pâtes, fruits, légumineuses. Manger des glucides au repas avant ou après l'entraînement aide généralement tes performances.",
          ),
          tn: md(
            "النشويات هي البنزين اللي يحبّو بدنك في المجهود الصعيب. يتخزّنو في عضلاتك وفي الكبدة في شكل **غليكوجين**، وهوما اللي يعطيو الجهد للسيريات الثقيلة وللجري السريع. بنفس الكالوري ونفس البروتين، الريجيم اللي فيه نشويات قليلة ما يحرقش شحم أكثر؛ أما يناسب الشهيّة متاع بعض الناس خير.",
            "اختيارات باهية: الشوفان، الروز، البطاطا، الكسكسي، خبز كامل ولا خبز شعير، المقرونة، الغلّة، القطانية. كي تاكل شويّة نشويات في الماكلة اللي قبل ولا بعد التمرين، عادة تعاونك تعطي أكثر.",
          ),
          tnLatn: md(
            "Les glucides houma l'essence elli y7ebbha bdenek fel effort e sa3ib. Yet5azznou fi muscles mte3ek w fel kebda f chakl **glycogène**, w houma elli ya3tiw el jehd lel séries e t9al w lel jri e sri3. B nafs el calories w nafs el protéines, el régime low-carb ma ya7ro9ch gras akther; ama ynaseb el chahia mta3 ba3dh ennes 5ir.",
            "A5tiyarat behya: flocons d'avoine, rouz, batata, kosksi, khobz complet walla khobz cha3ir, ma9rouna, 8alla, 9tania. Ki takel chwaya glucides fel makla elli 9bal walla ba3d el entraînement, 3ada t3awnek ta3ti akther.",
          ),
        },
      },
      {
        heading: { en: "Fiber: the quiet hero", fr: "Les fibres : le héros discret", tn: "الألياف: البطل الساكت", tnLatn: "Fibres: el batal e sakket" },
        body: {
          en: md(
            "Fiber is a type of carb you don't fully digest. It keeps you full, feeds healthy gut bacteria and supports digestion and heart health. Aim for about **25–35 g per day**. Vegetables, fruit, legumes, whole grains and oats are your best sources. If you eat little fiber today, increase it gradually and drink enough water to avoid bloating.",
          ),
          fr: md(
            "Les fibres sont des glucides que tu ne digères pas complètement. Elles rassasient, nourrissent les bonnes bactéries de l'intestin et soutiennent la digestion et la santé du cœur. Vise environ **25 à 35 g par jour**. Légumes, fruits, légumineuses, céréales complètes et flocons d'avoine sont tes meilleures sources. Si tu en manges peu aujourd'hui, augmente progressivement et bois assez d'eau pour éviter les ballonnements.",
          ),
          tn: md(
            "الألياف نوع من النشويات اللي بدنك ما يهضمهاش الكل. تخلّيك شبعان، توكّل البكتيريا الباهية اللي في المصارن، وتعاون على الهضم وعلى صحّة القلب. حاول توصل لتقريب **25–35 g في النهار**. الخضرة، الغلّة، القطانية، الحبوب الكاملة والشوفان هوما أحسن مصادر. كان توّا تاكل ألياف قليلة، زيد فيها بالشويّة واشرب ماء بالقدا باش ما تتنفّخش.",
          ),
          tnLatn: md(
            "Les fibres naw3 men les glucides elli bdenek ma yahdhomhomch lkol. T5allik chab3an, twakkel el bactéries el behya elli fel msaren, w t3awen 3al hadhm w 3la sa77et el 9alb. 7awel toussel l ta9rib **25–35 g fel nhar**. El 5odhra, el 8alla, el 9tania, el céréales complètes w el flocons d'avoine houma a7sen sources. Ken taw takel fibres 9lal, zid fihom bechwaya w ochrob mé bel 9ada bech ma tetnaffa5ch.",
          ),
        },
      },
      {
        heading: { en: "Flexible, not strict", fr: "Flexible, pas rigide", tn: "مرن، موش صارم", tnLatn: "Flexible, mouch strict" },
        body: {
          en: md(
            "Calories and protein are the numbers to hit. Carbs and fat can swing from day to day: a day with more fat and fewer carbs, or the reverse, is fine as long as total calories stay on target and fat doesn't stay very low.",
          ),
          fr: md(
            "Les calories et les protéines sont les chiffres à atteindre. Glucides et lipides peuvent varier d'un jour à l'autre : une journée avec plus de lipides et moins de glucides, ou l'inverse, ça va, tant que le total des calories reste dans l'objectif et que les lipides ne restent pas très bas.",
          ),
          tn: md(
            "الكالوري والبروتين هوما الأرقام اللي لازمك توصلّها. النشويات والدهون ينجّمو يتبدّلو من نهار لنهار: نهار فيه دهون أكثر ونشويات أقل، ولا العكس، ما فيه حتى مشكل، المهم مجموع الكالوري يقعد في الهدف والدهون ما يقعدوش هابطين برشا.",
          ),
          tnLatn: md(
            "El calories w el protéines houma el ar9am elli lazmek touslelhom. El glucides w el lipides ynajmou yetbadlou men nhar l nhar: nhar fih lipides akther w glucides a9al, walla l3aks, ma fih 7atta mochkel, el mohemm total el calories yo93ed fel objectif w el lipides ma yo93douch habtin barcha.",
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
      tn: [
        "البرنامج متاعك: تقريب {{carbsG}} g نشويات و {{fatG}} g دهون؛ الكالوري والبروتين هوما الأهمّ.",
        "خلّي الدهون على الأقل تقريب 0,6–0,8 g/kg (يعني 20–25% مالكالوري) باش الهرمونات متاعك تقعد لاباس.",
        "النشويات تعطيك الجهد للتمرين الصعيب؛ وحدهم ما يسمّنوكش.",
        "حاول تاكل 25–35 g ألياف في النهار مالخضرة، الغلّة، القطانية والحبوب الكاملة.",
      ],
      tnLatn: [
        "Programme mte3ek: ta9rib {{carbsG}} g glucides w {{fatG}} g lipides; el calories w el protéines houma el ahamm.",
        "5alli el lipides 3al a9al ta9rib 0,6–0,8 g/kg (ya3ni 20–25% mel calories) bech el hormones mte3ek yo93dou labes.",
        "Les glucides ya3tiwek el jehd lel entraînement e sa3ib; wa7adhom ma ysamnoukch.",
        "7awel takel 25–35 g fibres fel nhar mel 5odhra, el 8alla, el 9tania w el céréales complètes.",
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
      tn: "الإتيكات، الكميات والكالوري المخبّية",
      tnLatn: "Étiquettes, portions w calories m5abbya",
    },
    summary: {
      en: "How to read a nutrition label, why a kitchen scale is worth two weeks of your time, and where calories like to hide.",
      fr: "Comment lire une étiquette nutritionnelle, pourquoi une balance de cuisine vaut bien deux semaines d'efforts, et où se cachent les calories.",
      tn: "كيفاش تقرا الإتيكات متاع الماكلة، علاش ميزان كوجينة يستاهل جمعتين من وقتك، ووين تحبّ الكالوري تتخبّى.",
      tnLatn: "Kifech ta9ra l'étiquette mta3 el makla, 3lech mizen cuisine yestehel jem3tin men wa9tek, w win y7ebbou el calories yet5abbew.",
    },
    sections: [
      {
        heading: { en: "Per 100 g vs per serving", fr: "Pour 100 g ou par portion", tn: "في 100 g ولا في البورسيون", tnLatn: "Fi 100 g walla fel portion" },
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
          tn: md(
            "أغلب الإتيكات يكتبو الأرقام **في 100 g** (ولا 100 ml)، ومرّات **في البورسيون**. الخانة متاع 100 g هي اللي تنجّم تعتمد عليها باش تقارن بين الماكلة. البورسيون اللي مكتوبة برشا مرّات أصغر من اللي ياكلوه الناس بالحق.",
            "مثال: سيريال فطور الصباح فيها 380 kcal في 100 g، و“البورسيون” 30 g = 114 kcal. أما زلافة تعبّيها بعينك برشا مرّات تجي 60–80 g، يعني 230–300 kcal قبل ما تزيد الحليب.",
            "والإتيكات زادة عندها الحقّ في هامش: القيمة الحقيقية تنجّم تختلف بتقريب **±20%**. ما فيها حتى مشكل؛ الغلطات الصغار يتعادلو مع الجمعات.",
          ),
          tnLatn: md(
            "A8leb les étiquettes yektbou el valeurs **fi 100 g** (walla 100 ml), w marrat **fel portion**. La colonne mta3 100 g hiya elli tnajjem tet3ammed 3liha bech t9aren bin el makla. El portion elli mektouba barcha marrat as8ar mel 7aja elli yeklouha ennes bel 7a9.",
            "Mathalan: céréales mta3 ftour sbe7 fihom 380 kcal fi 100 g, w “la portion” 30 g = 114 kcal. Ama zlafa t3abbiha bel 3in barcha marrat tji 60–80 g, ya3ni 230–300 kcal 9bal ma tzid el 7lib.",
            "W les étiquettes zeda 3andhom el 7a9 f marge: el valeur el 7a9i9iya tnajjem tetbaddel b ta9rib **±20%**. Ma fiha 7atta mochkel; el 8altat e s8ar yet3adlou m3a el jem3at.",
          ),
        },
      },
      {
        heading: { en: "The kitchen scale trick", fr: "L'astuce de la balance de cuisine", tn: "الحيلة متاع ميزان الكوجينة", tnLatn: "El 7ila mta3 mizen el cuisine" },
        body: {
          en: md(
            "Judging portions by eye is hard: people often underestimate what they eat by 20–40%. A cheap kitchen scale fixes this.",
            "Weigh your food for **about two weeks**: rice, pasta, bread, oil, nuts, cheese. You'll quickly learn what 150 g of cooked rice or 30 g of almonds looks like. After that you can estimate far better, and just weigh now and then to check.",
          ),
          fr: md(
            "Évaluer les portions à l'œil, c'est difficile : on sous-estime souvent ce qu'on mange de 20 à 40 %. Une petite balance de cuisine règle le problème.",
            "Pèse tes aliments pendant **environ deux semaines** : riz, pâtes, pain, huile, fruits secs, fromage. Tu apprendras vite à quoi ressemblent 150 g de riz cuit ou 30 g d'amandes. Ensuite, tu estimeras beaucoup mieux, et il suffira de vérifier de temps en temps.",
          ),
          tn: md(
            "باش تقدّر الكمية بعينك حاجة صعيبة: الناس برشا مرّات يحسبو اللي ياكلوه أقلّ مالحقيقة بـ 20–40%. ميزان كوجينة رخيص يحلّ المشكلة.",
            "وزن ماكلتك **تقريب جمعتين**: الروز، المقرونة، الخبز، الزيت، الفواكه الجافة، الفرماج. بالفيسع باش تتعلّم كيفاش يبان 150 g روز طايب ولا 30 g لوز. من بعد تولّي تقدّر خير برشا، وتوزن من وقت لوقت كان باش تتثبّت.",
          ),
          tnLatn: md(
            "T9addar el portion bel 3in 7aja s3iba: ennes barcha marrat y7esbou elli yeklouh a9al mel 7a9i9a b 20–40%. Mizen cuisine r5is y7ell el mochkla.",
            "Wazen makeltek **ta9rib jem3tin**: rouz, ma9rouna, khobz, zit, fruits secs, fromage. Bel fisa3 bech tet3allem kifech ybén 150 g rouz tayeb walla 30 g louz. Mba3d twalli t9addar 5ir barcha, w twazen men wa9t l wa9t ken bech tetthabbet.",
          ),
        },
      },
      {
        heading: { en: "Olive oil: the biggest hidden source", fr: "L'huile d'olive : la source cachée n° 1", tn: "زيت الزيتون: أكبر مصدر مخبّي", tnLatn: "Zit zitoun: akbar source m5abbya" },
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
          tn: md(
            "زيت الزيتون صحّي، أما زادة هو أكثر حاجة فيها كالوري في الكوجينة متاعك:",
            ul("**1 مغرفة كبيرة ≈ 120 kcal**", "**1 مغرفة صغيرة ≈ 40 kcal**"),
            "في الطبخ التونسي، الزيت يتلمّ بالفيسع. طنجرة عجّة، ملوخية ولا مرقة تنجّم بالساهل يكون فيها 4–6 مغارف كبار (500–700 kcal) متقسّمين على كم صحن. وكي تكبّ الزيت بالبركة على اللبلابي، السلاطة المشوية ولا الكسكسي، وحدها تنجّم تجي 1–2 مغارف كبار.",
            "ما يلزمكش تنحّيه. قيسو بالمغرفة عوض ما تكبّ مالدبّوزة، وسجّلو.",
          ),
          tnLatn: md(
            "Zit zitoun sa77i, ama zeda houwa akther 7aja fiha calories fel cuisine mte3ek:",
            ul("**1 m8orfa kbira ≈ 120 kcal**", "**1 m8orfa s8ira ≈ 40 kcal**"),
            "Fel tab5 ettounsi, ezzit yetlamm bel fisa3. Tanjra 3ejja, mloukhia walla mar9a tnajjem bessehel ykoun fiha 4–6 m8aref kbar (500–700 kcal) m9assmin 3la chwaya s7oun. W ki tkobb ezzit bel baraka 3al lablebi, slata mechouia walla kosksi, wa7adha tnajjem tji 1–2 m8aref kbar.",
            "Ma yelzmekch tna77ih. 9isou bel m8orfa 3oudh ma tkobb mel dabbouza, w sajjlou.",
          ),
        },
      },
      {
        heading: { en: "Other hidden calories", fr: "Les autres calories cachées", tn: "كالوري أخرى مخبّية", tnLatn: "Calories o5rin m5abbyin" },
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
          tn: md(
            ul(
              "**الخبز:** خبزة كاملة فيها تقريب 550–700 kcal حسب كبرها؛ الربع فيه تقريب 150 kcal. الملاوي والخبز اللي يتطيّب بالزيت فيهم أكثر.",
              "**الصلصات والحاجات اللي تتدهن:** المايونيز، الهريسة اللي فوقها زيت، الزبدة، الشكلاطة اللي تتدهن.",
              "**المشروبات بالسكّر:** كانيت قازوز فيها تقريب 140 kcal، كاس عصير تقريب 100–120 kcal. كل مغرفة صغيرة سكّر في التاي ولا القهوة تزيد تقريب 16–20 kcal، وهذا يتلمّ كي تشرب برشا كيسان.",
              "**الفواكه الجافة:** ماكلة باهية برشا، أما تقيلة بالكالوري. قبضة لوز (30 g) فيها تقريب 180 kcal، وتمرة وحدة تقريب 20–25 kcal.",
              "**الماكلة المقلية:** القلي يزيد زيت ما تشوفوش (بريك، فريت، فطاير).",
            ),
          ),
          tnLatn: md(
            ul(
              "**Khobz:** khobza kemla fiha ta9rib 550–700 kcal 7asb kbarha; erroba3 fih ta9rib 150 kcal. El mlewi w el khobz elli yetteyyeb bezzit fihom akther.",
              "**Sauces w 7wayej tetdhen:** mayonnaise, harissa fou9ha zit, zebda, chocolat à tartiner.",
              "**Machroubet bessokkor:** canette gazouz fiha ta9rib 140 kcal, kes jus ta9rib 100–120 kcal. Kol m8orfa s8ira sokkor fettey walla el 9ahwa tzid ta9rib 16–20 kcal, w hedha yetlamm ki tochrob barcha kisen.",
              "**Fruits secs:** makla behya barcha, ama t9ila bel calories. 9obdha louz (30 g) fiha ta9rib 180 kcal, w tmara wa7da ta9rib 20–25 kcal.",
              "**Makla ma9lia:** el 9li yzid zit ma tchoufouch (brik, frites, ftayer).",
            ),
          ),
        },
      },
      {
        heading: { en: "How photo scans work", fr: "Comment fonctionne l'analyse photo", tn: "كيفاش يخدم السكان بالتصويرة", tnLatn: "Kifech ya5dem el scan bel photo" },
        body: {
          en: md(
            "When you photograph a meal, Tounsi Fit identifies the foods, estimates portion sizes from the picture and uses typical nutrition values. It's a fast, useful estimate, but it can't see everything:",
            ul(
              "It can't see **oil** soaked into the food or hidden under it.",
              "It can't see **sugar** dissolved in a drink or sauce.",
              "Portion size is hard to judge from a photo: a deep plate can look like a shallow one.",
            ),
            "After each scan, check the portion and add any oil, butter or sugar it may have missed. Ten seconds of correction makes a big difference.",
          ),
          fr: md(
            "Quand tu prends un repas en photo, Tounsi Fit identifie les aliments, estime les portions à partir de l'image et utilise des valeurs nutritionnelles typiques. C'est une estimation rapide et utile, mais elle ne voit pas tout :",
            ul(
              "Elle ne voit pas l'**huile** absorbée par les aliments ou cachée au fond de l'assiette.",
              "Elle ne voit pas le **sucre** dissous dans une boisson ou une sauce.",
              "La taille d'une portion est difficile à juger sur une photo : une assiette creuse peut ressembler à une assiette plate.",
            ),
            "Après chaque analyse, vérifie la portion et ajoute l'huile, le beurre ou le sucre qui ont pu lui échapper. Dix secondes de correction font une vraie différence.",
          ),
          tn: md(
            "كي تصوّر ماكلتك، Tounsi Fit يعرف شنوّة فيها، يقدّر الكميات مالتصويرة ويستعمل قيم غذائية عادية. هو تقدير سريع ومفيد، أما ما ينجّمش يشوف كل شي:",
            ul(
              "ما ينجّمش يشوف **الزيت** اللي شربتو الماكلة ولا اللي مخبّي تحتها.",
              "ما ينجّمش يشوف **السكّر** اللي ذايب في مشروب ولا في صلصة.",
              "الكمية صعيب تقدّرها من تصويرة: صحن غارق ينجّم يبان كيف صحن مبسوط.",
            ),
            "بعد كل سكان، تثبّت في الكمية وزيد الزيت، الزبدة ولا السكّر اللي ينجّم يكون فاتو. عشرة ثواني تصليح يعملو فرق كبير.",
          ),
          tnLatn: md(
            "Ki tsawwer makeltek, Tounsi Fit ya3ref chnowa fiha, y9addar el portions mel photo w yesta3mel valeurs nutritionnelles 3adiya. Houwa ta9dir sri3 w mfid, ama ma ynajjemch ychouf kol chay:",
            ul(
              "Ma ynajjemch ychouf **ezzit** elli chorbtou el makla walla elli m5abbi ta7tha.",
              "Ma ynajjemch ychouf **essokkor** elli dhayeb f machroub walla f sauce.",
              "El portion s3ib t9addarha men photo: sa7n 8are9 ynajjem ybén kima sa7n mabsout.",
            ),
            "Ba3d kol scan, tthabbet fel portion w zid ezzit, ezzebda walla essokkor elli ynajjem ykoun fetou. 3achra secondes tasli7 ya3mlou far9 kbir.",
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
      tn: [
        "اعتمد على الخانة متاع 100 g؛ البورسيون اللي على الباكو برشا مرّات أصغر مالكمية الحقيقية.",
        "وزن ماكلتك تقريب جمعتين باش تدرّب عينك.",
        "زيت الزيتون فيه تقريب 120 kcal في المغرفة الكبيرة: قيسو بالمغرفة وسجّلو.",
        "السكان بالتصويرة يعطيك تقدير: تثبّت في الكمية وزيد الزيت ولا السكّر المخبّي.",
      ],
      tnLatn: [
        "Et3ammed 3la la colonne mta3 100 g; el portion elli 3al paquet barcha marrat as8ar mel portion el 7a9i9iya.",
        "Wazen makeltek ta9rib jem3tin bech tdarreb 3inek.",
        "Zit zitoun fih ta9rib 120 kcal fel m8orfa el kbira: 9isou bel m8orfa w sajjlou.",
        "El scan bel photo ya3tik ta9dir: tthabbet fel portion w zid ezzit walla essokkor el m5abbi.",
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
      tn: "كيفاش تتعامل مع الجوع في حياتك",
      tnLatn: "Kifech tet3amel m3a el jou3 fi 7yetek",
    },
    summary: {
      en: "Practical ways to feel full on fewer calories, from volume eating to bread, sweet tea and family meals.",
      fr: "Des astuces concrètes pour avoir moins faim avec moins de calories : volume, pain, thé sucré et repas de famille.",
      tn: "حيل عملية باش تشبع بكالوري أقل: ماكلة تعمّر، الخبز، التاي الحلو وماكلة العايلة.",
      tnLatn: "7iyel pratiques bech tochba3 b calories a9al: makla t3ammer, el khobz, ettey el 7lou w makla mta3 el 3ayla.",
    },
    sections: [
      {
        heading: { en: "Some hunger is normal", fr: "Un peu de faim, c'est normal", tn: "شويّة جوع حاجة عادية", tnLatn: "Chwaya jou3 7aja 3adiya" },
        body: {
          en: md(
            "Feeling a little hungry before meals is normal in a deficit; it doesn't mean something is wrong. The goal isn't zero hunger, it's hunger you can live with. These habits make a big difference.",
          ),
          fr: md(
            "Avoir un peu faim avant les repas est normal en déficit : ça ne veut pas dire que quelque chose ne va pas. Le but n'est pas de ne jamais avoir faim, mais d'avoir une faim gérable. Ces habitudes font une grosse différence.",
          ),
          tn: md(
            "كي تكون في ديفيسيت، عادي تحسّ روحك جيعان شويّة قبل الماكلة؛ ما معناهاش اللي ثمّة حاجة موش لاباس. الهدف موش إنّك ما تجوعش جملة، الهدف جوع تنجّم تتعايش معاه. العادات هاذم يعملو فرق كبير.",
          ),
          tnLatn: md(
            "Ki tkoun en déficit, 3adi t7ess rou7ek ji3an chwaya 9bal el makla; ma ma3nehech elli famma 7aja mouch labes. El objectif mouch ennek ma tjou3ch jemla, el objectif jou3 tnajjem tet3ayech m3ah. El 3adet hedhom ya3mlou far9 kbir.",
          ),
        },
      },
      {
        heading: { en: "More food for fewer calories", fr: "Manger plus pour moins de calories", tn: "ماكلة أكثر بكالوري أقل", tnLatn: "Makla akther b calories a9al" },
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
          tn: md(
            ul(
              "**البروتين الأوّل:** ابدا كل ماكلة بالبروتين متاعك؛ هو الماكرو اللي يشبّع أكثر.",
              "**نصّ الصحن خضرة:** سلاطة تونسية (طماطم، فقّوس، بصل)، فلفل مشوي، خضرة في الفور ولا على البخار. ماكلة برشا، كالوري قليلة.",
              "**الشربة:** زلافة شربة ولا شربة خضرة قبل الصحن الأساسي تكسّر الجوع.",
              "**الغلّة خير مالعصير:** بردقانة تشبّعك؛ كاس عصير بردقان لا.",
              "**الألياف:** القطانية، الشوفان والحبوب الكاملة يتهضمو بالشويّة ويخلّيوك شبعان مدّة أطول.",
            ),
          ),
          tnLatn: md(
            ul(
              "**Protéines lowlin:** ebda kol makla bel protéines mte3ek; houma el macro elli ychabba3 akther.",
              "**Nos e sa7n 5odhra:** slata tounsia (tmatem, fa99ous, bsal), felfel mechwi, 5odhra fel four walla à la vapeur. Makla barcha, calories 9lal.",
              "**Chorba:** zlafa chorba walla chorba 5odhra 9bal e sa7n el assesi tkasser el jou3.",
              "**8alla 5ir mel jus:** bordgena tchabba3ek; kes jus bordgen le.",
              "**Fibres:** el 9tania, el flocons d'avoine w el céréales complètes yethadhmou bechwaya w y5alliwek chab3an wa9t atwal.",
            ),
          ),
        },
      },
      {
        heading: { en: "Everyday Tunisian habits", fr: "Les habitudes du quotidien en Tunisie", tn: "عادات تونسية متاع كل يوم", tnLatn: "3adet tounsia mta3 kol youm" },
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
          tn: md(
            ul(
              "**الخبز مع كل ماكلة:** خلّيه، أما قرّر قدّاش باش تاكل قبل ما تبدا (مثلا ربع خبزة)، وما تمسحش بيه الزيت اللي في قاع الصحن. الخبز الكامل ولا خبز الشعير يشبّع أكثر.",
              "**التاي الحلو:** نقّص السكّر بالشويّة، من 4 مغارف صغار لـ 3، ومن بعد 2. الذوق متاعك يتعوّد في كم جمعة. السكّر الدايت زادة حلّ باهي.",
              "**المرطبات والحلو:** ما يلزمكش تمنعهم. خطّط ليهم: كان تعرف اللي باش يكون مقروض ولا بقلاوة مع القهوة، دخّلهم في نهارك وخفّف الماكلات الأخرى.",
              "**فطور رمضان:** افطر بالماء والتمر والشربة، استنّى شويّة، ومن بعد كول الصحن الأساسي. درس رمضان فيه أكثر.",
            ),
          ),
          tnLatn: md(
            ul(
              "**Khobz m3a kol makla:** 5allih, ama 9arrer 9addech bech takel 9bal ma tebda (mathalan roba3 khobza), w ma tmasse7ch bih ezzit elli fi 9a3 e sa7n. El khobz complet walla khobz cha3ir ychabba3 akther.",
              "**Tey 7lou:** na99es essokkor bechwaya, men 4 m8aref s8ar l 3, mba3d 2. Edhou9 mte3ek yet3awwed fi chwaya jem3at. Les édulcorants zeda 7all behi.",
              "**Pâtisserie w 7lou:** ma yelzmekch tamna3hom. 5attatlhom: ken ta3ref elli bech ykoun makroudh walla baklewa m3a el 9ahwa, da55elhom fi nharek w 5affef el maklet lo5rin.",
              "**Ftour Romdhan:** aftar bel mé, tmar w chorba, estanna chwaya, mba3d koul e sa7n el assesi. Dars Romdhan fih akther.",
            ),
          ),
        },
      },
      {
        heading: { en: "Plan ahead", fr: "Anticipe", tn: "خطّط من قبل", tnLatn: "5attat mel 9bal" },
        body: {
          en: md(
            "Hunger wins when there's no plan. Log your main meals in the morning or the night before, keep easy snacks around (yogurt, fruit, boiled eggs, lben), and don't skip lunch only to reach dinner starving.",
          ),
          fr: md(
            "La faim gagne quand il n'y a pas de plan. Note tes repas principaux le matin ou la veille, garde des collations faciles sous la main (yaourt, fruit, œufs durs, lben), et évite de sauter le déjeuner pour arriver au dîner avec une faim de loup.",
          ),
          tn: md(
            "الجوع يربح كي ما يكونش عندك برنامج. سجّل الماكلات الأساسية متاعك في الصباح ولا من الليلة اللي قبل، خلّي لمجات ساهلة قريبة منك (ياغورت، غلّة، عظم مسلوق، لبن)، وما تفوّتش الغدا باش توصل للعشا ميّت بالجوع.",
          ),
          tnLatn: md(
            "El jou3 yerba7 ki ma ykounch 3andek programme. Sajjel el maklet el assesiya mte3ek fe sbe7 walla mel lila elli 9bal, 5alli lemjet sahlin 9rib minek (yaourt, 8alla, 3dham maslou9, lben), w ma tfawwetch el 8de bech toussel lel 3cha mayet bel jou3.",
          ),
        },
      },
      {
        heading: { en: "Eating out, family meals and weekends", fr: "Restaurants, repas de famille et week-ends", tn: "الماكلة برّا، ماكلة العايلة والويكاند", tnLatn: "Makla berra, makla mta3 el 3ayla w el weekend" },
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
          tn: md(
            ul(
              "اختار المشوي عوض المقلي، اطلب الصلصة وحدها على جنب، وحطّ لروحك صحن واحد.",
              "“لا يعيشك، شبعت” بلطف مسموحة. وإنّك تتمتّع بالماكلة زادة مسموح.",
              "الويكاند برشا مرّات يفسّخ الديفيسيت متاع الجمعة. ما يلزمكش تكون كامل؛ اقعد تقريب في الهدف وبرّا.",
              "ماكلة كبيرة وحدة ما تفسد شي. ارجع عادي في الماكلة اللي بعدها؛ ما يلزمكش تجوّع روحك باش تعوّض.",
            ),
          ),
          tnLatn: md(
            ul(
              "A5tar el mechwi 3oudh el ma9li, otlob e sauce wa7adha 3la jnab, w 7ott l rou7ek sa7n wa7ed.",
              "“Le y3aychek, chba3t” bel ladhafa masmou7a. W ennek tetmatta3 bel makla zeda masmou7.",
              "El weekend barcha marrat yfassa5 el déficit mta3 el jem3a. Ma yelzmekch tkoun parfait; o93ed ta9rib fel objectif w barra.",
              "Makla kbira wa7da ma tfassed chay. Erja3 3adi fel makla elli ba3dha; ma yelzmekch tjawwa3 rou7ek bech t3awedh.",
            ),
          ),
        },
      },
      {
        heading: { en: "Sleep and stress", fr: "Sommeil et stress", tn: "النوم والستراس", tnLatn: "Noum w stress" },
        body: {
          en: md(
            "Short sleep raises hunger hormones and cravings, and stress does too. Getting 7–9 hours of sleep is one of the easiest hunger fixes there is.",
          ),
          fr: md(
            "Le manque de sommeil augmente les hormones de la faim et les envies de sucré, et le stress aussi. Dormir 7 à 9 heures est l'une des solutions les plus simples contre la faim.",
          ),
          tn: md(
            "قلّة النوم تزيد في هرمونات الجوع وفي الشهوة للماكلة، والستراس زادة. كي ترقد 7–9 سوايع، هذا من أسهل الحلول للجوع.",
          ),
          tnLatn: md(
            "9illet ennoum tzid fi hormones el jou3 w fel chahwa lel makla, w el stress zeda. Ki tor9od 7–9 swaye3, hedha men ashel el 7loul lel jou3.",
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
      tn: [
        "ابدا بالبروتين وعمّر نصّ صحنك بالخضرة ولا بالشربة.",
        "قرّر قدّاش باش تاكل خبز من قبل، وقيس الزيت.",
        "دخّل الحلو في برنامج نهارك عوض ما تمنعو.",
        "نظّم ماكلتك ورقد 7–9 سوايع باش يقعد الجوع تحت السيطرة.",
      ],
      tnLatn: [
        "Ebda bel protéines w 3ammer nos sa7nek bel 5odhra walla bel chorba.",
        "9arrer 9addech bech takel khobz mel 9bal, w 9is ezzit.",
        "Da55el el 7lou fi programme nharek 3oudh ma tamn3ou.",
        "Nadhdhem makeltek w or9od 7–9 swaye3 bech yo93ed el jou3 ta7t el contrôle.",
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
      tn: "الموسكولاسيون: علاش وكيفاش تبدا",
      tnLatn: "Musculation: 3lech w kifech tebda",
    },
    summary: {
      en: "Why lifting matters even when your goal is fat loss, and the principle behind all progress: progressive overload.",
      fr: "Pourquoi soulever des poids compte même si ton but est de perdre du gras, et le principe derrière tout progrès : la surcharge progressive.",
      tn: "علاش الحديد مهمّ حتى كان هدفك تنقّص الشحم، والمبدأ اللي وراء كل تقدّم: الزيادة التدريجية.",
      tnLatn: "3lech el 7did mohemm 7atta ken l'objectif mte3ek tna99es el gras, w el principe elli wra kol progrès: la surcharge progressive.",
    },
    sections: [
      {
        heading: { en: "Why lift if you want to lose fat?", fr: "Pourquoi faire de la muscu si tu veux perdre du gras ?", tn: "علاش تعمل موسكو كان تحبّ تنقّص الشحم؟", tnLatn: "3lech ta3mel muscu ken t7eb tna99es el gras?" },
        body: {
          en: md(
            "In a deficit, your body loses weight from somewhere. If it has no reason to keep muscle, part of that weight comes from muscle. Strength training gives it that reason. Combined with enough protein, it means most of what you lose is fat.",
            "The result: at the same weight, you look firmer and more athletic, not just like a smaller version of yourself. Lifting also strengthens bones and joints, improves blood sugar control and makes daily life easier. And muscle burns a bit more energy than fat, though the effect is smaller than often claimed (roughly 10–15 kcal per kg of muscle per day).",
          ),
          fr: md(
            "En déficit, ton corps perd du poids quelque part. S'il n'a aucune raison de garder ses muscles, une partie de ce poids viendra du muscle. La musculation lui donne cette raison. Avec assez de protéines, la plus grande partie de ce que tu perds sera du gras.",
            "Résultat : à poids égal, ton corps paraît plus ferme et plus athlétique, pas juste une version plus petite de toi-même. La musculation renforce aussi les os et les articulations, améliore la gestion du sucre dans le sang et facilite la vie de tous les jours. Et le muscle brûle un peu plus d'énergie que le gras, même si l'effet est plus faible qu'on ne le dit souvent (environ 10 à 15 kcal par kg de muscle et par jour).",
          ),
          tn: md(
            "كي تكون في ديفيسيت، الوزن اللي ينقّصو بدنك لازم يجي من بلاصة. كان ما عندوش سبب باش يحافظ على العضلات، جزء من الوزن هذا يمشي مالعضلات. الموسكولاسيون تعطيه السبب هذا. ومع بروتين بالقدا، أغلب اللي تنقّصو يكون شحم.",
            "النتيجة: بنفس الوزن، تبان مشدود وسبورتيف أكثر، موش كان نسخة أصغر منّك. الحديد زادة يقوّي العظام والمفاصل، يحسّن السيطرة على السكّر في الدم ويسهّلك حياتك اليومية. والعضلات تحرق شويّة طاقة أكثر مالشحم، أما التأثير أصغر من اللي يقولوه برشا (تقريب 10–15 kcal على كل kg عضلات في النهار).",
          ),
          tnLatn: md(
            "Ki tkoun en déficit, el poids elli yna99sou bdenek lazem yji men blasa. Ken ma 3andouch sbab bech y7afedh 3al muscles, jez men el poids hedha yemchi mel muscles. El musculation ta3tih essbab hedha. W m3a protéines bel 9ada, a8leb elli tna99sou ykoun gras.",
            "Ennatija: b nafs el poids, tbén machdoud w sportif akther, mouch ken version as8ar minek. El 7did zeda y9awwi el 3dham w el articulations, y7assen el contrôle mta3 essokkor fel dam w ysahhellek 7yetek el yawmiya. W el muscles ya7r9ou chwaya énergie akther mel gras, ama l'effet as8ar mel 7aja elli y9oulouha barcha (ta9rib 10–15 kcal 3la kol kg muscles fel nhar).",
          ),
        },
      },
      {
        heading: { en: "Progressive overload", fr: "La surcharge progressive", tn: "الزيادة التدريجية", tnLatn: "La surcharge progressive" },
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
          tn: md(
            "العضلات تتعوّد على اللي تطلبو منها. باش تقعد تتحسّن، لازمك تطلب منها شويّة أكثر مع الوقت: هذي هي **الزيادة التدريجية**. تنجّم تعملها كيما هكّا:",
            ul(
              "تزيد في الثقل (مثلا من 40 kg لـ 42,5 kg)",
              "تعمل مرّات أكثر بنفس الثقل",
              "تزيد سيري",
              "تحسّن التكنيك متاعك وتعمل الحركة كاملة",
            ),
            "زيادات صغار وبانتظام خير من قفزات كبار. كي تسجّل الحصص متاعك، تعرف كان راك تتقدّم.",
          ),
          tnLatn: md(
            "El muscles yet3awdou 3al 7aja elli totlobha menhom. Bech to93ed tet7assen, lazmek totlob menhom chwaya akther m3a el wa9t: hedhi hiya **la surcharge progressive**. Tnajjem ta3melha haka:",
            ul(
              "Tzid fel charge (mathalan men 40 kg l 42,5 kg)",
              "Ta3mel reps akther b nafs el charge",
              "Tzid série",
              "T7assen la technique mte3ek w l'amplitude mta3 el 7araka",
            ),
            "Ziyedet s8ar w b intidham 5ir men 9afzat kbar. Ki tsajjel les séances mte3ek, ta3ref ken rak tet9addem.",
          ),
        },
      },
      {
        heading: { en: "Compound vs isolation exercises", fr: "Exercices polyarticulaires ou d'isolation", tn: "التمارين المركّبة ولا تمارين الإيزولاسيون", tnLatn: "Exercices polyarticulaires walla d'isolation" },
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
          tn: md(
            ul(
              "**التمارين المركّبة** تخدّم برشا عضلات ومفاصل في نفس الوقت: السكوات، السولوفي دو تار وتمارين الهانش الأخرى، الديفلوبي كوشي، الديفلوبي ميليتار، الروينغ، التراكسيون ولا التيراج فيرتيكال، الفانت. هوما اللي يعطيوك أكثر نتيجة على الوقت اللي تعطيه، ولازم يكونو الأساس متاع البرنامج متاعك.",
              "**تمارين الإيزولاسيون** تخدّم عضلة وحدة: الكورل بيسبس، الإكستنسيون تريسبس، الإيليفاسيون لاتيرال، اللاق كورل، المولي. هوما زيادات مفيدة باش تكبّر عضلات معيّنة.",
            ),
            "حصّة باهية لمبتدئ: 3–5 تمارين مركّبة زايد 1–2 تمارين إيزولاسيون.",
          ),
          tnLatn: md(
            ul(
              "**Les exercices polyarticulaires** y5addmou barcha muscles w articulations fi nafs el wa9t: squat, soulevé de terre w exercices o5rin mta3 el hanche, développé couché, développé militaire, rowing, tractions walla tirage vertical, fentes. Houma elli ya3tiwek akther résultat 3al wa9t elli ta3tih, w lazem ykounou el base mta3 el programme mte3ek.",
              "**Les exercices d'isolation** y5addmou muscle wa7ed: curl biceps, extension triceps, élévations latérales, leg curl, mollets. Houma zyedat mfida bech tkabber muscles m3ayna.",
            ),
            "Séance behya l débutant: 3–5 exercices polyarticulaires w 1–2 exercices d'isolation.",
          ),
        },
      },
      {
        heading: { en: "Beginner gains are real", fr: "Les progrès du débutant sont bien réels", tn: "التقدّم متاع المبتدئ حقيقي", tnLatn: "El progrès mta3 el débutant 7a9i9i" },
        body: {
          en: md(
            "If you've never trained seriously, you'll progress fast. The first months bring quick strength gains (largely your nervous system learning the movements) and visible muscle growth, even while losing fat. Enjoy it: it's some of the best motivation you'll ever get.",
          ),
          fr: md(
            "Si tu n'as jamais fait de musculation sérieusement, tu vas progresser vite. Les premiers mois apportent des gains de force rapides (surtout parce que ton système nerveux apprend les mouvements) et une prise de muscle visible, même en perdant du gras. Profites-en : c'est l'une des meilleures motivations qui soient.",
          ),
          tn: md(
            "كان عمرك ما تمرّنت بالجدّ، باش تتقدّم بالفيسع. الشهور الأولى يجيبو قوّة بالفيسع (أغلبها خاطر الجهاز العصبي متاعك يتعلّم الحركات) وعضلات تكبر وتبان، حتى وانت تنقّص في الشحم. استمتع بيها: هذي من أحسن موتيفاسيون باش تلقاها.",
          ),
          tnLatn: md(
            "Ken 3omrek ma tmarrant bel jedd, bech tet9addem bel fisa3. El chhour el lowlin yjibou 9owwa bel fisa3 (a8lebha 5ater le système nerveux mte3ek yet3allem el 7arakat) w muscles tekber w tbén, 7atta w enti tna99es fel gras. Etmatta3 biha: hedhi men a7sen motivation bech tal9aha.",
          ),
        },
      },
      {
        heading: { en: "How often to train", fr: "À quelle fréquence s'entraîner", tn: "قدّاش من مرّة تتمرّن", tnLatn: "9addech men marra tetmarren" },
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
          tn: md(
            ul(
              "**2–3 حصص فول بادي في الجمعة** هذا المثالي لأغلب المبتدئين، مع نهار راحة على الأقل بيناتهم.",
              "حاول تخدّم كل مجموعة عضلات تقريب **مرّتين في الجمعة**.",
              "حصص متاع 45–75 دقيقة تكفي وتزيد.",
            ),
            "الاستمرارية خير مالبرنامج الكامل: برنامج ساهل تتبّعو عام كامل خير من برنامج كامل تسيّبو بعد شهر.",
          ),
          tnLatn: md(
            ul(
              "**2–3 séances full-body fel jem3a** houwa l'idéal l a8leb les débutants, m3a nhar repos 3al a9al binethom.",
              "7awel t5addem kol groupe musculaire ta9rib **marratin fel jem3a**.",
              "Séances mta3 45–75 minutes yekfiw w yzidou.",
            ),
            "El régularité 5ir mel programme el parfait: programme sehel tetba3ou 3am kemel 5ir men programme parfait tsayybou ba3d chhar.",
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
      tn: [
        "الحديد وانت في ديفيسيت يعاونك باش أغلب الوزن اللي تنقّصو يكون شحم، موش عضلات.",
        "التقدّم يجي مالزيادة التدريجية: شويّة ثقل، مرّات ولا سيريات أكثر مع الوقت.",
        "ابني الحصص متاعك على التمارين المركّبة، والإيزولاسيون كزيادة.",
        "2–3 حصص فول بادي في الجمعة، هذي أحسن بداية.",
      ],
      tnLatn: [
        "El 7did w enti en déficit y3awnek bech a8leb el poids elli tna99sou ykoun gras, mouch muscles.",
        "El progrès yji mel surcharge progressive: chwaya charge, reps walla séries akther m3a el wa9t.",
        "Ebni les séances mte3ek 3al exercices polyarticulaires, w l'isolation zyeda.",
        "2–3 séances full-body fel jem3a, hedhi a7sen bdeya.",
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
      tn: "السيريات، المرّات والمجهود (RIR)",
      tnLatn: "Séries, reps w effort (RIR)",
    },
    summary: {
      en: "The vocabulary of a workout, how hard each set should feel, and a simple system for knowing when to add weight.",
      fr: "Le vocabulaire d'une séance, l'intensité à viser sur chaque série, et une méthode simple pour savoir quand augmenter la charge.",
      tn: "الكلمات متاع الحصّة، قدّاش لازم تكون كل سيري صعيبة، وطريقة ساهلة باش تعرف وقتاش تزيد في الثقل.",
      tnLatn: "El kelmet mta3 el séance, 9addech lazem tkoun kol série s3iba, w tari9a sahla bech ta3ref wa9tech tzid fel charge.",
    },
    sections: [
      {
        heading: { en: "The basic vocabulary", fr: "Le vocabulaire de base", tn: "الكلمات الأساسية", tnLatn: "El kelmet el assesiya" },
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
          tn: md(
            ul(
              "**المرّة** (rep) هي حركة كاملة: تهبّط البار وتطلّعها مرّة وحدة.",
              "**السيري** هي مجموعة مرّات تعملهم بلاش ما توقف، مثلا 10 مرّات.",
              "**الراحة** هي الوقفة بين السيريات.",
            ),
            "يعني “3 × 8–12” معناها 3 سيريات من 8 لـ 12 مرّة.",
          ),
          tnLatn: md(
            ul(
              "**Rep** (répétition) hiya 7araka kemla: thabbet el barre w ttalla3ha marra wa7da.",
              "**Série** hiya majmou3a reps ta3melhom blech ma to9ef, mathalan 10 reps.",
              "**Repos** houwa el wa9fa bin les séries.",
            ),
            "Ya3ni “3 × 8–12” ma3neha 3 séries men 8 l 12 reps.",
          ),
        },
      },
      {
        heading: { en: "How many reps and sets?", fr: "Combien de répétitions et de séries ?", tn: "قدّاش من مرّة وقدّاش من سيري؟", tnLatn: "9addech men rep w 9addech men série?" },
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
          tn: md(
            "العضلات تكبر مع عدد مرّات واسع، تقريب من 5 لـ 30، المهم السيريات تكون صعيبة. في الواقع:",
            ul(
              "**6–10 مرّات** للتمارين المركّبة الكبار (سكوات، ديفلوبي كوشي، روينغ)",
              "**8–15 مرّة** للتمارين الصغار والإيزولاسيون",
            ),
            "على الفوليوم متاع الجمعة، الأبحاث تنصح بتقريب **10–20 سيري صعيبة لكل مجموعة عضلات في الجمعة** باش تكبر. المبتدئين يتقدّمو مليح حتى بالقليل: تقريب 10 سيريات لكل عضلة في الجمعة يكفيو باش تبدا.",
            "**الراحة:** تقريب 2–3 دقايق للتمارين المركّبة الثقال، 1–2 دقايق لتمارين الإيزولاسيون. كي ترتاح بالقدا، تنجّم تعمل مرّات نظاف أكثر.",
          ),
          tnLatn: md(
            "El muscles tekber m3a nombre de reps large, ta9rib men 5 l 30, el mohemm les séries tkoun s3iba. Fel pratique:",
            ul(
              "**6–10 reps** lel exercices polyarticulaires el kbar (squat, développé couché, rowing)",
              "**8–15 reps** lel exercices s8ar w l'isolation",
            ),
            "3al volume mta3 el jem3a, el recherche tansa7 b ta9rib **10–20 séries s3iba l kol groupe musculaire fel jem3a** bech tekber. Les débutants yet9addmou mli7 7atta bel 9lil: ta9rib 10 séries l kol muscle fel jem3a yekfiw bech tebda.",
            "**Repos:** ta9rib 2–3 minutes lel exercices polyarticulaires e t9al, 1–2 minutes lel exercices d'isolation. Ki terta7 bel 9ada, tnajjem ta3mel reps ndhaf akther.",
          ),
        },
      },
      {
        heading: { en: "RIR: reps in reserve", fr: "Le RIR : les répétitions en réserve", tn: "RIR: المرّات اللي باقية فيك", tnLatn: "RIR: les reps elli b9aw fik" },
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
          tn: md(
            "**RIR** معناها “reps in reserve”: قدّاش من مرّة كنت تنجّم تزيد قبل ما تعجز. هكّا تقيس المجهود.",
            ul(
              "**RIR 0:** ما تنجّمش تزيد حتى مرّة (هذا هو العجز).",
              "**RIR 2:** وقفت وعندك تقريب 2 مرّات نظاف باقيين فيك.",
            ),
            "في أغلب السيريات، حاول **توقف وعندك 1–3 مرّات باقيين فيك**. هذا صعيب بالقدا باش تكبر، بلاش التعب الزايد وخطر الضربة اللي يجيو كي توصل للعجز كل مرّة. في تمارين الإيزولاسيون والماكينات، كي تقرّب أكثر للعجز ما فيها حتى مشكل.",
            "تنجّم زادة تلقى **RPE** (قدّاش تحسّ بالمجهود، على 10): RPE 8 ≈ 2 مرّات باقيين، RPE 9 ≈ 1 مرّة باقية، RPE 10 = العجز.",
            "المبتدئين عادة يحسبو اللي باقي فيهم أقلّ مالحقيقة. من وقت لوقت، في تمرين ما فيهوش خطر كيف ماكينة، وصّل سيري وحدة للعجز باش تعرف وين الحدّ الحقيقي متاعك.",
          ),
          tnLatn: md(
            "**RIR** ma3neha “reps in reserve”: 9addech men rep konet tnajjem tzid 9bal ma toussel lel échec. Haka t9is el effort.",
            ul(
              "**RIR 0:** ma tnajjemch tzid 7atta rep (hedha houwa l'échec).",
              "**RIR 2:** wa9eft w 3andek ta9rib 2 reps ndhaf b9aw fik.",
            ),
            "Fi a8leb les séries, 7awel **to9ef w 3andek 1–3 reps b9aw fik**. Hedha s3ib bel 9ada bech tekber, blech el fatigue ezzayda w el risque mta3 el blessure elli yjiw ki toussel lel échec kol marra. Fel exercices d'isolation w les machines, ki t9arreb akther lel échec ma fiha 7atta mochkel.",
            "Tnajjem zeda tal9a **RPE** (9addech t7ess bel effort, 3la 10): RPE 8 ≈ 2 reps b9aw, RPE 9 ≈ 1 rep b9at, RPE 10 = échec.",
            "Les débutants 3ada y7esbou elli b9alhom a9al mel 7a9i9a. Men wa9t l wa9t, f exercice ma fihech 5atar kima machine, wassel série wa7da lel échec bech ta3ref win la limite el 7a9i9iya mte3ek.",
          ),
        },
      },
      {
        heading: { en: "Double progression", fr: "La double progression", tn: "الدوبل بروغريسيون", tnLatn: "La double progression" },
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
          tn: md(
            "طريقة ساهلة باش تعرف وقتاش تزيد في الثقل:",
            ul(
              "اختار عدد مرّات، مثلا 8–12، وثقل تنجّم تهزّو 8 مرّات نظاف.",
              "في كل حصّة، حاول تزيد مرّة ولا زوز.",
              "كي توصل **للفوق متاع العدد (12) في السيريات الكل** بتكنيك نظيف، زيد في الثقل: تقريب 2,5–5 kg لتمارين الجزء اللوطاني، 1–2,5 kg لتمارين الجزء الفوقاني.",
              "المرّات متاعك يرجعو لتقريب 8؛ طلّعهم من جديد.",
            ),
            "مثال، 3 سيريات بـ 40 kg: 9، 8، 8 → الجمعة اللي بعدها 11، 10، 9 → من بعد 12، 12، 12 → طلّع لـ 42,5 kg.",
          ),
          tnLatn: md(
            "Tari9a sahla bech ta3ref wa9tech tzid fel charge:",
            ul(
              "A5tar fourchette mta3 reps, mathalan 8–12, w charge tnajjem thezzha 8 reps ndhaf.",
              "Fi kol séance, 7awel tzid rep walla zouz.",
              "Ki toussel **lel fou9 mta3 el fourchette (12) fel séries lkol** b technique ndhifa, zid fel charge: ta9rib 2,5–5 kg lel exercices mta3 el bas du corps, 1–2,5 kg lel exercices mta3 el haut du corps.",
              "Les reps mte3ek yarj3ou l ta9rib 8; tala3hom men jdid.",
            ),
            "Mathalan, 3 séries b 40 kg: 9, 8, 8 → el jem3a elli ba3dha 11, 10, 9 → mba3d 12, 12, 12 → tala3 l 42,5 kg.",
          ),
        },
      },
      {
        heading: { en: "Track everything", fr: "Note tout", tn: "سجّل كل شي", tnLatn: "Sajjel kol chay" },
        body: {
          en: md(
            "Log the weight, the reps and how hard it felt for every set. Without a log you're guessing; with one, you can see exactly when to push and when you're stuck.",
          ),
          fr: md(
            "Note le poids, les répétitions et la difficulté ressentie pour chaque série. Sans carnet, tu devines ; avec, tu vois exactement quand pousser et quand tu stagnes.",
          ),
          tn: md(
            "سجّل الثقل، المرّات وقدّاش كانت صعيبة في كل سيري. بلاش تسجيل راك تخمّن؛ بيه، تشوف بالضبط وقتاش تدزّ ووقتاش راك واقف في بلاصتك.",
          ),
          tnLatn: md(
            "Sajjel el charge, les reps w 9addech kenet s3iba f kol série. Blech carnet rak t5ammen; bih, tchouf bedhabt wa9tech tdezz w wa9tech rak wa9ef fi blastek.",
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
      tn: [
        "المرّة هي حركة وحدة، السيري مجموعة مرّات، والراحة هي الوقفة بين السيريات.",
        "حاول تعمل تقريب 10–20 سيري صعيبة لكل عضلة في الجمعة؛ المبتدئين ينجّمو يبداو بتقريب 10.",
        "وقّف أغلب السيريات وعندك 1–3 مرّات باقيين فيك (RIR 1–3).",
        "الدوبل بروغريسيون: وصّل للفوق متاع عدد المرّات في السيريات الكل، ومن بعد زيد في الثقل.",
      ],
      tnLatn: [
        "Rep hiya 7araka wa7da, série majmou3a reps, w repos houwa el wa9fa bin les séries.",
        "7awel ta3mel ta9rib 10–20 séries s3iba l kol muscle fel jem3a; les débutants ynajmou yebdew b ta9rib 10.",
        "Wa99ef a8leb les séries w 3andek 1–3 reps b9aw fik (RIR 1–3).",
        "Double progression: oussel lel fou9 mta3 el fourchette mta3 el reps fel séries lkol, mba3d zid fel charge.",
      ],
    },
    related: ['strength-training-basics', 'form-and-safety', 'sleep-recovery'],
  },

];
