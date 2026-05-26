
import { request } from './apiClient';
import { UserProfileApiResponse, UpdateProfileRequest , UsersListApiResponse} from '../types/user';

export const userService = {
  // GET /api/v1/users/me
  getMe: async (): Promise<UserProfileApiResponse> => {
    return request<UserProfileApiResponse>('/users/me', {
      method: 'GET',
    });
  },

  // PUT /api/v1/users/me
  updateMe: async (data: UpdateProfileRequest): Promise<UserProfileApiResponse> => {
    return request<UserProfileApiResponse>('/users/me', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },
  getPublicProfile: async (userId: number): Promise<UserProfileApiResponse> => {
    return request<UserProfileApiResponse>(`/users/${userId}`, {
      method: 'GET',
    });
  },
  getUsers: async (): Promise<UsersListApiResponse> => {
    return request<UsersListApiResponse>('/users', {
      method: 'GET',
    });
  },
};