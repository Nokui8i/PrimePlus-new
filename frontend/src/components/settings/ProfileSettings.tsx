import React, { useState, useEffect } from 'react';
import { useAuth } from '@/components/providers/AuthProvider';
import { userService } from '@/services/userService';
import ImageUpload from '@/components/common/ImageUpload';

interface ProfileData {
  displayName: string;
  bio: string;
  location: string;
  websiteUrl: string;
  amazonWishlist: string;
  profileImage: string;
  coverImage: string;
}

const ProfileSettings = () => {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState<ProfileData>({
    displayName: user?.displayName || '',
    bio: user?.bio || '',
    location: user?.location || '',
    websiteUrl: user?.websiteUrl || '',
    amazonWishlist: user?.amazonWishlist || '',
    profileImage: user?.profileImage || '',
    coverImage: user?.coverImage || ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'success' | 'error' | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveStatus(null);

    try {
      await userService.updateProfile(profileData);
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(null), 3000);
    } catch (error) {
      setSaveStatus('error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 space-y-6">
      <div className="space-y-6">
        {/* Profile & Cover Images */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Profile Image
            </label>
            <ImageUpload
              currentImage={profileData.profileImage}
              onImageSelected={(url) => setProfileData(prev => ({ ...prev, profileImage: url }))}
              aspectRatio="1:1"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
              Cover Image
            </label>
            <ImageUpload
              currentImage={profileData.coverImage}
              onImageSelected={(url) => setProfileData(prev => ({ ...prev, coverImage: url }))}
              aspectRatio="16:9"
            />
          </div>
        </div>

        {/* Display Name */}
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Display Name
          </label>
          <input
            type="text"
            id="displayName"
            name="displayName"
            value={profileData.displayName}
            onChange={handleChange}
            maxLength={50}
            className="block w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-900 focus:border-primary-500 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
          />
          <p className="mt-1 text-sm text-neutral-500">
            {profileData.displayName.length}/50
          </p>
        </div>

        {/* Bio */}
        <div>
          <label htmlFor="bio" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Bio
          </label>
          <textarea
            id="bio"
            name="bio"
            value={profileData.bio}
            onChange={handleChange}
            maxLength={1000}
            rows={4}
            className="block w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-900 focus:border-primary-500 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
          />
          <p className="mt-1 text-sm text-neutral-500">
            {profileData.bio.length}/1000
          </p>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={profileData.location}
            onChange={handleChange}
            maxLength={100}
            className="block w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-900 focus:border-primary-500 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
          />
        </div>

        {/* Website URL */}
        <div>
          <label htmlFor="websiteUrl" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Website URL
          </label>
          <input
            type="url"
            id="websiteUrl"
            name="websiteUrl"
            value={profileData.websiteUrl}
            onChange={handleChange}
            className="block w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-900 focus:border-primary-500 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
            placeholder="https://example.com"
          />
        </div>

        {/* Amazon Wishlist */}
        <div>
          <label htmlFor="amazonWishlist" className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2">
            Amazon Wishlist
          </label>
          <input
            type="url"
            id="amazonWishlist"
            name="amazonWishlist"
            value={profileData.amazonWishlist}
            onChange={handleChange}
            className="block w-full rounded-lg border border-neutral-300 bg-white px-4 py-2 text-neutral-900 focus:border-primary-500 focus:ring-primary-500 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white"
            placeholder="https://amazon.com/wishlist/..."
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end space-x-4 pt-6 border-t border-neutral-200 dark:border-neutral-700">
        {saveStatus === 'success' && (
          <span className="text-green-600">Profile saved successfully!</span>
        )}
        {saveStatus === 'error' && (
          <span className="text-red-600">Failed to save profile</span>
        )}
        <button
          type="submit"
          disabled={isSaving}
          className={`px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 ${
            isSaving ? 'cursor-not-allowed' : ''
          }`}
        >
          {isSaving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );
};

export default ProfileSettings; 