// src/domain/usecases/forum/GetMyPosts.ts

import { Post } from '../../entities/Post';
import { IForumRepository } from '../../repositories/forum/IForumRepository';

/**
 * Use Case: GetMyPosts
 * Đảm nhận nhiệm vụ lấy danh sách bài viết do chính tài khoản hiện tại đăng tải.
 */
export class GetMyPosts {
  constructor(private forumRepository: IForumRepository) {}

  /**
   * Thực thi việc lấy bài viết cá nhân.
   * Không cần truyền tham số vì Backend xác thực qua Authorization Header.
   * * @returns Promise<Post[]> Danh sách các bài viết của người dùng.
   */
  async execute(): Promise<Post[]> {
    // Gọi phương thức getMyPosts từ Repository để kết nối API /api/public/posts/account
    return await this.forumRepository.getMyPosts();
  }
}
