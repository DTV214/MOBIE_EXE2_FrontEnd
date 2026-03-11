// src/presentation/navigation/MainTabNavigator.tsx
import React from 'react';
import { Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Home,
  Hospital,
  Bot,
  User,
  LayoutList,
  Book,
} from 'lucide-react-native';
import tw from '../../utils/tailwind';
import { moderateScale, fs, verticalScale, isTablet, isSmallDevice } from '../../utils/responsive';

// Import các màn hình
import DashboardScreen from '../screens/Dashboard_Screen/DashboardScreen';
// import HospitalSearchScreen from '../screens/Hospital_Screen/HospitalSearchScreen';
import HospitalListScreen from '../screens/Hospital_Screen/HospitalListScreen';
import AIChatScreen from '../screens/AI_Screen/AIChatScreen';
import ForumScreen from '../screens/Forum_Screen/ForumScreen';
import DailyLogScreen from '../screens/Tracking_Daily_Screen/DailyLogScreen';

// --- SỬA LỖI TẠI ĐÂY ---
// Trước đây bạn import SettingsScreen, giờ đổi lại thành ProfileScreen chuẩn
import ProfileScreen from '../screens/Profile_Screen/ProfileScreen';

const Tab = createBottomTabNavigator();

// Tách hàm render icon để code gọn gàng - dùng responsive icon size
const renderTabBarIcon =
  (routeName: string) =>
  ({ color, size }: { color: string; size: number }) => {
    // Scale icon size cho phù hợp thiết bị
    const iconSize = moderateScale(isSmallDevice() ? 20 : 22, 0.3);
    switch (routeName) {
      case 'Trang chủ':
        return <Home size={iconSize} color={color} />;
      case 'Bệnh viện':
        return <Hospital size={iconSize} color={color} />;
      case 'Diễn đàn':
        return <LayoutList size={iconSize} color={color} />;
      case 'AI':
        return <Bot size={iconSize} color={color} />;
      case 'Hồ sơ':
        return <User size={iconSize} color={color} />;
      case 'Nhật ký':
        return <Book size={iconSize} color={color} />;
      default:
        return null;
    }
  };

// Responsive tab bar height
const TAB_BAR_HEIGHT = verticalScale(isTablet() ? 70 : 60);
const TAB_LABEL_SIZE = fs(isSmallDevice() ? 9 : 10);

const MainTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: '#7FB069', // Màu xanh chủ đạo
        tabBarInactiveTintColor: '#9CA3AF', // Màu xám
        tabBarStyle: {
          ...tw`bg-white border-t border-gray-100 shadow-lg`,
          height: TAB_BAR_HEIGHT,
          paddingBottom: verticalScale(4),
          paddingTop: verticalScale(4),
        },
        tabBarLabelStyle: {
          fontSize: TAB_LABEL_SIZE,
          fontWeight: '500' as const,
        },
        tabBarIconStyle: {
          marginBottom: -2,
        },
        tabBarIcon: renderTabBarIcon(route.name),
      })}
    >
      <Tab.Screen name="Trang chủ" component={DashboardScreen} />
      <Tab.Screen name="Bệnh viện" component={HospitalListScreen} />
      <Tab.Screen name="Nhật ký" component={DailyLogScreen} />
      <Tab.Screen name="Diễn đàn" component={ForumScreen} />
      <Tab.Screen name="AI" component={AIChatScreen} />
      {/* Tab này giờ sẽ hiển thị đúng ProfileScreen (có BMI, tên user) */}
      <Tab.Screen name="Hồ sơ" component={ProfileScreen} />
    </Tab.Navigator>
  );
};

export default MainTabNavigator;
