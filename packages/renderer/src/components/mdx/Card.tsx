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
      className={`group relative overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-elevated)] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-[var(--primary-color)] hover:shadow-md ${
        horizontal ? 'flex items-center gap-4' : 'flex flex-col'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        {IconComponent && (
          <div
            className="mb-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-transform duration-200 group-hover:scale-105"
            style={{
              backgroundColor: 'var(--primary-50, rgba(16, 185, 129, 0.08))',
              color: 'var(--primary-color, #10b981)',
            }}
          >
            <IconComponent className="h-4.5 w-4.5" />
          </div>
        )}
        {href && (
          <span className="opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 text-[var(--primary-color)]">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 17 17 7M7 7h10v10"/>
            </svg>
          </span>
        )}
      </div>
      <div>
        <h3 className="font-semibold text-[var(--text-main)] text-sm group-hover:text-[var(--primary-color)] transition-colors">
          {title}
        </h3>
        {children && (
          <div className="mt-1.5 text-xs text-[var(--text-muted)] leading-relaxed">
            {children}
          </div>
        )}
      </div>
    </div>
  );

  let targetHref = href;
  if (href && !href.startsWith('http') && !href.startsWith('#') && !href.startsWith('mailto:')) {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/openkb')) {
      const clean = href.replace(/^\//, '').replace(/\/$/, '');
      targetHref = clean ? `/openkb/${clean}/` : '/openkb/';
    }
  }

  if (targetHref) {
    return (
      <a href={targetHref} className="no-underline block">
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
