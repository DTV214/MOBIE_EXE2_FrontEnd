import {  MealType } from "../../../entities/MealLog";
import { IMealLogRepository } from "../../../repositories/daily-log/IMealLogRepository";


export class UpdateMealLogUseCase {
  constructor(private mealLogRepository: IMealLogRepository) {}
  async execute(id: number, mealType: MealType, loggedTime: string, notes?: string) {
    return await this.mealLogRepository.updateMealLog(id, mealType, loggedTime, notes);
  }
}