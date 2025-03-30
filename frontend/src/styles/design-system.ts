// Design System Constants

export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '2.5rem',  // 40px
  '3xl': '3rem'     // 48px
};

export const typography = {
  // Font sizes
  heading: {
    h1: 'text-2xl font-semibold', // 24px
    h2: 'text-xl font-semibold',  // 20px
    h3: 'text-lg font-medium',    // 18px
    h4: 'text-base font-medium'   // 16px
  },
  body: {
    large: 'text-base',  // 16px
    base: 'text-sm',     // 14px
    small: 'text-xs'     // 12px
  }
};

export const containers = {
  post: 'max-w-2xl w-full bg-white dark:bg-neutral-800 rounded-lg shadow-sm',
  card: 'bg-white dark:bg-neutral-800 rounded-lg shadow-sm',
  section: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  modal: 'max-w-md w-full bg-white dark:bg-neutral-800 rounded-lg shadow-xl'
};

export const layout = {
  header: 'h-14 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700',
  sidebar: 'w-64 bg-white dark:bg-neutral-800 border-r border-neutral-200 dark:border-neutral-700',
  main: 'min-h-screen bg-neutral-50 dark:bg-neutral-900'
};

export const components = {
  button: {
    base: 'rounded-md font-medium transition-colors',
    sizes: {
      sm: 'px-2.5 py-1.5 text-xs',
      md: 'px-3 py-2 text-sm',
      lg: 'px-4 py-2 text-base'
    },
    variants: {
      primary: 'bg-primary-600 text-white hover:bg-primary-700',
      secondary: 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-700 dark:text-neutral-100',
      outline: 'border border-neutral-300 text-neutral-700 hover:bg-neutral-50 dark:border-neutral-600 dark:text-neutral-300'
    }
  },
  input: {
    base: 'w-full rounded-md border-neutral-300 dark:border-neutral-600 dark:bg-neutral-700',
    sizes: {
      sm: 'px-2.5 py-1.5 text-xs',
      md: 'px-3 py-2 text-sm',
      lg: 'px-4 py-2 text-base'
    }
  },
  card: {
    base: 'bg-white dark:bg-neutral-800 rounded-lg shadow-sm',
    padding: {
      sm: 'p-3',
      md: 'p-4',
      lg: 'p-6'
    }
  }
};

export const contentSizes = {
  post: {
    width: 'max-w-2xl',
    image: {
      thumbnail: 'h-48',
      featured: 'h-64'
    }
  },
  profile: {
    avatar: {
      sm: 'w-8 h-8',
      md: 'w-10 h-10',
      lg: 'w-12 h-12'
    },
    cover: 'h-48'
  }
};

export const gridLayouts = {
  posts: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
  media: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4',
  stats: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4'
};

// Common styles for consistent elements
export const commonStyles = {
  pageContainer: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6',
  sectionContainer: 'bg-white dark:bg-neutral-800 rounded-lg shadow-sm p-4',
  cardHeader: 'flex items-center justify-between mb-4',
  cardTitle: 'text-lg font-semibold text-neutral-900 dark:text-white',
  cardContent: 'space-y-4',
  divider: 'border-t border-neutral-200 dark:border-neutral-700 my-4',
  avatar: 'rounded-full object-cover',
  badge: 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium'
}; 