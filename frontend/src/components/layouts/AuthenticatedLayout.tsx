import React, { ReactNode } from 'react';
import Head from 'next/head';
import NavigationSidebar from './NavigationSidebar';

interface AuthenticatedLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
}

const AuthenticatedLayout: React.FC<AuthenticatedLayoutProps> = ({ 
  children, 
  title = 'PrimePlus+',
  description = 'Premium content platform for creators and subscribers'
}) => {
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="flex min-h-screen bg-gray-50">
        {/* Navigation Sidebar */}
        <NavigationSidebar />
        
        {/* Main Content */}
        <div className="flex-1 ml-16 md:ml-64">
          <main className="py-6 px-4 md:px-8">
            {children}
          </main>
        </div>
      </div>
    </>
  );
};

export default AuthenticatedLayout;