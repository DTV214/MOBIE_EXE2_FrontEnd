import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StatusBar,
  TextInput,
  FlatList,
  ActivityIndicator,
  Image,
  Alert,
} from 'react-native';
import tw from '../../../utils/tailwind';
import { ChevronLeft, Search, Plus, Utensils } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMealTrackingStore } from '../../viewmodels/useMealTrackingStore';

const AddFoodScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { mealLogId } = route.params || {}; // Chống lỗi undefined params

  const {
    searchFoods,
    isLoading,
    hasMore,
    searchFoodsAction,
    loadMoreFoods,
    addFood,
  } = useMealTrackingStore();
  const [query, setQuery] = useState('');

  useEffect(() => {
    searchFoodsAction('');
  }, [searchFoodsAction]);

  const handleSearch = (text: string) => {
    setQuery(text);
    searchFoodsAction(text);
  };

  const onAddPress = async (food: any) => {
    if (!mealLogId) {
      Alert.alert('Lỗi', 'Mã bữa ăn không hợp lệ.');
      return;
    }

    try {
      console.log(`--- [UI] Adding Food ID ${food.id} to Meal ID ${mealLogId}`);
      await addFood(mealLogId, food.id); // Gọi action đã có logic sync Calo
      Alert.alert('Thành công', `Đã thêm ${food.name} vào bữa ăn!`);
    } catch (error: any) {
      const msg =
        error.response?.data?.message ||
        'Lỗi 500: Vui lòng kiểm tra lại Backend.';
      Alert.alert('Lỗi hệ thống', msg);
    }
  };

  return (
    <View style={tw`flex-1 bg-white`}>
      <StatusBar barStyle="dark-content" />
      <View style={tw`pt-14 pb-4 px-6 border-b border-gray-100`}>
        <View style={tw`flex-row items-center mb-4`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`p-2 mr-2`}
          >
            <ChevronLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={tw`text-xl font-black text-brandDark`}>Thêm món ăn</Text>
        </View>
        <View
          style={tw`bg-gray-100 rounded-2xl px-4 py-3 flex-row items-center`}
        >
          <Search size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Tìm kiếm phở, bún, cơm..."
            style={tw`flex-1 ml-3 text-brandDark font-medium`}
            value={query}
            onChangeText={handleSearch}
            autoCorrect={false}
            autoCapitalize="words"
            underlineColorAndroid="transparent"
            allowFontScaling={false}
          />
        </View>
      </View>

      <FlatList
        data={searchFoods}
        keyExtractor={item => item.id.toString()}
        onEndReached={loadMoreFoods}
        onEndReachedThreshold={0.5}
        ListFooterComponent={() =>
          isLoading && hasMore ? (
            <ActivityIndicator color="#7FB069" style={tw`my-4`} />
          ) : null
        }
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('FoodDetail', { foodId: item.id, mealLogId })
            }
            style={tw`bg-white mx-6 my-2 rounded-2xl p-4 shadow-sm border border-gray-50 flex-row items-center`}
          >
            <View
              style={tw`w-16 h-16 bg-gray-50 rounded-xl items-center justify-center mr-4`}
            >
              {item.imageUrl ? (
                <Image
                  source={{ uri: item.imageUrl }}
                  style={tw`w-full h-full rounded-xl`}
                />
              ) : (
                <Utensils size={24} color="#D1D5DB" />
              )}
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-brandDark font-bold text-base`}>
                {item.name}
              </Text>
              <Text style={tw`text-primary font-bold text-xs mt-1`}>
                {item.calo} kcal / {item.standardServingSize}
                {item.servingUnit}
              </Text>
            </View>
            <TouchableOpacity
              onPress={() => onAddPress(item)}
              style={tw`w-10 h-10 bg-primary/10 rounded-full items-center justify-center`}
            >
              <Plus size={20} color="#7FB069" />
            </TouchableOpacity>
          </TouchableOpacity>
        )}
        contentContainerStyle={tw`pb-10`}
      />
    </View>
  );
};

export default AddFoodScreen;
