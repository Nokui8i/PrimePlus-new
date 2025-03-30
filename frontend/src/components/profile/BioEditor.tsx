import React, { useState, useEffect } from 'react';
import { PencilIcon, CheckIcon, XMarkIcon, FaceSmileIcon } from '@heroicons/react/24/outline';
import data from '@emoji-mart/data';
import Picker from '@emoji-mart/react';

interface BioEditorProps {
  initialBio: string;
  maxLength?: number;
  onSave: (bio: string) => Promise<void>;
  isOwnProfile: boolean;
}

interface EmojiData {
  native: string;
}

const BioEditor: React.FC<BioEditorProps> = ({
  initialBio = '',
  maxLength = 500,
  onSave,
  isOwnProfile
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(initialBio);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setBio(initialBio);
  }, [initialBio]);

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setError(null);
      await onSave(bio);
      setIsEditing(false);
    } catch (err) {
      setError('Failed to save bio. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setBio(initialBio);
    setIsEditing(false);
    setError(null);
  };

  const addEmoji = (emoji: EmojiData) => {
    setBio(prev => prev + emoji.native);
    setShowEmojiPicker(false);
  };

  if (!isEditing) {
    return (
      <div 
        onClick={() => isOwnProfile && setIsEditing(true)}
        className="relative border border-neutral-200 dark:border-neutral-700 rounded-lg p-3 cursor-text hover:border-primary-500 transition-colors"
      >
        <p className="text-neutral-800 dark:text-neutral-200 leading-relaxed min-h-[60px]">
          {bio || 'Click to add bio'}
        </p>
        {isOwnProfile && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className="absolute top-2 right-2 p-2 text-primary-500 hover:text-primary-600 bg-white dark:bg-neutral-800 rounded-full shadow-sm border border-neutral-200 dark:border-neutral-700"
          >
            <PencilIcon className="w-4 h-4" />
          </button>
        )}
        <div className="mt-2 flex items-center justify-between text-xs text-neutral-500">
          <span>Click anywhere to edit</span>
          <span>{bio.length}/{maxLength} characters</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 border border-primary-500 rounded-lg p-3">
      <div className="relative">
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          maxLength={maxLength}
          rows={4}
          className="w-full resize-none bg-white dark:bg-neutral-800 p-2 text-neutral-800 dark:text-neutral-200 focus:outline-none leading-relaxed rounded border border-neutral-200 dark:border-neutral-700 focus:border-primary-500"
          placeholder="Write something about yourself..."
        />
        <div className="absolute bottom-2 right-2 flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="p-1.5 text-neutral-400 hover:text-neutral-600 rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            <FaceSmileIcon className="w-5 h-5" />
          </button>
        </div>
        {showEmojiPicker && (
          <div className="absolute bottom-12 right-0 z-10">
            <Picker
              data={data}
              onEmojiSelect={addEmoji}
              theme="auto"
            />
          </div>
        )}
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="text-neutral-500">
          {bio.length}/{maxLength} characters
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="px-3 py-1.5 text-neutral-600 hover:text-neutral-800 dark:text-neutral-400 dark:hover:text-neutral-200 bg-neutral-100 dark:bg-neutral-700 rounded"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving || bio === initialBio}
            className={`px-4 py-1.5 rounded font-medium ${
              isSaving || bio === initialBio
                ? 'bg-primary-400 cursor-not-allowed text-white'
                : 'bg-primary-500 hover:bg-primary-600 text-white'
            }`}
          >
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-sm text-red-500 bg-red-50 dark:bg-red-900/20 p-2 rounded">
          {error}
        </div>
      )}
    </div>
  );
};

export default BioEditor; 