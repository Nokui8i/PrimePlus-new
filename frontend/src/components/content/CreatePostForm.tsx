import React, { useState, useRef, useCallback } from 'react';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/router';
import { toast } from 'react-hot-toast';
import ReactCrop, { Crop, PixelCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { 
  CubeTransparentIcon, 
  CameraIcon,
  VideoCameraIcon,
  AdjustmentsHorizontalIcon,
  ViewfinderCircleIcon,
  CubeIcon,
  PhotoIcon,
  ArrowsPointingInIcon,
  SwatchIcon,
  GlobeAltIcon,
  LockClosedIcon,
  CurrencyDollarIcon,
  UserGroupIcon,
  XMarkIcon,
  CogIcon,
  ChevronDownIcon,
  QuestionMarkCircleIcon
} from '@heroicons/react/24/outline';
import VRViewer from '@/components/VRViewer';
import Image from 'next/image';
import { SubscriptionPlan } from '@/services/subscriptionService';
import { useDropzone } from 'react-dropzone';

interface CreatePostFormProps {
  onPostCreated?: () => void;
  subscriptionPlans?: Array<{
    id: string;
    name: string;
    price: number;
    contentAccess: {
      regularContent: boolean;
      premiumVideos: boolean;
      vrContent: boolean;
      threeSixtyContent: boolean;
      liveRooms: boolean;
      interactiveModels: boolean;
    };
  }>;
}

interface ThumbnailOptions {
  crop?: PixelCrop;
  filter?: string;
  aspectRatio?: number;
  brightness?: number;
  contrast?: number;
  blur?: number;
}

interface AnimationOptions {
  enabled: boolean;
  clipName?: string;
  autoPlay: boolean;
  loop: boolean;
}

interface Position {
  x: number;
  y: number;
  z: number;
}

interface VROptions {
  initialPosition: Position;
  initialRotation: Position;
  autoRotate: boolean;
  autoRotateSpeed: number;
  enableZoom: boolean;
  minDistance: number;
  maxDistance: number;
  animation: AnimationOptions;
}

interface PartialVROptions extends Partial<Omit<VROptions, 'initialPosition' | 'initialRotation' | 'animation'>> {
  initialPosition?: Partial<Position>;
  initialRotation?: Partial<Position>;
  animation?: Partial<AnimationOptions>;
}

interface MediaFile {
  file: File;
  preview: string;
  type: 'image' | 'video' | 'vr' | '360-photo' | '360-video' | 'live-room' | '3d-model';
  thumbnail?: File;
  thumbnailOptions?: ThumbnailOptions;
  vrOptions?: VROptions;
  contentMetadata?: {
    contentType: 'vr' | '360-photo' | '360-video' | 'live-room' | '3d-model';
    roomId?: string;
    roomName?: string;
    roomDescription?: string;
    maxParticipants?: number;
    isPrivate?: boolean;
    allowChat?: boolean;
    allowVoice?: boolean;
    allowVideo?: boolean;
    modelFormat?: 'glb' | 'gltf' | 'fbx' | 'obj' | 'usdz';
    textureFiles?: File[];
    animationClips?: string[];
  };
  category: string;
}

interface VRViewerProps {
  mediaUrl: string;
  contentType: 'model' | '360-video' | '360-image';
  title?: string;
}

interface VisibilitySettings {
  isFree: boolean;
  isIndividualPurchase: boolean;
  individualPrice: number;
  includeInSubscription: boolean;
  selectedPlans: string[];
}

interface ContentCategory {
  type: 'regular' | 'premium' | 'vr' | '360' | 'live' | 'interactive';
  suggestedPlans: string[];
  description: string;
}

const DEFAULT_VR_OPTIONS: VROptions = {
  initialPosition: { x: 0, y: 0, z: 5 },
  initialRotation: { x: 0, y: 0, z: 0 },
  autoRotate: true,
  autoRotateSpeed: 1,
  enableZoom: true,
  minDistance: 2,
  maxDistance: 10,
  animation: {
    enabled: false,
    autoPlay: true,
    loop: true
  }
};

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onPostCreated, subscriptionPlans = [] }) => {
  const { user } = useUser();
  const router = useRouter();
  const [content, setContent] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [isPremiumContent, setIsPremiumContent] = useState(false);
  const [showMediaOptions, setShowMediaOptions] = useState(false);
  const [price, setPrice] = useState('');
  const [selectedMediaIndex, setSelectedMediaIndex] = useState<number | null>(null);
  const [showVROptions, setShowVROptions] = useState(false);
  const [showThumbnailEditor, setShowThumbnailEditor] = useState(false);
  const [thumbnailSrc, setThumbnailSrc] = useState('');
  const [crop, setCrop] = useState<PixelCrop>();
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [thumbnailOptions, setThumbnailOptions] = useState<ThumbnailOptions>({
    filter: 'none',
    aspectRatio: 1,
    brightness: 100,
    contrast: 100,
    blur: 0
  });
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  
  // Content access settings
  const [visibilitySettings, setVisibilitySettings] = useState<VisibilitySettings>({
    isFree: true,
    isIndividualPurchase: false,
    individualPrice: 4.99,
    includeInSubscription: false,
    selectedPlans: []
  });

  const [contentCategories, setContentCategories] = useState<ContentCategory[]>([]);
  const [suggestedPlans, setSuggestedPlans] = useState<string[]>([]);

  // Setup dropzone
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: useCallback((acceptedFiles: File[]) => {
      handleMediaChange({ target: { files: acceptedFiles }} as any);
    }, []),
    accept: {
      'image/*': [],
      'video/*': [],
      'model/gltf-binary': ['.glb'],
      'model/gltf+json': ['.gltf'],
      'model/fbx': ['.fbx'],
      'model/obj': ['.obj'],
      'model/usdz': ['.usdz']
    },
    maxSize: 100 * 1024 * 1024 // 100MB
  });

  const detectContentCategory = (file: File): ContentCategory => {
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    const is360Photo = file.name.toLowerCase().includes('360') && isImage;
    const is360Video = file.name.toLowerCase().includes('360') && isVideo;
    const isVR = file.name.toLowerCase().match(/\.(glb|gltf)$/);
    const is3DModel = file.name.toLowerCase().match(/\.(fbx|obj|usdz)$/);
    const isHighRes = file.size > 50 * 1024 * 1024; // Files over 50MB are considered high-res

    // Determine content category
    if (isVR) {
      return {
        type: 'vr',
        suggestedPlans: ['vrContent'],
        description: 'VR content - requires VR-enabled subscription plan'
      };
    } else if (is360Photo || is360Video) {
      return {
        type: '360',
        suggestedPlans: ['threeSixtyContent'],
        description: '360° content - requires 360° content subscription plan'
      };
    } else if (is3DModel) {
      return {
        type: 'interactive',
        suggestedPlans: ['interactiveModels'],
        description: 'Interactive 3D model - requires interactive content subscription plan'
      };
    } else if (isVideo && isHighRes) {
      return {
        type: 'premium',
        suggestedPlans: ['premiumVideos'],
        description: 'High-quality video content - suggested for premium plans'
      };
    } else {
      return {
        type: 'regular',
        suggestedPlans: ['regularContent'],
        description: 'Regular content - available in all subscription plans'
      };
    }
  };

  const handleMediaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    const newMediaFiles = await Promise.all(files.map(async file => {
      const category = detectContentCategory(file);
      
      // Add to content categories if not already present
      setContentCategories(prev => {
        const exists = prev.some(c => c.type === category.type);
        if (!exists) {
          return [...prev, category];
        }
        return prev;
      });

      // Update suggested plans
      setSuggestedPlans(prev => Array.from(new Set([...prev, ...category.suggestedPlans])));

      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      const is360Photo = file.name.toLowerCase().includes('360') && isImage;
      const is360Video = file.name.toLowerCase().includes('360') && isVideo;
      const isVR = file.name.toLowerCase().match(/\.(glb|gltf)$/);
      const is3DModel = file.name.toLowerCase().match(/\.(fbx|obj|usdz)$/);
      
      if ((isVR || is3DModel) && file.size > 100 * 1024 * 1024) {
        toast.error('3D content files must be under 100MB');
        return null;
      }

      let thumbnail: File | undefined;
      if (isVideo || is360Video) {
        try {
          thumbnail = await generateVideoThumbnail(file);
        } catch (error) {
          console.error('Failed to generate video thumbnail:', error);
        }
      }

      let contentType: MediaFile['type'] = 'image';
      if (is360Photo) contentType = '360-photo';
      else if (is360Video) contentType = '360-video';
      else if (isVR) contentType = 'vr';
      else if (is3DModel) contentType = '3d-model';
      else if (isVideo) contentType = 'video';
      
      const mediaFile: MediaFile = {
        file,
        preview: URL.createObjectURL(file),
        type: contentType,
        thumbnail,
        vrOptions: (contentType === 'vr' || contentType === '3d-model') ? DEFAULT_VR_OPTIONS : undefined,
        contentMetadata: (contentType === 'vr' || contentType === '3d-model' || contentType === '360-photo' || contentType === '360-video') ? {
          contentType,
          modelFormat: file.name.toLowerCase().split('.').pop() as any,
          animationClips: []
        } : undefined,
        category: category.type
      };

      // Auto-select appropriate subscription plans based on content type
      if (category.type !== 'regular') {
        const matchingPlans = subscriptionPlans.filter(plan => 
          category.suggestedPlans.some(suggestedType => 
            plan.contentAccess && plan.contentAccess[suggestedType as keyof typeof plan.contentAccess]
          )
        );
        
        if (matchingPlans.length > 0) {
          setVisibilitySettings(prev => ({
            ...prev,
            includeInSubscription: true,
            selectedPlans: Array.from(new Set([...prev.selectedPlans, ...matchingPlans.map(p => p.id)]))
          }));
        }

        // If no matching plans found, suggest creating a new plan
        if (matchingPlans.length === 0) {
          toast.custom(
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <p className="text-blue-700">
                This content type ({category.description}) requires a specific subscription plan. 
                Consider creating an appropriate plan in your subscription settings.
              </p>
            </div>
          );
        }
      }

      return mediaFile;
    }));

    const validFiles = newMediaFiles.filter(Boolean) as MediaFile[];
    setMediaFiles(prev => [...prev, ...validFiles]);

    // Show content category information
    if (contentCategories.length > 0) {
      toast.custom(
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
          <p className="font-medium mb-2">Content Categories Detected:</p>
          {contentCategories.map((cat, index) => (
            <p key={index} className="text-sm text-gray-600 dark:text-gray-300">
              • {cat.description}
            </p>
          ))}
        </div>
      );
    }
  };

  const generateVideoThumbnail = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
      const video = document.createElement('video');
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      video.onloadeddata = () => {
        try {
          // Set canvas size to match video dimensions
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          // Draw the first frame
          ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
          
          // Convert canvas to blob
          canvas.toBlob((blob) => {
            if (blob) {
              const thumbnailFile = new File([blob], 'thumbnail.jpg', { type: 'image/jpeg' });
              resolve(thumbnailFile);
            } else {
              reject(new Error('Failed to create thumbnail blob'));
            }
          }, 'image/jpeg', 0.8);
        } catch (error) {
          reject(error);
        }
      };

      video.onerror = () => {
        reject(new Error('Failed to load video'));
      };

      video.src = URL.createObjectURL(file);
    });
  };

  const handleVROptionsChange = (index: number, options: PartialVROptions) => {
    setMediaFiles(prev => {
      const updated = [...prev];
      const currentFile = updated[index];
      if (!currentFile?.vrOptions) return prev;

      const currentOptions = currentFile.vrOptions;
      
      // Handle animation updates
      let newAnimation = currentOptions.animation;
      if (options.animation) {
        newAnimation = {
          enabled: options.animation.enabled ?? currentOptions.animation.enabled,
          clipName: options.animation.clipName ?? currentOptions.animation.clipName,
          autoPlay: options.animation.autoPlay ?? currentOptions.animation.autoPlay,
          loop: options.animation.loop ?? currentOptions.animation.loop
        };
      }

      // Handle position updates
      let newPosition = currentOptions.initialPosition;
      if (options.initialPosition) {
        newPosition = {
          x: options.initialPosition.x ?? currentOptions.initialPosition.x,
          y: options.initialPosition.y ?? currentOptions.initialPosition.y,
          z: options.initialPosition.z ?? currentOptions.initialPosition.z
        };
      }

      // Handle rotation updates
      let newRotation = currentOptions.initialRotation;
      if (options.initialRotation) {
        newRotation = {
          x: options.initialRotation.x ?? currentOptions.initialRotation.x,
          y: options.initialRotation.y ?? currentOptions.initialRotation.y,
          z: options.initialRotation.z ?? currentOptions.initialRotation.z
        };
      }

      updated[index] = {
        ...currentFile,
        vrOptions: {
          initialPosition: newPosition,
          initialRotation: newRotation,
          autoRotate: options.autoRotate ?? currentOptions.autoRotate,
          autoRotateSpeed: options.autoRotateSpeed ?? currentOptions.autoRotateSpeed,
          enableZoom: options.enableZoom ?? currentOptions.enableZoom,
          minDistance: options.minDistance ?? currentOptions.minDistance,
          maxDistance: options.maxDistance ?? currentOptions.maxDistance,
          animation: newAnimation
        }
      };
      return updated;
    });
  };

  const handleThumbnailUpload = (index: number) => {
    if (thumbnailInputRef.current) {
      thumbnailInputRef.current.click();
      thumbnailInputRef.current.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (file) {
          setMediaFiles(prev => {
            const updated = [...prev];
            if (updated[index]) {
              updated[index] = {
                ...updated[index],
                thumbnail: file
              };
            }
            return updated;
          });
        }
      };
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!content.trim() && mediaFiles.length === 0) {
      toast.error('Please add some content to your post');
      return;
    }
    
    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append('content', content);
      formData.append('isFreeContent', visibilitySettings.isFree.toString());
      formData.append('enableSinglePurchase', visibilitySettings.isIndividualPurchase.toString());
      formData.append('singlePurchasePrice', visibilitySettings.individualPrice.toString());
      
      // Add metadata for VR content
      const vrFiles = mediaFiles.filter(media => media.type === 'vr');
      if (vrFiles.length > 0) {
        formData.append('hasVRContent', 'true');
        formData.append('vrContentCount', vrFiles.length.toString());
      }
      
      mediaFiles.forEach((media, index) => {
        formData.append(`files`, media.file);
        formData.append(`fileTypes[${index}]`, media.type);
        
        if (media.thumbnail) {
          formData.append(`thumbnails[${index}]`, media.thumbnail);
        }
        
        if (media.vrOptions) {
          formData.append(`vrOptions[${index}]`, JSON.stringify(media.vrOptions));
        }
      });
      
      formData.append('isPremium', isPremiumContent.toString());
      if (isPremiumContent && price.trim()) {
        formData.append('price', price);
      }

      const response = await fetch('/api/posts', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const post = await response.json();
      
      // Clear form
      setContent('');
      setMediaFiles([]);
      setIsPremiumContent(false);
      setShowMediaOptions(false);
      setPrice('');
      setSelectedMediaIndex(null);
      setShowVROptions(false);
      setVisibilitySettings({
        isFree: true,
        isIndividualPurchase: false,
        individualPrice: 4.99,
        includeInSubscription: false,
        selectedPlans: []
      });
      
      if (onPostCreated) {
        onPostCreated();
      }
      
      toast.success('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  // Function to get object URL for VR file
  const getVRFileUrl = useCallback((file: File) => {
    return URL.createObjectURL(file);
  }, []);

  // Function to generate thumbnail from VR model
  const generateVRThumbnail = async (index: number) => {
    if (!mediaFiles[index]?.vrOptions) return;
    
    try {
      // Get screenshot from VRViewer component
      const vrViewerElement = document.querySelector('.vr-viewer-container canvas');
      if (!vrViewerElement || !(vrViewerElement instanceof HTMLCanvasElement)) {
        throw new Error('VR viewer canvas not found');
      }

      const screenshot = vrViewerElement.toDataURL('image/jpeg', 0.9);
      
      // Convert data URL to File
      const res = await fetch(screenshot);
      const blob = await res.blob();
      const thumbnailFile = new File([blob], 'vr-thumbnail.jpg', { type: 'image/jpeg' });

      // Update media files with new thumbnail
      setMediaFiles(prev => {
        const updated = [...prev];
        if (updated[index]) {
          updated[index] = {
            ...updated[index],
            thumbnail: thumbnailFile
          };
        }
        return updated;
      });

      toast.success('VR thumbnail generated successfully!');
    } catch (error) {
      console.error('Failed to generate VR thumbnail:', error);
      toast.error('Failed to generate VR thumbnail');
    }
  };

  // Function to open thumbnail editor
  const openThumbnailEditor = (index: number) => {
    const media = mediaFiles[index];
    if (!media) return;

    let thumbnailSource = '';
    if (media.thumbnail) {
      thumbnailSource = URL.createObjectURL(media.thumbnail);
    } else if (media.type === 'video') {
      // Generate video thumbnail
      const video = document.createElement('video');
      video.src = media.preview;
      video.currentTime = 1; // Capture frame at 1 second
      video.addEventListener('seeked', () => {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(video, 0, 0);
        thumbnailSource = canvas.toDataURL('image/jpeg');
        setThumbnailSrc(thumbnailSource);
      });
    } else {
      thumbnailSource = media.preview;
    }

    setThumbnailSrc(thumbnailSource);
    setShowThumbnailEditor(true);
    setSelectedMediaIndex(index);
  };

  // Function to apply thumbnail edits
  const applyThumbnailEdits = async () => {
    if (!imageRef.current || !crop || selectedMediaIndex === null) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Apply crop
    const scaleX = imageRef.current.naturalWidth / imageRef.current.width;
    const scaleY = imageRef.current.naturalHeight / imageRef.current.height;

    canvas.width = crop.width;
    canvas.height = crop.height;

    ctx.drawImage(
      imageRef.current,
      crop.x * scaleX,
      crop.y * scaleY,
      crop.width * scaleX,
      crop.height * scaleY,
      0,
      0,
      crop.width,
      crop.height
    );

    // Apply filters
    ctx.filter = `
      brightness(${thumbnailOptions.brightness}%)
      contrast(${thumbnailOptions.contrast}%)
      blur(${thumbnailOptions.blur}px)
      ${thumbnailOptions.filter !== 'none' ? thumbnailOptions.filter : ''}
    `;
    
    // Convert to file
    canvas.toBlob(async (blob) => {
      if (!blob) return;
      
      const thumbnailFile = new File([blob], 'thumbnail.jpg', { type: 'image/jpeg' });
      
      setMediaFiles(prev => {
        const updated = [...prev];
        if (updated[selectedMediaIndex]) {
          updated[selectedMediaIndex] = {
            ...updated[selectedMediaIndex],
            thumbnail: thumbnailFile,
            thumbnailOptions: { ...thumbnailOptions, crop }
          };
        }
        return updated;
      });

      setShowThumbnailEditor(false);
      toast.success('Thumbnail updated successfully!');
    }, 'image/jpeg', 0.9);
  };

  // Add function to create live room
  const createLiveRoom = () => {
    const roomId = `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const mediaFile: MediaFile = {
      file: new File([], 'live-room'),
      preview: '/images/live-room-preview.jpg',
      type: 'live-room',
      contentMetadata: {
        contentType: 'live-room',
        roomId,
        roomName: '',
        roomDescription: '',
        maxParticipants: 10,
        isPrivate: false,
        allowChat: true,
        allowVoice: true,
        allowVideo: true
      },
      category: 'live'
    };

    setMediaFiles(prev => [...prev, mediaFile]);
    setSelectedMediaIndex(mediaFiles.length);
    setShowVROptions(true);
  };

  const [showCreatorSettings, setShowCreatorSettings] = useState(false);
  const [showSettingsInfo, setShowSettingsInfo] = useState(false);

  return (
    <>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
        <div className="p-4">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0">
              {user?.avatar ? (
                <Image 
                  src={user.avatar} 
                  alt={user.fullName || 'User'} 
                  width={40}
                  height={40}
                  className="rounded-full"
                />
              ) : (
                <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                  <UserGroupIcon className="h-6 w-6 text-gray-500" />
                </div>
              )}
            </div>
            
            <div className="min-w-0 flex-1">
              <div 
                onClick={() => setShowUploadModal(true)}
                className="block w-full rounded-lg border-0 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-gray-400 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
              >
                What's on your mind, {user?.fullName?.split(' ')[0] || 'there'}?
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium">Create Post</h3>
                  <button
                    onClick={() => setShowUploadModal(false)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <XMarkIcon className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleSubmit}>
                  {/* Post Input with Drag & Drop Area */}
                  <div className="relative">
                    <textarea
                      rows={3}
                      name="content"
                      id="content"
                      className="block w-full rounded-lg border-0 bg-gray-50 dark:bg-gray-700 px-4 py-3 text-gray-900 dark:text-white shadow-sm ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                      placeholder="What's on your mind?"
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      disabled={isUploading}
                    />

                    {/* Drag & Drop Zone */}
                    <div 
                      className={`mt-2 border-2 border-dashed rounded-lg p-6 transition-colors ${
                        isDragActive 
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
                          : 'border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500'
                      }`}
                      {...getRootProps()}
                    >
                      <input {...getInputProps()} />
                      <div className="text-center">
                        <PhotoIcon className="mx-auto h-12 w-12 text-gray-400" />
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                          Drag & drop your media here, or{' '}
                          <span className="text-primary-600 hover:text-primary-500 cursor-pointer">browse</span>
                        </p>
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                          Supports images, videos, 360° content, and VR/3D models
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Media Preview */}
                  {mediaFiles.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {mediaFiles.map((media, index) => (
                        <div key={index} className="relative rounded-lg overflow-hidden aspect-video bg-gray-100">
                          {media.type === 'image' ? (
                            <img 
                              src={media.preview} 
                              alt="Upload preview" 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <video 
                              src={media.preview} 
                              className="w-full h-full object-cover" 
                              controls
                            />
                          )}
                          <button
                            type="button"
                            onClick={() => setMediaFiles(files => files.filter((_, i) => i !== index))}
                            className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                          >
                            ×
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Creator Settings Dropdown */}
                  <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
                    <div className="flex items-center justify-between">
                      <button
                        type="button"
                        onClick={() => setShowCreatorSettings(!showCreatorSettings)}
                        className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                      >
                        <CogIcon className="h-5 w-5" />
                        <span>Creator Settings</span>
                        <ChevronDownIcon className={`h-5 w-5 transition-transform ${showCreatorSettings ? 'transform rotate-180' : ''}`} />
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowSettingsInfo(!showSettingsInfo)}
                        className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                      >
                        <QuestionMarkCircleIcon className="h-5 w-5" />
                      </button>
                    </div>

                    {/* Settings Info Tooltip */}
                    {showSettingsInfo && (
                      <div className="mt-2 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm">
                        <h4 className="font-medium text-gray-900 dark:text-white mb-2">Creator Settings Help</h4>
                        <ul className="space-y-2 text-gray-600 dark:text-gray-400">
                          <li>• <strong>Content Access:</strong> Control who can view your content</li>
                          <li>• <strong>Single Purchase:</strong> Allow one-time purchases</li>
                          <li>• <strong>Subscription Plans:</strong> Include in specific subscription tiers</li>
                          <li>• <strong>Content Type:</strong> Automatically detected based on uploaded media</li>
                        </ul>
                      </div>
                    )}

                    {/* Creator Settings Panel */}
                    {showCreatorSettings && (
                      <div className="mt-4 space-y-4">
                        {/* Content Access Options */}
                        <div className="space-y-4">
                          <div className={`p-4 rounded-lg border ${
                            visibilitySettings.isFree 
                              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' 
                              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                          }`}>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className={`p-2 rounded-full ${
                                  visibilitySettings.isFree 
                                    ? 'bg-green-100 dark:bg-green-800' 
                                    : 'bg-gray-100 dark:bg-gray-700'
                                }`}>
                                  <GlobeAltIcon className={`h-5 w-5 ${
                                    visibilitySettings.isFree 
                                      ? 'text-green-600 dark:text-green-400' 
                                      : 'text-gray-500 dark:text-gray-400'
                                  }`} />
                                </div>
                                <div>
                                  <label className="font-medium text-gray-900 dark:text-gray-100">Free Content</label>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">Make this content available to everyone</p>
                                </div>
                              </div>
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={visibilitySettings.isFree}
                                  onChange={(e) => setVisibilitySettings(prev => ({
                                    ...prev,
                                    isFree: e.target.checked,
                                    isIndividualPurchase: e.target.checked ? false : prev.isIndividualPurchase
                                  }))}
                                  className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                />
                              </div>
                            </div>
                          </div>

                          {/* Single Purchase Option */}
                          <div className="relative">
                            <div className={`p-4 rounded-lg border ${
                              visibilitySettings.isIndividualPurchase 
                                ? 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800' 
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                            }`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className={`p-2 rounded-full ${
                                    visibilitySettings.isIndividualPurchase 
                                      ? 'bg-yellow-100 dark:bg-yellow-800' 
                                      : 'bg-gray-100 dark:bg-gray-700'
                                  }`}>
                                    <CurrencyDollarIcon className={`h-5 w-5 ${
                                      visibilitySettings.isIndividualPurchase 
                                        ? 'text-yellow-600 dark:text-yellow-400' 
                                        : 'text-gray-500 dark:text-gray-400'
                                    }`} />
                                  </div>
                                  <div>
                                    <label className="font-medium text-gray-900 dark:text-gray-100">Single Purchase</label>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Allow one-time purchases for this content</p>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={visibilitySettings.isIndividualPurchase}
                                    onChange={(e) => setVisibilitySettings(prev => ({
                                      ...prev,
                                      isIndividualPurchase: e.target.checked
                                    }))}
                                    className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                  />
                                </div>
                              </div>

                              {/* Price Input */}
                              {visibilitySettings.isIndividualPurchase && (
                                <div className="mt-4 pl-12">
                                  <div className="flex items-center space-x-2">
                                    <div className="relative rounded-md shadow-sm max-w-[200px]">
                                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                        <span className="text-gray-500 sm:text-sm">$</span>
                                      </div>
                                      <input
                                        type="number"
                                        min="0.99"
                                        step="0.01"
                                        value={visibilitySettings.individualPrice}
                                        onChange={(e) => setVisibilitySettings(prev => ({
                                          ...prev,
                                          individualPrice: parseFloat(e.target.value)
                                        }))}
                                        placeholder="0.00"
                                        className="block w-full rounded-md border-0 py-1.5 pl-7 pr-4 text-gray-900 dark:text-gray-100 dark:bg-gray-700 ring-1 ring-inset ring-gray-300 dark:ring-gray-600 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
                                      />
                                    </div>
                                    <span className="text-sm text-gray-500 dark:text-gray-400">USD</span>
                                  </div>
                                  <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                    Recommended: Set a price between $0.99 and $49.99
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Subscription Plans */}
                          <div className="relative">
                            <div className={`p-4 rounded-lg border ${
                              visibilitySettings.includeInSubscription 
                                ? 'bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800' 
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                            }`}>
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                  <div className={`p-2 rounded-full ${
                                    visibilitySettings.includeInSubscription 
                                      ? 'bg-purple-100 dark:bg-purple-800' 
                                      : 'bg-gray-100 dark:bg-gray-700'
                                  }`}>
                                    <UserGroupIcon className={`h-5 w-5 ${
                                      visibilitySettings.includeInSubscription 
                                        ? 'text-purple-600 dark:text-purple-400' 
                                        : 'text-gray-500 dark:text-gray-400'
                                    }`} />
                                  </div>
                                  <div>
                                    <label className="font-medium text-gray-900 dark:text-gray-100">Subscription Plans</label>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Include in your subscription tiers</p>
                                  </div>
                                </div>
                                <div className="flex items-center">
                                  <input
                                    type="checkbox"
                                    checked={visibilitySettings.includeInSubscription}
                                    onChange={(e) => setVisibilitySettings(prev => ({
                                      ...prev,
                                      includeInSubscription: e.target.checked
                                    }))}
                                    className="h-5 w-5 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                  />
                                </div>
                              </div>

                              {/* Plan Selection */}
                              {visibilitySettings.includeInSubscription && subscriptionPlans.length > 0 && (
                                <div className="mt-4 pl-12">
                                  <div className="space-y-3">
                                    {subscriptionPlans.map(plan => (
                                      <label key={plan.id} className="flex items-center justify-between p-3 rounded-lg bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700">
                                          <div className="flex items-center min-w-0">
                                            <input
                                              type="checkbox"
                                              checked={visibilitySettings.selectedPlans.includes(plan.id)}
                                              onChange={(e) => {
                                                setVisibilitySettings(prev => ({
                                                  ...prev,
                                                  selectedPlans: e.target.checked
                                                    ? [...prev.selectedPlans, plan.id]
                                                    : prev.selectedPlans.filter(id => id !== plan.id)
                                                }));
                                              }}
                                              className="h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                                            />
                                            <div className="ml-3 min-w-0">
                                              <div className="flex items-center space-x-2">
                                                <span className="font-medium text-gray-900 dark:text-gray-100 truncate">
                                                  {plan.name}
                                                </span>
                                                <span className="text-sm text-gray-500 dark:text-gray-400">
                                                  ${plan.price}/month
                                                </span>
                                              </div>
                                              {plan.contentAccess && (
                                                <div className="flex flex-wrap gap-1 mt-1">
                                                  {plan.contentAccess.regularContent && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
                                                      Regular
                                                    </span>
                                                  )}
                                                  {plan.contentAccess.premiumVideos && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                                      Premium
                                                    </span>
                                                  )}
                                                  {plan.contentAccess.vrContent && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300">
                                                      VR
                                                    </span>
                                                  )}
                                                  {plan.contentAccess.threeSixtyContent && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300">
                                                      360°
                                                    </span>
                                                  )}
                                                  {plan.contentAccess.liveRooms && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300">
                                                      Live
                                                    </span>
                                                  )}
                                                  {plan.contentAccess.interactiveModels && (
                                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300">
                                                      Interactive
                                                    </span>
                                                  )}
                                                </div>
                                              )}
                                            </div>
                                          </div>
                                        </label>
                                    ))}
                                  </div>
                                  {subscriptionPlans.length === 0 && (
                                    <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                      No subscription plans available. Create plans in your profile settings.
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4 flex items-center justify-between pt-4">
                    <div className="flex space-x-4">
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                      >
                        <PhotoIcon className="h-5 w-5 mr-1" />
                        <span className="text-sm">Photo/Video</span>
                      </button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept="image/*,video/*"
                        onChange={handleMediaChange}
                        multiple
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <button
                        type="button"
                        onClick={() => setShowUploadModal(false)}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isUploading || (!content.trim() && mediaFiles.length === 0)}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isUploading ? 'Posting...' : 'Post'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Thumbnail Editor Modal */}
      {showThumbnailEditor && thumbnailSrc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg max-w-4xl w-full">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Edit Thumbnail</h3>
              <button
                onClick={() => setShowThumbnailEditor(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <div className="relative">
                  {/* @ts-ignore - ReactCrop types are not properly exported */}
                  <ReactCrop
                    crop={crop}
                    onChange={(c: PixelCrop) => setCrop(c)}
                    aspect={thumbnailOptions.aspectRatio || undefined}
                  >
                    <img
                      ref={imageRef}
                      src={thumbnailSrc}
                      alt="Thumbnail preview"
                      style={{
                        filter: `
                          brightness(${thumbnailOptions.brightness}%)
                          contrast(${thumbnailOptions.contrast}%)
                          blur(${thumbnailOptions.blur}px)
                          ${thumbnailOptions.filter !== 'none' ? thumbnailOptions.filter : ''}
                        `
                      }}
                    />
                  </ReactCrop>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <ArrowsPointingInIcon className="h-4 w-4 inline mr-1" />
                    Aspect Ratio
                  </label>
                  <select
                    value={thumbnailOptions.aspectRatio}
                    onChange={(e) => setThumbnailOptions(prev => ({
                      ...prev,
                      aspectRatio: parseFloat(e.target.value)
                    }))}
                    className="w-full rounded-md border-gray-300 dark:border-gray-600"
                  >
                    <option value={1}>Square (1:1)</option>
                    <option value={16/9}>Landscape (16:9)</option>
                    <option value={4/5}>Portrait (4:5)</option>
                    <option value={0}>Free</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">
                    <SwatchIcon className="h-4 w-4 inline mr-1" />
                    Filter
                  </label>
                  <select
                    value={thumbnailOptions.filter}
                    onChange={(e) => setThumbnailOptions(prev => ({
                      ...prev,
                      filter: e.target.value
                    }))}
                    className="w-full rounded-md border-gray-300 dark:border-gray-600"
                  >
                    <option value="none">None</option>
                    <option value="grayscale(100%)">Grayscale</option>
                    <option value="sepia(100%)">Sepia</option>
                    <option value="invert(100%)">Invert</option>
                    <option value="hue-rotate(90deg)">Cool</option>
                    <option value="hue-rotate(-90deg)">Warm</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Brightness</label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={thumbnailOptions.brightness}
                    onChange={(e) => setThumbnailOptions(prev => ({
                      ...prev,
                      brightness: parseInt(e.target.value)
                    }))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Contrast</label>
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={thumbnailOptions.contrast}
                    onChange={(e) => setThumbnailOptions(prev => ({
                      ...prev,
                      contrast: parseInt(e.target.value)
                    }))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Blur</label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={thumbnailOptions.blur}
                    onChange={(e) => setThumbnailOptions(prev => ({
                      ...prev,
                      blur: parseFloat(e.target.value)
                    }))}
                    className="w-full"
                  />
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={applyThumbnailEdits}
                    className="flex-1 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                  >
                    Apply
                  </button>
                  <button
                    onClick={() => setShowThumbnailEditor(false)}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CreatePostForm; 