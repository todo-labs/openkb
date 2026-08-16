import React from 'react';
import { Info, Lightbulb, AlertTriangle, AlertOctagon, CheckCircle2 } from 'lucide-react';

export type CalloutType = 'note' | 'tip' | 'warning' | 'danger' | 'check';

export interface CalloutProps {
  type?: CalloutType;
  title?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const CALLOUT_STYLES = {
  note: {
    border: 'border-blue-500/30',
    bg: 'bg-blue-50/50 dark:bg-blue-950/20',
    text: 'text-blue-900 dark:text-blue-200',
    iconColor: 'text-blue-500',
    defaultIcon: <Info className="h-5 w-5" />,
    defaultTitle: 'Note',
  },
  tip: {
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
    text: 'text-emerald-900 dark:text-emerald-200',
    iconColor: 'text-emerald-500',
    defaultIcon: <Lightbulb className="h-5 w-5" />,
    defaultTitle: 'Tip',
  },
  warning: {
    border: 'border-amber-500/30',
    bg: 'bg-amber-50/50 dark:bg-amber-950/20',
    text: 'text-amber-900 dark:text-amber-200',
    iconColor: 'text-amber-500',
    defaultIcon: <AlertTriangle className="h-5 w-5" />,
    defaultTitle: 'Warning',
  },
  danger: {
    border: 'border-rose-500/30',
    bg: 'bg-rose-50/50 dark:bg-rose-950/20',
    text: 'text-rose-900 dark:text-rose-200',
    iconColor: 'text-rose-500',
    defaultIcon: <AlertOctagon className="h-5 w-5" />,
    defaultTitle: 'Danger',
  },
  check: {
    border: 'border-emerald-500/30',
    bg: 'bg-emerald-50/50 dark:bg-emerald-950/20',
    text: 'text-emerald-900 dark:text-emerald-200',
    iconColor: 'text-emerald-500',
    defaultIcon: <CheckCircle2 className="h-5 w-5" />,
    defaultTitle: 'Success',
  },
};

export const Callout: React.FC<CalloutProps> = ({
  type = 'note',
  title,
  icon,
  children,
}) => {
  const style = CALLOUT_STYLES[type] || CALLOUT_STYLES.note;

  return (
    <div
      className={`my-6 flex gap-3.5 rounded-xl border p-4 ${style.border} ${style.bg}`}
    >
      <div className={`shrink-0 pt-0.5 ${style.iconColor}`}>
        {icon || style.defaultIcon}
      </div>
      <div className="flex-1 text-sm">
        {title && (
          <h5 className={`mb-1 font-semibold ${style.text}`}>{title}</h5>
        )}
        <div className={style.text}>{children}</div>
      </div>
    </div>
  );
};

export const Note: React.FC<{ children: React.ReactNode; title?: string }> = (props) => (
  <Callout type="note" {...props} />
);

export const Tip: React.FC<{ children: React.ReactNode; title?: string }> = (props) => (
  <Callout type="tip" {...props} />
);

export const Warning: React.FC<{ children: React.ReactNode; title?: string }> = (props) => (
  <Callout type="warning" {...props} />
);

export const Danger: React.FC<{ children: React.ReactNode; title?: string }> = (props) => (
  <Callout type="danger" {...props} />
);

export const Check: React.FC<{ children: React.ReactNode; title?: string }> = (props) => (
  <Callout type="check" {...props} />
);
