'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { savePlace, unsavePlace, checkIfSaved } from '@/lib/api/interactions';
import type { Place } from '@/types/place';

interface PlaceCardProps {
  place: Place;
  onClick?: () => void;
  onUnsave?: (placeId: string) => void;
}

export default function PlaceCard({ place, onClick, onUnsave }: PlaceCardProps) {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      checkIfSaved(place.id)
        .then((result) => setIsSaved(result.is_saved))
        .catch(() => setIsSaved(false));
    }
  }, [user, place.id]);

  const handleSaveToggle = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;

    setSaving(true);
    try {
      if (isSaved) {
        await unsavePlace(place.id);
        setIsSaved(false);
        onUnsave?.(place.id);
      } else {
        await savePlace(place.id);
        setIsSaved(true);
      }
    } catch (err) {
      console.error('Failed to toggle save:', err);
      alert(isSaved ? 'Nem sikerült eltávolítani a listádból' : 'Nem sikerült hozzáadni a listához');
    } finally {
      setSaving(false);
    }
  };

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

  // Parse address: "9027 Győr, Apáca u. 4." -> ["9027, Győr", "Apáca u. 4."]
  const parseAddress = (address: string): [string, string] => {
    // Match pattern: "XXXX City, Street..."
    const match = address.match(/^(\d{4})\s+([^,]+),\s*(.+)$/);
    if (match) {
      const [, postalCode, city, street] = match;
      return [`${postalCode}, ${city}`, street];
    }
    // Fallback: if no comma, try to split by first space after postal code
    const fallbackMatch = address.match(/^(\d{4})\s+(.+)$/);
    if (fallbackMatch) {
      const [, postalCode, rest] = fallbackMatch;
      // Try to find city (usually first word after postal code)
      const parts = rest.split(/\s+/);
      if (parts.length > 1) {
        return [`${postalCode}, ${parts[0]}`, parts.slice(1).join(' ')];
      }
      return [`${postalCode}`, rest];
    }
    // If no pattern matches, return as is in first line
    return [address, ''];
  };

  const [addressLine1, addressLine2] = parseAddress(place.address);

  return (
    <div
      className="place-card group cursor-pointer h-full flex flex-col min-h-[280px]"
      onClick={onClick}
    >
      <div className="p-5 pb-4 flex flex-col flex-grow">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-600 transition-colors duration-300 line-clamp-2 flex-1 pr-2">
            {place.name}
          </h3>
          <div className="flex items-center gap-2 flex-shrink-0">
            {user && (
              <button
                onClick={handleSaveToggle}
                disabled={saving}
                className={`p-2 rounded-lg transition-colors ${
                  isSaved
                    ? 'bg-teal-100 text-teal-600 hover:bg-teal-200'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-teal-600'
                } disabled:opacity-50`}
                aria-label={isSaved ? 'Eltávolítás a listáról' : 'Hozzáadás a listához'}
                title={isSaved ? 'Eltávolítás a listáról' : 'Hozzáadás a listához'}
              >
                <svg
                  className="w-5 h-5"
                  fill={isSaved ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                  />
                </svg>
              </button>
            )}
            <span
              className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold ${
                typeColors[place.type_key] || 'bg-gray-100 text-gray-800'
              } whitespace-nowrap`}
            >
              {typeLabel}
            </span>
          </div>
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

        <div className="flex items-start gap-2 relative">
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
          <div className="text-sm text-gray-600 leading-relaxed flex-1">
            <div>{addressLine1}</div>
            {addressLine2 && <div>{addressLine2}</div>}
          </div>
          {place.amenities && place.amenities.length > 0 && (
            <div className="flex flex-col gap-1 items-end ml-2">
              {place.amenities.slice(0, 3).reverse().map((amenity) => (
                <span
                  key={amenity.id}
                  className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium bg-gray-50 text-gray-700 border border-gray-200 whitespace-nowrap"
                >
                  {amenity.display_name}
                </span>
              ))}
              {place.amenities.length > 3 && (
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium text-gray-500 whitespace-nowrap">
                  +{place.amenities.length - 3} több
                </span>
              )}
            </div>
          )}
        </div>

        <div className="mt-auto pt-3 border-t border-gray-100">
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
