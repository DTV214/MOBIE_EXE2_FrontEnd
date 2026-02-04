import { create } from 'zustand';
import { DailyLog } from '../../domain/entities/DailyLog';
import { MealLog, MealType } from '../../domain/entities/MealLog';
import {
  getDailyLogByDateUseCase,
  createDailyLogUseCase,
  getMealLogsByDailyLogIdUseCase,
  createMealLogUseCase,
} from '../../di/Container';

// Định nghĩa cấu trúc tham số từ Pop-up gửi xuống
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
  addMealLog: (params: AddMealLogParams) => Promise<void>; // Cập nhật tham số
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
    console.log('--- [STORE] User selected date:', date);
    set({ selectedDate: date });
  },

  // Lấy dữ liệu Nhật ký & Bữa ăn
  fetchLogByDate: async (date: string) => {
    console.log('--- [STORE] fetchLogByDate triggered for:', date);
    set({ isLoading: true, error: null, mealLogs: [] });

    try {
      const log = await getDailyLogByDateUseCase.execute(date);

      if (log) {
        console.log(
          '--- [STORE] DailyLog exists (ID:',
          log.id,
          '). Fetching meals...',
        );
        const meals = await getMealLogsByDailyLogIdUseCase.execute(log.id);
        set({ currentLog: log, mealLogs: meals, isLoading: false });
      } else {
        console.log('--- [STORE] DailyLog does not exist for this date.');
        set({ currentLog: null, mealLogs: [], isLoading: false });
      }
    } catch (err: any) {
      console.error('--- [STORE] fetchLogByDate Global Error:', err);
      set({
        error: err.message || 'Lỗi kết nối máy chủ',
        isLoading: false,
        currentLog: null,
        mealLogs: [],
      });
    }
  },

  // Khởi tạo Nhật ký ngày mới
  initializeLog: async (date: string) => {
    console.log('--- [STORE] Creating DailyLog for:', date);
    set({ isLoading: true, error: null });
    try {
      const newLog = await createDailyLogUseCase.execute(date);
      set({ currentLog: newLog, mealLogs: [], isLoading: false });
    } catch (err: any) {
      console.error('--- [STORE] initializeLog ERROR:', err);
      set({ error: err.message, isLoading: false });
    }
  },

  // THÊM BỮA ĂN (Xử lý từ Pop-up Form)
  addMealLog: async (params: AddMealLogParams) => {
    const { currentLog, selectedDate } = get();

    if (!currentLog) {
      console.warn('--- [STORE] addMealLog blocked: currentLog is null');
      return;
    }

    // LOG DỮ LIỆU ĐẦU VÀO
    console.log('--- [STORE] PRE-CHECK PAYLOAD:', {
      dailyLogId: currentLog.id,
      ...params,
    });

    set({ isLoading: true, error: null });

    try {
      // 1. Gửi request
      await createMealLogUseCase.execute(
        currentLog.id,
        params.mealType,
        params.loggedTime,
        params.notes,
      );

      console.log('--- [STORE] API CALL SUCCESS');

      // 2. Fetch lại dữ liệu
      const [updatedLog, updatedMeals] = await Promise.all([
        getDailyLogByDateUseCase.execute(selectedDate),
        getMealLogsByDailyLogIdUseCase.execute(currentLog.id),
      ]);

      set({
        currentLog: updatedLog,
        mealLogs: updatedMeals,
        isLoading: false,
      });
    } catch (err: any) {
      // CHI TIẾT LỖI TỪ SERVER
      console.error('--- [STORE] addMealLog FAILED');

      if (err.response) {
        // Đây là nơi chứa thông tin quý giá nhất khi bị lỗi 500
        console.error(
          '--- [SERVER ERROR DATA]:',
          JSON.stringify(err.response.data, null, 2),
        );
        console.error('--- [SERVER STATUS]:', err.response.status);
        console.error('--- [SERVER HEADERS]:', err.response.headers);
      } else if (err.request) {
        console.error('--- [NETWORK ERROR]: No response received from server');
      } else {
        console.error('--- [UNKNOWN ERROR]:', err.message);
      }

      const serverMessage =
        err.response?.data?.message || err.message || 'Lỗi hệ thống';
      set({ error: serverMessage, isLoading: false });

      throw err;
    }
  },
}));
