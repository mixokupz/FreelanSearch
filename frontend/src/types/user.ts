// src/types/user.ts

export interface OwnProfileResponse {
  id: number;
  email: string;
  phone: string | null; 
  role: string;
  blocked: boolean;
  createdAt: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null; 
  city: string | null; 
  avgRating: number;
  reviewsCount: number;
  updatedAt: string;
}

export interface PublicProfileResponse {
  id: number;
  email: string;
  phone: string | null;
  role: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  city: string | null;
  avgRating: number;
  reviewsCount: number;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  displayName?: string;
  avatarUrl?: string;
  bio?: string;
  city?: string;
}

export interface UserProfileApiResponse {
  success: boolean;
  data: OwnProfileResponse;
}

export interface UsersListApiResponse {
  success: boolean;
  data: PublicProfileResponse[];
}