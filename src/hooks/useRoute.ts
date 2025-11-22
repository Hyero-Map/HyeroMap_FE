import { useQuery } from '@tanstack/react-query';
import { fetchKakaoRoute, type RouteParams } from '../api/KakaoApi';

export function useKakaoRoute(params: RouteParams | null) {
  return useQuery({
    queryKey: ['route', params],
    queryFn: () => fetchKakaoRoute(params!),
    enabled: params !== null, // origin/destination 둘 다 있을 때만 실행
    staleTime: 1000 * 60, // 1분 캐싱
  });
}
