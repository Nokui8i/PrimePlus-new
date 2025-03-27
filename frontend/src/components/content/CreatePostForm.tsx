import React, { useState, useRef, useCallback } from 'react';
import { useUser } from '../../hooks/useUser';
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
  SwatchIcon
} from '@heroicons/react/24/outline';
import VRViewer from '@/components/VRViewer';

interface CreatePostFormProps {
  onPostCreated?: () => void;
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
}

interface VRViewerProps {
  mediaUrl: string;
  contentType: 'model' | '360-video' | '360-image';
  title?: string;
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

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onPostCreated }) => {
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

  const handleMediaChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    
    const newMediaFiles = await Promise.all(files.map(async file => {
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
        } : undefined
      };

      return mediaFile;
    }));

    const validFiles = newMediaFiles.filter((file): file is MediaFile => file !== null);
    setMediaFiles(prev => [...prev, ...validFiles]);
    setShowMediaOptions(true);

    if (validFiles.some(file => ['vr', '3d-model', '360-photo', '360-video'].includes(file.type))) {
      setSelectedMediaIndex(mediaFiles.length);
      setShowVROptions(true);
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
      return;
    }
    
    try {
      setIsUploading(true);
      
      const formData = new FormData();
      formData.append('content', content);
      
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
      file: new File([], 'live-room'), // Placeholder file
      preview: '/images/live-room-preview.jpg', // Add a default preview image
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
      }
    };

    setMediaFiles(prev => [...prev, mediaFile]);
    setSelectedMediaIndex(mediaFiles.length);
    setShowVROptions(true);
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
      <div className="p-4">
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name || 'User'} 
                className="h-10 w-10 rounded-full" 
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <div className="min-w-0 flex-1">
            <form onSubmit={handleSubmit}>
              <div>
                <textarea
                  rows={3}
                  name="content"
                  id="content"
                  className="shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-md"
                  placeholder="Share something with your followers..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={isUploading}
                />
              </div>
              
              {/* Media Preview with VR Options */}
              {mediaFiles.length > 0 && (
                <div className="mt-3">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    {mediaFiles.map((media, index) => (
                      <div 
                        key={index} 
                        className="relative rounded-lg overflow-hidden aspect-square cursor-pointer"
                        onClick={() => {
                          setSelectedMediaIndex(index);
                          setShowVROptions(media.type === 'vr');
                        }}
                      >
                        <button
                          type="button"
                          className="absolute top-2 right-2 z-10 p-1 bg-black/70 hover:bg-red-600/80 rounded-full text-white"
                          onClick={(e) => {
                            e.stopPropagation();
                            const newFiles = [...mediaFiles];
                            URL.revokeObjectURL(newFiles[index].preview);
                            newFiles.splice(index, 1);
                            setMediaFiles(newFiles);
                          }}
                        >
                          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>

                        {media.type === 'image' ? (
                          <img 
                            src={media.preview} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        ) : media.type === 'video' ? (
                          <div className="relative w-full h-full">
                            <video
                              src={media.preview}
                              className="w-full h-full object-cover"
                              controls
                            />
                            {media.thumbnail && (
                              <img 
                                src={URL.createObjectURL(media.thumbnail)}
                                alt="Video thumbnail"
                                className="absolute inset-0 w-full h-full object-cover"
                                style={{ display: 'none' }}
                              />
                            )}
                          </div>
                        ) : (
                          <div className="relative w-full h-full">
                            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700">
                              <CubeTransparentIcon className="w-12 h-12 text-gray-500" />
                              <span className="mt-2 text-sm text-gray-600 dark:text-gray-300">
                                VR Content
                              </span>
                              {!media.thumbnail && (
                                <button
                                  type="button"
                                  className="mt-2 px-3 py-1.5 bg-gray-800/80 hover:bg-gray-900/80 text-white rounded-lg flex items-center"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleThumbnailUpload(index);
                                  }}
                                >
                                  <CameraIcon className="h-4 w-4 mr-1.5" />
                                  Add Thumbnail
                                </button>
                              )}
                  </div>
                            {media.thumbnail && (
                              <>
                                <img 
                                  src={URL.createObjectURL(media.thumbnail)}
                                  alt="VR thumbnail"
                                  className="absolute inset-0 w-full h-full object-cover"
                                />
                                <div className="absolute bottom-2 right-2 z-10 flex space-x-2">
                                  <button
                                    type="button"
                                    className="p-2 bg-black/70 hover:bg-gray-800/80 rounded-full text-white"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleThumbnailUpload(index);
                                    }}
                                  >
                                    <CameraIcon className="h-4 w-4" />
                                  </button>
                                  <button
                                    type="button"
                                    className="p-2 bg-black/70 hover:bg-gray-800/80 rounded-full text-white"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openThumbnailEditor(index);
                                    }}
                                    title="Edit thumbnail"
                                  >
                                    <PhotoIcon className="h-4 w-4" />
                                  </button>
                                  {media.thumbnail && (
                  <button
                    type="button"
                                      className="p-2 bg-red-500/70 hover:bg-red-600/80 rounded-full text-white"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setMediaFiles(prev => {
                                          const updated = [...prev];
                                          if (updated[index]) {
                                            updated[index] = {
                                              ...updated[index],
                                              thumbnail: undefined,
                                              thumbnailOptions: undefined
                                            };
                                          }
                                          return updated;
                                        });
                                      }}
                                      title="Remove thumbnail"
                                    >
                                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                                  )}
                                </div>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* VR Options Panel */}
                  {showVROptions && selectedMediaIndex !== null && ['vr', '3d-model', '360-photo', '360-video', 'live-room'].includes(mediaFiles[selectedMediaIndex].type) && (
                    <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h3 className="text-lg font-medium mb-4">
                        {mediaFiles[selectedMediaIndex].type === 'live-room' ? 'Live Room Settings' :
                         mediaFiles[selectedMediaIndex].type === '360-photo' ? '360° Photo Settings' :
                         mediaFiles[selectedMediaIndex].type === '360-video' ? '360° Video Settings' :
                         mediaFiles[selectedMediaIndex].type === '3d-model' ? '3D Model Settings' :
                         'VR Content Settings'}
                      </h3>

                      {/* Live Room Settings */}
                      {mediaFiles[selectedMediaIndex].type === 'live-room' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Room Name</label>
                            <input
                              type="text"
                              value={mediaFiles[selectedMediaIndex].contentMetadata?.roomName || ''}
                              onChange={(e) => {
                                setMediaFiles(prev => {
                                  const updated = [...prev];
                                  if (updated[selectedMediaIndex]?.contentMetadata) {
                                    updated[selectedMediaIndex].contentMetadata!.roomName = e.target.value;
                                  }
                                  return updated;
                                });
                              }}
                              className="w-full px-3 py-2 border rounded-md"
                              placeholder="Enter room name"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium mb-2">Max Participants</label>
                            <input
                              type="number"
                              min="2"
                              max="50"
                              value={mediaFiles[selectedMediaIndex].contentMetadata?.maxParticipants || 10}
                              onChange={(e) => {
                                setMediaFiles(prev => {
                                  const updated = [...prev];
                                  if (updated[selectedMediaIndex]?.contentMetadata) {
                                    updated[selectedMediaIndex].contentMetadata!.maxParticipants = parseInt(e.target.value);
                                  }
                                  return updated;
                                });
                              }}
                              className="w-full px-3 py-2 border rounded-md"
                            />
                          </div>
                          <div className="col-span-2">
                            <label className="block text-sm font-medium mb-2">Room Description</label>
                            <textarea
                              value={mediaFiles[selectedMediaIndex].contentMetadata?.roomDescription || ''}
                              onChange={(e) => {
                                setMediaFiles(prev => {
                                  const updated = [...prev];
                                  if (updated[selectedMediaIndex]?.contentMetadata) {
                                    updated[selectedMediaIndex].contentMetadata!.roomDescription = e.target.value;
                                  }
                                  return updated;
                                });
                              }}
                              className="w-full px-3 py-2 border rounded-md"
                              rows={3}
                              placeholder="Describe your room..."
                            />
                          </div>
                          <div className="col-span-2 space-y-2">
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={mediaFiles[selectedMediaIndex].contentMetadata?.isPrivate || false}
                                onChange={(e) => {
                                  setMediaFiles(prev => {
                                    const updated = [...prev];
                                    if (updated[selectedMediaIndex]?.contentMetadata) {
                                      updated[selectedMediaIndex].contentMetadata!.isPrivate = e.target.checked;
                                    }
                                    return updated;
                                  });
                                }}
                                className="mr-2"
                              />
                              Private Room
                            </label>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={mediaFiles[selectedMediaIndex].contentMetadata?.allowChat || false}
                                onChange={(e) => {
                                  setMediaFiles(prev => {
                                    const updated = [...prev];
                                    if (updated[selectedMediaIndex]?.contentMetadata) {
                                      updated[selectedMediaIndex].contentMetadata!.allowChat = e.target.checked;
                                    }
                                    return updated;
                                  });
                                }}
                                className="mr-2"
                              />
                              Enable Chat
                            </label>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={mediaFiles[selectedMediaIndex].contentMetadata?.allowVoice || false}
                                onChange={(e) => {
                                  setMediaFiles(prev => {
                                    const updated = [...prev];
                                    if (updated[selectedMediaIndex]?.contentMetadata) {
                                      updated[selectedMediaIndex].contentMetadata!.allowVoice = e.target.checked;
                                    }
                                    return updated;
                                  });
                                }}
                                className="mr-2"
                              />
                              Enable Voice
                            </label>
                            <label className="flex items-center">
                              <input
                                type="checkbox"
                                checked={mediaFiles[selectedMediaIndex].contentMetadata?.allowVideo || false}
                                onChange={(e) => {
                                  setMediaFiles(prev => {
                                    const updated = [...prev];
                                    if (updated[selectedMediaIndex]?.contentMetadata) {
                                      updated[selectedMediaIndex].contentMetadata!.allowVideo = e.target.checked;
                                    }
                                    return updated;
                                  });
                                }}
                                className="mr-2"
                              />
                              Enable Video
                            </label>
                          </div>
                        </div>
                      )}

                      {/* VR/3D Model Settings */}
                      {(mediaFiles[selectedMediaIndex].type === 'vr' || mediaFiles[selectedMediaIndex].type === '3d-model') && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {/* Camera Position */}
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              <ViewfinderCircleIcon className="h-4 w-4 inline mr-1" />
                              Camera Position
                            </label>
                            <div className="grid grid-cols-3 gap-2">
                              {['X', 'Y', 'Z'].map((axis) => (
                                <div key={axis}>
                                  <label className="block text-xs mb-1">{axis}</label>
                                  <input
                                    type="number"
                                    value={mediaFiles[selectedMediaIndex].vrOptions?.initialPosition?.[axis.toLowerCase() as 'x' | 'y' | 'z'] || 0}
                                    onChange={(e) => handleVROptionsChange(selectedMediaIndex, {
                                      ...mediaFiles[selectedMediaIndex].vrOptions,
                                      initialPosition: {
                                        ...mediaFiles[selectedMediaIndex].vrOptions?.initialPosition,
                                        [axis.toLowerCase()]: parseFloat(e.target.value)
                                      }
                                    })}
                                    className="w-full px-2 py-1 text-sm border rounded"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Camera Controls */}
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              <AdjustmentsHorizontalIcon className="h-4 w-4 inline mr-1" />
                              Camera Controls
                            </label>
                            <div className="space-y-2">
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={mediaFiles[selectedMediaIndex].vrOptions?.autoRotate}
                                  onChange={(e) => handleVROptionsChange(selectedMediaIndex, {
                                    ...mediaFiles[selectedMediaIndex].vrOptions,
                                    autoRotate: e.target.checked
                                  })}
                                  className="mr-2"
                                />
                                Auto-rotate
                              </label>
                              {mediaFiles[selectedMediaIndex].vrOptions?.autoRotate && (
                                <input
                                  type="range"
                                  min="0.1"
                                  max="5"
                                  step="0.1"
                                  value={mediaFiles[selectedMediaIndex].vrOptions?.autoRotateSpeed || 1}
                                  onChange={(e) => handleVROptionsChange(selectedMediaIndex, {
                                    ...mediaFiles[selectedMediaIndex].vrOptions,
                                    autoRotateSpeed: parseFloat(e.target.value)
                                  })}
                                  className="w-full"
                                />
                              )}
                            </div>
                          </div>

                          {/* Animation Settings */}
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              <CubeIcon className="h-4 w-4 inline mr-1" />
                              Animation
                            </label>
                            <div className="space-y-2">
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={mediaFiles[selectedMediaIndex].vrOptions?.animation?.enabled}
                                  onChange={(e) => handleVROptionsChange(selectedMediaIndex, {
                                    ...mediaFiles[selectedMediaIndex].vrOptions,
                                    animation: {
                                      ...mediaFiles[selectedMediaIndex].vrOptions?.animation,
                                      enabled: e.target.checked
                                    }
                                  })}
                                  className="mr-2"
                                />
                                Enable Animation
                              </label>
                              {mediaFiles[selectedMediaIndex].vrOptions?.animation?.enabled && (
                                <div className="space-y-2">
                                  <label className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={mediaFiles[selectedMediaIndex].vrOptions?.animation?.autoPlay}
                                      onChange={(e) => handleVROptionsChange(selectedMediaIndex, {
                                        ...mediaFiles[selectedMediaIndex].vrOptions,
                                        animation: {
                                          ...mediaFiles[selectedMediaIndex].vrOptions?.animation,
                                          autoPlay: e.target.checked
                                        }
                                      })}
                                      className="mr-2"
                                    />
                                    Auto-play
                                  </label>
                                  <label className="flex items-center">
                                    <input
                                      type="checkbox"
                                      checked={mediaFiles[selectedMediaIndex].vrOptions?.animation?.loop}
                                      onChange={(e) => handleVROptionsChange(selectedMediaIndex, {
                                        ...mediaFiles[selectedMediaIndex].vrOptions,
                                        animation: {
                                          ...mediaFiles[selectedMediaIndex].vrOptions?.animation,
                                          loop: e.target.checked
                                        }
                                      })}
                                      className="mr-2"
                                    />
                                    Loop
                                  </label>
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Zoom Settings */}
                          <div>
                            <label className="block text-sm font-medium mb-2">
                              <ViewfinderCircleIcon className="h-4 w-4 inline mr-1" />
                              Zoom Controls
                            </label>
                            <div className="space-y-2">
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={mediaFiles[selectedMediaIndex].vrOptions?.enableZoom}
                                  onChange={(e) => handleVROptionsChange(selectedMediaIndex, {
                                    ...mediaFiles[selectedMediaIndex].vrOptions,
                                    enableZoom: e.target.checked
                                  })}
                                  className="mr-2"
                                />
                                Enable Zoom
                              </label>
                              {mediaFiles[selectedMediaIndex].vrOptions?.enableZoom && (
                                <div className="grid grid-cols-2 gap-2">
                                  <div>
                                    <label className="block text-xs mb-1">Min Distance</label>
                                    <input
                                      type="number"
                                      value={mediaFiles[selectedMediaIndex].vrOptions?.minDistance || 2}
                                      onChange={(e) => handleVROptionsChange(selectedMediaIndex, {
                                        ...mediaFiles[selectedMediaIndex].vrOptions,
                                        minDistance: parseFloat(e.target.value)
                                      })}
                                      className="w-full px-2 py-1 text-sm border rounded"
                                    />
                                  </div>
                                  <div>
                                    <label className="block text-xs mb-1">Max Distance</label>
                                    <input
                                      type="number"
                                      value={mediaFiles[selectedMediaIndex].vrOptions?.maxDistance || 10}
                                      onChange={(e) => handleVROptionsChange(selectedMediaIndex, {
                                        ...mediaFiles[selectedMediaIndex].vrOptions,
                                        maxDistance: parseFloat(e.target.value)
                                      })}
                                      className="w-full px-2 py-1 text-sm border rounded"
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                </div>
              )}
              
                      {/* 360 Photo/Video Settings */}
                      {(mediaFiles[selectedMediaIndex].type === '360-photo' || mediaFiles[selectedMediaIndex].type === '360-video') && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium mb-2">Initial View Direction</label>
                            <div className="grid grid-cols-2 gap-2">
                              <div>
                                <label className="block text-xs mb-1">Yaw (°)</label>
                                <input
                                  type="number"
                                  min="-180"
                                  max="180"
                                  value={mediaFiles[selectedMediaIndex].vrOptions?.initialRotation.y || 0}
                                  onChange={(e) => handleVROptionsChange(selectedMediaIndex, {
                                    initialRotation: {
                                      ...mediaFiles[selectedMediaIndex].vrOptions?.initialRotation,
                                      y: parseFloat(e.target.value)
                                    }
                                  })}
                                  className="w-full px-2 py-1 text-sm border rounded"
                                />
                              </div>
                              <div>
                                <label className="block text-xs mb-1">Pitch (°)</label>
                                <input
                                  type="number"
                                  min="-90"
                                  max="90"
                                  value={mediaFiles[selectedMediaIndex].vrOptions?.initialRotation.x || 0}
                                  onChange={(e) => handleVROptionsChange(selectedMediaIndex, {
                                    initialRotation: {
                                      ...mediaFiles[selectedMediaIndex].vrOptions?.initialRotation,
                                      x: parseFloat(e.target.value)
                                    }
                                  })}
                                  className="w-full px-2 py-1 text-sm border rounded"
                                />
                              </div>
                            </div>
                          </div>

                          <div>
                            <label className="block text-sm font-medium mb-2">View Controls</label>
                            <div className="space-y-2">
                              <label className="flex items-center">
                                <input
                                  type="checkbox"
                                  checked={mediaFiles[selectedMediaIndex].vrOptions?.enableZoom}
                                  onChange={(e) => handleVROptionsChange(selectedMediaIndex, {
                                    enableZoom: e.target.checked
                                  })}
                                  className="mr-2"
                                />
                                Enable Zoom
                              </label>
                              <label className="flex items-center">
                  <input
                    type="checkbox"
                                  checked={mediaFiles[selectedMediaIndex].vrOptions?.autoRotate}
                                  onChange={(e) => handleVROptionsChange(selectedMediaIndex, {
                                    autoRotate: e.target.checked
                                  })}
                                  className="mr-2"
                                />
                                Auto-rotate
                  </label>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Preview */}
                      <div className="mt-4 aspect-video rounded-lg overflow-hidden bg-black">
                        <VRViewer
                          mediaUrl={getVRFileUrl(mediaFiles[selectedMediaIndex].file)}
                          contentType={
                            mediaFiles[selectedMediaIndex].type === '360-photo' ? '360-image' :
                            mediaFiles[selectedMediaIndex].type === '360-video' ? '360-video' :
                            'model'
                          }
                          title={mediaFiles[selectedMediaIndex].file.name}
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              {/* Upload Buttons */}
              <div className="mt-4 flex flex-wrap items-center gap-4">
                <div className="flex items-center space-x-4">
                  {/* Photos/Videos */}
                  <label className="cursor-pointer flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                    <VideoCameraIcon className="h-5 w-5 mr-1" />
                      <span className="text-sm">Media</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      className="sr-only"
                      accept="image/*,video/*,.glb,.gltf,.fbx,.obj,.usdz"
                      onChange={handleMediaChange}
                      multiple
                    />
                  </label>
                  
                  {/* Live Room */}
                  <button
                    type="button"
                    onClick={createLiveRoom}
                    className="flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    <VideoCameraIcon className="h-5 w-5 mr-1" />
                    <span className="text-sm">Live Room</span>
                  </button>
                </div>
                
                {/* Hidden thumbnail input */}
                <input
                  ref={thumbnailInputRef}
                  type="file"
                  className="hidden"
                  accept="image/*"
                />
              </div>

              {/* Premium Content Options */}
              {mediaFiles.length > 0 && (
                <div className="flex items-center space-x-4">
                  <label className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={isPremiumContent}
                      onChange={(e) => setIsPremiumContent(e.target.checked)}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">Premium Content</span>
                  </label>
                  
                  {isPremiumContent && (
                    <div className="flex items-center space-x-2">
                      <span className="text-sm text-gray-700 dark:text-gray-300">$</span>
                      <input
                        type="number"
                        min="0.99"
                        step="0.01"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="Price"
                        className="w-20 rounded-md border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                      />
                    </div>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <div className="mt-4 flex justify-end">
                <button
                  type="submit"
                  disabled={isUploading || (!content.trim() && mediaFiles.length === 0)}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? 'Uploading...' : 'Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

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
    </div>
  );
};

export default CreatePostForm; 