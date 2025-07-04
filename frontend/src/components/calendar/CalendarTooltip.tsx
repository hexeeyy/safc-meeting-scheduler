'use client';

import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { CalendarEvent } from './ReusableCalendar';

interface CalendarTooltipProps {
  event: CalendarEvent | null;
  position: { x: number; y: number } | null;
  onClick: (event: CalendarEvent) => void;
  onClose: () => void;
}

export default function CalendarTooltip({
  event,
  position,
  onClick,
  onClose,
}: CalendarTooltipProps) {
  if (!event || !position) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={{ duration: 0.2, ease: 'easeOut' }}
      className="fixed z-20 p-4 bg-green-100 rounded-xl shadow-xl max-w-sm border border-gray-100 font-poppins tooltip-container"
      style={{ top: position.y, left: position.x }}
      onClick={() => onClick(event)}
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-lg text-gray-800">{event.title}</h3>
        <button
          className="text-gray-500 hover:text-gray-700 text-xl font-medium"
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
        >
          ×
        </button>
      </div>
      <div className="space-y-1 text-sm text-gray-600">
        <p><span className="font-medium">Department:</span> {event.department}</p>
        <p><span className="font-medium">Type:</span> {event.meetingType}</p>
        <p><span className="font-medium">Date:</span> {format(event.start, 'MMM d, yyyy')}</p>
        <p>
          <span className="font-medium">Time:</span> {format(event.start, 'h:mm aa')} -{' '}
          {format(event.end, 'h:mm aa')}
        </p>
      </div>
      <button className="mt-3 text-blue-500 hover:text-blue-600 font-medium text-sm hover:underline">
        Edit Event
      </button>
    </motion.div>
  );
}