'use client';

import React from 'react';
import Image from 'next/image';
import { CalendarClockIcon } from 'lucide-react';
import { safcLogoG } from '@/assets';

export default function Logo() {
  return (
    <>
      <style jsx global>{`
        @keyframes pulse-once {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        .animate-pulse-once {
          animation: pulse-once 1s ease-out;
        }
      `}</style>
      <div className="flex items-center gap-2 px-4">
        <div className="group relative flex items-center justify-center">
          <div className="absolute inset-0"></div>
          <CalendarClockIcon className="h-6 w-6 sm:h-7 sm:w-7 text-gray-900 dark:text-gray-100" />
        </div>
        <div className="relative group">
          <Image
            alt="South Asialink Finance Corporation Logo"
            src={safcLogoG}
            width={80}
            height={80}
            className="h-12 w-12 sm:h-16 sm:w-16 object-contain transform transition-transform duration-500 ease-out group-hover:scale-110 animate-pulse-once"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 to-green-600/20 dark:from-green-600/20 dark:to-green-700/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <span className="text-lg sm:text-xl font-bold text-gray-900 dark:text-gray-100 tracking-tight">
          Conference Room
        </span>
      </div>
    </>
  );
}