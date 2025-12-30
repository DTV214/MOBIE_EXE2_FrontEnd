// src/presentation/navigation/MainTabNavigator.tsx
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Home,
  Hospital,
  Utensils,
  Bot,
  User,
  LayoutList,
} from 'lucide-react-native';
import tw from '../../utils/tailwind';
import DashboardScreen from '../screens/Dashboard_Screen/DashboardScreen';
import ProfileScreen from '../screens/Setting_Screen/SettingsScreen';
import MealTrackingScreen from '../screens/Meal_Screen/MealTrackingScreen';
import HospitalSearchScreen from '../screens/Hospital_Screen/HospitalSearchScreen';
import AIChatScreen from '../screens/AI_Screen/AIChatScreen';
import ForumScreen from '../screens/Forum_Screen/ForumScreen';

const Tab = createBottomTabNavigator();

// --- TÁCH HÀM NÀY RA NGOÀI ĐỂ TRÁNH WARNING ---
const renderTabBarIcon =
  (routeName: string) =>
  ({ color, size }: { color: string; size: number }) => {
    switch (routeName) {
      case 'Trang chủ':
        return <Home size={size} color={color} />;
      case 'Bệnh viện':
        return <Hospital size={size} color={color} />;
      case 'Bữa ăn':
        return <Utensils size={size} color={color} />;
      case 'Diễn đàn':
        return <LayoutList size={size} color={color} />;
      case 'AI':
        return <Bot size={size} color={color} />;
      case 'Hồ sơ':
        return <User size={size} color={color} />;
      default:
        return null;
    }
  };

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#22C55E',
        tabBarInactiveTintColor: '#9CA3AF',
        tabBarStyle: tw`bg-white border-t border-gray-100 h-16 pb-2 pt-2 shadow-lg`,
        tabBarLabelStyle: tw`text-[10px] font-medium`,
        // --- SỬ DỤNG HÀM ĐÃ TÁCH ---
        tabBarIcon: renderTabBarIcon(route.name),
      })}
    >
      <Tab.Screen name="Trang chủ" component={DashboardScreen} />
      <Tab.Screen name="Bệnh viện" component={HospitalSearchScreen} />
      <Tab.Screen name="Bữa ăn" component={MealTrackingScreen} />
      <Tab.Screen name="Diễn đàn" component={ForumScreen} />
      <Tab.Screen name="AI" component={AIChatScreen} />
      <Tab.Screen name="Hồ sơ" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
