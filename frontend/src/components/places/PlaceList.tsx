'use client';

import type { Place } from '@/types/place';
import PlaceCard from './PlaceCard';

interface PlaceListProps {
  places: Place[];
  loading?: boolean;
  error?: string | null;
  onUnsave?: (placeId: string) => void;
  savedIds?: Set<string>;
  onSavedChange?: (placeId: string, saved: boolean) => void;
}

export default function PlaceList({ places, loading, error, onUnsave, savedIds, onSavedChange }: PlaceListProps) {
  // Always show current places immediately, no loading state handling

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

  // Show empty state if no places
  if (places.length === 0) {
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

  // Show places - always show current places immediately
  return (
    <div className="place-list">
      {places.map((place) => (
        <div key={place.id} className="h-full">
          <PlaceCard
            place={place}
            onUnsave={onUnsave}
            isSavedInitial={savedIds?.has(place.id)}
            onSavedChange={onSavedChange}
          />
        </div>
      ))}
    </div>
  );
}
