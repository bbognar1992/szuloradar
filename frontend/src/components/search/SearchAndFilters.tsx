'use client';

import { memo } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import CityAutocomplete from './CityAutocomplete';
import FilterTabs from './FilterTabs';

interface SearchAndFiltersProps {
  activeFilter: string;
  onFilterChange: (filter: string) => void;
  city?: string;
  onCityChange: (city: string) => void;
  title?: string;
}

const SearchAndFilters = memo(function SearchAndFilters({
  activeFilter,
  onFilterChange,
  city,
  onCityChange,
  title,
}: SearchAndFiltersProps) {
  const pathname = usePathname();
  const showTitle = title || (pathname === '/recommendation' ? 'Ajánlás beküldése' : undefined);
  const showFilters = pathname !== '/recommendation';

  return (
    <div className="w-full max-w-7xl mx-auto mb-8 px-0 lg:px-4">
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-5 pb-4 lg:p-4 flex flex-col lg:flex-row items-center gap-4 lg:gap-6 mx-5 lg:mx-0">
        {/* Logo Section */}
        <div className="flex-shrink-0 pr-6 border-r border-gray-200 hidden lg:block">
          <Link href="/" className="cursor-pointer hover:opacity-80 transition-opacity">
            <Image
              src="/assets/logo2.png"
              alt="SzülőRadar"
              className="h-12 w-auto object-contain"
              width={120}
              height={48}
            />
          </Link>
        </div>

        {/* Mobile Logo */}
        <div className="lg:hidden w-full flex items-center gap-4 mb-4 border-b border-gray-200 pb-4">
          <Link href="/" className="cursor-pointer hover:opacity-80 transition-opacity flex-shrink-0">
            <Image
              src="/assets/logo2.png"
              alt="SzülőRadar"
              className="h-10 w-auto object-contain"
              width={100}
              height={40}
            />
          </Link>
          {showTitle && (
            <h1 className="text-xl font-bold text-gray-900 m-0">
              {showTitle}
            </h1>
          )}
        </div>

        {/* Right side: Title or Filters */}
        <div className="flex-1 flex flex-col lg:flex-row gap-3 lg:gap-4 w-full lg:w-auto min-w-0 items-stretch lg:items-start">
          {showTitle && !showFilters ? (
            <div className="hidden lg:flex flex-col w-full">
              <h1 className="text-2xl font-bold text-gray-900 m-0">
                {showTitle}
              </h1>
              {pathname === '/recommendation' && (
                <p className="text-gray-600 mt-2 mb-0">
                  Oszd meg velünk a kedvenc gyerekbarát helyedet!
                </p>
              )}
            </div>
          ) : showFilters ? (
            <>
              <CityAutocomplete
                city={city}
                onCityChange={onCityChange}
              />
              <FilterTabs
                activeFilter={activeFilter}
                onFilterChange={onFilterChange}
              />
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
});

export default SearchAndFilters;

