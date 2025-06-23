'use client';

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  Calendar,
  dateFnsLocalizer,
  Event as RBCEvent,
  NavigateAction,
  View,
} from "react-big-calendar";
import withDragAndDrop, {
  withDragAndDropProps,
} from "react-big-calendar/lib/addons/dragAndDrop";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import "../calendar/calendar.css";

// Setup localizer
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { "en-US": enUS },
});

// Extend the base Event interface
interface CalendarEvent extends RBCEvent {
  title: string;
  start: Date;
  end: Date;
  color?: string;
}

const initialEvents: CalendarEvent[] = [
  {
    title: "Team Meeting",
    start: new Date(2025, 5, 20, 10, 0),
    end: new Date(2025, 5, 20, 11, 0),
    color: "#10B981",
  },
  {
    title: "Doctor Appointment",
    start: new Date(2025, 5, 22, 14, 0),
    end: new Date(2025, 5, 22, 15, 0),
    color: "#3B82F6",
  },
  {
    title: "Project Deadline",
    start: new Date(2025, 5, 25, 9, 0),
    end: new Date(2025, 5, 25, 10, 0),
    color: "#EF4444",
  },
];

// Define allowed views
const allowedViews: View[] = ["month", "week", "day", "agenda", "work_week"];

// Wrap calendar with drag-and-drop functionality
const DnDCalendar = withDragAndDrop<CalendarEvent, object>(Calendar);

export default function BigCalendar() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [date, setDate] = useState(new Date());
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [currentView, setCurrentView] = useState<View>("month");

  // Sync view from URL on mount
  useEffect(() => {
    const viewFromUrl = searchParams.get("view");
    if (viewFromUrl && allowedViews.includes(viewFromUrl as View)) {
      setCurrentView(viewFromUrl as View);
    }
  }, [searchParams]);

  // Handle view change and sync with URL
  const handleViewChange = (view: View) => {
    setCurrentView(view);
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    params.set("view", view);
    router.push(`?${params.toString()}`);
  };

  // Handle navigation (prev/next/today)
  const handleNavigate = useCallback((action: NavigateAction) => {
    let newDate = new Date(date);
    switch (action) {
      case "PREV":
        newDate.setMonth(newDate.getMonth() - 1);
        break;
      case "NEXT":
        newDate.setMonth(newDate.getMonth() + 1);
        break;
      case "TODAY":
        newDate = new Date();
        break;
    }
    setDate(newDate);
  }, [date]);

  // Listen for custom navigation events
  useEffect(() => {
    const listener = (e: Event) => {
      const customEvent = e as CustomEvent;
      if (customEvent.detail === "PREV" || customEvent.detail === "NEXT") {
        handleNavigate(customEvent.detail);
      }
    };
    window.addEventListener("calendar:navigate", listener);
    return () => window.removeEventListener("calendar:navigate", listener);
  }, [handleNavigate]);

  // Move or resize event
  const moveEvent: withDragAndDropProps<CalendarEvent>["onEventDrop"] = ({
    event,
    start,
    end,
  }) => {
    const toDate = (d: string | Date) => (d instanceof Date ? d : new Date(d));
    const updatedEvents = events.map((evt) =>
      evt === event ? { ...evt, start: toDate(start), end: toDate(end) } : evt
    );
    setEvents(updatedEvents);
  };

  // Style each event
  const eventPropGetter = (event: CalendarEvent) => ({
    style: {
      backgroundColor: event.color || "#3174ad",
      color: "white",
      borderRadius: "3px",
      border: "none",
    },
  });

  return (
    <div className="rounded-2xl my-4 mx-2">
      {/* Optional toolbar can go here */}
      <div className="h-[840px] max-w-screen mx-auto">
        <DnDCalendar
          localizer={localizer}
          events={events}
          onEventDrop={moveEvent}
          onEventResize={moveEvent}
          resizable
          startAccessor="start"
          endAccessor="end"
          eventPropGetter={eventPropGetter}
          onSelectEvent={(event) =>
            alert(`Event: ${event.title}\nStart: ${event.start?.toLocaleString()}`)
          }
          toolbar={true}
          date={date}
          onNavigate={setDate}
          view={currentView}
          onView={handleViewChange}
          views={allowedViews}
          className="rounded-2xl p-4 bg-white"

          onSelectSlot={(slotInfo) => {
            const title = window.prompt("New Event name");
            if (title) {
              const newEvent: CalendarEvent = {
                title,
                start: slotInfo.start,
                end: slotInfo.end,
                color: "#10B981", // Default color
              };
              setEvents([...events, newEvent]);
            }
          }}
          selectable
        />
      </div>
    </div>
  );
}
