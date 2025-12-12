export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface TokenResponse {
  access_token: string;
  token_type: string;
}

export interface Children {
  id: string;
  user_id: string;
  name: string;
  birth_year?: number;
  created_at: string;
  updated_at: string;
}

export interface ChildrenCreate {
  name: string;
  birth_year?: number;
}

export interface ChildrenUpdate {
  name?: string;
  birth_year?: number;
}

export interface User {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  profile_image_url?: string;
  subscription_type: string;
  parent_count: number;
  created_at: string;
  updated_at: string;
  last_login?: string;
  is_active: boolean;
  children?: Children[];
}

export interface UserProfileUpdate {
  first_name?: string;
  last_name?: string;
  phone?: string;
  profile_image_url?: string;
  subscription_type?: string;
  parent_count?: number;
  children?: ChildrenCreate[];
}

