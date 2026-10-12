import { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useReducedMotion } from 'react-native-reanimated';
import { ChevronRight, CircleAlert, Dumbbell, Languages, Lightbulb, Repeat } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppData } from '@/contexts/AppDataContext';
import {
  Appear,
  Button,
  Chip,
  ChipRow,
  Divider,
  EmptyState,
  Group,
  Screen,
  Section,
  Tap,
  Txt,
  useFormat,
  useSnackbar,
} from '@/components/ds';
import ExerciseAnimation, { ExerciseThumb } from '@/components/exercise/ExerciseAnimation';
import MuscleMap from '@/components/exercise/MuscleMap';
import {
  EQUIPMENT_NAMES,
  LEVEL_NAMES,
  MUSCLE_NAMES,
  MUSCLE_ROLES,
  Muscle,
  bodyHighlightData,
  exerciseImageUrls,
  exerciseName,
  getExercise,
} from '@/lib/exercises';
import { exerciseExtras } from '@/data/exerciseCuration';
import { loadJSON, saveJSON } from '@/lib/storage';
import { generate } from '@/services/gemini';
import { radius, space, useTokens } from '@/theme';

const THUMB = 56;

/** Read-only fact pill (the ds Chip is a control and dims when it has no action). */
function MetaChip({ label }: { label: string }) {
  const t = useTokens();
  return (
    <View style={[styles.meta, { backgroundColor: t.surfaceHigh, borderColor: t.hairline }]}>
      <Txt variant="label" tone="secondary" numberOfLines={1}>
        {label}
      </Txt>
    </View>
  );
}

export default function ExerciseScreen() {
  const t = useTokens();
  const router = useRouter();
  const fmt = useFormat();
  const snackbar = useSnackbar();
  const reduce = useReducedMotion();
  const { L, language } = useLanguage();
  const { profile, sessions, workoutPlan, setWorkoutPlan } = useAppData();
  const { id, day, index } = useLocalSearchParams<{ id: string; day?: string; index?: string }>();
  const exercise = getExercise(id);
  const extra = exerciseExtras[id];
  const [selectedMuscle, setSelectedMuscle] = useState<Muscle | null>(null);
  const [frSteps, setFrSteps] = useState<string[] | null>(null);
  const [translating, setTranslating] = useState(false);

  const plannedDay = workoutPlan?.days.find((d) => d.id === day);
  const plannedIndex = index !== undefined ? Number(index) : -1;
  const planned = plannedDay?.exercises[plannedIndex];

  // Cached French translation of the step-by-step instructions.
  useEffect(() => {
    if (language !== 'fr' || !exercise) return;
    loadJSON<string[] | null>(`@nl/tr/${exercise.id}`, null).then(setFrSteps);
  }, [language, exercise]);

  const history = useMemo(() => {
    const rows = sessions
      .filter((s) => s.finishedAt)
      .map((s) => ({ date: s.date, sets: s.sets.filter((x) => x.exerciseId === id && x.done) }))
      .filter((r) => r.sets.length)
      .sort((a, b) => b.date.localeCompare(a.date));
    return rows.slice(0, 5);
  }, [sessions, id]);

  if (!exercise) {
    return (
      <Screen back title={L({ en: 'Exercise', fr: 'Exercice' })} largeTitle={false}>
        <EmptyState
          icon={(c) => <Dumbbell size={28} color={c} />}
          title={L({ en: 'Exercise not found.', fr: 'Exercice introuvable.' })}
        />
      </Screen>
    );
  }

  const translate = async () => {
    setTranslating(true);
    try {
      const text = await generate({
        contents: [
          {
            role: 'user',
            parts: [
              {
                text:
                  'Translate these gym exercise instructions into natural French (tutoiement, coaching tone). Return exactly one line per step, no numbering, no extra text.\n\n' +
                  exercise.instructions.join('\n'),
              },
            ],
          },
        ],
      });
      const steps = text.split('\n').map((s) => s.replace(/^\s*[-\d.)]+\s*/, '').trim()).filter(Boolean);
      setFrSteps(steps);
      saveJSON(`@nl/tr/${exercise.id}`, steps);
    } catch {
      // Keep the English steps on failure.
      snackbar.show(L({ en: 'Couldn’t translate right now.', fr: 'Traduction impossible pour le moment.' }));
    } finally {
      setTranslating(false);
    }
  };

  const swapInPlan = (newId: string) => {
    if (!workoutPlan || !plannedDay || !planned) return;
    const days = workoutPlan.days.map((d) =>
      d.id !== plannedDay.id
        ? d
        : {
            ...d,
            exercises: d.exercises.map((e, i) =>
              i !== plannedIndex
                ? e
                : {
                    ...e,
                    exerciseId: newId,
                    alternatives: [e.exerciseId, ...e.alternatives.filter((a) => a !== newId)].slice(0, 3),
                  },
            ),
          },
    );
    setWorkoutPlan({ ...workoutPlan, days });
    snackbar.show(L({ en: 'Swapped in your plan', fr: 'Remplacé dans ton plan' }));
    router.replace({ pathname: '/exercise/[id]', params: { id: newId, day, index } });
  };

  const images = exerciseImageUrls(exercise);
  const steps = language === 'fr' && frSteps ? frSteps : exercise.instructions;
  const muscles = [
    ...exercise.primaryMuscles.map((m) => ({ m, primary: true })),
    ...exercise.secondaryMuscles.map((m) => ({ m, primary: false })),
  ];
  const locale = language === 'fr' ? 'fr-FR' : 'en-US';
  const kg = (n: number) => fmt(n, Number.isInteger(n) ? 0 : 1);
  const restText = (sec: number) => {
    const min = sec / 60;
    return sec >= 120 ? `${Number.isInteger(min) ? min : fmt(min, 1)} min` : `${sec} s`;
  };

  return (
    <Screen back title={exerciseName(exercise, language)}>
      <ChipRow>
        <MetaChip label={L(LEVEL_NAMES[exercise.level])} />
        {exercise.equipment ? <MetaChip label={L(EQUIPMENT_NAMES[exercise.equipment])} /> : null}
        {exercise.mechanic ? (
          <MetaChip
            label={
              exercise.mechanic === 'compound'
                ? L({ en: 'Multi-joint', fr: 'Polyarticulaire' })
                : L({ en: 'Isolation', fr: 'Isolation' })
            }
          />
        ) : null}
      </ChipRow>

      <View style={{ marginTop: space.lg }}>
        <ExerciseAnimation images={images} />
      </View>
      {images.length > 1 && !reduce ? (
        <Txt variant="caption" tone="tertiary" align="center" style={{ marginTop: space.sm }}>
          {L({ en: 'Tap the photo to pause or play', fr: 'Touche la photo pour mettre en pause ou relancer' })}
        </Txt>
      ) : null}

      {planned ? (
        <View style={[styles.planBox, { backgroundColor: t.accentSoft }]}>
          <Txt variant="label" tone="accent">
            {L({ en: 'In your plan', fr: 'Dans ton plan' })}
          </Txt>
          <Txt variant="numMedium" style={{ marginTop: space.xs }}>
            {`${planned.sets} × ${planned.repsMin}–${planned.repsMax} ${planned.timed ? 's' : L({ en: 'reps', fr: 'rép.' })} · ${L({ en: 'rest', fr: 'repos' })} ${restText(planned.restSec)}`}
          </Txt>
          <Txt tone="secondary" style={{ marginTop: space.sm }}>
            {L({
              en: 'Pick a weight you can lift for the reps with 1–3 reps left in the tank. When you hit the top of the range on every set, add a little weight next time.',
              fr: 'Choisis une charge que tu peux soulever pour ces répétitions en gardant 1 à 3 répétitions en réserve. Quand tu atteins le haut de la fourchette sur toutes les séries, ajoute un peu de poids la fois suivante.',
            })}
          </Txt>
        </View>
      ) : null}

      <Section title={L({ en: 'Muscles worked', fr: 'Muscles travaillés' })}>
        <MuscleMap data={bodyHighlightData(exercise)} sex={profile?.sex} scale={0.7} />
        <ChipRow style={{ marginTop: space.lg }}>
          {muscles.map(({ m, primary }) => (
            <Chip
              key={m}
              label={`${L(MUSCLE_NAMES[m])}${primary ? '' : ` (${L({ en: 'helper', fr: 'appoint' })})`}`}
              selected={selectedMuscle === m}
              onPress={() => setSelectedMuscle(selectedMuscle === m ? null : m)}
            />
          ))}
        </ChipRow>
        <Appear key={selectedMuscle ?? 'none'} offset={4} style={{ marginTop: space.md }}>
          {selectedMuscle ? (
            <Txt tone="secondary">
              <Txt variant="bodyStrong">{L({ en: '{{m}}: ', fr: '{{m}} : ' }, { m: L(MUSCLE_NAMES[selectedMuscle]) })}</Txt>
              {L(MUSCLE_ROLES[selectedMuscle])}
            </Txt>
          ) : (
            <Txt variant="caption" tone="tertiary">
              {L({ en: 'Tap a muscle to see what it does.', fr: 'Touche un muscle pour voir son rôle.' })}
            </Txt>
          )}
        </Appear>
      </Section>

      {extra?.cues?.length ? (
        <Section title={L({ en: 'Coach cues', fr: 'Conseils du coach' })}>
          <View style={styles.list}>
            {extra.cues.map((c, i) => (
              <View key={i} style={styles.listRow}>
                <Lightbulb size={20} color={t.textSecondary} style={styles.listIcon} />
                <Txt style={{ flex: 1 }}>{L(c)}</Txt>
              </View>
            ))}
          </View>
        </Section>
      ) : null}

      {extra?.mistakes?.length ? (
        <Section title={L({ en: 'Common mistakes', fr: 'Erreurs fréquentes' })}>
          <View style={styles.list}>
            {extra.mistakes.map((c, i) => (
              <View key={i} style={styles.listRow}>
                <CircleAlert size={20} color={t.danger} style={styles.listIcon} />
                <Txt style={{ flex: 1 }}>{L(c)}</Txt>
              </View>
            ))}
          </View>
        </Section>
      ) : null}

      <Section
        title={L({ en: 'Step by step', fr: 'Étape par étape' })}
        action={
          language === 'fr' && !frSteps ? (
            <Button
              label={L({ en: 'Translate', fr: 'Traduire' })}
              variant="text"
              icon={(c) => <Languages size={20} color={c} />}
              onPress={translate}
              loading={translating}
              style={{ marginRight: -space.md }}
            />
          ) : undefined
        }
      >
        <View style={styles.list}>
          {steps.map((s, i) => (
            <View key={i} style={styles.listRow}>
              <Txt variant="numMedium" tone="tertiary" style={styles.stepNum}>
                {i + 1}
              </Txt>
              <Txt style={{ flex: 1 }}>{s}</Txt>
            </View>
          ))}
        </View>
      </Section>

      {history.length ? (
        <Section title={L({ en: 'Your history', fr: 'Ton historique' })}>
          <Group>
            {history.map((h, n) => (
              <View key={h.date}>
                <View style={styles.historyRow}>
                  <Txt variant="caption" tone="secondary">
                    {new Date(h.date + 'T12:00:00').toLocaleDateString(locale, { weekday: 'short', day: 'numeric', month: 'short' })}
                  </Txt>
                  <Txt variant="numMedium" style={{ marginTop: 2 }}>
                    {h.sets.map((s) => (s.weightKg ? `${kg(s.weightKg)}×${s.reps}` : `${s.reps}`)).join(' · ')}
                  </Txt>
                </View>
                {n < history.length - 1 ? <Divider inset={space.lg} /> : null}
              </View>
            ))}
          </Group>
        </Section>
      ) : null}

      {planned && planned.alternatives.length ? (
        <Section title={L({ en: 'Swap for an alternative', fr: 'Remplacer par une alternative' })}>
          <Txt variant="caption" tone="secondary" style={{ marginBottom: space.md }}>
            {L({
              en: 'Same movement pattern — use one if the machine is busy or this one feels wrong.',
              fr: 'Même type de mouvement — utile si la machine est prise ou si celui-ci ne te convient pas.',
            })}
          </Txt>
          <Group>
            {planned.alternatives.map((altId, n) => {
              const alt = getExercise(altId);
              if (!alt) return null;
              return (
                <View key={altId}>
                  <View style={styles.altRow}>
                    <Tap
                      onPress={() => router.push({ pathname: '/exercise/[id]', params: { id: altId } })}
                      pressScale={1}
                      pressedStyle={{ backgroundColor: t.pressed }}
                      style={styles.altMain}
                    >
                      <ExerciseThumb uri={exerciseImageUrls(alt)[0]} size={THUMB} />
                      <Txt variant="bodyStrong" numberOfLines={2} style={{ flex: 1 }}>
                        {exerciseName(alt, language)}
                      </Txt>
                      <ChevronRight size={20} color={t.textTertiary} />
                    </Tap>
                    <Button
                      label={L({ en: 'Use', fr: 'Utiliser' })}
                      variant="tonal"
                      icon={(c) => <Repeat size={20} color={c} />}
                      onPress={() => swapInPlan(altId)}
                      haptic="light"
                      style={styles.useButton}
                    />
                  </View>
                  {n < planned.alternatives.length - 1 ? <Divider inset={space.lg + THUMB + space.md} /> : null}
                </View>
              );
            })}
          </Group>
        </Section>
      ) : null}

      <Txt variant="caption" tone="tertiary" style={{ marginTop: space.xxl }}>
        {L({ en: 'Images & instructions: free-exercise-db (public domain).', fr: 'Images et instructions : free-exercise-db (domaine public).' })}
      </Txt>
    </Screen>
  );
}

const styles = StyleSheet.create({
  meta: {
    height: 32,
    paddingHorizontal: space.md,
    borderRadius: radius.pill,
    borderWidth: StyleSheet.hairlineWidth,
    justifyContent: 'center',
  },
  planBox: {
    marginTop: space.xl,
    padding: space.lg,
    borderRadius: radius.md,
  },
  list: { gap: space.md },
  listRow: { flexDirection: 'row', alignItems: 'flex-start', gap: space.md },
  listIcon: { marginTop: 2 },
  stepNum: { width: 24, textAlign: 'right', marginTop: 1 },
  historyRow: { paddingHorizontal: space.lg, paddingVertical: space.md, minHeight: 56, justifyContent: 'center' },
  altRow: { flexDirection: 'row', alignItems: 'center' },
  altMain: {
    flex: 1,
    minWidth: 0,
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    minHeight: 80,
    paddingLeft: space.lg,
    paddingRight: space.sm,
    paddingVertical: space.md,
  },
  useButton: { marginRight: space.md, paddingHorizontal: space.lg },
});
