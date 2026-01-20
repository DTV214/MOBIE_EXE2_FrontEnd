// src/data/repositories/MockChatRepository.ts
import { IChatRepository } from '../../domain/repositories/IChatRepository';
import { ChatMessage, ChatSession, SuggestedQuestion } from '../../domain/entities/Chat';

const SUGGESTED_QUESTIONS: SuggestedQuestion[] = [
  {
    id: '1',
    text: 'Tôi nên ăn gì khi bị đau dạ dày?',
    category: 'nutrition',
  },
  {
    id: '2',
    text: 'Cách tính BMI của tôi',
    category: 'health',
  },
  {
    id: '3',
    text: 'Tôi có đang thiếu ngủ không?',
    category: 'health',
  },
  {
    id: '4',
    text: 'Bài tập nào tốt cho tim mạch?',
    category: 'exercise',
  },
];

// Mock AI responses based on keywords
const getAIResponse = (userMessage: string): string => {
  const lowerMessage = userMessage.toLowerCase();
  
  if (lowerMessage.includes('đau đầu') || lowerMessage.includes('mệt mỏi')) {
    return 'Đau đầu và mệt mỏi có thể do nhiều nguyên nhân:\n• Thiếu ngủ (< 7-8 tiếng/đêm)\n• Căng thẳng, stress\n• Thiếu nước\n• Áp lực công việc\n\nBạn có ngủ đủ giấc không? 💤';
  }
  
  if (lowerMessage.includes('đau dạ dày') || lowerMessage.includes('dạ dày')) {
    return 'Khi bị đau dạ dày, bạn nên:\n• Ăn thức ăn mềm, dễ tiêu (cháo, súp)\n• Tránh đồ cay, chua, nhiều dầu mỡ\n• Uống nước ấm\n• Chia nhỏ bữa ăn\n\nNếu đau kéo dài, hãy gặp bác sĩ nhé! 🏥';
  }
  
  if (lowerMessage.includes('bmi') || lowerMessage.includes('cân nặng')) {
    return 'BMI (Body Mass Index) được tính bằng công thức:\nBMI = Cân nặng (kg) / [Chiều cao (m)]²\n\nPhân loại:\n• < 18.5: Thiếu cân\n• 18.5 - 24.9: Bình thường\n• 25 - 29.9: Thừa cân\n• ≥ 30: Béo phì\n\nBạn có thể chia sẻ chiều cao và cân nặng để tôi tính giúp nhé! 📊';
  }
  
  if (lowerMessage.includes('ngủ') || lowerMessage.includes('thiếu ngủ')) {
    return 'Giấc ngủ rất quan trọng cho sức khỏe! Người lớn nên ngủ 7-9 tiếng mỗi đêm.\n\nDấu hiệu thiếu ngủ:\n• Mệt mỏi ban ngày\n• Khó tập trung\n• Thay đổi tâm trạng\n• Giảm miễn dịch\n\nBạn ngủ bao nhiêu tiếng mỗi đêm? 😴';
  }
  
  if (lowerMessage.includes('tập') || lowerMessage.includes('exercise') || lowerMessage.includes('cardio')) {
    return 'Bài tập tốt cho tim mạch:\n• Đi bộ nhanh (30 phút/ngày)\n• Chạy bộ\n• Đạp xe\n• Bơi lội\n• Nhảy dây\n\nNên tập ít nhất 150 phút/tuần với cường độ vừa phải. Bạn đang tập môn thể thao nào? 💪';
  }
  
  // Default response
  return 'Cảm ơn bạn đã hỏi! Tôi là Lành AI, trợ lý sức khỏe của bạn. Tôi có thể giúp bạn về:\n• Dinh dưỡng và chế độ ăn\n• Tập luyện và vận động\n• Sức khỏe tổng quát\n• Giấc ngủ và nghỉ ngơi\n\nBạn muốn biết thêm điều gì? 😊';
};

export class MockChatRepository implements IChatRepository {
  private currentSession: ChatSession | null = null;
  private messages: ChatMessage[] = [];

  async getCurrentSession(): Promise<ChatSession> {
    if (!this.currentSession) {
      return await this.createSession();
    }
    return this.currentSession;
  }

  async createSession(): Promise<ChatSession> {
    await new Promise<void>(resolve => setTimeout(resolve, 200));
    
    const sessionId = `session-${Date.now()}`;
    const now = new Date().toISOString();
    
    // Initial AI greeting
    const greetingMessage: ChatMessage = {
      id: 'greeting-1',
      content:
        'Xin chào! Tôi là Lành AI, trợ lý sức khỏe của bạn. Hãy hỏi tôi bất cứ điều gì về sức khỏe nhé! 😊',
      sender: 'ai',
      timestamp: now,
    };
    
    this.messages = [greetingMessage];
    
    this.currentSession = {
      id: sessionId,
      messages: this.messages,
      createdAt: now,
      updatedAt: now,
    };
    
    return this.currentSession;
  }

  async clearSession(): Promise<void> {
    await new Promise<void>(resolve => setTimeout(resolve, 200));
    this.currentSession = null;
    this.messages = [];
  }

  async sendMessage(content: string): Promise<ChatMessage> {
    // Add user message
    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-user`,
      content,
      sender: 'user',
      timestamp: new Date().toISOString(),
    };
    
    this.messages.push(userMessage);
    
    // Simulate AI thinking time
    await new Promise<void>(resolve => setTimeout(resolve, 1000));
    
    // Generate AI response
    const aiResponse: ChatMessage = {
      id: `msg-${Date.now()}-ai`,
      content: getAIResponse(content),
      sender: 'ai',
      timestamp: new Date().toISOString(),
    };
    
    this.messages.push(aiResponse);
    
    if (this.currentSession) {
      this.currentSession.messages = this.messages;
      this.currentSession.updatedAt = new Date().toISOString();
    }
    
    return aiResponse;
  }

  async getMessages(sessionId: string): Promise<ChatMessage[]> {
    await new Promise<void>(resolve => setTimeout(resolve, 200));
    return this.messages;
  }

  async getSuggestedQuestions(): Promise<SuggestedQuestion[]> {
    await new Promise<void>(resolve => setTimeout(resolve, 200));
    return SUGGESTED_QUESTIONS;
  }
}
