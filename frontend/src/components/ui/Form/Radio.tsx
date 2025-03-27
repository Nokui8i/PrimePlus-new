import React from 'react';

interface RadioProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  error?: string;
  className?: string;
  name: string;
  value: string;
}

const Radio: React.FC<RadioProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
  error,
  className = '',
  name,
  value,
}) => {
  return (
    <div className={`flex flex-col ${className}`}>
      <label className="inline-flex items-center">
        <div
          className={`relative flex h-5 w-5 items-center justify-center rounded-full border ${
            checked
              ? 'border-indigo-600'
              : 'border-gray-300'
          } ${disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
          onClick={() => !disabled && onChange(true)}
        >
          {checked && (
            <div className="h-2.5 w-2.5 rounded-full bg-indigo-600" />
          )}
          <input
            type="radio"
            name={name}
            value={value}
            className="sr-only"
            checked={checked}
            onChange={() => !disabled && onChange(true)}
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

export default Radio; 