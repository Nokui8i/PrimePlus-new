# API Documentation

## Content Creation Endpoints

### Create Post
`POST /api/posts`

Creates a new post with various content types.

#### Request Body (FormData)
```typescript
{
  content: string;
  contentType: 'TEXT' | 'MEDIA' | 'VR' | '360' | 'LIVE';
  media?: File;
  thumbnail?: File;
}
```

#### Response
```typescript
{
  id: string;
  content: string;
  contentType: string;
  mediaUrl?: string;
  thumbnailUrl?: string;
  createdAt: string;
  author: {
    id: string;
    username: string;
    isVerified: boolean;
  }
}
```

### VR Content
`POST /api/vr`

Creates a new VR experience.

#### Request Body (FormData)
```typescript
{
  scene: string; // JSON stringified scene data
  content: string;
  thumbnail?: File;
}
```

### 360° Content
`POST /api/360`

Creates new 360° content.

#### Request Body (FormData)
```typescript
{
  content: string; // JSON stringified content data
  file: File;
  thumbnail?: File;
}
```

### Live Streaming
`POST /api/live/start`

Starts a new live stream.

#### Request Body (FormData)
```typescript
{
  content: string;
  thumbnail?: File;
}
```

## File Size Limits

### Media Upload Limits
- Images: 2GB
- Videos: 10GB
- Thumbnails: 100MB
- VR Content: Based on type
- 360° Content: Based on type
- Live Stream: No fixed limit

## Error Responses

### Common Error Structure
```typescript
{
  error: {
    code: string;
    message: string;
    details?: any;
  }
}
```

### Error Codes
- `FILE_TOO_LARGE`: File exceeds size limit
- `INVALID_FILE_TYPE`: Unsupported file type
- `UNAUTHORIZED`: User not authenticated
- `FORBIDDEN`: User not authorized
- `NOT_VERIFIED`: Creator verification required
- `UPLOAD_FAILED`: File upload failed
- `STREAM_ERROR`: Live stream error

## Authentication

All endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <token>
```

## Rate Limiting

- Standard rate limit: 100 requests per minute
- File upload rate limit: 10 uploads per minute
- Live streaming rate limit: 1 active stream per user

## WebSocket Endpoints

### Live Streaming
`ws://api/live/stream/<streamId>`

Real-time communication for live streaming:
- Viewer count updates
- Chat messages
- Stream status changes
- Quality adjustments

## Development vs Production

### Development
- Larger file size limits
- Relaxed rate limiting
- Additional debugging information
- Local storage for files

### Production
- Strict file size enforcement
- CDN integration
- Cloud storage
- Caching layer
- Load balancing 