// src/components/ui/button.tsx

import React from 'react';
import clsx from 'clsx'; // optional but helps with clean conditional classes

type Variant = 'default' | 'outline' | 'ghost';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  className?: string;
  variant?: Variant;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = '',
  variant = 'default',
}) => {
  const baseStyles = 'px-4 py-2 rounded-md focus:outline-none transition-colors';
  const variantStyles = {
    default: 'bg-blue-500 text-white hover:bg-blue-600',
    outline: 'border border-gray-300 text-gray-800 bg-white hover:bg-gray-100',
    ghost: 'bg-transparent text-gray-800 hover:bg-gray-100',
  };

  return (
    <button
      onClick={onClick}
      className={clsx(baseStyles, variantStyles[variant], className)}
    >
      {children}
    </button>
  );
};
