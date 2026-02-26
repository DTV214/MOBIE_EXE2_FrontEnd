import { create } from 'zustand';
import { DailyLog } from '../../domain/entities/DailyLog';
import { MealLog, MealType } from '../../domain/entities/MealLog';
import {
  getDailyLogByDateUseCase,
  createDailyLogUseCase,
  getMealLogsByDailyLogIdUseCase,
  createMealLogUseCase,
  updateMealLogUseCase, // Mới thêm
  deleteMealLogUseCase, // Mới thêm
} from '../../di/Container';

// Định nghĩa tham số cho cả tạo mới và cập nhật
export interface AddMealLogParams {
  mealType: MealType;
  loggedTime: string; // Định dạng "HH:mm:ss"
  notes: string;
}

interface DailyLogState {
  currentLog: DailyLog | null;
  mealLogs: MealLog[];
  selectedDate: string;
  isLoading: boolean;
  error: string | null;

  // Actions
  setSelectedDate: (date: string) => void;
  fetchLogByDate: (date: string) => Promise<void>;
  addMealLog: (params: AddMealLogParams) => Promise<void>;
  updateMealLog: (id: number, params: AddMealLogParams) => Promise<void>; // Mới
  deleteMealLog: (id: number) => Promise<void>; // Mới
  initializeLog: (date: string) => Promise<void>;
}

const getTodayString = () => {
  const date = new Date();
  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().split('T')[0];
};

export const useDailyLogStore = create<DailyLogState>((set, get) => ({
  currentLog: null,
  mealLogs: [],
  selectedDate: getTodayString(),
  isLoading: false,
  error: null,

  setSelectedDate: (date: string) => {
    set({ selectedDate: date });
  },

  // Lấy dữ liệu Nhật ký & Bữa ăn
  fetchLogByDate: async (date: string) => {
    set({ isLoading: true, error: null, mealLogs: [] });
    try {
      const log = await getDailyLogByDateUseCase.execute(date);
      if (log) {
        const meals = await getMealLogsByDailyLogIdUseCase.execute(log.id);
        set({ currentLog: log, mealLogs: meals, isLoading: false });
      } else {
        set({ currentLog: null, mealLogs: [], isLoading: false });
      }
    } catch (err: any) {
      set({
        error: err.message || 'Lỗi kết nối máy chủ',
        isLoading: false,
        currentLog: null,
      });
    }
  },

  // THÊM BỮA ĂN
  addMealLog: async (params: AddMealLogParams) => {
    const { currentLog, selectedDate } = get();
    if (!currentLog) throw new Error('Vui lòng khởi tạo nhật ký ngày trước.');

    set({ isLoading: true, error: null });
    try {
      // Chuẩn hóa thời gian HH:mm:ss để tránh lỗi 500
      let formattedTime = params.loggedTime;
      if (formattedTime.split(':').length === 2) formattedTime += ':00';

      await createMealLogUseCase.execute(
        currentLog.id,
        params.mealType,
        formattedTime,
        params.notes,
      );

      // Refresh toàn bộ dữ liệu (Calo + Danh sách bữa ăn)
      const [updatedLog, updatedMeals] = await Promise.all([
        getDailyLogByDateUseCase.execute(selectedDate),
        getMealLogsByDailyLogIdUseCase.execute(currentLog.id),
      ]);
      set({ currentLog: updatedLog, mealLogs: updatedMeals, isLoading: false });
    } catch (err: any) {
      const msg =
        err.response?.data?.message || err.message || 'Lỗi tạo bữa ăn';
      set({ error: msg, isLoading: false });
      throw err; // Ném lỗi cho UI catch
    }
  },

  // CẬP NHẬT BỮA ĂN (MỚI)
  updateMealLog: async (id: number, params: AddMealLogParams) => {
    const { currentLog, selectedDate } = get();
    if (!currentLog) return;

    console.log(`--- [STORE] Updating MealLog ID: ${id}`, params);
    set({ isLoading: true, error: null });

    try {
      // Chuẩn hóa thời gian HH:mm:ss
      let formattedTime = params.loggedTime;
      if (formattedTime.split(':').length === 2) formattedTime += ':00';

      await updateMealLogUseCase.execute(
        id,
        params.mealType,
        formattedTime,
        params.notes,
      );

      // Refresh dữ liệu để cập nhật Calo và hiển thị
      const [updatedLog, updatedMeals] = await Promise.all([
        getDailyLogByDateUseCase.execute(selectedDate),
        getMealLogsByDailyLogIdUseCase.execute(currentLog.id),
      ]);
      set({ currentLog: updatedLog, mealLogs: updatedMeals, isLoading: false });
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Lỗi cập nhật';
      set({ error: msg, isLoading: false });
      throw err;
    }
  },

  // XÓA BỮA ĂN (MỚI)
  deleteMealLog: async (id: number) => {
    const { currentLog, selectedDate } = get();
    if (!currentLog) return;

    console.log(`--- [STORE] Deleting MealLog ID: ${id}`);
    set({ isLoading: true, error: null });

    try {
      await deleteMealLogUseCase.execute(id);

      // Sau khi xóa, phải lấy lại DailyLog để cập nhật Calo nạp vào đã giảm xuống
      const [updatedLog, updatedMeals] = await Promise.all([
        getDailyLogByDateUseCase.execute(selectedDate),
        getMealLogsByDailyLogIdUseCase.execute(currentLog.id),
      ]);
      set({ currentLog: updatedLog, mealLogs: updatedMeals, isLoading: false });
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || 'Lỗi khi xóa';
      set({ error: msg, isLoading: false });
      throw err;
    }
  },

  initializeLog: async (date: string) => {
    set({ isLoading: true, error: null });
    try {
      const newLog = await createDailyLogUseCase.execute(date);
      set({ currentLog: newLog, mealLogs: [], isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },
}));
