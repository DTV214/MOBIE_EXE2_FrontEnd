import { DailyLog } from '../../entities/DailyLog';

export interface IDailyLogRepository {
  getLogByDate(date: string): Promise<DailyLog | null>;
  createLog(date: string): Promise<DailyLog>;
  updateSteps(logId: number, steps: number): Promise<DailyLog>;
  deleteLog(logId: number): Promise<void>;
}
