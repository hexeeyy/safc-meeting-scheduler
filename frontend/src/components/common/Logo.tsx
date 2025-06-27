'use client';

import React from 'react';
import Image from 'next/image';
import { safcLogoG } from '@/assets';

export default function Logo() {
  return (
    <>
      <style jsx global>{`
      `}</style>
      <div className="flex items-center gap-3 px-4 py-2">
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