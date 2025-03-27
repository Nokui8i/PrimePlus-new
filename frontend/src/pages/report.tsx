import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import MainLayout from '@/components/layouts/MainLayout';
import {
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ArrowLeftIcon
} from '@heroicons/react/24/outline';

interface ReportReason {
  id: string;
  title: string;
  description: string;
}

interface ContentToReport {
  id: string;
  type: 'post' | 'comment' | 'profile';
  title?: string;
  url: string;
}

const ReportPage: NextPage = () => {
  const router = useRouter();
  const { id, type = 'post', url } = router.query;
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedReason, setSelectedReason] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  
  // Information about the reported content - based on URL parameters
  const [contentToReport, setContentToReport] = useState<ContentToReport>({
    id: (id as string) || '',
    type: (type as 'post' | 'comment' | 'profile') || 'post',
    title: '',
    url: (url as string) || ''
  });
  
  // Mock content title if not provided via URL
  useEffect(() => {
    if (!contentToReport.title) {
      let title = '';
      switch(contentToReport.type) {
        case 'post':
          title = 'Sunset at Tel Aviv Beach';
          break;
        case 'comment':
          title = 'Comment on "Homemade Pasta Recipe"';
          break;
        case 'profile':
          title = 'User Profile: @david_chef';
          break;
      }
      setContentToReport({...contentToReport, title});
    }
  }, []);
  
  // Report reasons
  const reportReasons: ReportReason[] = [
    {
      id: 'inappropriate',
      title: 'Inappropriate Content',
      description: 'Content contains nudity, violence, or other material that violates community guidelines'
    },
    {
      id: 'harassment',
      title: 'Harassment or Bullying',
      description: 'Content contains harassment, threats, or bullying directed at a person or group'
    },
    {
      id: 'copyright',
      title: 'Copyright Violation',
      description: 'Content uses copyrighted material without permission'
    },
    {
      id: 'fake',
      title: 'Misinformation or Scam',
      description: 'Content is spam, misleading, or fraudulent'
    },
    {
      id: 'illegal',
      title: 'Illegal Content',
      description: 'Content promotes illegal activities or violates the law'
    },
    {
      id: 'other',
      title: 'Other',
      description: 'Another reason not listed here'
    }
  ];
  
  // Simulation of sending the report to the server
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedReason) return;
    
    setIsSubmitting(true);
    
    // Simulate API call with timeout
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      
      // Clear form
      setSelectedReason('');
      setAdditionalInfo('');
    }, 1500);
  };
  
  // Start a new report after successful submission
  const startNewReport = () => {
    setIsSubmitted(false);
  };
  
  return (
    <MainLayout title="Report Content - Prime Plus">
      <Head>
        <meta name="description" content="Report inappropriate content on Prime Plus" />
      </Head>
      
      <div className="max-w-2xl mx-auto px-4 py-8">
        {isSubmitted ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6">
              <CheckCircleIcon className="w-10 h-10 text-green-600 dark:text-green-500" />
            </div>
            <h1 className="text-2xl font-bold mb-4">Report Submitted</h1>
            <p className="mb-8 text-neutral-600 dark:text-neutral-400">
              We've received your report. Our safety team will review the content as soon as possible and take appropriate action according to our community guidelines.
            </p>
            
            <div className="flex justify-center space-x-4">
              <Link
                href={contentToReport.url || '/'}
                className="btn btn-outline px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                Return to Content
              </Link>
              <button
                onClick={startNewReport}
                className="btn btn-primary bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Report Another Issue
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center mb-6">
              <Link href={contentToReport.url || '/'} className="mr-3">
                <ArrowLeftIcon className="w-5 h-5 text-neutral-600 dark:text-neutral-400" />
              </Link>
              <h1 className="text-2xl font-bold">Report Content</h1>
            </div>
            
            <div className="bg-neutral-50 dark:bg-neutral-800 p-4 rounded-lg mb-6">
              <h2 className="font-medium mb-2">Content Information</h2>
              <div className="text-sm text-neutral-600 dark:text-neutral-400">
                <p>ID: {contentToReport.id}</p>
                <p>Type: {contentToReport.type.charAt(0).toUpperCase() + contentToReport.type.slice(1)}</p>
                <p>Title: {contentToReport.title}</p>
              </div>
            </div>
            
            <p className="mb-6 text-neutral-600 dark:text-neutral-400">
              Help us understand what's wrong with this content. Your report is anonymous, unless it's a copyright issue.
            </p>
            
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <h2 className="text-lg font-medium mb-4">Why are you reporting this content?</h2>
                <div className="space-y-3">
                  {reportReasons.map((reason) => (
                    <label 
                      key={reason.id}
                      className={`block p-4 border rounded-lg cursor-pointer transition-colors ${
                        selectedReason === reason.id 
                          ? 'border-primary-600 bg-primary-50 dark:bg-primary-900/20' 
                          : 'border-neutral-300 dark:border-neutral-700 hover:border-neutral-400 dark:hover:border-neutral-600'
                      }`}
                    >
                      <div className="flex items-start">
                        <input 
                          type="radio"
                          name="reason"
                          value={reason.id}
                          checked={selectedReason === reason.id}
                          onChange={() => setSelectedReason(reason.id)}
                          className="mr-3 mt-1"
                        />
                        <div>
                          <div className="font-medium">{reason.title}</div>
                          <div className="text-sm text-neutral-600 dark:text-neutral-400">{reason.description}</div>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <label className="block font-medium mb-2">Additional details (optional)</label>
                <textarea
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  className="w-full p-3 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-900"
                  rows={4}
                  placeholder="Describe the issue in detail"
                ></textarea>
                <p className="text-sm text-neutral-500 dark:text-neutral-500 mt-1">
                  Any additional details can help us handle your report more effectively
                </p>
              </div>
              
              <div className="flex justify-end">
                <button 
                  type="submit" 
                  disabled={!selectedReason || isSubmitting}
                  className={`btn px-5 py-2 rounded-lg font-medium ${
                    !selectedReason 
                      ? 'bg-neutral-300 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400 cursor-not-allowed' 
                      : isSubmitting 
                        ? 'bg-primary-600 text-white opacity-75 cursor-wait' 
                        : 'bg-primary-600 hover:bg-primary-700 text-white'
                  }`}
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Report'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default ReportPage; 