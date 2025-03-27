# PrimePlus+ Design System

## Brand Identity

### Colors

```css
/* Primary Colors */
--primary-50: #f0f9ff;
--primary-100: #e0f2fe;
--primary-200: #bae6fd;
--primary-300: #7dd3fc;
--primary-400: #38bdf8;
--primary-500: #0ea5e9;  /* Main Brand Color */
--primary-600: #0284c7;
--primary-700: #0369a1;
--primary-800: #075985;
--primary-900: #0c4a6e;

/* Neutral Colors */
--neutral-50: #f8fafc;
--neutral-100: #f1f5f9;
--neutral-200: #e2e8f0;
--neutral-300: #cbd5e1;
--neutral-400: #94a3b8;
--neutral-500: #64748b;
--neutral-600: #475569;
--neutral-700: #334155;
--neutral-800: #1e293b;
--neutral-900: #0f172a;

/* Success Colors */
--success-500: #22c55e;
--success-600: #16a34a;

/* Warning Colors */
--warning-500: #f59e0b;
--warning-600: #d97706;

/* Error Colors */
--error-500: #ef4444;
--error-600: #dc2626;
```

### Typography

```css
/* Font Families */
--font-sans: 'Inter', system-ui, -apple-system, sans-serif;
--font-heading: 'Clash Display', sans-serif;
--font-mono: 'JetBrains Mono', monospace;

/* Font Sizes */
--text-xs: 0.75rem;    /* 12px */
--text-sm: 0.875rem;   /* 14px */
--text-base: 1rem;     /* 16px */
--text-lg: 1.125rem;   /* 18px */
--text-xl: 1.25rem;    /* 20px */
--text-2xl: 1.5rem;    /* 24px */
--text-3xl: 1.875rem;  /* 30px */
--text-4xl: 2.25rem;   /* 36px */

/* Line Heights */
--leading-none: 1;
--leading-tight: 1.25;
--leading-snug: 1.375;
--leading-normal: 1.5;
--leading-relaxed: 1.625;
--leading-loose: 2;
```

### Spacing

```css
/* Spacing Scale */
--spacing-px: 1px;
--spacing-0: 0;
--spacing-0.5: 0.125rem;  /* 2px */
--spacing-1: 0.25rem;     /* 4px */
--spacing-2: 0.5rem;      /* 8px */
--spacing-3: 0.75rem;     /* 12px */
--spacing-4: 1rem;        /* 16px */
--spacing-6: 1.5rem;      /* 24px */
--spacing-8: 2rem;        /* 32px */
--spacing-12: 3rem;       /* 48px */
--spacing-16: 4rem;       /* 64px */
```

### Shadows

```css
/* Box Shadows */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
--shadow-xl: 0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1);
```

## Component Design

### Buttons

```css
/* Primary Button */
.btn-primary {
  @apply bg-primary-500 text-white px-4 py-2 rounded-lg font-medium
         hover:bg-primary-600 focus:ring-2 focus:ring-primary-500/50
         disabled:opacity-50 disabled:cursor-not-allowed
         transition-colors duration-200;
}

/* Secondary Button */
.btn-secondary {
  @apply bg-neutral-200 text-neutral-800 px-4 py-2 rounded-lg font-medium
         hover:bg-neutral-300 focus:ring-2 focus:ring-neutral-200/50
         disabled:opacity-50 disabled:cursor-not-allowed
         transition-colors duration-200;
}

/* Ghost Button */
.btn-ghost {
  @apply text-neutral-600 px-4 py-2 rounded-lg font-medium
         hover:bg-neutral-100 focus:ring-2 focus:ring-neutral-200/50
         disabled:opacity-50 disabled:cursor-not-allowed
         transition-colors duration-200;
}
```

### Cards

```css
/* Basic Card */
.card {
  @apply bg-white dark:bg-neutral-800 rounded-xl shadow-md p-6
         border border-neutral-200 dark:border-neutral-700;
}

/* Interactive Card */
.card-interactive {
  @apply hover:shadow-lg transition-shadow duration-200
         hover:border-primary-500/50;
}
```

### Forms

```css
/* Input Field */
.input {
  @apply w-full px-4 py-2 rounded-lg border border-neutral-300
         focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500
         disabled:opacity-50 disabled:cursor-not-allowed
         dark:bg-neutral-800 dark:border-neutral-600;
}

/* Select Field */
.select {
  @apply w-full px-4 py-2 rounded-lg border border-neutral-300
         focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500
         disabled:opacity-50 disabled:cursor-not-allowed
         dark:bg-neutral-800 dark:border-neutral-600;
}

/* Checkbox */
.checkbox {
  @apply h-5 w-5 rounded border-neutral-300
         text-primary-500 focus:ring-primary-500/50
         dark:border-neutral-600;
}
```

### Navigation

```css
/* Nav Link */
.nav-link {
  @apply text-neutral-600 hover:text-neutral-900
         dark:text-neutral-400 dark:hover:text-white
         font-medium transition-colors duration-200;
}

/* Active Nav Link */
.nav-link-active {
  @apply text-primary-500 hover:text-primary-600
         dark:text-primary-400 dark:hover:text-primary-300;
}
```

## Layout Guidelines

### Grid System

```css
/* Container */
.container {
  @apply max-w-7xl mx-auto px-4 sm:px-6 lg:px-8;
}

/* Grid */
.grid {
  @apply grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6;
}
```

### Responsive Breakpoints

```css
/* Breakpoints */
--screen-sm: 640px;   /* @media (min-width: 640px) */
--screen-md: 768px;   /* @media (min-width: 768px) */
--screen-lg: 1024px;  /* @media (min-width: 1024px) */
--screen-xl: 1280px;  /* @media (min-width: 1280px) */
--screen-2xl: 1536px; /* @media (min-width: 1536px) */
```

## Component Examples

### Profile Card
```jsx
<div className="card p-6 max-w-sm">
  <div className="flex items-center space-x-4">
    <img className="h-12 w-12 rounded-full" src={user.avatar} alt="" />
    <div>
      <h3 className="text-lg font-medium text-neutral-900 dark:text-white">
        {user.name}
      </h3>
      <p className="text-sm text-neutral-500 dark:text-neutral-400">
        {user.role}
      </p>
    </div>
  </div>
</div>
```

### Content Card
```jsx
<div className="card p-0 overflow-hidden">
  <img className="w-full h-48 object-cover" src={post.image} alt="" />
  <div className="p-6">
    <h3 className="text-xl font-medium mb-2">{post.title}</h3>
    <p className="text-neutral-600 dark:text-neutral-400">{post.excerpt}</p>
    <div className="mt-4 flex justify-between items-center">
      <button className="btn-primary">Read More</button>
      <div className="flex items-center space-x-2 text-neutral-500">
        <HeartIcon className="h-5 w-5" />
        <span>{post.likes}</span>
      </div>
    </div>
  </div>
</div>
```

### Form Example
```jsx
<form className="space-y-6">
  <div>
    <label className="block text-sm font-medium mb-2">
      Email
    </label>
    <input
      type="email"
      className="input"
      placeholder="Enter your email"
    />
  </div>
  <div>
    <label className="block text-sm font-medium mb-2">
      Password
    </label>
    <input
      type="password"
      className="input"
      placeholder="Enter your password"
    />
  </div>
  <div className="flex items-center">
    <input type="checkbox" className="checkbox" />
    <label className="ml-2 text-sm">
      Remember me
    </label>
  </div>
  <button type="submit" className="btn-primary w-full">
    Sign In
  </button>
</form>
```

## Dark Mode

All components should support dark mode using Tailwind's dark: modifier. The dark mode is activated based on the user's system preferences or manual toggle.

### Dark Mode Colors
```css
/* Dark Mode Background */
.dark body {
  @apply bg-neutral-900 text-white;
}

/* Dark Mode Card */
.dark .card {
  @apply bg-neutral-800 border-neutral-700;
}

/* Dark Mode Input */
.dark .input {
  @apply bg-neutral-800 border-neutral-600 text-white;
}
```

## Animation Guidelines

```css
/* Transitions */
.transition-base {
  @apply transition-all duration-200 ease-in-out;
}

/* Hover Effects */
.hover-lift {
  @apply hover:-translate-y-1 transition-transform duration-200;
}

/* Loading States */
.loading-pulse {
  @apply animate-pulse bg-neutral-200 dark:bg-neutral-700;
}
```

## Best Practices

1. **Consistency**: Use the defined color palette, typography, and spacing scales
2. **Accessibility**: Ensure sufficient color contrast and proper ARIA attributes
3. **Responsiveness**: Design mobile-first and use responsive utilities
4. **Performance**: Optimize images and minimize CSS bundle size
5. **Dark Mode**: Support both light and dark themes
6. **Animation**: Use subtle animations to enhance UX
7. **Components**: Build reusable components following these guidelines 