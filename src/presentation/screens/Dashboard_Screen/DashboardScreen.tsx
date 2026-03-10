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
  Alert,
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
import { useTheme } from '../../../contexts/ThemeContext';

// Helper function: Dynamic greeting dựa trên thời gian
const getDynamicGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 6) return { text: 'Chào đêm khuya', emoji: '🌙' };
  if (hour < 12) return { text: 'Chào buổi sáng', emoji: '🌅' };
  if (hour < 17) return { text: 'Chào buổi chiều', emoji: '☀️' };
  if (hour < 21) return { text: 'Chào buổi tối', emoji: '🌆' };
  return { text: 'Chúc ngủ ngon', emoji: '🌙' };
};

const calculateBmi = (weight?: number, height?: number) => {
  if (!weight || !height) {
    return null;
  }

  const heightInMeters = height / 100;
  return weight / (heightInMeters * heightInMeters);
};

// Component QuickAccessCard được di chuyển ra ngoài để tránh re-render
interface QuickAccessCardProps {
  icon: any;
  title: string;
  subtitle: string;
  color: string;
  onPress?: () => void;       // ← Optional
  onLongPress?: () => void;   // ← NEW: Long press
  disabled?: boolean;         // ← NEW: Disabled state
}

const QuickAccessCard = ({
  icon: Icon,
  title,
  subtitle,
  color,
  onPress,
  onLongPress,
  disabled = false,
}: QuickAccessCardProps) => {
  const { colors } = useTheme();
  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      onLongPress={disabled ? undefined : onLongPress}
      activeOpacity={disabled ? 1 : 0.8}
      style={[
        tw`rounded-2xl shadow-sm flex-1 mx-1 border ${
          disabled ? 'opacity-60' : ''
        }`,
        { 
          padding: scale(14), 
          backgroundColor: colors.surface,
          borderColor: colors.border 
        },
      ]}
    >
    <View style={[
      tw`rounded-xl items-center justify-center`,
      { width: scale(44), height: scale(44), marginBottom: verticalScale(10) },
    ]}>
      <Icon size={moderateScale(22, 0.3)} color={color} />
    </View>
    <Text style={[tw`font-bold mb-1`, { fontSize: fs(13), color: colors.text }]}>{title}</Text>
    <Text style={[{ fontSize: fs(11), lineHeight: fs(16), color: colors.textSecondary }]}>{subtitle}</Text>
  </TouchableOpacity>
  );
};

const DashboardScreen = () => {
  const navigation = useNavigation<any>();
  const { colors } = useTheme();
  const greeting = getDynamicGreeting();

  // 2. Lấy user và health profile từ Store
  const { user, healthProfile, fetchUserProfile } = useUserStore();
  const { todaySteps, isEnabled, isAvailable, isLoading: stepLoading, error: stepError, checkAvailability, enableStepTracking, disableStepTracking, fetchTodaySteps, syncWithBackend } = useStepStore();
  const bmi = calculateBmi(healthProfile?.weightKg, healthProfile?.heightCm);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // State xử lý refresh

  useEffect(() => {
    loadData();
    // Nếu store chưa có user (ví dụ reload app), gọi API lấy lại
    if (!user) {
      fetchUserProfile();
    }

    // Check Health Connect availability (không auto enable)
    checkAvailability();
  }, [user, fetchUserProfile, checkAvailability]);

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

  // Hàm xử lý kích hoạt step tracking
  const handleEnableStepTracking = () => {
    Alert.alert(
      'Kích hoạt theo dõi bước chân',
      'Bạn có muốn kích hoạt chức năng theo dõi bước chân hàng ngày không?',
      [
        {
          text: 'Hủy',
          style: 'cancel',
        },
        {
          text: 'Kích hoạt',
          onPress: async () => {
            await enableStepTracking();
          },
        },
      ],
      { cancelable: true }
    );
  };

  // Hàm xử lý tắt step tracking  
  const handleDisableStepTracking = () => {
    Alert.alert(
      'Tắt theo dõi bước chân',
      'Bạn có chắc chắn muốn tắt chức năng này không?',
      [
        {
          text: 'Hủy', 
          style: 'cancel',
        },
        {
          text: 'Tắt',
          style: 'destructive',
          onPress: () => disableStepTracking(),
        },
      ],
      { cancelable: true }
    );
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
      <View style={[tw`flex-1`, { backgroundColor: colors.background }]}>
        <StatusBar barStyle={colors.statusBarStyle} backgroundColor={colors.statusBarBackground} />
        
        {/* Loading header */}
        <LinearGradient
          colors={[colors.primaryLight, colors.surface]}
          style={tw`pt-14 pb-8 px-6`}
        >
          <View style={[tw`h-20 rounded-xl mb-4`, { backgroundColor: `${colors.surface}50` }]} />
        </LinearGradient>
        
        <View style={tw`px-6 pt-6`}>
          {/* Loading skeletons */}
          {[...Array(3)].map((_, i) => (
            <View key={i} style={[tw`rounded-2xl p-4 mb-4 h-24`, { backgroundColor: colors.surface }]} />
          ))}
          
          <View style={tw`items-center mt-8`}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[tw`mt-2`, { color: colors.textSecondary }]}>Đang tải dữ liệu sức khỏe...</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={[tw`flex-1`, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBarStyle} backgroundColor={colors.statusBarBackground} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
      >
        {/* Header với greeting */}
        <LinearGradient
          colors={[
            colors.primaryLight,
            colors.surface
          ]}
          style={[
            tw`px-6`,
            { paddingTop: verticalScale(48), paddingBottom: verticalScale(28) },
          ]}
        >
          <View style={tw`flex-row justify-between items-center mb-4`}>
            <View style={tw`flex-1`}>
              <Text style={[tw`mb-1 font-bold`, { fontSize: fs(11), color: colors.primary }]}>
                LÀNH CARE {greeting.emoji}
              </Text>
              {/* 3. Dynamic greeting với emoji */}
              <Text style={[tw`font-black mb-1`, { fontSize: fs(22), color: colors.text }]}>
                {greeting.text}, {user?.fullName?.split(' ').pop() || 'Bạn'}!
              </Text>
              <View style={tw`flex-row items-center`}>
                <Text style={[tw`text-sm`, { color: colors.textSecondary }]}>
                  Chăm sóc sức khỏe mỗi ngày
                </Text>
                {/* 4. Show BMI nếu có health profile */}
                {bmi !== null && (
                  <Text style={[tw`text-xs font-semibold ml-2 px-2 py-1 rounded-lg text-white`, { backgroundColor: colors.primaryLight }]}>
                    BMI: {bmi.toFixed(1)}
                  </Text>
                )}
              </View>
            </View>
            {/* Avatar với tên hoặc BMI status color */}
            <TouchableOpacity
              onPress={() => navigation.navigate('Hồ sơ')}
              style={[
                tw`rounded-full items-center justify-center border-2 shadow-md`,
                { 
                  width: scale(48), 
                  height: scale(48),
                  backgroundColor: bmi !== null
                    ? bmi < 18.5
                      ? '#3B82F6'
                      : bmi > 25
                      ? '#F97316'
                      : colors.primary
                    : colors.primary,
                  borderColor: colors.surface
                },
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
                subtitle={
                  !isAvailable 
                    ? "Thiết bị không hỗ trợ"
                    : !isEnabled
                    ? "Chạm để kích hoạt"  
                    : stepError 
                    ? stepError  
                    : stepLoading
                    ? "Đang tải..."
                    : `${todaySteps.toLocaleString()} bước hôm nay`
                }
                color={
                  !isAvailable || stepError ? "#9CA3AF"     // Gray cho error/not available
                    : !isEnabled ? "#F97316"                // Orange cho chưa kích hoạt  
                    : stepLoading ? "#6B7280"               // Gray cho loading
                    : "#3B82F6"                             // Blue cho normal
                }  
                onPress={
                  !isAvailable ? undefined
                    : !isEnabled ? handleEnableStepTracking
                    : () => navigation.navigate('HealthSummary')
                }
                onLongPress={
                  isEnabled ? handleDisableStepTracking : undefined
                }
                disabled={!isAvailable}
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
            style={[tw`rounded-2xl flex-row items-center justify-between mb-6 shadow-sm border`, { padding: scale(14), backgroundColor: colors.surface, borderColor: colors.border }]}
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
                <Text style={[tw`font-bold mb-1`, { fontSize: fs(15), color: colors.text }]}>
                  Gói Membership
                </Text>
                <Text style={[{ fontSize: fs(11), color: colors.textSecondary }]}>
                  Quản lý và nâng cấp tài khoản của bạn
                </Text>
              </View>
            </View>
            <ChevronRight size={moderateScale(18, 0.3)} color={colors.textSecondary} />
          </TouchableOpacity>

          {/* Bottom spacing */}
          <View style={tw`h-6`} />
        </View>
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;
