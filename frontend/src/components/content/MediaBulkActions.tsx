import React, { useState } from 'react';
import UploadService from '@/services/uploadService';

interface MediaBulkActionsProps {
  selectedItems: string[];
  onActionComplete: () => void;
  onClearSelection: () => void;
}

const MediaBulkActions: React.FC<MediaBulkActionsProps> = ({
  selectedItems,
  onActionComplete,
  onClearSelection
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    
    setIsDeleting(true);
    setErrorMessage(null);
    
    try {
      await UploadService.batchDeleteMedia(selectedItems);
      onActionComplete();
      onClearSelection();
    } catch (error) {
      console.error('Error performing bulk delete:', error);
      setErrorMessage('Failed to delete some or all media items');
    } finally {
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  // Cancel confirmation
  const handleCancelDelete = () => {
    setConfirmDelete(false);
  };

  if (selectedItems.length === 0) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg border-t border-gray-200 p-3 z-10">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <span className="text-gray-700 font-medium">
            {selectedItems.length} item{selectedItems.length !== 1 ? 's' : ''} selected
          </span>
          <button
            type="button"
            onClick={onClearSelection}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            Clear selection
          </button>
        </div>
        
        <div className="flex items-center space-x-3">
          {errorMessage && (
            <p className="text-red-600 text-sm mr-3">{errorMessage}</p>
          )}
          
          {confirmDelete ? (
            <>
              <span className="text-red-600 text-sm mr-2">
                Are you sure? This cannot be undone.
              </span>
              <button
                type="button"
                onClick={handleCancelDelete}
                className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 text-sm hover:bg-gray-50"
                disabled={isDeleting}
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBulkDelete}
                className="px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700 flex items-center"
                disabled={isDeleting}
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Confirm Delete'
                )}
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={handleBulkDelete}
              className="px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700"
            >
              Delete Selected
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default MediaBulkActions;