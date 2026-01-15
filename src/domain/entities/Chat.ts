// src/domain/entities/Chat.ts
export interface ChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string; // ISO date string
  isLoading?: boolean; // For typing indicator
}

export interface ChatSession {
  id: string;
  messages: ChatMessage[];
  createdAt: string;
  updatedAt: string;
}

export interface SuggestedQuestion {
  id: string;
  text: string;
  category?: 'nutrition' | 'health' | 'exercise' | 'general';
}
