# CLAUDE ROLLBACK REFERENCE - PrimePlus+ (March 20, 2025)

This document contains detailed instructions specifically for Claude to understand the exact stable state of the project as of March 20, 2025. If instructed to "rollback to the start point," Claude should use this document to help restore the project to this known working state.

## 1. PROJECT STRUCTURE REFERENCE

### Core File Structure
The project follows this structure, with all files in their correct locations:

```
C:\Projects\primePlus-clean\
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   │   ├── contentController.js
│   │   │   ├── creatorController.js
│   │   │   ├── uploadController.js (critical file)
│   │   │   ├── userController.js
│   │   ├── middleware/
│   │   ├── models/
│   │   │   ├── Content.js
│   │   │   ├── MediaItem.js
│   │   │   ├── User.js
│   │   ├── routes/
│   │   │   ├── uploadRoutes.js (critical file)
│   │   ├── utils/
│   │   │   ├── upload/
│   │   │   │   ├── mediaProcessor.js (critical file)
│   │   │   │   ├── uploadConfig.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── content/
│   │   │   │   ├── ContentUploadForm.tsx (critical file)
│   │   │   │   ├── MediaPreview.tsx
│   │   │   ├── HomeFeed.tsx (critical file)
│   │   │   ├── LandingPage.tsx (critical file)
│   │   ├── pages/
│   │   │   ├── index.tsx (critical file)
│   │   │   ├── profile.tsx (critical file)
│   │   │   ├── dashboard/ (folder)
│   │   │   │   ├── index.tsx
│   │   │   ├── login/ (folder)
│   │   │   │   ├── index.tsx
│   │   │   ├── register/ (folder)
│   │   │   │   ├── index.tsx
│   │   │   ├── creator/
│   │   │   │   ├── content/
│   │   │   │   │   ├── create.tsx
│   │   │   │   │   ├── edit/
│   │   │   │   │   │   ├── [id].tsx
│   │   ├── services/
│   │   │   ├── uploadService.ts (critical file)
```

### Critical Files Status

#### Frontend Critical Files
Each of these files must be in the correct state when rolling back:

1. **index.tsx (Homepage)**
   - Must import and use LandingPage component
   - Should not contain inline login form
   - Should include redirect to dashboard if user is authenticated

2. **HomeFeed.tsx**
   - Must include null checks for user.username
   - Code pattern: `user?.username ? user.username.charAt(0).toUpperCase() : 'U'`

3. **profile.tsx**
   - Must include null checks for user properties
   - Code pattern: `user.fullName ? ... : user.username ? ... : 'U'`

4. **LandingPage.tsx**
   - Must contain complete login form
   - Should include demo login functionality
   - Must have the OnlyFans-inspired design

5. **ContentUploadForm.tsx**
   - Must have drag-and-drop functionality
   - Must handle multiple file uploads
   - Should track upload progress

#### Backend Critical Files

1. **uploadController.js**
   - Must contain file upload handling
   - Should check processing status
   - Must associate media with content

2. **mediaProcessor.js**
   - Must process different file types
   - Should generate thumbnails
   - Must have error handling

3. **uploadRoutes.js**
   - Must define all necessary upload endpoints
   - Should use proper middleware

### Page Routing Structure
Important: There should be NO duplicate pages. Only these files should exist:

1. Regular pages (NOT DUPLICATED):
   - /pages/dashboard/ (folder with index.tsx)
   - /pages/login/ (folder with index.tsx)
   - /pages/register/ (folder with index.tsx)

2. Do NOT have these files (they cause duplicate page warnings):
   - /pages/dashboard.tsx
   - /pages/login.tsx
   - /pages/register.tsx

If these files exist, they should be renamed to .bak or removed.

## 2. KEY FEATURES REFERENCE

### Working Features
These features must be functional after rollback:

1. **Authentication**
   - Login with email/password
   - Demo login with user/creator/admin roles
   - Registration form
   - Protected routes

2. **Content Upload**
   - Drag and drop files
   - Progress tracking
   - Image/video processing
   - Multiple file support
   - Content management

3. **User Interface**
   - Landing page before login
   - Dashboard after login
   - Creator profile system
   - Sidebar navigation (סרגל כלים)
   - Mobile responsive design

### Key Dependencies
Ensure these dependencies are present in package.json:

Frontend:
- next: 14.1.3
- react: ^18
- react-dom: ^18
- react-hook-form: ^7.54.2
- axios: ^1.6.7

Backend:
- express: ^4.18.2
- sequelize: ^6.35.2
- multer: ^1.4.5-lts.1
- sharp: ^0.33.2
- fluent-ffmpeg: ^2.1.2

## 3. UI DESIGN REFERENCE

### Style Guidelines
The platform follows these design specifications:

1. **Color Scheme**
   - Primary: Indigo (#4F46E5)
   - Secondary: Cyan (#06B6D4)
   - Text: Dark gray (#111827)
   - Background: Light gray (#F9FAFB)
   - Accent elements: Purple (#7C3AED)

2. **Layout**
   - Sidebar width: 16rem (desktop)
   - Content max-width: 1280px
   - Cards: Rounded corners (0.5rem)
   - Spacing: Consistent 1rem/1.5rem paddings

3. **Typography**
   - Font family: Inter, system UI
   - Headings: Semi-bold/bold
   - Body text: Regular, 1rem

4. **Components**
   - Buttons: Rounded with hover effects
   - Cards: White background with subtle shadow
   - Forms: Clean inputs with validation states
   - Navigation: Dark sidebar with icon+text

## 4. ROLLBACK PROCEDURE

If instructed to "rollback to the start point," follow these steps in order:

### 1. Check Current Structure
First, identify what files exist and what might be missing or duplicated:
```
list_directory C:\Projects\primePlus-clean\frontend\src\pages
```

### 2. Fix Duplicate Pages
If duplicate pages exist:
```
move_file C:\Projects\primePlus-clean\frontend\src\pages\dashboard.tsx C:\Projects\primePlus-clean\frontend\src\pages\dashboard.tsx.bak
move_file C:\Projects\primePlus-clean\frontend\src\pages\login.tsx C:\Projects\primePlus-clean\frontend\src\pages\login.tsx.bak
move_file C:\Projects\primePlus-clean\frontend\src\pages\register.tsx C:\Projects\primePlus-clean\frontend\src\pages\register.tsx.bak
```

### 3. Update Critical Files
Check and update these critical files:

#### index.tsx (Homepage)
Should use LandingPage:
```
import React from 'react';
import type { NextPage } from 'next';
import LandingPage from '@/components/LandingPage';
import { useUser } from '@/context/UserContext';
import { useRouter } from 'next/router';
import { useEffect } from 'react';

const Home: NextPage = () => {
  const { user } = useUser();
  const router = useRouter();
  
  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);
  
  return <LandingPage />;
};

export default Home;
```

#### profile.tsx
Add null checks for user properties:
```
<div className="h-24 w-24 rounded-full bg-white flex items-center justify-center text-blue-600 text-2xl font-bold border-4 border-white">
  {user.fullName 
    ? user.fullName.split(' ').map(name => name[0]).join('').toUpperCase().substring(0, 2)
    : user.username 
      ? user.username.substring(0, 2).toUpperCase() 
      : 'U'}
</div>
<h2 className="mt-4 text-xl font-semibold text-white">{user.fullName || user.username || 'User'}</h2>
```

#### HomeFeed.tsx
Add null checks for user.username:
```
<div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
  {user?.username ? user.username.charAt(0).toUpperCase() : 'U'}
</div>
```

### 4. Verify Landing Page
Ensure LandingPage.tsx has:
- Clean, OnlyFans-inspired design
- Login form with validation
- Demo mode functionality
- Social login options (even if not functional)

### 5. Verify Content Upload
Ensure ContentUploadForm.tsx has:
- Drag and drop interface
- Progress tracking
- File preview functionality
- Form for content details

## 5. COMMON ISSUES REFERENCE

### Issue 1: Runtime Errors in Components
These usually occur from attempting to access properties of undefined objects:
- Always use optional chaining (`?.`)
- Provide fallbacks (`||` or ternary operators)
- Add null checks before using string methods

### Issue 2: Duplicate Pages in Next.js
- Keep only one version of each page (either at root or in folders)
- Should have only index.tsx in subdirectories
- Remove .tsx files at root level that duplicate folder routes

### Issue 3: Landing Page Not Showing
- Check index.tsx imports LandingPage
- Verify LandingPage component exists and is exported
- Ensure redirect logic only happens if user is authenticated

### Issue 4: File Upload Issues
- Check ContentUploadForm component properly connects to service
- Verify uploadService.ts has correct endpoints
- Ensure backend routes and controllers are properly configured
- Check mediaProcessor utility has error handling

## 6. FINAL VERIFICATION CHECKLIST

After rollback, verify:

1. **Landing Page**
   - Should display when not logged in
   - Shows login form
   - Has demo login options

2. **Authentication**
   - Login works (real or demo)
   - Protected routes redirect
   - Dashboard appears after login

3. **Content Upload**
   - Form renders properly
   - Drag-drop works
   - Preview shows uploaded files
   - Progress tracking displays

4. **Navigation**
   - Sidebar shows correct menu items
   - Mobile responsive

5. **No Console Errors**
   - No undefined object errors
   - No routing conflicts
   - No import errors

Remember to start from the most critical components and work outward when restoring functionality. If functionality is missing in components, refer to this document for correct implementations.

---

IMPORTANT: This document represents the definitive reference point for the project state as of March 20, 2025. Any later changes should be evaluated against this reference when considering rollback.
