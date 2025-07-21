import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { requireAuth, createAuthResponse } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(request);
    const supabase = createServerSupabaseClient();
    const { id } = params;
    
    const { data: meeting, error } = await supabase
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
    
    if (error) {
      console.error('Error fetching meeting:', error);
      return NextResponse.json(
        { error: 'Meeting not found' },
        { status: 404 }
      );
    }
    
    // Check if user has access to this meeting
    const hasAccess = meeting.meeting_attendees.some(
      (attendee: any) => attendee.user_id === user.id
    );
    
    if (!hasAccess) {
      return NextResponse.json(
        { error: 'Access denied' },
        { status: 403 }
      );
    }
    
    return NextResponse.json({ meeting });
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
    const { id } = params;
    const body = await request.json();
    
    // Check if user is organizer or creator
    const { data: meeting, error: fetchError } = await supabase
      .from('meetings')
      .select(`
        *,
        meeting_attendees!inner(
          user_id,
          is_organizer
        )
      `)
      .eq('id', id)
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
        { error: 'Only organizers can update meetings' },
        { status: 403 }
      );
    }
    
    const {
      title,
      description,
      start_time,
      end_time,
      location,
      meeting_type,
      meeting_url,
      status
    } = body;
    
    const { data: updatedMeeting, error: updateError } = await supabase
      .from('meetings')
      .update({
        title,
        description,
        start_time,
        end_time,
        location,
        meeting_type,
        meeting_url,
        status
      })
      .eq('id', id)
      .select()
      .single();
    
    if (updateError) {
      console.error('Error updating meeting:', updateError);
      return NextResponse.json(
        { error: 'Failed to update meeting' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ meeting: updatedMeeting });
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

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await requireAuth(request);
    const supabase = createServerSupabaseClient();
    const { id } = params;
    
    // Check if user is organizer or creator
    const { data: meeting, error: fetchError } = await supabase
      .from('meetings')
      .select(`
        *,
        meeting_attendees!inner(
          user_id,
          is_organizer
        )
      `)
      .eq('id', id)
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
        { error: 'Only organizers can delete meetings' },
        { status: 403 }
      );
    }
    
    // Delete meeting attendees first
    await supabase
      .from('meeting_attendees')
      .delete()
      .eq('meeting_id', id);
    
    // Delete the meeting
    const { error: deleteError } = await supabase
      .from('meetings')
      .delete()
      .eq('id', id);
    
    if (deleteError) {
      console.error('Error deleting meeting:', deleteError);
      return NextResponse.json(
        { error: 'Failed to delete meeting' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ message: 'Meeting deleted successfully' });
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
