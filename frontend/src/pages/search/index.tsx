import React, { useState, useEffect } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import Link from 'next/link';
import MainLayout from '@/components/layouts/MainLayout';
import { 
  MagnifyingGlassIcon, 
  HashtagIcon, 
  UserIcon, 
  PhotoIcon, 
  VideoCameraIcon, 
  DocumentTextIcon,
  XMarkIcon,
  HeartIcon,
  BookmarkIcon,
  ChatBubbleLeftIcon,
  AdjustmentsHorizontalIcon,
  CheckBadgeIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import Image from 'next/image';
import { format } from 'date-fns';
import { FaHeart, FaBookmark, FaImage, FaVideo, FaFileAlt } from 'react-icons/fa';
import { toast } from 'react-toastify';

// Search result types
type SearchType = 'creators' | 'posts' | 'tags';

// Creator search result interface
interface Creator {
  id: string;
  name: string;
  avatar: string;
  bio: string;
  followers: number;
  isFollowing: boolean;
}

// Post search result interface
interface Post {
  id: string;
  title: string;
  description: string;
  type: 'image' | 'video' | 'text';
  thumbnail?: string;
  creator: Creator;
  createdAt: string;
  likes: number;
  isLiked: boolean;
  isSaved: boolean;
  isPremium: boolean;
}

// Tag search result interface
interface Tag {
  id: string;
  name: string;
  postsCount: number;
  isFollowing: boolean;
}

// Search results interface
interface SearchResults {
  creators: Creator[];
  posts: Post[];
  tags: Tag[];
}

const SearchPage: NextPage = () => {
  const router = useRouter();
  const { q: queryParam, type: typeParam } = router.query;
  
  // Update search field when URL parameter changes
  const [searchQuery, setSearchQuery] = useState(queryParam as string || '');
  const [searchType, setSearchType] = useState<SearchType>((typeParam as SearchType) || 'creators');
  const [results, setResults] = useState<SearchResults>({
    creators: [],
    posts: [],
    tags: []
  });
  const [loading, setLoading] = useState(false);
  
  // Perform search
  useEffect(() => {
    if (!searchQuery) return;

    const performSearch = async () => {
      setLoading(true);
      try {
        // Update URL with search query
        router.push({
          pathname: '/search',
          query: { q: searchQuery, type: searchType }
        }, undefined, { shallow: true });

        // Simulate API search
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Sample creators
        const mockCreators: Creator[] = [
          {
            id: '1',
            name: 'John Doe',
            avatar: 'https://i.pravatar.cc/150?u=1',
            bio: 'Digital artist and content creator',
            followers: 1000,
            isFollowing: false
          },
          // Add more mock creators
        ];

        // Sample posts
        const mockPosts: Post[] = [
          {
            id: '1',
            title: 'Sample Post',
            description: 'This is a sample post matching your search',
            type: 'image',
            thumbnail: 'https://picsum.photos/400/300',
            creator: mockCreators[0],
            createdAt: new Date().toISOString(),
            likes: 150,
            isLiked: false,
            isSaved: false,
            isPremium: false
          },
          // Add more mock posts
        ];

        // Sample tags
        const mockTags: Tag[] = [
          {
            id: '1',
            name: 'art',
            postsCount: 1500,
            isFollowing: false
          },
          // Add more mock tags
        ];

        setResults({
          creators: mockCreators,
          posts: mockPosts,
          tags: mockTags
        });
      } catch (error) {
        console.error('Search error:', error);
        toast.error('Failed to perform search');
      } finally {
        setLoading(false);
      }
    };

    performSearch();
  }, [searchQuery, searchType]);
  
  // Form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Update URL with search query
    router.push({
      pathname: '/search',
      query: { q: searchQuery, type: searchType }
    });
  };
  
  // Change search type
  const handleTypeChange = (type: SearchType) => {
    setSearchType(type);
  };
  
  // Format date
  const formatDate = (date: string) => {
    try {
      return format(new Date(date), 'MMM d, yyyy');
    } catch (error) {
      console.error('Error formatting date:', error);
      return date;
    }
  };
  
  // Handle like
  const handleLike = async (postId: string) => {
    try {
      // Replace with actual API call
      setResults(prev => ({
        ...prev,
        posts: prev.posts.map(post =>
          post.id === postId
            ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
            : post
        )
      }));
    } catch (error) {
      console.error('Error liking post:', error);
      toast.error('Failed to like post');
    }
  };
  
  // Handle save
  const handleSave = async (postId: string) => {
    try {
      // Replace with actual API call
      setResults(prev => ({
        ...prev,
        posts: prev.posts.map(post =>
          post.id === postId ? { ...post, isSaved: !post.isSaved } : post
        )
      }));
    } catch (error) {
      console.error('Error saving post:', error);
      toast.error('Failed to save post');
    }
  };
  
  // Get icon by post type
  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'image':
        return <FaImage />;
      case 'video':
        return <FaVideo />;
      case 'text':
        return <FaFileAlt />;
      default:
        return null;
    }
  };
  
  return (
    <MainLayout title="Search">
      <div className="container mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="mb-8">
          <div className="flex gap-4">
            <input
              type="search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="flex-1"
            />
            <button type="submit">Search</button>
          </div>
        </form>

        <Tabs
          value={searchType}
          onChange={handleTypeChange}
          options={[
            { value: 'creators', label: 'Creators' },
            { value: 'posts', label: 'Posts' },
            { value: 'tags', label: 'Tags' }
          ]}
          className="mb-8"
        />

        {loading ? (
          <div>Loading...</div>
        ) : (
          <div>
            {searchType === 'creators' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.creators.map(creator => (
                  <CreatorCard key={creator.id} creator={creator} />
                ))}
              </div>
            )}

            {searchType === 'posts' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.posts.map(post => (
                  <PostCard
                    key={post.id}
                    post={post}
                    onLike={handleLike}
                    onSave={handleSave}
                    formatDate={formatDate}
                    getPostTypeIcon={getPostTypeIcon}
                  />
                ))}
              </div>
            )}

            {searchType === 'tags' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {results.tags.map(tag => (
                  <TagCard key={tag.id} tag={tag} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default SearchPage; 