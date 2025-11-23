// src/hooks/useStoreQuery.ts
import { useQuery } from '@tanstack/react-query';
import { fetchStoreById } from '../api/StoreApi';
import { fetchAllStores } from '../api/StoreApi';

export function useStoreQuery(storeId: number | null) {
  return useQuery({
    queryKey: ['store', storeId],
    queryFn: () => fetchStoreById(storeId!),
    enabled: storeId !== null, // storeId가 있을 때만 실행
    staleTime: 1000 * 60, // 1분 캐싱
  });
}

export function useStoresQuery() {
  return useQuery({
    queryKey: ['stores'],
    queryFn: fetchAllStores,
    staleTime: 1000 * 60 * 5, // 5분 캐싱
  });
}
