'use client'

import React from 'react';
import ButtonCircle from '../ui/button-circle';
import ArrowButton from '../ui/arrow-button'
import BarIcon from './BarIcon'
import Logo from './Logo';
import ActionIcons from './ActionIcons';
import CalendarHeader from '../calendar/CalendarHeader';

export default function HeaderNav() {

  return (
    <header className="h-15 z-10" style={{ fontFamily: 'var(--font-poppins)' }}>
      <nav className="flex items-center justify-between px-2 min-h-1 max-w-screen">
        
        {/* LEFT SECTION */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <BarIcon></BarIcon>
          <Logo></Logo>
          <ButtonCircle
          >
            Today
          </ButtonCircle>

          {/* Arrow Buttons */}
          <div className="flex items-center">
            <ArrowButton> </ArrowButton>
          </div>
        </div>
        {/* RIGHT SECTION */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* DATE DISPLAY */}
          <CalendarHeader></CalendarHeader>
          {/* Action Icons */}
          <ActionIcons></ActionIcons>
        </div>
      </nav>
    </header>
  )
}
