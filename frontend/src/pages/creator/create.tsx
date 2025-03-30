import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/router';
import Image from 'next/image';

interface MediaPreview {
  id: string;
  url: string;
  type: 'image' | 'video';
  thumbnail?: string;
}

interface PollOption {
  id: string;
  text: string;
  votes: number;
}

interface PostDraft {
  id: string;
  title: string;
  content: string;
  media: MediaPreview[];
  pollOptions: PollOption[];
  scheduledFor?: string;
  isExclusive: boolean;
  tags: string[];
}

const CreatePage: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'text' | 'media' | 'poll'>('text');
  const [draft, setDraft] = useState<PostDraft>({
    id: Date.now().toString(),
    title: '',
    content: '',
    media: [],
    pollOptions: [],
    isExclusive: false,
    tags: [],
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newTag, setNewTag] = useState('');
  const [newPollOption, setNewPollOption] = useState('');

  useEffect(() => {
    if (!loading && !user?.isCreator) {
      router.push('/become-creator');
      return;
    }
  }, [loading, user, router]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // TODO: Implement actual file upload logic
      // Simulating upload progress
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 500));
        setUploadProgress(i);
      }

      // Add new media items to the draft
      const newMedia: MediaPreview[] = Array.from(files).map((file, index) => ({
        id: `media-${Date.now()}-${index}`,
        url: URL.createObjectURL(file),
        type: file.type.startsWith('image/') ? 'image' : 'video',
        thumbnail: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined,
      }));

      setDraft(prev => ({
        ...prev,
        media: [...prev.media, ...newMedia],
      }));

      setIsUploading(false);
      setUploadProgress(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload files');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleRemoveMedia = (mediaId: string) => {
    setDraft(prev => ({
      ...prev,
      media: prev.media.filter(m => m.id !== mediaId),
    }));
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim() && !draft.tags.includes(newTag.trim())) {
      setDraft(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setDraft(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleAddPollOption = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPollOption.trim() && draft.pollOptions.length < 4) {
      setDraft(prev => ({
        ...prev,
        pollOptions: [
          ...prev.pollOptions,
          {
            id: `option-${Date.now()}`,
            text: newPollOption.trim(),
            votes: 0,
          },
        ],
      }));
      setNewPollOption('');
    }
  };

  const handleRemovePollOption = (optionId: string) => {
    setDraft(prev => ({
      ...prev,
      pollOptions: prev.pollOptions.filter(option => option.id !== optionId),
    }));
  };

  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement API call to save draft
      await new Promise(resolve => setTimeout(resolve, 1000));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save draft');
    } finally {
      setIsSaving(false);
    }
  };

  const handlePublish = async () => {
    setIsSaving(true);
    try {
      // TODO: Implement API call to publish post
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/creator/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish post');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-8">Create New Post</h1>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Content Type Tabs */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('text')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'text'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
              }`}
            >
              Text Post
            </button>
            <button
              onClick={() => setActiveTab('media')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'media'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
              }`}
            >
              Media Post
            </button>
            <button
              onClick={() => setActiveTab('poll')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'poll'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
              }`}
            >
              Poll
            </button>
          </div>

          {/* Post Editor */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={draft.title}
                  onChange={(e) => setDraft(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900"
                  placeholder="Enter post title"
                />
              </div>

              {/* Content */}
              {(activeTab === 'text' || activeTab === 'media') && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Content
                  </label>
                  <textarea
                    value={draft.content}
                    onChange={(e) => setDraft(prev => ({ ...prev, content: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 min-h-[200px]"
                    placeholder="Write your post content..."
                  />
                </div>
              )}

              {/* Media Upload */}
              {activeTab === 'media' && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Media
                  </label>
                  <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg p-8 text-center">
                    <input
                      type="file"
                      multiple
                      accept="image/*,video/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="media-upload"
                    />
                    <label
                      htmlFor="media-upload"
                      className="cursor-pointer inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span>Upload Media</span>
                    </label>
                    <p className="text-sm text-neutral-500 mt-2">
                      Drag and drop files here, or click to select files
                    </p>
                  </div>
                  {isUploading && (
                    <div className="mt-4">
                      <div className="h-2 bg-neutral-100 dark:bg-neutral-700 rounded-full">
                        <div
                          className="h-full bg-primary-600 rounded-full transition-all duration-300"
                          style={{ width: `${uploadProgress}%` }}
                        />
                      </div>
                      <p className="text-sm text-neutral-500 mt-2">
                        Uploading... {uploadProgress}%
                      </p>
                    </div>
                  )}
                  {draft.media.length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4">
                      {draft.media.map((media) => (
                        <div key={media.id} className="relative aspect-square">
                          <Image
                            src={media.thumbnail || media.url}
                            alt="Media preview"
                            fill
                            className="object-cover rounded-lg"
                          />
                          <button
                            onClick={() => handleRemoveMedia(media.id)}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Poll Options */}
              {activeTab === 'poll' && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Poll Options
                  </label>
                  <form onSubmit={handleAddPollOption} className="flex space-x-2 mb-4">
                    <input
                      type="text"
                      value={newPollOption}
                      onChange={(e) => setNewPollOption(e.target.value)}
                      className="flex-1 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900"
                      placeholder="Add poll option"
                      maxLength={100}
                    />
                    <button
                      type="submit"
                      disabled={draft.pollOptions.length >= 4 || !newPollOption.trim()}
                      className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                    >
                      Add
                    </button>
                  </form>
                  <div className="space-y-2">
                    {draft.pollOptions.map((option) => (
                      <div
                        key={option.id}
                        className="flex items-center justify-between p-3 bg-neutral-50 dark:bg-neutral-900 rounded-lg"
                      >
                        <span>{option.text}</span>
                        <button
                          onClick={() => handleRemovePollOption(option.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Tags
                </label>
                <form onSubmit={handleAddTag} className="flex space-x-2 mb-4">
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="flex-1 px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900"
                    placeholder="Add tag"
                  />
                  <button
                    type="submit"
                    disabled={!newTag.trim()}
                    className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                  >
                    Add
                  </button>
                </form>
                <div className="flex flex-wrap gap-2">
                  {draft.tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center px-3 py-1 rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-400"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-2 text-primary-600 hover:text-primary-700"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Post Settings */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="exclusive"
                    checked={draft.isExclusive}
                    onChange={(e) => setDraft(prev => ({ ...prev, isExclusive: e.target.checked }))}
                    className="h-4 w-4 text-primary-600 rounded border-neutral-300 dark:border-neutral-600"
                  />
                  <label htmlFor="exclusive" className="ml-2 text-sm text-neutral-700 dark:text-neutral-300">
                    Exclusive content (subscribers only)
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Schedule Post
                  </label>
                  <input
                    type="datetime-local"
                    value={draft.scheduledFor || ''}
                    onChange={(e) => setDraft(prev => ({ ...prev, scheduledFor: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleSaveDraft}
                  disabled={isSaving}
                  className="px-6 py-2 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-600 disabled:opacity-50"
                >
                  {isSaving ? 'Saving...' : 'Save Draft'}
                </button>
                <button
                  onClick={handlePublish}
                  disabled={isSaving || !draft.title.trim()}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  {isSaving ? 'Publishing...' : 'Publish'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default CreatePage; 