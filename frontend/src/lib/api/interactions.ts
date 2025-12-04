import { request } from './client';
import type { Place } from '@/types/place';

export interface SavedPlace {
  saved_id: string;
  created_at: string;
  place: Place;
}

export interface SavedPlacesResponse {
  saved_places: SavedPlace[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export const getSavedPlaces = async (page: number = 1, page_size: number = 20): Promise<SavedPlacesResponse> => {
  const queryParams = new URLSearchParams();
  queryParams.append('page', page.toString());
  queryParams.append('page_size', page_size.toString());

  const queryString = queryParams.toString();
  const endpoint = `/api/interactions/saved${queryString ? `?${queryString}` : ''}`;
  return request<SavedPlacesResponse>(endpoint);
};

export const savePlace = async (placeId: string): Promise<void> => {
  await request(`/api/interactions/saved/${placeId}`, {
    method: 'POST',
  });
};

export const unsavePlace = async (placeId: string): Promise<void> => {
  await request(`/api/interactions/saved/${placeId}`, {
    method: 'DELETE',
  });
};

export const checkIfSaved = async (placeId: string): Promise<{ is_saved: boolean }> => {
  return request<{ is_saved: boolean }>(`/api/interactions/saved/${placeId}/check`);
};


