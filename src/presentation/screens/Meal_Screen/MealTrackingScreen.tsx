import React, { useEffect, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import tw from '../../../utils/tailwind';
import { useMealTrackingStore } from '../../viewmodels/useMealTrackingStore';
import {
  ChevronLeft,
  Plus,
  Trash2,
  Utensils,
  Flame,
  Minus,
} from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const MealTrackingScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // SỬ DỤNG OPTIONAL CHAINING ĐỂ CHỐNG CRASH KHI VÀO TỪ NAVBAR
  const mealLogId = route.params?.mealLogId;
  const type = route.params?.type || 'Bữa Ăn';
  const date = route.params?.date;

  const { mealFoods, isLoading, fetchMealFoods, updateQuantity, removeFood } =
    useMealTrackingStore();

  useEffect(() => {
    if (mealLogId) {
      fetchMealFoods(mealLogId);
    } else {
      // Nếu lỡ bấm nhầm từ Navbar mà không có ID, báo lỗi nhẹ nhàng
      console.warn('--- [UI] MealTrackingScreen opened without mealLogId');
    }
  }, [mealLogId, fetchMealFoods]);

  const summary = useMemo(() => {
    return mealFoods.reduce(
      (acc, item) => ({
        calories: acc.calories + (item.calories || 0),
      }),
      { calories: 0 },
    );
  }, [mealFoods]);

  const getMealTitle = () => {
    if (type === 'BREAKFAST') return 'Bữa Sáng';
    if (type === 'LUNCH') return 'Bữa Trưa';
    if (type === 'DINNER') return 'Bữa Tối';
    if (type === 'SNACK') return 'Bữa Phụ';
    return type;
  };

  // NẾU KHÔNG CÓ ID, HIỂN THỊ FALLBACK UI THAY VÌ CRASH
  if (!mealLogId) {
    return (
      <SafeAreaView style={tw`flex-1 bg-white items-center justify-center p-6`}>
        <Utensils size={64} color="#D1D5DB" />
        <Text style={tw`text-gray-400 mt-4 text-center font-bold text-lg`}>
          Vui lòng chọn một bữa ăn cụ thể từ Nhật Ký để xem chi tiết.
        </Text>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`mt-6 bg-primary px-8 py-3 rounded-full`}
        >
          <Text style={tw`text-white font-bold`}>Quay lại</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <StatusBar barStyle="dark-content" />
      <View
        style={tw`px-6 py-4 flex-row items-center justify-between border-b border-gray-50`}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`p-2 bg-gray-50 rounded-xl`}
        >
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-black text-brandDark`}>
          {getMealTitle()}
        </Text>
        <View style={tw`w-10`} />
      </View>

      <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
        <View style={tw`px-6 pt-6`}>
          <LinearGradient
            colors={['#7FB069', '#6A9A5A']}
            style={tw`p-6 rounded-[32px] shadow-lg mb-8`}
          >
            <View style={tw`flex-row justify-between items-center`}>
              <View>
                <Text
                  style={tw`text-white/80 text-xs font-bold uppercase mb-1`}
                >
                  Năng lượng bữa ăn
                </Text>
                <Text style={tw`text-white text-3xl font-black`}>
                  {summary.calories}{' '}
                  <Text style={tw`text-lg font-medium`}>kcal</Text>
                </Text>
              </View>
              <View style={tw`bg-white/20 p-4 rounded-2xl`}>
                <Flame size={32} color="white" />
              </View>
            </View>
          </LinearGradient>

          <View style={tw`flex-row justify-between items-center mb-4`}>
            <Text style={tw`text-lg font-black text-brandDark`}>
              Món đã chọn
            </Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('AddFood', { mealLogId, type, date })
              }
              style={tw`bg-primary/10 px-4 py-2 rounded-full flex-row items-center`}
            >
              <Plus size={16} color="#7FB069" />
              <Text style={tw`ml-1 text-primary font-bold text-xs`}>
                Thêm món
              </Text>
            </TouchableOpacity>
          </View>

          {isLoading ? (
            <ActivityIndicator color="#7FB069" style={tw`mt-10`} />
          ) : mealFoods.length === 0 ? (
            <View
              style={tw`bg-gray-50 rounded-[24px] p-10 items-center border border-dashed border-gray-200`}
            >
              <Utensils size={40} color="#9CA3AF" />
              <Text style={tw`text-gray-400 font-medium mt-4 text-center`}>
                Bữa ăn đang trống.{'\n'}Hãy thêm món ăn ngay!
              </Text>
            </View>
          ) : (
            mealFoods.map(item => (
              <View
                key={item.id}
                style={tw`bg-white border border-gray-100 p-4 rounded-2xl mb-3 shadow-sm flex-row items-center`}
              >
                <View style={tw`flex-1`}>
                  <Text style={tw`text-brandDark font-bold text-sm`}>
                    {item.foodItemName}
                  </Text>
                  <Text style={tw`text-primary text-xs font-bold`}>
                    {item.calories} kcal
                  </Text>
                </View>
                <View
                  style={tw`flex-row items-center bg-gray-50 rounded-xl p-1 mr-3`}
                >
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.id, item.quantity - 1)}
                    style={tw`p-1`}
                  >
                    <Minus
                      size={14}
                      color={item.quantity > 1 ? '#7FB069' : '#D1D5DB'}
                    />
                  </TouchableOpacity>
                  <Text style={tw`mx-2 font-black text-brandDark text-xs`}>
                    {item.quantity}
                  </Text>
                  <TouchableOpacity
                    onPress={() => updateQuantity(item.id, item.quantity + 1)}
                    style={tw`p-1`}
                  >
                    <Plus size={14} color="#7FB069" />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    Alert.alert('Xác nhận', 'Xóa món này?', [
                      { text: 'Hủy' },
                      {
                        text: 'Xóa',
                        style: 'destructive',
                        onPress: () => removeFood(item.id),
                      },
                    ])
                  }
                  style={tw`p-2 bg-red-50 rounded-lg`}
                >
                  <Trash2 size={16} color="#EF4444" />
                </TouchableOpacity>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default MealTrackingScreen;
