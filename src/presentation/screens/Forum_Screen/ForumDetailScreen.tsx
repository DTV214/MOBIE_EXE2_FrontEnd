// src/presentation/screens/Forum_Screen/ForumDetailScreen.tsx
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';
import tw from '../../../utils/tailwind';
import {
  ChevronLeft,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  Send,
  MoreVertical,
  Flame,
} from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
  getPostByIdUseCase,
  likePostUseCase,
  getCommentsByPostIdUseCase,
  createCommentUseCase,
} from '../../../di/Container';
import { Post, Comment, UserProfile } from '../../../domain/entities/Post';

const ForumDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { postId } = route.params || {};

  const [post, setPost] = useState<Post | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [commentText, setCommentText] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [postId]);

  const loadData = async () => {
    try {
      const [postData, commentsData] = await Promise.all([
        getPostByIdUseCase.execute(postId),
        getCommentsByPostIdUseCase.execute(postId),
      ]);
      setPost(postData);
      setComments(commentsData);
    } catch (error) {
      console.error('Error loading post detail:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!post) return;
    try {
      await likePostUseCase.execute(post.id, post.isLiked);
      setPost({ ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 });
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleComment = async () => {
    if (!commentText.trim() || !post) return;

    try {
      // Mock current user
      const currentUser: UserProfile = {
        id: 'current-user',
        name: 'Bạn',
        role: 'user',
      };

      const newComment = await createCommentUseCase.execute({
        postId: post.id,
        author: currentUser,
        content: commentText,
      });

      setComments([...comments, newComment]);
      setCommentText('');
      setPost({ ...post, comments: post.comments + 1 });
    } catch (error) {
      console.error('Error creating comment:', error);
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

  if (loading || !post) {
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
      <View style={tw`bg-white pt-14 pb-4 px-6 border-b border-gray-100 flex-row items-center justify-between`}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ChevronLeft size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={tw`text-lg font-bold text-brandDark`}>Chi tiết bài viết</Text>
        <TouchableOpacity>
          <Bookmark
            size={22}
            color={post.isSaved ? '#7FB069' : '#9CA3AF'}
            fill={post.isSaved ? '#7FB069' : 'none'}
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} style={tw`flex-1`}>
        <View style={tw`px-6 pt-6`}>
          {/* Author Info */}
          <View style={tw`flex-row items-center justify-between mb-6`}>
            <View style={tw`flex-row items-center flex-1`}>
              <View style={tw`w-12 h-12 bg-gray-200 rounded-full mr-3`} />
              <View style={tw`flex-1`}>
                <View style={tw`flex-row items-center`}>
                  <Text style={tw`text-brandDark font-semibold text-base mr-2`}>
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
                  {post.author.specialty && `${post.author.specialty} • `}
                  {formatTimeAgo(post.createdAt)}
                </Text>
              </View>
            </View>
            <TouchableOpacity>
              <MoreVertical size={18} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Content */}
          <Text style={tw`text-brandDark text-base leading-6 mb-4`}>
            {post.content}
          </Text>

          {/* Media */}
          {post.media && post.media.length > 0 && (
            <View style={tw`bg-gray-100 rounded-xl h-64 mb-6 items-center justify-center`}>
              <Text style={tw`text-textSub text-xs`}>
                {post.media.length} {post.media[0].type === 'image' ? 'hình ảnh' : 'video'}
              </Text>
            </View>
          )}

          {/* Hashtags */}
          {post.hashtags.length > 0 && (
            <View style={tw`flex-row flex-wrap mb-6`}>
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
            <View style={tw`bg-primaryLight/30 rounded-xl p-4 mb-6`}>
              {post.stats.caloriesBurned && (
                <View style={tw`flex-row items-center mb-2`}>
                  <Flame size={16} color="#F97316" />
                  <Text style={tw`text-textSub text-sm ml-2`}>
                    Calo đã đốt: {post.stats.caloriesBurned} kcal
                  </Text>
                </View>
              )}
              {post.stats.duration && (
                <View style={tw`flex-row items-center mb-2`}>
                  <Text style={tw`text-textSub text-sm`}>
                    Thời gian: {post.stats.duration}
                  </Text>
                </View>
              )}
              {post.stats.nutritionTip && (
                <Text style={tw`text-textSub text-sm`}>
                  Gợi ý định dưỡng: {post.stats.nutritionTip}
                </Text>
              )}
            </View>
          )}

          {/* Engagement Bar */}
          <View style={tw`flex-row justify-between items-center py-4 border-t border-b border-gray-100 mb-6`}>
            <View style={tw`flex-row items-center`}>
              <TouchableOpacity
                onPress={handleLike}
                style={tw`flex-row items-center mr-6`}
              >
                <Heart
                  size={20}
                  color={post.isLiked ? '#EF4444' : '#9CA3AF'}
                  fill={post.isLiked ? '#EF4444' : 'none'}
                />
                <Text style={tw`text-sm text-brandDark ml-2 font-semibold`}>
                  {post.likes}
                </Text>
              </TouchableOpacity>
              <View style={tw`flex-row items-center`}>
                <MessageCircle size={20} color="#9CA3AF" />
                <Text style={tw`text-sm text-textSub ml-2`}>{post.comments}</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Share2 size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Comments Section */}
          <Text style={tw`text-lg font-bold text-brandDark mb-4`}>
            Bình luận ({comments.length})
          </Text>
          {comments.map((comment) => (
            <View key={comment.id} style={tw`mb-4 pb-4 border-b border-gray-100`}>
              <View style={tw`flex-row items-center mb-2`}>
                <View style={tw`w-8 h-8 bg-gray-200 rounded-full mr-2`} />
                <View style={tw`flex-1`}>
                  <Text style={tw`text-sm font-semibold text-brandDark`}>
                    {comment.author.name}
                  </Text>
                  <Text style={tw`text-xs text-textSub`}>
                    {formatTimeAgo(comment.createdAt)}
                  </Text>
                </View>
                <TouchableOpacity>
                  <Heart
                    size={16}
                    color={comment.isLiked ? '#EF4444' : '#9CA3AF'}
                    fill={comment.isLiked ? '#EF4444' : 'none'}
                  />
                </TouchableOpacity>
              </View>
              <Text style={tw`text-sm text-brandDark leading-5`}>
                {comment.content}
              </Text>
            </View>
          ))}

          {/* Bottom spacing */}
          <View style={tw`h-6`} />
        </View>
      </ScrollView>

      {/* Comment Input */}
      <View style={tw`bg-white border-t border-gray-100 px-6 py-4 flex-row items-center`}>
        <View style={tw`flex-1 bg-gray-50 rounded-2xl px-4 py-2 mr-3`}>
          <TextInput
            placeholder="Viết bình luận của bạn..."
            placeholderTextColor="#9CA3AF"
            style={tw`text-sm text-brandDark`}
            value={commentText}
            onChangeText={setCommentText}
            multiline
          />
        </View>
        <TouchableOpacity
          onPress={handleComment}
          disabled={!commentText.trim()}
          style={tw`bg-primary p-3 rounded-full ${
            !commentText.trim() ? 'opacity-50' : ''
          }`}
        >
          <Send size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ForumDetailScreen;
