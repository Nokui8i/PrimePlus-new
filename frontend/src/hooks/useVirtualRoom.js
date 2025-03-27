import { useState, useEffect, useCallback } from 'react';
import { virtualRoomService } from '../services/virtualRoomService';
import { socketService } from '../services/socketService';

/**
 * Hook for managing virtual room interactions
 */
export const useVirtualRoom = (roomId) => {
  const [room, setRoom] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isJoined, setIsJoined] = useState(false);
  const [userPositions, setUserPositions] = useState({});
  const [xrPosition, setXrPosition] = useState(null);
  
  // Room assets state
  const [roomAssets, setRoomAssets] = useState([]);
  const [isLoadingAssets, setIsLoadingAssets] = useState(false);
  
  // Load room data
  useEffect(() => {
    const fetchRoomData = async () => {
      if (!roomId) return;
      
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await virtualRoomService.getVirtualRoomById(roomId);
        
        if (response.success) {
          setRoom(response.data);
          
          // Extract participants
          if (response.data.participants) {
            setParticipants(response.data.participants);
            
            // Initialize positions
            const positions = {};
            response.data.participants.forEach(p => {
              positions[p.userId] = {
                position: p.position || { x: 0, y: 0, z: 0 },
                rotation: p.rotation || { x: 0, y: 0, z: 0 }
              };
            });
            setUserPositions(positions);
          }
        } else {
          setError(response.message || 'Failed to load room data');
        }
      } catch (err) {
        setError(err.message || 'An error occurred while loading room data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchRoomData();
  }, [roomId]);
  
  // Join room
  const joinRoom = useCallback(async (accessCode) => {
    if (!roomId) return { success: false, message: 'Room ID is required' };
    
    try {
      const response = await virtualRoomService.joinVirtualRoom(roomId, { accessCode });
      
      if (response.success) {
        setIsJoined(true);
        
        // Add self to participants if not already there
        const selfParticipant = response.data.participant;
        setParticipants(prevParticipants => {
          const exists = prevParticipants.some(p => p.userId === selfParticipant.userId);
          if (!exists) {
            return [...prevParticipants, selfParticipant];
          }
          return prevParticipants;
        });
        
        // Initialize user positions if newly joined
        if (response.data.participant) {
          setUserPositions(prev => ({
            ...prev,
            [response.data.participant.userId]: {
              position: response.data.participant.position || { x: 0, y: 0, z: 0 },
              rotation: response.data.participant.rotation || { x: 0, y: 0, z: 0 }
            }
          }));
        }
      } else {
        setError(response.message);
      }
      
      return response;
    } catch (err) {
      const errorMsg = err.message || 'An error occurred while joining room';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  }, [roomId]);
  
  // Leave room
  const leaveRoom = useCallback(async () => {
    if (!roomId || !isJoined) return { success: true };
    
    try {
      const response = await virtualRoomService.leaveVirtualRoom(roomId);
      
      if (response.success) {
        setIsJoined(false);
      }
      
      return response;
    } catch (err) {
      const errorMsg = err.message || 'An error occurred while leaving room';
      setError(errorMsg);
      return { success: false, message: errorMsg };
    }
  }, [roomId, isJoined]);
  
  // Update position
  const updatePosition = useCallback(async (position, rotation) => {
    if (!roomId || !isJoined) return { success: false, message: 'Not joined to room' };
    
    try {
      // Update local state first for responsive UI
      setUserPositions(prev => {
        const userId = socketService.getUserId();
        if (!userId) return prev;
        
        return {
          ...prev,
          [userId]: {
            position: position || (prev[userId]?.position || { x: 0, y: 0, z: 0 }),
            rotation: rotation || (prev[userId]?.rotation || { x: 0, y: 0, z: 0 })
          }
        };
      });
      
      // Send update to server
      await virtualRoomService.updateParticipantPosition(roomId, { position, rotation });
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, [roomId, isJoined]);
  
  // Update position from WebXR
  const updateXRPosition = useCallback(async (xrPosition, xrRotation) => {
    if (!roomId || !isJoined) return { success: false, message: 'Not joined to room' };
    
    try {
      // Convert XR position to room coordinates
      const position = {
        x: xrPosition.x || 0,
        y: xrPosition.y || 0,
        z: xrPosition.z || 0
      };
      
      // Convert XR rotation to room rotation
      const rotation = {
        x: xrRotation.x || 0,
        y: xrRotation.y || 0,
        z: xrRotation.z || 0
      };
      
      // Store XR position for reference
      setXrPosition({ position, rotation });
      
      // Send position update
      return updatePosition(position, rotation);
    } catch (err) {
      return { success: false, message: err.message };
    }
  }, [roomId, isJoined, updatePosition]);
  
  // Send interaction
  const sendInteraction = useCallback((interactionData) => {
    if (!roomId || !isJoined) return { success: false, message: 'Not joined to room' };
    
    // If in XR, add XR position if not provided
    if (xrPosition && interactionData.fromXR && !interactionData.position) {
      interactionData.position = xrPosition.position;
      interactionData.rotation = xrPosition.rotation;
    }
    
    // Add sender info to interaction data
    const fullData = {
      ...interactionData,
      senderId: socketService.getUserId(),
      timestamp: Date.now()
    };
    
    // Handle chat messages locally
    if (interactionData.type === 'chat') {
      // The chat component will handle this separately
    }
    
    // Handle object interactions
    if (['grab', 'release', 'transform'].includes(interactionData.type)) {
      // Nothing special needed here, will be handled by the receiver
    }
    
    // Send interaction via socket
    virtualRoomService.sendVRInteraction(roomId, fullData);
    return { success: true };
  }, [roomId, isJoined, xrPosition]);
  
  // Fetch room assets when joining room
  useEffect(() => {
    if (!roomId || !isJoined) return;
    
    const fetchRoomAssets = async () => {
      try {
        setIsLoadingAssets(true);
        
        const { virtualRoomAssetService } = await import('../services/vrAssetService');
        const response = await virtualRoomAssetService.getRoomAssets(roomId);
        
        if (response.success) {
          setRoomAssets(response.data);
        } else {
          console.error('Error fetching room assets:', response.message);
        }
      } catch (err) {
        console.error('Error loading room assets:', err);
      } finally {
        setIsLoadingAssets(false);
      }
    };
    
    fetchRoomAssets();
    
    // Listen for asset updates
    socketService.on('asset_added', (data) => {
      setRoomAssets(prev => [...prev, data]);
    });
    
    socketService.on('asset_updated', (data) => {
      setRoomAssets(prev => prev.map(asset => 
        asset.id === data.id ? { ...asset, ...data } : asset
      ));
    });
    
    socketService.on('asset_removed', (data) => {
      setRoomAssets(prev => prev.filter(asset => asset.id !== data.id));
    });
    
    return () => {
      socketService.off('asset_added');
      socketService.off('asset_updated');
      socketService.off('asset_removed');
    };
  }, [roomId, isJoined]);
  
  // Add asset to room
  const addAssetToRoom = useCallback(async (assetId, position, rotation, scale, options = {}) => {
    if (!roomId || !isJoined) return { success: false, message: 'Not joined to room' };
    
    try {
      const { virtualRoomAssetService } = await import('../services/vrAssetService');
      
      const assetData = {
        assetId,
        position: JSON.stringify(position || { x: 0, y: 0, z: 0 }),
        rotation: JSON.stringify(rotation || { x: 0, y: 0, z: 0 }),
        scale: JSON.stringify(scale || { x: 1, y: 1, z: 1 }),
        isInteractive: options.isInteractive || false,
        interactionType: options.interactionType || null,
        interactionData: options.interactionData ? JSON.stringify(options.interactionData) : null
      };
      
      const response = await virtualRoomAssetService.addAssetToRoom(roomId, assetData);
      
      return response;
    } catch (err) {
      console.error('Error adding asset to room:', err);
      return { success: false, message: err.message || 'Failed to add asset to room' };
    }
  }, [roomId, isJoined]);
  
  // Update asset in room
  const updateRoomAsset = useCallback(async (assetId, position, rotation, scale, options = {}) => {
    if (!roomId || !isJoined) return { success: false, message: 'Not joined to room' };
    
    try {
      const { virtualRoomAssetService } = await import('../services/vrAssetService');
      
      const assetData = {};
      if (position) assetData.position = JSON.stringify(position);
      if (rotation) assetData.rotation = JSON.stringify(rotation);
      if (scale) assetData.scale = JSON.stringify(scale);
      if (options.isInteractive !== undefined) assetData.isInteractive = options.isInteractive;
      if (options.interactionType) assetData.interactionType = options.interactionType;
      if (options.interactionData) assetData.interactionData = JSON.stringify(options.interactionData);
      
      const response = await virtualRoomAssetService.updateRoomAsset(roomId, assetId, assetData);
      
      return response;
    } catch (err) {
      console.error('Error updating room asset:', err);
      return { success: false, message: err.message || 'Failed to update room asset' };
    }
  }, [roomId, isJoined]);
  
  // Remove asset from room
  const removeAssetFromRoom = useCallback(async (assetId) => {
    if (!roomId || !isJoined) return { success: false, message: 'Not joined to room' };
    
    try {
      const { virtualRoomAssetService } = await import('../services/vrAssetService');
      
      const response = await virtualRoomAssetService.removeAssetFromRoom(roomId, assetId);
      
      return response;
    } catch (err) {
      console.error('Error removing asset from room:', err);
      return { success: false, message: err.message || 'Failed to remove asset from room' };
    }
  }, [roomId, isJoined]);
  
  // Interact with asset in room
  const interactWithAsset = useCallback(async (assetId, interactionType, interactionData = {}) => {
    if (!roomId || !isJoined) return { success: false, message: 'Not joined to room' };
    
    try {
      const { virtualRoomAssetService } = await import('../services/vrAssetService');
      
      const data = {
        interactionType,
        interactionData: typeof interactionData === 'object' ? JSON.stringify(interactionData) : interactionData
      };
      
      const response = await virtualRoomAssetService.interactWithAsset(roomId, assetId, data);
      
      return response;
    } catch (err) {
      console.error('Error interacting with asset:', err);
      return { success: false, message: err.message || 'Failed to interact with asset' };
    }
  }, [roomId, isJoined]);
  
  // Setup event listeners for real-time updates
  useEffect(() => {
    if (!roomId || !isJoined) return;
    
    const cleanupListeners = virtualRoomService.setupRoomEventListeners({
      onUserJoined: (data) => {
        // Add new participant to list
        setParticipants(prev => {
          const exists = prev.some(p => p.userId === data.user.id);
          if (!exists) {
            return [...prev, { 
              userId: data.user.id, 
              user: data.user, 
              role: data.participant.role,
              position: data.participant.position || { x: 0, y: 0, z: 0 },
              rotation: data.participant.rotation || { x: 0, y: 0, z: 0 }
            }];
          }
          return prev;
        });
        
        // Initialize position
        setUserPositions(prev => ({
          ...prev,
          [data.user.id]: {
            position: data.participant.position || { x: 0, y: 0, z: 0 },
            rotation: data.participant.rotation || { x: 0, y: 0, z: 0 }
          }
        }));
      },
      
      onUserLeft: (data) => {
        // Remove participant from list
        setParticipants(prev => prev.filter(p => p.userId !== data.userId));
        
        // Remove position
        setUserPositions(prev => {
          const updated = { ...prev };
          delete updated[data.userId];
          return updated;
        });
      },
      
      onPositionUpdate: (data) => {
        // Update user position
        setUserPositions(prev => ({
          ...prev,
          [data.userId]: {
            position: data.position || (prev[data.userId]?.position || { x: 0, y: 0, z: 0 }),
            rotation: data.rotation || (prev[data.userId]?.rotation || { x: 0, y: 0, z: 0 })
          }
        }));
      },
      
      onInteraction: (data) => {
        // Handle different interaction types
        switch (data.type) {
          case 'chat':
            // Chat messages are handled by the UI component
            break;
            
          case 'grab':
          case 'release':
          case 'transform':
            // Object interactions
            break;
            
          case 'teleport':
            // Update user position after teleport
            setUserPositions(prev => ({
              ...prev,
              [data.userId]: {
                position: data.position || (prev[data.userId]?.position || { x: 0, y: 0, z: 0 }),
                rotation: data.rotation || (prev[data.userId]?.rotation || { x: 0, y: 0, z: 0 })
              }
            }));
            break;
            
          default:
            // Handle other interaction types if needed
            console.log('VR Interaction:', data);
            break;
        }
      }
    });
    
    return () => {
      cleanupListeners();
    };
  }, [roomId, isJoined]);
  
  return {
    room,
    participants,
    isLoading,
    error,
    isJoined,
    userPositions,
    xrPosition,
    joinRoom,
    leaveRoom,
    updatePosition,
    updateXRPosition,
    sendInteraction,
    roomAssets,
    isLoadingAssets,
    addAssetToRoom,
    updateRoomAsset,
    removeAssetFromRoom,
    interactWithAsset
  };
};

export default useVirtualRoom;