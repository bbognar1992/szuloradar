'use client';

import Image from 'next/image';

interface SearchAndFiltersProps {
  search: string;
  onSearchChange: (value: string) => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const filters = [
  { key: 'all', label: 'Összes' },
  { key: 'kávézó', label: '☕ Kávézó' },
  { key: 'étterem', label: '🍽️ Étterem' },
  { key: 'konditerem', label: '💪 Edzőterem' },
  { key: 'szállás', label: '🏨 Szállás' },
];

export default function SearchAndFilters({
  search,
  onSearchChange,
  activeFilter,
  onFilterChange,
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

        {/* Search Box */}
        <div className="flex-1 w-full lg:w-auto lg:max-w-sm relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400 group-focus-within:text-teal-500 transition-colors duration-200"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Keresés hely név alapján..."
            aria-label="Keresés"
            className="search-input-hidden w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all duration-200 text-sm h-[46px]"
          />
        </div>

        {/* Filter Tabs */}
        <div className="filters-tabs flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200 flex-wrap justify-center lg:justify-start">
          {filters.map((filter) => (
            <button
              key={filter.key}
              type="button"
              onClick={() => onFilterChange(filter.key)}
              className={`filter-tab px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                activeFilter === filter.key
                  ? 'bg-white text-teal-600 shadow-sm active'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

