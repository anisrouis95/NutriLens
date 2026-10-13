// Coaching data per exercise, part B (lateral raise to conditioning). Assembled in exerciseCuration.ts.

import type { ExerciseExtra } from './exerciseCuration';
import { t } from './text';

export const exerciseExtrasB: Record<string, ExerciseExtra> = {
  // ----- Lateral raise -----
  'Side_Lateral_Raise': {
    nameFr: "Élévations latérales",
    cues: [
      t("Light dumbbells at your sides, slight bend in the elbows.", "Haltères légers le long du corps, coudes un peu fléchis.", "هالتيرات خفاف على جنابك، المرافق مطويين شويّة.", "Haltères khfef 3la jnabek, el mrafe9 matwiyin chwaya."),
      t("Raise your arms out to shoulder height, like pouring water.", "Monte les bras sur les côtés jusqu'aux épaules, comme pour verser de l'eau.", "طلّع يديك على الجناب لين الكتاف، كيما كان تصبّ الماء.", "Tala3 yeddik 3al jnab lin el ktef, kima ken tsobb el mé."),
      t("Lead with the elbows; shoulders stay down.", "Les coudes mènent, les épaules restent basses.", "المرافق هوما اللي يطلّعو، والكتاف يقعدو لوطة.", "El mrafe9 houma eli ytal3ou, w el ktef yo93dou louta."),
      t("No dumbbells? Use full water bottles.", "Pas d'haltères ? Utilise des bouteilles d'eau pleines.", "ما عندكش هالتيرات؟ استعمل دبابز ماء معبّيين.", "Ma 3andekch haltères? Esta3mel dbabez mé m3abbyin."),
    ],
    mistakes: [
      t("Swinging the body to lift heavier weights.", "Se balancer pour soulever plus lourd.", "تهزّ بدنك باش تطلّع ثقل أكبر.", "Tehezz badnek bech ttala3 charge akber."),
      t("Shrugging the shoulders up to the ears.", "Hausser les épaules vers les oreilles.", "تطلّع كتافك لوذنيك.", "Ttala3 ktefek l wedhnik."),
      t("Raising the arms above shoulder height.", "Monter les bras au-dessus des épaules.", "تطلّع يديك فوق الكتاف.", "Ttala3 yeddik fou9 el ktef."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },
  'Seated_Side_Lateral_Raise': {
    nameFr: "Élévations latérales assis",
    cues: [
      t("Sit at the end of a bench, feet flat, back tall.", "Assis au bout d'un banc, pieds à plat, dos droit.", "اقعد في طرف البانك، ساقيك لاصقين في الأرض، ظهرك دريت.", "O93ed f tarf el banc, sa9ik las9in fel ardh, dharek dret."),
      t("Raise the dumbbells out to the sides up to shoulder height.", "Monte les haltères sur les côtés jusqu'aux épaules.", "طلّع الهالتيرات على الجناب لين الكتاف.", "Tala3 les haltères 3al jnab lin el ktef."),
      t("Lower slowly; don't let them rest at the bottom.", "Redescends lentement sans poser les poids en bas.", "هبّط بشويّة، وما تحطّهمش لوطة.", "Habbet bechwaya, w ma t7otthomch louta."),
    ],
    mistakes: [
      t("Leaning back to cheat.", "Se pencher en arrière pour tricher.", "تميّل لتالي باش تغشّ.", "Tmayel lteli bech t8ech."),
      t("Going too heavy.", "Prendre trop lourd.", "تاخو ثقيل برشا.", "Tekhou t9il barcha."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },
  'Standing_Low-Pulley_Deltoid_Raise': {
    nameFr: "Élévation latérale à la poulie basse",
    cues: [
      t("Stand side-on to a low pulley, handle in your far hand.", "De profil à la poulie basse, poignée dans la main opposée.", "اوقف بالجنب للبولي اللوطانية، المقبض في اليد البعيدة.", "O9ef bel jnab lel poulie basse, el poignée fel yed el b3ida."),
      t("Raise the arm across and out to shoulder height.", "Monte le bras en diagonale jusqu'à hauteur d'épaule.", "طلّع يدك بالمايل لين طول الكتف.", "Tala3 yeddek bel mayel lin toul el ktef."),
      t("Hold the machine with your free hand for balance.", "Tiens la machine avec la main libre pour l'équilibre.", "شدّ الماشينة باليد الأخرى باش تبقى متوازن.", "Chedd el machine bel yed lo5ra bech tob9a mitwazen."),
    ],
    mistakes: [
      t("Leaning away to yank the cable.", "Se pencher pour arracher le câble.", "تميّل لبعيد باش تجبد الكابل بالقوّة.", "Tmayel l b3id bech tejbed el câble bel 9owwa."),
      t("Shrugging the working shoulder.", "Hausser l'épaule qui travaille.", "تطلّع الكتف اللي يخدم.", "Ttala3 el ktef eli yekhdem."),
    ],
    difficulty: 1,
    repRange: [12, 20],
    unilateral: true,
  },
  'One-Arm_Side_Laterals': {
    nameFr: "Élévation latérale unilatérale",
    cues: [
      t("Hold a sturdy support with your free hand.", "Tiens un appui solide avec la main libre.", "شدّ في حاجة صحيحة باليد الأخرى.", "Chedd f 7aja s7i7a bel yed lo5ra."),
      t("Raise the weight out to shoulder height, elbow soft.", "Monte le poids sur le côté jusqu'à l'épaule, coude souple.", "طلّع الثقل على الجنب لين الكتف، المرفق مطوي شويّة.", "Tala3 el charge 3al jnab lin el ktef, el morfe9 matwi chwaya."),
      t("No dumbbell? Use a water bottle or a light bag.", "Pas d'haltère ? Prends une bouteille d'eau ou un sac léger.", "ما عندكش هالتير؟ استعمل دبّوزة ماء ولا صاك خفيف.", "Ma 3andekch haltère? Esta3mel dabbouzet mé walla sac khfif."),
    ],
    mistakes: [
      t("Swinging the torso.", "Balancer le buste.", "تهزّ في بدنك.", "Tehezz f badnek."),
      t("Lifting by shrugging the shoulder.", "Monter en haussant l'épaule.", "تطلّع الثقل وانت ترفع في كتفك.", "Ttala3 el charge w enti terfa3 f ktefek."),
    ],
    difficulty: 1,
    repRange: [12, 20],
    unilateral: true,
  },
  'Dumbbell_Scaption': {
    nameFr: "Élévation en Y aux haltères (scaption)",
    cues: [
      t("Thumbs up, arms slightly in front of your body.", "Pouces vers le haut, bras légèrement devant toi.", "صوابعك الكبار لفوق، يديك شويّة قدّام بدنك.", "Swaba3ek el kbar lel fou9, yeddik chwaya 9eddem badnek."),
      t("Raise your arms in a shallow V up to shoulder height.", "Monte les bras en V jusqu'à hauteur d'épaules.", "طلّع يديك في شكل V محلول لين الكتاف.", "Tala3 yeddik f chakl V m7loul lin el ktef."),
      t("Use light weights and move slowly.", "Prends des poids légers et bouge lentement.", "خوذ ثقل خفيف وتحرّك بشويّة.", "Khoudh charge khfifa w t7arrek bechwaya."),
    ],
    mistakes: [
      t("Shrugging the shoulders.", "Hausser les épaules.", "ترفع كتافك لفوق.", "Terfa3 ktefek lel fou9."),
      t("Using weights that are too heavy.", "Utiliser des poids trop lourds.", "تخدم بثقل كبير برشا.", "Tekhdem b charge kbira barcha."),
    ],
    difficulty: 1,
    repRange: [12, 15],
  },
  'Lateral_Raise_-_With_Bands': {
    nameFr: "Élévations latérales avec élastique",
    cues: [
      t("Stand on the band, handles at your sides.", "Debout sur l'élastique, poignées le long du corps.", "اوقف على الإيلاستيك، المقابض على جنابك.", "O9ef 3al élastique, les poignées 3la jnabek."),
      t("Raise your arms out to shoulder height, elbows soft.", "Monte les bras sur les côtés jusqu'aux épaules, coudes souples.", "طلّع يديك على الجناب لين الكتاف، المرافق مطويين شويّة.", "Tala3 yeddik 3al jnab lin el ktef, el mrafe9 matwiyin chwaya."),
      t("Lower slowly while resisting the band.", "Redescends lentement en résistant à l'élastique.", "هبّط بشويّة وانت تقاوم الإيلاستيك.", "Habbet bechwaya w enti t9awem el élastique."),
    ],
    mistakes: [
      t("Shrugging as the band gets tight.", "Hausser les épaules quand l'élastique se tend.", "ترفع كتافك كي يتشدّ الإيلاستيك.", "Terfa3 ktefek ki yetchedd el élastique."),
      t("Leaning to one side.", "Se pencher sur le côté.", "تميّل على جنب.", "Tmayel 3la jnab."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },
  'Upright_Row_-_With_Bands': {
    nameFr: "Tirage menton avec élastique",
    cues: [
      t("Stand on the band, hands slightly narrower than shoulders.", "Debout sur l'élastique, mains un peu plus serrées que les épaules.", "اوقف على الإيلاستيك، يديك أقرب شويّة من عرض الكتاف.", "O9ef 3al élastique, yeddik a9rab chwaya men 3ordh el ktef."),
      t("Lead with the elbows, pull to lower-chest height.", "Les coudes mènent, tire jusqu'au bas de la poitrine.", "المرافق هوما اللي يطلّعو، اجبد لين لوطة صدرك.", "El mrafe9 houma eli ytal3ou, ejbed lin louta sadrek."),
      t("Stop before your elbows go above your shoulders.", "Arrête avant que les coudes dépassent les épaules.", "وقّف قبل ما مرافقك يفوتو كتافك.", "Wa99ef 9bal ma mrafe9ek yfoutou ktefek."),
    ],
    mistakes: [
      t("Pulling the hands up to the chin and pinching the shoulders.", "Monter les mains au menton en pinçant les épaules.", "تطلّع يديك للدقن وتزيّر كتافك.", "Ttala3 yeddik lel dgen w tzayyer ktefek."),
      t("Bending the wrists sharply.", "Casser fortement les poignets.", "تكسّر معاصمك برشا.", "Tkasser poignets mte3ek barcha."),
    ],
    difficulty: 1,
    avoidIf: ['shoulders', 'wrists'],
    repRange: [12, 15],
  },

  // ----- Rear delts -----
  'Reverse_Machine_Flyes': {
    nameFr: "Oiseau à la machine (reverse pec deck)",
    cues: [
      t("Face the pad, handles at shoulder height.", "Face au dossier, poignées à hauteur d'épaules.", "وجهك للكوسان، المقابض في طول الكتاف.", "Wejhek lel coussin, les poignées f toul el ktef."),
      t("Sweep your arms out and back in a wide arc.", "Ouvre les bras vers l'arrière en grand arc.", "حلّ يديك لتالي في دورة واسعة.", "7ell yeddik lteli f dawra wes3a."),
      t("Keep shoulders down and pause at the back.", "Épaules basses, marque une pause en arrière.", "خلّي كتافك لوطة واستنّى شويّة لتالي.", "Khalli ktefek louta w ostanna chwaya lteli."),
    ],
    mistakes: [
      t("Pinching the shoulder blades so hard it becomes a row.", "Trop serrer les omoplates, ça devient un tirage.", "تزيّر لوحات كتافك برشا لين يولّي تيراج.", "Tzayyer les omoplates barcha lin ywalli tirage."),
      t("Using momentum.", "Utiliser l'élan.", "تخدم بالدفعة.", "Tekhdem bel daf3a."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },
  'Face_Pull': {
    nameFr: "Face pull à la poulie",
    cues: [
      t("Rope on a high pulley, at face height or above.", "Corde sur une poulie haute, à hauteur du visage ou plus.", "الكورد على البولي العالية، في طول وجهك ولا فوقو.", "La corde 3al poulie haute, f toul wejhek walla fou9ou."),
      t("Pull the rope toward your eyes, hands splitting apart.", "Tire la corde vers les yeux en écartant les mains.", "اجبد الكورد لعينيك وفرّق يديك.", "Ejbed la corde l 3inik w farre9 yeddik."),
      t("Finish like a double-biceps pose, elbows high.", "Finis comme une pose double biceps, coudes hauts.", "كمّل كيما بوز دوبل بيسيبس، المرافق لفوق.", "Kammel kima pose double biceps, el mrafe9 lel fou9."),
    ],
    mistakes: [
      t("Leaning back and pulling with bodyweight.", "Se pencher en arrière et tirer avec le poids du corps.", "تميّل لتالي وتجبد بوزن بدنك.", "Tmayel lteli w tejbed b poids badnek."),
      t("Elbows dropping into a low row.", "Coudes qui descendent comme un rowing.", "المرافق يطيحو ويولّي تيراج لوطاني.", "El mrafe9 yti7ou w ywalli tirage louteni."),
    ],
    difficulty: 2,
    repRange: [12, 15],
  },
  'Cable_Rear_Delt_Fly': {
    nameFr: "Oiseau à la poulie haute",
    cues: [
      t("Cross the cables: left hand holds the right cable.", "Croise les câbles : la main gauche tient le câble droit.", "قاطع الكابلات: اليد اليسار تشدّ الكابل اليمين.", "9ate3 les câbles: el yed el isar tchedd el câble el imin."),
      t("Arms nearly straight, pull out and back into a T.", "Bras presque tendus, ouvre vers l'arrière jusqu'en T.", "يديك تقريب ممدودين، حلّهم لتالي لين يولّيو T.", "Yeddik ta9rib mamdoudin, 7ellhom lteli lin ywalliw T."),
      t("Return slowly to the crossed position.", "Reviens lentement en position croisée.", "ارجع بشويّة لين الكابلات يتقاطعو.", "Erja3 bechwaya lin les câbles yet9at3ou."),
    ],
    mistakes: [
      t("Bending the elbows and rowing.", "Plier les coudes et tirer comme un rowing.", "تطوي مرافقك وتعمل تيراج.", "Ttawi mrafe9ek w ta3mel tirage."),
      t("Going too heavy.", "Prendre trop lourd.", "تاخو ثقيل برشا.", "Tekhou t9il barcha."),
    ],
    difficulty: 2,
    repRange: [12, 20],
  },
  'Bent_Over_Dumbbell_Rear_Delt_Raise_With_Head_On_Bench': {
    nameFr: "Oiseau haltères, front sur le banc",
    cues: [
      t("Bend forward and rest your forehead on a bench or chair back.", "Penche-toi et pose le front sur un banc ou un dossier de chaise.", "ميّل لقدّام وحطّ جبينك على بانك ولا ظهر كرسي.", "Mayel l 9oddem w 7ott jbinek 3la banc walla dhar korsi."),
      t("Raise light weights out to the sides, elbows soft.", "Monte des poids légers sur les côtés, coudes souples.", "طلّع ثقل خفيف على الجناب، المرافق مطويين شويّة.", "Tala3 charge khfifa 3al jnab, el mrafe9 matwiyin chwaya."),
      t("Think of pushing the weights out toward the walls.", "Imagine pousser les poids vers les murs.", "تخيّل روحك تدزّ الثقل للحيوط.", "Tkhayel rou7ek tdezz el charge lel 7iout."),
      t("No dumbbells? Use full water bottles.", "Pas d'haltères ? Prends des bouteilles d'eau pleines.", "ما عندكش هالتيرات؟ استعمل دبابز ماء معبّيين.", "Ma 3andekch haltères? Esta3mel dbabez mé m3abbyin."),
    ],
    mistakes: [
      t("Squeezing the shoulder blades instead of using the rear shoulders.", "Serrer les omoplates au lieu d'utiliser l'arrière des épaules.", "تزيّر لوحات كتافك عوض ما تخدّم كتافك من تالي.", "Tzayyer les omoplates 3awedh ma tkhaddem ktefek men teli."),
      t("Swinging the weights up.", "Lancer les poids avec élan.", "تطلّع الثقل بالدفعة.", "Ttala3 el charge bel daf3a."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },
  'Reverse_Flyes': {
    nameFr: "Oiseau allongé sur banc incliné",
    cues: [
      t("Lie chest-down on an incline bench, palms facing in.", "Allongé poitrine contre un banc incliné, paumes face à face.", "تمدّد على صدرك فوق بانك مايل، كفوفك مقابلين بعضهم.", "Tmadded 3la sadrek fou9 banc incliné, kfoufek m9ablin ba3dhhom."),
      t("Raise your arms out to the sides in an arc.", "Monte les bras sur les côtés en arc de cercle.", "طلّع يديك على الجناب في شكل دورة.", "Tala3 yeddik 3al jnab f chakl dawra."),
      t("Keep the slight elbow bend fixed.", "Garde la légère flexion des coudes fixe.", "خلّي المرافق مطويين شويّة وما تبدّلهمش.", "Khalli el mrafe9 matwiyin chwaya w ma tbaddelhomch."),
    ],
    mistakes: [
      t("Lifting the chest off the bench.", "Décoller la poitrine du banc.", "تقلّع صدرك من البانك.", "T9alla3 sadrek mel banc."),
      t("So heavy that the elbows bend a lot.", "Trop lourd, les coudes se plient beaucoup.", "ثقيل برشا لدرجة المرافق يتطواو برشا.", "T9il barcha l daraja el mrafe9 yettawew barcha."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },
  'Seated_Bent-Over_Rear_Delt_Raise': {
    nameFr: "Oiseau assis buste penché",
    cues: [
      t("Sit on the edge of a bench or chair, chest over knees.", "Assis au bord d'un banc ou d'une chaise, buste sur les genoux.", "اقعد في طرف بانك ولا كرسي، صدرك فوق ركايبك.", "O93ed f tarf banc walla korsi, sadrek fou9 rkaybek."),
      t("Raise the weights out to the sides, elbows soft.", "Monte les poids sur les côtés, coudes souples.", "طلّع الثقل على الجناب، المرافق مطويين شويّة.", "Tala3 el charge 3al jnab, el mrafe9 matwiyin chwaya."),
      t("No dumbbells? Use full water bottles.", "Pas d'haltères ? Utilise des bouteilles d'eau pleines.", "ما عندكش هالتيرات؟ استعمل دبابز ماء معبّيين.", "Ma 3andekch haltères? Esta3mel dbabez mé m3abbyin."),
    ],
    mistakes: [
      t("Sitting up as you lift.", "Se redresser en levant.", "تنوّض صدرك وانت تطلّع.", "Tnawwedh sadrek w enti ttala3."),
      t("Shrugging the shoulders.", "Hausser les épaules.", "ترفع كتافك لفوق.", "Terfa3 ktefek lel fou9."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },
  'Band_Pull_Apart': {
    nameFr: "Écartement d'élastique (band pull-apart)",
    cues: [
      t("Hold the band at shoulder height, arms straight.", "Tiens l'élastique à hauteur d'épaules, bras tendus.", "شدّ الإيلاستيك في طول الكتاف، يديك ممدودين.", "Chedd el élastique f toul el ktef, yeddik mamdoudin."),
      t("Pull it apart until it touches your chest.", "Écarte-le jusqu'à ce qu'il touche ta poitrine.", "حلّو على الجناب لين يمسّ صدرك.", "7ellou 3al jnab lin ymess sadrek."),
      t("Keep shoulders down, return slowly.", "Épaules basses, reviens lentement.", "خلّي كتافك لوطة، وارجع بشويّة.", "Khalli ktefek louta, w erja3 bechwaya."),
    ],
    mistakes: [
      t("Bending the elbows.", "Plier les coudes.", "تطوي مرافقك.", "Ttawi mrafe9ek."),
      t("Arching the back to finish.", "Se cambrer pour finir.", "تكمبري ظهرك باش تكمّل.", "Tcambri dharek bech tkammel."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },
  'Back_Flyes_-_With_Bands': {
    nameFr: "Oiseau debout avec élastique",
    cues: [
      t("Anchor the band in front of you at chest height.", "Fixe l'élastique devant toi à hauteur de poitrine.", "اربط الإيلاستيك قدّامك في طول صدرك.", "Orbot el élastique 9eddemek f toul sadrek."),
      t("Arms straight ahead, open them out to your sides.", "Bras tendus devant, ouvre-les sur les côtés.", "يديك ممدودين قدّامك، حلّهم على جنابك.", "Yeddik mamdoudin 9eddemek, 7ellhom 3la jnabek."),
      t("Pause, then return slowly.", "Marque une pause, puis reviens lentement.", "استنّى شويّة، ومبعد ارجع بشويّة.", "Ostanna chwaya, w mba3d erja3 bechwaya."),
    ],
    mistakes: [
      t("Letting the band pull you forward.", "Se laisser tirer vers l'avant par l'élastique.", "تخلّي الإيلاستيك يجبدك لقدّام.", "Tkhalli el élastique yejbdek l 9oddem."),
      t("Shrugging the shoulders.", "Hausser les épaules.", "ترفع كتافك لفوق.", "Terfa3 ktefek lel fou9."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },
  'External_Rotation_with_Band': {
    nameFr: "Rotation externe avec élastique",
    cues: [
      t("Band at elbow height, elbow tucked against your side.", "Élastique à hauteur du coude, coude collé au corps.", "الإيلاستيك في طول المرفق، والمرفق لاصق في جنبك.", "El élastique f toul el morfe9, w el morfe9 las9 f jnabek."),
      t("Rotate your forearm outward like opening a door.", "Fais pivoter l'avant-bras vers l'extérieur, comme une porte.", "دوّر ساعدك للبرّة كيما كان تحلّ في باب.", "Dawwer sa3dek lel barra kima ken t7ell f beb."),
      t("A rolled towel under the elbow helps.", "Une serviette roulée sous le coude aide.", "فوطة ملفوفة تحت المرفق تعاون.", "Fouta malfoufa ta7t el morfe9 t3awen."),
    ],
    mistakes: [
      t("Elbow drifting away from the body.", "Coude qui s'éloigne du corps.", "المرفق يبعد على بدنك.", "El morfe9 yeb3ed 3la badnek."),
      t("Twisting the torso.", "Tourner le buste.", "تدوّر بدنك.", "Tdawwer badnek."),
    ],
    difficulty: 1,
    repRange: [12, 20],
    unilateral: true,
  },

  // ----- Biceps -----
  'Dumbbell_Bicep_Curl': {
    nameFr: "Curl biceps aux haltères",
    cues: [
      t("Stand tall, elbows pinned to your sides.", "Debout bien droit, coudes collés au corps.", "اوقف دريت، مرافقك لاصقين في جنابك.", "O9ef dret, mrafe9ek las9in f jnabek."),
      t("Curl up while turning your palms toward your shoulders.", "Monte en tournant les paumes vers les épaules.", "طلّع وانت تدوّر كفوفك لكتافك.", "Tala3 w enti tdawwer kfoufek l ktefek."),
      t("Lower slowly until your arms are straight.", "Redescends lentement jusqu'à bras tendus.", "هبّط بشويّة لين يديك يتمدّو.", "Habbet bechwaya lin yeddik yetmaddou."),
    ],
    mistakes: [
      t("Swinging the body to lift the weight.", "Balancer le corps pour monter le poids.", "تهزّ بدنك باش تطلّع الثقل.", "Tehezz badnek bech ttala3 el charge."),
      t("Elbows drifting forward.", "Coudes qui avancent.", "المرافق يمشيو لقدّام.", "El mrafe9 yemchiw l 9oddem."),
      t("Not lowering all the way.", "Ne pas redescendre complètement.", "ما تهبّطش للآخر.", "Ma thabbetch lel e5er."),
    ],
    difficulty: 1,
    repRange: [10, 15],
  },
  'Hammer_Curls': {
    nameFr: "Curl marteau",
    cues: [
      t("Palms face each other, like holding hammers.", "Paumes face à face, comme si tu tenais des marteaux.", "كفوفك مقابلين بعضهم، كيما كان شادّ مطارق.", "Kfoufek m9ablin ba3dhhom, kima ken chedd mtare9."),
      t("Elbows stay still at your sides.", "Coudes immobiles le long du corps.", "المرافق ثابتين على جنابك.", "El mrafe9 thebtin 3la jnabek."),
      t("Curl up, squeeze, then lower slowly.", "Monte, serre, puis redescends lentement.", "طلّع، زيّر، ومبعد هبّط بشويّة.", "Tala3, zayyer, w mba3d habbet bechwaya."),
    ],
    mistakes: [
      t("Swinging with the hips.", "Prendre de l'élan avec les hanches.", "تاخو الدفعة بجنابك.", "Tekhou el daf3a b jnabek."),
      t("Shoulders rolling forward at the top.", "Épaules qui s'enroulent en haut.", "الكتاف يتلفّو لقدّام في الفوق.", "El ktef yetleffou l 9oddem fel fou9."),
    ],
    difficulty: 1,
    repRange: [10, 15],
  },
  'Standing_Biceps_Cable_Curl': {
    nameFr: "Curl biceps à la poulie basse",
    cues: [
      t("Bar on a low pulley, palms up, hands shoulder-width.", "Barre sur la poulie basse, paumes vers le haut, largeur d'épaules.", "البار على البولي اللوطانية، كفوفك لفوق، يديك في عرض الكتاف.", "La barre 3al poulie basse, kfoufek lel fou9, yeddik f 3ordh el ktef."),
      t("Elbows fixed at your sides, curl toward your chest.", "Coudes fixes le long du corps, monte vers la poitrine.", "المرافق ثابتين على جنابك، طلّع لصدرك.", "El mrafe9 thebtin 3la jnabek, tala3 l sadrek."),
      t("Lower slowly; the cable keeps tension the whole way.", "Redescends lentement, le câble garde la tension.", "هبّط بشويّة، الكابل يقعد مشدود من الأوّل للآخر.", "Habbet bechwaya, el câble yo93od machdoud mel louel lel e5er."),
    ],
    mistakes: [
      t("Leaning back to finish reps.", "Se pencher en arrière pour finir.", "تميّل لتالي باش تكمّل المرّات.", "Tmayel lteli bech tkammel les reps."),
      t("Elbows moving forward.", "Coudes qui avancent.", "المرافق يتحرّكو لقدّام.", "El mrafe9 yet7arkou l 9oddem."),
    ],
    difficulty: 1,
    repRange: [10, 15],
  },
  'Machine_Bicep_Curl': {
    nameFr: "Curl biceps à la machine",
    cues: [
      t("Set the seat so your armpits rest on top of the pad.", "Règle le siège pour que les aisselles reposent sur le coussin.", "ظبّط الكرسي باش باطك يرتاح فوق الكوسان.", "Dhabbet el korsi bech batek yerte7 fou9 el coussin."),
      t("Curl the handles up and squeeze at the top.", "Monte les poignées et serre en haut.", "طلّع المقابض وزيّر في الفوق.", "Tala3 les poignées w zayyer fel fou9."),
      t("Lower all the way with control.", "Redescends complètement en contrôle.", "هبّط للآخر بالكونترول.", "Habbet lel e5er bel contrôle."),
    ],
    mistakes: [
      t("Lifting the elbows off the pad.", "Décoller les coudes du coussin.", "تقلّع مرافقك من الكوسان.", "T9alla3 mrafe9ek mel coussin."),
      t("Partial range of motion.", "Amplitude incomplète.", "حركة موش كاملة.", "7arka mouch kemla."),
    ],
    difficulty: 1,
    repRange: [10, 15],
  },
  'EZ-Bar_Curl': {
    nameFr: "Curl à la barre EZ",
    cues: [
      t("Grip the angled parts of the bar, palms up.", "Saisis les parties inclinées de la barre, paumes vers le haut.", "شدّ البار من البلايص المعوّجة، كفوفك لفوق.", "Chedd la barre mel blayes el m3awja, kfoufek lel fou9."),
      t("Elbows pinned, curl the bar toward your upper chest.", "Coudes collés, monte la barre vers le haut de la poitrine.", "المرافق لاصقين، طلّع البار لصدرك من فوق.", "El mrafe9 las9in, tala3 la barre l sadrek mel fou9."),
      t("Lower slowly to full extension.", "Redescends lentement jusqu'à bras tendus.", "هبّط بشويّة لين يديك يتمدّو الكل.", "Habbet bechwaya lin yeddik yetmaddou lkol."),
    ],
    mistakes: [
      t("Rocking the hips to swing the bar.", "Balancer les hanches pour lancer la barre.", "تهزّ جنابك باش تطلّع البار بالدفعة.", "Tehezz jnabek bech ttala3 la barre bel daf3a."),
      t("Lifting the elbows at the top.", "Lever les coudes en haut.", "ترفع مرافقك في الفوق.", "Terfa3 mrafe9ek fel fou9."),
    ],
    difficulty: 1,
    repRange: [8, 12],
  },
  'Barbell_Curl': {
    nameFr: "Curl à la barre droite",
    cues: [
      t("Shoulder-width grip, palms up.", "Mains largeur d'épaules, paumes vers le haut.", "يديك في عرض الكتاف، كفوفك لفوق.", "Prise f 3ordh el ktef, kfoufek lel fou9."),
      t("Stand tall, elbows tight to your ribs.", "Debout bien droit, coudes serrés contre les côtes.", "اوقف دريت، مرافقك لاصقين في ضلوعك.", "O9ef dret, mrafe9ek las9in f dhlou3ek."),
      t("Curl up without leaning back, then lower slowly.", "Monte sans te pencher en arrière, puis redescends lentement.", "طلّع من غير ما تميّل لتالي، ومبعد هبّط بشويّة.", "Tala3 men 8ir ma tmayel lteli, w mba3d habbet bechwaya."),
    ],
    mistakes: [
      t("Swinging with the lower back.", "Se balancer avec le bas du dos.", "تهزّ بظهرك من لوطة.", "Tehezz b dharek mel louta."),
      t("Wrists curling back under the load.", "Poignets qui cassent sous la charge.", "معاصمك يتكسّرو تحت الثقل.", "Poignets mte3ek yetkassrou ta7t el charge."),
    ],
    difficulty: 2,
    avoidIf: ['wrists'],
    repRange: [8, 12],
  },
  'Dumbbell_Alternate_Bicep_Curl': {
    nameFr: "Curl alterné aux haltères",
    cues: [
      t("Curl one arm at a time, turning the palm up.", "Monte un bras à la fois en tournant la paume vers le haut.", "طلّع يد بيد، وانت تدوّر الكفّ لفوق.", "Tala3 yed b yed, w enti tdawwer el keff lel fou9."),
      t("Keep the resting arm straight and still.", "Garde le bras au repos tendu et immobile.", "اليد اللي ترتاح خلّيها ممدودة وثابتة.", "El yed eli terte7 khalliha mamdouda w thebta."),
      t("Elbows stay by your sides.", "Les coudes restent près du corps.", "المرافق يقعدو على جنابك.", "El mrafe9 yo93dou 3la jnabek."),
    ],
    mistakes: [
      t("Twisting the torso with each rep.", "Tourner le buste à chaque répétition.", "تدوّر بدنك في كل مرّة.", "Tdawwer badnek f kol rep."),
      t("Rushing the lowering phase.", "Redescendre trop vite.", "تهبّط بالفيسع.", "Thabbet bel fisa3."),
    ],
    difficulty: 1,
    repRange: [10, 15],
    unilateral: true,
  },
  'Concentration_Curls': {
    nameFr: "Curl concentré assis",
    cues: [
      t("Sit with the back of your upper arm against your inner thigh.", "Assis, l'arrière du bras contre l'intérieur de la cuisse.", "اقعد وحطّ ذراعك من تالي على فخذك من داخل.", "O93ed w 7ott dhra3ek men teli 3la fkhedhek men dakhel."),
      t("Curl the weight up; only the forearm moves.", "Monte le poids, seul l'avant-bras bouge.", "طلّع الثقل، الساعد وحدو اللي يتحرّك.", "Tala3 el charge, el sa3ed wa7dou eli yet7arrek."),
      t("Squeeze at the top, then lower slowly.", "Serre en haut, puis redescends lentement.", "زيّر في الفوق، ومبعد هبّط بشويّة.", "Zayyer fel fou9, w mba3d habbet bechwaya."),
      t("No dumbbell? Use a backpack, or a band under your foot.", "Pas d'haltère ? Prends un sac à dos ou un élastique sous le pied.", "ما عندكش هالتير؟ استعمل صاك ظهر، ولا إيلاستيك تحت ساقك.", "Ma 3andekch haltère? Esta3mel sac à dos, walla élastique ta7t sa9ek."),
    ],
    mistakes: [
      t("Lifting the elbow off the thigh.", "Décoller le coude de la cuisse.", "تقلّع المرفق من الفخذ.", "T9alla3 el morfe9 mel fkhedh."),
      t("Leaning back to help the lift.", "Se pencher en arrière pour aider.", "تميّل لتالي باش تسهّل.", "Tmayel lteli bech tsahhel."),
    ],
    difficulty: 1,
    repRange: [10, 15],
    unilateral: true,
  },
  'Incline_Dumbbell_Curl': {
    nameFr: "Curl incliné aux haltères",
    cues: [
      t("Lie back on a bench at about 45°, arms hanging.", "Allongé sur un banc à environ 45°, bras pendants.", "تمدّد على بانك مايل تقريب 45°، يديك مدلدلين.", "Tmadded 3la banc mayel ta9rib 45°, yeddik mdaldlin."),
      t("Curl up while keeping your elbows pointing down.", "Monte en gardant les coudes pointés vers le sol.", "طلّع وانت مخلّي مرافقك للوطة.", "Tala3 w enti mkhalli mrafe9ek lel louta."),
      t("Use lighter weights; the stretch makes it harder.", "Prends plus léger, l'étirement rend l'exercice plus dur.", "خوذ ثقل أخفّ، خاطر التمطيط يصعّبها.", "Khoudh charge akhaf, 5ater el étirement ysa33ebha."),
    ],
    mistakes: [
      t("Elbows swinging forward.", "Coudes qui partent vers l'avant.", "المرافق يتهزّو لقدّام.", "El mrafe9 yethazzou l 9oddem."),
      t("Head and shoulders coming off the bench.", "Tête et épaules qui décollent du banc.", "راسك وكتافك يتقلّعو من البانك.", "Rasek w ktefek yet9all3ou mel banc."),
    ],
    difficulty: 2,
    repRange: [10, 15],
  },
  'Standing_Concentration_Curl': {
    nameFr: "Curl concentré debout",
    cues: [
      t("Lean forward, working arm hanging straight down.", "Penche-toi en avant, le bras qui travaille pend à la verticale.", "ميّل لقدّام، واليد اللي تخدم مدلدلة لوطة.", "Mayel l 9oddem, w el yed eli tekhdem mdaldla louta."),
      t("Curl up while keeping the upper arm still.", "Monte en gardant le haut du bras immobile.", "طلّع وانت مخلّي ذراعك ثابت.", "Tala3 w enti mkhalli dhra3ek theb."),
      t("No dumbbell? Use a backpack, or a band under your foot.", "Pas d'haltère ? Prends un sac à dos ou un élastique sous le pied.", "ما عندكش هالتير؟ استعمل صاك ظهر، ولا إيلاستيك تحت ساقك.", "Ma 3andekch haltère? Esta3mel sac à dos, walla élastique ta7t sa9ek."),
    ],
    mistakes: [
      t("Swinging the arm.", "Balancer le bras.", "تهزّ في يدك.", "Tehezz f yeddek."),
      t("Rounding the back while leaning.", "Arrondir le dos en se penchant.", "تقوّس ظهرك وانت مميّل.", "T9awwes dharek w enti mmayel."),
    ],
    difficulty: 1,
    repRange: [10, 15],
    unilateral: true,
  },

  // ----- Triceps -----
  'Triceps_Pushdown_-_Rope_Attachment': {
    nameFr: "Extension triceps à la poulie (corde)",
    cues: [
      t("Rope on a high pulley, elbows glued to your sides.", "Corde sur la poulie haute, coudes collés au corps.", "الكورد على البولي العالية، مرافقك لاصقين في جنابك.", "La corde 3al poulie haute, mrafe9ek las9in f jnabek."),
      t("Push down and spread the rope ends at the bottom.", "Pousse vers le bas et écarte la corde en fin de mouvement.", "دزّ للوطة وفرّق طرفين الكورد في اللوطة.", "Dezz lel louta w farre9 tarfin la corde fel louta."),
      t("Only the forearms move; come back up to 90°.", "Seuls les avant-bras bougent, remonte jusqu'à 90°.", "السواعد وحدهم اللي يتحرّكو، وارجع لفوق لين 90°.", "El swa3ed wa7dhom eli yet7arkou, w erja3 lel fou9 lin 90°."),
    ],
    mistakes: [
      t("Elbows flaring or drifting forward.", "Coudes qui s'écartent ou avancent.", "المرافق يتحلّو ولا يمشيو لقدّام.", "El mrafe9 yet7allou walla yemchiw l 9oddem."),
      t("Leaning over the rope to use bodyweight.", "Se pencher sur la corde pour utiliser son poids.", "تميّل على الكورد باش تخدم بوزن بدنك.", "Tmayel 3la la corde bech tekhdem b poids badnek."),
    ],
    difficulty: 1,
    repRange: [10, 15],
  },
  'Triceps_Pushdown': {
    nameFr: "Extension triceps à la poulie (barre)",
    cues: [
      t("Grip the bar with elbows tucked at your sides.", "Saisis la barre, coudes collés au corps.", "شدّ البار ومرافقك لاصقين في جنابك.", "Chedd la barre w mrafe9ek las9in f jnabek."),
      t("Push down until your arms are straight, then squeeze.", "Pousse jusqu'à bras tendus, puis serre.", "دزّ للوطة لين يديك يتمدّو، ومبعد زيّر.", "Dezz lel louta lin yeddik yetmaddou, w mba3d zayyer."),
      t("Let the bar rise slowly to chest height.", "Laisse remonter la barre lentement à hauteur de poitrine.", "خلّي البار يطلع بشويّة لين طول صدرك.", "Khalli la barre tetla3 bechwaya lin toul sadrek."),
    ],
    mistakes: [
      t("Shoulders rolling forward to push.", "Épaules qui s'enroulent pour pousser.", "الكتاف يتلفّو لقدّام باش تدزّ.", "El ktef yetleffou l 9oddem bech tdezz."),
      t("Letting the weight yank your hands up.", "Laisser la charge remonter les mains d'un coup.", "تخلّي الثقل يجبد يديك لفوق بالقوّة.", "Tkhalli el charge tejbed yeddik lel fou9 bel 9owwa."),
    ],
    difficulty: 1,
    repRange: [10, 15],
  },
  'Cable_Rope_Overhead_Triceps_Extension': {
    nameFr: "Extension triceps au-dessus de la tête à la poulie",
    cues: [
      t("Face away from a low pulley, rope behind your head.", "Dos à la poulie basse, corde derrière la tête.", "عطي ظهرك للبولي اللوطانية، الكورد ورا راسك.", "A3ti dharek lel poulie basse, la corde wra rasek."),
      t("Elbows point forward, close to your head.", "Coudes vers l'avant, proches de la tête.", "المرافق لقدّام، قريبين من راسك.", "El mrafe9 l 9oddem, 9rab men rasek."),
      t("Straighten your arms overhead, then lower slowly.", "Tends les bras au-dessus de la tête, puis redescends lentement.", "مدّ يديك فوق راسك، ومبعد هبّط بشويّة.", "Medd yeddik fou9 rasek, w mba3d habbet bechwaya."),
    ],
    mistakes: [
      t("Elbows flaring wide.", "Coudes qui s'écartent.", "المرافق يتحلّو برشا.", "El mrafe9 yet7allou barcha."),
      t("Arching the lower back.", "Cambrer le bas du dos.", "تكمبري ظهرك من لوطة.", "Tcambri dharek mel louta."),
    ],
    difficulty: 2,
    avoidIf: ['shoulders'],
    repRange: [10, 15],
  },
  'Tricep_Dumbbell_Kickback': {
    nameFr: "Kickback triceps",
    cues: [
      t("Hinge forward with a flat back; rest a hand on a bench if needed.", "Penche-toi dos plat, une main sur un banc si besoin.", "ميّل لقدّام وظهرك دريت، حطّ يد على البانك كان لزم.", "Mayel l 9oddem w dharek dret, 7ott yed 3al banc ken lzem."),
      t("Upper arm parallel to the floor and still.", "Haut du bras parallèle au sol et immobile.", "ذراعك بالتوازي مع الأرض وثابت.", "Dhra3ek parallèle m3a l ardh w theb."),
      t("Straighten your arm back and squeeze for a second.", "Tends le bras vers l'arrière et serre une seconde.", "مدّ يدك لتالي وزيّر ثانية وحدة.", "Medd yeddek lteli w zayyer seconde wa7da."),
    ],
    mistakes: [
      t("Swinging the upper arm.", "Balancer le haut du bras.", "تهزّ في ذراعك.", "Tehezz f dhra3ek."),
      t("Using a weight that's too heavy.", "Prendre un poids trop lourd.", "تخدم بثقل كبير برشا.", "Tekhdem b charge kbira barcha."),
    ],
    difficulty: 1,
    repRange: [12, 15],
  },
  'EZ-Bar_Skullcrusher': {
    nameFr: "Barre au front (barre EZ)",
    cues: [
      t("Lie on a bench, bar over your chest, arms straight.", "Allongé sur un banc, barre au-dessus de la poitrine, bras tendus.", "تمدّد على البانك، البار فوق صدرك، يديك ممدودين.", "Tmadded 3al banc, la barre fou9 sadrek, yeddik mamdoudin."),
      t("Bend only the elbows, lowering the bar toward your forehead.", "Plie seulement les coudes, barre vers le front.", "اطوي كان المرافق، وهبّط البار لجبينك.", "Atwi ken el mrafe9, w habbet la barre l jbinek."),
      t("Elbows point to the ceiling, not out to the sides.", "Les coudes pointent vers le plafond, pas sur les côtés.", "المرافق للسقف، موش للجناب.", "El mrafe9 lel sa9f, mouch lel jnab."),
    ],
    mistakes: [
      t("Elbows flaring out.", "Coudes qui s'écartent.", "المرافق يتحلّو للبرّة.", "El mrafe9 yet7allou lel barra."),
      t("Going too heavy and losing control.", "Prendre trop lourd et perdre le contrôle.", "تاخو ثقيل برشا وتخسر الكونترول.", "Tekhou t9il barcha w tkhassar el contrôle."),
    ],
    difficulty: 2,
    repRange: [8, 12],
  },
  'Close-Grip_Barbell_Bench_Press': {
    nameFr: "Développé couché prise serrée",
    cues: [
      t("Hands shoulder-width on the bar, not touching.", "Mains largeur d'épaules sur la barre, sans se toucher.", "يديك في عرض الكتاف على البار، موش لاصقين.", "Yeddik f 3ordh el ktef 3la la barre, mouch las9in."),
      t("Elbows tucked close as you lower to your lower chest.", "Coudes près du corps en descendant vers le bas des pectoraux.", "المرافق قريبين من بدنك وانت تهبّط للوطة صدرك.", "El mrafe9 9rab men badnek w enti thabbet l louta sadrek."),
      t("Press up by straightening your arms.", "Pousse en tendant les bras.", "دزّ لفوق وانت تمدّ يديك.", "Dezz lel fou9 w enti tmedd yeddik."),
      t("Use safety bars or a spotter.", "Utilise des sécurités ou un partenaire.", "استعمل السيكوريتي ولا خلّي حدّ يوقف معاك.", "Esta3mel les sécurités walla khalli 7add yo9ef m3ak."),
    ],
    mistakes: [
      t("Grip so narrow that the wrists bend.", "Prise si serrée que les poignets se tordent.", "شدّة ضيّقة برشا والمعاصم يتلواو.", "Prise dhay9a barcha w el poignets yetlwew."),
      t("Elbows flaring out.", "Coudes qui s'écartent.", "المرافق يتحلّو للبرّة.", "El mrafe9 yet7allou lel barra."),
    ],
    difficulty: 3,
    avoidIf: ['wrists'],
    repRange: [6, 10],
  },
  'Seated_Triceps_Press': {
    nameFr: "Extension triceps assis avec haltère",
    cues: [
      t("Sit with back support, one dumbbell overhead in both hands.", "Assis dos calé, un haltère au-dessus de la tête à deux mains.", "اقعد وظهرك مسنّد، هالتير واحد فوق راسك بيديك الزوز.", "O93ed w dharek msanned, haltère wa7ed fou9 rasek b yeddik ezzouz."),
      t("Elbows stay close to your head.", "Les coudes restent près de la tête.", "المرافق يقعدو قريبين من راسك.", "El mrafe9 yo93dou 9rab men rasek."),
      t("Lower it behind your head, then straighten your arms.", "Descends-le derrière la tête, puis tends les bras.", "هبّطو ورا راسك، ومبعد مدّ يديك.", "Habbtou wra rasek, w mba3d medd yeddik."),
    ],
    mistakes: [
      t("Elbows flaring wide.", "Coudes qui s'écartent.", "المرافق يتحلّو برشا.", "El mrafe9 yet7allou barcha."),
      t("Arching the lower back.", "Cambrer le bas du dos.", "تكمبري ظهرك من لوطة.", "Tcambri dharek mel louta."),
    ],
    difficulty: 1,
    avoidIf: ['shoulders'],
    repRange: [10, 15],
  },
  'Lying_Dumbbell_Tricep_Extension': {
    nameFr: "Extension triceps couché aux haltères",
    cues: [
      t("Lie on a bench, dumbbells over your chest, palms in.", "Allongé sur un banc, haltères au-dessus de la poitrine, paumes face à face.", "تمدّد على البانك، الهالتيرات فوق صدرك، كفوفك مقابلين بعضهم.", "Tmadded 3al banc, les haltères fou9 sadrek, kfoufek m9ablin ba3dhhom."),
      t("Bend your elbows, lowering the weights beside your head.", "Plie les coudes, haltères à côté de la tête.", "اطوي مرافقك وهبّط الثقل حذا راسك.", "Atwi mrafe9ek w habbet el charge 7dhe rasek."),
      t("Keep upper arms still and straighten back up.", "Garde le haut des bras immobile et remonte en tendant.", "خلّي ذراعاتك ثابتين ومدّ يديك باش تطلع.", "Khalli dhra3atek thebtin w medd yeddik bech tetla3."),
    ],
    mistakes: [
      t("Upper arms moving back and forth.", "Haut des bras qui bouge d'avant en arrière.", "ذراعاتك يتحرّكو لقدّام ولتالي.", "Dhra3atek yet7arkou l 9oddem w lteli."),
      t("Lowering too fast near your face.", "Descendre trop vite près du visage.", "تهبّط بالفيسع حذا وجهك.", "Thabbet bel fisa3 7dhe wejhek."),
    ],
    difficulty: 2,
    repRange: [10, 15],
  },
  'Bench_Dips': {
    nameFr: "Dips sur banc (ou chaise)",
    cues: [
      t("Hands on the edge of a sturdy bench or chair behind you.", "Mains sur le bord d'un banc ou d'une chaise solide derrière toi.", "يديك على طرف بانك ولا كرسي صحيح وراك.", "Yeddik 3la tarf banc walla korsi s7i7 wrak."),
      t("Keep your hips close to the bench, elbows pointing back.", "Fesses près du banc, coudes vers l'arrière.", "خلّي جنابك قريبين من البانك، المرافق لتالي.", "Khalli jnabek 9rab mel banc, el mrafe9 lteli."),
      t("Lower until elbows reach about 90°, then push up.", "Descends jusqu'à environ 90° aux coudes, puis remonte.", "هبّط لين المرافق يوصلو تقريب 90°، ومبعد دزّ لفوق.", "Habbet lin el mrafe9 youslou ta9rib 90°, w mba3d dezz lel fou9."),
      t("Bend your knees to make it easier.", "Plie les genoux pour faciliter.", "اطوي ركايبك باش تسهّل على روحك.", "Atwi rkaybek bech tsahhel 3la rou7ek."),
    ],
    mistakes: [
      t("Dipping too deep and straining the shoulders.", "Descendre trop bas et forcer sur les épaules.", "تهبّط برشا وتضرّ كتافك.", "Thabbet barcha w tdhorr ktefek."),
      t("Shoulders shrugging up to the ears.", "Épaules qui montent vers les oreilles.", "الكتاف يطلعو لوذنيك.", "El ktef yetl3ou l wedhnik."),
    ],
    difficulty: 1,
    avoidIf: ['shoulders', 'wrists'],
    repRange: [8, 15],
  },
  'Incline_Push-Up_Close-Grip': {
    nameFr: "Pompes inclinées mains serrées",
    cues: [
      t("Hands close together on a sturdy table or bench edge.", "Mains rapprochées sur le bord d'une table solide ou d'un banc.", "يديك قريبين لبعضهم على طرف طاولة صحيحة ولا بانك.", "Yeddik 9rab l ba3dhhom 3la tarf tawla s7i7a walla banc."),
      t("Elbows brush your ribs as you lower.", "Les coudes frôlent les côtes en descendant.", "المرافق يمسّو ضلوعك وانت تهبّط.", "El mrafe9 ymessou dhlou3ek w enti thabbet."),
      t("Body straight; push away until your arms are straight.", "Corps droit, repousse jusqu'à bras tendus.", "بدنك دريت، دزّ لين يديك يتمدّو.", "Badnek dret, dezz lin yeddik yetmaddou."),
    ],
    mistakes: [
      t("Elbows flaring out.", "Coudes qui s'écartent.", "المرافق يتحلّو للبرّة.", "El mrafe9 yet7allou lel barra."),
      t("Hips sagging.", "Hanches qui s'affaissent.", "جنابك يطيحو.", "Jnabek yti7ou."),
    ],
    difficulty: 1,
    repRange: [8, 15],
  },
  'Body_Tricep_Press': {
    nameFr: "Extension triceps au poids du corps",
    cues: [
      t("Hands on a sturdy table edge, step your feet back.", "Mains sur le bord d'une table solide, recule les pieds.", "يديك على طرف طاولة صحيحة، ورجّع ساقيك لتالي.", "Yeddik 3la tarf tawla s7i7a, w rajja3 sa9ik lteli."),
      t("Bend only the elbows, bringing your forehead toward your hands.", "Plie seulement les coudes, front vers les mains.", "اطوي كان المرافق، وقرّب جبينك ليديك.", "Atwi ken el mrafe9, w 9arreb jbinek l yeddik."),
      t("Straighten your arms to push back up.", "Tends les bras pour remonter.", "مدّ يديك باش تطلع.", "Medd yeddik bech tetla3."),
      t("Feet further back makes it harder.", "Plus les pieds sont loin, plus c'est dur.", "كل ما ساقيك أبعد، كل ما أصعب.", "Kol ma sa9ik ab3ed, kol ma as3ab."),
    ],
    mistakes: [
      t("Turning it into a push-up with flared elbows.", "En faire une pompe avec les coudes écartés.", "تردّها بومب والمرافق محلولين.", "Traddha pompe w el mrafe9 m7loulin."),
      t("Hips sagging.", "Hanches qui s'affaissent.", "جنابك يطيحو.", "Jnabek yti7ou."),
    ],
    difficulty: 2,
    avoidIf: ['wrists'],
    repRange: [8, 15],
  },
  'Push-Ups_-_Close_Triceps_Position': {
    nameFr: "Pompes mains serrées (triceps)",
    cues: [
      t("Hands under your chest, close together.", "Mains sous la poitrine, rapprochées.", "يديك تحت صدرك، قريبين لبعضهم.", "Yeddik ta7t sadrek, 9rab l ba3dhhom."),
      t("Elbows stay tight to your ribs.", "Les coudes restent collés aux côtes.", "المرافق يقعدو لاصقين في ضلوعك.", "El mrafe9 yo93dou las9in f dhlou3ek."),
      t("Drop to your knees if you lose form.", "Passe sur les genoux si tu perds la technique.", "حطّ ركايبك في الأرض كان ما عادش تخدم صحيح.", "7ott rkaybek fel ardh ken ma 3adech tekhdem s7i7."),
    ],
    mistakes: [
      t("Elbows flaring out.", "Coudes qui s'écartent.", "المرافق يتحلّو للبرّة.", "El mrafe9 yet7allou lel barra."),
      t("Hips sagging.", "Hanches qui s'affaissent.", "جنابك يطيحو.", "Jnabek yti7ou."),
    ],
    difficulty: 2,
    avoidIf: ['wrists'],
    repRange: [6, 12],
  },
  'Speed_Band_Overhead_Triceps': {
    nameFr: "Extension triceps au-dessus de la tête avec élastique",
    cues: [
      t("Stand on the band and hold it behind your head.", "Debout sur l'élastique, tiens-le derrière la tête.", "اوقف على الإيلاستيك وشدّو ورا راسك.", "O9ef 3al élastique w cheddou wra rasek."),
      t("Elbows point up and stay close to your head.", "Coudes vers le haut, proches de la tête.", "المرافق لفوق ويقعدو قريبين من راسك.", "El mrafe9 lel fou9 w yo93dou 9rab men rasek."),
      t("Straighten your arms overhead, then lower slowly.", "Tends les bras au-dessus de la tête, puis redescends lentement.", "مدّ يديك فوق راسك، ومبعد هبّط بشويّة.", "Medd yeddik fou9 rasek, w mba3d habbet bechwaya."),
    ],
    mistakes: [
      t("Elbows drifting forward.", "Coudes qui partent vers l'avant.", "المرافق يمشيو لقدّام.", "El mrafe9 yemchiw l 9oddem."),
      t("Arching the back.", "Se cambrer.", "تكمبري ظهرك.", "Tcambri dharek."),
    ],
    difficulty: 1,
    avoidIf: ['shoulders'],
    repRange: [12, 20],
  },
  'Band_Skull_Crusher': {
    nameFr: "Barre au front avec élastique",
    cues: [
      t("Anchor the band low, behind your head.", "Fixe l'élastique en bas, derrière ta tête.", "اربط الإيلاستيك لوطة، ورا راسك.", "Orbot el élastique louta, wra rasek."),
      t("Upper arms vertical; bend the elbows to bring hands back.", "Bras verticaux, plie les coudes pour ramener les mains.", "ذراعاتك واقفين، اطوي المرافق باش ترجّع يديك لتالي.", "Dhra3atek w9fin, atwi el mrafe9 bech trajja3 yeddik lteli."),
      t("Straighten your arms fully, then return slowly.", "Tends complètement les bras, puis reviens lentement.", "مدّ يديك الكل، ومبعد ارجع بشويّة.", "Medd yeddik lkol, w mba3d erja3 bechwaya."),
    ],
    mistakes: [
      t("Upper arms swinging.", "Haut des bras qui bouge.", "ذراعاتك يتهزّو.", "Dhra3atek yethazzou."),
      t("Elbows flaring out.", "Coudes qui s'écartent.", "المرافق يتحلّو للبرّة.", "El mrafe9 yet7allou lel barra."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },

  // ----- Quad focus -----
  'Leg_Extensions': {
    nameFr: "Leg extension (machine)",
    cues: [
      t("Line your knee up with the machine's pivot point.", "Aligne le genou avec l'axe de la machine.", "حطّ ركبتك قبالة المحور متاع الماشينة.", "7ott rokbtek 9bala l'axe mta3 el machine."),
      t("Pad on your lower shin, just above the ankle.", "Coussin sur le bas du tibia, juste au-dessus de la cheville.", "الكوسان على ساقك من لوطة، فوق الكعبة بشويّة.", "El coussin 3la sa9ek mel louta, fou9 el ka3ba bechwaya."),
      t("Straighten your legs, squeeze your thighs, lower slowly.", "Tends les jambes, serre les cuisses, redescends lentement.", "مدّ ساقيك، زيّر فخاذك، وهبّط بشويّة.", "Medd sa9ik, zayyer fkhedhek, w habbet bechwaya."),
      t("Knees sensitive? Go light and use a shorter range.", "Genoux sensibles ? Charge légère et amplitude réduite.", "ركايبك حسّاسين؟ خوذ خفيف وقصّر الحركة.", "Rkaybek 7assasin? Khoudh khfif w 9assar el 7arka."),
    ],
    mistakes: [
      t("Kicking the weight up with momentum.", "Lancer la charge avec élan.", "تطيّش الثقل لفوق بالدفعة.", "Ttayyech el charge lel fou9 bel daf3a."),
      t("Hips lifting off the seat.", "Fesses qui décollent du siège.", "جنابك يتقلّعو من الكرسي.", "Jnabek yet9all3ou mel korsi."),
    ],
    difficulty: 1,
    repRange: [10, 15],
  },
  'Single-Leg_Leg_Extension': {
    nameFr: "Leg extension unilatéral",
    cues: [
      t("Same setup as the leg extension, one leg at a time.", "Même réglage qu'au leg extension, une jambe à la fois.", "نفس التظبيط متاع الـ leg extension، ساق بساق.", "Nafs el réglage mta3 el leg extension, sa9 b sa9."),
      t("Straighten the leg fully and pause at the top.", "Tends la jambe complètement et marque une pause en haut.", "مدّ ساقك الكل واستنّى شويّة في الفوق.", "Medd sa9ek lkol w ostanna chwaya fel fou9."),
      t("Start each set with your weaker leg.", "Commence chaque série par ta jambe la plus faible.", "ابدا كل سيري بالساق الأضعف.", "Ebda kol série bel sa9 eli adh3af."),
    ],
    mistakes: [
      t("Twisting the hips to lift.", "Tourner le bassin pour soulever.", "تدوّر جنابك باش تطلّع.", "Tdawwer jnabek bech ttala3."),
      t("Dropping the weight quickly.", "Laisser retomber la charge vite.", "تطيّح الثقل بالفيسع.", "Ttayya7 el charge bel fisa3."),
    ],
    difficulty: 1,
    repRange: [10, 15],
    unilateral: true,
  },
  'Single-Leg_High_Box_Squat': {
    nameFr: "Squat unilatéral sur marche haute",
    cues: [
      t("Stand on a sturdy step with one leg, holding a support.", "Debout sur une marche solide avec une jambe, en tenant un appui.", "اوقف بساق وحدة على درجة صحيحة، وشدّ في حاجة.", "O9ef b sa9 wa7da 3la daraja s7i7a, w chedd f 7aja."),
      t("Slowly lower the free heel toward the floor.", "Descends lentement le talon libre vers le sol.", "هبّط كعب الساق الأخرى للأرض بشويّة.", "Habbet ka3b el sa9 lo5ra lel ardh bechwaya."),
      t("Push through the standing heel to rise.", "Pousse dans le talon d'appui pour remonter.", "دزّ في كعب الساق اللي واقف عليها باش تطلع.", "Dezz f ka3b el sa9 eli we9ef 3liha bech tetla3."),
      t("Keep the working knee over your toes.", "Garde le genou qui travaille au-dessus des orteils.", "خلّي الركبة اللي تخدم فوق صوابع ساقك.", "Khalli el rokba eli tekhdem fou9 swaba3 sa9ek."),
    ],
    mistakes: [
      t("Knee caving inward.", "Genou qui rentre vers l'intérieur.", "الركبة تدخل للداخل.", "El rokba todkhol lel dakhel."),
      t("Pushing off the floor with the free foot.", "Pousser sur le sol avec le pied libre.", "تدزّ في الأرض بالساق الأخرى.", "Tdezz fel ardh bel sa9 lo5ra."),
    ],
    difficulty: 2,
    avoidIf: ['knees'],
    repRange: [8, 12],
    unilateral: true,
  },
  'Hip_Flexion_with_Band': {
    nameFr: "Flexion de hanche avec élastique",
    cues: [
      t("Band around one ankle, anchored low behind you.", "Élastique à une cheville, attaché en bas derrière toi.", "الإيلاستيك في كعبة وحدة، مربوط لوطة وراك.", "El élastique f ka3ba wa7da, marbout louta wrak."),
      t("Stand tall and hold a support if needed.", "Tiens-toi droit, avec un appui si besoin.", "اوقف دريت وشدّ في حاجة كان لزم.", "O9ef dret w chedd f 7aja ken lzem."),
      t("Drive the knee up to hip height, pause, lower slowly.", "Monte le genou à hauteur de hanche, pause, redescends lentement.", "طلّع الركبة لين طول جنبك، استنّى، وهبّط بشويّة.", "Tala3 el rokba lin toul jnabek, ostanna, w habbet bechwaya."),
    ],
    mistakes: [
      t("Leaning back to lift the knee.", "Se pencher en arrière pour monter le genou.", "تميّل لتالي باش تطلّع الركبة.", "Tmayel lteli bech ttala3 el rokba."),
      t("Letting the band snap the leg back.", "Laisser l'élastique ramener la jambe d'un coup.", "تخلّي الإيلاستيك يرجّع ساقك بالخبطة.", "Tkhalli el élastique yrajja3 sa9ek bel khabta."),
    ],
    difficulty: 1,
    repRange: [12, 20],
    unilateral: true,
  },

  // ----- Hamstring curl -----
  'Seated_Leg_Curl': {
    nameFr: "Leg curl assis",
    cues: [
      t("Knees lined up with the pivot, lap pad snug on your thighs.", "Genoux alignés avec l'axe, coussin bien serré sur les cuisses.", "ركايبك قبالة المحور، والكوسان مشدود على فخاذك.", "Rkaybek 9bala l'axe, w el coussin machdoud 3la fkhedhek."),
      t("Curl your heels down and back as far as possible.", "Ramène les talons vers l'arrière le plus loin possible.", "جيب كعبيك للوطة ولتالي قدّ ما تنجّم.", "Jib ka3bik lel louta w lteli 9add ma tnajjem."),
      t("Return slowly; don't let the weight slam.", "Reviens lentement, sans laisser claquer la charge.", "ارجع بشويّة، ما تخلّيش الثقل يخبط.", "Erja3 bechwaya, ma tkhallich el charge tokhbot."),
    ],
    mistakes: [
      t("Lap pad too loose, so the hips lift.", "Coussin trop lâche, les hanches se soulèvent.", "الكوسان محلول برشا، والجناب يتقلّعو.", "El coussin m7loul barcha, w el jnab yet9all3ou."),
      t("Short, fast reps.", "Répétitions courtes et rapides.", "مرّات قصار وبالفيسع.", "Reps 9sar w bel fisa3."),
    ],
    difficulty: 1,
    repRange: [10, 15],
  },
  'Lying_Leg_Curls': {
    nameFr: "Leg curl allongé",
    cues: [
      t("Lie face down with the pad just above your heels.", "Allongé sur le ventre, coussin juste au-dessus des talons.", "تمدّد على كرشك، والكوسان فوق كعبيك بشويّة.", "Tmadded 3la krechek, w el coussin fou9 ka3bik bechwaya."),
      t("Keep your hips pressed into the bench.", "Garde les hanches plaquées contre le banc.", "خلّي جنابك لاصقين في البانك.", "Khalli jnabek las9in fel banc."),
      t("Curl your heels toward your glutes, then lower slowly.", "Ramène les talons vers les fessiers, puis redescends lentement.", "جيب كعبيك للفيسيي، ومبعد هبّط بشويّة.", "Jib ka3bik lel fessiers, w mba3d habbet bechwaya."),
    ],
    mistakes: [
      t("Hips rising off the bench.", "Hanches qui décollent du banc.", "جنابك يتقلّعو من البانك.", "Jnabek yet9all3ou mel banc."),
      t("Kicking the weight up with momentum.", "Lancer la charge avec élan.", "تطيّش الثقل لفوق بالدفعة.", "Ttayyech el charge lel fou9 bel daf3a."),
    ],
    difficulty: 1,
    repRange: [10, 15],
  },
  'Standing_Leg_Curl': {
    nameFr: "Leg curl debout unilatéral",
    cues: [
      t("Pad behind your lower calf, hands on the handles.", "Coussin derrière le bas du mollet, mains sur les poignées.", "الكوسان ورا المولي من لوطة، يديك على المقابض.", "El coussin wra el mollet mel louta, yeddik 3al poignées."),
      t("Curl your heel toward your glute, hips still.", "Ramène le talon vers le fessier, bassin immobile.", "جيب كعبك للفيسيي، جنابك ثابتين.", "Jib ka3bek lel fessier, jnabek thebtin."),
      t("Lower slowly back to a straight leg.", "Redescends lentement jusqu'à jambe tendue.", "هبّط بشويّة لين ساقك تتمدّ.", "Habbet bechwaya lin sa9ek tetmadd."),
    ],
    mistakes: [
      t("Swinging the hips.", "Balancer le bassin.", "تهزّ في جنابك.", "Tehezz f jnabek."),
      t("Lifting the thigh forward.", "Avancer la cuisse.", "تقدّم فخذك لقدّام.", "T9addem fkhedhek l 9oddem."),
    ],
    difficulty: 1,
    repRange: [10, 15],
    unilateral: true,
  },
  'Ball_Leg_Curl': {
    nameFr: "Leg curl sur ballon de gym",
    cues: [
      t("Lie on your back with your heels on a stability ball.", "Sur le dos, talons posés sur un ballon de gym.", "تمدّد على ظهرك وكعبيك على بالون جيم.", "Tmadded 3la dharek w ka3bik 3la ballon de gym."),
      t("Lift your hips, then roll the ball toward your butt.", "Monte les hanches, puis roule le ballon vers tes fesses.", "طلّع جنابك، ومبعد دحرج البالون للفيسيي.", "Tala3 jnabek, w mba3d da7rej el ballon lel fessiers."),
      t("Keep your hips high the whole time.", "Garde les hanches hautes tout du long.", "خلّي جنابك لفوق طول.", "Khalli jnabek lel fou9 toul."),
    ],
    mistakes: [
      t("Hips dropping as you curl.", "Hanches qui retombent pendant le curl.", "جنابك يطيحو وانت تجبد.", "Jnabek yti7ou w enti tejbed."),
      t("Rolling the ball too fast.", "Rouler le ballon trop vite.", "تدحرج البالون بالفيسع برشا.", "Tda7rej el ballon bel fisa3 barcha."),
    ],
    difficulty: 2,
    repRange: [8, 12],
  },
  'Glute_Ham_Raise': {
    nameFr: "Glute ham raise (machine)",
    cues: [
      t("Knees just behind the pad, feet locked in.", "Genoux juste derrière le coussin, pieds bloqués.", "ركايبك ورا الكوسان بشويّة، ساقيك مشدودين.", "Rkaybek wra el coussin bechwaya, sa9ik machdoudin."),
      t("Keep a straight line from knees to head.", "Garde une ligne droite des genoux à la tête.", "خلّي خطّ دريت من ركايبك لراسك.", "Khalli khatt dret men rkaybek l rasek."),
      t("Pull yourself up with your hamstrings, toes pressing the plate.", "Remonte avec l'arrière des cuisses, orteils contre la plaque.", "اطلع بعضلات فخاذك من تالي، وصوابع ساقيك يدزّو في البلاكة.", "Etla3 b les ischios, w swaba3 sa9ik ydezzou fel plaque."),
    ],
    mistakes: [
      t("Bending at the hips instead of the knees.", "Plier les hanches au lieu des genoux.", "تطوي من جنابك عوض ركايبك.", "Ttawi men jnabek 3awedh rkaybek."),
      t("Dropping down without control.", "Redescendre sans contrôle.", "تطيح للوطة بلاش كونترول.", "Tti7 lel louta blech contrôle."),
    ],
    difficulty: 3,
    avoidIf: ['knees'],
    repRange: [5, 10],
  },
  'Platform_Hamstring_Slides': {
    nameFr: "Glissés ischios avec serviette",
    cues: [
      t("Lie on your back on a smooth floor, towel under one heel.", "Sur le dos, sur un sol lisse, serviette sous un talon.", "تمدّد على ظهرك في أرض ملسة، فوطة تحت كعب واحد.", "Tmadded 3la dharek f ardh malsa, fouta ta7t ka3b wa7ed."),
      t("Slide the heel toward your butt by bending the knee.", "Fais glisser le talon vers tes fesses en pliant le genou.", "زلّق الكعب للفيسيي وانت تطوي ركبتك.", "Zalle9 el ka3b lel fessiers w enti ttawi rokbtek."),
      t("Slide back out slowly.", "Ramène la jambe lentement.", "رجّع ساقك بشويّة.", "Rajja3 sa9ek bechwaya."),
      t("Lift your hips slightly to make it harder.", "Soulève un peu les hanches pour corser.", "طلّع جنابك شويّة باش تصعّبها.", "Tala3 jnabek chwaya bech tsa33ebha."),
    ],
    mistakes: [
      t("Using a floor that grips, like carpet.", "Utiliser un sol qui accroche, comme la moquette.", "تخدم على أرض تشدّ، كيما الزربية.", "Tekhdem 3la ardh tchedd, kima ezzarbiya."),
      t("Rushing the return.", "Revenir trop vite.", "ترجع بالفيسع.", "Terja3 bel fisa3."),
    ],
    difficulty: 1,
    repRange: [8, 15],
    unilateral: true,
  },
  'Floor_Glute-Ham_Raise': {
    nameFr: "Nordic curl au sol",
    cues: [
      t("Kneel on a cushion, ankles anchored under a sofa or by a partner.", "À genoux sur un coussin, chevilles bloquées sous un canapé ou par un partenaire.", "اركع على مخدّة، وكعباتك مشدودين تحت الكنابي ولا يشدّهملك صاحبك.", "Erka3 3la mkhadda, w ka3betek machdoudin ta7t el canapé walla ycheddhomlek sa7bek."),
      t("Body straight from knees to head.", "Corps droit des genoux à la tête.", "بدنك دريت من ركايبك لراسك.", "Badnek dret men rkaybek l rasek."),
      t("Lower forward as slowly as you can.", "Descends vers l'avant le plus lentement possible.", "هبّط لقدّام بشويّة قدّ ما تنجّم.", "Habbet l 9oddem bechwaya 9add ma tnajjem."),
      t("Catch yourself with your hands and push back up.", "Rattrape-toi avec les mains et repousse pour remonter.", "شدّ روحك بيديك ودزّ باش تطلع.", "Chedd rou7ek b yeddik w dezz bech tetla3."),
    ],
    mistakes: [
      t("Bending at the hips to cheat.", "Plier les hanches pour tricher.", "تطوي من جنابك باش تغشّ.", "Ttawi men jnabek bech t8ech."),
      t("Using an anchor that isn't stable.", "Utiliser un point d'ancrage pas stable.", "تشدّ ساقيك في حاجة موش ثابتة.", "Tchedd sa9ik f 7aja mouch thebta."),
    ],
    difficulty: 3,
    avoidIf: ['knees'],
    repRange: [3, 8],
  },
  'Seated_Band_Hamstring_Curl': {
    nameFr: "Leg curl assis avec élastique",
    cues: [
      t("Anchor the band low in front, loop it behind your ankles.", "Fixe l'élastique en bas devant toi, boucle derrière les chevilles.", "اربط الإيلاستيك لوطة قدّامك، ودوّرو ورا كعباتك.", "Orbot el élastique louta 9eddemek, w dawwrou wra ka3betek."),
      t("Sit on a chair or bench with legs straight.", "Assis sur une chaise ou un banc, jambes tendues.", "اقعد على كرسي ولا بانك، ساقيك ممدودين.", "O93ed 3la korsi walla banc, sa9ik mamdoudin."),
      t("Curl your heels under the seat, then return slowly.", "Ramène les talons sous le siège, puis reviens lentement.", "جيب كعبيك تحت الكرسي، ومبعد ارجع بشويّة.", "Jib ka3bik ta7t el korsi, w mba3d erja3 bechwaya."),
    ],
    mistakes: [
      t("Band slipping off the ankles.", "Élastique qui glisse des chevilles.", "الإيلاستيك يزلق من كعباتك.", "El élastique yezle9 men ka3betek."),
      t("Letting the band snap the legs forward.", "Laisser l'élastique tirer les jambes d'un coup.", "تخلّي الإيلاستيك يجبد ساقيك لقدّام بالخبطة.", "Tkhalli el élastique yejbed sa9ik l 9oddem bel khabta."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },

  // ----- Calves -----
  'Standing_Calf_Raises': {
    nameFr: "Mollets debout à la machine",
    cues: [
      t("Balls of your feet on the block, heels hanging off.", "Avant des pieds sur la cale, talons dans le vide.", "قدّام ساقيك على الكال، وكعبيك في الفراغ.", "9eddem sa9ik 3al cale, w ka3bik fel fra8."),
      t("Lower your heels for a deep stretch and pause.", "Descends les talons pour un bon étirement, puis pause.", "هبّط كعبيك باش تتمطّ مليح، واستنّى شويّة.", "Habbet ka3bik bech tetmatt mli7, w ostanna chwaya."),
      t("Rise as high as you can and squeeze.", "Monte le plus haut possible et serre.", "اطلع قدّ ما تنجّم لفوق وزيّر.", "Etla3 9add ma tnajjem lel fou9 w zayyer."),
    ],
    mistakes: [
      t("Bouncing quickly with no pause.", "Rebondir vite sans pause.", "تنقّز بالفيسع بلاش وقفة.", "Tna99ez bel fisa3 blech wa9fa."),
      t("Bending the knees to help.", "Plier les genoux pour aider.", "تطوي ركايبك باش تعاون روحك.", "Ttawi rkaybek bech t3awen rou7ek."),
    ],
    difficulty: 1,
    avoidIf: ['lower_back'],
    repRange: [12, 20],
  },
  'Seated_Calf_Raise': {
    nameFr: "Mollets assis à la machine",
    cues: [
      t("Pad snug on your lower thighs, balls of feet on the block.", "Coussin serré sur le bas des cuisses, avant des pieds sur la cale.", "الكوسان مشدود على فخاذك من لوطة، قدّام ساقيك على الكال.", "El coussin machdoud 3la fkhedhek mel louta, 9eddem sa9ik 3al cale."),
      t("Lower your heels fully, then push up high.", "Descends complètement les talons, puis pousse haut.", "هبّط كعبيك للآخر، ومبعد دزّ لفوق برشا.", "Habbet ka3bik lel e5er, w mba3d dezz lel fou9 barcha."),
      t("Pause one second at the top.", "Marque une seconde en haut.", "استنّى ثانية وحدة في الفوق.", "Ostanna seconde wa7da fel fou9."),
    ],
    mistakes: [
      t("Tiny, fast reps.", "Petites répétitions rapides.", "مرّات صغار وبالفيسع.", "Reps s8ar w bel fisa3."),
      t("Rolling onto the little toes.", "Rouler sur les petits orteils.", "تميّل على الصوابع الصغار.", "Tmayel 3al swaba3 es8ar."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },
  'Calf_Press_On_The_Leg_Press_Machine': {
    nameFr: "Mollets à la presse",
    cues: [
      t("Balls of your feet on the platform edge, legs nearly straight.", "Avant des pieds au bord du plateau, jambes presque tendues.", "قدّام ساقيك على طرف البلاتو، ساقيك تقريب ممدودين.", "9eddem sa9ik 3la tarf el plateau, sa9ik ta9rib mamdoudin."),
      t("Push the platform with your toes, then lower slowly.", "Pousse le plateau avec les orteils, puis redescends lentement.", "دزّ البلاتو بصوابعك، ومبعد هبّط بشويّة.", "Dezz el plateau b swaba3ek, w mba3d habbet bechwaya."),
      t("Keep the safety handles within reach.", "Garde les sécurités à portée de main.", "خلّي السيكوريتي قريبة من يدك.", "Khalli les sécurités 9rib men yeddek."),
    ],
    mistakes: [
      t("Feet slipping off the platform.", "Pieds qui glissent du plateau.", "ساقيك يزلقو من البلاتو.", "Sa9ik yezel9ou mel plateau."),
      t("Bending the knees to move the weight.", "Plier les genoux pour bouger la charge.", "تطوي ركايبك باش تحرّك الثقل.", "Ttawi rkaybek bech t7arrek el charge."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },
  'Smith_Machine_Calf_Raise': {
    nameFr: "Mollets debout à la Smith machine",
    cues: [
      t("Bar on your upper back, balls of your feet on a step.", "Barre sur le haut du dos, avant des pieds sur une cale.", "البار على ظهرك من فوق، قدّام ساقيك على درجة.", "La barre 3la dharek mel fou9, 9eddem sa9ik 3la daraja."),
      t("Lower your heels for a stretch, then rise up high.", "Descends les talons pour étirer, puis monte haut.", "هبّط كعبيك باش تتمطّ، ومبعد اطلع لفوق برشا.", "Habbet ka3bik bech tetmatt, w mba3d etla3 lel fou9 barcha."),
      t("Move slowly and pause at the top.", "Bouge lentement et marque une pause en haut.", "تحرّك بشويّة واستنّى شويّة في الفوق.", "T7arrek bechwaya w ostanna chwaya fel fou9."),
    ],
    mistakes: [
      t("Bouncing out of the stretch.", "Rebondir en bas.", "تنقّز من اللوطة.", "Tna99ez mel louta."),
      t("Rounding the back under the bar.", "Arrondir le dos sous la barre.", "تقوّس ظهرك تحت البار.", "T9awwes dharek ta7t la barre."),
    ],
    difficulty: 1,
    avoidIf: ['lower_back'],
    repRange: [12, 20],
  },
  'Standing_Dumbbell_Calf_Raise': {
    nameFr: "Mollets debout (haltères ou poids du corps)",
    cues: [
      t("Balls of your feet on a step, heels hanging off.", "Avant des pieds sur une marche, talons dans le vide.", "قدّام ساقيك على درجة، وكعبيك في الفراغ.", "9eddem sa9ik 3la daraja, w ka3bik fel fra8."),
      t("Hold a wall for balance; add dumbbells or a backpack later.", "Tiens un mur pour l'équilibre, ajoute haltères ou sac à dos ensuite.", "شدّ في الحيط باش تتوازن، ومبعد زيد هالتيرات ولا صاك.", "Chedd fel 7it bech tetwazen, w mba3d zid haltères walla sac à dos."),
      t("Lower slowly, then rise as high as possible.", "Descends lentement, puis monte le plus haut possible.", "هبّط بشويّة، ومبعد اطلع قدّ ما تنجّم لفوق.", "Habbet bechwaya, w mba3d etla3 9add ma tnajjem lel fou9."),
      t("Too easy? Do one leg at a time.", "Trop facile ? Fais-le sur une jambe.", "ساهلة برشا؟ اعملها بساق وحدة.", "Sehla barcha? A3melha b sa9 wa7da."),
    ],
    mistakes: [
      t("Bouncing at the bottom.", "Rebondir en bas.", "تنقّز في اللوطة.", "Tna99ez fel louta."),
      t("Rolling onto the outer edge of the feet.", "Rouler sur le bord extérieur des pieds.", "تميّل على طرف ساقيك من برّة.", "Tmayel 3la tarf sa9ik men barra."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },
  'Dumbbell_Seated_One-Leg_Calf_Raise': {
    nameFr: "Mollets assis unilatéral avec haltère",
    cues: [
      t("Sit with the ball of one foot on a block or thick book.", "Assis, l'avant d'un pied sur une cale ou un gros livre.", "اقعد وحطّ قدّام ساق وحدة على كال ولا كتاب خشين.", "O93ed w 7ott 9eddem sa9 wa7da 3la cale walla ktab khchin."),
      t("Rest a dumbbell or backpack on that knee.", "Pose un haltère ou un sac à dos sur ce genou.", "حطّ هالتير ولا صاك على الركبة هاذيكا.", "7ott haltère walla sac à dos 3al rokba hedhika."),
      t("Raise the heel high, then lower slowly.", "Monte le talon haut, puis redescends lentement.", "طلّع الكعب لفوق، ومبعد هبّط بشويّة.", "Tala3 el ka3b lel fou9, w mba3d habbet bechwaya."),
    ],
    mistakes: [
      t("Too small a range of motion.", "Amplitude trop petite.", "حركة صغيرة برشا.", "7arka s8ira barcha."),
      t("Pushing the weight up with your hand.", "Pousser le poids avec la main.", "تدزّ الثقل لفوق بيدك.", "Tdezz el charge lel fou9 b yeddek."),
    ],
    difficulty: 1,
    repRange: [12, 20],
    unilateral: true,
  },
  'Calf_Raises_-_With_Bands': {
    nameFr: "Mollets avec élastique",
    cues: [
      t("Band under the balls of your feet, handles at your shoulders.", "Élastique sous l'avant des pieds, poignées aux épaules.", "الإيلاستيك تحت قدّام ساقيك، والمقابض في كتافك.", "El élastique ta7t 9eddem sa9ik, w les poignées f ktefek."),
      t("Rise onto your toes and squeeze for a second.", "Monte sur la pointe des pieds et serre une seconde.", "اطلع على صوابع ساقيك وزيّر ثانية.", "Etla3 3la swaba3 sa9ik w zayyer seconde."),
      t("Lower slowly with control.", "Redescends lentement en contrôle.", "هبّط بشويّة بالكونترول.", "Habbet bechwaya bel contrôle."),
    ],
    mistakes: [
      t("Bouncing quickly.", "Rebondir vite.", "تنقّز بالفيسع.", "Tna99ez bel fisa3."),
      t("Leaning forward.", "Se pencher en avant.", "تميّل لقدّام.", "Tmayel l 9oddem."),
    ],
    difficulty: 1,
    repRange: [15, 25],
  },

  // ----- Core: anti-extension -----
  'Plank': {
    nameFr: "Gainage (planche)",
    cues: [
      t("Forearms under shoulders, body straight from head to heels.", "Avant-bras sous les épaules, corps droit de la tête aux talons.", "سواعدك تحت كتافك، بدنك دريت من راسك لكعبيك.", "Swa3dek ta7t ktefek, badnek dret men rasek l ka3bik."),
      t("Brace your stomach like someone is about to poke it.", "Gaine ton ventre comme si quelqu'un allait te le pousser.", "شدّ كرشك كيما كان حدّ باش يدزّك فيها.", "Chedd krechek kima ken 7add bech ydezzek fiha."),
      t("Squeeze your glutes and tuck your ribs down.", "Serre les fessiers et rentre les côtes.", "زيّر الفيسيي ودخّل ضلوعك للوطة.", "Zayyer les fessiers w dakhel dhlou3ek lel louta."),
      t("Too hard? Drop to your knees.", "Trop dur ? Pose les genoux.", "صعيبة؟ حطّ ركايبك في الأرض.", "S3iba? 7ott rkaybek fel ardh."),
    ],
    mistakes: [
      t("Hips sagging toward the floor.", "Hanches qui s'affaissent vers le sol.", "جنابك يطيحو للأرض.", "Jnabek yti7ou lel ardh."),
      t("Butt piked up high.", "Fesses trop hautes.", "الفيسيي طالعين لفوق برشا.", "Les fesses tal3in lel fou9 barcha."),
      t("Holding your breath.", "Bloquer la respiration.", "تحبس نفسك.", "Te7bes nefsek."),
    ],
    difficulty: 1,
    repRange: [20, 45],
    timed: true,
  },
  'Dead_Bug': {
    nameFr: "Dead bug",
    cues: [
      t("On your back, arms up, knees bent at 90° over your hips.", "Sur le dos, bras vers le plafond, genoux à 90° au-dessus des hanches.", "على ظهرك، يديك لفوق، ركايبك مطويين 90° فوق جنابك.", "3la dharek, yeddik lel fou9, rkaybek matwiyin 90° fou9 jnabek."),
      t("Press your lower back into the floor.", "Plaque le bas du dos au sol.", "لصّق ظهرك من لوطة في الأرض.", "Lassa9 dharek mel louta fel ardh."),
      t("Slowly extend the opposite arm and leg, then switch.", "Tends lentement le bras et la jambe opposés, puis change.", "مدّ بشويّة اليد والساق المعاكسين، ومبعد بدّل.", "Medd bechwaya el yed w el sa9 el m3aksin, w mba3d baddel."),
      t("Breathe out as you extend.", "Expire en tendant.", "خرّج النفس وانت تمدّ.", "Kharrej ennefs w enti tmedd."),
    ],
    mistakes: [
      t("Lower back arching off the floor.", "Bas du dos qui décolle du sol.", "ظهرك من لوطة يتقلّع من الأرض.", "Dharek mel louta yet9alla3 mel ardh."),
      t("Moving too fast.", "Aller trop vite.", "تتحرّك بالفيسع برشا.", "Tet7arrek bel fisa3 barcha."),
    ],
    difficulty: 1,
    repRange: [6, 10],
    unilateral: true,
  },
  'Exercise_Ball_Pull-In': {
    nameFr: "Ramené de genoux sur ballon",
    cues: [
      t("Push-up position with your shins on a stability ball.", "Position de pompe, tibias posés sur un ballon de gym.", "بوزيسيون البومب، وساقيك على بالون جيم.", "Position pompe, w sa9ik 3la ballon de gym."),
      t("Pull your knees toward your chest, rolling the ball in.", "Ramène les genoux vers la poitrine en roulant le ballon.", "جيب ركايبك لصدرك وانت تدحرج البالون لعندك.", "Jib rkaybek l sadrek w enti tda7rej el ballon l 3andek."),
      t("Keep hips level and roll back out slowly.", "Garde le bassin stable et ressors lentement.", "خلّي جنابك ثابتين وارجع بشويّة.", "Khalli jnabek thebtin w erja3 bechwaya."),
    ],
    mistakes: [
      t("Hips sagging when the legs extend.", "Hanches qui s'affaissent quand les jambes se tendent.", "جنابك يطيحو كي ساقيك يتمدّو.", "Jnabek yti7ou ki sa9ik yetmaddou."),
      t("Shoulders drifting behind the hands.", "Épaules qui reculent derrière les mains.", "كتافك يرجعو ورا يديك.", "Ktefek yerej3ou wra yeddik."),
    ],
    difficulty: 2,
    avoidIf: ['wrists'],
    repRange: [8, 15],
  },
  'Ab_Roller': {
    nameFr: "Roue abdominale",
    cues: [
      t("Start on your knees with the roller under your shoulders.", "Commence à genoux, roue sous les épaules.", "ابدا على ركايبك والرو تحت كتافك.", "Ebda 3la rkaybek w la roue ta7t ktefek."),
      t("Brace hard and roll out only as far as you control.", "Gaine fort et roule seulement jusqu'où tu contrôles.", "شدّ كرشك مليح وامشي لقدّام كان لين وين تنجّم تكونترولي.", "Chedd krechek mli7 w emchi l 9oddem ken lin win tnajjem tcontroli."),
      t("Pull back with your abs, not your hips.", "Reviens avec les abdos, pas avec les hanches.", "ارجع بالأبدو، موش بجنابك.", "Erja3 bel abdos, mouch b jnabek."),
    ],
    mistakes: [
      t("Lower back sagging at full extension.", "Bas du dos qui se creuse en extension.", "ظهرك من لوطة يطيح كي تتمدّ الكل.", "Dharek mel louta yti7 ki tetmadd lkol."),
      t("Rolling out too far too soon.", "Rouler trop loin trop tôt.", "تمشي لبعيد برشا من الأوّل.", "Temchi l b3id barcha mel louel."),
    ],
    difficulty: 3,
    avoidIf: ['lower_back', 'shoulders'],
    repRange: [5, 10],
  },
  'Butt-Ups': {
    nameFr: "Planche avec montée de bassin",
    cues: [
      t("Start in a forearm plank.", "Pars en planche sur les avant-bras.", "ابدا في بلانش على سواعدك.", "Ebda f planche 3la swa3dek."),
      t("Squeeze your abs and lift your hips toward the ceiling.", "Serre les abdos et monte les fesses vers le plafond.", "زيّر الأبدو وطلّع جنابك للسقف.", "Zayyer les abdos w tala3 jnabek lel sa9f."),
      t("Lower slowly back to a straight plank.", "Redescends lentement en planche droite.", "هبّط بشويّة وارجع لبلانش دريت.", "Habbet bechwaya w erja3 l planche dret."),
    ],
    mistakes: [
      t("Letting the back sag between reps.", "Laisser le dos se creuser entre les répétitions.", "تخلّي ظهرك يطيح بين المرّات.", "Tkhalli dharek yti7 bin les reps."),
      t("Rushing up and down.", "Monter et descendre trop vite.", "تطلع وتهبط بالفيسع.", "Tetla3 w tahbet bel fisa3."),
    ],
    difficulty: 1,
    repRange: [10, 15],
  },
  'Spider_Crawl': {
    nameFr: "Planche araignée (genou au coude)",
    cues: [
      t("Hold a push-up position, body straight.", "Tiens une position de pompe, corps droit.", "اقعد في بوزيسيون البومب، بدنك دريت.", "O93ed f position pompe, badnek dret."),
      t("Bring one knee out to the side toward your elbow.", "Ramène un genou sur le côté vers ton coude.", "جيب ركبة على الجنب لمرفقك.", "Jib rokba 3al jnab l morfe9ek."),
      t("Return and switch sides; hips stay low.", "Reviens et change de côté, hanches basses.", "ارجع وبدّل الجنب، جنابك يقعدو لوطة.", "Erja3 w baddel el jnab, jnabek yo93dou louta."),
    ],
    mistakes: [
      t("Hips popping up high.", "Fesses qui montent haut.", "جنابك يطلعو لفوق برشا.", "Jnabek yetl3ou lel fou9 barcha."),
      t("Rushing and losing the plank.", "Aller trop vite et perdre le gainage.", "تزرب وتخسر البلانش.", "Tezreb w tkhassar el planche."),
    ],
    difficulty: 2,
    avoidIf: ['wrists'],
    repRange: [6, 10],
    unilateral: true,
  },

  // ----- Core: flexion -----
  'Crunches': {
    nameFr: "Crunchs",
    cues: [
      t("Knees bent, feet flat, fingertips lightly by your ears.", "Genoux pliés, pieds à plat, bouts des doigts près des oreilles.", "ركايبك مطويين، ساقيك لاصقين في الأرض، صوابعك بشويّة حذا وذنيك.", "Rkaybek matwiyin, sa9ik las9in fel ardh, swaba3ek bechwaya 7dhe wedhnik."),
      t("Curl your shoulders off the floor, ribs toward hips.", "Décolle les épaules du sol, côtes vers le bassin.", "قلّع كتافك من الأرض، ضلوعك لجنابك.", "9alla3 ktefek mel ardh, dhlou3ek l jnabek."),
      t("Exhale as you curl up, then lower slowly.", "Expire en montant, puis redescends lentement.", "خرّج النفس وانت طالع، ومبعد هبّط بشويّة.", "Kharrej ennefs w enti tale3, w mba3d habbet bechwaya."),
    ],
    mistakes: [
      t("Pulling on the neck with your hands.", "Tirer sur la nuque avec les mains.", "تجبد رقبتك بيديك.", "Tejbed ra9btek b yeddik."),
      t("Sitting all the way up with momentum.", "Monter jusqu'en haut avec élan.", "تقعد الكل بالدفعة.", "To93ed lkol bel daf3a."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },
  'Reverse_Crunch': {
    nameFr: "Crunch inversé",
    cues: [
      t("On your back, hips and knees bent at 90°.", "Sur le dos, hanches et genoux à 90°.", "على ظهرك، جنابك وركايبك مطويين 90°.", "3la dharek, jnabek w rkaybek matwiyin 90°."),
      t("Curl your hips off the floor, knees toward your chest.", "Décolle le bassin du sol, genoux vers la poitrine.", "قلّع جنابك من الأرض، ركايبك لصدرك.", "9alla3 jnabek mel ardh, rkaybek l sadrek."),
      t("Lower slowly; don't swing the legs.", "Redescends lentement, sans balancer les jambes.", "هبّط بشويّة، وما تهزّش ساقيك.", "Habbet bechwaya, w ma thezzech sa9ik."),
    ],
    mistakes: [
      t("Swinging the legs to create momentum.", "Balancer les jambes pour prendre de l'élan.", "تهزّ ساقيك باش تاخو دفعة.", "Tehezz sa9ik bech tekhou daf3a."),
      t("Arching the back as the legs lower.", "Cambrer le dos en descendant les jambes.", "تكمبري ظهرك كي ساقيك يهبطو.", "Tcambri dharek ki sa9ik yahbtou."),
    ],
    difficulty: 1,
    repRange: [10, 15],
  },
  'Cable_Crunch': {
    nameFr: "Crunch à la poulie haute",
    cues: [
      t("Kneel under a high pulley, rope beside your ears.", "À genoux sous la poulie haute, corde près des oreilles.", "اركع تحت البولي العالية، الكورد حذا وذنيك.", "Erka3 ta7t el poulie haute, la corde 7dhe wedhnik."),
      t("Keep hips still and curl your ribs toward your hips.", "Bassin immobile, enroule les côtes vers le bassin.", "خلّي جنابك ثابتين وجيب ضلوعك لجنابك.", "Khalli jnabek thebtin w jib dhlou3ek l jnabek."),
      t("Round your spine; don't just bow at the hips.", "Enroule la colonne, ne te plie pas seulement aux hanches.", "قوّس السلسلة، موش كان تطوي من جنابك.", "9awwes es-selsla, mouch ken ttawi men jnabek."),
    ],
    mistakes: [
      t("Sitting back on the heels to pull with bodyweight.", "S'asseoir sur les talons pour tirer avec son poids.", "تقعد على كعبيك باش تجبد بوزن بدنك.", "To93ed 3la ka3bik bech tejbed b poids badnek."),
      t("Pulling with the arms.", "Tirer avec les bras.", "تجبد بيديك.", "Tejbed b yeddik."),
    ],
    difficulty: 2,
    avoidIf: ['lower_back'],
    repRange: [10, 15],
  },
  'Knee_Hip_Raise_On_Parallel_Bars': {
    nameFr: "Relevés de genoux à la chaise romaine",
    cues: [
      t("Forearms on the pads, back pressed against the back pad.", "Avant-bras sur les appuis, dos plaqué au dossier.", "سواعدك على الكوسانات، ظهرك لاصق في الكوسان اللي وراك.", "Swa3dek 3al coussins, dharek las9 fel coussin eli wrak."),
      t("Raise your knees toward your chest, curling the pelvis up.", "Monte les genoux vers la poitrine en enroulant le bassin.", "طلّع ركايبك لصدرك وانت تلفّ الباسان لفوق.", "Tala3 rkaybek l sadrek w enti tleff el bassin lel fou9."),
      t("Lower slowly without swinging.", "Redescends lentement sans te balancer.", "هبّط بشويّة من غير ما تتهزّ.", "Habbet bechwaya men 8ir ma tethazz."),
    ],
    mistakes: [
      t("Swinging the legs.", "Balancer les jambes.", "تهزّ ساقيك.", "Tehezz sa9ik."),
      t("Lifting the legs without curling the hips.", "Lever les jambes sans enrouler le bassin.", "تطلّع ساقيك من غير ما تلفّ الباسان.", "Ttala3 sa9ik men 8ir ma tleff el bassin."),
    ],
    difficulty: 2,
    repRange: [8, 15],
  },
  'Exercise_Ball_Crunch': {
    nameFr: "Crunch sur ballon de gym",
    cues: [
      t("Lower back on the ball, feet planted wide.", "Bas du dos sur le ballon, pieds bien écartés au sol.", "ظهرك من لوطة على البالون، ساقيك محلولين في الأرض.", "Dharek mel louta 3al ballon, sa9ik m7loulin fel ardh."),
      t("Curl your ribs toward your hips, then stretch back.", "Enroule les côtes vers le bassin, puis étire-toi en arrière.", "جيب ضلوعك لجنابك، ومبعد تمطّ لتالي.", "Jib dhlou3ek l jnabek, w mba3d tmatt lteli."),
      t("Cross your arms on your chest to protect your neck.", "Croise les bras sur la poitrine pour protéger la nuque.", "حطّ يديك مقاطعين على صدرك باش تحمي رقبتك.", "7ott yeddik m9at3in 3la sadrek bech t7mi ra9btek."),
    ],
    mistakes: [
      t("Rolling the ball instead of curling the spine.", "Faire rouler le ballon au lieu d'enrouler la colonne.", "تدحرج البالون عوض ما تلفّ السلسلة.", "Tda7rej el ballon 3awedh ma tleff es-selsla."),
      t("Feet too close together, losing balance.", "Pieds trop serrés, perte d'équilibre.", "ساقيك لاصقين برشا وتخسر التوازن.", "Sa9ik las9in barcha w tkhassar el équilibre."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },
  'Leg_Pull-In': {
    nameFr: "Ramené de genoux allongé",
    cues: [
      t("Lie on your back, legs straight, hands by your sides.", "Sur le dos, jambes tendues, mains le long du corps.", "تمدّد على ظهرك، ساقيك ممدودين، يديك على جنابك.", "Tmadded 3la dharek, sa9ik mamdoudin, yeddik 3la jnabek."),
      t("Pull your knees to your chest, then extend the legs out.", "Ramène les genoux vers la poitrine, puis tends les jambes.", "جيب ركايبك لصدرك، ومبعد مدّ ساقيك.", "Jib rkaybek l sadrek, w mba3d medd sa9ik."),
      t("Keep your lower back pressed down.", "Garde le bas du dos plaqué au sol.", "خلّي ظهرك من لوطة لاصق في الأرض.", "Khalli dharek mel louta las9 fel ardh."),
    ],
    mistakes: [
      t("Lower back arching as the legs extend.", "Bas du dos qui se cambre quand les jambes se tendent.", "ظهرك من لوطة يتكمبرى كي ساقيك يتمدّو.", "Dharek mel louta yetcambra ki sa9ik yetmaddou."),
      t("Kicking fast with no control.", "Donner des coups de jambes sans contrôle.", "تضرب بساقيك بالفيسع بلاش كونترول.", "Todhrob b sa9ik bel fisa3 blech contrôle."),
    ],
    difficulty: 1,
    repRange: [10, 15],
  },
  'Tuck_Crunch': {
    nameFr: "Crunch jambes levées",
    cues: [
      t("Legs up, thighs vertical, ankles crossed.", "Jambes levées, cuisses verticales, chevilles croisées.", "ساقيك لفوق، فخاذك واقفين، كعباتك مقاطعين.", "Sa9ik lel fou9, fkhedhek w9fin, ka3betek m9at3in."),
      t("Curl your shoulders up toward your knees.", "Monte les épaules vers les genoux.", "طلّع كتافك لركايبك.", "Tala3 ktefek l rkaybek."),
      t("Exhale on the way up, lower slowly.", "Expire en montant, redescends lentement.", "خرّج النفس وانت طالع، وهبّط بشويّة.", "Kharrej ennefs w enti tale3, w habbet bechwaya."),
    ],
    mistakes: [
      t("Pulling on the neck.", "Tirer sur la nuque.", "تجبد رقبتك.", "Tejbed ra9btek."),
      t("Legs dropping during the set.", "Jambes qui descendent pendant la série.", "ساقيك يطيحو في وسط السيري.", "Sa9ik yti7ou f wost el série."),
    ],
    difficulty: 1,
    repRange: [12, 20],
  },

  // ----- Core: rotation -----
  'Pallof_Press': {
    nameFr: "Pallof press",
    cues: [
      t("Stand side-on to a cable set at chest height.", "De profil à la poulie, câble à hauteur de poitrine.", "اوقف بالجنب للكابل، والكابل في طول صدرك.", "O9ef bel jnab lel câble, w el câble f toul sadrek."),
      t("Handle at your chest; step out until there's tension.", "Poignée contre la poitrine, écarte-toi jusqu'à sentir la tension.", "المقبض على صدرك، وابعد لين يتشدّ الكابل.", "El poignée 3la sadrek, w ob3ed lin yetchedd el câble."),
      t("Press your arms straight out and resist turning.", "Tends les bras devant toi en résistant à la rotation.", "مدّ يديك قدّامك وما تخلّيش بدنك يدور.", "Medd yeddik 9eddemek w ma tkhallich badnek ydour."),
      t("Hold two seconds, then bring it back slowly.", "Tiens deux secondes, puis ramène lentement.", "شدّ زوز ثواني، ومبعد رجّعو بشويّة.", "Chedd zouz secondes, w mba3d rajj3ou bechwaya."),
    ],
    mistakes: [
      t("Letting the torso twist toward the cable.", "Laisser le buste tourner vers le câble.", "تخلّي بدنك يدور للكابل.", "Tkhalli badnek ydour lel câble."),
      t("Standing too close, with no tension.", "Être trop près, sans tension.", "واقف قريب برشا، والكابل موش مشدود.", "We9ef 9rib barcha, w el câble mouch machdoud."),
    ],
    difficulty: 1,
    repRange: [8, 12],
    unilateral: true,
  },
  'Standing_Cable_Wood_Chop': {
    nameFr: "Bûcheron à la poulie (haut vers bas)",
    cues: [
      t("Cable high, side-on, both hands on the handle.", "Câble en haut, de profil, deux mains sur la poignée.", "الكابل لفوق، انت بالجنب، يديك الزوز على المقبض.", "El câble lel fou9, enti bel jnab, yeddik ezzouz 3al poignée."),
      t("Pull diagonally down across your body to the far knee.", "Tire en diagonale vers le bas, jusqu'au genou opposé.", "اجبد بالمايل للوطة قدّام بدنك لين الركبة الأخرى.", "Ejbed bel mayel lel louta 9eddem badnek lin el rokba lo5ra."),
      t("Pivot the back foot and turn through hips and chest.", "Pivote le pied arrière et tourne avec hanches et buste.", "دوّر الساق اللي لتالي ودور بجنابك وصدرك.", "Dawwer el sa9 eli lteli w dour b jnabek w sadrek."),
    ],
    mistakes: [
      t("Pulling only with the arms.", "Tirer uniquement avec les bras.", "تجبد كان بيديك.", "Tejbed ken b yeddik."),
      t("Rounding the lower back.", "Arrondir le bas du dos.", "تقوّس ظهرك من لوطة.", "T9awwes dharek mel louta."),
    ],
    difficulty: 2,
    repRange: [10, 15],
    unilateral: true,
  },
  'Standing_Cable_Lift': {
    nameFr: "Bûcheron inversé à la poulie (bas vers haut)",
    cues: [
      t("Cable low, side-on, start in a half squat.", "Câble en bas, de profil, pars en demi-squat.", "الكابل لوطة، انت بالجنب، ابدا في نصّ سكوات.", "El câble louta, enti bel jnab, ebda f nos squat."),
      t("Lift diagonally up and across your body, arms long.", "Monte en diagonale à travers le corps, bras longs.", "طلّع بالمايل لفوق قدّام بدنك، يديك ممدودين.", "Tala3 bel mayel lel fou9 9eddem badnek, yeddik mamdoudin."),
      t("Stand and rotate together; control the return.", "Redresse-toi en tournant, contrôle le retour.", "اوقف ودوّر في نفس الوقت، وكونترولي الرجوع.", "O9ef w dawwer f nafs el wa9t, w controli erjou3."),
    ],
    mistakes: [
      t("Yanking with the arms.", "Arracher avec les bras.", "تجبد بيديك بالقوّة.", "Tejbed b yeddik bel 9owwa."),
      t("Twisting at the knees instead of the hips.", "Tordre les genoux au lieu des hanches.", "تلوي ركايبك عوض جنابك.", "Telwi rkaybek 3awedh jnabek."),
    ],
    difficulty: 2,
    repRange: [10, 15],
    unilateral: true,
  },
  'Side_Bridge': {
    nameFr: "Gainage latéral (planche de côté)",
    cues: [
      t("Lie on your side, elbow under shoulder, feet stacked.", "Sur le côté, coude sous l'épaule, pieds l'un sur l'autre.", "تمدّد على جنبك، المرفق تحت الكتف، ساقيك فوق بعضهم.", "Tmadded 3la jnabek, el morfe9 ta7t el ktef, sa9ik fou9 ba3dhhom."),
      t("Lift your hips so your body forms a straight line.", "Monte les hanches pour former une ligne droite.", "طلّع جنابك باش بدنك يولّي خطّ دريت.", "Tala3 jnabek bech badnek ywalli khatt dret."),
      t("Too hard? Bend your knees and keep them down.", "Trop dur ? Plie les genoux et garde-les au sol.", "صعيبة؟ اطوي ركايبك وخلّيهم في الأرض.", "S3iba? Atwi rkaybek w khallihom fel ardh."),
    ],
    mistakes: [
      t("Hips sagging toward the floor.", "Hanches qui tombent vers le sol.", "جنابك يطيحو للأرض.", "Jnabek yti7ou lel ardh."),
      t("Chest rolling forward.", "Buste qui bascule vers l'avant.", "صدرك يتلفّ لقدّام.", "Sadrek yetleff l 9oddem."),
    ],
    difficulty: 1,
    avoidIf: ['shoulders'],
    repRange: [20, 40],
    timed: true,
    unilateral: true,
  },
  'Air_Bike': {
    nameFr: "Crunch vélo",
    cues: [
      t("Lower back pressed down, hands lightly by your head.", "Bas du dos plaqué, mains légèrement près de la tête.", "ظهرك من لوطة لاصق، يديك بشويّة حذا راسك.", "Dharek mel louta las9, yeddik bechwaya 7dhe rasek."),
      t("Bring one elbow toward the opposite knee as the other leg extends.", "Approche un coude du genou opposé pendant que l'autre jambe se tend.", "قرّب مرفق للركبة المعاكسة وانت تمدّ الساق الأخرى.", "9arreb morfe9 lel rokba el m3aksa w enti tmedd el sa9 lo5ra."),
      t("Go slowly; rotate the shoulder, not just the elbow.", "Va lentement, tourne l'épaule, pas seulement le coude.", "بشويّة، دوّر الكتف موش كان المرفق.", "Bechwaya, dawwer el ktef mouch ken el morfe9."),
    ],
    mistakes: [
      t("Yanking the neck with the hands.", "Tirer la nuque avec les mains.", "تجبد رقبتك بيديك بالقوّة.", "Tejbed ra9btek b yeddik bel 9owwa."),
      t("Pedaling fast with no real rotation.", "Pédaler vite sans vraie rotation.", "تبيدالي بالفيسع بلاش دوران بالحقّ.", "Tpédali bel fisa3 blech dawaran bel 7a9."),
    ],
    difficulty: 1,
    repRange: [10, 15],
    unilateral: true,
  },
  'Cross-Body_Crunch': {
    nameFr: "Crunch croisé coude-genou",
    cues: [
      t("Knees bent, feet flat, hands loosely behind your head.", "Genoux pliés, pieds à plat, mains derrière la tête sans serrer.", "ركايبك مطويين، ساقيك لاصقين في الأرض، يديك ورا راسك من غير ما تزيّر.", "Rkaybek matwiyin, sa9ik las9in fel ardh, yeddik wra rasek men 8ir ma tzayyer."),
      t("Curl up, bringing one elbow across toward the opposite knee.", "Enroule-toi en amenant un coude vers le genou opposé.", "اطلع وقرّب مرفق للركبة المعاكسة.", "Etla3 w 9arreb morfe9 lel rokba el m3aksa."),
      t("Lower slowly and switch sides.", "Redescends lentement et change de côté.", "هبّط بشويّة وبدّل الجنب.", "Habbet bechwaya w baddel el jnab."),
    ],
    mistakes: [
      t("Pulling the head forward.", "Tirer la tête vers l'avant.", "تجبد راسك لقدّام.", "Tejbed rasek l 9oddem."),
      t("Moving only the elbow, not the shoulder.", "Bouger seulement le coude, pas l'épaule.", "تحرّك كان المرفق، موش الكتف.", "T7arrek ken el morfe9, mouch el ktef."),
    ],
    difficulty: 1,
    repRange: [10, 15],
    unilateral: true,
  },
  'Russian_Twist': {
    nameFr: "Rotations russes (Russian twist)",
    cues: [
      t("Sit with knees bent and lean back into a V, chest proud.", "Assis genoux pliés, penche-toi en arrière en V, poitrine fière.", "اقعد ركايبك مطويين وميّل لتالي في شكل V، صدرك لقدّام.", "O93ed rkaybek matwiyin w mayel lteli f chakl V, sadrek l 9oddem."),
      t("Rotate your shoulders side to side, hands together.", "Tourne les épaules d'un côté à l'autre, mains jointes.", "دوّر كتافك من جنب لجنب، يديك مع بعضهم.", "Dawwer ktefek men jnab l jnab, yeddik m3a ba3dhhom."),
      t("Hold a dumbbell to make it harder.", "Tiens un haltère pour corser.", "شدّ هالتير باش تصعّبها.", "Chedd haltère bech tsa33ebha."),
    ],
    mistakes: [
      t("Rounding the back into a slump.", "Arrondir le dos et s'affaisser.", "تقوّس ظهرك وتطيح.", "T9awwes dharek w tti7."),
      t("Moving only the arms, not the torso.", "Bouger seulement les bras, pas le buste.", "تحرّك كان يديك، موش بدنك.", "T7arrek ken yeddik, mouch badnek."),
    ],
    difficulty: 2,
    avoidIf: ['lower_back'],
    repRange: [10, 15],
    unilateral: true,
  },
  'Alternate_Heel_Touchers': {
    nameFr: "Touchers de talons alternés",
    cues: [
      t("On your back, knees bent, feet wide apart.", "Sur le dos, genoux pliés, pieds écartés.", "على ظهرك، ركايبك مطويين، ساقيك متباعدين.", "3la dharek, rkaybek matwiyin, sa9ik metba3din."),
      t("Lift your shoulders slightly and reach side to side to your heels.", "Décolle un peu les épaules, touche un talon puis l'autre.", "قلّع كتافك شويّة ومسّ كعبيك من جنب لجنب.", "9alla3 ktefek chwaya w mess ka3bik men jnab l jnab."),
      t("Keep shoulders off the floor for the whole set.", "Garde les épaules décollées pendant toute la série.", "خلّي كتافك مقلّعين من الأرض في السيري الكل.", "Khalli ktefek m9all3in mel ardh fel série lkol."),
    ],
    mistakes: [
      t("Dropping the head between reps.", "Reposer la tête entre les répétitions.", "تحطّ راسك بين المرّات.", "T7ott rasek bin les reps."),
      t("Pulling the neck forward.", "Tirer la nuque vers l'avant.", "تجبد رقبتك لقدّام.", "Tejbed ra9btek l 9oddem."),
    ],
    difficulty: 1,
    repRange: [10, 20],
    unilateral: true,
  },

  // ----- Conditioning -----
  'Walking_Treadmill': {
    nameFr: "Marche sur tapis (inclinée)",
    cues: [
      t("Set a brisk pace and a slight incline.", "Choisis un rythme soutenu et une légère inclinaison.", "اختار ريتم سريع وطلعة خفيفة.", "A5tar rythme sri3 w pente khfifa."),
      t("Stand tall and let your arms swing naturally.", "Tiens-toi droit et laisse les bras se balancer.", "اوقف دريت وخلّي يديك يتحرّكو على راحتهم.", "O9ef dret w khalli yeddik yet7arkou 3la ra7thom."),
      t("Don't hang on the rails; slow down instead.", "Ne t'accroche pas aux barres, ralentis plutôt.", "ما تتعلّقش في البارات، خير نقّص في السرعة.", "Ma tet3alle9ch fel barres, khir na99es fel vitesse."),
      t("You should be able to talk, but not sing.", "Tu dois pouvoir parler, mais pas chanter.", "لازمك تنجّم تحكي، أما ما تنجّمش تغنّي.", "Lazmek tnajjem te7ki, ama ma tnajjemch t8anni."),
    ],
    mistakes: [
      t("Leaning on the handrails.", "S'appuyer sur les rambardes.", "تتّكى على البارات.", "Tetteka 3al barres."),
      t("Incline so steep that you hunch over.", "Inclinaison si forte qu'on se penche en avant.", "الطلعة قويّة برشا لدرجة تتقوّس.", "El pente 9wiya barcha l daraja tet9awwes."),
    ],
    difficulty: 1,
    repRange: [600, 1200],
    timed: true,
  },
  'Bicycling_Stationary': {
    nameFr: "Vélo d'appartement",
    cues: [
      t("Seat height: slight knee bend at the bottom of the pedal stroke.", "Hauteur de selle : genou légèrement plié en bas du pédalage.", "طول الكرسي: الركبة مطوية شويّة كي البيدال يكون لوطة.", "Toul el selle: el rokba matwiya chwaya ki el pédale tkoun louta."),
      t("Keep a steady, comfortable cadence.", "Garde une cadence régulière et confortable.", "خلّي ريتم ثابت ومريّح.", "Khalli rythme theb w mrayye7."),
      t("Add resistance gradually, not all at once.", "Augmente la résistance progressivement.", "زيد في الصعوبة بشويّة بشويّة، موش مرّة وحدة.", "Zid fel résistance bechwaya bechwaya, mouch marra wa7da."),
    ],
    mistakes: [
      t("Seat too low, so the knees feel cramped.", "Selle trop basse, genoux écrasés.", "الكرسي لوطاني برشا، والركايب مزيّرين.", "El selle louta barcha, w rkaybek mzayrin."),
      t("Hips rocking side to side.", "Bassin qui se balance.", "جنابك يتهزّو من جنب لجنب.", "Jnabek yethazzou men jnab l jnab."),
    ],
    difficulty: 1,
    repRange: [600, 1200],
    timed: true,
  },
  'Elliptical_Trainer': {
    nameFr: "Vélo elliptique",
    cues: [
      t("Stand tall, pushing and pulling the handles.", "Tiens-toi droit, pousse et tire les poignées.", "اوقف دريت، دزّ واجبد المقابض.", "O9ef dret, dezz w ejbed les poignées."),
      t("Keep your heels down with smooth strides.", "Talons posés, foulées fluides.", "خلّي كعبيك لاصقين، وخطواتك هادية.", "Khalli ka3bik las9in, w khatwetek hedya."),
      t("Pick a pace you could hold for 15 minutes.", "Choisis un rythme que tu pourrais tenir 15 minutes.", "اختار ريتم تنجّم تكمّل بيه 15 دقيقة.", "A5tar rythme tnajjem tkammel bih 15 minutes."),
    ],
    mistakes: [
      t("Leaning heavily on the handles.", "S'appuyer lourdement sur les poignées.", "تتّكى برشا على المقابض.", "Tetteka barcha 3al poignées."),
      t("Staying up on your toes the whole time.", "Rester sur la pointe des pieds.", "تقعد على صوابع ساقيك طول.", "To93ed 3la swaba3 sa9ik toul."),
    ],
    difficulty: 1,
    repRange: [600, 1200],
    timed: true,
  },
  'Recumbent_Bike': {
    nameFr: "Vélo semi-allongé",
    cues: [
      t("Sit back fully and adjust the seat for a slight knee bend.", "Dos bien calé, règle le siège pour un genou légèrement plié.", "اقعد وظهرك لاصق، وظبّط الكرسي باش الركبة تبقى مطوية شويّة.", "O93ed w dharek las9, w dhabbet el korsi bech el rokba tob9a matwiya chwaya."),
      t("Pedal at a steady pace where you can still talk.", "Pédale à un rythme régulier où tu peux encore parler.", "بيدالي بريتم ثابت تنجّم تحكي فيه.", "Pédali b rythme theb tnajjem te7ki fih."),
      t("A great choice if your back or knees are sensitive.", "Idéal si ton dos ou tes genoux sont sensibles.", "باهي برشا كان ظهرك ولا ركايبك حسّاسين.", "Behi barcha ken dharek walla rkaybek 7assasin."),
    ],
    mistakes: [
      t("Seat too close, so the knees bend too much.", "Siège trop près, genoux trop pliés.", "الكرسي قريب برشا، والركايب يتطواو برشا.", "El korsi 9rib barcha, w rkaybek yettawew barcha."),
      t("Resistance too high at the start.", "Résistance trop forte au début.", "الصعوبة عالية برشا في الأوّل.", "La résistance 3alya barcha fel louel."),
    ],
    difficulty: 1,
    repRange: [600, 1200],
    timed: true,
  },
  'Rowing_Stationary': {
    nameFr: "Rameur",
    cues: [
      t("Order: legs push, then lean back, then arms pull.", "Ordre : jambes, puis buste en arrière, puis bras.", "الترتيب: الساقين يدزّو، مبعد ميّل لتالي، مبعد اليدين يجبدو.", "El tartib: sa9ik ydezzou, mba3d mayel lteli, mba3d yeddik yejbdou."),
      t("Return: arms, then body, then bend the knees.", "Retour : bras, puis buste, puis plie les genoux.", "الرجوع: اليدين، مبعد البدن، مبعد اطوي الركايب.", "Erjou3: yeddik, mba3d badnek, mba3d atwi rkaybek."),
      t("Keep your back straight, not rounded.", "Garde le dos droit, pas arrondi.", "خلّي ظهرك دريت، موش مقوّس.", "Khalli dharek dret, mouch m9awwes."),
    ],
    mistakes: [
      t("Pulling with the arms before the legs push.", "Tirer avec les bras avant de pousser avec les jambes.", "تجبد بيديك قبل ما ساقيك يدزّو.", "Tejbed b yeddik 9bal ma sa9ik ydezzou."),
      t("Rounding the back at the front of the stroke.", "Arrondir le dos à l'avant du mouvement.", "تقوّس ظهرك كي تكون لقدّام.", "T9awwes dharek ki tkoun l 9oddem."),
    ],
    difficulty: 2,
    avoidIf: ['lower_back'],
    repRange: [300, 900],
    timed: true,
  },
  'Stairmaster': {
    nameFr: "Simulateur d'escalier (Stairmaster)",
    cues: [
      t("Start slow with your whole foot on each step.", "Commence lentement, pied entier sur chaque marche.", "ابدا بشويّة، ساقك الكل على كل درجة.", "Ebda bechwaya, sa9ek lkol 3la kol daraja."),
      t("Stand tall; hands only lightly on the rails.", "Tiens-toi droit, mains juste posées sur les barres.", "اوقف دريت، يديك محطوطين بشويّة على البارات.", "O9ef dret, yeddik ma7toutin bechwaya 3al barres."),
      t("Push through your heels.", "Pousse dans les talons.", "دزّ في كعبيك.", "Dezz f ka3bik."),
    ],
    mistakes: [
      t("Hanging on the rails with straight arms.", "S'appuyer sur les barres bras tendus.", "تتعلّق في البارات ويديك ممدودين.", "Tet3alle9 fel barres w yeddik mamdoudin."),
      t("Tiny steps on your toes.", "Petits pas sur la pointe des pieds.", "خطوات صغار على صوابعك.", "Khatwet s8ar 3la swaba3ek."),
    ],
    difficulty: 2,
    avoidIf: ['knees'],
    repRange: [300, 900],
    timed: true,
  },
  'Mountain_Climbers': {
    nameFr: "Mountain climbers (grimpeurs)",
    cues: [
      t("High plank, hands under your shoulders.", "Planche bras tendus, mains sous les épaules.", "بلانش ويديك ممدودين، تحت كتافك.", "Planche w yeddik mamdoudin, ta7t ktefek."),
      t("Drive one knee toward your chest, then switch.", "Ramène un genou vers la poitrine, puis change.", "جيب ركبة لصدرك، ومبعد بدّل.", "Jib rokba l sadrek, w mba3d baddel."),
      t("Keep your hips low and level.", "Garde les hanches basses et stables.", "خلّي جنابك لوطة وثابتين.", "Khalli jnabek louta w thebtin."),
      t("Start slow, then speed up.", "Commence lentement, puis accélère.", "ابدا بشويّة، ومبعد زيد في السرعة.", "Ebda bechwaya, w mba3d zid fel vitesse."),
    ],
    mistakes: [
      t("Butt bouncing up high.", "Fesses qui montent haut.", "الفيسيي ينقّزو لفوق.", "Les fesses yna99zou lel fou9."),
      t("Shoulders drifting behind the hands.", "Épaules qui reculent derrière les mains.", "كتافك يرجعو ورا يديك.", "Ktefek yerej3ou wra yeddik."),
    ],
    difficulty: 1,
    avoidIf: ['wrists'],
    repRange: [20, 40],
    timed: true,
  },
  'Star_Jump': {
    nameFr: "Sauts en étoile",
    cues: [
      t("Quarter squat, then jump up spreading arms and legs.", "Petit squat, puis saute en écartant bras et jambes.", "سكوات صغيّر، ومبعد نقّز وحلّ يديك وساقيك.", "Squat s8ayyer, w mba3d na99ez w 7ell yeddik w sa9ik."),
      t("Bring your limbs back in before landing.", "Ramène bras et jambes avant d'atterrir.", "لمّ يديك وساقيك قبل ما تنزل.", "Lemm yeddik w sa9ik 9bal ma tenzel."),
      t("Land softly with bent knees.", "Atterris en douceur, genoux fléchis.", "انزل بشويّة، ركايبك مطويين.", "Enzel bechwaya, rkaybek matwiyin."),
    ],
    mistakes: [
      t("Landing with straight, stiff legs.", "Atterrir jambes tendues et raides.", "تنزل وساقيك ممدودين وصحاح.", "Tenzel w sa9ik mamdoudin w s7a7."),
      t("Knees caving in on landing.", "Genoux qui rentrent à l'atterrissage.", "ركايبك يدخلو للداخل كي تنزل.", "Rkaybek yodkhlou lel dakhel ki tenzel."),
    ],
    difficulty: 2,
    avoidIf: ['knees'],
    repRange: [20, 40],
    timed: true,
  },
  'Fast_Skipping': {
    nameFr: "Skipping rapide",
    cues: [
      t("Skip with a quick step-hop rhythm.", "Sautille avec un rythme pas-saut rapide.", "نقّز بريتم سريع، خطوة ونقزة.", "Na99ez b rythme sri3, khatwa w na9za."),
      t("Stay light and close to the ground.", "Reste léger et proche du sol.", "خلّيك خفيف وقريب من الأرض.", "Khallik khfif w 9rib mel ardh."),
      t("Swing your arms in rhythm with your legs.", "Balance les bras au rythme des jambes.", "حرّك يديك على ريتم ساقيك.", "7arrek yeddik 3la rythme sa9ik."),
    ],
    mistakes: [
      t("Jumping high instead of moving quickly.", "Sauter haut au lieu d'aller vite.", "تنقّز لفوق برشا عوض ما تمشي بالفيسع.", "Tna99ez lel fou9 barcha 3awedh ma temchi bel fisa3."),
      t("Landing flat-footed and heavy.", "Atterrir pied à plat et lourdement.", "تنزل بساقك الكل وثقيل.", "Tenzel b sa9ek lkol w t9il."),
    ],
    difficulty: 1,
    avoidIf: ['knees'],
    repRange: [20, 40],
    timed: true,
  },
  'Trail_Running_Walking': {
    nameFr: "Marche rapide / footing en extérieur",
    cues: [
      t("Start with a brisk walk; jog only when that feels easy.", "Commence par marcher vite, ne cours que quand c'est facile.", "ابدا بمشي سريع، وما تجريش كان كي يولّي ساهل.", "Ebda b mechi sri3, w ma tejrich ken ki ywalli sehel."),
      t("Wear good shoes and take short steps downhill.", "Porte de bonnes chaussures et fais de petits pas en descente.", "البس سبادري باهية واعمل خطوات صغار في الهبطة.", "Elbes sbadri behya w a3mel khatwet s8ar fel habta."),
      t("Breathe steadily; you should be able to talk.", "Respire régulièrement, tu dois pouvoir parler.", "تنفّس بريتم ثابت، لازمك تنجّم تحكي.", "Tnaffes b rythme theb, lazmek tnajjem te7ki."),
    ],
    mistakes: [
      t("Going too fast, too soon.", "Partir trop vite, trop tôt.", "تمشي بالفيسع برشا من الأوّل.", "Temchi bel fisa3 barcha mel louel."),
      t("Long, pounding strides downhill.", "Grandes foulées lourdes en descente.", "خطوات طوال وتخبط بيهم في الهبطة.", "Khatwet twal w tokhbot bihom fel habta."),
    ],
    difficulty: 1,
    repRange: [900, 1800],
    timed: true,
  },
};
