// Log (or edit) a cardio session as one or more steady parts: e.g. treadmill
// 20 min at 5.5 km/h on a 7% incline, then 5 min at 6 km/h flat. A new log
// starts from the last session on the same machine, so a routine is a tap.

import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import {
  Activity,
  Bike,
  ChevronLeft,
  ChevronRight,
  ChevronsUp,
  Footprints,
  Gauge,
  HeartPulse,
  Orbit,
  Plus,
  Trash2,
  Waves,
  X,
} from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppData } from '@/contexts/AppDataContext';
import {
  Appear,
  Button,
  Chip,
  ChipRow,
  Field,
  IconButton,
  Screen,
  Section,
  Segmented,
  Sheet,
  Txt,
  useFormat,
  useSnackbar,
  DirIcon,
} from '@/components/ds';
import {
  EFFORTS,
  MACHINES,
  machineInfo,
  sessionDistanceKm,
  sessionKcal,
} from '@/lib/cardio';
import { addDays } from '@/lib/nutritionMath';
import { newId } from '@/lib/storage';
import { radius, space, useTokens } from '@/theme';
import type { CardioEffort, CardioMachine, CardioSegment, CardioSession } from '@/types';
import { decimalComma } from '@/lib/i18n';

const ICONS: Record<CardioMachine, typeof Gauge> = {
  treadmill: Gauge,
  walk: Footprints,
  run: Activity,
  bike: Bike,
  elliptical: Orbit,
  rower: Waves,
  stairs: ChevronsUp,
  other: HeartPulse,
};

/** A part as typed: strings so "5," or "5,5" survive while typing. */
interface Draft {
  minutes: string;
  speed: string;
  incline: string;
  level: string;
  effort: CardioEffort;
}

const blank = (): Draft => ({ minutes: '', speed: '', incline: '', level: '', effort: 'moderate' });

function useNumberText() {
  const { language } = useLanguage();
  const show = (n?: number) => (n === undefined || n === null ? '' : decimalComma(language) ? String(n).replace('.', ',') : String(n));
  const parse = (s: string) => {
    const v = parseFloat(s.replace(',', '.'));
    return Number.isFinite(v) && v >= 0 ? v : undefined;
  };
  return { show, parse };
}

export default function CardioScreen() {
  const t = useTokens();
  const router = useRouter();
  const fmt = useFormat();
  const snackbar = useSnackbar();
  const { L, language, formatDate } = useLanguage();
  const { show, parse } = useNumberText();
  const { cardio, saveCardio, deleteCardio, today, profile } = useAppData();
  const { id, date: dateParam } = useLocalSearchParams<{ id?: string; date?: string }>();
  const existing = id ? cardio.find((c) => c.id === id) : undefined;

  const toDrafts = (segs: CardioSegment[]): Draft[] =>
    segs.map((s) => ({
      minutes: show(s.minutes),
      speed: show(s.speedKmh),
      incline: show(s.inclinePct),
      level: show(s.level),
      effort: s.effort ?? 'moderate',
    }));
  // The most recent session per machine, to start a new log from.
  const lastByMachine = useMemo(() => {
    const map = new Map<CardioMachine, CardioSession>();
    for (const c of [...cardio].sort((a, b) => a.createdAt.localeCompare(b.createdAt))) map.set(c.machine, c);
    return map;
  }, [cardio]);
  const latest = useMemo(() => [...cardio].sort((a, b) => b.createdAt.localeCompare(a.createdAt))[0], [cardio]);

  const [date, setDate] = useState(existing?.date ?? dateParam ?? today);
  const [machine, setMachine] = useState<CardioMachine>(existing?.machine ?? latest?.machine ?? 'treadmill');
  const [drafts, setDrafts] = useState<Draft[]>(() => {
    if (existing) return toDrafts(existing.segments);
    const prev = lastByMachine.get(latest?.machine ?? 'treadmill');
    return prev ? toDrafts(prev.segments) : [blank()];
  });
  // Pre-filled from history until the user types anything.
  const [touched, setTouched] = useState(!!existing);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const info = machineInfo(machine);
  const segments: CardioSegment[] = drafts
    .map((d) => ({
      minutes: parse(d.minutes) ?? 0,
      speedKmh: info.speed ? parse(d.speed) : undefined,
      inclinePct: info.incline ? parse(d.incline) : undefined,
      level: info.level ? parse(d.level) : undefined,
      effort: info.effort ? d.effort : undefined,
    }))
    .filter((s) => s.minutes > 0);
  const weightKg = profile?.weightKg ?? 75;
  const totalMin = segments.reduce((sum, s) => sum + s.minutes, 0);
  const kcal = sessionKcal(machine, segments, weightKg);
  const km = sessionDistanceKm(machine, segments);
  const prefilledFrom = !touched && !existing ? lastByMachine.get(machine) : undefined;

  const pickMachine = (m: CardioMachine) => {
    setMachine(m);
    if (touched || existing) return;
    const prev = lastByMachine.get(m);
    setDrafts(prev ? toDrafts(prev.segments) : [blank()]);
  };
  const edit = (i: number, patch: Partial<Draft>) => {
    setTouched(true);
    setDrafts((ds) => ds.map((d, n) => (n === i ? { ...d, ...patch } : d)));
  };
  const addPart = () => {
    setTouched(true);
    setDrafts((ds) => [...ds, { ...(ds[ds.length - 1] ?? blank()), minutes: '' }]);
  };
  const removePart = (i: number) => {
    setTouched(true);
    setDrafts((ds) => (ds.length > 1 ? ds.filter((_, n) => n !== i) : ds));
  };

  const dayLabel = (d: string) => {
    if (d === today) return L({ en: 'Today', fr: 'Aujourd’hui', tn: 'اليوم', tnLatn: 'Lyoum' });
    if (d === addDays(today, -1)) return L({ en: 'Yesterday', fr: 'Hier', tn: 'البارح', tnLatn: 'Lbera7' });
    const s = formatDate(new Date(d + 'T12:00:00'), {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
    });
    return s.charAt(0).toUpperCase() + s.slice(1);
  };

  const save = () => {
    if (!totalMin) {
      snackbar.show(L({
        en: 'Add how many minutes you did',
        fr: 'Indique combien de minutes tu as fait',
        tn: 'اكتب قدّاش من دقيقة عملت',
        tnLatn: 'Ekteb 9addech men d9i9a 3malt',
      }));
      return;
    }
    const now = new Date().toISOString();
    saveCardio({
      id: existing?.id ?? newId(),
      date,
      machine,
      segments,
      kcal,
      distanceKm: km,
      createdAt: existing?.createdAt ?? now,
      updatedAt: existing ? now : undefined,
    });
    snackbar.show(
      L(
        { en: 'Cardio saved · {{m}} min', fr: 'Cardio enregistré · {{m}} min', tn: 'الكارديو تسجّل · {{m}} min', tnLatn: 'Cardio tsajjel · {{m}} min' },
        { m: fmt(totalMin) },
      ),
    );
    router.back();
  };

  const num = (n: number, d = 0) => fmt(n, d);

  return (
    <View style={{ flex: 1 }}>
      <Screen
        back
        title={
          existing
            ? L({ en: 'Edit cardio', fr: 'Modifier le cardio', tn: 'بدّل الكارديو', tnLatn: 'Baddel cardio' })
            : L({ en: 'Log cardio', fr: 'Noter du cardio', tn: 'سجّل كارديو', tnLatn: 'Sajjel cardio' })
        }
        actions={
          existing ? (
            <IconButton
              label={L({ en: 'Delete this cardio', fr: 'Supprimer ce cardio', tn: 'فسّخ الكارديو هذا', tnLatn: 'Fasa5 el cardio hedha' })}
              onPress={() => setDeleteOpen(true)}
              icon={(c) => <Trash2 size={22} color={c} />}
            />
          ) : null
        }
        footer={
          <Button
            label={L({ en: 'Save cardio', fr: 'Enregistrer le cardio', tn: 'سجّل الكارديو', tnLatn: 'Sajjel cardio' })}
            onPress={save}
            inactive={!totalMin}
            size="lg"
            fill
            haptic="medium"
          />
        }
      >
        <View style={styles.dateRow}>
          <IconButton
            label={L({ en: 'Day before', fr: 'Jour précédent', tn: 'النهار اللي قبل', tnLatn: 'Nhar eli 9bal' })}
            onPress={() => setDate((d) => addDays(d, -1))}
            icon={(c) => <DirIcon icon={ChevronLeft} size={22} color={c} />}
          />
          <Txt variant="bodyStrong" align="center" style={{ flex: 1 }} numberOfLines={1}>
            {dayLabel(date)}
          </Txt>
          <IconButton
            label={L({ en: 'Day after', fr: 'Jour suivant', tn: 'النهار اللي بعد', tnLatn: 'Nhar eli ba3d' })}
            onPress={() => setDate((d) => (d < today ? addDays(d, 1) : d))}
            disabled={date >= today}
            icon={(c) => <DirIcon icon={ChevronRight} size={22} color={c} />}
          />
        </View>

        <Section title={L({ en: 'What did you do?', fr: 'Qu’as-tu fait ?', tn: 'شنوّة عملت؟', tnLatn: 'Chnowa 3malt?' })}>
          <ChipRow>
            {MACHINES.map((m) => {
              const Icon = ICONS[m.id];
              return (
                <Chip
                  key={m.id}
                  label={L(m.name)}
                  selected={m.id === machine}
                  onPress={() => pickMachine(m.id)}
                  icon={(c) => <Icon size={16} color={c} />}
                />
              );
            })}
          </ChipRow>
        </Section>

        <Section title={L({ en: 'Parts', fr: 'Étapes', tn: 'المراحل', tnLatn: 'Étapes' })}>
          {prefilledFrom ? (
            <Txt variant="caption" tone="secondary" style={{ marginBottom: space.md }}>
              {L(
                {
                  en: 'Filled in from your last session ({{day}}). Change anything that was different.',
                  fr: 'Repris de ta dernière séance ({{day}}). Change ce qui était différent.',
                  tn: 'تعمّر من آخر حصّة ({{day}}). بدّل كان فما حاجة تبدّلت.',
                  tnLatn: 'T3ammer men e5er séance ({{day}}). Baddel ken fama 7aja tbaddlet.',
                },
                { day: dayLabel(prefilledFrom.date).toLowerCase() },
              )}
            </Txt>
          ) : null}
          <View style={{ gap: space.md }}>
            {drafts.map((d, i) => (
              <Appear key={i} offset={4}>
                <View style={[styles.part, { backgroundColor: t.surface }]}>
                  <View style={styles.partHead}>
                    <Txt variant="overline" tone="secondary" style={{ flex: 1 }}>
                      {L({ en: 'Part {{n}}', fr: 'Étape {{n}}', tn: 'مرحلة {{n}}', tnLatn: 'Étape {{n}}' }, { n: i + 1 })}
                    </Txt>
                    {drafts.length > 1 ? (
                      <IconButton
                        label={L({ en: 'Remove part {{n}}', fr: 'Retirer l’étape {{n}}', tn: 'نحّي المرحلة {{n}}', tnLatn: 'Na77i étape {{n}}' }, { n: i + 1 })}
                        onPress={() => removePart(i)}
                        size={40}
                        icon={(c) => <X size={18} color={c} />}
                      />
                    ) : null}
                  </View>
                  <View style={styles.fields}>
                    <Field
                      label={L({ en: 'Time', fr: 'Durée', tn: 'الوقت', tnLatn: 'Wa9t' })}
                      unit="min"
                      numeric
                      keyboardType="decimal-pad"
                      value={d.minutes}
                      onChangeText={(v) => edit(i, { minutes: v })}
                      placeholder="20"
                      maxLength={5}
                      containerStyle={styles.field}
                      compact
                    />
                    {info.speed ? (
                      <Field
                        label={L({ en: 'Speed', fr: 'Vitesse', tn: 'السرعة', tnLatn: 'Vitesse' })}
                        unit="km/h"
                        numeric
                        keyboardType="decimal-pad"
                        value={d.speed}
                        onChangeText={(v) => edit(i, { speed: v })}
                        placeholder={machine === 'run' ? '9' : decimalComma(language) ? '5,5' : '5.5'}
                        maxLength={5}
                        containerStyle={styles.field}
                        compact
                      />
                    ) : null}
                    {info.incline ? (
                      <Field
                        label={L({ en: 'Incline', fr: 'Pente', tn: 'البنتة', tnLatn: 'Pente' })}
                        unit="%"
                        numeric
                        keyboardType="decimal-pad"
                        value={d.incline}
                        onChangeText={(v) => edit(i, { incline: v })}
                        placeholder="0"
                        maxLength={4}
                        containerStyle={styles.field}
                        compact
                      />
                    ) : null}
                    {info.level ? (
                      <Field
                        label={L({ en: 'Level', fr: 'Niveau', tn: 'النيفو', tnLatn: 'Niveau' })}
                        numeric
                        keyboardType="decimal-pad"
                        value={d.level}
                        onChangeText={(v) => edit(i, { level: v })}
                        placeholder="—"
                        maxLength={4}
                        containerStyle={styles.field}
                        compact
                      />
                    ) : null}
                  </View>
                  {info.effort ? (
                    <View style={{ marginTop: space.md }}>
                      <Txt variant="label" tone="secondary" style={{ marginBottom: space.xs }}>
                        {L({ en: 'How hard did it feel?', fr: 'C’était dur comment ?', tn: 'قدّاش كانت صعيبة؟', tnLatn: '9addech kenet s3iba?' })}
                      </Txt>
                      <Segmented<CardioEffort>
                        value={d.effort}
                        onChange={(v) => edit(i, { effort: v })}
                        options={EFFORTS.map((e) => ({ value: e.id, label: L(e.name) }))}
                      />
                    </View>
                  ) : null}
                </View>
              </Appear>
            ))}
          </View>
          <Button
            label={L({ en: 'Add a part', fr: 'Ajouter une étape', tn: 'زيد مرحلة', tnLatn: 'Zid étape' })}
            variant="text"
            icon={(c) => <Plus size={18} color={c} strokeWidth={2.6} />}
            onPress={addPart}
            style={{ marginTop: space.sm, marginLeft: -space.md }}
          />
          <Txt variant="caption" tone="tertiary">
            {info.incline
              ? L({
                  en: 'Changed speed or incline partway? Add a part for each stretch.',
                  fr: 'Tu as changé de vitesse ou de pente en route ? Ajoute une étape pour chaque partie.',
                  tn: 'بدّلت السرعة ولا البنتة في الوسط؟ زيد مرحلة لكل طرف.',
                  tnLatn: 'Baddelt vitesse wala inclinaison fel wost? Zid étape l kol tarf.',
                })
              : L({
                  en: 'Changed pace or level partway? Add a part for each stretch.',
                  fr: 'Tu as changé de rythme ou de niveau en route ? Ajoute une étape pour chaque partie.',
                  tn: 'بدّلت الريتم ولا النيفو في الوسط؟ زيد مرحلة لكل طرف.',
                  tnLatn: 'Baddelt rythme wala niveau fel wost? Zid étape l kol tarf.',
                })}
          </Txt>
        </Section>

        <View style={[styles.summary, { borderTopColor: t.hairline }]}>
          <View style={styles.stat}>
            <Txt variant="numLarge">{num(totalMin, Number.isInteger(totalMin) ? 0 : 1)}</Txt>
            <Txt variant="overline" tone="tertiary">
              min
            </Txt>
          </View>
          {km !== undefined ? (
            <View style={styles.stat}>
              <Txt variant="numLarge">{num(km, km < 10 ? 2 : 1)}</Txt>
              <Txt variant="overline" tone="tertiary">
                km
              </Txt>
            </View>
          ) : null}
          <View style={styles.stat}>
            <Txt variant="numLarge">{`≈${num(kcal)}`}</Txt>
            <Txt variant="overline" tone="tertiary">
              {L({ en: 'kcal burned', fr: 'kcal brûlées', tn: 'kcal محروقة', tnLatn: 'kcal ma7rou9a' })}
            </Txt>
          </View>
        </View>
        <Txt variant="caption" tone="tertiary" style={{ marginTop: space.md }}>
          {L(
            {
              en: 'An estimate for {{kg}} kg from speed and incline (or how hard it felt). Your daily calorie target already includes your planned training, so this is not added to what you can eat.',
              fr: 'Une estimation pour {{kg}} kg selon la vitesse et la pente (ou l’effort ressenti). Ta cible calorique compte déjà ton entraînement prévu, donc ce n’est pas ajouté à ce que tu peux manger.',
              tn: 'تقدير لـ {{kg}} kg حسب السرعة والبنتة (ولا قدّاش كانت صعيبة). هدف الكالوري متاعك في النهار يحسب ديجا التمارين اللي مبرمجة، يعني هذا ما يتزادش على اللي تنجّم تاكلو.',
              tnLatn: 'Ta9dir l {{kg}} kg 7asb el vitesse w l inclinaison (wala 9addech kenet s3iba). Objectif calories mte3ek fel nhar y7seb déjà l entraînement eli mbarmej, ya3ni hedha ma yetzedech 3la eli tnajjem takel.',
            },
            { kg: fmt(weightKg, Number.isInteger(weightKg) ? 0 : 1) },
          )}
        </Txt>
      </Screen>

      <Sheet
        visible={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title={L({ en: 'Delete this cardio?', fr: 'Supprimer ce cardio ?', tn: 'نفسّخ الكارديو هذا؟', tnLatn: 'Nfasa5 el cardio hedha?' })}
      >
        <Txt tone="secondary">
          {L({
            en: 'It disappears from your calendar and monthly totals.',
            fr: 'Il disparaît de ton calendrier et de tes totaux du mois.',
            tn: 'باش يتنحّى من الروزنامة متاعك ومن مجموع الشهر.',
            tnLatn: 'Bech yetna77a mel calendrier mte3ek w mel total mta3 chhar.',
          })}
        </Txt>
        <View style={{ gap: space.sm, marginTop: space.xl }}>
          <Button
            label={L({ en: 'Delete', fr: 'Supprimer', tn: 'فسّخ', tnLatn: 'Fasa5' })}
            variant="danger"
            onPress={() => {
              if (existing) deleteCardio(existing.id);
              setDeleteOpen(false);
              snackbar.show(L({ en: 'Cardio deleted', fr: 'Cardio supprimé', tn: 'الكارديو تفسخ', tnLatn: 'Cardio tfasa5' }));
              router.back();
            }}
            size="lg"
            fill
          />
          <Button label={L({ en: 'Cancel', fr: 'Annuler', tn: 'بطّل', tnLatn: 'Batel' })} variant="outlined" onPress={() => setDeleteOpen(false)} size="lg" fill />
        </View>
      </Sheet>
    </View>
  );
}

const styles = StyleSheet.create({
  dateRow: { flexDirection: 'row', alignItems: 'center', marginHorizontal: -space.md },
  part: { borderRadius: radius.md, padding: space.md, paddingTop: space.sm },
  partHead: { flexDirection: 'row', alignItems: 'center', minHeight: 40 },
  fields: { flexDirection: 'row', gap: space.sm },
  field: { flex: 1, minWidth: 0 },
  summary: {
    flexDirection: 'row',
    gap: space.lg,
    marginTop: space.xl,
    paddingTop: space.lg,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  stat: { flex: 1, gap: 2 },
});
