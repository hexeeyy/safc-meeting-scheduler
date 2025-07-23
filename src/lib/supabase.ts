import { createClient } from '@supabase/supabase-js';
import { Database } from '@/types/database';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!; // Must be set in .env.local
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // Must be set in .env.local

// Supabase client
export const supabaseClient = createClient<Database>(supabaseUrl, supabaseAnonKey);
export const createServerSupabaseClient = () => createClient<Database>(supabaseUrl, supabaseAnonKey);