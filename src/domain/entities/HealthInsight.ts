// src/domain/entities/HealthInsight.ts
export interface HealthInsight {
  id: string;
  type: 'ai_tip' | 'recommendation' | 'achievement';
  title: string;
  description: string;
  icon?: string;
  color?: string;
  priority?: 'high' | 'medium' | 'low';
  date: string;
}

export interface HealthRecommendation {
  id: string;
  type: 'sleep' | 'nutrition' | 'activity' | 'water' | 'general';
  title: string;
  description: string;
  icon: string;
  emoji?: string;
  actionText?: string;
}

export interface HealthTip {
  id: string;
  title: string;
  category: 'nutrition' | 'exercise' | 'sleep' | 'wellness';
  description: string;
  readTime: string; // e.g., "5 phút đọc"
  calories?: string; // e.g., "Dưới 400 calo"
  tags?: string[];
  icon: string;
}
