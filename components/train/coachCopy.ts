// What the weight coach says (lib/coach.ts), in every language. Placeholders:
// {{min}} {{max}} reps of the range, {{test}} reps the test weight could do, {{kg}} {{from}} {{to}} weights, {{days}},
// {{n}} the set number and {{reps}} the new rep target.

import type { Adjustment, TargetReason } from '@/lib/coach';
import type { LocalizedText } from '@/lib/i18n';
import type { Effort } from '@/types';

const REASONS: Record<Exclude<TargetReason['kind'], 'more_reps'>, LocalizedText> = {
  first_time: {
    en: 'Pick a weight you could lift about {{test}} times, do {{min}} clean reps, then rate the set. The app fills the next sets from it.',
    fr: 'Prends une charge que tu pourrais soulever environ {{test}} fois, fais {{min}} répétitions propres, puis note la série. L’app remplit les séries suivantes.',
    tn: 'اختار ثقل تنجّم تهزّو قريب {{test}} مرّة، اعمل {{min}} مرّات نظاف، ومبعد قول كيفاش جاتك السيري. التطبيق يعمّر السيريات اللي بعدها.',
    tnLatn: 'E5tar charge tnajjem thezzha 9rib {{test}} marra, a3mel {{min}} reps ndhaf, w ba3d 9oul kifech jatek série. L app t3ammer les séries eli ba3dha.',
  },
  add_weight: {
    en: 'Every set reached {{max}} last time: {{to}} kg today, back to {{min}} reps.',
    fr: 'Toutes les séries ont atteint {{max}} la dernière fois : {{to}} kg aujourd’hui, retour à {{min}} répétitions.',
    tn: 'المرّة اللي فاتت السيريات الكل وصلو لـ {{max}}: {{to}} kg اليوم، وارجع لـ {{min}} مرّات.',
    tnLatn: 'L marra eli fetet les séries lkol wslou l {{max}}: {{to}} kg lyoum, w erja3 l {{min}} reps.',
  },
  add_reps: {
    en: 'Same weight as last time: one more rep on each set.',
    fr: 'Même charge que la dernière fois : une répétition de plus à chaque série.',
    tn: 'نفس الثقل متاع المرّة اللي فاتت: زيد مرّة في كل سيري.',
    tnLatn: 'Nafs el charge mta3 l marra eli fetet: zid rep f kol série.',
  },
  repeat: {
    en: 'It was hard last time: same {{kg}} kg, aim for {{min}} clean reps.',
    fr: 'C’était dur la dernière fois : même {{kg}} kg, vise {{min}} répétitions propres.',
    tn: 'المرّة اللي فاتت كانت صعيبة: نفس {{kg}} kg، حاول {{min}} مرّات نظاف.',
    tnLatn: 'L marra eli fetet kenet s3iba: nafs {{kg}} kg, 7awel {{min}} reps ndhaf.',
  },
  drop: {
    en: 'Short of {{min}} reps twice at {{from}} kg: {{to}} kg today, then build back up.',
    fr: 'Moins de {{min}} répétitions deux fois à {{from}} kg : {{to}} kg aujourd’hui, puis remonte.',
    tn: 'مرّتين ما وصلتش لـ {{min}} مرّات بـ {{from}} kg: {{to}} kg اليوم، ومبعد اطلع شويّة بشويّة.',
    tnLatn: 'Marrtin ma wsoltech l {{min}} reps b {{from}} kg: {{to}} kg lyoum, w ba3d etla3 chwaya b chwaya.',
  },
  deload: {
    en: 'No progress for 3 sessions at {{from}} kg: reset to {{to}} kg and climb again. Normal while losing weight.',
    fr: 'Pas de progrès depuis 3 séances à {{from}} kg : repars de {{to}} kg et remonte. Normal quand on perd du poids.',
    tn: '3 حصص بـ {{from}} kg وما تقدّمتش: ارجع لـ {{to}} kg واطلع من جديد. عادي كي تكون تنقّص في الوزن.',
    tnLatn: '3 séances b {{from}} kg w ma t9addemtech: erja3 l {{to}} kg w etla3 men jdid. 3adi ki tkoun tna99es fel poids.',
  },
  comeback: {
    en: '{{days}} days since last time: {{to}} kg today to ease back in.',
    fr: '{{days}} jours depuis la dernière fois : {{to}} kg aujourd’hui pour reprendre en douceur.',
    tn: '{{days}} نهار من آخر مرّة: {{to}} kg اليوم باش ترجع بشويّة.',
    tnLatn: '{{days}} nhar men e5er marra: {{to}} kg lyoum bech terja3 b chwaya.',
  },
  top_reached: {
    en: 'You reached the top of the range: time for a harder version. Tap ⇄ to pick one.',
    fr: 'Tu as atteint le haut de la fourchette : passe à une version plus dure. Touche ⇄ pour la choisir.',
    tn: 'وصلت للفوق: وقت نسخة أصعب. انزل على ⇄ واختار.',
    tnLatn: 'Wsolt lel fou9: wa9t version as3eb. Enzel 3la ⇄ w e5tar.',
  },
};

const EASY_JUMP: LocalizedText = {
  en: 'Every set reached {{max}} and felt easy: {{to}} kg today, back to {{min}} reps.',
  fr: 'Toutes les séries ont atteint {{max}} facilement : {{to}} kg aujourd’hui, retour à {{min}} répétitions.',
  tn: 'السيريات الكل وصلو لـ {{max}} وجاو ساهلين: {{to}} kg اليوم، وارجع لـ {{min}} مرّات.',
  tnLatn: 'Les séries lkol wslou l {{max}} w jew sehlin: {{to}} kg lyoum, w erja3 l {{min}} reps.',
};

const FIRST_BODYWEIGHT: LocalizedText = {
  en: 'New exercise: aim for {{min}}–{{max}} clean reps (or seconds), stop with about 2 left, then rate the set.',
  fr: 'Nouvel exercice : vise {{min}} à {{max}} répétitions propres (ou secondes), arrête avec environ 2 en réserve, puis note la série.',
  tn: 'تمرين جديد: حاول {{min}}–{{max}} مرّات نظاف (ولا ثواني)، وقّف وانت مازال تنجّم قريب 2، ومبعد قول كيفاش جاتك.',
  tnLatn: 'Exercice jdid: 7awel {{min}}–{{max}} reps ndhaf (walla secondes), wa99ef w enti mazelt tnajjem 9rib 2, w ba3d 9oul kifech jatek.',
};

const MORE_REPS: LocalizedText = {
  en: 'One more rep than last time on each set.',
  fr: 'Une répétition de plus que la dernière fois à chaque série.',
  tn: 'زيد مرّة على المرّة اللي فاتت في كل سيري.',
  tnLatn: 'Zid rep 3al marra eli fetet f kol série.',
};

const MORE_SECONDS: LocalizedText = {
  en: 'Five seconds more than last time on each set.',
  fr: 'Cinq secondes de plus que la dernière fois à chaque série.',
  tn: 'زيد 5 ثواني على المرّة اللي فاتت في كل سيري.',
  tnLatn: 'Zid 5 secondes 3al marra eli fetet f kol série.',
};

/** Why today's target is what it is. */
export function reasonCopy(reason: TargetReason, timed: boolean): LocalizedText {
  if (reason.kind === 'more_reps') return timed ? MORE_SECONDS : MORE_REPS;
  if (reason.kind === 'first_time' && reason.bodyweight) return FIRST_BODYWEIGHT;
  if (reason.kind === 'add_weight' && reason.easy) return EASY_JUMP;
  return REASONS[reason.kind];
}

/** What a rated set changed in the sets after it. */
export const NOTE_COPY: Record<Adjustment['kind'], LocalizedText> = {
  calibrated: {
    en: 'Set {{n}} found your weight: next sets {{kg}} kg × {{reps}}.',
    fr: 'La série {{n}} a trouvé ta charge : séries suivantes {{kg}} kg × {{reps}}.',
    tn: 'السيري {{n}} لقات الثقل متاعك: السيريات الجايين {{kg}} kg × {{reps}}.',
    tnLatn: 'Série {{n}} l9at el charge mte3ek: les séries jeyin {{kg}} kg × {{reps}}.',
  },
  harder: {
    en: 'Set {{n}} felt easy: next sets {{kg}} kg.',
    fr: 'Série {{n}} facile : séries suivantes {{kg}} kg.',
    tn: 'السيري {{n}} جات ساهلة: الجايين {{kg}} kg.',
    tnLatn: 'Série {{n}} jet sehla: el jeyin {{kg}} kg.',
  },
  easier: {
    en: 'Set {{n}} was too hard: next sets {{kg}} kg.',
    fr: 'Série {{n}} trop dure : séries suivantes {{kg}} kg.',
    tn: 'السيري {{n}} جات صعيبة برشا: الجايين {{kg}} kg.',
    tnLatn: 'Série {{n}} jet s3iba barcha: el jeyin {{kg}} kg.',
  },
  more_reps: {
    en: 'Set {{n}} felt easy: aim for {{reps}} on the next sets.',
    fr: 'Série {{n}} facile : vise {{reps}} aux séries suivantes.',
    tn: 'السيري {{n}} جات ساهلة: حاول {{reps}} في الجايين.',
    tnLatn: 'Série {{n}} jet sehla: 7awel {{reps}} fel jeyin.',
  },
};

export const EFFORT_NAMES: Record<Effort, LocalizedText> = {
  easy: { en: 'Easy', fr: 'Facile', tn: 'ساهل', tnLatn: 'Sehel' },
  good: { en: 'Good', fr: 'Bien', tn: 'مليح', tnLatn: 'Mli7' },
  hard: { en: 'Hard', fr: 'Dur', tn: 'صعيب', tnLatn: 'S3ib' },
};

/** Spoken with each effort button. */
export const EFFORT_HELP: Record<Effort, LocalizedText> = {
  easy: { en: '4 or more reps left', fr: '4 répétitions ou plus en réserve', tn: 'مازال تنجّم 4 ولا أكثر', tnLatn: 'Mazelt tnajjem 4 walla akther' },
  good: { en: '1 to 3 reps left', fr: '1 à 3 répétitions en réserve', tn: 'مازال تنجّم 1 لـ 3', tnLatn: 'Mazelt tnajjem 1 l 3' },
  hard: { en: 'No rep left, or failed', fr: 'Plus rien en réserve, ou échec', tn: 'ما بقى شي، ولا ما كمّلتش', tnLatn: 'Ma b9a chay, walla ma kammaltech' },
};
