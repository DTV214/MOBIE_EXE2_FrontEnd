import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import tw from '../../../utils/tailwind';
import {
  Plus,
  
  ChevronRight,
  Utensils,
  
  Search,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const MealTrackingScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={tw`flex-1 bg-background`}>
      <StatusBar barStyle="dark-content" />
      {/* Header */}
      <View
        style={tw`pt-12 pb-4 px-6 bg-white flex-row justify-between items-center shadow-sm`}
      >
        <Text style={tw`text-2xl font-bold text-textMain`}>
          Nhật ký ăn uống
        </Text>
        <TouchableOpacity style={tw`p-2 bg-gray-50 rounded-full`}>
          <Search size={22} color="#6B7280" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={tw`flex-1 px-6`}>
        {/* Calorie Progress Card */}
        <LinearGradient
          colors={['#22C55E', '#16a34a']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={tw`mt-6 p-6 rounded-[35px] shadow-lg`}
        >
          <View style={tw`flex-row justify-between items-start`}>
            <View style={tw`flex-1`}>
              <Text style={tw`text-white/80 font-medium text-sm mb-1`}>
                Năng lượng còn lại
              </Text>
              <Text style={tw`text-white text-4xl font-black italic`}>
                800 <Text style={tw`text-lg font-normal`}>kcal</Text>
              </Text>

              <View style={tw`mt-4 flex-row items-center`}>
                <View style={tw`mr-4`}>
                  <Text
                    style={tw`text-white/60 text-[10px] uppercase font-bold`}
                  >
                    Mục tiêu
                  </Text>
                  <Text style={tw`text-white font-bold`}>2,040</Text>
                </View>
                <View>
                  <Text
                    style={tw`text-white/60 text-[10px] uppercase font-bold`}
                  >
                    Đã nạp
                  </Text>
                  <Text style={tw`text-white font-bold`}>1,240</Text>
                </View>
              </View>
            </View>

            {/* Macro Circles */}
            <View style={tw`items-center`}>
              <View
                style={tw`w-24 h-24 rounded-full border-8 border-white/10 items-center justify-center`}
              >
                <View
                  style={tw`absolute w-24 h-24 rounded-full border-8 border-white border-t-transparent border-r-transparent -rotate-45`}
                />
                <Utensils size={24} color="white" />
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* Macros Summary */}
        <View style={tw`flex-row justify-between mt-6`}>
          <MacroBox label="Protein" value="45g" color="bg-orange-400" />
          <MacroBox label="Carbs" value="120g" color="bg-blue-400" />
          <MacroBox label="Fat" value="30g" color="bg-yellow-400" />
        </View>

        {/* Meal Sections */}
        <View style={tw`mt-8 mb-20`}>
          <MealSection
            title="Bữa sáng"
            calories="450"
            items={[
              { name: 'Phở bò', detail: '1 bát tô • 25g Protein', calo: '400' },
              { name: 'Cà phê sữa', detail: '1 ly • 12g Đường', calo: '50' },
            ]}
            onItemPress={() => navigation.navigate('FoodDetail')}
          />

          <MealSection
            title="Bữa trưa"
            calories="620"
            items={[
              {
                name: 'Cơm tấm sườn bì chả',
                detail: '1 đĩa đầy đủ • 35g Protein',
                calo: '620',
              },
            ]}
            onItemPress={() => navigation.navigate('FoodDetail')}
          />

          <MealSection title="Bữa tối" calories="0" empty={true} />
        </View>
      </ScrollView>

      {/* Floating Add Button */}
      <TouchableOpacity
        style={tw`absolute bottom-8 right-6 bg-primary w-16 h-16 rounded-full items-center justify-center shadow-xl border-4 border-white`}
      >
        <Plus size={32} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const MacroBox = ({ label, value, color }: any) => (
  <View
    style={tw`bg-white px-4 py-3 rounded-2xl flex-1 mx-1 shadow-sm border border-gray-50`}
  >
    <View style={tw`w-2 h-2 rounded-full ${color} mb-1`} />
    <Text style={tw`text-textSub text-[10px] font-bold uppercase`}>
      {label}
    </Text>
    <Text style={tw`text-textMain font-bold`}>{value}</Text>
  </View>
);

const MealSection = ({
  title,
  calories,
  items = [],
  empty = false,
  onItemPress,
}: any) => (
  <View style={tw`mb-8`}>
    <View style={tw`flex-row justify-between items-end mb-4`}>
      <Text style={tw`text-xl font-bold text-brandDark`}>{title}</Text>
      <Text style={tw`text-primary font-bold`}>
        {calories}{' '}
        <Text style={tw`text-gray-400 font-normal text-xs`}>kcal</Text>
      </Text>
    </View>

    {empty ? (
      <TouchableOpacity
        style={tw`bg-gray-50 border-2 border-dashed border-gray-200 p-6 rounded-[30px] items-center`}
      >
        <Plus size={24} color="#9CA3AF" />
        <Text style={tw`text-gray-400 font-medium mt-2`}>Thêm bữa ăn</Text>
      </TouchableOpacity>
    ) : (
      <View
        style={tw`bg-white rounded-[30px] p-2 shadow-sm border border-gray-100`}
      >
        {items.map((item: any, index: number) => (
          <TouchableOpacity
            key={index}
            onPress={onItemPress}
            style={tw`flex-row justify-between items-center p-4 ${
              index !== items.length - 1 ? 'border-b border-gray-50' : ''
            }`}
          >
            <View style={tw`flex-1`}>
              <Text style={tw`text-textMain font-bold text-base`}>
                {item.name}
              </Text>
              <Text style={tw`text-textSub text-xs mt-1`}>{item.detail}</Text>
            </View>
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-textMain font-black mr-2`}>{item.calo}</Text>
              <ChevronRight size={18} color="#D1D5DB" />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    )}
  </View>
);

export default MealTrackingScreen;
