import React from 'react';
import Navbar from './Navbar';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';

const Layout = ({ children }) => {
  const router = useRouter();
  const { user, isAuthenticated, isLoading } = useAuth();
  
  // Check if the current path is an admin route
  const isAdminRoute = router.pathname.startsWith('/admin');
  
  // If the page is an admin route and the user is not an admin, redirect to home
  React.useEffect(() => {
    if (!isLoading && isAdminRoute) {
      if (!isAuthenticated) {
        router.push('/login?redirect=' + router.pathname);
      } else if (user && user.role !== 'admin') {
        router.push('/');
      }
    }
  }, [isAuthenticated, isLoading, isAdminRoute, router, user]);
  
  // If still loading auth state, show a loading indicator for admin routes
  if (isLoading && isAdminRoute) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  // If not authenticated or not admin, and trying to access admin routes, don't render the content
  if (isAdminRoute && (!isAuthenticated || (user && user.role !== 'admin'))) {
    return null; // Don't render anything while redirecting
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      {/* Add padding-top to account for the fixed navbar */}
      <main className="flex-grow pt-16 w-full">
        {children}
      </main>
      
      {/* Simple footer */}
      <footer className="bg-white shadow-inner py-6 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-gray-500 text-sm">© 2025 PrimePlus+ | All rights reserved</p>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-500 hover:text-blue-600 transition-colors duration-200">
                Contact Us
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Layout;