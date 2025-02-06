
import { User } from '../types/user';
import { supabase } from '../lib/supabase';

export const useProfileManagement = () => {
  const updateUserState = async (supabaseUserId: string) => {
    console.log('=== Profile Fetch Process Start ===');
    console.log('Attempting to fetch profile for user ID:', supabaseUserId);
    
    try {
      if (!supabaseUserId) {
        console.error('Invalid user ID provided');
        throw new Error('Invalid user ID provided');
      }

      console.log('Making database query to profiles table...');
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUserId)
        .single();

      if (profileError) {
        console.error('Profile fetch failed:', {
          message: profileError.message,
          details: profileError.details,
          hint: profileError.hint,
          code: profileError.code
        });

        // If profile doesn't exist, create it
        if (profileError.code === 'PGRST116') {
          const { data: authUser } = await supabase.auth.getUser();
          if (authUser?.user) {
            const { data: newProfile, error: createError } = await supabase
              .from('profiles')
              .insert([
                {
                  id: supabaseUserId,
                  email: authUser.user.email,
                  name: authUser.user.email?.split('@')[0] || 'User',
                  role: 'responsible_heir',
                  permissions: ['full_edit']
                }
              ])
              .select()
              .single();

            if (createError) throw createError;
            if (newProfile) {
              console.log('Created new profile:', newProfile);
              return {
                id: newProfile.id,
                email: newProfile.email,
                name: newProfile.name,
                role: newProfile.role,
                permissions: newProfile.permissions,
                createdAt: new Date(newProfile.created_at),
                updatedAt: new Date(newProfile.updated_at),
              };
            }
          }
        }
        throw profileError;
      }

      if (!profile) {
        console.error('No profile data returned for ID:', supabaseUserId);
        throw new Error('Profile not found');
      }

      console.log('Profile data retrieved successfully:', profile);

      const userData: User = {
        id: supabaseUserId,
        email: profile.email,
        name: profile.name,
        role: profile.role || 'responsible_heir',
        permissions: profile.permissions || ['full_edit'],
        createdAt: new Date(profile.created_at),
        updatedAt: new Date(profile.updated_at),
      };

      console.log('Returning validated user data:', userData);
      return userData;
      
    } catch (error) {
      console.error('Profile fetch process failed:', error);
      throw error;
    } finally {
      console.log('=== Profile Fetch Process End ===');
    }
  };

  return { updateUserState };
};
