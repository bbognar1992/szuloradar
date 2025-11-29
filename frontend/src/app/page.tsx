'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePlaces } from '@/hooks/usePlaces';
import Header from '@/components/layout/Header';
import PlaceList from '@/components/places/PlaceList';
import SearchAndFilters from '@/components/search/SearchAndFilters';
import Footer from '@/components/layout/Footer';

export default function Home() {
  const { user, loading: authLoading, logout } = useAuth();
  const [typeFilter, setTypeFilter] = useState<string | undefined>(undefined);
  const [city, setCity] = useState<string | undefined>(undefined);
  const { places, loading, error } = usePlaces({
    page: 1,
    page_size: 20,
    type_key: typeFilter,
    city: city || undefined,
  });

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
          <PlaceList places={places} loading={loading} error={error} />
        </main>
      </div>

      <Footer />
    </>
  );
}
