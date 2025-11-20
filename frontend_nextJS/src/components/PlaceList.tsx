// Place list component

import type { Place } from '@/types/place';
import PlaceCard from './PlaceCard';

interface PlaceListProps {
  places: Place[];
  loading?: boolean;
  error?: string | null;
}

export default function PlaceList({ places, loading, error }: PlaceListProps) {
  if (loading) {
    return <p className="text-gray-600">Loading places...</p>;
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
        {error}
      </div>
    );
  }

  if (places.length === 0) {
    return <p className="text-gray-600">No places found.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {places.map((place) => (
        <PlaceCard key={place.id} place={place} />
      ))}
    </div>
  );
}

