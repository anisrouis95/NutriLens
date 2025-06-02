import { StyleSheet, View, Text, useColorScheme } from 'react-native';
import { Check, X } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

type FastingDay = {
  day: string;
  compliant: boolean;
  hours: number;
};

type FastingComplianceChartProps = {
  data: FastingDay[];
};

export default function FastingComplianceChart({
  data,
}: FastingComplianceChartProps) {
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  const colors = Colors[currentTheme];

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        {t('fastingCompliance')}
      </Text>

      <View style={styles.chart}>
        {data.map((day, index) => (
          <View key={index} style={styles.dayColumn}>
            <View
              style={[
                styles.complianceIndicator,
                {
                  backgroundColor: day.compliant
                    ? colors.successColor
                    : colors.errorColor,
                },
              ]}
            >
              {day.compliant ? (
                <Check size={18} color="#FFFFFF" />
              ) : (
                <X size={18} color="#FFFFFF" />
              )}
            </View>

            <Text style={[styles.hoursText, { color: colors.text }]}>
              {day.hours}h
            </Text>
            <Text style={[styles.dayText, { color: colors.text }]}>
              {day.day.substring(0, 3)}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.streakInfo}>
        <View
          style={[
            styles.streakCard,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <Text style={[styles.streakValue, { color: colors.fastingColor }]}>
            5
          </Text>
          <Text style={[styles.streakLabel, { color: colors.text }]}>
            {t('currentStreak')}
          </Text>
        </View>

        <View
          style={[
            styles.streakCard,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <Text style={[styles.streakValue, { color: colors.fastingColor }]}>
            12
          </Text>
          <Text style={[styles.streakLabel, { color: colors.text }]}>
            {t('bestStreak')}
          </Text>
        </View>

        <View
          style={[
            styles.streakCard,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <Text style={[styles.streakValue, { color: colors.fastingColor }]}>
            85%
          </Text>
          <Text style={[styles.streakLabel, { color: colors.text }]}>
            {t('compliance')}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  chart: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  dayColumn: {
    alignItems: 'center',
  },
  complianceIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  hoursText: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  dayText: {
    fontSize: 12,
    opacity: 0.7,
  },
  streakInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  streakCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  streakValue: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  streakLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
});
