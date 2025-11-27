// Custom hook for fetching places

import { useState, useEffect } from 'react';
import { getPlaces } from '@/lib/api/places';
import type { Place, GetPlacesParams } from '@/types/place';

interface UsePlacesReturn {
  places: Place[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export function usePlaces(params?: GetPlacesParams): UsePlacesReturn {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlaces = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getPlaces(params);
      setPlaces(response.places);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load places');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPlaces();
  }, [params?.page, params?.page_size, params?.type_key, params?.search, params?.min_rating]);

  return {
    places,
    loading,
    error,
    refetch: fetchPlaces,
  };
}

