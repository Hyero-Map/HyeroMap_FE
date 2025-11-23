import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface AuthState {
  token: string | null;
  userName: string | null;
  userPhone: string | null;
  isLoggedIn: boolean;

  setAuth: (token: string, userName: string, userPhone: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      userName: null,
      userPhone: null,
      isLoggedIn: false,

      // 🔥 로그인 시 모든 정보 저장
      setAuth: (token, userName, userPhone) =>
        set({
          token: token,
          userName: userName,
          userPhone: userPhone,
          isLoggedIn: true,
        }),

      // 🔥 로그아웃 시 상태 & localStorage 초기화
      logout: () => {
        set({
          token: null,
          userName: null,
          userPhone: null,
          isLoggedIn: false,
        });

        localStorage.removeItem('auth-storage');
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
