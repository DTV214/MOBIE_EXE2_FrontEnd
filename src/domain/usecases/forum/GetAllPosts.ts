// src/domain/usecases/forum/GetAllPosts.ts
import { PostPage } from '../../entities/Post';
import { IForumRepository } from '../../repositories/forum/IForumRepository';

export class GetAllPosts {
  constructor(private forumRepository: IForumRepository) {}

  async execute(params: {
    page: number;
    size: number;
    search?: string;
    userId?: number;
  }): Promise<PostPage> {
    // Logic nghiệp vụ: Chỉ lấy các bài viết chưa bị xóa
    return await this.forumRepository.getAllPosts({
      ...params,
      isDeleted: false,
    });
  }
}
