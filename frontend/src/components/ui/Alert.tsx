import React from 'react';

interface AlertProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'error';
  className?: string;
}

const Alert: React.FC<AlertProps> = ({ 
  children, 
  variant = 'default',
  className = '' 
}) => {
  const variantStyles = {
    default: 'bg-blue-50 text-blue-800 dark:bg-blue-900/10 dark:text-blue-300',
    success: 'bg-green-50 text-green-800 dark:bg-green-900/10 dark:text-green-300',
    warning: 'bg-yellow-50 text-yellow-800 dark:bg-yellow-900/10 dark:text-yellow-300',
    error: 'bg-red-50 text-red-800 dark:bg-red-900/10 dark:text-red-300'
  };

  return (
    <div className={`p-4 rounded-lg ${variantStyles[variant]} ${className}`}>
      {children}
    </div>
  );
};

const AlertDescription: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children,
  className = ''
}) => {
  return (
    <div className={`text-sm mt-1 ${className}`}>
      {children}
    </div>
  );
};

export { Alert, AlertDescription }; 