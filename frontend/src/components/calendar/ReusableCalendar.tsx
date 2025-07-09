'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  Calendar,
  dateFnsLocalizer,
  Event as RBCEvent,
  NavigateAction,
  SlotInfo,
  View,
} from 'react-big-calendar';
import withDragAndDrop, { withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import './calendar.css';
import { CheckCircle2 } from 'lucide-react';
import FlipClock from '@/components/common/FlipClock';


const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { 'en-US': enUS },
});

export interface CalendarEvent extends RBCEvent {
  attendees: [];
  canceled: boolean;
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  department: string;
  meetingType: string;
}

interface CalendarProps {
  events: CalendarEvent[];
  date: Date;
  view: View;
  onNavigate: (newDate: Date) => void;
  onViewChange: (view: View) => void;
  onEventDrop: withDragAndDropProps<CalendarEvent>['onEventDrop'];
  onEventResize: withDragAndDropProps<CalendarEvent>['onEventResize'];
  onSelectSlot: (slotInfo: SlotInfo) => void;
  onSelectEvent: (event: CalendarEvent) => void;
  components?: {
    event?: React.ComponentType<import('react-big-calendar').EventProps<CalendarEvent>>;
  };
}

const allowedViews: View[] = ['month', 'week', 'day', 'agenda'];
const DnDCalendar = withDragAndDrop<CalendarEvent, object>(Calendar);

export default function ReusableCalendar({
  events,
  date,
  view,
  onNavigate,
  onViewChange,
  onEventDrop,
  onEventResize,
  onSelectSlot,
  onSelectEvent,
  components,
}: CalendarProps) {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const dateString = currentTime.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const handleNavigate = useCallback(
    (action: NavigateAction) => {
      let newDate = new Date(date);
      switch (action) {
        case 'PREV':
          if (view === 'day') newDate.setDate(newDate.getDate() - 1);
          else if (view === 'week') newDate.setDate(newDate.getDate() - 7);
          else newDate.setMonth(newDate.getMonth() - 1);
          break;
        case 'NEXT':
          if (view === 'day') newDate.setDate(newDate.getDate() + 1);
          else if (view === 'week') newDate.setDate(newDate.getDate() + 7);
          else newDate.setMonth(newDate.getMonth() + 1);
          break;
        case 'TODAY':
          newDate = new Date();
          break;
      }
      onNavigate(newDate);
      const event = new CustomEvent('calendar:navigateDate', { detail: newDate });
      window.dispatchEvent(event);
    },
    [date, view, onNavigate]
  );

  useEffect(() => {
    const navListener = (e: Event) => {
      const customEvent = e as CustomEvent<NavigateAction>;
      if (['PREV', 'NEXT', 'TODAY'].includes(customEvent.detail)) {
        handleNavigate(customEvent.detail);
      }
    };
    window.addEventListener('calendar:navigate', navListener);
    return () => window.removeEventListener('calendar:navigate', navListener);
  }, [handleNavigate]);

  useEffect(() => {
    const viewListener = (e: Event) => {
      const customEvent = e as CustomEvent<View>;
      if (allowedViews.includes(customEvent.detail)) {
        onViewChange(customEvent.detail);
      }
    };
    window.addEventListener('calendar:viewChange', viewListener);
    return () => window.removeEventListener('calendar:viewChange', viewListener);
  }, [onViewChange]);

  const getTextColor = (bg: string) => {
    if (!bg.startsWith('#') || bg.length !== 7) return '#000';
    const r = parseInt(bg.slice(1, 3), 16);
    const g = parseInt(bg.slice(3, 5), 16);
    const b = parseInt(bg.slice(5, 7), 16);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    return luminance > 0.6 ? '#000' : '#fff';
  };

  const eventPropGetter = (event: CalendarEvent) => {
    const bgColor = event.color || '#10b981';
    const textColor = getTextColor(bgColor);

    return {
      className:
        'transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg',
      style: {
        backgroundColor: bgColor,
        color: textColor,
        borderRadius: '8px',
        border: 'none',
        padding: '2px 6px',
        fontWeight: 500,
      },
    };
  };

  const currentMonth = date.toLocaleString('default', { month: 'long' });
  const currentYear = date.getFullYear();
  const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const meetings = events.filter((e) => !e.canceled);

  return (
    <div className="p-4 pt-0 font-poppins">
      <div className="h-[calc(100vh-6rem)] w-full max-w-7xl mx-auto overflow-visible mt-5 border-1 shadow-md">
        {/* Calendar Header */}
        <div className="bg-gradient-to-r from-green-500 to-green-600 py-2 px-6 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8" />
              <div>
                <h2 className="text-2xl font-bold">
                  {currentMonth} {currentYear}
                </h2>
                <p className="text-green-50 font-medium">Interactive Calendar View</p>
              </div>
            </div>
            <div className="flex items-center justify-between space-x-4">
              <div className="flex flex-col items-start space-y-1">
                <div className="text-sm text-emerald-100">{dateString}</div>
                <FlipClock />
              </div>
              <div className="text-right space-y-1">
                <div className="text-sm text-emerald-100">Total Meetings</div>
                <div className="text-3xl font-bold">{meetings.length}</div>
              </div>
            </div>   
          </div>
        </div>
          {/* Week Days Header */}
          <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
            {weekDays.map((day) => (
              <div key={day} className="p-4 text-center font-bold text-gray-700 text-sm uppercase tracking-wide">
                {day}
              </div>
            ))}
          </div>
        {/* Main Calendar */}
        <DnDCalendar
          localizer={localizer}
          events={events}
          onEventDrop={onEventDrop}
          onEventResize={onEventResize}
          resizable
          startAccessor="start"
          endAccessor="end"
          eventPropGetter={eventPropGetter}
          toolbar={false}
          date={date}
          onNavigate={onNavigate}
          view={view}
          onView={onViewChange}
          views={allowedViews}
          selectable
          onSelectSlot={onSelectSlot}
          onSelectEvent={onSelectEvent}
          components={components}
          className="bg-white transition-all duration-500 ease-in-out font-poppins"
        />
        {/* Footer Info */}
        <div className="bg-gray-50 p-4 border-t border-gray-200 border-1">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-emerald-400 rounded-full" />
                <span className="text-gray-600">Upcoming Meetings</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-gray-400 rounded-full" />
                <span className="text-gray-600">Completed</span>
              </div>
            </div>
            <div className="text-gray-500 font-medium">
              Double-click any date to schedule a meeting
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
