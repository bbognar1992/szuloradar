'use client';

import { useAuth } from '@/contexts/AuthContext';
import { usePlaces } from '@/hooks/usePlaces';
import Header from '@/components/Header';
import PlaceList from '@/components/PlaceList';

export default function Home() {
  const { user, loading: authLoading, logout } = useAuth();
  const { places, loading, error } = usePlaces({ page: 1, page_size: 20 });

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-12 px-4">
        <Header user={user} onLogout={logout} />

        <div className="bg-white rounded-lg shadow p-8">
          <h2 className="text-2xl font-bold mb-6">Places</h2>
          <PlaceList places={places} loading={loading} error={error} />
        </div>
      </div>
    </div>
  );
}
