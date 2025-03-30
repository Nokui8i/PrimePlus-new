import { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import UserContext from '@/context/UserContext';
import ContentUploadForm from '@/components/content/ContentUploadForm';

export default function CreateContent() {
  const router = useRouter();
  const { user, isAuthenticated, loading } = useContext(UserContext);
  
  // Redirect non-creators to become-creator page
  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        if (user && user.role !== 'creator' && user.role !== 'admin') {
          router.push('/become-creator');
        }
      } else {
        router.push('/login');
      }
    }
  }, [user, isAuthenticated, loading, router]);

  const handleSuccess = (contentId: string) => {
    router.push(`/content/${contentId}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-500 border-t-transparent"></div>
      </div>
    );
  }

  if (!isAuthenticated || (user && user.role !== 'creator' && user.role !== 'admin')) {
    return null; // Let the useEffect handle the redirect
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <ContentUploadForm onSuccess={handleSuccess} />
    </div>
  );
}