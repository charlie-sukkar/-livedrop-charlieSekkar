import React, { useState } from 'react';
import { Select } from '../atoms/Select';
import { Tag } from '../atoms/Tag';

interface ProductFiltersProps {
  onSortChange: (sort: 'price-asc' | 'price-desc' | 'name') => void;
  onTagFilter: (tags: string[]) => void;
  availableTags: string[];
  initialSort?: 'price-asc' | 'price-desc' | 'name';
}

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  onSortChange,
  onTagFilter,
  availableTags,
  initialSort = 'name',
}) => {
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'price-asc' | 'price-desc' | 'name'>(initialSort);

  const handleTagToggle = (tag: string) => {
    const newSelectedTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    
    setSelectedTags(newSelectedTags);
    onTagFilter(newSelectedTags);
  };

  const handleSortChange = (value: string) => {
    const sortValue = value as 'price-asc' | 'price-desc' | 'name';
    setSortBy(sortValue);
    onSortChange(sortValue);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const newSelectedTags = selectedTags.filter(tag => tag !== tagToRemove);
    setSelectedTags(newSelectedTags);
    onTagFilter(newSelectedTags);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div className="flex flex-wrap gap-2">
          {selectedTags.length === 0 && (
            <Tag
              label="All"
              isActive
              onClick={() => setSelectedTags([])}
            />
          )}
          {availableTags.map(tag => (
            <Tag
              key={tag}
              label={tag}
              isActive={selectedTags.includes(tag)}
              onClick={() => handleTagToggle(tag)}
            />
          ))}
        </div>

        <div className="flex-shrink-0">
          <Select
            label="Sort by"
            value={sortBy}
            onChange={(e) => handleSortChange(e.target.value)}
            options={[
              { label: 'Name', value: 'name' },
              { label: 'Price: Low to High', value: 'price-asc' },
              { label: 'Price: High to Low', value: 'price-desc' },
            ]}
            className="w-40" 
          />
        </div>
      </div>


      {selectedTags.length > 0 && (
        <div className="mb-2 flex flex-wrap gap-2">
          {selectedTags.map(tag => (
            <Tag
              key={tag}
              label={tag}
              removable
              onRemove={() => handleRemoveTag(tag)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
