// Ramadan: today's fast for the user's governorate (live countdown), the
// month's timetable (imsakiya), the settings that drive Ramadan mode across
// the app, and how to train while fasting.

import { useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { MapPin } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppData } from '@/contexts/AppDataContext';
import {
  Button,
  Chip,
  ChipRow,
  Divider,
  Group,
  ListItem,
  ProgressLine,
  RichText,
  Screen,
  Section,
  Segmented,
  Sheet,
  Toggle,
  Txt,
  useFormat,
} from '@/components/ds';
import { hoursMinutes } from '@/components/ramadan/RamadanCard';
import { useRamadan } from '@/hooks/useRamadan';
import { fastDay, GOVERNORATES, RAMADAN_MODE_NAME, ramadanOn, shiftDate, type RamadanMode } from '@/lib/ramadan';
import type { LocalizedText } from '@/lib/i18n';
import { radius, space, useTokens } from '@/theme';

const MODE_HELP: Record<RamadanMode, LocalizedText> = {
  auto: {
    en: 'On during Ramadan’s dates, off the rest of the year.',
    fr: 'Activé pendant les dates du Ramadan, désactivé le reste de l’année.',
    tn: 'يتحلّ وحدو في أيام رمضان و يتسكّر في بقية العام.',
    tnLatn: 'Yet7all wa7dou f iyem Romdhan w yetsakker f ba9iyet el 3am.',
  },
  on: {
    en: 'Every day is a fasting day: for making up days or voluntary fasts.',
    fr: 'Chaque jour est un jour de jeûne : pour rattraper des jours ou un jeûne volontaire.',
    tn: 'كل نهار يتحسب نهار صيام: باش تقضي أيامك ولا صيام تطوّع.',
    tnLatn: 'Kol nhar yet7seb nhar siyem: bech te9dhi iyemek walla siyem tatawo3.',
  },
  off: {
    en: 'No fasting days and no prayer times in the app.',
    fr: 'Aucun jour de jeûne ni horaire dans l’app.',
    tn: 'حتى نهار صيام و حتى أوقات في التطبيق.',
    tnLatn: '7atta nhar siyem w 7atta aw9at fel app.',
  },
};

export default function RamadanScreen() {
  const t = useTokens();
  const router = useRouter();
  const fmt = useFormat();
  const { L, formatDate, formatTime } = useLanguage();
  const { today, plan } = useAppData();
  const r = useRamadan();
  const { settings, update, state, day, tomorrow, windows, now } = r;
  const [cityOpen, setCityOpen] = useState(false);

  // The timetable: this Ramadan, else the coming one, else (mode "always") the next two weeks.
  const table = useMemo(() => {
    const period = r.period ?? (r.next ? ramadanOn(r.next.start, settings.shiftDays) : null);
    const start = settings.mode === 'on' && !r.period ? today : period?.start;
    const length = settings.mode === 'on' && !r.period ? 14 : (period?.length ?? 0);
    if (!start || settings.mode === 'off') return null;
    return Array.from({ length }, (_, i) => {
      const date = shiftDate(start, i);
      return { n: i + 1, ...fastDay(date, settings.city) };
    });
  }, [r.period, r.next, settings.mode, settings.shiftDays, settings.city, today]);

  // The calendar's start (before the user's shift), named in the shift help.
  const calcStart = r.period ? shiftDate(r.period.start, -settings.shiftDays) : r.next ? shiftDate(r.next.start, -settings.shiftDays) : null;
  const calendarFastingDay = settings.mode === 'on' || (settings.mode === 'auto' && !!r.period);
  const left = hoursMinutes(state.until.getTime() - now.getTime());
  const waterL = fmt((plan?.waterMl ?? 2500) / 1000, 1);

  const overline = r.period
    ? L({ en: 'Ramadan · day {{n}}', fr: 'Ramadan · jour {{n}}', tn: 'رمضان · النهار {{n}}', tnLatn: 'Romdhan · nhar {{n}}' }, { n: r.period.day })
    : L({ en: 'Fasting today', fr: 'Jeûne aujourd’hui', tn: 'صايم اليوم', tnLatn: 'Sayem lyoum' });

  const hero = (() => {
    if (r.fasting) {
      const label =
        state.phase === 'fasting'
          ? L({ en: 'until iftar · {{t}}', fr: 'avant l’iftar · {{t}}', tn: 'على الفطور · {{t}}', tnLatn: '3al ftour · {{t}}' }, { t: formatTime(day.maghrib) })
          : state.phase === 'suhoor'
            ? L({ en: 'left for suhoor · ends {{t}}', fr: 'pour le s’hour · fin à {{t}}', tn: 'للسحور · يوفى {{t}}', tnLatn: 'lel s7our · youfa {{t}}' }, { t: formatTime(day.fajr) })
            : L(
                { en: 'to eat and drink · suhoor ends {{t}}', fr: 'pour manger et boire · fin du s’hour {{t}}', tn: 'باش تاكل و تشرب · السحور يوفى {{t}}', tnLatn: 'bech takel w tochrob · s7our youfa {{t}}' },
                { t: formatTime(tomorrow.fajr) },
              );
      const justBroke = state.phase === 'iftar' && now.getTime() < day.maghrib.getTime() + 2 * 3600000;
      return (
        <View accessible accessibilityLabel={`${overline}. ${left.h} h ${left.m} ${label}`}>
          <Txt variant="overline" tone="accent">
            {overline}
          </Txt>
          {justBroke ? (
            <Txt variant="title" style={{ marginTop: space.sm }}>
              {L({ en: 'Enjoy your iftar', fr: 'Saha ftourek', tn: 'صحّة فطورك', tnLatn: 'Sa77a ftourek' })}
            </Txt>
          ) : null}
          <Txt variant="numHero" style={{ marginTop: space.xs }}>
            {left.h}
            <Txt variant="numLarge" tone="tertiary">
              {' h '}
            </Txt>
            {left.m}
          </Txt>
          <Txt variant="body" tone="secondary">
            {label}
          </Txt>
          {state.phase === 'fasting' ? (
            <View style={{ marginTop: space.lg }}>
              <ProgressLine value={state.progress} height={8} />
            </View>
          ) : null}
        </View>
      );
    }
    if (calendarFastingDay && r.skippedToday) {
      return (
        <View>
          <Txt variant="overline" tone="accent">
            {overline}
          </Txt>
          <Txt variant="headline" style={{ marginTop: space.sm }}>
            {L({ en: 'Not fasting today', fr: 'Pas de jeûne aujourd’hui', tn: 'موش صايم اليوم', tnLatn: 'Moch sayem lyoum' })}
          </Txt>
          <Txt tone="secondary" style={{ marginTop: space.xs }}>
            {L({
              en: 'Meals and sessions are back to normal for today.',
              fr: 'Repas et séances redeviennent normaux pour aujourd’hui.',
              tn: 'الماكلة و الحصص رجعو عاديين اليوم.',
              tnLatn: 'El makla w les séances rja3ou 3adiyin lyoum.',
            })}
          </Txt>
        </View>
      );
    }
    if (settings.mode === 'auto' && r.next) {
      return (
        <View>
          <Txt variant="overline" tone="accent">
            {L({ en: 'Next Ramadan', fr: 'Prochain Ramadan', tn: 'رمضان الجاي', tnLatn: 'Romdhan ejjey' })}
          </Txt>
          <Txt variant="numHero" style={{ marginTop: space.xs }}>
            {r.next.daysUntil}
          </Txt>
          <Txt variant="body" tone="secondary">
            {L(
              { en: 'days to go · from {{date}}', fr: 'jours · à partir du {{date}}', tn: 'يوم · من {{date}}', tnLatn: 'youm · men {{date}}' },
              { date: formatDate(new Date(r.next.start + 'T12:00:00'), { weekday: 'long', day: 'numeric', month: 'long' }) },
            )}
          </Txt>
        </View>
      );
    }
    return (
      <View>
        <Txt variant="headline">
          {L({ en: 'Ramadan mode is off', fr: 'Le mode Ramadan est désactivé', tn: 'وضع رمضان مسكّر', tnLatn: 'Mode Romdhan msakker' })}
        </Txt>
        <Txt tone="secondary" style={{ marginTop: space.xs }}>
          {L({
            en: 'Turn it on below for iftar and suhoor times, Ramadan meals and lighter sessions.',
            fr: 'Active-le plus bas pour les horaires de l’iftar et du s’hour, les repas du Ramadan et des séances allégées.',
            tn: 'حلّو لوطة باش تشوف أوقات الفطور و السحور، ماكلة رمضان و حصص أخفّ.',
            tnLatn: '7allou louta bech tchouf aw9at el ftour w es-s7our, makla mta3 Romdhan w séances a5af.',
          })}
        </Txt>
      </View>
    );
  })();

  const skipToday = (skip: boolean) => {
    const rest = (settings.skipDates ?? []).filter((d) => d !== today && d >= shiftDate(today, -40));
    update({ skipDates: skip ? [...rest, today] : rest });
  };

  return (
    <Screen back title={L({ en: 'Ramadan', fr: 'Ramadan', tn: 'رمضان', tnLatn: 'Romdhan' })}>
      {hero}

      {settings.mode !== 'off' ? (
        <>
          <View style={styles.times}>
            {[
              { label: L({ en: 'Suhoor ends', fr: 'Fin du s’hour', tn: 'السحور يوفى', tnLatn: 'S7our youfa' }), time: day.fajr },
              { label: L({ en: 'Iftar', fr: 'Iftar', tn: 'الفطور', tnLatn: 'Ftour' }), time: day.maghrib },
            ].map((x) => (
              <View key={x.label} style={[styles.time, { backgroundColor: t.surface }]}>
                <Txt variant="overline" tone="secondary">
                  {x.label}
                </Txt>
                <Txt variant="numLarge" style={{ marginTop: space.xs }}>
                  {formatTime(x.time)}
                </Txt>
              </View>
            ))}
          </View>
          <Txt variant="caption" tone="tertiary" style={{ marginTop: space.sm }}>
            {L(
              {
                en: 'Today in {{city}}, from the sun’s position (dawn at 18°). Your mosque’s timetable can differ by a few minutes: follow the adhan.',
                fr: 'Aujourd’hui à {{city}}, d’après la position du soleil (aube à 18°). Le calendrier de ta mosquée peut différer de quelques minutes : suis l’adhan.',
                tn: 'اليوم في {{city}}، محسوبين على حساب الشمس (الفجر على 18°). أوقات الجامع تنجّم تختلف بدقايق: اتّبع الأذان.',
                tnLatn: 'Lyoum f {{city}}, m7soubin 3la 7seb echems (el fjer 3la 18°). Aw9at ejjem3 tnajjem tekhtlef b d9aye9: tba3 el adhen.',
              },
              { city: L(r.city.name) },
            )}
          </Txt>
        </>
      ) : null}

      <Section title={L({ en: 'Ramadan mode', fr: 'Mode Ramadan', tn: 'وضع رمضان', tnLatn: 'Mode Romdhan' })}>
        <Segmented<RamadanMode>
          value={settings.mode}
          onChange={(mode) => update({ mode })}
          options={(['auto', 'on', 'off'] as const).map((m) => ({ value: m, label: L(RAMADAN_MODE_NAME[m]) }))}
        />
        <Txt variant="caption" tone="secondary" style={{ marginTop: space.sm }}>
          {L(MODE_HELP[settings.mode])}
        </Txt>

        {settings.mode !== 'off' ? (
          <>
            <Group style={{ marginTop: space.lg }}>
              <ListItem
                title={L({ en: 'Governorate', fr: 'Gouvernorat', tn: 'الولاية', tnLatn: 'Wileya' })}
                supporting={L(r.city.name)}
                leading={(c) => <MapPin size={22} color={c} />}
                onPress={() => setCityOpen(true)}
                chevron
              />
            </Group>

            <View style={styles.toggleRow}>
              <View style={{ flex: 1 }}>
                <Txt variant="bodyStrong">{L({ en: 'Lighter sessions', fr: 'Séances allégées', tn: 'حصص أخفّ', tnLatn: 'Séances a5af' })}</Txt>
                <Txt variant="caption" tone="secondary" style={{ marginTop: 2 }}>
                  {L({
                    en: 'One set fewer per exercise on fasting days. Keep the weights heavy to hold your strength.',
                    fr: 'Une série de moins par exercice les jours de jeûne. Garde des charges lourdes pour garder ta force.',
                    tn: 'سيري أقل في كل تمرين في أيام الصيام. خلّي الثقل كيما هو باش تحافظ على قوّتك.',
                    tnLatn: 'Série a9al f kol exercice f iyem siyem. 5alli el charge kima hiya bech t7afedh 3la 9owtek.',
                  })}
                </Txt>
              </View>
              <Toggle
                value={settings.lighter}
                onChange={(lighter) => update({ lighter })}
                label={L({ en: 'Lighter sessions', fr: 'Séances allégées', tn: 'حصص أخفّ', tnLatn: 'Séances a5af' })}
              />
            </View>

            {calendarFastingDay ? (
              <View style={styles.toggleRow}>
                <View style={{ flex: 1 }}>
                  <Txt variant="bodyStrong">{L({ en: 'Not fasting today', fr: 'Pas de jeûne aujourd’hui', tn: 'موش صايم اليوم', tnLatn: 'Moch sayem lyoum' })}</Txt>
                  <Txt variant="caption" tone="secondary" style={{ marginTop: 2 }}>
                    {L({
                      en: 'Travel, illness or period: today goes back to normal meals and sessions.',
                      fr: 'Voyage, maladie ou règles : aujourd’hui repasse en repas et séances normaux.',
                      tn: 'سفر، مرض ولا العادة: اليوم يرجع ماكلة و حصص عاديين.',
                      tnLatn: 'Safer, mardh walla el 3ada: lyoum yarja3 makla w séances 3adiyin.',
                    })}
                  </Txt>
                </View>
                <Toggle
                  value={r.skippedToday}
                  onChange={skipToday}
                  label={L({ en: 'Not fasting today', fr: 'Pas de jeûne aujourd’hui', tn: 'موش صايم اليوم', tnLatn: 'Moch sayem lyoum' })}
                />
              </View>
            ) : null}

            {settings.mode === 'auto' && calcStart ? (
              <View style={{ marginTop: space.xl }}>
                <Txt variant="bodyStrong">{L({ en: 'Start of Ramadan', fr: 'Début du Ramadan', tn: 'بداية رمضان', tnLatn: 'Bidayet Romdhan' })}</Txt>
                <Txt variant="caption" tone="secondary" style={{ marginTop: 2, marginBottom: space.md }}>
                  {L(
                    {
                      en: 'Tunisia starts Ramadan by moon sighting. If it began a day before or after {{date}}, move it here.',
                      fr: 'La Tunisie commence le Ramadan selon l’observation de la lune. S’il a commencé un jour avant ou après le {{date}}, décale-le ici.',
                      tn: 'تونس تبدا رمضان برؤية الهلال. كان بدا نهار قبل ولا بعد {{date}}، بدّلو هوني.',
                      tnLatn: 'Tounes tebda Romdhan b rouyet el hlel. Ken bda nhar 9bal walla ba3d {{date}}, baddlou houni.',
                    },
                    { date: formatDate(new Date(calcStart + 'T12:00:00'), { day: 'numeric', month: 'long' }) },
                  )}
                </Txt>
                <Segmented<string>
                  value={String(settings.shiftDays)}
                  onChange={(v) => update({ shiftDays: Number(v) })}
                  options={[
                    { value: '-1', label: L({ en: 'Day earlier', fr: 'Un jour avant', tn: 'نهار قبل', tnLatn: 'Nhar 9bal' }) },
                    { value: '0', label: L({ en: 'Calendar', fr: 'Calendrier', tn: 'الروزنامة', tnLatn: 'Calendrier' }) },
                    { value: '1', label: L({ en: 'Day later', fr: 'Un jour après', tn: 'نهار بعد', tnLatn: 'Nhar ba3d' }) },
                  ]}
                />
              </View>
            ) : null}
          </>
        ) : null}
      </Section>

      {settings.mode !== 'off' ? (
        <Section title={L({ en: 'Training while fasting', fr: 'S’entraîner en jeûnant', tn: 'التمرين و إنت صايم', tnLatn: 'Tmarrin w enti sayem' })}>
          <RichText
            text={[
              L(
                {
                  en: '- **After iftar, the best time:** from {{t}}. Eat, wait about 90 minutes, then train as usual.',
                  fr: '- **Après l’iftar, le meilleur moment :** dès {{t}}. Mange, attends environ 90 minutes, puis entraîne-toi normalement.',
                  tn: '- **بعد الفطور، أحسن وقت:** من {{t}}. كول، استنّى قريب 90 دقيقة، و من بعد تمرّن عادي.',
                  tnLatn: '- **Ba3d el ftour, a7sen wa9t:** men {{t}}. Kol, estanna 9rib 90 minutes, w ba3d tmarren 3adi.',
                },
                { t: formatTime(windows.afterIftar) },
              ),
              L(
                {
                  en: '- **Before iftar:** around {{t}}. Short (45 min max) and moderate, no hard cardio; eat right after.',
                  fr: '- **Avant l’iftar :** vers {{t}}. Court (45 min max) et modéré, pas de cardio intense ; mange juste après.',
                  tn: '- **قبل الفطور:** حوالي {{t}}. حصّة قصيرة (45 min على الأكثر) و متوسّطة، بلاش كارديو صعيب، و كول طول بعدها.',
                  tnLatn: '- **9bal el ftour:** 7awali {{t}}. Séance 9sira (45 min max) w moyenne, blech cardio s3ib, w kol toul ba3dha.',
                },
                { t: formatTime(windows.beforeIftar) },
              ),
              L(
                {
                  en: '- **Water:** {{l}} L between iftar and suhoor: 2 glasses at iftar, then one every hour.',
                  fr: '- **L’eau :** {{l}} L entre l’iftar et le s’hour : 2 verres à l’iftar, puis un chaque heure.',
                  tn: '- **الماء:** {{l}} L بين الفطور و السحور: زوز كيسان في الفطور، و من بعد كاس كل ساعة.',
                  tnLatn: '- **El mé:** {{l}} L bin el ftour w es-s7our: zouz kisen fel ftour, w ba3d kes kol sa3a.',
                },
                { l: waterL },
              ),
              L({
                en: '- Dizzy or unwell while fasting? Stop the session. Diabetes, a health condition or pregnancy: ask your doctor before fasting.',
                fr: '- Des vertiges ou un malaise en jeûnant ? Arrête la séance. Diabète, problème de santé ou grossesse : demande à ton médecin avant de jeûner.',
                tn: '- كان دوّخت ولا حسّيت روحك موش لاباس و إنت صايم، وقّف الحصّة. سكّر، مرض ولا حمل: شاور طبيبك قبل ما تصوم.',
                tnLatn: '- Ken dawwa5t walla 7assit rou7ek moch labes w enti sayem, wa99ef es-séance. Sokkor, mardh walla 7ml: chawer tbibek 9bal ma tsoum.',
              }),
            ].join('\n')}
          />
          <Button
            variant="tonal"
            label={L({ en: 'Read: Ramadan & fasting', fr: 'Lire : Ramadan et jeûne', tn: 'اقرا: رمضان و الصيام', tnLatn: 'A9ra: Romdhan w siyem' })}
            onPress={() => router.push({ pathname: '/learn/[id]', params: { id: 'ramadan-fasting' } })}
            style={{ marginTop: space.xl, alignSelf: 'flex-start' }}
          />
        </Section>
      ) : null}

      {table ? (
        <Section
          title={
            settings.mode === 'on' && !r.period
              ? L({ en: 'Next 14 days', fr: 'Les 14 prochains jours', tn: 'الـ 14 يوم الجايين', tnLatn: 'El 14 youm ejjeyin' })
              : L({ en: 'Imsakiya', fr: 'Imsakia', tn: 'الإمساكية', tnLatn: 'Imsakia' })
          }
        >
          <Group>
            <View style={[styles.tableRow, styles.tableHead]}>
              <Txt variant="overline" tone="tertiary" style={styles.colDay}>
                {L({ en: 'Day', fr: 'Jour', tn: 'النهار', tnLatn: 'Nhar' })}
              </Txt>
              <Txt variant="overline" tone="tertiary" style={styles.colTime}>
                {L({ en: 'Fajr', fr: 'Fajr', tn: 'الفجر', tnLatn: 'Fjer' })}
              </Txt>
              <Txt variant="overline" tone="tertiary" style={styles.colTime}>
                {L({ en: 'Iftar', fr: 'Iftar', tn: 'المغرب', tnLatn: 'Maghreb' })}
              </Txt>
            </View>
            {table.map((row) => {
              const isToday = row.date === today;
              return (
                <View key={row.date}>
                  <Divider />
                  <View style={[styles.tableRow, isToday && { backgroundColor: t.surfaceHigh }]}>
                    <View style={[styles.colDay, styles.dayCell]}>
                      <Txt variant="numMedium" color={isToday ? t.accentText : t.textTertiary} style={styles.dayNum}>
                        {row.n}
                      </Txt>
                      <Txt variant={isToday ? 'bodyStrong' : 'body'} numberOfLines={1} style={{ flexShrink: 1 }}>
                        {formatDate(new Date(row.date + 'T12:00:00'), { weekday: 'short', day: 'numeric', month: 'short' })}
                      </Txt>
                    </View>
                    <Txt variant="numMedium" tone={isToday ? 'primary' : 'secondary'} style={styles.colTime} numberOfLines={1}>
                      {formatTime(row.fajr)}
                    </Txt>
                    <Txt variant="numMedium" tone={isToday ? 'primary' : 'secondary'} style={styles.colTime} numberOfLines={1}>
                      {formatTime(row.maghrib)}
                    </Txt>
                  </View>
                </View>
              );
            })}
          </Group>
        </Section>
      ) : null}

      <Sheet visible={cityOpen} onClose={() => setCityOpen(false)} title={L({ en: 'Your governorate', fr: 'Ton gouvernorat', tn: 'ولايتك', tnLatn: 'Wileytek' })}>
        <ChipRow>
          {GOVERNORATES.map((g) => (
            <Chip
              key={g.id}
              label={L(g.name)}
              selected={g.id === settings.city}
              onPress={() => {
                update({ city: g.id });
                setCityOpen(false);
              }}
            />
          ))}
        </ChipRow>
      </Sheet>
    </Screen>
  );
}

const styles = StyleSheet.create({
  times: { flexDirection: 'row', gap: space.sm, marginTop: space.xl },
  time: { flex: 1, borderRadius: radius.md, padding: space.lg },
  toggleRow: { flexDirection: 'row', alignItems: 'center', gap: space.lg, marginTop: space.xl },
  tableRow: { flexDirection: 'row', alignItems: 'center', gap: space.sm, paddingHorizontal: space.lg, minHeight: 48 },
  tableHead: { minHeight: 40 },
  colDay: { flex: 1, minWidth: 0 },
  dayCell: { flexDirection: 'row', alignItems: 'center', gap: space.md },
  dayNum: { width: 22 },
  colTime: { width: 80, textAlign: 'right' },
});
