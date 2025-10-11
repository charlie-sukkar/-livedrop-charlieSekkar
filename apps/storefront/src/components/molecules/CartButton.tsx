import React from 'react';
import { Button } from '../atoms/Button';
import { useCartStore } from '../../lib/store';
import { Icon } from '../atoms/Icon';

interface CartButtonProps {
  className?: string;
  disabled?: boolean;
}

export const CartButton: React.FC<CartButtonProps> = ({ className = '', disabled=false }) => {
  const { openCart, getTotalItems } = useCartStore();
  const totalItems = getTotalItems();

  const handleClick = () => {
    openCart();
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      aria-label={`Open cart with ${totalItems} items`}
      className={`relative ${className}`}
      disabled={disabled}
    >
      <Icon className='h-6 w-6' d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      {totalItems > 0 && (
        <span className="absolute -top-2 -right-2 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {totalItems}
        </span>
      )}
    </Button>
  );
};