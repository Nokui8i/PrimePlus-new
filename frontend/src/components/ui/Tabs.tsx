import React from 'react';

interface TabOption {
  value: string;
  label: string;
}

interface TabsProps {
  value: string;
  onChange: (value: string) => void;
  options: TabOption[];
  className?: string;
}

const Tabs: React.FC<TabsProps> = ({ value, onChange, options, className = '' }) => {
  return (
    <div className={`flex gap-2 ${className}`}>
      {options.map((option) => (
        <button
          key={option.value}
          onClick={() => onChange(option.value)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            value === option.value
              ? 'bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300'
              : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200 dark:bg-neutral-800 dark:text-neutral-300 dark:hover:bg-neutral-700'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default Tabs; 