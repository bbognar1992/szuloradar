export interface RecommendationCreate {
  place_name: string;
  place_type_key: string;
  recommendation_text: string;
  maps_link?: string;
  address?: string;
  phone?: string;
  amenity_keys: string[];
}

export interface RecommendationResponse {
  id: string;
  user_id?: string;
  place_name: string;
  place_type_key: string;
  place_type_display_name: string;
  place_type_icon?: string;
  recommendation_text: string;
  maps_link?: string;
  address?: string;
  phone?: string;
  status: string;
  created_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  review_notes?: string;
  amenities: Array<{
    id: number;
    amenity_key: string;
    display_name: string;
    icon?: string;
  }>;
}

