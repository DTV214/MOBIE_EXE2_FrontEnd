// src/domain/entities/HeartRateData.ts
export interface HeartRateDataPoint {
  date: string; // ISO date string
  value: number; // BPM
  time?: string; // Time of day
}

export interface HeartRateStatistics {
  average: number; // AVG BPM
  maximum: number; // MAX BPM
  minimum: number; // MIN BPM
  period: '7days' | '30days' | '3months';
}

export interface HeartRateTrend {
  period: '7days' | '30days' | '3months';
  dataPoints: HeartRateDataPoint[];
  statistics: HeartRateStatistics;
  normalRange: {
    min: number;
    max: number;
  };
  isWithinNormalRange: boolean;
  aiInsight?: string;
  weeklySummary?: {
    activeDays: number;
    averageHoursPerDay: string;
  };
}
