// src/presentation/screens/Survey_Screen/SurveyScreen.tsx

import React, { useState } from 'react';
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
import { useSurveyStore } from '../../viewmodels/useSurveyStore';
import {
  Gender,
  ActivityLevel,
  HealthGoal,
} from '../../../domain/enums/HealthEnums';
import { ChevronLeft, Check, Ruler, Weight } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

// --- DATA MAPPING CHO UI ---
const ACTIVITY_OPTIONS = [
  {
    value: ActivityLevel.NO_EXERCISE,
    label: 'Ít vận động',
    desc: 'Ngồi nhiều, ít đi lại, không tập thể dục',
  },
  {
    value: ActivityLevel.LIGHT_EXERCISE,
    label: 'Vận động nhẹ',
    desc: 'Tập nhẹ nhàng 1–3 buổi/tuần',
  },
  {
    value: ActivityLevel.NORMAL_EXERCISE,
    label: 'Vận động vừa',
    desc: 'Tập trung bình 3–5 buổi/tuần',
  },
  {
    value: ActivityLevel.HIGH_EXERCISE,
    label: 'Vận động nặng',
    desc: 'Tập cường độ cao 6–7 buổi/tuần',
  },
  {
    value: ActivityLevel.VERY_HIGH_EXERCISE,
    label: 'Rất nặng',
    desc: 'Vận động viên, lao động nặng',
  },
];

const GOAL_OPTIONS = [
  {
    value: HealthGoal.LOSE_WEIGHT,
    label: 'Giảm cân',
    desc: 'Giảm mỡ, kiểm soát calo thâm hụt',
  },
  {
    value: HealthGoal.MAINTAIN,
    label: 'Giữ cân',
    desc: 'Duy trì vóc dáng và sức khỏe hiện tại',
  },
  {
    value: HealthGoal.EXTREME_GAIN,
    label: 'Tăng cân',
    desc: 'Tăng cơ, tăng calo nạp vào',
  },
];

const SurveyScreen = () => {
  const navigation = useNavigation<any>();
  const store = useSurveyStore();

  // State tạm cho ngày sinh (DD / MM / YYYY)
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  // Hàm xử lý khi user bấm nút Tiếp tục
  const handleNext = async () => {
    // Validate từng bước
    if (store.currentStep === 1) {
      if (!store.gender)
        return Alert.alert('Thông báo', 'Vui lòng chọn giới tính!');
      if (!day || !month || !year)
        return Alert.alert('Thông báo', 'Vui lòng nhập đầy đủ ngày sinh!');
      // Format YYYY-MM-DD
      const formattedDob = `${year}-${month.padStart(2, '0')}-${day.padStart(
        2,
        '0',
      )}`;
      store.setDob(formattedDob);
      store.nextStep();
    } else if (store.currentStep === 2) {
      if (!store.height || !store.weight)
        return Alert.alert('Thông báo', 'Vui lòng nhập chiều cao và cân nặng!');
      store.nextStep();
    } else if (store.currentStep === 3) {
      if (!store.activity)
        return Alert.alert('Thông báo', 'Vui lòng chọn mức độ vận động!');
      if (!store.goal)
        return Alert.alert('Thông báo', 'Vui lòng chọn mục tiêu!');

      // Submit dữ liệu
      const success = await store.submitSurvey();
      if (success) {
        // Reset navigation về Main
        navigation.reset({
          index: 0,
          routes: [{ name: 'Main' }],
        });
      }
    }
  };

  const renderStep1 = () => (
    <View>
      <Text style={tw`text-xl font-bold text-gray-800 mb-6 text-center`}>
        Giới tính & Tuổi
      </Text>

      {/* Gender Selection */}
      <View style={tw`flex-row justify-between mb-8`}>
        <TouchableOpacity
          onPress={() => store.setGender(Gender.MALE)}
          style={tw`flex-1 mr-2 p-4 rounded-2xl border-2 items-center ${
            store.gender === Gender.MALE
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-200 bg-white'
          }`}
        >
          <Text style={tw`text-3xl mb-2`}>👨</Text>
          <Text
            style={tw`font-bold ${
              store.gender === Gender.MALE ? 'text-blue-600' : 'text-gray-500'
            }`}
          >
            Nam
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => store.setGender(Gender.FEMALE)}
          style={tw`flex-1 ml-2 p-4 rounded-2xl border-2 items-center ${
            store.gender === Gender.FEMALE
              ? 'border-pink-500 bg-pink-50'
              : 'border-gray-200 bg-white'
          }`}
        >
          <Text style={tw`text-3xl mb-2`}>👩</Text>
          <Text
            style={tw`font-bold ${
              store.gender === Gender.FEMALE ? 'text-pink-600' : 'text-gray-500'
            }`}
          >
            Nữ
          </Text>
        </TouchableOpacity>
      </View>

      {/* DOB Input */}
      <Text style={tw`text-base font-semibold text-gray-700 mb-3`}>
        Ngày sinh
      </Text>
      <View style={tw`flex-row justify-between`}>
        <TextInput
          style={tw`flex-1 bg-white border border-gray-200 rounded-xl p-4 text-center text-lg mr-2`}
          placeholder="DD"
          keyboardType="numeric"
          maxLength={2}
          value={day}
          onChangeText={setDay}
        />
        <TextInput
          style={tw`flex-1 bg-white border border-gray-200 rounded-xl p-4 text-center text-lg mx-2`}
          placeholder="MM"
          keyboardType="numeric"
          maxLength={2}
          value={month}
          onChangeText={setMonth}
        />
        <TextInput
          style={tw`flex-1 bg-white border border-gray-200 rounded-xl p-4 text-center text-lg ml-2`}
          placeholder="YYYY"
          keyboardType="numeric"
          maxLength={4}
          value={year}
          onChangeText={setYear}
        />
      </View>
    </View>
  );

  const renderStep2 = () => (
    <View>
      <Text style={tw`text-xl font-bold text-gray-800 mb-6 text-center`}>
        Chỉ số cơ thể
      </Text>

      {/* Height */}
      <View style={tw`mb-6`}>
        <Text style={tw`text-base font-semibold text-gray-700 mb-2`}>
          Chiều cao (cm)
        </Text>
        <View
          style={tw`flex-row items-center bg-white border border-gray-200 rounded-xl px-4`}
        >
          <Ruler size={20} color="#9CA3AF" />
          <TextInput
            style={tw`flex-1 p-4 text-lg text-gray-900`}
            placeholder="Ví dụ: 170"
            keyboardType="numeric"
            value={store.height}
            onChangeText={store.setHeight}
          />
        </View>
      </View>

      {/* Weight */}
      <View style={tw`mb-6`}>
        <Text style={tw`text-base font-semibold text-gray-700 mb-2`}>
          Cân nặng (kg)
        </Text>
        <View
          style={tw`flex-row items-center bg-white border border-gray-200 rounded-xl px-4`}
        >
          <Weight size={20} color="#9CA3AF" />
          <TextInput
            style={tw`flex-1 p-4 text-lg text-gray-900`}
            placeholder="Ví dụ: 65"
            keyboardType="numeric"
            value={store.weight}
            onChangeText={store.setWeight}
          />
        </View>
      </View>
    </View>
  );

  const renderStep3 = () => (
    <View>
      <Text style={tw`text-xl font-bold text-gray-800 mb-2 text-center`}>
        Lối sống & Mục tiêu
      </Text>
      <Text style={tw`text-gray-500 text-center mb-6 text-xs`}>
        Giúp chúng tôi cá nhân hóa lộ trình của bạn
      </Text>

      {/* Activity Level */}
      <Text style={tw`font-bold text-gray-700 mb-3`}>Mức độ vận động</Text>
      {ACTIVITY_OPTIONS.map(opt => (
        <TouchableOpacity
          key={opt.value}
          onPress={() => store.setActivity(opt.value)}
          style={tw`mb-3 p-3 rounded-xl border ${
            store.activity === opt.value
              ? 'border-green-500 bg-green-50'
              : 'border-gray-200 bg-white'
          }`}
        >
          <View style={tw`flex-row justify-between items-center`}>
            <View style={tw`flex-1`}>
              <Text style={tw`font-bold text-gray-800`}>{opt.label}</Text>
              <Text style={tw`text-xs text-gray-500 mt-1`}>{opt.desc}</Text>
            </View>
            {store.activity === opt.value && (
              <Check size={18} color="#22C55E" />
            )}
          </View>
        </TouchableOpacity>
      ))}

      {/* Health Goal */}
      <Text style={tw`font-bold text-gray-700 mb-3 mt-2`}>
        Mục tiêu của bạn
      </Text>
      <View style={tw`flex-row justify-between`}>
        {GOAL_OPTIONS.map(opt => (
          <TouchableOpacity
            key={opt.value}
            onPress={() => store.setGoal(opt.value)}
            style={tw`flex-1 mx-1 p-3 rounded-xl border items-center ${
              store.goal === opt.value
                ? 'border-orange-500 bg-orange-50'
                : 'border-gray-200 bg-white'
            }`}
          >
            <Text
              style={tw`font-bold text-sm text-center ${
                store.goal === opt.value ? 'text-orange-600' : 'text-gray-600'
              }`}
            >
              {opt.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      {/* Header Progress */}
      <View style={tw`pt-12 pb-4 px-6 bg-white shadow-sm z-10`}>
        <View style={tw`flex-row items-center justify-between mb-4`}>
          {store.currentStep > 1 ? (
            <TouchableOpacity onPress={store.prevStep}>
              <ChevronLeft size={24} color="#374151" />
            </TouchableOpacity>
          ) : (
            <View style={tw`w-6`} />
          )}
          <Text style={tw`font-bold text-lg text-gray-800`}>
            Bước {store.currentStep}/3
          </Text>
          <View style={tw`w-6`} />
        </View>
        {/* Progress Bar */}
        <View style={tw`h-2 bg-gray-100 rounded-full overflow-hidden`}>
          <View
            style={[
              tw`h-full bg-green-500 rounded-full`,
              { width: `${(store.currentStep / 3) * 100}%` },
            ]}
          />
        </View>
      </View>

      {/* Body */}
      <ScrollView
        style={tw`flex-1 px-6 pt-6`}
        contentContainerStyle={tw`pb-32`}
      >
        {store.currentStep === 1 && renderStep1()}
        {store.currentStep === 2 && renderStep2()}
        {store.currentStep === 3 && renderStep3()}
      </ScrollView>

      {/* Footer Button */}
      <View
        style={tw`absolute bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-100`}
      >
        {store.error && (
          <Text style={tw`text-red-500 text-center mb-2`}>{store.error}</Text>
        )}
        <TouchableOpacity
          onPress={handleNext}
          disabled={store.loading}
          style={tw`shadow-md`}
        >
          <LinearGradient
            colors={['#7FB069', '#6A9A5A']}
            style={tw`py-4 rounded-xl items-center`}
          >
            {store.loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text style={tw`text-white font-bold text-lg`}>
                {store.currentStep === 3 ? 'Hoàn tất' : 'Tiếp tục'}
              </Text>
            )}
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SurveyScreen;
