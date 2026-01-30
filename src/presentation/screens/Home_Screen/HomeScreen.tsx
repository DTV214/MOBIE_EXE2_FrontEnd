// src/presentation/screens/Home_Screen/HomeScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { useUserStore } from '../../viewmodels/useUserStore'; // Kết nối Store
import tw from '../../../utils/tailwind';

const HomeScreen = () => {
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
    <View style={tw`flex-1 justify-center items-center bg-white p-5`}>
      {loading ? (
        <ActivityIndicator size="large" color="#7FB069" />
      ) : (
        <>
          <Text style={tw`text-3xl font-bold text-green-600 mb-4 text-center`}>
            {/* Hiển thị tên thật thay vì Sarah */}
            Xin chào {user?.fullName || 'Bạn'} 👋
          </Text>
          <Text style={tw`text-gray-500 mb-8 text-center`}>
            Chào mừng bạn quay trở lại với HealthApp!
          </Text>

          <TouchableOpacity
            style={tw`bg-[#7FB069] px-8 py-4 rounded-full shadow-md`}
            onPress={() => navigation.navigate('Main')}
          >
            <Text style={tw`text-white font-bold text-lg`}>Vào Dashboard</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

export default HomeScreen;
