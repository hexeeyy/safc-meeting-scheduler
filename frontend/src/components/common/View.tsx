import React, { useState, useRef, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'

type CalendarView = 'month' | 'week' | 'day' | 'agenda' | 'work_week'

interface ViewProps {
  activeView: CalendarView
  setActiveView: (view: CalendarView) => void
}

export default function View({ activeView, setActiveView }: ViewProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="inline-flex items-center gap-1 rounded-[2rem] border border-gray-600 px-4 py-2 text-sm capitalize hover:bg-white transition-colors duration-300 ease-in-out"
      >
        {activeView}
        <ChevronDown className="h-4 w-4" aria-hidden="true" />
      </button>

      {dropdownOpen && (
        <div className="absolute mt-2 w-28 origin-top-right rounded-md text-white bg-green-800 shadow-lg ring-opacity-5 focus:outline-none z-50 p-1">
          {(['month', 'week', 'day', 'agenda', 'work_week'] as const).map((view) => (
            <button
              key={view}
              onClick={() => {
                setActiveView(view)
                setDropdownOpen(false)
                window.dispatchEvent(new CustomEvent('calendar:view', { detail: view }))
              }}
              className={`${
                activeView === view ? 'bg-green-50 text-green-950' : ''
              } w-full text-left px-3 py-2 text-sm capitalize rounded transition-colors duration-300 ease-in-out hover:bg-green-50 hover:text-green-950`}
            >
              {view}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
