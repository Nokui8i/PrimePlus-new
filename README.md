# PrimePlus+ Platform

A modern content creator platform built with Next.js, TypeScript, and Tailwind CSS.

## Project Status

### 🟢 Recently Completed
- Enhanced CreatePostForm with drag & drop and creator settings
- Improved profile page layout and bio editor
- Implemented content type detection system
- Added subscription plan integration
- Enhanced media upload capabilities
- Implemented VR/3D model support

### 🔄 In Progress
- Enhancing content preview functionality
- Optimizing media processing
- Improving user experience for creators
- Finalizing subscription management

### 🔜 Up Next
- Analytics dashboard
- Content moderation system
- Enhanced VR content features
- Advanced search capabilities

## Core Features

### Implemented ✅
- Base layout structure
- Navigation system
- Dark/Light mode theming
- Profile management
- Content creation interface
- Media upload with drag & drop
- Bio editor
- Subscription plan integration
- Content type detection
- VR/3D model support

### In Development 🚧
- Analytics system
- Enhanced search
- Content moderation
- Advanced VR features

### Planned 📋
- Live streaming
- Community features
- Advanced analytics
- AI-powered content recommendations

## Technical Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **UI Components**: Headless UI, Custom Components
- **State Management**: React Context, Zustand
- **Media Handling**: react-dropzone, FFmpeg
- **3D/VR**: Three.js
- **Backend**: Node.js, Express, Prisma
- **Database**: PostgreSQL
- **Authentication**: JWT, OAuth
- **Storage**: AWS S3
- **Media Processing**: FFmpeg

## Component Architecture

### Content Creation
- **CreatePostForm**: Advanced post creation with:
  - Drag & drop media upload
  - Content type detection
  - Subscription plan integration
  - Creator settings management
  - Thumbnail generation
  - VR/3D model support

### Profile Management
- **BioEditor**: Profile bio editing with:
  - Inline editing
  - Character count
  - Emoji support
  - Auto-save functionality

### Media Management
- **MediaUpload**: Unified media upload with:
  - Multi-file support
  - Progress tracking
  - Preview generation
  - Type validation
  - Size limits

### VR/3D Content
- **VRViewer**: 3D content viewer with:
  - Model loading
  - Camera controls
  - Animation support
  - Environment mapping

### Creator Tools
- **CreatorSettings**: Content management with:
  - Access control
  - Pricing options
  - Subscription integration
  - Content categorization

## Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL
- FFmpeg

### Installation
1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Set up environment variables
4. Initialize the database:
   ```bash
   npm run db:setup
   ```
5. Start the development server:
   ```bash
   npm run dev
   ```

## Contributing

Please read our [Contributing Guidelines](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
