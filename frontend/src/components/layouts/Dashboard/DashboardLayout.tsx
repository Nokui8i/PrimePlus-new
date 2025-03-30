import React, { ReactNode, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import NavigationSidebar from '../NavigationSidebar';
import DashboardSidebar from './DashboardSidebar';
import { useAuth } from '@/components/providers/AuthProvider';

interface DashboardLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  pageTitle?: string;
  pageDescription?: string;
  isCreatorDashboard?: boolean;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  title = 'Dashboard | PrimePlus+',
  description = 'Manage your PrimePlus+ account and content',
  pageTitle,
  pageDescription,
  isCreatorDashboard = false
}) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  
  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={description} />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <div className="min-h-screen bg-gray-50">
        <NavigationSidebar />
        
        <div className="flex">
          {/* Sidebar for large screens */}
          <div className="hidden md:block md:w-64 h-screen sticky top-0 bg-white shadow-sm">
            <DashboardSidebar isCreator={isCreatorDashboard} />
          </div>
          
          {/* Mobile sidebar */}
          {isSidebarOpen && (
            <div className="md:hidden fixed inset-0 z-50 bg-gray-600 bg-opacity-75">
              <div className="fixed inset-0 flex">
                <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
                  <div className="absolute top-0 right-0 -mr-12 pt-2">
                    <button
                      onClick={toggleSidebar}
                      className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                    >
                      <span className="sr-only">Close sidebar</span>
                      <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <DashboardSidebar isCreator={isCreatorDashboard} />
                </div>
                <div className="flex-shrink-0 w-14">
                  {/* Force sidebar to shrink to fit close icon */}
                </div>
              </div>
            </div>
          )}
          
          {/* Main content */}
          <div className="flex-1">
            {/* Mobile header */}
            <div className="md:hidden bg-white shadow">
              <div className="px-4 py-2 flex items-center">
                <button
                  onClick={toggleSidebar}
                  className="mr-4 text-gray-500 focus:outline-none focus:text-gray-700"
                >
                  <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
                <h1 className="text-lg font-semibold text-gray-900">
                  {pageTitle || (isCreatorDashboard ? 'Creator Dashboard' : 'Dashboard')}
                </h1>
              </div>
            </div>
            
            {/* Desktop header */}
            <div className="hidden md:block py-6 px-8">
              <div className="max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold text-gray-900">
                  {pageTitle || (isCreatorDashboard ? 'Creator Dashboard' : 'Dashboard')}
                </h1>
                {pageDescription && (
                  <p className="mt-1 text-sm text-gray-500">
                    {pageDescription}
                  </p>
                )}
              </div>
            </div>
            
            {/* Page content */}
            <main className="py-4 px-4 sm:px-6 md:px-8">
              <div className="max-w-7xl mx-auto">
                {children}
              </div>
            </main>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardLayout;