import React from 'react';

const ContentFeed: React.FC = () => {
  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 border-b">
          <p className="text-gray-500 text-sm">No content available yet. Subscribe to creators to see their content here.</p>   
        </div>
      </div>
    </div>
  );
};

export default ContentFeed;