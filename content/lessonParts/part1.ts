// Lessons, part 1 (lessons 1-5: calories, BMR & TDEE, deficit, the scale, protein). Assembled in content/lessons.ts.

import type { Lesson } from '../lessons';
import { md, ul } from './md';

export const lessonsPart1: Lesson[] = [
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
      tn: "الكالوري: القاعدة الأساسية",
      tnLatn: "Les calories: el 9a3da el asesiya",
    },
    summary: {
      en: 'What a calorie actually is, and why energy in versus energy out decides whether your weight goes up or down.',
      fr: "Ce qu'est vraiment une calorie, et pourquoi l'équilibre entre ce que tu manges et ce que tu dépenses décide de l'évolution de ton poids.",
      tn: "شنوّة الكالوري بالحقّ، وعلاش اللي تاكلو مقابل اللي تحرقو هو اللي يقرّر وزنك يطلع ولّا يهبط.",
      tnLatn: "Chnowa el calorie bel 7a9, w 3lech elli takelou m9abel elli ta7r9ou howa elli y9arrer poids mte3ek yatla3 walla yahbet.",
    },
    sections: [
      {
        heading: { en: 'What is a calorie?', fr: "C'est quoi, une calorie ?", tn: "شنوّة الكالوري؟", tnLatn: "Chnowa el calorie?" },
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
          tn: md(
            "الكالوري ماهي كان وحدة طاقة، كيف ما الكيلومتر وحدة مسافة. “الكالوري” اللي تلقاها مكتوبة على الإتيكات متاع الماكلة هي في الحقيقة كيلوكالوري (kcal): الطاقة اللي يلزمها باش تسخّن 1 لتر ماء بـ 1 °C.",
            "كل ماكرو فيه كمّية طاقة ثابتة في كل غرام:",
            ul(
              "**البروتين:** 4 kcal في الغرام",
              "**النشويات:** 4 kcal في الغرام",
              "**الدهون:** 9 kcal في الغرام",
              "**الكحول:** 7 kcal في الغرام",
            ),
            "هاذاكا علاش معلقة كبيرة زيت زيتون (تقريبا كلها دهون، في حدود 120 kcal) فيها قدّ الطاقة اللي في زوز حبّات بردقان.",
          ),
          tnLatn: md(
            "El calorie ma hiya ken unité mta3 énergie, kif ma el kilomètre unité mta3 distance. El “calories” elli tal9ahom maktouba 3al étiquettes mta3 el makla homa fel 7a9i9a kilocalories (kcal): el énergie elli yelzemha bech tsa55en 1 litre mé b 1 °C.",
            "Kol macronutriment fih 9adr fixe mta3 énergie f kol gramme:",
            ul(
              "**Protéines:** 4 kcal fel gramme",
              "**Glucides:** 4 kcal fel gramme",
              "**Lipides (gras):** 9 kcal fel gramme",
              "**Alcool:** 7 kcal fel gramme",
            ),
            "Hedheka 3lech m3al9a kbira zit zitoun (ta9riban kolha gras, fi 7doud 120 kcal) fiha 9ad el énergie elli fi zouz 7abbet bordgen.",
          ),
        },
      },
      {
        heading: { en: 'Energy in vs energy out', fr: 'Énergie qui entre, énergie qui sort', tn: "الطاقة اللي تدخل والطاقة اللي تخرج", tnLatn: "El énergie elli tod5ol w el énergie elli to5rej" },
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
          tn: md(
            "بدنك يصرف في الطاقة النهار الكل: باش قلبك يقعد يدقّ، باش تتنفّس، تمشي، تتمرّن، وحتى باش تهضم. وعلى مدّة جمعات، وحدة من ثلاثة حاجات تصير:",
            ul(
              "**تاكل أكثر من اللي تحرق:** الزايد يتخزّن، أغلبو شحم، ووزنك يطلع.",
              "**تاكل أقلّ من اللي تحرق:** بدنك يكمّل النقص من المخزون متاعو، ووزنك يهبط.",
              "**تاكل تقريبا قدّ ما تحرق:** وزنك يقعد ثابت تقريبا. هاذا يسمّيوه **التوازن**.",
            ),
            "هاذي هي القاعدة الأساسية متاع الوزن. حتى ماكلة، حتى وقت ماكلة، حتى مكمّل غذائي ما يهرب منها. كي الريجيم قليل النشويات، ولّا الصيام المتقطّع، ولّا “الماكلة النظيفة” ينقّصوك في الوزن، راهو خاطرهم يعاونوك تاكل أقلّ في المجموع.",
          ),
          tnLatn: md(
            "Bdanek yesrof fel énergie ennhar el kol: bech 9albek yo93ed yed9, bech tetnaffes, temchi, tetmarren, w 7atta bech tahdhom. W 3la moddet jem3at, wa7da men thletha 7ajet tsir:",
            ul(
              "**Takel akther men elli ta7re9:** ezzayed yet5azzen, a8lbou gras, w poids mte3ek yatla3.",
              "**Takel a9al men elli ta7re9:** bdanek ykammel enna9s mel réserves mte3ou, w poids mte3ek yahbet.",
              "**Takel ta9riban 9ad ma ta7re9:** poids mte3ek yo93ed stable ta9riban. Hedha ysammiwh **maintenance**.",
            ),
            "Hedhi hiya el 9a3da el asesiya mta3 el poids. 7atta makla, 7atta wa9t makla, 7atta complément ma yahreb menha. Ki el régime low-carb, walla el jeûne intermittent, walla el “manger propre” yna99souk fel poids, rahou 5aterhom y3awnouk takel a9al fel majmou3.",
          ),
        },
      },
      {
        heading: { en: "Why it doesn't feel that simple", fr: 'Pourquoi ça paraît plus compliqué', tn: "علاش تحسّها موش ساهلة هكّاكة", tnLatn: "3lech t7essha moch sehla hakka" },
        body: {
          en: md(
            "The rule is simple; living it is harder. Hunger, sleep, stress and how much you move all push on both sides of the balance. And from one day to the next, the scale mixes fat with water and food still in your gut (see “Why the scale lies”). That's why the rule shows up over weeks, not over a single day.",
          ),
          fr: md(
            "La règle est simple, l'appliquer l'est moins. La faim, le sommeil, le stress et ton niveau d'activité jouent des deux côtés de la balance. Et d'un jour à l'autre, la balance mélange le gras avec l'eau et les aliments encore dans ton ventre (voir la leçon « Pourquoi la balance ment »). C'est pour ça que la règle se vérifie sur des semaines, pas sur une seule journée.",
          ),
          tn: md(
            "القاعدة ساهلة؛ أما تطبيقها أصعب. الجوع، النوم، الستراس وقدّاش تتحرّك، الكل يأثّرو على الزوز جيهات متاع المعادلة. ومن نهار لنهار، الميزان يخلط الشحم مع الماء والماكلة اللي مازالت في كرشك (شوف “علاش الميزان يكذب”). هاذاكا علاش القاعدة تبان على جمعات، موش في نهار واحد.",
          ),
          tnLatn: md(
            "El 9a3da sehla; ama tatbi9ha as3ab. El jou3, ennoum, el stress w 9addech tet7arrek, kolhom ya3mlou effet 3al zouz jihet mta3 el mo3adla. W men nhar l nhar, el mizen yo5lot el gras m3a el mé w el makla elli mazelet f kerchek (chouf “3lech el mizen yekdheb”). Hedheka 3lech el 9a3da tban 3la jem3at, moch f nhar wa7ed.",
          ),
        },
      },
      {
        heading: { en: 'Food quality still matters', fr: 'La qualité des aliments compte quand même', tn: "نوعية الماكلة مهمّة زادة", tnLatn: "Naw3iyet el makla mohemma zeda" },
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
          tn: md(
            "الكالوري هي اللي تقرّر وزنك. أما نوع الماكلة اللي تاكلها هو اللي يقرّر قدّاش ساهل عليك تقعد في الهدف متاعك، وقدّاش تحسّ روحك لاباس وفيك الطاقة في الثنية.",
            "مثلا، 500 kcal دجاج مشوي، روز وسلاطة يشبّعوك سوايع. 500 kcal حلويات تكمّلهم في خمس دقايق، وترجع تجوع بعد شويّة. نفس الطاقة، أما تجربة مختلفة برشا.",
            "ابني أغلب ماكلتك على البروتين، الخضرة، الغلّة، القطانية والحبوب الكاملة، وخلّي بلاصة للماكلة اللي تحبّها. حتى ماكلة موش ممنوعة؛ كل وحدة عندها كان “سومها” بالكالوري.",
          ),
          tnLatn: md(
            "El calories homa elli y9arrrou poids mte3ek. Ama naw3 el makla elli takelha howa elli y9arrer 9addech sehel 3lik to93ed fel objectif mte3ek, w 9addech t7ess rou7ek labes w fik el énergie fel thnaya.",
            "Mathalan, 500 kcal djej machwi, rouz w slata ychab3ouk sway3. 500 kcal 7elwiyet tkammelhom f 5ams d9aye9, w traja3 tjou3 ba3d chwaya. Nafs el énergie, ama expérience mo5talfa barcha.",
            "Ebni a8leb mekeltek 3al protéines, el 5odhra, el 8alla, el 9tania w el céréales complètes, w 5alli blasa lel makla elli t7ebbha. 7atta makla moch mamnou3a; kol wa7da 3andha ken “soumha” bel calories.",
          ),
        },
      },
      {
        heading: { en: 'How Tounsi Fit uses this', fr: 'Ce que fait Tounsi Fit avec ça', tn: "كيفاش Tounsi Fit تستعمل هاذا", tnLatn: "Kifech Tounsi Fit testa3mel hedha" },
        body: {
          en: md(
            'The app estimates that your body burns about **{{tdee}} kcal per day**, and sets your daily target at **{{targetCalories}} kcal**. Log what you eat, weigh yourself regularly, and the app will refine these numbers from your real data over time.',
          ),
          fr: md(
            "L'appli estime que ton corps dépense environ **{{tdee}} kcal par jour** et fixe ton objectif quotidien à **{{targetCalories}} kcal**. Note ce que tu manges, pèse-toi régulièrement, et l'appli affinera ces chiffres avec tes vraies données au fil du temps.",
          ),
          tn: md(
            "الأبليكاسيون تحسب اللي بدنك يحرق في حدود **{{tdee}} kcal في النهار**، وتحطّلك هدف يومي متاع **{{targetCalories}} kcal**. سجّل اللي تاكلو، اوزن روحك بانتظام، والأبليكاسيون باش تدقّق الأرقام هاذي بالمعطيات الحقيقية متاعك مع الوقت.",
          ),
          tnLatn: md(
            "L'appli t9ayyem elli bdanek ya7re9 fi 7doud **{{tdee}} kcal fel nhar**, w t7otlek objectif yawmi mta3 **{{targetCalories}} kcal**. Sajjel elli takelou, ouzen rou7ek b intidham, w l'appli bech td9a99a9 el ar9am hedhom b les données el 7a9i9iya mte3ek m3a el wa9t.",
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
      tn: [
        "الكالوري وحدة طاقة؛ الإتيكات متاع الماكلة يكتبو الكيلوكالوري (kcal).",
        "البروتين والنشويات فيهم 4 kcal/g، الدهون 9 kcal/g، الكحول 7 kcal/g.",
        "كي تاكل أقلّ من اللي تحرق، على مدّة جمعات، هاذاكا اللي ينقّصك في الوزن. حتى ريجيم ما يهرب من هاذي.",
        "نوعية الماكلة هي اللي تقرّر قدّاش تشبع، قدّاش فيك طاقة وقدّاش صحّتك لاباس في الثنية.",
      ],
      tnLatn: [
        "El calorie unité mta3 énergie; el étiquettes mta3 el makla yektbou kilocalories (kcal).",
        "Protéines w glucides fihom 4 kcal/g, lipides 9 kcal/g, alcool 7 kcal/g.",
        "Ki takel a9al men elli ta7re9, 3la moddet jem3at, hedheka elli yna99sek fel poids. 7atta régime ma yahreb men hedhi.",
        "Naw3iyet el makla hiya elli t9arrer 9addech tochba3, 9addech fik énergie w 9addech sa77tek labes fel thnaya.",
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
      tn: "BMR و TDEE: قدّاش تحرق بالحقّ",
      tnLatn: "BMR w TDEE: 9addech ta7re9 bel 7a9",
    },
    summary: {
      en: 'The four parts of your daily energy use, how the app estimated yours, and how it gets more accurate over time.',
      fr: "Les quatre composantes de ta dépense quotidienne, comment l'appli a estimé la tienne, et comment elle devient plus précise avec le temps.",
      tn: "الأربعة أجزاء متاع الطاقة اللي تصرفها كل نهار، كيفاش الأبليكاسيون حسبت متاعك، وكيفاش الحساب يولّي أدقّ مع الوقت.",
      tnLatn: "El arb3a ajza mta3 el énergie elli tesrefha kol nhar, kifech l'appli 7asbet mte3ek, w kifech el 7seb ywalli ad9a9 m3a el wa9t.",
    },
    sections: [
      {
        heading: { en: 'Your engine at rest: BMR', fr: 'Le moteur au repos : le BMR', tn: "الموتور متاعك وهو مرتاح: BMR", tnLatn: "El moteur mte3ek w howa merte7: BMR" },
        body: {
          en: md(
            "Your **BMR** (basal metabolic rate) is the energy your body uses just to stay alive at complete rest: heart, lungs, brain, kidneys, keeping you warm. Even if you stayed in bed all day, you'd burn it.",
            'For most people, BMR is the biggest part of the day: around 60–70% of everything you burn. Yours is estimated at about **{{bmr}} kcal per day**.',
          ),
          fr: md(
            "Ton **BMR** (métabolisme de base) est l'énergie que ton corps utilise juste pour rester en vie, au repos complet : cœur, poumons, cerveau, reins, maintien de la température. Même si tu restais au lit toute la journée, tu la dépenserais.",
            "Pour la plupart des gens, c'est la plus grosse part de la journée : environ 60 à 70 % de tout ce que tu brûles. Le tien est estimé à environ **{{bmr}} kcal par jour**.",
          ),
          tn: md(
            "الـ **BMR** متاعك (الميتابوليزم الأساسي) هو الطاقة اللي يستعملها بدنك كان باش يقعد حيّ وهو مرتاح تماما: القلب، الريّة، المخ، الكلاوي، وباش يخلّيك سخون. حتى كان تقعد راقد في الفراش النهار الكل، تحرقها.",
            "عند أغلب الناس، الـ BMR هو أكبر جزء في النهار: في حدود 60–70% من كل شي تحرقو. متاعك محسوب في حدود **{{bmr}} kcal في النهار**.",
          ),
          tnLatn: md(
            "El **BMR** mte3ek (métabolisme de base) howa el énergie elli yesta3melha bdanek ken bech yo93ed 7ay w howa merte7 tamamen: el 9alb, erriya, el mo5, el kléwi, w bech y5allik s5oun. 7atta ken to93ed ra9ed fel frach ennhar el kol, ta7r9ha.",
            "3and a8leb ennes, el BMR howa akbar jouz fel nhar: fi 7doud 60–70% men kol chay ta7r9ou. Mte3ek m7soub fi 7doud **{{bmr}} kcal fel nhar**.",
          ),
        },
      },
      {
        heading: { en: 'The other three pieces', fr: 'Les trois autres pièces', tn: "الثلاثة أجزاء الأخرين", tnLatn: "El thletha ajza lo5rin" },
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
          tn: md(
            "فوق الـ BMR، فمّا ثلاثة حاجات يتزادو عليه باش يعملو الـ **TDEE** متاعك (الطاقة الكل اللي تصرفها في النهار):",
            ul(
              "**NEAT** (الحركة اللي موش سبور): المشي، الوقفة، تنظيف الدار، تتحرّك وانت قاعد، طلوع الدروج. تتبدّل برشا من عبد لعبد، بالساهل من 200 لأكثر من 800 kcal في النهار، وهي الجزء اللي تنجّم تزيد فيه بالساهل.",
              "**TEF** (الأثر الحراري متاع الماكلة): الطاقة اللي تمشي في الهضم، في حدود 10% من اللي تاكلو. البروتين هو اللي يستحقّ أكثر طاقة باش يتهضم.",
              "**السبور:** الحصص متاعك في السالة، الجري، الكورة. برشا مرّات أقلّ ممّا يتصوّرو الناس: ساعة كاملة متاع موسكولاسيون تحرق تقريبا 200–400 kcal.",
            ),
            "كي تجمع الكل، الـ TDEE متاعك محسوب في حدود **{{tdee}} kcal في النهار**. هاذا مستوى التوازن متاعك: كان تاكل قدّو في المعدّل، وزنك المفروض يقعد ثابت تقريبا.",
          ),
          tnLatn: md(
            "Fou9 el BMR, famma thletha 7ajet yetzedou 3lih bech ya3mlou el **TDEE** mte3ek (dépense énergétique totale fel nhar):",
            ul(
              "**NEAT** (el 7arka elli moch sport): el mechi, el wa9fa, el ménage, tet7arrek w enti 9a3ed, tal3an edrouj. Tetbaddel barcha men 3abd l 3abd, bessehel men 200 l akther men 800 kcal fel nhar, w hiya el jouz elli tnajjem tzid fih bessehel.",
              "**TEF** (effet thermique mta3 el makla): el énergie elli temchi fel hadhm, fi 7doud 10% men elli takelou. El protéines homa elli yest7a99ou akther énergie bech yet'hadhmou.",
              "**Sport:** les séances mte3ek fel salle, el jri, el koura. Barcha marrat a9al men ma yetsawrou ennes: se3a kemla mta3 musculation ta7re9 ta9riban 200–400 kcal.",
            ),
            "Ki tejma3 el kol, el TDEE mte3ek m7soub fi 7doud **{{tdee}} kcal fel nhar**. Hedha niveau el maintenance mte3ek: ken takel 9addou en moyenne, poids mte3ek normalement yo93ed stable ta9riban.",
          ),
        },
      },
      {
        heading: { en: 'How the app estimated your numbers', fr: "Comment l'appli a calculé tes chiffres", tn: "كيفاش الأبليكاسيون حسبت الأرقام متاعك", tnLatn: "Kifech l'appli 7asbet el ar9am mte3ek" },
        body: {
          en: md(
            'Tounsi Fit uses the **Mifflin-St Jeor equation**, one of the most reliable formulas available. It uses your weight ({{weightKg}} kg), height, age and sex to estimate your BMR, then multiplies it by an activity factor (from about 1.2 for a desk job with little movement to about 1.9 for physical work plus hard training) to get your TDEE.',
            "It's a good starting point, but it's still an estimate. Two people with the same stats can differ by 10% or more, that's 200–300 kcal per day, because of muscle mass, genetics and how much they move without noticing.",
          ),
          fr: md(
            "Tounsi Fit utilise l'**équation de Mifflin-St Jeor**, l'une des formules les plus fiables. Elle part de ton poids ({{weightKg}} kg), ta taille, ton âge et ton sexe pour estimer ton BMR, puis le multiplie par un facteur d'activité (d'environ 1,2 pour un travail de bureau avec peu de mouvement à environ 1,9 pour un métier physique plus un entraînement intense) pour obtenir ta TDEE.",
            "C'est un bon point de départ, mais ça reste une estimation. Deux personnes avec les mêmes mensurations peuvent différer de 10 % ou plus, soit 200 à 300 kcal par jour, à cause de leur masse musculaire, de leur génétique et de tout ce qu'elles bougent sans s'en rendre compte.",
          ),
          tn: md(
            "Tounsi Fit تستعمل **معادلة Mifflin-St Jeor**، وحدة من أحسن المعادلات اللي موجودة. تاخو وزنك ({{weightKg}} kg)، طولك، عمرك وجنسك باش تحسب الـ BMR متاعك، من بعد تضربو في معامل نشاط (من حوالي 1,2 لخدمة بيرو فيها حركة قليلة، لحوالي 1,9 لخدمة بدنية زايد تمرين قوي) باش تطلّع الـ TDEE متاعك.",
            "هي نقطة بداية باهية، أما تبقى تقدير. زوز عباد عندهم نفس الأرقام ينجّمو يختلفو بـ 10% ولّا أكثر، يعني 200–300 kcal في النهار، خاطر الكتلة العضلية، الجينات، وقدّاش يتحرّكو بلاش ما يحسّو.",
          ),
          tnLatn: md(
            "Tounsi Fit testa3mel **l'équation Mifflin-St Jeor**, wa7da men a7sen el formules elli mawjouda. Te5ou poids mte3ek ({{weightKg}} kg), toulek, 3omrek w jensek bech t7seb el BMR mte3ek, men ba3d todhorbou f facteur d'activité (men ta9riban 1,2 l 5edmet bureau fiha 7arka 9lila, l ta9riban 1,9 l 5edma physique w zid 3liha entraînement 9wi) bech ttalla3 el TDEE mte3ek.",
            "Hiya point de départ behi, ama tab9a estimation. Zouz 3bed 3andhom nafs el ar9am ynajjmou yo5tilfou b 10% walla akther, ya3ni 200–300 kcal fel nhar, 5ater el masse musculaire, el génétique, w 9addech yet7arkou blech ma y7essou.",
          ),
        },
      },
      {
        heading: { en: 'How it gets more accurate', fr: 'Comment ça devient plus précis', tn: "كيفاش الحساب يولّي أدقّ", tnLatn: "Kifech el 7seb ywalli ad9a9" },
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
          tn: md(
            "المعطيات الحقيقية متاعك تغلب أي معادلة. بعد 2–3 جمعات وانت تسجّل بانتظام وتوزن روحك ديما، الأبليكاسيون تقارن اللي كليتو بالحقّ مع كيفاش تبدّل وزنك بالحقّ في المعدّل.",
            "مثال: كان كليت في المعدّل 2 000 kcal في النهار ووزنك قعد كيف ما هو، التوازن الحقيقي متاعك في حدود 2 000 kcal، مهما قالت المعادلة. وكان نقصت 0,5 kg في الجمعة بهاكا الماكلة، معناها راك تحرق تقريبا 550 kcal أكثر من اللي تاكلو (0,5 × 7 700 ÷ 7).",
            "قدّ ما تسجّل بصراحة وبانتظام، قدّ ما التعديل هاذا يخدم خير. تسجيل تقريبي في أغلب النهارات خير من تسجيل كامل في شويّة نهارات.",
          ),
          tnLatn: md(
            "Les données el 7a9i9iya mte3ek ya8lbou ay formule. Ba3d 2–3 jem3at w enti tsajjel b intidham w touzen rou7ek dima, l'appli t9aren elli klitou bel 7a9 m3a kifech mchet la tendance mta3 poids mte3ek bel 7a9.",
            "Mithel: ken klit en moyenne 2 000 kcal fel nhar w la tendance 9a3det kif ma hiya, el maintenance el 7a9i9iya mte3ek fi 7doud 2 000 kcal, mahma 9alet el formule. W ken na99ast 0,5 kg fel jem3a b hakka el makla, ma3neha rak ta7re9 ta9riban 550 kcal akther men elli takelou (0,5 × 7 700 ÷ 7).",
            "9ad ma tsajjel b sra7a w b intidham, 9ad ma el ajustement hedha ye5dem 5ir. Tsajjil ta9ribi f a8leb ennharat 5ir men tsajjil parfait f chwaya nharat.",
          ),
        },
      },
      {
        heading: { en: 'Your TDEE moves', fr: 'Ta TDEE bouge', tn: "الـ TDEE متاعك يتبدّل", tnLatn: "El TDEE mte3ek yetbaddel" },
        body: {
          en: md(
            "Your TDEE isn't fixed. It drops a little as you lose weight (a lighter body costs less to run), and it rises with more steps or more muscle. That's why the app recalculates as you go.",
          ),
          fr: md(
            "Ta TDEE n'est pas figée. Elle baisse un peu quand tu perds du poids (un corps plus léger coûte moins cher à faire fonctionner) et elle augmente si tu marches plus ou si tu prends du muscle. C'est pour ça que l'appli recalcule au fur et à mesure.",
          ),
          tn: md(
            "الـ TDEE متاعك موش ثابت. ينقص شويّة كي تنقص في الوزن (بدن أخفّ يستحقّ طاقة أقلّ باش يخدم)، ويطلع كي تزيد خطوات ولّا عضلات. هاذاكا علاش الأبليكاسيون تعاود تحسب مع الوقت.",
          ),
          tnLatn: md(
            "El TDEE mte3ek moch fixe. Yon9os chwaya ki tna99es fel poids (bden a5af yest7a99 énergie a9al bech ye5dem), w yatla3 ki tzid pas walla muscles. Hedheka 3lech l'appli t3awed t7seb m3a el wa9t.",
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
      tn: [
        "الـ BMR ({{bmr}} kcal) هو اللي تحرقو وانت مرتاح؛ الـ TDEE ({{tdee}} kcal) يزيد عليه الحركة اليومية، الهضم والسبور.",
        "الـ NEAT، الحركة متاعك كل نهار كيف المشي، هي الجزء اللي يتبدّل أكثر والأسهل باش تزيد فيه.",
        "المعادلات تنجّم تغلط بـ 10% ولّا أكثر: اعتبر الأرقام الأولى نقطة بداية.",
        "بعد 2–3 جمعات تسجيل، كيفاش يتبدّل وزنك بالحقّ يقول للأبليكاسيون التوازن الحقيقي متاعك.",
      ],
      tnLatn: [
        "El BMR ({{bmr}} kcal) howa elli ta7r9ou w enti merte7; el TDEE ({{tdee}} kcal) yzid 3lih el 7arka el yawmiya, el hadhm w el sport.",
        "El NEAT, el 7arka mte3ek kol nhar kif el mechi, hiya el jouz elli yetbaddel akther w el as'hel bech tzid fih.",
        "El formules tnajjem ta8let b 10% walla akther: e3tabar el ar9am el loulin point de départ.",
        "Ba3d 2–3 jem3at tsajjil, la tendance el 7a9i9iya mta3 poids mte3ek t9oul l l'appli el maintenance el 7a9i9iya mte3ek.",
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
      tn: "الديفيسيت في الكالوري: نفسّرهولك",
      tnLatn: "Le déficit calorique: nfasserhoulek",
    },
    summary: {
      en: 'How eating a bit less than you burn turns into fat loss, how fast is sensible, and why slower usually wins.',
      fr: 'Comment manger un peu moins que ce que tu dépenses fait fondre le gras, à quel rythme avancer, et pourquoi plus lent est souvent plus efficace.',
      tn: "كيفاش كي تاكل شويّة أقلّ من اللي تحرق يولّي نقص في الشحم، قدّاش السرعة المعقولة، وعلاش بالشويّة عادة هو اللي يربح.",
      tnLatn: "Kifech ki takel chwaya a9al men elli ta7re9 ywalli na9s fel gras, 9addech el vitesse el ma39oula, w 3lech bechwaya 3adatan howa elli yorbo7.",
    },
    sections: [
      {
        heading: { en: 'What a deficit is', fr: "C'est quoi, un déficit ?", tn: "شنوّة الديفيسيت", tnLatn: "Chnowa el déficit" },
        body: {
          en: md(
            'A **calorie deficit** means eating less energy than your body burns. To cover the missing energy, your body uses its reserves, mainly stored fat.',
            'Your plan: your body burns about {{tdee}} kcal per day and your target is {{targetCalories}} kcal. That leaves a daily gap of about **{{deficit}} kcal**.',
          ),
          fr: md(
            "Être en **déficit calorique**, c'est manger moins d'énergie que ce que ton corps dépense. Pour combler le manque, il puise dans ses réserves, principalement la graisse stockée.",
            "Ton plan : ton corps dépense environ {{tdee}} kcal par jour et ton objectif est de {{targetCalories}} kcal. Ça laisse un écart quotidien d'environ **{{deficit}} kcal**.",
          ),
          tn: md(
            "**الديفيسيت في الكالوري** معناه تاكل طاقة أقلّ من اللي يحرقها بدنك. باش يكمّل الطاقة اللي ناقصة، بدنك يستعمل المخزون متاعو، أساسا الشحم المخزّن.",
            "البرنامج متاعك: بدنك يحرق في حدود {{tdee}} kcal في النهار والهدف متاعك {{targetCalories}} kcal. يعني فرق يومي في حدود **{{deficit}} kcal**.",
          ),
          tnLatn: md(
            "**Le déficit calorique** ma3neh takel énergie a9al men elli ya7r9ha bdanek. Bech ykammel el énergie elli na9sa, bdanek yesta3mel el réserves mte3ou, sourtout el gras el m5azzen.",
            "El programme mte3ek: bdanek ya7re9 fi 7doud {{tdee}} kcal fel nhar w l'objectif mte3ek {{targetCalories}} kcal. Ya3ni far9 yawmi fi 7doud **{{deficit}} kcal**.",
          ),
        },
      },
      {
        heading: { en: 'From calories to kilograms', fr: 'Des calories aux kilos', tn: "من الكالوري للكيلوات", tnLatn: "Mel calories lel kilos" },
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
          tn: md(
            "قاعدة ساهلة: **تقريبا 7 700 kcal ≈ 1 kg شحم**. يعني ديفيسيت متاع 500 kcal في النهار يولّي 3 500 kcal في الجمعة، يعني تقريبا 0,45 kg شحم.",
            "بالفرق متاعك {{deficit}} kcal في النهار، الأبليكاسيون تتوقّع تبديل في حدود **{{weeklyChangeKg}} kg في الجمعة**، يعني الهدف متاعك تقريبا بعد **{{weeksToGoal}} جمعة**.",
            "اعتبر هاذا توقّع تقريبي، موش وعد:",
            ul(
              "أوّل 1–2 جمعات برشا مرّات الوزن يهبط أسرع، خاطر تنقص زادة شويّة ماء ونشويات مخزّنة، موش كان شحم.",
              "كل ما تخفّ، تحرق شويّة أقلّ، هاذاكا علاش التقدّم يبطى بطبيعتو.",
              "تبدّلات الماء من نهار لنهار تنجّم تخبّي نقص الشحم جمعة ولّا زوز.",
            ),
          ),
          tnLatn: md(
            "9a3da sehla: **ta9riban 7 700 kcal ≈ 1 kg gras**. Ya3ni déficit mta3 500 kcal fel nhar ywalli 3 500 kcal fel jem3a, ya3ni ta9riban 0,45 kg gras.",
            "B el far9 mte3ek {{deficit}} kcal fel nhar, l'appli tetwa99a3 tabdil fi 7doud **{{weeklyChangeKg}} kg fel jem3a**, ya3ni l'objectif mte3ek ta9riban ba3d **{{weeksToGoal}} jem3a**.",
            "E3tabar hedha tawa99o3 ta9ribi, moch wa3d:",
            ul(
              "Awwel 1–2 jem3at barcha marrat el poids yahbet asra3, 5ater tna99es zeda chwaya mé w glucides m5azna, moch ken gras.",
              "Kol ma te5ef, ta7re9 chwaya a9al, hedheka 3lech el progrès yabta b tabi3tou.",
              "Tbaddilet el mé men nhar l nhar tnajjem t5abbi na9s el gras jem3a walla zouz.",
            ),
          ),
        },
      },
      {
        heading: { en: "Why faster isn't better", fr: "Pourquoi plus vite n'est pas mieux", tn: "علاش الأسرع موش الأحسن", tnLatn: "3lech el asra3 moch el a7sen" },
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
          tn: md(
            "يغرّي باش تقصّ الكالوري برشا وتوفى منها. أما الديفيسيت الكبير برشا عادة يرجعلك بالعكس:",
            ul(
              "**تخسر عضلات أكثر**، خاصّة كان البروتين قليل وما تعملش موسكولاسيون.",
              "**جوع وشهوة أقوى**، وهاذا يخلّيك أقرب باش تكراكي ولّا تبطّل.",
              "**طاقة ناقصة:** حصص أخيب، مورال أخيب، نوم أخيب.",
              "**حركتك اليومية تنقص أكثر**، وانت حتى ما تردّش بالك.",
            ),
            "أحسن ديفيسيت هو اللي تنجّم تقعد عليه شهور.",
          ),
          tnLatn: md(
            "Y8arri bech t9oss el calories barcha w toufa menha. Ama el déficit el kbir barcha 3adatan yerja3lek bel 3aks:",
            ul(
              "**Te5ser muscles akther**, 5assatan ken el protéines 9lil w ma ta3melch musculation.",
              "**Jou3 w chahwa a9wa**, w hedha y5allik a9reb bech tcraki walla tbattel.",
              "**Énergie na9sa:** séances a5yeb, moral a5yeb, noum a5yeb.",
              "**El 7arka el yawmiya mte3ek ton9os akther**, w enti 7atta ma traddech belek.",
            ),
            "A7sen déficit howa elli tnajjem to93ed 3lih chhour.",
          ),
        },
      },
      {
        heading: { en: 'A sensible speed', fr: 'Un rythme raisonnable', tn: "سرعة معقولة", tnLatn: "Vitesse ma39oula" },
        body: {
          en: md(
            "Mainstream guidance is to lose about **0.5–1% of your bodyweight per week**. For example, at 80 kg that's 0.4–0.8 kg per week. If you have a lot to lose, the upper end is fine; as you get leaner, aim closer to 0.5%.",
            'Safety floor: don\'t go below about **1,200 kcal per day for women or 1,500 kcal per day for men** without medical supervision. If you are pregnant or breastfeeding, have a medical condition, or have a history of disordered eating, talk to a doctor before dieting.',
          ),
          fr: md(
            "La recommandation courante est de perdre environ **0,5 à 1 % de ton poids par semaine**. Par exemple, à 80 kg, ça fait 0,4 à 0,8 kg par semaine. Si tu as beaucoup à perdre, le haut de la fourchette convient ; plus ton taux de gras baisse, plus il vaut mieux viser 0,5 %.",
            "Limite de sécurité : ne descends pas sous environ **1 200 kcal par jour pour une femme ou 1 500 kcal par jour pour un homme** sans suivi médical. Si tu es enceinte ou allaites, si tu as un problème de santé ou des antécédents de troubles alimentaires, parles-en à un médecin avant de commencer un régime.",
          ),
          tn: md(
            "النصيحة المعروفة هي تنقص في حدود **0,5–1% من وزنك في الجمعة**. مثلا، كان وزنك 80 kg يعني 0,4–0,8 kg في الجمعة. كان عندك برشا باش تنقص، الحدّ الفوقاني ما فيه باس؛ وكل ما يقلّ الشحم متاعك، قرّب أكثر لـ 0,5%.",
            "حدّ الأمان: ما تهبطش تحت حوالي **1 200 kcal في النهار للمرا ولّا 1 500 kcal في النهار للراجل** من غير متابعة طبّية. كان انت حامل ولّا ترضّع، عندك مشكلة صحّية، ولّا عدّيت قبل بمشاكل مع الماكلة، احكي مع طبيب قبل ما تبدا ريجيم.",
          ),
          tnLatn: md(
            "Ennasi7a el ma3roufa hiya tna99es fi 7doud **0,5–1% men poids mte3ek fel jem3a**. Mathalan, ken poids mte3ek 80 kg ya3ni 0,4–0,8 kg fel jem3a. Ken 3andek barcha bech tna99es, el 7add el fou9ani ma fih bes; w kol ma y9el el gras mte3ek, 9arreb akther l 0,5%.",
            "7add el amen: ma tahbetch ta7t ta9riban **1 200 kcal fel nhar lel mra walla 1 500 kcal fel nhar lel rajel** blech suivi médical. Ken enti 7amel walla trodha3, 3andek mochkla sa77iya, walla 3addit 9bal b machekel m3a el makla, a7ki m3a tbib 9bal ma tebda régime.",
          ),
        },
      },
      {
        heading: { en: 'Gaining instead? Flip it', fr: 'Tu veux prendre du poids ? On inverse', tn: "تحبّ تزيد في الوزن؟ اقلبها", tnLatn: "T7eb tzid fel poids? A9lebha" },
        body: {
          en: md(
            'To build muscle, you do the opposite: eat a small **surplus**, about 200–300 kcal above maintenance, while training hard. A bigger surplus mostly adds fat, not extra muscle. See the lesson on recomposition and gaining.',
          ),
          fr: md(
            "Pour construire du muscle, on fait l'inverse : un petit **surplus**, environ 200 à 300 kcal au-dessus de la maintenance, avec un entraînement sérieux. Un surplus plus gros ajoute surtout du gras, pas plus de muscle. Voir la leçon sur la recomposition et la prise de muscle.",
          ),
          tn: md(
            "باش تبني العضلات، تعمل العكس: تاكل **زيادة صغيرة في الكالوري**، في حدود 200–300 kcal فوق التوازن، وانت تتمرّن بالجدّ. زيادة أكبر تزيد أغلبها شحم، موش عضلات زايدة. شوف الدرس على الريكومبوزيسيون والزيادة في العضلات.",
          ),
          tnLatn: md(
            "Bech tebni muscles, ta3mel el 3aks: takel **surplus** s8ir, fi 7doud 200–300 kcal fou9 el maintenance, w enti tetmarren bel jed. Surplus akbar yzid a8lbou gras, moch muscles zeyda. Chouf el dars 3al recomposition w el prise de muscle.",
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
      tn: [
        "الديفيسيت معناه تاكل أقلّ من اللي تحرق؛ بدنك يكمّل الفرق بالشحم المخزّن.",
        "“7 700 kcal ≈ 1 kg شحم” قاعدة تقريبية تنفع، موش قانون دقيق.",
        "حاول تنقص 0,5–1% من وزنك في الجمعة؛ بالشويّة عادة معناها تحافظ على عضلات أكثر وتجوع أقلّ.",
        "ما تهبطش تحت ~1 200 kcal (النساء) ولّا ~1 500 kcal (الرجال) من غير متابعة طبّية.",
      ],
      tnLatn: [
        "El déficit ma3neh takel a9al men elli ta7re9; bdanek ykammel el far9 bel gras el m5azzen.",
        "“7 700 kcal ≈ 1 kg gras” 9a3da ta9ribiya tenfa3, moch 9anoun da9i9.",
        "7awel tna99es 0,5–1% men poids mte3ek fel jem3a; bechwaya 3adatan ma3neha t7afedh 3la muscles akther w tjou3 a9al.",
        "Ma tahbetch ta7t ~1 200 kcal (nsa) walla ~1 500 kcal (rjel) blech suivi médical.",
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
      tn: "علاش الميزان يكذب (وكيفاش تقراه)",
      tnLatn: "3lech el mizen yekdheb (w kifech te9rah)",
    },
    summary: {
      en: "Your weight can swing 1–2 kg from one day to the next without any change in fat. Here's why, and how to see the real trend.",
      fr: "Ton poids peut varier de 1 à 2 kg d'un jour à l'autre sans que ton gras change. Voici pourquoi, et comment voir la vraie tendance.",
      tn: "وزنك ينجّم يطلع ويهبط 1–2 kg من نهار لنهار من غير ما يتبدّل الشحم. هاو علاش، وكيفاش تشوف الاتجاه الحقيقي.",
      tnLatn: "Poids mte3ek ynajjem yatla3 w yahbet 1–2 kg men nhar l nhar blech ma yetbaddel el gras. Haw 3lech, w kifech tchouf la tendance el 7a9i9iya.",
    },
    sections: [
      {
        heading: { en: 'Daily swings are normal', fr: 'Les variations quotidiennes sont normales', tn: "التبدّلات اليومية عادية", tnLatn: "Ettbaddilet el yawmiya 3adiya" },
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
          tn: md(
            "وزنك موش كان شحم وعضلات. فيه زادة ماء، ماكلة قاعدة تتهضم ونشويات مخزّنة، وهاذوما يتبدّلو كل نهار. تبدّلات متاع **0,5–2 kg من صباح لصباح** عادية برشا، حتى كي الشحم متاعك ما تبدّل حتى شي.",
            "الأسباب الكبار:",
            ul(
              "**الملح:** ماكلة مالحة (ماكلة ريستورون، صلصات، شاركوتري) تنجّم تخلّيك تشدّ ماء زايد نهار ولّا زوز.",
              "**النشويات:** كل غرام نشويات مخزّن (الغليكوجين) يتخزّن معاه حوالي 3 g ماء. نهار فيه برشا نشويات ينجّم يزيد 1 kg ولّا أكثر على الميزان.",
              "**الهضم:** اللي مازال في كرشك عندو وزن، برشا مرّات 0,5–1 kg.",
              "**الهرمونات:** برشا نساء يشدّو 1–2 kg ماء زايد في النهارات اللي قبل العادة الشهرية.",
              "**التمرين:** حصّة صعيبة ولّا جديدة تخلّي البدن يشدّ الماء لمدّة قصيرة وقت اللي العضلات تتصلّح.",
              "**الكرياتين:** كان تبدا تاخو منو، استنّى +0,5–1,5 kg ماء في العضلات متاعك في الجمعات الأولى. هاذا موش شحم.",
            ),
          ),
          tnLatn: md(
            "Poids mte3ek moch ken gras w muscles. Fih zeda mé, makla 9a3da tet'hadhem w glucides m5azna, w hedhouma yetbaddlou kol nhar. Tbaddilet mta3 **0,5–2 kg men sbe7 l sbe7** 3adiya barcha, 7atta ki el gras mte3ek ma tbaddel 7atta chay.",
            "El asbab el kbar:",
            ul(
              "**El mel7:** makla mel7a (makla mta3 restaurant, sauces, charcuterie) tnajjem t5allik tchedd mé zayed nhar walla zouz.",
              "**Les glucides:** kol gramme glucides m5azzen (glycogène) yet5azzen m3ah ta9riban 3 g mé. Nhar fih barcha glucides ynajjem yzid 1 kg walla akther 3al mizen.",
              "**El hadhm:** elli mazel f kerchek 3andou poids, barcha marrat 0,5–1 kg.",
              "**Les hormones:** barcha nsa ychaddou 1–2 kg mé zayed fel nharat elli 9bal les règles.",
              "**L'entraînement:** séance s3iba walla jdida t5alli bdanek ychedd el mé l moddet 9sira, w el muscles 9a3din yetsall7ou.",
              "**La créatine:** ken tebda te5ou menha, estanna +0,5–1,5 kg mé fel muscles mte3ek fel jem3at el loulin. Hedha moch gras.",
            ),
          ),
        },
      },
      {
        heading: { en: 'How to weigh yourself', fr: 'Comment te peser', tn: "كيفاش توزن روحك", tnLatn: "Kifech touzen rou7ek" },
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
          tn: md(
            "باش تنقّص التشويش، خلّي الظروف ديما كيف كيف:",
            ul(
              "في **الصباح**، بعد ما تمشي للتواليت، قبل ما تاكل ولّا تشرب.",
              "نفس الميزان، على قاعة صحيحة ومستوية، بنفس الحوايج (خفاف).",
              "الأحسن **كل نهار ولّا تقريبا كل نهار**. كل ما يكثرو القياسات، المعدّل يولّي أصحّ، وكل رقم وحدو يهمّ أقلّ.",
            ),
          ),
          tnLatn: md(
            "Bech tna99es ettachwich, 5alli les conditions dima kif kif:",
            ul(
              "Fel **sbe7**, ba3d ma temchi lel toilette, 9bal ma takel walla tochrob.",
              "Nafs el mizen, 3la 9a3a s7i7a w mestwiya, b nafs el 7wayej (5fef).",
              "El a7sen **kol nhar walla ta9riban kol nhar**. Kol ma yekthrou les mesures, el moyenne twalli as7a7, w kol ra9m wa7dou yhem a9al.",
            ),
          ),
        },
      },
      {
        heading: { en: 'Trust the trend, not the day', fr: 'Fais confiance à la tendance, pas au jour', tn: "ثيق في الاتجاه، موش في النهار", tnLatn: "Thi9 fel tendance, moch fel nhar" },
        body: {
          en: md(
            "A single weigh-in is noisy. What matters is the **weekly average** or the trend line the app draws. Compare this week's average with last week's, not Tuesday with Wednesday.",
            "If your target is about {{weeklyChangeKg}} kg per week, you won't see that every day. You'll see ups and downs, with an average that slowly moves in the right direction.",
          ),
          fr: md(
            "Une pesée seule est bruitée. Ce qui compte, c'est la **moyenne de la semaine** ou la courbe de tendance tracée par l'appli. Compare la moyenne de cette semaine à celle de la semaine dernière, pas mardi à mercredi.",
            "Si ton objectif est d'environ {{weeklyChangeKg}} kg par semaine, tu ne le verras pas chaque jour. Tu verras des hauts et des bas, avec une moyenne qui avance doucement dans la bonne direction.",
          ),
          tn: md(
            "وزنة وحدة فيها برشا تشويش. اللي يهمّ هو **المعدّل متاع الجمعة** ولّا خطّ الاتجاه اللي ترسمو الأبليكاسيون. قارن معدّل الجمعة هاذي مع اللي فاتت، موش الثلاثاء مع الإربعاء.",
            "كان الهدف متاعك في حدود {{weeklyChangeKg}} kg في الجمعة، ما تشوفهاش كل نهار. باش تشوف طلوع وهبوط، ومعدّل يمشي بالشويّة في الاتجاه الصحيح.",
          ),
          tnLatn: md(
            "Wazna wa7da fiha barcha tachwich. Elli yhem howa **el moyenne mta3 el jem3a** walla la courbe elli tersemha l'appli. 9aren el moyenne mta3 el jem3a hedhi m3a elli fetet, moch ethleth m3a lerb3a.",
            "Ken l'objectif mte3ek fi 7doud {{weeklyChangeKg}} kg fel jem3a, ma tchoufhech kol nhar. Bech tchouf tal3a w habta, w moyenne temchi bechwaya fel ittijeh essa7i7.",
          ),
        },
      },
      {
        heading: { en: 'The fake plateau', fr: 'Le faux plateau', tn: "البلاتو الكذّاب", tnLatn: "El faux plateau" },
        body: {
          en: md(
            "Sometimes the scale stays stuck for 1–2 weeks even though you're in a deficit. Often fat loss is happening, but water retention is masking it (stress, poor sleep, a new training block, the menstrual cycle). Then one day it drops suddenly.",
            'A real plateau is a flat trend for **3–4 weeks** with consistent logging. Before that, keep going. The lesson on plateaus explains what to do next.',
          ),
          fr: md(
            "Parfois, la balance reste bloquée 1 à 2 semaines alors que tu es bien en déficit. Souvent, la perte de gras a bien lieu, mais une rétention d'eau la masque (stress, mauvais sommeil, nouveau programme, cycle menstruel). Puis un jour, ça descend d'un coup.",
            "Un vrai plateau, c'est une tendance plate pendant **3 à 4 semaines** avec une saisie régulière. Avant ça, continue. La leçon sur les plateaux explique quoi faire ensuite.",
          ),
          tn: md(
            "ساعات الميزان يقعد واقف 1–2 جمعات حتى وانت في ديفيسيت. برشا مرّات الشحم قاعد ينقص، أما الماء اللي يشدّو البدن يخبّيه (ستراس، نوم خايب، برنامج تمرين جديد، الدورة الشهرية). ومن بعد نهار، يهبط مرّة وحدة.",
            "البلاتو الحقيقي هو كي الوزن يقعد واقف **3–4 جمعات** وانت تسجّل بانتظام. قبل هاكا، كمّل. الدرس على البلاتو يفسّرلك شنوّة تعمل من بعد.",
          ),
          tnLatn: md(
            "Sa3at el mizen yo93ed wa9ef 1–2 jem3at 7atta w enti f déficit. Barcha marrat el gras 9a3ed yon9os, ama el mé elli ychedou el bden y5abbih (stress, noum 5ayeb, programme jdid, el cycle). W men ba3d nhar, yahbet marra wa7da.",
            "El vrai plateau howa ki la tendance to93ed wa9fa **3–4 jem3at** w enti tsajjel b intidham. 9bal hakka, kammel. El dars 3al plateaux yfasserlek chnowa ta3mel men ba3d.",
          ),
        },
      },
      {
        heading: { en: 'Other ways to measure', fr: "D'autres façons de mesurer", tn: "طرق أخرى باش تقيس", tnLatn: "Torro9 o5rin bech t9is" },
        body: {
          en: md(
            'The scale is just one tool. A waist measurement once a week (at the navel, belly relaxed), progress photos in the same light every 2–4 weeks, how your clothes fit and how your lifts progress tell you a lot too.',
          ),
          fr: md(
            "La balance n'est qu'un outil. Ton tour de taille une fois par semaine (au niveau du nombril, ventre relâché), des photos dans la même lumière toutes les 2 à 4 semaines, tes vêtements et la progression de tes charges en disent beaucoup aussi.",
          ),
          tn: md(
            "الميزان ماهو كان أداة وحدة. قيس دورة كرشك مرّة في الجمعة (على مستوى الصرّة، والكرش مرخية)، تصاور في نفس الضو كل 2–4 جمعات، كيفاش حوايجك جايين عليك وكيفاش الثقل متاعك يتقدّم، الكل يقولّك برشا زادة.",
          ),
          tnLatn: md(
            "El mizen ma howa ken outil wa7ed. Tour de taille marra fel jem3a (3la mosta el sorra, w el kerch merta7a), tsawer f nafs edhaw kol 2–4 jem3at, kifech 7wayjek jeyin 3lik w kifech les charges mte3ek tet9addem, el kol y9oullek barcha zeda.",
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
      tn: [
        "التبدّلات اليومية متاع 0,5–2 kg أغلبها ماء، ماكلة ونشويات مخزّنة، موش شحم.",
        "اوزن روحك الصباح بعد التواليت، قبل ما تاكل، في نفس الظروف.",
        "احكم على تقدّمك بالمعدّل متاع الجمعة ولّا خطّ الاتجاه، عمرك ما تحكم بوزنة وحدة.",
        "كي الوزن يقعد واقف 1–2 جمعات برشا مرّات يكون ماء مخبّي؛ البلاتو الحقيقي يدوم 3–4 جمعات.",
      ],
      tnLatn: [
        "Ettbaddilet el yawmiya mta3 0,5–2 kg a8labha mé, makla w glucides m5azna, moch gras.",
        "Ouzen rou7ek sbe7 ba3d el toilette, 9bal ma takel, f nafs les conditions.",
        "A7kem 3al progrès mte3ek bel moyenne mta3 el jem3a walla la courbe, 3omrek ma t7kem b wazna wa7da.",
        "Ki la tendance to93ed wa9fa 1–2 jem3at barcha marrat ykoun mé m5abbi; el vrai plateau ydoum 3–4 jem3at.",
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
      tn: "البروتين: أهمّ ماكرو عندك",
      tnLatn: "Les protéines: a7amm macro 3andek",
    },
    summary: {
      en: "Why your target is {{proteinG}} g per day, what protein does for your muscles and hunger, and easy ways to reach it.",
      fr: "Pourquoi ton objectif est de {{proteinG}} g par jour, ce que les protéines font pour tes muscles et ta faim, et comment l'atteindre facilement.",
      tn: "علاش الهدف متاعك {{proteinG}} g في النهار، شنوّة يعمل البروتين لعضلاتك وللجوع، وطرق ساهلة باش توصلّو.",
      tnLatn: "3lech l'objectif mte3ek {{proteinG}} g fel nhar, chnowa ta3mel el protéines lel muscles mte3ek w lel jou3, w torro9 sehla bech tousellou.",
    },
    sections: [
      {
        heading: { en: "Why protein matters so much", fr: "Pourquoi les protéines comptent autant", tn: "علاش البروتين مهمّ برشا", tnLatn: "3lech el protéines mohemmin barcha" },
        body: {
          en: md(
            "Protein is the building material for muscle, and in a deficit it's your best insurance. When you eat less than you burn, your body can break down muscle as well as fat. Enough protein, combined with strength training, tells your body to keep the muscle and burn fat instead.",
            "It also helps with hunger: protein is the most filling macronutrient, and your body uses about 20–30% of its calories just to digest it.",
          ),
          fr: md(
            "Les protéines sont les matériaux de construction du muscle, et en déficit, c'est ta meilleure assurance. Quand tu manges moins que ce que tu dépenses, ton corps peut puiser dans le muscle autant que dans le gras. Assez de protéines, avec de la musculation, l'incite à garder le muscle et à brûler plutôt le gras.",
            "Elles aident aussi contre la faim : c'est le macronutriment le plus rassasiant, et ton corps utilise environ 20 à 30 % de leurs calories rien que pour les digérer.",
          ),
          tn: md(
            "البروتين هو مواد البني متاع العضلة، وفي الديفيسيت هو أحسن ضمان عندك. كي تاكل أقلّ من اللي تحرق، بدنك ينجّم ياكل من العضلات كيف ما ياكل من الشحم. بروتين كافي، مع تمارين القوّة، يقول لبدنك خلّي العضلات واحرق الشحم في بلاصتها.",
            "ويعاون زادة على الجوع: البروتين هو الماكرو اللي يشبّع أكثر، وبدنك يستعمل في حدود 20–30% من الكالوري متاعو كان باش يهضمو.",
          ),
          tnLatn: md(
            "El protéines homa matériaux el bni mta3 el muscle, w fel déficit homa a7sen assurance 3andek. Ki takel a9al men elli ta7re9, bdanek ynajjem yekel mel muscles kif ma yekel mel gras. Protéines kafya, m3a musculation, t9oul l bdanek 5alli el muscles w a7re9 el gras f blasthom.",
            "W y3awnou zeda 3al jou3: el protéines homa el macro elli ychabba3 akther, w bdanek yesta3mel fi 7doud 20–30% men les calories mte3hom ken bech yahdhomhom.",
          ),
        },
      },
      {
        heading: { en: "Your target: {{proteinG}} g per day", fr: "Ton objectif : {{proteinG}} g par jour", tn: "الهدف متاعك: {{proteinG}} g في النهار", tnLatn: "L'objectif mte3ek: {{proteinG}} g fel nhar" },
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
          tn: md(
            "الدراسات على الناس اللي يتمرّنو تنصح بـ **1,6–2,2 g بروتين لكل kg من وزنك في النهار**، والجزء الفوقاني هو اللي ينفع أكثر وقت الديفيسيت. الهدف متاعك **{{proteinG}} g في النهار**.",
            "ما تجريش وراه بالغرام: كي توصل قريب منو بـ 10–20 g أغلب النهارات راهو باهي برشا. كان عندك برشا شحم باش تنقصو، كي تحسب البروتين على الوزن اللي تحبّ توصلّو، هاذا تعديل معروف ومعقول.",
            "للناس اللي في صحّتهم، الكمّيات هاذي ما فيهاش خطر. كان عندك مرض في الكلاوي، احكي مع طبيبك باش يقولّك قدّاش يلزمك.",
          ),
          tnLatn: md(
            "Les études 3al ness elli yetmarnou tansa7 b **1,6–2,2 g protéines l kol kg men poids mte3ek fel nhar**, w el jouz el fou9ani howa elli yenfa3 akther wa9t el déficit. L'objectif mte3ek **{{proteinG}} g fel nhar**.",
            "Ma tejrich warah bel gramme: ki tousel 9rib menou b 10–20 g a8leb ennharat rahou behi barcha. Ken 3andek barcha gras bech tna99sou, ki t7seb el protéines 3al poids elli t7eb tousellou, hedha ajustement ma3rouf w ma39oul.",
            "Lel ness elli fi sa77thom, el kammiyet hedhi ma fihech 5tar. Ken 3andek mardh fel kléwi, a7ki m3a tbibek bech y9oullek 9addech yelzmek.",
          ),
        },
      },
      {
        heading: { en: "Spread it over the day", fr: "Répartis-les sur la journée", tn: "قسّمو على النهار", tnLatn: "9assmou 3al nhar" },
        body: {
          en: md(
            "Your body uses protein best when it's spread over 3–5 meals, with roughly **25–40 g per meal**. Splitting {{proteinG}} g over four meals means about a quarter of it at each one.",
            "Tip: start each meal with your protein, so you don't fill up on everything else first.",
          ),
          fr: md(
            "Ton corps utilise mieux les protéines quand elles sont réparties sur 3 à 5 repas, avec environ **25 à 40 g par repas**. Répartir {{proteinG}} g sur quatre repas, c'est environ un quart à chaque repas.",
            "Astuce : commence chaque repas par ta portion de protéines, pour ne pas remplir ton estomac avec le reste avant d'y arriver.",
          ),
          tn: md(
            "بدنك يستعمل البروتين خير كي يكون مقسوم على 3–5 ماكلات، تقريبا **25–40 g في الماكلة**. كي تقسم {{proteinG}} g على أربعة ماكلات، يعني تقريبا الربع في كل وحدة.",
            "نصيحة: ابدا كل ماكلة بالبروتين متاعك، باش ما تشبعش بالباقي قبل.",
          ),
          tnLatn: md(
            "Bdanek yesta3mel el protéines 5ir ki ykounou m9assmin 3la 3–5 meklet, ta9riban **25–40 g fel makla**. Ki t9assem {{proteinG}} g 3la arba3 meklet, ya3ni ta9riban erroba3 f kol wa7da.",
            "Nasi7a: ebda kol makla bel protéines mte3ek, bech ma tochba3ch bel be9i 9bal.",
          ),
        },
      },
      {
        heading: { en: "Easy protein sources", fr: "Des sources faciles", tn: "مصادر بروتين ساهلة", tnLatn: "Masader protéines sehla" },
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
          tn: md(
            "قدّاش فيها بروتين تقريبا (طايبة ولّا حاضرة للماكلة):",
            ul(
              "**العظم:** تقريبا 6 g في العظمة",
              "**صدر دجاج ولّا دندون:** تقريبا 30 g في 100 g",
              "**تن في الحكّة:** تقريبا 25 g في 100 g مصفّي (كان في الزيت، صفّيه مليح باش توفّر كالوري)",
              "**السردينة:** تقريبا 20–25 g في 100 g، وزيد دهون باهية أوميغا-3",
              "**لحم بلاش شحم ولّا حوت (وراطة، قاروص):** تقريبا 20–25 g في 100 g",
              "**الريكوطة:** تقريبا 10–12 g في 100 g",
              "**ياوورت ناتور:** تقريبا 4–5 g في الكاس؛ ياوورت غريك ولّا skyr: تقريبا 8–10 g في 100 g",
              "**اللبن ولّا الحليب:** تقريبا 3 g في 100 ml، يعني كاس متاع 25 cl يعطيك تقريبا 8 g",
              "**الحمّص، العدس، اللوبيا (طايبين):** تقريبا 8–9 g في 100 g، مع برشا ألياف",
            ),
            "مغرفة **واي بروتين** تعطيك تقريبا 20–25 g. موش لازمة، مدروسة مليح وما فيهاش خطر للناس اللي في صحّتهم: كان طريقة ساهلة باش تكمّل النقص، موش واجب.",
          ),
          tnLatn: md(
            "9addech fiha protéines ta9riban (tayba walla 7adhra lel makla):",
            ul(
              "**3dham:** ta9riban 6 g fel 3dhma",
              "**Sder djej walla dindon:** ta9riban 30 g f 100 g",
              "**Ton fel 7okka:** ta9riban 25 g f 100 g msaffi (ken fel zit, saffih mli7 bech twaffer calories)",
              "**Sardine:** ta9riban 20–25 g f 100 g, w zid gras behi oméga-3",
              "**La7am maigre walla 7out (warata, 9arous):** ta9riban 20–25 g f 100 g",
              "**Ricotta:** ta9riban 10–12 g f 100 g",
              "**Yaourt nature:** ta9riban 4–5 g fel pot; yaourt grec walla skyr: ta9riban 8–10 g f 100 g",
              "**Lben walla 7lib:** ta9riban 3 g f 100 ml, ya3ni kes mta3 25 cl ya3tik ta9riban 8 g",
              "**7ommos, 3des, loubya (taybin):** ta9riban 8–9 g f 100 g, m3a barcha fibres",
            ),
            "Dose mta3 **whey protéine** ta3tik ta9riban 20–25 g. Moch lezma, madrousa mli7 w ma fihech 5tar lel ness elli fi sa77thom: ken tari9a sehla bech tkammel enna9s, moch obligation.",
          ),
        },
      },
      {
        heading: { en: "Simple swaps", fr: "Petites astuces", tn: "تبديلات ساهلة", tnLatn: "Tabdilet sehla" },
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
          tn: md(
            ul(
              "زيد 2–3 عظمات ولّا حكّة تن لسلاطة ولّا سندويتش.",
              "اختار ريكوطة ولّا ياوورت في اللمجة عوض البسكوي.",
              "زيد حمّص ولّا عدس للشربات (شربة، لبلابي) والمرقات.",
              "خلّي عظم مسلوق في الفريجيدار وقت اللي يجيك الجوع.",
            ),
          ),
          tnLatn: md(
            ul(
              "Zid 2–3 3dhmet walla 7okkat ton l slata walla sandwich.",
              "E5tar ricotta walla yaourt fel lemja 3oudh el biscuit.",
              "Zid 7ommos walla 3des lel chorbet (chorba, lablebi) w el mra9.",
              "5alli 3dham maslou9 fel frigidaire wa9t elli yjik el jou3.",
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
      tn: [
        "البروتين مع تمارين القوّة يعاونوك تحافظ على العضلات وانت تنقص في الشحم.",
        "الهدف متاعك {{proteinG}} g في النهار؛ كي تكون قريب منو بـ 10–20 g يكفي.",
        "قسّمو على 3–5 ماكلات، تقريبا 25–40 g في كل وحدة.",
        "العظم، الدجاج، التن، السردينة، الياوورت، الريكوطة والقطانية يوصلوك؛ الواي موش لازم.",
      ],
      tnLatn: [
        "El protéines m3a musculation y3awnouk t7afedh 3al muscles w enti tna99es fel gras.",
        "L'objectif mte3ek {{proteinG}} g fel nhar; ki tkoun 9rib menou b 10–20 g yekfi.",
        "9assmou 3la 3–5 meklet, ta9riban 25–40 g f kol wa7da.",
        "3dham, djej, ton, sardine, yaourt, ricotta w 9tania ywasslouk; el whey moch lazem.",
      ],
    },
    related: ['macros-carbs-fats', 'strength-training-basics', 'hunger-tips', 'ramadan-fasting'],
  },

];
