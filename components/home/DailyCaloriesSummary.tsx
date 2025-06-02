import { StyleSheet, View, Text } from 'react-native';
import Colors from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

type MacroNutrients = {
  protein: number;
  carbs: number;
  fat: number;
};

type DailyCaloriesSummaryProps = {
  calorieGoal: number;
  caloriesConsumed: number;
  macros: MacroNutrients;
};

export default function DailyCaloriesSummary({
  calorieGoal,
  caloriesConsumed,
  macros,
}: DailyCaloriesSummaryProps) {
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  const colors = Colors[currentTheme];

  const caloriesRemaining = calorieGoal - caloriesConsumed;
  const calorieProgress = Math.min((caloriesConsumed / calorieGoal) * 100, 100);

  // Calculate calories from each macro
  const proteinCalories = macros.protein * 4;
  const carbsCalories = macros.carbs * 4;
  const fatCalories = macros.fat * 9;

  // Calculate percentage of total calories for each macro
  const proteinPercentage = (proteinCalories / caloriesConsumed) * 100 || 0;
  const carbsPercentage = (carbsCalories / caloriesConsumed) * 100 || 0;
  const fatPercentage = (fatCalories / caloriesConsumed) * 100 || 0;

  return (
    <View
      style={[styles.container, { backgroundColor: colors.cardBackground }]}
    >
      <Text style={[styles.title, { color: colors.text }]}>
        {t('calories')}
      </Text>

      <View style={styles.calorieRow}>
        <View style={styles.calorieInfo}>
          <Text style={[styles.calorieNumber, { color: colors.calorieColor }]}>
            {caloriesConsumed}
          </Text>
          <Text style={[styles.calorieLabel, { color: colors.text }]}>
            {t('consumed')}
          </Text>
        </View>

        <View style={styles.progressContainer}>
          <View
            style={[
              styles.progressBar,
              { backgroundColor: colors.borderColor },
            ]}
          >
            <View
              style={[
                styles.progressFill,
                {
                  backgroundColor: colors.calorieColor,
                  width: `${calorieProgress}%`,
                },
              ]}
            />
          </View>
        </View>

        <View style={styles.calorieInfo}>
          <Text style={[styles.calorieNumber, { color: colors.text }]}>
            {Math.max(caloriesRemaining, 0)}
          </Text>
          <Text style={[styles.calorieLabel, { color: colors.text }]}>
            {t('remaining')}
          </Text>
        </View>
      </View>

      <View style={styles.macroRow}>
        <View style={styles.macroItem}>
          <View
            style={[
              styles.macroIndicator,
              { backgroundColor: colors.proteinColor },
            ]}
          />
          <View style={styles.macroInfo}>
            <Text style={[styles.macroValue, { color: colors.text }]}>
              {macros.protein.toFixed(0)}g
            </Text>
            <Text style={[styles.macroLabel, { color: colors.text }]}>
              {t('protein')}
            </Text>
          </View>
        </View>

        <View style={styles.macroItem}>
          <View
            style={[
              styles.macroIndicator,
              { backgroundColor: colors.carbsColor },
            ]}
          />
          <View style={styles.macroInfo}>
            <Text style={[styles.macroValue, { color: colors.text }]}>
              {macros.carbs.toFixed(0)}g
            </Text>
            <Text style={[styles.macroLabel, { color: colors.text }]}>
              {t('carbs')}
            </Text>
          </View>
        </View>

        <View style={styles.macroItem}>
          <View
            style={[
              styles.macroIndicator,
              { backgroundColor: colors.fatColor },
            ]}
          />
          <View style={styles.macroInfo}>
            <Text style={[styles.macroValue, { color: colors.text }]}>
              {macros.fat.toFixed(0)}g
            </Text>
            <Text style={[styles.macroLabel, { color: colors.text }]}>
              {t('fat')}
            </Text>
          </View>
        </View>
      </View>

      <Text style={[styles.goalText, { color: colors.text, opacity: 0.7 }]}>
        {t('goal')}: {calorieGoal} kcal
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  calorieRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  calorieInfo: {
    alignItems: 'center',
  },
  calorieNumber: {
    fontSize: 24,
    fontWeight: '700',
  },
  calorieLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  progressContainer: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 4,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  macroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  macroItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  macroIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  macroInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  macroValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  macroLabel: {
    fontSize: 14,
  },
  goalText: {
    fontSize: 14,
    opacity: 0.7,
  },
});
