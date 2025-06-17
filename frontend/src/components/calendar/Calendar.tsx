"use client";

import { useState } from "react";
import { Calendar, dateFnsLocalizer, Event } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Configure date-fns localizer
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales: { "en-US": enUS },
});

// Define event type
interface CalendarEvent extends Event {
  title: string;
  start: Date;
  end: Date;
  color?: string;
}

// Sample events
const initialEvents: CalendarEvent[] = [
  {
    title: "Team Meeting",
    start: new Date(2025, 5, 20, 10, 0), // June 20, 2025, 10:00 AM
    end: new Date(2025, 5, 20, 11, 0), // June 20, 2025, 11:00 AM
    color: "#10B981",
  },
  {
    title: "Doctor Appointment",
    start: new Date(2025, 5, 22, 14, 0), // June 22, 2025, 2:00 PM
    end: new Date(2025, 5, 22, 15, 0), // June 22, 2025, 3:00 PM
    color: "#3B82F6",
  },
  {
    title: "Project Deadline",
    start: new Date(2025, 5, 25, 9, 0), // June 25, 2025, 9:00 AM
    end: new Date(2025, 5, 25, 10, 0), // June 25, 2025, 10:00 AM
    color: "#EF4444",
  },
];

export default function BigCalendar() {
  const [events] = useState<CalendarEvent[]>(initialEvents);

  // Custom event styling
  const eventPropGetter = (event: CalendarEvent) => ({
    style: {
      backgroundColor: event.color || "#3174ad", // Default color if none provided
      color: "white",
      borderRadius: "3px",
      border: "none",
    },
  });

  return (
    <div className="p-4 bg-white rounded-2xl">
      <div className="h-[600px] max-w-screen mx-auto">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView="month"
          views={["month", "week", "day"]}
          eventPropGetter={eventPropGetter}
          onSelectEvent={(event) => alert(`Event: ${event.title}\nStart: ${event.start?.toLocaleString()}`)}
          className="rounded-md border"
        />
      </div>
    </div>
  );
}