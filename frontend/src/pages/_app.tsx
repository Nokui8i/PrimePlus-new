import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Inter } from 'next/font/google';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { UserProvider } from '@/context/UserContext';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

function MyApp({ Component, pageProps }: AppProps) {
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