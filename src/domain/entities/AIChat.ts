// src/domain/entities/AIChat.ts

// AI API Request
export interface AIPromptRequest {
  message: string;
  isSpeech: boolean;
}

// AI API Response
export interface AIPromptResponse {
  message: string;
  audioBase64?: string; // Present when isSpeech=true
}

// Enhanced ChatMessage for AI features
export interface AIChatMessage {
  id: string;
  content: string;
  sender: 'user' | 'ai';
  timestamp: string;
  isLoading?: boolean;
  hasAudio?: boolean;
  audioBase64?: string;
}

// Simple AI session (no conversation management)
export interface AISession {
  id: string;
  messages: AIChatMessage[];
  createdAt: string;
  updatedAt: string;
}

// Speech-to-text features
export interface SpeechConfig {
  enabled: boolean;
  autoPlay: boolean;
  language: 'vi' | 'en';
}