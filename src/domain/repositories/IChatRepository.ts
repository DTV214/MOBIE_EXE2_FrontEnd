// src/domain/repositories/IChatRepository.ts
import { ChatMessage, ChatSession, SuggestedQuestion } from '../entities/Chat';

export interface IChatRepository {
  // Chat sessions
  getCurrentSession(): Promise<ChatSession>;
  createSession(): Promise<ChatSession>;
  clearSession(): Promise<void>;
  
  // Messages
  sendMessage(content: string): Promise<ChatMessage>; // Returns AI response
  getMessages(sessionId: string): Promise<ChatMessage[]>;
  
  // Suggested questions
  getSuggestedQuestions(): Promise<SuggestedQuestion[]>;
}
