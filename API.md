# API Documentation

## Base URL

```
https://api.primeplus.com/v1
```

## Authentication

### Headers
```
Authorization: Bearer <token>
Content-Type: application/json
```

### Authentication Endpoints

#### Login
```http
POST /auth/login
```

Request body:
```json
{
  "email": "string",
  "password": "string"
}
```

Response:
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "username": "string",
    "fullName": "string",
    "email": "string",
    "avatar": "string",
    "isCreator": boolean,
    "isVerified": boolean
  }
}
```

#### Register
```http
POST /auth/register
```

Request body:
```json
{
  "username": "string",
  "fullName": "string",
  "email": "string",
  "password": "string"
}
```

Response:
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "username": "string",
    "fullName": "string",
    "email": "string",
    "avatar": "string",
    "isCreator": boolean,
    "isVerified": boolean
  }
}
```

## User Endpoints

### Get User Profile
```http
GET /users/:id
```

Response:
```json
{
  "id": "string",
  "username": "string",
  "fullName": "string",
  "email": "string",
  "avatar": "string",
  "bio": "string",
  "coverImage": "string",
  "isVerified": boolean,
  "isCreator": boolean,
  "joinDate": "string",
  "followers": number,
  "following": number,
  "posts": number,
  "postsCount": number,
  "followersCount": number,
  "followingCount": number,
  "totalViews": number,
  "totalLikes": number,
  "totalComments": number
}
```

### Update User Profile
```http
PUT /users/:id
```

Request body:
```json
{
  "fullName": "string",
  "bio": "string",
  "location": "string",
  "website": "string"
}
```

Response:
```json
{
  "id": "string",
  "username": "string",
  "fullName": "string",
  "email": "string",
  "avatar": "string",
  "bio": "string",
  "coverImage": "string",
  "location": "string",
  "website": "string",
  "isVerified": boolean,
  "isCreator": boolean
}
```

## Content Endpoints

### Create Post
```http
POST /posts
```

Request body:
```json
{
  "title": "string",
  "content": "string",
  "description": "string",
  "media": [
    {
      "type": "image" | "video" | "vr",
      "url": "string",
      "thumbnail": "string",
      "subscriptionPackId": "string" | null,
      "includeInSubscription": boolean,
      "individualPrice": number
    }
  ],
  "isScheduled": boolean,
  "scheduledDate": "string"
}
```

Response:
```json
{
  "id": "string",
  "title": "string",
  "content": "string",
  "description": "string",
  "thumbnail": "string",
  "createdAt": "string",
  "updatedAt": "string",
  "authorId": "string",
  "creator": {
    "id": "string",
    "username": "string",
    "fullName": "string",
    "avatar": "string"
  },
  "likes": number,
  "comments": number,
  "views": number,
  "isPremium": boolean,
  "media": [
    {
      "type": "image" | "video" | "vr",
      "url": "string",
      "thumbnail": "string",
      "subscriptionPackId": "string" | null,
      "includeInSubscription": boolean,
      "individualPrice": number
    }
  ]
}
```

### Get Posts
```http
GET /posts
```

Query parameters:
- `userId`: string (optional)
- `page`: number
- `limit`: number
- `type`: "all" | "premium" | "free"

Response:
```json
{
  "posts": [
    {
      "id": "string",
      "title": "string",
      "content": "string",
      "description": "string",
      "thumbnail": "string",
      "createdAt": "string",
      "updatedAt": "string",
      "authorId": "string",
      "creator": {
        "id": "string",
        "username": "string",
        "fullName": "string",
        "avatar": "string"
      },
      "likes": number,
      "comments": number,
      "views": number,
      "isPremium": boolean,
      "media": [
        {
          "type": "image" | "video" | "vr",
          "url": "string",
          "thumbnail": "string",
          "subscriptionPackId": "string" | null,
          "includeInSubscription": boolean,
          "individualPrice": number
        }
      ]
    }
  ],
  "hasMore": boolean,
  "total": number
}
```

## Subscription Endpoints

### Get Subscription Plans
```http
GET /subscriptions/plans
```

Response:
```json
{
  "plans": [
    {
      "id": "string",
      "name": "string",
      "price": number,
      "description": "string",
      "isActive": boolean,
      "features": string[],
      "intervalInDays": number,
      "contentAccess": {
        "regularContent": boolean,
        "premiumVideos": boolean,
        "vrContent": boolean,
        "threeSixtyContent": boolean,
        "liveRooms": boolean,
        "interactiveModels": boolean
      },
      "createdAt": "string",
      "updatedAt": "string"
    }
  ]
}
```

### Create Subscription
```http
POST /subscriptions
```

Request body:
```json
{
  "planId": "string",
  "paymentMethodId": "string"
}
```

Response:
```json
{
  "id": "string",
  "userId": "string",
  "planId": "string",
  "status": "active" | "cancelled" | "expired",
  "startDate": "string",
  "endDate": "string",
  "autoRenew": boolean
}
```

### Cancel Subscription
```http
DELETE /subscriptions/:id
```

Response:
```json
{
  "id": "string",
  "status": "cancelled",
  "cancelledAt": "string"
}
```

## Creator Dashboard Endpoints

### Get Creator Stats
```http
GET /creator/stats
```

Response:
```json
{
  "totalRevenue": number,
  "activeSubscribers": number,
  "engagementRate": number,
  "contentStats": {
    "totalPosts": number,
    "premiumPosts": number,
    "totalViews": number,
    "totalLikes": number,
    "totalComments": number
  }
}
```

### Get Revenue Analytics
```http
GET /creator/revenue
```

Query parameters:
- `startDate`: string
- `endDate`: string
- `groupBy`: "day" | "week" | "month"

Response:
```json
{
  "revenue": [
    {
      "date": "string",
      "amount": number,
      "breakdown": {
        "subscriptions": number,
        "individualPurchases": number,
        "tips": number
      }
    }
  ],
  "total": number
}
```

### Get Subscriber Analytics
```http
GET /creator/subscribers
```

Query parameters:
- `startDate`: string
- `endDate`: string
- `groupBy`: "day" | "week" | "month"

Response:
```json
{
  "subscribers": [
    {
      "date": "string",
      "newSubscribers": number,
      "cancelledSubscribers": number,
      "activeSubscribers": number
    }
  ],
  "total": {
    "new": number,
    "cancelled": number,
    "active": number
  }
}
```

## Error Responses

### 400 Bad Request
```json
{
  "error": "string",
  "message": "string",
  "details": object
}
```

### 401 Unauthorized
```json
{
  "error": "unauthorized",
  "message": "Invalid or expired token"
}
```

### 403 Forbidden
```json
{
  "error": "forbidden",
  "message": "Insufficient permissions"
}
```

### 404 Not Found
```json
{
  "error": "not_found",
  "message": "Resource not found"
}
```

### 429 Too Many Requests
```json
{
  "error": "rate_limit_exceeded",
  "message": "Too many requests",
  "retryAfter": number
}
```

### 500 Internal Server Error
```json
{
  "error": "internal_server_error",
  "message": "An unexpected error occurred"
}
```

## Rate Limiting

- 100 requests per minute per IP
- 1000 requests per hour per user
- 10000 requests per day per user

## WebSocket Events

### Connection
```javascript
const socket = new WebSocket('wss://api.primeplus.com/v1/ws');
```

### Events

#### Notification
```json
{
  "type": "notification",
  "data": {
    "id": "string",
    "type": "string",
    "message": "string",
    "createdAt": "string"
  }
}
```

#### Subscription Update
```json
{
  "type": "subscription_update",
  "data": {
    "id": "string",
    "status": "string",
    "updatedAt": "string"
  }
}
```

#### Content Update
```json
{
  "type": "content_update",
  "data": {
    "id": "string",
    "type": "string",
    "updatedAt": "string"
  }
}
``` 