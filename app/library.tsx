import { memo, useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import Animated, { useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated';
import { ChevronDown, ChevronRight, PersonStanding, Search, SearchX, X } from 'lucide-react-native';
import type { Slug } from 'react-native-body-highlighter';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppData } from '@/contexts/AppDataContext';
import {
  Appear,
  Button,
  Chip,
  ChipRow,
  Divider,
  EmptyState,
  Field,
  IconButton,
  Screen,
  Segmented,
  Tap,
  Txt,
  DirIcon,
} from '@/components/ds';
import MuscleMap from '@/components/exercise/MuscleMap';
import { ExerciseThumb } from '@/components/exercise/ExerciseAnimation';
import {
  EQUIPMENT_NAMES,
  Exercise,
  MUSCLE_NAMES,
  MUSCLE_TO_SLUGS,
  Muscle,
  SLUG_TO_MUSCLES,
  exerciseImageUrls,
  exerciseName,
  searchExercises,
} from '@/lib/exercises';
import { motion, radius, space, useTokens } from '@/theme';
import type { EquipmentProfile } from '@/types';

const EQUIPMENT_FOR_PROFILE: Record<EquipmentProfile, string[] | undefined> = {
  gym: undefined,
  dumbbells: ['dumbbell', 'body only'],
  bodyweight: ['body only'],
  bands: ['bands', 'body only'],
};

const CATEGORIES = [
  { id: 'strength', en: 'Strength', fr: 'Muscu', tn: 'قوّة', tnLatn: 'Muscu' },
  { id: 'stretching', en: 'Stretching', fr: 'Étirements', tn: 'تمطيط', tnLatn: 'Étirements' },
  { id: 'cardio', en: 'Cardio', fr: 'Cardio', tn: 'كارديو', tnLatn: 'Cardio' },
  { id: 'plyometrics', en: 'Jumps', fr: 'Sauts', tn: 'تنقيز', tnLatn: 'Tan9iz' },
];

const THUMB = 64;

/** An active filter that clears itself when tapped (the ds Chip shows a check when selected). */
function ClearChip({ label, a11y, onPress }: { label: string; a11y: string; onPress: () => void }) {
  const t = useTokens();
  return (
    <Tap onPress={onPress} haptic="selection" hitSlop={6} accessibilityLabel={a11y}>
      <View style={[styles.clearChip, { backgroundColor: t.accentSoft, borderColor: t.accent }]}>
        <Txt variant="label" color={t.accentText} numberOfLines={1}>
          {label}
        </Txt>
        <X size={16} color={t.accentText} strokeWidth={2.4} />
      </View>
    </Tap>
  );
}

/** One result row. Rows share one rounded surface, like a Group split across the list. */
const LibraryRow = memo(function LibraryRow({
  item,
  first,
  last,
  onPress,
}: {
  item: Exercise;
  first: boolean;
  last: boolean;
  onPress: (id: string) => void;
}) {
  const t = useTokens();
  const { L, language } = useLanguage();
  return (
    <View
      style={[
        styles.rowWrap,
        { backgroundColor: t.surface },
        first && { borderTopLeftRadius: radius.md, borderTopRightRadius: radius.md },
        last && { borderBottomLeftRadius: radius.md, borderBottomRightRadius: radius.md },
      ]}
    >
      <Tap
        onPress={() => onPress(item.id)}
        pressScale={1}
        pressedStyle={{ backgroundColor: t.pressed }}
        style={styles.row}
      >
        <ExerciseThumb uri={exerciseImageUrls(item)[0]} size={THUMB} recyclingKey={item.id} />
        <View style={{ flex: 1, minWidth: 0 }}>
          <Txt variant="bodyStrong" numberOfLines={2}>
            {exerciseName(item, language)}
          </Txt>
          <Txt variant="caption" tone="secondary" numberOfLines={2} style={{ marginTop: 2 }}>
            {item.primaryMuscles.map((m) => L(MUSCLE_NAMES[m])).join(', ')}
            {item.equipment ? ` · ${L(EQUIPMENT_NAMES[item.equipment])}` : ''}
          </Txt>
        </View>
        <DirIcon icon={ChevronRight} size={20} color={t.textTertiary} />
      </Tap>
      {!last ? <Divider inset={space.lg + THUMB + space.md} /> : null}
    </View>
  );
});

export default function LibraryScreen() {
  const t = useTokens();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { L } = useLanguage();
  const { profile } = useAppData();

  const [query, setQuery] = useState('');
  const [muscle, setMuscle] = useState<Muscle | null>(null);
  const [myEquipment, setMyEquipment] = useState(profile?.equipment !== 'gym');
  const [category, setCategory] = useState('strength');
  const [curatedOnly, setCuratedOnly] = useState(false);
  const [showMap, setShowMap] = useState(true);

  const rot = useDerivedValue(
    () => withTiming(showMap ? 180 : 0, { duration: motion.base, easing: motion.easeOut }),
    [showMap],
  );
  const chevron = useAnimatedStyle(() => ({ transform: [{ rotate: `${rot.value}deg` }] }));

  const results = useMemo(
    () =>
      searchExercises({
        query,
        muscles: muscle ? [muscle] : undefined,
        equipment: myEquipment && profile ? EQUIPMENT_FOR_PROFILE[profile.equipment] : undefined,
        category,
        curatedOnly,
      }),
    [query, muscle, myEquipment, category, curatedOnly, profile],
  );

  const highlight = muscle ? MUSCLE_TO_SLUGS[muscle].map((slug) => ({ slug, intensity: 2 })) : [];

  const onBodyPress = (part: { slug?: Slug }) => {
    const ms = part.slug ? SLUG_TO_MUSCLES[part.slug] : undefined;
    if (!ms?.length) return;
    setMuscle(muscle && ms.includes(muscle) ? null : ms[0]);
  };

  const clearFilters = () => {
    setQuery('');
    setMuscle(null);
    setCuratedOnly(false);
    setMyEquipment(false);
  };

  const openExercise = useCallback(
    (id: string) => router.push({ pathname: '/exercise/[id]', params: { id } }),
    [router],
  );
  const count = results.length;
  const renderItem = useCallback(
    ({ item, index }: { item: Exercise; index: number }) => (
      <LibraryRow item={item} first={index === 0} last={index === count - 1} onPress={openExercise} />
    ),
    [count, openExercise],
  );

  const header = (
    <View style={{ paddingBottom: space.md }}>
      <Field
        value={query}
        onChangeText={setQuery}
        placeholder={L({
          en: 'Search (squat, curl, développé…)',
          fr: 'Chercher (squat, curl, développé…)',
          tn: 'لوّج (squat، curl، développé…)',
          tnLatn: 'Lawwej (squat, curl, développé…)',
        })}
        accessibilityLabel={L({ en: 'Search exercises', fr: 'Chercher un exercice', tn: 'لوّج على تمرين', tnLatn: 'Lawwej 3la exercice' })}
        returnKeyType="search"
        autoCorrect={false}
        leading={<Search size={20} color={t.textTertiary} />}
        trailing={
          query ? (
            <IconButton
              size={40}
              label={L({ en: 'Clear search', fr: 'Effacer la recherche', tn: 'فسّخ البحث', tnLatn: 'Fasa5 el ba7th' })}
              onPress={() => setQuery('')}
              icon={(c) => <X size={20} color={c} />}
            />
          ) : null
        }
      />

      <Tap
        onPress={() => setShowMap(!showMap)}
        pressScale={1}
        accessibilityState={{ expanded: showMap }}
        style={styles.disclosure}
      >
        <PersonStanding size={20} color={t.textSecondary} />
        <Txt variant="label" style={{ flex: 1 }}>
          {L({ en: 'Pick a muscle on the body', fr: 'Choisis un muscle sur le corps', tn: 'اختار عضلة على البدن', tnLatn: '5tar muscle 3al badan' })}
        </Txt>
        <Animated.View style={chevron}>
          <ChevronDown size={20} color={t.textTertiary} />
        </Animated.View>
      </Tap>
      {showMap ? (
        <Appear offset={4}>
          <MuscleMap data={highlight} sex={profile?.sex} scale={0.62} onPress={onBodyPress} showLegend={false} />
          <Txt variant="caption" tone="secondary" align="center" style={{ marginTop: space.sm }}>
            {muscle
              ? L(
                  {
                    en: '{{m}} — tap it again to clear',
                    fr: '{{m}} — touche-le encore pour effacer',
                    tn: '{{m}} — انزل عليها مرّة أخرى باش تنحّيها',
                    tnLatn: '{{m}} — enzel 3liha marra o5ra bech tna77iha',
                  },
                  { m: L(MUSCLE_NAMES[muscle]) },
                )
              : L({
                en: 'Tap a muscle to see exercises for it',
                fr: 'Touche un muscle pour voir ses exercices',
                tn: 'انزل على عضلة باش تشوف التمارين متاعها',
                tnLatn: 'Enzel 3la muscle bech tchouf les exercices mte3ha',
              })}
          </Txt>
        </Appear>
      ) : null}

      <View style={{ marginTop: space.xl }}>
        <Segmented
          options={CATEGORIES.map((c) => ({ value: c.id, label: L(c) }))}
          value={category}
          onChange={setCategory}
        />
      </View>
      <ChipRow style={{ marginTop: space.md }}>
        {profile && profile.equipment !== 'gym' ? (
          <Chip
            label={L({ en: 'My equipment', fr: 'Mon matériel', tn: 'الماتريال متاعي', tnLatn: 'Matériel mte3i' })}
            selected={myEquipment}
            onPress={() => setMyEquipment(!myEquipment)}
          />
        ) : null}
        <Chip
          label={L({ en: 'Coach picks', fr: 'Sélection du coach', tn: 'اختيار الكوتش', tnLatn: '5tiyar el coach' })}
          selected={curatedOnly}
          onPress={() => setCuratedOnly(!curatedOnly)}
        />
        {muscle ? (
          <ClearChip
            label={L(MUSCLE_NAMES[muscle])}
            a11y={L({
              en: 'Remove filter: {{m}}',
              fr: 'Retirer le filtre : {{m}}',
              tn: 'نحّي الفيلتر: {{m}}',
              tnLatn: 'Na77i el filtre: {{m}}',
            }, { m: L(MUSCLE_NAMES[muscle]) })}
            onPress={() => setMuscle(null)}
          />
        ) : null}
      </ChipRow>
      <Txt variant="numSmall" tone="tertiary" style={{ marginTop: space.lg }}>
        {L({ en: '{{n}} exercises', fr: '{{n}} exercices', tn: '{{n}} تمارين', tnLatn: '{{n}} exercices' }, { n: count })}
      </Txt>
    </View>
  );

  return (
    <Screen
      back
      title={L({ en: 'Exercise library', fr: 'Bibliothèque d’exercices', tn: 'مكتبة التمارين', tnLatn: 'Bibliothèque des exercices' })}
      largeTitle={false}
      scroll={false}
      padded={false}
    >
      <FlatList
        data={results}
        keyExtractor={(e) => e.id}
        renderItem={renderItem}
        initialNumToRender={12}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={{
          paddingHorizontal: space.gutter,
          paddingTop: space.sm,
          paddingBottom: insets.bottom + space.xxl,
        }}
        ListHeaderComponent={header}
        ListEmptyComponent={
          <EmptyState
            icon={(c) => <SearchX size={28} color={c} />}
            title={L({
              en: 'No exercise matches these filters.',
              fr: 'Aucun exercice ne correspond à ces filtres.',
              tn: 'حتى تمرين ما يمشي مع الفيلترات هاذم.',
              tnLatn: '7atta exercice ma yemchi m3a les filtres hedhom.',
            })}
            body={L({
              en: 'Try another word or muscle, or clear the filters.',
              fr: 'Essaie un autre mot ou un autre muscle, ou retire les filtres.',
              tn: 'جرّب كلمة ولا عضلة أخرى، ولا نحّي الفيلترات.',
              tnLatn: 'Jarreb kelma walla muscle o5ra, walla na77i les filtres.',
            })}
            action={
              <Button
                label={L({ en: 'Clear filters', fr: 'Retirer les filtres', tn: 'نحّي الفيلترات', tnLatn: 'Na77i les filtres' })}
                variant="tonal"
                onPress={clearFilters}
              />
            }
          />
        }
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  disclosure: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    minHeight: 48,
    marginTop: space.md,
  },
  clearChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    height: 36,
    paddingHorizontal: 14,
    borderRadius: radius.pill,
    borderWidth: 1,
  },
  rowWrap: { overflow: 'hidden' },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: space.md,
    minHeight: 88,
    paddingHorizontal: space.lg,
    paddingVertical: space.md,
  },
});
