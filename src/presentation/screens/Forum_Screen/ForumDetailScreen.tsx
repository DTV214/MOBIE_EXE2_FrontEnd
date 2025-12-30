import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import tw from '../../../utils/tailwind';
import {
  ChevronLeft,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Send,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const ForumDetailScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={tw`flex-1 bg-white`}>
      {/* Header */}
      <View
        style={tw`pt-12 pb-4 px-6 flex-row justify-between items-center border-b border-gray-50`}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-bold text-brandDark`}>
          Chi tiết bài viết
        </Text>
        <TouchableOpacity>
          <Bookmark size={22} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        style={tw`flex-1 px-6 pt-6`}
      >
        {/* Author Info */}
        <View style={tw`flex-row items-center mb-6`}>
          <View
            style={tw`w-12 h-12 bg-primaryLight rounded-full items-center justify-center mr-3`}
          >
            <Text style={tw`text-primary font-bold text-lg`}>N</Text>
          </View>
          <View>
            <Text style={tw`text-base font-bold text-brandDark`}>
              BS. Nguyễn Văn A
            </Text>
            <Text style={tw`text-xs text-gray-400`}>
              Chuyên gia tim mạch • 2 giờ trước
            </Text>
          </View>
          <TouchableOpacity
            style={tw`ml-auto bg-green-50 px-4 py-1.5 rounded-full border border-primaryLight`}
          >
            <Text style={tw`text-primary text-xs font-bold`}>Theo dõi</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <Text style={tw`text-2xl font-bold text-brandDark leading-8 mb-4`}>
          5 loại thực phẩm tốt nhất cho tim mạch mà bạn nên biết
        </Text>
        <Text style={tw`text-gray-600 leading-6 text-base mb-6`}>
          Chế độ ăn uống đóng vai trò then chốt trong việc bảo vệ sức khỏe tim
          mạch. Việc bổ sung các loại thực phẩm giàu Omega-3 và chất xơ không
          chỉ giúp giảm cholesterol mà còn ổn định huyết áp...
          {'\n\n'}
          1. Cá hồi và các loại cá béo: Giàu axit béo Omega-3 giúp giảm viêm.
          {'\n'}
          2. Các loại hạt: Hạnh nhân, óc chó chứa nhiều chất béo chưa bão hòa.
          {'\n'}
          3. Rau lá xanh: Nguồn cung cấp Vitamin K dồi dào...
        </Text>

        <View
          style={tw`bg-gray-100 h-56 rounded-3xl mb-8 items-center justify-center`}
        >
          <Text style={tw`text-gray-400 italic`}>
            [Hình ảnh minh họa bài viết]
          </Text>
        </View>

        {/* Interaction Bar */}
        <View
          style={tw`flex-row justify-between items-center py-4 border-t border-b border-gray-50 mb-8`}
        >
          <View style={tw`flex-row items-center`}>
            <TouchableOpacity style={tw`flex-row items-center mr-6`}>
              <Heart size={20} color="#EF4444" fill="#EF4444" />
              <Text style={tw`text-sm text-gray-700 ml-1 font-bold`}>124</Text>
            </TouchableOpacity>
            <TouchableOpacity style={tw`flex-row items-center`}>
              <MessageCircle size={20} color="#9CA3AF" />
              <Text style={tw`text-sm text-gray-500 ml-1`}>45</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity>
            <Share2 size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Comments Section */}
        <Text style={tw`text-lg font-bold text-brandDark mb-4`}>
          Bình luận (45)
        </Text>
        <CommentItem
          name="Trần Thị B"
          text="Cảm ơn bác sĩ, bài viết rất hữu ích!"
          time="1 giờ trước"
        />
        <CommentItem
          name="Lê Văn C"
          text="Cá thu có tốt như cá hồi không bác sĩ ơi?"
          time="45 phút trước"
        />
        <View style={tw`h-10`} />
      </ScrollView>

      {/* Bottom Comment Input */}
      <View
        style={tw`p-4 bg-white border-t border-gray-100 flex-row items-center`}
      >
        <View style={tw`flex-1 bg-gray-100 rounded-2xl px-4 py-2 mr-3`}>
          <TextInput
            placeholder="Viết bình luận của bạn..."
            style={tw`text-sm text-brandDark h-10`}
          />
        </View>
        <TouchableOpacity style={tw`bg-primary p-3 rounded-full`}>
          <Send size={20} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const CommentItem = ({ name, text, time }: any) => (
  <View style={tw`mb-4`}>
    <View style={tw`flex-row items-center mb-1`}>
      <Text style={tw`text-sm font-bold text-brandDark mr-2`}>{name}</Text>
      <Text style={tw`text-[10px] text-gray-400`}>{time}</Text>
    </View>
    <Text style={tw`text-sm text-gray-600 leading-5`}>{text}</Text>
  </View>
);

export default ForumDetailScreen;
