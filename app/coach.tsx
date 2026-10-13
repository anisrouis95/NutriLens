import { useEffect, useMemo, useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import Animated, {
  cancelAnimation,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Bot, Send, Trash2 } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppData } from '@/contexts/AppDataContext';
import { Appear, Button, Chip, ChipRow, Field, IconButton, RichText, Screen, Txt, Why, useSnackbar } from '@/components/ds';
import { GeminiContent, GeminiError, generate } from '@/services/gemini';
import { addDays, sumNutrition, weightTrend } from '@/lib/nutritionMath';
import { getExercise } from '@/lib/exercises';
import { loadJSON, saveJSON } from '@/lib/storage';
import { motion, radius, space, useTokens } from '@/theme';
import { aiLanguageName } from '@/lib/i18n';
import { useRamadan } from '@/hooks/useRamadan';

interface Message {
  role: 'user' | 'model';
  text: string;
}

const HISTORY_KEY = '@nl/coachHistory';

export default function CoachScreen() {
  const t = useTokens();
  const router = useRouter();
  const snackbar = useSnackbar();
  const { L, language } = useLanguage();
  const data = useAppData();
  const { topic } = useLocalSearchParams<{ topic?: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState(topic ? L({
    en: 'About “{{t}}”: ',
    fr: 'À propos de « {{t}} » : ',
    tn: 'على “{{t}}”: ',
    tnLatn: '3la “{{t}}”: ',
  }, { t: topic }) : '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<ScrollView>(null);

  useEffect(() => {
    loadJSON<Message[]>(HISTORY_KEY, []).then(setMessages);
  }, []);

  const context = useMemo(() => {
    const { profile, plan, foods, today, weights, workoutPlan, sessions, health } = data;
    if (!profile || !plan) return 'The user has not completed the questionnaire yet.';
    const todayTotals = sumNutrition(foods.filter((f) => f.date === today));
    const week = Array.from({ length: 7 }, (_, i) => addDays(today, -i - 1));
    const loggedDays = week
      .map((d) => sumNutrition(foods.filter((f) => f.date === d)).calories)
      .filter((k) => k > 0);
    const trend = weightTrend(weights);
    const lastTrend = trend[trend.length - 1];
    const weekAgo = trend.filter((w) => w.date <= addDays(today, -7)).pop();
    const recentSessions = sessions
      .filter((s) => s.finishedAt)
      .slice(-5)
      .map((s) => `${s.date} ${s.dayName.en}: ${s.sets.filter((x) => x.done).length} sets`);
    const h = health[today];
    return [
      `Profile: ${profile.name}, ${profile.sex}, ${profile.age} y, ${profile.heightCm} cm, ${profile.weightKg} kg${profile.targetWeightKg ? `, target ${profile.targetWeightKg} kg` : ''}. Goal: ${profile.goal} (pace ${profile.pace}). Job: ${profile.job}. Training experience: ${profile.experience}, ${profile.trainingDays}x/week, ${profile.sessionMinutes} min, equipment: ${profile.equipment}. Limitations: ${profile.limitations.join(', ') || 'none'}. Diet preferences: ${profile.dietPrefs.join(', ') || 'none'}. Meals per day: ${profile.mealsPerDay}. Intermittent fasting: ${profile.fasting.enabled ? `fast ${profile.fasting.startTime} to ${profile.fasting.endTime}, eating window ${profile.fasting.endTime}-${profile.fasting.startTime}` : 'no'}.`,
      `Plan: BMR ${plan.bmr}, TDEE ${plan.tdee} (${plan.tdeeSource === 'adaptive' ? 'measured from logs' : 'formula estimate'}), target ${plan.targetCalories} kcal/day (${plan.dailyDelta > 0 ? `deficit ${plan.dailyDelta}` : plan.dailyDelta < 0 ? `surplus ${-plan.dailyDelta}` : 'maintenance'}), expected ${plan.weeklyChangeKg} kg/week. Macros: protein ${plan.macros.protein} g, carbs ${plan.macros.carbs} g, fat ${plan.macros.fat} g, fiber ${plan.macros.fiber} g. Steps target ${plan.stepsTarget}. Water ${plan.waterMl} ml.${plan.weeksToGoal ? ` About ${plan.weeksToGoal} weeks to goal.` : ''}`,
      `Today (${today}): eaten ${Math.round(todayTotals.calories)} kcal, protein ${Math.round(todayTotals.protein)} g, carbs ${Math.round(todayTotals.carbs)} g, fat ${Math.round(todayTotals.fat)} g.${h?.steps ? ` Steps ${h.steps}.` : ''}${h?.sleepMinutes ? ` Slept ${Math.round(h.sleepMinutes / 60 * 10) / 10} h.` : ''}`,
      `Last 7 days: ${loggedDays.length} days logged, average ${loggedDays.length ? Math.round(loggedDays.reduce((a, b) => a + b, 0) / loggedDays.length) : '-'} kcal.`,
      lastTrend
        ? `Weight trend: ${lastTrend.trend} kg${weekAgo ? ` (change over 7 days: ${(lastTrend.trend - weekAgo.trend).toFixed(2)} kg)` : ''}; ${weights.length} weigh-ins logged.`
        : 'No weigh-ins logged yet.',
      workoutPlan
        ? `Program: ${workoutPlan.splitName.en}. Days: ${workoutPlan.days
            .map((d) => `${d.name.en} [${d.exercises.map((e) => getExercise(e.exerciseId)?.name).join(', ')}]`)
            .join('; ')}.`
        : '',
      recentSessions.length ? `Recent workouts: ${recentSessions.join('; ')}.` : 'No workouts logged yet.',
    ]
      .filter(Boolean)
      .join('\n');
  }, [data]);

  // Ramadan mode: the coach plans meals, water and training around the fast.
  const r = useRamadan();
  const hhmm = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  const ramadanContext = r.fasting
    ? `Fasting today${r.period ? ` (Ramadan, day ${r.period.day} of ${r.period.length})` : ' (Ramadan mode on: making up days or a voluntary fast)'} in ${r.city.name.en}: suhoor ends at Fajr ${hhmm(r.day.fajr)}, iftar at Maghrib ${hhmm(r.day.maghrib)}. Meals are logged as suhoor, iftar and evening.${r.settings.lighter ? ' Sessions have one set fewer per exercise.' : ''} Give fasting-aware advice: protein split across iftar, the evening and suhoor; water spread from iftar to suhoor; training after iftar (best) or short and moderate before it.`
    : r.next && r.next.daysUntil <= 30 && r.settings.mode === 'auto'
      ? `Ramadan starts in ${r.next.daysUntil} days (${r.next.start}).`
      : '';

  const system = `You are the personal nutrition and strength coach inside Tounsi Fit, an app for a complete beginner who lives in Tunisia. They chose this app because nobody ever explained things to them properly.

How to answer:
- Use their real numbers below; be specific ("eat ~${data.plan?.macros.protein ?? 150} g protein", not "eat enough protein").
- Explain the why in plain words, then give 1–3 concrete actions. Keep it short: usually under 180 words.
- Be honest about uncertainty and individual variation. Never promise results or invent studies.
- Food advice must fit Tunisian everyday food (bread, couscous, olive oil, eggs, tuna, lben, legumes, local fruit) and their diet preferences.
- Exercise advice must respect their equipment and limitations. Never prescribe through pain.
- Safety: you are not a doctor. For medical conditions, medication, pregnancy, chest pain, injuries, or signs of disordered eating, gently recommend a professional. Never suggest eating below ~1200 kcal (women) / ~1500 kcal (men), crash diets, laxatives, or extreme fasting.
- Formatting: short paragraphs separated by a blank line, bullet lines starting with "- ", **bold** for key numbers. No headings, tables or links.
- Reply in the language the user writes in (default: ${aiLanguageName(language)}).

What you know about them right now:
${context}${ramadanContext ? `
${ramadanContext}` : ''}`;

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || busy) return;
    const next = [...messages, { role: 'user' as const, text: content }];
    setMessages(next);
    setInput('');
    setBusy(true);
    setError(null);
    try {
      const contents: GeminiContent[] = next.slice(-12).map((m) => ({ role: m.role, parts: [{ text: m.text }] }));
      const reply = await generate({ system, contents, temperature: 0.5 });
      const withReply = [...next, { role: 'model' as const, text: reply.trim() }];
      setMessages(withReply);
      saveJSON(HISTORY_KEY, withReply.slice(-40));
    } catch (e) {
      setError(e instanceof GeminiError ? e.code : 'server');
    } finally {
      setBusy(false);
    }
  };

  const clearHistory = () => {
    const previous = messages;
    setMessages([]);
    setError(null);
    saveJSON(HISTORY_KEY, []);
    snackbar.show(L({ en: 'Conversation cleared', fr: 'Conversation effacée', tn: 'المحادثة تفسخت', tnLatn: 'Discussion tfas5et' }), {
      label: L({ en: 'Undo', fr: 'Annuler', tn: 'رجّع', tnLatn: 'Rajja3' }),
      onPress: () => {
        setMessages(previous);
        saveJSON(HISTORY_KEY, previous);
      },
    });
  };

  useEffect(() => {
    const timer = setTimeout(() => scrollRef.current?.scrollToEnd({ animated: true }), 50);
    return () => clearTimeout(timer);
  }, [messages, busy, error]);

  const suggestions = [
    L({
      en: 'Why this calorie target?',
      fr: 'Pourquoi cette cible de calories ?',
      tn: 'علاش حطّيتلي هالعدد متاع الكالوري؟',
      tnLatn: '3lech 7attitli hal 3add mte3 calories?',
    }),
    L({
      en: 'What should I eat for dinner with what I have left?',
      fr: 'Que manger ce soir avec ce qu’il me reste ?',
      tn: 'شنوّة ناكل في العشا باللي بقالي؟',
      tnLatn: 'Chnowa nekel fel 3cha b eli b9ali?',
    }),
    L({
      en: 'I didn’t lose weight this week, why?',
      fr: 'Je n’ai pas maigri cette semaine, pourquoi ?',
      tn: 'ما نقصتش الجمعة هاذي، علاش؟',
      tnLatn: 'Ma n9astech el jem3a hedhi, 3lech?',
    }),
    L({
      en: 'How do I know which weight to lift?',
      fr: 'Comment choisir le poids à soulever ?',
      tn: 'كيفاش نعرف قدّاش نهزّ من ثقل؟',
      tnLatn: 'Kifech na3ref 9addech nhez men charge?',
    }),
    L({ en: 'Is bread at night bad?', fr: 'Le pain le soir, c’est mauvais ?', tn: 'الخبز في الليل يضرّ؟', tnLatn: 'El 5obz fel lil yodhor?' }),
  ];

  const keyProblem = error === 'no_key' || error === 'invalid_key';
  const canSend = !!input.trim() && !busy;

  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: t.ground }} behavior="padding">
      <Screen
        back
        title={L({ en: 'Coach', fr: 'Coach', tn: 'الكوتش', tnLatn: 'Coach' })}
        largeTitle={false}
        scroll={false}
        padded={false}
        actions={
          messages.length ? (
            <IconButton
              label={L({ en: 'Clear conversation', fr: 'Effacer la conversation', tn: 'فسّخ المحادثة', tnLatn: 'Fasa5 el discussion' })}
              onPress={clearHistory}
              disabled={busy}
              icon={(c) => <Trash2 size={22} color={c} />}
            />
          ) : null
        }
        footer={
          <View style={styles.inputBar}>
            <Field
              containerStyle={{ flex: 1 }}
              value={input}
              onChangeText={setInput}
              placeholder={L({ en: 'Ask your coach…', fr: 'Demande à ton coach…', tn: 'سقسي الكوتش متاعك…', tnLatn: 'Sa9si el coach mte3ek…' })}
              accessibilityLabel={L({ en: 'Message to your coach', fr: 'Message pour ton coach', tn: 'ميساج للكوتش متاعك', tnLatn: 'Message lel coach mte3ek' })}
              multiline
              style={{ maxHeight: 120 }}
            />
            <View style={{ paddingBottom: 2 }}>
              <IconButton
                variant="filled"
                label={L({ en: 'Send', fr: 'Envoyer', tn: 'ابعث', tnLatn: 'Eb3ath' })}
                onPress={() => send()}
                disabled={!canSend}
                icon={(c) => <Send size={22} color={c} />}
              />
            </View>
          </View>
        }
      >
        <ScrollView ref={scrollRef} contentContainerStyle={styles.list} keyboardShouldPersistTaps="handled">
          {!messages.length ? (
            <View>
              <Txt variant="titleSmall">
                {L({
                  en: 'Ask about food, your plan or training',
                  fr: 'Pose tes questions sur la nutrition, ton plan ou l’entraînement',
                  tn: 'سقسي على الماكلة، البرنامج متاعك ولّا التمرين',
                  tnLatn: 'Sa9si 3al makla, el programme mte3ek walla el sport',
                })}
              </Txt>
              <Txt variant="caption" tone="secondary" style={{ marginTop: space.xs }}>
                {L({
                  en: 'The coach sees your profile, plan, today’s food and recent workouts, so the answers are about you.',
                  fr: 'Le coach voit ton profil, ton plan, tes repas du jour et tes séances : les réponses te concernent vraiment.',
                  tn: 'الكوتش يشوف البروفيل متاعك، البرنامج، ماكلة اليوم والحصص الأخيرة، يعني الجوابات تكون عليك إنت.',
                  tnLatn: 'El coach ychouf el profil mte3ek, el programme, makla mte3 lyoum w les séances le5ra, ya3ni les réponses ykounou 3lik enti.',
                })}
              </Txt>
              <ChipRow style={{ marginTop: space.lg }}>
                {suggestions.map((s) => (
                  <Chip key={s} label={s} onPress={() => send(s)} multiline style={{ maxWidth: '100%' }} />
                ))}
              </ChipRow>
            </View>
          ) : null}

          {messages.map((m, i) =>
            m.role === 'user' ? (
              <Appear key={i} style={[styles.userBubble, { backgroundColor: t.accentSoft }]}>
                <Txt selectable>{m.text}</Txt>
              </Appear>
            ) : (
              <Appear key={i} style={styles.answer}>
                <Bot size={20} color={t.textSecondary} style={{ marginTop: 2 }} />
                <View style={{ flex: 1, minWidth: 0 }}>
                  <RichText text={m.text} />
                </View>
              </Appear>
            ),
          )}

          {busy ? (
            <Appear style={styles.answer}>
              <Bot size={20} color={t.textSecondary} style={{ marginTop: 2 }} />
              <TypingDots label={L({ en: 'The coach is writing', fr: 'Le coach écrit', tn: 'الكوتش قاعد يكتب', tnLatn: 'El coach 9a3ed yekteb' })} />
            </Appear>
          ) : null}

          {error ? (
            <Why
              key={error}
              tone="warning"
              initiallyOpen
              title={
                keyProblem
                  ? L({
                    en: 'The coach needs a free AI key',
                    fr: 'Le coach a besoin d’une clé IA gratuite',
                    tn: 'الكوتش يلزمو API key بلاش',
                    tnLatn: 'El coach yelzmou API key blech',
                  })
                  : error === 'data_policy'
                    ? L({
                      en: 'OpenRouter needs one setting',
                      fr: 'OpenRouter demande un réglage',
                      tn: 'OpenRouter يلزمو إعداد واحد',
                      tnLatn: 'OpenRouter yelzmou réglage wa7ed',
                    })
                    : error === 'quota'
                    ? L({
                      en: 'Free AI limit reached — try again in a minute',
                      fr: 'Limite IA gratuite atteinte — réessaie dans une minute',
                      tn: 'وصلت للحدّ المجّاني متاع الـ IA — عاود بعد دقيقة',
                      tnLatn: 'Wselt lel limite gratuite mte3 l IA — 3awed ba3d d9i9a',
                    })
                    : L({
                      en: 'Could not reach the coach',
                      fr: 'Impossible de joindre le coach',
                      tn: 'ما نجّمناش نوصلو للكوتش',
                      tnLatn: 'Ma najjamnech nwosslou lel coach',
                    })
              }
            >
              {keyProblem ? (
                <>
                  <Txt variant="caption" tone="secondary" style={{ marginBottom: space.md }}>
                    {L({
                      en: 'It’s free and takes two minutes: create a Gemini key in Google AI Studio, or use an OpenRouter key, and paste it in your profile.',
                      fr: 'C’est gratuit et ça prend deux minutes : crée une clé Gemini dans Google AI Studio, ou utilise une clé OpenRouter, et colle-la dans ton profil.',
                      tn: 'بلاش وياخو دقيقتين: اعمل Gemini key في Google AI Studio، ولّا استعمل OpenRouter key، وكوليها في البروفيل متاعك.',
                      tnLatn: 'Blech w ya5ou d9i9tin: a3mel Gemini key f Google AI Studio, walla esta3mel OpenRouter key, w colliha fel profil mte3ek.',
                    })}
                  </Txt>
                  <Button variant="tonal" label={L({
                    en: 'Set it up',
                    fr: 'Configurer',
                    tn: 'حطّ الـ key',
                    tnLatn: '7ott el key',
                  })} onPress={() => router.push('/profile')} />
                </>
              ) : error === 'data_policy' ? (
                <Txt variant="caption" tone="secondary">
                  {L({
                    en: 'OpenRouter blocked its free models because of your account’s privacy settings. On openrouter.ai open Settings → Privacy and allow free endpoints (they may log prompts), then retry.',
                    fr: 'OpenRouter a bloqué ses modèles gratuits à cause des réglages de confidentialité de ton compte. Sur openrouter.ai, ouvre Settings → Privacy et autorise les endpoints gratuits (ils peuvent enregistrer les requêtes), puis réessaie.',
                    tn: 'OpenRouter سكّر الموديلات المجّانية متاعو خاطر إعدادات الخصوصية متاع الكونت متاعك. في openrouter.ai حلّ Settings → Privacy واسمح بالـ free endpoints (ينجّمو يسجّلو الطلبات)، ومبعد عاود.',
                    tnLatn: 'OpenRouter sakker les modèles gratuits mte3ou 5ater les paramètres de confidentialité mte3 compte mte3ek. F openrouter.ai 7ell Settings → Privacy w esma7 bel free endpoints (ynajmou ysajlou les requêtes), w ba3d 3awed.',
                  })}
                </Txt>
              ) : (
                <Txt variant="caption" tone="secondary">
                  {L({
                    en: 'Check your internet connection and retry.',
                    fr: 'Vérifie ta connexion internet et réessaie.',
                    tn: 'ثبّت في الكونيكسيون متاعك وعاود.',
                    tnLatn: 'Thabbet fel connexion mte3ek w 3awed.',
                  })}
                </Txt>
              )}
            </Why>
          ) : null}
        </ScrollView>
      </Screen>
    </KeyboardAvoidingView>
  );
}

/** Three dots that pulse while the coach is answering (static under reduced motion). */
function TypingDots({ label }: { label: string }) {
  const t = useTokens();
  return (
    <View style={styles.dots} accessible accessibilityLabel={label} accessibilityLiveRegion="polite">
      {[0, 1, 2].map((i) => (
        <Dot key={i} index={i} color={t.textSecondary} />
      ))}
    </View>
  );
}

function Dot({ index, color }: { index: number; color: string }) {
  const reduce = useReducedMotion();
  const o = useSharedValue(0.3);
  useEffect(() => {
    if (reduce) {
      o.value = 0.7;
      return;
    }
    const half = { duration: 380, easing: motion.easeInOut };
    o.value = withDelay(index * 160, withRepeat(withSequence(withTiming(1, half), withTiming(0.3, half)), -1, false));
    return () => cancelAnimation(o);
  }, [reduce, index, o]);
  const style = useAnimatedStyle(() => ({ opacity: o.value }));
  return <Animated.View style={[styles.dot, { backgroundColor: color }, style]} />;
}

const styles = StyleSheet.create({
  list: { paddingHorizontal: space.gutter, paddingTop: space.sm, paddingBottom: space.xl, gap: space.lg },
  userBubble: {
    alignSelf: 'flex-end',
    maxWidth: '85%',
    borderRadius: radius.lg,
    borderBottomRightRadius: radius.sm / 2,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  answer: { flexDirection: 'row', alignItems: 'flex-start', gap: space.md },
  dots: { flexDirection: 'row', alignItems: 'center', gap: 6, height: 24 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  inputBar: { flexDirection: 'row', alignItems: 'flex-end', gap: space.sm },
});
