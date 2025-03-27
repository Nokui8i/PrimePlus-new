'use client';

import React, { useState, useEffect, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { XMarkIcon, ArrowsPointingOutIcon, ArrowsPointingInIcon, CubeIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';

// Dynamically import aframe with no SSR
const AFrameComponent = dynamic(() => import('./AFrameComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-800">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
    </div>
  ),
});

interface VRViewerProps {
  mediaUrl: string;
  contentType: 'model' | '360-video' | '360-image';
  title?: string;
}

const VRViewer: React.FC<VRViewerProps> = ({ mediaUrl, contentType, title }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isVRMode, setIsVRMode] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Handle fullscreen
  const toggleFullscreen = useCallback(() => {
    if (!isClient) return;
    const container = document.querySelector('.vr-container');
    if (!container) return;

    if (!isFullscreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen, isClient]);

  // Handle VR mode
  const toggleVRMode = useCallback(() => {
    if (!isClient) return;
    const scene = document.querySelector('a-scene') as any;
    if (scene) {
      if (!isVRMode) {
        scene.enterVR();
      } else {
        scene.exitVR();
      }
      setIsVRMode(!isVRMode);
    }
  }, [isVRMode, isClient]);

  // Reset camera position
  const resetCamera = useCallback(() => {
    if (!isClient) return;
    const camera = document.querySelector('a-camera') as any;
    if (camera) {
      camera.setAttribute('position', '0 1.6 0');
      camera.setAttribute('rotation', '0 0 0');
    }
  }, [isClient]);

  if (error) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
        <div className="text-center">
          <div className="mb-4 p-4 rounded-full bg-red-100 dark:bg-red-900/30 inline-block">
            <XMarkIcon className="w-8 h-8 text-red-600 dark:text-red-400" />
          </div>
          <p className="text-red-600 dark:text-red-400 font-medium mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="btn btn-primary inline-flex items-center space-x-2"
          >
            <CubeIcon className="w-5 h-5" />
            <span>Try Again</span>
          </button>
        </div>
      </div>
    );
  }

  if (!isClient) {
    return (
      <div className="w-full h-[600px] flex items-center justify-center bg-gray-100 dark:bg-gray-800">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="vr-container relative w-full h-[600px]">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800 z-10"
          >
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-500 border-t-transparent mb-4"></div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Loading VR content...</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="absolute top-4 right-4 z-20 flex space-x-2"
      >
        <button
          onClick={toggleFullscreen}
          className="p-2 bg-black/30 hover:bg-black/50 text-white rounded-lg backdrop-blur-sm transition-colors duration-200"
          title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
        >
          {isFullscreen ? (
            <ArrowsPointingInIcon className="w-5 h-5" />
          ) : (
            <ArrowsPointingOutIcon className="w-5 h-5" />
          )}
        </button>
        <button
          onClick={resetCamera}
          className="p-2 bg-black/30 hover:bg-black/50 text-white rounded-lg backdrop-blur-sm transition-colors duration-200"
          title="Reset View"
        >
          <XMarkIcon className="w-5 h-5" />
        </button>
        {contentType !== 'model' && (
          <button
            onClick={toggleVRMode}
            className={`p-2 ${isVRMode ? 'bg-primary-500' : 'bg-black/30'} hover:bg-black/50 text-white rounded-lg backdrop-blur-sm transition-colors duration-200 font-medium`}
            title={isVRMode ? "Exit VR Mode" : "Enter VR Mode"}
          >
            VR
          </button>
        )}
      </motion.div>

      <AFrameComponent
        mediaUrl={mediaUrl}
        contentType={contentType}
        onLoad={() => setIsLoading(false)}
        onError={(err) => {
          setError(err);
          setIsLoading(false);
        }}
      />

      {title && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="absolute top-4 left-4 bg-black/30 text-white px-3 py-1.5 rounded-lg backdrop-blur-sm font-medium text-sm"
        >
          {title}
        </motion.div>
      )}
    </div>
  );
};

export default VRViewer; 