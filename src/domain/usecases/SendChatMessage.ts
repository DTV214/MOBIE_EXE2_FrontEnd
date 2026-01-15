// src/domain/usecases/SendChatMessage.ts
import { IChatRepository } from '../repositories/IChatRepository';
import { ChatMessage } from '../entities/Chat';

export class SendChatMessage {
  constructor(private chatRepository: IChatRepository) {}

  async execute(content: string): Promise<ChatMessage> {
    return await this.chatRepository.sendMessage(content);
  }
}
