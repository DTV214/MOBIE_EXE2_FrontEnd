// src/presentation/screens/Dashboard_Screen/DashboardScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import tw from '../../../utils/tailwind';
import { scale, moderateScale, verticalScale, fs } from '../../../utils/responsive';
import {
  Footprints,
  Zap,
  Bot,
  Hospital,
  Crown,
  ChevronRight,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import {
  getDailyProgressUseCase,
} from '../../../di/Container';

// 1. Import Store User để lấy thông tin
import { useUserStore } from '../../viewmodels/useUserStore';
import { useStepStore } from '../../viewmodels/useStepStore';

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
    style={[
      tw`bg-white rounded-2xl shadow-sm border border-gray-100 flex-1 mx-1`,
      { padding: scale(14) },
    ]}
  >
    <View style={[
      tw`rounded-xl items-center justify-center`,
      { width: scale(44), height: scale(44), marginBottom: verticalScale(10) },
    ]}>
      <Icon size={moderateScale(22, 0.3)} color={color} />
    </View>
    <Text style={[tw`text-brandDark font-bold mb-1`, { fontSize: fs(13) }]}>{title}</Text>
    <Text style={[tw`text-textSub`, { fontSize: fs(11), lineHeight: fs(16) }]}>{subtitle}</Text>
  </TouchableOpacity>
);

const DashboardScreen = () => {
  const navigation = useNavigation<any>();
  const greeting = getDynamicGreeting();

  // 2. Lấy user và health profile từ Store
  const { user, healthProfile, fetchUserProfile } = useUserStore();
  const { todaySteps, isInitialized, initializeStepTracking, fetchTodaySteps, syncWithBackend } = useStepStore();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // State xử lý refresh

  useEffect(() => {
    loadData();
    // Nếu store chưa có user (ví dụ reload app), gọi API lấy lại
    if (!user) {
      fetchUserProfile();
    }

    // Initialize step tracking
    if (!isInitialized) {
      initializeStepTracking();
    }
  }, [user, fetchUserProfile, isInitialized, initializeStepTracking]);

  // Hàm load dữ liệu dashboard
  const loadData = async () => {
    try {
      await getDailyProgressUseCase.execute();
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
    fetchTodaySteps(); // Cập nhật lại số bước chân
    syncWithBackend(); // Sync với backend
  }, [fetchUserProfile, fetchTodaySteps, syncWithBackend]);

  if (loading) {
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
          style={[
            tw`px-6`,
            { paddingTop: verticalScale(48), paddingBottom: verticalScale(28) },
          ]}
        >
          <View style={tw`flex-row justify-between items-center mb-4`}>
            <View style={tw`flex-1`}>
              <Text style={[tw`text-primary font-bold mb-1`, { fontSize: fs(11) }]}>
                LÀNH CARE {greeting.emoji}
              </Text>
              {/* 3. Dynamic greeting với emoji */}
              <Text style={[tw`font-black text-brandDark mb-1`, { fontSize: fs(22) }]}>
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
              style={[
                tw`${
                  healthProfile?.bmi 
                    ? healthProfile.bmi < 18.5 
                      ? 'bg-blue-500' 
                      : healthProfile.bmi > 25 
                      ? 'bg-orange-500' 
                      : 'bg-primary'
                    : 'bg-primary'
                } rounded-full items-center justify-center border-2 border-white shadow-md`,
                { width: scale(48), height: scale(48) },
              ]}
            >
              <Text style={[tw`text-white font-bold`, { fontSize: fs(16) }]}>
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
                icon={Footprints}
                title="Bước chân"
                subtitle={`${todaySteps.toLocaleString()} bước hôm nay`}
                color="#3B82F6"
                onPress={() => navigation.navigate('HealthSummary')}
              />
              <QuickAccessCard
                icon={Zap}
                title="Theo dõi năng lượng"
                subtitle="Ghi nhận năng lượng hôm nay"
                color="#F97316"
                onPress={() => navigation.navigate('Nhật ký')}
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
            style={[tw`bg-white rounded-2xl flex-row items-center justify-between mb-6 shadow-sm border border-gray-100`, { padding: scale(14) }]}
            activeOpacity={0.8}
            onPress={() => navigation.navigate('ChoosePlan')}
          >
            <View style={tw`flex-row items-center flex-1`}>
              <View
                style={[
                  tw`bg-yellow-100 rounded-xl items-center justify-center`,
                  { width: scale(44), height: scale(44), marginRight: scale(14) },
                ]}
              >
                <Crown size={moderateScale(22, 0.3)} color="#F59E0B" />
              </View>
              <View style={tw`flex-1`}>
                <Text style={[tw`text-brandDark font-bold mb-1`, { fontSize: fs(15) }]}>
                  Gói Membership
                </Text>
                <Text style={[tw`text-textSub`, { fontSize: fs(11) }]}>
                  Quản lý và nâng cấp tài khoản của bạn
                </Text>
              </View>
            </View>
            <ChevronRight size={moderateScale(18, 0.3)} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Bottom spacing */}
          <View style={tw`h-6`} />
        </View>
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;
