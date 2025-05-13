import React, { useState, createContext, useContext, ReactNode } from 'react';

interface TabsProps {
  value: string;
  onValueChange: (value: string) => void;
  className?: string;
  children: ReactNode;
}

const TabsContext = createContext<{
  value: string;
  setValue: (value: string) => void;
} | null>(null);

export const Tabs: React.FC<TabsProps> = ({ value, onValueChange, className, children }) => {
  return (
    <TabsContext.Provider value={{ value, setValue: onValueChange }}>
      <div className={className}>{children}</div>
    </TabsContext.Provider>
  );
};

interface TabsListProps {
  children: ReactNode;
  className?: string;
}

export const TabsList: React.FC<TabsListProps> = ({ children, className }) => {
  return <div className={className}>{children}</div>;
};

interface TabsTriggerProps {
  value: string;
  disabled?: boolean;
  children: ReactNode;
  className?: string;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ value, disabled = false, children, className }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsTrigger must be used within a Tabs");

  const isActive = context.value === value;

  return (
    <button
      onClick={() => !disabled && context.setValue(value)}
      className={`tab-trigger px-4 py-2 border-b-2 transition-colors ${
        isActive ? 'border-blue-500 text-blue-600 font-semibold' : 'border-transparent text-gray-500'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:text-blue-600'} ${className}`}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  value: string;
  children: ReactNode;
  className?: string;
}

export const TabsContent: React.FC<TabsContentProps> = ({ value, children, className }) => {
  const context = useContext(TabsContext);
  if (!context) throw new Error("TabsContent must be used within a Tabs");

  if (context.value !== value) return null;

  return <div className={className}>{children}</div>;
};
