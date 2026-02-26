// src/presentation/viewmodels/useForumStore.ts

import { create } from 'zustand';
import { Post } from '../../domain/entities/Post';
import {
  getAllPostsUseCase,
  createPostUseCase,
  uploadMediaUseCase,
  getPostByIdUseCase,
  getMyPostsUseCase,
  updatePostUseCase,
  deletePostUseCase,
} from '../../di/Container';

interface ForumState {
  posts: Post[];
  myPosts: Post[];
  currentPost: Post | null;
  page: number;
  totalPages: number;
  totalElements: number;
  search: string;

  isLoading: boolean;
  isRefreshing: boolean;
  isPublishing: boolean;
  isDetailLoading: boolean;
  isActionLoading: boolean;
  error: string | null;

  fetchPosts: (page?: number, size?: number, search?: string) => Promise<void>;
  refreshPosts: () => Promise<void>;
  loadMore: () => Promise<void>;
  createPost: (content: string, files: any[]) => Promise<void>;
  fetchPostById: (id: number) => Promise<void>;
  fetchMyPosts: () => Promise<void>;

  /** * CẬP NHẬT: Logic Thả tim (Like/Unlike)
   * Đảm bảo mỗi người chỉ được tác động 1 đơn vị tim lên bài viết
   */
  toggleLike: (postId: number) => Promise<void>;

  updatePost: (
    id: number,
    content: string,
    mediaUrls: string[],
    heart: number,
    accountId: number,
  ) => Promise<void>;

  deletePostById: (id: number) => Promise<void>;

  clearCurrentPost: () => void;
  clearError: () => void;
}

export const useForumStore = create<ForumState>((set, get) => ({
  posts: [],
  myPosts: [],
  currentPost: null,
  page: 0,
  totalPages: 0,
  totalElements: 0,
  search: '',
  isLoading: false,
  isRefreshing: false,
  isPublishing: false,
  isDetailLoading: false,
  isActionLoading: false,
  error: null,

  fetchPosts: async (page = 0, size = 10, search = '') => {
    set({ isLoading: page === 0, error: null, search });
    try {
      const response = await getAllPostsUseCase.execute({ page, size, search });
      set(state => ({
        posts:
          page === 0 ? response.content : [...state.posts, ...response.content],
        page,
        totalPages: response.totalPages,
        totalElements: response.totalElements,
        isLoading: false,
      }));
    } catch (err: any) {
      set({ error: err.message || 'Lỗi tải bài viết', isLoading: false });
    }
  },

  fetchMyPosts: async () => {
    set({ isLoading: true, error: null });
    try {
      const data = await getMyPostsUseCase.execute();
      set({ myPosts: data, isLoading: false });
    } catch (err: any) {
      set({
        error: err.message || 'Không thể tải bài viết cá nhân',
        isLoading: false,
      });
    }
  },

  /** * CẢI TIẾN LOGIC: Thả tim/Bỏ tim (Optimistic UI)
   * Sử dụng flag 'isLiked' (nếu có trong Entity) hoặc logic so sánh để toggle
   */
  toggleLike: async (postId: number) => {
    const { posts, currentPost } = get();

    // Lưu lại trạng thái cũ để rollback nếu API lỗi
    const previousPosts = [...posts];
    const previousDetail = currentPost ? { ...currentPost } : null;

    // Xác định bài viết cần cập nhật trong danh sách
    const updatedPosts = posts.map(p => {
      if (p.id === postId) {
        // Nếu isLiked = true thì giảm 1 (unlike), ngược lại tăng 1 (like)
        const isLiked = p.isLiked;
        return {
          ...p,
          heart: isLiked ? Math.max(0, p.heart - 1) : p.heart + 1,
          isLiked: !isLiked,
        };
      }
      return p;
    });

    // Cập nhật tương tự cho bài viết đang xem chi tiết (nếu có)
    const updatedDetail =
      currentPost && currentPost.id === postId
        ? {
            ...currentPost,
            heart: currentPost.isLiked
              ? Math.max(0, currentPost.heart - 1)
              : currentPost.heart + 1,
            isLiked: !currentPost.isLiked,
          }
        : currentPost;

    // Cập nhật UI ngay lập tức
    set({ posts: updatedPosts, currentPost: updatedDetail });

    try {
      const targetPost = updatedPosts.find(p => p.id === postId);
      if (targetPost) {
        await updatePostUseCase.execute(postId, {
          content: targetPost.content,
          mediaUrls: targetPost.mediaUrls,
          heart: targetPost.heart,
          accountId: targetPost.authorId,
        });
      }
    } catch (err) {
      // Hoàn tác dữ liệu nếu server trả lỗi
      set({ posts: previousPosts, currentPost: previousDetail });
      console.error('Lỗi khi cập nhật lượt thích:', err);
    }
  },

  createPost: async (content, files) => {
    set({ isPublishing: true, error: null });
    try {
      const uploadPromises = files.map(file =>
        uploadMediaUseCase.execute(file),
      );
      const mediaUrls = await Promise.all(uploadPromises);
      await createPostUseCase.execute(content, mediaUrls);
      await get().fetchPosts(0);
    } catch (err: any) {
      set({ error: err.message || 'Không thể đăng bài viết' });
      throw new Error(err.message);
    } finally {
      set({ isPublishing: false });
    }
  },

  updatePost: async (id, content, mediaUrls, heart, accountId) => {
    set({ isActionLoading: true, error: null });
    try {
      await updatePostUseCase.execute(id, {
        content,
        mediaUrls,
        heart,
        accountId,
      });
      await Promise.all([get().fetchPosts(0), get().fetchMyPosts()]);
      if (get().currentPost?.id === id) {
        await get().fetchPostById(id);
      }
    } catch (err: any) {
      set({ error: err.message || 'Lỗi khi cập nhật bài viết' });
      throw err;
    } finally {
      set({ isActionLoading: false });
    }
  },

  deletePostById: async (id: number) => {
    set({ isActionLoading: true });
    try {
      await deletePostUseCase.execute(id);
      set(state => ({
        myPosts: state.myPosts.filter(p => p.id !== id),
        posts: state.posts.filter(p => p.id !== id),
        isActionLoading: false,
      }));
    } catch (err: any) {
      set({
        error: err.message || 'Không thể xóa bài viết',
        isActionLoading: false,
      });
      throw err;
    }
  },

  fetchPostById: async (id: number) => {
    set({ isDetailLoading: true, error: null });
    try {
      const post = await getPostByIdUseCase.execute(id);
      set({ currentPost: post, isDetailLoading: false });
    } catch (err: any) {
      set({ error: err.message || 'Lỗi tải chi tiết', isDetailLoading: false });
    }
  },

  refreshPosts: async () => {
    set({ isRefreshing: true, error: null });
    await get().fetchPosts(0, 10, get().search);
    set({ isRefreshing: false });
  },

  loadMore: async () => {
    const { page, totalPages, isLoading, search } = get();
    if (!isLoading && page < totalPages - 1) {
      await get().fetchPosts(page + 1, 10, search);
    }
  },

  clearCurrentPost: () => set({ currentPost: null }),
  clearError: () => set({ error: null }),
}));
