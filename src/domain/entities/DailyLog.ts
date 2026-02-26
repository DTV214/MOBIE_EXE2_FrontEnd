import { MealItem } from './Food';

export interface DailyLog {
  id: number;
  loggedDate: string; // Sử dụng loggedDate thay vì date
  accountId: number;

  totalCaloriesIn: number;
  totalCaloriesOut: number;
  targetCalories: number;
  remainingCalories: number;

  totalProtein: number;
  totalCarbs: number;
  totalFat: number;

  steps: number;

  // Phân loại bữa ăn
  meals: {
    breakfast: MealItem[];
    lunch: MealItem[];
    dinner: MealItem[];
    snacks: MealItem[];
  };
}
