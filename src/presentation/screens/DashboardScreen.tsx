import React from 'react';
import { View, Text, ScrollView, StatusBar } from 'react-native';
import tw from '../../utils/tailwind';
import { Footprints, Flame, Moon, MessageCircle } from 'lucide-react-native'; // Icons
import { StatCard } from '../components/StatCard';
import { GradientButton } from '../components/GradientButton';
import LinearGradient from 'react-native-linear-gradient';

const DashboardScreen = () => {
  return (
    <View style={tw`flex-1 bg-gray-50`}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={tw`pt-12 pb-6 px-6 bg-white rounded-b-3xl shadow-sm`}>
        <View style={tw`flex-row justify-between items-center`}>
          <View>
            <Text style={tw`text-gray-500 text-base`}>Xin chào,</Text>
            <Text style={tw`text-2xl font-bold text-gray-800`}>Sarah 👋</Text>
          </View>
          {/* Avatar giả */}
          <View
            style={tw`w-12 h-12 bg-gray-200 rounded-full border-2 border-white shadow-sm`}
          />
        </View>
      </View>

      <ScrollView
        style={tw`flex-1 px-6 pt-6`}
        showsVerticalScrollIndicator={false}
      >
        {/* Banner AI Coach (Gradient) */}
        <LinearGradient
          colors={['#1F2937', '#111827']}
          style={tw`p-6 rounded-3xl mb-8 relative overflow-hidden`}
        >
          <View style={tw`z-10`}>
            <Text style={tw`text-white font-bold text-lg mb-1`}>
              AI Health Coach
            </Text>
            <Text style={tw`text-gray-400 text-sm mb-4`}>
              Bạn đã hoàn thành 80% mục tiêu!
            </Text>
            <View style={tw`bg-white/20 self-start px-3 py-1 rounded-lg`}>
              <Text style={tw`text-white text-xs`}>Tiếp tục cố gắng nhé</Text>
            </View>
          </View>
          {/* Họa tiết trang trí nếu cần */}
          <View
            style={tw`absolute -right-5 -bottom-5 w-32 h-32 bg-green-500/20 rounded-full`}
          />
        </LinearGradient>

        <Text style={tw`text-lg font-bold text-gray-800 mb-4`}>
          Chỉ số hôm nay
        </Text>

        <StatCard
          title="Bước đi"
          value="8,247"
          subtitle="Mục tiêu: 10,000"
          accentColor="bg-blue-50"
          icon={<Footprints size={24} color="#3B82F6" />}
        />

        <StatCard
          title="Calo tiêu thụ"
          value="1,847 Kcal"
          subtitle="Còn lại: 350 Kcal"
          accentColor="bg-orange-50"
          icon={<Flame size={24} color="#F97316" />}
        />

        <StatCard
          title="Giấc ngủ"
          value="7h 30m"
          subtitle="Chất lượng tốt"
          accentColor="bg-purple-50"
          icon={<Moon size={24} color="#8B5CF6" />}
        />

        <View style={tw`h-6`} />

        {/* Nút Gradient */}
        <GradientButton
          title="Trò chuyện với AI Coach"
          onPress={() => console.log('Chat AI')}
          icon={<MessageCircle size={20} color="white" />}
        />

        <View style={tw`h-10`} />
      </ScrollView>
    </View>
  );
};

export default DashboardScreen;
