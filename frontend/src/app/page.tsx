"use client";
import { useEffect, useState } from "react";
import { api } from "@/api";

export default function Home() {
  const [categories, setCategories] = useState<any[]>([]);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [reviewCounts, setReviewCounts] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await api.get("/services");
        setCategories(res.data || []);
      } catch (err) {
        console.error("Error fetching categories:", err);
      }
    }
    fetchCategories();
  }, []);

  // Generate review counts on client side only to avoid hydration errors
  useEffect(() => {
    const counts: { [key: number]: number } = {};
    for (let i = 0; i < 4; i++) {
      counts[i] = Math.floor(Math.random() * 200) + 50;
    }
    setReviewCounts(counts);
  }, []);

  const displayedCategories = showAllCategories ? categories : categories.slice(0, 8);

  return (
    <main className="w-full">

      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-gray-50 via-white to-blue-50 py-20">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMwMDAiIGZpbGwtb3BhY2l0eT0iMC4wMyI+PHBhdGggZD0iTTM2IDM0YzAtMS4xLS45LTItMi0ySDI2Yy0xLjEgMC0yIC45LTIgMnYyNGMwIDEuMS45IDIgMiAyaDhjMS4xIDAgMi0uOSAyLTJWMzR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          
          {/* LEFT TEXT */}
          <div className="flex flex-col justify-center">
            <span className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-4 py-2 text-sm font-bold rounded-full shadow-lg w-fit mb-6">
              #1 Home Services Platform
            </span>

            <h1 className="text-5xl md:text-6xl font-extrabold mt-4 leading-tight bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent">
              Expert Services <br /> At Your Doorstep
            </h1>

            <p className="mt-6 text-gray-600 text-lg leading-relaxed">
              From home cleaning to electrical repairs — book trusted professionals
              in minutes. Quality service, guaranteed satisfaction.
            </p>

            <div className="flex flex-wrap gap-4 mt-8">
              <button className="group bg-gradient-to-r from-black to-gray-800 text-white px-8 py-4 rounded-lg font-semibold shadow-xl hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
                Book a Service
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>

              <button className="px-8 py-4 border-2 border-gray-900 rounded-lg font-semibold hover:bg-gray-900 hover:text-white transition-all duration-300 transform hover:-translate-y-1">
                Become a Provider
              </button>
            </div>
          </div>

          {/* RIGHT CARD STACK */}
          <div className="relative">
            <div className="absolute top-8 left-8 w-full h-full bg-gradient-to-br from-yellow-300 to-orange-300 rounded-2xl opacity-20 blur-xl"></div>

            <div className="relative bg-white rounded-2xl p-8 space-y-4 shadow-2xl border border-gray-100">
              {[
                { icon: "✓", text: "Verified Professionals", color: "from-green-400 to-emerald-500" },
                { icon: "⚡", text: "Same Day Service", color: "from-blue-400 to-cyan-500" },
                { icon: "⭐", text: "4.8★ Average Rating", color: "from-yellow-400 to-orange-500" },
                { icon: "🛡️", text: "Satisfaction Guaranteed", color: "from-purple-400 to-pink-500" },
              ].map((item, index) => (
                <div key={index} className="group border-2 border-gray-100 rounded-xl p-5 flex items-center gap-4 hover:border-gray-300 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-lg flex items-center justify-center text-white text-xl font-bold shadow-md group-hover:scale-110 transition-transform`}>
                    {item.icon}
                  </div>
                  <span className="font-semibold text-gray-800">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* STATS BAR */}
      <section className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMS4xLS45LTItMi0ySDI2Yy0xLjEgMC0yIC45LTIgMnYyNGMwIDEuMS45IDIgMiAyaDhjMS4xIDAgMi0uOSAyLTJWMzR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 text-center gap-8 relative z-10">
          <div className="transform hover:scale-110 transition-transform duration-300">
            <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">50K+</h2>
            <p className="text-gray-300 mt-2 font-medium">Happy Customers</p>
          </div>
          <div className="transform hover:scale-110 transition-transform duration-300">
            <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">2000+</h2>
            <p className="text-gray-300 mt-2 font-medium">Service Providers</p>
          </div>
          <div className="transform hover:scale-110 transition-transform duration-300">
            <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">100+</h2>
            <p className="text-gray-300 mt-2 font-medium">Services Offered</p>
          </div>
          <div className="transform hover:scale-110 transition-transform duration-300">
            <h2 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">4.8★</h2>
            <p className="text-gray-300 mt-2 font-medium">Average Rating</p>
          </div>
        </div>
      </section>

      {/* BROWSE BY CATEGORY (DYNAMIC) */}
      <section className="max-w-6xl mx-auto px-6 py-20 bg-white">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Browse by Category</h2>
            <p className="text-gray-600 mt-2">Explore our wide range of professional services</p>
          </div>
          {categories.length > 8 && (
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="text-sm font-semibold text-gray-700 hover:text-black transition-colors flex items-center gap-1 group"
            >
              {showAllCategories ? "Show Less" : "View All"}
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-4">
          {categories.length === 0 && (
            <div className="col-span-full text-center py-12">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
              <p className="text-gray-500 text-sm mt-4">Loading categories...</p>
            </div>
          )}

          {displayedCategories.map((cat: any, index: number) => (
            <div
              key={cat._id}
              className="group border-2 border-gray-200 rounded-xl p-5 hover:border-gray-900 hover:shadow-xl cursor-pointer text-center transition-all duration-300 transform hover:-translate-y-2 bg-white"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="w-16 h-16 mx-auto bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl mb-4 flex items-center justify-center text-2xl group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-md group-hover:shadow-lg">
                {cat.icon || "🔧"}
              </div>

              <p className="font-bold text-gray-900 group-hover:text-black">{cat.name}</p>
              <p className="text-xs text-gray-500 mt-1 group-hover:text-gray-700">View services →</p>
            </div>
          ))}
        </div>
      </section>


      {/* POPULAR SERVICES */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-6xl mx-auto px-6">

          <div className="flex justify-between items-center mb-10">
            <div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900">Popular Services</h2>
              <p className="text-gray-600 mt-2">Most booked services by our customers</p>
            </div>
            <button className="text-sm font-semibold text-gray-700 hover:text-black transition-colors flex items-center gap-1 group">
              View All
              <span className="group-hover:translate-x-1 transition-transform">→</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Deep Home Cleaning", price: "2499", time: "4-6 hours", rating: "4.8", icon: "🧹", color: "from-blue-400 to-cyan-500" },
              { title: "Bathroom Cleaning", price: "599", time: "1-2 hours", rating: "4.7", icon: "🚿", color: "from-green-400 to-emerald-500" },
              { title: "Pipe Leak Repair", price: "799", time: "1-5 hours", rating: "4.6", icon: "🔧", color: "from-orange-400 to-red-500" },
              { title: "Toilet Installation", price: "1299", time: "2-3 hours", rating: "4.8", icon: "🚽", color: "from-purple-400 to-pink-500" },
            ].map((s, i) => (
              <div key={i} className="group bg-white border-2 border-gray-200 rounded-2xl overflow-hidden hover:border-gray-900 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2">
                <div className={`h-48 bg-gradient-to-br ${s.color} flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300 relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity"></div>
                  <span className="relative z-10">{s.icon}</span>
                </div>

                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-lg text-gray-900 group-hover:text-black">{s.title}</h3>
                    <span className="bg-yellow-400 text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                      ⭐ {s.rating}
                    </span>
                  </div>

                  <p className="text-sm text-gray-600 mb-4">€{s.price} onwards • {s.time}</p>

                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">
                      {reviewCounts[i] !== undefined ? `${reviewCounts[i]} reviews` : 'Loading...'}
                    </span>

                    <button className="text-sm font-semibold bg-black text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors transform group-hover:scale-105">
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="text-center py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4">How It Works</h2>
          <p className="text-gray-600 text-lg mb-12">Get your services done in three simple steps</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { step: "01", title: "Choose a Service", desc: "Browse through our large selection of professional services.", icon: "🔍", color: "from-blue-500 to-cyan-500" },
              { step: "02", title: "Book & Schedule", desc: "Select your preferred date and time for service completion.", icon: "📅", color: "from-purple-500 to-pink-500" },
              { step: "03", title: "Get it Done", desc: "Our verified professionals arrive and complete the service.", icon: "✅", color: "from-green-500 to-emerald-500" },
            ].map((item, i) => (
              <div key={i} className="group relative">
                <div className="p-8 border-2 border-gray-200 rounded-2xl hover:border-gray-900 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 bg-white">
                  <div className={`w-20 h-20 mx-auto bg-gradient-to-br ${item.color} rounded-2xl flex items-center justify-center text-3xl mb-6 shadow-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    {item.icon}
                  </div>
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-yellow-400 to-orange-400 text-black text-sm font-bold px-4 py-1 rounded-full">
                    {item.step}
                  </div>
                  <h3 className="font-extrabold text-xl text-gray-900 mb-3">{item.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{item.desc}</p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-gray-300 text-4xl z-0">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA BOX */}
      <section className="relative bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white py-20 text-center overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMS4xLS45LTItMi0ySDI2Yy0xLjEgMC0yIC45LTIgMnYyNGMwIDEuMS45IDIgMiAyaDhjMS4xIDAgMi0uOSAyLTJWMzR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
        <div className="max-w-4xl mx-auto px-6 relative z-10">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">Ready to get started?</h2>
          <p className="text-gray-300 text-lg mb-8">Join thousands of users who trust our platform.</p>

          <button className="group bg-gradient-to-r from-yellow-400 to-orange-400 text-black px-8 py-4 rounded-lg font-bold text-lg shadow-2xl hover:shadow-yellow-400/50 transform hover:-translate-y-1 transition-all duration-300 flex items-center gap-2 mx-auto">
            Book Your First Service
            <span className="group-hover:translate-x-1 transition-transform">→</span>
          </button>
        </div>
      </section>

    </main>
  );
}
