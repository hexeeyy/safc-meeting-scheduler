import React from 'react';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

export default function Footer() {
  return (
    <footer className="bg-green-800 text-white py-6 px-6 max-w-auto">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Company Info */}
        <div>
          <h2 className="text-xl font-bold mb-4">South Asialink Finance Corporation</h2>
          <p className="text-sm text-gray-300">
            Empowering Filipinos through responsible financing solutions.
            Serving communities across the Philippines since 2003.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
          <ul className="space-y-2 text-gray-300">
            <li><a href="/about" className="hover:text-white">About Us</a></li>
            <li><a href="/branches" className="hover:text-white">Branches</a></li>
            <li><a href="/services" className="hover:text-white">Loan Products</a></li>
            <li><a href="/careers" className="hover:text-white">Careers</a></li>
            <li><a href="/contact" className="hover:text-white">Contact</a></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
          <ul className="space-y-2 text-gray-300">
            <li className="flex items-center gap-2">
              <PhoneIcon className="h-5 w-5" /> <span>(02) 8370-2700</span>
            </li>
            <li className="flex items-center gap-2">
              <EnvelopeIcon className="h-5 w-5" /> <span>info@safc.com.ph</span>
            </li>
            <li className="flex items-start gap-2">
              <MapPinIcon className="h-5 w-5 mt-1" />
              <span>
                2nd Floor, Saint Francis Square, Julia Vargas Ave. cor. Bank Drive,<br />
                Ortigas Center, Mandaluyong City, Philippines
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="mt-8 text-center text-sm text-gray-400 border-t border-gray-700 pt-4">
        &copy; {new Date().getFullYear()} South Asialink Finance Corporation. All rights reserved.
      </div>
    </footer>
  );
}
