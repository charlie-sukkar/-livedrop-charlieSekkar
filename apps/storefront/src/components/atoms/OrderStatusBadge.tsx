import React from 'react';

//type OrderStatus = 'Placed' | 'Packed' | 'Shipped' | 'Delivered' | 'NotFound';

interface OrderStatusBadgeProps {
  status: string; // ✅ CHANGE FROM OrderStatus TO string (more flexible)
  className?: string;
}

const statusConfig: Record<string, { color: string; label: string }> = {
  Placed: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Order Placed' },
  Packed: { color: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Packed' },
  Shipped: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Shipped' },
  Delivered: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Delivered' },
  NotFound: { color: 'bg-red-100 text-red-800 border-red-200', label: 'Not Found' },
  // ✅ ADD BACKEND STATUSES AS FALLBACK
  PENDING: { color: 'bg-blue-100 text-blue-800 border-blue-200', label: 'Order Placed' },
  PROCESSING: { color: 'bg-purple-100 text-purple-800 border-purple-200', label: 'Packed' },
  SHIPPED: { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', label: 'Shipped' },
  DELIVERED: { color: 'bg-green-100 text-green-800 border-green-200', label: 'Delivered' },
};

export const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ 
  status, 
  className = '' 
}) => {
  // ✅ ADD SAFETY CHECK
  const config = statusConfig[status] || { 
    color: 'bg-gray-100 text-gray-800 border-gray-200', 
    label: status 
  };
  
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