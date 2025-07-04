'use client';

import MeetingAnalytics from './MeetingAnalytics'; // Adjust path as needed
import { CalendarEvent } from '@/components/calendar/ReusableCalendar';
import { useState } from 'react';

// Mock data or fetch from a parent component/context
const mockEvents: CalendarEvent[] = [
  // Example events; replace with actual data source
  {
      id: '1', title: 'Team Sync', department: 'Engineering', start: new Date('2025-07-05'), end: new Date('2025-07-05'), canceled: false,
      meetingType: ''
  },
  {
      id: '2', title: 'Planning', department: 'Marketing', start: new Date('2025-06-01'), end: new Date('2025-06-01'), canceled: false,
      meetingType: ''
  },
  {
      id: '3', title: 'Review', department: 'Engineering', start: new Date('2025-07-01'), end: new Date('2025-07-01'), canceled: true,
      meetingType: ''
  },
  // Add more events as needed
];

export default function AnalyticsPage() {
  // In a real app, events would come from a parent component, context, or API
  const [events] = useState<CalendarEvent[]>(mockEvents);

  return <MeetingAnalytics events={events} />;
}