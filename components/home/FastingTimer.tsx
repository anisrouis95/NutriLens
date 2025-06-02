import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import Colors from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

type FastingSchedule = {
  startTime: string;
  endTime: string;
};

type FastingTimerProps = {
  fastingSchedule: FastingSchedule;
};

export default function FastingTimer({ fastingSchedule }: FastingTimerProps) {
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  const colors = Colors[currentTheme];

  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFasting, setIsFasting] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState({ hours: 0, minutes: 0 });
  const [progress, setProgress] = useState(0);

  const router = useRouter();

  // Parse schedule times
  const parseTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    return { hours, minutes };
  };

  const startTime = parseTime(fastingSchedule.startTime);
  const endTime = parseTime(fastingSchedule.endTime);

  // Calculate fasting status and time remaining
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      const currentHours = now.getHours();
      const currentMinutes = now.getMinutes();

      // Create Date objects for start and end times today
      const startDate = new Date();
      startDate.setHours(startTime.hours, startTime.minutes, 0, 0);

      const endDate = new Date();
      endDate.setHours(endTime.hours, endTime.minutes, 0, 0);

      // If end time is earlier than start time, it means it's the next day
      if (
        endTime.hours < startTime.hours ||
        (endTime.hours === startTime.hours &&
          endTime.minutes < startTime.minutes)
      ) {
        endDate.setDate(endDate.getDate() + 1);
      }

      // Calculate if currently fasting
      const fasting =
        (now >= startDate && now < endDate) ||
        (endDate < startDate && (now >= startDate || now < endDate));
      setIsFasting(fasting);

      // Calculate time remaining
      let targetTime;
      let totalDuration;
      let elapsedTime;

      if (fasting) {
        // If fasting, count down to end time
        targetTime = endDate;
        totalDuration = endDate.getTime() - startDate.getTime();
        elapsedTime = now.getTime() - startDate.getTime();
      } else {
        // If not fasting, count down to start time
        targetTime = startDate;
        if (now > endDate) {
          // If we're past the end time, set start time to tomorrow
          startDate.setDate(startDate.getDate() + 1);
          targetTime = startDate;
        }

        // Calculate eating window duration
        const eatingStart = endDate;
        const eatingEnd = startDate;
        if (eatingEnd < eatingStart) {
          eatingEnd.setDate(eatingEnd.getDate() + 1);
        }

        totalDuration = eatingEnd.getTime() - eatingStart.getTime();
        elapsedTime = now.getTime() - eatingStart.getTime();
      }

      // Calculate progress
      const progressPercentage = Math.min(
        Math.max((elapsedTime / totalDuration) * 100, 0),
        100
      );
      setProgress(progressPercentage);

      // Calculate remaining time
      const remaining = targetTime.getTime() - now.getTime();
      const remainingHours = Math.floor(remaining / (1000 * 60 * 60));
      const remainingMinutes = Math.floor(
        (remaining % (1000 * 60 * 60)) / (1000 * 60)
      );

      setTimeRemaining({
        hours: remainingHours,
        minutes: remainingMinutes,
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [fastingSchedule]);

  // Calculate fasting hours (16:8, 18:6, etc.)
  const calculateFastingPattern = () => {
    // Convert start and end times to minutes since midnight
    const startMinutes = startTime.hours * 60 + startTime.minutes;
    let endMinutes = endTime.hours * 60 + endTime.minutes;

    // If end time is earlier than start time, add 24 hours (1440 minutes)
    if (endMinutes < startMinutes) {
      endMinutes += 1440;
    }

    // Calculate fasting hours
    const fastingMinutes = 1440 - (endMinutes - startMinutes);
    const fastingHours = Math.round(fastingMinutes / 60);
    const eatingHours = 24 - fastingHours;

    return `${fastingHours}:${eatingHours}`;
  };

  const fastingPattern = calculateFastingPattern();

  const handlePress = () => {
    router.push('/(tabs)/fasting-details');
  };

  return (
    <TouchableOpacity
      style={[styles.container, { backgroundColor: colors.cardBackground }]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>
          {t('fastingTimer')}
        </Text>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: isFasting
                ? colors.fastingColor
                : colors.successColor,
            },
          ]}
        >
          <Text style={styles.badgeText}>
            {isFasting ? t('fasting') : t('eating')}
          </Text>
        </View>
      </View>

      <View style={styles.timerContainer}>
        <View style={styles.timeContainer}>
          <Text style={[styles.timeValue, { color: colors.text }]}>
            {String(timeRemaining.hours).padStart(2, '0')}:
            {String(timeRemaining.minutes).padStart(2, '0')}
          </Text>
          <Text style={[styles.timeLabel, { color: colors.text }]}>
            {isFasting ? t('untilEating') : t('untilFasting')}
          </Text>
        </View>

        <View style={[styles.progressRing, { borderColor: colors.background }]}>
          <View
            style={[
              styles.progressFill,
              {
                backgroundColor: isFasting
                  ? colors.fastingColor
                  : colors.successColor,
                width: `${progress}%`,
              },
            ]}
          />
        </View>
      </View>

      <View style={styles.infoContainer}>
        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: colors.text }]}>
            {t('pattern')}
          </Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>
            {fastingPattern}
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: colors.text }]}>
            {t('fastStart')}
          </Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>
            {fastingSchedule.startTime}
          </Text>
        </View>

        <View style={styles.infoItem}>
          <Text style={[styles.infoLabel, { color: colors.text }]}>
            {t('fastEnd')}
          </Text>
          <Text style={[styles.infoValue, { color: colors.text }]}>
            {fastingSchedule.endTime}
          </Text>
        </View>
      </View>

      <View style={styles.fastingBenefits}>
        <Text style={[styles.fastingBenefitsTitle, { color: colors.text }]}>
          {isFasting ? t('currentFastingBenefits') : t('nextFastingBenefits')}
        </Text>
        <View
          style={[
            styles.benefitItem,
            { opacity: isFasting && progress >= 25 ? 1 : 0.5 },
          ]}
        >
          <View
            style={[
              styles.benefitDot,
              { backgroundColor: colors.fastingColor },
            ]}
          />
          <Text style={[styles.benefitText, { color: colors.text }]}>
            {t('fatBurningBegins')}
          </Text>
        </View>
        <View
          style={[
            styles.benefitItem,
            { opacity: isFasting && progress >= 50 ? 1 : 0.5 },
          ]}
        >
          <View
            style={[
              styles.benefitDot,
              { backgroundColor: colors.fastingColor },
            ]}
          />
          <Text style={[styles.benefitText, { color: colors.text }]}>
            {t('autophagyActivated')}
          </Text>
        </View>
        <View
          style={[
            styles.benefitItem,
            { opacity: isFasting && progress >= 75 ? 1 : 0.5 },
          ]}
        >
          <View
            style={[
              styles.benefitDot,
              { backgroundColor: colors.fastingColor },
            ]}
          />
          <Text style={[styles.benefitText, { color: colors.text }]}>
            {t('growthHormoneIncreased')}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  badgeText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 12,
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  timeContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  timeValue: {
    fontSize: 32,
    fontWeight: '700',
  },
  timeLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  progressRing: {
    width: '100%',
    height: 12,
    borderRadius: 6,
    justifyContent: 'center',
    overflow: 'hidden',
  },
  progressFill: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    borderRadius: 6,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  infoItem: {
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 12,
    opacity: 0.7,
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  fastingBenefits: {
    marginTop: 8,
  },
  fastingBenefitsTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  benefitDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  benefitText: {
    fontSize: 12,
  },
});
