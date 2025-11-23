// hooks/useFavoriteStores.ts
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getFavoriteStores, getFavoriteStatus } from '../api/favoriteApi';

export function useFavoriteStores() {
  const queryClient = useQueryClient();

  /** 즐겨찾기 목록 조회 */
  const favoriteStoresQuery = useQuery({
    queryKey: ['favoriteStores'],
    queryFn: getFavoriteStores,
  });

  /** 특정 가게 즐겨찾기 상태 조회 */
  const fetchFavoriteStatus = async (storeId: number) => {
    const data = await getFavoriteStatus(storeId);

    // Optional: 캐시에 저장해두기 (성능 향상)
    queryClient.setQueryData(['favoriteStatus', storeId], data);

    return data;
  };

  return {
    ...favoriteStoresQuery, // data, isLoading, refetch 모두 포함됨
    fetchFavoriteStatus, // storeId → status API 호출
  };
}
