import React from 'react';
import { UserProvider } from '../context/UserContext';
import { FollowProvider } from '../context/FollowContext';

/**
 * RootProvider - Combines all context providers in the application
 * This component should wrap your application in _app.js or the main layout
 */
const RootProvider = ({ children }) => {
  return (
    <UserProvider>
      <FollowProvider>
        {children}
      </FollowProvider>
    </UserProvider>
  );
};

export default RootProvider;