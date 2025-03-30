import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/components/providers/AuthProvider';
import MainLayout from '@/components/layouts/MainLayout';
import {
  UserCircleIcon,
  BellIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  Cog6ToothIcon,
  UserIcon,
  ChevronRightIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

const SettingsPage = () => {
  const router = useRouter();
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  const settingsSections = [
    {
      id: 'profile',
      name: 'Profile Settings',
      description: 'Manage your public profile information',
      icon: UserCircleIcon,
      href: '/settings/profile'
    },
    {
      id: 'account',
      name: 'Account Settings',
      description: 'Update your account preferences and security',
      icon: UserIcon,
      href: '/settings/account'
    },
    {
      id: 'privacy',
      name: 'Privacy & Safety',
      description: 'Control your privacy and security settings',
      icon: ShieldCheckIcon,
      href: '/settings/privacy'
    },
    {
      id: 'notifications',
      name: 'Notifications',
      description: 'Choose how you want to be notified',
      icon: BellIcon,
      href: '/settings/notifications'
    },
    {
      id: 'creator',
      name: 'Creator Settings',
      description: 'Manage your creator profile and earnings',
      icon: CreditCardIcon,
      href: '/settings/creator',
      creatorOnly: true
    }
  ];

  const filteredSections = settingsSections.filter(section => 
    !section.creatorOnly || (section.creatorOnly && user?.isCreator)
  );

  if (!isAuthenticated) {
    return null;
  }

  return (
    <MainLayout>
      <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900">
        {/* Header */}
        <div className="bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="py-4">
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => router.back()}
                  className="p-2 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                >
                  <ArrowLeftIcon className="h-5 w-5 text-neutral-600 dark:text-neutral-400" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                    Settings
                  </h1>
                  <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                    Manage your account settings and preferences
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="grid gap-6">
            {filteredSections.map((section) => {
              const Icon = section.icon;
              
              return (
                <Link
                  key={section.id}
                  href={section.href}
                  className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm hover:shadow-md transition-shadow p-6 flex items-center justify-between group"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                      <Icon className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-neutral-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                        {section.name}
                      </h3>
                      <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        {section.description}
                      </p>
                    </div>
                  </div>
                  <ChevronRightIcon className="h-5 w-5 text-neutral-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage; 