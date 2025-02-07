import { createContext, useContext, useEffect, useState } from "react";
import { supabase, getSessionAndSetAuth } from "@/integrations/supabase/client";

// Define authentication context shape
interface AuthContextType {
  user: any;
  isLoading: boolean;
  signOut: () => void;
}

// Create the authentication context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Hook to use authentication context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// AuthProvider component
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      console.log("=== Checking Supabase Session ===");

      try {
        await getSessionAndSetAuth(); // Force session retrieval

        const { data: { session }, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Session retrieval error:", error);
          setUser(null);
          return;
        }

        if (session?.session) {
          console.log("Active session found:", session.session.user.id);
          setUser(session.session.user);
        } else {
          console.log("No active session found.");
          setUser(null);
        }
      } catch (error) {
        console.error("Session check error:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
        console.log("=== Session Check Complete ===");
      }
    };

    checkSession();

    // Listen for authentication state changes
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log("Auth state changed:", _event);
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signOut }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
