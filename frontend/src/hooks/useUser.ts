import { useSession } from 'next-auth/react';

interface User {
  id: string;
  name: string | null;
  email: string | null;
  avatar: string | null;
  isPremium?: boolean;
}

export function useUser() {
  const { data: session, status } = useSession();

  const user: User | null = session?.user ? {
    id: session.user.id || '',
    name: session.user.name || null,
    email: session.user.email || null,
    avatar: session.user.image || null,
    isPremium: false // Default to non-premium
  } : null;

  return {
    user,
    isLoading: status === 'loading',
    isAuthenticated: status === 'authenticated'
  };
} 