// src/components/atoms/StockIndicator.tsx
import React from 'react';

interface StockIndicatorProps {
  stockQty: number;
  className?: string;
  showPulse?: boolean;      
  showBackground?: boolean; 
}

export const StockIndicator: React.FC<StockIndicatorProps> = ({
  stockQty,
  className = '',
  showPulse = true,
  showBackground = true,
}) => {
  const getStockStatus = () => {
    if (stockQty === 0) {
      return { text: 'Out of Stock', color: 'text-red-600', bgColor: 'bg-red-100', pulseColor: 'bg-red-400' };
    } else if (stockQty < 10) {
      return { text: `Only ${stockQty} left`, color: 'text-orange-600', bgColor: 'bg-orange-100', pulseColor: 'bg-orange-400' };
    } else {
      return { text: 'In Stock', color: 'text-green-600', bgColor: 'bg-green-100', pulseColor: 'bg-green-400' };
    }
  };

  const status = getStockStatus();

  return (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
        ${showBackground ? status.bgColor : ''}
        ${status.color} ${className}`}
      aria-live="polite"
      aria-atomic="true"
    >
      <span className="relative flex w-2 h-2 mr-2">
        {showPulse && (
          <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${status.pulseColor}`}></span>
        )}
        <span className={`relative inline-flex rounded-full h-2 w-2 ${status.pulseColor}`}></span>
      </span>
      {status.text}
    </div>
  );
};
