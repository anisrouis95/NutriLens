import { StyleSheet, View, Text, Image } from 'react-native';
import { Clock } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

type Meal = {
  id: string;
  name: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  imageUrl?: string;
};

type MealsListProps = {
  meals: Meal[];
};

export default function MealsList({ meals }: MealsListProps) {
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  const colors = Colors[currentTheme];

  // Group meals by time of day
  const groupedMeals = meals.reduce((acc, meal) => {
    const hour = parseInt(meal.time.split(':')[0], 10);
    let timeOfDay = t('breakfast');

    if (hour >= 12 && hour < 16) {
      timeOfDay = t('lunch');
    } else if (hour >= 16 && hour < 20) {
      timeOfDay = t('dinner');
    } else if (hour >= 20 || hour < 5) {
      timeOfDay = t('snacks');
    }

    if (!acc[timeOfDay]) {
      acc[timeOfDay] = [];
    }

    acc[timeOfDay].push(meal);
    return acc;
  }, {} as Record<string, Meal[]>);

  if (meals.length === 0) {
    return (
      <View
        style={[
          styles.emptyContainer,
          { backgroundColor: colors.cardBackground },
        ]}
      >
        <Text style={[styles.emptyText, { color: colors.text }]}>
          {t('noMeals')}
        </Text>
        <Text style={[styles.emptySuggestion, { color: colors.text }]}>
          {t('noMealsSuggestion')}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        {t('todaysMeals')}
      </Text>

      {Object.entries(groupedMeals).map(([timeOfDay, mealsList]) => (
        <View key={timeOfDay} style={styles.mealTimeSection}>
          <Text style={[styles.mealTimeTitle, { color: colors.text }]}>
            {timeOfDay}
          </Text>

          {mealsList.map((meal) => (
            <View
              key={meal.id}
              style={[
                styles.mealCard,
                { backgroundColor: colors.cardBackground },
              ]}
            >
              {meal.imageUrl ? (
                <Image
                  source={{ uri: meal.imageUrl }}
                  style={styles.mealImage}
                />
              ) : (
                <View
                  style={[
                    styles.mealImagePlaceholder,
                    { backgroundColor: colors.background },
                  ]}
                />
              )}

              <View style={styles.mealInfo}>
                <Text style={[styles.mealName, { color: colors.text }]}>
                  {meal.name}
                </Text>

                <View style={styles.mealTime}>
                  <Clock
                    size={12}
                    color={colors.text}
                    style={{ opacity: 0.7 }}
                  />
                  <Text style={[styles.mealTimeText, { color: colors.text }]}>
                    {meal.time}
                  </Text>
                </View>

                <View style={styles.macroInfo}>
                  <Text
                    style={[styles.calorieText, { color: colors.calorieColor }]}
                  >
                    {meal.calories} kcal
                  </Text>

                  <View style={styles.macros}>
                    <Text style={[styles.macroText, { color: colors.text }]}>
                      P: {meal.protein}g
                    </Text>
                    <Text style={[styles.macroText, { color: colors.text }]}>
                      C: {meal.carbs}g
                    </Text>
                    <Text style={[styles.macroText, { color: colors.text }]}>
                      F: {meal.fat}g
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  mealTimeSection: {
    marginBottom: 16,
  },
  mealTimeTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  mealCard: {
    flexDirection: 'row',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 8,
  },
  mealImage: {
    width: 80,
    height: 80,
  },
  mealImagePlaceholder: {
    width: 80,
    height: 80,
  },
  mealInfo: {
    flex: 1,
    padding: 12,
  },
  mealName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  mealTime: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  mealTimeText: {
    fontSize: 12,
    marginLeft: 4,
    opacity: 0.7,
  },
  macroInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calorieText: {
    fontSize: 14,
    fontWeight: '600',
  },
  macros: {
    flexDirection: 'row',
    gap: 8,
  },
  macroText: {
    fontSize: 12,
    opacity: 0.7,
  },
  emptyContainer: {
    padding: 24,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  emptySuggestion: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: 'center',
  },
});
