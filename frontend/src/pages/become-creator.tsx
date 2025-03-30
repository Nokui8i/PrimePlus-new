import React from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import MainLayout from '@/components/layouts/MainLayout';
import { useAuth } from '@/components/providers/AuthProvider';
import { CheckCircleIcon } from '@heroicons/react/24/outline';
import { userService } from '@/services/userService';

const BecomeCreatorPage: NextPage = () => {
  const router = useRouter();
  const { isAuthenticated, updateUser } = useAuth();
  
  // Check authentication on mount
  React.useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);
  
  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Call the API to update user to creator status
      const response = await userService.becomeCreator();
      
      if (response.success) {
        // Update the user context with creator status
        await updateUser();
        
        // Show success message
        alert('Congratulations! Your creator account has been created.');
        
        // Redirect to profile page where they can set up creator settings
        router.push('/settings');
      } else {
        throw new Error(response.message || 'Failed to become a creator');
      }
    } catch (error) {
      console.error('Error creating creator account:', error);
      alert('Failed to create creator account. Please try again.');
    }
  };
  
  return (
    <MainLayout>
      <div className="container max-w-2xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Become a Creator</h1>
          <p className="text-neutral-600">
            Start sharing your content and connect with your audience
          </p>
        </div>

        <div className="bg-white dark:bg-neutral-800 rounded-lg p-8 shadow-sm">
          <div className="flex items-start space-x-4 mb-8">
            <div className="w-12 h-12 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center flex-shrink-0">
              <CheckCircleIcon className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Ready to Start?</h2>
              <p className="text-neutral-600">
                By becoming a creator, you'll be able to:
              </p>
              <ul className="mt-4 space-y-2">
                <li className="flex items-center text-neutral-600">
                  <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-2"></span>
                  Share exclusive content with your subscribers
                </li>
                <li className="flex items-center text-neutral-600">
                  <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-2"></span>
                  Set up subscriptions and receive payments
                </li>
                <li className="flex items-center text-neutral-600">
                  <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-2"></span>
                  Build your community and engage with fans
                </li>
                <li className="flex items-center text-neutral-600">
                  <span className="w-1.5 h-1.5 bg-primary-600 rounded-full mr-2"></span>
                  Access creator analytics and insights
                </li>
              </ul>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg">
              <p className="text-sm text-neutral-600">
                By clicking "Become a Creator", you agree to our{' '}
                <Link href="/terms" className="text-primary-600 hover:text-primary-700 font-medium">
                  Creator Terms
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary-600 hover:text-primary-700 font-medium">
                  Privacy Policy
                </Link>
              </p>
            </div>
            
            <button
              type="submit"
              className="btn-primary w-full py-3 text-lg"
            >
              Become a Creator
            </button>

            <p className="text-sm text-center text-neutral-500">
              You can set up your subscription pricing and payment details in your creator settings
            </p>
          </form>
        </div>
      </div>
    </MainLayout>
  );
};

export default BecomeCreatorPage;
