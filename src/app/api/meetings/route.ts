import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabase';
import { requireAuth, createAuthResponse } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const supabase = supabaseClient;
    
    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('start_date');
    const endDate = searchParams.get('end_date');
    
    let query = supabase
      .from('meetings')
      .select(`
        *,
        meeting_attendees!inner(
          user_id,
          status,
          is_organizer
        )
      `)
      .eq('meeting_attendees.user_id', user.id);
    
    if (startDate) {
      query = query.gte('start_time', startDate);
    }
    
    if (endDate) {
      query = query.lte('end_time', endDate);
    }
    
    const { data: meetings, error } = await query.order('start_time', { ascending: true });
    
    if (error) {
      console.error('Error fetching meetings:', error);
      return NextResponse.json(
        { error: 'Failed to fetch meetings' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ meetings });
  } catch (error) {
    if (error instanceof Error && error.message === 'Authentication required') {
      return createAuthResponse('Authentication required');
    }
    
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth();
    const supabase = supabaseClient;
    
    const body = await request.json();
    const {
      title,
      description,
      start_time,
      end_time,
      location,
      meeting_type,
      meeting_url,
      attendees = []
    } = body;
    
    // Validate required fields
    if (!title || !start_time || !end_time) {
      return NextResponse.json(
        { error: 'Title, start_time, and end_time are required' },
        { status: 400 }
      );
    }
    
    // Create the meeting
    const { data: meeting, error: meetingError } = await supabase
      .from('meetings')
      .insert({
        title,
        description,
        start_time,
        end_time,
        location,
        meeting_type: meeting_type || 'in-person',
        meeting_url,
        status: 'scheduled',
        created_by: user.id
      })
      .select()
      .single();
    
    if (meetingError) {
      console.error('Error creating meeting:', meetingError);
      return NextResponse.json(
        { error: 'Failed to create meeting' },
        { status: 500 }
      );
    }
    
    // Add the creator as an organizer
    const attendeeInserts = [
      {
        meeting_id: meeting.id,
        user_id: user.id,
        status: 'accepted' as const,
        is_organizer: true
      }
    ];
    
    // Add other attendees
    if (attendees.length > 0) {
      attendees.forEach((attendeeId: string) => {
        if (attendeeId !== user.id) {
          attendeeInserts.push({
            meeting_id: meeting.id,
            user_id: attendeeId,
            status: 'invited' as const,
            is_organizer: false
          });
        }
      });
    }
    
    const { error: attendeeError } = await supabase
      .from('meeting_attendees')
      .insert(attendeeInserts);
    
    if (attendeeError) {
      console.error('Error adding attendees:', attendeeError);
      // Note: Meeting was created but attendees failed to add
    }
    
    return NextResponse.json({ meeting }, { status: 201 });
  } catch (error) {
    if (error instanceof Error && error.message === 'Authentication required') {
      return createAuthResponse('Authentication required');
    }
    
    console.error('Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
