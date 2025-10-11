import React from 'react';
import { Button } from '../atoms/Button';
import { PriceDisplay } from '../atoms/PriceDisplay'; 



interface CartFooterProps {
  totalPrice: number;
  onClearCart?: () => void;
  onViewCart?: () => void;
  onCheckout?: () => void;
  showViewCart?: boolean;    
  showClearCart?: boolean;   
  variant?: 'drawer' | 'page'; 
}

export const CartFooter: React.FC<CartFooterProps> = ({ 
  totalPrice, 
  onClearCart, 
  onViewCart,
  onCheckout,
  showViewCart = true,      
  showClearCart = true,     
  variant = 'drawer'        
}) => {
  const isDrawer = variant === 'drawer';

  return (
     <div className="border-t p-4 space-y-4">
    
    <PriceDisplay amount={totalPrice} label='Total:'/>

      <div className={`flex gap-2 ${isDrawer ? 'flex-col' : 'flex-row'}`}>
        {showClearCart && onClearCart && (
          <Button
            variant="outline"
            onClick={onClearCart}
            className={isDrawer ? 'w-full' : 'flex-1'}
            aria-label="Clear all items from cart"
          >
            Clear Cart
          </Button>
        )}
        
        {showViewCart && onViewCart && (
          <Button
            variant={isDrawer ? "primary" : "outline"} 
            onClick={onViewCart}
            className={isDrawer ? 'w-full' : 'flex-1'}
            aria-label="View full cart"
          >
            View Cart
          </Button>
        )}
        
        {onCheckout && (
          <Button
            onClick={onCheckout}
            className={isDrawer ? 'w-full' : 'flex-1'}
            aria-label="Proceed to checkout"
          >
            Checkout
          </Button>
        )}
      </div>
    </div>
  );
};