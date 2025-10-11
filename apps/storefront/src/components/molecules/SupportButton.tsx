import React from 'react';
import { Button } from '../atoms/Button';
import { useSupportStore } from '../../lib/store';
import { Icon } from '../atoms/Icon';


interface SupportButtonProps {
  className?: string;
  disabled?: boolean;
}

export const SupportButton: React.FC<SupportButtonProps> = ({ className = '', disabled=false }) => {
  const openSupport = useSupportStore((state) => state.openSupport);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={openSupport}
      aria-label="Open support assistant"
      className={`relative ${className}`}
      disabled={disabled}
    >
      <Icon className='h-6 w-6' d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </Button>
  );
};