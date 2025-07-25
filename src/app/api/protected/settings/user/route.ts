import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase';
import { requireAuth, createAuthResponse } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const supabase = createServerSupabaseClient();
    
    const { data: userProfile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    
    if (error) {
      console.error('Error fetching user profile:', error);
      return NextResponse.json(
        { error: 'Failed to fetch user profile' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ user: userProfile });
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

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    const supabase = createServerSupabaseClient();
    
    const body = await request.json();
    const { name, avatar_url, department } = body;
    
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (avatar_url !== undefined) updateData.avatar_url = avatar_url;
    if (department !== undefined) updateData.department = department;
    
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: 'No valid fields to update' },
        { status: 400 }
      );
    }
    
    const { data: updatedUser, error } = await supabase
      .from('users')
      .update(updateData)
      .eq('id', user.id)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user profile:', error);
      return NextResponse.json(
        { error: 'Failed to update user profile' },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ user: updatedUser });
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