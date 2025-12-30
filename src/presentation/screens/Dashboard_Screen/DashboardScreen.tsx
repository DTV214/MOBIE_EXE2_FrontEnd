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
  Bell,
  Search,
  Footprints,
  Flame,
  Moon,
  ChevronRight,
  Activity,
} from 'lucide-react-native';
import { StatCard } from '../../components/StatCard';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const DashboardScreen = () => {
  const navigation = useNavigation<any>();

  const handlePressMetric = (metric: string) => {
    navigation.navigate('HealthDetail', { metricType: metric });
  };

  return (
    <View style={tw`flex-1 bg-softGray`}>
      <StatusBar barStyle="dark-content" />

      {/* Header Bar */}
      <View
        style={tw`pt-12 pb-4 px-6 bg-white flex-row justify-between items-center shadow-sm`}
      >
        <View style={tw`flex-row items-center`}>
          <View
            style={tw`w-10 h-10 bg-primaryLight rounded-full items-center justify-center mr-3`}
          >
            <Text style={tw`text-primary font-bold`}>S</Text>
          </View>
          <View>
            <Text style={tw`text-gray-400 text-xs font-medium`}>
              Chào buổi sáng
            </Text>
            <Text style={tw`text-lg font-bold text-gray-800`}>Sarah 👋</Text>
          </View>
        </View>
        <View style={tw`flex-row`}>
          <TouchableOpacity
            style={tw`p-2 bg-gray-50 rounded-full mr-2`}
            onPress={() => {}}
          >
            <Search size={20} color="#6B7280" />
          </TouchableOpacity>
          <TouchableOpacity
            style={tw`p-2 bg-gray-50 rounded-full`}
            onPress={() => {}}
          >
            <Bell size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={tw`flex-1`}>
        <View style={tw`px-6`}>
          {/* AI Banner */}
          <TouchableOpacity activeOpacity={0.9}>
            <LinearGradient
              colors={['#1F2937', '#111827']}
              style={tw`mt-6 p-5 rounded-3xl flex-row justify-between items-center shadow-md`}
            >
              <View style={tw`flex-1 mr-4`}>
                <View style={tw`flex-row items-center mb-1`}>
                  <Activity size={14} color="#22C55E" style={tw`mr-2`} />
                  <Text
                    style={tw`text-primary font-bold text-xs uppercase tracking-wider`}
                  >
                    AI Health Insight
                  </Text>
                </View>
                <Text style={tw`text-white text-base font-semibold leading-5`}>
                  Nhịp tim trung bình của bạn ổn định hơn tuần trước.
                </Text>
              </View>
              <ChevronRight size={20} color="white" />
            </LinearGradient>
          </TouchableOpacity>

          <View style={tw`mt-8`}>
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <Text style={tw`text-lg font-bold text-gray-800`}>
                Chỉ số hôm nay
              </Text>
              <TouchableOpacity>
                <Text style={tw`text-primary font-medium`}>Cập nhật</Text>
              </TouchableOpacity>
            </View>

            {/* Metrics Grid/List */}
            <TouchableOpacity onPress={() => handlePressMetric('Steps')}>
              <StatCard
                title="Bước đi"
                value="8,247"
                subtitle="Mục tiêu: 10,000"
                accentColor="bg-blue-50"
                icon={<Footprints size={24} color="#3B82F6" />}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handlePressMetric('Calories')}>
              <StatCard
                title="Calo tiêu thụ"
                value="1,847 Kcal"
                subtitle="Còn lại: 350 Kcal"
                accentColor="bg-orange-50"
                icon={<Flame size={24} color="#F97316" />}
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => handlePressMetric('Sleep')}>
              <StatCard
                title="Giấc ngủ"
                value="7h 30m"
                subtitle="Chất lượng tốt"
                accentColor="bg-purple-50"
                icon={<Moon size={24} color="#8B5CF6" />}
              />
            </TouchableOpacity>
          </View>

          {/* Health Tip */}
          <View
            style={tw`mt-2 bg-primaryLight/30 p-4 rounded-2xl flex-row items-center mb-10 border border-primaryLight`}
          >
            <View style={tw`bg-white p-2 rounded-xl mr-3 shadow-sm`}>
              <Activity size={18} color="#22C55E" />
            </View>
            <Text style={tw`flex-1 text-primaryDark text-sm font-medium`}>
              Bạn đã hoàn thành 80% mục tiêu vận động. Tiếp tục cố gắng nhé!
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;
