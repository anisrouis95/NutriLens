// Calisthenics steps free-exercise-db doesn't have (lib/ladders.ts). Same
// shape as the dataset (instructions in English; the app translates steps),
// no photos yet: screens show the name and the coaching cues.

import type { Exercise } from '@/lib/exercises';
import type { ExerciseExtra } from './exerciseCuration';
import { t } from './text';

const bodyweight = { mechanic: 'compound' as const, equipment: 'body only', category: 'strength', images: [] as string[] };

export const customExercises: Exercise[] = [
  {
    ...bodyweight,
    id: 'TF_Wall_Push-Up',
    name: 'Wall Push-Up',
    force: 'push',
    level: 'beginner',
    primaryMuscles: ['chest'],
    secondaryMuscles: ['shoulders', 'triceps'],
    instructions: [
      'Stand an arm’s length from a wall and place your hands on it at shoulder height, a little wider than your shoulders.',
      'Keep your body in one straight line from head to heels and tighten your stomach.',
      'Bend your elbows to bring your chest towards the wall, elbows about 45° from your body.',
      'Push the wall away until your arms are straight. Step further back to make it harder.',
    ],
  },
  {
    ...bodyweight,
    id: 'TF_Dead_Hang',
    name: 'Dead Hang',
    force: 'static',
    level: 'beginner',
    primaryMuscles: ['forearms'],
    secondaryMuscles: ['lats', 'shoulders'],
    instructions: [
      'Grab a pull-up bar with both hands, palms facing away, a little wider than your shoulders.',
      'Lift your feet (or bend your knees) and hang with straight arms.',
      'Keep your shoulders slightly pulled down, away from your ears, and breathe.',
      'Hold for the time, then step down. Use a box to reach the bar if needed.',
    ],
  },
  {
    ...bodyweight,
    id: 'TF_Negative_Pull-Up',
    name: 'Negative Pull-Up',
    force: 'pull',
    level: 'beginner',
    primaryMuscles: ['lats'],
    secondaryMuscles: ['biceps', 'middle back', 'forearms'],
    instructions: [
      'Stand on a box or bench under the bar and grab it with palms facing away.',
      'Jump or step up so your chin is above the bar.',
      'Lower yourself as slowly as you can, about 5 seconds, until your arms are straight.',
      'Step back on the box and repeat. Never drop to the bottom.',
    ],
  },
  {
    ...bodyweight,
    id: 'TF_Bar_Support_Hold',
    name: 'Bar Support Hold',
    force: 'static',
    level: 'beginner',
    primaryMuscles: ['triceps'],
    secondaryMuscles: ['chest', 'shoulders'],
    instructions: [
      'Stand between parallel bars (or two sturdy chairs back to back) and place one hand on each.',
      'Press down until your arms are straight and your feet leave the floor.',
      'Keep your shoulders pushed down, away from your ears, and your body still.',
      'Hold for the time. Let your toes touch the floor if you need help.',
    ],
  },
  {
    ...bodyweight,
    id: 'TF_Negative_Dip',
    name: 'Negative Dip',
    force: 'push',
    level: 'beginner',
    primaryMuscles: ['triceps'],
    secondaryMuscles: ['chest', 'shoulders'],
    instructions: [
      'Start at the top of a dip on parallel bars, arms straight (jump or step up into it).',
      'Lower yourself slowly, about 5 seconds, leaning slightly forward, until your upper arms are level with the bars or you feel a stretch in the shoulders.',
      'Put your feet down and climb back to the top. Repeat.',
      'Stop if the front of your shoulders hurts.',
    ],
  },
  {
    ...bodyweight,
    id: 'TF_Hollow_Hold',
    name: 'Hollow Body Hold',
    force: 'static',
    level: 'beginner',
    primaryMuscles: ['abdominals'],
    secondaryMuscles: [],
    instructions: [
      'Lie on your back and press your lower back into the floor.',
      'Lift your shoulders and your feet a few centimetres off the floor, arms by your sides or overhead.',
      'Keep the lower back glued to the floor the whole time; bend your knees to make it easier.',
      'Hold for the time and breathe.',
    ],
  },
];

export const customExtras: Record<string, ExerciseExtra> = {
  'TF_Wall_Push-Up': {
    nameFr: 'Pompes contre le mur',
    difficulty: 1,
    repRange: [10, 20],
    cues: [
      t('Body straight from head to heels.', 'Corps droit de la tête aux talons.', 'البدن دريت من الراس للكعبة.', 'El badan droit mel ras lel ka3ba.'),
      t('Chest to the wall, then push it away.', 'La poitrine vers le mur, puis repousse-le.', 'الصدر للحيط، ومبعد ادفعو.', 'E sadr lel 7it, w ba3d edfa3ou.'),
    ],
    mistakes: [t('Hips sagging or sticking out.', 'Les hanches qui tombent ou qui ressortent.', 'الجناب يطيحو ولا يخرجو.', 'El jnab yti7ou walla yo5rjou.')],
  },
  TF_Dead_Hang: {
    nameFr: 'Suspension à la barre',
    difficulty: 1,
    timed: true,
    repRange: [15, 45],
    cues: [
      t('Shoulders down, away from your ears.', 'Épaules basses, loin des oreilles.', 'الكتاف لوطة، بعاد على وذنيك.', 'Ktef louta, b3ad 3la wdhnik.'),
      t('Breathe; stop before your grip gives up.', 'Respire ; arrête avant que la prise lâche.', 'تنفّس؛ وقّف قبل ما يديك يطلقو.', 'Tnaffes; wa99ef 9bal ma ydik yetl9ou.'),
    ],
    mistakes: [t('Shrugging up into the ears.', 'Remonter les épaules aux oreilles.', 'تطلّع كتافك لوذنيك.', 'Tatla3 ktefek l wdhnik.')],
  },
  'TF_Negative_Pull-Up': {
    nameFr: 'Traction négative',
    difficulty: 2,
    repRange: [3, 6],
    cues: [
      t('Start with your chin above the bar.', 'Commence le menton au-dessus de la barre.', 'ابدا وذقنك فوق البارة.', 'Ebda w dhe9nek fou9 el barre.'),
      t('Lower for about 5 slow seconds.', 'Descends en 5 secondes environ.', 'اهبط في قريب 5 ثواني بشويّة.', 'Ahbet f 9rib 5 secondes b chwaya.'),
    ],
    mistakes: [t('Dropping fast at the bottom.', 'Se laisser tomber en bas.', 'تطيح بالزربة في اللوطة.', 'Tti7 bel zerba fel louta.')],
  },
  TF_Bar_Support_Hold: {
    nameFr: 'Maintien aux barres parallèles',
    difficulty: 1,
    timed: true,
    repRange: [10, 30],
    avoidIf: ['shoulders'],
    cues: [
      t('Arms straight, shoulders pushed down.', 'Bras tendus, épaules poussées vers le bas.', 'يديك دريت، الكتاف مدفوعين للوطة.', 'Ydik droit, el ktef madfou3in lel louta.'),
      t('Body still, legs together.', 'Corps immobile, jambes serrées.', 'البدن ثابت، الساقين ملصوقين.', 'El badan theb, e sa9in malsou9in.'),
    ],
    mistakes: [t('Shoulders rising to the ears.', 'Les épaules qui montent aux oreilles.', 'الكتاف يطلعو لوذنيك.', 'El ktef yatl3ou l wdhnik.')],
  },
  TF_Negative_Dip: {
    nameFr: 'Dip négatif',
    difficulty: 2,
    repRange: [3, 6],
    avoidIf: ['shoulders'],
    cues: [
      t('Lower for about 5 slow seconds.', 'Descends en 5 secondes environ.', 'اهبط في قريب 5 ثواني بشويّة.', 'Ahbet f 9rib 5 secondes b chwaya.'),
      t('Stop at a comfortable depth.', 'Arrête à une profondeur confortable.', 'وقّف في عمق مرتاح فيه.', 'Wa99ef f 3ome9 mrta7 fih.'),
    ],
    mistakes: [t('Going too deep with sore shoulders.', 'Descendre trop bas avec des épaules douloureuses.', 'تهبط برشا وكتافك يوجعو.', 'Tahbet barcha w ktefek youj3ou.')],
  },
  TF_Hollow_Hold: {
    nameFr: 'Hollow body',
    difficulty: 2,
    timed: true,
    repRange: [15, 40],
    cues: [
      t('Lower back pressed into the floor.', 'Bas du dos plaqué au sol.', 'لوطة الظهر لاصقة في القاعة.', 'Louta e dhar las9a fel 9a3a.'),
      t('Bend the knees to make it easier.', 'Plie les genoux pour faciliter.', 'اطوي ركايبك باش تسهل.', 'Atwi rkaybek bech tes7el.'),
    ],
    mistakes: [t('Lower back lifting off the floor.', 'Le bas du dos qui décolle.', 'لوطة الظهر تتنحّى من القاعة.', 'Louta e dhar tetna77a mel 9a3a.')],
  },
};
