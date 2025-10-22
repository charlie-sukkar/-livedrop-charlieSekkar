import React from 'react';
import type { CartItem as CartItemType } from '../../lib/store';
import { Button } from '../atoms/Button';
import { formatCurrency } from '../../lib/format';
import { Icon } from '../atoms/Icon';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (productId: string, quantity: number) => void;
  onRemove: (productId: string) => void;
}

export const CartItem: React.FC<CartItemProps> = ({
  item,
  onUpdateQuantity,
  onRemove,
}) => {
  return (
    <div 
      className="flex items-center space-x-4 bg-gray-50 p-3 rounded-lg"
      role="listitem"
      aria-label={`${item.title}, quantity: ${item.quantity}, price: ${formatCurrency(item.price)}`}
    >
      <img
        src={item.image}  // This should match what's stored in your cart
        alt={item.title}  // This should match what's stored in your cart
        className="w-16 h-16 object-cover rounded"
        loading="lazy"
      />
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium text-gray-900 truncate">
          {item.title}  {/* This should match what's stored in your cart */}
        </h4>
        <p className="text-sm text-gray-500">{formatCurrency(item.price)} each</p>
        
        <div className="flex items-center gap-2 mt-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdateQuantity(item.productId, item.quantity - 1)}
            aria-label={`Decrease quantity of ${item.title}`}
          >
            -
          </Button>
          
          <span 
            className="text-sm font-medium w-8 text-center"
            aria-live="polite"
            aria-atomic="true"
          >
            {item.quantity}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => onUpdateQuantity(item.productId, item.quantity + 1)}
            disabled={item.quantity >= item.stockQty}  // This should match what's stored in your cart
            aria-label={`Increase quantity of ${item.title}`}
          >
            +
          </Button>
        </div>
      </div>
      
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onRemove(item.productId)}
        aria-label={`Remove ${item.title} from cart`}
      >
        <Icon className='h-4 w-4 text-red-500' d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
      </Button>
    </div>
  );
};