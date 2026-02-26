// src/presentation/screens/Dashboard_Screen/DashboardScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl, // Thêm RefreshControl để kéo xuống load lại trang
  ActivityIndicator,
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

// 1. Import Store User để lấy thông tin
import { useUserStore } from '../../viewmodels/useUserStore';

// Helper function: Dynamic greeting dựa trên thời gian
const getDynamicGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 6) return { text: 'Chào đêm khuya', emoji: '🌙' };
  if (hour < 12) return { text: 'Chào buổi sáng', emoji: '🌅' };
  if (hour < 17) return { text: 'Chào buổi chiều', emoji: '☀️' };
  if (hour < 21) return { text: 'Chào buổi tối', emoji: '🌆' };
  return { text: 'Chúc ngủ ngon', emoji: '🌙' };
};

// Component QuickAccessCard được di chuyển ra ngoài để tránh re-render
interface QuickAccessCardProps {
  icon: any;
  title: string;
  subtitle: string;
  color: string;
  onPress: () => void;
}

const QuickAccessCard = ({
  icon: Icon,
  title,
  subtitle,
  color,
  onPress,
}: QuickAccessCardProps) => (
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

const DashboardScreen = () => {
  const navigation = useNavigation<any>();
  const greeting = getDynamicGreeting();

  // 2. Lấy user và health profile từ Store
  const { user, healthProfile, fetchUserProfile } = useUserStore();

  const [dailyProgress, setDailyProgress] = useState<DailyProgress | null>(
    null,
  );
  const [healthInsight, setHealthInsight] = useState<HealthInsight | null>(
    null,
  );
  const [healthTips, setHealthTips] = useState<HealthTip[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // State xử lý refresh

  useEffect(() => {
    loadData();
    // Nếu store chưa có user (ví dụ reload app), gọi API lấy lại
    if (!user) {
      fetchUserProfile();
    }
  }, [user, fetchUserProfile]);

  // Hàm load dữ liệu dashboard
  const loadData = async () => {
    try {
      const [progress, insights, tips] = await Promise.all([
        getDailyProgressUseCase.execute(),
        getHealthInsightsUseCase.execute(),
        getHealthTipsUseCase.execute(3), // Giảm xuống 3 tips cho gọn
      ]);
      setDailyProgress(progress);
      setHealthInsight(insights[0] || null);
      setHealthTips(tips);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Hàm xử lý khi kéo xuống để refresh
  const onRefresh = React.useCallback(() => {
    setRefreshing(true);
    fetchUserProfile(); // Cập nhật lại thông tin user
    loadData(); // Cập nhật lại chỉ số sức khỏe
  }, [fetchUserProfile]);

  if (loading || !dailyProgress) {
    return (
      <View style={tw`flex-1 bg-background`}>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
        
        {/* Loading header */}
        <LinearGradient
          colors={['#E8F5E3', '#FFFFFF']}
          style={tw`pt-14 pb-8 px-6`}
        >
          <View style={tw`h-20 bg-white/30 rounded-xl mb-4`} />
        </LinearGradient>
        
        <View style={tw`px-6 pt-6`}>
          {/* Loading skeletons */}
          {[...Array(3)].map((_, i) => (
            <View key={i} style={tw`bg-white rounded-2xl p-4 mb-4 h-24`} />
          ))}
          
          <View style={tw`items-center mt-8`}>
            <ActivityIndicator size="large" color="#7FB069" />
            <Text style={tw`text-textSub mt-2`}>Đang tải dữ liệu sức khỏe...</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-background`}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#7FB069']}
          />
        }
      >
        {/* Header với greeting */}
        <LinearGradient
          colors={['#E8F5E3', '#FFFFFF']}
          style={tw`pt-14 pb-8 px-6`}
        >
          <View style={tw`flex-row justify-between items-center mb-4`}>
            <View style={tw`flex-1`}>
              <Text style={tw`text-xs text-primary font-bold mb-1`}>
                LÀNH CARE {greeting.emoji}
              </Text>
              {/* 3. Dynamic greeting với emoji */}
              <Text style={tw`text-2xl font-black text-brandDark mb-1`}>
                {greeting.text}, {user?.fullName?.split(' ').pop() || 'Bạn'}!
              </Text>
              <View style={tw`flex-row items-center`}>
                <Text style={tw`text-textSub text-sm`}>
                  Chăm sóc sức khỏe mỗi ngày
                </Text>
                {/* 4. Show BMI nếu có health profile */}
                {healthProfile?.bmi && (
                  <Text style={tw`text-primary text-xs font-semibold ml-2 bg-primaryLight px-2 py-1 rounded-lg`}>
                    BMI: {healthProfile.bmi.toFixed(1)}
                  </Text>
                )}
              </View>
            </View>
            {/* Avatar với tên hoặc BMI status color */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Hồ sơ')}
              style={tw`w-14 h-14 ${
                healthProfile?.bmi 
                  ? healthProfile.bmi < 18.5 
                    ? 'bg-blue-500' 
                    : healthProfile.bmi > 25 
                    ? 'bg-orange-500' 
                    : 'bg-primary'
                  : 'bg-primary'
              } rounded-full items-center justify-center border-2 border-white shadow-md`}
            >
              <Text style={tw`text-white font-bold text-lg`}>
                {user?.fullName ? user.fullName.charAt(0).toUpperCase() : 'U'}
              </Text>
            </TouchableOpacity>
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
                onPress={() => navigation.navigate('Bữa ăn')} // Điều hướng qua Tab Bữa ăn
              />
            </View>
            <View style={tw`flex-row`}>
              <QuickAccessCard
                icon={Bot}
                title="AI Coach"
                subtitle="Tư vấn AI bất cứ lúc nào"
                color="#7FB069"
                onPress={() => navigation.navigate('AIChat')}
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
            onPress={() => navigation.navigate('ChoosePlan')}
          >
            <View style={tw`flex-row items-center flex-1`}>
              <View
                style={tw`w-12 h-12 bg-yellow-100 rounded-xl items-center justify-center mr-4`}
              >
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
          <View
            style={tw`bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100`}
          >
            <Text style={tw`text-brandDark font-bold text-lg mb-4`}>
              Quá trình hôm nay
            </Text>

            {/* Steps */}
            <View style={tw`flex-row items-center mb-4`}>
              <View
                style={tw`w-10 h-10 bg-blue-50 rounded-xl items-center justify-center mr-3`}
              >
                <Footprints size={20} color="#3B82F6" />
              </View>
              <Text style={tw`text-brandDark font-semibold flex-1`}>
                {dailyProgress.steps.value.toLocaleString()} bước
              </Text>
            </View>

            {/* Calories */}
            <View style={tw`flex-row items-center mb-4`}>
              <View
                style={tw`w-10 h-10 bg-orange-50 rounded-xl items-center justify-center mr-3`}
              >
                <Flame size={20} color="#F97316" />
              </View>
              <Text style={tw`text-brandDark font-semibold flex-1`}>
                {dailyProgress.calories.value.toLocaleString()} calo đã đốt
              </Text>
            </View>

            {/* Sleep */}
            <View style={tw`flex-row items-center mb-4`}>
              <View
                style={tw`w-10 h-10 bg-purple-50 rounded-xl items-center justify-center mr-3`}
              >
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
                <Text style={tw`text-white font-bold text-sm mr-2`}>
                  Xem chi tiết sức khỏe
                </Text>
                <ChevronRight size={16} color="white" />
              </LinearGradient>
            </TouchableOpacity>
          </View>

          {/* AI Health Tip */}
          {healthInsight && (
            <View
              style={tw`bg-primaryLight rounded-2xl p-5 mb-6 border border-primaryLight/50`}
            >
              <View style={tw`flex-row items-start`}>
                <View
                  style={tw`w-10 h-10 bg-primary rounded-xl items-center justify-center mr-4`}
                >
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
          <View
            style={tw`bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100`}
          >
            <View style={tw`flex-row justify-between items-center mb-4`}>
              <Text style={tw`text-brandDark font-bold text-lg`}>
                Mẹo chăm sóc sức khỏe
              </Text>
              <TouchableOpacity>
                <Text style={tw`text-primary font-semibold text-sm`}>
                  Xem thêm
                </Text>
              </TouchableOpacity>
            </View>

            {healthTips.map((tip, index) => (
              <TouchableOpacity
                key={tip.id}
                style={tw`flex-row items-start mb-4 ${
                  index === healthTips.length - 1 ? 'mb-0' : ''
                }`}
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
                      <Text style={tw`text-textSub text-xs mr-3`}>
                        {tip.calories}
                      </Text>
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
