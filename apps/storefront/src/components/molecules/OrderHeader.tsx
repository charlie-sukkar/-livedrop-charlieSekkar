import React from 'react';
import { OrderStatusBadge } from '../atoms/OrderStatusBadge';
import { OrderDate } from '../atoms/OrderDate';

interface OrderHeaderProps {
  orderId: string;
  status: string;
  createdAt: number;
  children?: React.ReactNode;
}

export const OrderHeader: React.FC<OrderHeaderProps> = ({ 
  orderId, 
  status, 
  createdAt 
}) => {
  
  
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Order #{orderId}
          </h1>
          <p className="text-gray-600">
            Placed on <OrderDate timestamp={createdAt} />
          </p>
        </div>
        <OrderStatusBadge status={status as any} />
      </div>
    </div>
  );
};