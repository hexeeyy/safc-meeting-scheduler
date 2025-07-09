'use client';

import { useState, useCallback } from 'react';
import {
  Calendar,
  CheckCircle,
  XCircle,
  Search,
  Menu,
  X,
  ChevronRight,
  BarChart3,
  Bell,
  FileText,
} from 'lucide-react';
import { departments } from '@/components/calendar/calendarConstants';
import { CalendarEvent } from '@/components/calendar/ReusableCalendar';
import '@/app/globals.css';
import { useRouter } from 'next/navigation';

interface SidebarProps {
  events: CalendarEvent[];
  selectedDepartment: string;
  setSelectedDepartment: (dept: string) => void;
  onAddMeeting: (department: string) => void;
  onFilterEvents: (filter: 'upcoming' | 'done' | 'canceled' | 'all', searchQuery: string) => void;
}

export default function Sidebar({
  events,
  selectedDepartment,
  setSelectedDepartment,
  onFilterEvents,
}: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const router = useRouter();

  const toggleSidebar = () => setIsOpen(!isOpen);
  const today = new Date();

  const filteredEvents = events.filter((event) => {
    const matchesDepartment = selectedDepartment === 'All' || event.department === selectedDepartment;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesDepartment && matchesSearch;
  });

  const upcomingEvents = filteredEvents.filter((event) => event.start >= today && !event.canceled).slice(0, 2);
  const doneEvents = filteredEvents.filter((event) => event.end < today && !event.canceled).slice(0, 2);

  const filteredDepartments = ['All', ...departments];

  const handleSearchChange = useCallback(
    (value: string) => {
      setSearchQuery(value);
      onFilterEvents('all', value);
    },
    [onFilterEvents]
  );

  const toolItems = [
    { name: 'Meeting Analytics', icon: BarChart3, onClick: () => router.push('/analytics') },
    { name: 'Reminders', icon: Bell, onClick: () => router.push('/reminders') },
    { name: 'Report', icon: FileText, onClick: () => router.push('/report') },
  ];

  return (
    <div
      className={`flex flex-col h-screen bg-white/80 dark:bg-gray-800 transition-all duration-300 ease-in-out ${
        isOpen ? 'w-80' : 'w-16'
      } shadow-lg overflow-hidden border-r border-gray-200 dark:border-gray-600`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 shadow-lg">
        <button
          className="text-white hover:bg-white/10 p-2 rounded-full transition-all duration-200"
          onClick={toggleSidebar}
          aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
        <h2
          className={`text-lg font-semibold text-white transition-opacity duration-300 font-sans ${
            isOpen ? 'opacity-100' : 'opacity-0 w-0'
          }`}
        >
          Dashboard
        </h2>
      </div>

      {/* Content */}
      {isOpen && (
        <div className="p-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search meetings..."
              className="w-full pl-10 pr-10 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent font-sans placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300"
            />
            {searchQuery && (
              <button
                onClick={() => handleSearchChange('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 dark:text-gray-400"
                aria-label="Clear search"
              >
                <XCircle className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Department Filter */}
          <div>
            <select
              value={selectedDepartment}
              onChange={(e) => {
                setSelectedDepartment(e.target.value);
                onFilterEvents('all', searchQuery);
              }}
              className="w-full px-4 py-2 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border border-gray-300 dark:border-gray-600 rounded-xl shadow-sm focus:ring-2 focus:ring-emerald-500 transition-all duration-300"
            >
              {filteredDepartments.map((dept) => (
                <option key={dept} value={dept}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Divider */}
          <hr className="border-t border-gray-300 dark:border-gray-600 my-4" />

          {/* Upcoming Meetings */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <Calendar className="w-4 h-4 text-green-500 dark:text-green-400" />
                <span className="font-medium text-sm text-gray-900 dark:text-gray-100">Upcoming Meetings</span>
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200">
                {upcomingEvents.length}
              </span>
            </div>
            <div className="space-y-2">
              {upcomingEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-green-50 dark:hover:bg-green-800 transition"
                >
                  <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{event.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {event.start.toLocaleDateString()} •{' '}
                    {event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                    {event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{event.department}</p>
                </div>
              ))}
              {filteredEvents.filter((event) => event.start >= today && !event.canceled).length > 2 && (
                <button
                  onClick={() => onFilterEvents('upcoming', searchQuery)}
                  className="flex items-center text-xs text-green-600 dark:text-green-400 mt-1"
                >
                  Show More <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              )}
            </div>
          </div>

          {/* Done Meetings */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 dark:text-gray-400" />
                <span className="font-medium text-sm text-gray-900 dark:text-gray-100">Done Meetings</span>
              </div>
              <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 dark:bg-gray-600 text-gray-600 dark:text-gray-200">
                {doneEvents.length}
              </span>
            </div>
            <div className="space-y-2">
              {doneEvents.map((event) => (
                <div
                  key={event.id}
                  className="p-3 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg opacity-75 hover:bg-green-50 dark:hover:bg-green-800 transition"
                >
                  <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 truncate">{event.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {event.start.toLocaleDateString()} •{' '}
                    {event.start.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} -{' '}
                    {event.end.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{event.department}</p>
                </div>
              ))}
              {filteredEvents.filter((event) => event.end < today && !event.canceled).length > 2 && (
                <button
                  onClick={() => onFilterEvents('done', searchQuery)}
                  className="flex items-center text-xs text-green-600 dark:text-green-400 mt-1"
                >
                  Show More <ChevronRight className="w-4 h-4 ml-1" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tools */}
      <nav className="flex-1 px-4 space-y-2 mt-4">
        {isOpen && (
          <h4 className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide px-2 mb-1">
            Tools
          </h4>
        )}
        {toolItems.map(({ name, icon: Icon, onClick }) => (
          <button
            key={name}
            onClick={onClick}
            className={`flex items-center ${
              isOpen ? 'justify-between' : 'justify-center'
            } gap-3 text-gray-700 dark:text-gray-200 hover:bg-green-100 dark:hover:bg-green-900 px-4 py-3 rounded-lg transition-all duration-200 font-medium text-sm font-sans w-full text-left`}
          >
            <div className={`flex items-center ${isOpen ? 'gap-3' : 'gap-0'}`}>
              <Icon className="w-5 h-5 text-green-500 dark:text-green-400" />
              {isOpen && <span>{name}</span>}
            </div>
          </button>
        ))}
      </nav>
    </div>
  );
}
