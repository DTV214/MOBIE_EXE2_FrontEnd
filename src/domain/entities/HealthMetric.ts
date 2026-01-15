// src/domain/entities/HealthMetric.ts
export interface HealthMetric {
  id: string;
  type: 'steps' | 'calories' | 'sleep' | 'heartRate' | 'water';
  value: number;
  unit: string;
  target?: number;
  date: string; // ISO date string
  percentage?: number; // Percentage of target achieved
}

export interface DailyProgress {
  date: string;
  steps: HealthMetric;
  calories: HealthMetric;
  sleep: HealthMetric;
  heartRate?: HealthMetric;
  water?: HealthMetric;
  overallPercentage: number; // Overall daily goal completion percentage
}
