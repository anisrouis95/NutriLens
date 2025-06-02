import { StyleSheet, View, Text, useColorScheme } from 'react-native';
import Colors from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

type WeightDay = {
  day: string;
  value: number;
};

type WeightChartProps = {
  data: WeightDay[];
};

export default function WeightChart({ data }: WeightChartProps) {
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  const colors = Colors[currentTheme];

  // Calculate min and max values for y-axis
  const values = data.map((item) => item.value);
  const minValue = Math.min(...values) - 0.5;
  const maxValue = Math.max(...values) + 0.5;
  const range = maxValue - minValue;

  const chartHeight = 200;

  // Function to calculate y position on chart
  const getYPosition = (value: number) => {
    return chartHeight - ((value - minValue) / range) * chartHeight;
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>
        {t('weightTracking')}
      </Text>

      <View style={styles.chart}>
        <View style={styles.yAxis}>
          {[0, 1, 2, 3, 4].map((index) => {
            const value = minValue + (range / 4) * index;
            return (
              <Text key={index} style={[styles.yLabel, { color: colors.text }]}>
                {value.toFixed(1)}
              </Text>
            );
          })}
        </View>

        <View style={styles.chartContent}>
          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((index) => (
            <View
              key={`grid-${index}`}
              style={[
                styles.gridLine,
                {
                  top: (chartHeight / 4) * index,
                  borderColor: colors.borderColor,
                },
              ]}
            />
          ))}

          {/* Line connecting points */}
          <View style={styles.linePath}>
            {data.map((day, index) => {
              if (index === 0) return null;

              const startX = ((index - 1) / (data.length - 1)) * '100%';
              const startY = getYPosition(data[index - 1].value);
              const endX = (index / (data.length - 1)) * '100%';
              const endY = getYPosition(day.value);

              return (
                <View
                  key={`line-${index}`}
                  style={[
                    styles.lineSegment,
                    {
                      left: `${((index - 1) / (data.length - 1)) * 100}%`,
                      width: `${100 / (data.length - 1)}%`,
                      top: startY < endY ? startY : endY,
                      height: Math.abs(endY - startY),
                      // This transforms the line to connect the points
                      transform: [
                        {
                          rotateZ: `${
                            startY < endY
                              ? Math.atan2(
                                  endY - startY,
                                  100 / (data.length - 1)
                                )
                              : Math.atan2(
                                  startY - endY,
                                  100 / (data.length - 1)
                                )
                          }rad`,
                        },
                      ],
                      backgroundColor: colors.secondaryColor,
                    },
                  ]}
                />
              );
            })}
          </View>

          {/* Data points */}
          {data.map((day, index) => {
            const x = (index / (data.length - 1)) * 100;
            const y = getYPosition(day.value);

            return (
              <View
                key={`point-${index}`}
                style={[
                  styles.dataPoint,
                  {
                    left: `${x}%`,
                    top: y,
                    backgroundColor: colors.secondaryColor,
                    borderColor: colors.cardBackground,
                  },
                ]}
              />
            );
          })}

          {/* X-axis labels */}
          <View style={styles.xAxis}>
            {data.map((day, index) => (
              <Text
                key={`x-${index}`}
                style={[
                  styles.xLabel,
                  {
                    left: `${(index / (data.length - 1)) * 100}%`,
                    color: colors.text,
                  },
                ]}
              >
                {day.day.substring(0, 3)}
              </Text>
            ))}
          </View>
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
    height: 200,
    position: 'relative',
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    borderTopWidth: 1,
    borderStyle: 'dashed',
  },
  linePath: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  lineSegment: {
    position: 'absolute',
    height: 2,
  },
  dataPoint: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    marginLeft: -6,
    marginTop: -6,
    borderWidth: 2,
  },
  xAxis: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 200,
    height: 20,
  },
  xLabel: {
    position: 'absolute',
    fontSize: 12,
    textAlign: 'center',
    marginLeft: -15,
    width: 30,
  },
});
