// src/components/ui/tabs.tsx

import React, { useState } from 'react';

interface TabsProps {
  children: React.ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ children }) => {
  return <div className="tabs">{children}</div>;
};

interface TabsListProps {
  children: React.ReactNode;
}

export const TabsList: React.FC<TabsListProps> = ({ children }) => {
  return <div className="tabs-list">{children}</div>;
};

interface TabsTriggerProps {
  children: React.ReactNode;
  onClick?: () => void;
}

export const TabsTrigger: React.FC<TabsTriggerProps> = ({ children, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="tab-trigger text-blue-500 hover:text-blue-700"
    >
      {children}
    </button>
  );
};

interface TabsContentProps {
  children: React.ReactNode;
}

export const TabsContent: React.FC<TabsContentProps> = ({ children }) => {
  return <div className="tab-content">{children}</div>;
};
