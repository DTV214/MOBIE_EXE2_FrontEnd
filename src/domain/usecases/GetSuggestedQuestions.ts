// src/domain/usecases/GetSuggestedQuestions.ts
import { IChatRepository } from '../repositories/IChatRepository';
import { SuggestedQuestion } from '../entities/Chat';

export class GetSuggestedQuestions {
  constructor(private chatRepository: IChatRepository) {}

  async execute(): Promise<SuggestedQuestion[]> {
    return await this.chatRepository.getSuggestedQuestions();
  }
}
