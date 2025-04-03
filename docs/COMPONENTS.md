# Component Documentation

## Shared Components

### MediaUpload
A reusable component for handling file uploads with drag-and-drop support.

```typescript
interface MediaUploadProps {
  onUpload: (file: File) => void
  onRemove: () => void
  accept: Record<string, string[]>
  maxSize?: number
  currentFile?: File | null
  uploadProgress?: number
  className?: string
}
```

#### Features
- Drag and drop support
- File type validation
- Size limit validation
- Upload progress indicator
- File preview
- Remove functionality

#### Usage
```tsx
<MediaUpload
  onUpload={handleUpload}
  onRemove={handleRemove}
  accept={{ 'image/*': ['.jpg', '.jpeg', '.png', '.gif'] }}
  maxSize={2 * 1024 * 1024 * 1024} // 2GB
  currentFile={file}
  uploadProgress={progress}
/>
```

### TipSettings
Component for managing tip settings for content monetization.

```typescript
interface TipSettingsProps {
  isVerifiedCreator: boolean
  tipAmount: number
  onTipAmountChange: (amount: number) => void
}
```

## Feed Components

### CreatePost
Main component for creating various types of content.

#### Features
- Multiple content types:
  - Text posts
  - Media (images/videos)
  - VR experiences
  - 360° content
  - Live streams
- File upload handling
- Preview functionality
- Thumbnail support for videos
- Tip settings integration
- Creator verification check

#### Content Type Specific Features

1. **Text Posts**
   - Rich text input
   - Character limit handling
   - Basic formatting

2. **Media Posts**
   - Image upload (up to 2GB)
   - Video upload (up to 10GB)
   - Thumbnail support (up to 100MB)
   - Preview functionality
   - Progress tracking

3. **VR Content**
   - Scene builder integration
   - Device compatibility check
   - Preview capability
   - Custom thumbnails

4. **360° Content**
   - 360° media upload
   - Orientation controls
   - Preview functionality
   - Custom thumbnails

5. **Live Streams**
   - Stream setup
   - Camera/mic controls
   - Quality settings
   - Custom thumbnails

## VR Components

### VRSceneBuilder
Component for creating and editing VR experiences.

```typescript
interface VRSceneBuilderProps {
  onSave: (scene: any) => void
  onCancel: () => void
  isDevelopment?: boolean
  isVerifiedCreator: boolean
  saveButtonText?: string
}
```

## 360° Components

### ThreeSixtyCreator
Component for creating and editing 360° content.

```typescript
interface ThreeSixtyCreatorProps {
  onSave: (content: any) => void
  onCancel: () => void
  isVerifiedCreator: boolean
  saveButtonText?: string
}
```

## Live Streaming Components

### LiveStreamCreator
Component for setting up and managing live streams.

```typescript
interface LiveStreamCreatorProps {
  onStart: (stream: MediaStream) => void
  onStop: () => void
  isVerifiedCreator: boolean
  description: string
  onDescriptionChange: (value: string) => void
}
```

## UI Components

### Dialog
Modal dialog component based on Radix UI.

### Tabs
Tab component for organizing content.

### Button
Reusable button component with various styles.

### Textarea
Text input component for longer form content.

### Progress
Progress indicator component.

## State Management

Components use React's built-in state management with hooks:
- useState for local state
- useCallback for memoized callbacks
- useEffect for side effects

## Error Handling

Components include built-in error handling for:
- File size limits
- File type validation
- Upload failures
- API errors
- Device compatibility 