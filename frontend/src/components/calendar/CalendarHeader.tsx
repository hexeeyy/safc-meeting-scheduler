'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import View from '../common/View'
import DateView from './DateView'

export default function CalendarHeader() {
  const searchParams = useSearchParams()
  const router = useRouter()

  const [activeView, setActiveView] = useState<'month' | 'week' | 'day' | 'year' | 'schedule'>('month')

  // On mount: read from URL
  useEffect(() => {
    const viewFromUrl = searchParams.get('view')
    if (viewFromUrl && ['month', 'week', 'day', 'year', 'schedule'].includes(viewFromUrl)) {
      setActiveView(viewFromUrl as typeof activeView)
    }
  }, [searchParams])

  // On change: update URL
  const handleSetView = (view: typeof activeView) => {
    const params = new URLSearchParams(Array.from(searchParams.entries()))
    params.set('view', view)
    router.push(`?${params.toString()}`)
    setActiveView(view)
  }

  return (
    <div className="mr-2 flex items-center justify-between gap-2 px-4 py-2">
      <div className="flex items-center justify-between font-bold text-green-800 text-lg  px-4">
        <DateView activeView={activeView} />
      </div>
      <div className='flex items-center gap-4'>
        <View activeView={activeView} setActiveView={handleSetView} />
      </div>
    </div>
  )
}
