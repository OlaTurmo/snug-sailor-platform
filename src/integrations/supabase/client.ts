
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://nuoyastudqphomimqagu.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im51b3lhc3R1ZHFwaG9taW1xYWd1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwNTk3ODQsImV4cCI6MjA1MzYzNTc4NH0.u4bOlOOwCKOdF6qKqd8XDxcUqmUhCXTdJ07IOF5s35U";

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    storage: window.localStorage,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});

/**
 * Ensures authentication tokens are set before making any API calls.
 */
export const getSessionAndSetAuth = async () => {
  console.log("Fetching session and setting authentication...");

  const { data: { session }, error } = await supabase.auth.getSession();

  if (error) {
    console.error("Error fetching session:", error);
    return;
  }

  if (session) {
    console.log("Setting authentication token...");
    await supabase.auth.setSession(session);
  } else {
    console.warn("No session token found.");
  }
};

