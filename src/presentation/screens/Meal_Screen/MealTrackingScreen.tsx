import React, {  useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import tw from '../../../utils/tailwind';
import { useDailyLogStore } from '../../viewmodels/useDailyLogStore';
import {
  ChevronLeft,
  Plus,
  Trash2,
  Utensils,

  Flame,
  Zap,
} from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';

const MealTrackingScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();

  // Lấy tham số từ DailyLogScreen
  const { date, type, mealLogId } = route.params;

  const { mealLogs, isLoading } = useDailyLogStore();

  // Tìm dữ liệu của bữa ăn hiện tại từ Store
  const currentMeal = useMemo(() => {
    return mealLogs.find(m => m.id === mealLogId);
  }, [mealLogs, mealLogId]);

  const getMealTitle = () => {
    switch (type) {
      case 'BREAKFAST':
        return 'Bữa Sáng';
      case 'LUNCH':
        return 'Bữa Trưa';
      case 'DINNER':
        return 'Bữa Tối';
      default:
        return 'Bữa Ăn';
    }
  };

  if (isLoading) {
    return (
      <View style={tw`flex-1 justify-center items-center bg-white`}>
        <ActivityIndicator size="large" color="#7FB069" />
      </View>
    );
  }

  return (
    <SafeAreaView style={tw`flex-1 bg-white`}>
      <StatusBar barStyle="dark-content" />

      {/* Custom Header */}
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
        <View style={tw`w-10 h-10`} /> {/* Khoảng trống cân bằng */}
      </View>

      <ScrollView style={tw`flex-1`} showsVerticalScrollIndicator={false}>
        <View style={tw`px-6 pt-6`}>
          {/* Summary Card */}
          <LinearGradient
            colors={['#7FB069', '#6A9A5A']}
            style={tw`p-6 rounded-[32px] shadow-lg mb-8`}
          >
            <View style={tw`flex-row justify-between items-center`}>
              <View>
                <Text
                  style={tw`text-white/80 text-xs font-bold uppercase mb-1`}
                >
                  Tổng Năng Lượng
                </Text>
                <Text style={tw`text-white text-3xl font-black`}>
                  {currentMeal?.totalCalories || 0}{' '}
                  <Text style={tw`text-lg font-medium`}>kcal</Text>
                </Text>
              </View>
              <View style={tw`bg-white/20 p-4 rounded-2xl`}>
                <Flame size={32} color="white" />
              </View>
            </View>

            <View
              style={tw`flex-row justify-between mt-6 pt-6 border-t border-white/20`}
            >
              <NutrientInfo label="P" value={currentMeal?.totalProtein || 0} />
              <NutrientInfo label="C" value={currentMeal?.totalCarbs || 0} />
              <NutrientInfo label="F" value={currentMeal?.totalFat || 0} />
            </View>
          </LinearGradient>

          {/* Food List Section */}
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

          {!currentMeal?.items || currentMeal.items.length === 0 ? (
            <View
              style={tw`bg-gray-50 rounded-[24px] p-10 items-center border border-dashed border-gray-200`}
            >
              <Utensils size={40} color="#9CA3AF" strokeWidth={1.5} />
              <Text style={tw`text-gray-400 font-medium mt-4 text-center`}>
                Chưa có món ăn nào.{'\n'}Hãy nhấn "Thêm món" để bắt đầu.
              </Text>
            </View>
          ) : (
            currentMeal.items.map((item: any, index: number) => (
              <FoodItemCard key={index} item={item} />
            ))
          )}

          {/* AI Advice Section */}
          <View
            style={tw`mt-8 p-5 bg-blue-50 rounded-[24px] border border-blue-100 flex-row`}
          >
            <Zap size={20} color="#3B82F6" />
            <View style={tw`ml-3 flex-1`}>
              <Text style={tw`text-blue-800 font-bold mb-1`}>
                Gợi ý từ Lành AI
              </Text>
              <Text style={tw`text-blue-600/80 text-xs leading-4`}>
                Bữa ăn này có lượng đạm khá tốt. Bạn nên bổ sung thêm một chút
                chất xơ từ rau xanh để cân bằng tiêu hóa nhé!
              </Text>
            </View>
          </View>

          <View style={tw`h-10`} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// --- Sub-components ---

const NutrientInfo = ({ label, value }: { label: string; value: number }) => (
  <View style={tw`items-center`}>
    <Text style={tw`text-white/60 text-[10px] font-bold mb-1`}>{label}</Text>
    <Text style={tw`text-white font-bold`}>{value}g</Text>
  </View>
);

const FoodItemCard = ({ item }: { item: any }) => (
  <View
    style={tw`flex-row items-center bg-white border border-gray-100 p-4 rounded-2xl mb-3 shadow-sm`}
  >
    <View
      style={tw`w-12 h-12 bg-gray-50 rounded-xl items-center justify-center mr-4`}
    >
      <Text style={tw`text-xl`}>🥗</Text>
    </View>
    <View style={tw`flex-1`}>
      <Text style={tw`text-brandDark font-bold text-sm`}>
        {item.foodName || 'Tên món ăn'}
      </Text>
      <Text style={tw`text-gray-400 text-xs`}>
        {item.quantity || 1} phần • {item.calories || 0} kcal
      </Text>
    </View>
    <TouchableOpacity style={tw`p-2 bg-red-50 rounded-lg`}>
      <Trash2 size={16} color="#EF4444" />
    </TouchableOpacity>
  </View>
);

export default MealTrackingScreen;
