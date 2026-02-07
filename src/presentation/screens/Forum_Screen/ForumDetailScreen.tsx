// src/presentation/screens/Forum_Screen/ForumDetailScreen.tsx

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Image,
  ActivityIndicator,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import tw from '../../../utils/tailwind';
import {
  ChevronLeft,
  Heart,
  MessageCircle,
  Share2,
  Bookmark,
  MoreVertical,
  Clock,
  Verified,
  Send,
  X,
  Camera,
} from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { launchImageLibrary, Asset } from 'react-native-image-picker';
import { useForumStore } from '../../viewmodels/useForumStore';
import { useCommentStore } from '../../viewmodels/useCommentStore';
import CommentItem from '../../components/CommentItem';
import { Comment } from '../../../domain/entities/Comment';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');
const MAX_IMAGES = 3;

const ForumDetailScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { postId } = route.params || {};

  // 1. Kết nối Stores - Lấy thêm toggleLike để xử lý thả tim
  const {
    currentPost,
    isDetailLoading,
    fetchPostById,
    clearCurrentPost,
    toggleLike,
  } = useForumStore();

  const {
    comments,
    fetchComments,
    addComment,
    editComment,
    isActionLoading,
    isLoading: isCommentsLoading,
  } = useCommentStore();

  const [commentText, setCommentText] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<Asset[]>([]);
  const [replyTo, setReplyTo] = useState<Comment | null>(null);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);

  useEffect(() => {
    if (postId) {
      fetchPostById(postId);
      fetchComments(postId);
    }
    return () => clearCurrentPost();
  }, [postId, fetchPostById, fetchComments, clearCurrentPost]);

  const handlePickImage = async () => {
    if (selectedFiles.length >= MAX_IMAGES) {
      Toast.show({
        type: 'info',
        text1: `Tối đa ${MAX_IMAGES} ảnh cho mỗi bình luận.`,
      });
      return;
    }
    const result = await launchImageLibrary({
      mediaType: 'photo',
      selectionLimit: MAX_IMAGES - selectedFiles.length,
      quality: 0.7,
    });
    if (result.assets) {
      setSelectedFiles([...selectedFiles, ...result.assets]);
    }
  };

  const handleSendComment = async () => {
    if (!commentText.trim() && selectedFiles.length === 0) return;

    try {
      const fileData = selectedFiles.map(asset => ({
        uri: asset.uri,
        type: asset.type,
        name: asset.fileName,
      }));

      if (editingComment) {
        await editComment(
          editingComment.id,
          commentText,
          editingComment.mediaUrls || [],
        );
      } else {
        await addComment({
          content: commentText,
          files: fileData,
          postId: postId,
          parentCommentId: replyTo?.id,
        });
        fetchPostById(postId);
      }
      cancelAction();
    } catch (err) {
      console.log('Lỗi gửi bình luận:', err);
    }
  };

  const cancelAction = () => {
    setReplyTo(null);
    setEditingComment(null);
    setCommentText('');
    setSelectedFiles([]);
  };

  if (isDetailLoading || !currentPost) {
    return (
      <View style={tw`flex-1 bg-white items-center justify-center`}>
        <ActivityIndicator color="#7FB069" size="large" />
      </View>
    );
  }

  const authorAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(
    currentPost.authorName,
  )}&background=7FB069&color=fff&bold=true`;

  return (
    <View style={tw`flex-1 bg-white`}>
      <StatusBar barStyle="dark-content" />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={tw`flex-1`}
      >
        <ScrollView showsVerticalScrollIndicator={false} style={tw`flex-1`}>
          {/* Header */}
          <View
            style={tw`bg-white pt-14 pb-4 px-6 border-b border-gray-50 flex-row items-center justify-between`}
          >
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={tw`p-2 -ml-2`}
            >
              <ChevronLeft size={24} color="#1F2937" />
            </TouchableOpacity>
            <Text
              style={tw`text-base font-black text-brandDark uppercase tracking-tighter`}
            >
              Chi tiết bài viết
            </Text>
            <TouchableOpacity style={tw`p-2 -mr-2`}>
              <Bookmark size={22} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Author Info */}
          <View
            style={tw`px-6 pt-6 pb-4 flex-row items-center justify-between`}
          >
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

          <View style={tw`px-6 mb-6`}>
            <Text style={tw`text-brandDark text-[17px] leading-7 font-medium`}>
              {currentPost.content}
            </Text>
          </View>

          {/* Media bài viết */}
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

          {/* Interaction Bar - SỬA LỖI TYM TẠI ĐÂY */}
          <View
            style={tw`mx-6 mb-8 bg-[#F8FAFC] rounded-[28px] p-4 flex-row justify-between items-center`}
          >
            <View style={tw`flex-row items-center`}>
              {/* Nút Thả tim (Tym) được sửa lỗi sang TouchableOpacity và gắn hàm toggleLike */}
              <TouchableOpacity
                onPress={() => toggleLike(currentPost.id)}
                activeOpacity={0.7}
                style={tw`flex-row items-center bg-white px-4 py-2 rounded-2xl shadow-sm mr-3`}
              >
                <Heart
                  size={22}
                  // Cập nhật màu sắc dựa trên trạng thái isLiked
                  color={currentPost.isLiked ? '#FF5252' : '#9CA3AF'}
                  fill={currentPost.isLiked ? '#FF5252' : 'transparent'}
                />
                <Text style={tw`text-sm text-brandDark ml-2 font-black`}>
                  {currentPost.heart}
                </Text>
              </TouchableOpacity>

              <View
                style={tw`flex-row items-center bg-white px-4 py-2 rounded-2xl shadow-sm`}
              >
                <MessageCircle size={22} color="#7FB069" />
                <Text style={tw`text-sm text-brandDark ml-2 font-black`}>
                  {currentPost.activeComments}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={tw`bg-white p-3 rounded-2xl shadow-sm`}>
              <Share2 size={22} color="#1F2937" />
            </TouchableOpacity>
          </View>

          {/* Danh sách bình luận */}
          <View style={tw`px-6 mb-10 pb-20`}>
            <Text style={tw`text-xl font-black text-brandDark mb-6`}>
              Thảo luận cộng đồng ({currentPost.activeComments})
            </Text>
            {Array.isArray(comments) && comments.length > 0 ? (
              comments.map(comment => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  postId={postId}
                  onReply={parent => {
                    setEditingComment(null);
                    setReplyTo(parent);
                  }}
                  onEdit={c => {
                    setReplyTo(null);
                    setEditingComment(c);
                    setCommentText(c.content);
                  }}
                />
              ))
            ) : (
              <View
                style={tw`bg-gray-50 rounded-3xl p-8 items-center border border-dashed border-gray-200`}
              >
                {isCommentsLoading ? (
                  <ActivityIndicator color="#7FB069" />
                ) : (
                  <>
                    <MessageCircle size={40} color="#D1D5DB" />
                    <Text style={tw`text-gray-400 mt-2 font-medium`}>
                      Hãy là người đầu tiên chia sẻ cảm nghĩ!
                    </Text>
                  </>
                )}
              </View>
            )}
          </View>
        </ScrollView>

        {/* Input Bar */}
        <View style={tw`bg-white border-t border-gray-100 shadow-lg`}>
          {selectedFiles.length > 0 && (
            <ScrollView
              horizontal
              style={tw`flex-row px-4 py-3 bg-white border-b border-gray-50`}
            >
              {selectedFiles.map((file, idx) => (
                <View key={idx} style={tw`relative mr-3`}>
                  <Image
                    source={{ uri: file.uri }}
                    style={tw`w-16 h-16 rounded-xl bg-gray-100`}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      setSelectedFiles(
                        selectedFiles.filter((_, i) => i !== idx),
                      )
                    }
                    style={tw`absolute -top-1.5 -right-1.5 bg-red-500 rounded-full p-1 border-2 border-white`}
                  >
                    <X size={10} color="white" />
                  </TouchableOpacity>
                </View>
              ))}
            </ScrollView>
          )}

          {(replyTo || editingComment) && (
            <View
              style={tw`flex-row justify-between items-center bg-[#7FB069]/10 px-4 py-2`}
            >
              <Text style={tw`text-[11px] text-[#7FB069] font-black italic`}>
                {editingComment
                  ? 'ĐANG CHỈNH SỬA...'
                  : `ĐANG TRẢ LỜI NGƯỜI DÙNG ${replyTo?.accountId}`}
              </Text>
              <TouchableOpacity onPress={cancelAction}>
                <X size={14} color="#7FB069" />
              </TouchableOpacity>
            </View>
          )}

          <View style={tw`flex-row items-center px-4 py-3 pb-8`}>
            {!editingComment && (
              <TouchableOpacity
                onPress={handlePickImage}
                style={tw`mr-3 bg-gray-50 p-2.5 rounded-full border border-gray-100`}
              >
                <Camera size={22} color="#7FB069" />
              </TouchableOpacity>
            )}

            <View
              style={tw`flex-1 bg-gray-100 rounded-[22px] px-4 py-1.5 flex-row items-center`}
            >
              <TextInput
                placeholder="Viết bình luận..."
                placeholderTextColor="#9CA3AF"
                style={tw`flex-1 min-h-[40px] text-brandDark max-h-32 py-2 font-medium`}
                multiline
                value={commentText}
                onChangeText={setCommentText}
              />
              <TouchableOpacity
                onPress={handleSendComment}
                disabled={
                  isActionLoading ||
                  (!commentText.trim() && selectedFiles.length === 0)
                }
                style={tw`ml-2 p-2 bg-[#7FB069] rounded-full shadow-sm`}
              >
                {isActionLoading ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Send size={18} color="white" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ForumDetailScreen;
