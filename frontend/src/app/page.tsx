'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePlaces } from '@/hooks/usePlaces';
import Header from '@/components/layout/Header';
import PlaceList from '@/components/places/PlaceList';
import SearchAndFilters from '@/components/search/SearchAndFilters';
import Footer from '@/components/layout/Footer';
import { getSavedPlaces } from '@/lib/api/interactions';

export default function Home() {
  const { user, loading: authLoading, logout } = useAuth();
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [city, setCity] = useState<string | undefined>(undefined);
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

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <div className="container">
        <Header user={user} onLogout={logout} />
        
        <SearchAndFilters
          activeFilter={typeFilter || 'all'}
          onFilterChange={(filter) => setTypeFilter(filter === 'all' ? undefined : filter)}
          city={city}
          onCityChange={(selectedCity) => setCity(selectedCity || undefined)}
        />

        <main className="main">
          <PlaceList
            places={places}
            loading={loading}
            error={error}
            savedIds={savedIds}
            onSavedChange={handleSavedChange}
          />
        </main>
      </div>

      <Footer />
    </>
  );
}
