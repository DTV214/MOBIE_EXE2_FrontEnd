// src/domain/entities/HealthSummary.ts
import { HealthInsight, HealthRecommendation } from './HealthInsight';
import { DailyProgress } from './HealthMetric';

export interface HealthCategoryInsight {
  category: 'nutrition' | 'activity' | 'rest';
  title: string;
  subtitle: string;
  status: 'good' | 'okay' | 'needs_improvement';
  icon: string;
  emoji?: string;
  metrics: {
    label: string;
    value: string;
  }[];
}

export interface HealthSummary {
  date: string;
  dailyProgress: DailyProgress;
  recommendations: HealthRecommendation[];
  insights: HealthCategoryInsight[];
  overallMessage?: string;
}
