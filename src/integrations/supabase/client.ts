import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://your-project.supabase.co"; // Replace with your Supabase project URL
const supabaseAnonKey = "your-anon-key"; // Replace with your Supabase anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // Ensures session persists after page refresh
    autoRefreshToken: true, // Automatically refresh tokens when they expire
    detectSessionInUrl: true,
  },
});

export const getSessionAndSetAuth = async () => {
  console.log("Fetching session and setting authentication...");
  const { data: session, error } = await supabase.auth.getSession();

  if (error) {
    console.error("Error fetching session:", error);
    return;
  }

  if (session?.access_token) {
    console.log("Setting authentication token...");
    await supabase.auth.setSession(session);
  } else {
    console.warn("No session token found.");
  }
};
