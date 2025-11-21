// Places API endpoints

import { request } from './client';
import type { PlaceListResponse, GetPlacesParams } from '@/types/place';

export const getPlaces = async (params?: GetPlacesParams): Promise<PlaceListResponse> => {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append('page', params.page.toString());
  if (params?.page_size) queryParams.append('page_size', params.page_size.toString());
  if (params?.type_key) queryParams.append('type_key', params.type_key);
  if (params?.search) queryParams.append('search', params.search);
  if (params?.min_rating) queryParams.append('min_rating', params.min_rating.toString());

  const queryString = queryParams.toString();
  const endpoint = `/api/places${queryString ? `?${queryString}` : ''}`;
  return request<PlaceListResponse>(endpoint);
};

