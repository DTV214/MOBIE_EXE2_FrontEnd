// src/domain/usecases/GetSuggestedTopics.ts
import { IForumRepository } from '../repositories/IForumRepository';
import { Topic } from '../entities/Post';

export class GetSuggestedTopics {
  constructor(private forumRepository: IForumRepository) {}

  async execute(): Promise<Topic[]> {
    return await this.forumRepository.getSuggestedTopics();
  }
}
