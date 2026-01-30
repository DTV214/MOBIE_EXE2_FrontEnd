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

// Import các màn hình
import DashboardScreen from '../screens/Dashboard_Screen/DashboardScreen';
import MealTrackingScreen from '../screens/Meal_Screen/MealTrackingScreen';
import HospitalSearchScreen from '../screens/Hospital_Screen/HospitalSearchScreen';
import AIChatListScreen from '../screens/AI_Screen/AIChatListScreen';
import ForumScreen from '../screens/Forum_Screen/ForumScreen';

// --- SỬA LỖI TẠI ĐÂY ---
// Trước đây bạn import SettingsScreen, giờ đổi lại thành ProfileScreen chuẩn
import ProfileScreen from '../screens/Profile_Screen/ProfileScreen';

const Tab = createBottomTabNavigator();

// Tách hàm render icon để code gọn gàng
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
        tabBarActiveTintColor: '#7FB069', // Màu xanh chủ đạo
        tabBarInactiveTintColor: '#9CA3AF', // Màu xám
        tabBarStyle: tw`bg-white border-t border-gray-100 h-16 pb-2 pt-2 shadow-lg`,
        tabBarLabelStyle: tw`text-[10px] font-medium`,
        tabBarIcon: renderTabBarIcon(route.name),
      })}
    >
      <Tab.Screen name="Trang chủ" component={DashboardScreen} />
      <Tab.Screen name="Bệnh viện" component={HospitalSearchScreen} />
      <Tab.Screen name="Bữa ăn" component={MealTrackingScreen} />
      <Tab.Screen name="Diễn đàn" component={ForumScreen} />
      <Tab.Screen name="AI" component={AIChatListScreen} />
      {/* Tab này giờ sẽ hiển thị đúng ProfileScreen (có BMI, tên user) */}
      <Tab.Screen name="Hồ sơ" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
