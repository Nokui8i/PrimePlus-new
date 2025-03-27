<<<<<<< HEAD
# PrimePlus+ Frontend

The frontend application for the PrimePlus+ platform, built with Next.js, TypeScript, and Tailwind CSS.

## Features

### ✅ Completed Features
- 🎨 Modern, responsive design
- 🌙 Dark mode support
- 🔄 Real-time updates with WebSocket
- 📱 Mobile-first approach
- 💬 Interactive comments
- 👥 User profiles and following system

### 🟡 In Progress Features
- 🎮 VR content viewer (Basic structure implemented)
- 🔍 Advanced search interface
- 📚 Collections management

## Tech Stack

- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Headless UI
- React Query
- Zustand for state management
- Three.js (VR Support)

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
│   │   ├── creator/   # Creator-specific components
│   │   ├── vr/        # VR-related components
│   │   └── layout/    # Layout components
│   ├── hooks/        # Custom React hooks
│   ├── lib/          # Utility functions
│   ├── store/        # State management
│   └── types/        # TypeScript types
├── public/           # Static assets
└── package.json
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

### Code Style

- Use TypeScript for all new code
- Follow ESLint configuration
- Write unit tests for components
- Use Prettier for code formatting
- Follow the component structure guidelines

### Component Guidelines

1. Create components in the appropriate directory
2. Use TypeScript interfaces for props
3. Implement proper error handling
4. Add loading states
5. Make components responsive
6. Add proper accessibility attributes
7. Include unit tests

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
=======
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/pages/api-reference/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/pages/building-your-application/routing/api-routes) instead of React pages.

This project uses [`next/font`](https://nextjs.org/docs/pages/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn-pages-router) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/pages/building-your-application/deploying) for more details.
>>>>>>> 7acf47fecc5bd76003b986e055ac01ea6b454ecc
