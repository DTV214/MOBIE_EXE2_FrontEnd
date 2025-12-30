import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import tw from '../../../utils/tailwind';
import { ChevronLeft, Info, Calendar, Flame } from 'lucide-react-native';
import { LineChart } from 'react-native-gifted-charts'; // Đảm bảo đã install
import { useNavigation, useRoute } from '@react-navigation/native';

const HealthDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute<any>();
  const { metricType } = route.params;

  // Dữ liệu mẫu cho biểu đồ
  const data = [
    { value: 50, label: 'Th 2' },
    { value: 80, label: 'Th 3' },
    { value: 90, label: 'Th 4' },
    { value: 70, label: 'Th 5' },
    { value: 85, label: 'Th 6' },
    { value: 100, label: 'Th 7' },
    { value: 110, label: 'CN' },
  ];

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View
        style={tw`pt-12 pb-4 px-6 flex-row items-center justify-between border-b border-gray-50`}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`p-2 bg-gray-50 rounded-xl`}
        >
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-bold text-gray-800`}>
          Chi tiết {metricType}
        </Text>
        <TouchableOpacity style={tw`p-2 bg-gray-50 rounded-xl`}>
          <Calendar size={20} color="#1F2937" />
        </TouchableOpacity>
      </View>

      <ScrollView style={tw`flex-1 p-6`} showsVerticalScrollIndicator={false}>
        {/* Chart Card */}
        <View
          style={tw`bg-gray-50 p-5 rounded-3xl border border-gray-100 shadow-sm`}
        >
          <View style={tw`flex-row justify-between items-center mb-6`}>
            <View>
              <Text style={tw`text-gray-400 text-xs font-medium`}>
                Trung bình tuần này
              </Text>
              <Text style={tw`text-2xl font-bold text-gray-800`}>
                {metricType === 'Steps'
                  ? '7,432'
                  : metricType === 'Calories'
                  ? '1,920'
                  : '7.2h'}
              </Text>
            </View>
            <View style={tw`bg-primaryLight/50 px-3 py-1 rounded-full`}>
              <Text style={tw`text-primaryDark text-xs font-bold`}>+12%</Text>
            </View>
          </View>

          {/* Line Chart Component */}
          <LineChart
            data={data}
            height={200}
            spacing={45}
            initialSpacing={10}
            color="#22C55E"
            thickness={3}
            startFillColor="rgba(34, 197, 94, 0.3)"
            endFillColor="rgba(34, 197, 94, 0.01)"
            startOpacity={0.9}
            endOpacity={0.1}
            noOfSections={4}
            yAxisThickness={0}
            xAxisThickness={0}
            hideDataPoints={false}
            dataPointsColor="#166534"
            rulesType="dashed"
            rulesColor="#E5E7EB"
            yAxisTextStyle={tw`text-gray-400 text-[10px]`}
            xAxisLabelTextStyle={tw`text-gray-400 text-[10px]`}
          />
        </View>

        {/* Insight Section */}
        <View style={tw`mt-8`}>
          <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>
            Phân tích & Lời khuyên
          </Text>

          <View
            style={tw`bg-white p-5 rounded-2xl border border-gray-100 flex-row items-start mb-4 shadow-sm`}
          >
            <View style={tw`bg-blue-50 p-2 rounded-xl mr-4`}>
              <Info size={20} color="#3B82F6" />
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-gray-800 font-bold mb-1`}>
                Duy trì đều đặn
              </Text>
              <Text style={tw`text-gray-500 text-sm leading-5`}>
                Bạn đang có xu hướng vận động tốt vào cuối tuần. Hãy cố gắng duy
                trì mức độ này vào các ngày trong tuần để đạt kết quả tốt nhất.
              </Text>
            </View>
          </View>

          <View
            style={tw`bg-white p-5 rounded-2xl border border-gray-100 flex-row items-start mb-10 shadow-sm`}
          >
            <View style={tw`bg-orange-50 p-2 rounded-xl mr-4`}>
              <Flame size={20} color="#F97316" />
            </View>
            <View style={tw`flex-1`}>
              <Text style={tw`text-gray-800 font-bold mb-1`}>
                Đốt cháy năng lượng
              </Text>
              <Text style={tw`text-gray-500 text-sm leading-5`}>
                Thêm 15 phút đi bộ nhanh hôm nay sẽ giúp bạn hoàn thành mục tiêu
                calo tiêu thụ sớm hơn dự kiến.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default HealthDetailScreen;
