import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { UserProvider } from '@/context/UserContext';
import mockStorage from '@/services/mockStorage';
import { useEffect } from 'react';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

function MyApp({ Component, pageProps }: AppProps) {
  useEffect(() => {
    // Initialize mock storage on app startup
    mockStorage.initialize();
  }, []);

  return (
    <AuthProvider>
      <UserProvider>
        <main className={inter.className}>
          <Component {...pageProps} />
        </main>
      </UserProvider>
    </AuthProvider>
  );
}

export default MyApp;