import { apiClient } from './client';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export const login = async (payload: LoginPayload): Promise<TokenResponse> => {
  const { data } = await apiClient.post<TokenResponse>('/auth/login', payload);
  return data;
};
