// src/domain/usecases/GetPostById.ts
import { IForumRepository } from '../repositories/IForumRepository';
import { Post } from '../entities/Post';

export class GetPostById {
  constructor(private forumRepository: IForumRepository) {}

  async execute(id: string): Promise<Post | null> {
    return await this.forumRepository.getPostById(id);
  }
}
