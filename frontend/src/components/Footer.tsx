'use client';

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white py-16 mt-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0YzAtMS4xLS45LTItMi0ySDI2Yy0xLjEgMC0yIC45LTIgMnYyNGMwIDEuMS45IDIgMiAyaDhjMS4xIDAgMi0uOSAyLTJWMzR6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20"></div>
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 px-6 text-sm relative z-10">
        {/* Logo Section */}
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-gradient-to-br from-yellow-400 to-orange-400 text-black w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg shadow-lg">
              S
            </div>
            <span className="text-xl font-extrabold">ServiceHub</span>
          </div>
          <p className="text-gray-400 leading-relaxed">
            Your trusted partner for all home services. Quality work, guaranteed satisfaction.
          </p>
        </div>

        {/* Services */}
        <div>
          <h3 className="font-extrabold mb-4 text-lg">Services</h3>
          <ul className="text-gray-400 space-y-2">
            <li>
              <Link href="/services/cleaning" className="hover:text-white transition-colors">
                Cleaning
              </Link>
            </li>
            <li>
              <Link href="/services/plumbing" className="hover:text-white transition-colors">
                Plumbing
              </Link>
            </li>
            <li>
              <Link href="/services/electrical" className="hover:text-white transition-colors">
                Electrical
              </Link>
            </li>
            <li>
              <Link href="/services/salon-spa" className="hover:text-white transition-colors">
                Salon & Spa
              </Link>
            </li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <h3 className="font-extrabold mb-4 text-lg">Company</h3>
          <ul className="text-gray-400 space-y-2">
            <li>
              <Link href="/about" className="hover:text-white transition-colors">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/careers" className="hover:text-white transition-colors">
                Careers
              </Link>
            </li>
            <li>
              <Link href="/partner" className="hover:text-white transition-colors">
                Partner With Us
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition-colors">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h3 className="font-extrabold mb-4 text-lg">Legal</h3>
          <ul className="text-gray-400 space-y-2">
            <li>
              <Link href="/privacy" className="hover:text-white transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="hover:text-white transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/refund" className="hover:text-white transition-colors">
                Refund Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400 relative z-10">
        <p>© {new Date().getFullYear()} ServiceHub. All rights reserved.</p>
      </div>
    </footer>
  );
}
