# PrimePlus+ Design System

## Layout Architecture

### Page Structure
- Fixed navigation sidebar on left (width: `w-64 lg:w-72`)
- Main content in center (max-width: `max-w-[90rem]`)
- Fixed utility sidebar on right (width: `w-64 lg:w-72`)
- Top navigation bar (height: `h-16`)

### Sidebars
1. Left Navigation Sidebar:
   ```css
   fixed top-0 left-0 h-screen
   w-64 lg:w-72
   bg-white dark:bg-neutral-900
   border-r border-neutral-200/50 dark:border-neutral-700/50
   ```

2. Right Utility Sidebar:
   ```css
   fixed top-0 right-0 h-screen
   w-64 lg:w-72
   bg-neutral-50/80 dark:bg-neutral-900/80
   backdrop-blur-sm
   border-l border-neutral-200/50 dark:border-neutral-700/50
   ```

### Component Containers
1. Card Components:
   ```css
   bg-white/70 dark:bg-neutral-800/70
   backdrop-blur-sm
   border-y border-neutral-200/50 dark:border-neutral-700/50
   ```

2. Content Sections:
   ```css
   p-1.5 /* Base padding */
   space-y-1.5 /* Vertical spacing */
   ```

## Typography

### Text Sizes
- Headings:
  ```css
  h1: text-xl font-bold
  h2: text-xs font-medium
  h3: text-[11px] font-medium
  ```
- Body:
  ```css
  text-[11px] /* Standard text */
  text-[10px] /* Small text */
  ```

### Font Weights
```css
font-bold: 700
font-medium: 500
font-normal: 400
```

## Colors

### Theme Colors
```css
/* Light Mode */
bg-white
text-neutral-900
border-neutral-200/50

/* Dark Mode */
dark:bg-neutral-900
dark:text-neutral-100
dark:border-neutral-700/50
```

### Accent Colors
```css
primary-500: #3B82F6
primary-600: #2563EB
```

## Component Specifications

### Search Box
```css
/* Container */
bg-white/70 dark:bg-neutral-800/70
backdrop-blur-sm
border-y border-neutral-200/50

/* Input */
pl-6 pr-2 py-0.5
text-[11px]
rounded-md

/* Icons */
w-3 h-3
text-primary-500
```

### Suggested Creators
```css
/* Container */
bg-white/70 dark:bg-neutral-800/70
backdrop-blur-sm
border-y border-neutral-200/50

/* Creator Card */
space-y-1.5
mb-1

/* Avatar */
w-5 h-5
rounded-full

/* Text */
text-[11px] font-medium /* Name */
text-[10px] /* Username */
```

### Buttons
```css
/* Primary */
px-1.5 py-0.5
rounded-full
text-[10px]
bg-white dark:bg-neutral-600
text-primary-600 dark:text-primary-400

/* Secondary */
px-1.5 py-0.5
rounded-full
text-[10px]
text-neutral-600 dark:text-neutral-300
```

## Spacing System

### Padding
```css
p-1.5    /* Component padding */
px-1.5   /* Horizontal padding */
py-0.5   /* Vertical padding */
pt-16    /* Top padding for main content */
```

### Margins
```css
mb-1     /* Bottom margin */
mb-1.5   /* Larger bottom margin */
```

### Gaps
```css
space-y-1    /* Vertical gap small */
space-y-1.5  /* Vertical gap medium */
space-x-1    /* Horizontal gap small */
```

## Responsive Design

### Breakpoints
```css
sm: 640px
md: 768px
lg: 1024px
xl: 1280px
2xl: 1536px
```

### Component Adaptations
1. Sidebar widths:
   ```css
   w-64 md:w-72  /* Both left and right sidebars */
   ```

2. Content width:
   ```css
   max-w-full md:max-w-[90rem]
   ```

## Animation & Transitions

### Hover Effects
```css
hover:scale-105
transition-transform
duration-300
```

### Loading States
```css
animate-spin
animate-pulse
```

## Best Practices

1. Always use the defined spacing system
2. Maintain consistent padding and margins
3. Follow the responsive design patterns
4. Use proper dark mode variants
5. Keep components aligned with edges
6. Maintain proper contrast ratios
7. Use proper text sizes for readability
8. Follow accessibility guidelines

## Implementation Notes

1. All components should use the defined color system
2. Maintain consistent spacing between elements
3. Use proper responsive classes
4. Follow mobile-first approach
5. Keep components properly aligned
6. Use proper border styles
7. Maintain proper shadow usage
8. Follow proper backdrop blur usage 