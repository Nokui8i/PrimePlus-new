import React from 'react';
import { Check } from 'lucide-react';

interface CheckboxProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
  error,
  className = '',
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="inline-flex items-center">
        <div
          className={`relative flex h-5 w-5 items-center justify-center rounded border ${
            checked
              ? 'border-indigo-600 bg-indigo-600'
              : 'border-gray-300 bg-white'
          } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          onClick={() => !disabled && onChange(!checked)}
        >
          {checked && (
            <Check className="h-3 w-3 text-white" aria-hidden="true" />
          )}
          <input
            type="checkbox"
            className="sr-only"
            checked={checked}
            onChange={() => !disabled && onChange(!checked)}
            disabled={disabled}
          />
        </div>
        {label && (
          <span className="ml-2 text-sm text-gray-700">{label}</span>
        )}
      </label>
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
};

export default Checkbox; 