import React, { useState, useEffect, useRef } from 'react';
import type { NextPage } from 'next';
import { useRouter } from 'next/router';
import MainLayout from '@/components/layouts/MainLayout';
import { 
  PhotoIcon, 
  VideoCameraIcon, 
  DocumentTextIcon, 
  CubeIcon,
  TagIcon,
  XMarkIcon,
  ArrowUpTrayIcon,
  TrashIcon
} from '@heroicons/react/24/outline';

// סוגי תוכן אפשריים
type ContentType = 'text' | 'photo' | 'video' | 'vr';

// סטטוס העלאה
type UploadStatus = 'idle' | 'uploading' | 'success' | 'error';

// ממשק למדיה שהועלתה
interface UploadedMedia {
  id: string;
  file?: File;
  preview: string;
  type: 'image' | 'video' | 'vr';
  uploadProgress: number;
  status: UploadStatus;
  isExisting?: boolean;
}

const EditPostPage: NextPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const fileInputRef = useRef<HTMLInputElement>(null);
  const vrInputRef = useRef<HTMLInputElement>(null);
  
  // סטייט עבור סוג התוכן הנבחר
  const [contentType, setContentType] = useState<ContentType>('text');
  
  // סטייט עבור כותרת הפוסט
  const [title, setTitle] = useState<string>('');
  
  // סטייט עבור תוכן הפוסט
  const [content, setContent] = useState<string>('');
  
  // סטייט עבור תגיות
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState<string>('');
  
  // סטייט עבור קבצי מדיה שהועלו
  const [uploadedMedia, setUploadedMedia] = useState<UploadedMedia[]>([]);
  
  // סטייט עבור נעילת תוכן למנויים בלבד
  const [isSubscribersOnly, setIsSubscribersOnly] = useState<boolean>(false);
  
  // סטייט עבור סטטוס שמירת הפוסט
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  
  // סטייט עבור רמת המנוי המינימלית שנדרשת לצפייה
  const [requiredTier, setRequiredTier] = useState<string>('basic');
  
  // סטייט עבור טעינת הדף
  const [isLoading, setIsLoading] = useState<boolean>(true);
  
  // טעינת נתוני הפוסט
  useEffect(() => {
    if (id) {
      // כאן יהיה קוד לטעינת נתוני הפוסט מהשרת
      // סימולציה של טעינה
      setTimeout(() => {
        // דוגמה לפוסט שמתקבל מהשרת
        const postData = {
          id: id,
          title: 'Sunset at Tel Aviv Beach',
          content: 'Captured this beautiful sunset at the Tel Aviv coastline yesterday. The golden hour light was perfect for photography. I used my Canon EOS R5 with a 24-70mm f/2.8 lens, settings: ISO 100, f/8, 1/125s.\n\nThe colors were absolutely stunning, and I did minimal post-processing in Lightroom to maintain the natural feel. If you have any questions about my photography process, feel free to ask in the comments below!',
          contentType: 'photo' as ContentType,
          tags: ['photography', 'sunset', 'telaviv', 'landscape'],
          media: [
            {
              id: 'm1',
              preview: '/images/posts/sunset.jpg',
              type: 'image',
              isExisting: true
            },
            {
              id: 'm2',
              preview: '/images/posts/sunset2.jpg',
              type: 'image',
              isExisting: true
            }
          ],
          isSubscribersOnly: true,
          requiredTier: 'basic'
        };
        
        // עדכון סטייט של הפוסט שנטען
        setTitle(postData.title);
        setContent(postData.content);
        setContentType(postData.contentType);
        setTags(postData.tags);
        setIsSubscribersOnly(postData.isSubscribersOnly);
        setRequiredTier(postData.requiredTier);
        
        // עדכון המדיה
        setUploadedMedia(postData.media.map(media => ({
          id: media.id,
          preview: media.preview,
          type: media.type as 'image' | 'video' | 'vr',
          uploadProgress: 100,
          status: 'success' as UploadStatus,
          isExisting: media.isExisting
        })));
        
        setIsLoading(false);
      }, 1000);
    }
  }, [id]);
  
  // פונקציות טיפול בתגיות
  const handleTagInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTagInput(e.target.value);
  };
  
  const handleTagInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    }
  };
  
  const addTag = () => {
    const trimmedTag = tagInput.trim().toLowerCase();
    
    if (trimmedTag && !tags.includes(trimmedTag) && tags.length < 10) {
      setTags([...tags, trimmedTag]);
      setTagInput('');
    }
  };
  
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter(tag => tag !== tagToRemove));
  };
  
  // פונקציות טיפול בהעלאת מדיה
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const triggerVrInput = () => {
    if (vrInputRef.current) {
      vrInputRef.current.click();
    }
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (!files || files.length === 0) return;
    
    const newMedia: UploadedMedia[] = Array.from(files).map(file => {
      const isImage = file.type.startsWith('image/');
      const isVideo = file.type.startsWith('video/');
      
      return {
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
        type: isImage ? 'image' : isVideo ? 'video' : 'vr',
        uploadProgress: 0,
        status: 'idle'
      };
    });
    
    setUploadedMedia([...uploadedMedia, ...newMedia]);
    
    // ניקוי ערך ה-input כדי לאפשר העלאה חוזרת של אותו הקובץ
    e.target.value = '';
  };

  const handleVrFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    
    if (!files || files.length === 0) return;
    
    const newMedia: UploadedMedia[] = Array.from(files).map(file => {
      return {
        id: Math.random().toString(36).substr(2, 9),
        file,
        preview: URL.createObjectURL(file),
        type: 'vr',
        uploadProgress: 0,
        status: 'idle'
      };
    });
    
    setUploadedMedia([...uploadedMedia, ...newMedia]);
    
    // ניקוי ערך ה-input כדי לאפשר העלאה חוזרת של אותו הקובץ
    e.target.value = '';
  };
  
  const removeMedia = (mediaId: string) => {
    setUploadedMedia(uploadedMedia.filter(media => media.id !== mediaId));
  };
  
  // שמירת הפוסט
  const handleSavePost = async () => {
    if (!title.trim()) {
      alert('Please add a title for your post');
      return;
    }
    
    // אם זה פוסט טקסט, צריך לוודא שיש תוכן
    if (contentType === 'text' && !content.trim()) {
      alert('Please add content to your post');
      return;
    }
    
    // אם זה פוסט מדיה, צריך לוודא שיש לפחות קובץ אחד
    if ((contentType === 'photo' || contentType === 'video' || contentType === 'vr') && uploadedMedia.length === 0) {
      alert('Please upload at least one media file');
      return;
    }
    
    setSaveStatus('saving');
    
    // כאן יהיה קוד לשמירת הפוסט במערכת
    // סימולציה של שמירה
    setTimeout(() => {
      setSaveStatus('saved');
      
      // לאחר שמירה, נחזור לדף הפוסט
      setTimeout(() => {
        router.push(`/posts/${id}`);
      }, 1500);
    }, 2000);
  };
  
  // מחיקת הפוסט
  const handleDeletePost = () => {
    if (window.confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
      // כאן יהיה קוד למחיקת הפוסט מהמערכת
      // סימולציה של מחיקה
      setTimeout(() => {
        alert('Post deleted successfully');
        router.push('/profile');
      }, 1000);
    }
  };
  
  // בדיקה האם הטופס תקין ומוכן לשמירה
  const isFormValid = () => {
    if (!title.trim()) return false;
    
    if (contentType === 'text' && !content.trim()) return false;
    
    if ((contentType === 'photo' || contentType === 'video' || contentType === 'vr') && uploadedMedia.length === 0) return false;
    
    return true;
  };
  
  if (isLoading) {
    return (
      <MainLayout title="Loading Post...">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="w-12 h-12 rounded-full border-4 border-neutral-300 dark:border-neutral-600 border-t-primary-600 animate-spin"></div>
        </div>
      </MainLayout>
    );
  }
  
  return (
    <MainLayout title="Edit Post">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-2">Edit Post</h1>
          <p className="text-neutral-600 dark:text-neutral-400">
            Update your post details and content
          </p>
        </div>
        
        {/* טופס עריכת תוכן */}
        <div className="card">
          <div className="space-y-6">
            {/* כותרת */}
            <div>
              <label htmlFor="title" className="form-label">Post Title</label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Add a title that describes your post"
                className="form-input"
                maxLength={100}
              />
              <div className="flex justify-end mt-1">
                <span className={`text-xs ${title.length > 80 ? 'text-amber-500' : 'text-neutral-500'}`}>
                  {title.length}/100
                </span>
              </div>
            </div>
            
            {/* תוכן - תלוי בסוג שנבחר */}
            {contentType === 'text' && (
              <div>
                <label htmlFor="content" className="form-label">Post Content</label>
                <textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your post content here..."
                  className="form-input min-h-[200px]"
                  rows={10}
                ></textarea>
              </div>
            )}
            
            {/* אזור העלאת מדיה */}
            {(contentType === 'photo' || contentType === 'video') && (
              <div>
                <div className="flex justify-between items-center">
                  <label className="form-label">Media</label>
                  <button
                    type="button"
                    onClick={triggerFileInput}
                    className="btn-tertiary py-1 px-3 text-sm"
                  >
                    Add More
                  </button>
                </div>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                  multiple
                  accept={contentType === 'photo' ? 'image/*' : 'video/*'}
                />
              </div>
            )}
            
            {contentType === 'vr' && (
              <div>
                <div className="flex justify-between items-center">
                  <label className="form-label">VR Content</label>
                  <button
                    type="button"
                    onClick={triggerVrInput}
                    className="btn-tertiary py-1 px-3 text-sm"
                  >
                    Add More
                  </button>
                </div>
                <input
                  type="file"
                  ref={vrInputRef}
                  onChange={handleVrFileChange}
                  className="hidden"
                  accept=".glb,.gltf,.fbx,.obj"
                />
              </div>
            )}
            
            {/* תצוגה מקדימה של מדיה */}
            {uploadedMedia.length > 0 && (
              <div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-2">
                  {uploadedMedia.map(media => (
                    <div key={media.id} className="relative group">
                      <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden bg-neutral-200 dark:bg-neutral-800">
                        {media.type === 'image' ? (
                          <img 
                            src={media.preview} 
                            alt="Preview" 
                            className="w-full h-full object-cover"
                          />
                        ) : media.type === 'video' ? (
                          <video 
                            src={media.preview} 
                            className="w-full h-full object-cover"
                            controls
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <CubeIcon className="w-12 h-12 text-neutral-500" />
                            <span className="text-sm ml-2">VR Content</span>
                          </div>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => removeMedia(media.id)}
                        className="absolute top-2 right-2 p-1 rounded-full bg-neutral-800 bg-opacity-70 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <XMarkIcon className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* תגיות */}
            <div>
              <label htmlFor="tags" className="form-label">Tags</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <TagIcon className="w-5 h-5 text-neutral-400" />
                </div>
                <input
                  type="text"
                  id="tags"
                  value={tagInput}
                  onChange={handleTagInputChange}
                  onKeyDown={handleTagInputKeyDown}
                  onBlur={addTag}
                  placeholder="Add tags (press Enter or comma to add)"
                  className="form-input pl-10 pr-4"
                  maxLength={30}
                />
              </div>
              <div className="flex flex-wrap mt-2 gap-2">
                {tags.map(tag => (
                  <span key={tag} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200">
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-1 text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300"
                    >
                      <XMarkIcon className="w-4 h-4" />
                    </button>
                  </span>
                ))}
                {tags.length === 0 && (
                  <span className="text-sm text-neutral-500">No tags added yet</span>
                )}
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                You can add up to 10 tags to help users discover your content
              </p>
            </div>
            
            {/* הגדרות גישה */}
            <div>
              <h3 className="form-label">Access Settings</h3>
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="subscribersOnly"
                    checked={isSubscribersOnly}
                    onChange={() => setIsSubscribersOnly(!isSubscribersOnly)}
                    className="form-checkbox"
                  />
                  <label htmlFor="subscribersOnly" className="ml-2">
                    Make this post subscribers-only
                  </label>
                </div>
                
                {isSubscribersOnly && (
                  <div className="ml-6 mt-2">
                    <label htmlFor="requiredTier" className="block text-sm mb-1">
                      Minimum subscription tier
                    </label>
                    <select
                      id="requiredTier"
                      value={requiredTier}
                      onChange={(e) => setRequiredTier(e.target.value)}
                      className="form-select"
                    >
                      <option value="basic">Basic ($4.99/month)</option>
                      <option value="standard">Standard ($9.99/month)</option>
                      <option value="premium">Premium ($19.99/month)</option>
                    </select>
                  </div>
                )}
              </div>
            </div>
            
            {/* כפתורי שמירה */}
            <div className="flex items-center justify-between space-x-4 pt-4 mt-6 border-t border-neutral-200 dark:border-neutral-700">
              <button
                type="button"
                onClick={handleDeletePost}
                className="btn-danger py-2 px-4 flex items-center"
              >
                <TrashIcon className="w-5 h-5 mr-1" />
                Delete Post
              </button>
              
              <div className="flex items-center space-x-4">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="btn-tertiary py-2 px-4"
                >
                  Cancel
                </button>
                
                <button
                  type="button"
                  onClick={handleSavePost}
                  disabled={!isFormValid() || saveStatus === 'saving'}
                  className={`btn-primary py-2 px-6 flex items-center ${
                    !isFormValid() || saveStatus === 'saving' ? 'opacity-70 cursor-not-allowed' : ''
                  }`}
                >
                  {saveStatus === 'saving' ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      <span>Saving...</span>
                    </>
                  ) : saveStatus === 'saved' ? (
                    <>
                      <span>Saved!</span>
                    </>
                  ) : (
                    <>
                      <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
                      <span>Save Changes</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EditPostPage; 