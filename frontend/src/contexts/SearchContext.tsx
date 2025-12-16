'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

interface SearchContextType {
  typeFilter: number | undefined;
  city: string | undefined;
  setTypeFilter: (filter: number | undefined) => void;
  setCity: (city: string | undefined) => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: ReactNode }) {
  const [typeFilter, setTypeFilterState] = useState<number | undefined>(undefined);
  const [city, setCityState] = useState<string | undefined>(undefined);

  const setTypeFilter = useCallback((filter: number | undefined) => {
    setTypeFilterState(filter);
  }, []);

  const setCity = useCallback((city: string | undefined) => {
    setCityState(city);
  }, []);

  return (
    <SearchContext.Provider
      value={{
        typeFilter,
        city,
        setTypeFilter,
        setCity,
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}

