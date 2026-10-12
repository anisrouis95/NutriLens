import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Bot,
  ChartLine,
  CircleUser,
  Dumbbell,
  Footprints,
  GraduationCap,
  Scale,
  Sparkles,
  Timer,
} from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppData } from '@/contexts/AppDataContext';
import {
  AnimatedNumber,
  Button,
  Fab,
  Group,
  IconButton,
  ListItem,
  MacroBars,
  NAV_BAR_SPACE,
  ProgressLine,
  RulerPicker,
  Screen,
  Section,
  Sheet,
  StoryBars,
  Txt,
  useFormat,
  useSnackbar,
} from '@/components/ds';
import WorkoutCard from '@/components/train/WorkoutCard';
import { nextWorkoutDay } from '@/lib/workoutGenerator';
import { addDays, sumNutrition, weightTrend } from '@/lib/nutritionMath';
import { useHealthSync } from '@/hooks/useHealthSync';
import { lessonOrder, lessons } from '@/content/lessons';
import { radius, space, useTokens } from '@/theme';

function fastingLeft(start: string, end: string, now = new Date()) {
  const m = (s: string) => {
    const [h, mm] = s.split(':').map(Number);
    return (h || 0) * 60 + (mm || 0);
  };
  const s = m(start);
  const e = m(end);
  const n = now.getHours() * 60 + now.getMinutes();
  const len = (e - s + 1440) % 1440 || 1440;
  const since = (n - s + 1440) % 1440;
  const fasting = since < len;
  return { fasting, minutes: fasting ? len - since : 1440 - since };
}

export default function TodayScreen() {
  const t = useTokens();
  const router = useRouter();
  const fmt = useFormat();
  const snackbar = useSnackbar();
  const { L, language } = useLanguage();
  const { profile, plan, foodsForDate, today, health, settings, workoutPlan, sessions, weights, logWeight } = useAppData();
  const { status } = useHealthSync(true);
  const [weightOpen, setWeightOpen] = useState(false);
  const [weightDraft, setWeightDraft] = useState(profile?.weightKg ?? 75);

  const totals = useMemo(() => sumNutrition(foodsForDate(today)), [foodsForDate, today]);
  const trend = useMemo(() => weightTrend(weights), [weights]);

  if (!profile || !plan) return null;

  const target = plan.targetCalories;
  const remaining = target - totals.calories;
  const over = remaining < 0;
  const todayHealth = health[today];

  const nextDay = nextWorkoutDay(workoutPlan, sessions);
  const trainedToday = sessions.some((s) => s.date === today && s.finishedAt);
  const weekStart = (() => {
    const d = new Date(today + 'T12:00:00');
    return addDays(today, -((d.getDay() + 6) % 7)); // Monday
  })();
  const doneThisWeek = sessions.filter((s) => s.finishedAt && s.date >= weekStart).length;
  const perWeek = workoutPlan?.daysPerWeek ?? 0;

  const read = new Set(settings.readLessons ?? []);
  const nextLesson = lessons.find((l) => l.id === lessonOrder.find((id) => !read.has(id)));

  const lastWeight = trend[trend.length - 1];
  const weekAgo = trend.filter((w) => w.date <= addDays(today, -7)).pop();
  const weeklyDelta = lastWeight && weekAgo ? lastWeight.trend - weekAgo.trend : undefined;
  const loggedWeightToday = lastWeight?.date === today;

  const proteinLeft = plan.macros.protein - totals.protein;
  // One short nudge, shown as a "Next" row under the workout: a title and what to do about it.
  const tip: { title: string; body?: string; onPress?: () => void } = (() => {
    if (totals.calories === 0) {
      return {
        title: L({ en: 'Log your first meal', fr: 'Note ton premier repas' }),
        body: L({
          en: 'Snap it: the AI estimates it and you check the portions.',
          fr: 'Prends-le en photo : l’IA l’estime et tu vérifies les portions.',
        }),
        onPress: () => router.push('/scan'),
      };
    }
    if (remaining < -150) {
      return {
        title: L({ en: '{{kcal}} kcal over today', fr: '{{kcal}} kcal au-dessus aujourd’hui' }, { kcal: fmt(-remaining) }),
        body: L({
          en: 'One day never ruins progress. Carry on tomorrow; no need to make up for it.',
          fr: 'Une journée ne ruine jamais la progression. Continue demain, inutile de compenser.',
        }),
      };
    }
    if (proteinLeft > 30) {
      return {
        title: L({ en: '~{{p}} g of protein to go', fr: 'Encore ~{{p}} g de protéines' }, { p: Math.round(proteinLeft) }),
        body: L(
          {
            en: 'About {{g}} g of chicken breast, or eggs plus a pot of yogurt and a can of tuna.',
            fr: 'Environ {{g}} g de blanc de poulet, ou des œufs, un yaourt et une boîte de thon.',
          },
          { g: Math.round((proteinLeft / 31) * 10) * 10 },
        ),
      };
    }
    if (remaining > 0) {
      return {
        title: L({ en: 'Protein done', fr: 'Protéines atteintes' }),
        body: L({ en: 'The rest of your day is open.', fr: 'Le reste de ta journée est libre.' }),
      };
    }
    return { title: L({ en: 'Right on target today', fr: 'Pile dans la cible aujourd’hui' }) };
  })();

  const dateLabel = new Date().toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long' });

  const fast = profile.fasting.enabled ? fastingLeft(profile.fasting.startTime, profile.fasting.endTime) : null;
  const hm = (min: number) => `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, '0')}`;

  const openWeight = () => {
    setWeightDraft(lastWeight?.kg ?? profile.weightKg);
    setWeightOpen(true);
  };
  const saveWeight = () => {
    logWeight(Math.round(weightDraft * 10) / 10);
    setWeightOpen(false);
    snackbar.show(L({ en: 'Weight saved: {{kg}} kg', fr: 'Poids enregistré : {{kg}} kg' }, { kg: fmt(weightDraft, 1) }));
  };

  return (
    <View style={{ flex: 1 }}>
      <Screen largeTitle={false} bottomSpace={NAV_BAR_SPACE + 92}>
        <View style={styles.top}>
          <Txt variant="overline" tone="secondary" style={{ flex: 1 }} numberOfLines={1}>
            {dateLabel}
          </Txt>
          <IconButton label={L({ en: 'Progress', fr: 'Progression' })} onPress={() => router.push('/progress')} icon={(c) => <ChartLine size={22} color={c} />} />
          <IconButton label={L({ en: 'Profile', fr: 'Profil' })} onPress={() => router.push('/profile')} icon={(c) => <CircleUser size={22} color={c} />} />
        </View>
        {/* Training first: the next session, ready to start. */}
        <View style={{ marginTop: space.sm }}>
          {nextDay ? (
            <WorkoutCard
              day={nextDay}
              minutes={profile.sessionMinutes}
              done={trainedToday}
              cta={trainedToday ? L({ en: 'See your program', fr: 'Voir ton programme' }) : undefined}
              onStart={() =>
                trainedToday
                  ? router.navigate('/train')
                  : router.push({ pathname: '/workout/[dayId]', params: { dayId: nextDay.id } })
              }
            />
          ) : (
            <View style={[styles.noPlan, { backgroundColor: t.surface }]}>
              <Dumbbell size={28} color={t.textSecondary} />
              <Txt variant="title" style={{ marginTop: space.md }}>
                {L({ en: 'No program yet', fr: 'Pas encore de programme' })}
              </Txt>
              <Txt tone="secondary" style={{ marginTop: space.xs }}>
                {L({
                  en: 'NutriLens builds your sessions from your answers, each exercise with its demo.',
                  fr: 'NutriLens crée tes séances à partir de tes réponses, chaque exercice avec sa démo.',
                })}
              </Txt>
              <Button
                label={L({ en: 'Build my program', fr: 'Créer mon programme' })}
                onPress={() => router.navigate('/train')}
                haptic="light"
                style={{ marginTop: space.lg }}
              />
            </View>
          )}
        </View>

        {perWeek ? (
          <View style={{ marginTop: space.lg }}>
            <View style={styles.weekHead}>
              <Txt variant="overline" tone="secondary" style={{ flex: 1 }}>
                {L({ en: 'This week', fr: 'Cette semaine' })}
              </Txt>
              <Txt variant="overline" tone={doneThisWeek >= perWeek ? 'accent' : 'primary'}>
                {L(
                  { en: '{{done}}/{{total}} sessions', fr: '{{done}}/{{total}} séances' },
                  { done: Math.min(doneThisWeek, perWeek), total: perWeek },
                )}
              </Txt>
            </View>
            <StoryBars
              segments={Array.from({ length: perWeek }, (_, i) => (i < doneThisWeek ? 1 : 0))}
              current={doneThisWeek < perWeek ? doneThisWeek : undefined}
              height={6}
              style={{ marginTop: space.sm }}
            />
          </View>
        ) : null}

        {/* Fuel: calories left, then the three macros. */}
        <View style={[styles.fuel, { borderTopColor: t.hairline }]}>
          <View style={styles.kcalRow}>
            <AnimatedNumber value={Math.abs(remaining)} variant="numHero" tone={over ? 'danger' : 'primary'} />
            <Txt variant="title" tone={over ? 'danger' : 'accent'} style={styles.kcalUnit}>
              {over ? L({ en: 'kcal over', fr: 'kcal en trop' }) : L({ en: 'kcal left', fr: 'kcal restantes' })}
            </Txt>
          </View>
          <ProgressLine value={target > 0 ? totals.calories / target : 0} overColor={t.danger} height={6} />
          <View style={styles.kcalFacts}>
            <Txt variant="overline" tone="secondary">
              {L({ en: '{{n}} eaten', fr: '{{n}} mangées' }, { n: fmt(totals.calories) })}
            </Txt>
            <Txt variant="overline" tone="secondary">
              {L({ en: '{{n}} target', fr: 'cible {{n}}' }, { n: fmt(target) })}
            </Txt>
          </View>
        </View>

        <View style={styles.macros}>
          <MacroBars
            columns
            items={[
              { label: L({ en: 'Protein', fr: 'Protéines' }), eaten: totals.protein, target: plan.macros.protein, color: t.protein },
              { label: L({ en: 'Carbs', fr: 'Glucides' }), eaten: totals.carbs, target: plan.macros.carbs, color: t.carbs },
              { label: L({ en: 'Fat', fr: 'Lipides' }), eaten: totals.fat, target: plan.macros.fat, color: t.fat },
            ]}
          />
        </View>

        <Section title={L({ en: 'Next', fr: 'Ensuite' })}>
          <Group>
            <ListItem
              title={tip.title}
              supporting={tip.body}
              leading={(c) => <Sparkles size={22} color={c} />}
              onPress={tip.onPress}
              chevron={!!tip.onPress}
              divider
            />
            {settings.healthConnectEnabled && status === 'available' ? (
              <ListItem
                title={L({ en: '{{s}} steps', fr: '{{s}} pas' }, { s: fmt(todayHealth?.steps ?? 0) })}
                supporting={L(
                  { en: 'Goal {{g}} · {{k}} active kcal from your watch', fr: 'Objectif {{g}} · {{k}} kcal actives (montre)' },
                  { g: fmt(plan.stepsTarget), k: todayHealth?.activeKcal ? fmt(todayHealth.activeKcal) : '—' },
                )}
                leading={(c) => <Footprints size={22} color={c} />}
                onPress={() => router.push('/progress')}
                chevron
                divider
              />
            ) : (
              <ListItem
                title={L({ en: 'Connect your watch', fr: 'Connecte ta montre' })}
                supporting={L({ en: 'Steps and sleep', fr: 'Pas et sommeil' })}
                leading={(c) => <Footprints size={22} color={c} />}
                onPress={() => router.push('/profile')}
                chevron
                divider
              />
            )}
            <ListItem
              title={
                lastWeight
                  ? L({ en: '{{kg}} kg trend', fr: 'Tendance {{kg}} kg' }, { kg: fmt(lastWeight.trend, 1) })
                  : L({ en: 'Log your weight', fr: 'Note ton poids' })
              }
              supporting={
                loggedWeightToday
                  ? L({ en: 'Logged today', fr: 'Noté aujourd’hui' }) +
                    (weeklyDelta !== undefined ? ` · ${weeklyDelta > 0 ? '+' : ''}${fmt(weeklyDelta, 1)} kg / ${L({ en: 'week', fr: 'semaine' })}` : '')
                  : L({ en: 'Mornings, after the toilet, before eating', fr: 'Le matin, après les toilettes, avant de manger' })
              }
              leading={(c) => <Scale size={22} color={c} />}
              trailing={
                !loggedWeightToday ? (
                  <Txt variant="label" tone="accent">
                    {L({ en: 'Log', fr: 'Noter' })}
                  </Txt>
                ) : undefined
              }
              onPress={loggedWeightToday ? () => router.push('/progress') : openWeight}
              chevron={loggedWeightToday}
              divider={!!fast}
            />
            {fast ? (
              <ListItem
                title={
                  fast.fasting
                    ? L({ en: 'Fasting · {{t}} left', fr: 'Jeûne · encore {{t}}' }, { t: hm(fast.minutes) })
                    : L({ en: 'Eating window · {{t}} left', fr: 'Fenêtre de repas · encore {{t}}' }, { t: hm(fast.minutes) })
                }
                supporting={`${profile.fasting.startTime} → ${profile.fasting.endTime}`}
                leading={(c) => <Timer size={22} color={c} />}
                onPress={() => router.push('/fasting')}
                chevron
              />
            ) : null}
          </Group>
        </Section>

        <Section title={L({ en: 'Understand', fr: 'Comprendre' })}>
          <Group>
            {nextLesson ? (
              <ListItem
                title={L(nextLesson.title)}
                supporting={L({ en: 'Next lesson · {{m}} min', fr: 'Prochaine leçon · {{m}} min' }, { m: nextLesson.minutes })}
                leading={(c) => <GraduationCap size={22} color={c} />}
                onPress={() => router.push({ pathname: '/learn/[id]', params: { id: nextLesson.id } })}
                chevron
                divider
              />
            ) : null}
            <ListItem
              title={L({ en: 'Ask your coach', fr: 'Demande à ton coach' })}
              supporting={L({ en: 'Answers built from your own numbers', fr: 'Des réponses construites avec tes chiffres' })}
              leading={(c) => <Bot size={22} color={c} />}
              onPress={() => router.push('/coach')}
              chevron
              divider
            />
            <ListItem
              title={L({ en: 'How my plan was calculated', fr: 'Comment mon plan est calculé' })}
              leading={(c) => <ChartLine size={22} color={c} />}
              onPress={() => router.push('/plan')}
              chevron
            />
          </Group>
        </Section>
      </Screen>

      <Fab label={L({ en: 'Snap meal', fr: 'Photo du repas' })} onPress={() => router.push('/scan')} />

      <Sheet visible={weightOpen} onClose={() => setWeightOpen(false)} title={L({ en: 'Today’s weight', fr: 'Poids du jour' })}>
        <RulerPicker
          value={weightDraft}
          onChange={setWeightDraft}
          min={Math.max(30, Math.round(weightDraft) - 30)}
          max={Math.round(weightDraft) + 30}
          step={0.1}
          labelEvery={10}
          decimals={1}
          unit="kg"
          backdrop={t.surfaceHigh}
        />
        <Txt variant="caption" tone="secondary" style={{ marginTop: space.lg, marginBottom: space.lg }}>
          {L({
            en: 'Daily weight jumps 0.5–2 kg with water and food. NutriLens follows the trend line, so one heavy morning changes almost nothing.',
            fr: 'Le poids varie de 0,5 à 2 kg par jour avec l’eau et les repas. NutriLens suit la tendance : un matin plus lourd ne change presque rien.',
          })}
        </Txt>
        <Button label={L({ en: 'Save', fr: 'Enregistrer' })} onPress={saveWeight} fill size="lg" haptic="light" />
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', marginRight: -space.md },
  noPlan: { borderRadius: radius.lg, padding: space.xl },
  weekHead: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  fuel: { marginTop: space.xl, paddingTop: space.lg, borderTopWidth: StyleSheet.hairlineWidth },
  kcalRow: { flexDirection: 'row', alignItems: 'flex-end', gap: space.md, marginBottom: space.md },
  kcalUnit: { paddingBottom: 12, flexShrink: 1 },
  kcalFacts: { flexDirection: 'row', justifyContent: 'space-between', marginTop: space.sm },
  macros: { marginTop: space.xl },
});
