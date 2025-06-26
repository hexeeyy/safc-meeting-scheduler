'use client';

import React from 'react';
import Image from 'next/image';
import { safcLogoG } from '@/assets';

export default function Logo() {
  return (
    <>
      <style jsx global>{`
        .page-turn-effect {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }
        .page-turn-effect:hover {
          transform: translateY(-4px) rotateY(5deg) rotateZ(2deg);
          box-shadow: 
            8px 8px 16px rgba(0, 0, 0, 0.15),
            -2px 2px 8px rgba(0, 0, 0, 0.1),
            inset -4px -4px 8px rgba(255, 255, 255, 0.2);
        }
      `}</style>
      <div className="flex items-center gap-3 hover:bg-gradient-to-r from-green-50 to-teal-50 dark:from-gray-800 dark:to-gray-900 px-4 py-2 rounded-lg ">
        <div className="relative group">
          <Image
            alt="South Asialink Finance Corporation Logo"
            src={safcLogoG}
            width={80}
            height={80}
            className="h-16 w-16 object-contain transform transition-transform duration-500 ease-out group-hover:scale-110 animate-pulse-once"
            priority
          />
          <div className="absolute inset-0 bg-teal-500/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        </div>
        <span className="text-xl font-bold text-gray-800 dark:text-gray-100 tracking-tight">
          Meeting Scheduler
        </span>
        <div className="w-12 h-1 bg-gradient-to-r from-green-400 to-teal-500 rounded-full mt-1"></div>
      </div>
    </>
  );
}