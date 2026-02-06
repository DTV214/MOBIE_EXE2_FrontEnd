// src/domain/usecases/forum/GetPostById.ts

import { Post } from '../../entities/Post';
import { IForumRepository } from '../../repositories/forum/IForumRepository';

export class GetPostById {
  constructor(private forumRepository: IForumRepository) {}

  /**
   * Thực thi việc lấy chi tiết bài viết qua ID.
   * @param id Mã định danh của bài viết (integer)
   * @returns Trả về một Entity Post hoàn chỉnh
   */
  async execute(id: number): Promise<Post> {
    // Gọi Repository để lấy dữ liệu từ API GET /api/public/posts/{id}
    return await this.forumRepository.getPostById(id);
  }
}
