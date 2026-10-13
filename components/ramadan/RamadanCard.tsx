// Today's Ramadan card: the countdown that frames a fasting day (to iftar
// while fasting, to the end of suhoor at night), how far through the fast the
// day is, and when to train. Outside Ramadan, a short heads-up in the weeks
// before it. Opens the Ramadan screen.

import { StyleSheet, View, type StyleProp, type ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight, Dumbbell, Droplets, MoonStar, Utensils } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { DirIcon, ProgressLine, Tap, Txt } from '@/components/ds';
import { useRamadan } from '@/hooks/useRamadan';
import { radius, space, useTokens } from '@/theme';

/** Days before Ramadan that Today starts showing it. */
const HEADS_UP_DAYS = 21;

export function hoursMinutes(ms: number) {
  const total = Math.max(0, Math.round(ms / 60000));
  return { h: Math.floor(total / 60), m: String(total % 60).padStart(2, '0') };
}

export default function RamadanCard({ style }: { style?: StyleProp<ViewStyle> }) {
  const t = useTokens();
  const router = useRouter();
  const { L, formatTime } = useLanguage();
  const r = useRamadan();
  const open = () => router.push('/ramadan');

  if (!r.fasting) {
    if (r.settings.mode !== 'auto' || !r.next || r.next.daysUntil > HEADS_UP_DAYS) return null;
    const title =
      r.next.daysUntil === 1
        ? L({ en: 'Ramadan starts tomorrow', fr: 'Le Ramadan commence demain', tn: 'رمضان يبدا غدوة', tnLatn: 'Romdhan yebda 8odwa' })
        : L(
            { en: 'Ramadan in {{n}} days', fr: 'Ramadan dans {{n}} jours', tn: 'رمضان بعد {{n}} يوم', tnLatn: 'Romdhan ba3d {{n}} youm' },
            { n: r.next.daysUntil },
          );
    return (
      <Tap onPress={open} pressScale={0.99} style={[styles.card, styles.row, { backgroundColor: t.surface }, style]} accessibilityLabel={title}>
        <MoonStar size={22} color={t.accentText} />
        <View style={{ flex: 1 }}>
          <Txt variant="bodyStrong">{title}</Txt>
          <Txt variant="caption" tone="secondary" style={{ marginTop: 2 }}>
            {L({
              en: 'Set your governorate for iftar and suhoor times',
              fr: 'Choisis ton gouvernorat pour les horaires de l’iftar et du s’hour',
              tn: 'اختار ولايتك باش تشوف أوقات الفطور و السحور',
              tnLatn: '5tar wileytek bech tchouf aw9at el ftour w es-s7our',
            })}
          </Txt>
        </View>
        <DirIcon icon={ChevronRight} size={20} color={t.textTertiary} />
      </Tap>
    );
  }

  const { state, day, tomorrow, windows, now } = r;
  const left = hoursMinutes(state.until.getTime() - now.getTime());
  const overline = r.period
    ? L({ en: 'Ramadan · day {{n}}', fr: 'Ramadan · jour {{n}}', tn: 'رمضان · النهار {{n}}', tnLatn: 'Romdhan · nhar {{n}}' }, { n: r.period.day })
    : L({ en: 'Fasting today', fr: 'Jeûne aujourd’hui', tn: 'صايم اليوم', tnLatn: 'Sayem lyoum' });

  const label =
    state.phase === 'fasting'
      ? L({ en: 'until iftar · {{t}}', fr: 'avant l’iftar · {{t}}', tn: 'على الفطور · {{t}}', tnLatn: '3al ftour · {{t}}' }, { t: formatTime(day.maghrib) })
      : state.phase === 'suhoor'
        ? L({ en: 'left for suhoor · ends {{t}}', fr: 'pour le s’hour · fin à {{t}}', tn: 'للسحور · يوفى {{t}}', tnLatn: 'lel s7our · youfa {{t}}' }, { t: formatTime(day.fajr) })
        : L(
            { en: 'to eat and drink · suhoor ends {{t}}', fr: 'pour manger et boire · fin du s’hour {{t}}', tn: 'باش تاكل و تشرب · السحور يوفى {{t}}', tnLatn: 'bech takel w tochrob · s7our youfa {{t}}' },
            { t: formatTime(tomorrow.fajr) },
          );

  // One line of guidance for this moment of the day.
  const beforeTraining = now.getTime() < windows.afterIftar.getTime();
  const hint =
    state.phase === 'suhoor'
      ? {
          icon: Utensils,
          text: L({ en: 'Suhoor: water, protein and slow carbs', fr: 'S’hour : eau, protéines et glucides lents', tn: 'السحور: ماء، بروتين و نشويات بطيئة', tnLatn: 'S7our: mé, protéines w glucides lents' }),
        }
      : beforeTraining
        ? {
            icon: Dumbbell,
            text: L(
              { en: 'Train after iftar · from {{t}}', fr: 'Entraîne-toi après l’iftar · dès {{t}}', tn: 'تمرّن بعد الفطور · من {{t}}', tnLatn: 'Tmarren ba3d el ftour · men {{t}}' },
              { t: formatTime(windows.afterIftar) },
            ),
          }
        : {
            icon: Droplets,
            text: L({ en: 'A glass of water every hour until suhoor', fr: 'Un verre d’eau par heure jusqu’au s’hour', tn: 'كاس ماء كل ساعة حتى للسحور', tnLatn: 'Kes mé kol sa3a 7atta lel s7our' }),
          };
  const HintIcon = hint.icon;

  return (
    <Tap
      onPress={open}
      pressScale={0.99}
      style={[styles.card, { backgroundColor: t.surface }, style]}
      accessibilityLabel={`${overline}. ${left.h} h ${left.m} ${label}. ${hint.text}`}
    >
      <View style={styles.row}>
        <MoonStar size={16} color={t.accentText} />
        <Txt variant="overline" tone="accent" style={{ flex: 1 }} numberOfLines={1}>
          {overline}
        </Txt>
        <Txt variant="caption" tone="tertiary" numberOfLines={1}>
          {L(r.city.name)}
        </Txt>
        <DirIcon icon={ChevronRight} size={18} color={t.textTertiary} />
      </View>
      <View style={styles.countdown}>
        <Txt variant="numLarge" style={styles.big}>
          {left.h}
          <Txt variant="numMedium" tone="tertiary">
            {' h '}
          </Txt>
          {left.m}
        </Txt>
        <Txt variant="label" tone="secondary" style={{ flex: 1 }} numberOfLines={2}>
          {label}
        </Txt>
      </View>
      {state.phase === 'fasting' ? <ProgressLine value={state.progress} height={4} /> : null}
      <View style={[styles.row, { marginTop: space.md }]}>
        <HintIcon size={16} color={t.textSecondary} />
        <Txt variant="caption" tone="secondary" style={{ flex: 1 }} numberOfLines={2}>
          {hint.text}
        </Txt>
      </View>
    </Tap>
  );
}

const styles = StyleSheet.create({
  card: { borderRadius: radius.lg, padding: space.lg },
  row: { flexDirection: 'row', alignItems: 'center', gap: space.sm },
  countdown: { flexDirection: 'row', alignItems: 'baseline', gap: space.md, marginTop: space.sm, marginBottom: space.md },
  big: { fontSize: 44, lineHeight: 50 },
});
