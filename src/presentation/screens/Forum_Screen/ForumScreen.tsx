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

const ForumScreen = () => {
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
        style={tw`bg-white px-6 py-6 rounded-b-[40px] mb-4 shadow-sm border-b border-gray-50`}
      >
        <View style={tw`flex-row items-center mb-6`}>
          <Text style={tw`text-2xl font-black text-brandDark`}>
            Chào, {user?.fullName?.split(' ')[0] || 'bạn'}! 👋
          </Text>
          <View style={tw`ml-2 bg-yellow-100 px-2 py-0.5 rounded-full`}>
            <Text style={tw`text-[10px] text-yellow-700 font-black`}>MỚI</Text>
          </View>
        </View>

        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => navigation.navigate('CreatePost')}
          style={tw`flex-row items-center bg-gray-50 p-4 rounded-[24px] border border-gray-100`}
        >
          <Image
            source={{ uri: userAvatar }}
            style={tw`w-11 h-11 rounded-full mr-3 border-2 border-white shadow-sm`}
          />
          <View style={tw`flex-1`}>
            <Text style={tw`text-gray-400 font-bold text-sm`}>
              Bạn đang nghĩ gì về sức khỏe?
            </Text>
            <Text style={tw`text-gray-300 text-[11px] mt-0.5`}>
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
    <View style={tw`flex-1 bg-[#F1F5F9]`}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header Bar */}
      <View
        style={tw`bg-white pt-14 pb-4 px-6 flex-row items-center justify-between z-30`}
      >
        <View style={tw`flex-row items-center`}>
          <View
            style={tw`w-9 h-9 bg-[#7FB069] rounded-xl items-center justify-center mr-2 shadow-sm`}
          >
            <Heart size={20} color="#FFFFFF" fill="#FFFFFF" />
          </View>
          <View>
            <Text
              style={tw`text-xl font-black text-[#7FB069] tracking-tighter`}
            >
              Lành Care
            </Text>
            <View style={tw`flex-row items-center`}>
              <Sparkles size={10} color="#7FB069" fill="#7FB069" />
              <Text
                style={tw`text-[8px] text-gray-400 font-black uppercase ml-1`}
              >
                Community
              </Text>
            </View>
          </View>
        </View>

        <View style={tw`flex-row items-center`}>
          <TouchableOpacity
            onPress={() => navigation.navigate('MyPosts')}
            style={tw`p-2.5 bg-[#7FB069]/10 rounded-full mr-2`}
          >
            <FileText size={20} color="#7FB069" />
          </TouchableOpacity>
          <TouchableOpacity style={tw`p-2.5 bg-gray-50 rounded-full`}>
            <Bell size={20} color="#1F2937" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Floating Search Bar */}
      <View style={tw`px-6 -mt-4 z-40 mb-2`}>
        <View
          style={tw`bg-white rounded-2xl px-4 py-1.5 flex-row items-center shadow-xl border border-gray-100`}
        >
          <Search size={18} color="#9CA3AF" />
          <TextInput
            placeholder="Tìm kiếm kiến thức, bài viết..."
            placeholderTextColor="#9CA3AF"
            style={tw`flex-1 ml-3 h-11 text-brandDark font-bold`}
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
              style={tw`bg-gray-100 p-1 rounded-full`}
            >
              <X size={12} color="#9CA3AF" />
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
            tintColor="#7FB069"
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
              <Text style={tw`text-gray-400 font-bold text-center`}>
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
            <ActivityIndicator color="#7FB069" style={tw`py-6`} />
          ) : null
        }
      />
    </View>
  );
};

export default ForumScreen;
