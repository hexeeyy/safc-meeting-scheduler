'use client'

import React from 'react';
import ButtonCircle from '../ui/button-circle';
import ArrowButton from '../ui/arrow-button';
import Logo from './Logo';
import ActionIcons from './ActionIcons';
import CalendarHeader from '../calendar/CalendarHeader';

export default function HeaderNav() {
  return (
    <header
      className="z-1 top-0 w-full backdrop-blur-md bg-white/80 transition-all duration-300 border-b-1 shadow-md"
      style={{ fontFamily: 'var(--font-poppins)' }}
    >
      <nav className="flex items-center justify-between px-6 py-3 max-w-screen">
        {/* LEFT SECTION */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <Logo />
          <ButtonCircle>Today</ButtonCircle>
          <ArrowButton />
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-6 flex-shrink-0">
          <CalendarHeader />
          <ActionIcons />
        </div>
      </nav>
    </header>
  );
}