import api from './axiosInstance';

const BASE_URL = '/login';

export interface LoginRequest {
  userPhone: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  userName: string;
  userPhone: string;
}

export async function login(data: LoginRequest): Promise<LoginResponse> {
  const res = await api.post(BASE_URL, data);
  console.log('Login API Response Data:', res.data);
  return res.data;
}

export type SignupRequest = {
  userName: string;
  userPhone: string;
  password: string;
};

export async function signupUser(data: SignupRequest): Promise<void> {
  console.log('Signup API Request Data:', data);
  const res = await api.post('/api/user/signUp', data);
  return res.data;
}
