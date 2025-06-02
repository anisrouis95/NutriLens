import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Colors from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import FastingTimer from '@/components/home/FastingTimer';
import DailyCaloriesSummary from '@/components/home/DailyCaloriesSummary';
import MealsList from '@/components/home/MealsList';
import { getUserData, getTodaysMeals } from '@/services/dataService';

export default function HomeScreen() {
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  const colors = Colors[currentTheme];

  const [userData, setUserData] = useState<any>(null);
  const [todaysMeals, setTodaysMeals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, this would fetch from an API or local storage
    const fetchData = async () => {
      try {
        const user = await getUserData();
        const meals = await getTodaysMeals();

        setUserData(user);
        setTodaysMeals(meals);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>
            {t('loading')}
          </Text>
        </View>
      </SafeAreaView>
    );
  }

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
          <Text style={[styles.greeting, { color: colors.text }]}>
            {t('hello')}, {userData?.name || 'User'}!
          </Text>
          <Text style={[styles.date, { color: colors.text }]}>
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
            })}
          </Text>
        </View>

        <FastingTimer
          fastingSchedule={
            userData?.fastingSchedule || {
              startTime: '20:00',
              endTime: '12:00',
            }
          }
        />

        <DailyCaloriesSummary
          calorieGoal={userData?.calorieGoal || 2000}
          caloriesConsumed={todaysMeals.reduce(
            (total, meal) => total + meal.calories,
            0
          )}
          macros={{
            protein: todaysMeals.reduce(
              (total, meal) => total + meal.protein,
              0
            ),
            carbs: todaysMeals.reduce((total, meal) => total + meal.carbs, 0),
            fat: todaysMeals.reduce((total, meal) => total + meal.fat, 0),
          }}
        />

        <MealsList meals={todaysMeals} />
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
  greeting: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  date: {
    fontSize: 16,
    fontWeight: '400',
    opacity: 0.7,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    fontWeight: '500',
  },
});
