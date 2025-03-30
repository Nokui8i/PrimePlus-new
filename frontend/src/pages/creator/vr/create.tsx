import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layouts/MainLayout';
import { useAuth } from '@/components/providers/AuthProvider';
import { useRouter } from 'next/router';
import Image from 'next/image';

interface VRContent {
  id: string;
  title: string;
  description: string;
  type: '360-image' | '360-video' | 'vr-room';
  thumbnailUrl?: string;
  previewUrl?: string;
  isExclusive: boolean;
  tags: string[];
  price?: number;
  scheduledFor?: string;
}

interface VRRoom {
  id: string;
  name: string;
  description: string;
  environment: string;
  hotspots: Hotspot[];
  isExclusive: boolean;
  price?: number;
}

interface Hotspot {
  id: string;
  position: { x: number; y: number; z: number };
  rotation: { x: number; y: number; z: number };
  type: 'info' | 'link' | 'media';
  content: string;
}

const VRCreatePage: React.FC = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'360-content' | 'vr-room'>('360-content');
  const [content, setContent] = useState<VRContent>({
    id: Date.now().toString(),
    title: '',
    description: '',
    type: '360-image',
    isExclusive: false,
    tags: [],
  });
  const [room, setRoom] = useState<VRRoom>({
    id: Date.now().toString(),
    name: '',
    description: '',
    environment: 'default',
    hotspots: [],
    isExclusive: false,
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [newTag, setNewTag] = useState('');
  const [previewMode, setPreviewMode] = useState(false);

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

      // Add preview URL for the uploaded content
      const previewUrl = URL.createObjectURL(files[0]);
      setContent(prev => ({
        ...prev,
        previewUrl,
        thumbnailUrl: previewUrl,
      }));

      setIsUploading(false);
      setUploadProgress(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload files');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTag.trim() && !content.tags.includes(newTag.trim())) {
      setContent(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setContent(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove),
    }));
  };

  const handleAddHotspot = () => {
    const newHotspot: Hotspot = {
      id: `hotspot-${Date.now()}`,
      position: { x: 0, y: 0, z: 0 },
      rotation: { x: 0, y: 0, z: 0 },
      type: 'info',
      content: '',
    };

    setRoom(prev => ({
      ...prev,
      hotspots: [...prev.hotspots, newHotspot],
    }));
  };

  const handleUpdateHotspot = (hotspotId: string, updates: Partial<Hotspot>) => {
    setRoom(prev => ({
      ...prev,
      hotspots: prev.hotspots.map(hotspot =>
        hotspot.id === hotspotId ? { ...hotspot, ...updates } : hotspot
      ),
    }));
  };

  const handleRemoveHotspot = (hotspotId: string) => {
    setRoom(prev => ({
      ...prev,
      hotspots: prev.hotspots.filter(hotspot => hotspot.id !== hotspotId),
    }));
  };

  const handleSaveDraft = async () => {
    try {
      // TODO: Implement API call to save draft
      await new Promise(resolve => setTimeout(resolve, 1000));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save draft');
    }
  };

  const handlePublish = async () => {
    try {
      // TODO: Implement API call to publish content
      await new Promise(resolve => setTimeout(resolve, 1000));
      router.push('/creator/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish content');
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
          <h1 className="text-2xl font-bold mb-8">Create VR Content</h1>

          {error && (
            <div className="bg-red-50 dark:bg-red-900/20 text-red-600 p-4 rounded-lg mb-6">
              {error}
            </div>
          )}

          {/* Content Type Tabs */}
          <div className="flex space-x-4 mb-6">
            <button
              onClick={() => setActiveTab('360-content')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === '360-content'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
              }`}
            >
              360° Content
            </button>
            <button
              onClick={() => setActiveTab('vr-room')}
              className={`px-4 py-2 rounded-lg ${
                activeTab === 'vr-room'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300'
              }`}
            >
              VR Room
            </button>
          </div>

          {/* Content Editor */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm p-6">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={activeTab === '360-content' ? content.title : room.name}
                  onChange={(e) => {
                    if (activeTab === '360-content') {
                      setContent(prev => ({ ...prev, title: e.target.value }));
                    } else {
                      setRoom(prev => ({ ...prev, name: e.target.value }));
                    }
                  }}
                  className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900"
                  placeholder="Enter title"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                  Description
                </label>
                <textarea
                  value={activeTab === '360-content' ? content.description : room.description}
                  onChange={(e) => {
                    if (activeTab === '360-content') {
                      setContent(prev => ({ ...prev, description: e.target.value }));
                    } else {
                      setRoom(prev => ({ ...prev, description: e.target.value }));
                    }
                  }}
                  className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 min-h-[100px]"
                  placeholder="Enter description"
                />
              </div>

              {/* 360° Content Upload */}
              {activeTab === '360-content' && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Content Type
                  </label>
                  <select
                    value={content.type}
                    onChange={(e) => setContent(prev => ({ ...prev, type: e.target.value as VRContent['type'] }))}
                    className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900"
                  >
                    <option value="360-image">360° Image</option>
                    <option value="360-video">360° Video</option>
                    <option value="vr-room">VR Room</option>
                  </select>

                  <div className="mt-4">
                    <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                      Upload Content
                    </label>
                    <div className="border-2 border-dashed border-neutral-300 dark:border-neutral-700 rounded-lg p-8 text-center">
                      <input
                        type="file"
                        accept={content.type === '360-image' ? 'image/*' : 'video/*'}
                        onChange={handleFileUpload}
                        className="hidden"
                        id="vr-content-upload"
                      />
                      <label
                        htmlFor="vr-content-upload"
                        className="cursor-pointer inline-flex items-center space-x-2 text-primary-600 hover:text-primary-700"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        <span>Upload {content.type === '360-image' ? '360° Image' : '360° Video'}</span>
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
                  </div>

                  {content.previewUrl && (
                    <div className="mt-4">
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                        Preview
                      </label>
                      <div className="relative aspect-video rounded-lg overflow-hidden">
                        <Image
                          src={content.previewUrl}
                          alt="Content preview"
                          fill
                          className="object-cover"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* VR Room Editor */}
              {activeTab === 'vr-room' && (
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Environment
                  </label>
                  <select
                    value={room.environment}
                    onChange={(e) => setRoom(prev => ({ ...prev, environment: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900"
                  >
                    <option value="default">Default Room</option>
                    <option value="outdoor">Outdoor Scene</option>
                    <option value="gallery">Gallery</option>
                    <option value="theater">Theater</option>
                  </select>

                  <div className="mt-6">
                    <div className="flex justify-between items-center mb-4">
                      <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Hotspots
                      </label>
                      <button
                        onClick={handleAddHotspot}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
                      >
                        Add Hotspot
                      </button>
                    </div>
                    <div className="space-y-4">
                      {room.hotspots.map((hotspot) => (
                        <div
                          key={hotspot.id}
                          className="p-4 bg-neutral-50 dark:bg-neutral-900 rounded-lg"
                        >
                          <div className="flex justify-between items-start mb-4">
                            <select
                              value={hotspot.type}
                              onChange={(e) => handleUpdateHotspot(hotspot.id, { type: e.target.value as Hotspot['type'] })}
                              className="px-3 py-1 rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900"
                            >
                              <option value="info">Info</option>
                              <option value="link">Link</option>
                              <option value="media">Media</option>
                            </select>
                            <button
                              onClick={() => handleRemoveHotspot(hotspot.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              Remove
                            </button>
                          </div>
                          <textarea
                            value={hotspot.content}
                            onChange={(e) => handleUpdateHotspot(hotspot.id, { content: e.target.value })}
                            className="w-full px-3 py-2 rounded border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900"
                            placeholder="Enter hotspot content"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Tags */}
              {activeTab === '360-content' && (
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
                    {content.tags.map((tag) => (
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
              )}

              {/* Content Settings */}
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="exclusive"
                    checked={activeTab === '360-content' ? content.isExclusive : room.isExclusive}
                    onChange={(e) => {
                      if (activeTab === '360-content') {
                        setContent(prev => ({ ...prev, isExclusive: e.target.checked }));
                      } else {
                        setRoom(prev => ({ ...prev, isExclusive: e.target.checked }));
                      }
                    }}
                    className="h-4 w-4 text-primary-600 rounded border-neutral-300 dark:border-neutral-600"
                  />
                  <label htmlFor="exclusive" className="ml-2 text-sm text-neutral-700 dark:text-neutral-300">
                    Exclusive content (subscribers only)
                  </label>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
                    Schedule Publication
                  </label>
                  <input
                    type="datetime-local"
                    value={content.scheduledFor || ''}
                    onChange={(e) => setContent(prev => ({ ...prev, scheduledFor: e.target.value }))}
                    className="w-full px-4 py-2 rounded-lg border border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-4">
                <button
                  onClick={handleSaveDraft}
                  className="px-6 py-2 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-lg hover:bg-neutral-200 dark:hover:bg-neutral-600"
                >
                  Save Draft
                </button>
                <button
                  onClick={handlePublish}
                  disabled={!content.title.trim()}
                  className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50"
                >
                  Publish
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default VRCreatePage; 