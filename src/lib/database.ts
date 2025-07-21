import { supabaseClient } from './supabase';
import { Database } from '@/types/database';

type Tables = Database['public']['Tables'];

// User operations
export const userOperations = {
  async getById(id: string) {
    const { data, error } = await supabaseClient
      .from('users')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getByEmail(email: string) {
    const { data, error } = await supabaseClient
      .from('users')
      .select('*')
      .eq('email', email)
      .single();
    
    if (error) throw error;
    return data;
  },

  async create(userData: Tables['users']['Insert']) {
    const { data, error } = await supabaseClient
      .from('users')
      .insert(userData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, userData: Tables['users']['Update']) {
    const { data, error } = await supabaseClient
      .from('users')
      .update(userData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async search(query: string, department?: string) {
    let queryBuilder = supabaseClient
      .from('users')
      .select('id, name, email, avatar_url, department, role');
    
    if (query) {
      queryBuilder = queryBuilder.or(`name.ilike.%${query}%,email.ilike.%${query}%`);
    }
    
    if (department) {
      queryBuilder = queryBuilder.eq('department', department);
    }
    
    const { data, error } = await queryBuilder.order('name', { ascending: true });
    
    if (error) throw error;
    return data;
  }
};

// Meeting operations
export const meetingOperations = {
  async getById(id: string) {
    const { data, error } = await supabaseClient
      .from('meetings')
      .select(`
        *,
        meeting_attendees(
          user_id,
          status,
          is_organizer,
          users(
            id,
            name,
            email,
            avatar_url
          )
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getByUserId(userId: string, startDate?: string, endDate?: string) {
    let query = supabaseClient
      .from('meetings')
      .select(`
        *,
        meeting_attendees!inner(
          user_id,
          status,
          is_organizer
        )
      `)
      .eq('meeting_attendees.user_id', userId);
    
    if (startDate) {
      query = query.gte('start_time', startDate);
    }
    
    if (endDate) {
      query = query.lte('end_time', endDate);
    }
    
    const { data, error } = await query.order('start_time', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async create(meetingData: Tables['meetings']['Insert']) {
    const { data, error } = await supabaseClient
      .from('meetings')
      .insert(meetingData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, meetingData: Tables['meetings']['Update']) {
    const { data, error } = await supabaseClient
      .from('meetings')
      .update(meetingData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    // Delete attendees first
    await supabaseClient
      .from('meeting_attendees')
      .delete()
      .eq('meeting_id', id);
    
    // Delete the meeting
    const { error } = await supabaseClient
      .from('meetings')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};

// Attendee operations
export const attendeeOperations = {
  async addAttendee(attendeeData: Tables['meeting_attendees']['Insert']) {
    const { data, error } = await supabaseClient
      .from('meeting_attendees')
      .insert(attendeeData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateStatus(meetingId: string, userId: string, status: string) {
    const { data, error } = await supabaseClient
      .from('meeting_attendees')
      .update({ status })
      .eq('meeting_id', meetingId)
      .eq('user_id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async removeAttendee(meetingId: string, userId: string) {
    const { error } = await supabaseClient
      .from('meeting_attendees')
      .delete()
      .eq('meeting_id', meetingId)
      .eq('user_id', userId);
    
    if (error) throw error;
  }
};

// Availability operations
export const availabilityOperations = {
  async getByUserId(userId: string) {
    const { data, error } = await supabaseClient
      .from('availability')
      .select('*')
      .eq('user_id', userId)
      .order('day_of_week', { ascending: true });
    
    if (error) throw error;
    return data;
  },

  async create(availabilityData: Tables['availability']['Insert']) {
    const { data, error } = await supabaseClient
      .from('availability')
      .insert(availabilityData)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async update(id: string, availabilityData: Tables['availability']['Update']) {
    const { data, error } = await supabaseClient
      .from('availability')
      .update(availabilityData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async delete(id: string) {
    const { error } = await supabaseClient
      .from('availability')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
  }
};
