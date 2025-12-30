import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import tw from '../../../utils/tailwind';
import {
  Search,
  MessageCircle,
  Heart,
  Share2,
  Plus,
  Filter,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

const ForumScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <View style={tw`flex-1 bg-background`}>
      {/* Header & Search */}
      <View style={tw`pt-12 pb-6 px-6 bg-white rounded-b-3xl shadow-sm`}>
        <Text style={tw`text-2xl font-bold text-brandDark mb-4`}>
          Cộng đồng Lành Care
        </Text>
        <View
          style={tw`flex-row items-center bg-gray-100 px-4 py-2 rounded-2xl`}
        >
          <Search size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Tìm kiếm bài viết, chủ đề..."
            style={tw`flex-1 ml-2 text-base text-brandDark`}
          />
          <TouchableOpacity style={tw`bg-white p-2 rounded-xl`}>
            <Filter size={18} color="#22C55E" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={tw`flex-1 pt-4`}>
        {/* Danh mục nhanh */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={tw`px-6 mb-6`}
        >
          {[
            'Tất cả',
            'Dinh dưỡng',
            'Tập luyện',
            'Giấc ngủ',
            'Sức khỏe tinh thần',
          ].map((tag, index) => (
            <TouchableOpacity
              key={index}
              style={tw`${
                index === 0 ? 'bg-primary' : 'bg-white border border-gray-100'
              } px-5 py-2 rounded-full mr-3`}
            >
              <Text
                style={tw`${
                  index === 0 ? 'text-white' : 'text-textSub'
                } font-bold text-xs`}
              >
                {tag}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Danh sách bài viết */}
        <View style={tw`px-6`}>
          <PostCard
            author="BS. Nguyễn Văn A"
            title="5 loại thực phẩm tốt nhất cho tim mạch mà bạn nên biết"
            time="2 giờ trước"
            likes="124"
            comments="45"
            onPress={() => navigation.navigate('ForumDetail')}
          />
          <PostCard
            author="Chuyên gia Lê Minh C"
            title="Làm sao để duy trì thói quen tập luyện mỗi ngày?"
            time="5 giờ trước"
            likes="89"
            comments="12"
            onPress={() => navigation.navigate('ForumDetail')}
          />
        </View>
        <View style={tw`h-10`} />
      </ScrollView>

      {/* Floating Action Button - Đăng bài */}
      <TouchableOpacity
        style={tw`absolute bottom-6 right-6 bg-primary w-14 h-14 rounded-full items-center justify-center shadow-lg`}
      >
        <Plus size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const PostCard = ({ author, title, time, likes, comments, onPress }: any) => (
  <TouchableOpacity
    onPress={onPress}
    style={tw`bg-white p-5 rounded-3xl mb-4 shadow-sm border border-gray-50`}
  >
    <View style={tw`flex-row items-center mb-3`}>
      <View
        style={tw`w-8 h-8 bg-primaryLight rounded-full items-center justify-center mr-2`}
      >
        <Text style={tw`text-primary font-bold text-xs`}>{author[0]}</Text>
      </View>
      <View>
        <Text style={tw`text-xs font-bold text-brandDark`}>{author}</Text>
        <Text style={tw`text-[10px] text-gray-400`}>{time}</Text>
      </View>
    </View>
    <Text style={tw`text-base font-bold text-brandDark leading-5 mb-4`}>
      {title}
    </Text>

    <View
      style={tw`bg-gray-100 h-40 rounded-2xl mb-4 items-center justify-center`}
    >
      <Text style={tw`text-gray-400 italic`}>[Hình ảnh minh họa bài viết]</Text>
    </View>

    <View style={tw`flex-row justify-between items-center`}>
      <View style={tw`flex-row items-center`}>
        <TouchableOpacity style={tw`flex-row items-center mr-4`}>
          <Heart size={18} color="#9CA3AF" />
          <Text style={tw`text-xs text-gray-500 ml-1`}>{likes}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={tw`flex-row items-center mr-4`}>
          <MessageCircle size={18} color="#9CA3AF" />
          <Text style={tw`text-xs text-gray-500 ml-1`}>{comments}</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Share2 size={18} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
      <View style={tw`bg-green-50 px-3 py-1 rounded-lg`}>
        <Text style={tw`text-primary text-[10px] font-bold`}>Dinh dưỡng</Text>
      </View>
    </View>
  </TouchableOpacity>
);

export default ForumScreen;
