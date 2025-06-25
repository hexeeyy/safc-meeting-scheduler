'use client';

import React, { useState } from 'react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <style jsx global>{`
        .nav-item {
          transition: all 0.2s ease-in-out;
        }
        .nav-item:hover {
          transform: translateX(4px);
          box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
      <div
        className={`flex flex-col h-screen bg-green-50 dark:bg-gray-900 transition-all duration-300 ease-in-out${
          isOpen ? 'w-64' : 'w-16'
        } `}
      >
        {/* Toggle Button */}
        <div className="flex items-center justify-between p-2 px-4 border-green-200 dark:border-green-700 bg-green-100 dark:bg-gray-800 shadow">
          <button
            className="text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-600 rounded-full p-2 transition-all duration-200 ease-in-out"
            onClick={toggleSidebar}
          >
            {isOpen ? (
              <XMarkIcon className="w-6 h-6 transform transition-transform duration-300 rotate-0 hover:rotate-90" />
            ) : (
              <Bars3Icon className="w-6 h-6 transform transition-transform duration-300 rotate-0 hover:rotate-90" />
            )}
          </button>
          <h2
            className={`text-lg font-semibold text-green-900 dark:text-green-100 transition-opacity duration-300 ease-in-out ${
              isOpen ? 'opacity-100' : 'opacity-0 w-0'
            }`}
          >
            Menu
          </h2>
        </div>

        {/* Sidebar Content */}
        <nav
          className={`p-4 space-y-2 transition-all duration-300 ease-in-out ${
            isOpen ? 'opacity-100 w-64 translate-x-0' : 'opacity-0 w-0 translate-x-[-100%]'
          }`}
        >
          {[
            { name: 'Dashboard', href: '#' },
            { name: 'Calendar', href: '#' },
            { name: 'Settings', href: '#' },
            { name: 'Help', href: '#' },
          ].map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="nav-item block text-green-800 dark:text-green-200 hover:text-green-900 dark:hover:text-green-100 hover:bg-green-100 dark:hover:bg-green-700 px-3 py-2 rounded-md transition-all duration-200 ease-in-out font-medium"
            >
              {item.name}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}