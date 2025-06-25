'use client'

import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import View from '../common/View'
import DateView from './DateView'
import ButtonCircle from '../ui/button-circle';

// Declare allowed calendar views
type CalendarView = 'month' | 'week' | 'day' | 'agenda' | 'work_week';
const allowedViews: CalendarView[] = ['month', 'week', 'day', 'agenda', 'work_week'];

export default function CalendarHeader() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [activeView, setActiveView] = useState<CalendarView>('month');
  const [date, setDate] = useState<Date>(new Date());

  // Sync view from URL on mount
  useEffect(() => {
    const viewFromUrl = searchParams.get('view');
    if (viewFromUrl && allowedViews.includes(viewFromUrl as CalendarView)) {
      setActiveView(viewFromUrl as CalendarView);
    }
  }, [searchParams]);

  // Handle view change and sync with URL
  const handleSetView = (view: CalendarView) => {
    if (view === activeView) return;
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set('view', view);
    router.push(`?${params.toString()}`);
    setActiveView(view);
  };

  // Handle navigation event (PREV, NEXT, TODAY)
  const handleNavigate = useCallback((action: 'PREV' | 'NEXT' | 'TODAY') => {
    let newDate = new Date(date);

    switch (action) {
      case 'TODAY':
        newDate = new Date(); // reset to today
        break;
      case 'PREV':
        switch (activeView) {
          case 'day':
            newDate.setDate(newDate.getDate() - 1);
            break;
          case 'week':
          case 'work_week':
            newDate.setDate(newDate.getDate() - 7);
            break;
          default:
            newDate.setMonth(newDate.getMonth() - 1);
            break;
        }
        break;
      case 'NEXT':
        switch (activeView) {
          case 'day':
            newDate.setDate(newDate.getDate() + 1);
            break;
          case 'week':
          case 'work_week':
            newDate.setDate(newDate.getDate() + 7);
            break;
          default:
            newDate.setMonth(newDate.getMonth() + 1);
            break;
        }
        break;
    }

    setDate(newDate);
  }, [date, activeView]);

  // Listen for custom navigation events
  useEffect(() => {
    const listener = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (['PREV', 'NEXT', 'TODAY'].includes(customEvent.detail)) {
        handleNavigate(customEvent.detail);
      }
    };

    window.addEventListener('calendar:navigate', listener);
    return () => window.removeEventListener('calendar:navigate', listener);
  }, [handleNavigate]);

  return (
    <div className="mr-2 flex items-center justify-between gap-2 px-4 py-2">
      <div className="flex items-center font-bold text-green-800 text-lg px-4">
        <DateView activeView={activeView} date={date} />
      </div>
      <div className="flex items-center gap-4">   
        <View activeView={activeView} setActiveView={handleSetView} />
      </div>
    </div>
  );
}
