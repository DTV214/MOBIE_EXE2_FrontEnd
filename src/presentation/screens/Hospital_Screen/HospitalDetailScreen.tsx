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
  Hospital,
  Dumbbell,
  MoreVertical,
} from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getFacilityByIdUseCase } from '../../../di/Container';
import { Facility } from '../../../domain/entities/Hospital';
import LinearGradient from 'react-native-linear-gradient';

const HospitalDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { facilityId } = route.params || {};

  const [facility, setFacility] = useState<Facility | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFacility();
  }, [facilityId]);

  const loadFacility = async () => {
    try {
      if (facilityId) {
        const data = await getFacilityByIdUseCase.execute(facilityId);
        setFacility(data);
      }
    } catch (error) {
      console.error('Error loading facility:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCall = () => {
    if (facility?.phone) {
      Linking.openURL(`tel:${facility.phone}`);
    }
  };

  const handleDirections = () => {
    if (facility?.location) {
      const { latitude, longitude } = facility.location;
      const url = `https://maps.google.com/?daddr=${latitude},${longitude}`;
      Linking.openURL(url);
    }
  };

  const getTypeIcon = () => {
    if (!facility) return Hospital;
    switch (facility.type) {
      case 'gym':
        return Dumbbell;
      case 'hospital':
        return Building2;
      default:
        return Hospital;
    }
  };

  if (loading || !facility) {
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
              {facility.name}
            </Text>
            <View style={tw`flex-row items-center`}>
              <MapPin size={14} color="#7FB069" />
              <Text style={tw`text-textSub text-sm ml-1`}>
                {facility.location.address}, {facility.location.district},{' '}
                {facility.location.city}
              </Text>
            </View>
          </View>
          <View style={tw`bg-yellow-50 p-3 rounded-2xl items-center`}>
            <Star size={20} color="#F59E0B" fill="#F59E0B" />
            <Text style={tw`text-yellow-700 font-bold text-sm mt-1`}>
              {facility.rating}
            </Text>
            {facility.reviewCount && (
              <Text style={tw`text-yellow-600 text-[10px] mt-0.5`}>
                ({facility.reviewCount})
              </Text>
            )}
          </View>
        </View>

        {/* Status and Distance */}
        <View style={tw`flex-row items-center mb-6`}>
          <View style={tw`flex-row items-center mr-4`}>
            <View
              style={tw`w-3 h-3 rounded-full mr-2 ${
                facility.isOpen ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            <Text
              style={tw`font-semibold ${
                facility.isOpen ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {facility.statusText || (facility.isOpen ? 'Đang mở cửa' : 'Đóng cửa')}
            </Text>
          </View>
          {facility.distance && (
            <Text style={tw`text-textSub text-sm`}>
              Cách {facility.distance} km
            </Text>
          )}
        </View>

        {/* Opening Hours */}
        {facility.openingHours && (
          <View style={tw`bg-gray-50 rounded-2xl p-4 mb-6`}>
            <View style={tw`flex-row items-center mb-2`}>
              <Clock size={18} color="#7FB069" />
              <Text style={tw`text-brandDark font-semibold text-base ml-2`}>
                Giờ mở cửa
              </Text>
            </View>
            <Text style={tw`text-textSub text-sm`}>
              {facility.openingHours.is24Hours
                ? '24/7'
                : `${facility.openingHours.open} - ${facility.openingHours.close}`}
            </Text>
          </View>
        )}

        {/* Specialty (for clinics/hospitals) */}
        {facility.specialty && (
          <View style={tw`mb-6`}>
            <Text style={tw`text-brandDark font-bold text-lg mb-3`}>
              Chuyên khoa
            </Text>
            <View style={tw`bg-primaryLight/30 px-4 py-3 rounded-xl`}>
              <Text style={tw`text-primary font-semibold text-base`}>
                {facility.specialty}
              </Text>
            </View>
          </View>
        )}

        {/* Description */}
        {facility.description && (
          <View style={tw`mb-6`}>
            <Text style={tw`text-brandDark font-bold text-lg mb-3`}>
              Giới thiệu
            </Text>
            <Text style={tw`text-textSub leading-6`}>{facility.description}</Text>
          </View>
        )}

        {/* Services */}
        {facility.services && facility.services.length > 0 && (
          <View style={tw`mb-6`}>
            <Text style={tw`text-brandDark font-bold text-lg mb-3`}>
              Dịch vụ nổi bật
            </Text>
            <View style={tw`flex-row flex-wrap`}>
              {facility.services.map((service, index) => (
                <View
                  key={index}
                  style={tw`bg-primaryLight/30 px-3 py-2 rounded-xl mr-2 mb-2`}
                >
                  <Text style={tw`text-primary font-semibold text-xs`}>
                    {service}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Contact Info */}
        {facility.phone && (
          <View style={tw`bg-gray-50 rounded-2xl p-4 mb-6`}>
            <Text style={tw`text-brandDark font-bold text-lg mb-3`}>
              Thông tin liên hệ
            </Text>
            <TouchableOpacity
              onPress={handleCall}
              style={tw`flex-row items-center`}
            >
              <Phone size={18} color="#7FB069" />
              <Text style={tw`text-primary font-semibold text-base ml-3`}>
                {facility.phone}
              </Text>
            </TouchableOpacity>
            {facility.website && (
              <Text style={tw`text-textSub text-sm mt-2`}>
                Website: {facility.website}
              </Text>
            )}
          </View>
        )}

        {/* Bottom spacing */}
        <View style={tw`h-6`} />
      </ScrollView>

      {/* Footer Action Buttons */}
      <View style={tw`bg-white border-t border-gray-100 px-6 py-4 flex-row`}>
        {facility.phone && (
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
        {facility.type !== 'gym' && (
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
        )}
      </View>
    </View>
  );
};

export default HospitalDetailScreen;
