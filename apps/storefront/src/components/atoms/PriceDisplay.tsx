import React from 'react';
import { formatCurrency } from '../../lib/format';

interface PriceDisplayProps {
  amount: number;
  className?: string;
  label?: string; 
}

export const PriceDisplay: React.FC<PriceDisplayProps> = ({ amount, className = '', label }) => {
  return (
    <div className={`flex justify-between items-center ${className}`}>
      {label && <span className="text-lg font-bold text-gray-900">{label}</span>}
      <span
        className="text-lg font-bold"
        aria-live="polite"
        aria-atomic="true"
      >
        {formatCurrency(amount)}
      </span>
    </div>
  );
};
