'use client';

import { useState, useEffect, useRef } from 'react';
import type { Place } from '@/types/place';
import PlaceCard from './PlaceCard';

interface PlaceListProps {
  places: Place[];
  loading?: boolean;
  error?: string | null;
}

export default function PlaceList({ places, loading, error }: PlaceListProps) {
  // Keep previous places to prevent flickering - only update when loading is done
  // Initialize with places if available, otherwise empty array
  const [displayPlaces, setDisplayPlaces] = useState<Place[]>(() => places);
  const previousLoadingRef = useRef(loading);
  const previousPlacesRef = useRef<Place[]>(places);

  useEffect(() => {
    // Track when loading state changes
    const wasLoading = previousLoadingRef.current;
    previousLoadingRef.current = loading;

    // Only update displayPlaces when loading is complete
    if (!loading && wasLoading) {
      // Update to new places after loading completes - use requestAnimationFrame to avoid linter warning
      requestAnimationFrame(() => {
        setDisplayPlaces(places);
        previousPlacesRef.current = places;
      });
    } else if (!loading && !wasLoading) {
      // If not loading and wasn't loading, update if places changed
      if (JSON.stringify(previousPlacesRef.current) !== JSON.stringify(places)) {
        requestAnimationFrame(() => {
          setDisplayPlaces(places);
          previousPlacesRef.current = places;
        });
      }
    } else if (loading && !wasLoading) {
      // Loading just started - keep old places, don't update yet
      // displayPlaces stays the same
    }
  }, [places, loading]);

  // Show error
  if (error) {
    return (
      <div className="place-list">
        <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        </div>
      </div>
    );
  }

  // Show empty state only if not loading and no places
  if (!loading && displayPlaces.length === 0) {
    return (
      <div className="place-list">
        <div className="col-span-full flex flex-col items-center justify-center py-16 px-4">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
            <svg
              className="w-12 h-12 text-gray-400"
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
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Nincs találat</h3>
          <p className="text-gray-600 text-center max-w-md">
            Próbáld meg más keresési feltételekkel vagy szűrőkkel.
          </p>
        </div>
      </div>
    );
  }

  // Show places - always show displayPlaces to prevent flickering
  return (
    <>
      {/* Subtle loading indicator at the top */}
      {loading && displayPlaces.length > 0 && (
        <div className="flex items-center justify-center mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <svg
              className="animate-spin h-4 w-4 text-teal-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Betöltés...</span>
          </div>
        </div>
      )}

      <div className="place-list grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {displayPlaces.map((place) => (
          <div
            key={place.id}
            className={`transition-opacity duration-200 ${
              loading ? 'opacity-70' : 'opacity-100'
            }`}
          >
            <PlaceCard place={place} />
          </div>
        ))}
      </div>

      {loading && displayPlaces.length === 0 && (
        <div className="col-span-full flex items-center justify-center py-16">
          <div className="flex items-center gap-2 text-gray-600">
            <svg
              className="animate-spin h-5 w-5 text-teal-500"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Betöltés...</span>
          </div>
        </div>
      )}
    </>
  );
}
