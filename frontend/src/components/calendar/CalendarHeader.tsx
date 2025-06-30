'use client';

import { useEffect, useState } from 'react';
import View from '../common/View';
import DateView from './DateView';

type CalendarView = 'month' | 'week' | 'day' | 'agenda' | 'work_week';
const allowedViews: CalendarView[] = ['month', 'week', 'day', 'agenda', 'work_week'];

export default function CalendarHeader() {
  const [activeView, setActiveView] = useState<CalendarView>('month');
  const [date, setDate] = useState<Date>(new Date());

  const handleSetView = (view: CalendarView) => {
    if (view === activeView) return;
    setActiveView(view);

    const event = new CustomEvent('calendar:viewChange', { detail: view });
    window.dispatchEvent(event);
  };

  useEffect(() => {
    const onViewChange = (e: Event) => {
      const custom = e as CustomEvent<CalendarView>;
      if (allowedViews.includes(custom.detail)) {
        setActiveView(custom.detail);
      }
    };
    window.addEventListener('calendar:externalViewChange', onViewChange);
    return () => window.removeEventListener('calendar:externalViewChange', onViewChange);
  }, []);

  useEffect(() => {
    const onNavigate = (e: Event) => {
      const custom = e as CustomEvent<Date>;
      if (custom.detail instanceof Date && !isNaN(custom.detail.getTime())) {
        setDate(new Date(custom.detail));
      }
    };
    window.addEventListener('calendar:navigateDate', onNavigate);
    return () => window.removeEventListener('calendar:navigateDate', onNavigate);
  }, []);

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