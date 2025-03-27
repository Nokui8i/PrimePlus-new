'use client';

import { AuthProvider } from '@/components/providers/AuthProvider';
import { ThemeProvider } from 'next-themes';
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <AuthProvider>
        {children}
        <Toaster 
          position="bottom-right"
          toastOptions={{
            className: 'dark:bg-neutral-800 dark:text-white',
            style: {
              background: 'var(--color-neutral-50)',
              color: 'var(--color-neutral-900)',
            },
          }}
        />
      </AuthProvider>
    </ThemeProvider>
  );
} 