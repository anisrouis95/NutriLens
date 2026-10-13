// Coaching data per exercise, part A (squat to chest fly). Assembled in exerciseCuration.ts.

import type { ExerciseExtra } from './exerciseCuration';
import { t } from './text';

export const exerciseExtrasA: Record<string, ExerciseExtra> = {
  // ----- Squat -----
  'Leg_Press': {
    nameFr: "Presse à cuisses",
    cues: [
      t("Feet shoulder-width in the middle of the platform.", "Pieds largeur d'épaules, au milieu du plateau.", "ساقيك قدّ عرض كتافك، في وسط البلاتو.", "Sa9ik 9add 3ordh ktefek, fi wost el plateau."),
      t("Lower until knees reach about 90°, lower back stays on the pad.", "Descends jusqu'à environ 90°, le bas du dos reste collé au dossier.", "هبّط حتى الركايب يوصلو لـ 90° تقريب، والظهر من لوطا يبقى لاصق في الدوسي.", "Habbet 7atta rkaybek youslou l 90° ta9riban, w dharek mel louta yob9a las9 fel dossier."),
      t("Knees follow your toes, never cave inward.", "Les genoux suivent la pointe des pieds, jamais vers l'intérieur.", "الركايب يتبعو صوابع ساقيك، عمرهم ما يدخلو لداخل.", "Rkaybek yetb3ou swaba3 sa9ik, 3omrhom ma yod5lou ldekhel."),
      t("Press through your whole foot; don't lock the knees at the top.", "Pousse avec tout le pied, sans verrouiller les genoux en haut.", "دزّ بساقك كاملة، وما تبلوكيش الركايب الفوق.", "Dezz b sa9ek kamla, w ma tblokich rkaybek el fou9."),
    ],
    mistakes: [
      t("Going so deep that the hips curl up off the seat.", "Descendre si bas que le bassin décolle du siège.", "تهبط برشا حتى الجناب يتنحّاو من الكرسي.", "Tahbet barcha 7atta jnabek yetna77aw mel korsi."),
      t("Snapping the knees straight at the top.", "Verrouiller violemment les genoux en haut.", "تبلوكي الركايب بقوّة الفوق.", "Tbloki rkaybek b 9owwa el fou9."),
      t("Pushing through the toes instead of the whole foot.", "Pousser sur les orteils au lieu de tout le pied.", "تدزّ بصوابع ساقيك عوض الساق كاملة.", "Tdezz b swaba3 sa9ik 3oudh sa9ek kamla."),
    ],
    difficulty: 1,
    repRange: [10, 15],
  },
  'Goblet_Squat': {
    nameFr: "Squat gobelet",
    cues: [
      t("Hug one dumbbell (or a loaded backpack) against your chest.", "Tiens un haltère (ou un sac à dos chargé) contre ta poitrine.", "احضن هالتير (ولا صاك معبّي) على صدرك.", "O7dhen haltère (walla sac m3abbi) 3la sedrek."),
      t("Sit down between your heels, chest proud, elbows inside knees.", "Descends entre tes talons, poitrine fière, coudes à l'intérieur des genoux.", "اقعد بين كعبيك، صدرك مرفوع، والمرافق من داخل الركايب.", "O93ed bin ka3bik, sedrek marfou3, w mrafe9ek mel dekhel mta3 rkaybek."),
      t("Brace your stomach like someone is about to poke it.", "Gaine ton ventre comme si quelqu'un allait te le pousser.", "شدّ كرشك كيما واحد باش يضربك فيها.", "Chedd krochek kima wa7ed bech yadhrbek fiha."),
      t("Push the floor away through your whole foot to stand.", "Pousse le sol avec tout le pied pour remonter.", "دزّ القاعة بساقك كاملة باش توقف.", "Dezz el 9a3a b sa9ek kamla bech to9ef."),
    ],
    mistakes: [
      t("Heels lifting off the floor.", "Talons qui se soulèvent du sol.", "الكعبين يتنحّاو من القاعة.", "El ka3bin yetna77aw mel 9a3a."),
      t("Rounding the back at the bottom.", "Arrondir le dos en bas du mouvement.", "تقوّس ظهرك كي تهبط.", "T9awwes dharek ki tahbet."),
      t("Letting the weight drift away from the chest.", "Laisser le poids s'éloigner de la poitrine.", "تخلّي الهالتير يبعد على صدرك.", "T5alli el haltère yob3ed 3la sedrek."),
    ],
    difficulty: 1,
    avoidIf: ['knees'],
    repRange: [8, 12],
  },
  'Dumbbell_Squat_To_A_Bench': {
    nameFr: "Squat sur banc avec haltères",
    cues: [
      t("Stand in front of a bench or chair, dumbbells at your sides.", "Place-toi devant un banc ou une chaise, haltères le long du corps.", "اوقف قدّام بانك ولا كرسي، والهالتيرات على جنبك.", "O9ef 9oddem banc walla korsi, w les haltères 3la jnebek."),
      t("Push hips back and sit down until you lightly touch the seat.", "Recule les fesses et descends jusqu'à effleurer le siège.", "رجّع جنابك لتالي واقعد حتى تمسّ الكرسي بالشويّة.", "Rajja3 jnabek lteli w o93ed 7atta tmess el korsi bechwaya."),
      t("Keep chest up and knees in line with your toes.", "Garde la poitrine haute et les genoux dans l'axe des pieds.", "خلّي صدرك مرفوع والركايب على خطّ صوابع ساقيك.", "5alli sedrek marfou3 w rkaybek 3la 5att swaba3 sa9ik."),
      t("Stand back up without rocking or bouncing off the bench.", "Remonte sans te balancer ni rebondir sur le banc.", "اوقف من غير ما تتمرجح ولا تنقّز على البانك.", "O9ef men 8ir ma tetmarja7 walla tna99ez 3al banc."),
    ],
    mistakes: [
      t("Plopping down and fully relaxing on the seat.", "S'affaler et se relâcher complètement sur le siège.", "تطيح على الكرسي وتريّح روحك بالكلّ.", "Tti7 3al korsi w trayya7 rou7ek bel kol."),
      t("Leaning far forward to get back up.", "Se pencher très en avant pour se relever.", "تميل برشا للقدّام باش توقف.", "Tmil barcha l9oddem bech to9ef."),
    ],
    difficulty: 1,
    repRange: [8, 12],
  },
  'Smith_Machine_Squat': {
    nameFr: "Squat à la Smith machine",
    cues: [
      t("Bar rests on your upper back muscles, not on your neck.", "La barre repose sur le haut du dos, pas sur la nuque.", "البار يتحطّ على ظهرك من الفوق، موش على رقبتك.", "El barre tet7att 3la dharek mel fou9, mouch 3la ra9btek."),
      t("Feet slightly in front of the bar, shoulder-width apart.", "Pieds légèrement devant la barre, écartés largeur d'épaules.", "ساقيك شويّة قدّام البار، قدّ عرض كتافك.", "Sa9ik chwaya 9oddem el barre, 9add 3ordh ktefek."),
      t("Brace, then sit down as if onto a chair.", "Gaine-toi, puis descends comme pour t'asseoir sur une chaise.", "شدّ كرشك، وبعد اقعد كيما تقعد على كرسي.", "Chedd krochek, ba3d o93ed kima to93ed 3la korsi."),
      t("Set the safety stops just below your lowest point.", "Règle les sécurités juste sous ton point le plus bas.", "حطّ الحماية شويّة تحت أوطى نقطة توصلها.", "7ott les sécurités chwaya ta7t awta no9ta tousselha."),
    ],
    mistakes: [
      t("Feet right under the bar, pushing knees far forward.", "Pieds sous la barre, ce qui pousse trop les genoux en avant.", "ساقيك تحت البار بالضبط، والركايب يمشيو برشا للقدّام.", "Sa9ik ta7t el barre bedhabt, w rkaybek yemchiw barcha l9oddem."),
      t("Forgetting to rotate the hooks to lock the bar.", "Oublier de tourner les crochets pour bloquer la barre.", "تنسى تدوّر الكروشيات باش تبلوكي البار.", "Tensa tdawwer les crochets bech tbloki el barre."),
    ],
    difficulty: 2,
    avoidIf: ['knees'],
    repRange: [8, 12],
  },
  'Hack_Squat': {
    nameFr: "Hack squat (machine)",
    cues: [
      t("Back and shoulders stay flat against the pads.", "Dos et épaules restent collés aux coussins.", "الظهر والكتاف يبقاو لاصقين في الكوسان.", "Dharek w ktefek yob9aw las9in fel coussin."),
      t("Feet shoulder-width in the middle of the platform.", "Pieds largeur d'épaules, au milieu du plateau.", "ساقيك قدّ عرض كتافك، في وسط البلاتو.", "Sa9ik 9add 3ordh ktefek, fi wost el plateau."),
      t("Lower slowly, push back up through the middle of your foot.", "Descends lentement, remonte en poussant avec le milieu du pied.", "اهبط بالشويّة، واطلع وانت تدزّ بوسط ساقك.", "Ehbet bechwaya, w etla3 w enti tdezz b wost sa9ek."),
    ],
    mistakes: [
      t("Bouncing out of the bottom position.", "Rebondir en bas du mouvement.", "تنقّز كي توصل لوطا.", "Tna99ez ki tousel louta."),
      t("Heels lifting off the platform.", "Talons qui décollent du plateau.", "الكعبين يتنحّاو من البلاتو.", "El ka3bin yetna77aw mel plateau."),
      t("Knees collapsing inward on the way up.", "Genoux qui rentrent vers l'intérieur en remontant.", "الركايب يدخلو لداخل كي تطلع.", "Rkaybek yod5lou ldekhel ki tetla3."),
    ],
    difficulty: 2,
    avoidIf: ['knees'],
    repRange: [8, 12],
  },
  'Barbell_Squat': {
    nameFr: "Squat à la barre",
    cues: [
      t("Bar on upper back; squeeze shoulder blades to make a shelf.", "Barre sur le haut du dos, serre les omoplates pour faire un support.", "البار على ظهرك من الفوق، لمّ لوحات كتافك باش تعمللو بلاصة.", "El barre 3la dharek mel fou9, lemm les omoplates bech ta3mlelha blassa."),
      t("Big breath and brace your stomach before each rep.", "Grande inspiration et ventre gainé avant chaque répétition.", "خوذ نفس كبير وشدّ كرشك قبل كل مرّة.", "5oudh nafes kbir w chedd krochek 9bal kol rep."),
      t("Sit down between your heels, knees pushed out over toes.", "Descends entre tes talons, genoux poussés au-dessus des orteils.", "اقعد بين كعبيك، وحلّ ركايبك لبرّا على خطّ صوابع ساقيك.", "O93ed bin ka3bik, w 7ell rkaybek lbarra 3la 5att swaba3 sa9ik."),
      t("Always squat inside a rack with the safety bars set.", "Squatte toujours dans une cage avec les sécurités réglées.", "ديما اعمل السكوات في الكاج والحماية محطوطة.", "Dima a3mel squat fel cage w les sécurités ma7toutin."),
    ],
    mistakes: [
      t("Rounding the lower back at the bottom.", "Arrondir le bas du dos en bas.", "تقوّس ظهرك من لوطا كي تهبط.", "T9awwes dharek mel louta ki tahbet."),
      t("Knees caving in when standing up.", "Genoux qui rentrent en remontant.", "الركايب يدخلو لداخل كي توقف.", "Rkaybek yod5lou ldekhel ki to9ef."),
      t("Adding weight before the movement feels solid.", "Ajouter du poids avant que le geste soit solide.", "تزيد الثقل قبل ما الحركة تولّي ثابتة.", "Tzid charge 9bal ma l7arka twalli thebta."),
    ],
    difficulty: 3,
    avoidIf: ['knees', 'lower_back', 'shoulders'],
    repRange: [6, 10],
  },
  'Dumbbell_Squat': {
    nameFr: "Squat avec haltères",
    cues: [
      t("Dumbbells hang at your sides, arms long and relaxed.", "Les haltères pendent le long du corps, bras relâchés.", "الهالتيرات مدلّيين على جنبك، ويدّيك ممدودين ومرتاحين.", "Les haltères mdalyin 3la jnebek, w yeddik mamdoudin w merte7in."),
      t("Feet shoulder-width, toes slightly turned out.", "Pieds largeur d'épaules, pointes légèrement vers l'extérieur.", "ساقيك قدّ عرض كتافك، وصوابعك شويّة لبرّا.", "Sa9ik 9add 3ordh ktefek, w swaba3ek chwaya lbarra."),
      t("Sit back and down, chest up, until thighs are near parallel.", "Descends en arrière, poitrine haute, cuisses presque parallèles au sol.", "اقعد لتالي وللوطا، صدرك مرفوع، حتى فخاذك تقريب موازيين للقاعة.", "O93ed lteli w llouta, sedrek marfou3, 7atta fkhadhek ta9riban parallèles lel 9a3a."),
      t("Push the floor away to stand tall.", "Pousse le sol pour te redresser complètement.", "دزّ القاعة باش توقف مستقيم.", "Dezz el 9a3a bech to9ef mesta9im."),
    ],
    mistakes: [
      t("Looking down and rounding the back.", "Regarder le sol et arrondir le dos.", "تشوف للوطا وتقوّس ظهرك.", "Tchouf llouta w t9awwes dharek."),
      t("Dumbbells swinging or pulling you forward.", "Haltères qui se balancent ou te tirent vers l'avant.", "الهالتيرات يتمرجحو ولا يجبدوك للقدّام.", "Les haltères yetmarj7ou walla yejbdouk l9oddem."),
    ],
    difficulty: 1,
    avoidIf: ['knees'],
    repRange: [8, 12],
  },
  'Plie_Dumbbell_Squat': {
    nameFr: "Squat sumo avec haltère",
    cues: [
      t("Wide stance, toes out, one dumbbell hanging between your legs.", "Pieds écartés, pointes vers l'extérieur, un haltère entre les jambes.", "حلّ ساقيك بالعرض، الصوابع لبرّا، وهالتير مدلّي بين ساقيك.", "7ell sa9ik bel 3ordh, swaba3ek lbarra, w haltère mdalli bin sa9ik."),
      t("Keep your torso upright as you lower straight down.", "Garde le buste droit en descendant à la verticale.", "خلّي بدنك مستقيم وانت تهبط ديراكت للوطا.", "5alli badnek mesta9im w enti tahbet direct llouta."),
      t("Push your knees out in the direction of your toes.", "Pousse les genoux dans la direction des orteils.", "دزّ ركايبك لبرّا على خطّ صوابع ساقيك.", "Dezz rkaybek lbarra 3la 5att swaba3 sa9ik."),
      t("Squeeze your glutes as you stand up.", "Serre les fessiers en remontant.", "شدّ الفيسيي وانت توقف.", "Chedd les fessiers w enti to9ef."),
    ],
    mistakes: [
      t("Knees caving in toward each other.", "Genoux qui se rapprochent l'un de l'autre.", "الركايب يقربو لبعضهم لداخل.", "Rkaybek y9arbou l ba3dhhom ldekhel."),
      t("Leaning forward instead of staying upright.", "Se pencher en avant au lieu de rester droit.", "تميل للقدّام عوض ما تبقى مستقيم.", "Tmil l9oddem 3oudh ma tob9a mesta9im."),
    ],
    difficulty: 1,
    avoidIf: ['knees'],
    repRange: [10, 15],
  },
  'Bodyweight_Squat': {
    nameFr: "Squat au poids du corps",
    cues: [
      t("Feet shoulder-width, arms forward for balance.", "Pieds largeur d'épaules, bras devant toi pour l'équilibre.", "ساقيك قدّ عرض كتافك، ويدّيك للقدّام باش تتوازن.", "Sa9ik 9add 3ordh ktefek, w yeddik l9oddem bech tetwezen."),
      t("Sit back as if onto a chair, chest up.", "Recule les fesses comme pour t'asseoir, poitrine haute.", "اقعد لتالي كيما تقعد على كرسي، صدرك مرفوع.", "O93ed lteli kima to93ed 3la korsi, sedrek marfou3."),
      t("Knees track over your toes, heels stay down.", "Genoux au-dessus des orteils, talons au sol.", "الركايب على خطّ صوابع ساقيك، والكعبين لاصقين في القاعة.", "Rkaybek 3la 5att swaba3 sa9ik, w ka3bik las9in fel 9a3a."),
      t("Sore knees? Squat down to a chair and stand back up.", "Genoux sensibles ? Descends jusqu'à une chaise puis remonte.", "ركايبك يوجعوك؟ اهبط حتى للكرسي ووقف.", "Rkaybek ywaj3ouk? Ehbet 7atta lel korsi w o9ef."),
    ],
    mistakes: [
      t("Heels rising off the floor.", "Talons qui se soulèvent.", "الكعبين يطلعو من القاعة.", "El ka3bin yotl3ou mel 9a3a."),
      t("Only bending the knees, not pushing the hips back.", "Plier seulement les genoux sans reculer les hanches.", "تطوي كان الركايب، وما ترجّعش جنابك لتالي.", "Totwi ken rkaybek, w ma trajja3ch jnabek lteli."),
      t("Rushing reps and bouncing at the bottom.", "Enchaîner trop vite et rebondir en bas.", "تزرب في المرّات وتنقّز كي توصل لوطا.", "Tezreb fel reps w tna99ez ki tousel louta."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },
  'Freehand_Jump_Squat': {
    nameFr: "Squat sauté",
    cues: [
      t("Arms crossed, squat down, then jump straight up.", "Bras croisés, descends en squat, puis saute droit vers le haut.", "يدّيك مصلّبين، اهبط في سكوات، وبعد نقّز ديراكت للفوق.", "Yeddik msallbin, ehbet f squat, ba3d na99ez direct lfou9."),
      t("Land softly on the balls of your feet, knees bent.", "Atterris en douceur sur l'avant du pied, genoux fléchis.", "طيح بالشويّة على قدّام ساقيك، والركايب مطويين.", "Ti7 bechwaya 3la 9oddem sa9ik, w rkaybek matwiyin."),
      t("Reset your balance before the next jump.", "Retrouve ton équilibre avant le saut suivant.", "رجّع توازنك قبل النقزة اللي بعدها.", "Rajja3 twezounek 9bal enna9za eli ba3dha."),
    ],
    mistakes: [
      t("Landing stiff-legged with a loud thud.", "Atterrir jambes raides avec un gros bruit.", "تطيح بساقين يابسين وتعمل حسّ كبير.", "Tti7 b sa9in yebsin w ta3mel 7ess kbir."),
      t("Knees caving inward on landing.", "Genoux qui rentrent à l'atterrissage.", "الركايب يدخلو لداخل كي تطيح.", "Rkaybek yod5lou ldekhel ki tti7."),
    ],
    difficulty: 2,
    avoidIf: ['knees'],
    repRange: [8, 12],
  },
  'Squats_-_With_Bands': {
    nameFr: "Squat avec élastique",
    cues: [
      t("Stand on the band, handles held at shoulder height.", "Debout sur l'élastique, poignées à hauteur d'épaules.", "اوقف على اللاستيك، والبوانيات في طول كتافك.", "O9ef 3al élastique, w les poignées 9add ktefek."),
      t("Sit back and down, chest proud, elbows under hands.", "Descends en arrière, poitrine fière, coudes sous les mains.", "اقعد لتالي وللوطا، صدرك مرفوع، والمرافق تحت يدّيك.", "O93ed lteli w llouta, sedrek marfou3, w mrafe9ek ta7t yeddik."),
      t("Drive up hard; the band gets tougher near the top.", "Remonte fort : l'élastique résiste plus vers le haut.", "اطلع بقوّة، اللاستيك يولّي أصعب قريب للفوق.", "Etla3 b 9owwa, l'élastique ywalli as3ab 9rib lel fou9."),
    ],
    mistakes: [
      t("Letting the band pull your shoulders forward.", "Laisser l'élastique t'enrouler les épaules vers l'avant.", "تخلّي اللاستيك يجبد كتافك للقدّام.", "T5alli l'élastique yejbed ktefek l9oddem."),
      t("Feet too close together, so the band slips.", "Pieds trop serrés, l'élastique glisse.", "ساقيك قراب برشا لبعضهم، واللاستيك يزلق.", "Sa9ik 9rab barcha l ba3dhhom, w l'élastique yezle9."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },

  // ----- Hinge -----
  'Stiff-Legged_Dumbbell_Deadlift': {
    nameFr: "Soulevé de terre jambes tendues aux haltères",
    cues: [
      t("Soft knees, then push your hips back like closing a door.", "Genoux souples, puis recule les hanches comme pour fermer une porte.", "ركايبك مطويين شويّة، وبعد رجّع جنابك لتالي كيما تسكّر باب.", "Rkaybek matwiyin chwaya, ba3d rajja3 jnabek lteli kima tsakker beb."),
      t("Weights slide close along your thighs and shins.", "Les poids glissent près des cuisses et des tibias.", "الهالتيرات يزلقو قريب على فخاذك وكراعيك.", "Les haltères yezel9ou 9rib 3la fkhadhek w kra3ik."),
      t("Keep a flat back; stop when the back of your thighs stretches.", "Dos plat ; arrête quand l'arrière des cuisses s'étire.", "خلّي ظهرك مستقيم، ووقّف كي تحسّ التالي متاع فخاذك يتمطّ.", "5alli dharek mesta9im, w wa99ef ki t7ess teli fkhadhek yetmatt."),
      t("No dumbbells? Hold a loaded backpack in front of you.", "Pas d'haltères ? Tiens un sac à dos chargé devant toi.", "ما عندكش هالتيرات؟ شدّ صاك معبّي قدّامك.", "Ma 3andekch haltères? Chedd sac m3abbi 9oddemek."),
    ],
    mistakes: [
      t("Rounding the back to reach lower.", "Arrondir le dos pour descendre plus bas.", "تقوّس ظهرك باش تهبط أكثر.", "T9awwes dharek bech tahbet akther."),
      t("Bending the knees a lot, turning it into a squat.", "Plier beaucoup les genoux, ça devient un squat.", "تطوي ركايبك برشا، وتولّي سكوات.", "Totwi rkaybek barcha, w twalli squat."),
      t("Letting the weights drift away from the legs.", "Laisser les poids s'éloigner des jambes.", "تخلّي الهالتيرات يبعدو على ساقيك.", "T5alli les haltères yeb3dou 3la sa9ik."),
    ],
    difficulty: 2,
    avoidIf: ['lower_back'],
    repRange: [8, 12],
  },
  'Pull_Through': {
    nameFr: "Pull-through à la poulie",
    cues: [
      t("Face away from a low pulley, rope between your legs.", "Dos à la poulie basse, corde entre les jambes.", "عطي ظهرك للبولي اللي لوطا، والكورد بين ساقيك.", "3ti dharek lel poulie basse, w la corde bin sa9ik."),
      t("Push hips back, arms long and relaxed.", "Recule les hanches, bras longs et relâchés.", "رجّع جنابك لتالي، ويدّيك ممدودين ومرتاحين.", "Rajja3 jnabek lteli, w yeddik mamdoudin w merte7in."),
      t("Drive hips forward and squeeze your glutes to stand.", "Pousse les hanches vers l'avant et serre les fessiers pour te redresser.", "دزّ جنابك للقدّام وشدّ الفيسيي باش توقف.", "Dezz jnabek l9oddem w chedd les fessiers bech to9ef."),
      t("Arms only hold the rope; the hips do the work.", "Les bras tiennent juste la corde, les hanches travaillent.", "اليدّين يشدّو الكورد برك، والجناب هوما اللي يخدمو.", "Yeddik ychedou la corde bark, w jnabek houma eli ye5dmou."),
    ],
    mistakes: [
      t("Pulling the rope up with the arms.", "Tirer la corde avec les bras.", "تجبد الكورد بيدّيك.", "Tejbed la corde b yeddik."),
      t("Squatting down instead of hinging at the hips.", "S'accroupir au lieu de basculer depuis les hanches.", "تقعد في سكوات عوض ما تطوي من الجناب.", "To93ed f squat 3oudh ma totwi mel jnab."),
      t("Leaning back at the top.", "Se pencher en arrière en haut.", "تميل لتالي كي توصل الفوق.", "Tmil lteli ki tousel el fou9."),
    ],
    difficulty: 1,
    repRange: [10, 15],
  },
  'Hyperextensions_Back_Extensions': {
    nameFr: "Extensions du dos (banc à 45°)",
    cues: [
      t("Pad just below your hip bones so you can bend freely.", "Coussin juste sous les hanches pour pouvoir te plier librement.", "الكوسان تحت عظم جنابك بالضبط باش تنجّم تطوي بالراحة.", "El coussin ta7t 3dham jnabek bedhabt bech tnajjem totwi b ra7tek."),
      t("Lower with a flat back, then rise by squeezing your glutes.", "Descends dos plat, puis remonte en serrant les fessiers.", "اهبط بظهر مستقيم، وبعد اطلع وانت تشدّ الفيسيي.", "Ehbet b dhar mesta9im, ba3d etla3 w enti tchedd les fessiers."),
      t("Stop when your body forms a straight line.", "Arrête quand ton corps forme une ligne droite.", "وقّف كي بدنك يولّي خطّ مستقيم.", "Wa99ef ki badnek ywalli 5att mesta9im."),
    ],
    mistakes: [
      t("Swinging up and over-arching at the top.", "Remonter avec élan et trop se cambrer en haut.", "تطلع بالدفعة وتكامبري برشا الفوق.", "Tetla3 bel élan w tcambri barcha el fou9."),
      t("Pad set so high it blocks the hips.", "Coussin réglé si haut qu'il bloque les hanches.", "الكوسان عالي برشا حتى يبلوكي جنابك.", "El coussin 3ali barcha 7atta ybloki jnabek."),
    ],
    difficulty: 1,
    avoidIf: ['lower_back'],
    repRange: [10, 15],
  },
  'Romanian_Deadlift': {
    nameFr: "Soulevé de terre roumain (barre)",
    cues: [
      t("Start standing, bar against your thighs, knees slightly bent.", "Pars debout, barre contre les cuisses, genoux légèrement fléchis.", "ابدا واقف، البار على فخاذك، والركايب مطويين شويّة.", "Ebda wa9ef, el barre 3la fkhadhek, w rkaybek matwiyin chwaya."),
      t("Push hips back; the bar slides down your legs.", "Recule les hanches, la barre glisse le long des jambes.", "رجّع جنابك لتالي، والبار يزلق على ساقيك للوطا.", "Rajja3 jnabek lteli, w el barre tezle9 3la sa9ik llouta."),
      t("Shoulders back and spine flat the whole time.", "Épaules en arrière et dos plat tout du long.", "الكتاف لتالي والظهر مستقيم طول الحركة.", "Ktefek lteli w dharek mesta9im toul el 7arka."),
      t("Drive hips forward to stand, squeezing your glutes.", "Pousse les hanches vers l'avant pour remonter, fessiers serrés.", "دزّ جنابك للقدّام باش توقف، وشدّ الفيسيي.", "Dezz jnabek l9oddem bech to9ef, w chedd les fessiers."),
    ],
    mistakes: [
      t("Rounding the back once the bar passes the knees.", "Arrondir le dos quand la barre passe les genoux.", "تقوّس ظهرك كي البار يفوت الركايب.", "T9awwes dharek ki el barre tfout rkaybek."),
      t("Bar drifting away from the legs.", "Barre qui s'éloigne des jambes.", "البار يبعد على ساقيك.", "El barre tob3ed 3la sa9ik."),
      t("Locking the knees completely straight.", "Verrouiller complètement les genoux.", "تبلوكي الركايب ممدودين بالكلّ.", "Tbloki rkaybek mamdoudin bel kol."),
    ],
    difficulty: 3,
    avoidIf: ['lower_back'],
    repRange: [6, 10],
  },
  'Trap_Bar_Deadlift': {
    nameFr: "Soulevé de terre à la trap bar",
    cues: [
      t("Stand centered inside the bar, handles beside your ankles.", "Place-toi au centre de la barre, poignées à côté des chevilles.", "اوقف في وسط البار، والبوانيات حذا مفاصل ساقيك.", "O9ef fi wost el barre, w les poignées 7dhe les chevilles."),
      t("Hips back, chest up, grip the handles hard.", "Hanches en arrière, poitrine haute, poignées bien serrées.", "الجناب لتالي، الصدر مرفوع، وشدّ البوانيات بالقوّة.", "Jnabek lteli, sedrek marfou3, w chedd les poignées b 9owwa."),
      t("Brace, then push the floor away to stand.", "Gaine-toi, puis pousse le sol pour te relever.", "شدّ كرشك، وبعد دزّ القاعة باش توقف.", "Chedd krochek, ba3d dezz el 9a3a bech to9ef."),
      t("Lower under control along the same path.", "Redescends en contrôle sur le même trajet.", "هبّط بالشويّة على نفس الطريق.", "Habbet bechwaya 3la nafs ettri9."),
    ],
    mistakes: [
      t("Jerking the bar off the floor.", "Arracher la barre du sol d'un coup.", "تهزّ البار من القاعة بضربة.", "Thezz el barre mel 9a3a b dharba."),
      t("Rounding the back at the start.", "Arrondir le dos au départ.", "تقوّس ظهرك في البداية.", "T9awwes dharek fel bidaya."),
    ],
    difficulty: 2,
    avoidIf: ['lower_back'],
    repRange: [6, 10],
  },
  'Barbell_Deadlift': {
    nameFr: "Soulevé de terre classique (barre)",
    cues: [
      t("Bar over the middle of your foot, shins close to it.", "Barre au-dessus du milieu du pied, tibias proches de la barre.", "البار فوق وسط ساقك، والكراعين قراب ليه.", "El barre fou9 wost sa9ek, w kra3ik 9rab liha."),
      t("Squeeze the bar and take the slack out before lifting.", "Serre la barre et mets-la en tension avant de tirer.", "شدّ البار وحطّو في تانسيون قبل ما تهزّ.", "Chedd el barre w 7ottha en tension 9bal ma thezz."),
      t("Push the floor away, bar dragging up your legs.", "Pousse le sol, la barre remonte en frôlant les jambes.", "دزّ القاعة، والبار يطلع لاصق في ساقيك.", "Dezz el 9a3a, w el barre tetla3 las9a fi sa9ik."),
      t("Stand tall at the top without leaning back.", "Redresse-toi en haut sans te pencher en arrière.", "اوقف مستقيم الفوق من غير ما تميل لتالي.", "O9ef mesta9im el fou9 men 8ir ma tmil lteli."),
    ],
    mistakes: [
      t("Rounded back during the lift.", "Dos arrondi pendant la levée.", "ظهرك مقوّس وانت تهزّ.", "Dharek m9awwes w enti thezz."),
      t("Hips shooting up first, legs straightening too early.", "Hanches qui montent en premier, jambes tendues trop tôt.", "الجناب يطلعو الأوّلين، والساقين يتمدّو بكري برشا.", "Jnabek yotl3ou lowlin, w sa9ik yetmaddou bekri barcha."),
      t("Bar starting too far in front of the feet.", "Barre placée trop loin devant les pieds.", "البار بعيد برشا قدّام ساقيك في البداية.", "El barre b3ida barcha 9oddem sa9ik fel bidaya."),
    ],
    difficulty: 3,
    avoidIf: ['lower_back'],
    repRange: [5, 8],
  },
  'Kettlebell_One-Legged_Deadlift': {
    nameFr: "Soulevé de terre sur une jambe",
    cues: [
      t("Weight or backpack in one hand, stand on the same-side leg.", "Poids ou sac dans une main, debout sur la jambe du même côté.", "ثقل ولا صاك في يدّ وحدة، واوقف على الساق اللي من نفس الجنب.", "Poids walla sac fi yed wa7da, w o9ef 3al sa9 eli men nafs ejjneb."),
      t("Hinge forward as your free leg reaches straight back.", "Penche-toi en avant pendant que l'autre jambe recule tendue.", "ميّل للقدّام والساق الأخرى تمشي ممدودة لتالي.", "Mayyel l9oddem w sa9ek lo5ra temchi mamdouda lteli."),
      t("Keep hips square to the floor and back flat.", "Garde les hanches face au sol et le dos plat.", "خلّي جنابك مقابلين القاعة وظهرك مستقيم.", "5alli jnabek m9ablin el 9a3a w dharek mesta9im."),
      t("Lightly touch a wall for balance at first.", "Au début, touche un mur pour garder l'équilibre.", "في الأوّل، مسّ حيط بالشويّة باش تتوازن.", "Fel lowel, mess 7it bechwaya bech tetwezen."),
    ],
    mistakes: [
      t("Opening the hip and twisting sideways.", "Ouvrir la hanche et pivoter sur le côté.", "تحلّ جنبك وتتلوّى على جنب.", "T7ell jnebek w tetlawwa 3la jneb."),
      t("Bending the standing knee into a squat.", "Plier la jambe d'appui comme un squat.", "تطوي ركبة الساق اللي واقف عليها كيما سكوات.", "Totwi rokbet sa9ek eli wa9ef 3liha kima squat."),
    ],
    difficulty: 2,
    repRange: [8, 12],
    unilateral: true,
  },
  'Superman': {
    nameFr: "Superman",
    cues: [
      t("Lie face down, arms stretched out in front.", "Allongé sur le ventre, bras tendus devant toi.", "اتمدّ على كرشك، ويدّيك ممدودين قدّامك.", "Etmadd 3la krochek, w yeddik mamdoudin 9oddemek."),
      t("Lift arms, chest and legs a few centimetres, glutes squeezed.", "Soulève bras, buste et jambes de quelques centimètres, fessiers serrés.", "هزّ يدّيك وصدرك وساقيك شويّة سنتيمات، والفيسيي مشدودين.", "Hezz yeddik w sedrek w sa9ik chwaya centimètres, w les fessiers mchedoudin."),
      t("Look at the floor to keep your neck long.", "Regarde le sol pour garder la nuque alignée.", "شوف القاعة باش رقبتك تبقى ممدودة.", "Chouf el 9a3a bech ra9btek tob9a mamdouda."),
      t("Hold two seconds, then lower slowly.", "Tiens deux secondes, puis redescends lentement.", "اصبر زوز ثواني، وبعد هبّط بالشويّة.", "Osbor zouz thwani, ba3d habbet bechwaya."),
    ],
    mistakes: [
      t("Yanking up high and crunching the lower back.", "Monter trop haut d'un coup en écrasant le bas du dos.", "تطلع عالي بضربة وتعصر ظهرك من لوطا.", "Tetla3 3ali b dharba w to3sor dharek mel louta."),
      t("Throwing the head back.", "Rejeter la tête en arrière.", "ترمي راسك لتالي.", "Tormi rassek lteli."),
    ],
    difficulty: 1,
    avoidIf: ['lower_back'],
    repRange: [10, 15],
  },
  'Band_Good_Morning': {
    nameFr: "Good morning avec élastique",
    cues: [
      t("Stand on the band, loop the other end behind your neck.", "Debout sur l'élastique, passe l'autre bout derrière la nuque.", "اوقف على اللاستيك، وفوّت الطرف الآخر من تالي رقبتك.", "O9ef 3al élastique, w fawwet etterf lo5or men teli ra9btek."),
      t("Soft knees, push hips back with a flat back.", "Genoux souples, recule les hanches en gardant le dos plat.", "ركايبك مطويين شويّة، رجّع جنابك لتالي وظهرك مستقيم.", "Rkaybek matwiyin chwaya, rajja3 jnabek lteli w dharek mesta9im."),
      t("Stand tall by driving your hips forward.", "Redresse-toi en poussant les hanches vers l'avant.", "اوقف مستقيم وانت تدزّ جنابك للقدّام.", "O9ef mesta9im w enti tdezz jnabek l9oddem."),
    ],
    mistakes: [
      t("Rounding the back as you bend over.", "Arrondir le dos en te penchant.", "تقوّس ظهرك وانت تميل.", "T9awwes dharek w enti tmil."),
      t("Band sitting on the neck bones instead of the upper back.", "Élastique sur les os du cou au lieu du haut du dos.", "اللاستيك على عظام رقبتك عوض ظهرك من الفوق.", "L'élastique 3la 3dham ra9btek 3oudh dharek mel fou9."),
    ],
    difficulty: 1,
    avoidIf: ['lower_back'],
    repRange: [12, 20],
  },
  'Band_Good_Morning_Pull_Through': {
    nameFr: "Good morning élastique (pull-through)",
    cues: [
      t("Anchor the band to a post and step away until it's tight.", "Fixe l'élastique à un poteau et éloigne-toi jusqu'à ce qu'il soit tendu.", "اربط اللاستيك في عمود وابعد حتى يتشدّ.", "Orbot l'élastique fi 3moud w ob3ed 7atta yetchadd."),
      t("Hands keep the band in place across your upper back.", "Tes mains maintiennent l'élastique sur le haut du dos.", "يدّيك يشدّو اللاستيك في بلاصتو على ظهرك من الفوق.", "Yeddik ychedou l'élastique fi blastou 3la dharek mel fou9."),
      t("Push your butt back as far as possible, back flat.", "Recule les fesses le plus loin possible, dos plat.", "رجّع جنابك لتالي قدّ ما تنجّم، وظهرك مستقيم.", "Rajja3 jnabek lteli 9add ma tnajjem, w dharek mesta9im."),
      t("Drive hips forward to stand, squeezing your glutes.", "Pousse les hanches vers l'avant pour te redresser, fessiers serrés.", "دزّ جنابك للقدّام باش توقف، وشدّ الفيسيي.", "Dezz jnabek l9oddem bech to9ef, w chedd les fessiers."),
    ],
    mistakes: [
      t("Bending the knees too much.", "Trop plier les genoux.", "تطوي ركايبك برشا.", "Totwi rkaybek barcha."),
      t("Rounding the back near the bottom.", "Arrondir le dos en bas.", "تقوّس ظهرك قريب للوطا.", "T9awwes dharek 9rib llouta."),
    ],
    difficulty: 2,
    avoidIf: ['lower_back'],
    repRange: [12, 20],
  },
  'Hip_Extension_with_Bands': {
    nameFr: "Extension de hanche avec élastique",
    cues: [
      t("Band around one ankle, anchored low in front of you.", "Élastique autour d'une cheville, attaché en bas devant toi.", "اللاستيك على مفصل ساق وحدة، ومربوط لوطا قدّامك.", "L'élastique 3la cheville wa7da, w marbout louta 9oddemek."),
      t("Hold a support, chest up, standing knee slightly bent.", "Tiens un appui, poitrine haute, jambe d'appui légèrement fléchie.", "شدّ في حاجة، صدرك مرفوع، والركبة اللي واقف عليها مطويّة شويّة.", "Chedd fi 7aja, sedrek marfou3, w rokba eli wa9ef 3liha matwiya chwaya."),
      t("Push the leg straight back by squeezing your glute.", "Pousse la jambe tendue en arrière en serrant le fessier.", "دزّ الساق ممدودة لتالي وانت تشدّ الفيسيي.", "Dezz sa9ek mamdouda lteli w enti tchedd el fessier."),
      t("Return slowly, no swinging.", "Reviens lentement, sans élan.", "ارجع بالشويّة، من غير دفعة.", "Erja3 bechwaya, men 8ir élan."),
    ],
    mistakes: [
      t("Arching the lower back to lift the leg higher.", "Cambrer le bas du dos pour monter la jambe plus haut.", "تكامبري ظهرك من لوطا باش تطلّع الساق أعلى.", "Tcambri dharek mel louta bech ttalla3 sa9ek a3la."),
      t("Leaning the torso far forward.", "Pencher fortement le buste en avant.", "تميل ببدنك برشا للقدّام.", "Tmil b badnek barcha l9oddem."),
    ],
    difficulty: 1,
    repRange: [12, 20],
    unilateral: true,
  },

  // ----- Lunge / single leg -----
  'Dumbbell_Rear_Lunge': {
    nameFr: "Fente arrière avec haltères",
    cues: [
      t("Take a big step back, torso tall.", "Fais un grand pas en arrière, buste droit.", "ارجع خطوة كبيرة لتالي، وبدنك مستقيم.", "Erja3 5atwa kbira lteli, w badnek mesta9im."),
      t("Lower until the back knee nearly touches the floor.", "Descends jusqu'à ce que le genou arrière frôle le sol.", "اهبط حتى الركبة اللي لتالي تقريب تمسّ القاعة.", "Ehbet 7atta rokba eli lteli ta9riban tmess el 9a3a."),
      t("Push through the front heel to return.", "Pousse dans le talon avant pour revenir.", "دزّ بكعبة الساق اللي قدّام باش ترجع.", "Dezz b ka3bet sa9ek eli 9oddem bech terja3."),
      t("No dumbbells? Do it bodyweight or wear a backpack.", "Pas d'haltères ? Fais-le au poids du corps ou avec un sac à dos.", "ما عندكش هالتيرات؟ اعملها بوزن بدنك ولا البس صاك.", "Ma 3andekch haltères? A3melha b poids el corps walla elbes sac."),
    ],
    mistakes: [
      t("Front knee caving inward.", "Genou avant qui rentre vers l'intérieur.", "الركبة اللي قدّام تدخل لداخل.", "Rokba eli 9oddem tod5ol ldekhel."),
      t("Feet in one line like on a tightrope.", "Pieds alignés comme sur un fil.", "ساقيك على خطّ واحد كيما تمشي على خيط.", "Sa9ik 3la 5att wa7ed kima temchi 3la 5it."),
    ],
    difficulty: 2,
    avoidIf: ['knees'],
    repRange: [8, 12],
    unilateral: true,
  },
  'Dumbbell_Step_Ups': {
    nameFr: "Step-up avec haltères",
    cues: [
      t("Use a stable box or bench at knee height or lower.", "Utilise une box ou un banc stable, à hauteur de genou maximum.", "استعمل بوكس ولا بانك ثابت، في طول ركبتك ولا أوطى.", "Esta3mel box walla banc thebet, 9add rokbtek walla awta."),
      t("Whole foot on the box, push through that heel.", "Pied entier sur la box, pousse dans ce talon.", "ساقك كاملة على البوكس، ودزّ بكعبتها.", "Sa9ek kamla 3al box, w dezz b ka3betha."),
      t("Stand tall at the top, then step down slowly.", "Redresse-toi en haut, puis redescends lentement.", "اوقف مستقيم الفوق، وبعد اهبط بالشويّة.", "O9ef mesta9im el fou9, ba3d ehbet bechwaya."),
    ],
    mistakes: [
      t("Pushing off the bottom foot to cheat.", "Pousser avec le pied au sol pour tricher.", "تدزّ بالساق اللي لوطا باش تغشّ.", "Tdezz b sa9ek eli louta bech t8ech."),
      t("Box so high your hip sinks below your knee.", "Box si haute que la hanche passe sous le genou.", "البوكس عالي برشا حتى جنبك يهبط تحت ركبتك.", "El box 3ali barcha 7atta jnebek yahbet ta7t rokbtek."),
    ],
    difficulty: 2,
    avoidIf: ['knees'],
    repRange: [8, 12],
    unilateral: true,
  },
  'Dumbbell_Lunges': {
    nameFr: "Fentes avant avec haltères",
    cues: [
      t("Step forward, then drop the back knee straight down.", "Avance d'un pas, puis descends le genou arrière à la verticale.", "اعمل خطوة للقدّام، وبعد هبّط الركبة اللي لتالي ديراكت للوطا.", "A3mel 5atwa l9oddem, ba3d habbet rokba eli lteli direct llouta."),
      t("Feet hip-width apart, like standing on train tracks.", "Pieds écartés largeur de hanches, comme sur des rails.", "ساقيك قدّ عرض جنابك، كيما واقف على سكّة تران.", "Sa9ik 9add 3ordh jnabek, kima wa9ef 3la sekket train."),
      t("Push through the front foot to step back.", "Pousse avec le pied avant pour revenir.", "دزّ بالساق اللي قدّام باش ترجع.", "Dezz b sa9ek eli 9oddem bech terja3."),
    ],
    mistakes: [
      t("Front heel lifting off the floor.", "Talon avant qui se soulève.", "كعبة الساق اللي قدّام تتنحّى من القاعة.", "Ka3bet sa9ek eli 9oddem tetna77a mel 9a3a."),
      t("Torso leaning far forward.", "Buste trop penché en avant.", "بدنك مايل برشا للقدّام.", "Badnek mayel barcha l9oddem."),
    ],
    difficulty: 2,
    avoidIf: ['knees'],
    repRange: [8, 12],
    unilateral: true,
  },
  'Smith_Single-Leg_Split_Squat': {
    nameFr: "Fente bulgare à la Smith machine",
    cues: [
      t("Bar on upper back, back foot resting on a bench behind you.", "Barre sur le haut du dos, pied arrière posé sur un banc.", "البار على ظهرك من الفوق، والساق اللي لتالي على بانك وراك.", "El barre 3la dharek mel fou9, w sa9ek eli lteli 3la banc wrak."),
      t("Front foot far enough that the knee stays over the foot.", "Pied avant assez loin pour que le genou reste au-dessus du pied.", "الساق اللي قدّام بعيدة بالقدر باش الركبة تبقى فوق الساق.", "Sa9ek eli 9oddem b3ida bel 9dar bech rokba tob9a fou9 sa9ek."),
      t("Lower straight down, push up through the front heel.", "Descends à la verticale, remonte en poussant le talon avant.", "اهبط ديراكت للوطا، واطلع وانت تدزّ بكعبة الساق اللي قدّام.", "Ehbet direct llouta, w etla3 w enti tdezz b ka3bet sa9ek eli 9oddem."),
    ],
    mistakes: [
      t("Front foot too close to the bench.", "Pied avant trop près du banc.", "الساق اللي قدّام قريبة برشا للبانك.", "Sa9ek eli 9oddem 9riba barcha lel banc."),
      t("Pushing with the back leg.", "Pousser avec la jambe arrière.", "تدزّ بالساق اللي لتالي.", "Tdezz b sa9ek eli lteli."),
    ],
    difficulty: 2,
    avoidIf: ['knees'],
    repRange: [8, 12],
    unilateral: true,
  },
  'Split_Squat_with_Dumbbells': {
    nameFr: "Fente bulgare avec haltères",
    cues: [
      t("Rear foot laces-down on a bench or chair behind you.", "Pied arrière posé, lacets vers le bas, sur un banc ou une chaise.", "ظهر ساقك اللي لتالي على بانك ولا كرسي وراك.", "Dhar sa9ek eli lteli 3la banc walla korsi wrak."),
      t("Drop the back knee straight down, torso tall.", "Descends le genou arrière à la verticale, buste droit.", "هبّط الركبة اللي لتالي ديراكت للوطا، وبدنك مستقيم.", "Habbet rokba eli lteli direct llouta, w badnek mesta9im."),
      t("Front knee follows your toes.", "Le genou avant suit la pointe du pied.", "الركبة اللي قدّام تتبع صوابع ساقك.", "Rokba eli 9oddem tetba3 swaba3 sa9ek."),
      t("Start bodyweight; add dumbbells or a backpack later.", "Commence au poids du corps, ajoute haltères ou sac à dos ensuite.", "ابدا بوزن بدنك، وبعد زيد هالتيرات ولا صاك.", "Ebda b poids el corps, ba3d zid haltères walla sac."),
    ],
    mistakes: [
      t("Hopping the front foot around to find balance.", "Sautiller avec le pied avant pour trouver l'équilibre.", "تنقّز بالساق اللي قدّام باش تلقى توازنك.", "Tna99ez b sa9ek eli 9oddem bech tal9a twezounek."),
      t("Rear support so high it strains the back hip.", "Support arrière si haut qu'il tire sur la hanche arrière.", "البانك اللي لتالي عالي برشا حتى يجبدلك جنبك اللي لتالي.", "El banc eli lteli 3ali barcha 7atta yejbedlek jnebek eli lteli."),
    ],
    difficulty: 2,
    avoidIf: ['knees'],
    repRange: [8, 12],
    unilateral: true,
  },
  'Step-up_with_Knee_Raise': {
    nameFr: "Step-up avec montée de genou",
    cues: [
      t("Use a low, stable step; knee height or lower.", "Utilise une marche basse et stable, hauteur de genou maximum.", "استعمل درجة وطيّة وثابتة، في طول ركبتك ولا أوطى.", "Esta3mel darja wtiya w thebta, 9add rokbtek walla awta."),
      t("Push through the heel on the step to stand up.", "Pousse dans le talon posé sur la marche pour monter.", "دزّ بالكعبة اللي على الدرجة باش تطلع.", "Dezz bel ka3ba eli 3al darja bech tetla3."),
      t("Drive the other knee up to hip height, then step down.", "Monte l'autre genou à hauteur de hanche, puis redescends.", "طلّع الركبة الأخرى لطول جنبك، وبعد اهبط.", "Tala3 rokba lo5ra l 9add jnebek, ba3d ehbet."),
      t("Knees sensitive? Use an even lower step.", "Genoux sensibles ? Prends une marche encore plus basse.", "ركايبك حسّاسين؟ استعمل درجة أوطى.", "Rkaybek 7assasin? Esta3mel darja awta."),
    ],
    mistakes: [
      t("Springing off the bottom foot.", "Prendre de l'élan avec le pied au sol.", "تنقّز بالساق اللي لوطا.", "Tna99ez b sa9ek eli louta."),
      t("Knee caving in as you step up.", "Genou qui rentre en montant.", "الركبة تدخل لداخل وانت تطلع.", "Rokba tod5ol ldekhel w enti tetla3."),
    ],
    difficulty: 1,
    repRange: [10, 15],
    unilateral: true,
  },
  'Bodyweight_Walking_Lunge': {
    nameFr: "Fentes marchées au poids du corps",
    cues: [
      t("Hands on hips, take a long step forward.", "Mains sur les hanches, fais un grand pas en avant.", "يدّيك على جنابك، واعمل خطوة طويلة للقدّام.", "Yeddik 3la jnabek, w a3mel 5atwa twila l9oddem."),
      t("Lower until the back knee almost touches the floor.", "Descends jusqu'à ce que le genou arrière frôle le sol.", "اهبط حتى الركبة اللي لتالي تقريب تمسّ القاعة.", "Ehbet 7atta rokba eli lteli ta9riban tmess el 9a3a."),
      t("Drive through the front heel and step into the next lunge.", "Pousse dans le talon avant et enchaîne la fente suivante.", "دزّ بكعبة الساق اللي قدّام وادخل في الفونت اللي بعدها.", "Dezz b ka3bet sa9ek eli 9oddem w od5ol fel fente eli ba3dha."),
    ],
    mistakes: [
      t("Steps too short, so the front heel lifts.", "Pas trop courts, le talon avant décolle.", "الخطوات قصار برشا، والكعبة اللي قدّام تتنحّى.", "El 5atwet 9sar barcha, w ka3ba eli 9oddem tetna77a."),
      t("Wobbling side to side.", "Tanguer de gauche à droite.", "تتمايل من جنب لجنب.", "Tetmayel men jneb l jneb."),
    ],
    difficulty: 1,
    avoidIf: ['knees'],
    repRange: [8, 12],
    unilateral: true,
  },

  // ----- Glute bridge -----
  'Barbell_Glute_Bridge': {
    nameFr: "Pont fessier avec barre",
    cues: [
      t("Roll the bar over your hips; use a pad or towel.", "Fais rouler la barre sur les hanches, avec un coussin ou une serviette.", "دحرج البار على جنابك، واستعمل كوسان ولا فوطة.", "Da7rej el barre 3la jnabek, w esta3mel coussin walla fouta."),
      t("Feet flat, knees bent, heels close to your butt.", "Pieds à plat, genoux pliés, talons proches des fesses.", "ساقيك لاصقين في القاعة، ركايبك مطويين، والكعبين قراب لجنابك.", "Sa9ik las9in fel 9a3a, rkaybek matwiyin, w ka3bik 9rab l jnabek."),
      t("Drive through your heels, squeeze glutes hard at the top.", "Pousse dans les talons, serre fort les fessiers en haut.", "دزّ بكعبيك، وشدّ الفيسيي بالقوّة الفوق.", "Dezz b ka3bik, w chedd les fessiers b 9owwa el fou9."),
      t("Ribs down: lift with the hips, not by arching.", "Côtes basses : monte avec les hanches, pas en cambrant.", "هبّط ضلوعك: اطلع بجنابك، موش وانت تكامبري.", "Habbet dhlou3ek: etla3 b jnabek, mouch w enti tcambri."),
    ],
    mistakes: [
      t("Over-arching the lower back at the top.", "Trop cambrer le bas du dos en haut.", "تكامبري ظهرك من لوطا برشا كي توصل الفوق.", "Tcambri dharek mel louta barcha ki tousel el fou9."),
      t("Pushing through the toes so the thighs take over.", "Pousser sur les orteils, les cuisses prennent le relais.", "تدزّ بصوابع ساقيك، والفخاذ ياخذو الخدمة.", "Tdezz b swaba3 sa9ik, w fkhadhek ya5dhou el 5edma."),
    ],
    difficulty: 2,
    repRange: [8, 12],
  },
  'Barbell_Hip_Thrust': {
    nameFr: "Hip thrust avec barre",
    cues: [
      t("Upper back on a bench edge, padded bar over your hips.", "Haut du dos sur le bord d'un banc, barre protégée sur les hanches.", "ظهرك من الفوق على طرف البانك، والبار بالكوسان على جنابك.", "Dharek mel fou9 3la terf el banc, w el barre bel coussin 3la jnabek."),
      t("Shins vertical at the top, chin slightly tucked.", "Tibias verticaux en haut, menton légèrement rentré.", "الكراعين واقفين الفوق، وذقنك مرجوع شويّة.", "Kra3ik wa9fin el fou9, w dh9onek marjou3 chwaya."),
      t("Drive hips up until your body is flat like a table.", "Monte les hanches jusqu'à former une table.", "طلّع جنابك حتى بدنك يولّي مستقيم كيما طاولة.", "Tala3 jnabek 7atta badnek ywalli mesta9im kima tawla."),
      t("Pause one second and squeeze your glutes.", "Marque une seconde en haut en serrant les fessiers.", "اصبر ثانية وشدّ الفيسيي.", "Osbor thanya w chedd les fessiers."),
    ],
    mistakes: [
      t("Arching the lower back instead of extending the hips.", "Cambrer le bas du dos au lieu d'ouvrir les hanches.", "تكامبري ظهرك من لوطا عوض ما تحلّ جنابك.", "Tcambri dharek mel louta 3oudh ma t7ell jnabek."),
      t("Feet too far away, so the hamstrings cramp.", "Pieds trop loin, l'arrière des cuisses crampe.", "ساقيك بعاد برشا، وتجيك كرومب في التالي متاع فخاذك.", "Sa9ik b3ad barcha, w tjik crampe fel ischios."),
      t("Bench sliding during the set.", "Banc qui glisse pendant la série.", "البانك يزلق في وسط السيري.", "El banc yezle9 fi wost série."),
    ],
    difficulty: 2,
    repRange: [8, 12],
  },
  'Butt_Lift_Bridge': {
    nameFr: "Pont fessier",
    cues: [
      t("Lie on your back, knees bent, feet flat hip-width apart.", "Sur le dos, genoux pliés, pieds à plat largeur de hanches.", "اتمدّ على ظهرك، ركايبك مطويين، وساقيك لاصقين في القاعة قدّ عرض جنابك.", "Etmadd 3la dharek, rkaybek matwiyin, w sa9ik las9in fel 9a3a 9add 3ordh jnabek."),
      t("Push through your heels to lift your hips.", "Pousse dans tes talons pour monter les hanches.", "دزّ بكعبيك باش تطلّع جنابك.", "Dezz b ka3bik bech ttalla3 jnabek."),
      t("Squeeze your glutes for one second at the top.", "Serre les fessiers une seconde en haut.", "شدّ الفيسيي ثانية الفوق.", "Chedd les fessiers thanya el fou9."),
      t("Want more? Rest a dumbbell or backpack on your hips.", "Envie de plus ? Pose un haltère ou un sac sur tes hanches.", "تحبّ أكثر؟ حطّ هالتير ولا صاك على جنابك.", "T7eb akther? 7ott haltère walla sac 3la jnabek."),
    ],
    mistakes: [
      t("Arching the back instead of using the glutes.", "Cambrer le dos au lieu d'utiliser les fessiers.", "تكامبري ظهرك عوض ما تخدم بالفيسيي.", "Tcambri dharek 3oudh ma te5dem bel fessiers."),
      t("Dropping down fast without control.", "Redescendre vite sans contrôle.", "تطيح بالزربة من غير كونترول.", "Tti7 bel zarba men 8ir contrôle."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },
  'Single_Leg_Glute_Bridge': {
    nameFr: "Pont fessier sur une jambe",
    cues: [
      t("One foot flat, other knee pulled toward your chest.", "Un pied au sol, l'autre genou ramené vers la poitrine.", "ساق لاصقة في القاعة، والركبة الأخرى مجبودة لصدرك.", "Sa9 las9a fel 9a3a, w rokba lo5ra majbouda l sedrek."),
      t("Push through the planted heel to raise your hips.", "Pousse dans le talon au sol pour monter les hanches.", "دزّ بالكعبة اللي في القاعة باش تطلّع جنابك.", "Dezz bel ka3ba eli fel 9a3a bech ttalla3 jnabek."),
      t("Keep hips level; don't let one side drop.", "Garde le bassin à l'horizontale, sans pencher d'un côté.", "خلّي جنابك مقادّين، ما تخلّيش جنب يطيح.", "5alli jnabek m9addin, ma t5allich jneb yti7."),
    ],
    mistakes: [
      t("Hips twisting or tilting.", "Bassin qui tourne ou penche.", "الجناب يدوّرو ولا يميلو.", "Jnabek ydawrou walla ymilou."),
      t("Pushing through the toes.", "Pousser sur les orteils.", "تدزّ بصوابع ساقك.", "Tdezz b swaba3 sa9ek."),
    ],
    difficulty: 1,
    repRange: [10, 15],
    unilateral: true,
  },
  'Thigh_Abductor': {
    nameFr: "Machine à abducteurs",
    cues: [
      t("Sit tall, pads on the outside of your knees.", "Assieds-toi droit, coussins à l'extérieur des genoux.", "اقعد مستقيم، والكوسانات على برّا ركايبك.", "O93ed mesta9im, w les coussins 3la barra rkaybek."),
      t("Push your legs apart smoothly, pause, return slowly.", "Écarte les jambes sans à-coup, pause, reviens lentement.", "حلّ ساقيك بلاش ضربات، اصبر، وارجع بالشويّة.", "7ell sa9ik blech dharbet, osbor, w erja3 bechwaya."),
      t("Lean slightly forward to feel your glutes more.", "Penche-toi un peu en avant pour mieux sentir les fessiers.", "ميّل شويّة للقدّام باش تحسّ الفيسيي أكثر.", "Mayyel chwaya l9oddem bech t7ess les fessiers akther."),
    ],
    mistakes: [
      t("Letting the weight stack slam back.", "Laisser les poids retomber brutalement.", "تخلّي الثقل يطيح بقوّة.", "T5alli les poids yti7ou b 9owwa."),
      t("Short, fast reps with momentum.", "Répétitions courtes et rapides avec élan.", "مرّات قصار وزربانين بالدفعة.", "Reps 9sar w zarbanin bel élan."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },
  'One-Legged_Cable_Kickback': {
    nameFr: "Kickback fessier à la poulie",
    cues: [
      t("Ankle strap on, face the machine, hold the frame.", "Sangle à la cheville, face à la machine, tiens le cadre.", "حطّ السانغل في مفصل ساقك، قابل الماشينة، وشدّ فيها.", "7ott la sangle fel cheville, 9abel el machine, w chedd fiha."),
      t("Kick the leg back and slightly up using your glute.", "Pousse la jambe en arrière et un peu vers le haut avec le fessier.", "دزّ الساق لتالي وشويّة للفوق بالفيسيي.", "Dezz sa9ek lteli w chwaya lfou9 bel fessier."),
      t("Keep abs tight so your back doesn't arch.", "Garde le ventre serré pour ne pas cambrer.", "خلّي كرشك مشدودة باش ظهرك ما يتكامبراش.", "5alli krochek mchedouda bech dharek ma yetcambrach."),
    ],
    mistakes: [
      t("Swinging the leg with momentum.", "Balancer la jambe avec élan.", "تمرجح الساق بالدفعة.", "Tmarja7 sa9ek bel élan."),
      t("Arching the lower back at the end.", "Cambrer le bas du dos en fin de mouvement.", "تكامبري ظهرك من لوطا في الآخر.", "Tcambri dharek mel louta fel e5er."),
    ],
    difficulty: 1,
    repRange: [12, 15],
    unilateral: true,
  },
  'Glute_Kickback': {
    nameFr: "Kickback fessier à quatre pattes",
    cues: [
      t("On all fours, hands under shoulders, knees under hips.", "À quatre pattes, mains sous les épaules, genoux sous les hanches.", "على ربعة، يدّيك تحت كتافك، وركايبك تحت جنابك.", "3la rab3a, yeddik ta7t ktefek, w rkaybek ta7t jnabek."),
      t("Keep the knee bent and press the heel toward the ceiling.", "Garde le genou plié et pousse le talon vers le plafond.", "خلّي الركبة مطويّة ودزّ الكعبة للسقف.", "5alli rokba matwiya w dezz el ka3ba lel sa9f."),
      t("Stop when your thigh lines up with your back.", "Arrête quand la cuisse est alignée avec le dos.", "وقّف كي فخذك يولّي على خطّ ظهرك.", "Wa99ef ki fakhdhek ywalli 3la 5att dharek."),
      t("Wrists sore? Rest on your forearms instead.", "Poignets sensibles ? Appuie-toi sur les avant-bras.", "مفاصل يدّيك يوجعوك؟ اتّكّى على ذراعيك.", "Les poignets ywaj3ouk? Tekka 3la dhra3ik."),
    ],
    mistakes: [
      t("Arching the back to kick higher.", "Cambrer le dos pour monter plus haut.", "تكامبري ظهرك باش تطلّع أعلى.", "Tcambri dharek bech ttalla3 a3la."),
      t("Rotating the hip open to the side.", "Ouvrir la hanche sur le côté.", "تدوّر جنبك وتحلّو على الجنب.", "Tdawwer jnebek w t7ellou 3al jneb."),
    ],
    difficulty: 1,
    repRange: [12, 20],
    unilateral: true,
  },
  'Hip_Lift_with_Band': {
    nameFr: "Pont fessier avec élastique",
    cues: [
      t("Band across your hips, ends pinned by your hands or heavy objects.", "Élastique sur les hanches, bouts tenus par les mains ou des objets lourds.", "اللاستيك على جنابك، وأطرافو مشدودة بيدّيك ولا بحوايج ثقال.", "L'élastique 3la jnabek, w atrafou mchedouda b yeddik walla b 7weyej th9al."),
      t("Feet flat, push through your heels into the band.", "Pieds à plat, pousse dans les talons contre l'élastique.", "ساقيك لاصقين في القاعة، ودزّ بكعبيك ضدّ اللاستيك.", "Sa9ik las9in fel 9a3a, w dezz b ka3bik dhed l'élastique."),
      t("Squeeze glutes at the top, then lower slowly.", "Serre les fessiers en haut, puis redescends lentement.", "شدّ الفيسيي الفوق، وبعد هبّط بالشويّة.", "Chedd les fessiers el fou9, ba3d habbet bechwaya."),
    ],
    mistakes: [
      t("Arching the back instead of lifting the hips.", "Cambrer le dos au lieu de monter les hanches.", "تكامبري ظهرك عوض ما تطلّع جنابك.", "Tcambri dharek 3oudh ma ttalla3 jnabek."),
      t("Band slipping off the hips.", "Élastique qui glisse des hanches.", "اللاستيك يزلق من على جنابك.", "L'élastique yezle9 men 3la jnabek."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },
  'Monster_Walk': {
    nameFr: "Marche du monstre (élastique)",
    cues: [
      t("Band around knees or ankles, slight squat position.", "Élastique aux genoux ou aux chevilles, en demi-squat.", "اللاستيك على ركايبك ولا مفاصل ساقيك، وانت في نصّ سكوات.", "L'élastique 3la rkaybek walla les chevilles, w enti f demi-squat."),
      t("Take small steps while keeping tension on the band.", "Fais de petits pas en gardant l'élastique tendu.", "اعمل خطوات صغار وخلّي اللاستيك ديما مشدود.", "A3mel 5atwet s8ar w 5alli l'élastique dima mchedoud."),
      t("Push knees out; never let your feet come together.", "Pousse les genoux vers l'extérieur, ne rapproche jamais les pieds.", "دزّ ركايبك لبرّا، وعمرك ما تلمّ ساقيك.", "Dezz rkaybek lbarra, w 3omrek ma tlemm sa9ik."),
    ],
    mistakes: [
      t("Standing up straight and losing tension.", "Se redresser complètement et perdre la tension.", "توقف مستقيم بالكلّ واللاستيك يرخى.", "To9ef mesta9im bel kol w l'élastique yer5a."),
      t("Waddling with the upper body.", "Se dandiner avec le haut du corps.", "تتمايل بالنصّ الفوقاني متاع بدنك.", "Tetmayel b ennoss el fou9ani mta3 badnek."),
    ],
    difficulty: 1,
    repRange: [10, 15],
    unilateral: true,
  },

  // ----- Horizontal push -----
  'Machine_Bench_Press': {
    nameFr: "Développé couché à la machine",
    cues: [
      t("Adjust the seat so handles line up with mid-chest.", "Règle le siège pour que les poignées soient à mi-poitrine.", "ريقل الكرسي باش البوانيات يجيو في وسط صدرك.", "Régli el korsi bech les poignées yjiw fi wost sedrek."),
      t("Shoulder blades pinched back against the pad.", "Omoplates serrées contre le dossier.", "لوحات كتافك ملمومين لتالي على الدوسي.", "Les omoplates mlemmin lteli 3al dossier."),
      t("Push the handles forward without locking elbows hard.", "Pousse les poignées devant sans verrouiller les coudes.", "دزّ البوانيات للقدّام من غير ما تبلوكي مرافقك بالقوّة.", "Dezz les poignées l9oddem men 8ir ma tbloki mrafe9ek b 9owwa."),
      t("Return slowly until you feel a chest stretch.", "Reviens lentement jusqu'à sentir l'étirement des pectoraux.", "ارجع بالشويّة حتى تحسّ صدرك يتمطّ.", "Erja3 bechwaya 7atta t7ess sedrek yetmatt."),
    ],
    mistakes: [
      t("Shoulders rolling forward off the pad.", "Épaules qui décollent du dossier vers l'avant.", "الكتاف يتنحّاو من الدوسي للقدّام.", "Ktefek yetna77aw mel dossier l9oddem."),
      t("Seat set too low or too high.", "Siège réglé trop bas ou trop haut.", "الكرسي مريقل وطي برشا ولا عالي برشا.", "El korsi mréglé wti barcha walla 3ali barcha."),
    ],
    difficulty: 1,
    repRange: [8, 12],
  },
  'Dumbbell_Bench_Press': {
    nameFr: "Développé couché aux haltères",
    cues: [
      t("Kick the dumbbells up from your knees as you lie back.", "Monte les haltères avec les genoux en t'allongeant.", "طلّع الهالتيرات بركايبك وانت تتمدّ.", "Tala3 les haltères b rkaybek w enti tetmadd."),
      t("Shoulder blades squeezed together, feet flat on the floor.", "Omoplates serrées, pieds à plat au sol.", "لوحات كتافك ملمومين، وساقيك لاصقين في القاعة.", "Les omoplates mlemmin, w sa9ik las9in fel 9a3a."),
      t("Lower to chest level, elbows about 45° from your body.", "Descends au niveau de la poitrine, coudes à environ 45° du corps.", "هبّط لطول صدرك، والمرافق تقريب 45° على بدنك.", "Habbet l 9add sedrek, w mrafe9ek ta9riban 45° 3la badnek."),
      t("Press up and slightly together.", "Pousse vers le haut en rapprochant légèrement les haltères.", "دزّ للفوق وقرّبهم شويّة لبعضهم.", "Dezz lfou9 w 9arrebhom chwaya l ba3dhhom."),
    ],
    mistakes: [
      t("Elbows flared straight out to the sides.", "Coudes écartés à angle droit du corps.", "المرافق محلولين على الجنب بالكلّ.", "Mrafe9ek ma7loulin 3al jneb bel kol."),
      t("Bouncing the weights at the bottom.", "Rebondir en bas du mouvement.", "تنقّز بالهالتيرات كي توصل لوطا.", "Tna99ez bel haltères ki tousel louta."),
      t("Dropping the dumbbells carelessly at the end.", "Lâcher les haltères n'importe comment à la fin.", "تطيّح الهالتيرات كيفما جات في الآخر.", "Ttayya7 les haltères kifma jet fel e5er."),
    ],
    difficulty: 2,
    repRange: [8, 12],
  },
  'Cable_Chest_Press': {
    nameFr: "Développé pectoraux à la poulie assis",
    cues: [
      t("Sit tall with the handles at chest height.", "Assieds-toi droit, poignées à hauteur de poitrine.", "اقعد مستقيم والبوانيات في طول صدرك.", "O93ed mesta9im w les poignées 9add sedrek."),
      t("Press forward and together, squeezing your chest.", "Pousse devant toi en rapprochant les mains, pectoraux serrés.", "دزّ للقدّام وقرّب يدّيك، وشدّ صدرك.", "Dezz l9oddem w 9arreb yeddik, w chedd sedrek."),
      t("Keep shoulder blades back throughout.", "Garde les omoplates en arrière tout du long.", "خلّي لوحات كتافك لتالي طول الحركة.", "5alli les omoplates lteli toul el 7arka."),
    ],
    mistakes: [
      t("Shoulders shrugging up toward the ears.", "Épaules qui montent vers les oreilles.", "الكتاف يطلعو لوذنيك.", "Ktefek yotl3ou l wednik."),
      t("Letting the handles pull the arms back too far.", "Laisser les poignées tirer les bras trop en arrière.", "تخلّي البوانيات يجبدو يدّيك لتالي برشا.", "T5alli les poignées yejbdou yeddik lteli barcha."),
    ],
    difficulty: 1,
    repRange: [8, 12],
  },
  'Dumbbell_Bench_Press_with_Neutral_Grip': {
    nameFr: "Développé couché haltères prise neutre",
    cues: [
      t("Palms face each other the whole time.", "Paumes face à face pendant tout le mouvement.", "كفوفك مقابلين بعضهم طول الحركة.", "Kfoufek m9ablin ba3dhhom toul el 7arka."),
      t("Elbows stay close, about 30° from your body.", "Coudes près du corps, environ 30°.", "المرافق قراب، تقريب 30° على بدنك.", "Mrafe9ek 9rab, ta9riban 30° 3la badnek."),
      t("Lower to chest level, then press straight up.", "Descends au niveau de la poitrine, puis pousse vers le haut.", "هبّط لطول صدرك، وبعد دزّ ديراكت للفوق.", "Habbet l 9add sedrek, ba3d dezz direct lfou9."),
    ],
    mistakes: [
      t("Banging the dumbbells together at the top.", "Entrechoquer les haltères en haut.", "تضرب الهالتيرات في بعضهم الفوق.", "Todhrob les haltères fi ba3dhhom el fou9."),
      t("Arching the back off the bench.", "Décoller le dos du banc en se cambrant.", "تكامبري ظهرك وتنحّيه من البانك.", "Tcambri dharek w tna77ih mel banc."),
    ],
    difficulty: 2,
    repRange: [8, 12],
  },
  'Barbell_Bench_Press_-_Medium_Grip': {
    nameFr: "Développé couché à la barre",
    cues: [
      t("Eyes under the bar, grip just wider than shoulders.", "Yeux sous la barre, mains un peu plus larges que les épaules.", "عينيك تحت البار، ويدّيك شويّة أعرض من كتافك.", "3inik ta7t el barre, w yeddik chwaya a3red men ktefek."),
      t("Squeeze shoulder blades and plant your feet before unracking.", "Serre les omoplates et ancre les pieds avant de décrocher.", "لمّ لوحات كتافك وثبّت ساقيك قبل ما تنحّي البار.", "Lemm les omoplates w thabbet sa9ik 9bal ma tna77i el barre."),
      t("Lower to the bottom of your chest, elbows about 45°.", "Descends vers le bas des pectoraux, coudes à environ 45°.", "هبّط لصدرك من لوطا، والمرافق تقريب 45°.", "Habbet l sedrek mel louta, w mrafe9ek ta9riban 45°."),
      t("Always use safety bars or a spotter.", "Utilise toujours des sécurités ou un partenaire.", "ديما استعمل بارات الحماية ولا واحد يعاونك.", "Dima esta3mel les sécurités walla wa7ed y3awnek."),
    ],
    mistakes: [
      t("Bouncing the bar off the chest.", "Faire rebondir la barre sur la poitrine.", "تنقّز البار على صدرك.", "Tna99ez el barre 3la sedrek."),
      t("Butt lifting off the bench.", "Fesses qui décollent du banc.", "الجناب يتنحّاو من البانك.", "Jnabek yetna77aw mel banc."),
      t("Wrists bent far back under the bar.", "Poignets trop cassés en arrière sous la barre.", "مفاصل يدّيك مطويين برشا لتالي تحت البار.", "Les poignets matwiyin barcha lteli ta7t el barre."),
    ],
    difficulty: 3,
    avoidIf: ['shoulders'],
    repRange: [6, 10],
  },
  'Pushups': {
    nameFr: "Pompes",
    cues: [
      t("Hands under shoulders, body straight from head to heels.", "Mains sous les épaules, corps droit de la tête aux talons.", "يدّيك تحت كتافك، وبدنك مستقيم من راسك لكعبيك.", "Yeddik ta7t ktefek, w badnek mesta9im men rassek l ka3bik."),
      t("Brace your stomach and squeeze glutes so hips don't sag.", "Gaine le ventre et serre les fessiers pour ne pas creuser.", "شدّ كرشك والفيسيي باش جنابك ما يطيحوش.", "Chedd krochek w les fessiers bech jnabek ma yti7ouch."),
      t("Lower your chest to a fist's height, elbows angled back.", "Descends la poitrine à un poing du sol, coudes vers l'arrière.", "هبّط صدرك حتى يقعد قدّ بونية على القاعة، والمرافق لتالي.", "Habbet sedrek 7atta yo93ed 9add bounya 3al 9a3a, w mrafe9ek lteli."),
      t("Wrists hurt? Use fists or push-up handles.", "Mal aux poignets ? Fais-les sur les poings ou des poignées.", "مفاصل يدّيك يوجعوك؟ اعملها على البونية ولا بالبوانيات.", "Les poignets ywaj3ouk? A3melha 3al bounya walla b poignées."),
    ],
    mistakes: [
      t("Hips sagging toward the floor.", "Hanches qui s'affaissent vers le sol.", "الجناب طايحين للقاعة.", "Jnabek tay7in lel 9a3a."),
      t("Elbows flared straight out.", "Coudes écartés à angle droit.", "المرافق محلولين لبرّا بالكلّ.", "Mrafe9ek ma7loulin lbarra bel kol."),
      t("Half reps where only the head dips.", "Demi-répétitions où seule la tête descend.", "نصّ مرّات وكان الراس اللي يهبط.", "Demi-reps w ken rassek eli yahbet."),
    ],
    difficulty: 2,
    avoidIf: ['wrists'],
    repRange: [6, 15],
  },
  'Dumbbell_Floor_Press': {
    nameFr: "Développé au sol avec haltères",
    cues: [
      t("Lie on the floor, knees bent, dumbbells over your chest.", "Allongé au sol, genoux pliés, haltères au-dessus de la poitrine.", "اتمدّ على القاعة، ركايبك مطويين، والهالتيرات فوق صدرك.", "Etmadd 3al 9a3a, rkaybek matwiyin, w les haltères fou9 sedrek."),
      t("Lower until your upper arms gently touch the floor.", "Descends jusqu'à ce que les bras touchent doucement le sol.", "هبّط حتى ذراعيك يمسّو القاعة بالشويّة.", "Habbet 7atta dhra3ik ymessou el 9a3a bechwaya."),
      t("Pause, then press up without bouncing.", "Marque une pause, puis pousse sans rebondir.", "اصبر شويّة، وبعد دزّ للفوق من غير ما تنقّز.", "Osbor chwaya, ba3d dezz lfou9 men 8ir ma tna99ez."),
    ],
    mistakes: [
      t("Slamming the elbows into the floor.", "Taper les coudes contre le sol.", "تضرب مرافقك في القاعة.", "Todhrob mrafe9ek fel 9a3a."),
      t("Elbows flared wide.", "Coudes trop écartés.", "المرافق محلولين برشا.", "Mrafe9ek ma7loulin barcha."),
    ],
    difficulty: 1,
    repRange: [8, 12],
  },
  'Incline_Push-Up': {
    nameFr: "Pompes inclinées (mains surélevées)",
    cues: [
      t("Hands on a sturdy table, counter or bench edge.", "Mains sur une table solide, un plan de travail ou un banc.", "يدّيك على طاولة صحيحة، كونطوار ولا طرف بانك.", "Yeddik 3la tawla s7i7a, comptoir walla terf banc."),
      t("Walk your feet back, body straight like a plank.", "Recule les pieds, corps gainé comme une planche.", "رجّع ساقيك لتالي، وبدنك مستقيم كيما البلانش.", "Rajja3 sa9ik lteli, w badnek mesta9im kima planche."),
      t("Lower your chest to the edge, then push away.", "Descends la poitrine vers le bord, puis repousse.", "هبّط صدرك للطرف، وبعد دزّ.", "Habbet sedrek lel terf, ba3d dezz."),
      t("Wrists sore? Grip the edge to keep them straight.", "Poignets sensibles ? Agrippe le bord pour les garder droits.", "مفاصل يدّيك يوجعوك؟ شدّ الطرف باش يبقاو مستقيمين.", "Les poignets ywaj3ouk? Chedd etterf bech yob9aw mesta9imin."),
    ],
    mistakes: [
      t("Using a table that can slide or tip.", "Utiliser une table qui glisse ou bascule.", "تستعمل طاولة تنجّم تزلق ولا تنقلب.", "Testa3mel tawla tnajjem tezle9 walla ten9leb."),
      t("Hips sticking up or sagging.", "Fesses trop hautes ou hanches qui s'affaissent.", "الجناب طالعين برشا ولا طايحين.", "Jnabek tal3in barcha walla tay7in."),
    ],
    difficulty: 1,
    repRange: [8, 15],
  },
  'Isometric_Wipers': {
    nameFr: "Pompes essuie-glace",
    cues: [
      t("Start in a wide push-up position.", "Pars en position de pompe, mains larges.", "ابدا في وضعية بومب ويدّيك محلولين بالعرض.", "Ebda f position pompe w yeddik ma7loulin bel 3ordh."),
      t("Shift your body toward one hand, bending that elbow.", "Décale ton corps vers une main en pliant ce coude.", "ميّل بدنك ليدّ وحدة، واطوي المرفق متاعها.", "Mayyel badnek l yed wa7da, w otwi el marfe9 mta3ha."),
      t("Push back to center, then go to the other side.", "Reviens au centre, puis pars de l'autre côté.", "ارجع للوسط، وبعد امشي للجنب الآخر.", "Erja3 lel wost, ba3d emchi lel jneb lo5or."),
    ],
    mistakes: [
      t("Hips sagging during the shift.", "Hanches qui s'affaissent pendant le transfert.", "الجناب يطيحو وانت تميل.", "Jnabek yti7ou w enti tmil."),
      t("Moving too fast with no control.", "Aller trop vite sans contrôle.", "تتحرّك بالزربة برشا من غير كونترول.", "Tet7arrek bel zarba barcha men 8ir contrôle."),
    ],
    difficulty: 3,
    avoidIf: ['wrists', 'shoulders'],
    repRange: [5, 10],
    unilateral: true,
  },
  'Bench_Press_-_With_Bands': {
    nameFr: "Développé couché avec élastique",
    cues: [
      t("Band under the bench, or behind your back on the floor.", "Élastique sous le banc, ou derrière ton dos au sol.", "اللاستيك تحت البانك، ولا من تالي ظهرك على القاعة.", "L'élastique ta7t el banc, walla men teli dharek 3al 9a3a."),
      t("Press the handles up from chest level, palms forward.", "Pousse les poignées depuis la poitrine, paumes vers l'avant.", "دزّ البوانيات للفوق من طول صدرك، والكفوف للقدّام.", "Dezz les poignées lfou9 men 9add sedrek, w kfoufek l9oddem."),
      t("Lower slowly until elbows reach 90°.", "Redescends lentement jusqu'à 90° aux coudes.", "هبّط بالشويّة حتى المرافق يوصلو لـ 90°.", "Habbet bechwaya 7atta mrafe9ek youslou l 90°."),
    ],
    mistakes: [
      t("Band slipping because it isn't secured.", "Élastique mal fixé qui glisse.", "اللاستيك يزلق خاطر موش مربوط مليح.", "L'élastique yezle9 5ater mouch marbout mli7."),
      t("Letting the band snap your arms down.", "Laisser l'élastique ramener les bras d'un coup.", "تخلّي اللاستيك يهبّط يدّيك بضربة.", "T5alli l'élastique yhabbet yeddik b dharba."),
    ],
    difficulty: 1,
    repRange: [10, 15],
  },

  // ----- Incline push -----
  'Leverage_Incline_Chest_Press': {
    nameFr: "Développé incliné à la machine",
    cues: [
      t("Set the seat so handles start near your upper chest.", "Règle le siège pour que les poignées partent du haut des pectoraux.", "ريقل الكرسي باش البوانيات يبداو قريب لصدرك من الفوق.", "Régli el korsi bech les poignées yebdew 9rib l sedrek mel fou9."),
      t("Chest up, shoulder blades back on the pad.", "Poitrine sortie, omoplates contre le dossier.", "صدرك مرفوع، ولوحات كتافك لتالي على الدوسي.", "Sedrek marfou3, w les omoplates lteli 3al dossier."),
      t("Press up and forward; return just short of the stops.", "Pousse vers le haut et l'avant, reviens sans reposer la charge.", "دزّ للفوق وللقدّام، وارجع من غير ما تحطّ الثقل.", "Dezz lfou9 w l9oddem, w erja3 men 8ir ma t7ott el charge."),
    ],
    mistakes: [
      t("Shoulders rolling forward at the top.", "Épaules qui s'enroulent en haut.", "الكتاف يتلفّو للقدّام الفوق.", "Ktefek yetleffou l9oddem el fou9."),
      t("Letting the weight crash down between reps.", "Laisser retomber la charge entre les répétitions.", "تخلّي الثقل يطيح بين المرّات.", "T5alli les poids yti7ou bin les reps."),
    ],
    difficulty: 1,
    repRange: [8, 12],
  },
  'Incline_Dumbbell_Press': {
    nameFr: "Développé incliné aux haltères",
    cues: [
      t("Bench at about 30°, not steeper.", "Banc incliné à environ 30°, pas plus.", "البانك تقريب 30°، موش أكثر.", "El banc ta9riban 30°, mouch akther."),
      t("Dumbbells start at upper chest, elbows slightly tucked.", "Haltères au haut de la poitrine, coudes légèrement rentrés.", "الهالتيرات يبداو من صدرك من الفوق، والمرافق ملمومين شويّة.", "Les haltères yebdew men sedrek mel fou9, w mrafe9ek mlemmin chwaya."),
      t("Press up over your upper chest, not over your face.", "Pousse au-dessus du haut de la poitrine, pas du visage.", "دزّ للفوق على خطّ صدرك من الفوق، موش وجهك.", "Dezz lfou9 3la 5att sedrek mel fou9, mouch wejhek."),
    ],
    mistakes: [
      t("Bench too steep, turning it into a shoulder press.", "Banc trop redressé, ça devient un développé épaules.", "البانك واقف برشا، ويولّي ديفلوبي كتاف.", "El banc wa9ef barcha, w ywalli développé épaules."),
      t("Arching the back to lift more.", "Se cambrer pour soulever plus.", "تكامبري ظهرك باش تهزّ أكثر.", "Tcambri dharek bech thezz akther."),
    ],
    difficulty: 2,
    repRange: [8, 12],
  },
  'Incline_Cable_Chest_Press': {
    nameFr: "Développé incliné à la poulie",
    cues: [
      t("Sit tall, handles starting at upper chest height.", "Assis bien droit, poignées au niveau du haut des pectoraux.", "اقعد مستقيم، والبوانيات يبداو في طول صدرك من الفوق.", "O93ed mesta9im, w les poignées yebdew 9add sedrek mel fou9."),
      t("Press up and together on a slight upward angle.", "Pousse en rapprochant les mains, légèrement vers le haut.", "دزّ وقرّب يدّيك، مايلين شويّة للفوق.", "Dezz w 9arreb yeddik, maylin chwaya lfou9."),
      t("Control the return and keep shoulders down.", "Contrôle le retour, épaules basses.", "ارجع بالشويّة وخلّي كتافك لوطا.", "Erja3 bechwaya w 5alli ktefek louta."),
    ],
    mistakes: [
      t("Shrugging the shoulders up.", "Hausser les épaules.", "تهزّ كتافك للفوق.", "Thezz ktefek lfou9."),
      t("Rushing the lowering phase.", "Bâcler la phase de descente.", "تزرب كي تهبّط.", "Tezreb ki thabbet."),
    ],
    difficulty: 1,
    repRange: [8, 12],
  },
  'Incline_Dumbbell_Bench_With_Palms_Facing_In': {
    nameFr: "Développé incliné haltères prise neutre",
    cues: [
      t("Bench at about 30°, palms facing each other.", "Banc à environ 30°, paumes face à face.", "البانك تقريب 30°، والكفوف مقابلين بعضهم.", "El banc ta9riban 30°, w kfoufek m9ablin ba3dhhom."),
      t("Elbows close to your body as you lower.", "Coudes près du corps en descendant.", "المرافق قراب لبدنك وانت تهبّط.", "Mrafe9ek 9rab l badnek w enti thabbet."),
      t("Press straight up over your upper chest.", "Pousse à la verticale au-dessus du haut des pectoraux.", "دزّ ديراكت للفوق على خطّ صدرك من الفوق.", "Dezz direct lfou9 3la 5att sedrek mel fou9."),
    ],
    mistakes: [
      t("Flaring the elbows and losing the neutral grip.", "Écarter les coudes et perdre la prise neutre.", "تحلّ مرافقك والكفوف ما عادش مقابلين بعضهم.", "T7ell mrafe9ek w tdhayya3 la prise neutre."),
      t("Lowering too fast.", "Descendre trop vite.", "تهبّط بالزربة برشا.", "Thabbet bel zarba barcha."),
    ],
    difficulty: 2,
    repRange: [8, 12],
  },
  'Smith_Machine_Incline_Bench_Press': {
    nameFr: "Développé incliné à la Smith machine",
    cues: [
      t("Bench at 30°, positioned so the bar meets your upper chest.", "Banc à 30°, placé pour que la barre arrive au haut des pectoraux.", "البانك على 30°، محطوط باش البار يجي على صدرك من الفوق.", "El banc 3la 30°, ma7tout bech el barre tji 3la sedrek mel fou9."),
      t("Grip slightly wider than shoulders, wrists straight.", "Mains un peu plus larges que les épaules, poignets droits.", "يدّيك شويّة أعرض من كتافك، ومفاصل يدّيك مستقيمين.", "Yeddik chwaya a3red men ktefek, w les poignets mesta9imin."),
      t("Set the safety stops just above your chest.", "Règle les sécurités juste au-dessus de ta poitrine.", "حطّ الحماية شويّة فوق صدرك.", "7ott les sécurités chwaya fou9 sedrek."),
    ],
    mistakes: [
      t("Bench placed so the bar comes down toward the neck.", "Banc mal placé, la barre descend vers le cou.", "البانك موش في بلاصتو، والبار يهبط لرقبتك.", "El banc mouch fi blastou, w el barre tahbet l ra9btek."),
      t("Elbows flared out at 90°.", "Coudes écartés à 90°.", "المرافق محلولين لبرّا على 90°.", "Mrafe9ek ma7loulin lbarra 3la 90°."),
    ],
    difficulty: 2,
    avoidIf: ['shoulders'],
    repRange: [8, 12],
  },
  'Barbell_Incline_Bench_Press_-_Medium_Grip': {
    nameFr: "Développé incliné à la barre",
    cues: [
      t("Bench at about 30°, eyes under the bar.", "Banc à environ 30°, yeux sous la barre.", "البانك تقريب 30°، وعينيك تحت البار.", "El banc ta9riban 30°, w 3inik ta7t el barre."),
      t("Shoulder blades squeezed, feet planted.", "Omoplates serrées, pieds bien ancrés.", "لوحات كتافك ملمومين، وساقيك ثابتين.", "Les omoplates mlemmin, w sa9ik thebtin."),
      t("Lower to your upper chest, press back up in a straight line.", "Descends au haut des pectoraux, remonte en ligne droite.", "هبّط لصدرك من الفوق، وطلّعو على خطّ مستقيم.", "Habbet l sedrek mel fou9, w tala3ha 3la 5att mesta9im."),
      t("Use safety bars or a spotter.", "Utilise des sécurités ou un partenaire.", "استعمل بارات الحماية ولا واحد يعاونك.", "Esta3mel les sécurités walla wa7ed y3awnek."),
    ],
    mistakes: [
      t("Bouncing the bar off the chest.", "Faire rebondir la barre sur la poitrine.", "تنقّز البار على صدرك.", "Tna99ez el barre 3la sedrek."),
      t("Lifting the hips off the bench.", "Décoller les fesses du banc.", "تنحّي جنابك من البانك.", "Tna77i jnabek mel banc."),
    ],
    difficulty: 3,
    avoidIf: ['shoulders'],
    repRange: [6, 10],
  },
  'Push-Ups_With_Feet_Elevated': {
    nameFr: "Pompes pieds surélevés",
    cues: [
      t("Feet on a chair or bench, hands on the floor.", "Pieds sur une chaise ou un banc, mains au sol.", "ساقيك على كرسي ولا بانك، ويدّيك في القاعة.", "Sa9ik 3la korsi walla banc, w yeddik fel 9a3a."),
      t("Keep a straight line from head to heels.", "Garde une ligne droite de la tête aux talons.", "خلّي بدنك خطّ مستقيم من راسك لكعبيك.", "5alli badnek 5att mesta9im men rassek l ka3bik."),
      t("Lower your upper chest toward the floor, then push up.", "Descends le haut de la poitrine vers le sol, puis pousse.", "هبّط صدرك من الفوق للقاعة، وبعد دزّ.", "Habbet sedrek mel fou9 lel 9a3a, ba3d dezz."),
      t("Higher feet make it harder; start low.", "Plus les pieds sont hauts, plus c'est dur : commence bas.", "كل ما ساقيك أعلى، كل ما أصعب: ابدا لوطا.", "Kol ma sa9ik a3la, kol ma as3ab: ebda louta."),
    ],
    mistakes: [
      t("Hips piking up or sagging.", "Fesses qui montent ou hanches qui s'affaissent.", "الجناب يطلعو للفوق ولا يطيحو.", "Jnabek yotl3ou lfou9 walla yti7ou."),
      t("Head dropping before the chest.", "La tête qui descend avant la poitrine.", "الراس يهبط قبل الصدر.", "Rassek yahbet 9bal sedrek."),
    ],
    difficulty: 2,
    avoidIf: ['wrists'],
    repRange: [6, 12],
  },
  'Decline_Push-Up': {
    nameFr: "Pompes déclinées",
    cues: [
      t("Feet on a box or bench, hands wider than shoulders.", "Pieds sur une box ou un banc, mains plus larges que les épaules.", "ساقيك على بوكس ولا بانك، ويدّيك أعرض من كتافك.", "Sa9ik 3la box walla banc, w yeddik a3red men ktefek."),
      t("Brace your core so your body stays in one line.", "Gaine le tronc pour garder le corps aligné.", "شدّ كرشك باش بدنك يبقى على خطّ واحد.", "Chedd krochek bech badnek yob9a 3la 5att wa7ed."),
      t("Lower until your nose nearly touches the floor.", "Descends jusqu'à ce que le nez frôle le sol.", "اهبط حتى خشمك تقريب يمسّ القاعة.", "Ehbet 7atta 5ochmek ta9riban ymess el 9a3a."),
      t("Wrists hurt? Use fists or push-up handles.", "Mal aux poignets ? Utilise les poings ou des poignées.", "مفاصل يدّيك يوجعوك؟ اعملها على البونية ولا بالبوانيات.", "Les poignets ywaj3ouk? A3melha 3al bounya walla b poignées."),
    ],
    mistakes: [
      t("Lower back sagging.", "Bas du dos qui se creuse.", "الظهر من لوطا يطيح.", "Dharek mel louta yti7."),
      t("Partial reps.", "Répétitions incomplètes.", "مرّات ناقصة.", "Reps na9sa."),
    ],
    difficulty: 2,
    avoidIf: ['wrists'],
    repRange: [6, 12],
  },

  // ----- Vertical push -----
  'Machine_Shoulder_Military_Press': {
    nameFr: "Développé épaules à la machine",
    cues: [
      t("Set the seat so handles start at shoulder level.", "Règle le siège pour que les poignées partent des épaules.", "ريقل الكرسي باش البوانيات يبداو في طول كتافك.", "Régli el korsi bech les poignées yebdew 9add ktefek."),
      t("Back flat against the pad, stomach braced.", "Dos collé au dossier, ventre gainé.", "ظهرك لاصق في الدوسي، وكرشك مشدودة.", "Dharek las9 fel dossier, w krochek mchedouda."),
      t("Press up without shrugging, lower with control.", "Pousse sans hausser les épaules, redescends en contrôle.", "دزّ للفوق من غير ما تهزّ كتافك، وهبّط بالشويّة.", "Dezz lfou9 men 8ir ma thezz ktefek, w habbet bechwaya."),
    ],
    mistakes: [
      t("Arching the back off the pad.", "Décoller le dos en se cambrant.", "تكامبري ظهرك وتنحّيه من الدوسي.", "Tcambri dharek w tna77ih mel dossier."),
      t("Locking out with a jerk.", "Verrouiller les bras d'un coup sec.", "تبلوكي يدّيك بضربة.", "Tbloki yeddik b dharba."),
    ],
    difficulty: 1,
    repRange: [8, 12],
  },
  'Seated_Dumbbell_Press': {
    nameFr: "Développé épaules assis aux haltères",
    cues: [
      t("Bench upright; kick the dumbbells up from your thighs.", "Banc droit, monte les haltères avec l'aide des cuisses.", "البانك واقف، وطلّع الهالتيرات بفخاذك.", "El banc wa9ef, w tala3 les haltères b fkhadhek."),
      t("Start at ear level, elbows slightly in front of you.", "Pars à hauteur des oreilles, coudes un peu devant toi.", "ابدا من طول وذنيك، والمرافق شويّة قدّامك.", "Ebda men 9add wednik, w mrafe9ek chwaya 9oddemek."),
      t("Press up until arms are straight, without clanking.", "Pousse jusqu'à bras tendus, sans entrechoquer.", "دزّ للفوق حتى يدّيك يتمدّو، من غير ما تضرب الهالتيرات.", "Dezz lfou9 7atta yeddik yetmaddou, men 8ir ma todhrob les haltères."),
      t("Keep ribs down; don't lean back.", "Côtes basses, ne te penche pas en arrière.", "هبّط ضلوعك، وما تميلش لتالي.", "Habbet dhlou3ek, w ma tmilch lteli."),
    ],
    mistakes: [
      t("Arching the lower back to push.", "Cambrer le bas du dos pour pousser.", "تكامبري ظهرك من لوطا باش تدزّ.", "Tcambri dharek mel louta bech tdezz."),
      t("Lowering only halfway.", "Ne redescendre qu'à moitié.", "تهبّط كان للنصّ.", "Thabbet ken lennoss."),
    ],
    difficulty: 2,
    repRange: [8, 12],
  },
  'Seated_Cable_Shoulder_Press': {
    nameFr: "Développé épaules à la poulie assis",
    cues: [
      t("Sit tall, handles beside your shoulders, elbows at 90°.", "Assis droit, poignées près des épaules, coudes à 90°.", "اقعد مستقيم، البوانيات حذا كتافك، والمرافق على 90°.", "O93ed mesta9im, les poignées 7dhe ktefek, w mrafe9ek 3la 90°."),
      t("Press up and slightly together.", "Pousse vers le haut en rapprochant légèrement les mains.", "دزّ للفوق وقرّب يدّيك شويّة.", "Dezz lfou9 w 9arreb yeddik chwaya."),
      t("Lower slowly back to shoulder height.", "Redescends lentement à hauteur d'épaules.", "هبّط بالشويّة لطول كتافك.", "Habbet bechwaya l 9add ktefek."),
    ],
    mistakes: [
      t("Shrugging the shoulders to the ears.", "Hausser les épaules vers les oreilles.", "تهزّ كتافك لوذنيك.", "Thezz ktefek l wednik."),
      t("Leaning back to finish the rep.", "Se pencher en arrière pour finir la répétition.", "تميل لتالي باش تكمّل المرّة.", "Tmil lteli bech tkammel el rep."),
    ],
    difficulty: 1,
    repRange: [8, 12],
  },
  'Standing_Palms-In_Dumbbell_Press': {
    nameFr: "Développé épaules debout prise neutre",
    cues: [
      t("Palms face each other, elbows pointing forward.", "Paumes face à face, coudes vers l'avant.", "كفوفك مقابلين بعضهم، والمرافق للقدّام.", "Kfoufek m9ablin ba3dhhom, w mrafe9ek l9oddem."),
      t("Squeeze glutes and abs to stay stacked.", "Serre fessiers et abdos pour rester bien aligné.", "شدّ الفيسيي وكرشك باش تبقى مستقيم.", "Chedd les fessiers w krochek bech tob9a mesta9im."),
      t("Press straight up, finishing with biceps near your ears.", "Pousse à la verticale, biceps près des oreilles en haut.", "دزّ ديراكت للفوق، وكمّل والبيسبس قريب لوذنيك.", "Dezz direct lfou9, w kammel w les biceps 9rib l wednik."),
    ],
    mistakes: [
      t("Leaning back as the set gets hard.", "Se pencher en arrière quand ça devient dur.", "تميل لتالي كي السيري تولّي صعيبة.", "Tmil lteli ki série twalli s3iba."),
      t("Using the legs to bounce the weight.", "Utiliser les jambes pour donner de l'élan.", "تستعمل ساقيك باش تعطي دفعة للثقل.", "Testa3mel sa9ik bech ta3ti élan lel charge."),
    ],
    difficulty: 2,
    repRange: [8, 12],
  },
  'Standing_Military_Press': {
    nameFr: "Développé militaire debout (barre)",
    cues: [
      t("Bar on your front shoulders, grip just outside them.", "Barre sur l'avant des épaules, mains juste à l'extérieur.", "البار على كتافك من قدّام، ويدّيك شويّة لبرّا منهم.", "El barre 3la ktefek men 9oddem, w yeddik chwaya lbarra menhom."),
      t("Squeeze glutes and brace so you don't lean back.", "Serre fessiers et abdos pour ne pas te cambrer.", "شدّ الفيسيي وكرشك باش ما تميلش لتالي.", "Chedd les fessiers w krochek bech ma tmilch lteli."),
      t("Tilt your head back slightly, press the bar straight up.", "Recule un peu la tête, pousse la barre à la verticale.", "رجّع راسك شويّة لتالي، ودزّ البار ديراكت للفوق.", "Rajja3 rassek chwaya lteli, w dezz el barre direct lfou9."),
      t("Finish with the bar over the middle of your feet.", "Termine avec la barre au-dessus du milieu des pieds.", "كمّل والبار فوق وسط ساقيك.", "Kammel w el barre fou9 wost sa9ik."),
    ],
    mistakes: [
      t("Over-arching the lower back.", "Trop cambrer le bas du dos.", "تكامبري ظهرك من لوطا برشا.", "Tcambri dharek mel louta barcha."),
      t("Pushing the bar out in front of the body.", "Pousser la barre trop en avant du corps.", "تدزّ البار برشا قدّام بدنك.", "Tdezz el barre barcha 9oddem badnek."),
    ],
    difficulty: 3,
    avoidIf: ['shoulders', 'lower_back'],
    repRange: [6, 10],
  },
  'Standing_Dumbbell_Press': {
    nameFr: "Développé épaules debout aux haltères",
    cues: [
      t("Dumbbells at head height, elbows out at about 90°.", "Haltères à hauteur de tête, coudes écartés à environ 90°.", "الهالتيرات في طول راسك، والمرافق لبرّا تقريب 90°.", "Les haltères 9add rassek, w mrafe9ek lbarra ta9riban 90°."),
      t("Brace your stomach and squeeze your glutes.", "Gaine le ventre et serre les fessiers.", "شدّ كرشك وشدّ الفيسيي.", "Chedd krochek w chedd les fessiers."),
      t("Press up without leaning back or using your legs.", "Pousse sans te pencher en arrière ni utiliser les jambes.", "دزّ للفوق من غير ما تميل لتالي ولا تستعمل ساقيك.", "Dezz lfou9 men 8ir ma tmil lteli walla testa3mel sa9ik."),
    ],
    mistakes: [
      t("Bending the knees to bounce the weights up.", "Plier les genoux pour faire rebondir les poids.", "تطوي ركايبك باش تنقّز الهالتيرات للفوق.", "Totwi rkaybek bech tna99ez les haltères lfou9."),
      t("Lowering only to forehead height.", "Redescendre seulement au niveau du front.", "تهبّط كان لطول جبينك.", "Thabbet ken l 9add jbinek."),
    ],
    difficulty: 2,
    repRange: [8, 12],
  },
  'Standing_Alternating_Dumbbell_Press': {
    nameFr: "Développé épaules alterné debout",
    cues: [
      t("Both dumbbells at your shoulders, palms forward.", "Deux haltères aux épaules, paumes vers l'avant.", "الزوز هالتيرات على كتافك، والكفوف للقدّام.", "Ezzouz haltères 3la ktefek, w kfoufek l9oddem."),
      t("Press one arm up while the other stays still.", "Pousse un bras pendant que l'autre reste immobile.", "دزّ يدّ للفوق والأخرى تبقى ثابتة.", "Dezz yed lfou9 w lo5ra tob9a thebta."),
      t("Don't lean sideways; keep your torso stacked.", "Ne penche pas sur le côté, garde le buste aligné.", "ما تميلش على جنب، وخلّي بدنك مستقيم.", "Ma tmilch 3la jneb, w 5alli badnek mesta9im."),
    ],
    mistakes: [
      t("Leaning away from the pressing arm.", "Se pencher à l'opposé du bras qui pousse.", "تميل بعيد على اليدّ اللي تدزّ.", "Tmil b3id 3al yed eli tdezz."),
      t("Letting the resting arm drift down.", "Laisser le bras au repos descendre.", "تخلّي اليدّ اللي مرتاحة تهبط.", "T5alli el yed eli merte7a tahbet."),
    ],
    difficulty: 1,
    repRange: [8, 12],
    unilateral: true,
  },
  'Arnold_Dumbbell_Press': {
    nameFr: "Développé Arnold",
    cues: [
      t("Start with palms facing you at chin height.", "Pars paumes vers toi, à hauteur du menton.", "ابدا والكفوف مقابلينك، في طول ذقنك.", "Ebda w kfoufek m9ablinek, 9add dh9onek."),
      t("Rotate palms forward as you press up.", "Tourne les paumes vers l'avant en poussant.", "دوّر الكفوف للقدّام وانت تدزّ للفوق.", "Dawwer kfoufek l9oddem w enti tdezz lfou9."),
      t("Reverse the rotation slowly on the way down.", "Inverse la rotation lentement en redescendant.", "اعكس الدورة بالشويّة وانت تهبّط.", "A3kes eddawra bechwaya w enti thabbet."),
    ],
    mistakes: [
      t("Rushing the rotation with momentum.", "Faire la rotation trop vite avec élan.", "تدوّر بالزربة وبالدفعة.", "Tdawwer bel zarba w bel élan."),
      t("Arching the back to finish.", "Se cambrer pour finir.", "تكامبري ظهرك باش تكمّل.", "Tcambri dharek bech tkammel."),
    ],
    difficulty: 2,
    avoidIf: ['shoulders'],
    repRange: [8, 12],
  },
  'Shoulder_Press_-_With_Bands': {
    nameFr: "Développé épaules avec élastique",
    cues: [
      t("Stand on the band, handles at shoulder height.", "Debout sur l'élastique, poignées à hauteur d'épaules.", "اوقف على اللاستيك، والبوانيات في طول كتافك.", "O9ef 3al élastique, w les poignées 9add ktefek."),
      t("Squeeze glutes and abs, press straight up.", "Serre fessiers et abdos, pousse à la verticale.", "شدّ الفيسيي وكرشك، ودزّ ديراكت للفوق.", "Chedd les fessiers w krochek, w dezz direct lfou9."),
      t("Lower slowly; don't let the band pull you down.", "Redescends lentement, ne te laisse pas tirer par l'élastique.", "هبّط بالشويّة، ما تخلّيش اللاستيك يجبدك.", "Habbet bechwaya, ma t5allich l'élastique yejbdek."),
    ],
    mistakes: [
      t("Leaning back as you press.", "Se pencher en arrière en poussant.", "تميل لتالي وانت تدزّ.", "Tmil lteli w enti tdezz."),
      t("Feet too narrow, so the band rolls.", "Pieds trop serrés, l'élastique roule.", "ساقيك قراب برشا لبعضهم، واللاستيك يتلفّ.", "Sa9ik 9rab barcha l ba3dhhom, w l'élastique yetleff."),
    ],
    difficulty: 1,
    repRange: [10, 15],
  },

  // ----- Horizontal pull -----
  'Seated_Cable_Rows': {
    nameFr: "Tirage horizontal assis à la poulie",
    cues: [
      t("Sit tall, knees soft, chest up.", "Assis droit, genoux souples, poitrine haute.", "اقعد مستقيم، ركايبك مطويين شويّة، وصدرك مرفوع.", "O93ed mesta9im, rkaybek matwiyin chwaya, w sedrek marfou3."),
      t("Pull the handle to your belly, elbows close to your sides.", "Tire la poignée vers le nombril, coudes près du corps.", "اجبد البوانيّة لكرشك، والمرافق لاصقين لجنبك.", "Ejbed la poignée l krochek, w mrafe9ek las9in l jnebek."),
      t("Squeeze your shoulder blades, then return slowly.", "Serre les omoplates, puis reviens lentement.", "لمّ لوحات كتافك، وبعد ارجع بالشويّة.", "Lemm les omoplates, ba3d erja3 bechwaya."),
    ],
    mistakes: [
      t("Rocking the torso back and forth.", "Balancer le buste d'avant en arrière.", "تمرجح بدنك لقدّام ولتالي.", "Tmarja7 badnek l9oddem w lteli."),
      t("Shrugging the shoulders up.", "Hausser les épaules.", "تهزّ كتافك للفوق.", "Thezz ktefek lfou9."),
      t("Rounding the back on the return.", "Arrondir le dos au retour.", "تقوّس ظهرك وانت ترجع.", "T9awwes dharek w enti terja3."),
    ],
    difficulty: 1,
    repRange: [8, 12],
  },
  'Leverage_Iso_Row': {
    nameFr: "Rowing à la machine",
    cues: [
      t("Adjust the seat so handles are at chest level.", "Règle le siège pour avoir les poignées à hauteur de poitrine.", "ريقل الكرسي باش البوانيات يجيو في طول صدرك.", "Régli el korsi bech les poignées yjiw 9add sedrek."),
      t("Chest on the pad, pull your elbows straight back.", "Poitrine contre le coussin, tire les coudes vers l'arrière.", "صدرك على الكوسان، واجبد مرافقك ديراكت لتالي.", "Sedrek 3al coussin, w ejbed mrafe9ek direct lteli."),
      t("Pause and squeeze your shoulder blades.", "Marque une pause en serrant les omoplates.", "اصبر شويّة ولمّ لوحات كتافك.", "Osbor chwaya w lemm les omoplates."),
    ],
    mistakes: [
      t("Pulling with the hands instead of the elbows.", "Tirer avec les mains au lieu des coudes.", "تجبد بيدّيك عوض المرافق.", "Tejbed b yeddik 3oudh mrafe9ek."),
      t("Leaning back off the chest pad.", "Décoller la poitrine du coussin.", "تميل لتالي وتنحّي صدرك من الكوسان.", "Tmil lteli w tna77i sedrek mel coussin."),
    ],
    difficulty: 1,
    repRange: [8, 12],
  },
  'Dumbbell_Incline_Row': {
    nameFr: "Rowing haltères sur banc incliné",
    cues: [
      t("Lie chest-down on an incline bench, arms hanging.", "Allongé poitrine contre un banc incliné, bras pendants.", "اتمدّ بصدرك على بانك مايل، ويدّيك مدلّيين.", "Etmadd b sedrek 3la banc incliné, w yeddik mdalyin."),
      t("Row the dumbbells to your sides, palms facing in.", "Tire les haltères vers tes flancs, paumes vers l'intérieur.", "اجبد الهالتيرات لجنبك، والكفوف لداخل.", "Ejbed les haltères l jnebek, w kfoufek ldekhel."),
      t("Keep your chest glued to the pad.", "Garde la poitrine collée au banc.", "خلّي صدرك لاصق في البانك.", "5alli sedrek las9 fel banc."),
    ],
    mistakes: [
      t("Lifting the chest off the bench to cheat.", "Décoller la poitrine pour tricher.", "تنحّي صدرك من البانك باش تغشّ.", "Tna77i sedrek mel banc bech t8ech."),
      t("Shrugging instead of rowing.", "Hausser les épaules au lieu de tirer.", "تهزّ كتافك عوض ما تجبد.", "Thezz ktefek 3oudh ma tejbed."),
    ],
    difficulty: 1,
    repRange: [8, 12],
  },
  'One-Arm_Dumbbell_Row': {
    nameFr: "Rowing unilatéral avec haltère",
    cues: [
      t("One hand and one knee on a bench, back flat.", "Une main et un genou sur un banc, dos plat.", "يدّ وركبة على البانك، وظهرك مستقيم.", "Yed w rokba 3al banc, w dharek mesta9im."),
      t("Pull the weight toward your hip, not your shoulder.", "Tire le poids vers ta hanche, pas vers l'épaule.", "اجبد الثقل لجنبك، موش لكتفك.", "Ejbed el poids l jnebek, mouch l ktefek."),
      t("Lower until your arm is straight and the shoulder stretches.", "Redescends bras tendu en laissant l'épaule s'étirer.", "هبّط حتى يدّك تتمدّ والكتف يتمطّ.", "Habbet 7atta yeddek tetmadd w ktefek yetmatt."),
      t("No dumbbell? Row a loaded backpack.", "Pas d'haltère ? Tire un sac à dos chargé.", "ما عندكش هالتير؟ اجبد صاك معبّي.", "Ma 3andekch haltère? Ejbed sac m3abbi."),
    ],
    mistakes: [
      t("Twisting the torso to heave the weight up.", "Tourner le buste pour arracher le poids.", "تلوّي بدنك باش تهزّ الثقل.", "Tlawwi badnek bech thezz el poids."),
      t("Rounding the back.", "Arrondir le dos.", "تقوّس ظهرك.", "T9awwes dharek."),
    ],
    difficulty: 1,
    repRange: [8, 12],
    unilateral: true,
  },
  'T-Bar_Row_with_Handle': {
    nameFr: "Rowing T-bar",
    cues: [
      t("Straddle the bar and hinge forward with a flat back.", "Jambes de chaque côté de la barre, penché en avant, dos plat.", "حطّ البار بين ساقيك وميّل للقدّام بظهر مستقيم.", "7ott el barre bin sa9ik w mayyel l9oddem b dhar mesta9im."),
      t("Pull the handle to your lower chest.", "Tire la poignée vers le bas de la poitrine.", "اجبد البوانيّة لصدرك من لوطا.", "Ejbed la poignée l sedrek mel louta."),
      t("Keep the same torso angle throughout.", "Garde le même angle de buste tout du long.", "خلّي بدنك على نفس الميلة طول الحركة.", "5alli badnek 3la nafs el mila toul el 7arka."),
    ],
    mistakes: [
      t("Standing up as you pull.", "Se redresser en tirant.", "توقف وانت تجبد.", "To9ef w enti tejbed."),
      t("Rounding the back under load.", "Arrondir le dos sous la charge.", "تقوّس ظهرك تحت الثقل.", "T9awwes dharek ta7t el charge."),
    ],
    difficulty: 2,
    avoidIf: ['lower_back'],
    repRange: [6, 10],
  },
  'Bent_Over_Barbell_Row': {
    nameFr: "Rowing barre buste penché",
    cues: [
      t("Hinge until your torso is near 45°, back flat.", "Penche-toi à environ 45°, dos plat.", "ميّل حتى بدنك يقرب لـ 45°، وظهرك مستقيم.", "Mayyel 7atta badnek y9arreb l 45°, w dharek mesta9im."),
      t("Pull the bar to your belly button.", "Tire la barre vers le nombril.", "اجبد البار لصرّتك.", "Ejbed el barre l sorrtek."),
      t("Elbows go back, shoulder blades squeeze.", "Les coudes partent en arrière, les omoplates se serrent.", "المرافق يمشيو لتالي، ولوحات الكتاف يتلمّو.", "Mrafe9ek yemchiw lteli, w les omoplates yetlammou."),
      t("Lower under control and stay braced.", "Redescends en contrôle en restant gainé.", "هبّط بالشويّة وخلّي كرشك مشدودة.", "Habbet bechwaya w 5alli krochek mchedouda."),
    ],
    mistakes: [
      t("Jerking the bar up with the hips.", "Donner un coup de hanches pour monter la barre.", "تطلّع البار بضربة جناب.", "Ttalla3 el barre b dharbet jnab."),
      t("Rounding the lower back.", "Arrondir le bas du dos.", "تقوّس ظهرك من لوطا.", "T9awwes dharek mel louta."),
    ],
    difficulty: 3,
    avoidIf: ['lower_back'],
    repRange: [6, 10],
  },
  'Bent_Over_Two-Dumbbell_Row_With_Palms_In': {
    nameFr: "Rowing haltères buste penché prise neutre",
    cues: [
      t("Hinge forward, back flat, palms facing each other.", "Penche-toi, dos plat, paumes face à face.", "ميّل للقدّام، ظهرك مستقيم، والكفوف مقابلين بعضهم.", "Mayyel l9oddem, dharek mesta9im, w kfoufek m9ablin ba3dhhom."),
      t("Row both dumbbells toward your hips.", "Tire les deux haltères vers les hanches.", "اجبد الزوز هالتيرات لجنابك.", "Ejbed ezzouz haltères l jnabek."),
      t("Keep your neck neutral, eyes on the floor.", "Garde la nuque neutre, regard vers le sol.", "خلّي رقبتك مستقيمة، وعينيك في القاعة.", "5alli ra9btek mesta9ima, w 3inik fel 9a3a."),
    ],
    mistakes: [
      t("Standing up a little more each rep.", "Se redresser un peu plus à chaque répétition.", "توقف شويّة أكثر في كل مرّة.", "To9ef chwaya akther f kol rep."),
      t("Rounding the back.", "Arrondir le dos.", "تقوّس ظهرك.", "T9awwes dharek."),
    ],
    difficulty: 2,
    avoidIf: ['lower_back'],
    repRange: [8, 12],
  },
  'Bent_Over_Two-Dumbbell_Row': {
    nameFr: "Rowing haltères buste penché",
    cues: [
      t("Hinge forward with soft knees and a flat back.", "Penche-toi genoux souples, dos plat.", "ميّل للقدّام، ركايبك مطويين شويّة وظهرك مستقيم.", "Mayyel l9oddem, rkaybek matwiyin chwaya w dharek mesta9im."),
      t("Pull elbows back, dumbbells toward your lower ribs.", "Tire les coudes en arrière, haltères vers les côtes basses.", "اجبد مرافقك لتالي، والهالتيرات لضلوعك من لوطا.", "Ejbed mrafe9ek lteli, w les haltères l dhlou3ek mel louta."),
      t("Squeeze your shoulder blades at the top.", "Serre les omoplates en haut.", "لمّ لوحات كتافك الفوق.", "Lemm les omoplates el fou9."),
    ],
    mistakes: [
      t("Jerking the weights with the body.", "Donner des à-coups avec le corps.", "تهزّ الهالتيرات بضربات ببدنك.", "Thezz les haltères b dharbet b badnek."),
      t("Rounding the lower back.", "Arrondir le bas du dos.", "تقوّس ظهرك من لوطا.", "T9awwes dharek mel louta."),
    ],
    difficulty: 2,
    avoidIf: ['lower_back'],
    repRange: [8, 12],
  },
  'Inverted_Row': {
    nameFr: "Rowing inversé (sous une table)",
    cues: [
      t("Lie under a sturdy table or low bar and grip the edge.", "Allonge-toi sous une table solide ou une barre basse, saisis le bord.", "اتمدّ تحت طاولة صحيحة ولا بار وطيّة، وشدّ الطرف.", "Etmadd ta7t tawla s7i7a walla barre wtiya, w chedd etterf."),
      t("Body straight, heels on the floor.", "Corps droit, talons au sol.", "بدنك مستقيم، وكعبيك في القاعة.", "Badnek mesta9im, w ka3bik fel 9a3a."),
      t("Pull your chest up to your hands, squeeze shoulder blades.", "Tire ta poitrine vers tes mains, serre les omoplates.", "اجبد صدرك ليدّيك، ولمّ لوحات كتافك.", "Ejbed sedrek l yeddik, w lemm les omoplates."),
      t("Too hard? Bend your knees.", "Trop dur ? Plie les genoux.", "صعيبة برشا؟ اطوي ركايبك.", "S3iba barcha? Otwi rkaybek."),
    ],
    mistakes: [
      t("Using a table that can tip over.", "Utiliser une table qui peut basculer.", "تستعمل طاولة تنجّم تنقلب.", "Testa3mel tawla tnajjem ten9leb."),
      t("Hips sagging toward the floor.", "Hanches qui tombent vers le sol.", "الجناب طايحين للقاعة.", "Jnabek tay7in lel 9a3a."),
    ],
    difficulty: 2,
    repRange: [6, 12],
  },
  'Suspended_Row': {
    nameFr: "Rowing avec sangles",
    cues: [
      t("Use straps, or a towel looped around a sturdy pole.", "Utilise des sangles, ou une serviette autour d'un poteau solide.", "استعمل سانغلات، ولا فوطة ملفوفة على عمود صحيح.", "Esta3mel des sangles, walla fouta malfoufa 3la 3moud s7i7."),
      t("Lean back with straight arms, body in one line.", "Penche-toi en arrière bras tendus, corps aligné.", "ميّل لتالي ويدّيك ممدودين، وبدنك على خطّ واحد.", "Mayyel lteli w yeddik mamdoudin, w badnek 3la 5att wa7ed."),
      t("Pull your chest to your hands, elbows close.", "Tire ta poitrine vers tes mains, coudes près du corps.", "اجبد صدرك ليدّيك، والمرافق قراب.", "Ejbed sedrek l yeddik, w mrafe9ek 9rab."),
      t("Walk your feet forward to make it harder.", "Avance les pieds pour rendre l'exercice plus dur.", "قدّم ساقيك باش تولّي أصعب.", "9addem sa9ik bech twalli as3ab."),
    ],
    mistakes: [
      t("Hips dropping back.", "Fesses qui partent en arrière.", "الجناب يطيحو لتالي.", "Jnabek yti7ou lteli."),
      t("Trusting an anchor that isn't solid.", "Faire confiance à un point d'ancrage peu solide.", "تربط في حاجة موش صحيحة.", "Torbot fi 7aja mouch s7i7a."),
    ],
    difficulty: 1,
    repRange: [8, 15],
  },
  'Inverted_Row_with_Straps': {
    nameFr: "Rowing inversé avec sangles",
    cues: [
      t("Hang straps or a rope from a solid anchor.", "Accroche des sangles ou une corde à un point solide.", "علّق سانغلات ولا حبل في حاجة صحيحة.", "3alle9 des sangles walla 7bel fi 7aja s7i7a."),
      t("Lie back underneath, arms straight, heels down.", "Allonge-toi dessous, bras tendus, talons au sol.", "اتمدّ تحتهم، يدّيك ممدودين، وكعبيك في القاعة.", "Etmadd ta7thom, yeddik mamdoudin, w ka3bik fel 9a3a."),
      t("Pull your chest to your hands, then lower slowly.", "Tire ta poitrine vers tes mains, puis redescends lentement.", "اجبد صدرك ليدّيك، وبعد اهبط بالشويّة.", "Ejbed sedrek l yeddik, ba3d ehbet bechwaya."),
    ],
    mistakes: [
      t("Letting the hips sag.", "Laisser les hanches s'affaisser.", "تخلّي جنابك يطيحو.", "T5alli jnabek yti7ou."),
      t("Shrugging the shoulders toward the ears.", "Hausser les épaules vers les oreilles.", "تهزّ كتافك لوذنيك.", "Thezz ktefek l wednik."),
    ],
    difficulty: 2,
    repRange: [6, 12],
  },

  // ----- Vertical pull -----
  'Wide-Grip_Lat_Pulldown': {
    nameFr: "Tirage vertical prise large",
    cues: [
      t("Thighs locked under the pads, grip wider than shoulders.", "Cuisses bloquées sous les boudins, mains plus larges que les épaules.", "فخاذك مبلوكيين تحت الكوسانات، ويدّيك أعرض من كتافك.", "Fkhadhek mbloukyin ta7t les coussins, w yeddik a3red men ktefek."),
      t("Lean back slightly and pull the bar to your upper chest.", "Penche-toi un peu en arrière, tire la barre vers le haut de la poitrine.", "ميّل شويّة لتالي واجبد البار لصدرك من الفوق.", "Mayyel chwaya lteli w ejbed el barre l sedrek mel fou9."),
      t("Think: drive your elbows into your back pockets.", "Imagine envoyer tes coudes dans tes poches arrière.", "تخيّل: دخّل مرافقك في جيوبك اللي لتالي.", "T5ayyel: da55el mrafe9ek fi jyoubek eli lteli."),
      t("Let the bar rise slowly until your arms are straight.", "Laisse remonter la barre lentement jusqu'à bras tendus.", "خلّي البار يطلع بالشويّة حتى يدّيك يتمدّو.", "5alli el barre tetla3 bechwaya 7atta yeddik yetmaddou."),
    ],
    mistakes: [
      t("Swinging back to yank the weight down.", "Se balancer en arrière pour arracher le poids.", "تتمرجح لتالي باش تجبد الثقل بضربة.", "Tetmarja7 lteli bech tejbed el charge b dharba."),
      t("Pulling the bar behind the neck.", "Tirer la barre derrière la nuque.", "تجبد البار من تالي رقبتك.", "Tejbed el barre men teli ra9btek."),
    ],
    difficulty: 1,
    repRange: [8, 12],
  },
  'Close-Grip_Front_Lat_Pulldown': {
    nameFr: "Tirage vertical prise serrée",
    cues: [
      t("Hands about shoulder-width, knees under the pads.", "Mains environ largeur d'épaules, genoux sous les boudins.", "يدّيك تقريب قدّ عرض كتافك، وركايبك تحت الكوسانات.", "Yeddik ta9riban 9add 3ordh ktefek, w rkaybek ta7t les coussins."),
      t("Chest up, pull the bar to your collarbone.", "Poitrine sortie, tire la barre vers les clavicules.", "صدرك مرفوع، واجبد البار لراس صدرك.", "Sedrek marfou3, w ejbed el barre l ras sedrek."),
      t("Squeeze your back at the bottom, return slowly.", "Serre le dos en bas, remonte lentement.", "شدّ ظهرك لوطا، وارجع بالشويّة.", "Chedd dharek louta, w erja3 bechwaya."),
    ],
    mistakes: [
      t("Using arms and momentum instead of the back.", "Tirer avec les bras et l'élan au lieu du dos.", "تجبد بيدّيك وبالدفعة عوض ظهرك.", "Tejbed b yeddik w bel élan 3oudh dharek."),
      t("Shrugging at the top.", "Hausser les épaules en haut.", "تهزّ كتافك الفوق.", "Thezz ktefek el fou9."),
    ],
    difficulty: 1,
    repRange: [8, 12],
  },
  'Underhand_Cable_Pulldowns': {
    nameFr: "Tirage vertical prise supination",
    cues: [
      t("Palms facing you, hands shoulder-width.", "Paumes vers toi, mains largeur d'épaules.", "الكفوف مقابلينك، ويدّيك قدّ عرض كتافك.", "Kfoufek m9ablinek, w yeddik 9add 3ordh ktefek."),
      t("Pull the bar to your upper chest, elbows down and back.", "Tire la barre vers le haut de la poitrine, coudes vers le bas.", "اجبد البار لصدرك من الفوق، والمرافق للوطا ولتالي.", "Ejbed el barre l sedrek mel fou9, w mrafe9ek llouta w lteli."),
      t("Keep your torso steady with a slight lean back.", "Buste stable, légèrement incliné en arrière.", "خلّي بدنك ثابت ومايل شويّة لتالي.", "5alli badnek thebet w mayel chwaya lteli."),
    ],
    mistakes: [
      t("Leaning way back so it becomes a row.", "Se pencher très en arrière, ça devient un rowing.", "تميل برشا لتالي حتى تولّي روينغ.", "Tmil barcha lteli 7atta twalli rowing."),
      t("Not straightening the arms at the top.", "Ne pas tendre les bras en haut.", "ما تمدّش يدّيك الفوق.", "Ma tmaddech yeddik el fou9."),
    ],
    difficulty: 1,
    repRange: [8, 12],
  },
  'Band_Assisted_Pull-Up': {
    nameFr: "Traction assistée avec élastique",
    cues: [
      t("Loop a band over the bar, knee or foot in the loop.", "Passe un élastique sur la barre, genou ou pied dans la boucle.", "فوّت لاستيك على البار، وحطّ ركبتك ولا ساقك في الدورة.", "Fawwet élastique 3al barre, w 7ott rokbtek walla sa9ek fel boucle."),
      t("Start from straight arms, shoulders pulled down.", "Pars bras tendus, épaules abaissées.", "ابدا ويدّيك ممدودين، وكتافك مهبّطين.", "Ebda w yeddik mamdoudin, w ktefek mhabbtin."),
      t("Pull your chest toward the bar until your chin clears it.", "Tire ta poitrine vers la barre jusqu'à passer le menton.", "اجبد صدرك للبار حتى ذقنك يفوتو.", "Ejbed sedrek lel barre 7atta dh9onek yfoutha."),
      t("Switch to a lighter band as you get stronger.", "Prends un élastique plus léger en progressant.", "بدّل للاستيك أخفّ كل ما تولّي أقوى.", "Baddel l élastique a5ef kol ma twalli a9wa."),
    ],
    mistakes: [
      t("Kicking and swinging to get up.", "Donner des coups de jambes pour monter.", "تضرب بساقيك وتتمرجح باش تطلع.", "Todhrob b sa9ik w tetmarja7 bech tetla3."),
      t("Half reps without straightening the arms.", "Demi-répétitions sans tendre les bras.", "نصّ مرّات من غير ما تمدّ يدّيك.", "Demi-reps men 8ir ma tmadd yeddik."),
    ],
    difficulty: 2,
    avoidIf: ['shoulders'],
    repRange: [5, 10],
  },
  'Chin-Up': {
    nameFr: "Traction en supination (chin-up)",
    cues: [
      t("Palms facing you, hands shoulder-width.", "Paumes vers toi, mains largeur d'épaules.", "الكفوف مقابلينك، ويدّيك قدّ عرض كتافك.", "Kfoufek m9ablinek, w yeddik 9add 3ordh ktefek."),
      t("Start from a dead hang with your stomach braced.", "Pars suspendu bras tendus, ventre gainé.", "ابدا متعلّق ويدّيك ممدودين، وكرشك مشدودة.", "Ebda mte3alle9 w yeddik mamdoudin, w krochek mchedouda."),
      t("Pull until your chin clears the bar.", "Tire jusqu'à passer le menton au-dessus de la barre.", "اجبد حتى ذقنك يفوت البار.", "Ejbed 7atta dh9onek yfout el barre."),
      t("Lower slowly, about three seconds down.", "Redescends lentement, en trois secondes environ.", "اهبط بالشويّة، تقريب ثلاثة ثواني.", "Ehbet bechwaya, ta9riban thletha thwani."),
    ],
    mistakes: [
      t("Kipping or swinging the legs.", "Prendre de l'élan avec les jambes.", "تاخذ دفعة بساقيك ولا تمرجحهم.", "Ta5ou élan b sa9ik walla tmarja7hom."),
      t("Craning the neck to reach the bar.", "Tendre le cou pour atteindre la barre.", "تمدّ رقبتك باش توصل للبار.", "Tmadd ra9btek bech tousel lel barre."),
    ],
    difficulty: 3,
    avoidIf: ['shoulders'],
    repRange: [3, 8],
  },
  'Pullups': {
    nameFr: "Tractions",
    cues: [
      t("Grip just wider than shoulders, palms facing away.", "Mains un peu plus larges que les épaules, paumes vers l'avant.", "يدّيك شويّة أعرض من كتافك، والكفوف للقدّام.", "Yeddik chwaya a3red men ktefek, w kfoufek l9oddem."),
      t("Pull your shoulders down first, then elbows to your ribs.", "Abaisse d'abord les épaules, puis tire les coudes vers les côtes.", "هبّط كتافك الأوّل، وبعد اجبد مرافقك لضلوعك.", "Habbet ktefek lowel, ba3d ejbed mrafe9ek l dhlou3ek."),
      t("Chin over the bar, then lower all the way down.", "Menton au-dessus de la barre, puis redescends complètement.", "ذقنك فوق البار، وبعد اهبط للآخر.", "Dh9onek fou9 el barre, ba3d ehbet lel e5er."),
    ],
    mistakes: [
      t("Swinging to get the chin over.", "Se balancer pour passer le menton.", "تتمرجح باش تفوّت ذقنك.", "Tetmarja7 bech tfawwet dh9onek."),
      t("Stopping halfway on the way down.", "S'arrêter à mi-chemin en descendant.", "توقف في النصّ وانت هابط.", "To9ef fennoss w enti habet."),
    ],
    difficulty: 3,
    avoidIf: ['shoulders'],
    repRange: [3, 8],
  },
  'Bent-Arm_Dumbbell_Pullover': {
    nameFr: "Pull-over haltère bras fléchis",
    cues: [
      t("Upper back across a bench, hips low, feet flat.", "Haut du dos en travers du banc, hanches basses, pieds à plat.", "ظهرك من الفوق بالعرض على البانك، جنابك لوطا، وساقيك لاصقين في القاعة.", "Dharek mel fou9 bel 3ordh 3al banc, jnabek louta, w sa9ik las9in fel 9a3a."),
      t("Hold one dumbbell over your chest, elbows slightly bent.", "Tiens un haltère au-dessus de la poitrine, coudes un peu fléchis.", "شدّ هالتير فوق صدرك، والمرافق مطويين شويّة.", "Chedd haltère fou9 sedrek, w mrafe9ek matwiyin chwaya."),
      t("Lower it behind your head until your back stretches.", "Descends-le derrière la tête jusqu'à sentir le dos s'étirer.", "هبّطو من تالي راسك حتى تحسّ ظهرك يتمطّ.", "Habbtou men teli rassek 7atta t7ess dharek yetmatt."),
      t("Pull it back over your chest using your back.", "Ramène-le au-dessus de la poitrine avec le dos.", "رجّعو فوق صدرك بظهرك.", "Rajj3ou fou9 sedrek b dharek."),
    ],
    mistakes: [
      t("Going too deep and straining the shoulders.", "Descendre trop loin et forcer sur les épaules.", "تهبط برشا وتضغط على كتافك.", "Tahbet barcha w todh8ot 3la ktefek."),
      t("Hips rising during the rep.", "Hanches qui remontent pendant le mouvement.", "الجناب يطلعو في وسط الحركة.", "Jnabek yotl3ou fi wost el 7arka."),
    ],
    difficulty: 2,
    avoidIf: ['shoulders'],
    repRange: [10, 15],
  },
  'Straight-Arm_Dumbbell_Pullover': {
    nameFr: "Pull-over haltère bras tendus",
    cues: [
      t("Lie across a bench with a dumbbell held over your chest.", "En travers d'un banc, haltère au-dessus de la poitrine.", "اتمدّ بالعرض على بانك وشدّ هالتير فوق صدرك.", "Etmadd bel 3ordh 3la banc w chedd haltère fou9 sedrek."),
      t("Arms nearly straight, lower in an arc behind your head.", "Bras presque tendus, descends en arc derrière la tête.", "يدّيك تقريب ممدودين، هبّط في قوس من تالي راسك.", "Yeddik ta9riban mamdoudin, habbet f 9aws men teli rassek."),
      t("Stop at a comfortable stretch, then pull back up.", "Arrête à un étirement confortable, puis remonte.", "وقّف كي تتمطّ وانت مرتاح، وبعد طلّع.", "Wa99ef ki tetmatt w enti merte7, ba3d tala3."),
    ],
    mistakes: [
      t("Bending the elbows a lot, turning it into a triceps move.", "Plier beaucoup les coudes, ça devient un exercice de triceps.", "تطوي مرافقك برشا، ويولّي تمرين تريسيبس.", "Totwi mrafe9ek barcha, w ywalli exercice triceps."),
      t("Using a weight that's too heavy.", "Prendre un poids trop lourd.", "تاخذ هالتير ثقيل برشا.", "Ta5ou haltère th9il barcha."),
    ],
    difficulty: 2,
    avoidIf: ['shoulders'],
    repRange: [10, 15],
  },

  // ----- Chest fly -----
  'Butterfly': {
    nameFr: "Pec deck (butterfly)",
    cues: [
      t("Set the seat so your arms are parallel to the floor.", "Règle le siège pour avoir les bras parallèles au sol.", "ريقل الكرسي باش يدّيك يكونو موازيين للقاعة.", "Régli el korsi bech yeddik ykounou parallèles lel 9a3a."),
      t("Back flat on the pad, slight bend in the elbows.", "Dos collé au dossier, coudes légèrement fléchis.", "ظهرك لاصق في الدوسي، والمرافق مطويين شويّة.", "Dharek las9 fel dossier, w mrafe9ek matwiyin chwaya."),
      t("Bring the handles together, squeezing your chest.", "Rapproche les poignées en serrant les pectoraux.", "قرّب البوانيات لبعضهم وشدّ صدرك.", "9arreb les poignées l ba3dhhom w chedd sedrek."),
      t("Open slowly and stop at a comfortable stretch.", "Ouvre lentement et arrête à un étirement confortable.", "حلّ بالشويّة ووقّف كي تتمطّ وانت مرتاح.", "7ell bechwaya w wa99ef ki tetmatt w enti merte7."),
    ],
    mistakes: [
      t("Letting the arms fly back too far.", "Laisser les bras partir trop loin en arrière.", "تخلّي يدّيك يمشيو برشا لتالي.", "T5alli yeddik yemchiw barcha lteli."),
      t("Shoulders rolling forward.", "Épaules qui s'enroulent vers l'avant.", "الكتاف يتلفّو للقدّام.", "Ktefek yetleffou l9oddem."),
    ],
    difficulty: 1,
    repRange: [10, 15],
  },
  'Cable_Crossover': {
    nameFr: "Écarté à la poulie vis-à-vis",
    cues: [
      t("Pulleys high, step forward into a split stance.", "Poulies en haut, avance d'un pas en position fendue.", "البوليات الفوق، واعمل خطوة للقدّام: ساق قدّام وساق لتالي.", "Les poulies el fou9, w a3mel 5atwa l9oddem: sa9 9oddem w sa9 lteli."),
      t("Slight elbow bend, as if hugging a big tree.", "Coudes légèrement fléchis, comme pour enlacer un gros arbre.", "المرافق مطويين شويّة، كيما تحضن شجرة كبيرة.", "Mrafe9ek matwiyin chwaya, kima to7dhen chajra kbira."),
      t("Bring your hands together below your chest and squeeze.", "Rapproche les mains sous la poitrine et serre.", "قرّب يدّيك لبعضهم تحت صدرك وشدّ.", "9arreb yeddik l ba3dhhom ta7t sedrek w chedd."),
    ],
    mistakes: [
      t("Bending the elbows into a pressing motion.", "Plier les coudes et pousser comme un développé.", "تطوي مرافقك وتدزّ كيما ديفلوبي.", "Totwi mrafe9ek w tdezz kima développé."),
      t("Leaning too far forward.", "Se pencher trop en avant.", "تميل برشا للقدّام.", "Tmil barcha l9oddem."),
    ],
    difficulty: 2,
    repRange: [10, 15],
  },
  'Low_Cable_Crossover': {
    nameFr: "Écarté poulie basse",
    cues: [
      t("Pulleys low, palms forward, arms down by your sides.", "Poulies en bas, paumes vers l'avant, bras le long du corps.", "البوليات لوطا، الكفوف للقدّام، ويدّيك على جنبك.", "Les poulies louta, kfoufek l9oddem, w yeddik 3la jnebek."),
      t("Sweep your hands up and together to upper-chest height.", "Remonte les mains en les rapprochant jusqu'au haut des pectoraux.", "طلّع يدّيك وقرّبهم حتى لطول صدرك من الفوق.", "Tala3 yeddik w 9arrebhom 7atta l 9add sedrek mel fou9."),
      t("Keep your elbows soft and fixed.", "Garde les coudes souples et fixes.", "خلّي مرافقك مطويين شويّة وثابتين.", "5alli mrafe9ek matwiyin chwaya w thebtin."),
    ],
    mistakes: [
      t("Shrugging as the hands rise.", "Hausser les épaules quand les mains montent.", "تهزّ كتافك كي يدّيك يطلعو.", "Thezz ktefek ki yeddik yotl3ou."),
      t("Swinging with the body.", "Se balancer avec le corps.", "تتمرجح ببدنك.", "Tetmarja7 b badnek."),
    ],
    difficulty: 1,
    repRange: [10, 15],
  },
  'Dumbbell_Flyes': {
    nameFr: "Écarté couché aux haltères",
    cues: [
      t("Lie on a flat bench, dumbbells over your chest, palms in.", "Allongé sur un banc plat, haltères au-dessus, paumes face à face.", "اتمدّ على بانك مستوي، الهالتيرات فوق صدرك، والكفوف لداخل.", "Etmadd 3la banc plat, les haltères fou9 sedrek, w kfoufek ldekhel."),
      t("Slight elbow bend, open your arms wide in an arc.", "Coudes légèrement fléchis, ouvre les bras en arc.", "المرافق مطويين شويّة، وحلّ يدّيك بالعرض في قوس.", "Mrafe9ek matwiyin chwaya, w 7ell yeddik bel 3ordh f 9aws."),
      t("Stop when your elbows reach about bench level.", "Arrête quand les coudes arrivent au niveau du banc.", "وقّف كي المرافق يوصلو تقريب لطول البانك.", "Wa99ef ki mrafe9ek youslou ta9riban l 9add el banc."),
      t("Squeeze back up like hugging a barrel.", "Remonte comme si tu enlaçais un tonneau.", "اطلع وشدّ كيما تحضن برميل.", "Etla3 w chedd kima to7dhen barmil."),
    ],
    mistakes: [
      t("Going too heavy and turning it into a press.", "Prendre trop lourd et transformer en développé.", "تاخذ ثقيل برشا ويولّي ديفلوبي.", "Ta5ou th9il barcha w ywalli développé."),
      t("Dropping the arms too low.", "Descendre les bras trop bas.", "تهبّط يدّيك برشا.", "Thabbet yeddik barcha."),
    ],
    difficulty: 2,
    avoidIf: ['shoulders'],
    repRange: [10, 15],
  },
  'Incline_Dumbbell_Flyes': {
    nameFr: "Écarté incliné aux haltères",
    cues: [
      t("Bench at about 30°, dumbbells over your upper chest.", "Banc à environ 30°, haltères au-dessus du haut des pectoraux.", "البانك تقريب 30°، والهالتيرات على خطّ صدرك من الفوق.", "El banc ta9riban 30°, w les haltères 3la 5att sedrek mel fou9."),
      t("Open your arms in a wide arc, elbows soft.", "Ouvre les bras en grand arc, coudes souples.", "حلّ يدّيك في قوس كبير، والمرافق مطويين شويّة.", "7ell yeddik f 9aws kbir, w mrafe9ek matwiyin chwaya."),
      t("Bring them back together without clanking.", "Rapproche-les sans les entrechoquer.", "رجّعهم لبعضهم من غير ما تضربهم.", "Rajja3hom l ba3dhhom men 8ir ma todhrobhom."),
    ],
    mistakes: [
      t("Lowering until the shoulders feel pinched.", "Descendre jusqu'à sentir les épaules pincer.", "تهبّط حتى تحسّ كتافك يقرصو.", "Thabbet 7atta t7ess ktefek y9arsou."),
      t("Turning it into a press.", "Le transformer en développé.", "تولّيه ديفلوبي.", "Twallih développé."),
    ],
    difficulty: 2,
    avoidIf: ['shoulders'],
    repRange: [10, 15],
  },
  'Isometric_Chest_Squeezes': {
    nameFr: "Contraction isométrique des pectoraux",
    cues: [
      t("Press your palms together in front of your chest.", "Presse les paumes l'une contre l'autre devant la poitrine.", "اعصر كفوفك في بعضهم قدّام صدرك.", "O3sor kfoufek fi ba3dhhom 9oddem sedrek."),
      t("Elbows bent at 90°, push hard and feel your chest tighten.", "Coudes à 90°, pousse fort et sens tes pectoraux se contracter.", "المرافق مطويين على 90°، دزّ بالقوّة وحسّ صدرك يتشدّ.", "Mrafe9ek matwiyin 3la 90°, dezz b 9owwa w 7ess sedrek yetchadd."),
      t("Keep breathing; don't hold your breath.", "Continue de respirer, ne bloque pas ton souffle.", "قعد تتنفّس، ما تحبسش نفسك.", "9a3ed tetnaffes, ma t7besch nafsek."),
    ],
    mistakes: [
      t("Holding your breath.", "Bloquer la respiration.", "تحبس نفسك.", "To7bes nafsek."),
      t("Shrugging the shoulders up.", "Hausser les épaules.", "تهزّ كتافك للفوق.", "Thezz ktefek lfou9."),
    ],
    difficulty: 1,
    repRange: [10, 20],
    timed: true,
  },
  'Push-Up_Wide': {
    nameFr: "Pompes mains écartées",
    cues: [
      t("Hands wider than shoulders, fingers pointing forward.", "Mains plus écartées que les épaules, doigts vers l'avant.", "يدّيك أعرض من كتافك، والصوابع للقدّام.", "Yeddik a3red men ktefek, w swaba3ek l9oddem."),
      t("Lower your chest down between your hands.", "Descends la poitrine entre tes mains.", "هبّط صدرك بين يدّيك.", "Habbet sedrek bin yeddik."),
      t("Keep your body rigid like a plank.", "Garde le corps rigide comme une planche.", "خلّي بدنك صحيح كيما البلانش.", "5alli badnek s7i7 kima planche."),
      t("Too hard? Put your hands on a table.", "Trop dur ? Pose les mains sur une table.", "صعيبة برشا؟ حطّ يدّيك على طاولة.", "S3iba barcha? 7ott yeddik 3la tawla."),
    ],
    mistakes: [
      t("Hands so wide that the shoulders pinch.", "Mains si écartées que les épaules pincent.", "يدّيك محلولين برشا حتى كتافك يقرصو.", "Yeddik ma7loulin barcha 7atta ktefek y9arsou."),
      t("Hips sagging.", "Hanches qui s'affaissent.", "الجناب طايحين.", "Jnabek tay7in."),
    ],
    difficulty: 2,
    avoidIf: ['wrists', 'shoulders'],
    repRange: [8, 15],
  },
  'Cross_Over_-_With_Bands': {
    nameFr: "Écarté avec élastique",
    cues: [
      t("Anchor the band behind you at chest height.", "Fixe l'élastique derrière toi à hauteur de poitrine.", "اربط اللاستيك وراك في طول صدرك.", "Orbot l'élastique wrak 9add sedrek."),
      t("Arms out in a T, elbows slightly bent.", "Bras en T, coudes légèrement fléchis.", "يدّيك محلولين كيما حرف T، والمرافق مطويين شويّة.", "Yeddik ma7loulin kima 7arf T, w mrafe9ek matwiyin chwaya."),
      t("Bring your hands together in front and squeeze your chest.", "Rapproche les mains devant toi et serre les pectoraux.", "قرّب يدّيك قدّامك وشدّ صدرك.", "9arreb yeddik 9oddemek w chedd sedrek."),
    ],
    mistakes: [
      t("Bending the elbows into a press.", "Plier les coudes comme un développé.", "تطوي مرافقك وتولّي تدزّ كيما ديفلوبي.", "Totwi mrafe9ek w twalli tdezz kima développé."),
      t("Letting the band yank your arms back.", "Laisser l'élastique tirer les bras en arrière.", "تخلّي اللاستيك يجبد يدّيك لتالي بضربة.", "T5alli l'élastique yejbed yeddik lteli b dharba."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },

};
