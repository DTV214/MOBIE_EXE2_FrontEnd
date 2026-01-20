// src/domain/usecases/CreatePost.ts
import { IForumRepository } from '../repositories/IForumRepository';
import { Post } from '../entities/Post';

export class CreatePost {
  constructor(private forumRepository: IForumRepository) {}

  async execute(
    postData: Omit<Post, 'id' | 'createdAt' | 'likes' | 'comments' | 'shares' | 'isLiked' | 'isSaved'>,
  ): Promise<Post> {
    return await this.forumRepository.createPost(postData);
  }
}
