import React, { useState, useEffect } from 'react';
import { Card, ListGroup, Spinner, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import followService from '../../services/followService';
import FollowButton from '../FollowButton/FollowButton';
import './FollowersList.scss';

/**
 * FollowersList - A component for displaying followers or following
 * @param {string} userId - The ID of the user to display followers/following for
 * @param {string} type - 'followers' or 'following'
 * @param {string} title - Optional custom title
 * @param {number} limit - Number of users to display per page
 * @param {boolean} showPagination - Whether to show pagination controls
 * @param {string} className - Additional CSS classes
 */
const FollowersList = ({
  userId,
  type = 'followers',
  title,
  limit = 20,
  showPagination = true,
  maxHeight,
  className = '',
}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 1,
  });

  // Default titles based on type
  const defaultTitle = type === 'followers' ? 'Followers' : 'Following';
  const displayTitle = title || defaultTitle;

  // Fetch users based on type
  useEffect(() => {
    fetchUsers();
  }, [userId, type, page]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      let response;

      if (type === 'followers') {
        response = await followService.getFollowers(userId, page, limit);
      } else {
        response = await followService.getFollowing(userId, page, limit);
      }

      setUsers(response.data);
      setPagination(response.pagination);
      setError(null);
    } catch (error) {
      console.error(`Error fetching ${type}:`, error);
      setError(`Failed to load ${type}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < pagination.pages) {
      setPage(page + 1);
    }
  };

  return (
    <Card className={`followers-list ${className}`}>
      <Card.Header>
        <div className="d-flex justify-content-between align-items-center">
          <h5 className="mb-0">{displayTitle}</h5>
          {pagination.total > 0 && (
            <small className="text-muted">{pagination.total} total</small>
          )}
        </div>
      </Card.Header>

      <div className={maxHeight ? `followers-scrollable` : ''} style={maxHeight ? { maxHeight } : {}}>
        {loading ? (
          <div className="text-center p-4">
            <Spinner animation="border" />
          </div>
        ) : error ? (
          <Card.Body className="text-center text-danger">{error}</Card.Body>
        ) : users.length === 0 ? (
          <Card.Body className="text-center text-muted">
            {type === 'followers' ? 'No followers yet' : 'Not following anyone yet'}
          </Card.Body>
        ) : (
          <ListGroup variant="flush">
            {users.map((user) => (
              <ListGroup.Item key={user.id} className="d-flex justify-content-between align-items-center">
                <div className="d-flex align-items-center">
                  <Link to={`/creator/${user.username}`} className="text-decoration-none">
                    <img
                      src={user.profileImage || '/assets/default-avatar.png'}
                      alt={user.username}
                      className="rounded-circle me-2 user-avatar"
                    />
                  </Link>
                  <div>
                    <Link to={`/creator/${user.username}`} className="text-decoration-none">
                      <div className="fw-bold text-truncate user-name">{user.fullName || user.username}</div>
                    </Link>
                    <small className="text-muted">@{user.username}</small>
                  </div>
                </div>
                <FollowButton
                  creatorId={user.id}
                  size="sm"
                  variant="outline-primary"
                  showFollowingText={false}
                />
              </ListGroup.Item>
            ))}
          </ListGroup>
        )}
      </div>

      {showPagination && pagination.pages > 1 && (
        <Card.Footer>
          <div className="d-flex justify-content-between">
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handlePreviousPage}
              disabled={page === 1 || loading}
            >
              Previous
            </Button>
            <small className="text-muted align-self-center">
              Page {page} of {pagination.pages}
            </small>
            <Button
              variant="outline-secondary"
              size="sm"
              onClick={handleNextPage}
              disabled={page === pagination.pages || loading}
            >
              Next
            </Button>
          </div>
        </Card.Footer>
      )}
    </Card>
  );
};

export default FollowersList;