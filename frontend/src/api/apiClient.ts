

import { v4 as uuidv4 } from 'uuid';

const BASE_URL = 'http://localhost:8080/api/v1'; 

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
  
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  headers.set('X-B3-TraceId', uuidv4());
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const responseData = await response.json().catch(() => ({}));

  if (!response.ok) {
    const errorMessage = responseData?.message || responseData?.data?.message || '';
    throw new ApiError(response.status, errorMessage);
  }

  return responseData as T;
}