import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import tw from '../../../utils/tailwind';
import { ChevronLeft, Info, ShieldCheck, Heart, Utensils } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const FoodDetailScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Hero Image Section */}
      <View style={tw`relative h-80 bg-gray-100`}>
        <View style={tw`flex-1 items-center justify-center`}>
          <Utensils size={100} color="#E5E7EB" />
          <Text style={tw`text-gray-400 italic mt-4`}>[Hình ảnh món ăn]</Text>
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
        style={tw`flex-1 -mt-10 bg-white rounded-t-[45px] px-8 pt-10`}
      >
        <View style={tw`flex-row justify-between items-start mb-2`}>
          <View style={tw`flex-1 mr-4`}>
            <Text style={tw`text-3xl font-black text-brandDark`}>Phở bò</Text>
            <Text style={tw`text-textSub font-medium mt-1`}>
              Món chính • Ẩm thực Việt Nam
            </Text>
          </View>
          <View style={tw`items-end`}>
            <Text style={tw`text-primary text-3xl font-black`}>400</Text>
            <Text style={tw`text-textSub text-xs font-bold uppercase`}>
              Kcal / Bát
            </Text>
          </View>
        </View>

        {/* Macros Breakdown */}
        <View
          style={tw`flex-row justify-between mt-8 bg-gray-50 p-6 rounded-[35px]`}
        >
          <MacroDetail
            label="Protein"
            value="25g"
            percent="35%"
            color="bg-orange-400"
          />
          <MacroDetail
            label="Carbs"
            value="45g"
            percent="50%"
            color="bg-blue-400"
          />
          <MacroDetail
            label="Fat"
            value="12g"
            percent="15%"
            color="bg-yellow-400"
          />
        </View>

        {/* Nutrition Facts */}
        <View style={tw`mt-10`}>
          <Text style={tw`text-xl font-bold text-brandDark mb-4`}>
            Chi tiết dinh dưỡng
          </Text>
          <NutritionRow label="Chất xơ" value="2.4g" />
          <NutritionRow label="Đường" value="3.1g" />
          <NutritionRow label="Natri" value="1,200mg" warning />
          <NutritionRow label="Kali" value="450mg" />
        </View>

        {/* Healthy Tip */}
        <View
          style={tw`mt-8 bg-green-50 p-6 rounded-[30px] border border-green-100 mb-10`}
        >
          <View style={tw`flex-row items-center mb-2`}>
            <ShieldCheck size={20} color="#22C55E" />
            <Text style={tw`ml-2 text-primary font-bold`}>
              Lời khuyên sức khỏe
            </Text>
          </View>
          <Text style={tw`text-green-800/80 leading-5 text-sm`}>
            Phở bò cung cấp lượng đạm dồi dào. Để lành mạnh hơn, bạn nên hạn chế
            ăn nước béo và thêm nhiều rau sống để tăng chất xơ.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
};

const MacroDetail = ({ label, value, percent, color }: any) => (
  <View style={tw`items-center`}>
    <View
      style={tw`w-12 h-12 rounded-full ${color} items-center justify-center mb-2 shadow-sm`}
    >
      <Text style={tw`text-white text-[10px] font-black`}>{percent}</Text>
    </View>
    <Text style={tw`text-brandDark font-bold text-sm`}>{value}</Text>
    <Text style={tw`text-gray-400 text-[10px] font-bold uppercase`}>
      {label}
    </Text>
  </View>
);

const NutritionRow = ({ label, value, warning = false }: any) => (
  <View style={tw`flex-row justify-between py-4 border-b border-gray-50`}>
    <Text style={tw`text-textSub font-medium`}>{label}</Text>
    <View style={tw`flex-row items-center`}>
      <Text
        style={tw`font-bold ${warning ? 'text-red-500' : 'text-brandDark'}`}
      >
        {value}
      </Text>
      {warning && <Info size={14} color="#EF4444" style={tw`ml-1`} />}
    </View>
  </View>
);

export default FoodDetailScreen;
