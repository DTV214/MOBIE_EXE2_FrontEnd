// src/domain/usecases/GetChatSession.ts
import { IChatRepository } from '../repositories/IChatRepository';
import { ChatSession } from '../entities/Chat';

export class GetChatSession {
  constructor(private chatRepository: IChatRepository) {}

  async execute(): Promise<ChatSession> {
    return await this.chatRepository.getCurrentSession();
  }
}
