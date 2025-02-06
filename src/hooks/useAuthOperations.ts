
import { supabase } from '../lib/supabase';
import { useProfileManagement } from './useProfileManagement';
import { User } from '../types/user';

export const useAuthOperations = () => {
  const { updateUserState } = useProfileManagement();

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

      console.log('Supabase auth successful, fetching user profile');
      
      // Immediately fetch and update user profile
      const userData = await updateUserState(authUser.id);
      console.log('User profile fetched and state updated:', userData);
      
      if (userData) {
        return { user: userData };
      }
      
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

      // Create profile immediately after signup
      const { error: profileError } = await supabase
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

      if (profileError) {
        console.error('Profile creation error:', profileError);
        throw profileError;
      }

      // Return the user data
      const userData: User = {
        id: authData.user.id,
        email,
        name,
        role: 'responsible_heir',
        permissions: ['full_edit'],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return userData;
      
    } catch (error) {
      console.error('Signup process failed:', error);
      throw error;
    }
  };

  return { login, logout, signup };
};
