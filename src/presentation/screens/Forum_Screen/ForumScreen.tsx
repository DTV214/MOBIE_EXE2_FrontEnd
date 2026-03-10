// src/presentation/screens/Forum_Screen/ForumScreen.tsx

import React, { useEffect, useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StatusBar,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Image,
} from 'react-native';
import tw from '../../../utils/tailwind';
import {
  Search,
  Bell,
  Heart,
  FileText,
  Plus,
  Sparkles,
  X,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useForumStore } from '../../viewmodels/useForumStore';
import { useUserStore } from '../../viewmodels/useUserStore';
import PostCard from '../../components/PostCard';
import { useTheme } from '../../../contexts/ThemeContext';

const ForumScreen = () => {
  const { colors } = useTheme();
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');

  const { user } = useUserStore();
  const {
    posts,
    isLoading,
    isRefreshing,
    fetchPosts,
    refreshPosts,
    loadMore,
    toggleLike,
  } = useForumStore();

  const userAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    user?.fullName || 'User',
  )}&background=7FB069&color=fff&bold=true`;

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchPosts(0, 10, searchQuery);
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, fetchPosts]);

  const ListHeader = useMemo(
    () => (
      <View
        style={[
          tw`px-6 py-6 rounded-b-[40px] mb-4 shadow-sm border-b`,
          { backgroundColor: colors.surface, borderBottomColor: colors.border }
        ]}
      >
        <View style={tw`flex-row items-center mb-6`}>
          <Text style={[tw`text-2xl font-black`, { color: colors.text }]}>
            Chào, {user?.fullName?.split(' ')[0] || 'bạn'}! 👋
          </Text>
          <View style={tw`ml-2 bg-yellow-100 px-2 py-0.5 rounded-full`}>
            <Text style={tw`text-[10px] text-yellow-700 font-black`}>MỚI</Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate('CreatePost')}
          style={[
            tw`flex-row items-center p-4 rounded-[24px] border`,
            { backgroundColor: colors.background, borderColor: colors.border }
          ]}
        >
          <Image
            source={{ uri: userAvatar }}
            style={tw`w-11 h-11 rounded-full mr-3 border-2 border-white shadow-sm`}
          />
          <View style={tw`flex-1`}>
            <Text style={[tw`font-bold text-sm`, { color: colors.textSecondary }]}>
              Bạn đang nghĩ gì về sức khỏe?
            </Text>
            <Text style={[tw`text-[11px] mt-0.5`, { color: colors.textSecondary }]}>
              Chia sẻ kiến thức với cộng đồng...
            </Text>
          </View>
          <View style={tw`bg-[#7FB069] p-2.5 rounded-2xl shadow-md`}>
            <Plus size={20} color="white" strokeWidth={3} />
          </View>
        </TouchableOpacity>
      </View>
    ),
    [navigation, userAvatar, user],
  );

  return (
    <View style={[tw`flex-1`, { backgroundColor: colors.background }]}>
      <StatusBar barStyle={colors.statusBarStyle} backgroundColor={colors.statusBarBackground} />

      {/* Header Bar */}
      <View
        style={[
          tw`pt-14 pb-4 px-6 flex-row items-center justify-between z-30`,
          { backgroundColor: colors.surface }
        ]}
      >
        <View style={tw`flex-row items-center`}>
          <View
            style={tw`w-9 h-9 bg-[#7FB069] rounded-xl items-center justify-center mr-2 shadow-sm`}
          >
            <Heart size={20} color="#FFFFFF" fill="#FFFFFF" />
          </View>
          <View>
            <Text
              style={[tw`text-xl font-black tracking-tighter`, { color: colors.primary }]}
            >
              Lành Care
            </Text>
            <View style={tw`flex-row items-center`}>
              <Sparkles size={10} color={colors.primary} fill={colors.primary} />
              <Text
                style={[tw`text-[8px] font-black uppercase ml-1`, { color: colors.textSecondary }]}
              >
                Community
              </Text>
            </View>
          </View>
        </View>

        <View style={tw`flex-row items-center`}>
          <TouchableOpacity
            onPress={() => navigation.navigate('MyPosts')}
            style={[tw`p-2.5 rounded-full mr-2`, { backgroundColor: `${colors.primary}20` }]}
          >
            <FileText size={20} color={colors.primary} />
          </TouchableOpacity>
          <TouchableOpacity style={[tw`p-2.5 rounded-full`, { backgroundColor: colors.border }]}>
            <Bell size={20} color={colors.text} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Floating Search Bar */}
      <View style={tw`px-6 -mt-4 z-40 mb-2`}>
        <View
          style={[
            tw`rounded-2xl px-4 py-1.5 flex-row items-center shadow-xl border`,
            { backgroundColor: colors.surface, borderColor: colors.border }
          ]}
        >
          <Search size={18} color={colors.textSecondary} />
          <TextInput
            placeholder="Tìm kiếm kiến thức, bài viết..."
            placeholderTextColor={colors.textSecondary}
            style={[
              tw`flex-1 ml-3 h-11 font-bold`,
              { color: colors.text }
            ]}
            value={searchQuery}
            onChangeText={setSearchQuery}
            // Thêm các thuộc tính này để tránh can thiệp vào quá trình ghép dấu của bộ gõ
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            keyboardType="default"
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => setSearchQuery('')}
              style={[tw`p-1 rounded-full`, { backgroundColor: colors.border }]}
            >
              <X size={12} color={colors.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={posts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <PostCard
            post={item}
            onLike={() => toggleLike(item.id)}
            onComment={() =>
              navigation.navigate('ForumDetail', { postId: item.id })
            }
            onPress={() =>
              navigation.navigate('ForumDetail', { postId: item.id })
            }
          />
        )}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={refreshPosts}
            colors={[colors.primary]}
            tintColor={colors.primary}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        ListHeaderComponent={ListHeader}
        contentContainerStyle={tw`pb-10`}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          !isLoading ? (
            <View style={tw`items-center justify-center pt-20 px-10`}>
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/6134/6134065.png',
                }}
                style={tw`w-32 h-32 opacity-10 mb-4`}
              />
              <Text style={[tw`font-bold text-center`, { color: colors.textSecondary }]}>
                {searchQuery
                  ? `Không tìm thấy kết quả cho "${searchQuery}"`
                  : 'Chưa có bài viết nào'}
              </Text>
            </View>
          ) : null
        }
        // FIX LỖI TypeScript: Sử dụng ternary thay vì && để tránh trả về 'false'
        ListFooterComponent={
          isLoading ? (
            <ActivityIndicator color={colors.primary} style={tw`py-6`} />
          ) : null
        }
      />
    </View>
  );
};

export default ForumScreen;
