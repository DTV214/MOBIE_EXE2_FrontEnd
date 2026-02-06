// src/presentation/components/PostCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import {
  Heart,
//   MessageCircle,
  Share2,
  MoreHorizontal,
  Image as ImageIcon,
} from 'lucide-react-native';
import tw from '../../utils/tailwind';
import { Post } from '../../domain/entities/Post';

const PostCard = ({ post, onPress }: { post: Post; onPress: () => void }) => {
  // Avatar: Ưu tiên ảnh từ hệ thống, nếu không có dùng UI-Avatar
  const userAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    post.authorName,
  )}&background=7FB069&color=fff&bold=true`;

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.9}
      style={tw`bg-white rounded-[24px] p-5 mb-4 mx-5 shadow-sm border border-gray-100`}
    >
      {/* Header: Thông tin tác giả */}
      <View style={tw`flex-row items-center justify-between mb-4`}>
        <View style={tw`flex-row items-center`}>
          <Image
            source={{ uri: userAvatar }}
            style={tw`w-11 h-11 rounded-full bg-gray-50`}
          />
          <View style={tw`ml-3`}>
            <Text style={tw`text-brandDark font-bold text-[15px]`}>
              {post.authorName}
            </Text>
            <Text style={tw`text-gray-400 text-[11px]`}>{post.createdAt}</Text>
          </View>
        </View>
        <TouchableOpacity style={tw`p-1`}>
          <MoreHorizontal size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Content: Nội dung văn bản */}
      <Text
        style={tw`text-brandDark text-[14px] leading-6 mb-4`}
        numberOfLines={3}
      >
        {post.content}
      </Text>

      {/* Media Preview: Hiển thị ảnh đầu tiên nếu có */}
      {post.mediaUrls && post.mediaUrls.length > 0 && (
        <View style={tw`mb-4 relative`}>
          <Image
            source={{ uri: post.mediaUrls[0] }}
            style={tw`w-full h-48 rounded-2xl bg-gray-100`}
            resizeMode="cover"
          />
          {post.mediaUrls.length > 1 && (
            <View
              style={tw`absolute bottom-2 right-2 bg-black/60 px-2 py-1 rounded-lg flex-row items-center`}
            >
              <ImageIcon size={12} color="white" />
              <Text style={tw`text-white text-[10px] font-bold ml-1`}>
                +{post.mediaUrls.length - 1}
              </Text>
            </View>
          )}
        </View>
      )}

      {/* Footer: Tương tác */}
      <View
        style={tw`flex-row items-center justify-between pt-4 border-t border-gray-50`}
      >
        <View style={tw`flex-row items-center`}>
          <View style={tw`flex-row items-center mr-6`}>
            <Heart
              size={20}
              color={post.heart > 0 ? '#7FB069' : '#9CA3AF'}
              fill={post.heart > 0 ? '#7FB069' : 'transparent'}
            />
            <Text style={tw`text-gray-500 text-xs ml-1.5 font-bold`}>
              {post.heart}
            </Text>
          </View>

          {/* <View style={tw`flex-row items-center`}>
            <MessageCircle size={20} color="#9CA3AF" />
            <Text style={tw`text-gray-500 text-xs ml-1.5 font-bold`}>
              {post.commentCount}
            </Text>
          </View> */}
        </View>

        <TouchableOpacity style={tw`p-1`}>
          <Share2 size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default PostCard;
