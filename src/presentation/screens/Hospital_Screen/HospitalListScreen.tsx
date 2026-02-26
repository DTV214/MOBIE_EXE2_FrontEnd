// src/presentation/screens/Hospital_Screen/HospitalListScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  ActivityIndicator,
  Alert,
  RefreshControl,
} from 'react-native';
import tw from '../../../utils/tailwind';
import {
  Search,
  MapPin,
  ChevronRight,
  Hospital as HospitalIcon,
  Phone,
  Navigation,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import {
  getAllHospitalsUseCase
} from '../../../di/Container';
import { Hospital, HospitalFilter } from '../../../domain/entities/HospitalNew';

const HospitalListScreen = () => {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const loadHospitals = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🏥 Loading hospitals...');
      const filter: HospitalFilter = {
        page: 0,
        size: 20,
        status: 'ACTIVE',
      };

      const result = await getAllHospitalsUseCase.execute(filter);
      setHospitals(result.content);
      console.log(`✅ Loaded ${result.content.length} hospitals`);
    } catch (err: any) {
      console.error('❌ Error loading hospitals:', err);
      setError(err.message || 'Không thể tải danh sách bệnh viện');
      Alert.alert('Lỗi', err.message || 'Không thể tải danh sách bệnh viện');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const searchHospitals = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log(`🔍 Searching hospitals: "${searchQuery}"`);
      const filter: HospitalFilter = {
        search: searchQuery.trim(),
        page: 0,
        size: 20,
        status: 'ACTIVE',
      };

      const result = await getAllHospitalsUseCase.execute(filter);
      setHospitals(result.content);
      console.log(`✅ Found ${result.content.length} hospitals`);
    } catch (err: any) {
      console.error('❌ Error searching hospitals:', err);
      setError(err.message || 'Không thể tìm kiếm bệnh viện');
    } finally {
      setLoading(false);
    }
  }, [searchQuery]);

  // Load hospitals on component mount
  useEffect(() => {
    loadHospitals();
  }, [loadHospitals]);

  // Search hospitals when query changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchHospitals();
      } else {
        loadHospitals();
      }
    }, 500); // Debounce search

    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchHospitals, loadHospitals]);

  const onRefresh = () => {
    setRefreshing(true);
    loadHospitals();
  };

  const navigateToDetail = (hospital: Hospital) => {
    navigation.navigate('HospitalDetail', { hospital });
  };

  const renderHospitalCard = (hospital: Hospital) => (
    <TouchableOpacity
      key={hospital.id}
      style={tw`bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100`}
      onPress={() => navigateToDetail(hospital)}
    >
      <View style={tw`flex-row justify-between items-start mb-2`}>
        <View style={tw`flex-1`}>
          <Text style={tw`text-lg font-bold text-gray-900 mb-1`}>
            {hospital.name}
          </Text>
          <View style={tw`flex-row items-center mb-2`}>
            <MapPin size={16} color="#6B7280" />
            <Text style={tw`text-gray-600 ml-1 flex-1`} numberOfLines={2}>
              {hospital.address}
            </Text>
          </View>
        </View>
        <View style={tw`ml-2`}>
          <View style={tw`bg-green-100 px-2 py-1 rounded-full`}>
            <Text style={tw`text-green-700 text-xs font-medium`}>
              {hospital.status === 'ACTIVE' ? 'Hoạt động' : hospital.status}
            </Text>
          </View>
        </View>
      </View>

      <View style={tw`flex-row items-center justify-between`}>
        <View style={tw`flex-row items-center`}>
          <HospitalIcon size={16} color="#10B981" />
          <Text style={tw`text-green-600 ml-1 font-medium`}>
            {hospital.specialtyCount} chuyên khoa
          </Text>
        </View>
        
        <View style={tw`flex-row items-center`}>
          {hospital.phone && (
            <TouchableOpacity style={tw`p-2 mr-2`}>
              <Phone size={16} color="#3B82F6" />
            </TouchableOpacity>
          )}
          <TouchableOpacity style={tw`p-2 mr-2`}>
            <Navigation size={16} color="#3B82F6" />
          </TouchableOpacity>
          <ChevronRight size={16} color="#9CA3AF" />
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
      
      {/* Header */}
      <View style={tw`bg-white px-4 py-3 border-b border-gray-200`}>
        <Text style={tw`text-xl font-bold text-gray-900 mb-3`}>
          Danh sách bệnh viện
        </Text>
        
        {/* Search Bar */}
        <View style={tw`flex-row items-center bg-gray-100 rounded-xl px-4 py-3`}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={tw`flex-1 ml-3 text-gray-900`}
            placeholder="Tìm kiếm bệnh viện..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCorrect={false}
            autoCapitalize="words"
            underlineColorAndroid="transparent"
            allowFontScaling={false}
          />
        </View>
      </View>

      {/* Content */}
      <ScrollView
        style={tw`flex-1 px-4`}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#10B981']}
          />
        }
      >
        <View style={tw`py-4`}>
          {/* Loading */}
          {loading && (
            <View style={tw`py-8`}>
              <ActivityIndicator size="large" color="#10B981" />
              <Text style={tw`text-center text-gray-600 mt-2`}>
                Đang tải danh sách bệnh viện...
              </Text>
            </View>
          )}

          {/* Error */}
          {error && !loading && (
            <View style={tw`bg-red-50 p-4 rounded-xl mb-4`}>
              <Text style={tw`text-red-700 text-center`}>{error}</Text>
              <TouchableOpacity
                style={tw`bg-red-100 px-4 py-2 rounded-lg mt-2`}
                onPress={loadHospitals}
              >
                <Text style={tw`text-red-700 text-center font-medium`}>
                  Thử lại
                </Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Results */}
          {!loading && !error && (
            <>
              <Text style={tw`text-gray-600 mb-3`}>
                {hospitals.length} bệnh viện được tìm thấy
              </Text>
              
              {hospitals.length > 0 ? (
                hospitals.map(renderHospitalCard)
              ) : (
                <View style={tw`py-12 items-center`}>
                  <HospitalIcon size={48} color="#D1D5DB" />
                  <Text style={tw`text-gray-500 text-center mt-3`}>
                    {searchQuery 
                      ? `Không tìm thấy bệnh viện nào với từ khóa "${searchQuery}"`
                      : 'Không có bệnh viện nào'
                    }
                  </Text>
                </View>
              )}
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default HospitalListScreen;