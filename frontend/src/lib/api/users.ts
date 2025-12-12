import { request } from './client';
import type { User, UserProfileUpdate, Children, ChildrenCreate, ChildrenUpdate } from '@/types/auth';

export const getMyProfile = async (): Promise<User> => {
  return request<User>('/api/users/me');
};

export const updateMyProfile = async (data: UserProfileUpdate): Promise<User> => {
  return request<User>('/api/users/me', {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const getMyChildren = async (): Promise<Children[]> => {
  return request<Children[]>('/api/users/me/children');
};

export const createChild = async (data: ChildrenCreate): Promise<Children> => {
  return request<Children>('/api/users/me/children', {
    method: 'POST',
    body: JSON.stringify(data),
  });
};

export const updateChild = async (childId: string, data: ChildrenUpdate): Promise<Children> => {
  return request<Children>(`/api/users/me/children/${childId}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
};

export const deleteChild = async (childId: string): Promise<void> => {
  return request<void>(`/api/users/me/children/${childId}`, {
    method: 'DELETE',
  });
};
