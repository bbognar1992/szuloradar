// Header component with auth status

import Link from 'next/link';
import type { User } from '@/types/auth';

interface HeaderProps {
  user: User | null;
  onLogout: () => void;
}

export default function Header({ user, onLogout }: HeaderProps) {
  return (
    <div className="bg-white rounded-lg shadow p-8 mb-6">
      {user ? (
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Welcome, {user.first_name || user.email}!</h1>
          </div>
          <button
            onClick={onLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="text-center space-y-6">
          <h1 className="text-3xl font-bold">Szuloradar</h1>
          <p className="text-gray-600">Discover kid-friendly places</p>
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
  );
}

