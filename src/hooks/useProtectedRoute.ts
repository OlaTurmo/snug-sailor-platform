import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Permission, UserRole } from '../types/user';

interface ProtectedRouteOptions {
  requiredRole?: UserRole;
  requiredPermission?: Permission;
}

export const useProtectedRoute = (options: ProtectedRouteOptions = {}) => {
  const { user, isLoading, hasPermission, isRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !user) {
      console.log('User not authenticated, redirecting to login');
      navigate('/login');
      return;
    }

    if (options.requiredRole && !isRole(options.requiredRole)) {
      console.log('User does not have required role, redirecting to home');
      navigate('/');
      return;
    }

    if (options.requiredPermission && !hasPermission(options.requiredPermission)) {
      console.log('User does not have required permission, redirecting to home');
      navigate('/');
      return;
    }
  }, [user, isLoading, options.requiredRole, options.requiredPermission]);

  return { isLoading, user };
};