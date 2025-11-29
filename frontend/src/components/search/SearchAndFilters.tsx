'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import SearchInput from './SearchInput';
import CityAutocomplete from './CityAutocomplete';
import FilterTabs from './FilterTabs';

interface SearchAndFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  city?: string;
  onCityChange: (city: string) => void;
}

export default function SearchAndFilters({
  search,
  onSearchChange,
  activeFilter,
  onFilterChange,
  city,
  onCityChange,
}: SearchAndFiltersProps) {
  const [focusedField, setFocusedField] = useState<'search' | 'city' | null>(null);
  const cityInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="w-full max-w-7xl mx-auto mb-8 px-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 flex flex-col lg:flex-row items-center gap-6">
        {/* Logo Section */}
        <div className="flex-shrink-0 pr-6 border-r border-gray-200 hidden lg:block">
          <Image
            src="/assets/logo2.png"
            alt="SzülőRadar"
            className="h-12 w-auto object-contain"
            width={120}
            height={48}
          />
        </div>

        {/* Input Fields Container - Fixed width */}
        <div className="flex-1 flex gap-4 w-full lg:w-auto min-w-0">
          <SearchInput
            search={search}
            onSearchChange={onSearchChange}
            focusedField={focusedField}
            onFocusChange={setFocusedField}
            cityInputRef={cityInputRef}
            dropdownRef={dropdownRef}
            searchInputRef={searchInputRef}
          />
          <CityAutocomplete
            city={city}
            onCityChange={onCityChange}
            focusedField={focusedField}
            onFocusChange={setFocusedField}
            searchInputRef={searchInputRef}
          />
        </div>

        <FilterTabs
          activeFilter={activeFilter}
          onFilterChange={onFilterChange}
        />
      </div>
    </div>
  );
}

