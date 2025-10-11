import React from 'react';
import { Button } from '../atoms/Button';
import { Icon } from '../atoms/Icon';

interface EmptyCartStateProps {
  title?: string;
  message?: string;
  showButton?: boolean;
  buttonText?: string;
  onButtonClick?: () => void;
  className?: string;
}

export const EmptyCartState: React.FC<EmptyCartStateProps> = ({
  title = 'Your cart is empty',
  message = 'Start adding some products!',
  showButton = false,
  buttonText = 'Continue Shopping',
  onButtonClick,
  className = '',
}) => {
  return (
    <div
      className={`text-center py-8 ${className}`}
      role="status"
      aria-label={title}
    >
      <Icon className='h-16 w-16 text-gray-400 mx-auto mb-4' d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
      <h2 className="text-xl font-semibold text-gray-900 mb-2">{title}</h2>
      <p className="text-gray-600 mb-6">{message}</p>

      {showButton && onButtonClick && (
        <Button onClick={onButtonClick} aria-label={buttonText}>
          {buttonText}
        </Button>
      )}
    </div>
  );
};
