'use client';

import { useState } from 'react';
import Sidebar from '@/components/common/Sidebar';
import CalendarWrapper from '@/components/calendar/CalendarWrapper';
import CalendarModal from '@/components/calendar/CalendarModal';
import { CalendarEvent } from '@/components/calendar/ReusableCalendar';
import { v4 as uuidv4 } from 'uuid';
import { meetingTypeColors, departments } from '@/components/calendar/calendarConstants';

export default function HomePage() {
  const [selectedDepartment, setSelectedDepartment] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);
  const [pendingSlot, setPendingSlot] = useState<{ start: Date; end: Date } | null>(null);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<CalendarEvent[]>([]);
  const [editingEventId, setEditingEventId] = useState<string | undefined>(undefined);

  const handleAddMeeting = () => {
    const now = new Date();
    const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 9, 0);
    const end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 10, 0);
    setPendingSlot({ start, end });
    setEditingEventId(undefined); 
    setModalOpen(true);
  };

  const handleFilterEvents = (filter: 'upcoming' | 'done' | 'canceled' | 'all', searchQuery: string) => {
    let filtered = events;
    const today = new Date();

    if (selectedDepartment !== 'All') {
      filtered = filtered.filter((event) => event.department === selectedDepartment);
    }
    
    if (searchQuery) {
      filtered = filtered.filter((event) => event.title.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (filter === 'upcoming') {
      filtered = filtered.filter((event) => event.start >= today && !event.canceled);
    } else if (filter === 'done') {
      filtered = filtered.filter((event) => event.end < today && !event.canceled);
    } else if (filter === 'canceled') {
      filtered = filtered.filter((event) => event.canceled);
    }

    setFilteredEvents(filtered);
  };

  const handleSaveMeeting = (
    title: string,
    color: string,
    department: string,
    startTime: string,
    endTime: string,
    meetingType: string
  ) => {
    if (!pendingSlot) return;

    const [startHours, startMinutes] = startTime.split(':').map(Number);
    const [endHours, endMinutes] = endTime.split(':').map(Number);
    const start = new Date(pendingSlot.start);
    start.setHours(startHours, startMinutes);
    const end = new Date(pendingSlot.start);
    end.setHours(endHours, endMinutes);

    const newEvent: CalendarEvent = {
      id: editingEventId || uuidv4(),
      title,
      start,
      end,
      department,
      meetingType,
      color,
      canceled: false, 
    };

    if (editingEventId) {
      // Update existing event
      setEvents((prev) =>
        prev.map((event) => (event.id === editingEventId ? newEvent : event))
      );
      setFilteredEvents((prev) =>
        prev.map((event) => (event.id === editingEventId ? newEvent : event))
      );
    } else {
      // Add new event
      setEvents((prev) => [...prev, newEvent]);
      setFilteredEvents((prev) => [...prev, newEvent]);
    }

    setModalOpen(false);
    setPendingSlot(null);
    setEditingEventId(undefined);
  };

  const handleDeleteMeeting = () => {
    if (editingEventId) {
      setEvents((prev) =>
        prev.map((event) =>
          event.id === editingEventId ? { ...event, canceled: true } : event
        )
      );
      setFilteredEvents((prev) =>
        prev.map((event) =>
          event.id === editingEventId ? { ...event, canceled: true } : event
        )
      );
      setModalOpen(false);
      setPendingSlot(null);
      setEditingEventId(undefined);
    }
  };

  const handleEditEvent = (event: CalendarEvent) => {
    setPendingSlot({ start: event.start, end: event.end });
    setEditingEventId(event.id);
    setModalOpen(true);
  };

  return (
    <main className="flex h-screen">
      <Sidebar
        events={events}
        selectedDepartment={selectedDepartment}
        setSelectedDepartment={setSelectedDepartment}
        onAddMeeting={handleAddMeeting}
        onFilterEvents={handleFilterEvents}
      />
      <div className="flex-1 h-full overflow-auto">
        <CalendarWrapper
          events={filteredEvents}
          selectedDepartment={selectedDepartment}
          setModalOpen={setModalOpen}
          setPendingSlot={setPendingSlot}
          onEditEvent={handleEditEvent}
          modalOpen={modalOpen}
          pendingSlot={pendingSlot}
        />
      </div>
      <CalendarModal
        isOpen={modalOpen}
        eventId={editingEventId}
        initialTitle={editingEventId ? events.find((e) => e.id === editingEventId)?.title : ''}
        initialColor={
          editingEventId ? events.find((e) => e.id === editingEventId)?.color : meetingTypeColors['Team Meeting']
        }
        initialDepartment={
          editingEventId
            ? events.find((e) => e.id === editingEventId)?.department
            : selectedDepartment === 'All'
            ? departments[0]
            : selectedDepartment
        }
        initialMeetingType={
          editingEventId
            ? events.find((e) => e.id === editingEventId)?.meetingType
            : 'Team Meeting'
        }
        initialStartTime={
          editingEventId && events.find((e) => e.id === editingEventId)
            ? `${events
                .find((e) => e.id === editingEventId)!
                .start.getHours()
                .toString()
                .padStart(2, '0')}:${events
                .find((e) => e.id === editingEventId)!
                .start.getMinutes()
                .toString()
                .padStart(2, '0')}`
            : pendingSlot
            ? `${pendingSlot.start.getHours().toString().padStart(2, '0')}:${pendingSlot.start
                .getMinutes()
                .toString()
                .padStart(2, '0')}`
            : ''
        }
        initialEndTime={
          editingEventId && events.find((e) => e.id === editingEventId)
            ? `${events
                .find((e) => e.id === editingEventId)!
                .end.getHours()
                .toString()
                .padStart(2, '0')}:${events
                .find((e) => e.id === editingEventId)!
                .end.getMinutes()
                .toString()
                .padStart(2, '0')}`
            : pendingSlot
            ? `${pendingSlot.end.getHours().toString().padStart(2, '0')}:${pendingSlot.end
                .getMinutes()
                .toString()
                .padStart(2, '0')}`
            : ''
        }
        onClose={() => {
          setModalOpen(false);
          setPendingSlot(null);
          setEditingEventId(undefined);
        }}
        onSave={handleSaveMeeting}
        onDelete={editingEventId ? handleDeleteMeeting : undefined}
      />
    </main>
  );
}