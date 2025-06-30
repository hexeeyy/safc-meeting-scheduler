'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useEffect, useState } from 'react';

interface CalendarModalProps {
  isOpen: boolean;
  initialTitle?: string;
  initialColor?: string;
  initialDepartment?: string;
  initialStartTime?: string;
  initialEndTime?: string;
  eventId?: string;
  onClose: () => void;
  onSave: (title: string, color: string, department: string, startTime: string, endTime: string) => void;
  onDelete?: () => void;
}

const meetingTypeColors: { [key: string]: string } = {
  'Team Meeting': '#10B981',
  'Client Call': '#3B82F6',
  'Review Session': '#F59E0B',
  'Training': '#8B5CF6',
  'Planning': '#EF4444',
  'One-on-One': '#06B6D4',
  'Budget Review': '#EC4899',
  'Project Update': '#F97316',
  'Brainstorming': '#6366F1',
  'Presentation': '#14B8A6',
};

const departments: string[] = [
  'Risk Management',
  'Loan Processing',
  'Credit Analysis',
  'IT Support',
  'Compliance',
  'Customer Service',
  'Accounting',
  'Collections',
  'Underwriting',
  'Marketing',
];

export default function CalendarModal({
  isOpen,
  initialTitle = '',
  initialColor = meetingTypeColors['Team Meeting'],
  initialDepartment = departments[0],
  initialStartTime = '',
  initialEndTime = '',
  eventId,
  onClose,
  onSave,
  onDelete,
}: CalendarModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [meetingType, setMeetingType] = useState(
    Object.keys(meetingTypeColors).find(
      (key) => meetingTypeColors[key] === initialColor
    ) || 'Team Meeting'
  );
  const [department, setDepartment] = useState(initialDepartment);
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);

  useEffect(() => {
    setTitle(initialTitle || '');
    setMeetingType(
      Object.keys(meetingTypeColors).find(
        (key) => meetingTypeColors[key] === initialColor
      ) || 'Team Meeting'
    );
    setDepartment(initialDepartment || departments[0]);
    setStartTime(initialStartTime || '');
    setEndTime(initialEndTime || '');
  }, [initialTitle, initialColor, initialDepartment, initialStartTime, initialEndTime, isOpen]);

  const handleSubmit = () => {
    if (title.trim() && startTime && endTime && department) {
      onSave(title, meetingTypeColors[meetingType], department, startTime, endTime);
      onClose();
    }
  };

  const handleDelete = () => {
    if (onDelete) {
      onDelete();
      onClose();
    } else {
      console.warn('Delete functionality not available: onDelete is undefined');
    }
  };

  const isEditing = !!eventId;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="space-y-4 rounded-lg bg-green-50 dark:bg-gray-800 text-green-900 dark:text-green-100 border border-green-200 dark:border-green-700 shadow-lg font-poppins">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold capitalize">
            {isEditing ? `${meetingType} Details` : `New ${meetingType}`}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-1.5">
          <Label htmlFor="meeting-title" className="text-sm font-medium text-green-800 dark:text-green-200">
            Meeting Title
          </Label>
          <Input
            id="meeting-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter meeting title"
            className="bg-white dark:bg-gray-900 text-green-900 dark:text-green-100 border border-green-200 dark:border-green-600 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-green-800 dark:text-green-200">Meeting Time</Label>
          <div className="flex gap-3">
            <Input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-white dark:bg-gray-900 text-green-900 dark:text-green-100 border border-green-200 dark:border-green-600 focus:ring-green-500 focus:border-green-500"
              placeholder="Start time"
            />
            <Input
              type="time"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              className="w-full bg-white dark:bg-gray-900 text-green-900 dark:text-green-100 border border-green-200 dark:border-green-600 focus:ring-green-500 focus:border-green-500"
              placeholder="End time"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-green-800 dark:text-green-200">Meeting Type</Label>
          <div className="flex gap-3 flex-wrap">
            {Object.entries(meetingTypeColors).map(([type, color]) => (
              <button
                key={type}
                type="button"
                onClick={() => setMeetingType(type)}
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  meetingType === type
                    ? 'border-green-500 dark:border-green-400 scale-110'
                    : 'border-green-200 dark:border-green-600'
                }`}
                style={{ backgroundColor: color }}
                title={type}
              >
                <span className="sr-only">{type}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-green-800 dark:text-green-200">Department</Label>
          <div className="flex gap-3 flex-wrap">
            {departments.map((dept) => (
              <button
                key={dept}
                type="button"
                onClick={() => setDepartment(dept)}
                className={`px-3 py-1 rounded-md Harrow-5 text-sm transition-all ${
                  department === dept
                    ? 'border-green-500 dark:border-green-400 bg-green-100 dark:bg-green-700'
                    : 'border-green-200 dark:border-green-600 bg-white dark:bg-gray-900'
                } text-green-900 dark:text-green-100`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-green-300 text-green-800 dark:border-green-700 dark:text-green-200 hover:bg-green-100 dark:hover:bg-green-700"
          >
            Cancel
          </Button>
          {isEditing && onDelete && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white dark:text-white"
            >
              Delete
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white dark:text-white"
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}