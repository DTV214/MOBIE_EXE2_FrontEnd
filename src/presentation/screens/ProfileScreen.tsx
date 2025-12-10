import React, { useEffect } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

import { useUserStore } from '../viewmodels/useUserStore';
import tw from '../../utils/tailwind';


const ProfileScreen = () => {
  const { user, loading, fetchUser } = useUserStore();

  useEffect(() => {
    fetchUser('user_001');
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
      <Text style={tw`text-2xl font-bold text-gray-900 mb-6 mt-10`}>
        Hồ Sơ Sức Khỏe
      </Text>

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
              BMI: {user.bmi}
            </Text>
          </View>
        </View>
      ) : (
        <Text>Không có dữ liệu</Text>
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
