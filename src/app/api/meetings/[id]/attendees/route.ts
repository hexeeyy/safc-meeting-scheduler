import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { requireAuth, createAuthResponse } from '@/lib/auth';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(request);
    const supabase = createServerSupabaseClient();
    const { id: meetingId } = params;
    const body = await request.json();
    const { user_id, status = 'invited' } = body;
    
    // Check if user is organizer
    const { data: meeting, error: fetchError } = await supabase
      .from('meetings')
      .select(`
        *,
        meeting_attendees!inner(
          user_id,
          is_organizer
        )
      `)
      .eq('id', meetingId)
      .eq('meeting_attendees.user_id', user.id)
      .single();
    
    if (fetchError || !meeting) {
      return NextResponse.json(
        { error: 'Meeting not found' },
        { status: 404 }
      );
    }
    
    const isOrganizer = meeting.meeting_attendees.some(
      (attendee: any) => attendee.user_id === user.id && attendee.is_organizer
    );
    
    if (!isOrganizer && meeting.created_by !== user.id) {
      return NextResponse.json(
        { error: 'Only organizers can add attendees' },
        { status: 403 }
      );
    }
    
    const { data: attendee, error } = await supabase
      .from('meeting_attendees')
      .insert({
        meeting_id: meetingId,
        user_id,
        status,
        is_organizer: false
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error adding attendee:', error);
      return NextResponse.json(
        { error: 'Failed to add attendee' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ attendee }, { status: 201 });
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(request);
    const supabase = createServerSupabaseClient();
    const { id: meetingId } = params;
    const body = await request.json();
    const { status } = body;
    
    if (!status) {
      return NextResponse.json(
        { error: 'Status is required' },
        { status: 400 }
      );
    }
    
    // Update user's own attendance status
    const { data: attendee, error } = await supabase
      .from('meeting_attendees')
      .update({ status })
      .eq('meeting_id', meetingId)
      .eq('user_id', user.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating attendance:', error);
      return NextResponse.json(
        { error: 'Failed to update attendance' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ attendee });
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
