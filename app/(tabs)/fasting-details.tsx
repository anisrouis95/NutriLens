import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import {
  ArrowLeft,
  Settings,
  Square,
  Clock,
  Calendar,
  TrendingUp,
} from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

type FastingBenefit = {
  title: string;
  description: string;
  hoursRequired: number;
  achieved: boolean;
};

type FastingHistoryEntry = {
  id: string;
  date: string;
  duration: number;
  targetDuration: number;
  startTime: string;
  endTime: string;
  status: 'completed' | 'partial' | 'active';
};

export default function FastingDetailsScreen() {
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  const colors = Colors[currentTheme];
  const router = useRouter();

  // Mock data - in real app this would come from your state management
  const [currentFast, setCurrentFast] = useState({
    isActive: true,
    startTime: new Date('2024-05-13T20:00:00'),
    targetDuration: 16, // hours
    currentDuration: 14.2, // hours
  });

  const [fastingSchedule] = useState({
    startTime: '20:00',
    endTime: '12:00',
    fastingHours: 16,
    eatingHours: 8,
  });

  const [fastingHistory] = useState<FastingHistoryEntry[]>([
    {
      id: '1',
      date: 'May 12-13',
      duration: 16,
      targetDuration: 16,
      startTime: '8:30 PM',
      endTime: '12:30 PM',
      status: 'completed',
    },
    {
      id: '2',
      date: 'May 11-12',
      duration: 14,
      targetDuration: 16,
      startTime: '9:00 PM',
      endTime: '11:00 AM',
      status: 'completed',
    },
    {
      id: '3',
      date: 'May 10-11',
      duration: 12,
      targetDuration: 16,
      startTime: '8:00 PM',
      endTime: '8:00 AM',
      status: 'partial',
    },
  ]);

  const fastingBenefits: FastingBenefit[] = [
    {
      title: t('fatBurningActivated'),
      description: t('fatBurningDescription'),
      hoursRequired: 12,
      achieved: currentFast.currentDuration >= 12,
    },
    {
      title: t('hghIncreasing'),
      description: t('hghDescription'),
      hoursRequired: 14,
      achieved: currentFast.currentDuration >= 14,
    },
    {
      title: t('autophagyBegins'),
      description: t('autophagyDescription'),
      hoursRequired: 16,
      achieved: currentFast.currentDuration >= 16,
    },
  ];

  const calculateProgress = () => {
    return Math.min(
      (currentFast.currentDuration / currentFast.targetDuration) * 100,
      100
    );
  };

  const formatTime = (hours: number) => {
    const h = Math.floor(hours);
    const m = Math.floor((hours - h) * 60);
    return `${h}:${m.toString().padStart(2, '0')}`;
  };

  const getEndTime = () => {
    const endTime = new Date(currentFast.startTime);
    endTime.setHours(endTime.getHours() + currentFast.targetDuration);
    return endTime.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const handleEndFast = () => {
    Alert.alert(t('endFastTitle'), t('endFastMessage'), [
      { text: t('cancel'), style: 'cancel' },
      {
        text: t('endFast'),
        style: 'destructive',
        onPress: () => {
          // In real app, update the fasting state
          setCurrentFast((prev) => ({ ...prev, isActive: false }));
          Alert.alert(t('fastEnded'), t('fastEndedMessage'));
        },
      },
    ]);
  };

  const handleAdjustPlan = () => {
    // Navigate to plan adjustment screen
    Alert.alert(t('adjustPlan'), t('adjustPlanMessage'));
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
          {t('fastingDetails')}
        </Text>
        <TouchableOpacity
          onPress={handleAdjustPlan}
          style={styles.settingsButton}
        >
          <Settings size={24} color={colors.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Current Fast Status */}
        <View
          style={[
            styles.currentFastCard,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <View style={styles.currentFastHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('currentFast')}
            </Text>
            <View
              style={[
                styles.statusBadge,
                {
                  backgroundColor: currentFast.isActive
                    ? colors.fastingColor
                    : colors.tabIconDefault,
                },
              ]}
            >
              <Text style={styles.statusText}>
                {currentFast.isActive ? t('active') : t('inactive')}
              </Text>
            </View>
          </View>

          {/* Circular Progress */}
          <View style={styles.progressContainer}>
            <View style={styles.circularProgress}>
              <View
                style={[
                  styles.progressCircle,
                  { borderColor: colors.borderColor },
                ]}
              >
                <View
                  style={[
                    styles.progressArc,
                    {
                      backgroundColor: colors.fastingColor,
                      transform: [
                        { rotate: `${(calculateProgress() / 100) * 360}deg` },
                      ],
                    },
                  ]}
                />
                <View style={styles.progressContent}>
                  <Text style={[styles.progressTime, { color: colors.text }]}>
                    {formatTime(currentFast.currentDuration)}
                  </Text>
                  <Text
                    style={[
                      styles.progressLabel,
                      { color: colors.text, opacity: 0.7 },
                    ]}
                  >
                    {t('hoursMinutes')}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Fast Details */}
          <View style={styles.fastDetails}>
            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text
                  style={[
                    styles.detailLabel,
                    { color: colors.text, opacity: 0.7 },
                  ]}
                >
                  {t('started')}
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {currentFast.startTime.toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text
                  style={[
                    styles.detailLabel,
                    { color: colors.text, opacity: 0.7 },
                  ]}
                >
                  {t('endTime')}
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {getEndTime()}
                </Text>
              </View>
            </View>

            <View style={styles.detailRow}>
              <View style={styles.detailItem}>
                <Text
                  style={[
                    styles.detailLabel,
                    { color: colors.text, opacity: 0.7 },
                  ]}
                >
                  {t('target')}
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {currentFast.targetDuration} {t('hours')}
                </Text>
              </View>
              <View style={styles.detailItem}>
                <Text
                  style={[
                    styles.detailLabel,
                    { color: colors.text, opacity: 0.7 },
                  ]}
                >
                  {t('progressText')}
                </Text>
                <Text style={[styles.detailValue, { color: colors.text }]}>
                  {calculateProgress().toFixed(1)}% {t('completeText')}
                </Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity
              style={[
                styles.adjustButton,
                { backgroundColor: colors.primaryColor },
              ]}
              onPress={handleAdjustPlan}
            >
              <Settings size={16} color="#FFFFFF" />
              <Text style={styles.adjustButtonText}>{t('adjustPlan')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.endButton, { backgroundColor: colors.errorColor }]}
              onPress={handleEndFast}
            >
              <Square size={16} color="#FFFFFF" />
              <Text style={styles.endButtonText}>{t('endFast')}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Fasting Plan */}
        <View
          style={[styles.planCard, { backgroundColor: colors.cardBackground }]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('yourFastingPlan')}
          </Text>

          <View style={styles.planInfo}>
            <View style={styles.planHeader}>
              <Clock size={20} color={colors.fastingColor} />
              <Text style={[styles.planTitle, { color: colors.text }]}>
                {t('intermittentFastingPattern')}
              </Text>
            </View>
            <Text
              style={[
                styles.planDescription,
                { color: colors.text, opacity: 0.7 },
              ]}
            >
              {t('fastingEatingDescription')}
            </Text>
          </View>

          {/* Timeline Visualization */}
          <View style={styles.timeline}>
            <View style={styles.timeLabels}>
              <Text
                style={[styles.timeLabel, { color: colors.text, opacity: 0.7 }]}
              >
                12 AM
              </Text>
              <Text
                style={[styles.timeLabel, { color: colors.text, opacity: 0.7 }]}
              >
                6 AM
              </Text>
              <Text
                style={[styles.timeLabel, { color: colors.text, opacity: 0.7 }]}
              >
                12 PM
              </Text>
              <Text
                style={[styles.timeLabel, { color: colors.text, opacity: 0.7 }]}
              >
                6 PM
              </Text>
              <Text
                style={[styles.timeLabel, { color: colors.text, opacity: 0.7 }]}
              >
                12 AM
              </Text>
            </View>

            <View style={styles.timelineBar}>
              <View
                style={[
                  styles.fastingPeriod,
                  { backgroundColor: colors.fastingColor },
                ]}
              />
              <View
                style={[
                  styles.eatingPeriod,
                  { backgroundColor: colors.successColor },
                ]}
              />
            </View>

            <View style={styles.periodLabels}>
              <View style={styles.periodLabel}>
                <View
                  style={[
                    styles.periodDot,
                    { backgroundColor: colors.fastingColor },
                  ]}
                />
                <Text style={[styles.periodText, { color: colors.text }]}>
                  {t('fasting')}
                </Text>
              </View>
              <View style={styles.periodLabel}>
                <View
                  style={[
                    styles.periodDot,
                    { backgroundColor: colors.successColor },
                  ]}
                />
                <Text style={[styles.periodText, { color: colors.text }]}>
                  {t('eatingWindow')}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Fasting History */}
        <View
          style={[
            styles.historyCard,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('fastingHistory')}
          </Text>

          {fastingHistory.map((entry) => (
            <View key={entry.id} style={styles.historyEntry}>
              <View style={styles.historyInfo}>
                <Text style={[styles.historyDate, { color: colors.text }]}>
                  {entry.date}
                </Text>
                <Text
                  style={[
                    styles.historyDuration,
                    { color: colors.text, opacity: 0.7 },
                  ]}
                >
                  {entry.duration} {t('hourFast')}
                </Text>
              </View>

              <View style={styles.historyDetails}>
                <View
                  style={[
                    styles.historyStatus,
                    {
                      backgroundColor:
                        entry.status === 'completed'
                          ? colors.successColor
                          : colors.warningColor,
                    },
                  ]}
                >
                  <Text style={styles.historyStatusText}>
                    {entry.status === 'completed'
                      ? t('completed')
                      : t('partial')}
                  </Text>
                </View>
                <Text
                  style={[
                    styles.historyTime,
                    { color: colors.text, opacity: 0.7 },
                  ]}
                >
                  {entry.startTime} - {entry.endTime}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Benefits */}
        <View
          style={[
            styles.benefitsCard,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            {t('benefitsAtCurrentStage')}
          </Text>

          {fastingBenefits.map((benefit, index) => (
            <View key={index} style={styles.benefitItem}>
              <View
                style={[
                  styles.benefitCheck,
                  {
                    backgroundColor: benefit.achieved
                      ? colors.successColor
                      : colors.borderColor,
                    opacity: benefit.achieved ? 1 : 0.3,
                  },
                ]}
              >
                <Text style={styles.benefitCheckmark}>✓</Text>
              </View>

              <View style={styles.benefitContent}>
                <Text
                  style={[
                    styles.benefitTitle,
                    {
                      color: colors.text,
                      opacity: benefit.achieved ? 1 : 0.5,
                    },
                  ]}
                >
                  {benefit.title} ({benefit.hoursRequired}+ hours)
                </Text>
                <Text
                  style={[
                    styles.benefitDescription,
                    {
                      color: colors.text,
                      opacity: benefit.achieved ? 0.7 : 0.3,
                    },
                  ]}
                >
                  {benefit.description}
                </Text>
              </View>
            </View>
          ))}
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
  settingsButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  currentFastCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  currentFastHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  circularProgress: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressCircle: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 8,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  progressArc: {
    position: 'absolute',
    width: 160,
    height: 80,
    borderRadius: 80,
    top: 0,
  },
  progressContent: {
    alignItems: 'center',
  },
  progressTime: {
    fontSize: 32,
    fontWeight: '700',
  },
  progressLabel: {
    fontSize: 14,
    marginTop: 4,
  },
  fastDetails: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  detailItem: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  adjustButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  adjustButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  endButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: 12,
    gap: 8,
  },
  endButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  planCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  planInfo: {
    marginBottom: 20,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  planDescription: {
    fontSize: 14,
  },
  timeline: {
    marginTop: 16,
  },
  timeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timeLabel: {
    fontSize: 12,
  },
  timelineBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: 4,
    marginBottom: 12,
  },
  fastingPeriod: {
    flex: 0.67,
    borderTopLeftRadius: 4,
    borderBottomLeftRadius: 4,
  },
  eatingPeriod: {
    flex: 0.33,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
  },
  periodLabels: {
    flexDirection: 'row',
    gap: 16,
  },
  periodLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  periodDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  periodText: {
    fontSize: 12,
  },
  historyCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  historyEntry: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  historyInfo: {
    flex: 1,
  },
  historyDate: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  historyDuration: {
    fontSize: 14,
  },
  historyDetails: {
    alignItems: 'flex-end',
  },
  historyStatus: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    marginBottom: 4,
  },
  historyStatusText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  historyTime: {
    fontSize: 12,
  },
  benefitsCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 100,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
    gap: 12,
  },
  benefitCheck: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  benefitCheckmark: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  benefitContent: {
    flex: 1,
  },
  benefitTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  benefitDescription: {
    fontSize: 12,
    lineHeight: 16,
  },
});
