# PrimePlus+ API Documentation

## Authentication

### POST /api/auth/login
Login with email and password.

**Request:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "email": "string",
    "username": "string",
    "role": "string"
  }
}
```

### POST /api/auth/register
Register a new user account.

**Request:**
```json
{
  "email": "string",
  "password": "string",
  "username": "string",
  "fullName": "string"
}
```

**Response:**
```json
{
  "id": "string",
  "email": "string",
  "username": "string",
  "createdAt": "string"
}
```

## Profile

### GET /api/profile/:username
Get user profile data.

**Response:**
```json
{
  "id": "string",
  "username": "string",
  "fullName": "string",
  "bio": "string",
  "avatarUrl": "string",
  "coverUrl": "string",
  "location": "string",
  "website": "string",
  "socialLinks": {
    "twitter": "string",
    "instagram": "string",
    "youtube": "string"
  },
  "stats": {
    "postsCount": "number",
    "followersCount": "number",
    "followingCount": "number",
    "totalViews": "number",
    "totalLikes": "number"
  },
  "subscriptionPlans": [
    {
      "id": "string",
      "name": "string",
      "price": "number",
      "description": "string",
      "features": ["string"]
    }
  ]
}
```

### PATCH /api/profile
Update user profile. Requires authentication.

**Request:**
```json
{
  "fullName": "string",
  "bio": "string",
  "location": "string",
  "website": "string",
  "socialLinks": {
    "twitter": "string",
    "instagram": "string",
    "youtube": "string"
  }
}
```

## Content

### POST /api/posts
Create a new post. Requires authentication.

**Request:**
```json
{
  "title": "string",
  "description": "string",
  "mediaItems": [
    {
      "type": "photo|video|vr",
      "url": "string",
      "thumbnailUrl": "string",
      "accessType": "free|subscription|purchase",
      "price": "number"
    }
  ],
  "isScheduled": "boolean",
  "scheduledDate": "string",
  "tags": ["string"]
}
```

### GET /api/posts
Get posts with pagination and filters.

**Query Parameters:**
- page: number
- limit: number
- username: string
- type: "photo|video|vr"
- access: "free|subscription|purchase"

**Response:**
```json
{
  "posts": [
    {
      "id": "string",
      "title": "string",
      "description": "string",
      "mediaItems": [
        {
          "type": "string",
          "url": "string",
          "thumbnailUrl": "string",
          "accessType": "string",
          "price": "number"
        }
      ],
      "author": {
        "username": "string",
        "avatarUrl": "string"
      },
      "stats": {
        "views": "number",
        "likes": "number",
        "comments": "number"
      },
      "createdAt": "string"
    }
  ],
  "totalCount": "number",
  "hasMore": "boolean"
}
```

## Subscriptions

### POST /api/subscriptions/plans
Create subscription plan. Requires creator authentication.

**Request:**
```json
{
  "name": "string",
  "price": "number",
  "description": "string",
  "features": ["string"],
  "duration": "number"
}
```

### POST /api/subscriptions/subscribe
Subscribe to a creator's plan.

**Request:**
```json
{
  "planId": "string",
  "paymentMethodId": "string"
}
```

## Media Upload

### POST /api/upload/presigned
Get presigned URL for media upload.

**Request:**
```json
{
  "fileName": "string",
  "fileType": "string",
  "fileSize": "number"
}
```

**Response:**
```json
{
  "uploadUrl": "string",
  "fileUrl": "string",
  "fields": {
    "key": "string",
    "bucket": "string",
    "X-Amz-Algorithm": "string",
    "X-Amz-Credential": "string",
    "X-Amz-Date": "string",
    "Policy": "string",
    "X-Amz-Signature": "string"
  }
}
```

## Notifications

### GET /api/notifications
Get user notifications. Requires authentication.

**Query Parameters:**
- page: number
- limit: number
- type: "all|unread"

**Response:**
```json
{
  "notifications": [
    {
      "id": "string",
      "type": "string",
      "message": "string",
      "data": "object",
      "isRead": "boolean",
      "createdAt": "string"
    }
  ],
  "unreadCount": "number",
  "hasMore": "boolean"
}
```

### POST /api/notifications/read
Mark notifications as read. Requires authentication.

**Request:**
```json
{
  "notificationIds": ["string"]
}
```

## Analytics

### GET /api/analytics/overview
Get creator analytics overview. Requires creator authentication.

**Query Parameters:**
- timeframe: "day|week|month|year"

**Response:**
```json
{
  "views": {
    "total": "number",
    "change": "number",
    "data": [
      {
        "date": "string",
        "value": "number"
      }
    ]
  },
  "revenue": {
    "total": "number",
    "change": "number",
    "data": [
      {
        "date": "string",
        "value": "number"
      }
    ]
  },
  "subscribers": {
    "total": "number",
    "change": "number",
    "data": [
      {
        "date": "string",
        "value": "number"
      }
    ]
  }
}
```

## Error Responses

All endpoints may return the following error responses:

### 400 Bad Request
```json
{
  "error": "string",
  "message": "string",
  "details": "object"
}
```

### 401 Unauthorized
```json
{
  "error": "Unauthorized",
  "message": "Authentication required"
}
```

### 403 Forbidden
```json
{
  "error": "Forbidden",
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "Not Found",
  "message": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "error": "Too Many Requests",
  "message": "Rate limit exceeded",
  "retryAfter": "number"
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal Server Error",
  "message": "An unexpected error occurred"
}
```

## Authentication

All authenticated endpoints require a Bearer token in the Authorization header:

```
Authorization: Bearer <token>
```

## Rate Limiting

- Public API: 100 requests per minute
- Authenticated API: 1000 requests per minute
- Media upload: 50 requests per hour

## Pagination

Endpoints that return lists support pagination through query parameters:

- page: Page number (default: 1)
- limit: Items per page (default: 20, max: 100)

Response includes:
- hasMore: Boolean indicating if more items exist
- totalCount: Total number of items (when available)

## Versioning

Current API version: v1
Include version in URL: `/api/v1/endpoint`

## WebSocket Events

### Connection
```javascript
ws://api.primeplus.com/ws?token=<auth_token>
```

### Events
```javascript
// New notification
{
  "type": "notification",
  "data": {
    "id": "string",
    "type": "string",
    "message": "string",
    "data": "object",
    "createdAt": "string"
  }
}

// Live stream status
{
  "type": "stream_status",
  "data": {
    "streamId": "string",
    "status": "live|ended",
    "viewerCount": "number"
  }
}

// Content interaction
{
  "type": "content_interaction",
  "data": {
    "contentId": "string",
    "type": "view|like|comment",
    "user": {
      "username": "string",
      "avatarUrl": "string"
    }
  }
}
``` 