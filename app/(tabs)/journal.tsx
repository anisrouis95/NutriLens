import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function JournalScreen() {
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  const colors = Colors[currentTheme];

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: 100 },
        ]}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.text }]}>
            {t('foodJournal')}
          </Text>
          <Text style={[styles.subtitle, { color: colors.text, opacity: 0.7 }]}>
            {t('trackProgress')}
          </Text>
        </View>

        <View
          style={[
            styles.comingSoon,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <Text style={[styles.comingSoonText, { color: colors.text }]}>
            {t('comingSoon')}
          </Text>
          <Text
            style={[
              styles.comingSoonDescription,
              { color: colors.text, opacity: 0.7 },
            ]}
          >
            {t('journalDescription')}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: '400',
  },
  comingSoon: {
    padding: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  comingSoonText: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 12,
  },
  comingSoonDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
});
