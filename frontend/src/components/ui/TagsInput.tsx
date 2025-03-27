import React, { useState } from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

interface TagsInputProps {
  value: string[];
  onChange: (tags: string[]) => void;
  maxTags?: number;
  className?: string;
}

const TagsInput: React.FC<TagsInputProps> = ({
  value = [],
  onChange,
  maxTags = 10,
  className = ''
}) => {
  const [input, setInput] = useState('');

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      addTag();
    } else if (e.key === 'Backspace' && !input && value.length > 0) {
      removeTag(value.length - 1);
    }
  };

  const addTag = () => {
    const tag = input.trim();
    if (tag && !value.includes(tag) && value.length < maxTags) {
      onChange([...value, tag]);
      setInput('');
    }
  };

  const removeTag = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  return (
    <div className={`flex flex-wrap gap-2 p-2 border rounded-lg ${className}`}>
      {value.map((tag, index) => (
        <span
          key={index}
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300"
        >
          {tag}
          <button
            type="button"
            onClick={() => removeTag(index)}
            className="ml-1 inline-flex items-center justify-center"
          >
            <XMarkIcon className="h-4 w-4" />
          </button>
        </span>
      ))}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        className="flex-1 min-w-[120px] bg-transparent focus:outline-none"
        placeholder={value.length < maxTags ? "Add tags..." : ""}
        disabled={value.length >= maxTags}
      />
    </div>
  );
};

export default TagsInput; 