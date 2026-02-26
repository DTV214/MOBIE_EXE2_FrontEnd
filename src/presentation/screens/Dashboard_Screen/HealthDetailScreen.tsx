import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import tw from '../../../utils/tailwind';
import { ChevronLeft, Info, Calendar, Flame, TrendingUp, TrendingDown } from 'lucide-react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useNavigation, useRoute } from '@react-navigation/native';
import { HealthMetricsRepository, HealthMetricsData } from '../../../data/repositories/HealthMetricsRepository';

const HealthDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { metricType } = route.params;
  
  const [data, setData] = useState<HealthMetricsData[]>([]);
  const [loading, setLoading] = useState(true);
  const metricsRepo = new HealthMetricsRepository();

  useEffect(() => {
    loadData();
  }, [metricType]);

  const loadData = async () => {
    try {
      const weeklyData = await metricsRepo.getWeeklyMetrics(metricType);
      setData(weeklyData);
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMetricInfo = () => {
    switch (metricType) {
      case 'steps':
        return {
          title: 'Số bước chân',
          unit: 'bước',
          color: '#3B82F6',
          target: 10000,
          icon: '👣'
        };
      case 'calories':
        return {
          title: 'Calories đốt cháy',
          unit: 'calo',
          color: '#F97316',
          target: 2200,
          icon: '🔥'
        };
      case 'sleep':
        return {
          title: 'Giờ ngủ',
          unit: 'giờ',
          color: '#8B5CF6',
          target: 8,
          icon: '🛌'
        };
      case 'heartRate':
        return {
          title: 'Nhịp tim',
          unit: 'BPM',
          color: '#EF4444',
          target: 72,
          icon: '❤️'
        };
      default:
        return {
          title: 'Chỉ số',
          unit: '',
          color: '#7FB069',
          target: 100,
          icon: '📊'
        };
    }
  };

  const metricInfo = getMetricInfo();
  const chartData = data.map(item => ({ value: item.value, label: item.label }));
  
  // Tính toán thống kê
  const values = data.map(item => item.value);
  const average = values.length > 0 ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  const currentValue = values.length > 0 ? values[values.length - 1] : 0;
  const previousValue = values.length > 1 ? values[values.length - 2] : 0;
  const trend = currentValue > previousValue;

  if (loading) {
    return (
      <View style={tw`flex-1 bg-white`}>
        <View style={tw`pt-12 pb-4 px-6 flex-row items-center justify-between border-b border-gray-50`}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2 bg-gray-50 rounded-xl`}>
            <ChevronLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={tw`text-lg font-bold text-gray-800`}>Chi tiết {metricInfo.title}</Text>
          <View style={tw`w-10`} />
        </View>
        <View style={tw`flex-1 items-center justify-center`}>
          <ActivityIndicator size="large" color={metricInfo.color} />
          <Text style={tw`text-textSub mt-2`}>Đang tải dữ liệu...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View
        style={tw`pt-12 pb-4 px-6 flex-row items-center justify-between border-b border-gray-50`}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2 bg-gray-50 rounded-xl`}>
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-bold text-gray-800`}>
          {metricInfo.title}
        </Text>
        <TouchableOpacity style={tw`p-2 bg-gray-50 rounded-xl`}>
          <Info size={20} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView style={tw`flex-1 p-6`} showsVerticalScrollIndicator={false}>
        {/* Stats Overview */}
        <View style={tw`flex-row mb-6`}>
          <View style={tw`bg-white rounded-2xl p-4 flex-1 mr-2 shadow-sm border border-gray-100`}>
            <Text style={tw`text-textSub text-sm mb-1`}>Hôm nay</Text>
            <Text style={tw`text-brandDark font-bold text-xl`}>
              {metricType === 'sleep' ? currentValue.toFixed(1) : Math.round(currentValue).toLocaleString()}
            </Text>
            <Text style={tw`text-textSub text-xs`}>{metricInfo.unit}</Text>
          </View>
          
          <View style={tw`bg-white rounded-2xl p-4 flex-1 ml-2 shadow-sm border border-gray-100`}>
            <Text style={tw`text-textSub text-sm mb-1`}>Trung bình</Text>
            <Text style={tw`text-brandDark font-bold text-xl`}>
              {metricType === 'sleep' ? average.toFixed(1) : Math.round(average).toLocaleString()}
            </Text>
            <View style={tw`flex-row items-center mt-1`}>
              {trend ? (
                <TrendingUp size={12} color="#10B981" />
              ) : (
                <TrendingDown size={12} color="#EF4444" />
              )}
              <Text style={tw`text-xs ml-1 ${trend ? 'text-green-600' : 'text-red-500'}`}>
                {trend ? '+' : ''}{((currentValue - previousValue) / previousValue * 100).toFixed(1)}%
              </Text>
            </View>
          </View>
        </View>

        {/* Chart Card */}
          <View style={tw`bg-gray-50 p-5 rounded-3xl border border-gray-100 shadow-sm`}>
            <View style={tw`flex-row justify-between items-center mb-6`}>
              <View>
                <Text style={tw`text-lg font-bold text-gray-800`}>
                  7 ngày qua {metricInfo.icon}
                </Text>
                <Text style={tw`text-sm text-gray-500`}>
                  Xu hướng {metricInfo.title.toLowerCase()}
                </Text>
              </View>
              <View style={tw`items-end`}>
                <Text style={tw`text-2xl font-bold`} style={{color: metricInfo.color}}>
                  {metricType === 'sleep' ? average.toFixed(1) : Math.round(average)}
                </Text>
                <Text style={tw`text-xs text-gray-500`}>{metricInfo.unit}</Text>
              </View>
            </View>

            {/* Chart */}
            <View style={tw`mt-4`}>
              <LineChart
                data={chartData}
                width={250}
                height={150}
                color={metricInfo.color}
                thickness={3}
                dataPointsColor={metricInfo.color}
                dataPointsRadius={4}
                showVerticalLines={false}
                yAxisColor={'transparent'}
                xAxisColor={'#E5E7EB'}
                yAxisTextStyle={{ color: '#9CA3AF', fontSize: 10 }}
                xAxisLabelTextStyle={{ color: '#9CA3AF', fontSize: 10 }}
                hideRules
                curved
              />
            </View>
          </View>

        {/* Weekly Summary */}
        <View style={tw`bg-white rounded-2xl p-5 mt-6 shadow-sm border border-gray-100`}>
          <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>Tóm tắt tuần</Text>
          
          {data.map((item, index) => {
            const isToday = index === data.length - 1;
            const isHighest = item.value === Math.max(...values);
            
            return (
              <View key={index} style={tw`flex-row items-center justify-between py-3 ${
                index < data.length - 1 ? 'border-b border-gray-100' : ''
              }`}>
                <View style={tw`flex-row items-center`}>
                  <View style={tw`w-8 text-center`}>
                    <Text style={tw`font-semibold text-sm ${
                      isToday ? 'text-primary' : 'text-gray-600'
                    }`}>{item.label}</Text>
                  </View>
                  {isToday && (
                    <View style={tw`ml-2 bg-primary px-2 py-1 rounded-full`}>
                      <Text style={tw`text-white text-xs font-bold`}>Hôm nay</Text>
                    </View>
                  )}
                  {isHighest && (
                    <View style={tw`ml-2 bg-yellow-100 px-2 py-1 rounded-full`}>
                      <Text style={tw`text-yellow-600 text-xs font-bold`}>Cao nhất</Text>
                    </View>
                  )}
                </View>
                
                <View style={tw`items-end`}>
                  <Text style={tw`font-bold text-gray-800`}>
                    {metricType === 'sleep' ? item.value.toFixed(1) : Math.round(item.value).toLocaleString()}
                  </Text>
                  <Text style={tw`text-xs text-gray-500`}>{metricInfo.unit}</Text>
                </View>
              </View>
            );
          })}
        </View>
        
        {/* Goals & Insights */}
        <View style={tw`bg-primaryLight rounded-2xl p-5 mt-6`}>
          <Text style={tw`text-lg font-bold text-brandDark mb-3`}>Mục tiêu & Gợi ý</Text>
          
          <View style={tw`flex-row items-center mb-3`}>
            <Text style={tw`text-brandDark`}>Mục tiêu hàng ngày: </Text>
            <Text style={tw`font-bold text-primary`}>
              {metricType === 'sleep' ? metricInfo.target : metricInfo.target.toLocaleString()} {metricInfo.unit}
            </Text>
          </View>
          
          <Text style={tw`text-textSub text-sm leading-5`}>
            {currentValue >= metricInfo.target
              ? `🎉 Tuyệt vời! Bạn đã đạt mục tiêu ${metricInfo.title.toLowerCase()} hôm nay.`
              : `💪 Bạn đang trên đường đạt mục tiêu. Còn ${metricType === 'sleep' 
                ? (metricInfo.target - currentValue).toFixed(1) 
                : Math.round(metricInfo.target - currentValue).toLocaleString()} ${metricInfo.unit} nữa!`
            }
          </Text>
        </View>

        <View style={tw`h-6`} />
      </ScrollView>
    </View>
  );
};

export default HealthDetailScreen;
