'use client'

import { useState } from 'react'
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/20/solid'

import { Menu } from '@headlessui/react'
import ButtonCircle from '../ui/button-circle';
import ArrowButton from '../ui/arrow-button'
import BarIcon from './BarIcon'
import Logo from './Logo';

// HeaderNav component
// This component renders the header navigation bar with a logo, date display, and various action buttons.
//// It includes a mobile menu toggle, navigation buttons for the calendar, and a dropdown for calendar views. NOT INITIALIZED
export default function HeaderNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [activeView, setActiveView] = useState<'month' | 'week' | 'day' | 'year' | 'schedule'>('month');


  return (
    <header className="h-18 z-10 bg-off-white" style={{ fontFamily: 'var(--font-poppins)' }}>
      <nav className="flex items-center justify-between px-4 py-2 min-h-2 max-w-screen shadow-md">
        
        {/* LEFT SECTION */}
        <div className="flex items-center gap-4 flex-shrink-0">
          
          {/* Mobile Menu Toggle */}
          <BarIcon></BarIcon>

          {/* Logo */}
          <Logo></Logo>

          {/* Today Button */}
          <ButtonCircle
          >
            Today
          </ButtonCircle>

          {/* Arrow Buttons */}
          <div className="flex items-center">
            <ArrowButton> </ArrowButton>
          </div>
        </div>

        {/* DATE DISPLAY */}
        <div className="flex-1 ml-8 text-green-800 text-lg font-medium">
          {activeView === 'schedule' ? (() => {
            const start = new Date();
            const end = new Date();
            end.setFullYear(start.getFullYear() + 1);

            const formatMonthYear = (date: Date) =>
              date.toLocaleDateString(undefined, {
                month: 'long',
                year: 'numeric',
              });

            return `${formatMonthYear(start)} – ${formatMonthYear(end)}`;
          })() : new Date().toLocaleDateString(undefined, {
            ...(activeView === 'day' && {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              weekday: 'long',
            }),
            ...(activeView === 'week' && {
              year: 'numeric',
              month: 'long',
            }),
            ...(activeView === 'month' && {
              year: 'numeric',
              month: 'long',
            }),
            ...(activeView === 'year' && {
              year: 'numeric',
            }),
          })}
        </div>


        {/* RIGHT SECTION */}
        <div className="flex items-center gap-4 flex-shrink-0">

          {/* Calendar View Dropdown */}
           {/* ⬇️ View Dropdown with active state */}
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="inline-flex items-center gap-1 rounded-[2rem] border border-gray-600 px-4 py-2 text-sm capitalize hover:bg-green-50 transition-colors duration-300 ease-in-out">
              {activeView}
              <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
            </Menu.Button>

            <Menu.Items className="absolute mt-2 w-28 origin-top-right rounded-md text-white bg-green-800 shadow-lg ring-opacity-5 focus:outline-none z-50">
              <div className="p-1">
                {['month', 'week', 'day', 'year', 'schedule'].map((view) => (
                  <Menu.Item key={view}>
                    {({ active }) => (
                      <button
                        onClick={() => {
                          setActiveView(view as 'month' | 'week' | 'day' | 'year' | 'schedule') // 2️⃣ Update state
                          window.dispatchEvent(
                            new CustomEvent('calendar:view', { detail: view })
                          )
                        }}
                        className={`${
                          active || activeView === view
                            ? 'bg-green-50 text-green-950 rounded'
                            : ''
                        } w-full text-left px-3 py-2 text-sm capitalize rounded transition-colors duration-300 ease-in-out hover:py-2`}
                      >
                        {view}
                      </button>
                    )}
                  </Menu.Item>
                ))}
              </div>
            </Menu.Items>
          </Menu>


          {/* Action Icons */}
          <div className="relative group inline-block">
            <button
              className="p-2 bg-white hover:bg-green-50 transition-colors duration-300 ease-in-out rounded-full"
            >
            <MagnifyingGlassIcon className="h-5 w-5 text-gray-700" />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2
                            hidden group-hover:block bg-gray-700 text-white text-[10px]
                            px-2 py-1.5 rounded whitespace-nowrap z-10 shadow-lg">
              Search Button
            </div>
          </div>

          <div className="relative group inline-block">
            <button
              className="p-2 bg-white hover:bg-green-50 transition-colors duration-300 ease-in-out rounded-full"
            >
            <ClipboardDocumentListIcon className="h-5 w-5 text-gray-700" />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2
                            hidden group-hover:block bg-gray-700 text-white text-[10px]
                            px-2 py-1.5 rounded whitespace-nowrap z-10 shadow-lg">
              Meeting List
            </div>
          </div>
          
          <div className="relative group inline-block">
            <button
              className="p-2 bg-white hover:bg-green-50 transition-colors duration-300 ease-in-out rounded-full"
            >
            <Cog6ToothIcon className="h-5 w-5 text-gray-700" />
            </button>
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2
                            hidden group-hover:block bg-gray-700 text-white text-[10px]
                            px-2 py-1.5 rounded whitespace-nowrap z-10 shadow-lg">
              Settings
            </div>
          </div>

        </div>
      </nav>
    </header>
  )
}
