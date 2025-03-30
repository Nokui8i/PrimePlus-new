# PrimePlus+ Frontend

The frontend application for the PrimePlus+ platform, built with Next.js, TypeScript, and Tailwind CSS.

## Features

### ✅ Completed Features
- 🎨 Modern, responsive design with Tailwind CSS
- 🌙 Dark mode support
- 📝 Advanced content creation interface
- 🖼️ Drag & drop media upload
- 🎮 VR/3D model support
- 👤 Enhanced profile management
- 💰 Subscription plan integration
- 🔍 Content type detection
- 📸 Thumbnail generation
- 🎯 Creator settings management

### 🟡 In Progress Features
- 📊 Analytics dashboard
- 🛡️ Content moderation
- 🎮 Enhanced VR features
- 🔍 Advanced search

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Headless UI
- React Query
- Zustand for state management
- Three.js for VR/3D
- react-dropzone for file uploads
- FFmpeg for media processing

## Project Structure

```
frontend/
├── src/
│   ├── app/           # Next.js app router pages
│   │   ├── (auth)/    # Authentication pages
│   │   ├── (main)/    # Main application pages
│   │   ├── api/       # API routes
│   │   └── layout.tsx # Root layout
│   ├── components/    # Reusable components
│   │   ├── common/    # Shared components
│   │   ├── content/   # Content creation components
│   │   ├── profile/   # Profile components
│   │   ├── vr/        # VR-related components
│   │   └── layout/    # Layout components
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utility functions
│   ├── store/        # State management
│   └── types/        # TypeScript types
├── public/           # Static assets
└── package.json
```

## Component Documentation

### Content Creation Components

#### CreatePostForm
Location: `components/content/CreatePostForm.tsx`
Purpose: Advanced post creation interface

Features:
- Drag & drop media upload
- Multiple file support
- Content type detection
- Subscription plan integration
- Creator settings management
- Thumbnail generation
- VR/3D model support

Props:
```typescript
interface CreatePostFormProps {
  onPostCreated?: () => void;
  subscriptionPlans?: Array<{
    id: string;
    name: string;
    price: number;
    contentAccess: {
      regularContent: boolean;
      premiumVideos: boolean;
      vrContent: boolean;
      threeSixtyContent: boolean;
      liveRooms: boolean;
      interactiveModels: boolean;
    };
  }>;
}
```

Usage:
```jsx
<CreatePostForm 
  onPostCreated={() => console.log('Post created!')}
  subscriptionPlans={subscriptionPlans}
/>
```

### Profile Components

#### BioEditor
Location: `components/profile/BioEditor.tsx`
Purpose: Inline bio editing component

Features:
- Inline editing
- Character count
- Emoji support
- Auto-save functionality
- Hover states
- Error handling

Props:
```typescript
interface BioEditorProps {
  initialBio: string;
  onSave: (bio: string) => Promise<void>;
  maxLength?: number;
  placeholder?: string;
}
```

Usage:
```jsx
<BioEditor
  initialBio="Hello World"
  onSave={async (bio) => {
    await updateBio(bio);
  }}
  maxLength={500}
/>
```

### VR Components

#### VRViewer
Location: `components/vr/VRViewer.tsx`
Purpose: 3D content viewer

Features:
- Model loading
- Camera controls
- Animation support
- Environment mapping
- Screenshot generation
- Performance optimization

Props:
```typescript
interface VRViewerProps {
  mediaUrl: string;
  contentType: 'model' | '360-video' | '360-image';
  title?: string;
  options?: VROptions;
}
```

Usage:
```jsx
<VRViewer
  mediaUrl="/path/to/model.glb"
  contentType="model"
  options={vrOptions}
/>
```

### Media Components

#### MediaUpload
Location: `components/content/MediaUpload.tsx`
Purpose: Unified media upload component

Features:
- Multi-file support
- Progress tracking
- Preview generation
- Type validation
- Size limits
- Error handling

Props:
```typescript
interface MediaUploadProps {
  onUpload: (files: File[]) => void;
  accept?: Record<string, string[]>;
  maxSize?: number;
  maxFiles?: number;
}
```

Usage:
```jsx
<MediaUpload
  onUpload={(files) => handleFiles(files)}
  accept={{
    'image/*': [],
    'video/*': [],
    'model/gltf-binary': ['.glb']
  }}
  maxSize={100 * 1024 * 1024} // 100MB
/>
```

### Creator Components

#### CreatorSettings
Location: `components/creator/CreatorSettings.tsx`
Purpose: Content management interface

Features:
- Access control
- Pricing options
- Subscription integration
- Content categorization
- Tooltips and help text
- Validation

Props:
```typescript
interface CreatorSettingsProps {
  subscriptionPlans: SubscriptionPlan[];
  onChange: (settings: VisibilitySettings) => void;
  initialSettings?: Partial<VisibilitySettings>;
}
```

Usage:
```jsx
<CreatorSettings
  subscriptionPlans={plans}
  onChange={handleSettingsChange}
  initialSettings={currentSettings}
/>
```

## Pages

### Authentication (✅ Completed)
- /login - User login
- /register - User registration
- /forgot-password - Password recovery
- /reset-password - Password reset

### Main Application (✅ Completed)
- / - Home feed
- /explore - Content discovery
- /search - Search interface
- /notifications - User notifications
- /messages - Direct messages
- /settings - User settings

### User Profiles (✅ Completed)
- /profile - Current user profile
- /profile/[username] - Other user profiles
- /profile/edit - Profile editor

### Content Creation (✅ Completed)
- /create/post - Create new post
- /create/vr - Create VR content
- /create/collection - Create collection

### VR Experience (🟡 In Progress)
- /vr/[id] - View VR content
- /vr/create - Create VR content
- /vr/explore - Browse VR content

## Components

### Common Components (✅ Completed)
- Button
- Input
- Card
- Modal
- Avatar
- Loading
- ErrorBoundary

### Layout Components (✅ Completed)
- Header
- Footer
- Sidebar
- Navigation
- Container

### VR Components (🟡 In Progress)
- VRViewer
- VRControls
- VRScene
- VRHotspots

## State Management

The application uses Zustand for state management with the following stores:

- authStore - Authentication state
- userStore - User profile state
- uiStore - UI state (theme, sidebar, etc.)
- vrStore - VR viewer state

## API Integration

The frontend communicates with the backend through:

- REST API calls using axios
- WebSocket connections for real-time features
- React Query for data fetching and caching

## Current Status

### Completed Features
1. Authentication System
   - JWT-based login/registration
   - Role-based authorization
   - Profile management

2. Content Management
   - Text and media posts
   - Content upload system
   - Media processing

3. User Interface
   - Responsive design
   - Dark mode support
   - Mobile-first approach

### In Progress
1. VR Content System
   - Basic VR page structure
   - Mock data implementation
   - API endpoints development

2. Authentication Improvements
   - Logout functionality
   - Session management
   - OAuth support

### Known Issues
1. Logout functionality needs improvement
2. VR content not displaying properly
3. Some image uploads failing
4. Video processing optimization needed

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables:
```bash
cp .env.example .env.local
# Update .env.local with your configuration
```

3. Start the development server:
```bash
npm run dev
```

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests

### Component Guidelines

1. Use TypeScript for all components
2. Implement proper error handling
3. Add loading states
4. Make components responsive
5. Add proper accessibility attributes
6. Include unit tests
7. Follow the project's naming conventions
8. Document props and usage

## Testing

Run tests with:
```bash
npm test
```

## Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## Contributing

1. Create a feature branch
2. Make your changes
3. Run tests
4. Submit a pull request

## License

This project is licensed under the MIT License.
