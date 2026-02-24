// src/domain/repositories/IChatRepository.ts
import { ChatMessage, ChatSession, SuggestedQuestion } from '../entities/Chat';
import { AIChatMessage, AISession } from '../entities/AIChat';

export interface IChatRepository {
  // AI Chat - New simplified methods
  sendAIMessage(message: string, isSpeech?: boolean): Promise<AIChatMessage>; // Returns AI response
  
  // Session management (simplified - no backend conversations)
  getCurrentSession(): Promise<AISession>;
  createNewSession(): Promise<AISession>;
  clearCurrentSession(): Promise<void>;
  
  // Legacy methods (keep for backward compatibility)
  sendMessage(content: string): Promise<ChatMessage>; // Returns AI response
  getMessages(sessionId: string): Promise<ChatMessage[]>;
  
  // Suggested questions
  getSuggestedQuestions(): Promise<SuggestedQuestion[]>;
}
