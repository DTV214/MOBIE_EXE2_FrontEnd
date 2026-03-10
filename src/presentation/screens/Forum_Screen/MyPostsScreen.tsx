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
import { useTheme } from '../../../contexts/ThemeContext';

const MyPostsScreen = () => {
  const navigation = useNavigation<any>();
  const { isDarkMode, colors } = useTheme();

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
      style={[
        tw`rounded-[24px] p-5 mb-4 mx-6 shadow-sm border`,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border
        }
      ]}
    >
      <View style={tw`flex-row justify-between mb-3`}>
        <View style={tw`flex-row items-center`}>
          <Calendar size={14} color={colors.textSecondary} />
          <Text style={[tw`text-[11px] ml-1`, { color: colors.textSecondary }]}>
            {item.createdAt}
          </Text>
        </View>
        <View style={[tw`px-2 py-1 rounded-full`, { backgroundColor: `${colors.primary}20` }]}>
          <Text style={[tw`text-[10px] font-bold`, { color: colors.primary }]}>Đã đăng</Text>
        </View>
      </View>

      <Text style={[tw`text-sm leading-6 mb-4`, { color: colors.text }]} numberOfLines={2}>
        {item.content}
      </Text>

      {item.mediaUrls && item.mediaUrls.length > 0 && (
        <Image
          source={{ uri: item.mediaUrls[0] }}
          style={[
            tw`w-full h-32 rounded-2xl mb-4`,
            { backgroundColor: colors.surface }
          ]}
          resizeMode="cover"
        />
      )}

      <View
        style={[
          tw`flex-row items-center justify-between pt-4 border-t`,
          { borderTopColor: colors.border }
        ]}
      >
        <View style={tw`flex-row items-center`}>
          <View style={tw`flex-row items-center mr-4`}>
            <Heart
              size={16}
              color={colors.textSecondary}
              fill={item.heart > 0 ? '#FF6B6B' : 'transparent'}
            />
            <Text style={[tw`text-xs ml-1`, { color: colors.textSecondary }]}>{item.heart}</Text>
          </View>
          <View style={tw`flex-row items-center`}>
            <MessageSquare size={16} color={colors.textSecondary} />
            <Text style={[tw`text-xs ml-1`, { color: colors.textSecondary }]}>
              {item.activeComments || 0}
            </Text>
          </View>
        </View>

        <View style={tw`flex-row`}>
          <TouchableOpacity
            onPress={() => navigation.navigate('EditPost', { post: item })}
            style={[tw`p-2 rounded-full mr-2`, { backgroundColor: '#3B82F620' }]}
          >
            <Edit2 size={18} color="#3B82F6" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDelete(item.id)}
            style={[tw`p-2 rounded-full`, { backgroundColor: '#EF444420' }]}
            disabled={isActionLoading}
          >
            <Trash2 size={18} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={[tw`flex-1`, { backgroundColor: colors.background }]}>
      <StatusBar
        barStyle={colors.statusBarStyle}
        backgroundColor={colors.background}
      />

      {/* Header Chỉnh chu */}
      <View
        style={[
          tw`pt-14 pb-4 px-6 shadow-sm flex-row items-center justify-between`,
          { backgroundColor: colors.surface }
        ]}
      >
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={tw`p-2 -ml-2`}
          >
            <ChevronLeft size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={[tw`text-xl font-black ml-2`, { color: colors.text }]}>
            Bài viết của tôi
          </Text>
        </View>

        <TouchableOpacity
          onPress={() => navigation.navigate('CreatePost')}
          style={[tw`p-2 rounded-full`, { backgroundColor: `${colors.primary}20` }]}
        >
          <Plus size={20} color={colors.primary} />
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
            tintColor={colors.primary}
          />
        }
        ListEmptyComponent={
          !isLoading ? (
            <View style={tw`items-center justify-center pt-20 px-10`}>
              <View style={[tw`p-6 rounded-full mb-4`, { backgroundColor: colors.surface }]}>
                <Edit2 size={40} color={colors.textSecondary} />
              </View>
              <Text style={[tw`font-bold text-center`, { color: colors.textSecondary }]}>
                Bạn chưa chia sẻ bài viết nào.
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('CreatePost')}
                style={[tw`mt-4 px-6 py-2 rounded-full`, { backgroundColor: colors.primary }]}
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
          style={[
            tw`absolute inset-0 items-center justify-center z-50`,
            { backgroundColor: `${colors.background}80` }
          ]}
        >
          <ActivityIndicator color={colors.primary} size="large" />
        </View>
      )}
    </View>
  );
};

export default MyPostsScreen;
