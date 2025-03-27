import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from './UserContext';
import followService from '../services/followService';

// Create the context
const FollowContext = createContext();

/**
 * FollowProvider - Context provider for follow-related functionality
 * Manages state for following/followers and provides methods to interact with them
 */
export const FollowProvider = ({ children }) => {
  const { user } = useUser();
  const [followedCreators, setFollowedCreators] = useState([]);
  const [followingLoaded, setFollowingLoaded] = useState(false);
  const [followCounts, setFollowCounts] = useState({});

  // Load followed creators when user changes
  useEffect(() => {
    if (user) {
      loadFollowedCreators();
    } else {
      setFollowedCreators([]);
      setFollowingLoaded(false);
    }
  }, [user]);

  // Load creators that the user is following
  const loadFollowedCreators = async () => {
    try {
      const response = await followService.getFollowing(null, 1, 100);
      setFollowedCreators(response.data);
      setFollowingLoaded(true);
    } catch (error) {
      console.error('Error loading followed creators:', error);
      setFollowingLoaded(true);
    }
  };

  // Check if user is following a specific creator
  const isFollowing = (creatorId) => {
    return followedCreators.some(creator => creator.id === creatorId);
  };

  // Follow a creator
  const followCreator = async (creatorId) => {
    if (!user) return false;
    
    try {
      await followService.followCreator(creatorId);
      
      // Get the creator details
      const creatorResponse = await followService.getFollowing(null, 1, 1);
      const creator = creatorResponse.data.find(c => c.id === creatorId);
      
      // Update the local state
      if (creator) {
        setFollowedCreators(prev => [creator, ...prev]);
      } else {
        // If creator details not found, just reload all
        await loadFollowedCreators();
      }
      
      return true;
    } catch (error) {
      console.error('Error following creator:', error);
      return false;
    }
  };

  // Unfollow a creator
  const unfollowCreator = async (creatorId) => {
    if (!user) return false;
    
    try {
      await followService.unfollowCreator(creatorId);
      
      // Update the local state
      setFollowedCreators(prev => prev.filter(creator => creator.id !== creatorId));
      
      return true;
    } catch (error) {
      console.error('Error unfollowing creator:', error);
      return false;
    }
  };

  // Get follow counts for a creator
  const getFollowCountsForCreator = async (creatorId) => {
    try {
      // Check if we already have this creator's counts cached
      if (followCounts[creatorId]) {
        return followCounts[creatorId];
      }
      
      const response = await followService.getFollowCounts(creatorId);
      const counts = response.data;
      
      // Cache the results
      setFollowCounts(prev => ({
        ...prev,
        [creatorId]: counts
      }));
      
      return counts;
    } catch (error) {
      console.error('Error getting follow counts:', error);
      return { followers: 0, following: 0 };
    }
  };

  // Toggle follow status
  const toggleFollow = async (creatorId) => {
    if (!user) return false;
    
    const following = isFollowing(creatorId);
    
    if (following) {
      return await unfollowCreator(creatorId);
    } else {
      return await followCreator(creatorId);
    }
  };

  // Value to be provided by the context
  const value = {
    followedCreators,
    followingLoaded,
    isFollowing,
    followCreator,
    unfollowCreator,
    toggleFollow,
    getFollowCountsForCreator,
    loadFollowedCreators
  };

  return <FollowContext.Provider value={value}>{children}</FollowContext.Provider>;
};

// Custom hook to use the follow context
export const useFollow = () => {
  const context = useContext(FollowContext);
  
  if (context === undefined) {
    throw new Error('useFollow must be used within a FollowProvider');
  }
  
  return context;
};

export default FollowContext;