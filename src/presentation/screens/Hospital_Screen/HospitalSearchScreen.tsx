// src/presentation/screens/Hospital_Screen/HospitalSearchScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import tw from '../../../utils/tailwind';
import {
  Search,
  MapPin,
  Star,
  ChevronRight,
  MoreVertical,
  Navigation,
  Hospital,
  Building2,
  Dumbbell,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
// import {
//   getAllHospitalsUseCase,
//   getHospitalsBySpecialtyUseCase,
// } from '../../../di/Container';
// import { Hospital, HospitalFilter } from '../../../domain/entities/HospitalNew';

const HospitalSearchScreen = () => {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [facilities, setFacilities] = useState<Facility[]>([]);
  const [selectedType, setSelectedType] = useState<FacilityType | 'all'>('all');
  const [loading, setLoading] = useState(false);
  const [isSymptomSearch, setIsSymptomSearch] = useState(false);

  useEffect(() => {
    if (searchQuery.trim()) {
      handleSearch();
    } else {
      setFacilities([]);
    }
  }, [searchQuery, selectedType, handleSearch]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;

    setLoading(true);
    setIsSymptomSearch(false);

    try {
      // Check if it looks like symptoms (contains common symptom keywords)
      const symptomKeywords = ['đau', 'mệt', 'sốt', 'ho', 'chóng mặt', 'buồn nôn'];
      const isSymptom = symptomKeywords.some(keyword =>
        searchQuery.toLowerCase().includes(keyword),
      );

      if (isSymptom && selectedType !== 'gym') {
        // Use AI-based symptom suggestion
        const symptoms = searchQuery.split(',').map(s => s.trim());
        const suggestion = await suggestFacilitiesBySymptomsUseCase.execute(symptoms);
        setFacilities(suggestion.suggestedFacilities);
        setIsSymptomSearch(true);
      } else {
        // Regular search
        const type = selectedType === 'all' ? undefined : selectedType;
        const results = await searchFacilitiesUseCase.execute(searchQuery, type);
        setFacilities(results);
      }
    } catch (error) {
      console.error('Error searching facilities:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeLabel = (type: FacilityType | 'all') => {
    switch (type) {
      case 'clinic':
        return 'Phòng khám';
      case 'hospital':
        return 'Bệnh viện';
      case 'gym':
        return 'Phòng gym';
      default:
        return 'Tất cả';
    }
  };

  // const getTypeIcon = (type: FacilityType) => {
  //   switch (type) {
  //     case 'clinic':
  //       return Hospital;
  //     case 'hospital':
  //       return Building2;
  //     case 'gym':
  //       return Dumbbell;
  //     default:
  //       return Hospital;
  //   };
  // };

  return (
    <View style={tw`flex-1 bg-background`}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={tw`bg-white pt-14 pb-4 px-6 border-b border-gray-100`}>
        <View style={tw`flex-row items-center justify-between mb-4`}>
          <View>
            <Text style={tw`text-xs text-primary font-bold mb-1`}>LÀNH CARE</Text>
            <Text style={tw`text-xl font-bold text-brandDark`}>
              {selectedType === 'gym' ? 'Gợi ý phòng gym' : 'Gợi ý phòng khám'}
            </Text>
          </View>
          <TouchableOpacity>
            <MoreVertical size={20} color="#1F2937" />
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <View style={tw`bg-gray-50 rounded-xl px-4 py-3 flex-row items-center`}>
          <Search size={20} color="#9CA3AF" />
          <TextInput
            placeholder={
              selectedType === 'gym'
                ? 'Nhập tìm kiếm...'
                : 'Nhập tình trạng của bạn, ví dụ: đau đầu, chóng mặt'
            }
            placeholderTextColor="#9CA3AF"
            style={tw`flex-1 ml-3 text-brandDark`}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Instructional Text */}
        <Text style={tw`text-textSub text-xs mt-2`}>
          {selectedType === 'gym'
            ? 'Nhập tên các phòng gym bạn mong muốn hoặc những nơi có những bài tập mà bạn muốn'
            : isSymptomSearch
            ? 'Chúng tôi sẽ gợi ý phòng khám phù hợp nhất'
            : 'Chúng tôi sẽ gợi ý phòng khám phù hợp với tình trạng của bạn'}
        </Text>

        {/* Type Filter */}
        <View style={tw`flex-row mt-4`}>
          {(['all', 'clinic', 'hospital', 'gym'] as const).map((type) => (
            <TouchableOpacity
              key={type}
              onPress={() => setSelectedType(type)}
              style={tw`px-4 py-2 rounded-xl mr-2 ${
                selectedType === type ? 'bg-primary' : 'bg-gray-100'
              }`}
            >
              <Text
                style={tw`font-semibold text-xs ${
                  selectedType === type ? 'text-white' : 'text-textSub'
                }`}
              >
                {getTypeLabel(type)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Results */}
      {loading ? (
        <View style={tw`flex-1 items-center justify-center`}>
          <ActivityIndicator size="large" color="#7FB069" />
        </View>
      ) : facilities.length > 0 ? (
        <ScrollView showsVerticalScrollIndicator={false} style={tw`flex-1`}>
          <View style={tw`px-6 py-4`}>
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <Text style={tw`text-lg font-bold text-brandDark`}>
                Kết quả gợi ý
              </Text>
              <Text style={tw`text-primary font-semibold text-sm`}>
                {facilities.length} {selectedType === 'gym' ? 'phòng gym' : 'phòng khám'}
              </Text>
            </View>

            {facilities.map((facility) => (
              <FacilityCard
                key={facility.id}
                facility={facility}
                onPress={() =>
                  navigation.navigate('HospitalDetail', { facilityId: facility.id })
                }
              />
            ))}

            {/* More Suggestions Button */}
            <TouchableOpacity
              style={tw`bg-white rounded-2xl p-4 items-center border border-gray-100 mb-4`}
            >
              <Text style={tw`text-primary font-semibold`}>Gợi ý khác</Text>
            </TouchableOpacity>

            {/* Bottom spacing */}
            <View style={tw`h-6`} />
          </View>
        </ScrollView>
      ) : searchQuery.trim() ? (
        <View style={tw`flex-1 items-center justify-center px-6`}>
          <View style={tw`w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-4`}>
            {selectedType === 'gym' ? (
              <Dumbbell size={40} color="#9CA3AF" />
            ) : (
              <Hospital size={40} color="#9CA3AF" />
            )}
          </View>
          <Text style={tw`text-brandDark font-semibold text-base mb-2`}>
            Không tìm thấy kết quả
          </Text>
          <Text style={tw`text-textSub text-sm text-center`}>
            Hãy thử tìm kiếm với từ khóa khác hoặc mô tả tình trạng của bạn
          </Text>
        </View>
      ) : (
        <View style={tw`flex-1 items-center justify-center px-6`}>
          <View style={tw`w-24 h-24 bg-gray-100 rounded-full items-center justify-center mb-4`}>
            {selectedType === 'gym' ? (
              <Dumbbell size={40} color="#9CA3AF" />
            ) : (
              <Hospital size={40} color="#9CA3AF" />
            )}
          </View>
          <Text style={tw`text-brandDark font-semibold text-base mb-2 text-center`}>
            {selectedType === 'gym'
              ? 'Tìm phòng gym phù hợp'
              : 'Nhập tình trạng để tìm phòng khám'}
          </Text>
          <Text style={tw`text-textSub text-sm text-center`}>
            {selectedType === 'gym'
              ? 'Nhập tên các phòng gym bạn mong muốn hoặc những nơi có những bài tập mà bạn muốn'
              : 'Ví dụ: đau đầu, chóng mặt, sốt, ho...'}
          </Text>
        </View>
      )}
    </View>
  );
};

interface FacilityCardProps {
  facility: Facility;
  onPress: () => void;
}

const FacilityCard = ({ facility, onPress }: FacilityCardProps) => {
  const IconComponent = facility.type === 'gym' ? Dumbbell : facility.type === 'hospital' ? Building2 : Hospital;

  return (
    <TouchableOpacity
      onPress={onPress}
      style={tw`bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100`}
    >
      <View style={tw`flex-row`}>
        {/* Icon/Image */}
        <View
          style={tw`w-20 h-20 bg-gray-100 rounded-xl items-center justify-center mr-4`}
        >
          <IconComponent size={32} color="#7FB069" />
        </View>

        <View style={tw`flex-1`}>
          {/* Name */}
          <Text style={tw`text-brandDark font-bold text-base mb-1`}>
            {facility.name}
          </Text>

          {/* Address */}
          <View style={tw`flex-row items-start mb-2`}>
            <MapPin size={14} color="#9CA3AF" style={tw`mt-0.5 mr-1`} />
            <Text style={tw`text-textSub text-xs flex-1 leading-4`}>
              {facility.location.address}, {facility.location.district},{' '}
              {facility.location.city}
            </Text>
          </View>

          {/* Specialty (for clinics/hospitals) */}
          {facility.specialty && (
            <View style={tw`bg-primaryLight/30 px-2 py-1 rounded-lg self-start mb-2`}>
              <Text style={tw`text-primary font-semibold text-xs`}>
                {facility.specialty}
              </Text>
            </View>
          )}

          {/* Rating, Distance, Status */}
          <View style={tw`flex-row items-center flex-wrap`}>
            {/* Rating */}
            <View style={tw`flex-row items-center bg-yellow-50 px-2 py-1 rounded-lg mr-2 mb-1`}>
              <Star size={12} color="#F59E0B" fill="#F59E0B" />
              <Text style={tw`text-yellow-700 text-xs font-bold ml-1`}>
                {facility.rating}
              </Text>
            </View>

            {/* Distance */}
            {facility.distance && (
              <Text style={tw`text-textSub text-xs mr-3 mb-1`}>
                {facility.distance} km
              </Text>
            )}

            {/* Status */}
            <View style={tw`flex-row items-center mb-1`}>
              <View
                style={tw`w-2 h-2 rounded-full mr-1 ${
                  facility.isOpen ? 'bg-green-500' : 'bg-red-500'
                }`}
              />
              <Text
                style={tw`text-xs font-medium ${
                  facility.isOpen ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {facility.statusText || (facility.isOpen ? 'Đang mở cửa' : 'Đóng cửa')}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={tw`flex-row justify-between items-center mt-4 pt-4 border-t border-gray-100`}>
        <TouchableOpacity
          onPress={onPress}
          style={tw`flex-row items-center`}
        >
          <Text style={tw`text-primary font-semibold text-sm`}>Xem chi tiết</Text>
          <ChevronRight size={16} color="#7FB069" style={tw`ml-1`} />
        </TouchableOpacity>
        <TouchableOpacity
          style={tw`flex-row items-center bg-primaryLight/30 px-4 py-2 rounded-xl`}
        >
          <Navigation size={16} color="#7FB069" />
          <Text style={tw`text-primary font-semibold text-sm ml-2`}>Chỉ đường</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default HospitalSearchScreen;
