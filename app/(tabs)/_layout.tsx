import { Tabs } from 'expo-router';
import { NavBar, TabBarProps } from '@/components/ds';
import { useTokens } from '@/theme';

export default function TabLayout() {
  const t = useTokens();
  return (
    <Tabs
      tabBar={(props) => <NavBar {...(props as unknown as TabBarProps)} />}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: t.ground },
        animation: 'fade',
      }}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="train" />
      <Tabs.Screen name="food" />
      <Tabs.Screen name="learn" />
    </Tabs>
  );
}
