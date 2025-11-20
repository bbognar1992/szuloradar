// Authentication API endpoints

import { request } from './client';
import type { LoginRequest, RegisterRequest, TokenResponse, User } from '@/types/auth';

export const login = async (data: LoginRequest): Promise<TokenResponse> => {
  return request<TokenResponse>('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const register = async (data: RegisterRequest): Promise<User> => {
  return request<User>('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const getCurrentUser = async (): Promise<User> => {
  return request<User>('/api/auth/me');
};

