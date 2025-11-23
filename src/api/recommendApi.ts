import api from './axiosInstance';

const BASE_URL = '/api/recommendation';

export interface RecommendRequest {
  name: string;
  age: number;
  gender: string;
  allergy: string;
  disease: string;
  hardFood: boolean;
  spicy: boolean;
  sugarSaltRestriction: boolean;
}

export async function sendRecommendation(data: RecommendRequest) {
  const raw = localStorage.getItem('auth-storage');
  const parsed = raw ? JSON.parse(raw) : null;
  const token = parsed?.state?.token;

  const res = await api.post(BASE_URL, data, {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  return res.data;
}
