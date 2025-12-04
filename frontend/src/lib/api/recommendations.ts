import { request } from './client';
import type { RecommendationCreate, RecommendationResponse } from '@/types/recommendation';

export const createRecommendation = async (
  data: RecommendationCreate
): Promise<RecommendationResponse> => {
  return request<RecommendationResponse>('/api/recommendations', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json',
    },
  });
};

