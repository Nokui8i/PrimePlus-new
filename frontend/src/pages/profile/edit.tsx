import React, { useState, useRef, ChangeEvent, useEffect } from 'react';
import { useRouter } from 'next/router';
import MainLayout from '@/components/layouts/MainLayout';
import { userService } from '@/services/userService';
import { useAuth } from '@/components/providers/AuthProvider';
import { 
  MAX_BIO_LENGTH,
  MAX_USERNAME_LENGTH,
  SUPPORTED_IMAGE_TYPES,
  MAX_IMAGE_SIZE,
  DEFAULT_AVATAR,
  DEFAULT_COVER
} from '@/config/constants';

interface ProfileData {
  displayName: string;
  bio: string;
  location: string;
  websiteUrl: string;
  amazonWishlist: string;
  profileImage: string;
  coverImage: string;
}

const ProfileEditPage = () => {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState<ProfileData>({
    displayName: '',
    bio: '',
    location: '',
    websiteUrl: '',
    amazonWishlist: '',
    profileImage: DEFAULT_AVATAR,
    coverImage: DEFAULT_COVER
  });

  const avatarFileInputRef = useRef<HTMLInputElement>(null);
  const coverFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      router.push('/login');
    }
  }, [isAuthenticated, loading, router]);

  useEffect(() => {
    if (user) {
      setFormData({
        displayName: user.fullName || '',
        bio: user.bio || '',
        location: user.location || '',
        websiteUrl: user.website || '',
        amazonWishlist: '',
        profileImage: user.avatar || DEFAULT_AVATAR,
        coverImage: DEFAULT_COVER
      });
    }
  }, [user]);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>, type: 'profileImage' | 'coverImage') => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!SUPPORTED_IMAGE_TYPES.includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, or GIF)');
      return;
    }

    // Validate file size
    if (file.size > MAX_IMAGE_SIZE) {
      setError('Image size should be less than 5MB');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('image', file);

      // For now, just show a preview
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result;
        if (result && typeof result === 'string') {
          setFormData(prev => ({
            ...prev,
            [type]: result
          }));
        }
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Failed to upload image. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Validate bio length
      if (formData.bio.length > MAX_BIO_LENGTH) {
        throw new Error(`Bio must be less than ${MAX_BIO_LENGTH} characters`);
      }

      await userService.updateProfile(formData);
      setSuccess(true);
      router.push('/profile');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (loading) {
    return (
      <MainLayout title="Edit Profile">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
        </div>
      </MainLayout>
    );
  }

  if (!isAuthenticated || !user) {
    return null; // Will redirect to login in useEffect
  }

  return (
    <MainLayout title="Edit Profile">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Profile</h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-4 bg-green-50 text-green-700 rounded-lg">
            Profile updated successfully!
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Cover Image */}
          <div className="relative">
            <div className="relative h-48 rounded-lg overflow-hidden bg-neutral-200">
              <img
                src={formData.coverImage}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => coverFileInputRef.current?.click()}
              className="absolute bottom-4 right-4 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <input
              type="file"
              ref={coverFileInputRef}
              onChange={(e) => handleImageUpload(e, 'coverImage')}
              accept={SUPPORTED_IMAGE_TYPES.join(',')}
              className="hidden"
            />
          </div>

          {/* Avatar */}
          <div className="relative -mt-16 ml-6">
            <div className="relative w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden">
              <img
                src={formData.profileImage}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <button
              type="button"
              onClick={() => avatarFileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-white rounded-full p-2 shadow-lg hover:bg-gray-100"
            >
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <input
              type="file"
              ref={avatarFileInputRef}
              onChange={(e) => handleImageUpload(e, 'profileImage')}
              accept={SUPPORTED_IMAGE_TYPES.join(',')}
              className="hidden"
            />
          </div>

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                Full Name
              </label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                required
              />
            </div>

            <div>
              <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
                maxLength={MAX_BIO_LENGTH}
              />
              <p className="mt-1 text-sm text-gray-500">
                {formData.bio.length}/{MAX_BIO_LENGTH} characters
              </p>
            </div>

            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/profile')}
              className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </MainLayout>
  );
};

export default ProfileEditPage; 