import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}
        <input
          className={`
            w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
            placeholder-gray-400 focus:outline-none focus:ring-2 
            focus:ring-blue-500 focus:border-blue-500
            disabled:bg-gray-50 disabled:text-gray-500
            ${error ? 'border-red-500 focus:ring-red-500 focus:border-red-500' : ''}
            ${className}
          `}
          ref={ref}
          {...props}
        />
        {error && (
          <p className="mt-1 text-sm text-red-600" role="alert">
            {error}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';