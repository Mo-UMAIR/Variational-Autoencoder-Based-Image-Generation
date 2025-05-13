// src/components/ui/card.tsx

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div className={`bg-white p-4 rounded-lg shadow-md ${className}`}>
      {children}
    </div>
  );
};

export const CardHeader: React.FC<CardProps> = ({ children, className = "" }) => {
  return (
    <div className={`border-b pb-2 mb-2 text-xl font-semibold ${className}`}>
      {children}
    </div>
  );
};

export const CardContent: React.FC<CardProps> = ({ children, className = "" }) => {
  return <div className={`text-gray-700 ${className}`}>{children}</div>;
};

export const CardFooter: React.FC<CardProps> = ({ children, className = "" }) => {
  return <div className={`border-t pt-2 mt-2 text-sm text-gray-500 ${className}`}>{children}</div>;
};

export const CardDescription: React.FC<CardProps> = ({ children, className = "" }) => {
  return <p className={`text-gray-500 ${className}`}>{children}</p>;
};

export const CardTitle: React.FC<CardProps> = ({ children, className = "" }) => {
  return <h2 className={`text-2xl font-semibold ${className}`}>{children}</h2>;
};
