import { Tabs } from 'expo-router';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Home, Camera, BarChart3, User, BookOpen } from 'lucide-react-native';
import Colors from '@/constants/Colors';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '@/contexts/ThemeContext';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TabLayout() {
  const { currentTheme } = useTheme();
  const { t } = useLanguage();
  const colors = Colors[currentTheme];

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primaryColor,
        tabBarInactiveTintColor: colors.tabIconDefault,
        tabBarStyle: {
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          elevation: 8,
          backgroundColor: colors.cardBackground,
          borderTopWidth: 1,
          borderTopColor: colors.borderColor,
          height: 85,
          paddingTop: 8,
          paddingBottom: 20,
          paddingHorizontal: 20,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: -2,
          },
          shadowOpacity: 0.1,
          shadowRadius: 8,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 4,
        },
        tabBarItemStyle: {
          paddingVertical: 8,
        },
        headerShown: false,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('home'),
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.activeIconContainer,
              ]}
            >
              <Home
                size={focused ? 26 : 24}
                color={color}
                strokeWidth={focused ? 2.5 : 2}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="journal"
        options={{
          title: t('journal'),
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.activeIconContainer,
              ]}
            >
              <BookOpen
                size={focused ? 26 : 24}
                color={color}
                strokeWidth={focused ? 2.5 : 2}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="track"
        options={{
          title: '',
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={[
                styles.centerButton,
                {
                  backgroundColor: colors.primaryColor,
                  shadowColor: colors.primaryColor,
                },
              ]}
            >
              <Camera size={28} color="#FFFFFF" strokeWidth={2.5} />
            </View>
          ),
          tabBarButton: (props: any) => (
            <TouchableOpacity
              {...props}
              style={[props.style, styles.centerButtonContainer]}
            />
          ),
        }}
      />

      <Tabs.Screen
        name="progress"
        options={{
          title: t('stats'),
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.activeIconContainer,
              ]}
            >
              <BarChart3
                size={focused ? 26 : 24}
                color={color}
                strokeWidth={focused ? 2.5 : 2}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: t('settings'),
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={[
                styles.iconContainer,
                focused && styles.activeIconContainer,
              ]}
            >
              <User
                size={focused ? 26 : 24}
                color={color}
                strokeWidth={focused ? 2.5 : 2}
              />
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="fasting-details"
        options={{
          href: null,
        }}
      />

      <Tabs.Screen
        name="app-settings"
        options={{
          href: null,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 32,
    height: 32,
  },
  activeIconContainer: {
    transform: [{ scale: 1.1 }],
  },
  centerButtonContainer: {
    top: -15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  centerButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    borderWidth: 4,
    borderColor: '#FFFFFF',
  },
});
