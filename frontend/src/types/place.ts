export interface Amenity {
  id: string;
  amenity_key: string;
  display_name: string;
  icon?: string;
}

export interface Place {
  id: string;
  name: string;
  type_key: string;
  type_display_name: string;
  type_icon?: string;
  rating: number | string;
  address: string;
  phone?: string;
  hours?: string;
  description?: string;
  maps_link?: string;
  latitude?: number | string;
  longitude?: number | string;
  is_approved: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  amenities: Amenity[];
}

export interface PlaceListResponse {
  places: Place[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface GetPlacesParams {
  page?: number;
  page_size?: number;
  type_key?: number;
  search?: string;
  city?: string;
  min_rating?: number;
}

