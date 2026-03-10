// src/presentation/screens/Hospital_Screen/HospitalDetailScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Linking,
  Platform,
} from 'react-native';
import tw from '../../../utils/tailwind';
import {
  ChevronLeft,
  MapPin,
  Phone,
  Navigation,
  Hospital as HospitalIcon,
  MoreVertical,
} from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Hospital } from '../../../domain/entities/HospitalNew';
import { useTheme } from '../../../contexts/ThemeContext';
import LinearGradient from 'react-native-linear-gradient';

const HospitalDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { hospital: routeHospital } = route.params || {};
  const { isDarkMode, colors } = useTheme();
  const [hospital] = useState<Hospital | null>(routeHospital || null);

  const handleCall = () => {
    if (hospital?.phone) {
      Linking.openURL(`tel:${hospital.phone}`);
    }
  };

  const handleDirections = () => {
    if (hospital?.latitude && hospital?.longitude) {
      const url = Platform.select({
        android: `google.navigation:q=${hospital.latitude},${hospital.longitude}`,
        ios: `maps://app?daddr=${hospital.latitude},${hospital.longitude}`,
        default: `https://www.google.com/maps/dir/?api=1&destination=${hospital.latitude},${hospital.longitude}`,
      });
      Linking.openURL(url);
    }
  };

  const getTypeIcon = () => {
    return HospitalIcon; // All are hospitals now
  };

  if (!hospital) {
    return (
      <View style={[tw`flex-1 items-center justify-center`, { backgroundColor: colors.background }]}>
        <Text style={[tw`text-base`, { color: colors.textSecondary }]}>Không tìm thấy thông tin bệnh viện.</Text>
      </View>
    );
  }

  const IconComponent = getTypeIcon();

  return (
    <View style={[tw`flex-1`, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colors.statusBarStyle}
        backgroundColor={isDarkMode ? colors.background : '#000000'}
      />

      {/* Banner Image */}
      <View style={[tw`relative h-64`, { backgroundColor: colors.surface }]}>
        <View style={tw`flex-1 items-center justify-center`}>
          <IconComponent size={80} color={colors.primary} opacity={0.3} />
        </View>

        {/* Header */}
        <View style={tw`absolute top-0 left-0 right-0 pt-14 pb-4 px-6 flex-row items-center justify-between`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={[
              tw`p-2 rounded-xl`,
              { backgroundColor: isDarkMode ? `${colors.surface}E6` : '#ffffff90' }
            ]}
          >
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <TouchableOpacity style={[
            tw`p-2 rounded-xl`,
            { backgroundColor: isDarkMode ? `${colors.surface}E6` : '#ffffff90' }
          ]}>
            <MoreVertical size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={[
          tw`flex-1 -mt-8 rounded-t-[40px] px-6 pt-8`,
          { backgroundColor: colors.surface }
        ]}
      >
        {/* Name and Rating */}
        <View style={tw`flex-row justify-between items-start mb-4`}>
          <View style={tw`flex-1 mr-4`}>
            <Text style={[tw`text-2xl font-bold mb-2`, { color: colors.text }]}>
              {hospital.name}
            </Text>
            <View style={tw`flex-row items-center`}>
              <MapPin size={14} color={colors.primary} />
              <Text style={[tw`text-sm ml-1 flex-1`, { color: colors.textSecondary }]} numberOfLines={2}>
                {hospital.address}
              </Text>
            </View>
          </View>
          <View style={[tw`p-3 rounded-2xl items-center`, { backgroundColor: `${colors.primary}20` }]}>
            <View style={tw`flex-row items-center`}>
              <HospitalIcon size={16} color={colors.primary} />
              <Text style={[tw`font-bold text-xs mt-1 ml-1`, { color: colors.primary }]}>
                {hospital.specialtyCount}
              </Text>
            </View>
            <Text style={[tw`text-[10px] mt-0.5`, { color: colors.primary }]}>
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
          <Text style={[tw`font-bold text-lg mb-3`, { color: colors.text }]}>
            Thông tin bệnh viện
          </Text>
          <Text style={[tw`leading-6`, { color: colors.textSecondary }]}>
            Bệnh viện {hospital.name} là một cơ sở y tế chất lượng cao với {hospital.specialtyCount} chuyên khoa khác nhau.
          </Text>
        </View>

        {/* Specialties List */}
        {hospital.specialties && hospital.specialties.length > 0 && (
          <View style={tw`mb-6`}>
            <Text style={[tw`font-bold text-lg mb-3`, { color: colors.text }]}>
              Chuyên khoa
            </Text>
            <View style={tw`flex-row flex-wrap`}>
              {hospital.specialties.map(spec => (
                <View
                  key={spec.id}
                  style={[
                    tw`px-3 py-2 rounded-xl mr-2 mb-2 border`,
                    {
                      backgroundColor: `${colors.primary}20`,
                      borderColor: `${colors.primary}40`
                    }
                  ]}
                >
                  <Text style={[tw`font-semibold text-xs`, { color: colors.primary }]}>
                    {spec.nameVn}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Bottom spacing */}
        <View style={tw`h-6`} />
      </ScrollView>

      {/* Footer Action Buttons */}
      <View style={[
        tw`border-t px-6 py-4 flex-row`,
        {
          backgroundColor: colors.surface,
          borderTopColor: colors.border
        }
      ]}>
        {hospital.phone && (
          <TouchableOpacity
            onPress={handleCall}
            style={[
              tw`p-4 rounded-2xl mr-3`,
              { backgroundColor: colors.background }
            ]}
          >
            <Phone size={24} color={colors.primary} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          onPress={handleDirections}
          activeOpacity={0.9}
          style={tw`flex-1`}
        >
          <LinearGradient
            colors={[colors.primary, `${colors.primary}CC`]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={tw`p-4 rounded-2xl flex-row items-center justify-center`}
          >
            <Navigation size={20} color="#FFFFFF" />
            <Text style={tw`text-white font-bold text-base ml-2`}>Chỉ đường</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HospitalDetailScreen;
