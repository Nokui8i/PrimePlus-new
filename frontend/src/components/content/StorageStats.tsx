import React, { useEffect, useState } from 'react';
import UploadService from '@/services/uploadService';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Doughnut } from 'react-chartjs-2';

ChartJS.register(ArcElement, Tooltip, Legend);

interface StorageStatsProps {
  refreshTrigger?: number; // Optional prop to trigger refresh
}

interface StorageData {
  storage: {
    uploadsSize: number;
    processedSize: number;
    totalSize: number;
    uploadsSizeMB: string;
    processedSizeMB: string;
    totalSizeMB: string;
  };
  mediaStats: Array<{
    mediaType: string;
    count: string;
    totalSize: string;
  }>;
  contentCount: number;
}

const StorageStats: React.FC<StorageStatsProps> = ({ refreshTrigger }) => {
  const [storageData, setStorageData] = useState<StorageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStorageStats = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        const response = await UploadService.getStorageStats();
        setStorageData(response.data);
      } catch (err) {
        console.error('Error fetching storage stats:', err);
        setError('Failed to load storage statistics');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStorageStats();
  }, [refreshTrigger]);

  if (isLoading) {
    return (
      <div className="p-4 bg-white rounded-lg shadow">
        <div className="animate-pulse flex space-x-4">
          <div className="flex-1 space-y-4 py-1">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-white rounded-lg shadow text-red-500">
        <p>{error}</p>
        <button 
          className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
          onClick={() => setError(null)}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!storageData) {
    return null;
  }

  // Prepare chart data
  const chartData = {
    labels: ['Images', 'Videos', 'Audio', 'Other'],
    datasets: [
      {
        label: 'Storage Used',
        data: storageData.mediaStats.map(item => parseInt(item.totalSize) || 0),
        backgroundColor: [
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 99, 132, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(75, 192, 192, 0.6)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Storage Usage</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h3 className="text-lg font-medium mb-2">Overview</h3>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Storage</span>
              <span className="font-semibold">{storageData.storage.totalSizeMB} MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Raw Uploads</span>
              <span>{storageData.storage.uploadsSizeMB} MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Processed Files</span>
              <span>{storageData.storage.processedSizeMB} MB</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Total Content Items</span>
              <span>{storageData.contentCount}</span>
            </div>
          </div>

          <h3 className="text-lg font-medium mt-6 mb-2">Media Type Breakdown</h3>
          <div className="space-y-2">
            {storageData.mediaStats.map((item) => (
              <div key={item.mediaType} className="flex justify-between">
                <span className="text-gray-600 capitalize">{item.mediaType}s</span>
                <span>{item.count} files</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex items-center justify-center">
          <div className="w-full max-w-xs">
            <Doughnut 
              data={chartData}
              options={{
                plugins: {
                  legend: {
                    position: 'bottom',
                  },
                  tooltip: {
                    callbacks: {
                      label: function(context) {
                        const value = context.raw as number;
                        return `${context.label}: ${(value / (1024 * 1024)).toFixed(2)} MB`;
                      }
                    }
                  }
                },
                cutout: '70%'
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default StorageStats;