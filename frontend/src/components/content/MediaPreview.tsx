import React from 'react';

interface MediaFile {
  id?: string;
  name: string;
  type: string;
  size: number;
  thumbnail?: string;
  preview?: string;
  url?: string;
}

interface MediaPreviewProps {
  file: MediaFile;
  onRemove?: () => void;
  showRemove?: boolean;
}

const MediaPreview: React.FC<MediaPreviewProps> = ({ 
  file, 
  onRemove,
  showRemove = true
}) => {
  const isImage = file.type.startsWith('image/');
  const isVideo = file.type.startsWith('video/');
  const isAudio = file.type.startsWith('audio/');
  
  const previewSource = file.thumbnail || file.preview || '';
  
  return (
    <div className="relative rounded-lg overflow-hidden bg-gray-100 border border-gray-200">
      {isImage && previewSource ? (
        <img 
          src={previewSource} 
          alt={file.name} 
          className="w-full h-full object-cover"
        />
      ) : isVideo ? (
        <div className="aspect-w-16 aspect-h-9 bg-black">
          {previewSource ? (
            <div className="relative">
              <img 
                src={previewSource} 
                alt={file.name} 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black bg-opacity-50 rounded-full p-3">
                  <svg className="h-8 w-8 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      ) : isAudio ? (
        <div className="p-4 flex items-center justify-center h-24">
          <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
          </svg>
        </div>
      ) : (
        <div className="p-4 flex items-center justify-center h-24">
          <svg className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
      )}
      
      <div className="p-2 bg-white border-t border-gray-200">
        <div className="truncate text-sm font-medium text-gray-900">{file.name}</div>
        <div className="text-xs text-gray-500">
          {Math.round(file.size / 1024)} KB
        </div>
      </div>
      
      {showRemove && onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-2 right-2 bg-gray-900 bg-opacity-50 rounded-full p-1 hover:bg-opacity-75 focus:outline-none"
        >
          <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default MediaPreview;