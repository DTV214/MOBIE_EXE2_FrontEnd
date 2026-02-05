import { create } from 'zustand';
import { ExerciseType } from '../../domain/entities/ExerciseType';
import { ExerciseLogDetail } from '../../domain/entities/ExerciseLogDetail';
import { useDailyLogStore } from './useDailyLogStore'; // Để đồng bộ Calo tiêu thụ
import {
  getExerciseTypesUseCase,
  getExercisesByDailyLogIdUseCase,
  addExerciseLogUseCase,
  updateExerciseLogUseCase,
  removeExerciseLogUseCase,
} from '../../di/Container';

interface ExerciseState {
  // State cho Thư viện môn tập (Search)
  exerciseTypes: ExerciseType[];
  currentPage: number;
  hasMore: boolean;

  // State cho Nhật ký tập luyện trong ngày
  exerciseLogs: ExerciseLogDetail[];

  isLoading: boolean;
  error: string | null;

  // Actions - Thư viện môn tập
  fetchExerciseTypes: (page?: number) => Promise<void>;
  loadMoreExercises: () => Promise<void>;

  // Actions - Quản lý nhật ký tập luyện
  fetchExerciseLogs: (dailyLogId: number) => Promise<void>;
  addExercise: (payload: {
    duration: number;
    exerciseTypeId: number;
    dailyLogId: number;
  }) => Promise<void>;
  updateExercise: (
    id: number,
    payload: { duration: number; exerciseTypeId: number; dailyLogId: number },
  ) => Promise<void>;
  deleteExercise: (id: number) => Promise<void>;
}

export const useExerciseStore = create<ExerciseState>((set, get) => ({
  exerciseTypes: [],
  currentPage: 0,
  hasMore: true,
  exerciseLogs: [],
  isLoading: false,
  error: null,

  // 1. Lấy danh sách môn tập (Thư viện)
  fetchExerciseTypes: async (page = 0) => {
    set({ isLoading: true, currentPage: page });
    try {
      const pageData = await getExerciseTypesUseCase.execute(page, 20);
      set({
        exerciseTypes:
          page === 0
            ? pageData.content
            : [...get().exerciseTypes, ...pageData.content],
        hasMore: pageData.number < pageData.totalPages - 1,
        isLoading: false,
      });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  // 2. Phân trang (Load more)
  loadMoreExercises: async () => {
    const { currentPage, hasMore, isLoading } = get();
    if (!hasMore || isLoading) return;
    await get().fetchExerciseTypes(currentPage + 1);
  },

  // 3. Lấy danh sách bài tập đã thực hiện trong ngày
  fetchExerciseLogs: async (dailyLogId: number) => {
    set({ isLoading: true });
    try {
      const logs = await getExercisesByDailyLogIdUseCase.execute(dailyLogId);
      set({ exerciseLogs: logs, isLoading: false });
    } catch (err: any) {
      set({ error: err.message, isLoading: false });
    }
  },

  // 4. THÊM BÀI TẬP VÀ ĐỒNG BỘ CALO
  addExercise: async payload => {
    try {
      await addExerciseLogUseCase.execute(payload);

      // A. Cập nhật lại danh sách bài tập tại chỗ
      await get().fetchExerciseLogs(payload.dailyLogId);

      // B. ĐỒNG BỘ: Cập nhật lại Dashboard (Calo tiêu thụ)
      const { selectedDate, fetchLogByDate } = useDailyLogStore.getState();
      await fetchLogByDate(selectedDate);
    } catch (err: any) {
      set({ error: err.message });
      throw err;
    }
  },

  // 5. Cập nhật bài tập
  updateExercise: async (id, payload) => {
    try {
      await updateExerciseLogUseCase.execute(id, payload);
      await get().fetchExerciseLogs(payload.dailyLogId);

      // Đồng bộ lại Dashboard
      const { selectedDate, fetchLogByDate } = useDailyLogStore.getState();
      await fetchLogByDate(selectedDate);
    } catch (err: any) {
      set({ error: err.message });
    }
  },

  // 6. Xóa bài tập
  deleteExercise: async id => {
    try {
      const logToDelete = get().exerciseLogs.find(l => l.id === id);
      await removeExerciseLogUseCase.execute(id);

      if (logToDelete) {
        // Cập nhật local state
        set({ exerciseLogs: get().exerciseLogs.filter(l => l.id !== id) });

        // Đồng bộ lại Dashboard để con số Calo tiêu thụ giảm xuống
        const { selectedDate, fetchLogByDate } = useDailyLogStore.getState();
        await fetchLogByDate(selectedDate);
      }
    } catch (err: any) {
      set({ error: err.message });
    }
  },
}));
