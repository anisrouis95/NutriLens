import { Stack, useRouter } from 'expo-router';
import { Compass } from 'lucide-react-native';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button, EmptyState, Screen } from '@/components/ds';

export default function NotFoundScreen() {
  const router = useRouter();
  const { L } = useLanguage();
  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <Screen back largeTitle={false}>
        <EmptyState
          icon={(c) => <Compass size={32} color={c} />}
          title={L({ en: 'This page doesn’t exist', fr: 'Cette page n’existe pas' })}
          body={L({ en: 'The link may be old. Head back to today.', fr: 'Le lien est peut-être ancien. Reviens à aujourd’hui.' })}
          action={<Button label={L({ en: 'Go to Today', fr: 'Aller à Aujourd’hui' })} onPress={() => router.replace('/(tabs)')} />}
        />
      </Screen>
    </>
  );
}
