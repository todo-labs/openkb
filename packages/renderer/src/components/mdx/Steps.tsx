import React from 'react';

export interface StepProps {
  title?: string;
  children: React.ReactNode;
}

export const Step: React.FC<StepProps> = ({ title, children }) => {
  return (
    <div className="relative pl-8">
      {title && (
        <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
          {title}
        </h4>
      )}
      <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
        {children}
      </div>
    </div>
  );
};

export interface StepsProps {
  children: React.ReactNode;
}

export const Steps: React.FC<StepsProps> = ({ children }) => {
  const steps = React.Children.toArray(children).filter(
    React.isValidElement
  ) as React.ReactElement<StepProps>[];

  return (
    <div className="my-6 space-y-6">
      {steps.map((step, idx) => (
        <div key={idx} className="relative">
          {/* Step connector line */}
          {idx < steps.length - 1 && (
            <div className="absolute left-3.5 top-8 bottom-[-1.5rem] w-px bg-slate-200 dark:bg-slate-800" />
          )}
          {/* Step badge */}
          <div
            className="absolute left-0 top-0 flex h-7 w-7 items-center justify-center rounded-full border text-xs font-bold"
            style={{
              backgroundColor: 'var(--primary-50, rgba(16, 185, 129, 0.1))',
              borderColor: 'var(--primary-100, rgba(16, 185, 129, 0.2))',
              color: 'var(--primary-color, #10b981)',
            }}
          >
            {idx + 1}
          </div>
          {step}
        </div>
      ))}
    </div>
  );
};
