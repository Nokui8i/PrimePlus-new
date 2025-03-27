import React, { useState, useCallback } from 'react';
import { CameraIcon } from '@heroicons/react/24/outline';
import Image from 'next/image';

interface ImageUploadProps {
  currentImage: string;
  onImageChange: (file: File) => void;
  aspectRatio?: 'square' | 'cover';
  className?: string;
  previewClassName?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  currentImage,
  onImageChange,
  aspectRatio = 'square',
  className = '',
  previewClassName = '',
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      onImageChange(imageFile);
    }
  }, [onImageChange]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImageChange(file);
    }
  }, [onImageChange]);

  return (
    <div 
      className={`relative ${className}`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div 
        className={`
          relative overflow-hidden
          ${aspectRatio === 'square' ? 'rounded-full' : 'rounded-lg'}
          ${aspectRatio === 'square' ? 'aspect-square' : 'aspect-[3/1]'}
          ${isDragging ? 'ring-2 ring-primary-500' : ''}
          ${previewClassName}
        `}
      >
        <Image
          src={currentImage}
          alt="Upload preview"
          fill
          className="object-cover"
        />
        {isDragging && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <p className="text-white text-lg font-medium">Drop image here</p>
          </div>
        )}
      </div>
      <label
        className="absolute bottom-4 right-4 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors cursor-pointer"
        htmlFor={`image-upload-${aspectRatio}`}
      >
        <CameraIcon className="w-5 h-5" />
      </label>
      <input
        id={`image-upload-${aspectRatio}`}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  );
};

export default ImageUpload; 