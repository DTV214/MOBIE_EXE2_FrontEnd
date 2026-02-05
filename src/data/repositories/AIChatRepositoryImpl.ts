// src/data/repositories/AIChatRepositoryImpl.ts
import { IChatRepository } from '../../domain/repositories/IChatRepository';
import { ChatMessage, SuggestedQuestion } from '../../domain/entities/Chat';
import { AIChatMessage, AISession, AIPromptRequest, AIPromptResponse } from '../../domain/entities/AIChat';
import aiApiClient from '../apis/aiApiClient';
import { StorageRepository } from './StorageRepository';

export class AIChatRepositoryImpl implements IChatRepository {
  private storageRepository: StorageRepository;
  private currentSession: AISession | null = null;

  constructor() {
    this.storageRepository = new StorageRepository();
  }

  // Main AI chat method - calls real API
  async sendAIMessage(message: string, isSpeech: boolean = false): Promise<AIChatMessage> {
    try {
      // Get access token for authentication
      const authData = await this.storageRepository.getAuthData();
      if (!authData?.accessToken) {
        throw new Error('Authentication required');
      }

      // Set authorization header
      aiApiClient.defaults.headers.Authorization = `Bearer ${authData.accessToken}`;

      // Prepare API request
      const request: AIPromptRequest = {
        message: message.trim(),
        isSpeech: isSpeech,
      };

      console.log('🤖 Sending AI request:', { message: request.message, isSpeech: request.isSpeech });

      // Call AI API
      const response = await aiApiClient.post<AIPromptResponse>(
        '/api/public/ai/prompt',
        request
      );

      // Create AI message from response
      const aiMessage: AIChatMessage = {
        id: `ai_${Date.now()}`,
        content: response.data.message,
        sender: 'ai',
        timestamp: new Date().toISOString(),
        hasAudio: !!response.data.audioBase64,
        audioBase64: response.data.audioBase64,
      };

      // Add to current session
      if (this.currentSession) {
        this.currentSession.messages.push(aiMessage);
        this.currentSession.updatedAt = new Date().toISOString();
        await this.saveCurrentSession();
      }

      console.log('✅ AI response received:', { 
        hasMessage: !!aiMessage.content, 
        hasAudio: !!aiMessage.audioBase64 
      });

      return aiMessage;

    } catch (error: any) {
      console.error('❌ AI API Error:', error);
      
      // Handle specific errors
      if (error.response?.status === 401) {
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      }
      
      throw new Error(error.response?.data?.message || 'Không thể kết nối với AI. Vui lòng thử lại.');
    }
  }

  // Session management (local storage based)
  async getCurrentSession(): Promise<AISession> {
    if (this.currentSession) {
      return this.currentSession;
    }

    // Try to load from storage
    try {
      const savedSession = await this.storageRepository.get<AISession>('current_ai_session');
      if (savedSession) {
        this.currentSession = savedSession;
        return savedSession;
      }
    } catch {
      console.log('No saved session found, creating new one');
    }

    // Create new session
    return this.createNewSession();
  }

  async createNewSession(): Promise<AISession> {
    const session: AISession = {
      id: `session_${Date.now()}`,
      messages: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.currentSession = session;
    await this.saveCurrentSession();
    
    console.log('🆕 Created new AI session:', session.id);
    return session;
  }

  async clearCurrentSession(): Promise<void> {
    this.currentSession = null;
    await this.storageRepository.remove('current_ai_session');
    console.log('🗑️ Cleared current AI session');
  }

  private async saveCurrentSession(): Promise<void> {
    if (this.currentSession) {
      await this.storageRepository.set('current_ai_session', this.currentSession);
    }
  }

  // Add user message to session (local only)
  async addUserMessage(content: string): Promise<AIChatMessage> {
    const userMessage: AIChatMessage = {
      id: `user_${Date.now()}`,
      content: content.trim(),
      sender: 'user',
      timestamp: new Date().toISOString(),
    };

    // Add to current session
    const session = await this.getCurrentSession();
    session.messages.push(userMessage);
    session.updatedAt = new Date().toISOString();
    await this.saveCurrentSession();

    return userMessage;
  }

  // Legacy methods for backward compatibility
  async sendMessage(content: string): Promise<ChatMessage> {
    const aiMessage = await this.sendAIMessage(content, false);
    return {
      id: aiMessage.id,
      content: aiMessage.content,
      sender: aiMessage.sender,
      timestamp: aiMessage.timestamp,
    };
  }

  async getMessages(_sessionId: string): Promise<ChatMessage[]> {
    const session = await this.getCurrentSession();
    return session.messages.map(msg => ({
      id: msg.id,
      content: msg.content,
      sender: msg.sender,
      timestamp: msg.timestamp,
    }));
  }

  async getSuggestedQuestions(): Promise<SuggestedQuestion[]> {
    // Return static suggested questions for health AI
    return [
      {
        id: '1',
        text: 'Tôi nên ăn gì để tăng cường sức khỏe?',
        category: 'nutrition',
      },
      {
        id: '2', 
        text: 'Làm thế nào để cải thiện giấc ngủ?',
        category: 'health',
      },
      {
        id: '3',
        text: 'Bài tập nào phù hợp cho người mới bắt đầu?',
        category: 'exercise',
      },
      {
        id: '4',
        text: 'Cách giảm stress hiệu quả?',
        category: 'health',
      },
      {
        id: '5',
        text: 'Thực phẩm nào giúp tăng cường miễn dịch?',
        category: 'nutrition',
      },
    ];
  }
}