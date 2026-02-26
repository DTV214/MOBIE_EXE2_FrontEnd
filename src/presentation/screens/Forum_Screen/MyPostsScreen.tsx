import React, { useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  RefreshControl,
  StatusBar,
} from 'react-native';
import {
  ChevronLeft,
  Edit2,
  Trash2,
  Calendar,
  MessageSquare,
  Heart,
  Plus,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import tw from '../../../utils/tailwind';
import { useForumStore } from '../../viewmodels/useForumStore';

const MyPostsScreen = () => {
  const navigation = useNavigation<any>();

  // Lấy dữ liệu và hành động từ Store
  const { myPosts, isLoading, fetchMyPosts, deletePostById, isActionLoading } =
    useForumStore();

  // 1. Khởi tạo dữ liệu khi vào màn hình
  const loadData = useCallback(() => {
    fetchMyPosts();
  }, [fetchMyPosts]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // 2. Xử lý xóa bài viết kèm xác nhận
  const handleDelete = (postId: number) => {
    Alert.alert(
      'Xác nhận xóa',
      'Bạn có chắc chắn muốn gỡ bỏ bài viết này không? Hành động này không thể hoàn tác.',
      [
        { text: 'Hủy', style: 'cancel' },
        {
          text: 'Xóa ngay',
          style: 'destructive',
          onPress: async () => {
            try {
              await deletePostById(postId);
            } catch  {
              // Lỗi đã được Store xử lý qua biến error
            }
          },
        },
      ],
    );
  };

  // 3. Component render từng bài viết cá nhân
  const renderMyPostItem = ({ item }: { item: any }) => (
    <View
      style={tw`bg-white rounded-[24px] p-5 mb-4 mx-6 shadow-sm border border-gray-100`}
    >
      <View style={tw`flex-row justify-between mb-3`}>
        <View style={tw`flex-row items-center`}>
          <Calendar size={14} color="#9CA3AF" />
          <Text style={tw`text-gray-400 text-[11px] ml-1`}>
            {item.createdAt}
          </Text>
        </View>
        <View style={tw`bg-green-50 px-2 py-1 rounded-full`}>
          <Text style={tw`text-[10px] text-[#7FB069] font-bold`}>Đã đăng</Text>
        </View>
      </View>

      <Text style={tw`text-brandDark text-sm leading-6 mb-4`} numberOfLines={2}>
        {item.content}
      </Text>

      {item.mediaUrls && item.mediaUrls.length > 0 && (
        <Image
          source={{ uri: item.mediaUrls[0] }}
          style={tw`w-full h-32 rounded-2xl mb-4 bg-gray-50`}
          resizeMode="cover"
        />
      )}

      <View
        style={tw`flex-row items-center justify-between pt-4 border-t border-gray-50`}
      >
        <View style={tw`flex-row items-center`}>
          <View style={tw`flex-row items-center mr-4`}>
            <Heart
              size={16}
              color="#9CA3AF"
              fill={item.heart > 0 ? '#FF6B6B' : 'transparent'}
            />
            <Text style={tw`text-gray-500 text-xs ml-1`}>{item.heart}</Text>
          </View>
          <View style={tw`flex-row items-center`}>
            <MessageSquare size={16} color="#9CA3AF" />
            <Text style={tw`text-gray-500 text-xs ml-1`}>
              {item.activeComments || 0}
            </Text>
          </View>
        </View>

        <View style={tw`flex-row`}>
          <TouchableOpacity
            onPress={() => navigation.navigate('EditPost', { post: item })}
            style={tw`p-2 bg-blue-50 rounded-full mr-2`}
          >
            <Edit2 size={18} color="#3B82F6" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            style={tw`p-2 bg-red-50 rounded-full`}
            disabled={isActionLoading}
          >
            <Trash2 size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={tw`flex-1 bg-[#F8FAFC]`}>
      <StatusBar barStyle="dark-content" />

      {/* Header Chỉnh chu */}
      <View
        style={tw`bg-white pt-14 pb-4 px-6 shadow-sm flex-row items-center justify-between`}
      >
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`p-2 -ml-2`}
          >
            <ChevronLeft size={24} color="#1F2937" />
          </TouchableOpacity>
          <Text style={tw`text-xl font-black text-brandDark ml-2`}>
            Bài viết của tôi
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('CreatePost')}
          style={tw`p-2 bg-[#7FB069]/10 rounded-full`}
        >
          <Plus size={20} color="#7FB069" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={myPosts}
        keyExtractor={item => item.id.toString()}
        renderItem={renderMyPostItem}
        contentContainerStyle={tw`pt-6 pb-20`}
        refreshControl={
          <RefreshControl
            refreshing={isLoading}
            onRefresh={loadData}
            tintColor="#7FB069"
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={tw`items-center justify-center pt-20 px-10`}>
              <View style={tw`bg-gray-100 p-6 rounded-full mb-4`}>
                <Edit2 size={40} color="#D1D5DB" />
              </View>
              <Text style={tw`text-gray-400 font-bold text-center`}>
                Bạn chưa chia sẻ bài viết nào.
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('CreatePost')}
                style={tw`mt-4 bg-[#7FB069] px-6 py-2 rounded-full`}
              >
                <Text style={tw`text-white font-bold`}>Đăng bài ngay</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />

      {/* Overlay loading cho hành động Xóa */}
      {isActionLoading && (
        <View
          style={tw`absolute inset-0 bg-black/10 items-center justify-center z-50`}
        >
          <ActivityIndicator color="#7FB069" size="large" />
        </View>
      )}
    </View>
  );
};

export default MyPostsScreen;
