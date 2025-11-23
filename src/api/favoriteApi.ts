// src/api/favoriteStoreApi.ts
import api from './axiosInstance';

const BASE_URL = '/api/favorite/stores';

/** 🔥 토큰 가져오기 공통 함수 */
function getToken() {
  const raw = localStorage.getItem('auth-storage');
  const parsed = raw ? JSON.parse(raw) : null;
  return parsed?.state?.token;
}

/** ⭐ 전체 찜한 가게 목록 조회 */
export const getFavoriteStores = async () => {
  const token = getToken();

  const res = await api.get(BASE_URL, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  console.log('Favorite Stores API Response Data:', res.data);
  return res.data;
};

/** ⭐ 특정 가게가 찜 상태인지 조회 */
export const getFavoriteStatus = async (storeId: number) => {
  const token = getToken();

  const res = await api.get(`${BASE_URL}/${storeId}/status`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  console.log(
    `Favorite Status for Store ${storeId} API Response Data:`,
    res.data
  );

  return res.data;
};

/** ⭐ 찜하기 (POST /api/favorite/stores/{storeId}) */
export const addFavoriteStore = async (storeId: number) => {
  const token = getToken();

  const res = await api.post(
    `${BASE_URL}/${storeId}`,
    {},
    {
      headers: {
        Authorization: token ? `Bearer ${token}` : '',
      },
    }
  );

  console.log(`Add Favorite Store ${storeId}:`, res.data);
  return res.data;
};

/** ⭐ 찜 해제 (DELETE /api/favorite/stores/{storeId}) */
export const removeFavoriteStore = async (storeId: number) => {
  const token = getToken();

  const res = await api.delete(`${BASE_URL}/${storeId}`, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  console.log(`Remove Favorite Store ${storeId}:`, res.data);
  return res.data;
};
