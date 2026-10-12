import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { BookOpen, Bot } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppData } from '@/contexts/AppDataContext';
import { EmptyState, Group, ListItem, RichText, Screen, Section, Txt } from '@/components/ds';
import LessonIcon from '@/components/learn/LessonIcon';
import { lessonOrder, lessons, type Lesson } from '@/content/lessons';
import { planParams } from '@/lib/planParams';
import { radius, space, useTokens } from '@/theme';

export default function LessonScreen() {
  const t = useTokens();
  const router = useRouter();
  const { L, language } = useLanguage();
  const { plan, profile, settings, updateSettings } = useAppData();
  const { id } = useLocalSearchParams<{ id: string }>();
  const lesson = lessons.find((l) => l.id === id);
  const params = planParams(plan, profile, language);

  // Opening a lesson marks it as read.
  useEffect(() => {
    if (!lesson) return;
    const read = settings.readLessons ?? [];
    if (!read.includes(lesson.id)) updateSettings({ readLessons: [...read, lesson.id] });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson?.id]);

  if (!lesson) {
    return (
      <Screen back title={L({ en: 'Lesson', fr: 'Leçon' })} largeTitle={false}>
        <EmptyState
          icon={(c) => <BookOpen size={24} color={c} />}
          title={L({ en: 'Lesson not found', fr: 'Leçon introuvable' })}
          body={L({
            en: 'It may have been renamed in an update. Go back to the lessons list.',
            fr: 'Elle a peut-être été renommée lors d’une mise à jour. Reviens à la liste des leçons.',
          })}
        />
      </Screen>
    );
  }

  const nextId = lessonOrder[lessonOrder.indexOf(lesson.id) + 1];
  const next = lessons.find((l) => l.id === nextId);
  const related = (lesson.related ?? [])
    .map((r) => lessons.find((l) => l.id === r))
    .filter((l): l is Lesson => !!l && l.id !== nextId);
  const open = (lessonId: string) => router.replace({ pathname: '/learn/[id]', params: { id: lessonId } });

  return (
    <Screen back title={L(lesson.title)}>
      <View style={styles.column}>
        <View style={styles.meta}>
          <LessonIcon name={lesson.icon} color={t.textTertiary} size={20} />
          <Txt variant="caption" tone="tertiary">
            <Txt variant="numSmall" tone="tertiary">
              {lesson.minutes}
            </Txt>
            {L({ en: ' min read', fr: ' min de lecture' })}
          </Txt>
        </View>
        <Txt variant="body" tone="secondary" style={{ marginTop: space.md }}>
          {L(lesson.summary, params)}
        </Txt>

        {!profile ? (
          <Txt variant="caption" tone="tertiary" style={{ marginTop: space.md }}>
            {L({
              en: 'Numbers below are examples — answer the questionnaire to see yours.',
              fr: 'Les chiffres ci-dessous sont des exemples — réponds au questionnaire pour voir les tiens.',
            })}
          </Txt>
        ) : null}

        {lesson.sections.map((s, i) => (
          <View key={i} style={{ marginTop: space.xxl }}>
            <Txt variant="title" accessibilityRole="header" style={{ marginBottom: space.md }}>
              {L(s.heading, params)}
            </Txt>
            <RichText text={L(s.body, params)} />
          </View>
        ))}

        <View style={[styles.takeaways, { backgroundColor: t.surfaceLow }]}>
          <Txt variant="titleSmall" accessibilityRole="header" style={{ marginBottom: space.md }}>
            {L({ en: 'Key takeaways', fr: 'À retenir' })}
          </Txt>
          <RichText text={lesson.keyTakeaways[language].map((k) => `- ${L({ en: k, fr: k }, params)}`).join('\n')} />
        </View>

        <Group style={{ marginTop: space.xxl }}>
          <ListItem
            title={L({ en: 'Still unclear? Ask the coach', fr: 'Pas clair ? Demande au coach' })}
            supporting={L({ en: 'Answers built from your own numbers', fr: 'Des réponses construites avec tes chiffres' })}
            leading={(c) => <Bot size={22} color={c} />}
            onPress={() => router.push({ pathname: '/coach', params: { topic: L(lesson.title) } })}
            chevron
          />
        </Group>

        {next || related.length ? (
          <Section title={L({ en: 'Keep reading', fr: 'Continuer la lecture' })}>
            <Group>
              {next ? (
                <ListItem
                  title={L(next.title)}
                  supporting={L({ en: 'Next lesson · {{m}} min', fr: 'Leçon suivante · {{m}} min' }, { m: next.minutes })}
                  leading={(c) => <LessonIcon name={next.icon} color={c} />}
                  onPress={() => open(next.id)}
                  chevron
                  divider={related.length > 0}
                />
              ) : null}
              {related.map((r, i) => (
                <ListItem
                  key={r.id}
                  title={L(r.title)}
                  supporting={L({ en: 'Related · {{m}} min', fr: 'À lire aussi · {{m}} min' }, { m: r.minutes })}
                  leading={(c) => <LessonIcon name={r.icon} color={c} />}
                  onPress={() => open(r.id)}
                  chevron
                  divider={i < related.length - 1}
                />
              ))}
            </Group>
          </Section>
        ) : null}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  // Read surface: a comfortable measure on wide screens.
  column: { width: '100%', maxWidth: 680 },
  meta: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  takeaways: { marginTop: space.xxl, borderRadius: radius.md, padding: space.lg },
});
