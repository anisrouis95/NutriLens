import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Switch,
  useColorScheme,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Moon,
  Sun,
  Smartphone,
  Bell,
  Scale,
  Globe,
  Download,
  Shield,
  Info,
  RotateCcw,
  ChevronRight,
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useTheme, ThemeMode } from '@/contexts/ThemeContext';
import { useLanguage, Language } from '@/contexts/LanguageContext';

export default function AppSettingsScreen() {
  const { currentTheme, themeMode, setThemeMode } = useTheme();
  const { language, setLanguage, t } = useLanguage();
  const colors = Colors[currentTheme];
  const router = useRouter();

  // Settings state
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [mealReminders, setMealReminders] = useState(true);
  const [fastingReminders, setFastingReminders] = useState(true);
  const [waterReminders, setWaterReminders] = useState(false);
  const [useMetricUnits, setUseMetricUnits] = useState(true);

  const themeOptions = [
    {
      value: 'light' as ThemeMode,
      label: t('light'),
      icon: Sun,
      description: t('lightDesc'),
    },
    {
      value: 'dark' as ThemeMode,
      label: t('dark'),
      icon: Moon,
      description: t('darkDesc'),
    },
    {
      value: 'system' as ThemeMode,
      label: t('system'),
      icon: Smartphone,
      description: t('systemDesc'),
    },
  ];

  const languageOptions = [
    {
      value: 'en' as Language,
      label: 'English',
      description: 'English (US)',
    },
    {
      value: 'fr' as Language,
      label: 'Français',
      description: 'Français',
    },
  ];

  const handleThemeChange = (theme: ThemeMode) => {
    setThemeMode(theme);
  };

  const handleLanguageChange = (lang: Language) => {
    setLanguage(lang);
  };

  const handleExportData = () => {
    Alert.alert(t('exportDataTitle'), t('exportDataMessage'), [
      { text: t('cancel'), style: 'cancel' },
      { text: t('csv'), onPress: () => Alert.alert(t('exportingCsv')) },
      { text: t('json'), onPress: () => Alert.alert(t('exportingJson')) },
    ]);
  };

  const handleResetData = () => {
    Alert.alert(t('resetDataTitle'), t('resetDataMessage'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('reset'),
        style: 'destructive',
        onPress: () => Alert.alert(t('dataReset'), t('dataResetMessage')),
      },
    ]);
  };

  const handleAbout = () => {
    Alert.alert(t('aboutTitle'), t('aboutMessage'), [{ text: t('ok') }]);
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <ArrowLeft size={24} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>
          {t('appSettings')}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Theme Settings */}
        <View
          style={[styles.section, { backgroundColor: colors.cardBackground }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('appearance')}
          </Text>
          <Text
            style={[
              styles.sectionDescription,
              { color: colors.text, opacity: 0.7 },
            ]}
          >
            {t('appearanceDesc')}
          </Text>

          {themeOptions.map((option) => {
            const IconComponent = option.icon;
            const isSelected = themeMode === option.value;

            return (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.themeOption,
                  {
                    borderColor: isSelected
                      ? colors.primaryColor
                      : colors.borderColor,
                    backgroundColor: isSelected
                      ? `${colors.primaryColor}10`
                      : 'transparent',
                  },
                ]}
                onPress={() => handleThemeChange(option.value)}
              >
                <View style={styles.themeOptionContent}>
                  <View style={styles.themeOptionHeader}>
                    <IconComponent
                      size={20}
                      color={isSelected ? colors.primaryColor : colors.text}
                    />
                    <Text
                      style={[
                        styles.themeOptionTitle,
                        {
                          color: isSelected ? colors.primaryColor : colors.text,
                        },
                      ]}
                    >
                      {option.label}
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.themeOptionDescription,
                      { color: colors.text, opacity: 0.7 },
                    ]}
                  >
                    {option.description}
                  </Text>
                </View>
                {isSelected && (
                  <View
                    style={[
                      styles.selectedIndicator,
                      { backgroundColor: colors.primaryColor },
                    ]}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Notifications */}
        <View
          style={[styles.section, { backgroundColor: colors.cardBackground }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('notifications')}
          </Text>
          <Text
            style={[
              styles.sectionDescription,
              { color: colors.text, opacity: 0.7 },
            ]}
          >
            {t('notificationsDesc')}
          </Text>

          <View style={styles.settingItem}>
            <View style={styles.settingItemContent}>
              <Bell size={20} color={colors.text} />
              <View style={styles.settingItemText}>
                <Text style={[styles.settingItemTitle, { color: colors.text }]}>
                  {t('pushNotifications')}
                </Text>
                <Text
                  style={[
                    styles.settingItemDescription,
                    { color: colors.text, opacity: 0.7 },
                  ]}
                >
                  {t('pushNotificationsDesc')}
                </Text>
              </View>
            </View>
            <Switch
              value={notificationsEnabled}
              onValueChange={setNotificationsEnabled}
              trackColor={{
                false: colors.borderColor,
                true: colors.primaryColor,
              }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View
            style={[
              styles.settingItem,
              { opacity: notificationsEnabled ? 1 : 0.5 },
            ]}
          >
            <View style={styles.settingItemContent}>
              <Text style={[styles.settingItemTitle, { color: colors.text }]}>
                {t('mealReminders')}
              </Text>
            </View>
            <Switch
              value={mealReminders && notificationsEnabled}
              onValueChange={setMealReminders}
              disabled={!notificationsEnabled}
              trackColor={{
                false: colors.borderColor,
                true: colors.primaryColor,
              }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View
            style={[
              styles.settingItem,
              { opacity: notificationsEnabled ? 1 : 0.5 },
            ]}
          >
            <View style={styles.settingItemContent}>
              <Text style={[styles.settingItemTitle, { color: colors.text }]}>
                {t('fastingReminders')}
              </Text>
            </View>
            <Switch
              value={fastingReminders && notificationsEnabled}
              onValueChange={setFastingReminders}
              disabled={!notificationsEnabled}
              trackColor={{
                false: colors.borderColor,
                true: colors.primaryColor,
              }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View
            style={[
              styles.settingItem,
              { opacity: notificationsEnabled ? 1 : 0.5 },
            ]}
          >
            <View style={styles.settingItemContent}>
              <Text style={[styles.settingItemTitle, { color: colors.text }]}>
                {t('waterReminders')}
              </Text>
            </View>
            <Switch
              value={waterReminders && notificationsEnabled}
              onValueChange={setWaterReminders}
              disabled={!notificationsEnabled}
              trackColor={{
                false: colors.borderColor,
                true: colors.primaryColor,
              }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        {/* Units & Preferences */}
        <View
          style={[styles.section, { backgroundColor: colors.cardBackground }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('unitsPreferences')}
          </Text>

          <View style={styles.settingItem}>
            <View style={styles.settingItemContent}>
              <Scale size={20} color={colors.text} />
              <View style={styles.settingItemText}>
                <Text style={[styles.settingItemTitle, { color: colors.text }]}>
                  {t('useMetricUnits')}
                </Text>
                <Text
                  style={[
                    styles.settingItemDescription,
                    { color: colors.text, opacity: 0.7 },
                  ]}
                >
                  {t('useMetricUnitsDesc')}
                </Text>
              </View>
            </View>
            <Switch
              value={useMetricUnits}
              onValueChange={setUseMetricUnits}
              trackColor={{
                false: colors.borderColor,
                true: colors.primaryColor,
              }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Language Selector */}
          <View style={styles.languageSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('language')}
            </Text>
            <Text
              style={[
                styles.sectionDescription,
                { color: colors.text, opacity: 0.7 },
              ]}
            >
              Choose your preferred language
            </Text>

            {languageOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.languageOption,
                  {
                    borderColor:
                      language === option.value
                        ? colors.primaryColor
                        : colors.borderColor,
                    backgroundColor:
                      language === option.value
                        ? `${colors.primaryColor}10`
                        : 'transparent',
                  },
                ]}
                onPress={() => handleLanguageChange(option.value)}
              >
                <View style={styles.languageOptionContent}>
                  <Text
                    style={[
                      styles.languageOptionTitle,
                      {
                        color:
                          language === option.value
                            ? colors.primaryColor
                            : colors.text,
                      },
                    ]}
                  >
                    {option.label}
                  </Text>
                  <Text
                    style={[
                      styles.languageOptionDescription,
                      { color: colors.text, opacity: 0.7 },
                    ]}
                  >
                    {option.description}
                  </Text>
                </View>
                {language === option.value && (
                  <View
                    style={[
                      styles.selectedIndicator,
                      { backgroundColor: colors.primaryColor },
                    ]}
                  />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Data & Privacy */}
        <View
          style={[styles.section, { backgroundColor: colors.cardBackground }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('dataPrivacy')}
          </Text>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleExportData}
          >
            <View style={styles.settingItemContent}>
              <Download size={20} color={colors.text} />
              <View style={styles.settingItemText}>
                <Text style={[styles.settingItemTitle, { color: colors.text }]}>
                  {t('exportData')}
                </Text>
                <Text
                  style={[
                    styles.settingItemDescription,
                    { color: colors.text, opacity: 0.7 },
                  ]}
                >
                  {t('exportDataDesc')}
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.text} opacity={0.5} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem}>
            <View style={styles.settingItemContent}>
              <Shield size={20} color={colors.text} />
              <View style={styles.settingItemText}>
                <Text style={[styles.settingItemTitle, { color: colors.text }]}>
                  {t('privacyPolicy')}
                </Text>
                <Text
                  style={[
                    styles.settingItemDescription,
                    { color: colors.text, opacity: 0.7 },
                  ]}
                >
                  {t('privacyPolicyDesc')}
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.text} opacity={0.5} />
          </TouchableOpacity>
        </View>

        {/* About & Support */}
        <View
          style={[styles.section, { backgroundColor: colors.cardBackground }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('aboutSupport')}
          </Text>

          <TouchableOpacity style={styles.settingItem} onPress={handleAbout}>
            <View style={styles.settingItemContent}>
              <Info size={20} color={colors.text} />
              <View style={styles.settingItemText}>
                <Text style={[styles.settingItemTitle, { color: colors.text }]}>
                  {t('aboutApp')}
                </Text>
                <Text
                  style={[
                    styles.settingItemDescription,
                    { color: colors.text, opacity: 0.7 },
                  ]}
                >
                  {t('version')}
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.text} opacity={0.5} />
          </TouchableOpacity>
        </View>

        {/* Danger Zone */}
        <View
          style={[styles.section, { backgroundColor: colors.cardBackground }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.errorColor }]}>
            {t('dangerZone')}
          </Text>

          <TouchableOpacity
            style={[styles.settingItem, styles.dangerItem]}
            onPress={handleResetData}
          >
            <View style={styles.settingItemContent}>
              <RotateCcw size={20} color={colors.errorColor} />
              <View style={styles.settingItemText}>
                <Text
                  style={[
                    styles.settingItemTitle,
                    { color: colors.errorColor },
                  ]}
                >
                  {t('resetAllData')}
                </Text>
                <Text
                  style={[
                    styles.settingItemDescription,
                    { color: colors.errorColor, opacity: 0.7 },
                  ]}
                >
                  {t('resetAllDataDesc')}
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color={colors.errorColor} opacity={0.7} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  section: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  sectionDescription: {
    fontSize: 14,
    marginBottom: 16,
  },
  themeOption: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    position: 'relative',
  },
  themeOptionContent: {
    flex: 1,
  },
  themeOptionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    gap: 12,
  },
  themeOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  themeOptionDescription: {
    fontSize: 14,
    marginLeft: 32,
  },
  selectedIndicator: {
    position: 'absolute',
    right: 16,
    top: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  settingItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    gap: 12,
  },
  settingItemText: {
    flex: 1,
  },
  settingItemTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  settingItemDescription: {
    fontSize: 14,
  },
  dangerItem: {
    borderBottomWidth: 0,
  },
  languageSection: {
    marginBottom: 16,
  },
  languageOption: {
    borderWidth: 2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    position: 'relative',
  },
  languageOptionContent: {
    flex: 1,
  },
  languageOptionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  languageOptionDescription: {
    fontSize: 14,
    marginTop: 4,
  },
});
