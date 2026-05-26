export interface AuthResponse {
  success: boolean;
  data: {
    userId: string;
    status: string;
    token: string;
  
  };
}

export interface ErrorResponse {
  success: boolean;
  message: string;
}