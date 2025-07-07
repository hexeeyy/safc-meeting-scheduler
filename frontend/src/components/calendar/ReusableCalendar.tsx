'use client';

import { useCallback, useEffect } from 'react';
import { Calendar, dateFnsLocalizer, Event as RBCEvent, NavigateAction, SlotInfo, View } from 'react-big-calendar';
import withDragAndDrop, { withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import './calendar.css';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { 'en-US': enUS },
});

export interface CalendarEvent extends RBCEvent {
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
  const handleNavigate = useCallback(
    (action: NavigateAction) => {
      let newDate = new Date(date);
      switch (action) {
        case 'PREV':
          if (['day'].includes(view)) newDate.setDate(newDate.getDate() - 1);
          else if (['week'].includes(view)) newDate.setDate(newDate.getDate() - 7);
          else newDate.setMonth(newDate.getMonth() - 1);
          break;
        case 'NEXT':
          if (['day'].includes(view)) newDate.setDate(newDate.getDate() + 1);
          else if (['week'].includes(view)) newDate.setDate(newDate.getDate() + 7);
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
  const bgColor = event.color || '#10b981'; // fallback color
  const textColor = getTextColor(bgColor);

  return {
    className: 'transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg',
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

  return (
    <div className="p-4 pt-0 font-poppins">
      <div className="h-[calc(100vh-8rem)] w-full max-w-7xl mx-auto overflow-visible">
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
          className="bg-white transition-all duration-500 ease-in-out font-poppins "
        />
      </div>
    </div>
  );
}