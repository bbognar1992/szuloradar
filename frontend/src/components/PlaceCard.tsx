// Place card component

import type { Place } from '@/types/place';

interface PlaceCardProps {
  place: Place;
}

export default function PlaceCard({ place }: PlaceCardProps) {
  const rating = typeof place.rating === 'string' ? parseFloat(place.rating) : place.rating;

  return (
    <div className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <h3 className="text-lg font-semibold">{place.name}</h3>
        {rating > 0 && (
          <span className="text-yellow-500">⭐ {rating.toFixed(1)}</span>
        )}
      </div>

      <p className="text-sm text-gray-600 mb-2">{place.type_display_name}</p>

      {place.address && (
        <p className="text-sm text-gray-500 mb-2">📍 {place.address}</p>
      )}

      {place.description && (
        <p className="text-sm text-gray-700 mb-3 line-clamp-2">{place.description}</p>
      )}

      {place.amenities && place.amenities.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {place.amenities.slice(0, 3).map((amenity) => (
            <span
              key={amenity.id}
              className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded"
            >
              {amenity.display_name}
            </span>
          ))}
          {place.amenities.length > 3 && (
            <span className="text-xs text-gray-500">
              +{place.amenities.length - 3} more
            </span>
          )}
        </div>
      )}

      {place.maps_link && (
        <a
          href={place.maps_link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-indigo-600 hover:text-indigo-800 mt-2 inline-block"
        >
          View on Maps →
        </a>
      )}
    </div>
  );
}

