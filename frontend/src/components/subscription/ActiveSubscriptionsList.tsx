import React from 'react';
import { Subscription } from '../../services/subscriptionService';
import Image from 'next/image';
import Link from 'next/link';

interface ActiveSubscriptionsListProps {
  subscriptions: Subscription[];
  onCancelSubscription: (subscriptionId: string) => void;
  isLoading?: boolean;
}

const ActiveSubscriptionsList: React.FC<ActiveSubscriptionsListProps> = ({
  subscriptions,
  onCancelSubscription,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="w-full py-8 flex justify-center">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-6 py-1">
            <div className="h-2 bg-slate-200 rounded"></div>
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-4">
                <div className="h-2 bg-slate-200 rounded col-span-2"></div>
                <div className="h-2 bg-slate-200 rounded col-span-1"></div>
              </div>
              <div className="h-2 bg-slate-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (subscriptions.length === 0) {
    return (
      <div className="text-center py-8">
        <svg
          className="mx-auto h-12 w-12 text-gray-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-900">אין מנויים פעילים</h3>
        <p className="mt-1 text-sm text-gray-500">התחל לעקוב אחרי יוצרים אהובים כדי לצפות בתוכן הבלעדי שלהם.</p>
        <div className="mt-6">
          <Link href="/creators" className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            גלה יוצרים
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {subscriptions.map((subscription) => (
          <li key={subscription.id}>
            <div className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-12 w-12 relative">
                    {subscription.creator?.profileImage ? (
                      <Image
                        className="rounded-full"
                        src={subscription.creator.profileImage}
                        alt={subscription.creator.username}
                        fill
                        sizes="48px"
                        style={{ objectFit: 'cover' }}
                      />
                    ) : (
                      <div className="h-12 w-12 rounded-full bg-indigo-100 flex items-center justify-center">
                        <span className="text-lg font-medium text-indigo-800">
                          {subscription.creator?.username?.charAt(0).toUpperCase() || 'C'}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="mr-4">
                    <Link 
                      href={`/creators/${subscription.creator?.username}`}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-900"
                    >
                      {subscription.creator?.fullName || subscription.creator?.username || 'Unknown Creator'}
                    </Link>
                    <div className="text-sm text-gray-500">
                      <span className="font-medium">{subscription.plan?.name || 'Subscription Plan'}</span>
                      <span className="mx-1">•</span>
                      <span>
                        ${subscription.price}/{' '}
                        {subscription.interval === 'monthly' ? 'month' : 
                         subscription.interval === 'quarterly' ? '3 months' : 
                         subscription.interval === 'biannual' ? '6 months' : 'year'}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {subscription.status === 'active' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-green-100 text-green-800 mr-2">
                          Active
                        </span>
                      )}
                      {subscription.status === 'trial' && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 mr-2">
                          Trial Period
                        </span>
                      )}
                      {subscription.renewalDate && (
                        <span>Next renewal: {new Date(subscription.renewalDate).toLocaleDateString('en-US')}</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-end sm:items-center">
                  <Link
                    href={`/creators/${subscription.creator?.username}`}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mx-1 mb-2 sm:mb-0"
                  >
                    צפה בתוכן
                  </Link>
                  <button
                    onClick={() => onCancelSubscription(subscription.id)}
                    className="inline-flex items-center px-3 py-1.5 border border-gray-300 shadow-sm text-xs font-medium rounded text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 mx-1"
                  >
                    בטל מנוי
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ActiveSubscriptionsList; 