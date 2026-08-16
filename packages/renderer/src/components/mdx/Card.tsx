import React from 'react';
import * as Icons from 'lucide-react';

export interface CardProps {
  title: string;
  icon?: string;
  href?: string;
  horizontal?: boolean;
  children?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({
  title,
  icon,
  href,
  horizontal = false,
  children,
}) => {
  // Dynamically resolve icon from Lucide
  const IconComponent = icon
    ? (Icons as Record<string, any>)[
        icon
          .split('-')
          .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
          .join('')
      ] || Icons.FileText
    : null;

  const content = (
    <div
      className={`group relative overflow-hidden rounded-xl border border-slate-200 bg-white p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 dark:hover:border-slate-700 ${
        horizontal ? 'flex items-center gap-4' : 'flex flex-col'
      }`}
    >
      {IconComponent && (
        <div
          className="mb-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg"
          style={{
            backgroundColor: 'var(--primary-50, rgba(16, 185, 129, 0.1))',
            color: 'var(--primary-color, #10b981)',
          }}
        >
          <IconComponent className="h-5 w-5" />
        </div>
      )}
      <div>
        <h3 className="font-semibold text-slate-900 group-hover:text-[var(--primary-color,#10b981)] dark:text-slate-100">
          {title}
        </h3>
        {children && (
          <div className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            {children}
          </div>
        )}
      </div>
    </div>
  );

  if (href) {
    return (
      <a href={href} className="no-underline">
        {content}
      </a>
    );
  }

  return content;
};

export interface CardGroupProps {
  cols?: 1 | 2 | 3 | 4;
  children: React.ReactNode;
}

export const CardGroup: React.FC<CardGroupProps> = ({ cols = 2, children }) => {
  const colClass = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 md:grid-cols-4',
  }[cols];

  return <div className={`my-6 grid gap-4 ${colClass}`}>{children}</div>;
};
