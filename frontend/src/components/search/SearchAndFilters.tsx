'use client';

import Image from 'next/image';
import CityAutocomplete from './CityAutocomplete';
import FilterTabs from './FilterTabs';

interface SearchAndFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  city?: string;
  onCityChange: (city: string) => void;
}

export default function SearchAndFilters({
  activeFilter,
  onFilterChange,
  city,
  onCityChange,
}: SearchAndFiltersProps) {
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

        {/* Input Fields Container */}
        <div className="flex-1 flex gap-4 w-full lg:w-auto min-w-0">
          <CityAutocomplete
            city={city}
            onCityChange={onCityChange}
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

