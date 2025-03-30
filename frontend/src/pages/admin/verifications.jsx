import React, { useState } from 'react';
import Link from 'next/link';
import Layout from '../../components/layouts/Layout';

const VerificationsPage = () => {
  const [verifications, setVerifications] = useState([
    {
      id: 1,
      user: {
        id: 102,
        username: 'creator1',
        email: 'creator1@example.com',
        profileImage: 'https://randomuser.me/api/portraits/women/2.jpg'
      },
      status: 'pending',
      documentType: 'ID Card',
      documentImage: 'https://via.placeholder.com/400x250?text=ID+Document',
      selfieImage: 'https://randomuser.me/api/portraits/women/2.jpg',
      createdAt: '2025-03-10T14:20:00Z',
      notes: 'Please verify my account to start creating content'
    },
    {
      id: 2,
      user: {
        id: 105,
        username: 'creator2',
        email: 'creator2@example.com',
        profileImage: 'https://randomuser.me/api/portraits/men/5.jpg'
      },
      status: 'pending',
      documentType: 'Passport',
      documentImage: 'https://via.placeholder.com/400x250?text=Passport+Document',
      selfieImage: 'https://randomuser.me/api/portraits/men/5.jpg',
      createdAt: '2025-03-12T09:45:00Z',
      notes: 'I\'d like to become a VR content creator'
    }
  ]);
  
  const [selectedVerification, setSelectedVerification] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const showVerificationDetails = (verification) => {
    setSelectedVerification(verification);
  };

  const handleApprove = (id) => {
    // In a real implementation, this would call the API
    // const response = await approveVerification(token, id);
    
    // Mock implementation
    const updatedVerifications = verifications.filter(v => v.id !== id);
    setVerifications(updatedVerifications);
    setSelectedVerification(null);
    
    setNotification({
      show: true,
      message: 'Verification approved successfully',
      type: 'success'
    });
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ ...notification, show: false });
    }, 3000);
  };

  const handleReject = (id) => {
    if (!rejectReason.trim()) {
      setNotification({
        show: true,
        message: 'Please provide a reason for rejection',
        type: 'error'
      });
      return;
    }
    
    // In a real implementation, this would call the API
    // const response = await rejectVerification(token, id, rejectReason);
    
    // Mock implementation
    const updatedVerifications = verifications.filter(v => v.id !== id);
    setVerifications(updatedVerifications);
    setSelectedVerification(null);
    setRejectReason('');
    
    setNotification({
      show: true,
      message: 'Verification rejected',
      type: 'success'
    });
    
    // Hide notification after 3 seconds
    setTimeout(() => {
      setNotification({ ...notification, show: false });
    }, 3000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Admin Header */}
        <div className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Creator Verifications</h1>
                <p className="mt-1 text-sm text-gray-500">Review and approve creator verification requests</p>
              </div>
              <div>
                <Link href="/admin">
                  <span className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200">
                    Back to Dashboard
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {verifications.length === 0 ? (
            <div className="text-center py-12 bg-white shadow rounded-lg">
              <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-sm font-medium text-gray-900">No pending verifications</h3>
              <p className="mt-1 text-sm text-gray-500">All verification requests have been processed.</p>
            </div>
          ) : (
            <div className="flex flex-col md:flex-row">
              <div className="w-full md:w-1/3 pr-0 md:pr-6 mb-6 md:mb-0">
                <div className="bg-white shadow overflow-hidden sm:rounded-md">
                  <ul role="list" className="divide-y divide-gray-200">
                    {verifications.map((verification) => (
                      <li key={verification.id} onClick={() => showVerificationDetails(verification)} className="cursor-pointer hover:bg-gray-50">
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img className="h-10 w-10 rounded-full" src={verification.user.profileImage} alt={verification.user.username} />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-indigo-600">
                                  {verification.user.username}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {verification.user.email}
                                </div>
                              </div>
                            </div>
                            <div>
                              <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                                Pending
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 text-sm text-gray-500">
                            Submitted: {formatDate(verification.createdAt)}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="w-full md:w-2/3">
                {selectedVerification ? (
                  <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <div className="px-4 py-5 sm:px-6">
                      <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Verification Request Details
                      </h3>
                      <p className="mt-1 max-w-2xl text-sm text-gray-500">
                        Review all information and documents before making a decision
                      </p>
                    </div>
                    <div className="border-t border-gray-200">
                      <dl>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">
                            Username
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {selectedVerification.user.username}
                          </dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">
                            Email address
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {selectedVerification.user.email}
                          </dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">
                            Document Type
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {selectedVerification.documentType}
                          </dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">
                            Submitted On
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {formatDate(selectedVerification.createdAt)}
                          </dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500">
                            Additional Notes
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                            {selectedVerification.notes || 'No additional notes provided'}
                          </dd>
                        </div>
                        <div className="bg-white px-4 py-5 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500 mb-3">
                            ID Document
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            <img
                              src={selectedVerification.documentImage}
                              alt="ID Document"
                              className="max-w-full h-auto rounded-lg border border-gray-200"
                            />
                          </dd>
                        </div>
                        <div className="bg-gray-50 px-4 py-5 sm:px-6">
                          <dt className="text-sm font-medium text-gray-500 mb-3">
                            Selfie with ID
                          </dt>
                          <dd className="mt-1 text-sm text-gray-900">
                            <img
                              src={selectedVerification.selfieImage}
                              alt="Selfie with ID"
                              className="max-w-full h-auto rounded-lg border border-gray-200"
                            />
                          </dd>
                        </div>
                      </dl>
                    </div>
                    <div className="bg-gray-50 px-4 py-5 sm:px-6">
                      <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-4">
                        <button
                          type="button"
                          onClick={() => handleApprove(selectedVerification.id)}
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                        >
                          Approve Verification
                        </button>
                        <button
                          type="button"
                          className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          onClick={() => {
                            if (rejectReason.trim()) {
                              handleReject(selectedVerification.id);
                            } else {
                              setNotification({
                                show: true,
                                message: 'Please provide a reason for rejection',
                                type: 'error'
                              });
                            }
                          }}
                        >
                          Reject Verification
                        </button>
                      </div>
                      <div className="mt-4">
                        <label htmlFor="rejectReason" className="block text-sm font-medium text-gray-700">
                          Rejection Reason (required for rejections)
                        </label>
                        <div className="mt-1">
                          <textarea
                            id="rejectReason"
                            name="rejectReason"
                            rows={3}
                            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                            value={rejectReason}
                            onChange={(e) => setRejectReason(e.target.value)}
                            placeholder="Please provide a reason for rejecting this verification..."
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="rounded-md bg-blue-50 p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3 flex-1 md:flex md:justify-between">
                        <p className="text-sm text-blue-700">
                          Select a verification request from the list to review details
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Notification */}
        {notification.show && (
          <div className="fixed bottom-4 right-4 z-50">
            <div className={`rounded-md p-4 ${notification.type === 'success' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
              <div className="flex">
                <div className="flex-shrink-0">
                  {notification.type === 'success' ? (
                    <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <div className="ml-3">
                  <p className={`text-sm font-medium ${notification.type === 'success' ? 'text-green-800' : 'text-red-800'}`}>
                    {notification.message}
                  </p>
                </div>
                <div className="ml-auto pl-3">
                  <div className="-mx-1.5 -my-1.5">
                    <button
                      onClick={() => setNotification({ ...notification, show: false })}
                      className={`inline-flex rounded-md p-1.5 ${notification.type === 'success' ? 'text-green-500 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500' : 'text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500'}`}
                    >
                      <span className="sr-only">Dismiss</span>
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default VerificationsPage;