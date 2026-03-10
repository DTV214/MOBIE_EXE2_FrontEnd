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
import { useTheme } from '../../../contexts/ThemeContext';

const ProfileScreen = () => {
  const { colors } = useTheme();
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
      style={[tw`flex-1 p-3 rounded-2xl border items-center mx-1 shadow-sm`, {
        backgroundColor: colors.surface,
        borderColor: colors.border
      }]}
    >
      <View
        style={tw`w-10 h-10 rounded-full bg-${color}-50 items-center justify-center mb-2`}
      >
        <Icon size={20} color={tw.color(`${color}-500`)} />
      </View>
      <Text style={[tw`text-xs mb-1`, { color: colors.textSecondary }]}>{label}</Text>
      <Text style={[tw`font-bold text-lg`, { color: colors.text }]}>
        {value}{' '}
        <Text style={[tw`text-xs font-normal`, { color: colors.textSecondary }]}>{unit}</Text>
      </Text>
    </View>
  );

  // Xử lý Loading
  if (loading && !user) {
    return (
      <View style={[tw`flex-1 justify-center items-center`, { backgroundColor: colors.background }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={[tw`mt-4`, { color: colors.textSecondary }]}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  // Xử lý Lỗi
  if (error && !user) {
    return (
      <View style={[tw`flex-1 justify-center items-center p-5`, { backgroundColor: colors.background }]}>
        <Text style={[tw`mb-4 text-center`, { color: '#ef4444' }]}>{error}</Text>
        <TouchableOpacity
          onPress={() => fetchUserProfile()}
          style={[tw`px-6 py-3 rounded-xl`, { backgroundColor: colors.primary }]}
        >
          <Text style={[tw`font-bold`, { color: '#ffffff' }]}>Thử lại</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={[tw`flex-1`, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={tw`p-5 pb-20`}
        refreshControl={
          <RefreshControl
            refreshing={loading}
            onRefresh={fetchUserProfile}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header Profile */}
        <View style={tw`flex-row justify-between items-center mb-6 mt-5`}>
          <Text style={[tw`text-2xl font-bold`, { color: colors.text }]}>
            Hồ Sơ Sức Khỏe
          </Text>

          {/* Group Button: Edit & Settings */}
          <View style={tw`flex-row items-center`}>
            {/* Nút Edit: Chỉ hiện khi đã có hồ sơ sức khỏe */}
            {healthProfile && (
              <TouchableOpacity
                onPress={() => navigation.navigate('EditProfile')}
                style={[tw`p-2 rounded-xl shadow-sm border mr-3`, {
                  backgroundColor: colors.surface,
                  borderColor: colors.border
                }]}
              >
                <Edit size={24} color="#2563EB" />
              </TouchableOpacity>
            )}

            {/* Nút Settings */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Settings')}
              style={[tw`p-2 rounded-xl shadow-sm border`, {
                backgroundColor: colors.surface,
                borderColor: colors.border
              }]}
            >
              <SettingsIcon size={24} color={colors.text} />
            </TouchableOpacity>
          </View>
        </View>

        {user ? (
          <>
            {/* Card Thông tin Cơ bản */}
            <View
              style={[tw`p-5 rounded-3xl shadow-sm border mb-5`, {
                backgroundColor: colors.surface,
                borderColor: colors.border
              }]}
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
                  <Text style={[tw`text-xl font-bold`, { color: colors.text }]}>
                    {user.fullName}
                  </Text>
                  <Text style={[{ color: colors.textSecondary }]}>{user.email}</Text>
                  <View
                    style={[tw`self-start px-2 py-1 rounded-md mt-1`, {
                      backgroundColor: colors.border
                    }]}
                  >
                    <Text style={[tw`text-xs`, { color: colors.textSecondary }]}>
                      {user.role === 'ROLE_USER' ? 'Thành viên' : user.role}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Card Chỉ số Sức khỏe (Health Profile) */}
            {healthProfile ? (
              <View>
                <Text style={[tw`text-lg font-bold mb-3`, { color: colors.text }]}>
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
                  style={[tw`p-4 rounded-2xl border mb-3 flex-row items-center shadow-sm`, {
                    backgroundColor: colors.surface,
                    borderColor: colors.border
                  }]}
                >
                  <View
                    style={tw`w-12 h-12 bg-red-50 rounded-xl items-center justify-center mr-4`}
                  >
                    <Flame size={24} color="#EF4444" />
                  </View>
                  <View style={tw`flex-1`}>
                    <Text style={[tw`text-xs font-bold uppercase`, { color: colors.textSecondary }]}>
                      TDEE (Năng lượng mỗi ngày)
                    </Text>
                    <Text style={[tw`font-bold text-xl`, { color: colors.text }]}>
                      {healthProfile.tdeeValue}{' '}
                      <Text style={[tw`text-sm font-normal`, { color: colors.textSecondary }]}>
                        kcal/ngày
                      </Text>
                    </Text>
                  </View>
                </View>

                {/* Thông tin thêm */}
                <View
                  style={[tw`p-5 rounded-2xl border shadow-sm`, {
                    backgroundColor: colors.surface,
                    borderColor: colors.border
                  }]}
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
                style={[tw`p-6 rounded-2xl items-center border border-dashed`, {
                  backgroundColor: colors.surface,
                  borderColor: colors.border
                }]}
              >
                <Text style={[tw`text-center mb-3`, { color: colors.textSecondary }]}>
                  Bạn chưa thiết lập hồ sơ sức khỏe
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Survey')}
                  style={[tw`px-6 py-2 rounded-full`, { backgroundColor: colors.primary }]}
                >
                  <Text style={[tw`font-bold`, { color: '#ffffff' }]}>Thiết lập ngay</Text>
                </TouchableOpacity>
              </View>
            )}
          </>
        ) : (
          <Text style={[tw`text-center mt-10`, { color: colors.textSecondary }]}>
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
}) => {
  const { colors } = useTheme();
  return (
    <View
      style={[
        tw`flex-row justify-between py-3`,
        !isLast && { borderBottomWidth: 1, borderBottomColor: colors.border }
      ]}
    >
      <Text style={[{ color: colors.textSecondary }]}>{label}</Text>
      <Text style={[tw`font-medium flex-1 text-right ml-4`, { color: colors.text }]}>
        {value}
      </Text>
    </View>
  );
};

export default ProfileScreen;
