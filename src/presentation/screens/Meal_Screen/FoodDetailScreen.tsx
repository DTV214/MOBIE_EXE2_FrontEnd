// src/presentation/screens/Meal_Screen/FoodDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import tw from '../../../utils/tailwind';
import {
  ChevronLeft,
  Heart,
  Lightbulb,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getFoodByIdUseCase, addMealItemUseCase } from '../../../di/Container';
import { Food, MealItem } from '../../../domain/entities/Food';

const FoodDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { foodId, mealTime, date } = route.params || {};

  const [food, setFood] = useState<Food | null>(null);
  const [substitutions, setSubstitutions] = useState<Food[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFood();
  }, [foodId]);

  const loadFood = async () => {
    try {
      const foodData = await getFoodByIdUseCase.execute(foodId);
      if (foodData) {
        setFood(foodData);
        // Load healthy substitutions
        if (foodData.healthySubstitutions && foodData.healthySubstitutions.length > 0) {
          const subs = await Promise.all(
            foodData.healthySubstitutions.map(id => getFoodByIdUseCase.execute(id)),
          );
          setSubstitutions(subs.filter(f => f !== null) as Food[]);
        }
      }
    } catch (error) {
      console.error('Error loading food:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToMeal = async () => {
    if (!food || !mealTime) return;

    try {
      const mealItem: MealItem = {
        id: `${food.id}-${Date.now()}`,
        food,
        quantity: 1,
        mealTime: mealTime || 'breakfast',
        date: date || new Date().toISOString().split('T')[0],
      };
      await addMealItemUseCase.execute(mealItem);
      navigation.goBack();
    } catch (error) {
      console.error('Error adding meal item:', error);
    }
  };

  const getMacroPercentage = (value: number, total: number) => {
    return Math.round((value / total) * 100);
  };

  if (loading || !food) {
    return (
      <View style={tw`flex-1 bg-background items-center justify-center`}>
        <Text style={tw`text-textSub`}>Đang tải...</Text>
      </View>
    );
  }

  // Calculate macro percentages based on calories
  const proteinCalories = food.nutrition.protein * 4;
  const carbsCalories = food.nutrition.carbs * 4;
  const fatCalories = food.nutrition.fat * 9;
  const totalCalories = proteinCalories + carbsCalories + fatCalories;
  
  const proteinPercent = totalCalories > 0 ? Math.round((proteinCalories / totalCalories) * 100) : 0;
  const carbsPercent = totalCalories > 0 ? Math.round((carbsCalories / totalCalories) * 100) : 0;
  const fatPercent = totalCalories > 0 ? Math.round((fatCalories / totalCalories) * 100) : 0;

  return (
    <View style={tw`flex-1 bg-background`}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Hero Image Section */}
      <View style={tw`relative h-80 bg-gray-200`}>
        <View style={tw`flex-1 items-center justify-center`}>
          <Text style={tw`text-6xl`}>🍜</Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`absolute top-12 left-6 bg-white/90 p-3 rounded-2xl shadow-md`}
        >
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>

        <TouchableOpacity
          style={tw`absolute top-12 right-6 bg-white/90 p-3 rounded-2xl shadow-md`}
        >
          <Heart size={22} color="#EF4444" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={tw`flex-1 -mt-10 bg-white rounded-t-[45px] px-6 pt-8`}
      >
        {/* Food Info */}
        <View style={tw`flex-row justify-between items-start mb-4`}>
          <View style={tw`flex-1 mr-4`}>
            <Text style={tw`text-3xl font-black text-brandDark mb-2`}>
              {food.nameVietnamese}
            </Text>
            <Text style={tw`text-textSub font-medium`}>
              {food.description || 'Vietnamese main dish'}
            </Text>
          </View>
          <View style={tw`items-end`}>
            <Text style={tw`text-primary text-4xl font-black`}>
              {food.nutrition.calories}
            </Text>
            <Text style={tw`text-textSub text-xs font-bold uppercase`}>kcal</Text>
          </View>
        </View>

        {/* Macronutrient Breakdown */}
        <View style={tw`mt-6 mb-6`}>
          <View style={tw`flex-row justify-between mb-4`}>
            <MacroBar
              label="Protein"
              value={food.nutrition.protein}
              unit="g"
              percentage={proteinPercent}
              color="#7FB069"
            />
            <MacroBar
              label="Fat"
              value={food.nutrition.fat}
              unit="g"
              percentage={fatPercent}
              color="#F97316"
            />
            <MacroBar
              label="Carbs"
              value={food.nutrition.carbs}
              unit="g"
              percentage={carbsPercent}
              color="#3B82F6"
            />
          </View>
          <Text style={tw`text-textSub text-xs text-center mt-2`}>
            Protein {food.nutrition.protein}g | Fat {food.nutrition.fat}g | Carbs{' '}
            {food.nutrition.carbs}g
          </Text>
        </View>

        {/* Nutrition Breakdown */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-xl font-bold text-brandDark mb-4`}>
            Nutrition Breakdown
          </Text>
          {food.nutrition.sodium && (
            <NutritionRow label="Sodium" value={`${food.nutrition.sodium}mg`} />
          )}
          {food.nutrition.fiber && (
            <NutritionRow label="Fiber" value={`${food.nutrition.fiber}g`} />
          )}
          {food.nutrition.sugar && (
            <NutritionRow label="Sugar" value={`${food.nutrition.sugar}g`} />
          )}
          {food.nutrition.calcium && (
            <NutritionRow label="Calcium" value={`${food.nutrition.calcium}mg`} />
          )}
          {food.nutrition.iron && (
            <NutritionRow label="Iron" value={`${food.nutrition.iron}mg`} />
          )}
          {food.nutrition.vitaminC && (
            <NutritionRow label="Vitamin C" value={`${food.nutrition.vitaminC}mg`} />
          )}
        </View>

        {/* Healthy Substitutions */}
        {substitutions.length > 0 && (
          <View style={tw`mb-6`}>
            <Text style={tw`text-xl font-bold text-brandDark mb-4`}>
              Healthy Substitutions
            </Text>
            {substitutions.map((sub) => {
              const calorieDiff = sub.nutrition.calories - food.nutrition.calories;
              return (
                <TouchableOpacity
                  key={sub.id}
                  onPress={() => navigation.replace('FoodDetail', { foodId: sub.id, mealTime, date })}
                  style={tw`bg-white rounded-2xl p-4 mb-3 flex-row items-center shadow-sm border border-gray-100`}
                >
                  <View style={tw`w-16 h-16 bg-gray-100 rounded-xl items-center justify-center mr-4`}>
                    <Text style={tw`text-2xl`}>🍜</Text>
                  </View>
                  <View style={tw`flex-1`}>
                    <Text style={tw`text-brandDark font-semibold text-base mb-1`}>
                      {sub.nameVietnamese}
                    </Text>
                    <Text style={tw`text-primary font-bold`}>
                      {sub.nutrition.calories} kcal
                    </Text>
                  </View>
                  <View style={tw`items-end`}>
                    <Text
                      style={tw`font-bold text-sm ${
                        calorieDiff < 0 ? 'text-green-600' : 'text-textSub'
                      }`}
                    >
                      {calorieDiff < 0 ? '-' : '+'}
                      {Math.abs(calorieDiff)} kcal
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* AI Tip */}
        {food.aiTip && (
          <View style={tw`bg-blue-50 rounded-2xl p-5 mb-6 border border-blue-100`}>
            <View style={tw`flex-row items-start`}>
              <View style={tw`w-10 h-10 bg-blue-500 rounded-xl items-center justify-center mr-4`}>
                <Lightbulb size={20} color="#FFFFFF" />
              </View>
              <View style={tw`flex-1`}>
                <Text style={tw`text-brandDark font-bold text-base mb-2`}>
                  AI Tip
                </Text>
                <Text style={tw`text-textSub text-sm leading-5`}>{food.aiTip}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Action Buttons */}
        {mealTime && (
          <View style={tw`mb-6`}>
            <TouchableOpacity onPress={handleAddToMeal} activeOpacity={0.9}>
              <LinearGradient
                colors={['#7FB069', '#6A9A5A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={tw`h-14 rounded-2xl flex-row items-center justify-center shadow-lg mb-3`}
              >
                <Text style={tw`text-white font-bold text-lg`}>Add to Meal</Text>
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={tw`h-14 rounded-2xl border-2 border-gray-200 flex-row items-center justify-center`}
            >
              <Text style={tw`text-brandDark font-semibold text-lg`}>Close</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Bottom spacing */}
        <View style={tw`h-6`} />
      </ScrollView>
    </View>
  );
};

const MacroBar = ({
  label,
  value,
  unit,
  percentage,
  color,
}: {
  label: string;
  value: number;
  unit: string;
  percentage: number;
  color: string;
}) => (
  <View style={tw`flex-1 items-center`}>
    <View style={tw`w-full h-2 bg-gray-100 rounded-full mb-2 overflow-hidden`}>
      <View
        style={[
          tw`h-full rounded-full`,
          { width: `${Math.min(percentage, 100)}%`, backgroundColor: color },
        ]}
      />
    </View>
    <Text style={tw`text-brandDark font-bold text-sm mb-1`}>
      {value}
      {unit}
    </Text>
    <Text style={tw`text-textSub text-[10px] font-bold uppercase`}>{label}</Text>
  </View>
);

const NutritionRow = ({ label, value }: { label: string; value: string }) => (
  <View style={tw`flex-row justify-between py-3 border-b border-gray-100`}>
    <Text style={tw`text-textSub font-medium`}>{label}</Text>
    <Text style={tw`text-brandDark font-bold`}>{value}</Text>
  </View>
);

export default FoodDetailScreen;
