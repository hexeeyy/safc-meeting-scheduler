'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import { Calendar, CheckCircle, XCircle, PlusCircle, BarChart2, Search, Menu, X } from 'lucide-react';
import { departments } from '@/components/calendar/calendarConstants';
import { CalendarEvent } from '@/components/calendar/ReusableCalendar';

interface SidebarProps {
  events: CalendarEvent[];
  selectedDepartment: string;
  setSelectedDepartment: (dept: string) => void;
  onAddMeeting: (department: string) => void;
  onFilterEvents: (filter: 'upcoming' | 'done' | 'canceled' | 'all', searchQuery: string) => void;
}

export default function Sidebar({ events, selectedDepartment, setSelectedDepartment, onAddMeeting, onFilterEvents }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter(); // Initialize router

  const toggleSidebar = () => setIsOpen(!isOpen);

  const today = new Date();

  // Filter events based on department and search query
  const filteredEvents = events.filter((event) => {
    const matchesDepartment = selectedDepartment === 'All' || event.department === selectedDepartment;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDepartment && matchesSearch;
  });

  const navItems = [
    {
      name: 'Upcoming Meetings',
      icon: Calendar,
      count: filteredEvents.filter((event) => event.start >= today && !event.canceled).length,
      onClick: () => onFilterEvents('upcoming', searchQuery),
    },
    {
      name: 'Done Meetings',
      icon: CheckCircle,
      count: filteredEvents.filter((event) => event.end < today && !event.canceled).length,
      onClick: () => onFilterEvents('done', searchQuery),
    },
    {
      name: 'Canceled Meetings',
      icon: XCircle,
      count: filteredEvents.filter((event) => event.canceled).length,
      onClick: () => onFilterEvents('canceled', searchQuery),
    },
    {
      name: 'Meeting Analytics',
      icon: BarChart2,
      count: null,
      onClick: () => {
        router.push('/analytics'); // Navigate to /analytics
      },
    },
  ];

  const filteredDepartments = ['All', ...departments];

  // Handle search input change with debouncing
  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value);
    onFilterEvents('all', value); // Update filtered events on search
  }, [onFilterEvents]);

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
        <div className="flex items-center justify-between p-2 px-2.5 bg-green-200 border-lg shadow-sm rounded-r-2xl">
          <button
            className="text-green-600 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-600 rounded-full p-2 transition-all duration-200"
            onClick={toggleSidebar}
            aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
          >
            {isOpen ? (
              <X className="w-6 h-6 transform transition-transform duration-300 hover:rotate-90" />
            ) : (
              <Menu className="w-6 h-6 transform transition-transform duration-300 hover:rotate-90" />
            )}
          </button>
          <h2 className={`text-lg mr-6 font-bold text-green-900 dark:text-green-100 transition-opacity duration-300 font-poppins ${isOpen ? 'opacity-100' : 'opacity-0 w-0'}`}>
            Tools
          </h2>
        </div>
        {isOpen && (
          <div className="p-4">
            <div className="search-container mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-green-600 dark:text-green-400 search-icon transition-transform" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search meetings..."
                className="search-input w-full pl-10 pr-10 py-2 text-sm bg-white dark:bg-gray-900 text-green-900 dark:text-green-100 border border-green-300 dark:border-green-600 rounded-lg focus:ring-0 focus:border-green-500 font-poppins placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300"
                aria-label="Search meetings"
              />
              {searchQuery && (
                <button
                  className="clear-button absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 dark:text-green-400 opacity-70 hover:opacity-100"
                  onClick={() => handleSearchChange('')}
                  aria-label="Clear search"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              )}
            </div>
            <div className="dropdown-container">
              <select
                value={selectedDepartment}
                onChange={(e) => {
                  setSelectedDepartment(e.target.value);
                  onFilterEvents('all', searchQuery); // Update filtered events on department change
                }}
                className="dropdown w-full px-3 py-2 text-sm bg-white dark:bg-gray-900 text-green-900 dark:text-green-100 border dark:border-green-600 rounded-lg focus:ring-0 focus: border-green-500 font-poppins transition-all duration-300 appearance-none"
                aria-label="Filter by department"
              >
                {filteredDepartments.map((dept) => (
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
            <button
              key={item.name}
              onClick={item.onClick}
              className="nav-item flex items-center justify-between gap-2 text-green-800 dark:text-green-200 hover:text-green-900 dark:hover:text-green-100 px-3 py-2 rounded-md transition-all duration-200 font-medium text-sm font-poppins w-full text-left"
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
            </button>
          ))}
        </nav>
      </div>
    </>
  );
}