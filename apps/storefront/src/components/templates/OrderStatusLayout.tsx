import React from 'react';

interface OrderStatusLayoutProps {
  header: React.ReactNode;
  timeline: React.ReactNode;
  shippingInfo: React.ReactNode;
  orderDetails: React.ReactNode;
}

export const OrderStatusLayout: React.FC<OrderStatusLayoutProps> = ({
  header,
  timeline,
  shippingInfo,
  orderDetails,
}) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-6xl">

        <div className="mb-8">
          {header}
        </div>
        

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {timeline}
            {shippingInfo}
          </div>
          
          <div className="space-y-6">
            {orderDetails}
          </div>
        </div>
      </div>
    </div>
  );
};