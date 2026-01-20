// src/presentation/screens/Meal_Screen/AddFoodScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  TextInput,
  FlatList,
} from 'react-native';
import tw from '../../../utils/tailwind';
import {
  ChevronLeft,
  Search,
  Plus,
  Check,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { searchFoodsUseCase, addMealItemUseCase } from '../../../di/Container';
import { Food, MealItem } from '../../../domain/entities/Food';

const AddFoodScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { mealTime, date } = route.params || {};

  const [searchQuery, setSearchQuery] = useState('');
  const [foods, setFoods] = useState<Food[]>([]);
  const [selectedFoods, setSelectedFoods] = useState<Food[]>([]);
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFoods();
  }, []);

  useEffect(() => {
    if (searchQuery.trim()) {
      searchFoods();
    } else {
      loadFoods();
    }
  }, [searchQuery]);

  const loadFoods = async () => {
    try {
      const allFoods = await searchFoodsUseCase.execute('');
      setFoods(allFoods);
    } catch (error) {
      console.error('Error loading foods:', error);
    } finally {
      setLoading(false);
    }
  };

  const searchFoods = async () => {
    try {
      const results = await searchFoodsUseCase.execute(searchQuery);
      setFoods(results);
    } catch (error) {
      console.error('Error searching foods:', error);
    }
  };

  const handleFilter = (filter: string) => {
    setActiveFilter(filter);
    // Filter logic would go here
    // For now, just show all foods
  };

  const toggleFoodSelection = (food: Food) => {
    if (selectedFoods.find(f => f.id === food.id)) {
      setSelectedFoods(selectedFoods.filter(f => f.id !== food.id));
    } else {
      setSelectedFoods([...selectedFoods, food]);
    }
  };

  const handleAddToMeal = async () => {
    try {
      for (const food of selectedFoods) {
        const mealItem: MealItem = {
          id: `${food.id}-${Date.now()}`,
          food,
          quantity: 1,
          mealTime: mealTime || 'breakfast',
          date: date || new Date().toISOString().split('T')[0],
        };
        await addMealItemUseCase.execute(mealItem);
      }
      navigation.goBack();
    } catch (error) {
      console.error('Error adding meal items:', error);
    }
  };

  const getMealTimeLabel = () => {
    switch (mealTime) {
      case 'breakfast':
        return 'Sáng';
      case 'lunch':
        return 'Trưa';
      case 'dinner':
        return 'Tối';
      default:
        return 'Bữa ăn';
    }
  };

  const filteredFoods = foods.filter(food => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'low-calorie') return food.nutrition.calories < 400;
    if (activeFilter === 'high-protein') return food.nutrition.protein > 25;
    if (activeFilter === 'vegi') return food.tags?.includes('vegetarian');
    return true;
  });

  return (
    <View style={tw`flex-1 bg-background`}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={tw`bg-white pt-14 pb-4 px-6 border-b border-gray-100`}>
        <View style={tw`flex-row items-center mb-4`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`p-2 mr-4`}
          >
            <ChevronLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <View style={tw`flex-1`}>
            <Text style={tw`text-xl font-bold text-brandDark`}>Add Food</Text>
            <Text style={tw`text-textSub text-sm`}>
              Select from Vietnamese dishes
            </Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={tw`bg-gray-50 rounded-xl px-4 py-3 flex-row items-center`}>
          <Search size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Search Vietnamese dishes..."
            placeholderTextColor="#9CA3AF"
            style={tw`flex-1 ml-3 text-brandDark`}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={tw`bg-white px-6 py-3 border-b border-gray-100 flex-row`}>
        {['all', 'low-calorie', 'high-protein', 'vegi'].map((filter) => (
          <TouchableOpacity
            key={filter}
            onPress={() => handleFilter(filter)}
            style={tw`px-4 py-2 rounded-xl mr-2 ${
              activeFilter === filter ? 'bg-primary' : 'bg-gray-100'
            }`}
          >
            <Text
              style={tw`font-semibold text-xs ${
                activeFilter === filter ? 'text-white' : 'text-textSub'
              }`}
            >
              {filter === 'all'
                ? 'All'
                : filter === 'low-calorie'
                ? 'Low Calorie'
                : filter === 'high-protein'
                ? 'High Protein'
                : 'Vegi'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Food List */}
      <FlatList
        data={filteredFoods}
        keyExtractor={item => item.id}
        renderItem={({ item }) => {
          const isSelected = selectedFoods.find(f => f.id === item.id);
          return (
            <TouchableOpacity
              onPress={() => toggleFoodSelection(item)}
              style={tw`bg-white mx-6 my-2 rounded-2xl p-4 shadow-sm border border-gray-100 flex-row`}
            >
              {/* Food Image Placeholder */}
              <View style={tw`w-20 h-20 bg-gray-100 rounded-xl items-center justify-center mr-4`}>
                <Text style={tw`text-2xl`}>🍜</Text>
              </View>

              <View style={tw`flex-1`}>
                <Text style={tw`text-brandDark font-bold text-base mb-1`}>
                  {item.nameVietnamese}
                </Text>
                <Text style={tw`text-primary font-bold text-lg mb-2`}>
                  {item.nutrition.calories} kcal
                </Text>
                <Text style={tw`text-textSub text-xs`}>
                  {item.nutrition.protein}g • {item.nutrition.carbs}g •{' '}
                  {item.nutrition.fat}g
                </Text>
              </View>

              <View style={tw`items-center justify-center`}>
                {isSelected ? (
                  <View style={tw`w-8 h-8 bg-primary rounded-full items-center justify-center`}>
                    <Check size={16} color="#FFFFFF" />
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => toggleFoodSelection(item)}
                    style={tw`w-8 h-8 border-2 border-primary rounded-full items-center justify-center`}
                  >
                    <Plus size={16} color="#7FB069" />
                  </TouchableOpacity>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
        contentContainerStyle={tw`pb-24`}
      />

      {/* Floating Action Bar */}
      {selectedFoods.length > 0 && (
        <View style={tw`absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 flex-row items-center justify-between shadow-lg`}>
          <Text style={tw`text-brandDark font-semibold`}>
            {selectedFoods.length} food{selectedFoods.length > 1 ? 's' : ''} selected
          </Text>
          <TouchableOpacity onPress={handleAddToMeal} activeOpacity={0.9}>
            <LinearGradient
              colors={['#7FB069', '#6A9A5A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={tw`px-6 py-3 rounded-xl`}
            >
              <Text style={tw`text-white font-bold`}>
                Add to {getMealTimeLabel()}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default AddFoodScreen;
