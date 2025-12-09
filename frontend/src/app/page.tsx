'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSearch } from '@/contexts/SearchContext';
import { usePlaces } from '@/hooks/usePlaces';
import PlaceList from '@/components/places/PlaceList';
import { getSavedPlaces } from '@/lib/api/interactions';

export default function Home() {
  const { user } = useAuth();
  const { typeFilter, city } = useSearch();
   // cache saved place ids to avoid per-card check calls
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const { places, loading, error } = usePlaces({
    page: 1,
    page_size: 20,
    type_key: typeFilter,
    city: city || undefined,
  });

  // Fetch saved places once when user is available
  useEffect(() => {
    if (!user) {
      setSavedIds(new Set());
      return;
    }
    let cancelled = false;
    getSavedPlaces(1, 200)
      .then((res) => {
        if (cancelled) return;
        const ids = new Set(res.saved_places.map((sp) => sp.place.id));
        setSavedIds(ids);
      })
      .catch(() => {
        if (!cancelled) setSavedIds(new Set());
      });
    return () => {
      cancelled = true;
    };
  }, [user]);

  const handleSavedChange = (placeId: string, saved: boolean) => {
    setSavedIds((prev) => {
      const next = new Set(prev);
      if (saved) {
        next.add(placeId);
      } else {
        next.delete(placeId);
      }
      return next;
    });
  };

  return (
    <main className="main">
      <PlaceList
        places={places}
        loading={loading}
        error={error}
        savedIds={savedIds}
        onSavedChange={handleSavedChange}
      />
    </main>
  );
}
