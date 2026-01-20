// src/presentation/screens/Meal_Screen/MealTrackingScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
} from 'react-native';
import tw from '../../../utils/tailwind';
import {
  Bell,
  Flame,
  Plus,
  X,
  ChevronDown,
  Lightbulb,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import {
  getDailyMealUseCase,
  removeMealItemUseCase,
} from '../../../di/Container';
import { DailyMeal, MealItem } from '../../../domain/entities/Food';

const MealTrackingScreen = () => {
  const navigation = useNavigation<any>();
  const [dailyMeal, setDailyMeal] = useState<DailyMeal | null>(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split('T')[0],
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDailyMeal();
  }, [selectedDate]);

  const loadDailyMeal = async () => {
    try {
      const meal = await getDailyMealUseCase.execute(selectedDate);
      setDailyMeal(meal);
    } catch (error) {
      console.error('Error loading daily meal:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    try {
      await removeMealItemUseCase.execute(itemId);
      await loadDailyMeal(); // Reload data
    } catch (error) {
      console.error('Error removing meal item:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const getMealTimeLabel = (mealTime: string) => {
    switch (mealTime) {
      case 'breakfast':
        return 'Sáng';
      case 'lunch':
        return 'Trưa';
      case 'dinner':
        return 'Tối';
      default:
        return mealTime;
    }
  };

  const getMealTimeIcon = (mealTime: string) => {
    switch (mealTime) {
      case 'breakfast':
        return '🌅';
      case 'lunch':
        return '☀️';
      case 'dinner':
        return '🌙';
      default:
        return '🍽️';
    }
  };

  if (loading || !dailyMeal) {
    return (
      <View style={tw`flex-1 bg-background items-center justify-center`}>
        <Text style={tw`text-textSub`}>Đang tải...</Text>
      </View>
    );
  }

  const progressPercentage = Math.min(
    (dailyMeal.totalCalories / dailyMeal.dailyGoal) * 100,
    100,
  );

  return (
    <View style={tw`flex-1 bg-background`}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={tw`bg-white pt-14 pb-4 px-6 border-b border-gray-100`}>
        <View style={tw`flex-row justify-between items-center mb-4`}>
          <View>
            <Text style={tw`text-xs text-primary font-bold mb-1`}>LÀNH CARE</Text>
            <Text style={tw`text-xl font-bold text-brandDark`}>
              Bữa ăn hôm nay
            </Text>
          </View>
          <TouchableOpacity style={tw`p-2`}>
            <Bell size={22} color="#1F2937" />
          </TouchableOpacity>
        </View>

        {/* Streak */}
        {dailyMeal.streak && dailyMeal.streak > 0 && (
          <View style={tw`flex-row items-center mb-3`}>
            <Flame size={16} color="#F97316" />
            <Text style={tw`text-textSub text-sm ml-2`}>
              Chuỗi {dailyMeal.streak} ngày
            </Text>
          </View>
        )}

        {/* Date Picker */}
        <TouchableOpacity
          style={tw`flex-row items-center bg-gray-50 rounded-xl px-4 py-2 self-start`}
        >
          <Text style={tw`text-brandDark font-semibold text-sm`}>
            {formatDate(selectedDate)}
          </Text>
          <ChevronDown size={16} color="#6B7280" style={tw`ml-2`} />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={tw`flex-1`}>
        <View style={tw`px-6 pt-6`}>
          {/* Meal Sections */}
          <MealSection
            title="Sáng"
            time="7:30 AM"
            items={dailyMeal.breakfast}
            onAddPress={() =>
              navigation.navigate('AddFood', { mealTime: 'breakfast', date: selectedDate })
            }
            onItemPress={(item: MealItem) =>
              navigation.navigate('FoodDetail', { foodId: item.food.id })
            }
            onRemoveItem={handleRemoveItem}
          />

          <MealSection
            title="Trưa"
            time="12:30 PM"
            items={dailyMeal.lunch}
            onAddPress={() =>
              navigation.navigate('AddFood', { mealTime: 'lunch', date: selectedDate })
            }
            onItemPress={(item: MealItem) =>
              navigation.navigate('FoodDetail', { foodId: item.food.id })
            }
            onRemoveItem={handleRemoveItem}
          />

          <MealSection
            title="Tối"
            time="7:00 PM"
            items={dailyMeal.dinner}
            onAddPress={() =>
              navigation.navigate('AddFood', { mealTime: 'dinner', date: selectedDate })
            }
            onItemPress={(item: MealItem) =>
              navigation.navigate('FoodDetail', { foodId: item.food.id })
            }
            onRemoveItem={handleRemoveItem}
          />

          {/* Daily Summary */}
          <View style={tw`bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100`}>
            <Text style={tw`text-brandDark font-bold text-lg mb-4`}>
              Tổng kết hằng ngày
            </Text>

            <View style={tw`mb-4`}>
              <View style={tw`flex-row justify-between items-center mb-2`}>
                <Text style={tw`text-textSub text-sm`}>
                  Mục tiêu: {dailyMeal.dailyGoal.toLocaleString()} kcal
                </Text>
                <Text style={tw`text-brandDark font-bold text-lg`}>
                  {dailyMeal.totalCalories.toLocaleString()} kcal
                </Text>
              </View>

              {/* Progress Bar */}
              <View style={tw`w-full h-4 bg-gray-100 rounded-full overflow-hidden mb-2`}>
                <View
                  style={[
                    tw`h-full bg-primary rounded-full`,
                    { width: `${progressPercentage}%` },
                  ]}
                />
              </View>

              <Text style={tw`text-primary font-semibold text-sm`}>
                {dailyMeal.remainingCalories > 0
                  ? `${dailyMeal.remainingCalories.toLocaleString()} kcal còn lại`
                  : `Vượt ${Math.abs(dailyMeal.remainingCalories).toLocaleString()} kcal`}
              </Text>
            </View>

            {/* Macronutrients */}
            <View style={tw`flex-row justify-between pt-4 border-t border-gray-100`}>
              <View>
                <Text style={tw`text-textSub text-xs mb-1`}>Protein</Text>
                <Text style={tw`text-brandDark font-bold`}>
                  {Math.round(dailyMeal.totalProtein)}g
                </Text>
              </View>
              <View>
                <Text style={tw`text-textSub text-xs mb-1`}>Carbs</Text>
                <Text style={tw`text-brandDark font-bold`}>
                  {Math.round(dailyMeal.totalCarbs)}g
                </Text>
              </View>
              <View>
                <Text style={tw`text-textSub text-xs mb-1`}>Fat</Text>
                <Text style={tw`text-brandDark font-bold`}>
                  {Math.round(dailyMeal.totalFat)}g
                </Text>
              </View>
            </View>
          </View>

          {/* AI Nutrition Tip */}
          <View style={tw`bg-blue-50 rounded-2xl p-5 mb-6 border border-blue-100`}>
            <View style={tw`flex-row items-start`}>
              <View style={tw`w-10 h-10 bg-blue-500 rounded-xl items-center justify-center mr-4`}>
                <Lightbulb size={20} color="#FFFFFF" />
              </View>
              <View style={tw`flex-1`}>
                <Text style={tw`text-brandDark font-bold text-base mb-2`}>
                  Mẹo dinh dưỡng AI
                </Text>
                <Text style={tw`text-textSub text-sm leading-5`}>
                  {dailyMeal.totalCalories > dailyMeal.dailyGoal * 0.7
                    ? 'Bạn đã ăn quá calories vào bữa trưa, nên giảm vào bữa tối'
                    : 'Hãy tiếp tục duy trì chế độ ăn cân bằng với nhiều rau củ và protein'}
                </Text>
              </View>
            </View>
          </View>

          {/* Bottom spacing */}
          <View style={tw`h-6`} />
        </View>
      </ScrollView>
    </View>
  );
};

interface MealSectionProps {
  title: string;
  time: string;
  items: MealItem[];
  onAddPress: () => void;
  onItemPress: (item: MealItem) => void;
  onRemoveItem: (itemId: string) => void;
}

const MealSection = ({
  title,
  time,
  items,
  onAddPress,
  onItemPress,
  onRemoveItem,
}: MealSectionProps) => {
  const totalCalories = items.reduce(
    (sum, item) => sum + item.food.nutrition.calories * item.quantity,
    0,
  );

  return (
    <View style={tw`mb-6`}>
      <View style={tw`flex-row justify-between items-center mb-3`}>
        <View>
          <Text style={tw`text-brandDark font-bold text-lg`}>{title}</Text>
          <Text style={tw`text-textSub text-xs`}>{time}</Text>
        </View>
        <Text style={tw`text-primary font-bold`}>
          Tổng: {totalCalories.toLocaleString()} kcal
        </Text>
      </View>

      {items.length === 0 ? (
        <TouchableOpacity
          onPress={onAddPress}
          style={tw`bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl p-6 items-center`}
        >
          <Plus size={24} color="#9CA3AF" />
          <Text style={tw`text-textSub font-medium mt-2`}>+ Thêm đồ ăn</Text>
        </TouchableOpacity>
      ) : (
        <View style={tw`bg-white rounded-2xl shadow-sm border border-gray-100`}>
          {items.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              onPress={() => onItemPress(item)}
              style={tw`flex-row items-center justify-between p-4 ${
                index !== items.length - 1 ? 'border-b border-gray-100' : ''
              }`}
            >
              <View style={tw`flex-1`}>
                <Text style={tw`text-brandDark font-semibold text-base mb-1`}>
                  {item.food.nameVietnamese}
                </Text>
                <Text style={tw`text-textSub text-xs`}>
                  {item.food.nutrition.protein}g Protein • {item.food.nutrition.carbs}g Carbs •{' '}
                  {item.food.nutrition.fat}g Fat
                </Text>
              </View>
              <View style={tw`flex-row items-center`}>
                <Text style={tw`text-brandDark font-bold text-base mr-3`}>
                  {item.food.nutrition.calories * item.quantity} kcal
                </Text>
                <TouchableOpacity
                  onPress={() => onRemoveItem(item.id)}
                  style={tw`p-1`}
                >
                  <X size={18} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={onAddPress}
            style={tw`p-4 border-t border-gray-100 flex-row items-center justify-center`}
          >
            <Plus size={20} color="#7FB069" />
            <Text style={tw`text-primary font-semibold text-sm ml-2`}>
              + Thêm đồ ăn
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default MealTrackingScreen;
