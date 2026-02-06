// src/presentation/screens/Forum_Screen/ForumDetailScreen.tsx

import React, { useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import tw from '../../../utils/tailwind';
import {
  ChevronLeft,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreVertical,
  Flame,
  Clock,
  Verified,
} from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useForumStore } from '../../viewmodels/useForumStore';

const { width } = Dimensions.get('window');

const ForumDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { postId } = route.params || {};

  // Kết nối Store lấy dữ liệu thật
  const { currentPost, isDetailLoading, fetchPostById, clearCurrentPost } =
    useForumStore();

  useEffect(() => {
    if (postId) {
      fetchPostById(postId);
    }
    // Dọn dẹp bộ nhớ khi thoát màn hình
    return () => clearCurrentPost();
  }, [postId, fetchPostById, clearCurrentPost]);

  if (isDetailLoading || !currentPost) {
    return (
      <View style={tw`flex-1 bg-white items-center justify-center`}>
        <ActivityIndicator color="#7FB069" size="large" />
        <Text style={tw`mt-4 text-gray-400 font-medium`}>
          Đang tải câu chuyện...
        </Text>
      </View>
    );
  }

  // Avatar tác giả
  const authorAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    currentPost.authorName,
  )}&background=7FB069&color=fff&bold=true`;

  return (
    <View style={tw`flex-1 bg-white`}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header Chỉnh chu */}
      <View
        style={tw`bg-white pt-14 pb-4 px-6 border-b border-gray-50 flex-row items-center justify-between`}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={tw`p-2 -ml-2`}
        >
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <View style={tw`flex-row items-center`}>
          <Flame size={18} color="#FF6B6B" fill="#FF6B6B" />
          <Text
            style={tw`text-base font-black text-brandDark ml-1 uppercase tracking-tighter`}
          >
            Chi tiết bài viết
          </Text>
        </View>
        <TouchableOpacity style={tw`p-2 -mr-2`}>
          <Bookmark size={22} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={tw`flex-1`}>
        {/* Thông tin Tác giả & Badge */}
        <View style={tw`px-6 pt-6 pb-4 flex-row items-center justify-between`}>
          <View style={tw`flex-row items-center`}>
            <Image
              source={{ uri: authorAvatar }}
              style={tw`w-12 h-12 rounded-full border-2 border-[#7FB069]/20`}
            />
            <View style={tw`ml-3`}>
              <View style={tw`flex-row items-center`}>
                <Text style={tw`text-brandDark font-bold text-base mr-1`}>
                  {currentPost.authorName}
                </Text>
                <Verified size={14} color="#7FB069" fill="#7FB069" />
              </View>
              <View style={tw`flex-row items-center mt-0.5`}>
                <Clock size={10} color="#9CA3AF" />
                <Text style={tw`text-gray-400 text-[10px] ml-1`}>
                  {currentPost.createdAt}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity style={tw`bg-gray-50 p-2 rounded-full`}>
            <MoreVertical size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Nội dung chính */}
        <View style={tw`px-6 mb-6`}>
          <Text style={tw`text-brandDark text-[17px] leading-7 font-medium`}>
            {currentPost.content}
          </Text>
        </View>

        {/* Media Gallery: Hiển thị danh sách hình ảnh */}
        {currentPost.mediaUrls && currentPost.mediaUrls.length > 0 && (
          <View style={tw`mb-8`}>
            <ScrollView
              horizontal
              pagingEnabled
              showsHorizontalScrollIndicator={false}
              style={tw`flex-row`}
            >
              {currentPost.mediaUrls.map((url, index) => (
                <View
                  key={index}
                  style={{ width: width, paddingHorizontal: 24 }}
                >
                  <Image
                    source={{ uri: url }}
                    style={tw`w-full h-80 rounded-[32px] bg-gray-100 shadow-lg`}
                    resizeMode="cover"
                  />
                  {/* Họa tiết trang trí số trang */}
                  <View
                    style={tw`absolute bottom-4 right-10 bg-black/50 px-3 py-1 rounded-full`}
                  >
                    <Text style={tw`text-white text-[10px] font-bold`}>
                      {index + 1} / {currentPost.mediaUrls.length}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Thanh tương tác thu hút */}
        <View
          style={tw`mx-6 mb-8 bg-[#F8FAFC] rounded-[28px] p-4 flex-row justify-between items-center`}
        >
          <View style={tw`flex-row items-center`}>
            <TouchableOpacity
              style={tw`flex-row items-center bg-white px-4 py-2 rounded-2xl shadow-sm mr-3`}
            >
              <Heart
                size={22}
                color={currentPost.heart > 0 ? '#FF6B6B' : '#9CA3AF'}
                fill={currentPost.heart > 0 ? '#FF6B6B' : 'transparent'}
              />
              <Text style={tw`text-sm text-brandDark ml-2 font-black`}>
                {currentPost.heart}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={tw`flex-row items-center bg-white px-4 py-2 rounded-2xl shadow-sm`}
            >
              <MessageCircle size={22} color="#7FB069" />
              <Text style={tw`text-sm text-brandDark ml-2 font-black`}>
                {currentPost.activeComments}
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={tw`bg-white p-3 rounded-2xl shadow-sm`}>
            <Share2 size={22} color="#1F2937" />
          </TouchableOpacity>
        </View>

        {/* Phần bình luận - Gợi ý luồng sắp tới */}
        <View style={tw`px-6 mb-10`}>
          <Text style={tw`text-xl font-black text-brandDark mb-4`}>
            Cộng đồng thảo luận
          </Text>
          <View
            style={tw`bg-gray-50 rounded-3xl p-8 items-center border border-dashed border-gray-200`}
          >
            <MessageCircle size={40} color="#D1D5DB" />
            <Text style={tw`text-gray-400 mt-2 font-medium text-center`}>
              Hãy là người đầu tiên chia sẻ cảm nghĩ về bài viết này!
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default ForumDetailScreen;
