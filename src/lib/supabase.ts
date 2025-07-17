import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vaynaxwgubuavrpdamfe.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZheW5heHdndWJ1YXZycGRhbWZlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NTc1ODIsImV4cCI6MjA2ODAzMzU4Mn0.iSFm_WOMbdLBFDkp2ElUBtGioCo5ajr00lGGzJjDqpI';

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);