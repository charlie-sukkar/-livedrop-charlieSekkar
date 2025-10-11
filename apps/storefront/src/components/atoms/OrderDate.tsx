import React from 'react';

interface OrderDateProps {
  timestamp: number;
  showTime?: boolean;
  className?: string;
}

export const OrderDate: React.FC<OrderDateProps> = ({ timestamp, showTime = false, className = '' }) => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...(showTime ? { hour: '2-digit', minute: '2-digit' } : {}),
  };

  const formatted = new Date(timestamp).toLocaleDateString('en-US', options);

  return <span className={className}>{formatted}</span>;
};
