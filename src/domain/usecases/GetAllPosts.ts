// src/domain/usecases/GetAllPosts.ts
import { IForumRepository } from '../repositories/IForumRepository';
import { Post } from '../entities/Post';

export class GetAllPosts {
  constructor(private forumRepository: IForumRepository) {}

  async execute(limit?: number, offset?: number): Promise<Post[]> {
    return await this.forumRepository.getAllPosts(limit, offset);
  }
}
