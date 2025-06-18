'use client'

import { useState } from 'react'
import {
  Bars3Icon,
} from '@heroicons/react/24/outline'
import {
  ChevronLeftIcon,
  ChevronRightIcon
} from '@heroicons/react/20/solid'
import Image from 'next/image'
import { logo } from '@/assets'

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
      <nav className="flex items-center justify-between px-4 py-2 max-w-screen">
        
        {/* LEFT SECTION */}
        <div className="flex items-center gap-4 flex-shrink-0">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="flex items-center justify-center rounded-full p-2.5 text-gray-700 hover:bg-gray-100 transition-colors">
            <span className="sr-only">Open main menu</span>
            <Bars3Icon className="size-6" />
          </button>
          <Image
            alt="Logo"
            src={logo}
            className="h-12 w-12 rounded-lg"
          />
          <span className="font-light text-black text-lg">Meeting Scheduler</span>

          {/* TODAY BUTTON (moved near logo) */}
          <button
            onClick={() => window.dispatchEvent(new CustomEvent("calendar:navigate", { detail: "TODAY" }))}
            className="text-sm px-4 py-2 rounded-4xl border border-black bg-white hover:bg-gray-100 ml-4">
            Today
          </button>

          {/* Arrow Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("calendar:navigate", { detail: "PREV" }))}
              className="p-2 rounded-full bg-white hover:bg-gray-100">
              <ChevronLeftIcon className="h-5 w-5 text-black" />
            </button>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent("calendar:navigate", { detail: "NEXT" }))}
              className="p-2 rounded-full bg-white hover:bg-gray-100">
              <ChevronRightIcon className="h-5 w-5 text-black" />
            </button>
          </div>
        </div>

        {/* CENTER SECTION */}
        <div className="flex-1 text-center text-black text-sm font-medium">
          {new Date().toLocaleDateString(undefined, {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-4 flex-shrink-0">
          {/* View Selectors */}
          <div className="flex items-center gap-2">
            {["month", "week", "day"].map((view) => (
              <button
                key={view}
                onClick={() => window.dispatchEvent(new CustomEvent("calendar:view", { detail: view }))}
                className="text-sm px-3 py-1 rounded bg-blue-100 hover:bg-blue-200 capitalize"
              >
                {view}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </header>
  )
}
