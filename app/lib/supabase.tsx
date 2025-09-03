// lib/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_KEY;

if (!supabaseUrl) {
  throw new Error('Supabase URL must be provided in .env');
}

if (!supabaseKey) {
  throw new Error('Supabase ANON KEY must be provided in .env');
}

export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);
