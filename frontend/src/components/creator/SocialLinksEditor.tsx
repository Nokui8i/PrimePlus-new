import React from 'react';
import { SocialLinks } from '@/services/creatorService';

interface SocialLinksEditorProps {
  links: SocialLinks;
  onChange: (links: SocialLinks) => void;
}

const SocialLinksEditor: React.FC<SocialLinksEditorProps> = ({ links, onChange }) => {
  // Social platforms with their icons and URL patterns
  const platforms = [
    {
      name: 'instagram',
      label: 'Instagram',
      placeholder: 'username',
      prefix: 'https://instagram.com/',
      icon: 'fab fa-instagram'
    },
    {
      name: 'twitter',
      label: 'Twitter',
      placeholder: 'username',
      prefix: 'https://twitter.com/',
      icon: 'fab fa-twitter'
    },
    {
      name: 'tiktok',
      label: 'TikTok',
      placeholder: 'username',
      prefix: 'https://tiktok.com/@',
      icon: 'fab fa-tiktok'
    },
    {
      name: 'youtube',
      label: 'YouTube',
      placeholder: 'channel URL',
      prefix: '',
      icon: 'fab fa-youtube'
    },
    {
      name: 'website',
      label: 'Website',
      placeholder: 'https://yourwebsite.com',
      prefix: '',
      icon: 'fas fa-globe'
    }
  ];

  // Handle input change
  const handleChange = (platform: string, value: string) => {
    onChange({
      ...links,
      [platform]: value
    });
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {platforms.map((platform) => (
        <div key={platform.name} className="mb-3">
          <label htmlFor={platform.name} className="block text-gray-700 font-medium mb-2">
            <i className={`${platform.icon} mr-2`}></i>
            {platform.label}
          </label>
          
          <div className="flex items-center">
            {platform.prefix && (
              <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-md text-gray-500">
                {platform.prefix}
              </span>
            )}
            
            <input
              type="text"
              id={platform.name}
              value={links[platform.name] || ''}
              onChange={(e) => handleChange(platform.name, e.target.value)}
              placeholder={platform.placeholder}
              className={`w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                platform.prefix ? 'rounded-r-md' : 'rounded-md'
              }`}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default SocialLinksEditor;