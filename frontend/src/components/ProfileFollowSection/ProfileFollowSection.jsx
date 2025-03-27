import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Tabs, Tab, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import followService from '../../services/followService';
import FollowersList from '../FollowersList/FollowersList';
import './ProfileFollowSection.scss';

/**
 * ProfileFollowSection - Displays followers and following tabs on a user's profile
 * @param {string} userId - ID of the user whose profile is being viewed
 * @param {boolean} isOwnProfile - Whether the profile belongs to the logged-in user
 */
const ProfileFollowSection = ({ userId, isOwnProfile = false }) => {
  const [counts, setCounts] = useState({ followers: 0, following: 0 });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('followers');

  useEffect(() => {
    fetchFollowCounts();
  }, [userId]);

  const fetchFollowCounts = async () => {
    try {
      setLoading(true);
      const response = await followService.getFollowCounts(userId);
      setCounts(response.data);
    } catch (error) {
      console.error('Error fetching follow counts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabSelect = (key) => {
    setActiveTab(key);
  };

  return (
    <div className="profile-follow-section my-4">
      <Card>
        <Card.Header>
          <div className="d-flex justify-content-between align-items-center">
            <h4 className="mb-0">Connections</h4>
            <div className="follow-counts">
              <span className="me-3">
                <strong>{counts.followers}</strong> {counts.followers === 1 ? 'Follower' : 'Followers'}
              </span>
              <span>
                <strong>{counts.following}</strong> Following
              </span>
            </div>
          </div>
        </Card.Header>
        <Card.Body>
          <Tabs
            activeKey={activeTab}
            onSelect={handleTabSelect}
            className="mb-3 profile-follow-tabs"
          >
            <Tab eventKey="followers" title="Followers">
              <FollowersList 
                userId={userId} 
                type="followers" 
                limit={10} 
                maxHeight="400px"
              />
            </Tab>
            <Tab eventKey="following" title="Following">
              <FollowersList 
                userId={userId} 
                type="following" 
                limit={10} 
                maxHeight="400px"
              />
            </Tab>
          </Tabs>
        </Card.Body>
        {isOwnProfile && (
          <Card.Footer>
            <Link to="/discover" className="text-decoration-none">
              <Button variant="outline-primary" className="w-100">
                Discover more creators to follow
              </Button>
            </Link>
          </Card.Footer>
        )}
      </Card>
    </div>
  );
};

export default ProfileFollowSection;