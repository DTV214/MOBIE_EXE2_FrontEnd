import { create } from 'zustand';
import { User } from '../../domain/entities/User';
import { getUserProfileUseCase } from '../../di/Container';

interface State {
  user: User | null;
  loading: boolean;
  fetchUser: (id: string) => Promise<void>;
}

export const useUserStore = create<State>(set => ({
  user: null,
  loading: false,
  fetchUser: async (id: string) => {
    set({ loading: true });
    try {
      const data = await getUserProfileUseCase.execute(id);
      set({ user: data, loading: false });
    } catch (e) {
      console.error(e);
      set({ loading: false });
    }
  },
}));
