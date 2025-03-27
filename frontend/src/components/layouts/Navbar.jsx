import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const router = useRouter();
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setIsUserMenuOpen(false);
      setIsMobileMenuOpen(false);
    };
    
    document.addEventListener('click', handleClickOutside);
    
    // Detect scroll for navbar styling
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await logout();
    router.push('/login');
  };

  const handleMenuToggle = (e) => {
    e.stopPropagation();
    setIsUserMenuOpen(!isUserMenuOpen);
  };

  const handleMobileMenuToggle = (e) => {
    e.stopPropagation();
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white shadow-md' : 'bg-white/90 backdrop-blur-sm'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent cursor-pointer">
                  PrimePlus+
                </span>
              </Link>
            </div>
            <div className="hidden md:ml-10 md:flex md:space-x-8">
              <Link href="/">
                <span className={`${
                  router.pathname === '/' 
                    ? 'border-blue-500 text-blue-600 font-medium' 
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer transition-colors duration-200`}>
                  Home
                </span>
              </Link>
              
              <Link href="/explore">
                <span className={`${
                  router.pathname === '/explore' 
                    ? 'border-blue-500 text-blue-600 font-medium' 
                    : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer transition-colors duration-200`}>
                  Explore
                </span>
              </Link>
              
              {isAuthenticated && (
                <>
                  <Link href="/dashboard">
                    <span className={`${
                      router.pathname === '/dashboard' 
                        ? 'border-blue-500 text-blue-600 font-medium' 
                        : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer transition-colors duration-200`}>
                      Dashboard
                    </span>
                  </Link>
                  
                  <Link href="/content">
                    <span className={`${
                      router.pathname === '/content' 
                        ? 'border-blue-500 text-blue-600 font-medium' 
                        : 'border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-300'
                    } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium cursor-pointer transition-colors duration-200`}>
                      My Content
                    </span>
                  </Link>
                </>
              )}
            </div>
          </div>
          
          <div className="hidden md:ml-6 md:flex md:items-center gap-4">
            {isAuthenticated ? (
              <div className="relative ml-3 flex items-center gap-4">
                <Link href="/notifications">
                  <button className="p-1 rounded-full text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative">
                    <span className="sr-only">View notifications</span>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    {/* Notification badge - show if there are notifications */}
                    <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500"></span>
                  </button>
                </Link>
                
                <Link href="/messages">
                  <button className="p-1 rounded-full text-gray-500 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                    <span className="sr-only">View messages</span>
                    <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                    </svg>
                  </button>
                </Link>
                
                <div onClick={(e) => e.stopPropagation()}>
                  <button
                    type="button"
                    className="bg-gray-100 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    id="user-menu-button"
                    onClick={handleMenuToggle}
                  >
                    <span className="sr-only">Open user menu</span>
                    <img
                      className="h-9 w-9 rounded-full object-cover border-2 border-white shadow-sm"
                      src={user?.profileImage || "https://via.placeholder.com/150"}
                      alt={user?.username || "User"}
                    />
                  </button>
                  
                  {isUserMenuOpen && (
                    <div
                      className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                      role="menu"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="px-4 py-3 border-b">
                        <p className="text-sm font-medium text-gray-900 truncate">{user?.name || user?.username}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      
                      <Link href="/profile">
                        <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center" role="menuitem">
                          <svg className="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                          Your Profile
                        </span>
                      </Link>
                      
                      <Link href="/settings">
                        <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center" role="menuitem">
                          <svg className="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          Settings
                        </span>
                      </Link>
                      
                      {/* Show Admin Dashboard link only for admin users */}
                      {user && user.role === 'admin' && (
                        <Link href="/admin">
                          <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer flex items-center" role="menuitem">
                            <svg className="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                            </svg>
                            Admin Dashboard
                          </span>
                        </Link>
                      )}
                      
                      <div className="border-t border-gray-100"></div>
                      
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        role="menuitem"
                      >
                        <svg className="mr-3 h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link href="/login">
                  <span className="inline-flex items-center px-4 py-2 border border-blue-300 text-sm font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 hover:border-blue-400 cursor-pointer transition-colors duration-200">
                    Sign in
                  </span>
                </Link>
                
                <Link href="/register">
                  <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 shadow-sm cursor-pointer transition-colors duration-200">
                    Sign up
                  </span>
                </Link>
              </div>
            )}
          </div>
          
          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded={isMobileMenuOpen}
              onClick={handleMobileMenuToggle}
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white shadow-lg" onClick={(e) => e.stopPropagation()}>
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/">
              <span
                className={`${
                  router.pathname === '/'
                    ? 'bg-blue-50 border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium cursor-pointer`}
              >
                Home
              </span>
            </Link>
            
            <Link href="/explore">
              <span
                className={`${
                  router.pathname === '/explore'
                    ? 'bg-blue-50 border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                } block pl-3 pr-4 py-2 border-l-4 text-base font-medium cursor-pointer`}
              >
                Explore
              </span>
            </Link>
            
            {isAuthenticated && (
              <>
                <Link href="/dashboard">
                  <span
                    className={`${
                      router.pathname === '/dashboard'
                        ? 'bg-blue-50 border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                    } block pl-3 pr-4 py-2 border-l-4 text-base font-medium cursor-pointer`}
                  >
                    Dashboard
                  </span>
                </Link>
                
                <Link href="/content">
                  <span
                    className={`${
                      router.pathname === '/content'
                        ? 'bg-blue-50 border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
                    } block pl-3 pr-4 py-2 border-l-4 text-base font-medium cursor-pointer`}
                  >
                    My Content
                  </span>
                </Link>
              </>
            )}
          </div>
          
          {isAuthenticated ? (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex items-center px-4">
                <div className="flex-shrink-0">
                  <img
                    className="h-10 w-10 rounded-full"
                    src={user?.profileImage || "https://via.placeholder.com/150"}
                    alt={user?.username || "User"}
                  />
                </div>
                <div className="ml-3">
                  <div className="text-base font-medium text-gray-800">{user?.name || user?.username}</div>
                  <div className="text-sm font-medium text-gray-500">{user?.email}</div>
                </div>
              </div>
              <div className="mt-3 space-y-1">
                <Link href="/profile">
                  <span className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 cursor-pointer">
                    Your Profile
                  </span>
                </Link>
                
                <Link href="/settings">
                  <span className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 cursor-pointer">
                    Settings
                  </span>
                </Link>
                
                {user && user.role === 'admin' && (
                  <Link href="/admin">
                    <span className="block px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100 cursor-pointer">
                      Admin Dashboard
                    </span>
                  </Link>
                )}
                
                <button
                  onClick={handleLogout}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-500 hover:text-gray-800 hover:bg-gray-100"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="pt-4 pb-3 border-t border-gray-200">
              <div className="flex flex-col px-4 space-y-3">
                <Link href="/login">
                  <span className="block w-full py-2 px-4 rounded-md shadow-sm text-center font-medium text-blue-600 bg-white border border-blue-300 hover:bg-gray-50 cursor-pointer">
                    Sign in
                  </span>
                </Link>
                
                <Link href="/register">
                  <span className="block w-full py-2 px-4 rounded-md shadow-sm text-center font-medium text-white bg-blue-600 hover:bg-blue-700 cursor-pointer">
                    Sign up
                  </span>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;