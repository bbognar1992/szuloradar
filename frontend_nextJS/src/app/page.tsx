'use client';

import { useAuth } from '@/contexts/AuthContext';
import Link from 'next/link';

export default function Home() {
  const { user, loading, logout } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-12 px-4">
        <div className="bg-white rounded-lg shadow p-8">
          {user ? (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Welcome!</h1>
                <button
                  onClick={logout}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
              <div className="space-y-2">
                <p><strong>Email:</strong> {user.email}</p>
                {user.first_name && <p><strong>First Name:</strong> {user.first_name}</p>}
                {user.last_name && <p><strong>Last Name:</strong> {user.last_name}</p>}
                <p><strong>Subscription:</strong> {user.subscription_type}</p>
                <p><strong>User ID:</strong> {user.id}</p>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-6">
              <h1 className="text-3xl font-bold">Szuloradar</h1>
              <p className="text-gray-600">Please login or register to continue</p>
              <div className="flex gap-4 justify-center">
                <Link
                  href="/login"
                  className="px-6 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                >
                  Register
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
