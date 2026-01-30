// src/presentation/viewmodels/useSurveyStore.ts

import { create } from 'zustand';
import {
  Gender,
  ActivityLevel,
  HealthGoal,
} from '../../domain/enums/HealthEnums';
import { HealthProfileRepositoryImpl } from '../../data/repositories/health/HealthProfileRepositoryImpl';
import { CreateHealthProfile } from '../../domain/usecases/health/CreateHealthProfile';
import { useUserStore } from './useUserStore';

// Dependency Injection (Thủ công)
const healthRepo = new HealthProfileRepositoryImpl();
const createHealthProfileUseCase = new CreateHealthProfile(healthRepo);

interface SurveyState {
  // Dữ liệu khảo sát
  dob: string; // YYYY-MM-DD
  gender: Gender | null;
  height: string; // Dùng string để dễ handle Input, convert sang number khi submit
  weight: string;
  activity: ActivityLevel | null;
  goal: HealthGoal | null;

  // Trạng thái UI
  currentStep: number;
  loading: boolean;
  error: string | null;

  // Actions
  setDob: (date: string) => void;
  setGender: (gender: Gender) => void;
  setHeight: (height: string) => void;
  setWeight: (weight: string) => void;
  setActivity: (level: ActivityLevel) => void;
  setGoal: (goal: HealthGoal) => void;

  nextStep: () => void;
  prevStep: () => void;

  // Hành động quan trọng: Gửi dữ liệu lên Server
  submitSurvey: () => Promise<boolean>;
  resetSurvey: () => void;
}

export const useSurveyStore = create<SurveyState>((set, get) => ({
  // Giá trị khởi tạo
  dob: '',
  gender: null,
  height: '',
  weight: '',
  activity: null,
  goal: null,

  currentStep: 1,
  loading: false,
  error: null,

  // Setters
  setDob: dob => set({ dob }),
  setGender: gender => set({ gender }),
  setHeight: height => set({ height }),
  setWeight: weight => set({ weight }),
  setActivity: activity => set({ activity }),
  setGoal: goal => set({ goal }),

  // Điều hướng bước
  nextStep: () => set(state => ({ currentStep: state.currentStep + 1 })),
  prevStep: () =>
    set(state => ({ currentStep: Math.max(1, state.currentStep - 1) })),

  // Submit
  submitSurvey: async () => {
    const { dob, gender, height, weight, activity, goal } = get();

    // Validate cơ bản
    if (!dob || !gender || !height || !weight || !activity || !goal) {
      set({ error: 'Vui lòng điền đầy đủ thông tin trước khi hoàn tất.' });
      return false;
    }

    set({ loading: true, error: null });
    try {
      console.log('Đang gửi khảo sát...');
      const success = await createHealthProfileUseCase.execute({
        dateOfBirth: dob,
        gender,
        heightCm: parseFloat(height),
        weightKg: parseFloat(weight),
        activityLevel: activity,
        healthGoal: goal,
      });

      if (success) {
        // Nếu thành công, cập nhật lại User Profile để lấy cờ hasHealthProfile = true
        // Gọi hàm fetchUserProfile từ UserStore (cần import useUserStore)
        await useUserStore.getState().fetchUserProfile();
      }

      set({ loading: false });
      return success;
    } catch (error: any) {
      console.error('Lỗi submit survey:', error);
      set({
        loading: false,
        error: error.message || 'Có lỗi xảy ra, vui lòng thử lại.',
      });
      return false;
    }
  },

  resetSurvey: () =>
    set({
      dob: '',
      gender: null,
      height: '',
      weight: '',
      activity: null,
      goal: null,
      currentStep: 1,
      error: null,
    }),
}));
