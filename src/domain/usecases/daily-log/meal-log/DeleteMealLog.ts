import { IMealLogRepository } from "../../../repositories/daily-log/IMealLogRepository";

export class DeleteMealLogUseCase {
  constructor(private mealLogRepository: IMealLogRepository) {}
  async execute(id: number): Promise<void> {
    return await this.mealLogRepository.deleteMealLog(id);
  }
}