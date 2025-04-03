# PrimePlus+ Development Guide

This guide explains how to build and extend the PrimePlus+ platform, ensuring consistency in design and implementation.

## Project Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── (authenticated)/     # Protected routes requiring auth
│   │   │   ├── [username]/     # Profile pages
│   │   │   ├── feed/          # Content feed
│   │   │   ├── settings/      # User settings
│   │   │   └── layout.tsx     # Authenticated layout with sidebar
│   │   ├── (auth)/            # Authentication routes
│   │   │   ├── login/
│   │   │   └── register/
│   │   └── layout.tsx         # Root layout
│   ├── components/            # Reusable components
│   │   ├── common/           # Shared components
│   │   ├── layout/           # Layout components
│   │   └── [feature]/        # Feature-specific components
│   └── lib/                  # Utilities and configurations
```

## Design System

### Colors
- Primary: Purple (#6366F1)
- Background: White
- Text: Gray scale (900 for headings, 600 for body)
- Accents: 
  - Success: Green
  - Error: Red
  - Warning: Yellow

### Typography
- Font Family: Inter for headings, system font stack for body
- Sizes:
  - Headings: text-2xl for page titles, text-xl for section headers
  - Body: text-base for content, text-sm for secondary text
  - Small: text-xs for metadata

### Components

#### Buttons
```tsx
// Primary Button
<button className="px-4 py-2 bg-purple-600 text-white rounded-full hover:bg-purple-700 transition-colors">
  Button Text
</button>

// Secondary Button
<button className="px-4 py-2 bg-white text-purple-600 rounded-full hover:bg-gray-50 transition-colors">
  Button Text
</button>

// Icon Button
<button className="p-2 text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
  <Icon className="w-5 h-5" />
</button>
```

#### Cards
```tsx
// Content Card
<div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
  {/* Card content */}
</div>

// Profile Card
<div className="bg-purple-500 rounded-3xl p-6">
  {/* Profile content */}
</div>
```

#### Forms
```tsx
// Input Field
<input
  type="text"
  className="w-full px-4 py-2 rounded-full border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
/>

// Text Area
<textarea
  className="w-full px-4 py-2 rounded-2xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
/>
```

## Adding New Pages

1. Create a new page in the appropriate directory:
   ```tsx
   // app/(authenticated)/new-feature/page.tsx
   export default function NewFeaturePage() {
     return (
       <div className="max-w-7xl mx-auto px-4 py-6">
         <h1 className="text-2xl font-bold text-gray-900 mb-6">New Feature</h1>
         {/* Page content */}
       </div>
     );
   }
   ```

2. Add loading state:
   ```tsx
   // app/(authenticated)/new-feature/loading.tsx
   export default function Loading() {
     return (
       <div className="max-w-7xl mx-auto px-4 py-6">
         <div className="animate-pulse">
           {/* Loading skeleton */}
         </div>
       </div>
     );
   }
   ```

3. Create feature-specific components:
   ```tsx
   // components/new-feature/FeatureComponent.tsx
   interface FeatureComponentProps {
     // Props definition
   }

   export default function FeatureComponent({ ...props }: FeatureComponentProps) {
     return (
       <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6">
         {/* Component content */}
       </div>
     );
   }
   ```

## Adding New Features

1. Plan the feature:
   - Define the user interface
   - Identify required components
   - Plan the data structure
   - Design the API endpoints

2. Create necessary components:
   - Follow the component structure
   - Use consistent styling
   - Include loading states
   - Handle errors appropriately

3. Implement API routes:
   ```tsx
   // app/api/feature/route.ts
   import { NextResponse } from 'next/server'
   import { getServerSession } from 'next-auth'

   export async function GET() {
     try {
       const session = await getServerSession()
       if (!session) {
         return NextResponse.json(
           { error: 'Unauthorized' },
           { status: 401 }
         )
       }

       // Feature logic

       return NextResponse.json({ data })
     } catch (error) {
       console.error('API error:', error)
       return NextResponse.json(
         { error: 'Internal server error' },
         { status: 500 }
       )
     }
   }
   ```

4. Add to navigation (if needed):
   ```tsx
   // components/layout/Sidebar.tsx
   const navigationItems = [
     // ... existing items
     {
       name: 'New Feature',
       href: '/new-feature',
       icon: FeatureIcon
     }
   ]
   ```

## Best Practices

1. **Component Organization**
   - Keep components small and focused
   - Use TypeScript interfaces for props
   - Include loading states
   - Handle errors gracefully

2. **Styling**
   - Follow the design system
   - Use Tailwind utility classes
   - Maintain consistent spacing
   - Ensure responsive design

3. **State Management**
   - Use React Query for server state
   - Keep local state minimal
   - Handle loading and error states
   - Implement proper data fetching

4. **Performance**
   - Implement proper loading states
   - Use Next.js Image component
   - Optimize API calls
   - Implement proper caching

5. **Authentication**
   - Always check session in protected routes
   - Handle unauthorized states
   - Implement proper redirects
   - Secure API endpoints

## Testing

1. **Component Testing**
   ```tsx
   import { render, screen } from '@testing-library/react'
   import Component from './Component'

   describe('Component', () => {
     it('renders correctly', () => {
       render(<Component />)
       expect(screen.getByText('Expected Text')).toBeInTheDocument()
     })
   })
   ```

2. **API Testing**
   ```tsx
   import { createMocks } from 'node-mocks-http'
   import handler from './route'

   describe('API Route', () => {
     it('handles requests correctly', async () => {
       const { req, res } = createMocks({
         method: 'GET'
       })

       await handler(req, res)
       expect(res._getStatusCode()).toBe(200)
     })
   })
   ```

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Test the production build:
   ```bash
   npm run start
   ```

3. Deploy to production:
   - Ensure environment variables are set
   - Run database migrations
   - Deploy to hosting platform

## Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)
- [React Query Documentation](https://tanstack.com/query/latest) 