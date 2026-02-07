// src/presentation/components/PostCard.tsx

import React from 'react';
import { View, Text, TouchableOpacity, Image, Pressable } from 'react-native';
import tw from '../../utils/tailwind';
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Clock,
} from 'lucide-react-native';
import { Post } from '../../domain/entities/Post';

interface PostCardProps {
  post: Post;
  onLike: (id: number) => void;
  onComment: (id: number) => void;
  onPress: () => void;
}

const PostCard = ({ post, onLike, onComment, onPress }: PostCardProps) => {
  // Avatar mặc định dựa trên tên tác giả
  const authorAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    post.authorName || 'User',
  )}&background=7FB069&color=fff&bold=true`;

  return (
    <View
      style={tw`bg-white mx-4 mb-4 rounded-[32px] shadow-sm border border-gray-100 overflow-hidden`}
    >
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          tw`p-5`,
          pressed && tw`bg-gray-50/50`, // Phản hồi thị giác khi chạm
        ]}
      >
        {/* Header: Thông tin tác giả & Thời gian */}
        <View style={tw`flex-row items-center justify-between mb-4`}>
          <View style={tw`flex-row items-center`}>
            <Image
              source={{ uri: authorAvatar }}
              style={tw`w-11 h-11 rounded-full border-2 border-gray-50 shadow-sm`}
            />
            <View style={tw`ml-3`}>
              <Text
                style={tw`text-brandDark font-black text-[15px] tracking-tight`}
              >
                {post.authorName}
              </Text>
              <View style={tw`flex-row items-center mt-0.5`}>
                <Clock size={10} color="#9CA3AF" />
                <Text style={tw`text-gray-400 text-[11px] font-bold ml-1`}>
                  {post.createdAt}
                </Text>
              </View>
            </View>
          </View>

          <TouchableOpacity
            hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}
            style={tw`p-1`}
          >
            <MoreHorizontal size={20} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* Nội dung bài viết rút gọn */}
        <Text
          style={tw`text-brandDark text-[15px] leading-6 mb-4 font-medium`}
          numberOfLines={4}
        >
          {post.content}
        </Text>

        {/* Xem trước Media (Ảnh bài viết) */}
        {post.mediaUrls && post.mediaUrls.length > 0 && (
          <View
            style={tw`mb-4 rounded-2xl overflow-hidden bg-gray-50 border border-gray-100`}
          >
            <Image
              source={{ uri: post.mediaUrls[0] }}
              style={tw`w-full h-52`}
              resizeMode="cover"
            />
            {post.mediaUrls.length > 1 && (
              <View
                style={tw`absolute bottom-3 right-3 bg-black/60 px-3 py-1.5 rounded-full border border-white/20 shadow-sm`}
              >
                <Text
                  style={tw`text-white text-[10px] font-black uppercase tracking-tighter`}
                >
                  +{post.mediaUrls.length - 1} hình ảnh
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Thanh tương tác tối giản (Newsfeed Style) */}
        <View
          style={tw`flex-row items-center justify-between pt-4 border-t border-gray-50`}
        >
          <View style={tw`flex-row items-center`}>
            {/* Nút Thả tim: Chỉ hiển thị số lượng tim thực tế */}
            <TouchableOpacity
              onPress={() => onLike(post.id)}
              activeOpacity={0.7}
              style={tw`flex-row items-center px-4 py-2 rounded-full mr-2 ${
                post.heart > 0 ? 'bg-red-50' : 'bg-gray-50'
              }`}
            >
              <Heart
                size={19}
                color={post.heart > 0 ? '#FF5252' : '#6B7280'}
                fill={post.heart > 0 ? '#FF5252' : 'transparent'}
                strokeWidth={post.heart > 0 ? 0 : 2}
              />
              <Text
                style={tw`ml-2 text-sm font-black ${
                  post.heart > 0 ? 'text-red-500' : 'text-gray-500'
                }`}
              >
                {post.heart}
              </Text>
            </TouchableOpacity>

            {/* Nút Bình luận: ẨN SỐ LƯỢNG THEO YÊU CẦU */}
            <TouchableOpacity
              onPress={() => onComment(post.id)}
              activeOpacity={0.7}
              style={tw`bg-gray-50 p-2.5 rounded-full flex-row items-center justify-center`}
            >
              <MessageCircle size={19} color="#4B5563" strokeWidth={2} />
              {/* Số lượng người bình luận đã được loại bỏ ở đây để làm Newsfeed "sạch" hơn.
                Con số này sẽ chỉ xuất hiện trong màn hình Chi tiết (ForumDetailScreen).
              */}
            </TouchableOpacity>
          </View>

          {/* Nút Chia sẻ bài viết */}
          <TouchableOpacity
            style={tw`p-2.5 bg-gray-50 rounded-full`}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Share2 size={19} color="#4B5563" />
          </TouchableOpacity>
        </View>
      </Pressable>
    </View>
  );
};

export default PostCard;
