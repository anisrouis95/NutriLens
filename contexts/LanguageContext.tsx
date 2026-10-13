import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { I18nManager, Platform, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { reloadAppAsync } from 'expo';
import { translations } from '@/locales/translations';
import {
  formatDate as formatDateIn,
  formatDateTime as formatDateTimeIn,
  formatTime as formatTimeIn,
  isLanguage,
  isRTLLanguage,
  numberLocale,
  pick as pickIn,
  weekdayName as weekdayNameIn,
  type DateParts,
  type Language,
  type Localized,
} from '@/lib/i18n';

export type { Language } from '@/lib/i18n';

type Params = Record<string, string | number>;

interface LanguageContextType {
  language: Language;
  /** Switches language; a switch to or from right-to-left restarts the app (native only). */
  setLanguage: (lang: Language) => Promise<void>;
  t: (key: string, params?: Params) => string;
  /** Picks the current language from a { en, fr, tn?, tnLatn? } text object. */
  L: (text: Localized<string> | undefined, params?: Params) => string;
  /** Same, for any value (lists of bullets, arrays of names). */
  pick: <T>(value: Localized<T>) => T;
  /** Locale for Intl number formatting. */
  locale: string;
  /** The layout runs right to left (Darija in Arabic letters). */
  rtl: boolean;
  formatDate: (date: Date, parts: DateParts) => string;
  formatTime: (date: Date) => string;
  formatDateTime: (date: Date) => string;
  weekdayName: (date: Date, width: 'long' | 'short' | 'narrow') => string;
}

/** Replaces {{name}} tokens; unknown tokens are left as-is. */
export function interpolate(text: string, params?: Params): string {
  if (!params) return text;
  return text.replace(/\{\{(\w+)\}\}/g, (match, name) =>
    params[name] !== undefined ? String(params[name]) : match,
  );
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

const LANGUAGE_STORAGE_KEY = '@nutrition_app_language';
/** When the app last restarted itself to change direction (guards against a restart loop). */
const RTL_RELOAD_KEY = '@nl/rtl_reload_at';

/**
 * Native layout direction is fixed per launch: forceRTL takes effect after a
 * restart. The web preview has no I18nManager support, so it mirrors with CSS.
 */
function applyDirection(rtl: boolean) {
  if (Platform.OS === 'web') {
    if (typeof document !== 'undefined') document.documentElement.dir = rtl ? 'rtl' : 'ltr';
    return false;
  }
  I18nManager.allowRTL(rtl);
  I18nManager.forceRTL(rtl);
  return I18nManager.isRTL !== rtl;
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguageState] = useState<Language>('en');
  const [loaded, setLoaded] = useState(false);

  // Load the saved language; restart once if the layout direction doesn't match it
  // (first launch after choosing تونسي, or after an update).
  useEffect(() => {
    (async () => {
      let lang: Language = 'en';
      try {
        const saved = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
        if (isLanguage(saved)) lang = saved;
      } catch (error) {
        console.error('Error loading language:', error);
      }
      const needsRestart = applyDirection(isRTLLanguage(lang));
      if (needsRestart) {
        const last = Number((await AsyncStorage.getItem(RTL_RELOAD_KEY).catch(() => null)) ?? 0);
        if (Date.now() - last > 60000) {
          await AsyncStorage.setItem(RTL_RELOAD_KEY, String(Date.now())).catch(() => {});
          try {
            await reloadAppAsync();
            return;
          } catch {
            // Restart unavailable: carry on in the current direction.
          }
        }
      }
      setLanguageState(lang);
      setLoaded(true);
    })();
  }, []);

  const setLanguage = useCallback(async (lang: Language) => {
    try {
      await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
    } catch (error) {
      console.error('Error saving language:', error);
    }
    if (applyDirection(isRTLLanguage(lang))) {
      await AsyncStorage.setItem(RTL_RELOAD_KEY, String(Date.now())).catch(() => {});
      try {
        await reloadAppAsync();
        return;
      } catch {
        // Restart unavailable: the new direction applies at the next launch.
      }
    }
    setLanguageState(lang);
  }, []);

  const value = useMemo<LanguageContextType>(() => {
    const t = (key: string, params?: Params): string => {
      const keys = key.split('.');
      const table = (translations as Record<string, unknown>)[language] ?? translations.fr;
      let value: any = table;
      for (const k of keys) value = value?.[k];
      if (typeof value !== 'string') {
        value = translations.en as any;
        for (const k of keys) value = value?.[k];
      }
      return typeof value === 'string' ? interpolate(value, params) : key;
    };
    return {
      language,
      setLanguage,
      t,
      L: (text, params) => (text ? interpolate(pickIn(text, language), params) : ''),
      pick: (v) => pickIn(v, language),
      locale: numberLocale(language),
      rtl: Platform.OS === 'web' ? isRTLLanguage(language) : I18nManager.isRTL,
      formatDate: (date, parts) => formatDateIn(date, parts, language),
      formatTime: (date) => formatTimeIn(date, language),
      formatDateTime: (date) => formatDateTimeIn(date, language),
      weekdayName: (date, width) => weekdayNameIn(date, language, width),
    };
  }, [language, setLanguage]);

  // Keep the splash up until the language (and its direction) is settled.
  if (!loaded) return null;

  const content = <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
  if (Platform.OS !== 'web') return content;
  // Web preview only: react-native-web mirrors a subtree (start/end, left/right)
  // from its `dir` prop, standing in for I18nManager on Android.
  return (
    <View style={{ flex: 1 }} {...({ dir: isRTLLanguage(language) ? 'rtl' : 'ltr' } as object)}>
      {content}
    </View>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
