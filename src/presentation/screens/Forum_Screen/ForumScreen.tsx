// src/presentation/screens/Forum_Screen/ForumScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
  StatusBar,
  FlatList,
  Image,
} from 'react-native';
import tw from '../../../utils/tailwind';
import {
  Search,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Camera,
  Video,
  Smile,
  Tag,
  MoreVertical,
  Bell,
  Flame,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import {
  getAllPostsUseCase,
  likePostUseCase,
  getSuggestedTopicsUseCase,
  getTrendingDiscussionsUseCase,
} from '../../../di/Container';
import { Post, Topic } from '../../../domain/entities/Post';

const ForumScreen = () => {
  const navigation = useNavigation<any>();
  const [posts, setPosts] = useState<Post[]>([]);
  const [suggestedTopics, setSuggestedTopics] = useState<Topic[]>([]);
  const [trendingDiscussions, setTrendingDiscussions] = useState<Post[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'feed' | 'topics'>('feed');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [postsData, topicsData, trendingData] = await Promise.all([
        getAllPostsUseCase.execute(),
        getSuggestedTopicsUseCase.execute(),
        getTrendingDiscussionsUseCase.execute(),
      ]);
      setPosts(postsData);
      setSuggestedTopics(topicsData);
      setTrendingDiscussions(trendingData);
    } catch (error) {
      console.error('Error loading forum data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLikePost = async (post: Post) => {
    try {
      await likePostUseCase.execute(post.id, post.isLiked);
      // Update local state
      setPosts(
        posts.map(p =>
          p.id === post.id
            ? {
                ...p,
                isLiked: !p.isLiked,
                likes: p.isLiked ? p.likes - 1 : p.likes + 1,
              }
            : p,
        ),
      );
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Vừa xong';
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} ngày trước`;
  };

  const getRoleColor = (role?: string) => {
    switch (role) {
      case 'expert':
      case 'doctor':
        return '#7FB069';
      case 'trainer':
        return '#3B82F6';
      default:
        return '#9CA3AF';
    }
  };

  if (loading) {
    return (
      <View style={tw`flex-1 bg-background items-center justify-center`}>
        <Text style={tw`text-textSub`}>Đang tải...</Text>
      </View>
    );
  }

  return (
    <View style={tw`flex-1 bg-background`}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

      {/* Header */}
      <View style={tw`bg-white pt-14 pb-4 px-6 border-b border-gray-100`}>
        <View style={tw`flex-row items-center justify-between mb-4`}>
          <View style={tw`flex-row items-center`}>
            <View style={tw`w-10 h-10 bg-primary rounded-full items-center justify-center mr-3`}>
              <Heart size={20} color="#FFFFFF" fill="#FFFFFF" />
            </View>
            <View>
              <Text style={tw`text-xl font-bold text-brandDark`}>Lành Care</Text>
              <Text style={tw`text-xs text-textSub`}>Diễn đàn sức khỏe</Text>
            </View>
          </View>
          <View style={tw`flex-row items-center`}>
            <TouchableOpacity style={tw`p-2 mr-2`}>
              <Bell size={22} color="#1F2937" />
            </TouchableOpacity>
            <TouchableOpacity style={tw`p-2`}>
              <MoreVertical size={20} color="#1F2937" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View style={tw`bg-gray-50 rounded-xl px-4 py-3 flex-row items-center mb-4`}>
          <Search size={20} color="#9CA3AF" />
          <TextInput
            placeholder="Tìm kiếm bài viết..."
            placeholderTextColor="#9CA3AF"
            style={tw`flex-1 ml-3 text-brandDark`}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {/* Tabs */}
        <View style={tw`flex-row`}>
          <TouchableOpacity
            onPress={() => setActiveTab('feed')}
            style={tw`px-4 py-2 mr-4 ${
              activeTab === 'feed' ? 'border-b-2 border-primary' : ''
            }`}
          >
            <Text
              style={tw`font-semibold ${
                activeTab === 'feed' ? 'text-primary' : 'text-textSub'
              }`}
            >
              Bảng tin
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('topics')}
            style={tw`px-4 py-2 ${
              activeTab === 'topics' ? 'border-b-2 border-primary' : ''
            }`}
          >
            <Text
              style={tw`font-semibold ${
                activeTab === 'topics' ? 'text-primary' : 'text-textSub'
              }`}
            >
              Chủ đề của bạn
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={tw`ml-auto p-2`}>
            <MoreVertical size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={tw`flex-1`}>
        {/* Post Creation Section */}
        <View style={tw`bg-white px-6 py-4 border-b border-gray-100`}>
          <View style={tw`flex-row items-center mb-4`}>
            <View style={tw`w-10 h-10 bg-gray-200 rounded-full mr-3`} />
            <TextInput
              placeholder="Bạn muốn chia sẻ điều gì về sức khỏe?"
              placeholderTextColor="#9CA3AF"
              style={tw`flex-1 text-brandDark`}
              onFocus={() => navigation.navigate('CreatePost')}
            />
          </View>
          <View style={tw`flex-row justify-between`}>
            <TouchableOpacity
              onPress={() => navigation.navigate('CreatePost', { type: 'image' })}
              style={tw`flex-row items-center`}
            >
              <Camera size={20} color="#7FB069" />
              <Text style={tw`text-primary font-semibold text-sm ml-2`}>Hình ảnh</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate('CreatePost', { type: 'video' })}
              style={tw`flex-row items-center`}
            >
              <Video size={20} color="#7FB069" />
              <Text style={tw`text-primary font-semibold text-sm ml-2`}>Video</Text>
            </TouchableOpacity>
            <TouchableOpacity style={tw`flex-row items-center`}>
              <Smile size={20} color="#7FB069" />
              <Text style={tw`text-primary font-semibold text-sm ml-2`}>Tâm trạng</Text>
            </TouchableOpacity>
            <TouchableOpacity style={tw`flex-row items-center`}>
              <Tag size={20} color="#7FB069" />
              <Text style={tw`text-primary font-semibold text-sm ml-2`}>Chủ đề</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Suggested Topics */}
        {activeTab === 'feed' && (
          <View style={tw`bg-white px-6 py-4 border-b border-gray-100`}>
            <Text style={tw`text-brandDark font-bold text-base mb-3`}>
              Gợi ý chủ đề
            </Text>
            <View style={tw`flex-row flex-wrap`}>
              {suggestedTopics.map((topic) => (
                <TouchableOpacity
                  key={topic.id}
                  style={tw`bg-primary/10 px-4 py-2 rounded-full mr-2 mb-2`}
                >
                  <Text style={tw`text-primary font-semibold text-sm`}>
                    {topic.hashtag}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Active Experts */}
        {activeTab === 'feed' && (
          <View style={tw`bg-white px-6 py-4 border-b border-gray-100`}>
            <Text style={tw`text-brandDark font-bold text-base mb-3`}>
              Chuyên gia đang hoạt động
            </Text>
            <View style={tw`flex-row`}>
              <View style={tw`items-center mr-6`}>
                <View style={tw`relative`}>
                  <View style={tw`w-12 h-12 bg-gray-200 rounded-full`} />
                  <View style={tw`absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-white`} />
                </View>
                <Text style={tw`text-xs text-brandDark font-semibold mt-1`}>
                  BS. Nguyễn Văn A
                </Text>
                <Text style={tw`text-xs text-textSub`}>Tim mạch</Text>
              </View>
              <View style={tw`items-center`}>
                <View style={tw`relative`}>
                  <View style={tw`w-12 h-12 bg-gray-200 rounded-full`} />
                  <View style={tw`absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-white`} />
                </View>
                <Text style={tw`text-xs text-brandDark font-semibold mt-1`}>
                  ThS. Trần Thị B
                </Text>
                <Text style={tw`text-xs text-textSub`}>Dinh dưỡng</Text>
              </View>
            </View>
          </View>
        )}

        {/* Posts Feed */}
        <View style={tw`px-6 py-4`}>
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
              onLike={() => handleLikePost(post)}
              onPress={() => navigation.navigate('ForumDetail', { postId: post.id })}
              formatTimeAgo={formatTimeAgo}
              getRoleColor={getRoleColor}
            />
          ))}
        </View>

        {/* Trending Discussions */}
        {activeTab === 'feed' && trendingDiscussions.length > 0 && (
          <View style={tw`bg-white px-6 py-4 mt-4 border-t border-gray-100`}>
            <Text style={tw`text-brandDark font-bold text-base mb-3`}>
              Thảo luận nổi bật
            </Text>
            {trendingDiscussions.slice(0, 2).map((post) => (
              <TouchableOpacity
                key={post.id}
                onPress={() => navigation.navigate('ForumDetail', { postId: post.id })}
                style={tw`flex-row items-center mb-3`}
              >
                <View style={tw`w-8 h-8 bg-orange-100 rounded-full items-center justify-center mr-3`}>
                  <Flame size={16} color="#F97316" />
                </View>
                <View style={tw`flex-1`}>
                  <Text style={tw`text-brandDark font-semibold text-sm mb-1`}>
                    {post.content.substring(0, 50)}...
                  </Text>
                  <Text style={tw`text-textSub text-xs`}>
                    {post.comments} bình luận - {formatTimeAgo(post.createdAt)}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Bottom spacing */}
        <View style={tw`h-6`} />
      </ScrollView>
    </View>
  );
};

interface PostCardProps {
  post: Post;
  onLike: () => void;
  onPress: () => void;
  formatTimeAgo: (date: string) => string;
  getRoleColor: (role?: string) => string;
}

const PostCard = ({
  post,
  onLike,
  onPress,
  formatTimeAgo,
  getRoleColor,
}: PostCardProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={tw`bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-100`}
    >
      {/* Author Info */}
      <View style={tw`flex-row items-center justify-between mb-3`}>
        <View style={tw`flex-row items-center flex-1`}>
          <View style={tw`w-10 h-10 bg-gray-200 rounded-full mr-3`} />
          <View style={tw`flex-1`}>
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-brandDark font-semibold text-sm mr-2`}>
                {post.author.name}
              </Text>
              {post.author.roleLabel && (
                <View
                  style={tw`px-2 py-0.5 rounded-full`}
                  style={{ backgroundColor: `${getRoleColor(post.author.role)}20` }}
                >
                  <Text
                    style={tw`text-xs font-semibold`}
                    style={{ color: getRoleColor(post.author.role) }}
                  >
                    {post.author.roleLabel}
                  </Text>
                </View>
              )}
            </View>
            <Text style={tw`text-textSub text-xs`}>
              {formatTimeAgo(post.createdAt)}
            </Text>
          </View>
        </View>
        <TouchableOpacity>
          <MoreVertical size={18} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      {/* Content */}
      <Text style={tw`text-brandDark text-sm mb-3 leading-5`}>{post.content}</Text>

      {/* Media */}
      {post.media && post.media.length > 0 && (
        <View style={tw`bg-gray-100 rounded-xl h-48 mb-3 items-center justify-center`}>
          <Text style={tw`text-textSub text-xs`}>
            {post.media.length} {post.media[0].type === 'image' ? 'hình ảnh' : 'video'}
          </Text>
        </View>
      )}

      {/* Hashtags */}
      {post.hashtags.length > 0 && (
        <View style={tw`flex-row flex-wrap mb-3`}>
          {post.hashtags.map((tag, index) => (
            <View
              key={index}
              style={tw`bg-primary/10 px-3 py-1 rounded-full mr-2 mb-2`}
            >
              <Text style={tw`text-primary font-semibold text-xs`}>{tag}</Text>
            </View>
          ))}
        </View>
      )}

      {/* Stats/Tips */}
      {post.stats && (
        <View style={tw`bg-primaryLight/30 rounded-xl p-3 mb-3`}>
          {post.stats.caloriesBurned && (
            <View style={tw`flex-row items-center mb-1`}>
              <Flame size={16} color="#F97316" />
              <Text style={tw`text-textSub text-xs ml-2`}>
                Calo đã đốt: {post.stats.caloriesBurned} kcal
              </Text>
            </View>
          )}
          {post.stats.duration && (
            <View style={tw`flex-row items-center`}>
              <Text style={tw`text-textSub text-xs`}>
                Thời gian: {post.stats.duration}
              </Text>
            </View>
          )}
          {post.stats.nutritionTip && (
            <Text style={tw`text-textSub text-xs mt-1`}>
              Gợi ý định dưỡng: {post.stats.nutritionTip}
            </Text>
          )}
        </View>
      )}

      {/* Engagement */}
      <View style={tw`flex-row items-center justify-between pt-3 border-t border-gray-100`}>
        <View style={tw`flex-row items-center`}>
          <TouchableOpacity
            onPress={onLike}
            style={tw`flex-row items-center mr-4`}
          >
            <Heart
              size={18}
              color={post.isLiked ? '#EF4444' : '#9CA3AF'}
              fill={post.isLiked ? '#EF4444' : 'none'}
            />
            <Text style={tw`text-textSub text-xs ml-1`}>
              Thích ({post.likes})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={tw`flex-row items-center mr-4`}>
            <MessageCircle size={18} color="#9CA3AF" />
            <Text style={tw`text-textSub text-xs ml-1`}>
              Bình luận ({post.comments})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Share2 size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity>
          <Bookmark
            size={18}
            color={post.isSaved ? '#7FB069' : '#9CA3AF'}
            fill={post.isSaved ? '#7FB069' : 'none'}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

export default ForumScreen;
