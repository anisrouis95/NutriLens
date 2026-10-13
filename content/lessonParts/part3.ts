// Lessons, part 3 (lessons 11-15: form, steps & cardio, sleep, water, plateaus). Assembled in content/lessons.ts.

import type { Lesson } from '../lessons';
import { md, ul } from './md';

export const lessonsPart3: Lesson[] = [
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
      tn: "تكنيك صحيح وتمرين بلا خطر",
      tnLatn: "Technique s7i7a w entraînement blech 5atar",
    },
    summary: {
      en: "How to warm up, learn technique, tell good effort from bad pain, and adapt exercises around sensitive joints.",
      fr: "Comment s'échauffer, apprendre la technique, distinguer l'effort d'une mauvaise douleur, et adapter les exercices aux articulations sensibles.",
      tn: "كيفاش تسخّن، تتعلّم التكنيك، تفرّق بين التعب الباهي والوجيعة الخايبة، وتبدّل التمارين حسب المفاصل الحسّاسة.",
      tnLatn: "Kifech ta3mel échauffement, tet3allem el technique, tfara9 bin el effort el behi w el wji3a el 5ayba, w tbaddel el exercices 7seb les articulations el 7assesa.",
    },
    sections: [
      {
        heading: { en: "Warm up properly", fr: "Bien s'échauffer", tn: "سخّن كما يلزم", tnLatn: "A3mel échauffement kima yelzem" },
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
          tn: md(
            "التسخين الباهي ياخو 5–10 دقايق:",
            ul(
              "**5 دقايق كارديو خفيف** (بيسكلات، مشي بالزربة، رامور) باش تطلّع سخانة بدنك.",
              "**2–3 سيريات تحضيرية** في أوّل تمرين: مثلاً، كان الثقل اللي باش تخدم بيه 60 kg، اعمل 10 مرّات بالبار فارغة، 5 بـ 40 kg، 3 بـ 50 kg، ومن بعد ابدا.",
            ),
            "ما يلزمكش تقعد تمطّط برشا قبل ما ترفع الثقل. شويّة حركات ديناميك للمفاصل اللي باش تخدمهم يكفيو.",
          ),
          tnLatn: md(
            "Échauffement behi yekhou 5–10 d9aye9:",
            ul(
              "**5 d9aye9 cardio khfif** (vélo, mechi bel zarba, rameur) bech ttala3 s5anet bdanek.",
              "**2–3 séries ta7dhiriya** fi awwel exercice: mathalan, ken el charge eli bech tekhdem biha 60 kg, a3mel 10 reps bel barre fergha, 5 b 40 kg, 3 b 50 kg, w ba3d ebda.",
            ),
            "Ma yelzmekch étirements twal 9bal ma terfa3 el charge. Chwaya mouvements dynamiques lel articulations eli bech tekhdemhom ykaffiw.",
          ),
        },
      },
      {
        heading: { en: "Learn the technique first", fr: "Apprends d'abord la technique", tn: "اتعلّم التكنيك قبل كل شي", tnLatn: "Ta3allem el technique 9bal kol chay" },
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
          tn: md(
            "في الجمعات الأولى، اختار ثقل يخلّيك تركّز على الحركة. صوّر السيريات متاعك من الجنب، قارنهم بفيديوات شرح باهية، ولا اطلب من كوتش عندو خبرة يشوفلك الـ squat، الـ soulevé de terre و الـ développés متاعك.",
            "الأساسيات في قريب كل تمرين:",
            ul(
              "**كونترولي الثقل:** هبّطو في تقريب 2–3 ثواني، ما تخلّيهش ينقّز ولا يطيح.",
              "**حركة كاملة وبلا وجيعة.**",
              "**شدّ روحك مليح** (نفس عميق، كرشك مشدودة) في الثقل الكبير.",
              "**نفس التكنيك في كل مرّة.** كان التكنيك بدا يخرب، السيري وفات.",
            ),
          ),
          tnLatn: md(
            "Fil jem3at el louwla, e5tar charge t5allik trakkez 3al mouvement. Sawwer les séries mte3ek mel jnab, 9arenhom b vidéos explicatives behyin, wala otlob men coach 3andou expérience ychouflek el squat, el soulevé de terre w les développés mte3ek.",
            "Les bases fi 9rib kol exercice:",
            ul(
              "**Contrôli el charge:** habbtou fi ta9rib 2–3 secondes, ma t5allihch yna99ez wala yti7.",
              "**Amplitude kemla w blech wji3a.**",
              "**Chedd rou7ek mli7** (nafes 3mi9, kerchek mchdouda) fil charges th9al.",
              "**Nafs el technique f kol rep.** Ken el technique bdet tokhrob, la série wfet.",
            ),
          ),
        },
      },
      {
        heading: { en: "Effort vs pain", fr: "Effort ou douleur ?", tn: "التعب ولا الوجيعة؟", tnLatn: "Effort wala wji3a?" },
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
          tn: md(
            "التمرين لازمو يكون صعيب. أما ما لازموش يوجعك بالطريقة الغالطة.",
            ul(
              "**نورمال:** حرقان في العضلة، نفس ثقيل، رعشة في آخر سيري صعيبة، بدنك مكسّر بعد 1–3 أيّام (DOMS).",
              "**موش نورمال:** وجيعة حادّة ولا كيف ضربة سكّين، وجيعة داخل المفصل، وجيعة تبدّل طريقة حركتك، تنميل ولا تشويك، وجيعة تزيد من حصّة لحصّة.",
            ),
            "كان حسّيت بالنوع الثاني، وقّف التمرين. ما تكمّلش بالسيف.",
          ),
          tnLatn: md(
            "El entraînement lazmou ykoun s3ib. Ama ma lazmouch ywaj3ek bel tari9a el 8alta.",
            ul(
              "**Normal:** 7or9an fil muscle, nafes th9il, ra3cha f e5er série s3iba, courbatures ba3d 1–3 ayyem (DOMS).",
              "**Mouch normal:** wji3a 7adda wala kif dharbet sekkina, wji3a dakhel l'articulation, wji3a tbaddel kifech tet7arrek, tnammil wala fourmillements, wji3a tzid men séance l séance.",
            ),
            "Ken 7assit bel naw3 el theni, wa99ef l'exercice. Ma tkammelch bessif.",
          ),
        },
      },
      {
        heading: { en: "Working around sensitive areas", fr: "Contourner les zones sensibles", tn: "دبّر راسك مع البلايص الحسّاسة", tnLatn: "Dabber rasek m3a les zones sensibles" },
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
          tn: md(
            "وجيعة في تمرين ما معناهاش تبطّل تخدم العضلة هاذيكا. لوّج على فاريانت بلا وجيعة:",
            ul(
              "**الركايب:** box squat لعمق تكون مرتاح فيه، presse à cuisses، step-ups، وزيد soulevé de terre roumain و hip thrust للجهة اللورانية متاع الساقين.",
              "**الضهر من لوطة:** goblet squat، rowing poitrine appuyée، hip thrust، presse à cuisses؛ ورجّع الحركات اللي تطوي فيها من الوسط بالشويّة وبثقل خفيف.",
              "**الكتاف:** prise neutre (كفوفك يقابلو بعضهم)، landmine press، développé incliné في بلاصة développé militaire، خدمة بالـ poulie، وحركة أقصر بشويّة.",
            ),
            "كان الوجيعة طوّلت أكثر من جمعة ولا جمعتين، ولا جات من إصابة، امشي لطبيب ولا لكينيه.",
          ),
          tnLatn: md(
            "Wji3a f exercice ma ma3nehech tbattel tekhdem el muscle hedheka. Lawwej 3la variante blech wji3a:",
            ul(
              "**Rkeyeb:** box squat l profondeur tkoun mirte7 fiha, presse à cuisses, step-ups, w zid soulevé de terre roumain w hip thrust lel jiha el lourania mte3 sa9ik.",
              "**Dhhar men louta:** goblet squat, rowing poitrine appuyée, hip thrust, presse à cuisses; w rajja3 el mouvements eli tetwa fihom mel wost bel chwaya w b charges khfef.",
              "**Ktef:** prise neutre (kfoufek y9ablou ba3dhhom), landmine press, développé incliné f blaset développé militaire, 5edma bel poulie, w amplitude a9sar chwaya.",
            ),
            "Ken el wji3a tawlet akther men jem3a wala jem3tin, wala jet men blessure, emchi l tbib wala l kiné.",
          ),
        },
      },
      {
        heading: { en: "When to stop for the day", fr: "Quand arrêter la séance", tn: "وقتاش توقّف الحصّة", tnLatn: "Wa9tech twa99ef el séance" },
        body: {
          en: md(
            "Stop the session if you feel dizzy or sick, or have chest pain or unusual shortness of breath, and get medical advice. If you have a heart condition or high blood pressure, or are pregnant, check with your doctor before starting a new program.",
          ),
          fr: md(
            "Arrête la séance en cas de vertiges, de nausée, de douleur dans la poitrine ou d'essoufflement inhabituel, et demande un avis médical. Si tu as un problème cardiaque, de l'hypertension ou si tu es enceinte, parles-en à ton médecin avant de commencer un nouveau programme.",
          ),
          tn: md(
            "وقّف الحصّة كان دخت ولا قلبك قلّب عليك، ولا جاتك وجيعة في صدرك ولا نفسك تقطّع على غير العادة، وشوف طبيب. كان عندك مشكلة في القلب ولا ضغطك طالع، ولا كنتي حاملة، شاور طبيبك قبل ما تبدا برنامج جديد.",
          ),
          tnLatn: md(
            "Wa99ef el séance ken do5t wala 9albek 9alleb 3lik, wala jetek wji3a f sadrek wala nafsek t9atta3 3la 8ir el 3ada, w chouf tbib. Ken 3andek mochkla fil 9alb wala 3andek tension, wala kenti 7amla, chawer tbibek 9bal ma tebda programme jdid.",
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
      tn: [
        "سخّن بكارديو خفيف و 2–3 سيريات تحضيرية أخفّ.",
        "اتعلّم التكنيك بثقل متوسّط وكونترولي كل مرّة.",
        "الحرقان في العضلة وتكسير البدن نورمال؛ الوجيعة الحادّة ولا وجيعة المفصل معناها وقّف.",
        "بدّل لفاريانت بلا وجيعة في بلاصة ما تفوّت العضلة؛ شوف كينيه كان الوجيعة طوّلت.",
      ],
      tnLatn: [
        "A3mel échauffement b cardio khfif w 2–3 séries ta7dhiriya akhaf.",
        "Ta3allem el technique b charges moyennes w contrôli kol rep.",
        "El 7or9an fil muscle w les courbatures normal; wji3a 7adda wala fil articulation ma3neha wa99ef.",
        "Baddel l variante blech wji3a f blaset ma tfawwet el muscle; chouf kiné ken el wji3a tawlet.",
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
      tn: "الخطوات والكارديو",
      tnLatn: "Les pas w el cardio",
    },
    summary: {
      en: "Why daily steps quietly drive fat loss, how to use cardio well, and why your watch's calorie number is only a guess.",
      fr: "Pourquoi tes pas quotidiens font discrètement fondre le gras, comment bien utiliser le cardio, et pourquoi les calories affichées par ta montre ne sont qu'une estimation.",
      tn: "علاش الخطوات اليومية تذوّب الشحم بالسكات، كيفاش تستعمل الكارديو مليح، وعلاش رقم الكالوري اللي في المونترة موش أكثر من تقدير.",
      tnLatn: "3lech el pas mte3ek kol nhar ydhawwbou el gras bel sket, kifech testa3mel el cardio mli7, w 3lech ra9m el calories mte3 el montre mouch akther men ta9dir.",
    },
    sections: [
      {
        heading: { en: "Steps: the underrated fat-loss tool", fr: "Les pas : l'outil sous-estimé", tn: "الخطوات: سلاح ضدّ الشحم ما يحسبولوش حساب", tnLatn: "Les pas: sle7 dhed el gras ma y7asboulouch 7sab" },
        body: {
          en: md(
            "Remember NEAT: all the movement outside the gym. Walking is its biggest and easiest part. Depending on your weight and pace, **1,000 steps burn roughly 30–50 kcal**. Going from 4,000 to 10,000 steps a day can mean 200–300 extra kcal burned every day, with little extra hunger or fatigue.",
            "Your target is **{{stepsTarget}} steps per day**. If you're far from it, build up gradually: add about 1,000–2,000 steps per day each week.",
          ),
          fr: md(
            "Souviens-toi de la NEAT : tout le mouvement en dehors de la salle. La marche en est la partie la plus importante et la plus facile. Selon ton poids et ton allure, **1 000 pas brûlent environ 30 à 50 kcal**. Passer de 4 000 à 10 000 pas par jour peut représenter 200 à 300 kcal de plus chaque jour, sans beaucoup plus de faim ni de fatigue.",
            "Ton objectif est de **{{stepsTarget}} pas par jour**. Si tu en es loin, augmente progressivement : environ 1 000 à 2 000 pas par jour de plus chaque semaine.",
          ),
          tn: md(
            "تفكّر الـ NEAT: كل الحركة اللي تعملها برّا السالة. المشي هو أكبر وأسهل جزء فيها. حسب وزنك وسرعتك، **1 000 خطوة تحرق تقريب 30–50 kcal**. كي تطلع من 4 000 لـ 10 000 خطوة في النهار، تنجّم تحرق 200–300 kcal زايدين كل نهار، بلا ما يزيدك برشا جوع ولا تعب.",
            "الهدف متاعك هو **{{stepsTarget}} خطوة في النهار**. كان إنت بعيد عليه، طلّع بالشويّة: زيد تقريب 1 000–2 000 خطوة في النهار كل جمعة.",
          ),
          tnLatn: md(
            "Tfakker el NEAT: kol el 7arka eli ta3melha barra el salle. El mechi howa akbar w ashel 7aja fiha. 7seb el poids mte3ek w el vitesse, **1 000 pas y7ar9ou ta9rib 30–50 kcal**. Ki tetla3 men 4 000 l 10 000 pas fi nhar, tnajjem t7ara9 200–300 kcal zeydin kol nhar, blech ma yzidek barcha jou3 wala ta3ab.",
            "L'objectif mte3ek howa **{{stepsTarget}} pas fi nhar**. Ken inti b3id 3lih, tala3 bel chwaya: zid ta9rib 1 000–2 000 pas fi nhar kol jem3a.",
          ),
        },
      },
      {
        heading: { en: "Easy ways to walk more", fr: "Des façons simples de marcher plus", tn: "طرق ساهلة باش تمشي أكثر", tnLatn: "Torto9 sehla bech temchi akther" },
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
          tn: md(
            ul(
              "تمشية 10–15 دقيقة بعد الماكلة (باهية زادة للهضم وللسكّر في الدم)",
              "احكي في التليفون وإنت تمشي",
              "الدروج في بلاصة الأسانسور",
              "انزل من الكار ولا المترو محطّة قبل، ولا حطّ الكرهبة أبعد",
              "دورة في العشية كي تطيح سخانة الصيف",
            ),
            "وقت الريجيم، بدنك يولّي يتحرّك أقلّ بلا ما تفيق. كي تتبّع الخطوات متاعك (المونترة ولا التليفون ينجّمو يبعثوهم للتطبيقة عن طريق Health Connect)، الـ NEAT ما تهبطش بالسكات.",
          ),
          tnLatn: md(
            ul(
              "Tmechya 10–15 d9i9a ba3d el makla (behya zeda lel digestion w lel sokkor fil dam)",
              "A7ki fil téléphone w inti temchi",
              "Edrouj f blaset l'ascenseur",
              "Enzel mel car wala el métro station 9bal, wala 7ott el karhba ab3ed",
              "Dawra fil 3chiya ki tti7 s5anet es-sif",
            ),
            "Wa9t el régime, bdanek ywalli yet7arrek a9al blech ma tfi9. Ki ttabba3 el pas mte3ek (el montre wala el téléphone ynajjmou yeb3thouhom lel app 3an tari9 Health Connect), el NEAT ma tahbatch bel sket.",
          ),
        },
      },
      {
        heading: { en: "Types of cardio", fr: "Les types de cardio", tn: "أنواع الكارديو", tnLatn: "Anwe3 el cardio" },
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
          tn: md(
            ul(
              "**شدّة خفيفة (الزون 2):** مشي سريع، بيسكلات على رواحة، جري خفيف. تنجّم تحكي بجمل كاملة. ترتاح منّو بالساهل وهايل لصحّة القلب.",
              "**شدّة عالية (الفراكسيوني):** مجهودات قصيرة وقويّة مع راحات خفيفة، مثلاً 30 ثانية بالزربة، 90 ثانية على رواحة، 6–10 مرّات. يربّحك الوقت، أما يتعب أكثر وتطوّل باش ترتاح منّو.",
            ),
            "الزونات متاع دقّات القلب، بالتقريب: احسب الماكسيموم متاع دقّات قلبك على أساس **220 ناقص عمرك**؛ هاذا كان تقريب، وبرشا مرّات يغلط بـ 10 دقّات ولا أكثر. الزون 2 هي تقريب 60–70% من هالرقم؛ والفراكسيوني يطلّعك فوق 80–85%.",
            "للصحّة، حاول توصل لـ **150 دقيقة كارديو متوسّط في الجمعة** (ولا 75 دقيقة كارديو قوي). الكارديو يعاون قلبك ويحرق كالوري زايدة، أما الماكلة هي اللي تحكم في سرعة تنقيص الشحم، والتمرين بالثقل هو اللي يحمي عضلاتك.",
          ),
          tnLatn: md(
            ul(
              "**Intensité khfifa (zone 2):** mechi sri3, vélo 3la rwe7a, footing khfif. Tnajjem ta7ki b jmal kemla. Récupération mte3ou sehla w hayel l sa77et el 9alb.",
              "**Intensité 3alya (fractionné):** efforts 9sar w 9wiya m3a pauses khfef, mathalan 30 secondes bel zarba, 90 secondes 3la rwe7a, 6–10 marrat. Yrabba7ek el wa9t, ama yta3eb akther w récupération mte3ou as3ab.",
            ),
            "Les zones mte3 da99at el 9alb, bel ta9rib: e7seb el maximum mte3 da99at 9albek **220 na9es 3omrek**; hedha ken ta9rib, w barcha marrat ykoun 8alet b 10 da99at wala akther. Zone 2 hiya ta9rib 60–70% men hal ra9m; w el fractionné ytala3ek fou9 80–85%.",
            "Lel sa77a, 7awel tousel l **150 d9i9a cardio modéré fil jem3a** (wala 75 d9i9a cardio 9wi). El cardio y3awen 9albek w y7ra9 calories zeydin, ama el makla hiya eli t7akkem fi vitesse tan9is el gras, w el musculation hiya eli t7ami el muscles mte3ek.",
          ),
        },
      },
      {
        heading: { en: "Don't eat back your watch's calories", fr: "Ne remange pas les calories de ta montre", tn: "ما تعاودش تاكل كالوري المونترة", tnLatn: "Ma t3awedch takel les calories mte3 el montre" },
        body: {
          en: md(
            "Smartwatches and gym machines estimate calories burned, and they're often **off by 20–40%**, usually too high. If your watch says a run burned 600 kcal, the real number may be closer to 400. Step counts are fairly reliable; calorie estimates are the shaky part.",
            "Your plan's activity level already includes your usual training. If you want to eat more on very active days, eat back **at most about half** of the extra calories your watch shows. The app's adjustment from your real weight trend takes care of the rest.",
          ),
          fr: md(
            "Les montres connectées et les machines de salle estiment les calories brûlées, et elles se trompent souvent de **20 à 40 %**, généralement vers le haut. Si ta montre annonce 600 kcal pour un footing, le vrai chiffre est peut-être plus proche de 400. Le nombre de pas est assez fiable ; c'est l'estimation des calories qui l'est beaucoup moins.",
            "Le niveau d'activité de ton plan inclut déjà tes entraînements habituels. Si tu veux manger plus les jours très actifs, ne remange **qu'environ la moitié, au maximum,** des calories supplémentaires affichées par ta montre. L'ajustement de l'appli à partir de ta vraie courbe de poids fait le reste.",
          ),
          tn: md(
            "المونترات الذكية والماكينات متاع السالة يقدّرو الكالوري اللي حرقتها، وبرشا مرّات **يغلطو بـ 20–40%**، وغالباً يكبّرو. كان المونترة قالتلك الجرية حرقت 600 kcal، الرقم الحقيقي يمكن أقرب لـ 400. عدد الخطوات تنجّم تتعوّل عليه تقريب؛ تقدير الكالوري هو اللي موش مضمون.",
            "مستوى النشاط في البرنامج متاعك فيه من قبل التمارين اللي تعملهم ديما. كان تحبّ تاكل أكثر في النهارات اللي تتحرّك فيها برشا، كول **النصّ تقريب على الأكثر** من الكالوري الزايدة اللي تورّيهالك المونترة. والتطبيقة تعدّل وحدها حسب كيفاش ماشي وزنك الحقيقي، وتتكلّف بالباقي.",
          ),
          tnLatn: md(
            "Les montres connectées w les machines mte3 el salle y9addrou les calories eli 7ra9thom, w barcha marrat **ye8ltou b 20–40%**, w 8aleban ykabbrou. Ken el montre 9atlek el footing 7ra9 600 kcal, el ra9m el 7a9i9i yemken a9rab l 400. 3add el pas tnajjem tet3awwel 3lih ta9rib; ta9dir el calories howa eli mouch madhmoun.",
            "Le niveau d'activité fil programme mte3ek fih men 9bal el entraînements eli ta3melhom dima. Ken t7eb takel akther fil nharat eli tet7arrek fihom barcha, kol **el nos ta9rib 3al akther** mel calories ezzeydin eli twarrihomlek el montre. W el app t3addel wa7adha 7seb kifech mechi el poids el 7a9i9i mte3ek, w tetkallef bel be9i.",
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
      tn: [
        "الخطوات اليومية طريقة ساهلة وما فيهاش تعب باش تحرق أكثر: حاول توصل لـ {{stepsTarget}} في النهار.",
        "الزون 2 (تنجّم تحكي) ترتاح منها بالساهل؛ الفراكسيوني فعّال أما يتعب.",
        "حاول توصل لتقريب 150 دقيقة كارديو متوسّط في الجمعة لصحّة القلب.",
        "الكالوري متاع المونترة برشا مرّات زايدة بـ 20–40%؛ ما تعاودش تاكل منها كان النصّ على الأكثر.",
      ],
      tnLatn: [
        "El pas kol nhar tari9a sehla w ma fihech ta3ab bech t7ara9 akther: 7awel tousel l {{stepsTarget}} fi nhar.",
        "Zone 2 (tnajjem ta7ki) récupération mte3ha sehla; el fractionné efficace ama yta3eb.",
        "7awel tousel l ta9rib 150 d9i9a cardio modéré fil jem3a l sa77et el 9alb.",
        "Les calories mte3 el montre barcha marrat zeydin b 20–40%; ma t3awedch takel menhom ken el nos 3al akther.",
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
      tn: "النوم والراحة",
      tnLatn: "Noum w récupération",
    },
    summary: {
      en: "Sleep is when your body rebuilds; skimping on it makes you hungrier and weaker. Here's how to recover well.",
      fr: "C'est pendant le sommeil que ton corps se reconstruit ; en manquer augmente ta faim et fait baisser tes performances. Voici comment bien récupérer.",
      tn: "وقت النوم هو وقتاش بدنك يعاود يبني روحو؛ كي تنقّص منّو تولّي جيعان أكثر وأضعف. هاو كيفاش ترتاح مليح.",
      tnLatn: "Wa9t el noum howa wa9tech bdanek y3awed yebni rou7ou; ki tna99es menou twalli ji3an akther w adh3af. Haw kifech ta3mel récupération mli7a.",
    },
    sections: [
      {
        heading: { en: "Sleep controls your hunger", fr: "Le sommeil contrôle ta faim", tn: "النوم يتحكّم في جوعك", tnLatn: "El noum yet7akkem fi jou3ek" },
        body: {
          en: md(
            "Even a few short nights change your appetite hormones: **ghrelin** (which makes you hungry) goes up and **leptin** (which signals fullness) goes down. In studies, sleep-deprived people often eat a few hundred kcal more the next day, and crave sugary, fatty foods more.",
            "Sleep also affects what you lose: in one well-known study, dieters who slept about 5.5 hours lost noticeably less fat and more lean mass than when they slept 8.5 hours on the same diet.",
          ),
          fr: md(
            "Même quelques nuits courtes modifient tes hormones de l'appétit : la **ghréline** (qui donne faim) augmente et la **leptine** (qui signale la satiété) baisse. Dans les études, les personnes en manque de sommeil mangent souvent quelques centaines de kcal de plus le lendemain, et ont davantage envie d'aliments sucrés et gras.",
            "Le sommeil influence aussi ce que tu perds : dans une étude connue, des personnes au régime qui dormaient environ 5,5 heures ont perdu nettement moins de gras et plus de masse maigre que lorsqu'elles dormaient 8,5 heures, avec le même régime.",
          ),
          tn: md(
            "حتّى شويّة ليالي نوم قصير يبدّلو هرمونات الشهيّة متاعك: **الغريلين** (اللي يجوّعك) يطلع و **اللبتين** (اللي يقلّك شبعت) يهبط. في الدراسات، الناس اللي ما رقدوش كفاية برشا مرّات ياكلو قدّاش من مية kcal أكثر النهار اللي بعدو، ويشتهيو الحلو والماكلة الدسمة أكثر.",
            "النوم يأثّر زادة على شنوّة تخسر: في دراسة معروفة، ناس عاملين ريجيم رقدو تقريب 5,5 سوايع خسرو شحم أقلّ بياسر وكتلة عضلية أكثر، مقارنة بكي رقدو 8,5 سوايع بنفس الريجيم.",
          ),
          tnLatn: md(
            "7atta chwaya lyeli noum 9sir ybaddlou les hormones mte3 echahiya mte3ek: el **ghréline** (eli tjawwa3ek) tetla3 w el **leptine** (eli t9ollek chba3t) tahbet. Fil études, ennes eli ma r9adouch kfeya barcha marrat yeklou 9addech men miya kcal akther el nhar eli ba3dou, w yechtehiw el 7lou w el makla eddasma akther.",
            "El noum yaththar zeda 3la chnowa tekhser: f étude ma3roufa, ness 3amlin régime r9adou ta9rib 5,5 swaye3 khesrou gras a9al byesser w masse maigre akther, men ki r9adou 8,5 swaye3 b nafs el régime.",
          ),
        },
      },
      {
        heading: { en: "Muscles grow between sessions", fr: "Les muscles se construisent entre les séances", tn: "العضلات تكبر بين حصّة وحصّة", tnLatn: "El muscles tekber bin séance w séance" },
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
          tn: md(
            "التمرين هو الإشارة؛ والراحة هي وقتاش تولّي أقوى بالحق. العضلات تتصلّح وتكبر في الـ 24–72 ساعة اللي بعد الحصّة، خاصّة في النوم العميق.",
            "حاول ترقد **7–9 سوايع في الليلة**. عادات تعاونك:",
            ul(
              "ترقد وتنوض في نفس الوقت تقريب، حتّى في الويكاند",
              "بلاصة باردة، مظلّمة وهادية (في الصيف، الفونتيلاتور ولا الكليماتيزور يعاونو برشا)",
              "بلاش كافيين (قهوة، تاي ثقيل، إنرجي درينك) في الـ 6–8 سوايع قبل النوم",
              "قلّل من التليفون والإيكران في آخر 30–60 دقيقة",
            ),
          ),
          tnLatn: md(
            "El entraînement howa el signal; w el récupération hiya wa9tech twalli a9wa bel 7a9. El muscles tetsalla7 w tekber fil 24–72 sa3a eli ba3d el séance, 5assatan fil noum el 3mi9.",
            "7awel tor9od **7–9 swaye3 fil lila**. 3adet t3awnek:",
            ul(
              "Tor9od w tnoudh fi nafs el wa9t ta9rib, 7atta fil week-end",
              "Blasa barda, mdhalma w hedya (fi sif, el ventilateur wala el climatiseur y3awnou barcha)",
              "Blech caféine (9ahwa, tey th9il, energy drinks) fil 6–8 swaye3 9bal el noum",
              "Na99es mel téléphone w les écrans f e5er 30–60 d9i9a",
            ),
          ),
        },
      },
      {
        heading: { en: "Rest days", fr: "Les jours de repos", tn: "نهارات الراحة", tnLatn: "Nharat repos" },
        body: {
          en: md(
            "Rest days aren't lazy; they're part of the program. Training each muscle hard about twice a week, with at least 48 hours in between, works well for most people. On rest days, walking and light activity are great: they help recovery and keep your steps up.",
          ),
          fr: md(
            "Les jours de repos ne sont pas de la paresse : ils font partie du programme. Travailler chaque muscle intensément environ deux fois par semaine, avec au moins 48 heures entre deux séances, convient à la plupart des gens. Les jours de repos, la marche et l'activité légère sont parfaites : elles aident à récupérer et maintiennent tes pas.",
          ),
          tn: md(
            "نهارات الراحة موش كسل؛ هوما من البرنامج. كي تخدم كل عضلة بالقوّة تقريب مرّتين في الجمعة، مع 48 ساعة على الأقل بيناتهم، هاذا يمشي مليح لأغلب الناس. في نهارات الراحة، المشي والحركة الخفيفة هايلين: يعاونو على الراحة ويخلّيو الخطوات متاعك طالعين.",
          ),
          tnLatn: md(
            "Nharat repos mouch kasel; homa men el programme. Ki tekhdem kol muscle bel 9wi ta9rib marrtin fil jem3a, m3a 48 sa3a 3al a9al binethom, hedha yemchi mli7 l aghlab ennes. Fi nharat repos, el mechi w el 7arka el khfifa hayline: y3awnou 3al récupération w y5alliw el pas mte3ek tal3in.",
          ),
        },
      },
      {
        heading: { en: "Deloads", fr: "Les semaines de décharge (deload)", tn: "الديلود (جمعة خفيفة)", tnLatn: "Deload (jem3a khfifa)" },
        body: {
          en: md(
            "After several weeks of hard training, fatigue builds up. A **deload** is a planned easier week: keep the same exercises, but cut the number of sets roughly in half and stay further from failure (around 3–4 reps in reserve).",
            "Beginners rarely need them on a fixed schedule. Take one every 6–10 weeks, or when you notice: lifts going down for 2 or more sessions, aching joints, poor sleep, or no motivation at all.",
          ),
          fr: md(
            "Après plusieurs semaines d'entraînement intense, la fatigue s'accumule. Une **décharge** (ou deload) est une semaine plus légère planifiée : garde les mêmes exercices, mais réduis le nombre de séries de moitié environ et reste plus loin de l'échec (environ 3 à 4 répétitions en réserve).",
            "Les débutants en ont rarement besoin selon un calendrier fixe. Fais-en une toutes les 6 à 10 semaines, ou quand tu remarques : des charges qui baissent pendant 2 séances ou plus, des articulations douloureuses, un mauvais sommeil, ou plus aucune motivation.",
          ),
          tn: md(
            "بعد برشا جمعات تمرين قوي، التعب يتلمّ. الـ **ديلود** هو جمعة أخفّ مخطّط ليها: خلّي نفس التمارين، أما نقّص عدد السيريات للنصّ تقريب وما تقرّبش برشا للفشل (خلّي تقريب 3–4 مرّات في الاحتياط).",
            "اللي مازالو بادين قليل وين يستحقّوهم بمواعيد ثابتة. اعمل واحد كل 6–10 جمعات، ولا كي تلاحظ: الثقل اللي ترفعو يهبط في 2 حصص ولا أكثر، المفاصل توجع، النوم خايب، ولا ما عندك حتّى نفس تتمرّن.",
          ),
          tnLatn: md(
            "Ba3d barcha jem3at entraînement 9wi, el ta3ab yetlamm. El **deload** howa jem3a akhaf m5attet-lha: 5alli nafs el exercices, ama na99es 3add les séries lel nos ta9rib w ab9a b3id 3al échec (ta9rib 3–4 reps en réserve).",
            "Eli mazelou bedyin 9lil win yest7a99ouh b mawa3id thabta. A3mel wa7ed kol 6–10 jem3at, wala ki tla7edh: les charges tahbet fi 2 séances wala akther, les articulations twaja3, el noum 5ayeb, wala ma3andek 7atta nafs tetmarren.",
          ),
        },
      },
      {
        heading: { en: "Stress counts too", fr: "Le stress compte aussi", tn: "الستراس يتحسب زادة", tnLatn: "El stress yet7seb zeda" },
        body: {
          en: md(
            "Work stress, exams or family pressure draw on the same recovery system as training. High stress can increase water retention (hiding fat loss on the scale), hunger and fatigue. In stressful weeks, it's smarter to cut training volume a little than to push harder.",
          ),
          fr: md(
            "Le stress au travail, les examens ou les tensions familiales puisent dans le même système de récupération que l'entraînement. Un stress élevé peut augmenter la rétention d'eau (ce qui masque la perte de gras sur la balance), la faim et la fatigue. Les semaines stressantes, il est plus malin de réduire un peu le volume d'entraînement que de forcer davantage.",
          ),
          tn: md(
            "ستراس الخدمة، الإمتحانات ولا ضغط العايلة ياكلو من نفس الخزّان متاع الراحة اللي ياكل منّو التمرين. الستراس الكبير ينجّم يزيد في الماء اللي يشدّو البدن (ويخبّي تنقيص الشحم على الميزان)، في الجوع وفي التعب. في الجمعات اللي فيهم ستراس، خير تنقّص شويّة من الفوليوم متاع التمرين من إنّك تزيد تضغط على روحك.",
          ),
          tnLatn: md(
            "Stress el 5edma, les examens wala dhghat el 3ayla yeklou men nafs el réservoir mte3 el récupération eli yekel menou el entraînement. Stress kbir ynajjem yzid fi rétention d'eau (w ykhabbi tan9is el gras 3al mizen), fil jou3 w fil ta3ab. Fil jem3at eli fihom stress, 5ir tna99es chwaya mel volume mte3 el entraînement men ennek tzid tdhghat 3la rou7ek.",
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
      tn: [
        "النوم القليل يزيد في الجوع والتشهّي، ويخلّيك تخسر عضل أكثر في الديفيسيت.",
        "حاول ترقد 7–9 سوايع بمواعيد ثابتة، في بلاصة باردة ومظلّمة، وبلاش كافيين في آخر النهار.",
        "نهارات الراحة وجمعات الديلود من وقت لوقت هوما من التقدّم، موش وقفة فيه.",
        "في الجمعات اللي فيهم ستراس، تمرّن شويّة أقلّ موش أكثر.",
      ],
      tnLatn: [
        "Noum 9lil yzid fil jou3 w les envies, w y5allik tekhser muscle akther fil déficit.",
        "7awel tor9od 7–9 swaye3 b mawa3id thabta, f blasa barda w mdhalma, w blech caféine f e5er nhar.",
        "Nharat repos w jem3at deload men wa9t l wa9t homa men el progrès, mouch wa9fa fih.",
        "Fil jem3at eli fihom stress, tmarren chwaya a9al mouch akther.",
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
      tn: "الماء والإيدراتاسيون",
      tnLatn: "El mé w l'hydratation",
    },
    summary: {
      en: "How much to drink, why you need more in the Tunisian summer, and how water affects the number on the scale.",
      fr: "Combien boire, pourquoi il en faut plus pendant l'été tunisien, et comment l'eau joue sur le chiffre de la balance.",
      tn: "قدّاش تشرب، علاش يلزمك أكثر في صيف تونس، وكيفاش الماء يأثّر على الرقم اللي في الميزان.",
      tnLatn: "9addech tochrob, 3lech yelzmek akther fi sif Tounes, w kifech el mé yaththar 3al ra9m eli fil mizen.",
    },
    sections: [
      {
        heading: { en: "How much to drink", fr: "Combien boire", tn: "قدّاش تشرب", tnLatn: "9addech tochrob" },
        body: {
          en: md(
            "A practical guideline is about **30–35 ml per kg of bodyweight**. At {{weightKg}} kg, your target is about **{{waterL}} L per day**. Water, tea, coffee, lben and milk all count, and food (fruit, vegetables, soups) provides a good share too.",
            "You don't need to force it. Spread it over the day: a glass when you wake up, one with each meal, and a bottle during training.",
          ),
          fr: md(
            "Un repère pratique : environ **30 à 35 ml par kg de poids de corps**. À {{weightKg}} kg, ton objectif est d'environ **{{waterL}} L par jour**. L'eau, le thé, le café, le lben et le lait comptent tous, et l'alimentation (fruits, légumes, soupes) en apporte une bonne part.",
            "Pas besoin de te forcer. Répartis sur la journée : un verre au réveil, un à chaque repas, et une bouteille pendant l'entraînement.",
          ),
          tn: md(
            "قاعدة ساهلة: تقريب **30–35 ml على كل kg من وزنك**. بـ {{weightKg}} kg، الهدف متاعك تقريب **{{waterL}} L في النهار**. الماء، التاي، القهوة، اللبن والحليب الكل يتحسبو، والماكلة (الغلّة، الخضرة، الشربة) تعطيك زادة جزء باهي.",
            "ما يلزمكش تغصب على روحك. فرّقو على النهار: كاس كي تنوض، كاس مع كل ماكلة، ودبّوزة وقت التمرين.",
          ),
          tnLatn: md(
            "9a3da sehla: ta9rib **30–35 ml 3la kol kg men el poids mte3ek**. B {{weightKg}} kg, l'objectif mte3ek ta9rib **{{waterL}} L fi nhar**. El mé, el tey, el 9ahwa, el lben w el 7lib el kol yet7asbou, w el makla (el 8alla, el 5odhra, el chorba) ta3tik zeda part behya.",
            "Ma yelzmekch to8sob 3la rou7ek. Farra9ou 3al nhar: kes ki tnoudh, kes m3a kol makla, w dabbouza wa9t el entraînement.",
          ),
        },
      },
      {
        heading: { en: "Heat and training", fr: "Chaleur et entraînement", tn: "السخانة والتمرين", tnLatn: "S5ana w entraînement" },
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
          tn: md(
            "يلزمك أكثر كي تعرق. في صيف تونس، بـ 35–40 °C، تنجّم تخسر برشا ماء بلا ما تفيق.",
            ul(
              "وقت التمرين، اشرب تقريب **0,5–1 L في الساعة**، وأكثر كان تعرق برشا.",
              "في النهارات السخونة برشا ولا بعد حصص طويلة فيها برشا عرق، زيد شويّة ملح ولا إلكتروليت لماكلتك ولا للماء؛ العرق يخسّرك الصوديوم زادة.",
              "تمرّن في السوايع اللي فيها برودة (الصباح بكري ولا في العشية) كي تنجّم.",
            ),
          ),
          tnLatn: md(
            "Yelzmek akther ki te3re9. Fi sif Tounes, b 35–40 °C, tnajjem tekhser barcha mé blech ma tfi9.",
            ul(
              "Wa9t el entraînement, ochrob ta9rib **0,5–1 L fi sa3a**, w akther ken te3re9 barcha.",
              "Fil nharat s5ouna barcha wala ba3d séances twila fihom barcha 3ra9, zid chwaya mel7 wala électrolytes lel makla wala lel mé; el 3ra9 y5assrek el sodium zeda.",
              "Tmarren fil swaye3 eli fihom bourouda (sbe7 bekri wala fil 3chiya) ki tnajjem.",
            ),
          ),
        },
      },
      {
        heading: { en: "How to check", fr: "Comment vérifier", tn: "كيفاش تعرف", tnLatn: "Kifech ta3ref" },
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
          tn: md(
            "أسهل العلامات:",
            ul(
              "**البول أصفر فاتح:** إنت شارب ماء كفاية.",
              "**البول غامق، وجيعة راس، دوخة، فمّ ناشف، تعب:** اشرب أكثر.",
            ),
            "العطش دليل باهي لأغلب الناس، أما في السخانة ووقت التمرين ينجّم يجي متأخّر.",
          ),
          tnLatn: md(
            "El 3alamat el ashel:",
            ul(
              "**Boul asfar fete7:** inti chareb mé kfeya.",
              "**Boul 8ame9, wji3et ras, dou5a, fomm nechef, ta3ab:** ochrob akther.",
            ),
            "El 3atch dalil behi l aghlab ennes, ama fil s5ana w wa9t el entraînement ynajjem yji m3attel.",
          ),
        },
      },
      {
        heading: { en: "Water and the scale", fr: "L'eau et la balance", tn: "الماء والميزان", tnLatn: "El mé w el mizen" },
        body: {
          en: md(
            "Drinking more water doesn't add fat. It can move the scale by a few hundred grams from day to day, but that's just water passing through. And, oddly, dehydration can make your body hold on to water.",
            "Water helps with hunger too: thirst is sometimes mistaken for hunger, and a glass of water before a meal can help you feel full sooner.",
          ),
          fr: md(
            "Boire plus d'eau ne fait pas prendre de gras. Ça peut faire bouger la balance de quelques centaines de grammes d'un jour à l'autre, mais c'est juste de l'eau de passage. Et paradoxalement, la déshydratation peut pousser ton corps à retenir l'eau.",
            "L'eau aide aussi contre la faim : on confond parfois soif et faim, et un verre d'eau avant le repas aide à atteindre la satiété plus vite.",
          ),
          tn: md(
            "كي تشرب ماء أكثر ما تزيدش شحم. ينجّم يحرّك الميزان بقدّاش من مية غرام من نهار لنهار، أما هاذاكا كان ماء معدّي. والغريب، إنّ قلّة الماء تنجّم تخلّي بدنك يشدّ الماء.",
            "الماء يعاون زادة مع الجوع: ساعات تحسب روحك جيعان وإنت عطشان، وكاس ماء قبل الماكلة ينجّم يعاونك تشبع أسرع.",
          ),
          tnLatn: md(
            "Ki tochrob mé akther ma tzidch gras. Ynajjem y7arrek el mizen b 9addech men miya gramme men nhar l nhar, ama hedheka ken mé m3addi. W el 8rib, ennou la déshydratation tnajjem t5alli bdanek ychedd el mé.",
            "El mé y3awen zeda m3a el jou3: sa3at t7seb rou7ek ji3an w inti 3atchan, w kes mé 9bal el makla ynajjem y3awnek tochba3 asra3.",
          ),
        },
      },
      {
        heading: { en: "Don't overdo it", fr: "N'en fais pas trop", tn: "ما تبالغش", tnLatn: "Ma tbale8ch" },
        body: {
          en: md(
            "More isn't always better. Drinking huge amounts very fast (well over 1 L per hour for several hours) can dilute the sodium in your blood, which is dangerous. If you have a kidney or heart condition, follow your doctor's advice on fluids.",
          ),
          fr: md(
            "Plus n'est pas toujours mieux. Boire d'énormes quantités très vite (nettement plus de 1 L par heure pendant plusieurs heures) peut diluer le sodium dans le sang, ce qui est dangereux. Si tu as un problème rénal ou cardiaque, suis les conseils de ton médecin sur les liquides.",
          ),
          tn: md(
            "أكثر موش ديما خير. كي تشرب كمّيات كبيرة برشا بالزربة (أكثر بياسر من 1 L في الساعة برشا سوايع متتابعة) ينجّم يخفّف الصوديوم في دمّك، وهاذا خطير. كان عندك مشكلة في الكلاوي ولا في القلب، اتّبع نصايح طبيبك على قدّاش تشرب.",
          ),
          tnLatn: md(
            "Akther mouch dima 5ir. Ki tochrob kmiyet kbira barcha bel zarba (akther byesser men 1 L fi sa3a barcha swaye3 wra ba3dhhom) ynajjem y5affef el sodium fi dammek, w hedha 5atir. Ken 3andek mochkla fil klewi wala fil 9alb, ttabba3 nsaye7 tbibek 3la 9addech tochrob.",
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
      tn: [
        "حاول توصل لتقريب {{waterL}} L في النهار؛ التاي، الحليب، اللبن، الشربة والغلّة يتحسبو زادة.",
        "اشرب أكثر في السخانة ووقت التمرين: تقريب 0,5–1 L على كل ساعة تمرين فيها عرق.",
        "البول الأصفر الفاتح علامة ساهلة إنّك تشرب كفاية.",
        "الماء ما يزيدش شحم؛ تبدّل الماء على الميزان من نهار لنهار ما تعطيهش قيمة.",
      ],
      tnLatn: [
        "7awel tousel l ta9rib {{waterL}} L fi nhar; el tey, el 7lib, el lben, el chorba w el 8alla yet7asbou zeda.",
        "Ochrob akther fil s5ana w wa9t el entraînement: ta9rib 0,5–1 L 3la kol sa3a entraînement fiha 3ra9.",
        "El boul el asfar el fete7 3alama sehla ennek tochrob kfeya.",
        "El mé ma yzidch gras; tbaddil el mé 3al mizen men nhar l nhar ma ta3tihch 9ima.",
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
      tn: "البلاتو والتأقلم متاع الميتابوليزم",
      tnLatn: "Plateau w adaptation métabolique",
    },
    summary: {
      en: "Why fat loss slows down over time, how to tell a real plateau from a fake one, and what to do about it.",
      fr: "Pourquoi la perte de gras ralentit avec le temps, comment distinguer un vrai plateau d'un faux, et quoi faire.",
      tn: "علاش تنقيص الشحم يثقل مع الوقت، كيفاش تفرّق بين بلاتو حقيقي وبلاتو فالسو، وشنوّة تعمل.",
      tnLatn: "3lech tan9is el gras yeth9al m3a el wa9t, kifech tfara9 bin plateau 7a9i9i w plateau falso, w chnowa ta3mel.",
    },
    sections: [
      {
        heading: { en: "Why progress slows", fr: "Pourquoi les progrès ralentissent", tn: "علاش التقدّم يثقل", tnLatn: "3lech el progrès yeth9al" },
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
          tn: md(
            "كي تنقّص في الوزن، الكالوري اللي تحرقهم كل نهار يهبطو بالشويّة. ثلاثة أسباب:",
            ul(
              "**البدن الأخفّ يصرف أقلّ باش يدور.** كل كيلو تخسرو يهبّط الـ BMR متاعك ويخلّي الحركة تاكل شويّة أقلّ.",
              "**تتحرّك أقلّ بلا ما تفيق.** خطوات أقلّ، تتحرّك في بلاصتك أقلّ: الـ NEAT برشا مرّات تهبط وقت الريجيم.",
              "**التأقلم الحراري.** كي الماكلة تقلّ، بدنك يولّي يوفّر في الطاقة شويّة.",
            ),
            "الخبر الباهي: التأقلم هاذا حقيقي أما في العادة **صغير**، برشا مرّات ما يفوتش شويّة في المية من الكالوري اللي تحرقهم في النهار. الميتابوليزم متاعك موش “مكسّر” وموش في “مود الجوع”. الديفيسيت متاعك برك يصغار شويّة مع الوقت.",
          ),
          tnLatn: md(
            "Ki tna99es fil poids, les calories eli t7ar9hom kol nhar yahbtou bel chwaya. Thletha asbab:",
            ul(
              "**Bdan akhaf yesrof a9al bech ydour.** Kol kilo tekhsrou yhabbet el BMR mte3ek w y5alli el 7arka tekel chwaya a9al.",
              "**Tet7arrek a9al blech ma tfi9.** Pas a9al, tet7arrek fi blastek a9al: el NEAT barcha marrat tahbet wa9t el régime.",
              "**Thermogenèse adaptative.** Ki el makla t9ell, bdanek ywalli ywaffer fil énergie chwaya.",
            ),
            "El 5bar el behi: l'adaptation hedhi 7a9i9iya ama 3ada **sghira**, barcha marrat ma tfoutech chwaya fil miya mel calories eli t7ar9hom fi nhar. El métabolisme mte3ek mouch “mkasser” w mouch f “mode famine”. El déficit mte3ek ken yesghar chwaya m3a el wa9t.",
          ),
        },
      },
      {
        heading: { en: "Real plateau or fake one?", fr: "Vrai ou faux plateau ?", tn: "بلاتو حقيقي ولا فالسو؟", tnLatn: "Plateau 7a9i9i wala falso?" },
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
          tn: md(
            "أغلب “البلاتوات” هوما ماء مخبّي تنقيص الشحم (شوف “علاش الميزان يكذب”). قبل ما تبدّل حتّى شي، ثبّت:",
            ul(
              "**معدّل الجمعة** متاعك واقف بلاصتو من **3–4 جمعات**؟",
              "إنت **تسجّل بصراحة**، حتّى الزيت، المشروبات، اللمجات والويكاندات؟",
              "**الخطوات** متاعك هبطو؟",
              "قيس كرشك زادة ما تبدّلش؟",
            ),
            "كان الجواب على أوّل سؤال إي وكنت ديما تسجّل، هاذا بلاتو حقيقي.",
          ),
          tnLatn: md(
            "Aghlab les “plateaux” homa mé ykhabbi tan9is el gras (chouf “3lech el mizen ykadheb”). 9bal ma tbaddel 7atta chay, thabbet:",
            ul(
              "**Moyenne el jem3a** mte3ek wa9fa blasetha men **3–4 jem3at**?",
              "Inti **tsajjel b sra7a**, 7atta el zit, les boissons, el lemjet w el week-ends?",
              "El **pas** mte3ek hbtou?",
              "Tour de taille mte3ek zeda ma tbaddelch?",
            ),
            "Ken el jweb 3la awwel soual ey w kont dima tsajjel, hedha plateau 7a9i9i.",
          ),
        },
      },
      {
        heading: { en: "What to do", fr: "Quoi faire", tn: "شنوّة تعمل", tnLatn: "Chnowa ta3mel" },
        body: {
          en: md(
            "Pick one small change and give it 2–3 weeks:",
            ul(
              "**Lower calories by about 100–200 kcal per day**, or",
              "**Add about 2,000 steps per day** (roughly 60–100 kcal).",
            ),
            "Don't slash calories dramatically, and stay above the safety floor (around 1,200 kcal for women and 1,500 kcal for men without medical supervision). Tounsi Fit also updates your TDEE from your real weight trend, and it's worth recalculating your targets after every 4–5 kg lost.",
          ),
          fr: md(
            "Choisis un seul petit changement et laisse-lui 2 à 3 semaines :",
            ul(
              "**Baisser les calories d'environ 100 à 200 kcal par jour**, ou",
              "**Ajouter environ 2 000 pas par jour** (environ 60 à 100 kcal).",
            ),
            "Ne coupe pas les calories de façon drastique, et reste au-dessus de la limite de sécurité (environ 1 200 kcal pour une femme et 1 500 kcal pour un homme sans suivi médical). Tounsi Fit met aussi à jour ta TDEE à partir de ta vraie courbe de poids, et il vaut la peine de recalculer tes objectifs tous les 4 à 5 kg perdus.",
          ),
          tn: md(
            "اختار تبديلة صغيرة وحدة وعطيها 2–3 جمعات:",
            ul(
              "**نقّص تقريب 100–200 kcal في النهار**، ولا",
              "**زيد تقريب 2 000 خطوة في النهار** (تقريب 60–100 kcal).",
            ),
            "ما تقصّش برشا كالوري مرّة وحدة، وابقى فوق الحدّ اللي ما لازمكش تهبط تحتو (تقريب 1 200 kcal للنساء و 1 500 kcal للرجال بلا متابعة طبيب). Tounsi Fit زادة يصلّح الـ TDEE متاعك حسب كيفاش ماشي وزنك الحقيقي، ويستاهل تعاود تحسب الأهداف متاعك بعد كل 4–5 kg تخسرهم.",
          ),
          tnLatn: md(
            "E5tar tbdila sghira wa7da w a3tiha 2–3 jem3at:",
            ul(
              "**Na99es ta9rib 100–200 kcal fi nhar**, wala",
              "**Zid ta9rib 2 000 pas fi nhar** (ta9rib 60–100 kcal).",
            ),
            "Ma t9ossech barcha calories marra wa7da, w ab9a fou9 el 7add eli ma lazmekch tahbet ta7tou (ta9rib 1 200 kcal lel nsa w 1 500 kcal lel rjel blech suivi médical). Tounsi Fit zeda ysalla7 el TDEE mte3ek 7seb kifech mechi el poids el 7a9i9i mte3ek, w yestehel t3awed te7seb les objectifs mte3ek ba3d kol 4–5 kg tekhsarhom.",
          ),
        },
      },
      {
        heading: { en: "Diet breaks and refeeds", fr: "Pauses diète et refeeds", tn: "الراحة من الريجيم والريفيد", tnLatn: "Pause régime w refeeds" },
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
          tn: md(
            "الريجيمات الطويلة تتعب. زوز حاجات ينجّمو يعاونو:",
            ul(
              "**راحة من الريجيم:** 1–2 جمعات تاكل فيهم قدّ ما تصرف (قريب من الـ TDEE متاعك توّا)، كل 8–12 جمعة ريجيم.",
              "**الريفيد:** نهار ولا زوز في الجمعة بكالوري أكثر، والزيادة أغلبها من النشويات.",
            ),
            "الدراسات موش متّفقة إنّهم “يطلّعو” الميتابوليزم؛ الفايدة الكبيرة متاعهم في الراس: ترتاح من الريجيم، تتمرّن خير، وتولّي تكمّل فيه بالساهل. استنّى الميزان يطلع شويّة وقت الراحة، من الماكلة ومن الماء اللي يتلمّ مع الغليكوجين. هاذاكا موش شحم راجع.",
          ),
          tnLatn: md(
            "Les régimes etwal yta3bou. Zouz 7ajet ynajjmou y3awnou:",
            ul(
              "**Pause régime:** 1–2 jem3at takel fihom 3al maintenance (9rib mel TDEE mte3ek taw), kol 8–12 jem3a régime.",
              "**Refeed:** nhar wala zouz fil jem3a b calories akther, w ezziyada 8aleban mel glucides.",
            ),
            "Les études mouch mettaf9a ennhom “ytal3ou” el métabolisme; el fayda el kbira mte3hom fil ras: tirta7 mel régime, tetmarren 5ir, w twalli tkammel fih bel se7el. Estanna el mizen yetla3 chwaya wa9t el pause, mel makla w mel mé eli yetlamm m3a el glycogène. Hedheka mouch gras rej3.",
          ),
        },
      },
      {
        heading: { en: "Patience", fr: "La patience", tn: "الصبر", tnLatn: "Sbar" },
        body: {
          en: md(
            "Fat loss isn't linear. Your forecast of about {{weeksToGoal}} weeks is a guide, not a deadline. Keep the habits going and judge your progress month by month.",
          ),
          fr: md(
            "La perte de gras n'est pas linéaire. Ta prévision d'environ {{weeksToGoal}} semaines est un repère, pas une échéance. Garde tes habitudes et juge tes progrès mois par mois.",
          ),
          tn: md(
            "تنقيص الشحم ما يمشيش في خطّ مستقيم. التوقّع متاعك، تقريب {{weeksToGoal}} جمعة، هو دليل موش آخر أجل. كمّل في العادات متاعك واحكم على تقدّمك شهر بشهر.",
          ),
          tnLatn: md(
            "Tan9is el gras mouch linéaire. El prévision mte3ek, ta9rib {{weeksToGoal}} jem3a, hiya dalil mouch délai. Kammel fil 3adet mte3ek w o7kom 3la el progrès mte3ek chhar b chhar.",
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
      tn: [
        "الكالوري اللي تحرقهم في النهار يهبطو كي تنقّص في الوزن؛ التأقلم متاع الميتابوليزم حقيقي أما في العادة صغير.",
        "البلاتو الحقيقي هو معدّل الجمعة واقف 3–4 جمعات وإنت تسجّل بصراحة.",
        "صلّحو بتبديلة صغيرة وحدة: 100–200 kcal أقلّ في النهار ولا تقريب 2 000 خطوة زايدة.",
        "الراحة من الريجيم والريفيد يعاونوك أكثر حاجة باش تكمّل؛ الطلعة الصغيرة في الميزان بعدهم هي ماء.",
      ],
      tnLatn: [
        "Les calories eli t7ar9hom fi nhar yahbtou ki tna99es fil poids; l'adaptation métabolique 7a9i9iya ama 3ada sghira.",
        "El plateau el 7a9i9i howa moyenne el jem3a wa9fa 3–4 jem3at w inti tsajjel b sra7a.",
        "Salla7ou b tbdila sghira wa7da: 100–200 kcal a9al fi nhar wala ta9rib 2 000 pas zeydin.",
        "Pause régime w refeeds y3awnouk akther 7aja bech tkammel; ettal3a esghira fil mizen ba3dhom hiya mé.",
      ],
    },
    related: ['scale-lies', 'bmr-tdee', 'deficit-explained', 'consistency-mindset'],
  },

];
