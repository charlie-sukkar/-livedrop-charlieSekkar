import React from 'react';

interface OrderInfoItemProps {
  label: string;
  value: React.ReactNode;
  className?: string;
}

export const OrderInfoItem: React.FC<OrderInfoItemProps> = ({ 
  label, 
  value, 
  className = '' 
}) => {
  return (
    <div className={`flex flex-col sm:flex-row sm:items-center gap-2 ${className}`}>
      <dt className="text-sm font-medium text-gray-500 min-w-[120px] flex-shrink-0">
        {label}
      </dt>
      <dd className="text-sm text-gray-900 flex-1">
        {value}
      </dd>
    </div>
  );
};