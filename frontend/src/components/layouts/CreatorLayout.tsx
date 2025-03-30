import React, { ReactNode } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import MainLayout from './MainLayout';

interface CreatorLayoutProps {
  children: ReactNode;
  title?: string;
  description?: string;
  hideFooter?: boolean;
}

interface NavLink {
  name: string;
  path: string;
  icon: string;
  exact?: boolean;
}

const creatorNavLinks: NavLink[] = [
  {
    name: 'Dashboard',
    path: '/creator/dashboard',
    icon: 'dashboard',
    exact: true
  },
  {
    name: 'Content',
    path: '/creator/content',
    icon: 'content',
  },
  {
    name: 'Subscription',
    path: '/creator/subscription',
    icon: 'subscription',
  },
  {
    name: 'Subscribers',
    path: '/creator/subscription/subscribers',
    icon: 'subscribers',
  },
  {
    name: 'Analytics',
    path: '/creator/analytics',
    icon: 'analytics',
  },
  {
    name: 'Settings',
    path: '/creator/settings',
    icon: 'settings',
  }
];

// Helper function to get the appropriate SVG path based on icon name
const getIconPath = (icon: string): JSX.Element => {
  switch (icon) {
    case 'dashboard':
      return (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
        </svg>
      );
    case 'content':
      return (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      );
    case 'subscription':
      return (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
        </svg>
      );
    case 'subscribers':
      return (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      );
    case 'analytics':
      return (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      );
    case 'settings':
      return (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      );
    default:
      return (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      );
  }
};

const CreatorLayout: React.FC<CreatorLayoutProps> = ({
  children,
  title = 'Creator Dashboard | PrimePlus+',
  description = 'Manage your creator dashboard and content',
  hideFooter = true
}) => {
  const router = useRouter();
  const currentPath = router.pathname;
  
  const isActive = (path: string, exact = false): boolean => {
    if (exact) {
      return currentPath === path;
    }
    return currentPath.startsWith(path);
  };
  
  return (
    <MainLayout
      title={title}
      description={description}
      hideFooter={hideFooter}
      contentClassName="bg-gray-50"
    >
      <div className="flex min-h-screen">
        {/* Sidebar Navigation */}
        <div className="hidden md:flex md:flex-shrink-0">
          <div className="flex flex-col w-64 border-r border-gray-200 bg-white">
            <div className="flex flex-col flex-grow pt-5 pb-4 overflow-y-auto">
              <div className="flex items-center flex-shrink-0 px-4">
                <Link href="/creator/dashboard">
                  <a className="text-xl font-bold text-indigo-600">
                    Creator Dashboard
                  </a>
                </Link>
              </div>
              <div className="mt-5 flex-grow flex flex-col">
                <nav className="flex-1 space-y-1 px-2">
                  {creatorNavLinks.map((link) => (
                    <Link key={link.path} href={link.path}>
                      <a
                        className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                          isActive(link.path, link.exact)
                            ? 'bg-indigo-50 text-indigo-600'
                            : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                        }`}
                      >
                        <div
                          className={`mr-3 flex-shrink-0 ${
                            isActive(link.path, link.exact)
                              ? 'text-indigo-500'
                              : 'text-gray-400 group-hover:text-gray-500'
                          }`}
                        >
                          {getIconPath(link.icon)}
                        </div>
                        {link.name}
                      </a>
                    </Link>
                  ))}
                </nav>
              </div>
            </div>
            <div className="flex-shrink-0 flex border-t border-gray-200 p-4">
              <Link href="/creator/settings">
                <a className="flex-shrink-0 group block">
                  <div className="flex items-center">
                    <div>
                      <div className="h-9 w-9 rounded-full bg-gray-300 flex items-center justify-center text-gray-600">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900">
                        My Account
                      </p>
                      <p className="text-xs font-medium text-gray-500 group-hover:text-gray-700">
                        View settings
                      </p>
                    </div>
                  </div>
                </a>
              </Link>
            </div>
          </div>
        </div>
        
        {/* Mobile Header */}
        <div className="md:hidden bg-white border-b border-gray-200 sticky top-16 z-10">
          <div className="px-4 py-3 flex items-center justify-between">
            <div>
              <h1 className="text-lg font-semibold text-gray-900">Creator Dashboard</h1>
            </div>
            <div>
              <button
                type="button"
                className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                onClick={() => {
                  // Handle mobile menu toggle
                }}
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
          
          {/* Mobile Navigation */}
          <nav className="py-2 px-2 flex overflow-x-auto hide-scrollbar">
            {creatorNavLinks.map((link) => (
              <Link key={link.path} href={link.path}>
                <a
                  className={`flex-shrink-0 px-3 py-2 text-sm font-medium mr-4 ${
                    isActive(link.path, link.exact)
                      ? 'text-indigo-600 border-b-2 border-indigo-500'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {link.name}
                </a>
              </Link>
            ))}
          </nav>
        </div>
        
        {/* Main Content */}
        <div className="flex-1 overflow-auto focus:outline-none">
          <div className="relative z-10 flex-shrink-0 flex h-16 bg-white border-b border-gray-200 md:border-none">
            <div className="flex-1 px-4 flex justify-end md:px-6">
              <div className="ml-4 flex items-center md:ml-6">
                {/* Add any header controls/buttons here */}
              </div>
            </div>
          </div>
          
          <main className="pb-10 md:py-10">
            {children}
          </main>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreatorLayout;