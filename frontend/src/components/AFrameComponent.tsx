'use client';

import React, { useEffect } from 'react';
import 'aframe';

interface AFrameComponentProps {
  mediaUrl: string;
  contentType: 'model' | '360-video' | '360-image';
  onLoad?: () => void;
  onError?: (error: string) => void;
}

const AFrameComponent: React.FC<AFrameComponentProps> = ({
  mediaUrl,
  contentType,
  onLoad,
  onError
}) => {
  useEffect(() => {
    const scene = document.querySelector('a-scene');
    if (scene) {
      scene.addEventListener('loaded', () => onLoad?.());
      scene.addEventListener('error', () => onError?.('Failed to load VR content'));
    }
    return () => {
      if (scene) {
        scene.removeEventListener('loaded', () => onLoad?.());
        scene.removeEventListener('error', () => onError?.('Failed to load VR content'));
      }
    };
  }, [onLoad, onError]);

  return (
    <a-scene 
      embedded 
      loading-screen="enabled: false"
      vr-mode-ui="enabled: false"
      className="rounded-lg overflow-hidden"
    >
      {contentType === 'model' && (
        <>
          <a-entity
            position="0 1.5 -4"
            gltf-model={mediaUrl}
            scale="1 1 1"
            rotation="0 0 0"
            animation="property: rotation; to: 0 360 0; loop: true; dur: 10000; easing: linear"
          />
          <a-entity
            geometry="primitive: plane; width: 8; height: 8"
            position="0 0 -4"
            rotation="-90 0 0"
            material="color: #666666"
          />
        </>
      )}
      
      {contentType === '360-video' && (
        <a-videosphere 
          src={mediaUrl}
          rotation="0 -90 0"
          play-on-click
        />
      )}
      
      {contentType === '360-image' && (
        <a-sky 
          src={mediaUrl}
          rotation="0 -90 0"
        />
      )}
      
      <a-camera position="0 1.6 0">
        <a-cursor
          color="#2196F3"
          animation__click="property: scale; from: 0.1 0.1 0.1; to: 1 1 1; dur: 150; startEvents: click"
          animation__fusing="property: scale; from: 1 1 1; to: 0.1 0.1 0.1; dur: 1500; startEvents: fusing"
        ></a-cursor>
      </a-camera>
      
      <a-light type="ambient" intensity="1"></a-light>
      <a-light type="directional" position="1 1 1" intensity="0.6"></a-light>
    </a-scene>
  );
};

export default AFrameComponent; 