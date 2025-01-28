import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://arving.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFydmluZyIsInJvbGUiOiJhbm9uIiwiaWF0IjoxNzA5OTk2ODAwLCJleHAiOjIwMjU1NzI4MDB9.ZXlPT_MPO3SvO9Ga8RXtj3TPmNhqEqnBGOuANGHVGQE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    flowType: 'pkce',
    storage: window.localStorage,
    storageKey: 'supabase.auth.token',
  },
  global: {
    headers: {
      'X-Client-Info': 'supabase-js-web',
      'Content-Type': 'application/json',
    },
  },
  db: {
    schema: 'public'
  }
});

// Add error event listener for debugging
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Supabase auth event:', event);
  if (session) {
    console.log('Session user:', session.user?.id);
  }
});