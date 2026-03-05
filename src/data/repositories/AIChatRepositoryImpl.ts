// src/data/repositories/AIChatRepositoryImpl.ts
import { IChatRepository } from '../../domain/repositories/IChatRepository';
import { ChatMessage, SuggestedQuestion } from '../../domain/entities/Chat';
import { AIChatMessage, AISession } from '../../domain/entities/AIChat';
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
      console.log('🔐 Auth data check:', {
        hasAuthData: !!authData,
        hasToken: !!authData?.accessToken,
        tokenPreview: authData?.accessToken?.substring(0, 20) + '...' || 'No token'
      });

      if (!authData?.accessToken) {
        console.error('❌ No access token found - user needs to login');
        throw new Error('Vui lòng đăng nhập để sử dụng AI chat');
      }

      // Set authorization header
      aiApiClient.defaults.headers.Authorization = `Bearer ${authData.accessToken}`;
      console.log('🔐 Set Authorization header for AI request');

      // Prepare API request format that server expects
      const request = {
        message: message.trim(),
        isSpeech: isSpeech
      };

      console.log('🤖 Sending AI request to /api/public/ai/prompt:', { message: message.trim(), isSpeech });

      // Call AI API
      const response = await aiApiClient.post<{ message: string, audioBase64?: string }>(
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
        contentLength: aiMessage.content.length,
        hasAudio: aiMessage.hasAudio,
        audioSize: aiMessage.audioBase64?.length || 0
      });

      return aiMessage;

    } catch (error: any) {
      console.error('❌ AI API Error:', error);

      if (error.response) {
        console.error('❌ Server Response:', {
          status: error.response.status,
          statusText: error.response.statusText,
          data: error.response.data,
          url: error.config?.url
        });

        if (error.response.status === 401) {
          throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        } else if (error.response.status === 403) {
          const serverMsg = error.response.data?.message || '';
          if (serverMsg.toLowerCase().includes('quota') || serverMsg.toLowerCase().includes('limit') || serverMsg.toLowerCase().includes('hết lượt')) {
            throw new Error('QUOTA_EXCEEDED::Bạn đã hết lượt chat AI hôm nay. Nâng cấp gói để có thêm lượt chat nhé! 🚀');
          }
          throw new Error('QUOTA_EXCEEDED::Bạn chưa có quyền sử dụng tính năng này. Hãy nâng cấp gói để trải nghiệm AI Chat! 🚀');
        } else if (error.response.status === 500) {
          throw new Error('Server gặp lỗi nội bộ. API endpoint có thể không đúng hoặc server chưa sẵn sàng.');
        } else if (error.response.status === 404) {
          throw new Error('API endpoint không tồn tại. Vui lòng kiểm tra cấu hình.');
        }

        throw new Error(`Lỗi server (${error.response.status}): ${error.response.data?.message || error.response.statusText}`);
      } else if (error.request) {
        console.error('❌ Network Error:', error.request);
        throw new Error('Không thể kết nối tới server. Vui lòng kiểm tra mạng.');
      } else {
        console.error('❌ Request Setup Error:', error.message);
        throw new Error('Lỗi cấu hình request: ' + error.message);
      }
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