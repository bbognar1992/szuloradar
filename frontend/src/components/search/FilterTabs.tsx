'use client';

import { useState, useEffect } from 'react';
import { getPlaceTypes, type PlaceType } from '@/lib/api/places';

interface FilterTabsProps {
  activeFilter: number | 'all';
  onFilterChange: (filter: number | 'all') => void;
}

export default function FilterTabs({
  activeFilter,
  onFilterChange,
}: FilterTabsProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [placeTypes, setPlaceTypes] = useState<PlaceType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPlaceTypes()
      .then((types) => {
        setPlaceTypes(types);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const filters = [
    { id: 'all' as const, label: 'Összes' },
    ...placeTypes.map((type: PlaceType) => ({
      id: type.id as number,
      label: `${type.icon || ''} ${type.display_name}`.trim(),
    })),
  ];

  const activeFilterLabel = filters.find(f => f.id === activeFilter)?.label || 'Összes';

  return (
    <div className="filters-tabs w-full lg:w-auto relative">
      {/* Mobile Dropdown */}
      <div className="lg:hidden relative">
        <button
          type="button"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-semibold text-gray-700 flex items-center justify-between hover:bg-gray-100 transition-colors"
        >
          <span>{activeFilterLabel}</span>
          <svg
            className={`w-5 h-5 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        
        {isDropdownOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsDropdownOpen(false)}
            />
            <div className="absolute z-20 mt-2 w-full bg-white rounded-xl border border-gray-200 shadow-lg overflow-hidden">
              {loading ? (
                <div className="px-4 py-3 text-sm text-gray-500">Betöltés...</div>
              ) : (
                filters.map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => {
                      onFilterChange(filter.id);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm font-semibold transition-colors ${
                      activeFilter === filter.id
                        ? 'bg-teal-50 text-teal-600'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))
              )}
            </div>
          </>
        )}
      </div>

      {/* Desktop Tabs */}
      <div className="hidden lg:block">
        <div className="filters-tabs flex items-center gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
          {loading ? (
            <div className="px-4 py-2 text-sm text-gray-500">Betöltés...</div>
          ) : (
            filters.map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() => onFilterChange(filter.id)}
                className={`filter-tab px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 whitespace-nowrap ${
                  activeFilter === filter.id
                    ? 'bg-white text-teal-600 shadow-sm active'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {filter.label}
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

