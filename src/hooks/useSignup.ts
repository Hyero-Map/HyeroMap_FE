// hooks/useSignup.ts
import { useMutation } from '@tanstack/react-query';
import { signupUser } from '../api/authApi';
import type { SignupRequest } from '../api/authApi';

export function useSignup() {
  return useMutation({
    mutationFn: (data: SignupRequest) => signupUser(data),
  });
}
