'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/ialog';
import { Input } from '@/components/ui/nput';
import { Button } from '@/components/ui/utton';
import { Label } from '@/components/ui/abel';
import { HexColorPicker } from 'react-colorful';
import { useEffect, useState } from 'react';

interface CalendarModalProps {
  isOpen: boolean;
  initialTitle?: string;
  initialColor?: string;
  initialStartTime?: string;
  initialEndTime?: string;
  onClose: () => void;
  onSave: (title: string, color: string, startTime: string, endTime: string) => void;
}

export default function CalendarModal({
  isOpen,
  initialTitle = '',
  initialColor = '#10B981',
  initialStartTime = '',
  initialEndTime = '',
  onClose,
  onSave,
}: CalendarModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [color, setColor] = useState(initialColor);
  const [startTime, setStartTime] = useState(initialStartTime);
  const [endTime, setEndTime] = useState(initialEndTime);

  useEffect(() => {
    setTitle(initialTitle || '');
    setColor(initialColor || '#10B981');
    setStartTime(initialStartTime || '');
    setEndTime(initialEndTime || '');
  }, [initialTitle, initialColor, initialStartTime, initialEndTime, isOpen]);

  const handleSubmit = () => {
    if (title.trim() && startTime && endTime) {
      onSave(title, color, startTime, endTime);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="space-y-4 rounded-lg bg-green-50 dark:bg-gray-800 text-green-900 dark:text-green-100 border border-green-200 dark:border-green-700 shadow-lg">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold capitalize">
            Event Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-1.5">
          <Label htmlFor="event-title" className="text-sm font-medium text-green-800 dark:text-green-200">
            Event Title
          </Label>
          <Input
            id="event-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter event title"
            className="bg-white dark:bg-gray-900 text-green-900 dark:text-green-100 border border-green-200 dark:border-green-600 focus:ring-green-500 focus:border-green-500"
          />
        </div>

        <div className="space-y-1.5">
          <Label className="text-sm font-medium text-green-800 dark:text-green-200">Event Time</Label>
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
          <Label className="text-sm font-medium text-green-800 dark:text-green-200">Pick a Color</Label>
          <div className="rounded-md overflow-hidden border border-green-200 dark:border-green-600">
            <HexColorPicker color={color} onChange={setColor} />
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
