import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Dimensions,
  Animated,
  StatusBar,
} from 'react-native';
import tw from '../../../utils/tailwind'; // Đảm bảo đúng đường dẫn
import { Activity, Bot, ArrowRight, Utensils } from 'lucide-react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const DATA = [
  {
    id: '1',
    title: 'Theo dõi sức khỏe thông minh',
    description:
      'Dễ dàng quản lý các chỉ số cơ thể, nhịp tim và giấc ngủ mỗi ngày với công nghệ tiên tiến.',
    icon: <Activity size={100} color="#22C55E" />, // Sử dụng primary color
    bgColor: '#F0FDF4', // Màu xanh cực nhạt làm nền
  },
  {
    id: '2',
    title: 'Chế độ ăn uống khoa học',
    description:
      'Tìm kiếm hàng ngàn món ăn Việt và tính toán lượng calo chính xác cho từng bữa ăn của bạn.',
    icon: <Utensils size={100} color="#22C55E" />,
    bgColor: '#F0FDF4',
  },
  {
    id: '3',
    title: 'Trợ lý AI Coach 24/7',
    description:
      'Trò chuyện cùng AI để nhận được những lời khuyên sức khỏe cá nhân hóa mọi lúc mọi nơi.',
    icon: <Bot size={100} color="#22C55E" />,
    bgColor: '#F0FDF4',
  },
];

const OnboardingScreen = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollX = useRef(new Animated.Value(0)).current;
  const slidesRef = useRef<any>(null);
  const navigation = useNavigation<any>();

  const viewableItemsChanged = useRef(({ viewableItems }: any) => {
    if (viewableItems && viewableItems.length > 0) {
      setCurrentIndex(viewableItems[0].index);
    }
  }).current;

  const scrollToNext = () => {
    if (currentIndex < DATA.length - 1) {
      slidesRef.current.scrollToIndex({ index: currentIndex + 1 });
    } else {
      // Chuyển sang màn hình Đăng nhập
      navigation.replace('Login');
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={[tw`flex-1 items-center justify-center px-10`, { width }]}>
      {/* Vòng tròn nền icon sử dụng màu dịu mắt */}
      <View
        style={[
          tw`w-64 h-64 rounded-full items-center justify-center mb-12 shadow-sm`,
          { backgroundColor: item.bgColor },
        ]}
      >
        {item.icon}
      </View>
      <Text
        style={tw`text-3xl font-black text-brandDark text-center mb-4 leading-9`}
      >
        {item.title}
      </Text>
      <Text style={tw`text-gray-500 text-center text-base leading-6 px-4`}>
        {item.description}
      </Text>
    </View>
  );

  return (
    <View style={tw`flex-1 bg-white`}>
      <StatusBar barStyle="dark-content" />

      {/* Nút Bỏ qua sử dụng màu textSub nhạt */}
      <TouchableOpacity
        onPress={() => navigation.replace('Main')}
        style={tw`absolute top-14 right-8 z-10`}
      >
        <Text style={tw`text-gray-400 font-bold text-base`}>Bỏ qua</Text>
      </TouchableOpacity>

      <FlatList
        data={DATA}
        renderItem={renderItem}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        keyExtractor={item => item.id}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX } } }],
          {
            useNativeDriver: false,
          },
        )}
        onViewableItemsChanged={viewableItemsChanged}
        ref={slidesRef}
      />

      <View style={tw`pb-16 px-10`}>
        {/* Pagination Dots - Chuyển sang dùng màu primary đồng bộ */}
        <View style={tw`flex-row justify-center mb-10`}>
          {DATA.map((_, i) => {
            const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
            const dotWidth = scrollX.interpolate({
              inputRange,
              outputRange: [10, 28, 10],
              extrapolate: 'clamp',
            });
            const opacity = scrollX.interpolate({
              inputRange,
              outputRange: [0.2, 1, 0.2],
              extrapolate: 'clamp',
            });
            return (
              <Animated.View
                key={i.toString()}
                style={[
                  tw`h-2.5 bg-primary rounded-full mx-1.5`,
                  { width: dotWidth, opacity },
                ]}
              />
            );
          })}
        </View>

        {/* Nút bấm Gradient Xanh lá chuyên nghiệp */}
        <TouchableOpacity onPress={scrollToNext} activeOpacity={0.9}>
          <LinearGradient
            colors={['#22C55E', '#16A34A']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={tw`h-18 rounded-[25px] flex-row items-center justify-center shadow-lg`}
          >
            <Text
              style={tw`text-white font-black text-lg mr-2 uppercase tracking-tight`}
            >
              {currentIndex === DATA.length - 1 ? 'BẮT ĐẦU NGAY' : 'TIẾP TỤC'}
            </Text>
            <ArrowRight size={22} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnboardingScreen;
