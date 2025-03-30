import { useContext } from 'react';
import { UserContext } from '@/context/UserContext';

interface User {
  id: string;
  name: string | null;
  email: string | null;
  avatar: string | null;
  isPremium?: boolean;
}

export function useUser() {
  const { user, isLoading } = useContext(UserContext);

  return {
    user: user ? {
      id: user.id || '',
      name: user.name || null,
      email: user.email || null,
      avatar: user.avatar || null,
      isPremium: user.isPremium || false
    } : null,
    isLoading,
    isAuthenticated: !!user
  };
} 