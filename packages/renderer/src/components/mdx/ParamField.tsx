import React from 'react';

export interface ParamFieldProps {
  query?: string;
  path?: string;
  header?: string;
  body?: string;
  type?: string;
  required?: boolean;
  default?: string;
  children?: React.ReactNode;
}

export const ParamField: React.FC<ParamFieldProps> = ({
  query,
  path,
  header,
  body,
  type,
  required = false,
  default: defaultValue,
  children,
}) => {
  const name = query || path || header || body || 'param';
  const location = query ? 'query' : path ? 'path' : header ? 'header' : 'body';

  return (
    <div className="border-b border-slate-200 py-4 last:border-b-0 dark:border-slate-800">
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="font-mono text-sm font-semibold text-slate-900 dark:text-slate-100">
          {name}
        </span>
        {type && (
          <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
            {type}
          </span>
        )}
        <span className="rounded bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wider text-slate-600 dark:bg-slate-800 dark:text-slate-400">
          {location}
        </span>
        {required ? (
          <span className="text-xs font-medium text-rose-500 dark:text-rose-400">
            required
          </span>
        ) : (
          <span className="text-xs text-slate-400 dark:text-slate-500">
            optional
          </span>
        )}
        {defaultValue && (
          <span className="font-mono text-xs text-slate-400 dark:text-slate-500">
            default: {defaultValue}
          </span>
        )}
      </div>
      {children && (
        <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {children}
        </div>
      )}
    </div>
  );
};

export interface ResponseFieldProps {
  name: string;
  type?: string;
  required?: boolean;
  children?: React.ReactNode;
}

export const ResponseField: React.FC<ResponseFieldProps> = ({
  name,
  type,
  required = false,
  children,
}) => {
  return (
    <div className="border-b border-slate-200 py-4 last:border-b-0 dark:border-slate-800">
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="font-mono text-sm font-semibold text-slate-900 dark:text-slate-100">
          {name}
        </span>
        {type && (
          <span className="font-mono text-xs text-slate-500 dark:text-slate-400">
            {type}
          </span>
        )}
        {required ? (
          <span className="text-xs font-medium text-rose-500 dark:text-rose-400">
            required
          </span>
        ) : (
          <span className="text-xs text-slate-400 dark:text-slate-500">
            optional
          </span>
        )}
      </div>
      {children && (
        <div className="mt-2 text-sm text-slate-600 dark:text-slate-400">
          {children}
        </div>
      )}
    </div>
  );
};

export interface ExpandableProps {
  title?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export const Expandable: React.FC<ExpandableProps> = ({
  title = 'Show child properties',
  defaultOpen = false,
  children,
}) => {
  const [isOpen, setIsOpen] = React.useState(defaultOpen);

  return (
    <div className="my-2 rounded-lg border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-900/30">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-xs font-medium text-emerald-600 hover:underline dark:text-emerald-400"
      >
        {isOpen ? 'Hide child properties' : title}
      </button>
      {isOpen && <div className="mt-3 pl-2 border-l border-slate-200 dark:border-slate-800">{children}</div>}
    </div>
  );
};

export interface FrameProps {
  caption?: string;
  children: React.ReactNode;
}

export const Frame: React.FC<FrameProps> = ({ caption, children }) => {
  return (
    <figure className="my-6">
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-slate-100 p-2 dark:border-slate-800 dark:bg-slate-900">
        {children}
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
          {caption}
        </figcaption>
      )}
    </figure>
  );
};
