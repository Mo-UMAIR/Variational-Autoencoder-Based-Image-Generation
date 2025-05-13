// src/components/ui/card.tsx

import React from 'react';

interface CardProps {
  children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      {children}
    </div>
  );
};

export const CardHeader: React.FC = ({ children }) => {
  return (
    <div className="border-b pb-2 mb-2 text-xl font-semibold">
      {children}
    </div>
  );
};

export const CardContent: React.FC = ({ children }) => {
  return <div className="text-gray-700">{children}</div>;
};

export const CardFooter: React.FC = ({ children }) => {
  return <div className="border-t pt-2 mt-2 text-sm text-gray-500">{children}</div>;
};

export const CardDescription: React.FC = ({ children }) => {
  return <p className="text-gray-500">{children}</p>;
};

export const CardTitle: React.FC = ({ children }) => {
  return <h2 className="text-2xl font-semibold">{children}</h2>;
};
