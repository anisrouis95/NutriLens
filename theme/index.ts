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
};
