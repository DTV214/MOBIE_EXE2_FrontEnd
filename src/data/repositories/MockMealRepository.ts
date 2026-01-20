// src/data/repositories/MockMealRepository.ts
import { IMealRepository } from '../../domain/repositories/IMealRepository';
import { Food, MealItem, DailyMeal } from '../../domain/entities/Food';

// Mock data - Vietnamese dishes
const VIETNAMESE_FOODS: Food[] = [
  {
    id: '1',
    name: 'Pho Bo',
    nameVietnamese: 'Phở bò',
    category: 'main',
    description: 'Vietnamese beef noodle soup',
    nutrition: {
      calories: 450,
      protein: 25,
      carbs: 58,
      fat: 12,
      fiber: 2.5,
      sodium: 1200,
      calcium: 80,
      iron: 3.2,
    },
    tags: ['traditional', 'soup'],
    healthySubstitutions: ['2', '5'],
    aiTip: 'Try reducing rice noodles portion for better balance',
  },
  {
    id: '2',
    name: 'Com Tam Suon Bi Cha',
    nameVietnamese: 'Cơm tấm sườn bì chả',
    category: 'main',
    description: 'Vietnamese broken rice with grilled pork, shredded pork skin, and steamed egg meatloaf',
    nutrition: {
      calories: 680,
      protein: 35,
      carbs: 72,
      fat: 28,
      fiber: 3.2,
      sodium: 890,
      calcium: 125,
      iron: 2.8,
      vitaminC: 15,
    },
    tags: ['traditional', 'rice'],
    healthySubstitutions: ['3', '4'],
    aiTip: 'Try reducing rice portion for better balance',
  },
  {
    id: '3',
    name: 'Bun Thit Nuong',
    nameVietnamese: 'Bún thịt nướng',
    category: 'main',
    description: 'Grilled pork with vermicelli noodles',
    nutrition: {
      calories: 480,
      protein: 28,
      carbs: 55,
      fat: 15,
      fiber: 2.8,
      sodium: 750,
    },
    tags: ['low-calorie', 'high-protein'],
  },
  {
    id: '4',
    name: 'Com Ga Luoc',
    nameVietnamese: 'Cơm gà luộc',
    category: 'main',
    description: 'Boiled chicken rice',
    nutrition: {
      calories: 500,
      protein: 32,
      carbs: 58,
      fat: 12,
      fiber: 2.2,
      sodium: 680,
    },
    tags: ['low-calorie', 'high-protein'],
  },
  {
    id: '5',
    name: 'Bun Bo Hue',
    nameVietnamese: 'Bún bò Huế',
    category: 'main',
    description: 'Hue style beef noodle soup',
    nutrition: {
      calories: 447,
      protein: 22,
      carbs: 52,
      fat: 14,
      fiber: 2.1,
      sodium: 1100,
    },
    tags: ['traditional', 'soup'],
  },
  {
    id: '6',
    name: 'Hu Tieu',
    nameVietnamese: 'Hủ tiếu',
    category: 'main',
    description: 'Vietnamese clear noodle soup',
    nutrition: {
      calories: 380,
      protein: 18,
      carbs: 65,
      fat: 8,
      fiber: 1.8,
      sodium: 950,
    },
    tags: ['low-calorie'],
  },
  {
    id: '7',
    name: 'Goi Cuon',
    nameVietnamese: 'Gỏi cuốn',
    category: 'appetizer',
    description: 'Vietnamese spring rolls',
    nutrition: {
      calories: 120,
      protein: 8,
      carbs: 18,
      fat: 2,
      fiber: 1.5,
      sodium: 320,
    },
    tags: ['low-calorie', 'vegetarian'],
  },
  {
    id: '8',
    name: 'Banh Mi Thit Nuong',
    nameVietnamese: 'Bánh mì thịt nướng',
    category: 'main',
    description: 'Grilled pork baguette',
    nutrition: {
      calories: 520,
      protein: 22,
      carbs: 62,
      fat: 18,
      fiber: 3.5,
      sodium: 850,
    },
    tags: ['traditional'],
  },
  {
    id: '9',
    name: 'Ca Phe Sua Da',
    nameVietnamese: 'Cà phê sữa đá',
    category: 'drink',
    description: 'Iced milk coffee',
    nutrition: {
      calories: 120,
      protein: 3,
      carbs: 15,
      fat: 5,
      sugar: 12,
      sodium: 25,
    },
    tags: ['drink'],
  },
  {
    id: '10',
    name: 'Canh Chua Ca',
    nameVietnamese: 'Canh chua cá',
    category: 'main',
    description: 'Sour fish soup',
    nutrition: {
      calories: 150,
      protein: 18,
      carbs: 12,
      fat: 4,
      fiber: 1.2,
      sodium: 680,
      vitaminC: 25,
    },
    tags: ['low-calorie', 'soup'],
  },
];

export class MockMealRepository implements IMealRepository {
  private mealItems: Map<string, MealItem[]> = new Map();

  async getAllFoods(): Promise<Food[]> {
    await new Promise<void>(resolve => setTimeout(resolve, 300));
    return VIETNAMESE_FOODS;
  }

  async searchFoods(query: string): Promise<Food[]> {
    await new Promise<void>(resolve => setTimeout(resolve, 200));
    const lowerQuery = query.toLowerCase();
    return VIETNAMESE_FOODS.filter(
      food =>
        food.nameVietnamese.toLowerCase().includes(lowerQuery) ||
        food.name.toLowerCase().includes(lowerQuery) ||
        food.description?.toLowerCase().includes(lowerQuery),
    );
  }

  async getFoodById(id: string): Promise<Food | null> {
    await new Promise<void>(resolve => setTimeout(resolve, 200));
    return VIETNAMESE_FOODS.find(food => food.id === id) || null;
  }

  async getFoodsByCategory(category: string): Promise<Food[]> {
    await new Promise<void>(resolve => setTimeout(resolve, 200));
    return VIETNAMESE_FOODS.filter(food => food.category === category);
  }

  async getFoodsByTag(tag: string): Promise<Food[]> {
    await new Promise<void>(resolve => setTimeout(resolve, 200));
    return VIETNAMESE_FOODS.filter(
      food => food.tags?.includes(tag.toLowerCase()),
    );
  }

  async getDailyMeal(date: string): Promise<DailyMeal> {
    await new Promise<void>(resolve => setTimeout(resolve, 300));
    
    const items = this.mealItems.get(date) || [];
    const breakfast = items.filter(item => item.mealTime === 'breakfast');
    const lunch = items.filter(item => item.mealTime === 'lunch');
    const dinner = items.filter(item => item.mealTime === 'dinner');

    const calculateTotals = (mealItems: MealItem[]) => {
      return mealItems.reduce(
        (acc, item) => {
          const nutrition = item.food.nutrition;
          return {
            calories: acc.calories + nutrition.calories * item.quantity,
            protein: acc.protein + nutrition.protein * item.quantity,
            carbs: acc.carbs + nutrition.carbs * item.quantity,
            fat: acc.fat + nutrition.fat * item.quantity,
          };
        },
        { calories: 0, protein: 0, carbs: 0, fat: 0 },
      );
    };

    const totals = calculateTotals(items);
    const dailyGoal = 2200;

    return {
      date,
      breakfast,
      lunch,
      dinner,
      dailyGoal,
      totalCalories: totals.calories,
      totalProtein: totals.protein,
      totalCarbs: totals.carbs,
      totalFat: totals.fat,
      remainingCalories: Math.max(0, dailyGoal - totals.calories),
      streak: 7, // Mock streak
    };
  }

  async addMealItem(mealItem: MealItem): Promise<void> {
    await new Promise<void>(resolve => setTimeout(resolve, 200));
    
    const items = this.mealItems.get(mealItem.date) || [];
    items.push(mealItem);
    this.mealItems.set(mealItem.date, items);
  }

  async removeMealItem(mealItemId: string): Promise<void> {
    await new Promise<void>(resolve => setTimeout(resolve, 200));
    
    for (const [date, items] of this.mealItems.entries()) {
      const filtered = items.filter(item => item.id !== mealItemId);
      if (filtered.length !== items.length) {
        this.mealItems.set(date, filtered);
        break;
      }
    }
  }

  async updateMealItem(mealItemId: string, quantity: number): Promise<void> {
    await new Promise<void>(resolve => setTimeout(resolve, 200));
    
    for (const [date, items] of this.mealItems.entries()) {
      const item = items.find(item => item.id === mealItemId);
      if (item) {
        item.quantity = quantity;
        break;
      }
    }
  }

  async getMealStreak(): Promise<number> {
    await new Promise<void>(resolve => setTimeout(resolve, 200));
    return 7; // Mock streak
  }

  async getWeeklyCalories(startDate: string, endDate: string): Promise<number> {
    await new Promise<void>(resolve => setTimeout(resolve, 200));
    return 15400; // Mock weekly calories
  }
}
