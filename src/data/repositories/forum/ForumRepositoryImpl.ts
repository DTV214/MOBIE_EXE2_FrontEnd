// src/data/repositories/forum/ForumRepositoryImpl.ts

import { Platform } from 'react-native';
import { Post, PostPage } from '../../../domain/entities/Post';
import axiosInstance from '../../apis/axiosInstance';
import { IForumRepository } from '../../../domain/repositories/forum/IForumRepository';

export class ForumRepositoryImpl implements IForumRepository {
  /** * Lấy danh sách bài viết kèm filters
   */
  async getAllPosts(params: any): Promise<PostPage> {
    const response = await axiosInstance.get('/api/public/posts', { params });
    // Dữ liệu bọc trong object 'data' theo cấu trúc trả về của Backend
    const { data } = response.data;
    return {
      content: data.content,
      totalPages: data.totalPages,
      totalElements: data.totalElements,
    };
  }
  async getMyPosts(): Promise<Post[]> {
    // Backend tự động xác định account qua token trong header
    const response = await axiosInstance.get('/api/public/posts/account');
    return response.data.data; // Trả về mảng bài viết
  }
  /**
   * Lấy chi tiết một bài viết cụ thể qua ID
   * Endpoint: GET /api/public/posts/{id}
   */
  async getPostById(id: number): Promise<Post> {
    const response = await axiosInstance.get(`/api/public/posts/${id}`);

    /**
     * Dựa trên Swagger:
     * Response trả về có bọc qua một lớp 'data'.
     * Chúng ta trả về object thực thể bài viết nằm bên trong đó.
     */
    return response.data.data;
  }

  /** * Giai đoạn 1: Upload Media (Ảnh/Video) lên Cloudinary qua Backend
   * Key 'file' trùng khớp với @RequestParam("file") ở Backend
   */
  async uploadMedia(file: any): Promise<string> {
    const formData = new FormData();

    // Chuẩn hóa đường dẫn tập tin cho Android và iOS
    const fileUri =
      Platform.OS === 'android' ? file.uri : file.uri.replace('file://', '');

    formData.append('file', {
      uri: fileUri,
      type: file.type || 'image/jpeg', // Chấp nhận jpeg, png, mp4, mpeg
      name: file.fileName || `upload_${Date.now()}.jpg`,
    } as any);

    const response = await axiosInstance.post('/api/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      transformRequest: (data: any) => data, // Prevent axios from serializing FormData
    });

    // Backend trả về chuỗi URL secure_url trực tiếp
    return response.data;
  }

  /** * Giai đoạn 2: Tạo bài viết mới với nội dung và danh sách URL ảnh/video
   *
   */
  async createPost(data: {
    content: string;
    mediaUrls: string[];
    heart: number;
  }): Promise<Post> {
    // Gửi dữ liệu dưới dạng JSON body kèm heart mặc định là 0
    const response = await axiosInstance.post('/api/public/posts', data);
    return response.data.data;
  }
  async updatePost(id: number, data: any): Promise<Post> {
    // Gửi PUT với body JSON
    const response = await axiosInstance.put(`/api/public/posts/${id}`, data);
    return response.data.data;
  }

  async deletePost(id: number): Promise<void> {
    // Gửi DELETE tới ID cụ thể
    await axiosInstance.delete(`/api/public/posts/${id}`);
  }
}
