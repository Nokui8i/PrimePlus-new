import React, { useState } from 'react';
import type { NextPage } from 'next';
import Link from 'next/link';
import MainLayout from '@/components/layouts/MainLayout';
import {
  QuestionMarkCircleIcon,
  BookOpenIcon,
  UserGroupIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  LightBulbIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  ArrowRightIcon,
  MagnifyingGlassIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline';

// FAQ categories
type FAQCategory = 'account' | 'subscriptions' | 'content' | 'payments' | 'creators' | 'technical';

// FAQ interface
interface FAQ {
  id: string;
  category: FAQCategory;
  question: string;
  answer: string;
}

// Topic interface
interface HelpTopic {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  link: string;
}

const HelpPage: NextPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<FAQCategory | 'all'>('all');
  const [expandedFAQs, setExpandedFAQs] = useState<string[]>([]);
  
  // Toggle FAQ expand/collapse
  const toggleFAQ = (faqId: string) => {
    setExpandedFAQs(prevExpandedFAQs => 
      prevExpandedFAQs.includes(faqId)
        ? prevExpandedFAQs.filter(id => id !== faqId)
        : [...prevExpandedFAQs, faqId]
    );
  };
  
  // Help topics with icons
  const helpTopics: HelpTopic[] = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      description: 'New to Prime Plus? Learn the basics and get started quickly',
      icon: <BookOpenIcon className="w-8 h-8 text-green-500" />,
      link: '/help/getting-started'
    },
    {
      id: 'account',
      title: 'Account & Profile',
      description: 'Manage your account settings, profile, and preferences',
      icon: <UserGroupIcon className="w-8 h-8 text-blue-500" />,
      link: '/help/account'
    },
    {
      id: 'subscriptions',
      title: 'Subscriptions',
      description: 'Understand how subscriptions work and manage your subscription plans',
      icon: <CreditCardIcon className="w-8 h-8 text-purple-500" />,
      link: '/help/subscriptions'
    },
    {
      id: 'creators',
      title: 'For Creators',
      description: 'Resources and guides for content creators',
      icon: <LightBulbIcon className="w-8 h-8 text-amber-500" />,
      link: '/help/creators'
    },
    {
      id: 'safety',
      title: 'Privacy & Safety',
      description: 'Learn about our privacy practices and safety features',
      icon: <ShieldCheckIcon className="w-8 h-8 text-red-500" />,
      link: '/help/safety'
    },
    {
      id: 'contact',
      title: 'Contact Support',
      description: 'Get in touch with our support team for personalized assistance',
      icon: <EnvelopeIcon className="w-8 h-8 text-indigo-500" />,
      link: '/help/contact'
    }
  ];
  
  // FAQ list
  const faqs: FAQ[] = [
    {
      id: 'faq-1',
      category: 'account',
      question: 'How do I reset my password?',
      answer: 'You can reset your password by going to the login page and clicking on "Forgot Password". You\'ll receive an email with instructions to reset your password. Make sure to check your spam folder if you don\'t see the email in your inbox.'
    },
    {
      id: 'faq-2',
      category: 'account',
      question: 'How do I change my username or email?',
      answer: 'You can change your username and email in your account settings. Go to Settings > Account and update your information. Note that changing your email will require verification.'
    },
    {
      id: 'faq-3',
      category: 'subscriptions',
      question: 'How do subscriptions work?',
      answer: 'Subscriptions give you access to premium content from your favorite creators. You can subscribe to creators on a monthly basis. Billing occurs on the same day each month. You can cancel anytime, but will retain access until the end of your current billing period.'
    },
    {
      id: 'faq-4',
      category: 'subscriptions',
      question: 'How do I cancel a subscription?',
      answer: 'To cancel a subscription, go to Settings > Subscriptions, find the subscription you want to cancel, and click "Cancel Subscription". Your subscription will remain active until the end of the current billing period.'
    },
    {
      id: 'faq-5',
      category: 'payments',
      question: 'What payment methods do you accept?',
      answer: 'We accept credit/debit cards (Visa, Mastercard, American Express, Discover), PayPal, and Apple Pay. Payment methods may vary by region.'
    },
    {
      id: 'faq-6',
      category: 'payments',
      question: 'Is my payment information secure?',
      answer: 'Yes, we use industry-standard encryption and security practices to protect your payment information. We don\'t store your full card details on our servers and all transactions are processed securely through our payment providers.'
    },
    {
      id: 'faq-7',
      category: 'content',
      question: 'Can I download content to view offline?',
      answer: 'Some creators offer downloadable content. Look for the download icon on eligible content. Note that all downloaded content is for personal use only and subject to our content policies.'
    },
    {
      id: 'faq-8',
      category: 'content',
      question: 'What are the guidelines for commenting on content?',
      answer: 'We encourage respectful and constructive comments. Harassment, hate speech, spam, and illegal content are prohibited. Creators can moderate comments on their content, and we may remove comments that violate our community guidelines.'
    },
    {
      id: 'faq-9',
      category: 'creators',
      question: 'How do I become a creator?',
      answer: 'Any user can apply to become a creator. Go to Settings > Creator Account and follow the application process. We review all applications to ensure quality and compliance with our guidelines.'
    },
    {
      id: 'faq-10',
      category: 'creators',
      question: 'How and when do creators get paid?',
      answer: 'Creators receive payments for subscriptions and tips. Payments are processed monthly, with a 30-day holding period. You must reach the minimum payout threshold of $20 to receive payment. We offer multiple payout methods including direct deposit and PayPal.'
    },
    {
      id: 'faq-11',
      category: 'technical',
      question: 'What browsers are supported?',
      answer: 'We support the latest versions of Chrome, Firefox, Safari, and Edge. For the best experience, we recommend keeping your browser updated to the latest version.'
    },
    {
      id: 'faq-12',
      category: 'technical',
      question: 'How do I report a technical issue?',
      answer: 'If you\'re experiencing technical issues, please try clearing your cache and restarting your browser. If the issue persists, contact our support team with details about the problem, including any error messages, screenshots, and the device/browser you\'re using.'
    }
  ];
  
  // Filter FAQs based on category and search
  const filteredFAQs = faqs.filter(faq => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch = !searchQuery || 
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesCategory && matchesSearch;
  });
  
  // Get category label
  const getCategoryLabel = (category: FAQCategory | 'all'): string => {
    switch (category) {
      case 'all': return 'All Topics';
      case 'account': return 'Account & Profile';
      case 'subscriptions': return 'Subscriptions';
      case 'content': return 'Content';
      case 'payments': return 'Payments';
      case 'creators': return 'For Creators';
      case 'technical': return 'Technical Issues';
      default: return 'All Topics';
    }
  };
  
  return (
    <MainLayout title="Help Center - Prime Plus">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Hero section */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">How can we help you?</h1>
          <p className="text-lg text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto mb-8">
            Find answers to common questions or get in touch with our support team
          </p>
          
          {/* Search */}
          <div className="max-w-2xl mx-auto">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <MagnifyingGlassIcon className="w-5 h-5 text-neutral-500" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full p-4 pl-10 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-primary-500"
                placeholder="Search for answers..."
              />
            </div>
          </div>
        </div>
        
        {/* Help topics */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Help Topics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpTopics.map((topic) => (
              <Link 
                href={topic.link} 
                key={topic.id}
                className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6 hover:shadow-md transition flex items-start"
              >
                <div className="mr-4 mt-1">
                  {topic.icon}
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">{topic.title}</h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm">
                    {topic.description}
                  </p>
                  <div className="mt-4 text-primary-600 dark:text-primary-500 font-medium text-sm flex items-center">
                    Learn more
                    <ArrowRightIcon className="w-4 h-4 ml-1" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
        
        {/* FAQ section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          
          {/* Category filters */}
          <div className="flex flex-wrap gap-2 mb-6">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeCategory === 'all'
                  ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
              }`}
            >
              All Topics
            </button>
            
            <button
              onClick={() => setActiveCategory('account')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeCategory === 'account'
                  ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
              }`}
            >
              Account
            </button>
            
            <button
              onClick={() => setActiveCategory('subscriptions')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeCategory === 'subscriptions'
                  ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
              }`}
            >
              Subscriptions
            </button>
            
            <button
              onClick={() => setActiveCategory('payments')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeCategory === 'payments'
                  ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
              }`}
            >
              Payments
            </button>
            
            <button
              onClick={() => setActiveCategory('content')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeCategory === 'content'
                  ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
              }`}
            >
              Content
            </button>
            
            <button
              onClick={() => setActiveCategory('creators')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeCategory === 'creators'
                  ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
              }`}
            >
              For Creators
            </button>
            
            <button
              onClick={() => setActiveCategory('technical')}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                activeCategory === 'technical'
                  ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300'
                  : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
              }`}
            >
              Technical
            </button>
          </div>
          
          {/* FAQ list */}
          {filteredFAQs.length > 0 ? (
            <div className="space-y-4">
              {filteredFAQs.map(faq => (
                <div 
                  key={faq.id} 
                  className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden"
                >
                  <button
                    onClick={() => toggleFAQ(faq.id)}
                    className="w-full text-left p-4 flex items-center justify-between font-medium hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition"
                  >
                    <span>{faq.question}</span>
                    <ChevronDownIcon 
                      className={`w-5 h-5 text-neutral-500 transition-transform ${
                        expandedFAQs.includes(faq.id) ? 'transform rotate-180' : ''
                      }`} 
                    />
                  </button>
                  
                  {expandedFAQs.includes(faq.id) && (
                    <div className="p-4 border-t border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800">
                      <p className="text-neutral-700 dark:text-neutral-300">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-white dark:bg-neutral-800 rounded-lg border border-neutral-200 dark:border-neutral-700">
              <QuestionMarkCircleIcon className="w-16 h-16 mx-auto text-neutral-400" />
              <h3 className="text-xl font-medium mt-4">No results found</h3>
              <p className="text-neutral-500 dark:text-neutral-400 mt-2 max-w-md mx-auto">
                {searchQuery 
                  ? `We couldn't find any FAQs matching "${searchQuery}". Try using different keywords or browse by category.`
                  : `No FAQs found for the selected category. Try selecting a different category.`}
              </p>
            </div>
          )}
        </div>
        
        {/* Contact support */}
        <div className="bg-gradient-to-r from-primary-500 to-primary-700 dark:from-primary-700 dark:to-primary-900 rounded-2xl p-8 text-white">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-2/3 mb-6 md:mb-0">
              <h2 className="text-2xl font-bold mb-3">Still need help?</h2>
              <p className="mb-4 opacity-90">
                Our support team is here to help. Get in touch and we'll help you resolve your issue.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link 
                  href="/help/contact" 
                  className="bg-white text-primary-700 hover:bg-neutral-100 py-2 px-6 rounded-lg font-medium inline-flex items-center"
                >
                  <EnvelopeIcon className="w-5 h-5 mr-2" />
                  Contact Support
                </Link>
                <Link 
                  href="/help/chat" 
                  className="bg-transparent border border-white text-white hover:bg-white/10 py-2 px-6 rounded-lg font-medium inline-flex items-center"
                >
                  <ChatBubbleLeftRightIcon className="w-5 h-5 mr-2" />
                  Live Chat
                </Link>
              </div>
            </div>
            <div className="md:w-1/3 flex justify-center md:justify-end">
              <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
                <ChatBubbleLeftRightIcon className="w-12 h-12 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HelpPage; 