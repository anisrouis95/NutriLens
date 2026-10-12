import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import {
  Barcode,
  Camera,
  Image as ImageIcon,
  Package,
  PencilLine,
  Plus,
  Search,
  Sparkles,
  X,
} from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppData } from '@/contexts/AppDataContext';
import {
  Appear,
  Button,
  Field,
  Group,
  IconButton,
  ListItem,
  Screen,
  Section,
  Segmented,
  Skeleton,
  Tap,
  Txt,
  Why,
  hapticTap,
  useFormat,
  useSnackbar,
} from '@/components/ds';
import CameraModal from '@/components/food/CameraModal';
import PendingList from '@/components/food/PendingList';
import {
  PendingFood,
  entryToPending,
  guessMeal,
  localToPending,
  packagedToPending,
  pendingKey,
  pendingToEntry,
  per100From,
  recentFoods,
  searchLocalFoods,
} from '@/lib/foodSearch';
import {
  RecognitionResult,
  recognizeFoodFromPhoto,
  recognizeFoodFromText,
} from '@/services/foodRecognitionService';
import { GeminiError } from '@/services/gemini';
import { PackagedFood, lookupBarcode, searchPackagedFoods } from '@/services/openFoodFacts';
import { radius, space, useTokens } from '@/theme';
import type { MealType } from '@/types';

// Short labels so the four fit one segmented control.
const MEALS: { id: MealType; en: string; fr: string }[] = [
  { id: 'breakfast', en: 'Breakfast', fr: 'Petit-déj' },
  { id: 'lunch', en: 'Lunch', fr: 'Déjeuner' },
  { id: 'dinner', en: 'Dinner', fr: 'Dîner' },
  { id: 'snack', en: 'Snack', fr: 'Collation' },
];

type Mode = 'idle' | 'analyzing' | 'review';

export default function TrackScreen() {
  const t = useTokens();
  const router = useRouter();
  const fmt = useFormat();
  const snackbar = useSnackbar();
  const { L, language } = useLanguage();
  const { addFoods, foods, today, profile } = useAppData();
  const params = useLocalSearchParams<{ meal?: MealType; date?: string }>();

  // One meal a day is logged as the evening meal, whatever the hour.
  const [meal, setMeal] = useState<MealType>(params.meal ?? (profile?.mealsPerDay === 1 ? 'dinner' : guessMeal()));
  const date = params.date ?? today;
  useEffect(() => {
    if (params.meal) setMeal(params.meal);
  }, [params.meal]);

  const [mode, setMode] = useState<Mode>('idle');
  // What the analyzing state is waiting on (only changes the caption).
  const [busy, setBusy] = useState<'photo' | 'text' | 'barcode'>('photo');
  const [pending, setPending] = useState<PendingFood[]>([]);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [photoHint, setPhotoHint] = useState('');
  const [aiResult, setAiResult] = useState<RecognitionResult | null>(null);
  const [error, setError] = useState<{ code: string; message: string } | null>(null);
  const [camera, setCamera] = useState<'photo' | 'barcode' | null>(null);

  const [query, setQuery] = useState('');
  const [packaged, setPackaged] = useState<PackagedFood[] | null>(null);
  const [searchingOff, setSearchingOff] = useState(false);
  const [describe, setDescribe] = useState('');
  const [showDescribe, setShowDescribe] = useState(false);
  const [quickKcal, setQuickKcal] = useState('');
  const [quickProtein, setQuickProtein] = useState('');

  const localResults = useMemo(() => searchLocalFoods(query), [query]);
  const recents = useMemo(() => recentFoods(foods, 12), [foods]);

  const reset = () => {
    setMode('idle');
    setPending([]);
    setPhotoUri(null);
    setPhotoHint('');
    setAiResult(null);
    setError(null);
    setQuery('');
    setPackaged(null);
    setDescribe('');
    setShowDescribe(false);
  };

  /** Confirms with a snackbar (global, so it survives navigation) and returns to where the user came from. */
  const confirmAndLeave = (kcal: number) => {
    hapticTap('success');
    snackbar.show(L({ en: '{{kcal}} kcal added', fr: '{{kcal}} kcal ajoutées' }, { kcal: fmt(Math.round(kcal)) }), {
      label: L({ en: 'View diary', fr: 'Voir le journal' }),
      onPress: () => router.navigate('/(tabs)/food'),
    });
    if (router.canGoBack()) router.back();
    else router.replace('/(tabs)/food');
  };

  const handleAiError = (e: unknown) => {
    if (e instanceof GeminiError) setError({ code: e.code, message: e.message });
    else setError({ code: 'server', message: e instanceof Error ? e.message : String(e) });
    setMode(pending.length ? 'review' : 'idle');
  };

  const applyRecognition = (result: RecognitionResult, source: 'photo' | 'ai_text') => {
    setAiResult(result);
    if (!result.isFood) {
      setError({
        code: 'not_food',
        message: L({ en: 'No food found in this photo.', fr: 'Aucun aliment trouvé sur cette photo.' }),
      });
      setMode('idle');
      return;
    }
    setPending(
      result.items.map((i) => ({
        key: pendingKey(),
        name: i.name,
        grams: i.grams,
        per100: per100From(i),
        source,
        confidence: i.confidence,
        notes: i.notes,
      })),
    );
    setMode('review');
  };

  const analyzePhoto = async (uri: string, hint?: string) => {
    setPhotoUri(uri);
    setError(null);
    setBusy('photo');
    setMode('analyzing');
    try {
      const result = await recognizeFoodFromPhoto(uri, language, hint);
      applyRecognition(result, 'photo');
    } catch (e) {
      handleAiError(e);
    }
  };

  const pickFromGallery = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]?.uri) analyzePhoto(result.assets[0].uri);
  };

  const analyzeText = async () => {
    if (!describe.trim()) return;
    setError(null);
    setBusy('text');
    setMode('analyzing');
    try {
      const result = await recognizeFoodFromText(describe, language);
      setAiResult(result);
      if (!result.isFood)
        throw new GeminiError(
          'bad_response',
          L({ en: 'No food recognised in that description.', fr: 'Aucun aliment reconnu dans cette description.' }),
        );
      setPending((prev) => [
        ...prev,
        ...result.items.map((i) => ({
          key: pendingKey(),
          name: i.name,
          grams: i.grams,
          per100: per100From(i),
          source: 'ai_text' as const,
          confidence: i.confidence,
          notes: i.notes,
        })),
      ]);
      setDescribe('');
      setShowDescribe(false);
      setMode('review');
    } catch (e) {
      handleAiError(e);
    }
  };

  const onBarcode = async (code: string) => {
    setCamera(null);
    setError(null);
    setBusy('barcode');
    setMode('analyzing');
    try {
      const product = await lookupBarcode(code, language);
      if (!product) {
        setError({
          code: 'barcode_unknown',
          message: L(
            {
              en: 'Product {{code}} is not in Open Food Facts yet. Try searching by name, or snap a photo of the label.',
              fr: 'Le produit {{code}} n’est pas encore dans Open Food Facts. Cherche-le par son nom, ou photographie l’étiquette.',
            },
            { code },
          ),
        });
        setMode(pending.length ? 'review' : 'idle');
        return;
      }
      setPending((prev) => [...prev, packagedToPending(product, 'barcode')]);
      setMode('review');
    } catch (e) {
      setError({ code: 'network', message: e instanceof Error ? e.message : String(e) });
      setMode(pending.length ? 'review' : 'idle');
    }
  };

  const searchOff = async () => {
    if (!query.trim()) return;
    setSearchingOff(true);
    setError(null);
    try {
      setPackaged(await searchPackagedFoods(query.trim(), language));
    } catch (e) {
      setError({ code: 'network', message: e instanceof Error ? e.message : String(e) });
    } finally {
      setSearchingOff(false);
    }
  };

  const addPending = (p: PendingFood) => {
    setPending((prev) => [...prev, p]);
    setQuery('');
    setPackaged(null);
    setMode('review');
  };

  const quickKcalValue = parseFloat(quickKcal.replace(',', '.'));
  const quickAdd = () => {
    const kcal = quickKcalValue;
    if (!Number.isFinite(kcal) || kcal <= 0) return;
    const protein = parseFloat(quickProtein.replace(',', '.')) || 0;
    addFoods([
      {
        date,
        meal,
        name: L({ en: 'Quick add', fr: 'Ajout rapide' }),
        calories: Math.round(kcal),
        protein,
        carbs: 0,
        fat: 0,
        source: 'quick',
      },
    ]);
    setQuickKcal('');
    setQuickProtein('');
    confirmAndLeave(kcal);
  };

  const save = () => {
    addFoods(pending.map((p) => pendingToEntry(p, date, meal)));
    const total = pending.reduce((s, p) => s + (p.per100.kcal * p.grams) / 100, 0);
    reset();
    confirmAndLeave(total);
  };

  // ---------------------------------------------------------------------------
  // Pieces
  // ---------------------------------------------------------------------------

  const keyError = error?.code === 'no_key' || error?.code === 'invalid_key';
  const errorTitle = !error
    ? ''
    : error.code === 'no_key'
      ? L({ en: 'Turn on free AI food scanning', fr: 'Active le scan IA gratuit' })
      : error.code === 'invalid_key'
        ? L({ en: 'Your AI key was rejected', fr: 'Ta clé IA a été refusée' })
        : error.code === 'quota'
          ? L({ en: 'Daily free AI limit reached', fr: 'Limite IA gratuite du jour atteinte' })
          : error.code === 'data_policy'
            ? L({ en: 'OpenRouter needs one setting', fr: 'OpenRouter demande un réglage' })
            : error.code === 'network'
            ? L({ en: 'No connection', fr: 'Pas de connexion' })
            : error.code === 'not_food'
              ? L({ en: 'No food found', fr: 'Aucun aliment trouvé' })
              : error.code === 'barcode_unknown'
                ? L({ en: 'Product not found', fr: 'Produit introuvable' })
                : L({ en: 'Something went wrong', fr: 'Un problème est survenu' });
  const errorBody = !error
    ? ''
    : keyError
      ? L({
          en: 'Photo and text recognition need a free AI key, no card needed: a Google Gemini key (aistudio.google.com) or an OpenRouter key. Paste it in Profile → AI food scanning. Search, barcodes and quick add work without it.',
          fr: 'La reconnaissance photo et texte demande une clé IA gratuite, sans carte bancaire : une clé Google Gemini (aistudio.google.com) ou une clé OpenRouter. Colle-la dans Profil → Scan IA des repas. La recherche, les codes-barres et l’ajout rapide marchent sans.',
        })
      : error.code === 'quota'
        ? L({
            en: 'Free AI keys allow a limited number of requests per minute and per day. Wait a minute and retry, or log this meal with search for now.',
            fr: 'Les clés IA gratuites limitent le nombre de requêtes par minute et par jour. Attends une minute et réessaie, ou utilise la recherche pour ce repas.',
          })
        : error.code === 'data_policy'
          ? L({
              en: 'OpenRouter blocked its free models because of your account’s privacy settings. On openrouter.ai open Settings → Privacy and allow free endpoints (they may log prompts), then retry.',
              fr: 'OpenRouter a bloqué ses modèles gratuits à cause des réglages de confidentialité de ton compte. Sur openrouter.ai, ouvre Settings → Privacy et autorise les endpoints gratuits (ils peuvent enregistrer les requêtes), puis réessaie.',
            })
          : error.message;

  const busyCaption =
    busy === 'barcode'
      ? L({ en: 'Looking up the product…', fr: 'Recherche du produit…' })
      : busy === 'text'
        ? L({ en: 'Estimating what you described…', fr: 'Estimation de ta description…' })
        : L({ en: 'Identifying foods and portions…', fr: 'Identification des aliments et portions…' });

  const kcalTrailing = (kcal: number, unit: string) => (
    <View style={styles.trailing}>
      <View style={{ alignItems: 'flex-end' }}>
        <Txt variant="numMedium">{fmt(Math.round(kcal))}</Txt>
        <Txt variant="caption" tone="tertiary">
          {unit}
        </Txt>
      </View>
      <Plus size={20} color={t.textSecondary} />
    </View>
  );

  const addActions = (
    <View>
      <Button
        label={L({ en: 'Snap your meal', fr: 'Prends ton repas en photo' })}
        variant={mode === 'review' ? 'tonal' : 'filled'}
        size="lg"
        fill
        haptic="light"
        icon={(c) => <Camera size={22} color={c} />}
        onPress={() => setCamera('photo')}
      />
      <View style={styles.tools}>
        <ToolButton
          label={L({ en: 'Gallery', fr: 'Galerie' })}
          icon={(c) => <ImageIcon size={22} color={c} />}
          onPress={pickFromGallery}
        />
        <ToolButton
          label={L({ en: 'Barcode', fr: 'Code-barres' })}
          icon={(c) => <Barcode size={22} color={c} />}
          onPress={() => setCamera('barcode')}
        />
        <ToolButton
          label={L({ en: 'Describe', fr: 'Décrire' })}
          icon={(c) => <PencilLine size={22} color={c} />}
          selected={showDescribe}
          onPress={() => setShowDescribe((s) => !s)}
        />
      </View>
      {showDescribe ? (
        <Appear style={styles.describe}>
          <Field
            label={L({ en: 'What did you eat?', fr: 'Qu’as-tu mangé ?' })}
            value={describe}
            onChangeText={setDescribe}
            placeholder={L({
              en: 'e.g. a bowl of lablabi with an egg and half a baguette',
              fr: 'ex. un bol de lablabi avec un œuf et une demi-baguette',
            })}
            multiline
            autoFocus
            style={styles.describeInput}
          />
          <Button
            label={L({ en: 'Estimate with AI', fr: 'Estimer avec l’IA' })}
            icon={(c) => <Sparkles size={20} color={c} />}
            onPress={analyzeText}
            disabled={!describe.trim()}
            fill
          />
        </Appear>
      ) : null}
    </View>
  );

  const localDate = new Date(date + 'T12:00:00').toLocaleDateString(language === 'fr' ? 'fr-FR' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <View style={{ flex: 1 }}>
      <Screen
        title={L({ en: 'Add food', fr: 'Ajouter un repas' })}
        back
        actions={
          mode !== 'idle' ? (
            <IconButton
              label={L({ en: 'Start over', fr: 'Recommencer' })}
              icon={(c) => <X size={22} color={c} />}
              onPress={reset}
            />
          ) : undefined
        }
      >
        <Segmented
          options={MEALS.map((m) => ({ value: m.id, label: L(m) }))}
          value={meal}
          onChange={setMeal}
        />
        {date !== today ? (
          <Txt variant="caption" tone="secondary" style={{ marginTop: space.sm }}>
            {L({ en: 'Adding to {{date}}', fr: 'Ajout au {{date}}' }, { date: localDate })}
          </Txt>
        ) : null}

        {error ? (
          <Appear key={`${error.code}:${error.message}`} style={{ marginTop: space.lg }}>
            <Why title={errorTitle} tone="warning" initiallyOpen>
              <Txt variant="body" tone="secondary">
                {errorBody}
              </Txt>
              {keyError ? (
                <Button
                  label={L({ en: 'Open settings', fr: 'Ouvrir les réglages' })}
                  variant="tonal"
                  onPress={() => router.push('/profile')}
                  style={{ marginTop: space.md }}
                />
              ) : null}
            </Why>
          </Appear>
        ) : null}

        {photoUri && mode !== 'idle' ? (
          <View style={{ marginTop: space.xl }}>
            <Image
              source={{ uri: photoUri }}
              style={[styles.photo, { backgroundColor: t.surface }]}
              contentFit="cover"
              accessibilityLabel={L({ en: 'Your meal photo', fr: 'La photo de ton repas' })}
            />
            {mode === 'review' && aiResult?.dishName ? (
              <Txt variant="title" style={{ marginTop: space.md }}>
                {aiResult.dishName}
              </Txt>
            ) : null}
          </View>
        ) : null}

        {mode === 'analyzing' ? (
          <Appear style={styles.analyzing}>
            <Txt variant="caption" tone="secondary" accessibilityLiveRegion="polite">
              {busyCaption}
            </Txt>
            {[0, 1, 2].map((i) => (
              <View key={i} style={styles.skeletonRow}>
                <View style={{ flex: 1, gap: space.xs }}>
                  <Skeleton width={i === 1 ? '46%' : '64%'} height={18} />
                  <Skeleton width="32%" height={12} />
                </View>
                <Skeleton width={56} height={26} />
              </View>
            ))}
          </Appear>
        ) : null}

        {mode === 'review' ? (
          <Appear>
            {photoUri ? (
              <Field
                containerStyle={{ marginTop: space.lg }}
                label={L({ en: 'Correct the AI', fr: 'Corrige l’IA' })}
                value={photoHint}
                onChangeText={setPhotoHint}
                placeholder={L({ en: 'e.g. “cooked with 2 tbsp olive oil”', fr: 'ex. « cuit avec 2 c. à s. d’huile »' })}
                returnKeyType="send"
                onSubmitEditing={() => {
                  if (photoHint.trim()) analyzePhoto(photoUri, photoHint);
                }}
                trailing={
                  <View style={{ marginRight: -space.sm }}>
                    <IconButton
                      size={40}
                      label={L({ en: 'Analyze again with this correction', fr: 'Réanalyser avec cette correction' })}
                      disabled={!photoHint.trim()}
                      icon={(c) => <Sparkles size={20} color={photoHint.trim() ? t.accentText : c} />}
                      onPress={() => analyzePhoto(photoUri, photoHint)}
                    />
                  </View>
                }
              />
            ) : null}
            <View style={{ marginTop: space.xl }}>
              <PendingList
                items={pending}
                onChange={(items) => {
                  setPending(items);
                  if (!items.length) setMode('idle');
                }}
                onSave={save}
                saveLabel={L({ en: 'Add to diary', fr: 'Ajouter au journal' })}
                tips={aiResult?.tips}
              />
            </View>
          </Appear>
        ) : null}

        {mode !== 'analyzing' ? (
          <>
            {mode === 'review' ? (
              <Section title={L({ en: 'Add something else to this meal', fr: 'Ajouter autre chose à ce repas' })}>
                {addActions}
              </Section>
            ) : (
              <View style={{ marginTop: space.xl }}>{addActions}</View>
            )}

            <Section title={L({ en: 'Search foods', fr: 'Chercher un aliment' })}>
              <Field
                value={query}
                onChangeText={(v) => {
                  setQuery(v);
                  setPackaged(null);
                }}
                placeholder={L({ en: 'Couscous, eggs, Délice…', fr: 'Couscous, œufs, Délice…' })}
                returnKeyType="search"
                onSubmitEditing={searchOff}
                accessibilityLabel={L({ en: 'Search a food', fr: 'Chercher un aliment' })}
                leading={<Search size={20} color={t.textTertiary} />}
                trailing={
                  query ? (
                    <View style={{ marginRight: -space.sm }}>
                      <IconButton
                        size={40}
                        label={L({ en: 'Clear search', fr: 'Effacer la recherche' })}
                        icon={(c) => <X size={20} color={c} />}
                        onPress={() => {
                          setQuery('');
                          setPackaged(null);
                        }}
                      />
                    </View>
                  ) : null
                }
              />

              {query.trim() ? (
                <View style={{ marginTop: space.md }}>
                  {localResults.length ? (
                    <Group>
                      {localResults.map((f, i) => (
                        <ListItem
                          key={f.id}
                          title={L(f.name)}
                          supporting={
                            f.servings[0] ? `${L(f.servings[0].label)} · ${fmt(f.servings[0].grams)} g` : undefined
                          }
                          trailing={kcalTrailing(f.per100g.kcal, 'kcal/100 g')}
                          onPress={() => addPending(localToPending(f, language))}
                          divider={i < localResults.length - 1}
                        />
                      ))}
                    </Group>
                  ) : (
                    <Txt variant="caption" tone="secondary" align="center" style={{ marginTop: space.xs }}>
                      {L({
                        en: 'Not in the offline list — try packaged products or “Describe”.',
                        fr: 'Absent de la liste hors-ligne — essaie les produits emballés ou « Décrire ».',
                      })}
                    </Txt>
                  )}

                  {packaged?.length ? (
                    <Appear>
                      <Txt variant="label" tone="secondary" style={styles.groupLabel}>
                        {L({ en: 'Packaged products · Open Food Facts', fr: 'Produits emballés · Open Food Facts' })}
                      </Txt>
                      <Group>
                        {packaged.map((p, i) => (
                          <ListItem
                            key={p.code}
                            title={p.name}
                            supporting={p.brand}
                            leading={(c) =>
                              p.imageUrl ? (
                                // 36 dp thumbnail centred on the 24 dp leading slot.
                                <View style={styles.thumbWrap}>
                                  <Image
                                    source={{ uri: p.imageUrl }}
                                    style={[styles.thumb, { backgroundColor: t.surfaceHigh }]}
                                    contentFit="cover"
                                    cachePolicy="disk"
                                    recyclingKey={p.code}
                                  />
                                </View>
                              ) : (
                                <Package size={22} color={c} />
                              )
                            }
                            trailing={kcalTrailing(p.per100g.kcal, 'kcal/100 g')}
                            onPress={() => addPending(packagedToPending(p, 'search'))}
                            divider={i < packaged.length - 1}
                          />
                        ))}
                      </Group>
                    </Appear>
                  ) : null}

                  {packaged === null ? (
                    <Button
                      label={L({ en: 'Search packaged products', fr: 'Chercher dans les produits emballés' })}
                      variant="outlined"
                      icon={(c) => <Package size={20} color={c} />}
                      onPress={searchOff}
                      loading={searchingOff}
                      fill
                      style={{ marginTop: space.lg }}
                    />
                  ) : packaged.length === 0 ? (
                    <Txt variant="caption" tone="secondary" align="center" style={{ marginTop: space.lg }}>
                      {L({ en: 'No packaged product found.', fr: 'Aucun produit emballé trouvé.' })}
                    </Txt>
                  ) : null}
                </View>
              ) : null}
            </Section>

            {!query.trim() ? (
              <>
                {recents.length ? (
                  <Section title={L({ en: 'Recent', fr: 'Récents' })}>
                    <Group>
                      {recents.map((r, i) => (
                        <ListItem
                          key={r.id}
                          title={r.name}
                          supporting={r.grams ? `${fmt(r.grams)} g` : undefined}
                          trailing={kcalTrailing(r.calories, 'kcal')}
                          onPress={() => addPending(entryToPending(r))}
                          divider={i < recents.length - 1}
                        />
                      ))}
                    </Group>
                  </Section>
                ) : null}

                <Section title={L({ en: 'Quick add', fr: 'Ajout rapide' })}>
                  <Txt variant="caption" tone="secondary" style={{ marginTop: -space.sm, marginBottom: space.md }}>
                    {L({ en: 'When you already know the numbers.', fr: 'Quand tu connais déjà les valeurs.' })}
                  </Txt>
                  <View style={styles.quickRow}>
                    <Field
                      containerStyle={{ flex: 1 }}
                      label={L({ en: 'Calories', fr: 'Calories' })}
                      unit="kcal"
                      numeric
                      value={quickKcal}
                      onChangeText={setQuickKcal}
                      placeholder="0"
                      keyboardType="decimal-pad"
                    />
                    <Field
                      containerStyle={{ flex: 1 }}
                      label={L({ en: 'Protein', fr: 'Protéines' })}
                      unit="g"
                      numeric
                      value={quickProtein}
                      onChangeText={setQuickProtein}
                      placeholder="0"
                      keyboardType="decimal-pad"
                    />
                  </View>
                  <Button
                    label={L({ en: 'Add', fr: 'Ajouter' })}
                    variant="tonal"
                    icon={(c) => <Plus size={20} color={c} />}
                    onPress={quickAdd}
                    disabled={!Number.isFinite(quickKcalValue) || quickKcalValue <= 0}
                    fill
                    style={{ marginTop: space.md }}
                  />
                </Section>
              </>
            ) : null}
          </>
        ) : null}
      </Screen>

      <CameraModal
        visible={camera !== null}
        mode={camera ?? 'photo'}
        onClose={() => setCamera(null)}
        onPhoto={(uri) => {
          setCamera(null);
          analyzePhoto(uri);
        }}
        onBarcode={onBarcode}
      />
    </View>
  );
}

/**
 * Secondary capture action: tonal, icon above label. The ds Button lays its
 * icon and label in one line, which can't fit three across in French
 * ("Code-barres") on a 360 dp phone.
 */
function ToolButton({
  label,
  icon,
  onPress,
  selected,
}: {
  label: string;
  icon: (color: string) => ReactNode;
  onPress: () => void;
  selected?: boolean;
}) {
  const t = useTokens();
  return (
    <Tap
      onPress={onPress}
      accessibilityLabel={label}
      accessibilityState={selected !== undefined ? { expanded: selected } : undefined}
      style={[styles.tool, { backgroundColor: t.accentSoft, borderColor: selected ? t.accent : 'transparent' }]}
      pressedStyle={{ backgroundColor: t.pressed }}
    >
      {icon(t.accentText)}
      <Txt variant="label" color={t.accentText} numberOfLines={1} adjustsFontSizeToFit minimumFontScale={0.8}>
        {label}
      </Txt>
    </Tap>
  );
}

const styles = StyleSheet.create({
  photo: { width: '100%', height: 220, borderRadius: radius.md },
  analyzing: { marginTop: space.lg, gap: space.lg },
  skeletonRow: { flexDirection: 'row', alignItems: 'center', gap: space.lg },
  tools: { flexDirection: 'row', gap: space.sm, marginTop: space.md },
  tool: {
    flex: 1,
    minHeight: 72,
    alignItems: 'center',
    justifyContent: 'center',
    gap: space.xs,
    paddingHorizontal: space.xs,
    paddingVertical: space.sm,
    borderRadius: radius.md,
    borderWidth: 1,
  },
  describe: { marginTop: space.lg, gap: space.md },
  describeInput: { minHeight: 88, textAlignVertical: 'top' },
  trailing: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  groupLabel: { marginTop: space.xl, marginBottom: space.sm },
  thumbWrap: { width: 36, height: 36, marginHorizontal: -6 },
  thumb: { width: 36, height: 36, borderRadius: radius.sm },
  quickRow: { flexDirection: 'row', gap: space.md },
});
