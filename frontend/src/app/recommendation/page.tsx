'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { createRecommendation } from '@/lib/api/recommendations';
import { getPlaceTypes, getAmenities, type PlaceType, type Amenity } from '@/lib/api/places';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function RecommendPage() {
  const { user, loading: authLoading, logout } = useAuth();
  const router = useRouter();
  const [placeTypes, setPlaceTypes] = useState<PlaceType[]>([]);
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    place_name: '',
    place_type_key: '',
    recommendation_text: '',
    maps_link: '',
    address: '',
    phone: '',
    amenity_keys: [] as string[],
  });

  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
      return;
    }

    const fetchData = async () => {
      try {
        const [types, amenitiesData] = await Promise.all([
          getPlaceTypes(),
          getAmenities(),
        ]);
        setPlaceTypes(types);
        setAmenities(amenitiesData);
      } catch (err) {
        console.error('Failed to load data:', err);
        setError('Nem sikerült betölteni az adatokat');
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchData();
    }
  }, [user, authLoading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setSubmitting(true);

    try {
      await createRecommendation({
        place_name: formData.place_name,
        place_type_key: formData.place_type_key,
        recommendation_text: formData.recommendation_text,
        maps_link: formData.maps_link || undefined,
        address: formData.address || undefined,
        phone: formData.phone || undefined,
        amenity_keys: formData.amenity_keys,
      });

      setSuccess(true);
      setFormData({
        place_name: '',
        place_type_key: '',
        recommendation_text: '',
        maps_link: '',
        address: '',
        phone: '',
        amenity_keys: [],
      });

      setTimeout(() => {
        router.push('/');
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Az ajánlás beküldése sikertelen volt');
    } finally {
      setSubmitting(false);
    }
  };

  const toggleAmenity = (amenityKey: string) => {
    setFormData((prev) => ({
      ...prev,
      amenity_keys: prev.amenity_keys.includes(amenityKey)
        ? prev.amenity_keys.filter((key) => key !== amenityKey)
        : [...prev.amenity_keys, amenityKey],
    }));
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
          <div className="w-full max-w-3xl mx-auto px-4 py-8">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Ajánlás beküldése
              </h1>
              <p className="text-gray-600 mb-8">
                Oszd meg velünk a kedvenc gyerekbarát helyedet!
              </p>

              {success && (
                <div className="mb-6 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg">
                  <p className="font-semibold">Köszönjük az ajánlást!</p>
                  <p className="text-sm">Az ajánlásodat átnézzük és hamarosan hozzáadjuk az oldalhoz.</p>
                </div>
              )}

              {error && (
                <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="place_name" className="block text-sm font-medium text-gray-700 mb-2">
                    Hely neve <span className="text-red-500">*</span>
                  </label>
                  <input
                    id="place_name"
                    type="text"
                    required
                    value={formData.place_name}
                    onChange={(e) => setFormData({ ...formData, place_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    placeholder="pl. Kávézó és Játszóház"
                  />
                </div>

                <div>
                  <label htmlFor="place_type_key" className="block text-sm font-medium text-gray-700 mb-2">
                    Hely típusa <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="place_type_key"
                    required
                    value={formData.place_type_key}
                    onChange={(e) => setFormData({ ...formData, place_type_key: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                  >
                    <option value="">Válassz típust...</option>
                    {placeTypes.map((type) => (
                      <option key={type.id} value={type.type_key}>
                        {type.icon} {type.display_name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                    Cím
                  </label>
                  <input
                    id="address"
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                    placeholder="pl. 9022 Győr, Apáca u. 4."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Telefonszám
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                      placeholder="pl. +36 20 123 4567"
                    />
                  </div>

                  <div>
                    <label htmlFor="maps_link" className="block text-sm font-medium text-gray-700 mb-2">
                      Google Maps link
                    </label>
                    <input
                      id="maps_link"
                      type="url"
                      value={formData.maps_link}
                      onChange={(e) => setFormData({ ...formData, maps_link: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all"
                      placeholder="https://maps.google.com/..."
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Szolgáltatások / Jellemzők
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {amenities.map((amenity) => (
                      <button
                        key={amenity.id}
                        type="button"
                        onClick={() => toggleAmenity(amenity.amenity_key)}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                          formData.amenity_keys.includes(amenity.amenity_key)
                            ? 'bg-teal-600 text-white border-2 border-teal-600'
                            : 'bg-gray-50 text-gray-700 border-2 border-gray-200 hover:border-teal-300'
                        }`}
                      >
                        {amenity.icon && <span className="mr-1">{amenity.icon}</span>}
                        {amenity.display_name}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label htmlFor="recommendation_text" className="block text-sm font-medium text-gray-700 mb-2">
                    Ajánlás szövege <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="recommendation_text"
                    required
                    rows={6}
                    value={formData.recommendation_text}
                    onChange={(e) => setFormData({ ...formData, recommendation_text: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all resize-none"
                    placeholder="Írd le, miért ajánlod ezt a helyet..."
                  />
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={submitting}
                    className="flex-1 bg-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    {submitting ? 'Küldés...' : 'Ajánlás beküldése'}
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push('/')}
                    className="px-6 py-3 border border-gray-300 rounded-xl font-semibold text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition-colors cursor-pointer"
                  >
                    Mégse
                  </button>
                </div>
              </form>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </>
  );
}

