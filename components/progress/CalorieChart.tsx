import React from 'react';
import { StyleSheet, View, Text, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

type CalorieDay = {
  day: string;
  consumed: number;
  goal: number;
};

type CalorieChartProps = {
  data: CalorieDay[];
};

export default function CalorieChart({ data }: CalorieChartProps) {
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  const colors = Colors[currentTheme];

  // Find the maximum value for scaling
  const maxValue = Math.max(
    ...data.map((day) => Math.max(day.consumed, day.goal)),
    2000 // Minimum scale value
  );

  const chartHeight = 200;

  const getBarHeight = (value: number) => {
    return (value / maxValue) * chartHeight;
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        {t('dailyCalories')}
      </Text>

      <View style={styles.chart}>
        <View style={styles.yAxis}>
          {[0, 1, 2, 3, 4].map((index) => {
            const value = Math.round((maxValue / 4) * (4 - index));
            return (
              <Text key={index} style={[styles.yLabel, { color: colors.text }]}>
                {value}
              </Text>
            );
          })}
        </View>

        <View style={styles.chartContent}>
          {data.map((day, index) => {
            const consumedHeight = getBarHeight(day.consumed);
            const goalHeight = getBarHeight(day.goal);

            return (
              <View key={index} style={styles.barGroup}>
                <View style={styles.bars}>
                  <View style={[styles.barContainer, { height: chartHeight }]}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height: consumedHeight,
                          backgroundColor:
                            day.consumed > day.goal
                              ? colors.errorColor
                              : colors.primaryColor,
                        },
                      ]}
                    />
                  </View>

                  <View
                    style={[
                      styles.goalLine,
                      { bottom: goalHeight, borderColor: colors.accentColor },
                    ]}
                  />
                </View>

                <Text style={[styles.xLabel, { color: colors.text }]}>
                  {day.day.substring(0, 3)}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View
            style={[
              styles.legendColor,
              { backgroundColor: colors.primaryColor },
            ]}
          />
          <Text style={[styles.legendText, { color: colors.text }]}>
            {t('caloriesConsumed')}
          </Text>
        </View>

        <View style={styles.legendItem}>
          <View
            style={[styles.legendLine, { backgroundColor: colors.accentColor }]}
          />
          <Text style={[styles.legendText, { color: colors.text }]}>
            {t('calorieGoal')}
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
    height: 240,
    marginBottom: 8,
  },
  yAxis: {
    width: 40,
    height: 200,
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingRight: 8,
  },
  yLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
  chartContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 200,
  },
  barGroup: {
    flex: 1,
    alignItems: 'center',
  },
  bars: {
    width: 24,
    height: 200,
    position: 'relative',
  },
  barContainer: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: '80%',
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
  },
  goalLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
  },
  xLabel: {
    fontSize: 12,
    marginTop: 8,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
  },
  legendColor: {
    width: 12,
    height: 12,
    borderRadius: 2,
    marginRight: 6,
  },
  legendLine: {
    width: 12,
    height: 2,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
  },
});
