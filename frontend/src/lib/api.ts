import { supabaseClient } from './supabase';
import { CalendarEvent } from '@/components/calendar/ReusableCalendar';

interface MeetingPayload {
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  color?: string;
  department?: string;
  meeting_type?: string;
  attendee_ids?: string[];
}

interface RawMeeting {
  id: string;
  title: string;
  start_time: string;
  end_time: string;
  organizer_id: string;
  attendees?: string[];
  canceled: boolean;
  color?: string;
  department?: string;
  meeting_type?: string;
}


export async function fetchMeetings(): Promise<CalendarEvent[]> {
  const { data: session } = await supabaseClient.auth.getSession();
  const token = session?.session?.access_token;

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/meetings/`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch meetings');
  }

  const meetings = await response.json();
  return meetings.map((meeting: RawMeeting) => ({
  id: meeting.id,
  title: meeting.title,
  start: new Date(meeting.start_time),
  end: new Date(meeting.end_time),
  creator: meeting.organizer_id,
  attendees: meeting.attendees || [],
  canceled: meeting.canceled,
  color: meeting.color,
  department: meeting.department,
  meetingType: meeting.meeting_type,
}));
}

export async function createMeeting(meeting: MeetingPayload): Promise<CalendarEvent> {
  const { data: session } = await supabaseClient.auth.getSession();
  const token = session?.session?.access_token;

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/meetings/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(meeting),
  });

  if (!response.ok) {
    throw new Error('Failed to create meeting');
  }

  const data = await response.json();
  return {
    id: data.id,
    title: data.title,
    start: new Date(data.start_time),
    end: new Date(data.end_time),
    creator: data.organizer_id,
    attendees: data.attendees || [],
    canceled: data.canceled,
    color: data.color,
    department: data.department,
    meetingType: data.meeting_type,
  };
}

export async function updateMeeting(meetingId: string, meeting: MeetingPayload): Promise<CalendarEvent> {
  const { data: session } = await supabaseClient.auth.getSession();
  const token = session?.session?.access_token;

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/meetings/${meetingId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(meeting),
  });

  if (!response.ok) {
    throw new Error('Failed to update meeting');
  }

  const data = await response.json();
  return {
    id: data.id,
    title: data.title,
    start: new Date(data.start_time),
    end: new Date(data.end_time),
    creator: data.organizer_id,
    attendees: data.attendees || [],
    canceled: data.canceled,
    color: data.color,
    department: data.department,
    meetingType: data.meeting_type,
  };
}

export async function cancelMeeting(meetingId: string): Promise<void> {
  const { data: session } = await supabaseClient.auth.getSession();
  const token = session?.session?.access_token;

  const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/meetings/${meetingId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to cancel meeting');
  }
}