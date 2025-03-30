export const mockUser = {
  id: '1',
  name: 'Demo User',
  email: 'demo@example.com',
  image: 'https://ui-avatars.com/api/?name=Demo+User',
};

export const mockVRContent = [
  {
    id: '1',
    title: 'Virtual Beach Tour',
    description: 'Experience a relaxing day at the beach in VR',
    contentType: '360-image',
    isPremium: false,
    price: 0,
    tags: ['beach', 'nature', 'relaxation'],
    environment: 'default',
    mediaUrl: '/demo/beach-360.jpg',
    hotspots: [
      {
        id: 'spot1',
        position: { x: 1, y: 1.6, z: -2 },
        rotation: { x: 0, y: 0, z: 0 },
        type: 'info',
        content: 'Beautiful ocean view'
      }
    ],
    author: mockUser,
    createdAt: '2024-03-20T10:00:00Z',
    updatedAt: '2024-03-20T10:00:00Z'
  },
  {
    id: '2',
    title: 'City Nightlife Experience',
    description: 'Explore the vibrant city streets at night in VR',
    contentType: '360-video',
    isPremium: true,
    price: 4.99,
    tags: ['city', 'night', 'urban'],
    environment: 'night',
    mediaUrl: '/demo/city-360.mp4',
    hotspots: [
      {
        id: 'spot2',
        position: { x: -2, y: 1.6, z: 1 },
        rotation: { x: 0, y: 45, z: 0 },
        type: 'info',
        content: 'Downtown district'
      }
    ],
    author: mockUser,
    createdAt: '2024-03-19T15:30:00Z',
    updatedAt: '2024-03-19T15:30:00Z'
  },
  {
    id: '3',
    title: 'Interactive VR Room',
    description: 'A fully interactive VR environment with multiple hotspots',
    contentType: 'vr-room',
    isPremium: true,
    price: 9.99,
    tags: ['interactive', 'room', '3d'],
    environment: 'studio',
    mediaUrl: '/demo/room.glb',
    hotspots: [
      {
        id: 'spot3',
        position: { x: 0, y: 1.6, z: -1 },
        rotation: { x: 0, y: 0, z: 0 },
        type: 'media',
        content: 'Interactive display'
      },
      {
        id: 'spot4',
        position: { x: 2, y: 1.6, z: 2 },
        rotation: { x: 0, y: -45, z: 0 },
        type: 'link',
        content: 'Go to next room'
      }
    ],
    author: mockUser,
    createdAt: '2024-03-18T09:15:00Z',
    updatedAt: '2024-03-18T09:15:00Z'
  }
]; 