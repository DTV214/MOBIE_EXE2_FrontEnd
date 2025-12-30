import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,

} from 'react-native';
import tw from '../../../utils/tailwind';
import {
  Search,
  MapPin,
  Star,

  Filter,
  ChevronRight,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const HospitalSearchScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={tw`flex-1 bg-background`}>
      {/* Header & Search Bar */}
      <View style={tw`pt-12 pb-6 px-6 bg-white rounded-b-3xl shadow-sm`}>
        <Text style={tw`text-2xl font-bold text-dark mb-4`}>
          Tìm kiếm bệnh viện
        </Text>
        <View
          style={tw`flex-row items-center bg-gray-100 px-4 py-2 rounded-2xl`}
        >
          <Search size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Tìm bệnh viện, chuyên khoa..."
            style={tw`flex-1 ml-2 text-base text-dark`}
          />
          <TouchableOpacity style={tw`bg-white p-2 rounded-xl`}>
            <Filter size={18} color="#22C55E" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={tw`flex-1 px-6 pt-4`}
      >
        <View style={tw`flex-row justify-between items-center mb-4`}>
          <Text style={tw`text-lg font-bold text-dark`}>Kết quả gợi ý</Text>
          <Text style={tw`text-secondary font-medium`}>5 phòng khám</Text>
        </View>

        {/* Danh sách các thẻ Bệnh viện */}
        <HospitalCard
          name="Bệnh viện Bạch Mai"
          address="78 Giải Phóng, Đống Đa, Hà Nội"
          rating="4.6"
          distance="2.8 km"
          isOpen={true}
          onPress={() => navigation.navigate('HospitalDetail')}
        />

        <HospitalCard
          name="Phòng khám Đa khoa Medlatec"
          address="42-44 Nghĩa Dũng, Ba Đình, Hà Nội"
          rating="4.8"
          distance="1.2 km"
          isOpen={true}
          onPress={() => navigation.navigate('HospitalDetail')}
        />

        <HospitalCard
          name="Trung tâm Y tế Quận Ba Đình"
          address="27 Núi Trúc, Ba Đình, Hà Nội"
          rating="4.3"
          distance="0.8 km"
          isOpen={false}
          onPress={() => navigation.navigate('HospitalDetail')}
        />

        <View style={tw`h-10`} />
      </ScrollView>
    </View>
  );
};

// Component thẻ Bệnh viện
const HospitalCard = ({
  name,
  address,
  rating,
  distance,
  isOpen,
  onPress,
}: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={tw`bg-white p-4 rounded-3xl mb-4 shadow-sm border border-gray-50`}
  >
    <View style={tw`flex-row`}>
      <View
        style={tw`w-20 h-20 bg-gray-100 rounded-2xl items-center justify-center mr-4`}
      >
        <MapPin size={32} color="#22C55E" />
      </View>
      <View style={tw`flex-1`}>
        <Text style={tw`text-base font-bold text-dark mb-1`}>{name}</Text>
        <Text style={tw`text-xs text-gray-500 mb-2 leading-4`}>{address}</Text>
        <View style={tw`flex-row items-center`}>
          <View
            style={tw`flex-row items-center bg-yellow-50 px-2 py-0.5 rounded-lg mr-3`}
          >
            <Star size={12} color="#F59E0B" fill="#F59E0B" />
            <Text style={tw`text-yellow-700 text-[10px] font-bold ml-1`}>
              {rating}
            </Text>
          </View>
          <Text style={tw`text-gray-400 text-[10px]`}>{distance}</Text>
          <View style={tw`flex-row items-center ml-auto`}>
            <View
              style={tw`w-1.5 h-1.5 rounded-full ${
                isOpen ? 'bg-green-500' : 'bg-red-500'
              } mr-1`}
            />
            <Text
              style={tw`${
                isOpen ? 'text-green-600' : 'text-red-600'
              } text-[10px] font-medium`}
            >
              {isOpen ? 'Đang mở cửa' : 'Đóng cửa'}
            </Text>
          </View>
        </View>
      </View>
    </View>
    <View
      style={tw`mt-4 pt-3 border-t border-gray-50 flex-row justify-between items-center`}
    >
      <Text style={tw`text-secondary text-xs font-bold`}>Xem chi tiết</Text>
      <ChevronRight size={16} color="#22C55E" />
    </View>
  </TouchableOpacity>
);

export default HospitalSearchScreen;
