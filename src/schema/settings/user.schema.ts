import { z } from 'zod';

export const userProfileSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  avatar_url: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  department: z
    .string()
    .max(50, 'Department must be less than 50 characters')
    .optional(),
  role: z
    .enum(['admin', 'member'])
    .default('member'),
});

export const meetingSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(100, 'Title must be less than 100 characters'),
  description: z
    .string()
    .max(500, 'Description must be less than 500 characters')
    .optional(),
  start_time: z
    .string()
    .datetime('Please enter a valid date and time'),
  end_time: z
    .string()
    .datetime('Please enter a valid date and time'),
  location: z
    .string()
    .max(100, 'Location must be less than 100 characters')
    .optional(),
  meeting_type: z
    .enum(['in-person', 'virtual', 'hybrid'])
    .default('in-person'),
  meeting_url: z
    .string()
    .url('Please enter a valid URL')
    .optional()
    .or(z.literal('')),
  attendees: z
    .array(z.string().uuid('Invalid user ID'))
    .optional()
    .default([]),
}).refine((data) => {
  const start = new Date(data.start_time);
  const end = new Date(data.end_time);
  return end > start;
}, {
  message: 'End time must be after start time',
  path: ['end_time'],
});

export const availabilitySchema = z.object({
  day_of_week: z
    .number()
    .min(0, 'Day of week must be between 0 and 6')
    .max(6, 'Day of week must be between 0 and 6'),
  start_time: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time (HH:MM)'),
  end_time: z
    .string()
    .regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Please enter a valid time (HH:MM)'),
  is_available: z
    .boolean()
    .default(true),
}).refine((data) => {
  const [startHour, startMin] = data.start_time.split(':').map(Number);
  const [endHour, endMin] = data.end_time.split(':').map(Number);
  const startMinutes = startHour * 60 + startMin;
  const endMinutes = endHour * 60 + endMin;
  return endMinutes > startMinutes;
}, {
  message: 'End time must be after start time',
  path: ['end_time'],
});

export const attendeeStatusSchema = z.object({
  status: z.enum(['invited', 'accepted', 'declined', 'tentative']),
});

export type UserProfileFormData = z.infer<typeof userProfileSchema>;
export type MeetingFormData = z.infer<typeof meetingSchema>;
export type AvailabilityFormData = z.infer<typeof availabilitySchema>;
export type AttendeeStatusFormData = z.infer<typeof attendeeStatusSchema>;