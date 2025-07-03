'use client';

import { 
  BellAlertIcon,
  ClipboardDocumentListIcon, 
  Cog6ToothIcon, 
  MagnifyingGlassIcon 
} from '@heroicons/react/20/solid';
import { Bell, BellDotIcon, BellElectricIcon } from 'lucide-react';
import React from 'react';

export default function ActionIcons() {
  const handleMeetingListClick = () => {
    window.dispatchEvent(new CustomEvent('calendar:viewChange', { detail: 'agenda' }));
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative group inline-block">
        <button
          aria-label="Search"
          className="p-2 rounded-full bg-white dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-green-700 shadow transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          <Bell className="h-5 w-5 text-green-800 dark:text-green-200 group-hover:translate-x-0.5 transition-transform duration-300 ease-in-out" />
        </button>
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block bg-green-800 dark:bg-gray-900 text-green-100 dark:text-green-200 text-[10px] px-2 py-1.5 rounded whitespace-nowrap z-10 shadow-lg transition-all duration-200 ease-in-out">
          Notifications
        </div>
      </div>

      <div className="relative group inline-block">
        <button
          aria-label="Meeting List"
          onClick={handleMeetingListClick}
          className="p-2 rounded-full bg-white dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-green-700 shadow transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          <ClipboardDocumentListIcon className="h-5 w-5 text-green-800 dark:text-green-200 group-hover:translate-x-0.5 transition-transform duration-300 ease-in-out" />
        </button>
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block bg-green-800 dark:bg-gray-900 text-green-100 dark:text-green-200 text-[10px] px-2 py-1.5 rounded whitespace-nowrap z-10 shadow-lg transition-all duration-200 ease-in-out">
          Meeting List
        </div>
      </div>

      <div className="relative group inline-block">
        <button
          aria-label="Settings"
          className="p-2 rounded-full bg-white dark:bg-gray-800 hover:bg-green-100 dark:hover:bg-green-700 shadow transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          <Cog6ToothIcon className="h-5 w-5 text-green-800 dark:text-green-200 group-hover:translate-x-0.5 transition-transform duration-300 ease-in-out" />
        </button>
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block bg-green-800 dark:bg-gray-900 text-green-100 dark:text-green-200 text-[10px] px-2 py-1.5 rounded whitespace-nowrap z-10 shadow-lg transition-all duration-200 ease-in-out">
          Settings
        </div>
      </div>
    </div>
  );
}