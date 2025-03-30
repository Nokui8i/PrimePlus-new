import React from 'react';

interface SearchBarProps {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  className?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({
  placeholder = 'חיפוש...',
  value,
  onChange,
  onSubmit,
  className = '',
}) => {
  return (
    <form onSubmit={onSubmit} className={`${className}`}>
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </form>
  );
};

export default SearchBar; 