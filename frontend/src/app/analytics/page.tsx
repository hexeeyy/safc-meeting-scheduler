import { AnalyticsContent } from '@/components/common/AnalyticsContent'
import type { CalendarEvent } from '@/components/calendar/ReusableCalendar'

export default function AnalyticsPage() {
  // Temporary sample data for development — replace with real data later
  const sampleEvents: CalendarEvent[] = [
    {
        id: '1',
        title: 'Engineering Sync',
        start: new Date(new Date().setHours(10, 0)),
        end: new Date(new Date().setHours(11, 0)),
        department: 'Engineering',
        attendees: [],
        canceled: false,
        meetingType: '',
        creator: ''
    },
    {
        id: '2',
        title: 'Marketing Standup',
        start: new Date(new Date().setDate(new Date().getDate() - 3)),
        end: new Date(new Date().setDate(new Date().getDate() - 3) + 30 * 60000),
        department: 'Marketing',
        attendees: [],
        canceled: false,
        meetingType: '',
        creator: ''
    },
    {
        id: '3',
        title: 'Product Roadmap',
        start: new Date(new Date().setDate(new Date().getDate() - 10)),
        end: new Date(new Date().setDate(new Date().getDate() - 10) + 45 * 60000),
        department: 'Product',
        attendees: [],
        canceled: true,
        meetingType: '',
        creator: ''
    },
    {
        id: '4',
        title: 'QA Sync',
        start: new Date(new Date().setHours(14, 0)),
        end: new Date(new Date().setHours(15, 0)),
        department: 'QA',
        attendees: [],
        canceled: false,
        meetingType: '',
        creator: ''
    },
    {
        id: '5',
        title: 'HR Orientation',
        start: new Date(new Date().setDate(new Date().getDate() - 1)),
        end: new Date(new Date().setDate(new Date().getDate() - 1) + 30 * 60000),
        department: 'HR',
        attendees: [],
        canceled: false,
        meetingType: '',
        creator: ''
    },
  ]

  return <AnalyticsContent events={sampleEvents} />
}
