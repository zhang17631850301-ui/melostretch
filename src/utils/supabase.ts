import { createClient } from '@supabase/supabase-js';

// Publishable values are intentionally safe to include in browser code.
// Database access is protected by Supabase Auth and Row Level Security.
const SUPABASE_URL = 'https://vamfyaaxeczrmwefcalx.supabase.co';
const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_WzJXk-kqve2fJVkDAq3JuA_xM_lF4dQ';

export const supabase = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
