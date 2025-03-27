import { Metadata } from 'next';
import CreatePostForm from '@/components/content/CreatePostForm';

export const metadata: Metadata = {
  title: 'Create Post - PrimePlus',
  description: 'Create a new post with text, photos, videos, VR content, or live rooms',
};

export default function CreatePostPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create Post</h1>
      <CreatePostForm />
    </div>
  );
} 