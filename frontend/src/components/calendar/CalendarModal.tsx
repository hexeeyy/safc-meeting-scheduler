'use client';

import { useCallback, useEffect, useState } from 'react';
import { Calendar, Clock, Tag, Building2, Trash2, RotateCcw } from 'lucide-react';
import {Dialog, DialogContent, DialogHeader, DialogTitle,} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {Select,SelectContent,SelectItem,SelectTrigger, SelectValue,} from '@/components/ui/select';
import { meetingTypeColors, departments } from './calendarConstants';
import { DialogOverlay } from '@radix-ui/react-dialog';

const DEFAULT_MEETING_TYPE = 'Team Meeting';
const BUSINESS_HOURS = { start: 9, end: 18 }; 
const MINIMUM_MEETING_DURATION_MINUTES = 15;

const generateTimeSlots = () => {
  const slots: { value: string; label: string }[] = [];
  for (let hour = BUSINESS_HOURS.start; hour < BUSINESS_HOURS.end; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const value = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      const period = hour < 12 ? 'AM' : 'PM';
      const displayHour = hour % 12 === 0 ? 12 : hour % 12;
      const label = `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
      slots.push({ value, label });
    }
  }
  return slots;
};

const TIME_SLOTS = generateTimeSlots();
export interface CalendarModalProps {
  isOpen: boolean;
  eventId?: string;
  initialTitle?: string;
  initialColor?: string;
  initialDepartment?: string;
  initialMeetingType?: string;
  initialStartTime?: string;
  initialEndTime?: string;
  existingEvents?: { id: string; startTime: string; endTime: string }[];
  onClose: () => void;
  onSave: (
    title: string,
    color: string,
    department: string,
    startTime: string,
    endTime: string,
    meetingType: string
  ) => void;
  onDelete?: () => void;
  errorMessage?: string;
}

export default function CalendarModal({
  isOpen,
  initialTitle = '',
  initialColor = meetingTypeColors[DEFAULT_MEETING_TYPE],
  initialDepartment = departments[0] ?? '',
  initialStartTime = '',
  initialEndTime = '',
  eventId,
  existingEvents = [],
  onClose,
  onSave,
  onDelete,
  errorMessage,
}: CalendarModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [meetingType, setMeetingType] = useState(DEFAULT_MEETING_TYPE);
  const [department, setDepartment] = useState(initialDepartment);
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);
  const [localError, setLocalError] = useState<string | null>(null);
  const isEditing = !!eventId;

  const resetForm = useCallback(() => {
    setTitle('');
    setMeetingType(DEFAULT_MEETING_TYPE);
    setDepartment(departments[0] ?? '');
    setStartTime('');
    setEndTime('');
    setLocalError(null);
  }, []);

  useEffect(() => {
    if (isOpen) {
      if (eventId) {
        setTitle(initialTitle);
        setMeetingType(
          Object.keys(meetingTypeColors).find(
            (key) => meetingTypeColors[key] === initialColor
          ) ?? DEFAULT_MEETING_TYPE
        );
        setDepartment(initialDepartment);
        setStartTime(initialStartTime);
        setEndTime(initialEndTime);
      } else {
        resetForm();
      }
      setLocalError(null);
    }
  }, [
    initialTitle,
    initialColor,
    initialDepartment,
    initialStartTime,
    initialEndTime,
    isOpen,
    eventId,
    resetForm,
  ]);

const validateInputs = useCallback(() => {
  if (!title.trim()) return 'Title is required.';
  if (!startTime) return 'Start time is required.';
  if (!endTime) return 'End time is required.';
  if (!department) return 'Department is required.';

  const [startHours, startMinutes] = startTime.split(':').map(Number);
  const [endHours, endMinutes] = endTime.split(':').map(Number);

  if (
    startHours < BUSINESS_HOURS.start ||
    startHours >= BUSINESS_HOURS.end ||
    endHours < BUSINESS_HOURS.start ||
    endHours > BUSINESS_HOURS.end
  ) {
    return 'Meetings must be scheduled between 9:00 AM and 6:00 PM.';
  }

  const startInMinutes = startHours * 60 + startMinutes;
  const endInMinutes = endHours * 60 + endMinutes;

  if (endInMinutes <= startInMinutes) {
    return 'End time must be after start time.';
  }

  if (endInMinutes - startInMinutes < MINIMUM_MEETING_DURATION_MINUTES) {
    return `Meetings must be at least ${MINIMUM_MEETING_DURATION_MINUTES} minutes long.`;
  }

  const isConflict = existingEvents.some((event) => {
    if (isEditing && event.id === eventId) return false;
    return event.startTime === startTime && event.endTime === endTime;
  });

  if (isConflict) {
    return 'A meeting is already scheduled with the same start and end time.';
  }

  return null;
}, [title, startTime, endTime, department, existingEvents, isEditing, eventId]);


  const handleSubmit = () => {
    const error = validateInputs();
    if (error) {
      setLocalError(error);
      return;
    }

    onSave(
      title,
      meetingTypeColors[meetingType],
      department,
      startTime,
      endTime,
      meetingType
    );
    resetForm();
    onClose();
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      onClose();
    } else {
      console.warn('Delete functionality not available: onDelete is undefined');
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="fixed inset-0 z-40 backdrop-blur-sm bg-black/20" />
      <DialogContent className="max-w-md rounded-lg border border-green-200 bg-gradient-to-br from-green-50 to-green-100 px-10 font-poppins text-green-900 shadow-lg transition-all duration-200 dark:from-gray-800 dark:to-gray-900 dark:border-green-700 dark:text-green-100">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-1.5 text-2xl font-bold text-green-800 dark:text-green-200">
            <Calendar className="h-7 w-7" />
            {isEditing ? meetingType : `New ${meetingType}`}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-2">
          {(errorMessage || localError) && (
            <p className="text-sm text-red-600">{errorMessage || localError}</p>
          )}

          <div className="grid grid-cols-3 items-center gap-4">
            <Label
              htmlFor="meeting-title"
              className="flex items-center gap-1 text-sm font-medium text-green-800 dark:text-green-200"
            >
              <Tag className="h-5 w-5" /> Title
            </Label>
            <Input
              id="meeting-title"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                setLocalError(null);
              }}
              placeholder="Meeting title"
              className={`col-span-2 rounded-md border text-sm transition-all duration-150 dark:bg-gray-900 dark:text-green-100 ${
                localError?.includes('Title')
                  ? 'border-red-500'
                  : 'border-green-300 dark:border-green-600'
              } focus:border-green-500 focus:ring-1 focus:ring-green-500`}
              aria-required="true"
            />
          </div>

          <div className="grid grid-cols-3 items-center gap-4">
            <Label className="flex items-center gap-1 text-xs font-medium text-green-800 dark:text-green-200">
              <Clock className="h-5 w-5" /> Time
            </Label>
            <div className="w-35 col-span-2 flex gap-2 text-xs">
              <Select
                value={startTime}
                onValueChange={(value) => {
                  setStartTime(value);
                  setLocalError(null);
                }}
              >
                <SelectTrigger
                  className={`w-full rounded-md border bg-white text-sm font-poppins text-green-900 transition-all duration-150 dark:bg-gray-900 dark:text-green-100 ${
                    localError?.includes('Start time')
                      ? 'border-red-500'
                      : 'border-green-300 dark:border-green-600'
                  } hover:bg-green-50 dark:hover:bg-green-800 focus:border-green-500 focus:ring-1 focus:ring-green-500`}
                  aria-required="true"
                >
                  <SelectValue placeholder="Select start time" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-900 dark:border-green-600">
                  {TIME_SLOTS.map(({ value, label }) => (
                    <SelectItem
                      key={value}
                      value={value}
                      className="text-green-900 dark:text-green-100 hover:bg-green-100 dark:hover:bg-green-700 focus:bg-green-100 dark:focus:bg-green-700"
                    >
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select
                value={endTime}
                onValueChange={(value) => {
                  setEndTime(value);
                  setLocalError(null);
                }}
              >
                <SelectTrigger
                  className={`w-full rounded-md border bg-white text-sm font-poppins text-green-900 transition-all duration-150 dark:bg-gray-900 dark:text-green-100 ${
                    localError?.includes('End time')
                      ? 'border-red-500'
                      : 'border-green-300 dark:border-green-600'
                  } hover:bg-green-50 dark:hover:bg-green-800 focus:border-green-500 focus:ring-1 focus:ring-green-500`}
                  aria-required="true"
                >
                  <SelectValue placeholder="Select end time" />
                </SelectTrigger>
                <SelectContent className="bg-white dark:bg-gray-900 dark:border-green-600">
                  {TIME_SLOTS.map(({ value, label }) => (
                    <SelectItem
                      key={value}
                      value={value}
                      className="text-green-900 dark:text-green-100 hover:bg-green-100 dark:hover:bg-green-700 focus:bg-green-100 dark:focus:bg-green-700"
                    >
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-3 items-start gap-4">
            <Label className="flex items-center gap-1 text-sm font-medium text-green-800 dark:text-green-200">
              <Tag className="h-5 w-5" /> Type
            </Label>
            <div className="col-span-2 flex flex-wrap gap-2">
              {Object.entries(meetingTypeColors).map(([type, color]) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setMeetingType(type)}
                  className={`h-7 w-7 rounded-full border transition-all duration-150 hover:scale-105 focus:outline-none focus:ring-1 focus:ring-green-500 ${
                    meetingType === type
                      ? 'scale-105 border-green-500 dark:border-green-400'
                      : 'border-green-300 dark:border-green-600'
                  }`}
                  style={{ backgroundColor: color }}
                  title={type}
                  aria-label={`Select ${type}`}
                >
                  <span className="sr-only">{type}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 items-start gap-4">
            <Label className="flex items-center gap-1 text-sm font-medium text-green-800 dark:text-green-200">
              <Building2 className="h-5 w-5" /> Dept
            </Label>
            <div className="col-span-2 flex flex-wrap gap-2">
              {departments.map((dept) => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setDepartment(dept)}
                  className={`rounded-md border px-2 py-0.5 text-xs transition-all duration-150 hover:bg-green-200 focus:outline-none focus:ring-1 focus:ring-green-500 dark:hover:bg-green-600 ${
                    department === dept
                      ? 'border-green-500 bg-green-100 dark:border-green-400 dark:bg-green-700'
                      : 'border-green-300 bg-white dark:border-green-600 dark:bg-gray-900'
                  } text-green-900 dark:text-green-100`}
                  aria-label={`Select ${dept}`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button
            variant="outline"
            onClick={resetForm}
            className="flex items-center gap-1 rounded-md border border-green-300 px-3 py-1 text-sm text-green-800 transition-all duration-150 hover:bg-green-100 dark:border-green-700 dark:text-green-200 dark:hover:bg-green-600"
          >
            <RotateCcw className="h-3 w-3" />
            Reset
          </Button>
          <Button
            variant="outline"
            onClick={onClose}
            className="rounded-md border border-green-300 px-3 py-1 text-sm text-green-800 transition-all duration-150 hover:bg-green-100 dark:border-green-700 dark:text-green-200 dark:hover:bg-green-600"
          >
            Cancel
          </Button>
          {isEditing && onDelete && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="flex items-center gap-1 rounded-md bg-red-600 px-3 py-1 text-sm text-white transition-all duration-150 hover:bg-red-700 dark:text-white"
            >
              <Trash2 className="h-3 w-3" /> Delete
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            className="rounded-md bg-green-600 px-3 py-1 text-sm text-white transition-all duration-150 hover:bg-green-700 dark:text-white"
            disabled={!title.trim() || !startTime || !endTime || !department}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}