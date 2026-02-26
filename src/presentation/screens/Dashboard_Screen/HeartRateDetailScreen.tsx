// src/presentation/screens/Dashboard_Screen/HeartRateDetailScreen.tsx
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import tw from '../../../utils/tailwind';
import {
  ChevronLeft,
  MoreVertical,
  Leaf,
  CheckCircle,
} from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { LineChart } from 'react-native-gifted-charts';
import { getHeartRateTrendUseCase } from '../../../di/Container';
import { HeartRateTrend } from '../../../domain/entities/HeartRateData';

// PeriodButton component moved outside to avoid re-render
interface PeriodButtonProps {
  period: '7days' | '30days' | '3months';
  label: string;
  selectedPeriod: '7days' | '30days' | '3months';
  onPress: (period: '7days' | '30days' | '3months') => void;
}

const PeriodButton = ({ period, label, selectedPeriod, onPress }: PeriodButtonProps) => (
  <TouchableOpacity
    onPress={() => onPress(period)}
    style={tw`px-4 py-2 rounded-xl ${
      selectedPeriod === period ? 'bg-primary' : 'bg-gray-100'
    }`}
  >
    <Text
      style={tw`font-semibold text-sm ${
        selectedPeriod === period ? 'text-white' : 'text-textSub'
      }`}
    >
      {label}
    </Text>
  </TouchableOpacity>
);

const HeartRateDetailScreen = () => {
  const navigation = useNavigation<any>();
  const [trend, setTrend] = useState<HeartRateTrend | null>(null);
  const [selectedPeriod, setSelectedPeriod] = useState<'7days' | '30days' | '3months'>('7days');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const loadData = useCallback(async () => {
    try {
      const data = await getHeartRateTrendUseCase.execute(selectedPeriod);
      setTrend(data);
    } catch (error) {
      console.error('Error loading heart rate data:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod]);

  if (loading || !trend) {
    return (
      <View style={tw`flex-1 bg-background items-center justify-center`}>
        <Text style={tw`text-textSub`}>Đang tải...</Text>
      </View>
    );
  }

  // Prepare chart data
  const chartData = trend.dataPoints.map((point, index) => ({
    value: point.value,
    label: index === 0 || index === trend.dataPoints.length - 1 
      ? new Date(point.date).toLocaleDateString('vi-VN', { weekday: 'short' }).slice(0, 3)
      : '',
  }));

  return (
    <View style={tw`flex-1 bg-background`}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={tw`bg-white pt-14 pb-4 px-6 flex-row items-center justify-between border-b border-gray-100`}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`p-2`}
        >
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-bold text-brandDark`}>
          Xu hướng nhịp tim
        </Text>
        <TouchableOpacity style={tw`p-2`}>
          <MoreVertical size={20} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={tw`flex-1`}>
        <View style={tw`px-6 pt-6`}>
          {/* Period Selection */}
          <View style={tw`flex-row justify-center mb-6`}>
            <PeriodButton period="7days" label="7 Ngày" selectedPeriod={selectedPeriod} onPress={setSelectedPeriod} />
            <View style={tw`w-2`} />
            <PeriodButton period="30days" label="30 Ngày" selectedPeriod={selectedPeriod} onPress={setSelectedPeriod} />
            <View style={tw`w-2`} />
            <PeriodButton period="3months" label="3 Tháng" selectedPeriod={selectedPeriod} onPress={setSelectedPeriod} />
          </View>

          {/* Chart Card */}
          <View style={tw`bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100`}>
            <LineChart
              data={chartData}
              height={200}
              spacing={trend.dataPoints.length > 7 ? 30 : 45}
              initialSpacing={10}
              color="#7FB069"
              thickness={3}
              startFillColor="rgba(127, 176, 105, 0.3)"
              endFillColor="rgba(127, 176, 105, 0.01)"
              startOpacity={0.9}
              endOpacity={0.1}
              noOfSections={4}
              yAxisThickness={0}
              xAxisThickness={0}
              hideDataPoints={false}
              dataPointsColor="#7FB069"
              dataPointsRadius={4}
              rulesType="dashed"
              rulesColor="#E5E7EB"
              yAxisTextStyle={tw`text-gray-400 text-[10px]`}
              xAxisLabelTextStyle={tw`text-gray-400 text-[10px]`}
              yAxisLabelWidth={40}
              maxValue={100}
              minValue={40}
            />
          </View>

          {/* Current Statistics */}
          <View style={tw`bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100`}>
            <Text style={tw`text-brandDark font-bold text-lg mb-4`}>
              Thống kê hiện tại
            </Text>
            <View style={tw`flex-row justify-between`}>
              <View style={tw`items-center flex-1`}>
                <Text style={tw`text-2xl font-bold text-primary mb-1`}>
                  {trend.statistics.average}
                </Text>
                <Text style={tw`text-textSub text-xs`}>AVG BPM</Text>
              </View>
              <View style={tw`items-center flex-1`}>
                <Text style={tw`text-2xl font-bold text-red-500 mb-1`}>
                  {trend.statistics.maximum}
                </Text>
                <Text style={tw`text-textSub text-xs`}>MAX BPM</Text>
              </View>
              <View style={tw`items-center flex-1`}>
                <Text style={tw`text-2xl font-bold text-primary mb-1`}>
                  {trend.statistics.minimum}
                </Text>
                <Text style={tw`text-textSub text-xs`}>MIN BPM</Text>
              </View>
            </View>
          </View>

          {/* AI Insight */}
          {trend.aiInsight && (
            <View style={tw`bg-primaryLight rounded-2xl p-5 mb-6 border border-primaryLight/50`}>
              <View style={tw`flex-row items-start`}>
                <View style={tw`w-10 h-10 bg-primary rounded-xl items-center justify-center mr-4`}>
                  <Leaf size={20} color="#FFFFFF" />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-brandDark font-bold text-base mb-2`}>
                    AI Insight
                  </Text>
                  <Text style={tw`text-textSub text-sm leading-5`}>
                    {trend.aiInsight}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Normal Range Comparison */}
          <View style={tw`bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100`}>
            <Text style={tw`text-brandDark font-bold text-lg mb-4`}>
              So sánh phạm vi bình thường
            </Text>
            <View style={tw`mb-3`}>
              <Text style={tw`text-textSub text-sm mb-2`}>Trung bình của bạn</Text>
              <Text style={tw`text-2xl font-bold text-brandDark mb-4`}>
                {trend.statistics.average} bpm
              </Text>
            </View>

            {/* Range Bar */}
            <View style={tw`h-8 bg-gray-100 rounded-full mb-4 relative`}>
              <LinearGradient
                colors={['#7FB069', '#F97316']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={tw`absolute left-0 right-0 top-0 bottom-0 rounded-full`}
              />
              {/* User's position indicator */}
              <View
                style={[
                  tw`absolute top-0 bottom-0 w-4 items-center justify-center`,
                  {
                    left: `${Math.max(0, Math.min(100, ((trend.statistics.average - trend.normalRange.min) / (trend.normalRange.max - trend.normalRange.min)) * 100))}%`,
                  },
                ]}
              >
                <View style={tw`w-4 h-4 bg-white rounded-full border-2 border-primary`} />
              </View>
            </View>

            <View style={tw`flex-row items-center`}>
              <CheckCircle size={16} color="#7FB069" />
              <Text style={tw`text-primary font-semibold text-sm ml-2`}>
                Within Normal Range
              </Text>
            </View>
          </View>

          {/* Weekly Summary */}
          {trend.weeklySummary && (
            <View style={tw`bg-white rounded-2xl p-5 mb-6 shadow-sm border border-gray-100`}>
              <Text style={tw`text-brandDark font-bold text-lg mb-3`}>
                Tóm tắt hàng tuần
              </Text>
              <View style={tw`flex-row justify-between`}>
                <View>
                  <Text style={tw`text-2xl font-bold text-brandDark mb-1`}>
                    {trend.weeklySummary.activeDays}
                  </Text>
                  <Text style={tw`text-textSub text-sm`}>Ngày hoạt động</Text>
                </View>
                <View>
                  <Text style={tw`text-2xl font-bold text-brandDark mb-1`}>
                    {trend.weeklySummary.averageHoursPerDay}
                  </Text>
                  <Text style={tw`text-textSub text-sm`}>Số giờ trung bình 1 ngày</Text>
                </View>
              </View>
            </View>
          )}

          {/* Get AI Advice Button */}
          <TouchableOpacity
            onPress={() => navigation.navigate('AIChat')}
            activeOpacity={0.9}
            style={tw`mb-6`}
          >
            <LinearGradient
              colors={['#7FB069', '#6A9A5A']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={tw`h-16 rounded-2xl flex-row items-center justify-center shadow-lg`}
            >
              <View style={tw`w-8 h-8 bg-white/20 rounded-full items-center justify-center mr-3`}>
                <Leaf size={16} color="#FFFFFF" />
              </View>
              <Text style={tw`text-white font-bold text-lg`}>
                Nhận lời khuyên AI
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* Bottom spacing */}
          <View style={tw`h-6`} />
        </View>
      </ScrollView>
    </View>
  );
};

export default HeartRateDetailScreen;
