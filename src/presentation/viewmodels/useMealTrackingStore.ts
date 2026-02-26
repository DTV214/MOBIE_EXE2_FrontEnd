import { create } from 'zustand';
import { Food } from '../../domain/entities/Food';
import { MealFoodDetail } from '../../domain/entities/MealFoodDetail';
import { useDailyLogStore } from './useDailyLogStore'; // Import để đồng bộ dữ liệu
import {
  getFoodItemsUseCase,
  getMealFoodsByMealIdUseCase,
  addFoodToMealUseCase,
  updateMealFoodQuantityUseCase,
  removeFoodFromMealUseCase,
} from '../../di/Container';

interface MealTrackingState {
  // State cho Thư viện món ăn (Search)
  searchFoods: Food[];
  currentPage: number;
  hasMore: boolean;
  searchKeyword: string;

  // State cho Món ăn trong bữa (Meal Content)
  mealFoods: MealFoodDetail[];

  // Trạng thái chung
  isLoading: boolean;
  error: string | null;

  // Actions - Thư viện món ăn
  searchFoodsAction: (keyword: string) => Promise<void>;
  loadMoreFoods: () => Promise<void>;

  // Actions - Quản lý món trong bữa
  fetchMealFoods: (mealId: number) => Promise<void>;
  addFood: (mealId: number, foodId: number) => Promise<void>;
  updateQuantity: (id: number, newQuantity: number) => Promise<void>;
  removeFood: (id: number) => Promise<void>;
}

export const useMealTrackingStore = create<MealTrackingState>((set, get) => ({
  searchFoods: [],
  currentPage: 0,
  hasMore: true,
  searchKeyword: '',
  mealFoods: [],
  isLoading: false,
  error: null,

  // 1. Tìm kiếm món ăn mới
  searchFoodsAction: async (keyword: string) => {
    set({
      isLoading: true,
      searchKeyword: keyword,
      currentPage: 0,
      searchFoods: [],
    });
    try {
      const pageData = await getFoodItemsUseCase.execute({
        search: keyword,
        page: 0,
        size: 20,
        status: 'ACTIVE',
      });
      set({
        searchFoods: pageData.content,
        hasMore: pageData.number < pageData.totalPages - 1,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  // 2. Phân trang (Load more)
  loadMoreFoods: async () => {
    const { currentPage, hasMore, searchKeyword, searchFoods, isLoading } =
      get();
    if (!hasMore || isLoading) return;

    const nextPage = currentPage + 1;
    try {
      const pageData = await getFoodItemsUseCase.execute({
        search: searchKeyword,
        page: nextPage,
        size: 20,
        status: 'ACTIVE',
      });
      set({
        searchFoods: [...searchFoods, ...pageData.content],
        currentPage: nextPage,
        hasMore: pageData.number < pageData.totalPages - 1,
      });
    } catch (err: any) {
      console.error('--- [STORE] Load more failed:', err);
    }
  },

  // 3. Lấy danh sách món trong bữa
  fetchMealFoods: async (mealId: number) => {
    set({ isLoading: true });
    try {
      const foods = await getMealFoodsByMealIdUseCase.execute(mealId);
      set({ mealFoods: foods, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  // 4. THÊM MÓN VÀO BỮA
  addFood: async (mealId: number, foodId: number) => {
    try {
      // QUAN TRỌNG: Gửi đúng key 'mealId' như Backend yêu cầu
      await addFoodToMealUseCase.execute({
        mealId: mealId, // Chắc chắn không phải mmealId
        foodItemId: foodId,
        quantity: 1,
      });

      // Sau khi thêm, lấy lại danh sách mới nhất
      const updatedFoods = await getMealFoodsByMealIdUseCase.execute(mealId);
      set({ mealFoods: updatedFoods });

      // Đồng bộ calo ở Dashboard
      const { selectedDate, fetchLogByDate } = useDailyLogStore.getState();
      await fetchLogByDate(selectedDate);
    } catch (err: any) {
      // Xuất log lỗi chi tiết từ Server để biết tại sao bị 500
      console.error(
        '--- [STORE] Add Food ERROR:',
        err.response?.data || err.message,
      );
      set({ error: err.message });
      throw err;
    }
  },

  // 5. CẬP NHẬT SỐ LƯỢNG
  updateQuantity: async (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    try {
      const updatedItem = await updateMealFoodQuantityUseCase.execute(
        id,
        newQuantity,
      );

      const { mealFoods } = get();
      set({
        mealFoods: mealFoods.map(item => (item.id === id ? updatedItem : item)),
      });

      // ĐỒNG BỘ: Cập nhật lại Calo tổng của ngày sau khi đổi số lượng
      const { selectedDate, fetchLogByDate } = useDailyLogStore.getState();
      await fetchLogByDate(selectedDate);
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  // 6. XÓA MÓN KHỎI BỮA
  removeFood: async (id: number) => {
    try {
      await removeFoodFromMealUseCase.execute(id);

      const { mealFoods } = get();
      set({ mealFoods: mealFoods.filter(item => item.id !== id) });

      // ĐỒNG BỘ: Cập nhật lại Calo tổng của ngày sau khi món ăn biến mất
      const { selectedDate, fetchLogByDate } = useDailyLogStore.getState();
      await fetchLogByDate(selectedDate);
    } catch (err: any) {
      set({ error: err.message });
    }
  },
}));
