// src/domain/repositories/IHealthRepository.ts
import { DailyProgress, HealthMetric } from '../entities/HealthMetric';
import { HealthInsight, HealthRecommendation, HealthTip } from '../entities/HealthInsight';
import { HeartRateTrend } from '../entities/HeartRateData';
import { HealthSummary } from '../entities/HealthSummary';

export interface IHealthRepository {
  // Daily Progress
  getDailyProgress(date: string): Promise<DailyProgress>;
  getTodayProgress(): Promise<DailyProgress>;
  
  // Health Metrics
  getHealthMetrics(
    type: string,
    startDate: string,
    endDate: string,
  ): Promise<HealthMetric[]>;
  
  // Insights & Tips
  getHealthInsights(date?: string): Promise<HealthInsight[]>;
  getHealthTips(limit?: number): Promise<HealthTip[]>;
  getRecommendations(date?: string): Promise<HealthRecommendation[]>;
  
  // Heart Rate
  getHeartRateTrend(period: '7days' | '30days' | '3months'): Promise<HeartRateTrend>;
  
  // Health Summary
  getHealthSummary(date: string): Promise<HealthSummary>;
}
