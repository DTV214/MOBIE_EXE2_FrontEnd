// src/presentation/screens/Profile_Screen/ProfileScreen.tsx

import React, { useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  RefreshControl, // Import RefreshControl
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Settings as SettingsIcon } from 'lucide-react-native';

// Import Store
import { useUserStore } from '../../viewmodels/useUserStore';
import tw from '../../../utils/tailwind';

const ProfileScreen = () => {
  // 1. Kết nối với Store
  const { user, loading, error, fetchUserProfile } = useUserStore();
  const navigation = useNavigation<any>();

  // 2. Gọi API khi màn hình hiện lên
  // ✅ Đã thêm fetchUserProfile vào dependency array để tắt warning ESLint
  useEffect(() => {
    fetchUserProfile();
  }, [fetchUserProfile]);

  // 3. Xử lý loading (Chỉ hiện khi chưa có data user lần đầu)
  if (loading && !user) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <ActivityIndicator size="large" color="#2563EB" />
        <Text style={tw`mt-4 text-gray-400`}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  // 4. Xử lý lỗi (nếu mất mạng hoặc token hết hạn)
  if (error && !user) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white p-5`}>
        <Text style={tw`text-red-500 mb-4 text-center`}>{error}</Text>
        <TouchableOpacity
          onPress={() => fetchUserProfile()}
          style={tw`bg-blue-600 px-6 py-3 rounded-xl`}
        >
          <Text style={tw`text-white font-bold`}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      {/* ScrollView bọc ngoài để hỗ trợ kéo xuống refresh (Pull to Refresh) */}
      <ScrollView
        contentContainerStyle={tw`p-5`}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={fetchUserProfile} />
        }
      >
        {/* Header Profile */}
        <View style={tw`flex-row justify-between items-center mb-6 mt-5`}>
          <Text style={tw`text-2xl font-bold text-gray-900`}>
            Hồ Sơ Sức Khỏe
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('Settings')}
            style={tw`p-2 bg-white rounded-xl shadow-sm border border-gray-100`}
          >
            <SettingsIcon size={24} color="#1F2937" />
          </TouchableOpacity>
        </View>

        {user ? (
          <View
            style={tw`bg-white p-5 rounded-2xl shadow-sm border border-gray-100`}
          >
            {/* Thông tin cá nhân */}
            <InfoRow
              label="Họ và Tên"
              value={user.fullName || 'Chưa cập nhật'}
            />
            <InfoRow label="Email" value={user.email || 'Chưa cập nhật'} />

            {/* Format lại Role hiển thị cho thân thiện */}
            <InfoRow
              label="Vai trò"
              value={user.role === 'ROLE_USER' ? 'Người dùng' : user.role}
            />

            {/* Khu vực BMI */}
            <View
              style={tw`mt-4 bg-green-50 p-4 rounded-xl border border-green-100`}
            >
              <Text style={tw`text-center text-green-700 font-bold text-lg`}>
                BMI: {user.bmi ? user.bmi : '--'}
              </Text>
              {!user.bmi && (
                <Text style={tw`text-center text-gray-500 text-xs mt-2 italic`}>
                  (Chưa có dữ liệu sức khỏe từ hệ thống)
                </Text>
              )}
            </View>
          </View>
        ) : (
          <View style={tw`items-center mt-10`}>
            <Text style={tw`text-gray-500`}>
              Không tìm thấy thông tin người dùng
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

// Component con hiển thị từng dòng
const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <View style={tw`flex-row justify-between py-3 border-b border-gray-100`}>
    <Text style={tw`text-gray-500`}>{label}</Text>
    <Text style={tw`font-semibold text-gray-800`}>{value}</Text>
  </View>
);

export default ProfileScreen;
