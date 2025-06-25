import React from 'react';
import {
  EnvelopeIcon,
  PhoneIcon,
  MapPinIcon,
} from '@heroicons/react/24/outline';

export default function Footer() {
  return (
    <footer className="relative bg-gradient-to-r from-green-800 to-teal-700 text-white py-10 px-6 overflow-hidden">
      {/* Decorative SVG Wave */}
      <svg
        className="absolute top-0 w-full h-24 text-green-900"
        preserveAspectRatio="none"
        viewBox="0 0 1440 320"
      >
        <path
          fill="currentColor"
          d="M0,160L48,176C96,192,192,224,288,224C384,224,480,192,576,181.3C672,171,768,192,864,192C960,192,1056,171,1152,160C1248,149,1344,149,1392,149L1440,149L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
        ></path>
      </svg>

      <div className="relative max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 pt-16">
        {/* Company Info */}
        <div className="transform transition-all duration-500 ease-in-out hover:scale-105">
          <h2 className="text-2xl font-bold mb-4 tracking-tight">South Asialink Finance Corporation</h2>
          <p className="text-sm text-gray-200 leading-relaxed">
            Empowering Filipinos through responsible financing solutions.
            Serving communities across the Philippines since 2003.
          </p>
        </div>

        {/* Navigation */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-teal-200">Quick Links</h3>
          <ul className="space-y-3 text-gray-200">
            {['About Us', 'Branches', 'Loan Products', 'Careers', 'Contact'].map((item, index) => (
              <li key={index}>
                <a
                  href={`/${item.toLowerCase().replace(' ', '-')}`}
                  className="flex items-center gap-2 text-sm hover:text-teal-300 transition-colors duration-300 group"
                >
                  <svg
                    className="w-4 h-4 transform transition-transform duration-300 group-hover:translate-x-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                  </svg>
                  {item}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-teal-200">Contact Us</h3>
          <ul className="space-y-4 text-gray-200">
            <li className="flex items-center gap-3 group">
              <PhoneIcon className="h-6 w-6 text-teal-300 group-hover:animate-pulse" />
              <span className="text-sm">(02) 8370-2700</span>
            </li>
            <li className="flex items-center gap-3 group">
              <EnvelopeIcon className="h-6 w-6 text-teal-300 group-hover:animate-pulse" />
              <span className="text-sm">info@safc.com.ph</span>
            </li>
            <li className="flex items-start gap-3 group">
              <MapPinIcon className="h-6 w-6 text-teal-300 mt-1 group-hover:animate-pulse" />
              <span className="text-sm leading-relaxed">
                2nd Floor, Saint Francis Square, Julia Vargas Ave. cor. Bank Drive,<br />
                Ortigas Center, Mandaluyong City, Philippines
              </span>
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="mt-12 text-center text-sm text-gray-300 border-t border-teal-900 pt-6">
        <svg
          className="inline-block w-6 h-6 mr-2 text-teal-300"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8c-1.657 0-3 1.343-3 3s1.343 3 3 3 3-1.343 3-3-1.343-3-3-3zm0 10c-3.313 0-6-2.687-6-6s2.687-6 6-6 6 2.687 6 6-2.687 6-6 6z"
          />
        </svg>
        © {new Date().getFullYear()} South Asialink Finance Corporation. All rights reserved.
      </div>
    </footer>
  );
}