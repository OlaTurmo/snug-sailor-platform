import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole, Permission } from '../types/user';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signup: (email: string, password: string, name: string) => Promise<void>;
  hasPermission: (permission: Permission) => boolean;
  isRole: (role: UserRole) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const updateUserState = async (supabaseUserId: string) => {
    console.log('=== Update User State Start ===');
    console.log('Fetching user profile for ID:', supabaseUserId);
    
    try {
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUserId)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        throw profileError;
      }

      if (!profile) {
        console.error('No profile found for user ID:', supabaseUserId);
        throw new Error('No profile found');
      }

      console.log('Profile fetched successfully:', profile);
      
      const userData: User = {
        id: supabaseUserId,
        email: profile.email,
        name: profile.name,
        role: profile.role || 'responsible_heir',
        permissions: profile.permissions || ['full_edit'],
        createdAt: new Date(profile.created_at),
        updatedAt: new Date(profile.updated_at),
      };
      
      console.log('Setting user state with:', userData);
      setUser(userData);
      console.log('User state updated successfully');
      
    } catch (error) {
      console.error('Error in updateUserState:', error);
      throw error;
    } finally {
      console.log('=== Update User State End ===');
    }
  };

  useEffect(() => {
    const checkSession = async () => {
      try {
        console.log('Checking session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session check error:', error);
          return;
        }
        
        if (session?.user) {
          console.log('Found existing session:', session.user.id);
          await updateUserState(session.user.id);
        } else {
          console.log('No active session found');
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change event:', event, session?.user?.id);
      
      if (event === 'SIGNED_IN' && session?.user) {
        console.log('Processing SIGNED_IN event for user:', session.user.id);
        try {
          await updateUserState(session.user.id);
          console.log('User state updated after sign in');
        } catch (error) {
          console.error('Error updating user state after sign in:', error);
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out, clearing user state');
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    console.log('Starting login process...', { email });
    
    try {
      const { data: { user: authUser }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        console.error('Sign in error:', signInError);
        throw signInError;
      }

      if (!authUser) {
        console.error('No user returned after login');
        throw new Error('No user returned after login');
      }

      console.log('Supabase auth successful, waiting for auth state change');
      
      // The user state will be updated by the auth state change listener
      // Adding a small delay to ensure the listener has time to process
      await new Promise(resolve => setTimeout(resolve, 500));
      
    } catch (error) {
      console.error('Login process failed:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      console.log('Logging out...');
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const signup = async (email: string, password: string, name: string) => {
    try {
      console.log('Starting signup process...', { email, name });
      
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name
          }
        }
      });

      if (signUpError) {
        console.error('Signup error:', signUpError);
        throw signUpError;
      }

      if (!authData.user) {
        console.error('No user returned after signup');
        throw new Error('No user returned after signup');
      }

      console.log('User signed up successfully:', authData.user.id);

      // Wait briefly for the trigger to execute
      await new Promise(resolve => setTimeout(resolve, 500));

      // Attempt to create profile if it doesn't exist
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .maybeSingle();

      if (!existingProfile) {
        console.log('Profile not found, creating manually...');
        const { error: insertError } = await supabase
          .from('profiles')
          .insert([
            {
              id: authData.user.id,
              name,
              email,
              role: 'responsible_heir',
              permissions: ['full_edit']
            }
          ])
          .select()
          .single();

        if (insertError) {
          console.error('Manual profile creation error:', insertError);
          throw insertError;
        }
      }

      // Final profile fetch attempt
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError || !profile) {
        console.error('Final profile fetch error:', profileError);
        throw profileError || new Error('Profile not found after creation');
      }

      console.log('Profile verified successfully:', profile);

      setUser({
        id: authData.user.id,
        email,
        name,
        role: profile.role || 'responsible_heir',
        permissions: profile.permissions || ['full_edit'],
        createdAt: new Date(profile.created_at),
        updatedAt: new Date(profile.updated_at),
      });
    } catch (error) {
      console.error('Signup process failed:', error);
      throw error;
    }
  };

  const hasPermission = (permission: Permission): boolean => {
    return user?.permissions.includes(permission) ?? false;
  };

  const isRole = (role: UserRole): boolean => {
    return user?.role === role;
  };

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
