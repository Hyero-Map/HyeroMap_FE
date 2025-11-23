import api from './axiosInstance';

const BASE_URL = '/api/store';

// 단일 스토어 조회
export async function fetchStoreById(storeId: number) {
  const res = await api.get(`${BASE_URL}/${storeId}`);
  return res.data;
}

// 전체 스토어 조회
export async function fetchAllStores() {
  const res = await api.get(BASE_URL);
  return res.data;
}
