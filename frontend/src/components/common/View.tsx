'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

type CalendarView = 'month' | 'week' | 'day' | 'agenda';

interface ViewProps {
  activeView: CalendarView;
  setActiveView: (view: CalendarView) => void;
}

export default function View({ activeView, setActiveView }: ViewProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  if (activeView === 'agenda') {
    return null;
  }

  return (
    <>
      <style jsx global>{`
        .dropdown-item {
          transition: all 0.2s ease-in-out;
        }
        .dropdown-item:hover {
          transform: translateX(4px);
          box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
        }
      `}</style>
      <div className="relative inline-block text-left" ref={dropdownRef}>
        <button
          onClick={() => setDropdownOpen(!dropdownOpen)}
          className="inline-flex items-center gap-2 rounded-full border text-sm font-medium border-gray-200 dark:border-gray-600 bg-white/80 dark:bg-gray-700/80 px-4 py-2 capitalize text-gray-900 dark:text-gray-100 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 dark:hover:from-green-600 dark:hover:to-green-700 hover:text-white transition-all duration-200 ease-in-out"
        >
          {activeView}
          <ChevronDown className="h-4 w-4 transform transition-transform duration-300 group-hover:rotate-180" aria-hidden="true" />
        </button>

        {dropdownOpen && (
          <div className="absolute mt-2 w-40 origin-top-right rounded-lg bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg shadow-lg ring-opacity-5 focus:outline-none z-10 p-1 transition-all duration-300 ease-in-out">
            {(['month', 'week', 'day'] as const).map((view) => (
              <button
                key={view}
                onClick={() => {
                  setActiveView(view);
                  setDropdownOpen(false);
                  window.dispatchEvent(new CustomEvent('calendar:viewChange', { detail: view }));
                }}
                className={`dropdown-item w-full text-left px-3 py-2 text-sm capitalize rounded-lg transition-all duration-200 ease-in-out font-medium
                  ${
                    activeView === view
                      ? 'bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 dark:hover:from-green-600 dark:hover:to-green-700 hover:text-white my-1'
                  }`}
              >
                {view}
              </button>
            ))}
          </div>
        )}
      </div>
    </>
  );
}