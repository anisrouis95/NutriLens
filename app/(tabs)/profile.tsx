import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { getUserData, updateUserData } from '@/services/dataService';

export default function ProfileScreen() {
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  const colors = Colors[currentTheme];
  const router = useRouter();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    activityLevel: '',
    dietType: '',
    fastingSchedule: {
      enabled: true,
      startTime: '',
      endTime: '',
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const user = await getUserData();
        setUserData(user);
        setFormData({
          name: user.name,
          age: user.age.toString(),
          gender: user.gender,
          height: user.height.toString(),
          weight: user.weight.toString(),
          activityLevel: user.activityLevel,
          dietType: user.dietType,
          fastingSchedule: {
            enabled: user.fastingSchedule.enabled,
            startTime: user.fastingSchedule.startTime,
            endTime: user.fastingSchedule.endTime,
          },
        });
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  const handleFastingChange = (field, value) => {
    setFormData({
      ...formData,
      fastingSchedule: {
        ...formData.fastingSchedule,
        [field]: value,
      },
    });
  };

  const handleSave = async () => {
    try {
      // Convert string values to appropriate types
      const processedData = {
        ...formData,
        age: parseInt(formData.age, 10),
        height: parseInt(formData.height, 10),
        weight: parseFloat(formData.weight),
      };

      await updateUserData(processedData);
      setUserData({
        ...userData,
        ...processedData,
      });
      setEditMode(false);
    } catch (error) {
      console.error('Error updating user data:', error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        style={[styles.container, { backgroundColor: colors.background }]}
      >
        <View style={styles.loadingContainer}>
          <Text style={[styles.loadingText, { color: colors.text }]}>
            Loading...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (editMode) {
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
              {t('editProfile')}
            </Text>
          </View>

          <View
            style={[
              styles.formSection,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('personalInformation')}
            </Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                {t('name')}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: colors.background, color: colors.text },
                ]}
                value={formData.name}
                onChangeText={(value) => handleInputChange('name', value)}
                placeholder={t('yourName')}
                placeholderTextColor={colors.tabIconDefault}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                {t('age')}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: colors.background, color: colors.text },
                ]}
                value={formData.age}
                onChangeText={(value) => handleInputChange('age', value)}
                placeholder={t('yourAge')}
                placeholderTextColor={colors.tabIconDefault}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                {t('gender')}
              </Text>
              <View style={styles.genderSelector}>
                <TouchableOpacity
                  style={[
                    styles.genderOption,
                    formData.gender === 'male' && {
                      backgroundColor: colors.primaryColor,
                    },
                    { borderColor: colors.borderColor },
                  ]}
                  onPress={() => handleInputChange('gender', 'male')}
                >
                  <Text
                    style={[
                      styles.genderOptionText,
                      {
                        color:
                          formData.gender === 'male' ? '#FFFFFF' : colors.text,
                      },
                    ]}
                  >
                    {t('male')}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.genderOption,
                    formData.gender === 'female' && {
                      backgroundColor: colors.primaryColor,
                    },
                    { borderColor: colors.borderColor },
                  ]}
                  onPress={() => handleInputChange('gender', 'female')}
                >
                  <Text
                    style={[
                      styles.genderOptionText,
                      {
                        color:
                          formData.gender === 'female'
                            ? '#FFFFFF'
                            : colors.text,
                      },
                    ]}
                  >
                    {t('female')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                {t('heightCm')}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: colors.background, color: colors.text },
                ]}
                value={formData.height}
                onChangeText={(value) => handleInputChange('height', value)}
                placeholder={t('yourHeightCm')}
                placeholderTextColor={colors.tabIconDefault}
                keyboardType="number-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                {t('weightKg')}
              </Text>
              <TextInput
                style={[
                  styles.input,
                  { backgroundColor: colors.background, color: colors.text },
                ]}
                value={formData.weight}
                onChangeText={(value) => handleInputChange('weight', value)}
                placeholder={t('yourWeightKg')}
                placeholderTextColor={colors.tabIconDefault}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          <View
            style={[
              styles.formSection,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('dietPreferences')}
            </Text>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                {t('activityLevel')}
              </Text>
              <View style={styles.selectInput}>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colors.background, color: colors.text },
                  ]}
                  value={formData.activityLevel}
                  onChangeText={(value) =>
                    handleInputChange('activityLevel', value)
                  }
                  placeholder={t('selectActivityLevel')}
                  placeholderTextColor={colors.tabIconDefault}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>
                {t('dietType')}
              </Text>
              <View style={styles.selectInput}>
                <TextInput
                  style={[
                    styles.input,
                    { backgroundColor: colors.background, color: colors.text },
                  ]}
                  value={formData.dietType}
                  onChangeText={(value) => handleInputChange('dietType', value)}
                  placeholder={t('selectDietType')}
                  placeholderTextColor={colors.tabIconDefault}
                />
              </View>
            </View>
          </View>

          <View
            style={[
              styles.formSection,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <View style={styles.fastingHeader}>
              <Text style={[styles.sectionTitle, { color: colors.text }]}>
                {t('intermittentFasting')}
              </Text>
              <Switch
                value={formData.fastingSchedule.enabled}
                onValueChange={(value) => handleFastingChange('enabled', value)}
                trackColor={{
                  false: colors.borderColor,
                  true: colors.primaryColor,
                }}
                thumbColor="#FFFFFF"
              />
            </View>

            {formData.fastingSchedule.enabled && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>
                    {t('fastingStartTime')}
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.background,
                        color: colors.text,
                      },
                    ]}
                    value={formData.fastingSchedule.startTime}
                    onChangeText={(value) =>
                      handleFastingChange('startTime', value)
                    }
                    placeholder={t('hhmm')}
                    placeholderTextColor={colors.tabIconDefault}
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>
                    {t('fastingEndTime')}
                  </Text>
                  <TextInput
                    style={[
                      styles.input,
                      {
                        backgroundColor: colors.background,
                        color: colors.text,
                      },
                    ]}
                    value={formData.fastingSchedule.endTime}
                    onChangeText={(value) =>
                      handleFastingChange('endTime', value)
                    }
                    placeholder={t('hhmm')}
                    placeholderTextColor={colors.tabIconDefault}
                  />
                </View>
              </>
            )}
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.errorColor }]}
              onPress={() => setEditMode(false)}
            >
              <Text style={styles.buttonText}>{t('cancel')}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: colors.primaryColor }]}
              onPress={handleSave}
            >
              <Text style={styles.buttonText}>{t('save')}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
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
          <Text style={[styles.title, { color: colors.text }]}>
            {t('profile')}
          </Text>
        </View>

        <View
          style={[
            styles.profileHeader,
            { backgroundColor: colors.cardBackground },
          ]}
        >
          <View
            style={[
              styles.profileAvatar,
              { backgroundColor: colors.primaryColor },
            ]}
          >
            <Text style={styles.profileInitial}>
              {userData.name.charAt(0).toUpperCase()}
            </Text>
          </View>

          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: colors.text }]}>
              {userData.name}
            </Text>
            <Text style={[styles.profileDetails, { color: colors.text }]}>
              {userData.age} years, {userData.gender}
            </Text>
            <Text style={[styles.profileDetails, { color: colors.text }]}>
              {userData.height} cm, {userData.weight} kg
            </Text>
          </View>

          <TouchableOpacity
            style={styles.editButton}
            onPress={() => setEditMode(true)}
          >
            <Text
              style={[styles.editButtonText, { color: colors.primaryColor }]}
            >
              {t('edit')}
            </Text>
          </TouchableOpacity>
        </View>

        <View
          style={[styles.section, { backgroundColor: colors.cardBackground }]}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('dietInfo')}
            </Text>
          </View>

          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              {t('activityLevel')}
            </Text>
            <Text style={[styles.settingValue, { color: colors.text }]}>
              {userData.activityLevel}
            </Text>
          </View>

          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              {t('dietType')}
            </Text>
            <Text style={[styles.settingValue, { color: colors.text }]}>
              {userData.dietType}
            </Text>
          </View>

          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              {t('dailyCalorieGoal')}
            </Text>
            <Text style={[styles.settingValue, { color: colors.text }]}>
              {userData.calorieGoal} kcal
            </Text>
          </View>

          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              {t('proteinGoal')}
            </Text>
            <Text style={[styles.settingValue, { color: colors.text }]}>
              {userData.proteinGoal} g
            </Text>
          </View>

          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              {t('carbsGoal')}
            </Text>
            <Text style={[styles.settingValue, { color: colors.text }]}>
              {userData.carbsGoal} g
            </Text>
          </View>

          <View style={styles.settingItem}>
            <Text style={[styles.settingLabel, { color: colors.text }]}>
              {t('fatGoal')}
            </Text>
            <Text style={[styles.settingValue, { color: colors.text }]}>
              {userData.fatGoal} g
            </Text>
          </View>
        </View>

        <View
          style={[styles.section, { backgroundColor: colors.cardBackground }]}
        >
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>
              {t('fastingSchedule')}
            </Text>
            <Switch
              value={userData.fastingSchedule.enabled}
              disabled={true}
              trackColor={{
                false: colors.borderColor,
                true: colors.primaryColor,
              }}
              thumbColor="#FFFFFF"
            />
          </View>

          {userData.fastingSchedule.enabled && (
            <>
              <View style={styles.settingItem}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  {t('fastingWindow')}
                </Text>
                <Text style={[styles.settingValue, { color: colors.text }]}>
                  {userData.fastingSchedule.startTime} -{' '}
                  {userData.fastingSchedule.endTime}
                </Text>
              </View>

              <View style={styles.settingItem}>
                <Text style={[styles.settingLabel, { color: colors.text }]}>
                  {t('fastingDuration')}
                </Text>
                <Text style={[styles.settingValue, { color: colors.text }]}>
                  {userData.fastingSchedule.duration} {t('hours')}
                </Text>
              </View>
            </>
          )}
        </View>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: colors.cardBackground }]}
          onPress={() => router.push('/(tabs)/app-settings')}
        >
          <Text style={[styles.menuItemText, { color: colors.text }]}>
            {t('appSettings')}
          </Text>
          <ChevronRight size={20} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: colors.cardBackground }]}
        >
          <Text style={[styles.menuItemText, { color: colors.text }]}>
            {t('nutritionGoals')}
          </Text>
          <ChevronRight size={20} color={colors.text} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.menuItem, { backgroundColor: colors.cardBackground }]}
        >
          <Text style={[styles.menuItemText, { color: colors.text }]}>
            {t('helpSupport')}
          </Text>
          <ChevronRight size={20} color={colors.text} />
        </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: '700',
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 24,
  },
  profileAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInitial: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
    marginLeft: 16,
  },
  profileName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  profileDetails: {
    fontSize: 14,
    opacity: 0.7,
  },
  editButton: {
    padding: 8,
  },
  editButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  section: {
    borderRadius: 16,
    marginBottom: 16,
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.1)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(0,0,0,0.05)',
  },
  settingLabel: {
    fontSize: 16,
  },
  settingValue: {
    fontSize: 16,
    fontWeight: '500',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 8,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '500',
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
  formSection: {
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  genderSelector: {
    flexDirection: 'row',
  },
  genderOption: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
    borderRadius: 8,
  },
  genderOptionText: {
    fontWeight: '500',
  },
  selectInput: {
    borderRadius: 8,
  },
  fastingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    marginBottom: 32,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
