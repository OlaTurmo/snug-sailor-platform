import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nuoyastudqphomimqagu.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51b3lhc3R1ZHFwaG9taW1xYWd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwNTk3ODQsImV4cCI6MjA1MzYzNTc4NH0.u4bOlOOwCKOdF6qKqd8XDxcUqmUhCXTdJ07IOF5s35U';

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
      'X-Client-Info': 'supabase-js-web/2.1.0',
      'Content-Type': 'application/json',
    },
  },
  db: {
    schema: 'public'
  }
});

// Add detailed logging for auth state changes
supabase.auth.onAuthStateChange((event, session) => {
  console.log('Auth state change event:', event);
  if (session) {
    console.log('Session details:', {
      userId: session.user?.id,
      email: session.user?.email,
      lastSignIn: session.user?.last_sign_in_at
    });
  } else {
    console.log('No active session');
  }
});

// Test connection and log detailed response
supabase.auth.getSession().then(({ data, error }) => {
  if (error) {
    console.error('Supabase connection error:', error);
    console.error('Error details:', {
      message: error.message,
      status: error.status,
      name: error.name
    });
  } else {
    console.log('Supabase connection successful');
    if (data.session) {
      console.log('Active session found:', {
        userId: data.session.user.id,
        email: data.session.user.email
      });
    } else {
      console.log('No active session found');
    }
  }
});