// src/components/ui/button.tsx

import React from 'react';

type Variant = 'default' | 'outline' | 'ghost';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  variant?: Variant;
  disabled?: boolean;  // Add the disabled prop here
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = '',
  variant = 'default',
  disabled = false,  // Default to false
}) => {
  const baseStyles = 'px-4 py-2 rounded-md focus:outline-none transition-colors';
  let variantStyles = '';

  switch (variant) {
    case 'outline':
      variantStyles = 'border border-gray-300 text-gray-800 bg-white hover:bg-gray-100';
      break;
    case 'ghost':
      variantStyles = 'bg-transparent text-gray-800 hover:bg-gray-100';
      break;
    case 'default':
    default:
      variantStyles = 'bg-blue-500 text-white hover:bg-blue-600';
      break;
  }

  return (
    <button
      onClick={onClick}
      className={`${baseStyles} ${variantStyles} ${className}`}
      disabled={disabled}  // Apply the disabled prop to the button
    >
      {children}
    </button>
  );
};
