import React from 'react';
import { View, Text, ScrollView, TouchableOpacity} from 'react-native';
import tw from '../../../utils/tailwind';
import {
  ChevronLeft,
  MapPin,
  Star,
  Phone,

  ShieldCheck,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const HospitalDetailScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Banner Image */}
      <View style={tw`relative h-64 bg-gray-200`}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`absolute top-12 left-6 z-10 bg-white/80 p-2 rounded-xl`}
        >
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={tw`flex-1 items-center justify-center`}>
          <MapPin size={64} color="#22C55E" opacity={0.3} />
          <Text style={tw`text-gray-400 mt-2 italic`}>
            [Hình ảnh bệnh viện]
          </Text>
        </View>
      </View>

      <ScrollView style={tw`flex-1 -mt-8 bg-white rounded-t-[40px] px-8 pt-8`}>
        <View style={tw`flex-row justify-between items-start mb-4`}>
          <View style={tw`flex-1 mr-4`}>
            <Text style={tw`text-2xl font-bold text-dark`}>
              Bệnh viện Bạch Mai
            </Text>
            <View style={tw`flex-row items-center mt-2`}>
              <MapPin size={14} color="#22C55E" />
              <Text style={tw`text-gray-500 text-xs ml-1`}>
                Đống Đa, Hà Nội
              </Text>
            </View>
          </View>
          <View style={tw`bg-yellow-50 p-2 rounded-2xl items-center`}>
            <Star size={20} color="#F59E0B" fill="#F59E0B" />
            <Text style={tw`text-yellow-700 font-bold text-xs mt-1`}>4.6</Text>
          </View>
        </View>

        {/* Quick Stats */}
        <View style={tw`flex-row justify-between mb-8`}>
          <StatBox label="Bác sĩ" value="250+" />
          <StatBox label="Bệnh nhân" value="10k+" />
          <StatBox label="Kinh nghiệm" value="100 năm" />
        </View>

        <Text style={tw`text-lg font-bold text-dark mb-3`}>Giới thiệu</Text>
        <Text style={tw`text-gray-500 leading-5 mb-6`}>
          Bạch Mai là một trong những bệnh viện lớn nhất Việt Nam. Với đội ngũ y
          bác sĩ đầu ngành và trang thiết bị hiện đại, chúng tôi cam kết mang
          lại dịch vụ y tế tốt nhất.
        </Text>

        <Text style={tw`text-lg font-bold text-dark mb-4`}>
          Dịch vụ nổi bật
        </Text>
        <View style={tw`flex-row flex-wrap mb-10`}>
          <ServiceTag name="Nội tổng quát" />
          <ServiceTag name="Tim mạch" />
          <ServiceTag name="Hồi sức cấp cứu" />
          <ServiceTag name="Chẩn đoán hình ảnh" />
        </View>
      </ScrollView>

      {/* Footer Action Buttons */}
      <View style={tw`p-6 bg-white border-t border-gray-100 flex-row`}>
        <TouchableOpacity style={tw`bg-gray-100 p-4 rounded-2xl mr-4`}>
          <Phone size={24} color="#22C55E" />
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`flex-1 bg-secondary p-4 rounded-2xl items-center justify-center`}
        >
          <Text style={tw`text-white font-bold text-base`}>
            Đặt lịch hẹn ngay
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const StatBox = ({ label, value }: any) => (
  <View style={tw`bg-gray-50 p-3 rounded-2xl items-center flex-1 mx-1`}>
    <Text style={tw`text-secondary font-bold text-sm`}>{value}</Text>
    <Text style={tw`text-gray-400 text-[10px] mt-1`}>{label}</Text>
  </View>
);

const ServiceTag = ({ name }: any) => (
  <View
    style={tw`bg-green-50 px-3 py-2 rounded-xl mr-2 mb-2 border border-green-100 flex-row items-center`}
  >
    <ShieldCheck size={12} color="#22C55E" style={tw`mr-1`} />
    <Text style={tw`text-green-700 text-xs font-medium`}>{name}</Text>
  </View>
);

export default HospitalDetailScreen;
