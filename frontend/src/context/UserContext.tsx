import React, { createContext, useContext, ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useAuth, User } from '@/components/providers/AuthProvider';

interface UserContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const { user, loading, isAuthenticated } = useAuth();
  const router = useRouter();

  const isAdmin = user?.isAdmin ?? false;

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        error: null,
        isAuthenticated,
        isAdmin,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export default UserContext;