import React from 'react';

type OrderStatus = 'Placed' | 'Packed' | 'Shipped' | 'Delivered' | 'NotFound';

interface OrderStatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const statusConfig: Record<OrderStatus, { color: string; label: string }> = {
  Placed: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Order Placed' },
  Packed: { color: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Packed' },
  Shipped: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Shipped' },
  Delivered: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Delivered' },
  NotFound: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Not Found' },
};

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ 
  status, 
  className = '' 
}) => {
  const config = statusConfig[status];
  
  return (
    <span 
      className={`
        inline-flex items-center px-3 py-1 rounded-full border-2 font-medium text-sm
        ${config.color} ${className}
      `}
      role="status"
      aria-label={`Order status: ${config.label}`}
    >
      {config.label}
    </span>
  );
};