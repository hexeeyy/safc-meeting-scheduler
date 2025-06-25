'use client';

import { useCallback, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Calendar,
  dateFnsLocalizer,
  Event as RBCEvent,
  NavigateAction,
  SlotInfo,
  View,
} from 'react-big-calendar';
import withDragAndDrop, {
  withDragAndDropProps,
} from 'react-big-calendar/lib/addons/dragAndDrop';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';

import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import '../calendar/calendar.css';

import CalendarModal from '../common/CalendarModal';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { 'en-US': enUS },
});

interface CalendarEvent extends RBCEvent {
  title: string;
  start: Date;
  end: Date;
  color?: string;
}

const initialEvents: CalendarEvent[] = [
  {
    title: 'Team Meeting',
    start: new Date(2025, 5, 20, 10, 0),
    end: new Date(2025, 5, 20, 11, 0),
    color: '#10B981',
  },
  {
    title: 'Doctor Appointment',
    start: new Date(2025, 5, 22, 14, 0),
    end: new Date(2025, 5, 22, 15, 0),
    color: '#3B82F6',
  },
  {
    title: 'Project Deadline',
    start: new Date(2025, 5, 25, 9, 0),
    end: new Date(2025, 5, 25, 10, 0),
    color: '#EF4444',
  },
];

const allowedViews: View[] = ['month', 'week', 'day', 'agenda', 'work_week'];

const DnDCalendar = withDragAndDrop<CalendarEvent, object>(Calendar);

export default function BigCalendar() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [currentView, setCurrentView] = useState<View>('month');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [pendingSlot, setPendingSlot] = useState<SlotInfo | null>(null);

  useEffect(() => {
    const viewFromUrl = searchParams.get('view');
    if (viewFromUrl && allowedViews.includes(viewFromUrl as View)) {
      setCurrentView(viewFromUrl as View);
    }
  }, [searchParams]);

  const handleNavigate = useCallback(
    (action: NavigateAction) => {
      let newDate = new Date(date);
      switch (action) {
        case 'PREV':
          newDate.setMonth(newDate.getMonth() - 1);
          break;
        case 'NEXT':
          newDate.setMonth(newDate.getMonth() + 1);
          break;
        case 'TODAY':
          newDate = new Date();
          break;
      }
      setDate(newDate);
    },
    [date]
  );

  useEffect(() => {
    const listener = (e: Event) => {
      const customEvent = e as CustomEvent<NavigateAction>;
      if (['PREV', 'NEXT', 'TODAY'].includes(customEvent.detail)) {
        handleNavigate(customEvent.detail);
      }
    };
    window.addEventListener('calendar:navigate', listener);
    return () => window.removeEventListener('calendar:navigate', listener);
  }, [handleNavigate]);

  const handleViewChange = (view: View) => {
    setCurrentView(view);
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set('view', view);
    router.push(`?${params.toString()}`);
  };

  const moveEvent: withDragAndDropProps<CalendarEvent>['onEventDrop'] = ({
    event,
    start,
    end,
  }) => {
    const toDate = (d: Date | string) => (d instanceof Date ? d : new Date(d));
    const updatedEvents = events.map((evt) =>
      evt === event ? { ...evt, start: toDate(start), end: toDate(end) } : evt
    );
    setEvents(updatedEvents);
  };

  const eventPropGetter = (event: CalendarEvent) => ({
    className: 'transform transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg',
    style: {
      backgroundColor: event.color || '#3174ad',
      color: 'white',
      borderRadius: '6px',
      padding: '6px',
      border: 'none',
      boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
      cursor: 'pointer',
    },
  });

  const handleDoubleClickEvent = (input: CalendarEvent | SlotInfo) => {
    if ('start' in input && 'end' in input && !('title' in input)) {
      setEditingEvent(null);
      setPendingSlot(input);
      setModalOpen(true);
    } else {
      setEditingEvent(input as CalendarEvent);
      setPendingSlot(null);
      setModalOpen(true);
    }
  };

  const handleSaveEvent = (title: string, color: string) => {
    if (editingEvent) {
      setEvents((prev) =>
        prev.map((evt) =>
          evt === editingEvent ? { ...evt, title, color } : evt
        )
      );
    } else if (pendingSlot) {
      const newEvent: CalendarEvent = {
        title,
        start: pendingSlot.start,
        end: pendingSlot.end,
        color,
      };
      setEvents([...events, newEvent]);
    }

    setEditingEvent(null);
    setPendingSlot(null);
    setModalOpen(false);
  };

  return (
    <div className="relative mx-4 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-xl overflow-hidden">
      <div className="h-[860px] max-w-screen mx-auto">
        <DnDCalendar
          localizer={localizer}
          events={events}
          onEventDrop={moveEvent}
          onEventResize={moveEvent}
          resizable
          startAccessor="start"
          endAccessor="end"
          eventPropGetter={eventPropGetter}
          toolbar={false}
          date={date}
          onNavigate={setDate}
          view={currentView}
          onView={handleViewChange}
          views={allowedViews}
          selectable="ignoreEvents"
          onSelectSlot={handleDoubleClickEvent}
          onDoubleClickEvent={handleDoubleClickEvent}
          onSelectEvent={(event) => {
            const confirmDelete = window.confirm(`Delete event "${event.title}"?`);
            if (confirmDelete) {
              setEvents(events.filter((e) => e !== event));
            }
          }}
          className="rounded-xl bg-white/80 backdrop-blur-sm transition-all duration-500 ease-in-out"
        />
      </div>
      <div
        className={`fixed inset-0 bg-black/50 transition-opacity duration-300 ease-in-out ${
          modalOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div
          className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ease-in-out ${
            modalOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0'
          }`}
        >
          <CalendarModal
            isOpen={modalOpen}
            initialTitle={editingEvent?.title}
            initialColor={editingEvent?.color}
            onClose={() => setModalOpen(false)}
            onSave={handleSaveEvent}
          />
        </div>
      </div>
    </div>
  );
}