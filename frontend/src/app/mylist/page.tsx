'use client';

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { getSavedPlaces, unsavePlace, type SavedPlace } from '@/lib/api/interactions';
import Header from '@/components/layout/Header';
import PlaceList from '@/components/places/PlaceList';
import Footer from '@/components/layout/Footer';
import type { Place } from '@/types/place';

export default function MyListPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [savedPlaces, setSavedPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
      return;
    }

    const fetchSavedPlaces = async () => {
      if (!user) return;

      setLoading(true);
      setError(null);
      try {
        const response = await getSavedPlaces(page, 20);
        setSavedPlaces(response.saved_places.map((sp) => sp.place));
        setTotal(response.total);
      } catch (err) {
        console.error('Failed to load saved places:', err);
        setError(err instanceof Error ? err.message : 'Nem sikerült betölteni a mentett helyeket');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchSavedPlaces();
    }
  }, [user, authLoading, router, page]);

  const savedIdSet = useMemo(() => new Set(savedPlaces.map((p) => p.id)), [savedPlaces]);

  const handleUnsave = async (placeId: string) => {
    try {
      await unsavePlace(placeId);
      setSavedPlaces((prev) => prev.filter((p) => p.id !== placeId));
      setTotal((prev) => prev - 1);
    } catch (err) {
      console.error('Failed to unsave place:', err);
      alert('Nem sikerült eltávolítani a helyet a listádból');
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Betöltés...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <>
      <div className="container">
        <Header user={user} onLogout={logout} />

        <main className="main">
          <div className="w-full max-w-7xl mx-auto mb-8 px-4">
            <div className="mb-6">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Listám</h1>
              <p className="text-gray-600">
                {total > 0
                  ? `${total} mentett hely${total > 1 ? '' : ''}`
                  : 'Még nincs mentett helyed'}
              </p>
            </div>

            {error && (
              <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {savedPlaces.length === 0 && !loading ? (
              <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-12 text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6 mx-auto">
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
                      d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                    />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Még nincs mentett helyed</h3>
                <p className="text-gray-600 mb-6">
                  Kezdj el helyeket menteni, hogy később könnyen megtaláld őket!
                </p>
                <button
                  onClick={() => router.push('/')}
                  className="inline-flex items-center px-6 py-3 bg-teal-600 text-white rounded-xl font-semibold hover:bg-teal-700 transition-colors cursor-pointer"
                >
                  Helyek böngészése
                </button>
              </div>
            ) : (
              <PlaceList
                places={savedPlaces}
                loading={loading}
                error={error}
                onUnsave={handleUnsave}
                savedIds={savedIdSet}
                onSavedChange={(id, saved) => {
                  if (!saved) {
                    setSavedPlaces((prev) => prev.filter((p) => p.id !== id));
                    setTotal((prev) => prev - 1);
                  }
                }}
              />
            )}
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}


