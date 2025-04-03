# PrimePlus+ Website Structure Documentation

This document serves as the single source of truth for the website's structure and implementation. It should be updated whenever significant changes are made to the website.

## Mandatory Documentation Review

Before starting any coding work, developers MUST:

1. Read and analyze all README files in the project:
   - Root `README.md`
   - `frontend/README.md`
   - `backend/README.md`
   - `project_vision/README_ONLYFANS_DESIGN.md`
   - `project_vision/ONLYFANS_DESIGN_IMPLEMENTATION.md`
   - `project_vision/IMPLEMENTATION_SUMMARY.md`
   - `DEVELOPMENT_GUIDE.md`
   - `WEBSITE_STRUCTURE.md`

2. Understand the current state of:
   - Project structure
   - Design system
   - Component library
   - Database schema
   - API routes
   - State management
   - Version history

3. Follow the established patterns:
   - Page templates
   - Component structure
   - Styling conventions
   - State management
   - Error handling
   - Loading states

4. Document any changes:
   - Update relevant README files
   - Add new components to the component library
   - Update the version history
   - Document any new API routes
   - Update database schema if needed

This ensures consistency and prevents breaking existing patterns or introducing incompatible changes.

## Core Pages Structure

### 1. Authentication Pages
```
app/(auth)/
├── login/
│   └── page.tsx         # Login page with email/password form
└── register/
    └── page.tsx         # Registration page with form
```

### 2. Authenticated Pages
```
app/(authenticated)/
├── layout.tsx           # Main layout with sidebar
├── feed/
│   └── page.tsx         # Main content feed
├── [username]/
│   └── page.tsx         # User profile pages
├── settings/
│   └── page.tsx         # User settings
└── analytics/
    └── page.tsx         # Analytics dashboard
```

## Component Library

### Layout Components
```
components/layout/
├── Sidebar.tsx          # Main navigation sidebar
├── FeedHeader.tsx       # Feed page header
├── StoryBar.tsx         # Story display component
└── AuthenticatedLayout.tsx  # Layout wrapper for authenticated pages
```

### Common Components
```
components/common/
├── Button.tsx           # Reusable button component
├── Card.tsx             # Base card component
├── Avatar.tsx           # User avatar component
└── Loading.tsx          # Loading state component
```

### Feature Components
```
components/feed/
├── PostCard.tsx         # Individual post display
├── CreatePost.tsx       # Post creation form
└── PostActions.tsx      # Post interaction buttons

components/profile/
├── ProfileHeader.tsx    # Profile page header
├── ProfileStats.tsx     # Profile statistics
└── ProfileContent.tsx   # Profile content display
```

## Design System

### Colors
```css
--primary: #6366F1    /* Purple - Main brand color */
--background: #FFFFFF  /* White - Page background */
--text-primary: #111827 /* Gray 900 - Main text */
--text-secondary: #4B5563 /* Gray 600 - Secondary text */
```

### Typography
```css
/* Headings */
font-family: 'Inter', sans-serif;
font-size: 1.5rem;  /* text-2xl */
font-weight: 700;

/* Body */
font-family: system-ui, -apple-system, sans-serif;
font-size: 1rem;    /* text-base */
font-weight: 400;
```

### Component Styles

#### Buttons
```tsx
// Primary Button
className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors"

// Secondary Button
className="px-4 py-2 bg-white text-purple-600 rounded-full hover:bg-gray-50 transition-colors"

// Icon Button
className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors"
```

#### Cards
```tsx
// Content Card
className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6"

// Profile Card
className="bg-purple-500 rounded-3xl p-6"
```

## Page Templates

### Profile Page Template
```tsx
// app/(authenticated)/[username]/page.tsx
export default function ProfilePage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <ProfileHeader />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <ProfileContent />
        </div>
        <div>
          <SuggestedCreators />
        </div>
      </div>
    </div>
  );
}
```

### Feed Page Template
```tsx
// app/(authenticated)/feed/page.tsx
export default function FeedPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      <FeedHeader />
      <StoryBar />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <FeedContent />
        </div>
        <div>
          <SuggestedCreators />
        </div>
      </div>
    </div>
  );
}
```

## State Management

### Global State (Zustand)
```typescript
// stores/useStore.ts
interface Store {
  user: User | null;
  setUser: (user: User | null) => void;
}

export const useStore = create<Store>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
}));
```

### Server State (React Query)
```typescript
// hooks/useProfile.ts
export function useProfile(username: string) {
  return useQuery({
    queryKey: ['profile', username],
    queryFn: () => fetchProfile(username),
  });
}
```

## API Routes

### Profile Routes
```
app/api/profile/
├── [username]/
│   └── route.ts         # GET profile data
└── update/
    └── route.ts         # PATCH profile updates
```

### Content Routes
```
app/api/content/
├── posts/
│   └── route.ts         # GET/POST content
└── [id]/
    └── route.ts         # GET/PATCH/DELETE specific content
```

## Database Schema

### User Model
```prisma
model User {
  id            String    @id @default(cuid())
  name          String
  email         String    @unique
  username      String    @unique
  image         String?
  bio           String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  posts         Post[]
  followers     Follow[]  @relation("Following")
  following     Follow[]  @relation("Followers")
}
```

### Post Model
```prisma
model Post {
  id            String    @id @default(cuid())
  content       String
  image         String?
  author        User      @relation(fields: [authorId], references: [id])
  authorId      String
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  likes         Like[]
  comments      Comment[]
}
```

## Version History

### Current Version: 1.0.0
- Initial implementation
- Basic authentication
- Profile pages
- Content feed
- Settings page

### Planned Updates
1. Subscription system
2. Messaging system
3. Content discovery
4. VR content support

## Rollback Procedures

If changes need to be reverted:

1. Check the git history for the specific commit
2. Use `git checkout <commit-hash>` to revert to that state
3. Update this documentation to reflect the reverted changes
4. Test the reverted version thoroughly

## Maintenance Guidelines

1. Always update this document when making structural changes
2. Keep component styles consistent with the design system
3. Follow the established page templates
4. Maintain proper TypeScript types
5. Include loading states for all async operations
6. Handle errors appropriately
7. Test changes thoroughly before deployment

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [React Query Documentation](https://tanstack.com/query/latest)
- [Zustand Documentation](https://github.com/pmndrs/zustand)
``` 