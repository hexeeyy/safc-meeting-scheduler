'use client';

import { 
  ClipboardDocumentListIcon, 
  UserCircleIcon,  
} from '@heroicons/react/20/solid';
import { Bell } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React from 'react';

export default function ActionIcons() {
  const router = useRouter();

  const handleMeetingListClick = () => {
    window.dispatchEvent(new CustomEvent('calendar:viewChange', { detail: 'agenda' }));
  };

  const handleNotificationsClick = () => {
    router.push('/notifications');
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative group inline-block">
        <button
          aria-label="Notifications"
          onClick={handleNotificationsClick}
          className="p-2 rounded-full bg-white/80 dark:bg-gray-700/80 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 dark:hover:from-green-600 dark:hover:to-green-700 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          <Bell className="h-5 w-5 text-green-900 dark:text-gray-100 group-hover:text-white transition-transform duration-300 ease-in-out" />
        </button>
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white text-[10px] px-2 py-1.5 rounded whitespace-nowrap z-10 shadow-lg transition-all duration-200 ease-in-out">
          Notifications
        </div>
      </div>

      <div className="relative group inline-block">
        <button
          aria-label="Meeting List"
          onClick={handleMeetingListClick}
          className="p-2 rounded-full bg-white/80 dark:bg-gray-700/80 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 dark:hover:from-green-600 dark:hover:to-green-700 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          <ClipboardDocumentListIcon className="h-5 w-5 text-green-900 dark:text-gray-100 group-hover:text-white transition-transform duration-300 ease-in-out" />
        </button>
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white text-[10px] px-2 py-1.5 rounded whitespace-nowrap z-10 shadow-lg transition-all duration-200 ease-in-out">
          Meeting List
        </div>
      </div>

      <div className="relative group inline-block">
        <button
          aria-label="User"
          onClick={() => router.push('/login')}
          className="p-2 rounded-full bg-white/80 dark:bg-gray-700/80 hover:bg-gradient-to-r hover:from-green-500 hover:to-green-600 dark:hover:from-green-600 dark:hover:to-green-700 border border-gray-200 dark:border-gray-600 hover:shadow-lg transition-all duration-300 ease-in-out transform hover:scale-105"
        >
          <UserCircleIcon className="h-5 w-5 text-green-900 dark:text-gray-100 group-hover:text-white transition-transform duration-300 ease-in-out" />
        </button>
        <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block bg-gradient-to-r from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 text-white text-[10px] px-2 py-1.5 rounded whitespace-nowrap z-10 shadow-lg transition-all duration-200 ease-in-out">
          User
        </div>
      </div>
    </div>
  );
}