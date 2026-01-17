import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = !!supabaseUrl && !!supabaseAnonKey;

// If config is missing, we return a dummy client or null. 
// However, the best practice is to export the client only if valid, or handle errors.
// We will export a client that might throw if used without config, or check isSupabaseConfigured.

// We cast to string to satisfy TS, validation happens at runtime usage
export const supabase = isSupabaseConfigured
    ? createClient(supabaseUrl as string, supabaseAnonKey as string)
    : null;
