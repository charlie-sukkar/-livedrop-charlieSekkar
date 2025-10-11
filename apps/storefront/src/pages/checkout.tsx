import React from 'react';
import { useCartStore } from '../lib/store';
import { CheckoutLayout } from '../components/templates/CheckoutLayout';
import { Button } from '../components/atoms/Button';
import { formatCurrency } from '../lib/format';
import { placeOrder } from '../lib/api';
import { useNavigate } from 'react-router-dom';
import { PriceDisplay } from '../components/atoms/PriceDisplay';

export const CheckoutPage: React.FC = () => {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const navigate = useNavigate();

  const handlePlaceOrder = async () => {
    try {
      const orderItems = items.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }));

      const { orderId } = await placeOrder(orderItems);
      
      clearCart();
      
      navigate(`/order/${orderId}`);
    } catch (error) {
      console.error('Failed to place order:', error);
      alert('Failed to place order. Please try again.');
    }
  };

  const handleBackToCart = () => {
    navigate('/cart');
  };

  const subtotal = getTotalPrice();
  const tax = 0; 
  const shipping = 0; 
  const finalTotal = subtotal + tax + shipping;

  return (
    <CheckoutLayout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
          <p className="text-gray-600 mt-2">Review your order and place it</p>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-x-12 lg:items-start">

          <div className="lg:col-span-7">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
              </div>
              

              <div className="p-6">
                {items.map((item) => (
                  <div key={item.productId} className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0">
                    <div className="flex items-center space-x-4">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-16 h-16 object-cover rounded"
                        loading="lazy"
                      />
                      <div>
                        <h3 className="font-medium text-gray-900">{item.title}</h3>
                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-900">{formatCurrency(item.price * item.quantity)}</p>
                      <p className="text-sm text-gray-500">{formatCurrency(item.price)} each</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6">
              <Button
                variant="outline"
                onClick={handleBackToCart}
                aria-label="Go back to cart"
              >
                ← Back to Cart
              </Button>
            </div>
          </div>

          <div className="mt-8 lg:mt-0 lg:col-span-5">
            <div className="bg-gray-50 rounded-lg p-6 shadow-sm border border-gray-200">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Order Total</h2>
              
              <div className="space-y-3 mb-6">
                 <PriceDisplay amount={subtotal} label='Subtotal' className="[&>span]:font-medium text-gray-600" />
                <div className="flex justify-between">
                  <span className="font-medium text-gray-600">Shipping</span>
                  <span className="font-medium text-gray-600">{shipping === 0 ? 'Free' : formatCurrency(shipping)}</span>
                </div>
                 <PriceDisplay amount={0.00} label='Tax' className="[&>span]:font-medium text-gray-600"/>  
                 <PriceDisplay amount={finalTotal} label='Total'/>
              
              </div>

              <Button
                onClick={handlePlaceOrder}
                className="w-full py-3 text-lg"
                aria-label="Place your order"
                disabled={items.length === 0}
              >
                Place Order
              </Button>

              <p className="text-xs text-gray-500 text-center mt-3">
                By placing your order, you agree to our terms and conditions
              </p>
            </div>
          </div>
        </div>
      </div>
    </CheckoutLayout>
  );
};

export default CheckoutPage;