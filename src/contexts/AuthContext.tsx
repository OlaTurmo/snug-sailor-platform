
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Permission } from '../types/user';
import { supabase } from '../lib/supabase';
import { useAuthOperations } from '../hooks/useAuthOperations';
import { useProfileManagement } from '../hooks/useProfileManagement';
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ user: User } | undefined>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
  isRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { login: authLogin, logout: authLogout, signup: authSignup } = useAuthOperations();
  const { updateUserState } = useProfileManagement();
  const { toast } = useToast();

  const login = async (email: string, password: string) => {
    const result = await authLogin(email, password);
    if (result?.user) {
      setUser(result.user);
      toast({
        title: "Success",
        description: "You have been logged in successfully",
      });
    }
    return result;
  };

  const logout = async () => {
    try {
      await authLogout();
      setUser(null);
      toast({
        title: "Success",
        description: "You have been logged out successfully",
      });
    } catch (error) {
      console.error('Logout failed:', error);
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    const userData = await authSignup(email, password, name);
    setUser(userData);
    toast({
      title: "Success",
      description: "Account created successfully",
    });
  };

  const hasPermission = (permission: Permission): boolean => {
    return user?.permissions.includes(permission) ?? false;
  };

  const isRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      console.log('=== Session Check Start ===');
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check failed:', error);
          return;
        }
        
        if (session?.user && mounted) {
          console.log('Active session found:', session.user.id);
          const userData = await updateUserState(session.user.id);
          if (mounted && userData) {
            setUser(userData);
          }
        } else {
          console.log('No active session found');
          if (mounted) setUser(null);
        }
      } catch (error) {
        console.error('Session check error:', error);
      } finally {
        if (mounted) setIsLoading(false);
        console.log('=== Session Check End ===');
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('=== Auth State Change Event ===');
      console.log('Event type:', event);
      console.log('Session present:', !!session);
      
      if (event === 'SIGNED_IN' && session?.user && mounted) {
        console.log('Processing SIGNED_IN event for user:', session.user.id);
        try {
          const userData = await updateUserState(session.user.id);
          if (mounted && userData) {
            setUser(userData);
          }
        } catch (error) {
          console.error('Failed to update user state after sign in:', error);
        }
      } else if (event === 'SIGNED_OUT' && mounted) {
        console.log('User signed out, clearing user state');
        setUser(null);
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout, signup, hasPermission, isRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
