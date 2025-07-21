import { NextRequest, NextResponse } from 'next/server';
import { supabaseClient } from './supabase';

export async function getAuthenticatedUser() {
  try {
    const { data: { user }, error } = await supabaseClient.auth.getUser();
    
    if (error || !user) {
      return null;
    }
    
    return user;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

export function createAuthResponse(message: string, status: number = 401) {
  return NextResponse.json(
    { error: message },
    { status }
  );
}

export async function requireAuth() {
  const user = await getAuthenticatedUser();
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  return user;
}
