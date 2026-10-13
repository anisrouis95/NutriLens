import { palette, type Palette } from './tokens';

export * from './tokens';

/** The Kinetic Black palette (one dark world). Kept as a hook so screens never import raw values. */
export function useTokens(): Palette {
  return palette;
}

// Each weight is imported from its own subpath so only these files ship.
export const fontAssets = {
  'Inter-Regular': require('@expo-google-fonts/inter/400Regular/Inter_400Regular.ttf'),
  'Inter-Medium': require('@expo-google-fonts/inter/500Medium/Inter_500Medium.ttf'),
  'Inter-SemiBold': require('@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.ttf'),
  'Inter-Bold': require('@expo-google-fonts/inter/700Bold/Inter_700Bold.ttf'),
  'Inter-ExtraBold': require('@expo-google-fonts/inter/800ExtraBold/Inter_800ExtraBold.ttf'),
  Anton: require('@expo-google-fonts/anton/400Regular/Anton_400Regular.ttf'),
  // Arabic letters (Darija in Arabic script); see arabicFonts in tokens.
  'Changa-ExtraBold': require('@expo-google-fonts/changa/800ExtraBold/Changa_800ExtraBold.ttf'),
  'PlexArabic-Regular': require('@expo-google-fonts/ibm-plex-sans-arabic/400Regular/IBMPlexSansArabic_400Regular.ttf'),
  'PlexArabic-Medium': require('@expo-google-fonts/ibm-plex-sans-arabic/500Medium/IBMPlexSansArabic_500Medium.ttf'),
  'PlexArabic-SemiBold': require('@expo-google-fonts/ibm-plex-sans-arabic/600SemiBold/IBMPlexSansArabic_600SemiBold.ttf'),
  'PlexArabic-Bold': require('@expo-google-fonts/ibm-plex-sans-arabic/700Bold/IBMPlexSansArabic_700Bold.ttf'),
};
