import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://your-project.supabase.co"; // Replace with your actual Supabase project URL
const supabaseAnonKey = "your-anon-key"; // Replace with your actual anon key

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // ✅ Keeps session across page reloads
    autoRefreshToken: true, // ✅ Automatically refresh tokens
    detectSessionInUrl: true, // ✅ Ensures session is handled correctly
  },
});

/**
 * Ensures authentication tokens are set before making any API calls.
 */
export const getSessionAndSetAuth = async () => {
  console.log("Fetching session and setting authentication...");

  const { data: session, error } = await supabase.auth.getSession();

  if (error) {
    console.error("Error fetching session:", error);
    return;
  }

  if (session?.session) {
    console.log("Setting authentication token...");
    await supabase.auth.setSession(session.session);
  } else {
    console.warn("No session token found.");
  }
};
