
import { createContext, useContext, useEffect, useState } from "react";
import { supabase, getSessionAndSetAuth } from "@/integrations/supabase/client";
import { User, UserRole, Permission } from "@/types/user";

// Define authentication context shape
interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  signOut: () => Promise<void>;
  login: (email: string, password: string) => Promise<{ user: User } | undefined>;
  signup: (email: string, password: string, name: string) => Promise<User | undefined>;
  hasPermission: (permission: Permission) => boolean;
  isRole: (role: UserRole) => boolean;
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
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      console.log("=== Checking Supabase Session ===");

      try {
        await getSessionAndSetAuth();

        const { data, error } = await supabase.auth.getSession();

        if (error) {
          console.error("Session retrieval error:", error);
          setUser(null);
          return;
        }

        if (data.session?.user) {
          console.log("Active session found:", data.session.user.id);
          // Convert auth user to our User type
          setUser({
            id: data.session.user.id,
            email: data.session.user.email || '',
            name: data.session.user.user_metadata?.name || data.session.user.email?.split('@')[0] || 'User',
            role: 'responsible_heir',
            permissions: ['full_edit'],
            createdAt: new Date(),
            updatedAt: new Date()
          });
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

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      console.log("Auth state changed:", _event);
      if (session?.user) {
        setUser({
          id: session.user.id,
          email: session.user.email || '',
          name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'User',
          role: 'responsible_heir',
          permissions: ['full_edit'],
          createdAt: new Date(),
          updatedAt: new Date()
        });
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

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) throw error;

    if (data.user) {
      const user: User = {
        id: data.user.id,
        email: data.user.email || '',
        name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
        role: 'responsible_heir',
        permissions: ['full_edit'],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      return { user };
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }
      }
    });

    if (error) throw error;

    if (data.user) {
      const user: User = {
        id: data.user.id,
        email: data.user.email || '',
        name: name,
        role: 'responsible_heir',
        permissions: ['full_edit'],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      return user;
    }
  };

  const hasPermission = (permission: Permission) => {
    return user?.permissions?.includes(permission) || false;
  };

  const isRole = (role: UserRole) => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoading, 
      signOut, 
      login, 
      signup,
      hasPermission,
      isRole
    }}>
      {!isLoading && children}
    </AuthContext.Provider>
  );
};
