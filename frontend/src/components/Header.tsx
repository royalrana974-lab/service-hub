'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="bg-gradient-to-br from-gray-900 to-black text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg shadow-md group-hover:shadow-lg transition-shadow">
            S
          </div>
          <span className="text-xl font-extrabold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
            ServiceHub
          </span>
        </Link>

        {/* Menu */}
        <nav className="hidden md:flex items-center gap-8">
          <Link
            href="/"
            className="text-gray-700 hover:text-black font-semibold transition-colors relative group"
          >
            Home
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            href="/services"
            className="text-gray-700 hover:text-black font-semibold transition-colors relative group"
          >
            Services
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            href="/bookings"
            className="text-gray-700 hover:text-black font-semibold transition-colors relative group"
          >
            My Bookings
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-black group-hover:w-full transition-all duration-300"></span>
          </Link>
        </nav>

        {/* Right Buttons */}
        <div className="flex items-center gap-3">
          <button className="hidden sm:block px-5 py-2 text-gray-700 hover:text-black font-semibold transition-colors">
            Provider Portal
          </button>
          <Link
            href="/admin"
            className="bg-gradient-to-r from-black to-gray-800 text-white px-5 py-2 rounded-lg font-semibold hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200"
          >
            Admin
          </Link>
        </div>
      </div>
    </header>
  );
}
