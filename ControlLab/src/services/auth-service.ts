import { ApiClient } from './api-client';

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'technician' | 'operator';
  };
  token: string;
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    return ApiClient.post('/auth/login', { email, password });
  },

  async signup(email: string, password: string, name: string): Promise<AuthResponse> {
    return ApiClient.post('/auth/signup', { email, password, name });
  },

  async getCurrentUser() {
    return ApiClient.get('/auth/me');
  },

  async logout() {
    return ApiClient.post('/auth/logout', {});
  },
};
