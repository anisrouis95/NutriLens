// Calisthenics: the training style (weights, mixed, calisthenics), the short
// starting test, and every ladder with its current step. Stepping a ladder
// here or by levelling up changes every session of the program at once.

import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ArrowDown, ArrowUp, Dumbbell, PersonStanding, Shuffle } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppData } from '@/contexts/AppDataContext';
import { Button, Chip, ChipRow, Group, IconButton, OptionTile, RichText, Screen, Section, Txt, Why, useSnackbar } from '@/components/ds';
import { exerciseName, getExercise } from '@/lib/exercises';
import {
  LADDER_ORDER,
  LADDERS,
  nextStep,
  previousStep,
  startingSteps,
  stepAt,
  type LadderId,
  type TestAnswers,
} from '@/lib/ladders';
import type { LocalizedText } from '@/lib/i18n';
import { radius, space, useTokens } from '@/theme';
import type { TrainingStyle } from '@/types';

const STYLES: { id: TrainingStyle; icon: typeof Dumbbell; title: LocalizedText; description: LocalizedText }[] = [
  {
    id: 'weights',
    icon: Dumbbell,
    title: { en: 'Weights', fr: 'Musculation', tn: 'الحديد', tnLatn: 'Musculation' },
    description: {
      en: 'Machines, dumbbells and bars. You progress by adding weight.',
      fr: 'Machines, haltères et barres. Tu progresses en ajoutant du poids.',
      tn: 'ماكينات، هالتار وبارات. تتقدّم كي تزيد في الثقل.',
      tnLatn: 'Machinet, haltères w barrat. Tet9addem ki tzid fel charge.',
    },
  },
  {
    id: 'mixed',
    icon: Shuffle,
    title: { en: 'Mixed (recommended)', fr: 'Mixte (conseillé)', tn: 'مخلّط (ننصحك بيه)', tnLatn: 'Mixte (nansa7ek bih)' },
    description: {
      en: 'Push-ups, pull-ups, rows, dips and core on bodyweight ladders; legs stay on machines, easier on the knees.',
      fr: 'Pompes, tractions, rowing, dips et gainage en échelles au poids du corps ; les jambes restent aux machines, plus doux pour les genoux.',
      tn: 'البومب، التراكسيون، الجبد، الديبس والكرش بوزن البدن؛ الساقين يقعدو على الماكينات، أرحم للركايب.',
      tnLatn: 'Pompes, tractions, rowing, dips w gainage b poids el badan; e sa9in yo93dou 3al machinet, ar7am lel rkayeb.',
    },
  },
  {
    id: 'calisthenics',
    icon: PersonStanding,
    title: { en: 'Calisthenics', fr: 'Calisthenics', tn: 'كاليستينيكس', tnLatn: 'Calisthenics' },
    description: {
      en: 'Everything at bodyweight, legs included (bridges, then squats if your knees allow).',
      fr: 'Tout au poids du corps, jambes comprises (ponts, puis squats si tes genoux le permettent).',
      tn: 'كل شي بوزن البدن، حتى الساقين (البونت، ومبعد السكوات كان ركايبك يسمحو).',
      tnLatn: 'Kol chay b poids el badan, 7atta e sa9in (ponts, w ba3d squats ken rkaybek yesm7ou).',
    },
  },
];

type Question = { key: keyof TestAnswers; text: LocalizedText; options: LocalizedText[] };

const QUESTIONS: Question[] = [
  {
    key: 'push',
    text: { en: 'Push-ups on the floor, in one go, with good form?', fr: 'Pompes au sol, d’affilée, bien faites ?', tn: 'قدّاش من بومب على القاعة، مرّة وحدة، بطريقة صحيحة؟', tnLatn: '9addech men pompe 3al 9a3a, marra wa7da, b tari9a s7i7a?' },
    options: [
      { en: 'None', fr: 'Aucune', tn: 'حتى وحدة', tnLatn: '7atta wa7da' },
      { en: '1–5', fr: '1–5', tn: '1–5', tnLatn: '1–5' },
      { en: '6–12', fr: '6–12', tn: '6–12', tnLatn: '6–12' },
      { en: '13+', fr: '13+', tn: '13+', tnLatn: '13+' },
    ],
  },
  {
    key: 'pull',
    text: { en: 'Hanging from a bar and pull-ups?', fr: 'Suspension à une barre et tractions ?', tn: 'تتعلّق في بارة والتراكسيون؟', tnLatn: 'Tet3allag f barre w les tractions?' },
    options: [
      { en: 'Can’t hang 30 s', fr: 'Moins de 30 s suspendu', tn: 'ما نقعدش 30 ثانية', tnLatn: 'Ma no93edch 30 s' },
      { en: 'Hang, no pull-up', fr: 'Suspendu, 0 traction', tn: 'نتعلّق، 0 تراكسيون', tnLatn: 'Net3allag, 0 traction' },
      { en: '1–3 pull-ups', fr: '1–3 tractions', tn: '1–3 تراكسيون', tnLatn: '1–3 tractions' },
      { en: '4+ pull-ups', fr: '4+ tractions', tn: '4+ تراكسيون', tnLatn: '4+ tractions' },
    ],
  },
  {
    key: 'dip',
    text: { en: 'Dips on parallel bars?', fr: 'Dips aux barres parallèles ?', tn: 'الديبس على البارات؟', tnLatn: 'Dips 3al barrat?' },
    options: [
      { en: 'Can’t hold myself up', fr: 'Je ne tiens pas en haut', tn: 'ما نشدّش روحي', tnLatn: 'Ma nchedech rou7i' },
      { en: 'Hold, no dip', fr: 'Je tiens, 0 dip', tn: 'نشدّ، 0 ديبس', tnLatn: 'Nched, 0 dip' },
      { en: '1–5 dips', fr: '1–5 dips', tn: '1–5 ديبس', tnLatn: '1–5 dips' },
      { en: '6+ dips', fr: '6+ dips', tn: '6+ ديبس', tnLatn: '6+ dips' },
    ],
  },
  {
    key: 'core',
    text: { en: 'How long can you hold a plank?', fr: 'Combien de temps tiens-tu la planche ?', tn: 'قدّاش تنجّم تشدّ البلانش؟', tnLatn: '9addech tnajjem tched el planche?' },
    options: [
      { en: 'Under 30 s', fr: 'Moins de 30 s', tn: 'أقل من 30 ثانية', tnLatn: 'A9al men 30 s' },
      { en: '30–60 s', fr: '30–60 s', tn: '30–60 ثانية', tnLatn: '30–60 s' },
      { en: 'Over 60 s', fr: 'Plus de 60 s', tn: 'أكثر من 60 ثانية', tnLatn: 'Akther men 60 s' },
    ],
  },
];

const ladderIds = (style: TrainingStyle): LadderId[] =>
  style === 'calisthenics' ? LADDER_ORDER : style === 'mixed' ? LADDER_ORDER.filter((l) => l !== 'legs') : [];

export default function CalisthenicsScreen() {
  const t = useTokens();
  const snackbar = useSnackbar();
  const { L, language } = useLanguage();
  const { profile, settings, updateSettings } = useAppData();
  const style = settings.style ?? 'weights';
  // A ladder style chosen before the test: the test decides the starting steps first.
  const [pending, setPending] = useState<TrainingStyle | null>(null);
  const [answers, setAnswers] = useState<Partial<TestAnswers>>({});
  if (!profile) return null;

  const testing = pending !== null;
  const shown = pending ?? style;
  const choose = (next: TrainingStyle) => {
    if (next !== 'weights' && !settings.ladderSteps) {
      setPending(next);
      return;
    }
    setPending(null);
    updateSettings({ style: next });
    snackbar.show(L({ en: 'Program updated', fr: 'Programme mis à jour', tn: 'البرنامج تبدّل', tnLatn: 'El programme tbaddel' }));
  };
  const complete = QUESTIONS.every((q) => answers[q.key] !== undefined);
  const start = () => {
    if (!complete || !pending) return;
    updateSettings({ style: pending, ladderSteps: startingSteps(answers as TestAnswers, profile) });
    setPending(null);
    snackbar.show(L({ en: 'Ladders ready: your program is updated', fr: 'Échelles prêtes : ton programme est à jour', tn: 'السلالم حاضرين: البرنامج تبدّل', tnLatn: 'Es-salelem 7adhrin: el programme tbaddel' }));
  };
  const move = (ladder: LadderId, index: number) => updateSettings({ ladderSteps: { ...settings.ladderSteps, [ladder]: index } });

  return (
    <Screen back title={L({ en: 'Calisthenics', fr: 'Calisthenics', tn: 'كاليستينيكس', tnLatn: 'Calisthenics' })}>
      <Txt tone="secondary">
        {L({
          en: 'Bodyweight training. You can’t add kilos to a push-up, so you get stronger by moving to a harder version of each movement: a ladder of steps. Tounsi Fit moves you up a step when every set reaches the top of its range and none felt Hard.',
          fr: 'L’entraînement au poids du corps. On ne peut pas ajouter de kilos à une pompe : on progresse en passant à une version plus dure de chaque mouvement, une échelle d’étapes. Tounsi Fit te fait monter d’une étape quand chaque série atteint le haut de sa fourchette sans être notée Dur.',
          tn: 'التمرين بوزن البدن. ما تنجّمش تزيد كيلوات في البومب، يعني تقوى كي تتعدّى لنسخة أصعب من كل حركة: سلّوم بالدرجات. Tounsi Fit يطلّعك درجة كي كل سيري توصل للفوق ووحدة ما جاتش صعيبة.',
          tnLatn: 'L entraînement b poids el badan. Ma tnajjemch tzid kilowat fel pompe, ya3ni t9wa ki tet3adda l version as3eb men kol 7arka: sellom b darajet. Tounsi Fit ytalla3ek daraja ki kol série toussel lel fou9 w 7atta wa7da ma jetech s3iba.',
        })}
      </Txt>

      <Section title={L({ en: 'Training style', fr: 'Style d’entraînement', tn: 'طريقة التمرين', tnLatn: 'Style el entraînement' })}>
        <View style={{ gap: space.sm }}>
          {STYLES.map((s) => (
            <OptionTile
              key={s.id}
              title={L(s.title)}
              description={L(s.description)}
              selected={shown === s.id}
              onPress={() => choose(s.id)}
              leading={(c) => <s.icon size={22} color={c} />}
            />
          ))}
        </View>
      </Section>

      {testing ? (
        <Section title={L({ en: 'Where do you start?', fr: 'Tu commences où ?', tn: 'منين تبدا؟', tnLatn: 'Mnin tebda?' })}>
          <Txt variant="caption" tone="secondary">
            {L({
              en: 'Four honest answers set the first step of each ladder. Above 90 kg, pull-ups and dips start a step lower: normal, and every kilo lost makes them easier.',
              fr: 'Quatre réponses honnêtes fixent la première étape de chaque échelle. Au-dessus de 90 kg, tractions et dips commencent une étape plus bas : c’est normal, et chaque kilo perdu les rend plus faciles.',
              tn: 'أربعة أجوبة بالصحيح يحدّدو أوّل درجة في كل سلّوم. فوق 90 كيلو، التراكسيون والديبس يبداو درجة لوطة: عادي، وكل كيلو تنقّصو يسهّلهم.',
              tnLatn: 'Arb3a ejwba bel s7i7 y7addou awwel daraja f kol sellom. Fou9 90 kilo, les tractions w les dips yebdew daraja louta: 3adi, w kol kilo tna99sou ys7elhom.',
            })}
          </Txt>
          {QUESTIONS.map((q) => (
            <View key={q.key} style={{ marginTop: space.lg }}>
              <Txt variant="bodyStrong">{L(q.text)}</Txt>
              <ChipRow style={{ marginTop: space.sm }}>
                {q.options.map((o, i) => (
                  <Chip key={i} label={L(o)} selected={answers[q.key] === i} onPress={() => setAnswers((a) => ({ ...a, [q.key]: i }))} />
                ))}
              </ChipRow>
            </View>
          ))}
          <View style={styles.actions}>
            <Button label={L({ en: 'Start my ladders', fr: 'Lancer mes échelles', tn: 'ابدا السلالم متاعي', tnLatn: 'Ebda es-salelem mte3i' })} onPress={start} disabled={!complete} size="lg" fill />
            <Button variant="text" label={L({ en: 'Cancel', fr: 'Annuler', tn: 'بطّل', tnLatn: 'Batel' })} onPress={() => setPending(null)} />
          </View>
        </Section>
      ) : null}

      {!testing && ladderIds(style).length ? (
        <Section title={L({ en: 'Your ladders', fr: 'Tes échelles', tn: 'السلالم متاعك', tnLatn: 'Es-salelem mte3ek' })}>
          <Group>
            {ladderIds(style).map((id, n) => {
              const ladder = LADDERS[id];
              const at = stepAt(id, settings.ladderSteps?.[id] ?? 0, profile);
              if (!at) return null;
              const ex = getExercise(at.step.id);
              const next = nextStep(id, at.index, profile);
              const prev = previousStep(id, at.index, profile);
              const nextEx = next ? getExercise(next.step.id) : undefined;
              return (
                <View key={id} style={[styles.ladder, n > 0 && { borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: t.hairline }]}>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Txt variant="overline" tone="tertiary">
                      {L(ladder.name)}
                    </Txt>
                    <Txt variant="bodyStrong" numberOfLines={2} style={{ marginTop: 2 }}>
                      {ex ? exerciseName(ex, language) : at.step.id}
                    </Txt>
                    <Txt variant="caption" tone="secondary" numberOfLines={2} style={{ marginTop: 2 }}>
                      {`${at.step.reps[0]}–${at.step.reps[1]}${at.step.timed ? ' s' : ''}`}
                      {nextEx ? ` · ${L({ en: 'next', fr: 'ensuite', tn: 'اللي بعدو', tnLatn: 'ba3dou' })}: ${exerciseName(nextEx, language)}` : ''}
                    </Txt>
                    <View style={styles.dots} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
                      {ladder.steps.map((s, i) => {
                        const blocked = s.avoidIf?.some((l) => profile.limitations.includes(l));
                        return (
                          <View
                            key={s.id}
                            style={[
                              styles.dot,
                              { backgroundColor: i <= at.index ? t.accent : t.surfaceHigh },
                              blocked && { backgroundColor: 'transparent', borderWidth: 1, borderColor: t.textDisabled },
                            ]}
                          />
                        );
                      })}
                    </View>
                  </View>
                  <View style={styles.stepButtons}>
                    <IconButton
                      label={L({ en: 'Harder step', fr: 'Étape plus dure', tn: 'درجة أصعب', tnLatn: 'Daraja as3ab' })}
                      onPress={() => next && move(id, next.index)}
                      disabled={!next}
                      size={44}
                      icon={(c) => <ArrowUp size={20} color={c} />}
                    />
                    <IconButton
                      label={L({ en: 'Easier step', fr: 'Étape plus facile', tn: 'درجة أسهل', tnLatn: 'Daraja as7al' })}
                      onPress={() => prev && move(id, prev.index)}
                      disabled={!prev}
                      size={44}
                      icon={(c) => <ArrowDown size={20} color={c} />}
                    />
                  </View>
                </View>
              );
            })}
          </Group>
          <Button
            variant="text"
            label={L({ en: 'Redo the starting test', fr: 'Refaire le test de départ', tn: 'عاود تجربة البداية', tnLatn: '3awed test el bidaya' })}
            onPress={() => {
              setAnswers({});
              setPending(style);
            }}
            style={{ marginTop: space.sm, marginLeft: -space.md, alignSelf: 'flex-start' }}
          />
        </Section>
      ) : null}

      <Why title={L({ en: 'How to start, and what to track', fr: 'Comment commencer, et quoi suivre', tn: 'كيفاش تبدا، وشنوّة تتبّع', tnLatn: 'Kifech tebda, w chnowa tetebba3' })} style={{ marginTop: space.xxl }}>
        <RichText
          text={L({
            en: '- **Gear:** a pull-up bar, and parallel bars or two sturdy chairs. At the gym, the dip station and the assisted pull-up machine work too.\n- **Each set:** stop with about 2 clean reps left, then rate it. Holds count in seconds.\n- **Moving up:** when every set reaches the top of the range without a Hard, saving the workout moves that ladder up a step. Use the arrows if a step is clearly too easy or too hard.\n- **Your body weight:** pull-ups and dips lift almost all of it, so they come slower above 90 kg. Losing weight and getting stronger both move you up.\n- **Knees:** in Mixed, legs stay on machines; jumping moves never appear.\n- **Once a month:** test max push-ups, max pull-ups (or how slow a negative is) and your longest hollow hold, and note them in the coach.',
            fr: '- **Matériel :** une barre de traction, et des barres parallèles ou deux chaises solides. À la salle, la station de dips et la machine de tractions assistées marchent aussi.\n- **Chaque série :** arrête avec environ 2 bonnes répétitions en réserve, puis note-la. Les maintiens se comptent en secondes.\n- **Monter :** quand chaque série atteint le haut de la fourchette sans Dur, enregistrer la séance fait monter l’échelle d’une étape. Utilise les flèches si une étape est clairement trop facile ou trop dure.\n- **Ton poids :** tractions et dips soulèvent presque tout ton poids, donc ils viennent plus lentement au-dessus de 90 kg. Perdre du poids et devenir plus fort te font monter tous les deux.\n- **Genoux :** en Mixte, les jambes restent aux machines ; aucun saut.\n- **Une fois par mois :** teste tes pompes max, tes tractions max (ou la lenteur d’une négative) et ton hollow le plus long, et note-les dans le coach.',
            tn: '- **الماتريال:** بارة تراكسيون، وبارات ديبس ولا زوز كراسي صحاح. في السالة، بلاصة الديبس وماكينة التراكسيون المعاونة يخدمو زادة.\n- **كل سيري:** وقّف وانت مازال تنجّم قريب 2 مرّات نظاف، ومبعد قول كيفاش جاتك. التمارين اللي تشدّ فيهم يتحسبو بالثواني.\n- **كيفاش تطلع:** كي كل سيري توصل للفوق وحتى وحدة ما جاتش صعيبة، تسجيل الحصّة يطلّع السلّوم درجة. استعمل الفلاش كان درجة ساهلة برشا ولا صعيبة برشا.\n- **وزنك:** التراكسيون والديبس يهزّو قريب الوزن الكل، يعني يجيو بالشويّة فوق 90 كيلو. كي تنقّص في الوزن وكي تقوى، الزوز يطلّعوك.\n- **الركايب:** في المخلّط، الساقين يقعدو على الماكينات؛ حتى قفز.\n- **مرّة في الشهر:** جرّب قدّاش من بومب، قدّاش من تراكسيون (ولا قدّاش تهبط بشويّة) وأطول hollow، وسجّلهم عند الكوتش.',
            tnLatn: '- **El matériel:** barre traction, w barrat dips walla zouz karassi s7a7. Fel salle, station el dips w machine el tractions assistées ye5dmou zeda.\n- **Kol série:** wa99ef w enti mazelt tnajjem 9rib 2 reps ndhaf, w ba3d 9oul kifech jatek. Les exercices eli tched fihom yet7sbou bel secondes.\n- **Kifech tetla3:** ki kol série toussel lel fou9 w 7atta wa7da ma jetech s3iba, tasjil séance ytalla3 es-sellom daraja. Esta3mel el flèches ken daraja sehla barcha walla s3iba barcha.\n- **Poids mte3ek:** les tractions w les dips yhezzou 9rib el poids lkol, ya3ni yjiw b chwaya fou9 90 kilo. Ki tna99es fel poids w ki t9wa, ezzouz ytal3ouk.\n- **Rkayeb:** fel mixte, e sa9in yo93dou 3al machinet; 7atta 9afz.\n- **Marra fel chhar:** jarreb 9addech men pompe, 9addech men traction (walla 9addech tahbet b chwaya) w atwel hollow, w sajjelhom 3and el coach.',
          })}
        />
      </Why>
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: { gap: space.sm, marginTop: space.xl },
  ladder: { flexDirection: 'row', alignItems: 'center', gap: space.md, paddingHorizontal: space.lg, paddingVertical: space.md },
  dots: { flexDirection: 'row', gap: 5, marginTop: space.sm },
  dot: { width: 14, height: 6, borderRadius: radius.pill },
  stepButtons: { gap: space.xs },
});
