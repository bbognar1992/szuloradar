'use client';

import { memo } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSearch } from '@/contexts/SearchContext';
import Header from './Header';
import Footer from './Footer';
import SearchAndFilters from '@/components/search/SearchAndFilters';

const ClientLayout = memo(function ClientLayout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const { typeFilter, city, setTypeFilter, setCity } = useSearch();

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
        {children}
      </div>
      <Footer />
    </>
  );
});

export default ClientLayout;

