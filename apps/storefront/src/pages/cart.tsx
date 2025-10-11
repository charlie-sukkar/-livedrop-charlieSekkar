import React from 'react';
import { useCartStore } from '../lib/store';
import { CartLayout } from '../components/templates/CartLayout';
import { CartItem } from '../components/molecules/CartItem';
import { CartFooter } from '../components/molecules/CartFooter';
import { Button } from '../components/atoms/Button';
import { useNavigate } from 'react-router-dom';
import { EmptyCartState } from '../components/molecules/EmptyCartState';

export const CartPage: React.FC = () => {
  const { items, updateQuantity, removeItem, clearCart, getTotalPrice } = useCartStore();
  const navigate = useNavigate();
  const totalPrice = getTotalPrice();

  const handleUpdateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
    } else {
      updateQuantity(productId, quantity);
    }
  };

  const handleContinueShopping = () => {
    navigate('/');
  };


  if (items.length === 0) {
    return(
     <EmptyCartState showButton={true} onButtonClick={handleContinueShopping} />
  );
};

  return (
    <CartLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Cart</h1>
          <p className="text-gray-600 mt-2">
            {items.length} item{items.length !== 1 ? 's' : ''} in your cart
          </p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">

          <div className="lg:col-span-7">
            <ul className="border border-gray-200 divide-y divide-gray-200 rounded-lg bg-white shadow-sm">
              {items.map((item) => (
                <li key={item.productId}>
                  <CartItem
                    item={item}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={removeItem}
                  />
                </li>
              ))}
            </ul>

            <div className="mt-6">
              <Button
                variant="outline"
                onClick={handleContinueShopping}
                aria-label="Continue shopping"
              >
                ← Continue Shopping
              </Button>
            </div>
          </div>

          <div className="mt-8 lg:mt-0 lg:col-span-5">
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
              
              <CartFooter
                totalPrice={totalPrice}
                onClearCart={clearCart}
                onCheckout={() => navigate('/checkout')}
                showViewCart={false}
                showClearCart={true}
                variant="page"
              />
            </div>
          </div>
        </div>
      </div>
    </CartLayout>
  );
};

export default CartPage;