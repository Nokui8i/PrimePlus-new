import React, { useState, useRef } from 'react';
import { useCreator } from '@/context/CreatorContext';
import Image from 'next/image';

interface ImageUploadProps {
  type: 'profile' | 'cover';
  className?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ type, className }) => {
  const { creator, uploadProfileImage, uploadCoverImage } = useCreator();
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const currentImage = type === 'profile' 
    ? creator?.profileImage 
    : creator?.coverImage;

  // Handle file selection
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Upload the file
    setUploading(true);
    try {
      if (type === 'profile') {
        await uploadProfileImage(file);
      } else {
        await uploadCoverImage(file);
      }
    } catch (error) {
      console.error(`Error uploading ${type} image:`, error);
    } finally {
      setUploading(false);
    }
  };

  // Trigger file input click
  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className={`relative ${className}`}>
      {/* Current image or preview */}
      <div 
        className={`relative overflow-hidden ${
          type === 'profile' 
            ? 'w-32 h-32 rounded-full mx-auto' 
            : 'w-full h-48 rounded-lg'
        }`}
      >
        {(preview || currentImage) ? (
          <Image 
            src={preview || currentImage || '/placeholder-image.jpg'} 
            alt={`${type} image`} 
            layout="fill"
            objectFit="cover"
            className={type === 'profile' ? 'rounded-full' : 'rounded-lg'}
          />
        ) : (
          <div 
            className={`
              bg-gray-200 flex items-center justify-center text-gray-400
              ${type === 'profile' ? 'w-32 h-32 rounded-full' : 'w-full h-48 rounded-lg'}
            `}
          >
            {type === 'profile' ? 'Profile Image' : 'Cover Image'}
          </div>
        )}
      </div>

      {/* Upload button */}
      <button
        type="button"
        onClick={handleButtonClick}
        disabled={uploading}
        className={`
          mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700
          focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50
          ${type === 'profile' ? 'w-full' : 'absolute bottom-2 right-2'}
        `}
      >
        {uploading 
          ? 'Uploading...' 
          : `Change ${type === 'profile' ? 'Profile' : 'Cover'} Image`
        }
      </button>

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload;