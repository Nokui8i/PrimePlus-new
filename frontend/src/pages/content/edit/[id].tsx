import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import ContentUploadForm from '@/components/content/ContentUploadForm';
import { useAuth } from '@/components/providers/AuthProvider';
import ContentService from '@/services/contentService';
import { Spinner } from '@/components/ui';

const EditContentPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkContentAccess = async () => {
      if (!id || !user) return;

      try {
        const response = await ContentService.getContentById(id as string);
        const content = response.data.content;

        // Check if the current user is the creator
        if (content.creator.id !== user.id) {
          setError('You do not have permission to edit this content');
          return;
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error checking content access:', error);
        setError('Failed to load content');
      }
    };

    checkContentAccess();
  }, [id, user]);

  const handleSuccess = (contentId: string) => {
    if (window.opener) {
      window.close();
    } else {
      router.back();
    }
  };

  const handleCancel = () => {
    if (window.opener) {
      window.close();
    } else {
      router.back();
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-12">
        <div className="bg-red-50 dark:bg-red-900/10 rounded-lg p-4">
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button
            onClick={handleCancel}
            className="mt-4 text-sm text-red-600 dark:text-red-400 hover:text-red-800 dark:hover:text-red-300"
          >
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <ContentUploadForm
        contentId={id as string}
        onSuccess={handleSuccess}
        onCancel={handleCancel}
      />
    </div>
  );
};

export default EditContentPage; 