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
  Txt,
  useFormat,
  useSnackbar,
} from '@/components/ds';
import WeekDays from '@/components/train/WeekDays';
import WorkoutCard from '@/components/train/WorkoutCard';
import RamadanCard from '@/components/ramadan/RamadanCard';
import { useRamadanSettings } from '@/hooks/useRamadan';
import { isFastingDay } from '@/lib/ramadan';
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
  const { L, language, formatDate } = useLanguage();
  const { profile, plan, foodsForDate, today, health, settings, workoutPlan, sessions, weights, logWeight } = useAppData();
  const [ramadan] = useRamadanSettings();
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
        title: L({ en: 'Log your first meal', fr: 'Note ton premier repas', tn: 'سجّل أوّل ماكلة', tnLatn: 'Sajjel awwel makla' }),
        body: L({
          en: 'Snap it: the AI estimates it and you check the portions.',
          fr: 'Prends-le en photo : l’IA l’estime et tu vérifies les portions.',
          tn: 'صوّرها: الـ AI يقدّرها وانت تثبّت في الكمّيات.',
          tnLatn: 'Sawwarha: l AI y9adderha w enti tthabbet fel portions.',
        }),
        onPress: () => router.push('/scan'),
      };
    }
    if (remaining < -150) {
      return {
        title: L(
          { en: '{{kcal}} kcal over today', fr: '{{kcal}} kcal au-dessus aujourd’hui', tn: '{{kcal}} kcal زايدين اليوم', tnLatn: '{{kcal}} kcal zeydin lyoum' },
          { kcal: fmt(-remaining) },
        ),
        body: L({
          en: 'One day never ruins progress. Carry on tomorrow; no need to make up for it.',
          fr: 'Une journée ne ruine jamais la progression. Continue demain, inutile de compenser.',
          tn: 'نهار واحد عمرو ما يفسد التقدّم. كمّل غدوة عادي، ما تحتاجش تعوّض.',
          tnLatn: 'Nhar wa7ed 3omrou ma yfassed el progrès. Kammel 8odwa 3adi, ma te7tejch t3awwedh.',
        }),
      };
    }
    if (proteinLeft > 30) {
      return {
        title: L(
          { en: '~{{p}} g of protein to go', fr: 'Encore ~{{p}} g de protéines', tn: 'باقي ~{{p}} g بروتين', tnLatn: 'Ba9i ~{{p}} g protéines' },
          { p: Math.round(proteinLeft) },
        ),
        body: L(
          {
            en: 'About {{g}} g of chicken breast, or eggs plus a pot of yogurt and a can of tuna.',
            fr: 'Environ {{g}} g de blanc de poulet, ou des œufs, un yaourt et une boîte de thon.',
            tn: 'تقريب {{g}} g صدر دجاج، ولا عظم مع ياغورت وعلبة تن.',
            tnLatn: 'Ta9rib {{g}} g sder djej, wala 3dham m3a yaourt w 3olbet ton.',
          },
          { g: Math.round((proteinLeft / 31) * 10) * 10 },
        ),
      };
    }
    if (remaining > 0) {
      return {
        title: L({ en: 'Protein done', fr: 'Protéines atteintes', tn: 'كمّلت البروتين', tnLatn: 'Kammelt protéines' }),
        body: L({ en: 'The rest of your day is open.', fr: 'Le reste de ta journée est libre.', tn: 'باقي النهار على راحتك.', tnLatn: 'Ba9i nhar 3la ra7tek.' }),
      };
    }
    return { title: L({ en: 'Right on target today', fr: 'Pile dans la cible aujourd’hui', tn: 'اليوم جيت بالضبط في الهدف', tnLatn: 'Lyoum jit bedhabt fel objectif' }) };
  })();

  const dateLabel = formatDate(new Date(), { weekday: 'long', day: 'numeric', month: 'long' });

  // On a Ramadan fasting day the Ramadan card replaces the intermittent-fasting row.
  const fast = profile.fasting.enabled && !isFastingDay(ramadan, today) ? fastingLeft(profile.fasting.startTime, profile.fasting.endTime) : null;
  const hm = (min: number) => `${Math.floor(min / 60)} h ${String(min % 60).padStart(2, '0')}`;

  const openWeight = () => {
    setWeightDraft(lastWeight?.kg ?? profile.weightKg);
    setWeightOpen(true);
  };
  const saveWeight = () => {
    logWeight(Math.round(weightDraft * 10) / 10);
    setWeightOpen(false);
    snackbar.show(
      L(
        { en: 'Weight saved: {{kg}} kg', fr: 'Poids enregistré : {{kg}} kg', tn: 'الوزن تسجّل: {{kg}} kg', tnLatn: 'Poids tsajjel: {{kg}} kg' },
        { kg: fmt(weightDraft, 1) },
      ),
    );
  };

  return (
    <View style={{ flex: 1 }}>
      <Screen largeTitle={false} bottomSpace={NAV_BAR_SPACE + 92}>
        <View style={styles.top}>
          <Txt variant="overline" tone="secondary" style={{ flex: 1 }} numberOfLines={1}>
            {dateLabel}
          </Txt>
          <IconButton
            label={L({ en: 'Progress', fr: 'Progression', tn: 'التقدّم', tnLatn: 'Progrès' })}
            onPress={() => router.push('/progress')}
            icon={(c) => <ChartLine size={22} color={c} />}
          />
          <IconButton
            label={L({ en: 'Profile', fr: 'Profil', tn: 'البروفيل', tnLatn: 'Profil' })}
            onPress={() => router.push('/profile')}
            icon={(c) => <CircleUser size={22} color={c} />}
          />
        </View>
        {/* Ramadan frames a fasting day (and gives a heads-up in the weeks before it). */}
        <RamadanCard style={{ marginTop: space.sm, marginBottom: space.xs }} />
        {/* Training first: the next session, ready to start. */}
        <View style={{ marginTop: space.sm }}>
          {nextDay ? (
            <WorkoutCard
              day={nextDay}
              minutes={profile.sessionMinutes}
              done={trainedToday}
              cta={trainedToday ? L({ en: 'See your program', fr: 'Voir ton programme', tn: 'شوف البرنامج متاعك', tnLatn: 'Chouf programme mte3ek' }) : undefined}
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
                {L({ en: 'No program yet', fr: 'Pas encore de programme', tn: 'مازال ما عندكش برنامج', tnLatn: 'Mazel ma 3andekch programme' })}
              </Txt>
              <Txt tone="secondary" style={{ marginTop: space.xs }}>
                {L({
                  en: 'Tounsi Fit builds your sessions from your answers, each exercise with its demo.',
                  fr: 'Tounsi Fit crée tes séances à partir de tes réponses, chaque exercice avec sa démo.',
                  tn: 'Tounsi Fit يبني الحصص متاعك حسب أجوبتك، كل تمرين بالديمو متاعو.',
                  tnLatn: 'Tounsi Fit yebni séances mte3ek 7asb ejwbtek, kol exercice b démo mte3ou.',
                })}
              </Txt>
              <Button
                label={L({ en: 'Build my program', fr: 'Créer mon programme', tn: 'اعمل البرنامج متاعي', tnLatn: 'A3mel programme mte3i' })}
                onPress={() => router.navigate('/train')}
                haptic="light"
                style={{ marginTop: space.lg }}
              />
            </View>
          )}
        </View>

        <View style={{ marginTop: space.lg }}>
          <WeekDays perWeek={perWeek} />
        </View>

        {/* Fuel: calories left, then the three macros. */}
        <View style={[styles.fuel, { borderTopColor: t.hairline }]}>
          <View style={styles.kcalRow}>
            <AnimatedNumber value={Math.abs(remaining)} variant="numHero" tone={over ? 'danger' : 'primary'} />
            <Txt variant="title" tone={over ? 'danger' : 'accent'} style={styles.kcalUnit}>
              {over
                ? L({ en: 'kcal over', fr: 'kcal en trop', tn: 'kcal زايدين', tnLatn: 'kcal zeydin' })
                : L({ en: 'kcal left', fr: 'kcal restantes', tn: 'kcal باقية', tnLatn: 'kcal b9aw' })}
            </Txt>
          </View>
          <ProgressLine value={target > 0 ? totals.calories / target : 0} overColor={t.danger} height={6} />
          <View style={styles.kcalFacts}>
            <Txt variant="overline" tone="secondary">
              {L({ en: '{{n}} eaten', fr: '{{n}} mangées', tn: '{{n}} كليت', tnLatn: '{{n}} klit' }, { n: fmt(totals.calories) })}
            </Txt>
            <Txt variant="overline" tone="secondary">
              {L({ en: '{{n}} target', fr: 'cible {{n}}', tn: 'الهدف {{n}}', tnLatn: 'Objectif {{n}}' }, { n: fmt(target) })}
            </Txt>
          </View>
        </View>

        <View style={styles.macros}>
          <MacroBars
            columns
            items={[
              { label: L({ en: 'Protein', fr: 'Protéines', tn: 'بروتين', tnLatn: 'Protéines' }), eaten: totals.protein, target: plan.macros.protein, color: t.protein },
              { label: L({ en: 'Carbs', fr: 'Glucides', tn: 'نشويات', tnLatn: 'Glucides' }), eaten: totals.carbs, target: plan.macros.carbs, color: t.carbs },
              { label: L({ en: 'Fat', fr: 'Lipides', tn: 'دهون', tnLatn: 'Lipides' }), eaten: totals.fat, target: plan.macros.fat, color: t.fat },
            ]}
          />
        </View>

        <Section title={L({ en: 'Next', fr: 'Ensuite', tn: 'ومبعد', tnLatn: 'W ba3d' })}>
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
                title={L({ en: '{{s}} steps', fr: '{{s}} pas', tn: '{{s}} خطوة', tnLatn: '{{s}} pas' }, { s: fmt(todayHealth?.steps ?? 0) })}
                supporting={L(
                  {
                    en: 'Goal {{g}} · {{k}} active kcal from your watch',
                    fr: 'Objectif {{g}} · {{k}} kcal actives (montre)',
                    tn: 'الهدف {{g}} · {{k}} kcal نشاط من الساعة',
                    tnLatn: 'Objectif {{g}} · {{k}} kcal actives mel montre',
                  },
                  { g: fmt(plan.stepsTarget), k: todayHealth?.activeKcal ? fmt(todayHealth.activeKcal) : '—' },
                )}
                leading={(c) => <Footprints size={22} color={c} />}
                onPress={() => router.push('/progress')}
                chevron
                divider
              />
            ) : (
              <ListItem
                title={L({ en: 'Connect your watch', fr: 'Connecte ta montre', tn: 'اربط الساعة متاعك', tnLatn: 'Erbot el montre mte3ek' })}
                supporting={L({ en: 'Steps and sleep', fr: 'Pas et sommeil', tn: 'الخطوات والنوم', tnLatn: 'Pas w noum' })}
                leading={(c) => <Footprints size={22} color={c} />}
                onPress={() => router.push('/profile')}
                chevron
                divider
              />
            )}
            <ListItem
              title={
                lastWeight
                  ? L({ en: '{{kg}} kg trend', fr: 'Tendance {{kg}} kg', tn: 'المعدّل {{kg}} kg', tnLatn: 'Tendance {{kg}} kg' }, { kg: fmt(lastWeight.trend, 1) })
                  : L({ en: 'Log your weight', fr: 'Note ton poids', tn: 'سجّل وزنك', tnLatn: 'Sajjel poids mte3ek' })
              }
              supporting={
                loggedWeightToday
                  ? L({ en: 'Logged today', fr: 'Noté aujourd’hui', tn: 'تسجّل اليوم', tnLatn: 'Tsajjel lyoum' }) +
                    (weeklyDelta !== undefined
                      ? ` · ${weeklyDelta > 0 ? '+' : ''}${fmt(weeklyDelta, 1)} kg / ${L({ en: 'week', fr: 'semaine', tn: 'جمعة', tnLatn: 'jem3a' })}`
                      : '')
                  : L({
                      en: 'Mornings, after the toilet, before eating',
                      fr: 'Le matin, après les toilettes, avant de manger',
                      tn: 'الصباح، بعد بيت الماء، قبل ما تاكل',
                      tnLatn: 'Sbe7, ba3d bit el mé, 9bal ma takel',
                    })
              }
              leading={(c) => <Scale size={22} color={c} />}
              trailing={
                !loggedWeightToday ? (
                  <Txt variant="label" tone="accent">
                    {L({ en: 'Log', fr: 'Noter', tn: 'سجّل', tnLatn: 'Sajjel' })}
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
                    ? L({ en: 'Fasting · {{t}} left', fr: 'Jeûne · encore {{t}}', tn: 'صيام · باقي {{t}}', tnLatn: 'Siyem · ba9i {{t}}' }, { t: hm(fast.minutes) })
                    : L(
                        {
                          en: 'Eating window · {{t}} left',
                          fr: 'Fenêtre de repas · encore {{t}}',
                          tn: 'وقت الماكلة · باقي {{t}}',
                          tnLatn: 'Wa9t el makla · ba9i {{t}}',
                        },
                        { t: hm(fast.minutes) },
                      )
                }
                supporting={`${profile.fasting.startTime} → ${profile.fasting.endTime}`}
                leading={(c) => <Timer size={22} color={c} />}
                onPress={() => router.push('/fasting')}
                chevron
              />
            ) : null}
          </Group>
        </Section>

        <Section title={L({ en: 'Understand', fr: 'Comprendre', tn: 'افهم', tnLatn: 'Ifhem' })}>
          <Group>
            {nextLesson ? (
              <ListItem
                title={L(nextLesson.title)}
                supporting={L(
                  { en: 'Next lesson · {{m}} min', fr: 'Prochaine leçon · {{m}} min', tn: 'الدرس اللي بعدو · {{m}} min', tnLatn: 'Dars eli ba3dou · {{m}} min' },
                  { m: nextLesson.minutes },
                )}
                leading={(c) => <GraduationCap size={22} color={c} />}
                onPress={() => router.push({ pathname: '/learn/[id]', params: { id: nextLesson.id } })}
                chevron
                divider
              />
            ) : null}
            <ListItem
              title={L({ en: 'Ask your coach', fr: 'Demande à ton coach', tn: 'سقسي الكوتش متاعك', tnLatn: 'Sa9si el coach mte3ek' })}
              supporting={L({
                en: 'Answers built from your own numbers',
                fr: 'Des réponses construites avec tes chiffres',
                tn: 'أجوبة مبنية على الأرقام متاعك',
                tnLatn: 'Ejwba mabnya 3al ar9am mte3ek',
              })}
              leading={(c) => <Bot size={22} color={c} />}
              onPress={() => router.push('/coach')}
              chevron
              divider
            />
            <ListItem
              title={L({
                en: 'How my plan was calculated',
                fr: 'Comment mon plan est calculé',
                tn: 'كيفاش تحسب البرنامج متاعي',
                tnLatn: 'Kifech t7seb el programme mte3i',
              })}
              leading={(c) => <ChartLine size={22} color={c} />}
              onPress={() => router.push('/plan')}
              chevron
            />
          </Group>
        </Section>
      </Screen>

      <Fab label={L({ en: 'Snap meal', fr: 'Photo du repas', tn: 'صوّر ماكلة', tnLatn: 'Sawwer makla' })} onPress={() => router.push('/scan')} />

      <Sheet visible={weightOpen} onClose={() => setWeightOpen(false)} title={L({ en: 'Today’s weight', fr: 'Poids du jour', tn: 'وزن اليوم', tnLatn: 'Poids lyoum' })}>
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
            en: 'Daily weight jumps 0.5–2 kg with water and food. Tounsi Fit follows the trend line, so one heavy morning changes almost nothing.',
            fr: 'Le poids varie de 0,5 à 2 kg par jour avec l’eau et les repas. Tounsi Fit suit la tendance : un matin plus lourd ne change presque rien.',
            tn: 'الوزن يطلع وينزل 0,5–2 kg في النهار حسب الماء والماكلة. Tounsi Fit يتبّع المعدّل، يعني صباح واحد تقيل تقريب ما يبدّل شي.',
            tnLatn: 'El poids yetla3 w yenzel 0,5–2 kg fel nhar 7asb el mé w el makla. Tounsi Fit yetba3 el tendance, ya3ni sbe7 wa7ed t9il ta9rib ma ybaddel chay.',
          })}
        </Txt>
        <Button label={L({ en: 'Save', fr: 'Enregistrer', tn: 'سجّل', tnLatn: 'Sajjel' })} onPress={saveWeight} fill size="lg" haptic="light" />
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  top: { flexDirection: 'row', alignItems: 'center', marginRight: -space.md },
  noPlan: { borderRadius: radius.lg, padding: space.xl },
  fuel: { marginTop: space.xl, paddingTop: space.lg, borderTopWidth: StyleSheet.hairlineWidth },
  kcalRow: { flexDirection: 'row', alignItems: 'flex-end', gap: space.md, marginBottom: space.md },
  kcalUnit: { paddingBottom: 12, flexShrink: 1 },
  kcalFacts: { flexDirection: 'row', justifyContent: 'space-between', marginTop: space.sm },
  macros: { marginTop: space.xl },
});
