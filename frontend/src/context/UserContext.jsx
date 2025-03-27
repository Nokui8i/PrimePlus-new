import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Create the context
const UserContext = createContext({
  user: null,
  setUser: () => {},
  loading: false,
  error: null
});

// Create a provider component
export const UserProvider = ({ children }) => {
  // Get authentication data from AuthContext
  const { user: authUser, isLoading: authLoading } = useAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Set user data from auth context when it changes
  useEffect(() => {
    if (!authLoading) {
      setUser(authUser);
      setLoading(false);
    }
  }, [authUser, authLoading]);

  return (
    <UserContext.Provider
      value={{
        user,
        setUser,
        loading,
        error
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Create a hook to use the context
export const useUser = () => useContext(UserContext);

export { UserContext };