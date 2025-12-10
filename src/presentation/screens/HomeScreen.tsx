// src/presentation/screens/HomeScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import tw from 'twrnc'; // <-- Import này quan trọng
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={tw`flex-1 justify-center items-center bg-white p-5`}>
      <Text style={tw`text-3xl font-bold text-green-600 mb-4`}>
        Xin chào Sarah 👋
      </Text>
      <Text style={tw`text-gray-500 mb-8`}>
        Ứng dụng HealthApp đã chạy thành công!
      </Text>

      <TouchableOpacity
        style={tw`bg-green-500 px-6 py-3 rounded-full`}
        onPress={() => navigation.navigate('Dashboard')} // Đảm bảo tên route đúng
      >
        <Text style={tw`text-white font-bold`}>Vào Dashboard</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
