# Follow System Integration Guide

This guide explains how to integrate the follow system components into your application.

## Overview

The follow system allows users to follow creators without requiring a paid subscription. This creates a lower-commitment way for users to stay updated with creator content and discover new creators.

## Components

The follow system consists of:

1. **Backend Models and Controllers**:
   - `Follow` model for database relationships
   - `followController.js` for API endpoints
   - `followRoutes.js` for routing

2. **Frontend Services**:
   - `followService.js` for API communication
   - `FollowContext.jsx` for state management

3. **UI Components**:
   - `FollowButton` - Button to follow/unfollow creators
   - `FollowersList` - List of followers or following
   - `ProfileFollowSection` - Section for profile pages showing followers/following

## Integration Steps

### 1. Backend Integration

The backend endpoints are already set up at `/api/follows/*`. These include:

- `POST /api/follows/creator/:creatorId` - Follow a creator
- `DELETE /api/follows/creator/:creatorId` - Unfollow a creator
- `GET /api/follows/status/:creatorId` - Check follow status
- `GET /api/follows/followers/:creatorId` - Get creator's followers
- `GET /api/follows/following/:userId?` - Get user's following list
- `GET /api/follows/counts/:creatorId` - Get follow counts

### 2. Frontend Provider Setup

1. Add the `FollowProvider` to your application:

```jsx
// In your _app.js or main layout
import { FollowProvider } from '../context/FollowContext';
import { UserProvider } from '../context/UserContext';

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <FollowProvider>
        <Component {...pageProps} />
      </FollowProvider>
    </UserProvider>
  );
}

export default MyApp;
```

Alternatively, use the combined RootProvider:

```jsx
// In your _app.js or main layout
import RootProvider from '../providers/RootProvider';

function MyApp({ Component, pageProps }) {
  return (
    <RootProvider>
      <Component {...pageProps} />
    </RootProvider>
  );
}

export default MyApp;
```

### 3. Using the FollowButton

Add the follow button to creator profiles, discovery pages, or anywhere you want to allow following:

```jsx
import FollowButton from '../components/FollowButton/FollowButton';

function CreatorCard({ creator }) {
  return (
    <div className="creator-card">
      <img src={creator.profileImage} alt={creator.username} />
      <h3>{creator.fullName}</h3>
      <p>@{creator.username}</p>
      <FollowButton 
        creatorId={creator.id} 
        variant="outline-primary"
        size="sm"
      />
    </div>
  );
}
```

### 4. Using the FollowersList

Display followers or following lists on profile pages or in modals:

```jsx
import FollowersList from '../components/FollowersList/FollowersList';

function FollowersTab({ creatorId }) {
  return (
    <div className="followers-container">
      <FollowersList
        userId={creatorId}
        type="followers"
        limit={20}
        showPagination={true}
      />
    </div>
  );
}
```

### 5. Using the ProfileFollowSection

Add the complete follow section to user profiles:

```jsx
import ProfileFollowSection from '../components/ProfileFollowSection/ProfileFollowSection';

function CreatorProfile({ creator, isOwnProfile }) {
  return (
    <div className="profile-page">
      <h1>{creator.fullName}</h1>
      <p>@{creator.username}</p>
      
      {/* Other profile content */}
      
      <ProfileFollowSection 
        userId={creator.id}
        isOwnProfile={isOwnProfile}
      />
    </div>
  );
}
```

### 6. Using the FollowContext Hook

For custom components or logic, use the useFollow hook:

```jsx
import { useFollow } from '../context/FollowContext';

function CustomFollowComponent({ creatorId }) {
  const { 
    isFollowing, 
    followCreator, 
    unfollowCreator, 
    toggleFollow 
  } = useFollow();
  
  const following = isFollowing(creatorId);
  
  return (
    <div>
      <p>Status: {following ? 'Following' : 'Not following'}</p>
      <button onClick={() => toggleFollow(creatorId)}>
        {following ? 'Unfollow' : 'Follow'}
      </button>
    </div>
  );
}
```

## Advanced Usage

### 1. Getting Follow Counts

```jsx
import { useFollow } from '../context/FollowContext';

function FollowStats({ creatorId }) {
  const { getFollowCountsForCreator } = useFollow();
  const [counts, setCounts] = useState({ followers: 0, following: 0 });
  
  useEffect(() => {
    const loadCounts = async () => {
      const result = await getFollowCountsForCreator(creatorId);
      setCounts(result);
    };
    
    loadCounts();
  }, [creatorId]);
  
  return (
    <div className="follow-stats">
      <div>{counts.followers} Followers</div>
      <div>{counts.following} Following</div>
    </div>
  );
}
```

### 2. Custom Follow Button Styling

You can customize the FollowButton by passing additional props:

```jsx
<FollowButton
  creatorId={creator.id}
  variant="primary" // or "outline-primary", "success", etc.
  size="lg" // or "sm", "md"
  showFollowingText={false} // Show "Follow" instead of "Following" when followed
  className="custom-button-class" // Additional CSS classes
/>
```

## Troubleshooting

- **Button not changing state**: Ensure the FollowProvider is correctly set up in your application hierarchy
- **API errors**: Check browser console for detailed error messages
- **User not authorized**: Verify the user is logged in before attempting follow actions

## Database Changes

The follow system introduces a new `follows` table with these relationships:

- User can follow many creators
- Creator can have many followers
- Follow status is tracked with creation timestamp

These changes are handled by the database migration when running the application.