import React, { useState, useEffect } from 'react';
import { Button, Spinner } from 'react-bootstrap';
import { useUser } from '../../context/UserContext';
import followService from '../../services/followService';
import './FollowButton.scss';

/**
 * FollowButton - A component for following/unfollowing creators
 * @param {string} creatorId - The ID of the creator to follow/unfollow
 * @param {boolean} initialFollowState - Optional initial follow state
 * @param {function} onFollowChange - Optional callback when follow state changes
 * @param {string} size - Button size ('sm', 'md', 'lg')
 * @param {string} variant - Button variant ('primary', 'outline-primary', etc.)
 * @param {boolean} showFollowingText - Whether to show "Following" when followed
 */
const FollowButton = ({
  creatorId,
  initialFollowState,
  onFollowChange,
  size = 'md',
  variant = 'primary',
  showFollowingText = true,
  className = '',
}) => {
  const { user } = useUser();
  const [isFollowing, setIsFollowing] = useState(initialFollowState || false);
  const [loading, setLoading] = useState(initialFollowState === undefined);
  const [isHovered, setIsHovered] = useState(false);

  // Fetch initial follow status if not provided
  useEffect(() => {
    if (initialFollowState === undefined && user) {
      checkFollowStatus();
    }
  }, [user, creatorId]);

  const checkFollowStatus = async () => {
    try {
      setLoading(true);
      const { isFollowing } = await followService.checkFollowStatus(creatorId);
      setIsFollowing(isFollowing);
    } catch (error) {
      console.error('Error checking follow status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFollow = async () => {
    if (!user) {
      // Redirect to login if not logged in
      // You could use a context or a redirect function here
      window.location.href = '/login?redirect=' + encodeURIComponent(window.location.pathname);
      return;
    }

    try {
      setLoading(true);
      
      if (isFollowing) {
        await followService.unfollowCreator(creatorId);
        setIsFollowing(false);
      } else {
        await followService.followCreator(creatorId);
        setIsFollowing(true);
      }
      
      // Call the callback if provided
      if (onFollowChange) {
        onFollowChange(isFollowing);
      }
    } catch (error) {
      console.error('Error changing follow status:', error);
    } finally {
      setLoading(false);
    }
  };

  // Don't show the button if viewing own profile
  if (user && user.id === creatorId) {
    return null;
  }

  // Determine button text and variant
  let buttonText = 'Follow';
  let buttonVariant = variant;
  
  if (isFollowing) {
    buttonText = isHovered ? 'Unfollow' : (showFollowingText ? 'Following' : 'Follow');
    buttonVariant = isHovered ? 'danger' : variant;
  }

  return (
    <Button
      variant={buttonVariant}
      size={size}
      className={`follow-button ${className}`}
      onClick={handleFollow}
      disabled={loading}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {loading ? (
        <Spinner animation="border" size="sm" />
      ) : (
        buttonText
      )}
    </Button>
  );
};

export default FollowButton;