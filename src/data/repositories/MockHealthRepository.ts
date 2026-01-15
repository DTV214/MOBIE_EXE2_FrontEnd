// src/data/repositories/MockHealthRepository.ts
import { IHealthRepository } from '../../domain/repositories/IHealthRepository';
import {
  DailyProgress,
  HealthMetric,
} from '../../domain/entities/HealthMetric';
import {
  HealthInsight,
  HealthRecommendation,
  HealthTip,
} from '../../domain/entities/HealthInsight';
import { HeartRateTrend, HeartRateDataPoint } from '../../domain/entities/HeartRateData';
import { HealthSummary, HealthCategoryInsight } from '../../domain/entities/HealthSummary';

export class MockHealthRepository implements IHealthRepository {
  async getDailyProgress(date: string): Promise<DailyProgress> {
    await new Promise<void>(resolve => setTimeout(resolve, 500));
    
    return {
      date,
      steps: {
        id: '1',
        type: 'steps',
        value: 8247,
        unit: 'bước',
        target: 10000,
        date,
        percentage: 82,
      },
      calories: {
        id: '2',
        type: 'calories',
        value: 1847,
        unit: 'calo',
        target: 2200,
        date,
        percentage: 84,
      },
      sleep: {
        id: '3',
        type: 'sleep',
        value: 7.5,
        unit: 'giờ',
        target: 8,
        date,
        percentage: 94,
      },
      heartRate: {
        id: '4',
        type: 'heartRate',
        value: 72,
        unit: 'bpm',
        date,
      },
      overallPercentage: 82,
    };
  }

  async getTodayProgress(): Promise<DailyProgress> {
    const today = new Date().toISOString().split('T')[0];
    return this.getDailyProgress(today);
  }

  async getHealthMetrics(
    type: string,
    startDate: string,
    endDate: string,
  ): Promise<HealthMetric[]> {
    await new Promise<void>(resolve => setTimeout(resolve, 500));
    
    // Mock data for the last 7 days
    const metrics: HealthMetric[] = [];
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      let value = 0;
      
      if (type === 'steps') {
        value = Math.floor(Math.random() * 3000) + 6000;
      } else if (type === 'calories') {
        value = Math.floor(Math.random() * 500) + 1500;
      } else if (type === 'sleep') {
        value = Math.random() * 2 + 6.5;
      }
      
      metrics.push({
        id: `${type}-${dateStr}`,
        type: type as any,
        value,
        unit: type === 'sleep' ? 'giờ' : type === 'calories' ? 'calo' : 'bước',
        date: dateStr,
      });
    }
    
    return metrics;
  }

  async getHealthInsights(date?: string): Promise<HealthInsight[]> {
    await new Promise<void>(resolve => setTimeout(resolve, 300));
    
    return [
      {
        id: '1',
        type: 'ai_tip',
        title: 'AI Health Tip',
        description:
          'Bạn đã đạt được 80% mục tiêu sức khỏe hàng ngày rồi — thật tuyệt vời! Hãy tiếp tục uống đủ nước và đi bộ ngắn nhé.',
        icon: 'leaf',
        color: '#7FB069',
        date: date || new Date().toISOString(),
      },
    ];
  }

  async getHealthTips(limit: number = 5): Promise<HealthTip[]> {
    await new Promise<void>(resolve => setTimeout(resolve, 300));
    
    return [
      {
        id: '1',
        title: '5 ý tưởng bữa sáng kiểu Việt Nam',
        category: 'nutrition',
        description: 'Khám phá các món ăn sáng truyền thống Việt Nam giàu dinh dưỡng',
        readTime: '5 phút đọc',
        calories: 'Dưới 400 calo',
        icon: 'bowl',
        tags: ['ăn uống', 'sáng'],
      },
      {
        id: '2',
        title: 'Làm thế nào để cải thiện chất lượng giấc ngủ',
        category: 'sleep',
        description: 'Phương pháp tự nhiên để có giấc ngủ ngon hơn',
        readTime: '3 phút đọc',
        icon: 'bed',
        tags: ['ngủ', 'sức khỏe'],
      },
      {
        id: '3',
        title: '10 bài tập yoga buổi sáng',
        category: 'exercise',
        description: 'Bắt đầu ngày mới với năng lượng tích cực',
        readTime: '7 phút đọc',
        icon: 'activity',
        tags: ['yoga', 'tập luyện'],
      },
    ].slice(0, limit);
  }

  async getRecommendations(date?: string): Promise<HealthRecommendation[]> {
    await new Promise<void>(resolve => setTimeout(resolve, 300));
    
    return [
      {
        id: '1',
        type: 'sleep',
        title: 'Ngủ sớm hơn 30 phút',
        description: 'Phục hồi tốt hơn cho ngày mai',
        icon: 'moon',
        emoji: '😴',
      },
      {
        id: '2',
        type: 'nutrition',
        title: 'Giảm lượng muối hôm nay',
        description: 'Tỉ lệ muối đang hơn 20% so với mục tiêu',
        icon: 'salt',
        emoji: '🧂',
      },
      {
        id: '3',
        type: 'nutrition',
        title: 'Thêm 1 số món rau củ quả',
        description: 'Bổ sung vitamin',
        icon: 'apple',
        emoji: '🍎',
      },
    ];
  }

  async getHeartRateTrend(
    period: '7days' | '30days' | '3months',
  ): Promise<HeartRateTrend> {
    await new Promise<void>(resolve => setTimeout(resolve, 500));
    
    const days = period === '7days' ? 7 : period === '30days' ? 30 : 90;
    const dataPoints: HeartRateDataPoint[] = [];
    const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    
    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() - (days - i - 1));
      const dateStr = date.toISOString().split('T')[0];
      
      // Generate realistic heart rate data (60-100 BPM)
      const value = Math.floor(Math.random() * 20) + 70;
      
      dataPoints.push({
        date: dateStr,
        value,
        time: `${Math.floor(Math.random() * 12) + 8}:00`,
      });
    }
    
    const values = dataPoints.map(p => p.value);
    const average = Math.round(
      values.reduce((a, b) => a + b, 0) / values.length,
    );
    const maximum = Math.max(...values);
    const minimum = Math.min(...values);
    
    return {
      period,
      dataPoints: period === '7days' ? dataPoints : dataPoints.slice(-7), // Show last 7 for display
      statistics: {
        average,
        maximum,
        minimum,
        period,
      },
      normalRange: {
        min: 60,
        max: 100,
      },
      isWithinNormalRange: average >= 60 && average <= 100,
      aiInsight:
        'Nhịp tim trung bình của bạn nằm trong phạm vi bình thường. Nhịp tim khi nghỉ ngơi của bạn cho thấy sức khỏe tim mạch tốt với nhịp điệu ổn định.',
      weeklySummary: {
        activeDays: 5,
        averageHoursPerDay: '2h 15m',
      },
    };
  }

  async getHealthSummary(date: string): Promise<HealthSummary> {
    await new Promise<void>(resolve => setTimeout(resolve, 500));
    
    const dailyProgress = await this.getDailyProgress(date);
    const recommendations = await this.getRecommendations(date);
    
    const insights: HealthCategoryInsight[] = [
      {
        category: 'nutrition',
        title: 'Dinh dưỡng',
        subtitle: 'Tóm tắt bữa ăn',
        status: 'good',
        icon: 'carrot',
        emoji: '👍',
        metrics: [
          { label: 'Calo', value: '1,847 Calo' },
          { label: 'Protein', value: '45g Protein' },
          { label: 'Khẩu phần', value: '8 Khẩu phần ăn' },
        ],
      },
      {
        category: 'activity',
        title: 'Hoạt động',
        subtitle: 'Bước chân và calories',
        status: 'good',
        icon: 'running',
        emoji: '🔥',
        metrics: [
          { label: 'Bước', value: '8,432 Bước' },
          { label: 'Calo đốt', value: '387 Kcal đã đốt' },
          { label: 'Thời gian', value: '42 Thời gian hoạt động' },
        ],
      },
      {
        category: 'rest',
        title: 'Nghỉ ngơi',
        subtitle: 'Ngủ & hồi phục',
        status: 'okay',
        icon: 'bed',
        emoji: '😐',
        metrics: [
          { label: 'Thời gian ngủ', value: '6h 23m Thời gian ngủ' },
          { label: 'Chất lượng', value: '73% Chất lượng' },
          { label: 'Hồi phục', value: '85% Hồi phục' },
        ],
      },
    ];
    
    return {
      date,
      dailyProgress,
      recommendations,
      insights,
      overallMessage: 'Bạn đang rất tuyệt!',
    };
  }
}
