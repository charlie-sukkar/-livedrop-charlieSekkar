import React from 'react';
import { Input } from '../atoms/Input';
import { Icon } from '../atoms/Icon';

interface SearchBoxProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const SearchBox: React.FC<SearchBoxProps> = ({
  value,
  onChange,
  placeholder = 'Search products...',
}) => {
  return (
    <div className="w-full">
      <div className="relative">
        <Input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="pl-10 pr-4"
          aria-label="Search products"
        />

        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className='h-5 w-5 text-gray-400' d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </div>
      </div>
    </div>
  );
};

SearchBox.displayName = 'SearchBox';
