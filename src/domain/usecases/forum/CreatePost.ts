// src/domain/usecases/forum/CreatePost.ts
import { Post } from '../../entities/Post';
import { IForumRepository } from '../../repositories/forum/IForumRepository';

export class CreatePost {
  constructor(private forumRepository: IForumRepository) {}

  async execute(content: string, mediaUrls: string[]): Promise<Post> {
    // Ép buộc quy tắc nghiệp vụ: heart luôn bằng 0 khi tạo mới
    return await this.forumRepository.createPost({
      content,
      mediaUrls,
      heart: 0,
    });
  }
}
