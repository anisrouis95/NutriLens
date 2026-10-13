// Lessons, part 4 (lessons 16-18: recomposition, Ramadan, consistency). Assembled in content/lessons.ts.

import type { Lesson } from '../lessons';
import { md, ul } from './md';

export const lessonsPart4: Lesson[] = [
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
      tn: "الريكومبوزيسيون و كيفاش تكبّر العضلات",
      tnLatn: "Recomposition w kifech tkabber el muscles",
    },
    summary: {
      en: "Losing fat and gaining muscle at the same time, how big a surplus to use for building, and realistic rates of muscle gain.",
      fr: "Perdre du gras et prendre du muscle en même temps, quel surplus viser pour construire, et à quel rythme le muscle se gagne vraiment.",
      tn: "كيفاش تنقّص الشحم و تزيد العضلات في نفس الوقت، قدّاش من سيربلي تحطّ باش تبني، و قدّاش تنجّم تزيد عضلات بالحق.",
      tnLatn: "Kifech tna99es el gras w tzid el muscles f nafs el wa9t, 9addech men surplus t7ott bech tebni, w 9addech tnajjem tzid muscles bel 7a9.",
    },
    sections: [
      {
        heading: {
          en: "Body recomposition",
          fr: "La recomposition corporelle",
          tn: "الريكومبوزيسيون",
          tnLatn: "El recomposition",
        },
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
          tn: md(
            "**الريكومبوزيسيون** معناها تنقّص الشحم و تزيد العضلات في نفس الوقت. وزنك ينجّم ما يتحرّكش برشا أما بدنك يتبدّل و يبان: دورة الكرش تنقص، و القوّة و العضلات تزيد.",
            "تخدم خير مع:",
            ul(
              "**المبتدئين** اللي عمرهم ما عملو موسكولاسيون بالجدّ",
              "**اللي راجعين** بعد وقفة (العضلات ترجع أسرع المرّة الثانية)",
              "الناس اللي عندهم **شحم أكثر** باش ينقّصوه",
            ),
            "الوصفة: تمرّن موسكولاسيون بالجدّ 2–4 مرّات في الجمعة و زيد في الثقل شويّة بشويّة، كول بروتين كافي ({{proteinG}} g في النهار)، و كول قريب من المانتونونس ولا بديفيسيت صغير. في الفترة هاذي، تبّع دورة الكرش، التصاور و القوّة متاعك، موش كان الميزان.",
          ),
          tnLatn: md(
            "**Recomposition** ma3neha tna99es el gras w tzid el muscles f nafs el wa9t. Poids mte3ek ynajjem ma yet7arrekch barcha ama badnek yetbaddel w yben: tour de taille yon9os, w el 9owwa w el muscles yzidou.",
            "Ta5dem 5ir m3a:",
            ul(
              "**Les débutants** eli 3omrhom ma 3amlou musculation bel jed",
              "**Eli rej3in** ba3d pause (el muscle yerja3 asra3 el marra ethenya)",
              "Ennes eli 3andhom **gras akther** bech yna99souh",
            ),
            "El recette: a3mel musculation bel jed 2–4 marrat fel jem3a w zid fel charge chwaya b chwaya, kol protéines kifeya ({{proteinG}} g fel nhar), w kol 9rib mel maintenance walla b déficit sghir. Fel phase hedhi, tabba3 tour de taille, les photos w el 9owwa mte3ek, mouch ken el balance.",
          ),
        },
      },
      {
        heading: {
          en: "Lean bulking: a small surplus",
          fr: "La prise de masse sèche : un petit surplus",
          tn: "بريز دو ماس سيش: سيربلي صغير",
          tnLatn: "Prise de masse sèche: surplus sghir",
        },
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
          tn: md(
            "كي يولّي الشحم متاعك معقول و تكون عندك شويّة خبرة في التمرين، تكبير العضلات يولّي أسهل مع **سيربلي صغير**:",
            ul(
              "تقريب **200–300 kcal فوق المانتونونس** (يعني 5–10% فوق TDEE متاعك)",
              "تزيد في الوزن تقريب **1–1,5% من وزنك في الشهر** كان مبتدئ (كان وزنك 70 kg: تقريب 0,7–1 kg في الشهر)، و تقريب النصّ للّي مستواهم متوسّط",
            ),
            "سيربلي أكبر ما يبنيش العضلات أسرع. بدنك ما ينجّمش يبني العضلات كان بسرعة محدودة؛ الزايد يولّي شحم باش يلزمك تنقّصو من بعد.",
          ),
          tnLatn: md(
            "Ki yweli el gras mte3ek ma39oul w ykoun 3andek chwaya expérience fel entraînement, tkabbir el muscles yweli ashel m3a **surplus sghir**:",
            ul(
              "Ta9riban **200–300 kcal fou9 el maintenance** (ya3ni 5–10% fou9 TDEE mte3ek)",
              "Tzid fel poids ta9riban **1–1,5% men poids mte3ek fel chhar** ken débutant (ken poids mte3ek 70 kg: ta9riban 0,7–1 kg fel chhar), w ta9riban ennos lel niveau intermédiaire",
            ),
            "Surplus akbar ma yebnich el muscles asra3. Badnek ma ynajjemch yebni el muscles ken b vitesse m7douda; ezzeyed yweli gras bech yelzmek tna99sou mba3d.",
          ),
        },
      },
      {
        heading: {
          en: "How fast can you build muscle?",
          fr: "À quelle vitesse peut-on prendre du muscle ?",
          tn: "بأما سرعة تنجّم تكبّر العضلات؟",
          tnLatn: "B ama vitesse tnajjem tkabber el muscles?",
        },
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
          tn: md(
            "أرقام تقريبية، في أحسن الحالات، كي يكون التمرين و الماكلة و النوم الكل مريقلين:",
            ul(
              "**العام الأوّل:** تقريب 0,5–1 kg عضلات في الشهر للرجال، و تقريب النصّ للنساء",
              "**العام الثاني:** تقريب نصّ سرعة العام الأوّل",
              "**العام الثالث و بعدو:** يبطى أكثر؛ التقدّم يجي بشويّة بشويّة في العام",
            ),
            "الجينات، العمر، النوم و المداومة الكل يبدّلو الأرقام هاذي. برشا مرّات النتائج الحقيقية تجي تحت أحسن حالة، و هذا نورمال.",
          ),
          tnLatn: md(
            "Ar9am ta9ribiya, f a7sen el 7alat, ki ykoun el entraînement, el makla w el noum kol chay mrigel:",
            ul(
              "**3am lowel:** ta9riban 0,5–1 kg muscle fel chhar lel rjel, w ta9riban ennos lel nsa",
              "**3am etheni:** ta9riban nos el vitesse mte3 3am lowel",
              "**3am etheleth w ba3dou:** yabta akther; el progrès yji b chwaya b chwaya fel 3am",
            ),
            "La génétique, el 3omr, el noum w la régularité kol chay ybadlou el ar9am hedhom. Barcha marrat les résultats el 7a9i9iyin yjiw ta7t a7sen 7ala, w hedha normal.",
          ),
        },
      },
      {
        heading: {
          en: "How your weight will change",
          fr: "Comment ton poids va évoluer",
          tn: "كيفاش باش يتبدّل وزنك",
          tnLatn: "Kifech bech yetbaddel poids mte3ek",
        },
        body: {
          en: md(
            "Building muscle means the scale goes up slowly, and part of that gain is fat and water too. That's expected. If your waist grows much faster than your strength, your surplus is too big: cut it by 100–200 kcal. If the scale hasn't moved in 2–3 weeks, add 100–200 kcal.",
          ),
          fr: md(
            "Prendre du muscle signifie que la balance monte lentement, et une partie de cette hausse est aussi du gras et de l'eau. C'est attendu. Si ton tour de taille augmente beaucoup plus vite que ta force, ton surplus est trop gros : baisse-le de 100 à 200 kcal. Si la balance n'a pas bougé depuis 2 à 3 semaines, ajoute 100 à 200 kcal.",
          ),
          tn: md(
            "كي تكبّر عضلات، الميزان يطلع بشويّة، و جزء من الزيادة هاذي يكون شحم و ماء زادة. هذا عادي. كان دورة الكرش تكبر أسرع برشا من القوّة متاعك، السيربلي متاعك كبير برشا: نقّص منّو 100–200 kcal. كان الميزان ما تحرّكش من 2–3 جمعات، زيد 100–200 kcal.",
          ),
          tnLatn: md(
            "Ki tkabber muscles, el balance tetla3 b chwaya, w chwaya men ezzyeda hedhi tkoun gras w mé zeda. Hedha 3adi. Ken tour de taille yekber asra3 barcha mel 9owwa mte3ek, el surplus mte3ek kbir barcha: na99es menno 100–200 kcal. Ken el balance ma t7arkitch men 2–3 jem3at, zid 100–200 kcal.",
          ),
        },
      },
      {
        heading: {
          en: "Which phase should you choose?",
          fr: "Quelle phase choisir ?",
          tn: "شنوّة المرحلة اللي تختارها؟",
          tnLatn: "Chnowa el phase eli t5tarha?",
        },
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
          tn: md(
            ul(
              "**عندك برشا شحم باش تنقّصو:** ابدا بديفيسيت؛ و إنتي مبتدئ، على الأغلب باش تزيد عضلات في كل حال.",
              "**شحم قليل أما عضلات قليلة زادة (“skinny fat”)، ولا توّا بديت الموسكولاسيون:** الريكومبوزيسيون على المانتونونس بداية ممتازة.",
              "**الشحم متاعك قليل و تحب تكبر أكثر:** بريز دو ماس سيش بسيربلي صغير.",
            ),
            "شنوّة ما اخترت، التمرين و البروتين يقعدو كيف كيف. كان الكالوري اللي تتبدّل.",
          ),
          tnLatn: md(
            ul(
              "**3andek barcha gras bech tna99sou:** ebda b déficit; w enti débutant, 3al a8lab bech tzid muscles f kol 7al.",
              "**Chwaya gras ama chwaya muscles zeda (“skinny fat”), walla taw bdit el musculation:** el recomposition 3al maintenance bidaya momtaza.",
              "**El gras mte3ek 9lil w t7eb tekber akther:** prise de masse sèche b surplus sghir.",
            ),
            "Chnowa ma 5tart, el entraînement w el protéines y9a3dou kif kif. Ken el calories elli yetbadlou.",
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
      tn: [
        "المبتدئين و اللي راجعين للسبور ينجّمو ينقّصو الشحم و يزيدو عضلات في نفس الوقت (ريكومبوزيسيون).",
        "للبريز دو ماس السيش، حطّ سيربلي صغير تقريب 200–300 kcal في النهار.",
        "في أحسن حالة، استنّى تقريب 0,5–1 kg عضلات في الشهر في العام الأوّل (للرجال)، تقريب النصّ للنساء، و من بعد يبطى.",
        "التمرين و البروتين يقعدو كيف كيف في كل مرحلة؛ كان الكالوري اللي تتبدّل.",
      ],
      tnLatn: [
        "Les débutants w eli rej3in lel sport ynajjmou yna99sou el gras w yzidou muscles f nafs el wa9t (recomposition).",
        "Lel prise de masse sèche, 7ott surplus sghir ta9riban 200–300 kcal fel nhar.",
        "F a7sen 7ala, stanna ta9riban 0,5–1 kg muscle fel chhar fel 3am lowel (lel rjel), ta9riban ennos lel nsa, w mba3d yabta.",
        "El entraînement w el protéines y9a3dou kif kif f kol phase; ken el calories elli yetbadlou.",
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
      tn: "رمضان و الصيام: كول و تمرّن كما يلزم",
      tnLatn: "Romdhan w siyem: kol w tmarren kima yelzem",
    },
    summary: {
      en: "Practical ways to hit your protein, stay hydrated and keep training during Ramadan or any fasting schedule.",
      fr: "Des conseils pratiques pour atteindre tes protéines, bien t'hydrater et continuer à t'entraîner pendant le Ramadan ou tout autre jeûne.",
      tn: "نصايح عملية باش توصل للبروتين متاعك، تشرب ماء كافي و تكمّل تتمرّن في رمضان ولا في أي صيام آخر.",
      tnLatn: "Nsaye7 pratiques bech toussel lel protéines mte3ek, tochrob mé kifeya w tkammel tetmarren f Romdhan walla f ay siyem e5er.",
    },
    sections: [
      {
        heading: {
          en: "Your goals still work",
          fr: "Tes objectifs restent valables",
          tn: "الأهداف متاعك مازالت ماشية",
          tnLatn: "Les objectifs mte3ek mazelou mechyin",
        },
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
          tn: md(
            "رمضان شهر مميّز، و التقدّم متاعك موش لازم يوقف. الكالوري و البروتين يتحسبو على النهار الكل، سواء كليت على 16 ساعة ولا كان بين الفطور و السحور. فمّا ناس يلقاو الديفيسيت أسهل في رمضان؛ و فمّا اللي يلقاوه أصعب على خاطر الموايد الكبار متاع الليل. الزوز نورمال.",
            "هدف معقول للشهر: **حافظ على العضلات و القوّة متاعك**، خلّي وزنك ثابت ولا ينقص بشويّة، و كمّل الشهر في صحّة و مليان طاقة.",
            "كان عندك السكّر ولا مرض آخر، ولا تاخو دواء ديما، ولا حامل ولا ترضّع، احكي مع الطبيب متاعك على كيفاش تصوم بلا خطر.",
          ),
          tnLatn: md(
            "Romdhan chhar spécial, w el progrès mte3ek mouch lazem yo9ef. El calories w el protéines yet7asbou 3al nhar el kol, sawa kalit 3la 16 sa3a walla ken bin el ftour w es-s7our. Famma nes yal9aw el déficit ashel f Romdhan; w famma eli yal9awh as3ab 3la 5ater el mweyed el kbar mte3 el lil. Ezzouz normal.",
            "Objectif ma39oul lel chhar: **7afedh 3al muscles w el 9owwa mte3ek**, 5alli poids mte3ek thabet walla yon9os b chwaya, w kammel el chhar f sa77a w 3andek barcha énergie.",
            "Ken 3andek sokkar walla mardh e5er, walla te5ou dwa dima, walla 7amel walla traddha3, a7ki m3a tbib mte3ek 3la kifech tsoum blech 5atar.",
          ),
        },
      },
      {
        heading: {
          en: "Hitting your protein",
          fr: "Atteindre tes protéines",
          tn: "كيفاش توصل للبروتين متاعك",
          tnLatn: "Kifech toussel lel protéines mte3ek",
        },
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
          tn: md(
            "باش تدخّل {{proteinG}} g بروتين في شويّة سوايع، يلزمك تنظيم. قسّمها على ثلاثة أوقات:",
            ul(
              "**الفطور:** شربة باللحم ولا بالدجاج، و من بعد الصحن الرئيسي فيه بروتين باهي (دجاج مشوي، حوت، لحم، عظم في عجّة).",
              "**لمجة الليل (بعد التراويح):** ياورت، ريكوتة، لبن، شيك بروتين، ولا كسكروت بالتن ولا بالعظم.",
              "**السحور:** عظم، فرماج ولا ريكوتة، ياورت، مع نشويات بطيئة كيما الشوفان ولا الخبز الكامل باش تصبر.",
            ),
          ),
          tnLatn: md(
            "Bech tdakhel {{proteinG}} g protéines f chwaya swaye3, yelzmek organisation. 9assamhom 3la thletha aw9at:",
            ul(
              "**Ftour:** chorba bel l7am walla bel djej, w mba3d el plat principal fih protéines behya (djej machwi, 7out, l7am, 3dham f 3ejja).",
              "**Lemja mte3 el lil (ba3d taraweeh):** yaourt, ricotta, lben, shake protéiné, walla kaskrout bel ton walla bel 3dham.",
              "**S7our:** 3dham, fromage walla ricotta, yaourt, m3a glucides lents kima flocons d'avoine walla pain complet bech tosber.",
            ),
          ),
        },
      },
      {
        heading: {
          en: "Hydration",
          fr: "L'hydratation",
          tn: "شرب الماء",
          tnLatn: "Chorb el mé",
        },
        body: {
          en: md(
            "You need your full {{waterL}} L in a short window, so spread it out: 2 glasses at iftar, then roughly a glass every hour until suhoor, and 1–2 glasses at suhoor. Downing 2 liters right before dawn doesn't work well.",
            "Go easy on very salty foods at suhoor (pickles, olives, salty cheese, cured meats), and on coffee and strong tea, which can disturb your sleep. Soups, watermelon, cucumber and yogurt help too.",
          ),
          fr: md(
            "Tu dois boire tes {{waterL}} L sur une courte période, alors étale : 2 verres à l'iftar, puis environ un verre par heure jusqu'au s'hour, et 1 à 2 verres au s'hour. Avaler 2 litres juste avant l'aube ne marche pas bien.",
            "Limite les aliments très salés au s'hour (torchi, olives, fromages salés, charcuterie), ainsi que le café et le thé fort, qui peuvent perturber ton sommeil. Les soupes, la pastèque, le concombre et le yaourt aident aussi.",
          ),
          tn: md(
            "لازمك تشرب {{waterL}} L الكل في وقت قصير، أيّا فرّقهم: 2 كيسان في الفطور، و من بعد تقريب كاس كل ساعة حتّى للسحور، و 1–2 كيسان في السحور. كي تشرب 2 لتر مرّة وحدة قبل الفجر، ما تنفعش برشا.",
            "خفّف من الماكلة المالحة برشا في السحور (الطرشي، الزيتون، الفرماج المالح، الصلامي)، و من القهوة و التاي الثقيل، اللي ينجّمو يخربولك النوم. الشربة، الدلّاع، الفقّوس و الياورت يعاونو زادة.",
          ),
          tnLatn: md(
            "Lazmek tochrob {{waterL}} L el kol f wa9t 9sir, aya farra9hom: 2 kissen fel ftour, w mba3d ta9riban kes kol sa3a 7atta lel s7our, w 1–2 kissen fel s7our. Ki tochrob 2 litres marra wa7da 9bal el fjer, ma tenfa3ch barcha.",
            "5affef mel makla el mel7a barcha fel s7our (torchi, zitoun, fromage mele7, salami), w mel 9ahwa w ettey et9il, eli ynajjmou y5arboulek el noum. Chorba, della3, feggous w yaourt y3aounou zeda.",
          ),
        },
      },
      {
        heading: {
          en: "When to train",
          fr: "Quand s'entraîner",
          tn: "وقتاش تتمرّن",
          tnLatn: "Wa9tech tetmarren",
        },
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
          tn: md(
            "اختار الوقت اللي يمشي مع الطاقة متاعك و مع البرنامج متاعك:",
            ul(
              "**قبل الفطور (30–90 دقيقة قبل):** تنجّم تاكل طول بعد التمرين. خلّي الحصص قصيرة و متوسّطة، خاصّة في السخانة، و فوّت الكارديو القوي.",
              "**بعد الفطور ولا بعد التراويح:** كليت و شربت، يعني عادة تكون في أحسن فورمة. استنّى 1–2 سوايع بعد ماكلة كبيرة.",
            ),
            "خلّي الثقل ثقيل، أما تنجّم تنقّص الفوليوم بـ 20–30% (مثلاً 3 سيريات في بلاصة 4). الهدف إنك تحافظ على القوّة متاعك موش إنك تكسّر ريكورات جديدة. كان تحسّ بدوخة ولا موش لاباس و إنتي صايم، وقّف.",
          ),
          tnLatn: md(
            "A5tar el wa9t eli yemchi m3a l'énergie mte3ek w m3a l'emploi du temps mte3ek:",
            ul(
              "**9bal el ftour (30–90 d9i9a 9bal):** tnajjem takel toul ba3d el entraînement. 5alli les séances 9sar w modérées, 5assatan fel s5ana, w fawwet el cardio el 9wi.",
              "**Ba3d el ftour walla ba3d taraweeh:** klit w chrebt, ya3ni 3adatan tkoun f a7sen forme. Stanna 1–2 swaye3 ba3d makla kbira.",
            ),
            "5alli el charge t9ila, ama tnajjem tna99es el volume b 20–30% (mathalan 3 séries fi blaset 4). L'objectif enek t7afedh 3al 9owwa mte3ek mouch enek tkasser records jdod. Ken t7es b dou5a walla mouch labes w enti sayem, wa99ef.",
          ),
        },
      },
      {
        heading: {
          en: "Go easy at iftar",
          fr: "Doucement à l'iftar",
          tn: "بالشويّة في الفطور",
          tnLatn: "B chwaya fel ftour",
        },
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
          tn: md(
            "بعد نهار صيام طويل، ساهل برشا تاكل الكالوري متاع نهار كامل في 20 دقيقة. طريقة أهدى:",
            ul(
              "افطر بالماء و 1–3 حبّات تمر.",
              "اشرب الشربة، و من بعد اعمل وقفة (مثلاً باش تصلّي المغرب).",
              "و من بعد كول الصحن الرئيسي بالشويّة.",
            ),
            "البريك، المقالي و حلو رمضان كيما الزلابية و المقروض جزء من الشهر. تمتّع بيهم بكمّيات مقرّرها من قبل، و سجّلهم بصراحة؛ المعدّل متاع الجمعة هو اللي يحسب. برّا رمضان، الصيام المتقطّع (كيما 16:8) ينفع بعض الناس كان خاطر يعاونهم ياكلو أقل؛ وحدو ما يحرقش شحم زايد.",
          ),
          tnLatn: md(
            "Ba3d nhar siyem twil, sehel barcha takel el calories mte3 nhar kemel f 20 d9i9a. Tari9a ahda:",
            ul(
              "Efter bel mé w 1–3 7abbat tmar.",
              "Ochrob chorba, w mba3d a3mel pause (mathalan bech tsalli el maghrib).",
              "W mba3d kol el plat principal b chwaya.",
            ),
            "El brik, el ma9ali w 7lou Romdhan kima zlebia w makroudh joz men el chhar. Tmatta3 bihom b quantités m9arrarhom men 9bal, w sajjelhom b sra7a; la moyenne mte3 el jem3a hiya eli t7seb. Barra Romdhan, le jeûne intermittent (kima 16:8) yenfa3 ba3dh ennes ken 5ater y3awenhom yeklou a9al; wa7dou ma ya7ra9ch gras zeyed.",
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
      tn: [
        "الكالوري و البروتين يتحسبو على النهار الكل، حتّى كان وقت الماكلة قصير.",
        "قسّم البروتين متاعك بين الفطور، لمجة في الليل و السحور.",
        "فرّق الماء متاعك من الفطور للسحور في بلاصة ما تشربو الكل مرّة وحدة.",
        "تمرّن قبل الفطور (قصير و متوسّط) ولا بعد الفطور ولا التراويح (أحسن فورمة)، و الهدف إنك تحافظ على القوّة.",
        "افطر بالماء، التمر و الشربة، و من بعد اعمل وقفة قبل الصحن الرئيسي.",
      ],
      tnLatn: [
        "El calories w el protéines yet7asbou 3al nhar el kol, 7atta ken wa9t el makla 9sir.",
        "9assem el protéines mte3ek bin el ftour, lemja fel lil w es-s7our.",
        "Farra9 el mé mte3ek mel ftour lel s7our fi blaset ma tochrbou el kol marra wa7da.",
        "Tmarren 9bal el ftour (9sir w modéré) walla ba3d el ftour walla taraweeh (a7sen forme), w l'objectif enek t7afedh 3al 9owwa.",
        "Efter bel mé, tmar w chorba, w mba3d a3mel pause 9bal el plat principal.",
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
      tn: "المداومة أهمّ من الكمال",
      tnLatn: "La régularité ahamm mel perfection",
    },
    summary: {
      en: "How to keep going when life gets messy: the 80/20 rule, missed days, honest logging and watching trends.",
      fr: "Comment continuer quand la vie devient compliquée : la règle des 80/20, les jours ratés, la saisie honnête et les tendances.",
      tn: "كيفاش تكمّل كي الدنيا تتلخبط: قاعدة 80/20، النهارات اللي تفلتك، تسجّل بصراحة و تشوف الاتّجاه العام.",
      tnLatn: "Kifech tkammel ki eddenya tetlakhbat: la règle 80/20, les jours eli yfaltouk, tsajjel b sra7a w tchouf les tendances.",
    },
    sections: [
      {
        heading: {
          en: "The 80/20 rule",
          fr: "La règle des 80/20",
          tn: "قاعدة 80/20",
          tnLatn: "La règle 80/20",
        },
        body: {
          en: md(
            "You don't need to be perfect. If about **80% of your days** are close to your plan, with mostly filling, nutritious food, the other 20% can be birthdays, weddings, Eid, a dinner out or just a lazy day. Results come from what you do most of the time, not every single day.",
            "The same goes for food choices: build most meals from protein, vegetables, fruit, legumes and whole grains, and leave room for the foods you enjoy.",
          ),
          fr: md(
            "Tu n'as pas besoin de perfection. Si environ **80 % de tes journées** sont proches de ton plan, avec surtout des aliments rassasiants et nutritifs, les 20 % restants peuvent être des anniversaires, des mariages, l'Aïd, un resto ou juste une journée tranquille. Les résultats viennent de ce que tu fais la plupart du temps, pas de chaque journée.",
            "C'est pareil pour les choix alimentaires : construis la plupart de tes repas avec des protéines, des légumes, des fruits, des légumineuses et des céréales complètes, et garde de la place pour ce que tu aimes.",
          ),
          tn: md(
            "موش لازمك تكون بارفي. كان تقريب **80% من نهاراتك** قريبين من البرنامج متاعك، و أغلب ماكلتك تشبّع و فيها فايدة، الـ 20% الباقين ينجّمو يكونو أعياد ميلاد، أعراس، العيد، عشا في ريستو ولا نهار تكسّلت فيه. النتائج تجي من اللي تعملو أغلب الوقت، موش من كل نهار وحدو.",
            "نفس الشي للماكلة: ابني أغلب الماكلات متاعك من البروتين، الخضرة، الغلّة، البقوليات و الحبوب الكاملة، و خلّي بلاصة للماكلة اللي تحبها.",
          ),
          tnLatn: md(
            "Mouch lazmek tkoun parfait. Ken ta9riban **80% men nharatek** 9rab mel programme mte3ek, w a8lab maklatek tchabba3 w fiha fayda, el 20% el b9iya ynajjmou ykounou anniversaires, a3ras, el 3id, 3cha f resto walla nhar tkassalt fih. Les résultats yjiw men eli ta3mlou a8lab el wa9t, mouch men kol nhar wa7dou.",
            "Nafs echi lel makla: ebni a8lab el maklet mte3ek mel protéines, el 5odhra, el 8alla, les légumineuses w les céréales complètes, w 5alli blasa lel makla eli t7ebha.",
          ),
        },
      },
      {
        heading: {
          en: "The all-or-nothing trap",
          fr: "Le piège du tout ou rien",
          tn: "فخّ “يا الكل يا والو”",
          tnLatn: "Le piège mte3 “ya el kol ya walou”",
        },
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
          tn: md(
            "اللي يطيّح أغلب الناس موش ماكلة كبيرة وحدة. هو اللي يجي بعدها: “النهار هذا مشى و خلاص، نرجع نبدا نهار الاثنين.” و الويكاند يولّي جمعة كاملة.",
            "اعمل الحساب. ديفيسيت متاع 500 kcal في النهار يعطيك تقريب 3 500 kcal في الجمعة. نهار واحد تاكل فيه 1 000 kcal زايدة على اللي كنت مخطّطلو مازال يخلّيلك 2 500 kcal ديفيسيت. ماكلة وحدة ما تنجّمش تفسخ خدمة جمعة؛ أما كي تسيّب برشا أيّام، إي تنجّم.",
            "يعني بعد نهار خرجت فيه على البرنامج، ارجع للعادي في الماكلة اللي بعدها و برّا. لا عقاب، لا تفوّت ماكلة، لا ساعة كارديو زايدة.",
          ),
          tnLatn: md(
            "Eli ytayya7 a8lab ennes mouch makla kbira wa7da. Howa eli yji ba3dha: “Ennhar hedha mcha w 5las, nerja3 nebda nhar ethnin.” W el week-end yweli jem3a kemla.",
            "A3mel el 7seb. Déficit mte3 500 kcal fel nhar ya3tik ta9riban 3 500 kcal fel jem3a. Nhar wa7ed takel fih 1 000 kcal zeyda 3la eli kont m5attatlou mazel y5allilek 2 500 kcal déficit. Makla wa7da ma tnajjamch tfasa5 5edmet jem3a; ama ki tsayyeb barcha iyyem, ey tnajjem.",
            "Ya3ni ba3d nhar 5rajt fih 3al programme, erja3 lel normal fel makla eli ba3dha w barra. La 3i9ab, la tfawwet makla, la sa3a cardio zeyda.",
          ),
        },
      },
      {
        heading: {
          en: "Log honestly, not perfectly",
          fr: "Note honnêtement, pas parfaitement",
          tn: "سجّل بصراحة، موش بالكمال",
          tnLatn: "Sajjel b sra7a, mouch b perfection",
        },
        body: {
          en: md(
            "Logging isn't a test you pass or fail. It's data. A rough estimate of a big family meal is far more useful than a blank day. Log the pastry, the extra bread, the sweet tea. Nobody is judging; the numbers just help the app find your real maintenance and help you spot patterns.",
            "If you're unsure about a portion, guess a little high. Most of us underestimate.",
          ),
          fr: md(
            "Noter ce que tu manges n'est pas un examen qu'on réussit ou qu'on rate. Ce sont des données. Une estimation approximative d'un grand repas de famille est bien plus utile qu'une journée vide. Note la pâtisserie, le pain en plus, le thé sucré. Personne ne juge : les chiffres aident juste l'appli à trouver ta vraie maintenance et t'aident à repérer tes habitudes.",
            "Si tu hésites sur une portion, estime un peu large. On a presque tous tendance à sous-estimer.",
          ),
          tn: md(
            "التسجيل موش امتحان تنجح فيه ولا تسقط. هو معلومات و برّا. تقدير تقريبي لماكلة عائلية كبيرة أنفع برشا من نهار فارغ. سجّل الباتيسري، الخبز الزايد، التاي بالسكّر. حتّى حدّ ما يحكم عليك؛ الأرقام تعاون الأبليكاسيون باش تلقى المانتونونس الحقيقية متاعك و تعاونك تلاحظ العادات متاعك.",
            "كان موش متأكّد من كمّية، قدّرها شويّة أكثر. أغلبنا ننقّصو في التقدير.",
          ),
          tnLatn: md(
            "El tasjil mouch examen tenja7 fih walla tes9ot. Howa données w barra. Ta9dir ta9ribi l makla kbira mte3 el 3ayla anfa3 barcha men nhar fera8. Sajjel el pâtisserie, el 5obz ezzeyed, ettey bel sokkar. 7atta 7ad ma y7kom 3lik; el ar9am y3aounou l'application bech tal9a el maintenance el 7a9i9iya mte3ek w y3aounouk tla7edh les habitudes mte3ek.",
            "Ken mouch sûr men portion, 9addarha chwaya akther. A8labna nna99sou fel ta9dir.",
          ),
        },
      },
      {
        heading: {
          en: "Trends, not days",
          fr: "Les tendances, pas les jours",
          tn: "الاتّجاه العام، موش النهارات",
          tnLatn: "Les tendances, mouch el iyyem",
        },
        body: {
          en: md(
            "One day of eating, one weigh-in, one bad workout: none of them matters much on its own. Look at your **weekly averages**: average calories, average weight, total sets. If the week trends in the right direction, you're winning.",
            "With a target of {{targetCalories}} kcal per day, you don't need every day to be exact. A weekly average close to it does the job.",
          ),
          fr: md(
            "Une journée de repas, une pesée, une mauvaise séance : aucune ne compte beaucoup à elle seule. Regarde tes **moyennes hebdomadaires** : calories moyennes, poids moyen, nombre total de séries. Si la semaine va dans la bonne direction, tu gagnes.",
            "Avec un objectif de {{targetCalories}} kcal par jour, pas besoin que chaque journée soit exacte. Une moyenne de la semaine proche de cet objectif fait le travail.",
          ),
          tn: md(
            "نهار ماكلة، وزنة وحدة، حصّة خايبة: حتّى وحدة فيهم ما تهمّ برشا وحدها. شوف **المعدّلات متاع الجمعة**: معدّل الكالوري، معدّل الوزن، عدد السيريات الكل. كان الجمعة ماشية في الاتّجاه الصحيح، راك رابح.",
            "كي يكون الهدف متاعك {{targetCalories}} kcal في النهار، موش لازم كل نهار يكون بالضبط. معدّل جمعة قريب منّو يعمل الخدمة.",
          ),
          tnLatn: md(
            "Nhar makla, pesée wa7da, séance 5ayba: 7atta wa7da fihom ma thém barcha wa7edha. Chouf **les moyennes mte3 el jem3a**: moyenne calories, moyenne poids, total séries. Ken el jem3a mechya fel direction es-s7i7a, rak rabe7.",
            "Ki ykoun l'objectif mte3ek {{targetCalories}} kcal fel nhar, mouch lazem kol nhar ykoun bel dhabt. Moyenne mte3 jem3a 9riba menno ta3mel el 5edma.",
          ),
        },
      },
      {
        heading: {
          en: "Build habits that last",
          fr: "Construis des habitudes qui durent",
          tn: "ابني عادات تدوم",
          tnLatn: "Ebni des habitudes eli ydoumou",
        },
        body: {
          en: md(
            "Start with one or two habits, like hitting your protein and your {{stepsTarget}} steps, before adding more. Habits that feel easy are the ones you keep.",
            "And if food or weight starts to feel stressful or obsessive, it's okay to take a break from tracking and talk to a professional. Your health comes first.",
          ),
          fr: md(
            "Commence par une ou deux habitudes, comme atteindre tes protéines et tes {{stepsTarget}} pas, avant d'en ajouter d'autres. Les habitudes qui paraissent faciles sont celles qu'on garde.",
            "Et si la nourriture ou le poids deviennent une source de stress ou d'obsession, c'est tout à fait acceptable de faire une pause dans le suivi et d'en parler à un professionnel. Ta santé passe avant tout.",
          ),
          tn: md(
            "ابدا بعادة ولا زوز، كيما توصل للبروتين متاعك و للـ {{stepsTarget}} خطوة، قبل ما تزيد. العادات اللي تحسّها ساهلة هوما اللي تحافظ عليهم.",
            "و كان الماكلة ولا الوزن بداو يولّيو ستريس ولا هوس، عادي إنك تاخو راحة من التسجيل و تحكي مع مختص. صحّتك قبل كل شي.",
          ),
          tnLatn: md(
            "Ebda b habitude walla zouz, kima toussel lel protéines mte3ek w lel {{stepsTarget}} pas, 9bal ma tzid. Les habitudes eli t7essha sehla homa eli t7afedh 3lihom.",
            "W ken el makla walla el poids bdew ywalliw stress walla obsession, normal enek te5ou pause mel suivi w ta7ki m3a spécialiste. Sa77tek 9bal kol chay.",
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
      tn: [
        "حاول تكون في البرنامج تقريب 80% من الوقت؛ الباقي هي الحياة.",
        "بعد نهار خرجت فيه على البرنامج، ارجع للعادي في الماكلة اللي بعدها: لا عقاب، لا تعويض.",
        "تسجيل صريح و تقريبي خير من نهارات فارغة ولا تسجيل بارفي ما يدومش.",
        "احكم على التقدّم متاعك بمعدّلات الجمعة، موش نهار بنهار.",
      ],
      tnLatn: [
        "7awel tkoun fel programme ta9riban 80% mel wa9t; el b9iya hiya el 7ayet.",
        "Ba3d nhar 5rajt fih 3al programme, erja3 lel normal fel makla eli ba3dha: la 3i9ab, la compensation.",
        "Tasjil sri7 w ta9ribi 5ir men nharat fer8a walla tasjil parfait ma ydoumch.",
        "A7kom 3al progrès mte3ek b les moyennes mte3 el jem3a, mouch nhar b nhar.",
      ],
    },
    related: ['scale-lies', 'hunger-tips', 'plateaus-adaptation'],
  },
];
