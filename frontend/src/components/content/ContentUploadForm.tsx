import React, { useState, useCallback, useEffect } from 'react';
import { useDropzone, FileRejection, DropEvent } from 'react-dropzone';
import { Switch } from '@headlessui/react';
import ContentService from '@/services/contentService';
import UploadService from '@/services/uploadService';
import SubscriptionService from '@/services/subscriptionService';
import MediaPreview from './MediaPreview';
import StorageStats from './StorageStats';
import type { ContentType, ContentPayload } from '@/types/content';
import { useAuth } from '@/components/providers/AuthProvider';
import { Button, Input, Tabs, Label, Alert, AlertDescription, TagsInput, Spinner } from '@/components/ui';
import { useRouter } from 'next/router';
import { CurrencyDollarIcon, ShieldCheckIcon, GlobeAltIcon } from '@heroicons/react/24/outline';

interface UploadFormProps {
  onSuccess?: (contentId: string) => void;
  contentId?: string;
  onCancel?: () => void;
}

interface Tag {
  id: string;
  name: string;
}

// Define MediaFile type for consistency
type MediaFileStatus = 'idle' | 'uploading' | 'processing' | 'complete' | 'error';

interface MediaFile {
  id?: string;
  file?: File;
  fileName: string;
  fileSize: number;
  mimeType: string;
  preview?: string;
  progress: number;
  status: MediaFileStatus;
  mediaType: ContentType | 'other';
  url?: string;
  thumbnail?: string;
  error?: string;
}

interface ContentData {
  title: string;
  description: string;
  contentType: ContentType;
  tags: string[];
  isPublished: boolean;
  visibleToPlans: string[];
  individualPrice: number | null;
  isFreeForAll: boolean;
  mediaIds: string[];
}

interface TabOption {
  value: ContentType;
  label: string;
}

interface VisibilitySettings {
  isFree: boolean;
  isIndividualPurchase: boolean;
  individualPrice: number;
  includeInSubscription: boolean;
  selectedPlans: string[];
}

// Add new interface for scheduling
interface ScheduleSettings {
  isScheduled: boolean;
  scheduledDate: string;
  scheduledTime: string;
}

// Define local interfaces for the component
interface SubscriptionPlan {
  id: string;
  name: string;
  price: number;
  description?: string;
  features?: string[];
}

const ContentUploadForm = ({ onSuccess, contentId, onCancel }: UploadFormProps): JSX.Element => {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentType, setContentType] = useState<ContentType>('image');
  const [isExclusive, setIsExclusive] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const [price, setPrice] = useState('0.00');
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [formError, setFormError] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [existingContent, setExistingContent] = useState<ContentPayload | null>(null);
  const [showStorageStats, setShowStorageStats] = useState(false);
  const [statsRefreshTrigger, setStatsRefreshTrigger] = useState(0);
  const [isPublished, setIsPublished] = useState(false);
  const [scheduleSettings, setScheduleSettings] = useState<ScheduleSettings>({
    isScheduled: false,
    scheduledDate: '',
    scheduledTime: ''
  });

  // Content visibility state
  const [visibilitySettings, setVisibilitySettings] = useState<VisibilitySettings>({
    isFree: false,
    isIndividualPurchase: false,
    individualPrice: 0.99,
    includeInSubscription: false,
    selectedPlans: []
  });
  const [availablePlans, setAvailablePlans] = useState<SubscriptionPlan[]>([]);

  // Load existing content if editing
  useEffect(() => {
    if (contentId) {
      ContentService.getContentById(contentId)
        .then(response => {
          const contentData = response.data.content;
          setExistingContent(contentData);
          setTitle(contentData.title);
          setDescription(contentData.description || '');
          setContentType(contentData.contentType as ContentType);
          setIsExclusive(contentData.isExclusive);
          setIsPremium(contentData.isPremium);
          setPrice(contentData.price.toString());
          setTags(contentData.tags?.map((tag: { name: string }) => tag.name) || []);
          setIsPublished(contentData.isPublished);
          
          // Set visibility settings
          setVisibilitySettings({
            isFree: contentData.isFreeForAll,
            isIndividualPurchase: contentData.isFreeForAll,
            individualPrice: contentData.individualPrice,
            includeInSubscription: contentData.visibleToPlans.length > 0,
            selectedPlans: contentData.visibleToPlans,
          });
          
          // Load media items
          if (contentData.mediaItems && contentData.mediaItems.length > 0) {
            const loadedMedia = contentData.mediaItems.map((item: any) => ({
              id: item.id,
              name: item.fileName || 'Unnamed file',
              size: item.fileSize || 0,
              type: item.mimeType || '',
              mediaType: item.mediaType,
              progress: 100,
              status: item.processingStatus === 'failed' ? 'error' : 'complete',
              url: item.url,
              thumbnail: item.thumbnail,
              error: item.processingStatus === 'failed' ? 'Processing failed' : undefined
            }));
            setMediaFiles(loadedMedia);
          }
        })
        .catch(error => {
          console.error('Error loading content:', error);
          setFormError('Failed to load content for editing');
        });
    }
  }, [contentId]);

  // Load available subscription plans
  useEffect(() => {
    const loadSubscriptionPlans = async () => {
      try {
        const response = await SubscriptionService.getAvailablePlans();
        if (response.data?.plans) {
          setAvailablePlans(response.data.plans.map(plan => ({
            id: plan.id,
            name: plan.name,
            price: plan.price,
            description: plan.description,
            features: plan.features
          })));
        }
      } catch (error) {
        console.error('Error loading subscription plans:', error);
        setAvailablePlans([]);
      }
    };

    loadSubscriptionPlans();
  }, []);

  const onDrop = useCallback((acceptedFiles: File[], fileRejections: FileRejection[], event: DropEvent) => {
    acceptedFiles.forEach(file => {
      const mediaType = file.type.startsWith('image/') ? 'image' :
                       file.type.startsWith('video/') ? 'video' :
                       file.type.startsWith('audio/') ? 'audio' : 'other';

      const newMediaFile: MediaFile = {
        file,
        fileName: file.name,
        fileSize: file.size,
        mimeType: file.type,
        preview: URL.createObjectURL(file),
        progress: 0,
        status: 'idle',
        mediaType
      };

      setMediaFiles(prev => [...prev, newMediaFile]);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ 
    onDrop,
    accept: {
      'image/*': [],
      'video/*': [],
      'audio/*': []
    },
    maxSize: 100 * 1024 * 1024 // 100MB max
  });

  // Handle file upload
  const uploadFiles = async () => {
    // Only upload files that haven't been uploaded yet
    const filesToUpload = mediaFiles.filter(f => f.file && f.status === 'idle');
    
    if (filesToUpload.length === 0) {
      return [];
    }
    
    setIsUploading(true);
    
    try {
      // Create FormData
      const formData = new FormData();
      
      // If we have a content ID, add it to associate directly
      if (contentId) {
        formData.append('contentId', contentId);
      }
      
      // Add all files
      filesToUpload.forEach(fileData => {
        if (fileData.file) {
          formData.append('content', fileData.file);
        }
      });
      
      // Update status for uploading files
      setMediaFiles(prev => prev.map(f => 
        f.file && f.status === 'idle' 
          ? { ...f, status: 'uploading', progress: 10 } 
          : f
      ));
      
      // Upload files
      const response = await UploadService.uploadContentMedia(formData, (progressEvent) => {
        // Handle upload progress
        const percentage = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        
        setMediaFiles(prev => prev.map(f => 
          f.file && f.status === 'uploading' 
            ? { ...f, progress: percentage } 
            : f
        ));
      });
      
      // Update files with server response
      const uploadedMedia = response.data.media;
      
      setMediaFiles(prev => {
        const newMediaFiles = [...prev];
        
        // Match uploaded files with local files
        let uploadedIndex = 0;
        for (let i = 0; i < newMediaFiles.length; i++) {
          if (newMediaFiles[i].status === 'uploading' && uploadedIndex < uploadedMedia.length) {
            newMediaFiles[i] = {
              ...newMediaFiles[i],
              id: uploadedMedia[uploadedIndex].id,
              status: 'processing',
              progress: 100
            };
            uploadedIndex++;
          }
        }
        
        return newMediaFiles;
      });
      
      // Return the uploaded media IDs
      return uploadedMedia.map((m: any) => m.id);
      
    } catch (error) {
      console.error('Upload error:', error);
      
      // Mark failed uploads
      setMediaFiles(prev => prev.map(f => 
        f.status === 'uploading' 
          ? { ...f, status: 'error', error: 'Upload failed', progress: 0 } 
          : f
      ));
      
      return [];
    } finally {
      setIsUploading(false);
    }
  };

  // Poll for processing status of uploaded media
  const pollProcessingStatus = async (mediaIds: string[]) => {
    if (mediaIds.length === 0) return;
    
    const checkInterval = setInterval(async () => {
      let allComplete = true;
      let anyFailed = false;
      
      for (const mediaId of mediaIds) {
        try {
          const response = await UploadService.getMediaStatus(mediaId);
          const status = response.data;
          
          setMediaFiles(prev => prev.map(f => 
            f.id === mediaId 
              ? { 
                  ...f, 
                  status: status.isProcessed ? 'complete' : 'processing',
                  url: status.url,
                  thumbnail: status.thumbnail,
                  error: status.processingStatus === 'failed' ? 'Processing failed' : undefined
                } 
              : f
          ));
          
          if (status.processingStatus === 'failed') {
            anyFailed = true;
          }
          
          if (!status.isProcessed && status.processingStatus !== 'failed') {
            allComplete = false;
          }
        } catch (error) {
          console.error(`Error checking status for media ${mediaId}:`, error);
          allComplete = false;
        }
      }
      
      if (allComplete || anyFailed) {
        clearInterval(checkInterval);
        
        // Refresh storage stats if we're showing them
        if (showStorageStats) {
          setStatsRefreshTrigger(prev => prev + 1);
        }
      }
    }, 3000); // Check every 3 seconds
    
    // Clean up interval on component unmount
    return () => clearInterval(checkInterval);
  };

  // Handle retrying a failed upload/processing
  const handleRetryProcessing = async (index: number) => {
    const fileToRetry = mediaFiles[index];
    
    if (!fileToRetry.id) {
      // If it's a local file that failed to upload, reset its status to idle
      if (fileToRetry.file) {
        setMediaFiles(prev => prev.map((f, i) => 
          i === index ? { ...f, status: 'idle', progress: 0, error: undefined } : f
        ));
      }
    } else {
      // If it's a file that was uploaded but failed processing, retry processing
      try {
        await UploadService.retryProcessing(fileToRetry.id);
        
        // Update status in UI
        setMediaFiles(prev => prev.map((f, i) => 
          i === index ? { ...f, status: 'processing', error: undefined } : f
        ));
        
        // Start polling for new status
        pollProcessingStatus([fileToRetry.id]);
      } catch (error) {
        console.error('Error retrying processing:', error);
      }
    }
  };

  // Handle removing a file
  const handleRemoveFile = (index: number) => {
    const fileToRemove = mediaFiles[index];
    
    // If already uploaded, delete from server
    if (fileToRemove.id) {
      UploadService.deleteMedia(fileToRemove.id)
        .then(() => {
          // Refresh storage stats
          if (showStorageStats) {
            setStatsRefreshTrigger(prev => prev + 1);
          }
        })
        .catch(error => console.error('Error deleting media:', error));
    }
    
    // Remove from local state
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
    
    // Revoke object URL to avoid memory leaks
    if (fileToRemove.preview) {
      URL.revokeObjectURL(fileToRemove.preview);
    }
  };

  // Handle adding a tag
  const handleAddTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim()) && tags.length < 10) {
      setTags(prev => [...prev, tagInput.trim()]);
      setTagInput('');
    }
  };

  // Handle key press for tag input
  const handleTagKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  // Handle removing a tag
  const handleRemoveTag = (index: number) => {
    setTags(prev => prev.filter((_, i) => i !== index));
  };

  // Handle toggling publish status
  const handlePublishToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsPublished(e.target.checked);
  };

  const handleTagChange = (newTags: string[]): void => {
    setTags(newTags);
  };
  
  const handleVisibilityChange = (settings: Partial<VisibilitySettings>) => {
    setVisibilitySettings(prev => ({
      ...prev,
      ...settings
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setIsPublishing(true);

    try {
      // Upload any pending files first
      const uploadedMediaIds = await uploadFiles();
      
      // Combine with existing media IDs
      const allMediaIds = [
        ...uploadedMediaIds,
        ...mediaFiles
          .filter(f => f.id && f.status === 'complete')
          .map(f => f.id!)
      ];

      // Create FormData for the request
      const formData = new FormData();
      formData.append('title', title);
      formData.append('description', description);
      formData.append('contentType', contentType);
      formData.append('tags', JSON.stringify(tags));
      formData.append('isPublished', String(isPublished || scheduleSettings.isScheduled));
      formData.append('visibleToPlans', JSON.stringify(visibilitySettings.selectedPlans));
      formData.append('individualPrice', visibilitySettings.individualPrice ? String(visibilitySettings.individualPrice) : '');
      formData.append('mediaIds', JSON.stringify(allMediaIds));
      formData.append('visibility', JSON.stringify({
        isFree: visibilitySettings.isFree,
        isIndividualPurchase: visibilitySettings.isIndividualPurchase,
        individualPrice: visibilitySettings.individualPrice,
        includeInSubscription: visibilitySettings.includeInSubscription,
        selectedPlans: visibilitySettings.selectedPlans
      }));

      // Add scheduling data
      formData.append('isScheduled', String(scheduleSettings.isScheduled));
      if (scheduleSettings.isScheduled) {
        const scheduledDateTime = `${scheduleSettings.scheduledDate}T${scheduleSettings.scheduledTime}`;
        formData.append('scheduledPublishDate', scheduledDateTime);
      }

      // Create or update content
      const response = contentId
        ? await ContentService.updateContent(contentId, formData)
        : await ContentService.createContent(formData);

      const newContentId = contentId || response.data.contentId;

      // If we have media files, associate them with the content
      if (allMediaIds.length > 0) {
        await UploadService.associateMediaWithContent(newContentId, allMediaIds);
      }

      // Start polling for processing status
      if (uploadedMediaIds.length > 0) {
        pollProcessingStatus(uploadedMediaIds);
      }

      // Invoke success callback
      if (onSuccess) {
        onSuccess(newContentId);
      }

    } catch (error) {
      console.error('Error publishing content:', error);
      setFormError('Failed to publish content. Please try again.');
    } finally {
      setIsPublishing(false);
    }
  };

  // Toggle storage stats visibility
  const toggleStorageStats = () => {
    setShowStorageStats(!showStorageStats);
    if (!showStorageStats) {
      setStatsRefreshTrigger(prev => prev + 1);
    }
  };

  const contentTypeOptions: TabOption[] = [
    { value: 'image', label: 'Image' },
    { value: 'video', label: 'Video' },
    { value: 'audio', label: 'Audio' },
    { value: 'text', label: 'Text' },
    { value: 'mixed', label: 'Mixed' }
  ];

  const handleBack = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button
            onClick={handleBack}
            variant="ghost"
            className="flex items-center text-gray-600 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
          >
            <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back
          </Button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            {contentId ? 'Edit Content' : 'Create New Content'}
          </h1>
        </div>
      </div>

      {/* Media Upload Area */}
      <div className="mb-8">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/10'
              : 'border-gray-300 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500'
          }`}
        >
          <input {...getInputProps()} />
          <div className="space-y-2">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <div className="text-gray-600 dark:text-gray-300">
              <span className="font-medium">Click to upload</span> or drag and drop
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Images, videos, or audio files (max 100MB)
            </p>
          </div>
        </div>

        {/* Media Previews */}
        {mediaFiles.length > 0 && (
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {mediaFiles.map((file, index) => (
              <div key={index} className="relative">
                <MediaPreview
                  file={{
                    id: file.id,
                    name: file.fileName,
                    type: file.mimeType,
                    size: file.fileSize,
                    thumbnail: file.thumbnail,
                    preview: file.preview,
                    url: file.url
                  }}
                  onRemove={() => handleRemoveFile(index)}
                />
                {file.status === 'uploading' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-lg">
                    <div className="text-white text-sm">{file.progress}%</div>
                  </div>
                )}
                {file.status === 'error' && (
                  <div className="mt-2">
                    <p className="text-sm text-red-600">{file.error}</p>
                    <Button
                      onClick={() => handleRetryProcessing(index)}
                      size="sm"
                      variant="secondary"
                      className="mt-1"
                    >
                      Retry
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Form Content */}
      <div className="space-y-6 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
        {formError && (
          <div className="p-4 rounded-lg bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400">
            {formError}
          </div>
        )}

        {/* Existing form fields with updated styling */}
        <Input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title"
          label="Title"
          required
          className="w-full"
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            placeholder="Enter description"
          />
        </div>

        {/* Content Type with updated styling */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            Content Type
          </label>
          <Tabs
            value={contentType}
            onChange={(value) => setContentType(value as ContentType)}
            options={contentTypeOptions}
          />
        </div>

        {/* Tags Input with updated styling */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Tags
          </label>
          <div className="mt-1 flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 dark:bg-gray-700"
              >
                {tag}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(index)}
                  className="ml-2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
            <input
              type="text"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyPress={handleTagKeyPress}
              placeholder="Add a tag..."
              className="px-3 py-1 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
            />
          </div>
        </div>

        {/* Visibility Settings Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Content Access Settings</h3>
          
          {/* Free Content Toggle */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                checked={visibilitySettings.isFree}
                onChange={(checked) => handleVisibilityChange({ 
                  isFree: checked,
                  // If making it free, disable individual purchase
                  isIndividualPurchase: checked ? false : visibilitySettings.isIndividualPurchase
                })}
                className={`${
                  visibilitySettings.isFree ? 'bg-primary-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span className="sr-only">Make content free</span>
                <span
                  className={`${
                    visibilitySettings.isFree ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
              <Label>Available for Free</Label>
            </div>
          </div>

          {/* Individual Purchase Option - Only show if not free */}
          {!visibilitySettings.isFree && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={visibilitySettings.isIndividualPurchase}
                    onChange={(checked) => handleVisibilityChange({ isIndividualPurchase: checked })}
                    className={`${
                      visibilitySettings.isIndividualPurchase ? 'bg-primary-600' : 'bg-gray-200'
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                  >
                    <span className="sr-only">Enable individual purchase</span>
                    <span
                      className={`${
                        visibilitySettings.isIndividualPurchase ? 'translate-x-6' : 'translate-x-1'
                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                  </Switch>
                  <Label>Allow Individual Purchase</Label>
                </div>
                
                {visibilitySettings.isIndividualPurchase && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Price:</span>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <input
                        type="number"
                        min="0.99"
                        step="0.01"
                        value={visibilitySettings.individualPrice}
                        onChange={(e) => handleVisibilityChange({ 
                          individualPrice: Math.max(0.99, parseFloat(e.target.value)) 
                        })}
                        className="pl-7 pr-3 py-1.5 block w-24 rounded-md border border-gray-300 focus:border-primary-500 focus:ring-primary-500"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Subscription Plans Option - Always show */}
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Switch
                checked={visibilitySettings.includeInSubscription}
                onChange={(checked) => handleVisibilityChange({ 
                  includeInSubscription: checked,
                  selectedPlans: checked ? visibilitySettings.selectedPlans : []
                })}
                className={`${
                  visibilitySettings.includeInSubscription ? 'bg-primary-600' : 'bg-gray-200'
                } relative inline-flex h-6 w-11 items-center rounded-full`}
              >
                <span className="sr-only">Include in subscription plans</span>
                <span
                  className={`${
                    visibilitySettings.includeInSubscription ? 'translate-x-6' : 'translate-x-1'
                  } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                />
              </Switch>
              <Label>Include in Subscription Plans</Label>
            </div>

            {visibilitySettings.includeInSubscription && (
              <div className="mt-4 space-y-3 pl-4">
                {availablePlans.length > 0 ? (
                  <>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Select which subscription plans should have access to this content:
                    </p>
                    <div className="space-y-2">
                      {availablePlans.map((plan) => (
                        <div key={plan.id} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <input
                            type="checkbox"
                            id={`plan-${plan.id}`}
                            checked={visibilitySettings.selectedPlans.includes(plan.id)}
                            onChange={(e) => {
                              const newSelectedPlans = e.target.checked
                                ? [...visibilitySettings.selectedPlans, plan.id]
                                : visibilitySettings.selectedPlans.filter(id => id !== plan.id);
                              handleVisibilityChange({ selectedPlans: newSelectedPlans });
                            }}
                            className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                          />
                          <label 
                            htmlFor={`plan-${plan.id}`} 
                            className="flex flex-1 items-center justify-between text-sm cursor-pointer"
                          >
                            <span className="font-medium text-gray-900 dark:text-gray-100">{plan.name}</span>
                            <span className="text-gray-600 dark:text-gray-400">${plan.price}/month</span>
                          </label>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    No subscription plans available. Please create subscription plans first.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Access Summary */}
          <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h4 className="text-sm font-medium mb-2">Access Summary</h4>
            <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
              {visibilitySettings.isFree && (
                <li className="flex items-center">
                  <GlobeAltIcon className="w-4 h-4 mr-2 text-green-500" />
                  Available to everyone for free
                </li>
              )}
              {!visibilitySettings.isFree && visibilitySettings.isIndividualPurchase && (
                <li className="flex items-center">
                  <CurrencyDollarIcon className="w-4 h-4 mr-2 text-purple-500" />
                  Available for individual purchase at ${visibilitySettings.individualPrice}
                </li>
              )}
              {visibilitySettings.includeInSubscription && visibilitySettings.selectedPlans.length > 0 && (
                <li className="flex items-center">
                  <ShieldCheckIcon className="w-4 h-4 mr-2 text-blue-500" />
                  Included in {visibilitySettings.selectedPlans.length} subscription plan(s)
                </li>
              )}
              {!visibilitySettings.isFree && !visibilitySettings.isIndividualPurchase && !visibilitySettings.includeInSubscription && (
                <li className="flex items-center text-yellow-600">
                  <ShieldCheckIcon className="w-4 h-4 mr-2" />
                  No access method selected - content will be private
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Publish Toggle */}
        <div className="flex items-center justify-between py-4 border-t border-gray-200 dark:border-gray-700">
          <Switch.Group>
            <div className="flex items-center">
              <Switch.Label className="mr-4 text-sm font-medium text-gray-700 dark:text-gray-200">
                {isPublished ? 'Publish Content' : 'Publish Content (Draft)'}
              </Switch.Label>
              <Switch
                checked={isPublished}
                onChange={(checked) => {
                  setIsPublished(checked);
                }}
                className={`${
                  isPublished ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
              >
                <span className={`${isPublished ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
              </Switch>
            </div>
          </Switch.Group>
        </div>

        {/* Schedule section - Now independent from publish toggle */}
        <div className="mt-4 space-y-4 rounded-lg border border-gray-200 p-4 dark:border-gray-700">
          <Switch.Group>
            <div className="flex items-center">
              <Switch.Label className="mr-4 text-sm font-medium text-gray-700 dark:text-gray-200">
                Schedule Publication
              </Switch.Label>
              <Switch
                checked={scheduleSettings.isScheduled}
                onChange={(checked) => {
                  setScheduleSettings({
                    ...scheduleSettings,
                    isScheduled: checked,
                    scheduledDate: checked ? scheduleSettings.scheduledDate || new Date().toISOString().split('T')[0] : '',
                    scheduledTime: checked ? scheduleSettings.scheduledTime || '12:00' : ''
                  });
                }}
                className={`${
                  scheduleSettings.isScheduled ? 'bg-primary-600' : 'bg-gray-200 dark:bg-gray-700'
                } relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2`}
              >
                <span className={`${scheduleSettings.isScheduled ? 'translate-x-6' : 'translate-x-1'} inline-block h-4 w-4 transform rounded-full bg-white transition-transform`} />
              </Switch>
            </div>
          </Switch.Group>

          {scheduleSettings.isScheduled && (
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="scheduleDate" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Publication Date
                </label>
                <input
                  type="date"
                  id="scheduleDate"
                  min={new Date().toISOString().split('T')[0]}
                  value={scheduleSettings.scheduledDate}
                  onChange={(e) => setScheduleSettings({
                    ...scheduleSettings,
                    scheduledDate: e.target.value
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                  required={scheduleSettings.isScheduled}
                />
              </div>
              <div>
                <label htmlFor="scheduleTime" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                  Publication Time
                </label>
                <input
                  type="time"
                  id="scheduleTime"
                  value={scheduleSettings.scheduledTime}
                  onChange={(e) => setScheduleSettings({
                    ...scheduleSettings,
                    scheduledTime: e.target.value
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white sm:text-sm"
                  required={scheduleSettings.isScheduled}
                />
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end space-x-4 pt-6">
          <Button
            onClick={handleBack}
            variant="secondary"
            className="px-6"
          >
            Cancel
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit}
            disabled={isUploading || isPublishing}
            className="px-6"
          >
            {(isUploading || isPublishing) && <Spinner className="mr-2 h-4 w-4" />}
            {contentId ? 'Update Content' : 'Create Content'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ContentUploadForm;