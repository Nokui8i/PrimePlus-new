import React from 'react';
import { useTheme } from 'next-themes';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { theme } = useTheme();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'dark' : ''}`}>
      <main className="bg-white dark:bg-neutral-900 min-h-screen">
        {children}
      </main>
    </div>
  );
};

export default MainLayout; 