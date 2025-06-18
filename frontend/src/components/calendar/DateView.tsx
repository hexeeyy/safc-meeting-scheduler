import React from 'react';

type ViewMode = 'day' | 'month' | 'year';

interface DateDisplayProps {
  view: ViewMode;
  currentDate?: Date;
}

export default function DateDisplay({ view, currentDate = new Date() }: DateDisplayProps) {
  const formatOptions: Record<ViewMode, Intl.DateTimeFormatOptions> = {
    day: {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    },
    month: {
      year: 'numeric',
      month: 'long',
    },
    year: {
      year: 'numeric',
    },
  };

  return (
    <div className="flex-1 ml-2.5 text-gray-700 text-2xl font-medium">
      {currentDate.toLocaleDateString(undefined, formatOptions[view])}
    </div>
  );
}
