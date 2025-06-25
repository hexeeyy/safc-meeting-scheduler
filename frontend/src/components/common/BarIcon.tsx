import React from 'react'
import { Bars3Icon } from '@heroicons/react/24/outline'
import { useState } from 'react'

export default function BarIcon() {
  function setMobileMenuOpen(arg0: boolean): void {
    throw new Error('Function not implemented.')
  }

  return (
    <div className="relative group inline-block">
    <button
        type="button"
        onClick={() => setMobileMenuOpen(true)}
        className="flex items-center justify-center rounded-full p-2.5 text-black hover:bg-white transition-colors duration-300 ease-in-out"
    >
        <span className="sr-only">Open sidebar</span>
        <Bars3Icon className="size-6" />
    </button>

    {/* Tooltip below the button */}
    <div className="absolute top-full left-2/3 -translate-x-1/2 mt-2
                    hidden group-hover:block bg-gray-700 text-white text-[10px]
                    px-2 py-1.5 rounded whitespace-nowrap z-10 shadow-lg">
        Sidebar
    </div>
</div>
  )
}


