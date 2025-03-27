import { Metadata } from 'next';
import '@/styles/globals.css';
import Providers from '@/components/providers/Providers';

export const metadata: Metadata = {
  title: 'PrimePlus+',
  description: 'Your premium content platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
