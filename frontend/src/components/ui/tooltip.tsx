// src/components/ui/tooltip.tsx

import React, { useState } from 'react';

interface TooltipProps {
  text: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({ text, children }) => {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => setIsVisible(false)}
      className="relative inline-block"
    >
      {children}
      {isVisible && (
        <div className="absolute bottom-full mb-2 px-2 py-1 bg-gray-700 text-white text-sm rounded">
          {text}
        </div>
      )}
    </div>
  );
};
