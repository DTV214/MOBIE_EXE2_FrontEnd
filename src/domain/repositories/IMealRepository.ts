// src/domain/repositories/IMealRepository.ts
import { Food, MealItem, DailyMeal } from '../entities/Food';

export interface IMealRepository {
  // Food data
  getAllFoods(): Promise<Food[]>;
  searchFoods(query: string): Promise<Food[]>;
  getFoodById(id: string): Promise<Food | null>;
  getFoodsByCategory(category: string): Promise<Food[]>;
  getFoodsByTag(tag: string): Promise<Food[]>;
  
  // Meal tracking
  getDailyMeal(date: string): Promise<DailyMeal>;
  addMealItem(mealItem: MealItem): Promise<void>;
  removeMealItem(mealItemId: string): Promise<void>;
  updateMealItem(mealItemId: string, quantity: number): Promise<void>;
  
  // Statistics
  getMealStreak(): Promise<number>;
  getWeeklyCalories(startDate: string, endDate: string): Promise<number>;
}
