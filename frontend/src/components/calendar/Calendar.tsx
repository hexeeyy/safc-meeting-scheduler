'use client';

import { useCallback, useEffect, useState, useRef} from 'react';
import { Calendar, dateFnsLocalizer, Event as RBCEvent, NavigateAction, SlotInfo, View } from 'react-big-calendar';
import withDragAndDrop, { withDragAndDropProps } from 'react-big-calendar/lib/addons/dragAndDrop';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import './calendar.css';
import CalendarModal from '../calendar/CalendarModal';
import { AnimatePresence, motion } from 'framer-motion';

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { 'en-US': enUS },
});

interface CalendarEvent extends RBCEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  color?: string;
  department: string;
  meetingType: string;
}

const initialEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Team Meeting',
    start: new Date(2025, 6, 20, 10, 0),
    end: new Date(2025, 6, 20, 11, 0),
    color: '#10B981',
    department: 'Risk Management',
    meetingType: 'Weekly Sync',
  },
  {
    id: '2',
    title: 'Doctor Appointment',
    start: new Date(2025, 6, 22, 14, 0),
    end: new Date(2025, 6, 22, 15, 0),
    color: '#3B82F6',
    department: 'Customer Service',
    meetingType: 'Personal',
  },
  {
    id: '3',
    title: 'Project Deadline',
    start: new Date(2025, 6, 25, 9, 0),
    end: new Date(2025, 6, 25, 10, 0),
    color: '#EF4444',
    department: 'Underwriting',
    meetingType: 'Milestone',
  },
];

const allowedViews: View[] = ['month', 'week', 'day', 'agenda', 'work_week'];
const DnDCalendar = withDragAndDrop<CalendarEvent, object>(Calendar);

export default function BigCalendar() {
  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [currentView, setCurrentView] = useState<View>('month');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [pendingSlot, setPendingSlot] = useState<SlotInfo | null>(null);
  const [tooltipEvent, setTooltipEvent] = useState<CalendarEvent | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleNavigate = useCallback(
    (action: NavigateAction) => {
      let newDate = new Date(date);
      switch (action) {
        case 'PREV':
          if (['day'].includes(currentView)) newDate.setDate(newDate.getDate() - 1);
          else if (['week', 'work_week'].includes(currentView)) newDate.setDate(newDate.getDate() - 7);
          else newDate.setMonth(newDate.getMonth() - 1);
          break;
        case 'NEXT':
          if (['day'].includes(currentView)) newDate.setDate(newDate.getDate() + 1);
          else if (['week', 'work_week'].includes(currentView)) newDate.setDate(newDate.getDate() + 7);
          else newDate.setMonth(newDate.getMonth() + 1);
          break;
        case 'TODAY':
          newDate = new Date();
          break;
      }
      setDate(newDate);
      const event = new CustomEvent('calendar:navigateDate', { detail: newDate });
      window.dispatchEvent(event);
    },
    [date, currentView]
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
        setCurrentView(customEvent.detail);
      }
    };
    window.addEventListener('calendar:viewChange', viewListener);
    return () => window.removeEventListener('calendar:viewChange', viewListener);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tooltipEvent && tooltipPosition) {
        const tooltipElement = document.querySelector('.tooltip-container');
        if (tooltipElement && !tooltipElement.contains(e.target as Node)) {
          handleCloseTooltip();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [tooltipEvent, tooltipPosition]);

  const handleViewChange = (view: View) => {
    if (view !== currentView) {
      setCurrentView(view);
      const event = new CustomEvent('calendar:externalViewChange', { detail: view });
      window.dispatchEvent(event);
    }
  };

  const moveEvent: withDragAndDropProps<CalendarEvent>['onEventDrop'] = ({
    event,
    start,
    end,
  }) => {
    const toDate = (d: Date | string) => (d instanceof Date ? d : new Date(d));
    const updatedEvents = events.map((evt) =>
      evt.id === event.id ? { ...evt, start: toDate(start), end: toDate(end) } : evt
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
      fontSize: '14px',
    },
  });

  const tooltipAccessor = (event: CalendarEvent) => {
    return `${event.title} (${event.department})\n${format(event.start, 'MMM d, yyyy h:mm aa')} - ${format(event.end, 'h:mm aa')}\nType: ${event.meetingType}`;
  };

  const handleEventMouseOver = (event: CalendarEvent, e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const tooltipWidth = 300;
    const tooltipHeight = 150;
    const padding = 10;

    let x = rect.right + padding;
    let y = rect.top;

    if (x + tooltipWidth > window.innerWidth) {
      x = rect.left - tooltipWidth - padding;
    }
    if (y + tooltipHeight > window.innerHeight) {
      y = window.innerHeight - tooltipHeight - padding;
    }
    if (y < 0) {
      y = padding;
    }

    setTooltipEvent(event);
    setTooltipPosition({ x, y });
  };

  const handleEventMouseOut = () => {
    setTooltipEvent(null);
    setTooltipPosition(null);
  };

  const handleTooltipClick = (event: CalendarEvent) => {
    setEditingEvent(event);
    setPendingSlot(null);
    setModalOpen(true);
    setTooltipEvent(null);
    setTooltipPosition(null);
  };

  const handleCloseTooltip = () => {
    setTooltipEvent(null);
    setTooltipPosition(null);
  };

  const handleSaveEvent = (
    title: string,
    color: string,
    department: string,
    startTime: string,
    endTime: string,
    meetingType: string
  ) => {
    const parseTime = (timeStr: string, baseDate: Date) => {
      const [hours, minutes] = timeStr.split(':').map(Number);
      const date = new Date(baseDate);
      date.setHours(hours);
      date.setMinutes(minutes);
      date.setSeconds(0);
      return date;
    };

    if (editingEvent) {
      const updatedEvent = {
        ...editingEvent,
        title,
        color,
        department,
        meetingType,
        start: parseTime(startTime, editingEvent.start),
        end: parseTime(endTime, editingEvent.start),
      };
      setEvents((prev) => prev.map((evt) => (evt.id === editingEvent.id ? updatedEvent : evt)));
    } else if (pendingSlot) {
      const baseDate = pendingSlot.start;
      const newEvent: CalendarEvent = {
        id: crypto.randomUUID(),
        title,
        color,
        department,
        meetingType,
        start: parseTime(startTime, baseDate),
        end: parseTime(endTime, baseDate),
      };
      setEvents((prev) => [...prev, newEvent]);
    }

    setEditingEvent(null);
    setPendingSlot(null);
    setModalOpen(false);
  };

function handleDeleteEvent(): void {
  if (!editingEvent) return;

  setEvents((prevEvents) =>
    prevEvents.filter((event) => event.id !== editingEvent.id)
  );

  setEditingEvent(null);
  setModalOpen(false);
}

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      setEditingEvent(null);
      setPendingSlot(slotInfo);
      setModalOpen(true);
    } else {
      clickTimeoutRef.current = setTimeout(() => {
        clickTimeoutRef.current = null;
      }, 300); 
    }
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setEditingEvent(event);
    setPendingSlot(null);
    setModalOpen(true);
  };
  
  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="p-4 pt-0 font-poppins">
      <div className="h-[calc(100vh-8rem)] w-full max-w-7xl mx-auto">
        <DnDCalendar
          localizer={localizer}
          events={events}
          onEventDrop={moveEvent}
          onEventResize={moveEvent}
          resizable
          startAccessor="start"
          endAccessor="end"
          eventPropGetter={eventPropGetter}
          tooltipAccessor={tooltipAccessor}
          toolbar={false}
          date={date}
          onNavigate={setDate}
          view={currentView}
          onView={handleViewChange}
          views={allowedViews}
          selectable
          onSelectSlot={handleSelectSlot}
          onSelectEvent={handleSelectEvent}
          components={{
            event: (props) => (
              <div
                onMouseOver={(e) => handleEventMouseOver(props.event as CalendarEvent, e)}
                onMouseOut={handleEventMouseOut}
                style={{ height: '100%' }}
              >
                {props.title}
              </div>
            ),
          }}
          className="bg-white backdrop-blur-sm transition-all duration-500 ease-in-out font-poppins"
        />
      </div>

      <AnimatePresence initial={true}>
        {tooltipEvent && tooltipPosition && currentView === 'month' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="fixed z-20 p-4 bg-green-100 rounded-xl shadow-xl max-w-sm border border-gray-100 font-poppins tooltip-container"
            style={{ top: tooltipPosition.y, left: tooltipPosition.x}}
            onClick={() => handleTooltipClick(tooltipEvent)}
            key="tooltip"
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-semibold text-lg text-gray-800">{tooltipEvent.title}</h3>
              <button
                className="text-gray-500 hover:text-gray-700 text-xl font-medium"
                onClick={(e) => {
                  e.stopPropagation();
                  handleCloseTooltip();
                }}
              >
                ×
              </button>
            </div>
            <div className="space-y-1 text-sm text-gray-600">
              <p><span className="font-medium">Department:</span> {tooltipEvent.department}</p>
              <p><span className="font-medium">Type:</span> {tooltipEvent.meetingType}</p>
              <p><span className="font-medium">Date:</span> {format(tooltipEvent.start, 'MMM d, yyyy')}</p>
              <p><span className="font-medium">Time:</span> {format(tooltipEvent.start, 'h:mm aa')} - {format(tooltipEvent.end, 'h:mm aa')}</p>
            </div>
            <button className="mt-3 text-blue-500 hover:text-blue-600 font-medium text-sm hover:underline">
              Edit Event
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        className={`fixed inset-0 bg-gray/50 transition-opacity duration-300 ease-in-out ${
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
            eventId={editingEvent?.id}
            initialTitle={editingEvent?.title}
            initialColor={editingEvent?.color}
            initialDepartment={editingEvent?.department}
            initialMeetingType={editingEvent?.meetingType}
            initialStartTime={
              editingEvent
                ? editingEvent.start.toTimeString().slice(0, 5)
                : pendingSlot
                ? new Date(pendingSlot.start).toTimeString().slice(0, 5)
                : ''
            }
            initialEndTime={
              editingEvent
                ? editingEvent.end.toTimeString().slice(0, 5)
                : pendingSlot
                ? new Date(pendingSlot.end).toTimeString().slice(0, 5)
                : ''
            }
            onClose={() => setModalOpen(false)}
            onSave={handleSaveEvent}
            onDelete={editingEvent ? handleDeleteEvent : undefined}
          />
        </div>
      </div>
    </div>
  );
}