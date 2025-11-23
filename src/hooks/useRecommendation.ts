import { useMutation } from '@tanstack/react-query';
import { sendRecommendation } from '../api/recommendApi';
import type { RecommendRequest } from '../api/recommendApi';

export function useRecommendation() {
  return useMutation({
    mutationFn: (data: RecommendRequest) => sendRecommendation(data),
  });
}
