import React from 'react';
import { useRouter } from 'next/router';
import MainLayout from '@/components/layouts/MainLayout';
import { useAuth } from '@/components/providers/AuthProvider';

const SavedContentPage = () => {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();

  if (loading) {
    return (
      <MainLayout title="Saved Content">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (!isAuthenticated || !user) {
    router.push('/login');
    return null;
  }

  return (
    <MainLayout title="Saved Content">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Saved Content</h1>
        
        {/* Saved Content List */}
        <div className="space-y-4">
          <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600">No saved content yet.</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default SavedContentPage; 