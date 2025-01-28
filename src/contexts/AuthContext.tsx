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

  useEffect(() => {
    // Check for existing session
    const checkSession = async () => {
      try {
        console.log('Checking session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        if (error) {
          console.error('Session check error:', error);
          throw error;
        }
        
        if (session?.user) {
          console.log('Found existing session:', session.user.id);
          const { data: profile, error: profileError } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (profileError) {
            console.error('Profile fetch error:', profileError);
            throw profileError;
          }

          if (profile) {
            console.log('Setting user profile:', profile);
            setUser({
              id: session.user.id,
              email: session.user.email!,
              name: profile.name,
              role: profile.role || 'responsible_heir',
              permissions: profile.permissions || ['full_edit'],
              createdAt: new Date(profile.created_at),
              updatedAt: new Date(profile.updated_at),
            });
          }
        }
      } catch (error) {
        console.error('Error checking session:', error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state changed:', event, session?.user?.id);
      if (event === 'SIGNED_IN' && session?.user) {
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          console.error('Profile fetch error on auth change:', profileError);
          return;
        }

        if (profile) {
          console.log('Setting user profile on auth change:', profile);
          setUser({
            id: session.user.id,
            email: session.user.email!,
            name: profile.name,
            role: profile.role || 'responsible_heir',
            permissions: profile.permissions || ['full_edit'],
            createdAt: new Date(profile.created_at),
            updatedAt: new Date(profile.updated_at),
          });
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        setUser(null);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

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

      // Create profile manually if trigger hasn't done it yet
      const { data: existingProfile, error: checkError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (checkError || !existingProfile) {
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
          ]);

        if (insertError) {
          console.error('Manual profile creation error:', insertError);
          throw insertError;
        }
      }

      // Fetch the profile after ensuring it exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) {
        console.error('Profile fetch error:', profileError);
        throw profileError;
      }

      console.log('Profile verified successfully:', profile);

      setUser({
        id: authData.user.id,
        email,
        name,
        role: 'responsible_heir',
        permissions: ['full_edit'],
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } catch (error) {
      console.error('Signup process failed:', error);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      console.log('Logging in...', email);
      const { data: { user: authUser }, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) throw signInError;
      if (!authUser) throw new Error('No user returned after login');

      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', authUser.id)
        .single();

      if (profileError) throw profileError;

      setUser({
        id: authUser.id,
        email: authUser.email!,
        name: profile.name,
        role: profile.role || 'responsible_heir',
        permissions: profile.permissions || ['full_edit'],
        createdAt: new Date(profile.created_at),
        updatedAt: new Date(profile.updated_at),
      });
    } catch (error) {
      console.error('Login error:', error);
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
