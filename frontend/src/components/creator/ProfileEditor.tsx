import React, { useState, useEffect } from 'react';
import { useCreator } from '@/context/CreatorContext';
import ImageUpload from './ImageUpload';
import SocialLinksEditor from './SocialLinksEditor';
import { UpdateProfileData, SocialLinks } from '@/services/creatorService';

const ProfileEditor: React.FC = () => {
  const { creator, updateProfile, loading, error } = useCreator();
  const [formData, setFormData] = useState<UpdateProfileData>({
    fullName: '',
    displayName: '',
    bio: '',
    extendedBio: '',
    customUrl: '',
    location: '',
    tags: [],
    socialLinks: {}
  });
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'success' | 'error'>('idle');
  const [tagInput, setTagInput] = useState('');

  // Update form data when creator data changes
  useEffect(() => {
    if (creator) {
      setFormData({
        fullName: creator.fullName || '',
        displayName: creator.displayName || '',
        bio: creator.bio || '',
        extendedBio: creator.extendedBio || '',
        customUrl: creator.customUrl || '',
        location: creator.location || '',
        tags: creator.tags || [],
        socialLinks: creator.socialLinks || {}
      });
    }
  }, [creator]);

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Handle social links changes
  const handleSocialLinksChange = (socialLinks: SocialLinks) => {
    setFormData(prev => ({
      ...prev,
      socialLinks
    }));
  };

  // Handle tags
  const handleAddTag = () => {
    if (tagInput.trim() && formData.tags && formData.tags.length < 10) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  const handleRemoveTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== index)
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaveStatus('saving');
    
    try {
      const success = await updateProfile(formData);
      if (success) {
        setSaveStatus('success');
        setTimeout(() => setSaveStatus('idle'), 3000);
      } else {
        setSaveStatus('error');
      }
    } catch (err) {
      console.error('Error updating profile:', err);
      setSaveStatus('error');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold mb-6">Edit Your Profile</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column */}
          <div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Profile Image
              </label>
              <ImageUpload type="profile" />
            </div>
            
            <div className="mb-4">
              <label htmlFor="fullName" className="block text-gray-700 font-medium mb-2">
                Full Name
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                maxLength={100}
              />
            </div>
            
            <div className="mb-4">
              <label htmlFor="displayName" className="block text-gray-700 font-medium mb-2">
                Display Name
              </label>
              <input
                type="text"
                id="displayName"
                name="displayName"
                value={formData.displayName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                maxLength={50}
              />
              <p className="text-sm text-gray-500 mt-1">
                This is the name displayed on your profile
              </p>
            </div>
            
            <div className="mb-4">
              <label htmlFor="customUrl" className="block text-gray-700 font-medium mb-2">
                Custom URL
              </label>
              <div className="flex items-center">
                <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md">
                  primePlus.com/
                </span>
                <input
                  type="text"
                  id="customUrl"
                  name="customUrl"
                  value={formData.customUrl}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  pattern="^[a-zA-Z0-9-_]+$"
                  maxLength={50}
                />
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Only letters, numbers, hyphens, and underscores
              </p>
            </div>
            
            <div className="mb-4">
              <label htmlFor="location" className="block text-gray-700 font-medium mb-2">
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                maxLength={100}
              />
            </div>
          </div>
          
          {/* Right column */}
          <div>
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Cover Image
              </label>
              <ImageUpload type="cover" className="mb-4" />
            </div>
            
            <div className="mb-4">
              <label htmlFor="bio" className="block text-gray-700 font-medium mb-2">
                Short Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                maxLength={500}
              />
              <p className="text-sm text-gray-500 mt-1">
                Brief description for your profile ({formData.bio?.length || 0}/500)
              </p>
            </div>
            
            <div className="mb-4">
              <label htmlFor="extendedBio" className="block text-gray-700 font-medium mb-2">
                Extended Bio
              </label>
              <textarea
                id="extendedBio"
                name="extendedBio"
                value={formData.extendedBio}
                onChange={handleChange}
                rows={5}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                maxLength={5000}
              />
              <p className="text-sm text-gray-500 mt-1">
                Detailed information about you and your content ({formData.extendedBio?.length || 0}/5000)
              </p>
            </div>
            
            <div className="mb-4">
              <label className="block text-gray-700 font-medium mb-2">
                Tags (up to 10)
              </label>
              <div className="flex">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Add a tag"
                  maxLength={30}
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-r-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  disabled={(formData.tags?.length || 0) >= 10 || !tagInput.trim()}
                >
                  Add
                </button>
              </div>
              
              <div className="flex flex-wrap mt-2">
                {formData.tags?.map((tag, index) => (
                  <span 
                    key={index} 
                    className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full text-sm mr-2 mb-2 flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(index)}
                      className="ml-1 text-indigo-600 hover:text-indigo-800 focus:outline-none"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Social Links Section */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-4">Social Media Links</h3>
          <SocialLinksEditor 
            links={formData.socialLinks || {}} 
            onChange={handleSocialLinksChange} 
          />
        </div>
        
        {/* Submit Button */}
        <div className="mt-8 flex items-center">
          <button
            type="submit"
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
            disabled={loading || saveStatus === 'saving'}
          >
            {saveStatus === 'saving' ? 'Saving...' : 'Save Profile'}
          </button>
          
          {saveStatus === 'success' && (
            <span className="ml-4 text-green-600">Profile updated successfully!</span>
          )}
          
          {saveStatus === 'error' && (
            <span className="ml-4 text-red-600">Failed to update profile</span>
          )}
        </div>
      </form>
    </div>
  );
};

export default ProfileEditor;