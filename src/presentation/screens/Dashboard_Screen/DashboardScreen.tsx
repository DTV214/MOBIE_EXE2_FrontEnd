// src/presentation/screens/Dashboard_Screen/DashboardScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
} from 'react-native';
import tw from '../../../utils/tailwind';
import {
  Heart,
  Utensils,
  Bot,
  Hospital,
  Crown,
  Footprints,
  Flame,
  Moon,
  ChevronRight,
  Leaf,
  MoreVertical,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import {
  getDailyProgressUseCase,
  getHealthInsightsUseCase,
  getHealthTipsUseCase,
} from '../../../di/Container';
import { DailyProgress } from '../../../domain/entities/HealthMetric';
import { HealthInsight } from '../../../domain/entities/HealthInsight';
import { HealthTip } from '../../../domain/entities/HealthInsight';

const DashboardScreen = () => {
  const navigation = useNavigation<any>();
  const [dailyProgress, setDailyProgress] = useState<DailyProgress | null>(null);
  const [healthInsight, setHealthInsight] = useState<HealthInsight | null>(null);
  const [healthTips, setHealthTips] = useState<HealthTip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [progress, insights, tips] = await Promise.all([
        getDailyProgressUseCase.execute(),
        getHealthInsightsUseCase.execute(),
        getHealthTipsUseCase.execute(2),
      ]);
      setDailyProgress(progress);
      setHealthInsight(insights[0] || null);
      setHealthTips(tips);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const QuickAccessCard = ({
    icon: Icon,
    title,
    subtitle,
    color,
    onPress,
  }: {
    icon: any;
    title: string;
    subtitle: string;
    color: string;
    onPress: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={tw`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex-1 mx-1`}
    >
      <View style={tw`w-12 h-12 rounded-xl items-center justify-center mb-3`}>
        <Icon size={24} color={color} />
      </View>
      <Text style={tw`text-brandDark font-bold text-sm mb-1`}>{title}</Text>
      <Text style={tw`text-textSub text-xs leading-4`}>{subtitle}</Text>
    </TouchableOpacity>
  );

  if (loading || !dailyProgress) {
    return (
      <View style={tw`flex-1 bg-background items-center justify-center`}>
        <Text style={tw`text-textSub`}>Đang tải...</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-background`}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header với greeting */}
        <LinearGradient
          colors={['#E8F5E3', '#FFFFFF']}
          style={tw`pt-14 pb-8 px-6`}
        >
          <View style={tw`flex-row justify-between items-center mb-4`}>
            <View style={tw`flex-1`}>
              <Text style={tw`text-xs text-primary font-bold mb-1`}>
                LÀNH CARE
              </Text>
              <Text style={tw`text-2xl font-black text-brandDark mb-1`}>
                Xin chào, Sarah 👋
              </Text>
              <Text style={tw`text-textSub text-sm`}>
                Chăm sóc sức khỏe mỗi ngày
              </Text>
            </View>
            {/* Avatar placeholder */}
            <View style={tw`w-14 h-14 bg-primary rounded-full items-center justify-center border-2 border-white shadow-md`}>
              <Text style={tw`text-white font-bold text-lg`}>S</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={tw`px-6 pt-6`}>
          {/* Quick Access Cards - 2x2 Grid */}
          <View style={tw`mb-6`}>
            <View style={tw`flex-row mb-3`}>
              <QuickAccessCard
                icon={Heart}
                title="Nhịp Tim"
                subtitle="Theo dõi sức khỏe hàng ngày"
                color="#3B82F6"
                onPress={() => navigation.navigate('HeartRateDetail')}
              />
              <QuickAccessCard
                icon={Utensils}
                title="Theo dõi Thức Ăn"
                subtitle="Ghi lại các bữa ăn hôm nay"
                color="#F97316"
                onPress={() => navigation.navigate('MealTracking')}
              />
            </View>
            <View style={tw`flex-row`}>
              <QuickAccessCard
                icon={Bot}
                title="AI Coach"
                subtitle="Tư vấn AI bất cứ lúc nào"
                color="#7FB069"
                onPress={() => navigation.navigate('AI')}
              />
              <QuickAccessCard
                icon={Hospital}
                title="Tìm Bệnh viện"
                subtitle="Chăm sóc sức khỏe lân cận"
                color="#8B5CF6"
                onPress={() => navigation.navigate('Bệnh viện')}
              />
            </View>
          </View>

          {/* Membership Section */}
          <TouchableOpacity
            style={tw`bg-white rounded-2xl p-4 flex-row items-center justify-between mb-6 shadow-sm border border-gray-100`}
            activeOpacity={0.8}
          >
            <View style={tw`flex-row items-center flex-1`}>
              <View style={tw`w-12 h-12 bg-yellow-100 rounded-xl items-center justify-center mr-4`}>
                <Crown size={24} color="#F59E0B" />
              </View>
              <View style={tw`flex-1`}>
                <Text style={tw`text-brandDark font-bold text-base mb-1`}>
                  Gói Membership
                </Text>
                <Text style={tw`text-textSub text-xs`}>
                  Quản lý và nâng cấp tài khoản của bạn
                </Text>
              </View>
            </View>
            <ChevronRight size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Daily Progress Summary */}
          <View style={tw`bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100`}>
            <Text style={tw`text-brandDark font-bold text-lg mb-4`}>
              Quá trình hôm nay
            </Text>

            {/* Steps */}
            <View style={tw`flex-row items-center mb-4`}>
              <View style={tw`w-10 h-10 bg-blue-50 rounded-xl items-center justify-center mr-3`}>
                <Footprints size={20} color="#3B82F6" />
              </View>
              <Text style={tw`text-brandDark font-semibold flex-1`}>
                {dailyProgress.steps.value.toLocaleString()} bước
              </Text>
            </View>

            {/* Calories */}
            <View style={tw`flex-row items-center mb-4`}>
              <View style={tw`w-10 h-10 bg-orange-50 rounded-xl items-center justify-center mr-3`}>
                <Flame size={20} color="#F97316" />
              </View>
              <Text style={tw`text-brandDark font-semibold flex-1`}>
                {dailyProgress.calories.value.toLocaleString()} calo đã đốt
              </Text>
            </View>

            {/* Sleep */}
            <View style={tw`flex-row items-center mb-4`}>
              <View style={tw`w-10 h-10 bg-purple-50 rounded-xl items-center justify-center mr-3`}>
                <Moon size={20} color="#8B5CF6" />
              </View>
              <Text style={tw`text-brandDark font-semibold flex-1`}>
                {dailyProgress.sleep.value.toFixed(1)}h ngủ
              </Text>
            </View>

            {/* View Full Dashboard Button */}
            <TouchableOpacity
              onPress={() => navigation.navigate('HealthSummary')}
              activeOpacity={0.9}
            >
              <LinearGradient
                colors={['#7FB069', '#6A9A5A']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={tw`h-12 rounded-xl flex-row items-center justify-center mt-2`}
              >
                <Text style={tw`text-white font-bold text-sm`}>
                  Xem toàn bộ bảng điều khiển
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* AI Health Tip */}
          {healthInsight && (
            <View style={tw`bg-primaryLight rounded-2xl p-5 mb-6 border border-primaryLight/50`}>
              <View style={tw`flex-row items-start`}>
                <View style={tw`w-10 h-10 bg-primary rounded-xl items-center justify-center mr-4`}>
                  <Leaf size={20} color="#FFFFFF" />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-brandDark font-bold text-base mb-2`}>
                    {healthInsight.title}
                  </Text>
                  <Text style={tw`text-textSub text-sm leading-5`}>
                    {healthInsight.description}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Health Care Tips */}
          <View style={tw`bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100`}>
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <Text style={tw`text-brandDark font-bold text-lg`}>
                Mẹo chăm sóc sức khỏe
              </Text>
              <TouchableOpacity>
                <Text style={tw`text-primary font-semibold text-sm`}>Xem thêm</Text>
              </TouchableOpacity>
            </View>

            {healthTips.map((tip, index) => (
              <TouchableOpacity
                key={tip.id}
                style={tw`flex-row items-start mb-4 ${index === healthTips.length - 1 ? 'mb-0' : ''}`}
                activeOpacity={0.8}
              >
                <View
                  style={tw`w-12 h-12 rounded-xl items-center justify-center mr-4 ${
                    tip.category === 'nutrition'
                      ? 'bg-orange-50'
                      : tip.category === 'sleep'
                      ? 'bg-purple-50'
                      : 'bg-blue-50'
                  }`}
                >
                  {tip.category === 'nutrition' ? (
                    <Utensils size={20} color="#F97316" />
                  ) : tip.category === 'sleep' ? (
                    <Moon size={20} color="#8B5CF6" />
                  ) : (
                    <Footprints size={20} color="#3B82F6" />
                  )}
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-brandDark font-semibold text-sm mb-1`}>
                    {tip.title}
                  </Text>
                  <View style={tw`flex-row items-center`}>
                    {tip.calories && (
                      <Text style={tw`text-textSub text-xs mr-3`}>{tip.calories}</Text>
                    )}
                    <Text style={tw`text-textSub text-xs`}>{tip.readTime}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Bottom spacing */}
          <View style={tw`h-6`} />
        </View>
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;
