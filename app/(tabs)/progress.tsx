import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import CalorieChart from '@/components/progress/CalorieChart';
import WeightChart from '@/components/progress/WeightChart';
import FastingComplianceChart from '@/components/progress/FastingComplianceChart';
import { getWeeklyData } from '@/services/dataService';

export default function ProgressScreen() {
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  const colors = Colors[currentTheme];

  const [activeTab, setActiveTab] = useState('calories');
  const [currentWeek, setCurrentWeek] = useState(0);

  const weeklyData = getWeeklyData(currentWeek);

  const tabs = [
    { id: 'calories', label: t('calories') },
    { id: 'weight', label: t('weight') },
    { id: 'fasting', label: t('fasting') },
  ];

  const navigateWeek = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentWeek < 12) {
      setCurrentWeek(currentWeek + 1);
    } else if (direction === 'next' && currentWeek > 0) {
      setCurrentWeek(currentWeek - 1);
    }
  };

  const getWeekLabel = () => {
    if (currentWeek === 0) {
      return t('thisWeek');
    } else if (currentWeek === 1) {
      return t('lastWeek');
    } else {
      return `${currentWeek} ${t('weeksAgo')}`;
    }
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.background }]}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          {t('yourProgress')}
        </Text>
      </View>

      <View style={styles.tabContainer}>
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.id}
            style={[
              styles.tab,
              activeTab === tab.id && { backgroundColor: colors.primaryColor },
            ]}
            onPress={() => setActiveTab(tab.id)}
          >
            <Text
              style={[
                styles.tabText,
                { color: activeTab === tab.id ? '#FFFFFF' : colors.text },
              ]}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.weekSelector}>
        <TouchableOpacity
          style={[styles.weekButton, { opacity: currentWeek < 12 ? 1 : 0.5 }]}
          onPress={() => navigateWeek('prev')}
          disabled={currentWeek >= 12}
        >
          <ChevronLeft size={24} color={colors.text} />
        </TouchableOpacity>

        <Text style={[styles.weekLabel, { color: colors.text }]}>
          {getWeekLabel()}
        </Text>

        <TouchableOpacity
          style={[styles.weekButton, { opacity: currentWeek > 0 ? 1 : 0.5 }]}
          onPress={() => navigateWeek('next')}
          disabled={currentWeek <= 0}
        >
          <ChevronRight size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={[
          styles.contentContainer,
          { paddingBottom: 100 },
        ]}
      >
        {activeTab === 'calories' && (
          <CalorieChart data={weeklyData.calories} />
        )}

        {activeTab === 'weight' && <WeightChart data={weeklyData.weight} />}

        {activeTab === 'fasting' && (
          <FastingComplianceChart data={weeklyData.fasting} />
        )}

        <View
          style={[
            styles.summaryCard,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <Text style={[styles.summaryTitle, { color: colors.text }]}>
            {t('weekSummary')}
          </Text>

          {activeTab === 'calories' && (
            <>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.text }]}>
                  {t('averageDailyCalories')}
                </Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>
                  {Math.round(
                    weeklyData.calories.reduce(
                      (sum, day) => sum + day.consumed,
                      0
                    ) / 7
                  )}{' '}
                  kcal
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.text }]}>
                  {t('averageDeficit')}
                </Text>
                <Text
                  style={[
                    styles.summaryValue,
                    {
                      color:
                        weeklyData.calorieDeficit > 0
                          ? colors.successColor
                          : colors.errorColor,
                    },
                  ]}
                >
                  {Math.round(weeklyData.calorieDeficit)} kcal/day
                </Text>
              </View>
            </>
          )}

          {activeTab === 'weight' && (
            <>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.text }]}>
                  {t('startWeight')}
                </Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>
                  {weeklyData.weight[0].value} kg
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.text }]}>
                  {t('endWeight')}
                </Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>
                  {weeklyData.weight[6].value} kg
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.text }]}>
                  {t('change')}
                </Text>
                <Text
                  style={[
                    styles.summaryValue,
                    {
                      color:
                        weeklyData.weightChange <= 0
                          ? colors.successColor
                          : colors.errorColor,
                    },
                  ]}
                >
                  {weeklyData.weightChange > 0 ? '+' : ''}
                  {weeklyData.weightChange.toFixed(1)} kg
                </Text>
              </View>
            </>
          )}

          {activeTab === 'fasting' && (
            <>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.text }]}>
                  {t('complianceRate')}
                </Text>
                <Text
                  style={[
                    styles.summaryValue,
                    {
                      color:
                        weeklyData.fastingCompliance >= 0.8
                          ? colors.successColor
                          : colors.errorColor,
                    },
                  ]}
                >
                  {Math.round(weeklyData.fastingCompliance * 100)}%
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={[styles.summaryLabel, { color: colors.text }]}>
                  {t('averageFastingTime')}
                </Text>
                <Text style={[styles.summaryValue, { color: colors.text }]}>
                  {weeklyData.averageFastingHours} {t('hours')}
                </Text>
              </View>
            </>
          )}
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
    padding: 16,
    paddingBottom: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  tab: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    marginRight: 8,
    borderRadius: 16,
  },
  tabText: {
    fontWeight: '500',
  },
  weekSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  weekButton: {
    padding: 8,
  },
  weekLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginHorizontal: 16,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    paddingTop: 8,
  },
  summaryCard: {
    padding: 16,
    borderRadius: 16,
    marginTop: 24,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 16,
  },
  summaryValue: {
    fontSize: 16,
    fontWeight: '600',
  },
});
