import { Post, PostPage } from "../../entities/Post";


export interface IForumRepository {
  /** Lấy danh sách bài viết kèm filters */
  getAllPosts(params: {
    page: number;
    size: number;
    search?: string;
    userId?: number;
    isDeleted?: boolean;
  }): Promise<PostPage>;

  /** * Lấy chi tiết một bài viết qua ID
   * Endpoint: GET /api/public/posts/{id}
   */
  getPostById(id: number): Promise<Post>;
  /** * Cập nhật bài viết hiện có
   * Endpoint: PUT /api/public/posts/{id}
   */
  getMyPosts(): Promise<Post[]>;
  updatePost(
    id: number,
    data: {
      content: string;
      mediaUrls: string[];
      accountId: number;
      heart: number;
    },
  ): Promise<Post>;

  /** * Xóa bài viết
   * Endpoint: DELETE /api/public/posts/{id}
   */
  deletePost(id: number): Promise<void>;

  /** Tải Media lên Cloudinary qua Backend */
  uploadMedia(file: any): Promise<string>;

  /** Tạo bài viết mới */
  createPost(data: {
    content: string;
    mediaUrls: string[];
    heart: number;
  }): Promise<Post>;
}
