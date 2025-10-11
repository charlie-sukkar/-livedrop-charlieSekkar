import React from 'react';
import { OrderInfoItem } from '../atoms/OrderInfoItem';

interface ShippingInfoProps {
  carrier?: string;
  eta?: string;
  status: string;
}

export const ShippingInfo: React.FC<ShippingInfoProps> = ({ 
  carrier, 
  eta, 
  status 
}) => {
  const shouldShowShippingInfo = status;
  
  if (!shouldShowShippingInfo) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Shipping Information</h2> 
      
      <dl className="space-y-3">
        {carrier && (      
          <OrderInfoItem 
            label="Carrier" 
            value={carrier}
          />
        )}
        {eta && (
          <OrderInfoItem 
            label="Estimated Delivery" 
            value={eta}
          />
        )}
        {!carrier && !eta && (
          <p className="text-sm text-gray-500">
            {status === 'Delivered'
              ? 'This order has been delivered. Shipping info is now closed.'
              : 'Shipping details will be updated soon.'}
          </p>
        )}
      </dl>
    </div>
  );
};