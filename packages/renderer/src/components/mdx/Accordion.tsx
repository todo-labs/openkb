import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';

export interface AccordionProps {
  title: string;
  icon?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export const Accordion: React.FC<AccordionProps> = ({
  title,
  defaultOpen = false,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-slate-200 py-3 last:border-b-0 dark:border-slate-800">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between text-left text-sm font-semibold text-slate-900 transition-colors hover:text-[var(--primary-color,#10b981)] dark:text-slate-100"
      >
        <span>{title}</span>
        <ChevronRight
          className={`h-4 w-4 text-slate-400 transition-transform duration-200 ${
            isOpen ? 'rotate-90 text-[var(--primary-color,#10b981)]' : ''
          }`}
        />
      </button>
      {isOpen && (
        <div className="pt-3 text-sm text-slate-600 dark:text-slate-400">
          {children}
        </div>
      )}
    </div>
  );
};

export interface AccordionGroupProps {
  children: React.ReactNode;
}

export const AccordionGroup: React.FC<AccordionGroupProps> = ({ children }) => {
  return (
    <div className="my-6 rounded-xl border border-slate-200 bg-white px-5 py-2 dark:border-slate-800 dark:bg-slate-900/50">
      {children}
    </div>
  );
};
