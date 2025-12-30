import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Import useNavigation
import { Settings as SettingsIcon } from 'lucide-react-native'; // Import icon Settings

import { useUserStore } from '../../viewmodels/useUserStore';
import tw from '../../../utils/tailwind';

const ProfileScreen = () => {
  const { user, loading, fetchUser } = useUserStore();
  const navigation = useNavigation<any>(); // Khởi tạo navigation

  useEffect(() => {
    fetchUser('user_001'); // Đang dùng ID cứng user_001 như trong code của bạn
  }, [fetchUser]);

  if (loading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={tw`mt-4 text-gray-400`}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-gray-50 p-5`}>
      {/* Header Profile có chứa tiêu đề và nút Settings */}
      <View style={tw`flex-row justify-between items-center mb-6 mt-10`}>
        <Text style={tw`text-2xl font-bold text-gray-900`}>Hồ Sơ Sức Khỏe</Text>
        {/* Nút Settings mới thêm vào */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Settings')} // Chuyển sang màn hình Settings
          style={tw`p-2 bg-white rounded-xl shadow-sm border border-gray-100`}
        >
          <SettingsIcon size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      {user ? (
        <View
          style={tw`bg-white p-5 rounded-2xl shadow-sm border border-gray-100`}
        >
          <InfoRow label="Họ và Tên" value={user.name} />
          <InfoRow label="Email" value={user.email} />

          <View
            style={tw`mt-4 bg-green-50 p-4 rounded-xl border border-green-100`}
          >
            <Text style={tw`text-center text-green-700 font-bold text-lg`}>
              {/* Lưu ý: Đảm bảo User entity của bạn có thuộc tính bmi */}
              BMI: {user.bmi}
            </Text>
          </View>
        </View>
      ) : (
        <View style={tw`items-center mt-10`}>
          <Text style={tw`text-gray-500`}>Không có dữ liệu người dùng</Text>
        </View>
      )}
    </View>
  );
};

// Component con để code gọn hơn
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={tw`flex-row justify-between py-3 border-b border-gray-100`}>
    <Text style={tw`text-gray-500`}>{label}</Text>
    <Text style={tw`font-semibold text-gray-800`}>{value}</Text>
  </View>
);

export default ProfileScreen;
