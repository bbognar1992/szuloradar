'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import {
  getMyProfile,
  updateMyProfile,
  getMyChildren,
  createChild,
  updateChild,
  deleteChild,
} from '@/lib/api/users';
import type { User, Children, ChildrenCreate, ChildrenUpdate } from '@/types/auth';

export default function ProfilePage() {
  const { user: authUser, logout } = useAuth();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [children, setChildren] = useState<Children[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [parentCount, setParentCount] = useState(1);
  const [subscriptionType, setSubscriptionType] = useState('free');

  // Child form states
  const [editingChild, setEditingChild] = useState<Children | null>(null);
  const [childName, setChildName] = useState('');
  const [childBirthYear, setChildBirthYear] = useState<number | undefined>(undefined);
  const [showChildForm, setShowChildForm] = useState(false);

  useEffect(() => {
    if (!authUser) {
      router.push('/');
      return;
    }
    loadProfile();
  }, [authUser, router]);

  const loadProfile = async () => {
    try {
      setLoading(true);
      const profileData = await getMyProfile();
      setUser(profileData);
      setFirstName(profileData.first_name || '');
      setLastName(profileData.last_name || '');
      setPhone(profileData.phone || '');
      setParentCount(profileData.parent_count || 1);
      setSubscriptionType(profileData.subscription_type || 'free');

      const childrenData = await getMyChildren();
      setChildren(childrenData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hiba történt a profil betöltésekor');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      const updatedUser = await updateMyProfile({
        first_name: firstName || undefined,
        last_name: lastName || undefined,
        phone: phone || undefined,
        parent_count: parentCount,
        subscription_type: subscriptionType,
      });
      setUser(updatedUser);
      setSuccess('Profil sikeresen frissítve!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hiba történt a profil mentésekor');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveChild = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (editingChild) {
        await updateChild(editingChild.id, {
          name: childName,
          birth_year: childBirthYear,
        });
        setSuccess('Gyermek adatai sikeresen frissítve!');
      } else {
        await createChild({
          name: childName,
          birth_year: childBirthYear,
        });
        setSuccess('Gyermek sikeresen hozzáadva!');
      }
      await loadProfile();
      resetChildForm();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hiba történt a gyermek mentésekor');
    }
  };

  const handleDeleteChild = async (childId: string) => {
    if (!confirm('Biztosan törölni szeretnéd ezt a gyermeket?')) {
      return;
    }

    try {
      await deleteChild(childId);
      setSuccess('Gyermek sikeresen törölve!');
      await loadProfile();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Hiba történt a gyermek törlésekor');
    }
  };

  const handleEditChild = (child: Children) => {
    setEditingChild(child);
    setChildName(child.name);
    setChildBirthYear(child.birth_year);
    setShowChildForm(true);
  };

  const resetChildForm = () => {
    setEditingChild(null);
    setChildName('');
    setChildBirthYear(undefined);
    setShowChildForm(false);
  };

  if (loading) {
    return (
      <main className="main">
        <div className="w-full max-w-7xl mx-auto px-4">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
            <p className="text-center text-gray-600">Betöltés...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="main">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          {success && (
            <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Profile Form */}
          <form onSubmit={handleSaveProfile} className="space-y-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  Keresztnév
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                />
              </div>

              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Vezetéknév
                </label>
                <input
                  id="lastName"
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={user.email}
                disabled
                className="w-full px-4 py-3 border border-gray-300 rounded-xl bg-gray-50 text-gray-500 cursor-not-allowed"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                Telefonszám
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                placeholder="+36 20 123 4567"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="parentCount" className="block text-sm font-medium text-gray-700 mb-2">
                  Szülők száma
                </label>
                <input
                  id="parentCount"
                  type="number"
                  min="1"
                  value={parentCount}
                  onChange={(e) => setParentCount(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                />
              </div>

              <div>
                <label htmlFor="subscriptionType" className="block text-sm font-medium text-gray-700 mb-2">
                  Előfizetés típusa
                </label>
                <select
                  id="subscriptionType"
                  value={subscriptionType}
                  onChange={(e) => setSubscriptionType(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                >
                  <option value="free">Ingyenes</option>
                  <option value="premium">Prémium</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full md:w-auto px-6 py-3 bg-teal-500 text-white rounded-xl hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Mentés...' : 'Profil mentése'}
            </button>
          </form>

          {/* Children Section */}
          <div className="border-t border-gray-200 pt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Gyermekek</h2>
              <button
                type="button"
                onClick={() => {
                  resetChildForm();
                  setShowChildForm(true);
                }}
                className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all"
              >
                + Gyermek hozzáadása
              </button>
            </div>

            {showChildForm && (
              <form onSubmit={handleSaveChild} className="mb-6 p-4 bg-gray-50 rounded-xl">
                <h3 className="text-lg font-medium text-gray-800 mb-4">
                  {editingChild ? 'Gyermek szerkesztése' : 'Új gyermek'}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="childName" className="block text-sm font-medium text-gray-700 mb-2">
                      Név
                    </label>
                    <input
                      id="childName"
                      type="text"
                      required
                      value={childName}
                      onChange={(e) => setChildName(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    />
                  </div>
                  <div>
                    <label htmlFor="childBirthYear" className="block text-sm font-medium text-gray-700 mb-2">
                      Születési év
                    </label>
                    <input
                      id="childBirthYear"
                      type="number"
                      min="2000"
                      max={new Date().getFullYear()}
                      value={childBirthYear || ''}
                      onChange={(e) => setChildBirthYear(e.target.value ? parseInt(e.target.value) : undefined)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all"
                  >
                    {editingChild ? 'Mentés' : 'Hozzáadás'}
                  </button>
                  <button
                    type="button"
                    onClick={resetChildForm}
                    className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all"
                  >
                    Mégse
                  </button>
                </div>
              </form>
            )}

            {children.length === 0 ? (
              <p className="text-gray-500">Még nincs hozzáadva gyermek.</p>
            ) : (
              <div className="space-y-3">
                {children.map((child) => (
                  <div
                    key={child.id}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-xl"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{child.name}</p>
                      {child.birth_year && (
                        <p className="text-sm text-gray-600">Születési év: {child.birth_year}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleEditChild(child)}
                        className="px-3 py-1 text-sm bg-teal-500 text-white rounded-lg hover:bg-teal-600 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 transition-all"
                      >
                        Szerkesztés
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteChild(child.id)}
                        className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all"
                      >
                        Törlés
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
