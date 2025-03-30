import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/ui/Button';

interface ContentItem {
  id: string;
  title: string;
  description: string;
  contentType: string;
  mediaUrl: string;
  thumbnailUrl: string;
  isPremium: boolean;
  views: number;
  createdAt: string;
}

interface ContentGalleryProps {
  contents: ContentItem[];
  emptyMessage?: string;
}

export default function ContentGallery({ contents, emptyMessage = "No content available" }: ContentGalleryProps) {
  const [layout, setLayout] = useState<'grid' | 'list'>('grid');

  if (contents.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-4">
        <div className="inline-flex rounded-md shadow-sm">
          <button
            type="button"
            onClick={() => setLayout('grid')}
            className={`px-3 py-2 text-sm font-medium rounded-l-md ${
              layout === 'grid'
                ? 'bg-blue-50 text-blue-700'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border border-gray-300`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            type="button"
            onClick={() => setLayout('list')}
            className={`px-3 py-2 text-sm font-medium rounded-r-md ${
              layout === 'list'
                ? 'bg-blue-50 text-blue-700'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            } border border-gray-300 border-l-0`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      {layout === 'grid' ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {contents.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
              <Link href={`/content/${item.id}`}>
                <div className="relative h-40 w-full bg-gray-100">
                  {item.mediaUrl ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}${item.mediaUrl}`}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Content type badge */}
                  <div className="absolute bottom-2 left-2 bg-gray-900 bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {item.contentType === 'video' && 'Video'}
                    {item.contentType === 'image' && 'Image'}
                    {item.contentType === 'text' && 'Text'}
                    {item.contentType === 'audio' && 'Audio'}
                    {item.contentType === 'vr' && 'VR'}
                  </div>
                  
                  {/* Premium badge */}
                  {item.isPremium && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                      PREMIUM
                    </div>
                  )}
                </div>
              </Link>
              <div className="p-3">
                <Link href={`/content/${item.id}`}>
                  <h3 className="text-sm font-medium text-gray-900 truncate">{item.title}</h3>
                </Link>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span>{item.views} views</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {contents.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden flex">
              <Link href={`/content/${item.id}`} className="flex-shrink-0">
                <div className="relative h-32 w-32 bg-gray-100">
                  {item.mediaUrl ? (
                    <Image
                      src={`${process.env.NEXT_PUBLIC_API_URL}${item.mediaUrl}`}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  
                  {/* Content type badge */}
                  <div className="absolute bottom-2 left-2 bg-gray-900 bg-opacity-70 text-white text-xs px-2 py-1 rounded">
                    {item.contentType}
                  </div>
                  
                  {/* Premium badge */}
                  {item.isPremium && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-1 rounded">
                      PREMIUM
                    </div>
                  )}
                </div>
              </Link>
              <div className="p-4 flex-1">
                <Link href={`/content/${item.id}`}>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">{item.title}</h3>
                </Link>
                <p className="text-sm text-gray-500 line-clamp-2 mb-2">{item.description}</p>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <span>{item.views} views</span>
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="flex items-center p-4">
                <Link href={`/content/${item.id}`}>
                  <Button variant="outline" size="sm">View</Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}