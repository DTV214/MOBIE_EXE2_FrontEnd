// src/domain/entities/Food.ts
export interface Nutrition {
  calories: number;
  protein: number; // grams
  carbs: number; // grams
  fat: number; // grams
  fiber?: number; // grams
  sugar?: number; // grams
  sodium?: number; // mg
  calcium?: number; // mg
  iron?: number; // mg
  vitaminC?: number; // mg
}

export interface Food {
  id: string;
  name: string;
  nameVietnamese: string;
  category: 'main' | 'appetizer' | 'dessert' | 'drink' | 'snack';
  description?: string;
  imageUrl?: string;
  nutrition: Nutrition;
  tags?: string[]; // e.g., ['low-calorie', 'high-protein', 'vegetarian']
  healthySubstitutions?: string[]; // IDs of healthier alternative foods
  aiTip?: string;
}

export interface MealItem {
  id: string;
  food: Food;
  quantity: number; // default 1
  mealTime: 'breakfast' | 'lunch' | 'dinner';
  date: string; // ISO date string
}

export interface DailyMeal {
  date: string;
  breakfast: MealItem[];
  lunch: MealItem[];
  dinner: MealItem[];
  dailyGoal: number; // calories goal for the day
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  remainingCalories: number;
  streak?: number; // days streak
}
