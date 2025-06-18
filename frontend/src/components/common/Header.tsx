'use client'

import { useState } from 'react'
import {
  Bars3Icon,
} from '@heroicons/react/24/outline'
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
  Cog6ToothIcon,
  ClipboardDocumentListIcon,
} from '@heroicons/react/20/solid'
import Image from 'next/image'
import { logo, safcLogoG } from '@/assets'
import { Menu } from '@headlessui/react'
import ButtonCircle from '../ui/button-circle';
import ArrowButton from '../ui/arrow-button'

// HeaderNav component
// This component renders the header navigation bar with a logo, date display, and various action buttons.
//// It includes a mobile menu toggle, navigation buttons for the calendar, and a dropdown for calendar views. NOT INITIALIZED
export default function HeaderNav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const formattedDate = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <header className="h-18 bg-off-white" style={{ fontFamily: 'var(--font-poppins)' }}>
      <nav className="flex items-center justify-between px-4 py-2 min-h-2 max-w-screen shadow-md">
        
        {/* LEFT SECTION */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="relative group inline-block">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(true)}
              className="flex items-center justify-center rounded-full p-2.5 text-black hover:bg-gray-100 transition-colors"
            >
              <span className="sr-only">Open sidebar</span>
              <Bars3Icon className="size-6" />
            </button>

            {/* Tooltip below the button */}
            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2
                            hidden group-hover:block bg-gray-700 text-white text-[10px]
                            px-2 py-1.5 rounded whitespace-nowrap z-10 shadow-lg">
              Search Button
            </div>
          </div>

          <Image
            alt="South Asialink Finance Corporation Logo"
            src={safcLogoG} // correct path if in /public
            width={60} // adjust as needed
            height={60}
            className="h-20 w-20 object-contain"
            priority // optional: preload
          />
          <span className="font-medium text-black text-lg">Meeting Scheduler</span>
          
          {/* Today Button */}
          <ButtonCircle
          >
            Today
          </ButtonCircle>

          {/* Arrow Buttons */}
          <div className="flex items-center gap-2">
            <ArrowButton> </ArrowButton>
          </div>
        </div>

        {/* DATE DISPLAY */}
        <div className="flex-1 ml-2.5 text-black text-sm font-medium">
          {new Date().toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* Calendar View Dropdown */}
          <Menu as="div" className="relative inline-block text-left">
            <Menu.Button className="inline-flex items-center gap-1 rounded-[2rem] border border-gray-600 px-4 py-2 text-sm capitalize hover:bg-gray-100">
              View
              <ChevronDownIcon className="h-4 w-4" aria-hidden="true" />
            </Menu.Button>

            <Menu.Items className="absolute right-0 mt-2 w-28 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50">
              <div className="p-1">
                {['month', 'week', 'day'].map((view) => (
                  <Menu.Item key={view}>
                    {({ active }) => (
                      <button
                        onClick={() =>
                          window.dispatchEvent(
                            new CustomEvent('calendar:view', { detail: view })
                          )
                        }
                        className={`${
                          active ? 'bg-blue-100' : ''
                        } w-full text-left px-3 py-1.5 text-sm capitalize rounded`}
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
              className="p-2 bg-white hover:bg-gray-100 rounded-full"
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
              className="p-2 bg-white hover:bg-gray-100 rounded-full"
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
              className="p-2 bg-white hover:bg-gray-100 rounded-full"
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
