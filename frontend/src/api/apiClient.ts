

const BASE_URL = 'http://localhost:8080/api/v1'; 

export async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('token');
  
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const responseData = await response.json();

  if (!response.ok) {

    const errorMessage = responseData?.message || `Ошибка сервера: ${response.status}`;
    throw new Error(errorMessage);
  }

  return responseData as T;
}