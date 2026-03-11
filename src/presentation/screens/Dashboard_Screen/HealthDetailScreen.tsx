import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import tw from '../../../utils/tailwind';
import { scale, moderateScale, verticalScale, fs, getChartWidth } from '../../../utils/responsive';
import { ChevronLeft, Info, TrendingUp, TrendingDown } from 'lucide-react-native';
import { LineChart } from 'react-native-gifted-charts';
import { useNavigation, useRoute } from '@react-navigation/native';
import { HealthMetricsRepository, HealthMetricsData } from '../../../data/repositories/HealthMetricsRepository';

const HealthDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { metricType } = route.params;
  
  const [data, setData] = useState<HealthMetricsData[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const repo = new HealthMetricsRepository();
      const weeklyData = await repo.getWeeklyMetrics(metricType);
      setData(weeklyData);
    } catch (error) {
      console.error('Error loading metrics:', error);
    } finally {
      setLoading(false);
    }
  }, [metricType]);

  useEffect(() => {
    loadData();
  }, [loadData]);

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
        <View style={[
          tw`px-6 flex-row items-center justify-between border-b border-gray-50`,
          { paddingTop: verticalScale(44), paddingBottom: verticalScale(14) },
        ]}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2 bg-gray-50 rounded-xl`}>
            <ChevronLeft size={moderateScale(22, 0.3)} color="#1F2937" />
          </TouchableOpacity>
          <Text style={[tw`font-bold text-gray-800`, { fontSize: fs(17) }]}>Chi tiết {metricInfo.title}</Text>
          <View style={{ width: scale(36) }} />
        </View>
        <View style={tw`flex-1 items-center justify-center`}>
          <ActivityIndicator size="large" color={metricInfo.color} />
          <Text style={[tw`text-textSub mt-2`, { fontSize: fs(14) }]}>Đang tải dữ liệu...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View
        style={[
          tw`px-6 flex-row items-center justify-between border-b border-gray-50`,
          { paddingTop: verticalScale(44), paddingBottom: verticalScale(14) },
        ]}
      >
        <TouchableOpacity onPress={() => navigation.goBack()} style={tw`p-2 bg-gray-50 rounded-xl`}>
          <ChevronLeft size={moderateScale(22, 0.3)} color="#1F2937" />
        </TouchableOpacity>
        <Text style={[tw`font-bold text-gray-800`, { fontSize: fs(17) }]}>
          {metricInfo.title}
        </Text>
        <TouchableOpacity style={tw`p-2 bg-gray-50 rounded-xl`}>
          <Info size={moderateScale(18, 0.3)} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView style={[tw`flex-1`, { padding: scale(20) }]} showsVerticalScrollIndicator={false}>
        {/* Stats Overview */}
        <View style={tw`flex-row mb-6`}>
          <View style={[tw`bg-white rounded-2xl flex-1 mr-2 shadow-sm border border-gray-100`, { padding: scale(14) }]}>
            <Text style={[tw`text-textSub mb-1`, { fontSize: fs(13) }]}>Hôm nay</Text>
            <Text style={[tw`text-brandDark font-bold`, { fontSize: fs(20) }]}>
              {metricType === 'sleep' ? currentValue.toFixed(1) : Math.round(currentValue).toLocaleString()}
            </Text>
            <Text style={[tw`text-textSub`, { fontSize: fs(11) }]}>{metricInfo.unit}</Text>
          </View>
          
          <View style={[tw`bg-white rounded-2xl flex-1 ml-2 shadow-sm border border-gray-100`, { padding: scale(14) }]}>
            <Text style={[tw`text-textSub mb-1`, { fontSize: fs(13) }]}>Trung bình</Text>
            <Text style={[tw`text-brandDark font-bold`, { fontSize: fs(20) }]}>
              {metricType === 'sleep' ? average.toFixed(1) : Math.round(average).toLocaleString()}
            </Text>
            <View style={tw`flex-row items-center mt-1`}>
              {trend ? (
                <TrendingUp size={moderateScale(11, 0.3)} color="#10B981" />
              ) : (
                <TrendingDown size={moderateScale(11, 0.3)} color="#EF4444" />
              )}
              <Text style={[tw`ml-1 ${trend ? 'text-green-600' : 'text-red-500'}`, { fontSize: fs(11) }]}>
                {trend ? '+' : ''}{((currentValue - previousValue) / previousValue * 100).toFixed(1)}%
              </Text>
            </View>
          </View>
        </View>

        {/* Chart Card */}
          <View style={[tw`bg-gray-50 rounded-3xl border border-gray-100 shadow-sm`, { padding: scale(18) }]}>
            <View style={tw`flex-row justify-between items-center mb-6`}>
              <View>
                <Text style={[tw`font-bold text-gray-800`, { fontSize: fs(17) }]}>
                  7 ngày qua {metricInfo.icon}
                </Text>
                <Text style={[tw`text-gray-500`, { fontSize: fs(13) }]}>
                  Xu hướng {metricInfo.title.toLowerCase()}
                </Text>
              </View>
              <View style={tw`items-end`}>
                <Text style={[tw`font-bold`, { fontSize: fs(22), color: metricInfo.color }]}>
                  {metricType === 'sleep' ? average.toFixed(1) : Math.round(average)}
                </Text>
                <Text style={[tw`text-gray-500`, { fontSize: fs(11) }]}>{metricInfo.unit}</Text>
              </View>
            </View>

            {/* Chart - responsive width */}
            <View style={tw`mt-4`}>
              <LineChart
                data={chartData}
                width={getChartWidth(100)}
                height={verticalScale(150)}
                color={metricInfo.color}
                thickness={3}
                dataPointsColor={metricInfo.color}
                dataPointsRadius={moderateScale(4, 0.3)}
                showVerticalLines={false}
                yAxisColor={'transparent'}
                xAxisColor={'#E5E7EB'}
                yAxisTextStyle={tw`text-gray-400 text-[${fs(10)}px]`}
                xAxisLabelTextStyle={tw`text-gray-400 text-[${fs(10)}px]`}
                hideRules
                curved
              />
            </View>
          </View>

        {/* Weekly Summary */}
        <View style={[tw`bg-white rounded-2xl mt-6 shadow-sm border border-gray-100`, { padding: scale(18) }]}>
          <Text style={[tw`font-bold text-gray-800 mb-4`, { fontSize: fs(17) }]}>Tóm tắt tuần</Text>
          
          {data.map((item, index) => {
            const isToday = index === data.length - 1;
            const isHighest = item.value === Math.max(...values);
            
            return (
              <View key={index} style={tw`flex-row items-center justify-between py-3 ${
                index < data.length - 1 ? 'border-b border-gray-100' : ''
              }`}>
                <View style={tw`flex-row items-center`}>
                  <View style={tw`w-8 text-center`}>
                    <Text style={[tw`font-semibold ${
                      isToday ? 'text-primary' : 'text-gray-600'
                    }`, { fontSize: fs(13) }]}>{item.label}</Text>
                  </View>
                  {isToday && (
                    <View style={tw`ml-2 bg-primary px-2 py-1 rounded-full`}>
                      <Text style={[tw`text-white font-bold`, { fontSize: fs(11) }]}>Hôm nay</Text>
                    </View>
                  )}
                  {isHighest && (
                    <View style={tw`ml-2 bg-yellow-100 px-2 py-1 rounded-full`}>
                      <Text style={[tw`text-yellow-600 font-bold`, { fontSize: fs(11) }]}>Cao nhất</Text>
                    </View>
                  )}
                </View>
                
                <View style={tw`items-end`}>
                  <Text style={[tw`font-bold text-gray-800`, { fontSize: fs(15) }]}>
                    {metricType === 'sleep' ? item.value.toFixed(1) : Math.round(item.value).toLocaleString()}
                  </Text>
                  <Text style={[tw`text-gray-500`, { fontSize: fs(11) }]}>{metricInfo.unit}</Text>
                </View>
              </View>
            );
          })}
        </View>
        
        {/* Goals & Insights */}
        <View style={[tw`bg-primaryLight rounded-2xl mt-6`, { padding: scale(18) }]}>
          <Text style={[tw`font-bold text-brandDark mb-3`, { fontSize: fs(17) }]}>Mục tiêu & Gợi ý</Text>
          
          <View style={tw`flex-row items-center mb-3`}>
            <Text style={[tw`text-brandDark`, { fontSize: fs(14) }]}>Mục tiêu hàng ngày: </Text>
            <Text style={[tw`font-bold text-primary`, { fontSize: fs(14) }]}>
              {metricType === 'sleep' ? metricInfo.target : metricInfo.target.toLocaleString()} {metricInfo.unit}
            </Text>
          </View>
          
          <Text style={[tw`text-textSub`, { fontSize: fs(13), lineHeight: fs(20) }]}>
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
