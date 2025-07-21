export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  role: 'admin' | 'member';
  department?: string;
  created_at: string;
  updated_at: string;
}

export interface Meeting {
  id: string;
  title: string;
  description?: string;
  start_time: string;
  end_time: string;
  location?: string;
  meeting_type: 'in-person' | 'virtual' | 'hybrid';
  meeting_url?: string;
  status: 'scheduled' | 'cancelled' | 'completed';
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface MeetingAttendee {
  id: string;
  meeting_id: string;
  user_id: string;
  status: 'invited' | 'accepted' | 'declined' | 'tentative';
  is_organizer: boolean;
  created_at: string;
  updated_at: string;
}

export interface Availability {
  id: string;
  user_id: string;
  day_of_week: number; // 0-6 (Sunday-Saturday)
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format
  is_available: boolean;
  created_at: string;
  updated_at: string;
}

export interface TimeSlot {
  id: string;
  user_id: string;
  date: string; // YYYY-MM-DD format
  start_time: string; // HH:MM format
  end_time: string; // HH:MM format
  is_blocked: boolean;
  reason?: string;
  created_at: string;
  updated_at: string;
}

// Database response types
export interface Database {
  public: {
    Tables: {
      users: {
        Row: User;
        Insert: Omit<User, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>;
      };
      meetings: {
        Row: Meeting;
        Insert: Omit<Meeting, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Meeting, 'id' | 'created_at' | 'updated_at'>>;
      };
      meeting_attendees: {
        Row: MeetingAttendee;
        Insert: Omit<MeetingAttendee, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<MeetingAttendee, 'id' | 'created_at' | 'updated_at'>>;
      };
      availability: {
        Row: Availability;
        Insert: Omit<Availability, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Availability, 'id' | 'created_at' | 'updated_at'>>;
      };
      time_slots: {
        Row: TimeSlot;
        Insert: Omit<TimeSlot, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<TimeSlot, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}
