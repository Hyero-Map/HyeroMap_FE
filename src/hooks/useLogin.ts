// src/hooks/useLogin.ts
import { useMutation } from '@tanstack/react-query';
import { login, type LoginRequest } from '../api/authApi';
import { useAuthStore } from '../stores/useAuthStore';

export function useLogin() {
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (res) => {
      setAuth(res.accessToken, res.userName, res.userPhone);
    },
  });
}
