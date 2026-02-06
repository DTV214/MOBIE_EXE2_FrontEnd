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
  Settings2,
  Edit3,
  Heart,
  FileText, // Icon mới đại diện cho "Bài viết của tôi"
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { useForumStore } from '../../viewmodels/useForumStore';
import { useUserStore } from '../../viewmodels/useUserStore';
import PostCard from '../../components/PostCard';

const ForumScreen = () => {
  const navigation = useNavigation<any>();
  const [searchQuery, setSearchQuery] = useState('');

  const { user } = useUserStore();
  const { posts, isLoading, isRefreshing, fetchPosts, refreshPosts, loadMore } =
    useForumStore();

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
        style={tw`bg-white px-6 py-5 border-b border-gray-100 mb-2 shadow-sm`}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => navigation.navigate('CreatePost')}
          style={tw`flex-row items-center bg-gray-50 p-4 rounded-2xl border border-gray-100`}
        >
          <Image
            source={{ uri: userAvatar }}
            style={tw`w-10 h-10 rounded-full mr-3 border-2 border-white`}
          />
          <Text style={tw`text-gray-400 flex-1 font-medium`}>
            Bạn muốn chia sẻ điều gì về sức khỏe?
          </Text>
          <View style={tw`bg-[#7FB069]/10 p-2 rounded-full`}>
            <Edit3 size={18} color="#7FB069" />
          </View>
        </TouchableOpacity>
      </View>
    ),
    [navigation, userAvatar],
  );

  return (
    <View style={tw`flex-1 bg-[#F8FAFC]`}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Top Header Section */}
      <View style={tw`bg-white pt-14 pb-4 px-6 shadow-sm z-10`}>
        <View style={tw`flex-row items-center justify-between mb-5`}>
          <View style={tw`flex-row items-center`}>
            <View
              style={tw`w-10 h-10 bg-[#7FB069] rounded-xl items-center justify-center mr-3 shadow-sm`}
            >
              <Heart size={22} color="#FFFFFF" fill="#FFFFFF" />
            </View>
            <View>
              <Text
                style={tw`text-2xl font-black text-[#7FB069] tracking-tight`}
              >
                Lành Care
              </Text>
              <Text
                style={tw`text-[10px] text-gray-400 font-bold uppercase tracking-widest`}
              >
                Community Health
              </Text>
            </View>
          </View>

          <View style={tw`flex-row items-center`}>
            {/* NÚT MỚI: Quản lý bài viết cá nhân */}
            <TouchableOpacity
              onPress={() => navigation.navigate('MyPosts')} // Điều hướng tới màn hình quản lý
              style={tw`p-2 bg-[#7FB069]/10 rounded-full mr-2`}
            >
              <FileText size={20} color="#7FB069" />
            </TouchableOpacity>

            <TouchableOpacity style={tw`p-2 bg-gray-50 rounded-full mr-2`}>
              <Bell size={20} color="#1F2937" />
            </TouchableOpacity>

            <TouchableOpacity style={tw`p-2 bg-gray-50 rounded-full`}>
              <Settings2 size={20} color="#1F2937" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View
          style={tw`bg-gray-100 rounded-2xl px-4 py-1 flex-row items-center border border-gray-200`}
        >
          <Search size={18} color="#9CA3AF" />
          <TextInput
            placeholder="Tìm kiếm kiến thức, bài viết..."
            placeholderTextColor="#9CA3AF"
            style={tw`flex-1 ml-3 h-11 text-brandDark font-medium`}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Text style={tw`text-xs text-gray-400 font-bold mr-2`}>Xóa</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Main Content: Newsfeed */}
      <FlatList
        data={posts}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <PostCard
            post={item}
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
            colors={['#7FB069']}
          />
        }
        onEndReached={loadMore}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          !isLoading ? (
            <View style={tw`items-center justify-center pt-20 px-10`}>
              <Image
                source={{
                  uri: 'https://cdn-icons-png.flaticon.com/512/6134/6134065.png',
                }}
                style={tw`w-32 h-32 opacity-20 mb-4`}
              />
              <Text style={tw`text-gray-400 font-bold text-center`}>
                {searchQuery
                  ? `Không tìm thấy bài viết cho "${searchQuery}"`
                  : 'Chưa có bài viết nào'}
              </Text>
            </View>
          ) : null
        }
        ListFooterComponent={
          isLoading && !isRefreshing ? (
            <View style={tw`py-6`}>
              <ActivityIndicator color="#7FB069" size="large" />
            </View>
          ) : (
            <View style={tw`h-20`} />
          )
        }
        contentContainerStyle={tw`pb-4`}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ForumScreen;
