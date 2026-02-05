// src/presentation/screens/Hospital_Screen/HospitalDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
} from 'react-native';
import tw from '../../../utils/tailwind';
import {
  ChevronLeft,
  MapPin,
  Star,
  Phone,
  Clock,
  Navigation,
  Building2,
  Hospital as HospitalIcon,
  Dumbbell,
  MoreVertical,
} from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getHospitalByIdUseCase } from '../../../di/Container';
import { Hospital } from '../../../domain/entities/HospitalNew';
import LinearGradient from 'react-native-linear-gradient';

const HospitalDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { hospital: routeHospital } = route.params || {};

  const [hospital, setHospital] = useState<Hospital | null>(routeHospital || null);
  const [loading, setLoading] = useState(!routeHospital);

  useEffect(() => {
    if (!routeHospital && routeHospital?.id) {
      loadHospital();
    }
  }, [routeHospital]);

  const loadHospital = async () => {
    try {
      if (routeHospital?.id) {
        const data = await getHospitalByIdUseCase.execute(routeHospital.id);
        setHospital(data);
      }
    } catch (error) {
      console.error('Error loading hospital:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (hospital?.phone) {
      Linking.openURL(`tel:${hospital.phone}`);
    }
  };

  const handleDirections = () => {
    if (hospital?.latitude && hospital?.longitude) {
      const url = `https://maps.google.com/?daddr=${hospital.latitude},${hospital.longitude}`;
      Linking.openURL(url);
    }
  };

  const getTypeIcon = () => {
    return HospitalIcon; // All are hospitals now
  };

  if (loading || !hospital) {
    return (
      <View style={tw`flex-1 bg-background items-center justify-center`}>
        <Text style={tw`text-textSub`}>Đang tải...</Text>
      </View>
    );
  }

  const IconComponent = getTypeIcon();

  return (
    <View style={tw`flex-1 bg-background`}>
      <StatusBar barStyle="light-content" backgroundColor="#000000" />

      {/* Banner Image */}
      <View style={tw`relative h-64 bg-gray-200`}>
        <View style={tw`flex-1 items-center justify-center`}>
          <IconComponent size={80} color="#7FB069" opacity={0.3} />
        </View>

        {/* Header */}
        <View style={tw`absolute top-0 left-0 right-0 pt-14 pb-4 px-6 flex-row items-center justify-between`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`bg-white/90 p-2 rounded-xl`}
          >
            <ChevronLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <TouchableOpacity style={tw`bg-white/90 p-2 rounded-xl`}>
            <MoreVertical size={20} color="#1F2937" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={tw`flex-1 -mt-8 bg-white rounded-t-[40px] px-6 pt-8`}
      >
        {/* Name and Rating */}
        <View style={tw`flex-row justify-between items-start mb-4`}>
          <View style={tw`flex-1 mr-4`}>
            <Text style={tw`text-2xl font-bold text-brandDark mb-2`}>
              {hospital.name}
            </Text>
            <View style={tw`flex-row items-center`}>
              <MapPin size={14} color="#7FB069" />
              <Text style={tw`text-textSub text-sm ml-1 flex-1`} numberOfLines={2}>
                {hospital.address}
              </Text>
            </View>
          </View>
          <View style={tw`bg-green-50 p-3 rounded-2xl items-center`}>
            <View style={tw`flex-row items-center`}>
              <HospitalIcon size={16} color="#10B981" />
              <Text style={tw`text-green-700 font-bold text-xs mt-1 ml-1`}>
                {hospital.specialtyCount}
              </Text>
            </View>
            <Text style={tw`text-green-600 text-[10px] mt-0.5`}>
              chuyên khoa
            </Text>
          </View>
        </View>

        {/* Status */}
        <View style={tw`flex-row items-center mb-6`}>
          <View style={tw`flex-row items-center mr-4`}>
            <View
              style={tw`w-3 h-3 rounded-full mr-2 ${
                hospital.status === 'ACTIVE' ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <Text
              style={tw`font-semibold ${
                hospital.status === 'ACTIVE' ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {hospital.status === 'ACTIVE' ? 'Hoạt động' : 'Không hoạt động'}
            </Text>
          </View>
        </View>

        {/* Description */}
        <View style={tw`mb-6`}>
          <Text style={tw`text-brandDark font-bold text-lg mb-3`}>
            Thông tin bệnh viện
          </Text>
          <Text style={tw`text-textSub leading-6`}>
            Bệnh viện {hospital.name} là một cơ sở y tế chất lượng cao với {hospital.specialtyCount} chuyên khoa khác nhau.
            Địa chỉ: {hospital.address}
          </Text>
        </View>

        {/* Contact Info */}
        <View style={tw`bg-gray-50 rounded-2xl p-4 mb-6`}>
          <Text style={tw`text-brandDark font-bold text-lg mb-3`}>
            Thông tin liên hệ
          </Text>
          {hospital.phone && (
            <TouchableOpacity
              onPress={handleCall}
              style={tw`flex-row items-center`}
            >
              <Phone size={18} color="#7FB069" />
              <Text style={tw`text-primary font-semibold text-base ml-3`}>
                {hospital.phone}
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Bottom spacing */}
        <View style={tw`h-6`} />
      </ScrollView>

      {/* Footer Action Buttons */}
      <View style={tw`bg-white border-t border-gray-100 px-6 py-4 flex-row`}>
        {hospital.phone && (
          <TouchableOpacity
            onPress={handleCall}
            style={tw`bg-gray-100 p-4 rounded-2xl mr-3`}
          >
            <Phone size={24} color="#7FB069" />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={handleDirections}
          style={tw`flex-1 bg-gray-100 p-4 rounded-2xl mr-3 flex-row items-center justify-center`}
        >
          <Navigation size={20} color="#7FB069" />
          <Text style={tw`text-primary font-bold text-base ml-2`}>Chỉ đường</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`flex-1`}
          activeOpacity={0.9}
        >
          <LinearGradient
            colors={['#7FB069', '#6A9A5A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={tw`p-4 rounded-2xl items-center justify-center`}
          >
            <Text style={tw`text-white font-bold text-base`}>
              Đặt lịch hẹn
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HospitalDetailScreen;
