'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { SlotInfo, View } from 'react-big-calendar';
import ReusableCalendar, { CalendarEvent } from './ReusableCalendar';
import CalendarTooltip from './CalendarTooltip';
import './calendar.css'

interface CalendarWrapperProps {
  events: CalendarEvent[];
  selectedDepartment: string;
  setModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setPendingSlot: React.Dispatch<React.SetStateAction<{ start: Date; end: Date } | null>>;
  onEditEvent: (event: CalendarEvent) => void;
  modalOpen: boolean;
  pendingSlot: { start: Date; end: Date } | null;
}

export default function CalendarWrapper({
  events,
  selectedDepartment,
  setModalOpen,
  setPendingSlot,
  onEditEvent,
}: CalendarWrapperProps) {
  const [date, setDate] = useState(new Date());
  const [currentView, setCurrentView] = useState<View>('month');
  const [tooltipEvent, setTooltipEvent] = useState<CalendarEvent | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number } | null>(null);
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Filter events based on selectedDepartment and exclude canceled events
  const filteredEvents = (selectedDepartment === 'All'
    ? events
    : events.filter((event) => event.department === selectedDepartment)
  ).filter((event) => !event.canceled);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tooltipEvent && tooltipPosition) {
        const tooltipElement = document.querySelector('.tooltip-container');
        if (tooltipElement && !tooltipElement.contains(e.target as Node)) {
          setTooltipEvent(null);
          setTooltipPosition(null);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [tooltipEvent, tooltipPosition]);

  // Memoize hasTimeConflict to prevent it from being recreated on every render
const hasTimeConflict = useCallback(
  (start: Date, end: Date, excludeEventId?: string) => {
    return filteredEvents.some((event) => {
      if (excludeEventId && event.id === excludeEventId) return false;

      const eventStart = new Date(event.start).getTime();
      const eventEnd = new Date(event.end).getTime();
      const newStart = start.getTime();
      const newEnd = end.getTime();

      // Block only if time range is exactly the same
      return eventStart === newStart && eventEnd === newEnd;
    });
  },
  [filteredEvents] // Dependency: filteredEvents
);

const moveEvent = useCallback(
  ({ event, start, end }: { event: CalendarEvent; start: Date | string; end: Date | string }) => {
    const toDate = (d: Date | string) => (d instanceof Date ? d : new Date(d));
    const updatedStart = toDate(start);
    const updatedEnd = toDate(end);

    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const selectedDate = new Date(updatedStart);
    selectedDate.setHours(0, 0, 0, 0);

    if (selectedDate < now) {
      alert('Meetings can only be scheduled for future days.');
      return;
    }

    if (hasTimeConflict(updatedStart, updatedEnd, event.id)) {
      alert('Cannot move event: Another meeting is already scheduled at this time on the same day.');
      return;
    }

    onEditEvent({ ...event, start: updatedStart, end: updatedEnd });
  },
  [onEditEvent, hasTimeConflict] // Add hasTimeConflict to dependencies
);

const handleSelectSlot = useCallback(
  (slotInfo: SlotInfo) => {
    const now = new Date();
    const selectedDate = new Date(slotInfo.start);
    selectedDate.setHours(0, 0, 0, 0);
    now.setHours(0, 0, 0, 0);

    if (selectedDate < now) {
      alert('Meetings can only be scheduled for future days.');
      return;
    }

    if (hasTimeConflict(slotInfo.start, slotInfo.end)) {
      alert('Cannot schedule meeting: Another meeting is already scheduled at this time on the same day and time.');
      return;
    }

    if (clickTimeoutRef.current) {
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      setPendingSlot({ start: slotInfo.start, end: slotInfo.end });
      setModalOpen(true);
    } else {
      clickTimeoutRef.current = setTimeout(() => {
        clickTimeoutRef.current = null;
      }, 300);
    }
  },
  [setModalOpen, setPendingSlot, hasTimeConflict] // Add hasTimeConflict to dependencies
);

  const handleSelectEvent = useCallback(
    (event: CalendarEvent) => {
      if (!event.canceled) {
        onEditEvent(event);
        setModalOpen(true);
      }
    },
    [onEditEvent, setModalOpen]
  );

  const handleEventMouseOver = useCallback(
    (event: CalendarEvent, e: React.MouseEvent) => {
      if (currentView !== 'month' || event.canceled) return;

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
    },
    [currentView]
  );

  const handleEventMouseOut = useCallback(() => {
    setTooltipEvent(null);
    setTooltipPosition(null);
  }, []);

  const handleTooltipClick = useCallback(
    (event: CalendarEvent) => {
      if (!event.canceled) {
        onEditEvent(event);
        setModalOpen(true);
        setTooltipEvent(null);
        setTooltipPosition(null);
      }
    },
    [onEditEvent, setModalOpen]
  );

  const handleCloseTooltip = useCallback(() => {
    setTooltipEvent(null);
    setTooltipPosition(null);
  }, []);

  useEffect(() => {
    return () => {
      if (clickTimeoutRef.current) {
        clearTimeout(clickTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="">
      <ReusableCalendar
        events={filteredEvents}
        date={date}
        view={currentView}
        onNavigate={setDate}
        onViewChange={setCurrentView}
        onEventDrop={moveEvent}
        onEventResize={moveEvent}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        components={{
          event: (props) => (
            <div
              onMouseOver={(e) => handleEventMouseOver(props.event as CalendarEvent, e)}
              onMouseOut={handleEventMouseOut}
              style={{ height: '100%', backgroundColor: props.event.color }}
            >
              {props.title}
            </div>
          ),
        }}
      />
      <CalendarTooltip
        event={tooltipEvent}
        position={tooltipPosition}
        onClick={handleTooltipClick}
        onClose={handleCloseTooltip} onEdit={function (): void {
          throw new Error('Function not implemented.');
        } }      />
    </div>
  );
}