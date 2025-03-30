import React, { useState } from 'react';
import Link from 'next/link';

export interface Creator {
  id: string;
  username: string;
  fullName?: string;
  bio?: string;
  profileImage?: string;
  coverImage?: string;
  isVerified: boolean;
  contentCount: number;
  subscriberCount: number;
  subscriptionPlans?: {
    id: string;
    name: string;
    price: number;
    interval: string;
  }[];
}

interface CreatorProfileHeaderProps {
  creator: Creator;
  isSubscribed: boolean;
  isOwnProfile?: boolean;
}

const CreatorProfileHeader: React.FC<CreatorProfileHeaderProps> = ({
  creator,
  isSubscribed,
  isOwnProfile = false
}) => {
  const [activeTab, setActiveTab] = useState('posts');
  const [showSubscriptionOptions, setShowSubscriptionOptions] = useState(false);
  
  return (
    <div className="bg-white border-b border-gray-200">
      {/* Cover Image */}
      <div className="relative h-48 sm:h-64 md:h-80 w-full bg-gray-200 overflow-hidden">
        {creator.coverImage ? (
          <img
            src={creator.coverImage}
            alt={`${creator.username}'s cover`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500" />
        )}
        
        {/* Profile Image - Positioned at bottom of cover */}
        <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-16 md:-bottom-20">
          <div className="relative">
            {creator.profileImage ? (
              <img
                src={creator.profileImage}
                alt={creator.username}
                className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-white object-cover"
              />
            ) : (
              <div className="h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-white bg-blue-500 flex items-center justify-center text-white text-4xl font-bold">
                {creator.username.charAt(0).toUpperCase()}
              </div>
            )}
            
            {/* Verified Badge */}
            {creator.isVerified && (
              <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full h-8 w-8 border-2 border-white flex items-center justify-center">
                <svg className="h-5 w-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Creator Info */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">
            {creator.fullName || creator.username}
            {creator.isVerified && (
              <span className="inline-block ml-2">
                <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </span>
            )}
          </h1>
          <p className="text-gray-500 text-sm mt-1">@{creator.username}</p>
          
          {creator.bio && (
            <p className="mt-3 max-w-2xl mx-auto text-sm text-gray-600">
              {creator.bio}
            </p>
          )}
          
          <div className="mt-4 flex justify-center space-x-8">
            <div>
              <span className="block text-xl font-semibold text-gray-900">{creator.contentCount}</span>
              <span className="block text-sm text-gray-500">Posts</span>
            </div>
            <div>
              <span className="block text-xl font-semibold text-gray-900">{creator.subscriberCount}</span>
              <span className="block text-sm text-gray-500">Subscribers</span>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="mt-6 flex justify-center space-x-3">
            {isOwnProfile ? (
              <>
                <Link
                  href="/creator/studio"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Creator Studio
                </Link>
                <Link
                  href="/creator/settings"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Edit Profile
                </Link>
              </>
            ) : isSubscribed ? (
              <>
                <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700">
                  <svg className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Send Tip
                </button>
                <Link
                  href={`/messages/${creator.id}`}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                  Message
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setShowSubscriptionOptions(!showSubscriptionOptions)}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                >
                  Subscribe
                  <svg className="ml-1 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                
                {showSubscriptionOptions && creator.subscriptionPlans && creator.subscriptionPlans.length > 0 && (
                  <div className="absolute left-0 mt-2 w-56 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      {creator.subscriptionPlans.map(plan => (
                        <Link
                          key={plan.id}
                          href={`/subscribe/${creator.id}?plan=${plan.id}`}
                          className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                          role="menuitem"
                          onClick={() => setShowSubscriptionOptions(false)}
                        >
                          <div className="flex justify-between items-center">
                            <span>{plan.name}</span>
                            <span className="font-semibold">${plan.price}/{plan.interval.charAt(0)}</span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Tabs Navigation */}
      <div className="border-t border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('posts')}
              className={`${
                activeTab === 'posts'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Posts
            </button>
            
            <button
              onClick={() => setActiveTab('photos')}
              className={`${
                activeTab === 'photos'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Photos
            </button>
            
            <button
              onClick={() => setActiveTab('videos')}
              className={`${
                activeTab === 'videos'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
            >
              Videos
            </button>
            
            {isSubscribed && (
              <button
                onClick={() => setActiveTab('exclusive')}
                className={`${
                  activeTab === 'exclusive'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
              >
                Exclusive Content
              </button>
            )}
          </nav>
        </div>
      </div>
    </div>
  );
};

export default CreatorProfileHeader;