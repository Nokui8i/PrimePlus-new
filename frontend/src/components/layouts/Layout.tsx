import React, { ReactNode } from 'react';
import Head from 'next/head';
import NavigationSidebar from './NavigationSidebar';
import Footer from './Footer';
import { useAuth } from '@/components/providers/AuthProvider';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  hideFooter?: boolean;
  hideNavbar?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  title = 'PrimePlus+ Platform',
  description = 'The premium subscription platform for content creators',
  hideFooter = false,
  hideNavbar = false
}) => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen flex flex-col">
        {isAuthenticated && <NavigationSidebar />}
        
        <main className={isAuthenticated ? 'pl-64 pt-16' : ''}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
        </main>
        
        {!hideFooter && <Footer />}
      </div>
    </>
  );
};

export default Layout;