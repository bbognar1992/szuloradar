// Places API endpoints

import { request } from './client';
import type { PlaceListResponse, GetPlacesParams } from '@/types/place';

export const getPlaces = async (params?: GetPlacesParams): Promise<PlaceListResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
  if (params?.type_key !== undefined) queryParams.append('type_key', params.type_key.toString());
  if (params?.search) queryParams.append('search', params.search);
  if (params?.city) queryParams.append('city', params.city);
  if (params?.min_rating) queryParams.append('min_rating', params.min_rating.toString());

  const queryString = queryParams.toString();
  const endpoint = `/api/places${queryString ? `?${queryString}` : ''}`;
  return request<PlaceListResponse>(endpoint);
};

export const getCities = async (): Promise<string[]> => {
  return request<string[]>('/api/places/cities');
};

export interface PlaceType {
  id: number;
  type_key: string;
  display_name: string;
  icon?: string;
}

export interface Amenity {
  id: number;
  amenity_key: string;
  display_name: string;
  icon?: string;
}

export const getPlaceTypes = async (): Promise<PlaceType[]> => {
  return request<PlaceType[]>('/api/places/types');
};

export const getAmenities = async (): Promise<Amenity[]> => {
  return request<Amenity[]>('/api/places/amenities');
};
