import { createClient, createServerClient, type CookieOptions } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vaynaxwgubuavrpdamfe.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZheW5heHdndWJ1YXZycGRhbWZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NTc1ODIsImV4cCI6MjA2ODAzMzU4Mn0.iSFm_WOMbdLBFDkp2ElUBtGioCo5ajr00lGGzJjDqpI';

// Client-side Supabase client
export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);

// Server-side Supabase client for API routes
export const createServerSupabaseClient = () => {
  const cookieStore = cookies();
  
  return createServerClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options });
          } catch (error) {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options });
          } catch (error) {
            // The `delete` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
};