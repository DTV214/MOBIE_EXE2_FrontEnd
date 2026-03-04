// src/presentation/screens/SettingsScreen.tsx
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Switch } from 'react-native';
import tw from '../../../utils/tailwind';
import {
  ChevronLeft,
  User,
  Bell,
  ShieldCheck,
  CircleHelp,
  LogOut,
  ChevronRight,
  Moon,
  Crown,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '../../viewmodels/useAuthStore'; // Import Store
import { CommonActions } from '@react-navigation/native'; // Dùng để reset stack điều hướng
const SettingsScreen = () => {
  const navigation = useNavigation<any>();
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const logout = useAuthStore(state => state.logout); // Lấy hàm logout từ store
  const handleLogout = async () => {
    await logout();

    // Reset điều hướng để người dùng không thể nhấn "Back" quay lại app
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      }),
    );
  };
  return (
    <View style={tw`flex-1 bg-background`}>
      {/* Header */}
      <View
        style={tw`pt-12 pb-4 px-6 bg-white flex-row items-center border-b border-gray-50`}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mr-4`}>
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold text-dark`}>Cài đặt</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={tw`flex-1 px-6 pt-6`}
      >
        {/* Section: Tài khoản */}
        <Text
          style={tw`text-sm font-bold text-gray-400 uppercase tracking-wider mb-4`}
        >
          Tài khoản
        </Text>
        <View style={tw`bg-white rounded-3xl p-2 mb-8 shadow-sm`}>
          <SettingItem
            icon={<User size={20} color="#22C55E" />}
            title="Thông tin cá nhân"
          />
          <SettingItem
            icon={<Crown size={20} color="#F59E0B" />}
            title="Gói dịch vụ của tôi"
            onPress={() => navigation.navigate('MySubscription')}
          />
          <SettingItem
            icon={<ShieldCheck size={20} color="#22C55E" />}
            title="Mật khẩu & Bảo mật"
          />
          <SettingItem
            icon={<Bell size={20} color="#22C55E" />}
            title="Thông báo"
            border={false}
          />
        </View>

        {/* Section: Ứng dụng */}
        <Text
          style={tw`text-sm font-bold text-gray-400 uppercase tracking-wider mb-4`}
        >
          Ứng dụng
        </Text>
        <View style={tw`bg-white rounded-3xl p-2 mb-8 shadow-sm`}>
          <View
            style={tw`flex-row justify-between items-center p-4 border-b border-gray-50`}
          >
            <View style={tw`flex-row items-center`}>
              <View style={tw`bg-gray-100 p-2 rounded-xl mr-3`}>
                <Moon size={20} color="#6B7280" />
              </View>
              <Text style={tw`text-base font-medium text-dark`}>
                Chế độ tối
              </Text>
            </View>
            <Switch
              value={isDarkMode}
              onValueChange={setIsDarkMode}
              trackColor={{ false: '#E5E7EB', true: '#BBF7D0' }}
              thumbColor={isDarkMode ? '#22C55E' : '#F3F4F6'}
            />
          </View>
          <SettingItem
            icon={<CircleHelp size={20} color="#22C55E" />}
            title="Trợ giúp & Hỗ trợ"
            border={false}
          />
        </View>

        {/* Đăng xuất */}
        <TouchableOpacity
          onPress={handleLogout} // Gắn sự kiện nhấn nút
          style={tw`flex-row items-center justify-center p-4 bg-red-50 rounded-2xl mb-10`}
        >
          <LogOut size={20} color="#EF4444" />
          <Text style={tw`text-red-600 font-bold ml-2`}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const SettingItem = ({ icon, title, border = true, onPress }: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={tw`flex-row justify-between items-center p-4 ${border ? 'border-b border-gray-50' : ''
      }`}
  >
    <View style={tw`flex-row items-center`}>
      <View style={tw`bg-primaryLight p-2 rounded-xl mr-3`}>{icon}</View>
      <Text style={tw`text-base font-medium text-dark`}>{title}</Text>
    </View>
    <ChevronRight size={18} color="#9CA3AF" />
  </TouchableOpacity>
);

export default SettingsScreen;
