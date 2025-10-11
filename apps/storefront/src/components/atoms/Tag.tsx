import React from 'react';

export interface TagProps {
  label: string;
  isActive?: boolean;
  removable?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
}

export const Tag: React.FC<TagProps> = ({
  label,
  isActive = false,
  removable = false,
  onClick,
  onRemove,
  className = '',
}) => {
  const baseClasses = `inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium transition-colors ${className}`;
  
  const activeClasses = isActive 
    ? 'bg-blue-600 text-white hover:bg-blue-700' 
    : 'bg-gray-200 text-gray-800 hover:bg-gray-300';

  return (
    <span
      className={`${baseClasses} ${activeClasses} ${onClick ? 'cursor-pointer' : ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
    >
      <span>{label}</span>
      {removable && (
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove?.(); }}
          className="ml-1 rounded-full hover:bg-black hover:bg-opacity-10 w-4 h-4 flex items-center justify-center"
          aria-label={`Remove ${label}`}
        >
          x
        </button>
      )}
    </span>
  );
};