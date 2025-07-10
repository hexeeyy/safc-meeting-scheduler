'use client';

import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { CalendarEvent } from './ReusableCalendar';

interface CalendarTooltipProps {
  event: CalendarEvent | null;
  position: { x: number; y: number } | null;
  onClick: (event: CalendarEvent) => void;
  onClose: () => void;
  onEdit: (event: CalendarEvent) => void;
}

export default function CalendarTooltip({
  event,
  position,
  onClick,
  onClose,
}: CalendarTooltipProps) {
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (tooltipRef.current && !tooltipRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  // Handle Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!event || !position) return null;

  // Dynamic positioning to prevent overflow
  const adjustPosition = () => {
    const tooltipWidth = 400; // Fixed width for consistency
    const tooltipHeight = 300; // Increased to account for footer
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;
    const margin = 10; // Margin from screen edges

    let adjustedX = position.x;
    let adjustedY = position.y + 10; // Slight offset below cursor

    // Ensure tooltip stays within horizontal bounds
    if (adjustedX + tooltipWidth + margin > windowWidth) {
      adjustedX = windowWidth - tooltipWidth - margin; // Align to right edge
    } else if (adjustedX < margin) {
      adjustedX = margin; // Align to left edge
    }

    // Ensure tooltip stays within vertical bounds
    if (adjustedY + tooltipHeight + margin > windowHeight) {
      adjustedY = position.y - tooltipHeight - margin; // Flip above cursor
      if (adjustedY < margin) {
        adjustedY = margin; // Align to top edge if still overflowing
      }
    } else if (adjustedY < margin) {
      adjustedY = margin; // Align to top edge
    }

    return { x: adjustedX, y: adjustedY };
  };

  const { x, y } = adjustPosition();
  const bgColor = event.color || '#ffffff'; // Fallback to white if no color
  const textColor = '#ffffff'; // Force white text color

  return (
    <motion.div
      ref={tooltipRef}
      initial={{ opacity: 0, scale: 0.95, y: 10 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, y: 10 }}
      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
      className="fixed z-30 p-6 rounded-lg shadow-xl max-w-sm sm:max-w-md border border-gray-200 font-poppins tooltip-container"
      style={{
        top: y,
        left: x,
        backgroundColor: bgColor,
        color: textColor,
      }}
      onClick={() => {
        onClick(event);
      }}
      role="dialog"
      aria-labelledby="tooltip-title"
      aria-describedby="tooltip-description"
      aria-live="polite"
    >
      {/* Tooltip Arrow */}
      <div
        className="absolute -top-2 left-4 w-0 h-0 border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent"
        style={{ borderBottomColor: bgColor }}
      />

      <div className="flex justify-between items-start mb-4">
        <h3
          id="tooltip-title"
          className="font-semibold text-xl truncate max-w-[80%]"
          style={{ color: textColor }}
          title={event.title}
        >
          {event.title}
        </h3>
      </div>
      <div id="tooltip-description" className="space-y-3 text-sm">
        <p className="flex items-center">
          <span className="font-medium w-24" style={{ color: textColor }}>
            Department:
          </span>
          <span className="truncate">{event.department}</span>
        </p>
        <p className="flex items-center">
          <span className="font-medium w-24" style={{ color: textColor }}>
            Type:
          </span>
          <span className="truncate">{event.meetingType}</span>
          <span
            className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium"
            style={{ backgroundColor: textColor, color: bgColor }}
          >
            {event.meetingType}
          </span>
        </p>
        <p className="flex items-center">
          <span className="font-medium w-24" style={{ color: textColor }}>
            Date:
          </span>
          {format(event.start, 'MMM d, yyyy')}
        </p>
        <p className="flex items-center">
          <span className="font-medium w-24" style={{ color: textColor }}>
            Time:
          </span>
          {format(event.start, 'h:mm aa')} - {format(event.end, 'h:mm aa')}
        </p>
      </div>
      <footer className="mt-4 pt-4 border-t border-gray-200 text-xs" style={{ color: textColor }}>
        <p>Click anywhere in this area to edit the meeting. Editing allows you to update the title, department, meeting type, date, and time. Changes will be reflected in the calendar immediately. Ensure you have the necessary permissions to modify meeting details.</p>
      </footer>
    </motion.div>
  );
}