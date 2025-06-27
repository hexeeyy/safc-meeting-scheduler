'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { HexColorPicker } from 'react-colorful';
import { useEffect, useState } from 'react';

interface CalendarModalProps {
  isOpen: boolean;
  initialTitle?: string;
  initialColor?: string;
  onClose: () => void;
  onSave: (title: string, color: string) => void;
}

export default function CalendarModal({
  isOpen,
  initialTitle = '',
  initialColor = '#10B981',
  onClose,
  onSave,
}: CalendarModalProps) {
  const [title, setTitle] = useState(initialTitle);
  const [color, setColor] = useState(initialColor);

  useEffect(() => {
    setTitle(initialTitle || '');
    setColor(initialColor || '#10B981');
  }, [initialTitle, initialColor, isOpen]);

  const handleSubmit = () => {
    if (title.trim()) {
      onSave(title, color);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="space-y-4">
        <DialogHeader>
          <DialogTitle>Event Details</DialogTitle>
        </DialogHeader>

        <div className="space-y-2">
          <Label htmlFor="event-title">Event Title</Label>
          <Input
            id="event-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter event title"
          />
        </div>

        <div className="space-y-2">
          <Label>Pick a Color</Label>
          <HexColorPicker color={color} onChange={setColor} />
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
