import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { VRButton } from 'three/examples/jsm/webxr/VRButton';
import { ARButton } from 'three/examples/jsm/webxr/ARButton';

interface VRViewerProps {
  type: '360-image' | '360-video' | 'vr-room';
  url: string;
  hotspots?: Array<{
    id: string;
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
    type: 'info' | 'link' | 'media';
    content: string;
  }>;
  environment?: string;
  onHotspotClick?: (hotspotId: string) => void;
}

const VRViewer: React.FC<VRViewerProps> = ({
  type,
  url,
  hotspots = [],
  environment = 'default',
  onHotspotClick,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isVRSupported, setIsVRSupported] = useState(false);
  const [isARSupported, setIsARSupported] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Check for VR/AR support
    if ('xr' in navigator) {
      navigator.xr.isSessionSupported('immersive-vr').then(supported => {
        setIsVRSupported(supported);
      });
      navigator.xr.isSessionSupported('immersive-ar').then(supported => {
        setIsARSupported(supported);
      });
    }

    // Initialize Three.js scene
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;
    containerRef.current.appendChild(renderer.domElement);

    // Add environment
    if (type === 'vr-room') {
      // Load environment based on selection
      const envMap = new THREE.TextureLoader().load(`/environments/${environment}.hdr`);
      scene.environment = envMap;
    }

    // Add content based on type
    if (type === '360-image') {
      const texture = new THREE.TextureLoader().load(url);
      const geometry = new THREE.SphereGeometry(500, 60, 40);
      const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);
    } else if (type === '360-video') {
      const video = document.createElement('video');
      video.src = url;
      video.playsInline = true;
      video.loop = true;
      video.muted = true;
      video.play();

      const texture = new THREE.VideoTexture(video);
      const geometry = new THREE.SphereGeometry(500, 60, 40);
      const material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.BackSide });
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);
    }

    // Add hotspots
    hotspots.forEach(hotspot => {
      const geometry = new THREE.SphereGeometry(0.5, 32, 32);
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(hotspot.position.x, hotspot.position.y, hotspot.position.z);
      mesh.rotation.set(hotspot.rotation.x, hotspot.rotation.y, hotspot.rotation.z);
      mesh.userData = { id: hotspot.id, type: hotspot.type, content: hotspot.content };
      scene.add(mesh);
    });

    // Set up camera position
    camera.position.set(0, 1.6, 0);

    // Add controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.screenSpacePanning = false;
    controls.minDistance = 0.1;
    controls.maxDistance = 1000;
    controls.maxPolarAngle = Math.PI / 2;

    // Add VR/AR buttons
    if (isVRSupported) {
      document.body.appendChild(VRButton.createButton(renderer));
    }
    if (isARSupported) {
      document.body.appendChild(ARButton.createButton(renderer));
    }

    // Handle window resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Handle hotspot clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const handleClick = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(scene.children);

      for (const intersect of intersects) {
        if (intersect.object.userData.id) {
          onHotspotClick?.(intersect.object.userData.id);
          break;
        }
      }
    };
    renderer.domElement.addEventListener('click', handleClick);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', handleClick);
      renderer.dispose();
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [type, url, hotspots, environment, onHotspotClick]);

  return (
    <div className="relative w-full h-screen">
      {error && (
        <div className="absolute top-4 left-4 bg-red-50 dark:bg-red-900/20 text-red-600 p-4 rounded-lg">
          {error}
        </div>
      )}
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full" />
    </div>
  );
};

export default VRViewer; 