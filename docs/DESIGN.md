# UI/UX Design Guidelines

## Design Principles

1. **Clean and Modern**
   - Minimalist interface
   - Clear visual hierarchy
   - Consistent spacing and alignment
   - Modern, professional appearance

2. **User-Centric**
   - Intuitive navigation
   - Clear feedback for actions
   - Accessible interface
   - Mobile-first approach

3. **Content-First**
   - Focus on content presentation
   - Distraction-free viewing
   - Optimized media display
   - Efficient content creation flow

## Components

### Create Post Dialog

#### Layout
- Full-width dialog on mobile, max-width 600px on desktop
- Clear section separation with spacing
- Consistent padding and margins
- Responsive grid layout for tabs

#### Tabs
1. **Text**
   - Clean textarea
   - Character count (if applicable)
   - Post button disabled until content added

2. **Media**
   - Nested tabs for Picture/Video
   - Clear upload areas
   - Preview functionality
   - Progress indicators
   - File size limits:
     - Images: 2GB
     - Videos: 10GB
     - Thumbnails: 100MB

3. **VR**
   - Scene builder interface
   - Preview capability
   - Device compatibility info

4. **360°**
   - Content upload area
   - Preview functionality
   - Orientation controls

5. **Live**
   - Stream setup controls
   - Camera/mic toggles
   - Stream quality options

### Common Elements

#### Buttons
- Primary: Purple (#7C3AED)
- Secondary: White with border
- Hover states with slight darkening
- Disabled states with reduced opacity

#### Forms
- Clear input areas
- Helpful placeholder text
- Validation feedback
- Error states in red

#### Media Upload
- Drag and drop support
- Click to upload alternative
- Clear upload area with dashed border
- Progress indicator during upload
- Preview capability
- Remove option

## Color Palette

- **Primary**: Purple (#7C3AED)
- **Secondary**: Gray scale
- **Background**: White
- **Text**: Dark gray (#1F2937)
- **Error**: Red (#EF4444)
- **Success**: Green (#10B981)

## Typography

- **Headings**: Inter, sans-serif
- **Body**: System font stack
- **Size Scale**:
  - xs: 0.75rem
  - sm: 0.875rem
  - base: 1rem
  - lg: 1.125rem
  - xl: 1.25rem

## Spacing

- Base unit: 4px (0.25rem)
- Common spacing:
  - 4: 1rem
  - 6: 1.5rem
  - 8: 2rem

## Responsive Design

- Mobile-first approach
- Breakpoints:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px

## Accessibility

- WCAG 2.1 compliance
- Keyboard navigation
- Screen reader support
- Sufficient color contrast
- Focus indicators

## Loading States

- Skeleton loaders
- Progress indicators
- Clear loading messages
- Smooth transitions

## Error Handling

- Clear error messages
- User-friendly language
- Recovery options
- Consistent error styling 