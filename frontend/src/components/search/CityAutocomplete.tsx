'use client';

import { useState, useEffect, useRef } from 'react';
import { getCities } from '@/lib/api/places';

interface CityAutocompleteProps {
  city?: string;
  onCityChange: (city: string) => void;
}

export default function CityAutocomplete({
  city,
  onCityChange,
}: CityAutocompleteProps) {
  const [cities, setCities] = useState<string[]>([]);
  const [loadingCities, setLoadingCities] = useState(true);
  const [cityInput, setCityInput] = useState(city || '');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const cityInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const citiesList = await getCities();
        setCities(citiesList);
      } catch (error) {
        console.error('Failed to load cities:', error);
      } finally {
        setLoadingCities(false);
      }
    };
    fetchCities();
  }, []);

  useEffect(() => {
    setCityInput(city || '');
  }, [city]);

  // Filter cities based on input
  const filteredCities = cities.filter((cityName: string) =>
    cityName.toLowerCase().includes(cityInput.toLowerCase())
  );

  // Handle input change
  const handleCityInputChange = (value: string) => {
    setCityInput(value);
    setIsDropdownOpen(true);
    setHighlightedIndex(-1);
    // If input is cleared, clear the filter
    if (!value) {
      onCityChange('');
    }
  };

  // Handle city selection
  const handleCitySelect = (selectedCity: string) => {
    setCityInput(selectedCity);
    onCityChange(selectedCity);
    setIsDropdownOpen(false);
    setHighlightedIndex(-1);
    // Blur the input to close dropdown properly
    cityInputRef.current?.blur();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isDropdownOpen && filteredCities.length > 0) {
      setIsDropdownOpen(true);
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredCities.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : -1));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < filteredCities.length) {
          handleCitySelect(filteredCities[highlightedIndex]);
        } else if (filteredCities.length === 1) {
          handleCitySelect(filteredCities[0]);
        }
        break;
      case 'Escape':
        setIsDropdownOpen(false);
        setHighlightedIndex(-1);
        cityInputRef.current?.blur();
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        cityInputRef.current &&
        !cityInputRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex-1 min-w-0">
      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
        <svg
          className="w-5 h-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>
      <input
        ref={cityInputRef}
        type="text"
        value={cityInput}
        onChange={(e) => handleCityInputChange(e.target.value)}
        onFocus={() => {
          if (!isDropdownOpen) {
            setIsDropdownOpen(true);
          }
        }}
        onBlur={() => {
          // Only close dropdown, don't change focus state
          setTimeout(() => {
            if (!dropdownRef.current?.contains(document.activeElement)) {
              setIsDropdownOpen(false);
            }
          }, 200);
        }}
        onKeyDown={handleKeyDown}
        placeholder="Város keresése..."
        aria-label="Város keresése"
        className="w-full pl-12 pr-10 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 focus:bg-white transition-all duration-300 text-sm h-[46px]"
      />
      {cityInput && (
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setCityInput('');
            onCityChange('');
            cityInputRef.current?.blur();
          }}
          className="absolute inset-y-0 right-0 pr-4 flex items-center hover:text-gray-700 transition-colors cursor-pointer"
          aria-label="Város törlése"
        >
          <svg
            className="w-4 h-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      )}
      {!cityInput && (
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      )}

      {/* Dropdown */}
      {isDropdownOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-xl shadow-lg max-h-60 overflow-auto transition-all duration-300"
        >
          {loadingCities ? (
            <div className="px-4 py-3 text-sm text-gray-500">
              Betöltés...
            </div>
          ) : filteredCities.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-500">
              Nincs találat
            </div>
          ) : (
            <ul className="py-1">
              {filteredCities.map((cityName, index) => (
                <li
                  key={cityName}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleCitySelect(cityName);
                  }}
                  onMouseDown={(e) => {
                    e.preventDefault(); // Prevent input blur before click
                  }}
                  className={`px-4 py-2 cursor-pointer text-sm transition-colors ${
                    index === highlightedIndex
                      ? 'bg-teal-50 text-teal-700'
                      : 'text-gray-900 hover:bg-gray-50'
                  }`}
                  onMouseEnter={() => setHighlightedIndex(index)}
                >
                  {cityName}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}

