import React from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost';
type Size = 'sm' | 'md' | 'lg' | 'icon';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  className?: string;
}

const cx = (...parts: Array<string | false | null | undefined>) =>
  parts.filter(Boolean).join(' ');

const base =
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';

const variantClasses: Record<Variant, string> = {
  primary: 'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300',
  outline: 'border border-gray-300 bg-transparent hover:bg-gray-50',
  ghost: 'bg-transparent hover:bg-gray-100',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-xs',
  md: 'h-10 px-4 py-2',
  lg: 'h-12 px-6 text-lg',
  icon: 'h-10 w-10',
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className, ...props }, ref) => {
    const classNames = cx(base, variantClasses[variant], sizeClasses[size], className);
    return <button ref={ref} className={classNames} {...props} />;
  }
);

Button.displayName = 'Button';
