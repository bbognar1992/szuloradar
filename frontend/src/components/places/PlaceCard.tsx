'use client';

import type { Place } from '@/types/place';

interface PlaceCardProps {
  place: Place;
  onClick?: () => void;
}

export default function PlaceCard({ place, onClick }: PlaceCardProps) {
  const rating = typeof place.rating === 'string' ? parseFloat(place.rating) : place.rating;
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;

  const typeColors: Record<string, string> = {
    'kávézó': 'bg-amber-100 text-amber-800',
    'játszóház': 'bg-purple-100 text-purple-800',
    'étterem': 'bg-orange-100 text-orange-800',
    'konditerem': 'bg-blue-100 text-blue-800',
    'szállás': 'bg-green-100 text-green-800',
  };

  const typeLabel = place.type_display_name || place.type_key;

  return (
    <div
      className="place-card group cursor-pointer"
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors duration-300 line-clamp-2 flex-1 pr-2">
            {place.name}
          </h3>
          <span
            className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold ${
              typeColors[place.type_key] || 'bg-gray-100 text-gray-800'
            } whitespace-nowrap flex-shrink-0`}
          >
            {typeLabel}
          </span>
        </div>

        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center gap-1">
            {Array.from({ length: fullStars }).map((_, i) => (
              <span key={i} className="text-yellow-400 text-lg">⭐</span>
            ))}
            {hasHalfStar && fullStars < 5 && (
              <span className="text-yellow-400 text-lg">⭐</span>
            )}
            {Array.from({ length: 5 - fullStars - (hasHalfStar ? 1 : 0) }).map((_, i) => (
              <span key={i} className="text-gray-300 text-lg">⭐</span>
            ))}
          </div>
          <span className="text-lg font-semibold text-gray-900">{rating.toFixed(1)}</span>
        </div>

        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <svg
              className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0"
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
            <p className="text-sm text-gray-600 line-clamp-2">{place.address}</p>
          </div>

          {place.amenities && place.amenities.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100">
              {place.amenities.slice(0, 3).map((amenity) => (
                <span
                  key={amenity.id}
                  className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-50 text-gray-700 border border-gray-200"
                >
                  {amenity.display_name}
                </span>
              ))}
              {place.amenities.length > 3 && (
                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium text-gray-500">
                  +{place.amenities.length - 3} több
                </span>
              )}
            </div>
          )}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between">
            <span className="text-xs text-gray-500">Részletek megtekintése</span>
            <svg
              className="w-5 h-5 text-teal-500 group-hover:translate-x-1 transition-transform duration-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
