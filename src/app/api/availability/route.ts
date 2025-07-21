import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from '@/lib/supabase';
import { requireAuth, createAuthResponse } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth();
    const supabase = supabaseClient;
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('user_id') || user.id;
    
    const { data: availability, error } = await supabase
      .from('availability')
      .select('*')
      .eq('user_id', userId)
      .order('day_of_week', { ascending: true });
    
    if (error) {
      console.error('Error fetching availability:', error);
      return NextResponse.json(
        { error: 'Failed to fetch availability' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ availability });
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
    const user = await requireAuth(request);
    const supabase = createServerSupabaseClient();
    
    const body = await request.json();
    const { day_of_week, start_time, end_time, is_available } = body;
    
    // Validate required fields
    if (day_of_week === undefined || !start_time || !end_time || is_available === undefined) {
      return NextResponse.json(
        { error: 'day_of_week, start_time, end_time, and is_available are required' },
        { status: 400 }
      );
    }
    
    const { data: availability, error } = await supabase
      .from('availability')
      .insert({
        user_id: user.id,
        day_of_week,
        start_time,
        end_time,
        is_available
      })
      .select()
      .single();
    
    if (error) {
      console.error('Error creating availability:', error);
      return NextResponse.json(
        { error: 'Failed to create availability' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ availability }, { status: 201 });
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
