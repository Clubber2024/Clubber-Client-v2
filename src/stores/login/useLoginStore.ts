import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: number;
  email: string;
}

interface LoginState {
  // 상태
  isLoggedIn: boolean;
  isAdmin: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;

  // 액션
  setTokens: (accessToken: string, refreshToken: string) => void;
  setUser: (user: User) => void;
  login: (accessToken: string, refreshToken: string, user: User) => void;
  logout: () => void;
  clearTokens: () => void;
  updateUser: (userData: Partial<User>) => void;
}

export const useLoginStore = create<LoginState>()(
  persist(
    (set, get) => ({
      // 초기 상태
      isLoggedIn: false,
      isAdmin: false,
      accessToken: null,
      refreshToken: null,
      user: null,

      // 토큰 설정
      setTokens: (accessToken: string, refreshToken: string) => {
        set({
          accessToken,
          refreshToken,
          isLoggedIn: true,
        });
      },

      // 사용자 정보 설정
      setUser: (user: User) => {
        set({ user });
      },

      // 로그인 (토큰 + 사용자 정보)
      login: (accessToken: string, refreshToken: string, user: User) => {
        set({
          isLoggedIn: true,
          accessToken,
          refreshToken,
          user,
        });
      },

      // 로그아웃
      logout: () => {
        set({
          isLoggedIn: false,
          accessToken: null,
          refreshToken: null,
          user: null,
        });
      },

      // 토큰만 제거
      clearTokens: () => {
        set({
          accessToken: null,
          refreshToken: null,
          isLoggedIn: false,
        });
      },

      // 사용자 정보 부분 업데이트
      updateUser: (userData: Partial<User>) => {
        const currentUser = get().user;
        if (currentUser) {
          set({
            user: { ...currentUser, ...userData },
          });
        }
      },
    }),
    {
      name: 'login-storage', // 로컬 스토리지 키
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        isLoggedIn: !!state.accessToken, // accessToken 존재 여부로 로그인 상태 계산
      }),
      onRehydrateStorage: () => (state) => {
        // 스토리지에서 복원 후 isLoggedIn 상태를 accessToken 기반으로 재계산
        if (state) {
          state.isLoggedIn = !!state.accessToken;
        }
      },
    }
  )
);
