import React from 'react';
import { OrderInfoItem } from '../atoms/OrderInfoItem';
import { OrderDate } from '../atoms/OrderDate';
import { Icon } from '../atoms/Icon';

interface OrderDetailsProps {
  orderId: string;
  status: string;
  createdAt: number;
  carrier?: string;
  eta?: string;
}

export const OrderDetails: React.FC<OrderDetailsProps> = ({
  orderId,
  status,
  createdAt,
  carrier,
  eta,
}) => {


  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h2>
      
      <dl className="space-y-4">
        <OrderInfoItem 
          label="Order ID" 
          value={<code className="text-sm bg-gray-100 px-2 py-1 rounded">{orderId}</code>}
        />
        
        <OrderInfoItem 
          label="Order Date" 
          value={<OrderDate timestamp={createdAt} />}
        />
        
        <OrderInfoItem 
          label="Status" 
          value={
            <span className="font-medium capitalize text-gray-900">
              {status}
            </span>
          }
        />
        
        {carrier && (
          <OrderInfoItem 
            label="Shipping Carrier" 
            value={carrier}
          />
        )}
        
        {eta && (
          <OrderInfoItem 
            label="Estimated Delivery" 
            value={eta}
          />
        )}
      </dl>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-3 text-gray-600">
          <Icon className='w-5 h-5 flex-shrink-0' d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          <p className="text-sm">
            Need help with your order? Click the support button in the bottom right corner.
          </p>
        </div>
      </div>
    </div>
  );
};