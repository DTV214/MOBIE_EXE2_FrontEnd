// src/presentation/screens/Profile_Screen/EditProfileScreen.tsx

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import tw from '../../../utils/tailwind';
import { useNavigation } from '@react-navigation/native';
import { ChevronLeft, Check } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';

// Import Enums & Store & Repo
import {
  Gender,
  ActivityLevel,
  HealthGoal,
} from '../../../domain/enums/HealthEnums';
import { useUserStore } from '../../viewmodels/useUserStore';
import { HealthProfileRepositoryImpl } from '../../../data/repositories/health/HealthProfileRepositoryImpl';
import { UpdateHealthProfile } from '../../../domain/usecases/health/UpdateHealthProfile';

// Khởi tạo UseCase
const healthRepo = new HealthProfileRepositoryImpl();
const updateHealthProfileUseCase = new UpdateHealthProfile(healthRepo);

const EditProfileScreen = () => {
  const navigation = useNavigation<any>();
  const { healthProfile, fetchHealthData } = useUserStore(); // Lấy dữ liệu cũ để điền sẵn

  // State local form
  const [loading, setLoading] = useState(false);

  // Date of Birth
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  // Metrics
  const [gender, setGender] = useState<Gender | null>(null);
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [activity, setActivity] = useState<ActivityLevel | null>(null);
  const [goal, setGoal] = useState<HealthGoal | null>(null);

  // Load Data cũ vào Form khi màn hình mở lên
  useEffect(() => {
    if (healthProfile) {
      setGender(healthProfile.gender);
      setHeight(healthProfile.heightCm.toString());
      setWeight(healthProfile.weightKg.toString());
      // Activity & Goal trả về chuỗi enum (BE trả về string keys)
      // Cần ép kiểu hoặc tìm trong Enum nếu BE trả về description
      // Giả sử BE trả về đúng KEY enum như "NO_EXERCISE"
      setActivity(healthProfile.activityLevel as unknown as ActivityLevel);
      setGoal(healthProfile.healthGoal as unknown as HealthGoal);

      // Parse Date (YYYY-MM-DD)
      const parts = healthProfile.dateOfBirth.split('-');
      if (parts.length === 3) {
        setYear(parts[0]);
        setMonth(parts[1]);
        setDay(parts[2]);
      }
    }
  }, [healthProfile]);

  const handleUpdate = async () => {
    if (
      !gender ||
      !day ||
      !month ||
      !year ||
      !height ||
      !weight ||
      !activity ||
      !goal
    ) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ thông tin');
      return;
    }

    setLoading(true);
    try {
      const formattedDob = `${year}-${month.padStart(2, '0')}-${day.padStart(
        2,
        '0',
      )}`;

      const success = await updateHealthProfileUseCase.execute({
        dateOfBirth: formattedDob,
        gender,
        heightCm: parseFloat(height),
        weightKg: parseFloat(weight),
        activityLevel: activity,
        healthGoal: goal,
      });

      if (success) {
        // Cập nhật lại store
        await fetchHealthData();
        Alert.alert('Thành công', 'Cập nhật hồ sơ thành công!', [
          { text: 'OK', onPress: () => navigation.goBack() },
        ]);
      }
    } catch {
      Alert.alert('Lỗi', 'Không thể cập nhật hồ sơ. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  // --- UI RENDER (Giản lược từ SurveyScreen) ---
  // (Tôi sẽ viết gọn lại các phần nhập liệu để code không quá dài, bạn có thể copy UI đẹp từ SurveyScreen qua)

  // Helper render selection button
  const SelectionBtn = ({ label, selected, onPress }: any) => (
    <TouchableOpacity
      onPress={onPress}
      style={tw`p-3 rounded-xl border mb-2 ${
        selected ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-white'
      }`}
    >
      <View style={tw`flex-row justify-between`}>
        <Text
          style={tw`font-bold ${selected ? 'text-green-700' : 'text-gray-700'}`}
        >
          {label}
        </Text>
        {selected && <Check size={18} color="green" />}
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      {/* Header */}
      <View
        style={tw`pt-12 pb-4 px-6 bg-white shadow-sm flex-row items-center`}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`mr-4`}>
          <ChevronLeft size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={tw`text-xl font-bold text-gray-800`}>Chỉnh sửa hồ sơ</Text>
      </View>

      <ScrollView contentContainerStyle={tw`p-6 pb-32`}>
        {/* Section 1: Thông tin cơ bản */}
        <View style={tw`bg-white p-4 rounded-2xl mb-4`}>
          <Text style={tw`font-bold text-gray-800 mb-4`}>Thông tin cơ bản</Text>
          <View style={tw`flex-row mb-4`}>
            <SelectionBtn
              label="Nam"
              selected={gender === Gender.MALE}
              onPress={() => setGender(Gender.MALE)}
            />
            <View style={tw`w-4`} />
            <SelectionBtn
              label="Nữ"
              selected={gender === Gender.FEMALE}
              onPress={() => setGender(Gender.FEMALE)}
            />
          </View>

          <Text style={tw`text-xs text-gray-500 mb-1`}>
            Ngày sinh (DD/MM/YYYY)
          </Text>
          <View style={tw`flex-row`}>
            <TextInput
              value={day}
              onChangeText={setDay}
              placeholder="DD"
              style={tw`flex-1 border border-gray-200 p-3 rounded-xl mr-2 text-center`}
              keyboardType="numeric"
              maxLength={2}
            />
            <TextInput
              value={month}
              onChangeText={setMonth}
              placeholder="MM"
              style={tw`flex-1 border border-gray-200 p-3 rounded-xl mx-2 text-center`}
              keyboardType="numeric"
              maxLength={2}
            />
            <TextInput
              value={year}
              onChangeText={setYear}
              placeholder="YYYY"
              style={tw`flex-1 border border-gray-200 p-3 rounded-xl ml-2 text-center`}
              keyboardType="numeric"
              maxLength={4}
            />
          </View>
        </View>

        {/* Section 2: Chỉ số */}
        <View style={tw`bg-white p-4 rounded-2xl mb-4`}>
          <Text style={tw`font-bold text-gray-800 mb-4`}>Chỉ số cơ thể</Text>
          <View style={tw`mb-4`}>
            <Text style={tw`text-xs text-gray-500 mb-1`}>Chiều cao (cm)</Text>
            <TextInput
              value={height}
              onChangeText={setHeight}
              style={tw`border border-gray-200 p-3 rounded-xl`}
              keyboardType="numeric"
            />
          </View>
          <View>
            <Text style={tw`text-xs text-gray-500 mb-1`}>Cân nặng (kg)</Text>
            <TextInput
              value={weight}
              onChangeText={setWeight}
              style={tw`border border-gray-200 p-3 rounded-xl`}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Section 3: Lối sống */}
        <View style={tw`bg-white p-4 rounded-2xl mb-4`}>
          <Text style={tw`font-bold text-gray-800 mb-4`}>Mức độ vận động</Text>
          <SelectionBtn
            label="Ít vận động"
            selected={activity === ActivityLevel.NO_EXERCISE}
            onPress={() => setActivity(ActivityLevel.NO_EXERCISE)}
          />
          <SelectionBtn
            label="Vận động nhẹ"
            selected={activity === ActivityLevel.LIGHT_EXERCISE}
            onPress={() => setActivity(ActivityLevel.LIGHT_EXERCISE)}
          />
          <SelectionBtn
            label="Vận động vừa"
            selected={activity === ActivityLevel.NORMAL_EXERCISE}
            onPress={() => setActivity(ActivityLevel.NORMAL_EXERCISE)}
          />
          <SelectionBtn
            label="Vận động nặng"
            selected={activity === ActivityLevel.HIGH_EXERCISE}
            onPress={() => setActivity(ActivityLevel.HIGH_EXERCISE)}
          />
        </View>

        <View style={tw`bg-white p-4 rounded-2xl mb-4`}>
          <Text style={tw`font-bold text-gray-800 mb-4`}>Mục tiêu</Text>
          <SelectionBtn
            label="Giảm cân"
            selected={goal === HealthGoal.LOSE_WEIGHT}
            onPress={() => setGoal(HealthGoal.LOSE_WEIGHT)}
          />
          <SelectionBtn
            label="Giữ cân"
            selected={goal === HealthGoal.MAINTAIN}
            onPress={() => setGoal(HealthGoal.MAINTAIN)}
          />
          <SelectionBtn
            label="Tăng cân"
            selected={goal === HealthGoal.EXTREME_GAIN}
            onPress={() => setGoal(HealthGoal.EXTREME_GAIN)}
          />
        </View>
      </ScrollView>

      {/* Footer Button */}
      <View
        style={tw`absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100`}
      >
        <TouchableOpacity onPress={handleUpdate} disabled={loading}>
          <LinearGradient
            colors={['#7FB069', '#6A9A5A']}
            style={tw`py-4 rounded-xl items-center`}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={tw`text-white font-bold text-lg`}>Lưu thay đổi</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EditProfileScreen;
