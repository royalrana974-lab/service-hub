"use client";

import { useState, useEffect } from "react";
import { api } from "@/api";

export default function ServicesPage() {
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState("All Services");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [services, setServices] = useState([]);

  // Fetch categories
  useEffect(() => {
    async function loadCategories() {
      try {
        setLoading(true);
        setError(null);
        const res = await api.get("/services");
        setCategories(res.data || []);
      } catch (error: any) {
        console.error("Error loading categories:", error);
        setError(error.message || "Failed to load services");
        // Set empty array on error to prevent crashes
        setCategories([]);
      } finally {
        setLoading(false);
      }
    }
    loadCategories();
  }, []);

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
        {loading && (
          <div className="mt-4 text-gray-600">Loading services...</div>
        )}
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
              className="w-full outline-none"
            />
          </div>

          {/* CATEGORY TABS */}
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setSelected("All Services")}
              className={`px-4 py-2 border rounded text-sm ${
                selected === "All Services" ? "bg-black text-white" : ""
              }`}
            >
              All Services
            </button>

            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelected(cat.name)}
                className={`px-4 py-2 border rounded text-sm ${
                  selected === cat.name ? "bg-black text-white" : ""
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
        {selected !== "All Services" && (
          <div className="flex items-center gap-2 text-sm mb-2">
            <span className="text-gray-500">Filtered by:</span>
            <span className="bg-black text-white px-2 py-1 text-xs rounded">
              {selected} ✕
            </span>
          </div>
        )}

        <p className="text-sm text-gray-600">
          2 services found
        </p>
      </section>

      {/* SERVICE CARDS */}
      <section className="max-w-6xl mx-auto px-6 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* CARD 1 */}
          <div className="border rounded-lg">
            <div className="h-48 bg-gray-200 flex items-center justify-center text-5xl text-gray-400 font-bold">
              W
            </div>

            <div className="p-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Wiring & Electrical Work</h3>
                <span className="bg-black text-white text-xs px-2 py-1 rounded">
                  ★ 4.8
                </span>
              </div>

              <p className="text-gray-500 text-sm mt-1">
                Complete electrical wiring services for new installations and repairs.
              </p>

              <div className="flex justify-between items-center mt-4 text-sm">
                <span className="font-semibold">₹999 <span className="text-gray-500">onwards</span></span>
                <span className="text-gray-500">⏱ 2–4 hours</span>
              </div>

              <div className="flex justify-between items-center mt-3 text-sm">
                <span className="text-gray-600">203 reviews</span>
                <button className="underline text-sm">Book Now →</button>
              </div>
            </div>
          </div>

          {/* CARD 2 */}
          <div className="border rounded-lg">
            <div className="h-48 bg-gray-200 flex items-center justify-center text-5xl text-gray-400 font-bold">
              F
            </div>

            <div className="p-4">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold">Fan & Light Installation</h3>
                <span className="bg-black text-white text-xs px-2 py-1 rounded">
                  ★ 4.7
                </span>
              </div>

              <p className="text-gray-500 text-sm mt-1">
                Quick and safe installation of ceiling fans, lights, and fixtures.
              </p>

              <div className="flex justify-between items-center mt-4 text-sm">
                <span className="font-semibold">₹349 <span className="text-gray-500">onwards</span></span>
                <span className="text-gray-500">⏱ 30–60 mins</span>
              </div>

              <div className="flex justify-between items-center mt-3 text-sm">
                <span className="text-gray-600">445 reviews</span>
                <button className="underline text-sm">Book Now →</button>
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
