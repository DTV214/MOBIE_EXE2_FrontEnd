import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Image,
} from 'react-native';
import tw from '../../../utils/tailwind';
import { ChevronLeft, Info, Plus, Utensils } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useMealTrackingStore } from '../../viewmodels/useMealTrackingStore';

const FoodDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { foodId, mealLogId } = route.params;

  const { searchFoods, addFood } = useMealTrackingStore();
  const food = searchFoods.find(f => f.id === foodId);

  if (!food) return <ActivityIndicator style={tw`flex-1`} />;

  return (
    <View style={tw`flex-1 bg-white`}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Hero Section */}
      <View style={tw`h-80 bg-gray-200 relative`}>
        {food.imageUrl ? (
          <Image source={{ uri: food.imageUrl }} style={tw`w-full h-full`} />
        ) : (
          <View style={tw`flex-1 items-center justify-center`}>
            <Utensils size={64} color="#9CA3AF" />
          </View>
        )}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`absolute top-12 left-6 bg-white/90 p-3 rounded-2xl shadow-md`}
        >
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={tw`flex-1 -mt-10 bg-white rounded-t-[45px] px-8 pt-10`}
        showsVerticalScrollIndicator={false}
      >
        <View style={tw`flex-row justify-between items-start mb-6`}>
          <View style={tw`flex-1 mr-4`}>
            <Text style={tw`text-3xl font-black text-brandDark mb-2`}>
              {food.name}
            </Text>
            <Text style={tw`text-gray-400 font-medium`}>
              {food.foodTypeName}
            </Text>
          </View>
          <View style={tw`items-end`}>
            <Text style={tw`text-primary text-4xl font-black`}>
              {food.calo}
            </Text>
            <Text style={tw`text-gray-400 text-xs font-bold uppercase`}>
              kcal
            </Text>
          </View>
        </View>

        <View
          style={tw`bg-blue-50 p-5 rounded-3xl border border-blue-100 flex-row items-center mb-8`}
        >
          <Info size={20} color="#3B82F6" />
          <Text style={tw`ml-3 text-blue-800 text-xs leading-4 flex-1`}>
            {food.description ||
              'Món ăn này cung cấp nguồn năng lượng cân bằng cho cơ thể bạn.'}
          </Text>
        </View>

        <View style={tw`mb-10`}>
          <Text style={tw`text-lg font-bold text-brandDark mb-4`}>
            Thông tin định lượng
          </Text>
          <View style={tw`bg-gray-50 p-4 rounded-2xl flex-row justify-between`}>
            <Text style={tw`text-brandDark font-medium`}>Kích thước chuẩn</Text>
            <Text style={tw`text-primary font-bold`}>
              {food.standardServingSize} {food.servingUnit}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          onPress={async () => {
            await addFood(mealLogId, food.id);
            navigation.goBack();
          }}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#7FB069', '#6A9A5A']}
            style={tw`h-16 rounded-2xl flex-row items-center justify-center shadow-lg mb-10`}
          >
            <Plus size={24} color="white" style={tw`mr-2`} />
            <Text style={tw`text-white font-bold text-lg`}>
              Thêm vào bữa ăn
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default FoodDetailScreen;
