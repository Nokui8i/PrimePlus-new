import React from 'react';

interface PlaceholderImageProps {
  type: 'avatar' | 'cover';
  text?: string;
  width?: number;
  height?: number;
}

const PlaceholderImage: React.FC<PlaceholderImageProps> = ({
  type,
  text,
  width = type === 'avatar' ? 40 : 800,
  height = type === 'avatar' ? 40 : 200
}) => {
  // Create a data URL for an SVG placeholder
  const generatePlaceholder = () => {
    const bgColor = type === 'avatar' ? '#4F46E5' : '#6B7280';
    const displayText = text || (type === 'avatar' ? 'User' : 'No Image');
    
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <rect width="100%" height="100%" fill="${bgColor}"/>
        <text 
          x="50%" 
          y="50%" 
          font-family="Arial" 
          font-size="${type === 'avatar' ? '14' : '24'}" 
          fill="white" 
          text-anchor="middle" 
          dy=".3em"
        >${displayText}</text>
      </svg>
    `;

    return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
  };

  return (
    <img
      src={generatePlaceholder()}
      alt={text || type}
      width={width}
      height={height}
      className={type === 'avatar' ? 'rounded-full' : 'rounded-lg'}
    />
  );
};

export default PlaceholderImage; 