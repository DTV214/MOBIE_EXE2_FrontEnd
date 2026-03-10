// src/presentation/screens/Home_Screen/HomeScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useUserStore } from '../../viewmodels/useUserStore'; // Kết nối Store
import tw from '../../../utils/tailwind';
import { useTheme } from '../../../contexts/ThemeContext';

const HomeScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  // Lấy user và hàm fetch từ Store
  const { user, fetchUserProfile, loading } = useUserStore();

  useEffect(() => {
    // Nếu chưa có user thì gọi API lấy profile ngay
    if (!user) {
      fetchUserProfile();
    }
  }, [user, fetchUserProfile]);

  return (
    <View style={[tw`flex-1 justify-center items-center p-5`, { backgroundColor: colors.background }]}>
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <>
          <Text style={[tw`text-3xl font-bold mb-4 text-center`, { color: colors.primary }]}>
            {/* Hiển thị tên thật thay vì Sarah */}
            Xin chào {user?.fullName || 'Bạn'} 👋
          </Text>
          <Text style={[tw`mb-8 text-center`, { color: colors.textSecondary }]}>
            Chào mừng bạn quay trở lại với HealthApp!
          </Text>

          <TouchableOpacity
            style={[tw`px-8 py-4 rounded-full shadow-md`, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('Main')}
          >
            <Text style={[tw`font-bold text-lg`, { color: '#ffffff' }]}>Vào Dashboard</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default HomeScreen;
