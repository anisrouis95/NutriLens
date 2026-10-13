import { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Timer } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { useAppData } from '@/contexts/AppDataContext';
import { Button, EmptyState, ProgressLine, RichText, Screen, Section, Txt, useFormat } from '@/components/ds';
import { space } from '@/theme';

function minutesOf(hhmm: string) {
  const [h, m] = hhmm.split(':').map(Number);
  return (h || 0) * 60 + (m || 0);
}

/** Where we are in today's fasting/eating cycle, from the profile schedule. */
function fastingStatus(start: string, end: string, now: Date) {
  const s = minutesOf(start);
  const e = minutesOf(end);
  const n = now.getHours() * 60 + now.getMinutes();
  const fastLength = (e - s + 1440) % 1440 || 1440;
  const sinceStart = (n - s + 1440) % 1440;
  const fasting = sinceStart < fastLength;
  const total = fasting ? fastLength : 1440 - fastLength;
  const elapsed = fasting ? sinceStart : sinceStart - fastLength;
  return { fasting, fastHours: fastLength / 60, elapsed, remaining: total - elapsed, total };
}

export default function FastingScreen() {
  const router = useRouter();
  const fmt = useFormat();
  const { L } = useLanguage();
  const { profile } = useAppData();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 30000);
    return () => clearInterval(timer);
  }, []);

  if (!profile) return null;
  const title = L({ en: 'Intermittent fasting', fr: 'Jeûne intermittent', tn: 'الصيام المتقطّع', tnLatn: 'Jeûne intermittent' });
  const editSchedule = () => router.push({ pathname: '/onboarding', params: { edit: '1' } });

  if (!profile.fasting.enabled) {
    return (
      <Screen back title={title}>
        <EmptyState
          icon={(c) => <Timer size={24} color={c} />}
          title={L({
            en: 'Fasting is off in your plan',
            fr: 'Le jeûne est désactivé dans ton plan',
            tn: 'الصيام مطفي في البرنامج متاعك',
            tnLatn: 'Siyem mtaffi fel programme mte3ek',
          })}
          body={L({
            en: 'You can turn on an eating window in your answers. It is optional: it only helps if it makes your target easier to keep.',
            fr: 'Tu peux activer une fenêtre de repas dans tes réponses. C’est facultatif : ça n’aide que si ça rend ta cible plus facile à tenir.',
            tn: 'تنجّم تشعل وقت للماكلة في الأجوبة متاعك. موش لازم: ما يعاون كان كي يسهّلك تحافظ على الهدف متاعك.',
            tnLatn: 'Tnajjem tcha3el wa9t lel makla fel ajwba mte3ek. Mouch lazem: ma y3awen ken ki ysahhlek t7afedh 3al objectif mte3ek.',
          })}
          action={
            <Button
              variant="tonal"
              label={L({ en: 'Change my schedule', fr: 'Modifier mon rythme', tn: 'بدّل التوقيت متاعي', tnLatn: 'Baddel taw9iti' })}
              onPress={editSchedule}
            />
          }
        />
      </Screen>
    );
  }

  const { startTime, endTime } = profile.fasting;
  const status = fastingStatus(startTime, endTime, now);
  const hours = Math.floor(status.remaining / 60);
  const minutes = String(Math.round(status.remaining % 60)).padStart(2, '0');

  return (
    <Screen back title={title}>
      <View accessible accessibilityLabel={`${status.fasting ? L({ en: 'Fasting', fr: 'Jeûne en cours', tn: 'وقت الصيام', tnLatn: 'Wa9t es-siyem' }) : L({ en: 'Eating window', fr: 'Fenêtre de repas', tn: 'وقت الماكلة', tnLatn: 'Wa9t el makla' })}: ${hours} h ${minutes}`}>
        <Txt variant="label" tone="secondary">
          {status.fasting
            ? L({ en: 'Fasting', fr: 'Jeûne en cours', tn: 'وقت الصيام', tnLatn: 'Wa9t es-siyem' })
            : L({ en: 'Eating window', fr: 'Fenêtre de repas', tn: 'وقت الماكلة', tnLatn: 'Wa9t el makla' })}
        </Txt>
        <Txt variant="numHero">
          {hours}
          <Txt variant="numLarge" tone="tertiary">
            {' h '}
          </Txt>
          {minutes}
        </Txt>
        <Txt variant="body" tone="secondary">
          {status.fasting
            ? L(
                { en: 'left until you eat ({{t}})', fr: 'avant de manger ({{t}})', tn: 'باقين قبل ما تاكل ({{t}})', tnLatn: 'b9aw 9bal ma takel ({{t}})' },
                { t: endTime },
              )
            : L(
                {
                  en: 'left before the fast starts ({{t}})',
                  fr: 'avant le début du jeûne ({{t}})',
                  tn: 'باقين قبل ما يبدا الصيام ({{t}})',
                  tnLatn: 'b9aw 9bal ma yebda es-siyem ({{t}})',
                },
                { t: startTime },
              )}
        </Txt>
      </View>
      <View style={{ marginTop: space.lg }}>
        <ProgressLine value={status.elapsed / status.total} height={8} />
      </View>
      <Txt variant="caption" tone="secondary" style={{ marginTop: space.md }}>
        {L(
          {
            en: 'Your schedule: {{h}} h fast, {{s}} → {{e}}',
            fr: 'Ton rythme : jeûne de {{h}} h, {{s}} → {{e}}',
            tn: 'التوقيت متاعك: صيام {{h}} h، {{s}} → {{e}}',
            tnLatn: 'Taw9itek: siyem {{h}} h, {{s}} → {{e}}',
          },
          { h: fmt(Math.round(status.fastHours * 10) / 10, Number.isInteger(status.fastHours) ? 0 : 1), s: startTime, e: endTime },
        )}
      </Txt>

      <Section
        title={L({ en: 'What fasting really does', fr: 'Ce que le jeûne fait vraiment', tn: 'شنوّة يعمل الصيام بالحق', tnLatn: 'Chnowa ya3mel es-siyem bel 7a9' })}
      >
        <RichText
          text={L({
            en: "Fasting is a way to **organise** your calories, not a way to burn extra fat by itself. In studies, people lose about the same fat with fasting as with a normal diet **at the same calories**.\n\n- It helps if fewer, bigger meals make it easier for you to stay under your target.\n- It does not help if you overeat in the window to “make up” for the fast.\n- Claims about “autophagy at 16 hours” or big growth-hormone boosts come mostly from animal studies or tiny short trials — don't pick fasting for those.\n- Hit your **protein** target in the window, and train near a meal if you can.",
            fr: "Le jeûne est une façon d’**organiser** tes calories, pas un moyen de brûler plus de gras à lui seul. Dans les études, on perd à peu près autant de gras qu’avec un régime classique **à calories égales**.\n\n- Ça aide si des repas moins nombreux mais plus gros te permettent de rester sous ta cible.\n- Ça n’aide pas si tu manges trop dans la fenêtre pour « rattraper » le jeûne.\n- Les promesses d’« autophagie à 16 heures » ou de forte hausse de l’hormone de croissance viennent surtout d’études sur l’animal ou de petits essais courts — ne choisis pas le jeûne pour ça.\n- Atteins ton objectif de **protéines** dans la fenêtre, et entraîne-toi près d’un repas si possible.",
            tn: "الصيام طريقة باش **تنظّم** الكالوري متاعك، موش طريقة تحرق بيها شحم زايد وحدها. في الدراسات، الناس تنقّص تقريب نفس الشحم بالصيام كيما بريجيم عادي **بنفس الكالوري**.\n\n- يعاون كان ماكلات قلال وكبار يسهّلولك تبقى تحت الهدف متاعك.\n- ما يعاونش كان تاكل برشا في وقت الماكلة باش “تعوّض” الصيام.\n- الكلام على “الأوتوفاجي بعد 16 ساعة” ولا هرمون النموّ اللي يطلع برشا جاي أغلبو من دراسات على الحيوانات ولا تجارب صغار وقصار — ما تختارش الصيام على خاطرهم.\n- وصّل لهدف **البروتين** متاعك في وقت الماكلة، وتمرّن قريب من ماكلة كان تنجّم.",
            tnLatn: "Es-siyem tari9a bech **tnadhem** les calories mte3ek, mouch tari9a ta7ra9 biha gras zeyed wa7dha. Fel études, ennes tna99es ta9riban nafs el gras bel siyem kima b régime 3adi **b nafs les calories**.\n\n- Y3awen ken makelet 9lel w kbar ysahhloulek tob9a ta7t l objectif mte3ek.\n- Ma y3awench ken takel barcha f wa9t el makla bech “t3awedh” es-siyem.\n- El kleem 3al “autophagie ba3d 16 se3a” wala hormone de croissance eli yatla3 barcha jey akthrou men études 3al 7ayawanet wala tests s8ar w 9sar — ma te5tarch es-siyem 3la 5aterhom.\n- Wassel l objectif mte3 **protéines** f wa9t el makla, w tmarren 9rib men makla ken tnajjem.",
          })}
        />
        <View style={styles.actions}>
          <Button
            variant="tonal"
            label={L({ en: 'Ramadan mode', fr: 'Mode Ramadan', tn: 'وضع رمضان', tnLatn: 'Mode Romdhan' })}
            onPress={() => router.push('/ramadan')}
          />
          <Button
            variant="tonal"
            label={L({ en: 'Read: Ramadan & fasting', fr: 'Lire : Ramadan et jeûne', tn: 'اقرا: رمضان والصيام', tnLatn: 'A9ra: Romdhan w siyem' })}
            onPress={() => router.push({ pathname: '/learn/[id]', params: { id: 'ramadan-fasting' } })}
          />
          <Button
            variant="outlined"
            label={L({ en: 'Change my schedule', fr: 'Modifier mon rythme', tn: 'بدّل التوقيت متاعي', tnLatn: 'Baddel taw9iti' })}
            onPress={editSchedule}
          />
        </View>
      </Section>
    </Screen>
  );
}

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', flexWrap: 'wrap', gap: space.sm, marginTop: space.xl },
});
