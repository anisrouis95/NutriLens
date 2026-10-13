// Train tab, fasting days only: when to train (after iftar) and whether the
// sessions are trimmed. Opens the Ramadan screen.

import { type StyleProp, type ViewStyle } from 'react-native';
import { useRouter } from 'expo-router';
import { MoonStar } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { Group, ListItem } from '@/components/ds';
import { useRamadan } from '@/hooks/useRamadan';

export default function RamadanTrainingHint({ style }: { style?: StyleProp<ViewStyle> }) {
  const router = useRouter();
  const { L, formatTime } = useLanguage();
  const r = useRamadan();
  if (!r.fasting) return null;
  const from = formatTime(r.windows.afterIftar);
  return (
    <Group style={style}>
      <ListItem
        title={L({
          en: 'Fasting today: train after iftar',
          fr: 'Jeûne aujourd’hui : entraîne-toi après l’iftar',
          tn: 'صايم اليوم: تمرّن بعد الفطور',
          tnLatn: 'Sayem lyoum: tmarren ba3d el ftour',
        })}
        supporting={
          r.settings.lighter
            ? L(
                { en: 'From {{t}} · one set fewer per exercise', fr: 'Dès {{t}} · une série de moins par exercice', tn: 'من {{t}} · سيري أقل في كل تمرين', tnLatn: 'Men {{t}} · série a9al f kol exercice' },
                { t: from },
              )
            : L(
                { en: 'From {{t}}, about 90 minutes after iftar', fr: 'Dès {{t}}, environ 90 minutes après l’iftar', tn: 'من {{t}}، قريب 90 دقيقة بعد الفطور', tnLatn: 'Men {{t}}, 9rib 90 minutes ba3d el ftour' },
                { t: from },
              )
        }
        leading={(c) => <MoonStar size={22} color={c} />}
        onPress={() => router.push('/ramadan')}
        chevron
      />
    </Group>
  );
}
