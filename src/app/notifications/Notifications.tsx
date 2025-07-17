// Notifications.tsx
'use client';

import { Bell } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { ClipboardDocumentListIcon } from '@heroicons/react/20/solid';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { CalendarEvent } from '@/components/calendar/ReusableCalendar';

interface Notification {
  id: string;
  meetingTitle: string;
  creator: string;
  date: string;
  time: string;
  description: string;
  createdAt: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    meetingTitle: 'Team Sync',
    creator: 'John Doe',
    date: '2025-07-10',
    time: '10:00 AM',
    description: 'Weekly team sync to discuss project updates.',
    createdAt: '2025-07-07T10:00:00Z',
  },
  {
    id: '2',
    meetingTitle: 'Client Review',
    creator: 'Jane Smith',
    date: '2025-07-11',
    time: '2:00 PM',
    description: 'Review client feedback and plan next steps.',
    createdAt: '2025-07-07T09:30:00Z',
  },
];

export function Notifications() {
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [emailStatus, setEmailStatus] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const handleNewMeeting = (event: CustomEvent) => {
      const calendarEvent = event.detail as CalendarEvent;
      if (calendarEvent.canceled) return;

      const newNotification: Notification = {
        id: calendarEvent.id,
        meetingTitle: calendarEvent.title,
        date: format(new Date(calendarEvent.start), 'yyyy-MM-dd'),
        time: format(new Date(calendarEvent.start), 'h:mm a'),
        description: calendarEvent.meetingType || 'No description provided',
        createdAt: new Date().toISOString(),
        creator: calendarEvent.creator || 'Unknown',
      };

      setNotifications((prev) => [newNotification, ...prev]);
    };

    window.addEventListener('meeting:created', handleNewMeeting as EventListener);
    return () => window.removeEventListener('meeting:created', handleNewMeeting as EventListener);
  }, []);

  const sendEmailNotification = async (notification: Notification) => {
    setIsLoading(true);
    setEmailStatus(null);
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: notification.creator,
          subject: `New Meeting: ${notification.meetingTitle}`,
          body: `
            <h1>New Meeting Scheduled</h1>
            <p><strong>Title:</strong> ${notification.meetingTitle}</p>
            <p><strong>Date:</strong> ${notification.date}</p>
            <p><strong>Time:</strong> ${notification.time}</p>
            <p><strong>Description:</strong> ${notification.description}</p>
            <p><strong>Created At:</strong> ${format(new Date(notification.createdAt), 'PPp')}</p>
          `,
        }),
      });

      if (response.ok) {
        setEmailStatus('Email sent successfully!');
      } else {
        setEmailStatus('Failed to send email.');
      }
    } catch (error) {
      setEmailStatus('Error sending email.');
      console.error('Error sending email:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNotificationClick = (notification: Notification) => {
    setSelectedNotification(notification);
    sendEmailNotification(notification);
  };

  const closeModal = () => {
    setSelectedNotification(null);
    setEmailStatus(null);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-inherit py-10 px-6">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center gap-3">
          <Bell className="h-8 w-8 text-green-800 dark:text-green-200" />
          <h1 className="text-3xl font-bold text-green-800 dark:text-green-200">
            Notifications
          </h1>
        </div>

        <button
          onClick={() => router.push('/')}
          className="px-5 py-2 rounded-md bg-green-700 text-white text-sm font-medium hover:bg-green-600 transition"
        >
          ← Back to Homepage
        </button>

        {notifications.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-10">
            No notifications available.
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => handleNotificationClick(notification)}
                className="relative group bg-white dark:bg-gray-800 p-5 rounded-lg shadow hover:bg-green-100 dark:hover:bg-green-700 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start gap-4">
                  <ClipboardDocumentListIcon className="h-6 w-6 text-green-700 dark:text-green-200 mt-1" />
                  <div className="flex flex-col">
                    <h2 className="text-lg font-semibold text-green-800 dark:text-green-100">
                      {notification.meetingTitle}
                    </h2>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Created by {notification.creator} on{' '}
                      {format(new Date(notification.createdAt), 'PPp')}
                    </p>
                  </div>
                </div>
                <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 hidden group-hover:block bg-green-700 dark:bg-gray-900 text-white text-[10px] px-2 py-1.5 rounded z-20 shadow">
                  View Details
                </div>
              </div>
            ))}
          </div>
        )}

        {selectedNotification && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={closeModal}
          >
            <div
              className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full shadow-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <h2 className="text-xl font-bold text-green-800 dark:text-green-100 mb-4">
                {selectedNotification.meetingTitle}
              </h2>
              <ul className="text-sm space-y-2 text-gray-700 dark:text-gray-300">
                <li><strong>Creator:</strong> {selectedNotification.creator}</li>
                <li><strong>Date:</strong> {selectedNotification.date}</li>
                <li><strong>Time:</strong> {selectedNotification.time}</li>
                <li><strong>Description:</strong> {selectedNotification.description}</li>
              </ul>

              {isLoading ? (
                <p className="mt-4 text-sm text-gray-500 dark:text-gray-400">Sending email...</p>
              ) : emailStatus && (
                <p className={`mt-4 text-sm ${emailStatus.includes('success') ? 'text-green-600' : 'text-red-600'}`}>
                  {emailStatus}
                </p>
              )}

              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-green-700 text-white rounded hover:bg-green-600 transition"
                  disabled={isLoading}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
