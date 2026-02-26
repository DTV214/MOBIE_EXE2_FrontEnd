// src/domain/usecases/forum/UpdatePost.ts
import { Post } from '../../entities/Post';
import { IForumRepository } from '../../repositories/forum/IForumRepository';

export class UpdatePost {
  constructor(private forumRepository: IForumRepository) {}

  async execute(
    id: number,
    data: {
      content: string;
      mediaUrls: string[];
      accountId: number;
      heart: number;
    },
  ): Promise<Post> {
    // Logic nghiệp vụ: Có thể thêm kiểm tra quyền sở hữu tại đây trước khi gọi Repository
    return await this.forumRepository.updatePost(id, data);
  }
}
