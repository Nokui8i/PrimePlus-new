'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layouts/MainLayout';
import { motion } from 'framer-motion';
import { CloudArrowUpIcon, CurrencyDollarIcon, TagIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import VRViewer from '@/components/VRViewer';

interface VRContentForm {
  title: string;
  description: string;
  type: 'model' | '360-video' | '360-image';
  tags: string[];
  isPremium: boolean;
  price: number;
  file: File | null;
  previewUrl: string;
}

export default function CreateVRContent() {
  const router = useRouter();
  const [form, setForm] = useState<VRContentForm>({
    title: '',
    description: '',
    type: 'model',
    tags: [],
    isPremium: false,
    price: 0,
    file: null,
    previewUrl: ''
  });
  const [isUploading, setIsUploading] = useState(false);
  const [currentTag, setCurrentTag] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm({
        ...form,
        file,
        previewUrl: URL.createObjectURL(file)
      });
    }
  };

  const handleTagAdd = () => {
    if (currentTag && !form.tags.includes(currentTag)) {
      setForm({
        ...form,
        tags: [...form.tags, currentTag]
      });
      setCurrentTag('');
    }
  };

  const handleTagRemove = (tag: string) => {
    setForm({
      ...form,
      tags: form.tags.filter(t => t !== tag)
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUploading(true);

    try {
      // TODO: Implement actual upload logic
      const formData = new FormData();
      formData.append('title', form.title);
      formData.append('description', form.description);
      formData.append('type', form.type);
      formData.append('tags', JSON.stringify(form.tags));
      formData.append('isPremium', String(form.isPremium));
      formData.append('price', String(form.price));
      if (form.file) {
        formData.append('file', form.file);
      }

      // Mock API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      router.push('/vr/manage');
    } catch (error) {
      console.error('Error uploading VR content:', error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <MainLayout title="Create VR Content">
      <div className="max-w-4xl mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
        >
          <h1 className="text-2xl font-bold mb-6">Create VR Content</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Content Type & File</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value as VRContentForm['type'] })}
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2"
              >
                <option value="model">3D Model (GLB/GLTF)</option>
                <option value="360-video">360° Video (MP4/WebM)</option>
                <option value="360-image">360° Image (JPG/PNG)</option>
              </select>
              
              <div className="mt-2">
                <label
                  className="flex justify-center w-full h-32 px-4 transition bg-white dark:bg-gray-700 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg appearance-none cursor-pointer hover:border-primary-500 focus:outline-none"
                >
                  <span className="flex items-center space-x-2">
                    <CloudArrowUpIcon className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                    <span className="font-medium text-gray-600 dark:text-gray-400">
                      {form.file ? form.file.name : 'Drop files to Attach, or browse'}
                    </span>
                  </span>
                  <input type="file" name="file" className="hidden" onChange={handleFileChange} />
                </label>
              </div>
            </div>

            {/* Preview */}
            {form.previewUrl && (
              <div className="space-y-2">
                <label className="block text-sm font-medium">Preview</label>
                <div className="w-full h-[400px] rounded-lg overflow-hidden">
                  <VRViewer
                    mediaUrl={form.previewUrl}
                    contentType={form.type}
                    title={form.title}
                  />
                </div>
              </div>
            )}

            {/* Title & Description */}
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2"
                  placeholder="Enter title"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2"
                  rows={4}
                  placeholder="Enter description"
                  required
                />
              </div>
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Tags</label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={currentTag}
                  onChange={(e) => setCurrentTag(e.target.value)}
                  className="flex-1 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2"
                  placeholder="Add tags"
                />
                <button
                  type="button"
                  onClick={handleTagAdd}
                  className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleTagRemove(tag)}
                      className="ml-2 text-primary-600 dark:text-primary-400 hover:text-primary-800 dark:hover:text-primary-200"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Premium Settings */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isPremium"
                  checked={form.isPremium}
                  onChange={(e) => setForm({ ...form, isPremium: e.target.checked })}
                  className="rounded border-gray-300 dark:border-gray-600 text-primary-500 focus:ring-primary-500"
                />
                <label htmlFor="isPremium" className="text-sm font-medium">
                  Premium Content
                </label>
              </div>
              
              {form.isPremium && (
                <div>
                  <label className="block text-sm font-medium">Price ($)</label>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) })}
                    className="mt-1 w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-4 py-2"
                    min="0"
                    step="0.01"
                    required
                  />
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isUploading || !form.file}
                className="px-6 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <span className="flex items-center space-x-2">
                    <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></span>
                    <span>Uploading...</span>
                  </span>
                ) : (
                  'Create Content'
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </MainLayout>
  );
} 