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
import { Calendar, Clock, Tag, Building2, Trash2 } from 'lucide-react';

export interface CalendarModalProps {
  isOpen: boolean;
  eventId?: string;
  initialTitle?: string;
  initialColor?: string;
  initialDepartment?: string;
  initialMeetingType?: string;
  initialStartTime?: string;
  initialEndTime?: string;
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
  'Loans Department',
  'Marketing Department',
  'Repossessed Properties Department',
  'Treasury Department',
  'Customer Service',
  'Accounting & Finance/CFO',
  'Human Resource',
  'Risk & Compliance, Audit, Remedial',
  'IT & Operations',
  'Executive Leadership',
  'CSR (SAFC Heroes)',
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
      onSave(title, meetingTypeColors[meetingType], department, startTime, endTime, meetingType);
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
      <DialogContent className="max-w-md w-full px-10 rounded-lg bg-gradient-to-br from-green-50 to-green-100 dark:from-gray-800 dark:to-gray-900 text-green-900 dark:text-green-100 border border-green-200 dark:border-green-700 shadow-lg font-poppins transition-all duration-200">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-green-800 dark:text-green-200 flex items-center gap-1.5">
            <Calendar className="w-7 h-7" />
            {isEditing ? `${meetingType}` : `New ${meetingType}`}
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-2 py-2">
          <div className="grid grid-cols-3 items-center gap-2">
            <Label htmlFor="meeting-title" className="text-s font-medium text-green-800 dark:text-green-200 flex items-center gap-1">
              <Tag className="w-5 h-5" /> Title
            </Label>
            <Input
              id="meeting-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Meeting title"
              className="col-span-2 bg-white dark:bg-gray-900 text-green-900 dark:text-green-100 border border-green-300 dark:border-green-600 focus:ring-1 focus:ring-green-500 focus:border-green-500 rounded-md text-sm transition-all duration-150 font-poppins"
              aria-required="true"
            />
          </div>

          <div className="grid grid-cols-3 items-center gap-2">
            <Label className="text-s font-medium text-green-800 dark:text-green-200 flex items-center gap-1">
              <Clock className="w-5 h-5" /> Time
            </Label>
            <div className="col-span-2 flex gap-2">
              <Input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full bg-white dark:bg-gray-900 text-green-900 dark:text-green-100 border border-green-300 dark:border-green-600 focus:ring-1 focus:ring-green-500 focus:border-green-500 rounded-md text-sm transition-all duration-150 font-poppins"
                aria-required="true"
              />
              <Input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full bg-white dark:bg-gray-900 text-green-900 dark:text-green-100 border border-green-300 dark:border-green-600 focus:ring-1 focus:ring-green-500 focus:border-green-500 rounded-md text-sm transition-all duration-150 font-poppins"
                aria-required="true"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 items-start gap-2">
            <Label className="text-s font-medium text-green-800 dark:text-green-200 flex items-center gap-1">
              <Tag className="w-5 h-5" /> Type
            </Label>
            <div className="col-span-2 flex flex-wrap gap-1.5">
              {Object.entries(meetingTypeColors).map(([type, color]) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setMeetingType(type)}
                  className={`w-7 h-7 rounded-full border transition-all duration-150 hover:scale-105 focus:outline-none focus:ring-1 focus:ring-green-500 ${
                    meetingType === type
                      ? 'border-green-500 dark:border-green-400 scale-105'
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

          <div className="grid grid-cols-3 items-start gap-2">
            <Label className="text-s font-medium text-green-800 dark:text-green-200 flex items-center gap-1">
              <Building2 className="w-5 h-5" /> Dept
            </Label>
            <div className="col-span-2 flex flex-wrap gap-1.5">
              {departments.map((dept) => (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setDepartment(dept)}
                  className={`px-2 py-0.5 rounded-md text-xs transition-all duration-150 hover:bg-green-200 dark:hover:bg-green-600 focus:outline-none focus:ring-1 focus:ring-green-500 font-poppins ${
                    department === dept
                      ? 'border-green-500 dark:border-green-400 bg-green-100 dark:bg-green-700'
                      : 'border-green-300 dark:border-green-600 bg-white dark:bg-gray-900'
                  } text-green-900 dark:text-green-100`}
                  aria-label={`Select ${dept}`}
                >
                  {dept}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-green-300 text-green-800 dark:border-green-700 dark:text-green-200 hover:bg-green-100 dark:hover:bg-green-600 rounded-md text-sm px-3 py-1 transition-all duration-150 font-poppins"
          >
            Cancel
          </Button>
          {isEditing && onDelete && (
            <Button
              variant="destructive"
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700 text-white dark:text-white rounded-md text-sm px-3 py-1 transition-all duration-150 font-poppins flex items-center gap-1"
            >
              <Trash2 className="w-3 h-3" /> Delete
            </Button>
          )}
          <Button
            onClick={handleSubmit}
            className="bg-green-600 hover:bg-green-700 text-white dark:text-white rounded-md text-sm px-3 py-1 transition-all duration-150 font-poppins"
            disabled={!title.trim() || !startTime || !endTime || !department}
          >
            Save
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}