import React, { ReactNode } from 'react';
import Head from 'next/head';
import Navigation from './Navigation';
import Footer from './Footer';

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
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen flex flex-col">
        {!hideNavbar && <Navigation />}
        
        <main className="flex-grow">
          {children}
        </main>
        
        {!hideFooter && <Footer />}
      </div>
    </>
  );
};

export default Layout;