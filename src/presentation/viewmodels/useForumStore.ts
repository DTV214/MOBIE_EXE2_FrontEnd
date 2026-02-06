// src/presentation/viewmodels/useForumStore.ts

import { create } from 'zustand';
import { Post } from '../../domain/entities/Post';
import {
  getAllPostsUseCase,
  createPostUseCase,
  uploadMediaUseCase,
  getPostByIdUseCase,
  getMyPostsUseCase, // MỚI: Use Case lấy bài viết cá nhân
  updatePostUseCase, // MỚI: Use Case cập nhật bài viết
  deletePostUseCase, // MỚI: Use Case xóa bài viết
} from '../../di/Container';

interface ForumState {
  // --- Data State ---
  posts: Post[];
  myPosts: Post[]; // MỚI: Danh sách bài viết riêng của tài khoản
  currentPost: Post | null;
  page: number;
  totalPages: number;
  totalElements: number;
  search: string;

  // --- UI Status State ---
  isLoading: boolean;
  isRefreshing: boolean;
  isPublishing: boolean;
  isDetailLoading: boolean;
  isActionLoading: boolean; // MỚI: Trạng thái khi đang Xóa hoặc Sửa
  error: string | null;

  // --- Actions ---
  fetchPosts: (page?: number, size?: number, search?: string) => Promise<void>;
  refreshPosts: () => Promise<void>;
  loadMore: () => Promise<void>;
  createPost: (content: string, files: any[]) => Promise<void>;
  fetchPostById: (id: number) => Promise<void>;

  /** * Lấy danh sách bài viết cá nhân qua Token Authorization
   *
   */
  fetchMyPosts: () => Promise<void>;

  /** * Cập nhật bài viết hiện có
   *
   */
  updatePost: (
    id: number,
    content: string,
    mediaUrls: string[],
    heart: number,
    accountId: number,
  ) => Promise<void>;

  /** * Xóa bài viết và cập nhật UI ngay lập tức
   *
   */
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

  // 1. Lấy danh sách bài viết chung (Newsfeed)
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

  // 2. Lấy danh sách bài viết cá nhân
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

  // 3. Logic Đăng bài 2 Giai đoạn
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

  // 4. Logic Cập nhật bài viết
  updatePost: async (id, content, mediaUrls, heart, accountId) => {
    set({ isActionLoading: true, error: null });
    try {
      await updatePostUseCase.execute(id, {
        content,
        mediaUrls,
        heart,
        accountId,
      });
      // Làm mới dữ liệu sau khi sửa thành công
      await Promise.all([get().fetchPosts(0), get().fetchMyPosts()]);
    } catch (err: any) {
      set({ error: err.message || 'Lỗi khi cập nhật bài viết' });
      throw err;
    } finally {
      set({ isActionLoading: false });
    }
  },

  // 5. Logic Xóa bài viết (Optimistic UI)
  deletePostById: async (id: number) => {
    set({ isActionLoading: true });
    try {
      await deletePostUseCase.execute(id);
      // Cập nhật UI ngay lập tức không cần tải lại trang
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
