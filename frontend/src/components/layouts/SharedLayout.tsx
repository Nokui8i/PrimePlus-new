import React from 'react';
import { layout, commonStyles } from '@/styles/design-system';

interface SharedLayoutProps {
  children: React.ReactNode;
  header?: React.ReactNode;
  sidebar?: React.ReactNode;
  className?: string;
}

const SharedLayout: React.FC<SharedLayoutProps> = ({
  children,
  header,
  sidebar,
  className = ''
}) => {
  return (
    <div className={layout.main}>
      {header && (
        <header className={layout.header}>
          <div className={commonStyles.pageContainer}>
            {header}
          </div>
        </header>
      )}
      
      <div className="flex">
        {sidebar && (
          <aside className={layout.sidebar}>
            {sidebar}
          </aside>
        )}
        
        <main className={`flex-1 ${className}`}>
          <div className={commonStyles.pageContainer}>
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SharedLayout; 