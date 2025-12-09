'use client';

import { useState, useEffect } from 'react';
import { api } from '@/api';

interface Category {
  _id: string;
  name: string;
  refId: string;
  icon?: string;
}

interface Service {
  _id: string;
  name: string;
  categoryId: string | Category;
  description?: string;
  icon?: string;
  price?: number;
  rating?: number;
  duration?: string;
  reviewsCount?: number;
}

export default function ServicesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [selected, setSelected] = useState<string>('All Services');
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [servicesLoading, setServicesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch categories
  useEffect(() => {
    async function loadCategories() {
      try {
        setError(null);
        const res = await api.get('/categories');
        setCategories(res.data || []);
      } catch (error: any) {
        console.error('Error loading categories:', error);
        setError(error.message || 'Failed to load categories');
        setCategories([]);
      }
    }
    loadCategories();
  }, []);

  // Fetch services based on selected category
  useEffect(() => {
    async function loadServices() {
      try {
        setServicesLoading(true);
        setError(null);

        let res;
        if (selected === 'All Services' || !selectedCategoryId) {
          // Fetch all services
          res = await api.get('/services');
        } else {
          // Fetch services by category
          res = await api.get(`/services/category/${selectedCategoryId}`);
        }

        setServices(res.data || []);
      } catch (error: any) {
        console.error('Error loading services:', error);
        setError(error.message || 'Failed to load services');
        setServices([]);
      } finally {
        setServicesLoading(false);
        setLoading(false);
      }
    }
    loadServices();
  }, [selected, selectedCategoryId]);

  return (
    <main className="w-full">
      {/* HEADER */}
      <section className="max-w-6xl mx-auto px-6 py-10">
        <h1 className="text-3xl font-bold">All Services</h1>
        <p className="text-gray-600">Find and book professional home services</p>
        {error && (
          <div className="mt-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            Error: {error}
          </div>
        )}
        {loading && <div className="mt-4 text-gray-600">Loading services...</div>}
      </section>

      {/* SEARCH + FILTER BAR */}
      <section className="border-t border-b py-4 bg-white">
        <div className="max-w-6xl mx-auto px-6 flex items-center gap-4 flex-wrap">
          {/* SEARCH BOX */}
          <div className="flex items-center border px-4 py-2 w-full md:w-80 rounded">
            <span className="text-gray-500 mr-2">🔍</span>
            <input
              type="text"
              placeholder="Search services..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full outline-none"
            />
          </div>

          {/* CATEGORY TABS */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                setSelected('All Services');
                setSelectedCategoryId(null);
              }}
              className={`px-4 py-2 border rounded text-sm transition-colors ${
                selected === 'All Services'
                  ? 'bg-black text-white'
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All Services
            </button>

            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => {
                  setSelected(cat.name);
                  setSelectedCategoryId(cat._id);
                }}
                className={`px-4 py-2 border rounded text-sm transition-colors ${
                  selected === cat.name
                    ? 'bg-black text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* FILTER TAG + COUNT */}
      <section className="max-w-6xl mx-auto px-6 py-6">
        {selected !== 'All Services' && (
          <div className="flex items-center gap-2 text-sm mb-2">
            <span className="text-gray-500">Filtered by:</span>
            <span
              className="bg-black text-white px-2 py-1 text-xs rounded cursor-pointer hover:bg-gray-800"
              onClick={() => {
                setSelected('All Services');
                setSelectedCategoryId(null);
              }}
            >
              {selected} ✕
            </span>
          </div>
        )}

        <p className="text-sm text-gray-600">Services loaded: {services.length}</p>
      </section>

      {/* SERVICE CARDS */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        {servicesLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
            <p className="text-gray-500 text-sm mt-4">Loading services...</p>
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No services found</p>
            {selected !== 'All Services' && (
              <button
                onClick={() => {
                  setSelected('All Services');
                  setSelectedCategoryId(null);
                }}
                className="mt-4 text-sm text-black underline hover:text-gray-700"
              >
                View all services
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {services
              .filter((service) => {
                if (!searchQuery) return true;
                const query = searchQuery.toLowerCase();
                return (
                  service.name.toLowerCase().includes(query) ||
                  service.description?.toLowerCase().includes(query)
                );
              })
              .map((service) => {
                const categoryName =
                  typeof service.categoryId === 'object' && service.categoryId !== null
                    ? (service.categoryId as Category).name
                    : 'Unknown Category';

                const firstLetter = service.name.charAt(0).toUpperCase();
                const displayPrice = service.price ? `€${service.price}` : 'Price on request';
                const displayRating = service.rating || 0;
                const displayDuration = service.duration || 'Duration varies';
                const displayReviews = service.reviewsCount || 0;

                return (
                  <div
                    key={service._id}
                    className="border rounded-lg hover:shadow-lg transition-shadow"
                  >
                    <div className="h-48 bg-gray-200 flex items-center justify-center text-5xl text-gray-400 font-bold">
                      {service.icon || firstLetter}
                    </div>

                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-semibold">{service.name}</h3>
                        <span className="bg-black text-white text-xs px-2 py-1 rounded">
                          ★ {displayRating.toFixed(1)}
                        </span>
                      </div>

                      <p className="text-gray-500 text-sm mt-1">
                        {service.description || 'Professional service available'}
                      </p>

                      <div className="flex justify-between items-center mt-4 text-sm">
                        <span className="font-semibold">
                          {displayPrice}{' '}
                          {service.price && <span className="text-gray-500">onwards</span>}
                        </span>
                        <span className="text-gray-500">⏱ {displayDuration}</span>
                      </div>

                      <div className="flex justify-between items-center mt-3 text-sm">
                        <span className="text-gray-600">
                          {displayReviews} {displayReviews === 1 ? 'review' : 'reviews'}
                        </span>
                        <button className="underline text-sm hover:text-gray-700 transition-colors">
                          Book Now →
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
      </section>
    </main>
  );
}
