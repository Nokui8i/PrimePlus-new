# Design Documentation

## Design System

### Color Palette

#### Primary Colors
- Primary: `#6366F1` (Indigo)
- Primary Light: `#818CF8`
- Primary Dark: `#4F46E5`

#### Neutral Colors
- Neutral 50: `#F9FAFB`
- Neutral 100: `#F3F4F6`
- Neutral 200: `#E5E7EB`
- Neutral 300: `#D1D5DB`
- Neutral 400: `#9CA3AF`
- Neutral 500: `#6B7280`
- Neutral 600: `#4B5563`
- Neutral 700: `#374151`
- Neutral 800: `#1F2937`
- Neutral 900: `#111827`

#### Accent Colors
- Success: `#10B981` (Green)
- Warning: `#F59E0B` (Yellow)
- Error: `#EF4444` (Red)
- Info: `#3B82F6` (Blue)

### Typography

#### Font Family
- Primary: Inter
- Secondary: Roboto
- Monospace: JetBrains Mono

#### Font Sizes
- xs: 0.75rem (12px)
- sm: 0.875rem (14px)
- base: 1rem (16px)
- lg: 1.125rem (18px)
- xl: 1.25rem (20px)
- 2xl: 1.5rem (24px)
- 3xl: 1.875rem (30px)
- 4xl: 2.25rem (36px)

#### Font Weights
- Light: 300
- Regular: 400
- Medium: 500
- Semibold: 600
- Bold: 700

### Spacing

#### Spacing Scale
- 0: 0
- 1: 0.25rem (4px)
- 2: 0.5rem (8px)
- 3: 0.75rem (12px)
- 4: 1rem (16px)
- 5: 1.25rem (20px)
- 6: 1.5rem (24px)
- 8: 2rem (32px)
- 10: 2.5rem (40px)
- 12: 3rem (48px)
- 16: 4rem (64px)
- 20: 5rem (80px)

### Components

#### Buttons

##### Primary Button
```css
.btn-primary {
  @apply px-4 py-2 bg-primary-600 text-white rounded-lg 
         hover:bg-primary-700 transition-colors
         focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2;
}
```

##### Secondary Button
```css
.btn-secondary {
  @apply px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg 
         hover:bg-neutral-200 transition-colors
         focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2;
}
```

##### Icon Button
```css
.btn-icon {
  @apply p-2 text-neutral-500 rounded-lg 
         hover:bg-neutral-100 transition-colors
         focus:outline-none focus:ring-2 focus:ring-neutral-500 focus:ring-offset-2;
}
```

#### Cards

##### Content Card
```css
.card {
  @apply bg-white dark:bg-neutral-800 rounded-xl shadow-sm 
         overflow-hidden transition-shadow hover:shadow-md;
}
```

##### Stats Card
```css
.card-stats {
  @apply bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg;
}
```

#### Forms

##### Input Field
```css
.input {
  @apply w-full px-3 py-2 border border-neutral-300 rounded-lg 
         focus:outline-none focus:ring-2 focus:ring-primary-500 
         focus:border-transparent dark:bg-neutral-700 dark:border-neutral-600;
}
```

##### Textarea
```css
.textarea {
  @apply w-full px-3 py-2 border border-neutral-300 rounded-lg 
         focus:outline-none focus:ring-2 focus:ring-primary-500 
         focus:border-transparent dark:bg-neutral-700 dark:border-neutral-600;
}
```

### Layout

#### Grid System
- 12-column grid
- Responsive breakpoints:
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
  - 2xl: 1536px

#### Container Widths
- sm: 640px
- md: 768px
- lg: 1024px
- xl: 1280px
- 2xl: 1536px

### Animations

#### Transitions
- Duration: 150ms
- Timing: cubic-bezier(0.4, 0, 0.2, 1)
- Properties:
  - color
  - background-color
  - border-color
  - opacity
  - transform
  - box-shadow

#### Hover Effects
- Scale: 1.02
- Shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1)
- Opacity: 0.9

### Dark Mode

#### Color Mapping
- Background: Neutral 900
- Surface: Neutral 800
- Text: Neutral 100
- Border: Neutral 700
- Accent: Primary 400

#### Dark Mode Toggle
- Smooth transition
- System preference detection
- Manual override option

### Accessibility

#### Color Contrast
- Minimum contrast ratio: 4.5:1
- Large text contrast ratio: 3:1
- Interactive elements: 3:1

#### Focus States
- Visible focus ring
- High contrast outline
- Keyboard navigation support

#### Screen Reader Support
- ARIA labels
- Semantic HTML
- Skip links
- Alt text for images

### Responsive Design

#### Mobile First
- Base styles for mobile
- Progressive enhancement
- Touch-friendly targets
- Simplified navigation

#### Tablet
- Expanded layout
- Side navigation
- Larger touch targets
- Optimized content display

#### Desktop
- Full layout
- Advanced features
- Keyboard shortcuts
- Multi-column layouts

### Loading States

#### Skeleton Loading
- Animated placeholder
- Content structure preview
- Smooth transition
- Progressive loading

#### Spinners
- Centered alignment
- Consistent size
- Brand color usage
- Smooth animation

### Error States

#### Error Messages
- Clear error text
- Action suggestions
- Visual indicators
- Dismissible alerts

#### Empty States
- Helpful illustrations
- Clear messaging
- Action buttons
- Contextual guidance

### Navigation

#### Sidebar
- Collapsible sections
- Active state indicators
- Nested navigation
- Quick actions

#### Breadcrumbs
- Clear hierarchy
- Clickable segments
- Current page indicator
- Mobile optimization

### Content Display

#### Media Grid
- Responsive layout
- Aspect ratio preservation
- Lazy loading
- Loading states

#### Content Cards
- Consistent spacing
- Clear hierarchy
- Interactive elements
- Loading states

### Forms

#### Form Layout
- Clear labels
- Required field indicators
- Error states
- Success feedback

#### Input Groups
- Consistent spacing
- Clear relationships
- Error handling
- Validation feedback

### Modals

#### Modal Design
- Centered positioning
- Backdrop overlay
- Close button
- Focus management

#### Dialog Boxes
- Clear purpose
- Action buttons
- Cancel option
- Keyboard support

### Notifications

#### Toast Messages
- Non-intrusive
- Auto-dismiss
- Action buttons
- Stack management

#### Alert Banners
- Contextual colors
- Clear messaging
- Action buttons
- Dismissible option 