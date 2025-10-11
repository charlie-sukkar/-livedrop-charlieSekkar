import React, { useEffect, useRef } from 'react';
import { useCartStore } from '../../lib/store';
import { PanelHeader } from '../molecules/PanelHeader';
import { CartItem } from '../molecules/CartItem';
import { CartFooter } from '../molecules/CartFooter';
import { useNavigate } from 'react-router-dom';
import { EmptyCartState } from '../molecules/EmptyCartState';


interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose }) => {
  const { items, updateQuantity, removeItem, getTotalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();
  const drawerRef = useRef<HTMLDivElement>(null);

useEffect(() => {
  const getFocusableElements = (container: HTMLElement | null): HTMLElement[] => {
    if (!container) return [];
    return Array.from(
      container.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      )
    ).filter(el => !el.hasAttribute('disabled') && el.offsetParent !== null);
  };

  const handleEscape = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && isOpen) onClose();
  };

  const handleTabKey = (e: KeyboardEvent) => {
    if (!isOpen || !drawerRef.current) return;

    const focusable = getFocusableElements(drawerRef.current);
    if (focusable.length === 0) return;

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  if (isOpen && drawerRef.current) {
    const focusable = getFocusableElements(drawerRef.current);
    focusable[0]?.focus();
  }

  document.addEventListener('keydown', handleEscape);
  document.addEventListener('keydown', handleTabKey);

  return () => {
    document.removeEventListener('keydown', handleEscape);
    document.removeEventListener('keydown', handleTabKey);
  };
}, [isOpen, onClose]);

  
  if (!isOpen) return null;

  return (
    <>
      <div
        ref={drawerRef}
        className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl z-50 flex flex-col transform transition-transform duration-300 ease-in-out"
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
      >
       <PanelHeader
          title="Shopping Cart"
          onClose={onClose}
          variant="cart"
        />

        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <EmptyCartState />
          ) : (
            <div role="list" aria-label="Cart items" className="space-y-4">
              {items.map((item) => (
                <CartItem
                  key={item.productId}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <CartFooter
            totalPrice={getTotalPrice()}
            onClearCart={clearCart}
            onViewCart={() => {
              onClose(); 
              navigate('/cart'); 
            }}
            onCheckout={() => {
              onClose(); 
              navigate('/checkout');
            }}
            showViewCart={true}    
            showClearCart={true}   
            variant="drawer"       
          />
        )}
      </div>
    </>
  );
};