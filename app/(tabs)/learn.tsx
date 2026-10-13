import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated';
import { Bot, CheckCircle2, ChevronDown, ChevronRight, Search, X } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppData } from '@/contexts/AppDataContext';
import {
  Appear,
  Button,
  Divider,
  Field,
  Group,
  IconButton,
  ListItem,
  NAV_BAR_SPACE,
  ProgressLine,
  Screen,
  Section,
  Tap,
  Txt,
  useFormat,
  DirIcon,
} from '@/components/ds';
import LessonIcon from '@/components/learn/LessonIcon';
import { glossary, lessonOrder, lessons, type Lesson } from '@/content/lessons';
import { normalizeText } from '@/lib/foodSearch';
import { planParams } from '@/lib/planParams';
import { motion, space, useTokens } from '@/theme';

export default function LearnScreen() {
  const t = useTokens();
  const router = useRouter();
  const fmt = useFormat();
  const { L, language } = useLanguage();
  const { plan, profile, settings } = useAppData();
  const [query, setQuery] = useState('');
  const [openTerm, setOpenTerm] = useState<string | null>(null);

  const params = planParams(plan, profile, language);
  const read = new Set(settings.readLessons ?? []);
  const ordered = lessonOrder.map((id) => lessons.find((l) => l.id === id)).filter((l): l is Lesson => !!l);
  const readCount = ordered.filter((l) => read.has(l.id)).length;

  const terms = useMemo(() => {
    const q = normalizeText(query);
    return glossary
      .filter((g) => !q || normalizeText(L(g.term)).includes(q) || normalizeText(L(g.definition)).includes(q))
      .sort((a, b) => L(a.term).localeCompare(L(b.term)));
  }, [query, language]);

  const openLesson = (id: string) => router.push({ pathname: '/learn/[id]', params: { id } });

  return (
    <Screen
      title={L({ en: 'Learn', fr: 'Apprendre', tn: 'تعلّم', tnLatn: 'Ta3allem' })}
      subtitle={L({
        en: 'What a coach should have explained — with your own numbers.',
        fr: 'Ce qu’un coach aurait dû t’expliquer — avec tes propres chiffres.',
        tn: 'اللي كان لازم الكوتش يفسّرهولك — بالأرقام متاعك.',
        tnLatn: 'Eli ken lazem el coach yfassarhoulek — bel ar9am mte3ek.',
      })}
      bottomSpace={NAV_BAR_SPACE}
    >
      {plan ? (
        <Section title={L({ en: 'Your numbers', fr: 'Tes chiffres', tn: 'الأرقام متاعك', tnLatn: 'El ar9am mte3ek' })} first>
          <View style={styles.stats}>
            <Stat value={fmt(plan.bmr)} caption={L({ en: 'kcal at rest', fr: 'kcal au repos', tn: 'kcal في الراحة', tnLatn: 'kcal fel ra7a' })} />
            <Stat value={fmt(plan.tdee)} caption={L({ en: 'kcal burned / day', fr: 'kcal dépensées / jour', tn: 'kcal تحرقهم / نهار', tnLatn: 'kcal ta7ra9hom / nhar' })} />
            <Stat
              value={fmt(plan.targetCalories)}
              caption={L({ en: 'kcal to eat / day', fr: 'kcal à manger / jour', tn: 'kcal تاكلهم / نهار', tnLatn: 'kcal takelhom / nhar' })}
              tone="accent"
            />
            <Stat
              value={`${fmt(plan.macros.protein)} g`}
              caption={L({ en: 'protein / day', fr: 'protéines / jour', tn: 'بروتين / نهار', tnLatn: 'protéines / nhar' })}
              tone="protein"
            />
          </View>
          <Button
            variant="text"
            label={L({
              en: 'See how each number is calculated',
              fr: 'Voir le calcul de chaque chiffre',
              tn: 'شوف كيفاش يتحسب كل رقم',
              tnLatn: 'Chouf kifech yet7seb kol ra9m',
            })}
            onPress={() => router.push('/plan')}
            style={styles.inlineText}
          />
        </Section>
      ) : null}

      <Group style={{ marginTop: plan ? space.lg : 0 }}>
        <ListItem
          title={L({ en: 'Ask anything', fr: 'Pose n’importe quelle question', tn: 'سقسي على أي حاجة', tnLatn: 'Sa9si 3la ay 7aja' })}
          supporting={L({
            en: '“Can I eat bread at night?” “Why didn’t I lose weight this week?”',
            fr: '« Je peux manger du pain le soir ? » « Pourquoi je n’ai pas maigri cette semaine ? »',
            tn: '“نجّم ناكل الخبز في الليل؟” “علاش ما نقصتش الجمعة هاذي؟”',
            tnLatn: '“Najjem nekel el khobz fel lil?” “3lech ma n9astech el jem3a hedhi?”',
          })}
          leading={(c) => <Bot size={22} color={c} />}
          onPress={() => router.push('/coach')}
          chevron
        />
      </Group>

      <Section
        title={L({ en: 'Lessons', fr: 'Leçons', tn: 'الدروس', tnLatn: 'Dourous' })}
        action={
          <Txt
            variant="numSmall"
            tone="secondary"
            accessibilityLabel={L({
              en: '{{n}} of {{t}} read',
              fr: '{{n}} sur {{t}} lues',
              tn: 'قريت {{n}} من {{t}}',
              tnLatn: '9rit {{n}} men {{t}}',
            }, { n: readCount, t: ordered.length })}
          >
            {readCount}/{ordered.length}
          </Txt>
        }
      >
        <ProgressLine value={readCount / Math.max(ordered.length, 1)} height={4} />
        <Group style={{ marginTop: space.md }}>
          {ordered.map((lesson, i) => (
            <LessonRow
              key={lesson.id}
              icon={lesson.icon}
              title={L(lesson.title)}
              summary={L(lesson.summary, params)}
              minutes={lesson.minutes}
              done={read.has(lesson.id)}
              doneLabel={L({ en: 'read', fr: 'lue', tn: 'مقري', tnLatn: 'ma9ri' })}
              onPress={() => openLesson(lesson.id)}
              divider={i < ordered.length - 1}
            />
          ))}
        </Group>
      </Section>

      <Section title={L({ en: 'Glossary', fr: 'Glossaire', tn: 'القاموس', tnLatn: '9amous' })}>
        <Field
          value={query}
          onChangeText={setQuery}
          placeholder={L({ en: 'TDEE, RIR, deficit…', fr: 'TDEE, RIR, déficit…', tn: 'TDEE، RIR، ديفيسيت…', tnLatn: 'TDEE, RIR, déficit…' })}
          accessibilityLabel={L({ en: 'Search the glossary', fr: 'Chercher dans le glossaire', tn: 'لوّج في القاموس', tnLatn: 'Lawwej fel 9amous' })}
          autoCorrect={false}
          returnKeyType="search"
          leading={<Search size={20} color={t.textTertiary} />}
          trailing={
            query ? (
              <IconButton
                size={40}
                label={L({ en: 'Clear search', fr: 'Effacer la recherche', tn: 'فسّخ البحث', tnLatn: 'Fasa5 el ba7th' })}
                onPress={() => setQuery('')}
                icon={(c) => <X size={20} color={c} />}
              />
            ) : undefined
          }
        />
        {terms.length ? (
          <Group style={{ marginTop: space.md }}>
            {terms.map((g, i) => (
              <GlossaryRow
                key={g.id}
                term={L(g.term)}
                definition={L(g.definition, params)}
                open={openTerm === g.id}
                onToggle={() => setOpenTerm(openTerm === g.id ? null : g.id)}
                lessonLabel={L({ en: 'Read the lesson', fr: 'Lire la leçon', tn: 'اقرا الدرس', tnLatn: 'E9ra e dars' })}
                onLesson={g.lessonId ? () => openLesson(g.lessonId!) : undefined}
                divider={i < terms.length - 1}
              />
            ))}
          </Group>
        ) : (
          <Txt variant="caption" tone="tertiary" style={{ marginTop: space.md }}>
            {L({
              en: 'No term matches “{{q}}”.',
              fr: 'Aucun terme ne correspond à « {{q}} ».',
              tn: 'ما لقينا حتى كلمة لـ “{{q}}”.',
              tnLatn: 'Ma l9ina 7atta kelma l “{{q}}”.',
            }, { q: query.trim() })}
          </Txt>
        )}
      </Section>
    </Screen>
  );
}

function Stat({ value, caption, tone = 'primary' }: { value: string; caption: string; tone?: 'primary' | 'accent' | 'protein' }) {
  return (
    <View style={styles.stat}>
      <Txt variant="numMedium" tone={tone} numberOfLines={1} adjustsFontSizeToFit>
        {value}
      </Txt>
      <Txt variant="caption" tone="secondary" style={{ marginTop: 2 }}>
        {caption}
      </Txt>
    </View>
  );
}

/**
 * A lesson row. Like ds ListItem, plus a third line so the full summary and the
 * reading time (in mono) both stay visible — ListItem's single supporting line
 * would truncate the summaries.
 */
function LessonRow({
  icon,
  title,
  summary,
  minutes,
  done,
  doneLabel,
  onPress,
  divider,
}: {
  icon: string;
  title: string;
  summary: string;
  minutes: number;
  done: boolean;
  doneLabel: string;
  onPress: () => void;
  divider: boolean;
}) {
  const t = useTokens();
  return (
    <View>
      <Tap
        onPress={onPress}
        pressScale={1}
        pressedStyle={{ backgroundColor: t.pressed }}
        accessibilityLabel={`${title}, ${minutes} min${done ? `, ${doneLabel}` : ''}`}
      >
        <View style={styles.lessonRow}>
          <View style={styles.leading}>
            <LessonIcon name={icon} color={t.textSecondary} />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Txt variant="bodyStrong">{title}</Txt>
            <Txt variant="caption" tone="secondary" numberOfLines={3} style={{ marginTop: 2 }}>
              {summary}
            </Txt>
            <Txt variant="numSmall" tone="tertiary" style={{ marginTop: space.xs }}>
              {minutes} min
            </Txt>
          </View>
          {done ? <CheckCircle2 size={20} color={t.success} /> : <DirIcon icon={ChevronRight} size={20} color={t.textTertiary} />}
        </View>
      </Tap>
      {divider ? <Divider inset={56} /> : null}
    </View>
  );
}

/** Glossary term that expands in place; the lesson link sits outside the toggle. */
function GlossaryRow({
  term,
  definition,
  open,
  onToggle,
  lessonLabel,
  onLesson,
  divider,
}: {
  term: string;
  definition: string;
  open: boolean;
  onToggle: () => void;
  lessonLabel: string;
  onLesson?: () => void;
  divider: boolean;
}) {
  const t = useTokens();
  const rot = useDerivedValue(() => withTiming(open ? 180 : 0, { duration: motion.base, easing: motion.easeOut }), [open]);
  const chevron = useAnimatedStyle(() => ({ transform: [{ rotate: `${rot.value}deg` }] }));
  return (
    <View>
      <Tap
        onPress={onToggle}
        pressScale={1}
        pressedStyle={{ backgroundColor: t.pressed }}
        accessibilityState={{ expanded: open }}
        style={styles.termHead}
      >
        <Txt variant="bodyStrong" style={{ flex: 1 }}>
          {term}
        </Txt>
        <Animated.View style={chevron}>
          <ChevronDown size={20} color={t.textTertiary} />
        </Animated.View>
      </Tap>
      {open ? (
        <Appear offset={4} style={styles.termBody}>
          <Txt variant="body" tone="secondary">
            {definition}
          </Txt>
          {onLesson ? (
            <Button
              variant="text"
              label={lessonLabel}
              onPress={onLesson}
              icon={(c) => <DirIcon icon={ChevronRight} size={20} color={c} />}
              style={[styles.inlineText, { flexDirection: 'row-reverse' }]}
            />
          ) : null}
        </Appear>
      ) : null}
      {divider ? <Divider inset={space.lg} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  stats: { flexDirection: 'row', gap: space.md },
  stat: { flex: 1, minWidth: 0 },
  inlineText: { marginLeft: -space.md, marginTop: space.xs },
  lessonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.lg,
    minHeight: 64,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
  leading: { width: 24, alignItems: 'center' },
  termHead: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    minHeight: 52,
    paddingHorizontal: space.lg,
    paddingVertical: space.sm,
  },
  termBody: { paddingHorizontal: space.lg, paddingBottom: space.md },
});
