import React, { useState } from 'react';

export interface TabProps {
  title: string;
  children: React.ReactNode;
}

export const Tab: React.FC<TabProps> = ({ children }) => {
  return <div className="pt-4">{children}</div>;
};

export interface TabsProps {
  children: React.ReactNode;
  groupId?: string; // Optional identifier for synced tabs across page
}

export const Tabs: React.FC<TabsProps> = ({ children, groupId }) => {
  const tabs = React.Children.toArray(children).filter(
    React.isValidElement
  ) as React.ReactElement<TabProps>[];

  const [activeIndex, setActiveIndex] = useState(0);

  if (tabs.length === 0) return null;

  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        {tabs.map((tab, idx) => {
          const isActive = activeIndex === idx;
          return (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              style={
                isActive
                  ? {
                      borderColor: 'var(--primary-color, #10b981)',
                      color: 'var(--primary-color, #10b981)',
                    }
                  : undefined
              }
              className={`-mb-px px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                isActive
                  ? 'border-b-2 font-semibold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100'
              }`}
            >
              {tab.props.title}
            </button>
          );
        })}
      </div>
      <div>{tabs[activeIndex]}</div>
    </div>
  );
};
