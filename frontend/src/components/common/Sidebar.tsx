'use client';
import React, { useState } from 'react';
import { Bars3Icon, XMarkIcon, CalendarIcon, CheckCircleIcon, XCircleIcon, PlusCircleIcon, ChartBarIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('All');

  const toggleSidebar = () => setIsOpen(!isOpen);

  const departments = [
    'All',
    'Loans Department',
    'Marketing Department',
    'Repossessed Properties Department',
    'Treasury Department',
    'Customer Service',
    'Accounting & Finance/CFO',
    'Human Resource',
    'Risk & Compliance, Audit, Remedial',
    'IT & Operations',
    'Executive Leadership',
    'CSR (SAFC Heroes)',
  ];

  const navItems = [
    { name: 'Add Meeting', href: '#add', icon: PlusCircleIcon, count: null },
    { name: 'Upcoming Meetings', href: '#upcoming', icon: CalendarIcon, count: 12 },
    { name: 'Done Meetings', href: '#done', icon: CheckCircleIcon, count: 8 },
    { name: 'Canceled Meetings', href: '#canceled', icon: XCircleIcon, count: 3 },
    { name: 'Meeting Analytics', href: '#analytics', icon: ChartBarIcon, count: null },
  ];

  return (
    <>
      <style jsx global>{`
        .nav-item {
          transition: all 0.3s ease-in-out;
        }
        .nav-item:hover {
          transform: translateX(4px);
          box-shadow: 2px 2px 6px rgba(0, 0, 0, 0.15);
          background-color: rgba(209, 250, 229, 0.3);
        }
        .dark .nav-item:hover {
          background-color: rgba(16, 185, 129, 0.2);
        }
        .search-container {
          position: relative;
          transition: all 0.3s ease-in-out;
        }
        .search-container:focus-within .search-icon {
          transform: scale(1.1);
          color: #10b981;
        }
        .search-input {
          transition: all 0.3s ease;
        }
        .search-input:focus {
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
          border-color: #10b981;
        }
        .clear-button {
          transition: opacity 0.2s ease, transform 0.2s ease;
        }
        .clear-button:hover {
          transform: scale(1.1);
        }
        .dropdown-container {
          position: relative;
          transition: all 0.3s ease;
        }
        .dropdown {
          transition: all 0.3s ease;
          background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2310b981' class='w-4 h-4'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E");
          background-repeat: no-repeat;
          background-position: right 0.75rem center;
          background-size: 1rem;
        }
        .dropdown:focus {
          box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.2);
          border-color: #10b981;
        }
        .dropdown option {
          background-color: white;
          color: #1f2937;
        }
        .dark .dropdown option {
          background-color: #111827;
          color: #f3f4f6;
        }
      `}</style>
      <div className={`flex flex-col h-screen bg-green-50 transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'} overflow-hidden`}>
        <div className="flex items-center justify-between p-2 px-4 border-b shadow-sm rounded-r-2xl">
          <button
            className="text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-600 rounded-full p-2 transition-all duration-200"
            onClick={toggleSidebar}
            aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {isOpen ? (
              <XMarkIcon className="w-6 h-6 transform transition-transform duration-300 hover:rotate-90" />
            ) : (
              <Bars3Icon className="w-6 h-6 transform transition-transform duration-300 hover:rotate-90" />
            )}
          </button>
          <h2 className={`text-lg font-semibold text-green-900 dark:text-green-100 transition-opacity duration-300 font-poppins ${isOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
            Meetings
          </h2>
        </div>
        {isOpen && (
          <div className="p-4">
            <div className="search-container mb-4">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600 dark:text-green-400 search-icon transition-transform" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search meetings..."
                className="search-input w-full pl-10 pr-10 py-2 text-sm bg-white dark:bg-gray-900 text-green-900 dark:text-green-100 border border-green-300 dark:border-green-600 rounded-lg focus:ring-0 focus:border-green-500 font-poppins placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300"
                aria-label="Search meetings"
              />
              {searchQuery && (
                <button
                  className="clear-button absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 dark:text-green-400 opacity-70 hover:opacity-100"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                >
                  <XCircleIcon className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="dropdown-container">
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="dropdown w-full px-3 py-2 text-sm bg-white dark:bg-gray-900 text-green-900 dark:text-green-100 border border-green-300 dark:border-green-600 rounded-lg focus:ring-0 focus:border-green-500 font-poppins transition-all duration-300 appearance-none"
                aria-label="Filter by department"
              >
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        <nav className={`flex-1 p-3 space-y-1 ${isOpen ? 'opacity-100 w-64 translate-x-0' : 'opacity-0 w-0 translate-x-[-100%]'}`}>
          {navItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="nav-item flex items-center justify-between gap-2 text-green-800 dark:text-green-200 hover:text-green-900 dark:hover:text-green-100 px-3 py-2 rounded-md transition-all duration-200 font-medium text-sm font-poppins"
              aria-label={item.name}
            >
              <div className="flex items-center gap-2">
                <item.icon className="w-5 h-5" />
                {isOpen && <span>{item.name}</span>}
              </div>
              {isOpen && item.count !== null && (
                <span className="bg-green-200 dark:bg-green-700 text-green-900 dark:text-green-100 text-xs font-semibold px-2 py-0.5 rounded-full">
                  {item.count}
                </span>
              )}
            </a>
          ))}
        </nav>
      </div>
    </>
  );
}