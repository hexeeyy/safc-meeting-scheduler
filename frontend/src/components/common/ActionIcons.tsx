import { 
    ClipboardDocumentListIcon, 
    Cog6ToothIcon, 
    MagnifyingGlassIcon } from '@heroicons/react/20/solid'
import React from 'react'

export default function ActionIcons() {
  return (
    <div  className="flex items-center gap-2">
        <div className="relative group inline-block">
            <button
              className="p-2 bg-green-50 hover:bg-white transition-colors duration-300 ease-in-out rounded-full"
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
              className="p-2 bg-green-50 hover:bg-white transition-colors duration-300 ease-in-out rounded-full"
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
              className="p-2 bg-green-50 hover:bg-white transition-colors duration-300 ease-in-out rounded-full"
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
  )
}
