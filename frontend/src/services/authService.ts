import { api } from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  skinTone?: string;
  bodyType?: string;
  preferredStyle?: string;
  createdAt: string;
}

export const authService = {
  async login(email: string, password: string): Promise<{ user: User; token: string }> {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async signup(userData: {
    name: string;
    email: string;
    password: string;
  }): Promise<{ user: User; token: string }> {
    const response = await api.post('/auth/signup', userData);
    return response.data;
  },

  async getProfile(): Promise<User> {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  async updateProfile(data: Partial<User>): Promise<User> {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },
};
