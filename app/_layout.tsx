import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useFonts } from 'expo-font';
import {
  DarkTheme,
  Stack,
  ThemeProvider as NavigationThemeProvider,
  useRouter,
  useSegments,
} from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import * as SystemUI from 'expo-system-ui';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useMemo } from 'react';
import { Platform } from 'react-native';

import { LanguageProvider } from '@/contexts/LanguageContext';
import { AppDataProvider, useAppData } from '@/contexts/AppDataContext';
import { SnackbarProvider } from '@/components/ds';
import { fontAssets, useTokens } from '@/theme';
import { useAutoBackup } from '@/hooks/useAutoBackup';
import { useCloudBackup } from '@/hooks/useGoogleSync';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

// Web-preview-only noise from react-native-body-highlighter on react-native-svg:
// `accessible` on SVG nodes and responder handlers on its pressable paths. Both
// are correct on Android; LogBox.ignoreLogs is a no-op on web, so filter here.
if (Platform.OS === 'web' && __DEV__) {
  const consoleError = console.error;
  console.error = (...args: unknown[]) => {
    const message = typeof args[0] === 'string' ? args[0] : '';
    const svgNoise =
      (message.includes('for a non-boolean attribute') && args.includes('accessible')) ||
      (message.startsWith('Unknown event handler property') && String(args[1]).includes('Responder'));
    if (!svgNoise) consoleError(...args);
  };
}

function RootLayoutNav() {
  const t = useTokens();
  const { ready, profile } = useAppData();
  const segments = useSegments();
  const router = useRouter();
  // Writes the backup file whenever data changes (once a folder is chosen in Settings),
  // and uploads to the linked Google account.
  useAutoBackup();
  useCloudBackup();

  // Paint the window behind every screen in the theme's ground (no white flash).
  useEffect(() => {
    SystemUI.setBackgroundColorAsync(t.ground);
  }, [t.ground]);

  // First launch (or after a reset): send the user to the questionnaire.
  useEffect(() => {
    if (!ready) return;
    const inOnboarding = segments[0] === 'onboarding';
    if (!profile && !inOnboarding) router.replace('/onboarding');
  }, [ready, profile, segments, router]);

  useEffect(() => {
    if (ready) SplashScreen.hideAsync();
  }, [ready]);

  const navTheme = useMemo(() => {
    const base = DarkTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: t.accent,
        background: t.ground,
        card: t.surfaceLow,
        text: t.text,
        border: t.hairline,
        notification: t.danger,
      },
    };
  }, [t]);

  if (!ready) return null;

  return (
    <NavigationThemeProvider value={navTheme}>
      <StatusBar style="light" />
      <SnackbarProvider>
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: t.ground } }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="onboarding" options={{ gestureEnabled: false, animation: 'fade' }} />
          <Stack.Screen name="plan" />
          <Stack.Screen name="scan" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="progress" />
          <Stack.Screen name="profile" />
          <Stack.Screen name="settings" />
          <Stack.Screen name="fasting" />
          <Stack.Screen name="library" />
          <Stack.Screen name="exercise/[id]" />
          <Stack.Screen name="workout/[dayId]" options={{ gestureEnabled: false }} />
          <Stack.Screen name="learn/[id]" />
          <Stack.Screen name="coach" />
          <Stack.Screen name="activity" />
          <Stack.Screen name="cardio" options={{ animation: 'slide_from_bottom' }} />
          <Stack.Screen name="ramadan" />
        </Stack>
      </SnackbarProvider>
    </NavigationThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded, error] = useFonts({
    ...fontAssets,
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  if (!loaded) {
    return null;
  }

  return (
    <LanguageProvider>
      <AppDataProvider>
        <RootLayoutNav />
      </AppDataProvider>
    </LanguageProvider>
  );
}
