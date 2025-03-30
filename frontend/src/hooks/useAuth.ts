import { useState, useEffect } from 'react';

interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  avatar: string;
  bio?: string;
  location?: string;
  website?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    // TODO: Replace with actual API call
    // Mock authentication check
    const mockUser: User = {
      id: '1',
      username: 'johndoe',
      fullName: 'John Doe',
      email: 'john@example.com',
      avatar: 'https://picsum.photos/200/200',
      bio: 'Content creator and enthusiast',
      location: 'San Francisco, CA',
      website: 'https://example.com',
    };

    setAuthState({
      isAuthenticated: true,
      user: mockUser,
      loading: false,
      error: null,
    });
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // TODO: Implement actual login logic
      setAuthState(prev => ({ ...prev, loading: true }));
      
      // Mock successful login
      const mockUser: User = {
        id: '1',
        username: 'johndoe',
        fullName: 'John Doe',
        email: email,
        avatar: 'https://picsum.photos/200/200',
      };

      setAuthState({
        isAuthenticated: true,
        user: mockUser,
        loading: false,
        error: null,
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        error: 'Failed to login',
        loading: false,
      }));
    }
  };

  const logout = async () => {
    try {
      // TODO: Implement actual logout logic
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: null,
      });
    } catch (error) {
      setAuthState(prev => ({
        ...prev,
        error: 'Failed to logout',
      }));
    }
  };

  return {
    ...authState,
    login,
    logout,
  };
} 