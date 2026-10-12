import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const STORAGE_KEYS = {
  profile: '@nl/profile',
  foods: '@nl/foods',
  weights: '@nl/weights',
  workoutPlan: '@nl/workoutPlan',
  sessions: '@nl/sessions',
  health: '@nl/health',
  settings: '@nl/settings',
  recentFoods: '@nl/recentFoods',
} as const;

export async function loadJSON<T>(key: string, fallback: T): Promise<T> {
  try {
    const raw = await AsyncStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch (error) {
    console.error(`Error loading ${key}:`, error);
    return fallback;
  }
}

export async function saveJSON(key: string, value: unknown): Promise<void> {
  try {
    if (value === undefined || value === null) {
      await AsyncStorage.removeItem(key);
    } else {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    }
  } catch (error) {
    console.error(`Error saving ${key}:`, error);
  }
}

export async function clearAppData(): Promise<void> {
  await AsyncStorage.multiRemove(Object.values(STORAGE_KEYS));
  await deleteSecret(SECRET_KEYS.geminiApiKey);
  await deleteSecret(SECRET_KEYS.openRouterApiKey);
}

// Secrets (API keys) live in the Android Keystore via SecureStore. The web
// preview has no keystore, so it falls back to AsyncStorage there.
export const SECRET_KEYS = { geminiApiKey: 'nl_gemini_api_key', openRouterApiKey: 'nl_openrouter_api_key' } as const;

export async function getSecret(key: string): Promise<string | null> {
  if (Platform.OS === 'web') return AsyncStorage.getItem(`@secret/${key}`);
  return SecureStore.getItemAsync(key);
}

export async function setSecret(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    await AsyncStorage.setItem(`@secret/${key}`, value);
    return;
  }
  await SecureStore.setItemAsync(key, value);
}

export async function deleteSecret(key: string): Promise<void> {
  if (Platform.OS === 'web') {
    await AsyncStorage.removeItem(`@secret/${key}`);
    return;
  }
  await SecureStore.deleteItemAsync(key);
}

export function newId(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`;
}
