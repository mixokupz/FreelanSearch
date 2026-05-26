
import { request } from './apiClient';
import { AuthResponse } from '../types/auth';

export const authService = {
  login: async (params: { email: string; password?: string }): Promise<AuthResponse> => {
    return request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },

  register: async (params: { email: string; password?: string; name: string }): Promise<AuthResponse> => {
    return request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(params),
    });
  },
};