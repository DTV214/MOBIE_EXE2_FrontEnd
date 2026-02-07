// src/presentation/viewmodels/useCommentStore.ts

import { create } from 'zustand';
import { Comment } from '../../domain/entities/Comment';
import {
  getCommentsByPostIdUseCase,
  createCommentUseCase,
  updateCommentUseCase,
  deleteCommentUseCase,
  uploadMediaUseCase,
} from '../../di/Container';

interface CommentState {
  // --- Data State ---
  comments: Comment[];
  isLoading: boolean;
  isActionLoading: boolean;
  error: string | null;

  // --- Actions ---
  /** Lấy danh sách bình luận theo postId */
  fetchComments: (postId: number) => Promise<void>;

  /** * Đăng bình luận hoặc phản hồi
   * parentCommentId > 0 nghĩa là phản hồi (reply)
   */
  addComment: (data: {
    content: string;
    files: any[]; // File nhị phân để upload qua Cloudinary
    postId: number;
    parentCommentId?: number;
  }) => Promise<void>;

  /** Cập nhật nội dung bình luận */
  editComment: (
    id: number,
    content: string,
    mediaUrls: string[],
  ) => Promise<void>;

  /** Xóa bình luận vĩnh viễn */
  removeComment: (id: number, postId: number) => Promise<void>;

  clearComments: () => void;
  clearError: () => void;
}

export const useCommentStore = create<CommentState>((set, get) => ({
  comments: [], // Bắt buộc khởi tạo là mảng rỗng để tránh lỗi .length
  isLoading: false,
  isActionLoading: false,
  error: null,

  fetchComments: async (postId: number) => {
    set({ isLoading: true, error: null });
    try {
      const data = await getCommentsByPostIdUseCase.execute(postId);
      // Đảm bảo data luôn là mảng trước khi gán vào State
      set({
        comments: Array.isArray(data) ? data : [],
        isLoading: false,
      });
    } catch (err: any) {
      set({
        error: err.message || 'Không thể tải bình luận',
        isLoading: false,
        comments: [], // Trả về mảng rỗng để bảo vệ UI không bị crash
      });
    }
  },

  addComment: async ({ content, files, postId, parentCommentId }) => {
    set({ isActionLoading: true, error: null });
    try {
      // Giai đoạn 1: Upload media (nếu có) để lấy danh sách URL
      const uploadPromises = files.map(file =>
        uploadMediaUseCase.execute(file),
      );
      const mediaUrls = await Promise.all(uploadPromises);

      // Giai đoạn 2: Gọi API POST để lưu bình luận
      await createCommentUseCase.execute({
        content,
        mediaUrls,
        postId,
        parentCommentId,
      });

      // Giai đoạn 3: Tải lại toàn bộ danh sách để cập nhật cấu trúc replies lồng nhau
      await get().fetchComments(postId);
    } catch (err: any) {
      set({ error: err.message || 'Lỗi khi gửi bình luận' });
      throw err;
    } finally {
      set({ isActionLoading: false });
    }
  },

  editComment: async (id, content, mediaUrls) => {
    set({ isActionLoading: true, error: null });
    try {
      // Thực thi lệnh PUT
      await updateCommentUseCase.execute(id, { content, mediaUrls });

      // Cập nhật Optimistic UI: Tìm và sửa nội dung ngay tại local
      set(state => ({
        comments: state.comments.map(c =>
          c.id === id ? { ...c, content, mediaUrls } : c,
        ),
      }));
    } catch (err: any) {
      set({ error: err.message || 'Lỗi khi sửa bình luận' });
      throw err;
    } finally {
      set({ isActionLoading: false });
    }
  },

  removeComment: async (id, postId) => {
    set({ isActionLoading: true });
    try {
      // Thực thi lệnh DELETE
      await deleteCommentUseCase.execute(id);

      // Sau khi xóa, tải lại danh sách là cách an toàn nhất để cập nhật số lượng và replies con
      await get().fetchComments(postId);
    } catch (err: any) {
      set({ error: err.message || 'Không thể xóa bình luận' });
      throw err;
    } finally {
      set({ isActionLoading: false });
    }
  },

  clearComments: () => set({ comments: [] }),
  clearError: () => set({ error: null }),
}));
