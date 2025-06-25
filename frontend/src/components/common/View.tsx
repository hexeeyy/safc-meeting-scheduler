'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';

type CalendarView = 'month' | 'week' | 'day' | 'agenda' | 'work_week';

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
      document.addEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
          className="inline-flex items-center gap-1 rounded-md border text-sm font-medium border-green-200 dark:border-green-700 bg-white dark:bg-gray-800 px-4 py-2 capitalize text-green-800 dark:text-green-200 hover:bg-green-50 dark:hover:bg-green-600 transition-all duration-200 ease-in-out"
        >
          {activeView}
          <ChevronDown className="h-4 w-4 transform transition-transform duration-300 rotate-0 hover:rotate-90" aria-hidden="true" />
        </button>

        {dropdownOpen && (
          <div className="absolute mt-2 w-40 origin-top-right rounded-md bg-green-50 dark:bg-gray-800 shadow-lg ring-opacity-5 focus:outline-none z-50 p-1 transition-all duration-300 ease-in-out pr-2">
            {(['month', 'week', 'day', 'agenda', 'work_week'] as const).map((view) => (
              <button
                key={view}
                onClick={() => {
                  setActiveView(view);
                  setDropdownOpen(false);
                  window.dispatchEvent(new CustomEvent('calendar:view', { detail: view }));
                }}
                className={`dropdown-item w-full text-left px-3 py-3 text-sm capitalize rounded transition-all duration-200 ease-in-out font-medium
                  ${
                    activeView === view
                      ? 'bg-green-200 dark:bg-green-700 text-green-900 dark:text-green-100'
                      : 'text-green-800 dark:text-green-200 hover:bg-green-200 dark:hover:bg-green-600 hover:text-green-900 dark:hover:text-green-100 mr-5 my-1.5'
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