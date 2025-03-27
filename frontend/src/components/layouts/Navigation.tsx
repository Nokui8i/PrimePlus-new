import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAuth } from '@/components/providers/AuthProvider';
import {
  HomeIcon,
  BellIcon,
  UserIcon,
  ChatBubbleLeftRightIcon,
  BookmarkIcon,
  UsersIcon,
  Bars3Icon,
  XMarkIcon,
  ChartBarIcon,
  Cog6ToothIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  UserPlusIcon
} from '@heroicons/react/24/outline';

const Navigation = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const mainNavLinks = [
    { href: isAuthenticated ? '/home' : '/', label: 'Home', icon: HomeIcon },
    { href: '/notifications', label: 'Notifications', icon: BellIcon, auth: true },
    { href: '/messages', label: 'Messages', icon: ChatBubbleLeftRightIcon, auth: true },
    { href: '/collections', label: 'Collections', icon: BookmarkIcon, auth: true },
    { href: '/subscriptions', label: 'Subscriptions', icon: UsersIcon, auth: true },
  ];

  const userMenuLinks = [
    { href: '/profile', label: 'Profile', icon: UserIcon },
    { href: '/creator/dashboard', label: 'Creator Dashboard', icon: ChartBarIcon, show: user?.isCreator },
    { href: '/settings?section=profile', label: 'Settings', icon: Cog6ToothIcon },
    { href: '/help', label: 'Help', icon: QuestionMarkCircleIcon },
    { href: '/creator/onboarding', label: 'Become a Creator', icon: UserPlusIcon, show: !user?.isCreator },
  ];

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  const handleLogout = async () => {
    try {
      await router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <nav className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo and Main Nav */}
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                PrimePlus+
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden sm:ml-6 sm:flex sm:space-x-4">
              {mainNavLinks.map((link) => {
                if (!isAuthenticated && link.auth) return null;
                const Icon = link.icon;
                const isActive = router.pathname === link.href;
                
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`
                      inline-flex items-center px-3 py-2 text-sm font-medium rounded-md
                      transition-colors duration-150 ease-in-out
                      ${isActive 
                        ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20' 
                        : 'text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-700'
                      }
                    `}
                  >
                    <Icon className="h-5 w-5 mr-1.5" />
                    {link.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right side buttons */}
          <div className="flex items-center">
            {/* User Menu */}
            <div className="ml-3 relative">
              <button
                type="button"
                onClick={toggleUserMenu}
                className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                <img
                  className="h-8 w-8 rounded-full"
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.username || 'User'}`}
                  alt={user?.username || 'User avatar'}
                />
              </button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-neutral-800 ring-1 ring-black ring-opacity-5">
                  <div className="py-1">
                    {userMenuLinks.map((link) => {
                      if (link.show === false) return null;
                      const Icon = link.icon;
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          className="flex items-center px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                          onClick={() => setIsUserMenuOpen(false)}
                        >
                          <Icon className="h-5 w-5 mr-3" />
                          {link.label}
                        </Link>
                      );
                    })}
                    <button
                      onClick={handleLogout}
                      className="flex w-full items-center px-4 py-2 text-sm text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700"
                    >
                      <ArrowRightOnRectangleIcon className="h-5 w-5 mr-3" />
                      Sign out
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile menu button */}
            <button
              type="button"
              className="sm:hidden inline-flex items-center justify-center p-2 rounded-md text-neutral-400 hover:text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700"
              onClick={toggleMobileMenu}
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6" />
              ) : (
                <Bars3Icon className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            {mainNavLinks.map((link) => {
              if (!isAuthenticated && link.auth) return null;
              const Icon = link.icon;
              const isActive = router.pathname === link.href;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`
                    flex items-center px-3 py-2 text-base font-medium
                    ${isActive
                      ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20'
                      : 'text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                    }
                  `}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon className="h-5 w-5 mr-3" />
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navigation;