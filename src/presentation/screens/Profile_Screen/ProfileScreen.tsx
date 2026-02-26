// src/presentation/screens/Profile_Screen/ProfileScreen.tsx

import React, { useEffect } from 'react';
import {
  View,
  Text,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Settings as SettingsIcon,
  Ruler,
  Weight,
  Activity,
  Flame,
  Edit, // ✅ Import icon Edit
} from 'lucide-react-native';

import { useUserStore } from '../../viewmodels/useUserStore';
import tw from '../../../utils/tailwind';

const ProfileScreen = () => {
  // Lấy cả user và healthProfile từ Store
  const { user, healthProfile, loading, error, fetchUserProfile } =
    useUserStore();
  const navigation = useNavigation<any>();

  useEffect(() => {
    fetchUserProfile();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Component hiển thị thẻ chỉ số (Card)
  const StatCard = ({ icon: Icon, label, value, color, unit }: any) => (
    <View
      style={tw`flex-1 bg-white p-3 rounded-2xl border border-gray-100 items-center mx-1 shadow-sm`}
    >
      <View
        style={tw`w-10 h-10 rounded-full bg-${color}-50 items-center justify-center mb-2`}
      >
        <Icon size={20} color={tw.color(`${color}-500`)} />
      </View>
      <Text style={tw`text-gray-500 text-xs mb-1`}>{label}</Text>
      <Text style={tw`text-gray-900 font-bold text-lg`}>
        {value}{' '}
        <Text style={tw`text-xs font-normal text-gray-400`}>{unit}</Text>
      </Text>
    </View>
  );

  // Xử lý Loading
  if (loading && !user) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <ActivityIndicator size="large" color="#7FB069" />
        <Text style={tw`mt-4 text-gray-400`}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  // Xử lý Lỗi
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
      <ScrollView
        contentContainerStyle={tw`p-5 pb-20`}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchUserProfile}
            colors={['#7FB069']}
          />
        }
      >
        {/* Header Profile */}
        <View style={tw`flex-row justify-between items-center mb-6 mt-5`}>
          <Text style={tw`text-2xl font-bold text-gray-900`}>
            Hồ Sơ Sức Khỏe
          </Text>

          {/* Group Button: Edit & Settings */}
          <View style={tw`flex-row items-center`}>
            {/* Nút Edit: Chỉ hiện khi đã có hồ sơ sức khỏe */}
            {healthProfile && (
              <TouchableOpacity
                onPress={() => navigation.navigate('EditProfile')}
                style={tw`p-2 bg-white rounded-xl shadow-sm border border-gray-100 mr-3`}
              >
                <Edit size={24} color="#2563EB" />
              </TouchableOpacity>
            )}

            {/* Nút Settings */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Settings')}
              style={tw`p-2 bg-white rounded-xl shadow-sm border border-gray-100`}
            >
              <SettingsIcon size={24} color="#1F2937" />
            </TouchableOpacity>
          </View>
        </View>

        {user ? (
          <>
            {/* Card Thông tin Cơ bản */}
            <View
              style={tw`bg-white p-5 rounded-3xl shadow-sm border border-gray-100 mb-5`}
            >
              <View style={tw`flex-row items-center mb-4`}>
                <View
                  style={tw`w-16 h-16 bg-green-100 rounded-full items-center justify-center mr-4`}
                >
                  <Text style={tw`text-2xl font-bold text-green-700`}>
                    {user.fullName
                      ? user.fullName.charAt(0).toUpperCase()
                      : 'U'}
                  </Text>
                </View>
                <View>
                  <Text style={tw`text-xl font-bold text-gray-900`}>
                    {user.fullName}
                  </Text>
                  <Text style={tw`text-gray-500`}>{user.email}</Text>
                  <View
                    style={tw`bg-gray-100 self-start px-2 py-1 rounded-md mt-1`}
                  >
                    <Text style={tw`text-xs text-gray-600`}>
                      {user.role === 'ROLE_USER' ? 'Thành viên' : user.role}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Card Chỉ số Sức khỏe (Health Profile) */}
            {healthProfile ? (
              <View>
                <Text style={tw`text-lg font-bold text-gray-800 mb-3`}>
                  Chỉ số cơ thể
                </Text>

                {/* Hàng 1: Chiều cao & Cân nặng */}
                <View style={tw`flex-row mb-3`}>
                  <StatCard
                    icon={Ruler}
                    label="Chiều cao"
                    value={healthProfile.heightCm}
                    unit="cm"
                    color="blue"
                  />
                  <StatCard
                    icon={Weight}
                    label="Cân nặng"
                    value={healthProfile.weightKg}
                    unit="kg"
                    color="orange"
                  />
                  <StatCard
                    icon={Activity}
                    label="BMI"
                    value={healthProfile.bmiValue}
                    unit=""
                    color={
                      healthProfile.bmiStatus === 'NORMAL' ? 'green' : 'red'
                    }
                  />
                </View>

                {/* Card TDEE (Năng lượng tiêu thụ) */}
                <View
                  style={tw`bg-white p-4 rounded-2xl border border-gray-100 mb-3 flex-row items-center shadow-sm`}
                >
                  <View
                    style={tw`w-12 h-12 bg-red-50 rounded-xl items-center justify-center mr-4`}
                  >
                    <Flame size={24} color="#EF4444" />
                  </View>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-gray-500 text-xs font-bold uppercase`}>
                      TDEE (Năng lượng mỗi ngày)
                    </Text>
                    <Text style={tw`text-gray-900 font-bold text-xl`}>
                      {healthProfile.tdeeValue}{' '}
                      <Text style={tw`text-sm font-normal text-gray-500`}>
                        kcal/ngày
                      </Text>
                    </Text>
                  </View>
                </View>

                {/* Thông tin thêm */}
                <View
                  style={tw`bg-white p-5 rounded-2xl border border-gray-100 shadow-sm`}
                >
                  <InfoRow
                    label="Giới tính"
                    value={healthProfile.gender === 'MALE' ? 'Nam' : 'Nữ'}
                  />
                  <InfoRow
                    label="Ngày sinh"
                    value={healthProfile.dateOfBirth}
                  />
                  <InfoRow
                    label="Trạng thái BMI"
                    value={healthProfile.bmiStatusDescription}
                  />
                  <InfoRow
                    label="Vận động"
                    value={healthProfile.activityLevelDescription}
                  />
                  <InfoRow
                    label="Mục tiêu"
                    value={healthProfile.healthGoalDescription}
                    isLast
                  />
                </View>
              </View>
            ) : (
              <View
                style={tw`bg-white p-6 rounded-2xl items-center border border-gray-200 border-dashed`}
              >
                <Text style={tw`text-gray-400 text-center mb-3`}>
                  Bạn chưa thiết lập hồ sơ sức khỏe
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Survey')}
                  style={tw`bg-green-600 px-6 py-2 rounded-full`}
                >
                  <Text style={tw`text-white font-bold`}>Thiết lập ngay</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          <Text style={tw`text-center text-gray-500 mt-10`}>
            Không có dữ liệu
          </Text>
        )}
      </ScrollView>
    </View>
  );
};

// Component con hiển thị từng dòng thông tin
const InfoRow = ({
  label,
  value,
  isLast,
}: {
  label: string;
  value: string;
  isLast?: boolean;
}) => (
  <View
    style={tw`flex-row justify-between py-3 ${
      !isLast ? 'border-b border-gray-50' : ''
    }`}
  >
    <Text style={tw`text-gray-500`}>{label}</Text>
    <Text style={tw`font-medium text-gray-800 flex-1 text-right ml-4`}>
      {value}
    </Text>
  </View>
);

export default ProfileScreen;
