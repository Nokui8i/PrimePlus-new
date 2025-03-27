import { ReactNode, useEffect, useContext } from 'react';
import Header from './Header';
import Head from 'next/head';
import { UserContext } from '@/context/UserContext';
import { socketService } from '@/services/socketService';
import { setupNotificationListeners } from '@/services/notificationService';

interface LayoutProps {
  children: ReactNode;
  title?: string;
}

export default function Layout({ children, title = 'primePlus+' }: LayoutProps) {
  const { user, isAuthenticated } = useContext(UserContext);
  
  // Initialize socket connection and notification listeners
  useEffect(() => {
    if (isAuthenticated && user?.id) {
      // Connect to socket
      socketService.connect();
      
      // Setup notification listeners
      setupNotificationListeners(user.id);
      
      // Cleanup on unmount
      return () => {
        socketService.disconnect();
      };
    }
  }, [isAuthenticated, user]);
  
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content="Content subscription platform" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <footer className="bg-gray-100 py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} primePlus+. All rights reserved.
            </p>
          </div>
        </footer>
      </div>
    </>
  );
}