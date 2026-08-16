import React, { useState, useRef } from 'react';
import { Copy, Check } from 'lucide-react';

export interface CodeGroupProps {
  children: React.ReactNode;
}

export const CodeGroup: React.FC<CodeGroupProps> = ({ children }) => {
  const codeBlocks = React.Children.toArray(children);
  const [activeIndex, setActiveIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Extract titles from props if passed or child data
  const titles = codeBlocks.map((child: any, idx) => {
    return child.props?.title || child.props?.['data-title'] || `Snippet ${idx + 1}`;
  });

  const handleCopy = () => {
    const activeChild: any = codeBlocks[activeIndex];
    let textToCopy = '';

    if (typeof activeChild?.props?.children === 'string') {
      textToCopy = activeChild.props.children;
    } else if (activeChild?.props?.raw) {
      textToCopy = activeChild.props.raw;
    } else if (contentRef.current) {
      textToCopy = contentRef.current.innerText || '';
    }

    if (textToCopy && typeof navigator !== 'undefined') {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="my-6 overflow-hidden rounded-xl border border-slate-800 bg-[#0f172a] shadow-lg">
      <div className="flex items-center justify-between border-b border-slate-800 bg-[#1e293b]/60 px-4 py-2">
        <div className="flex space-x-2">
          {titles.map((title, idx) => {
            const isActive = activeIndex === idx;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => setActiveIndex(idx)}
                style={
                  isActive
                    ? {
                        backgroundColor: 'var(--primary-50, rgba(16, 185, 129, 0.15))',
                        color: 'var(--primary-light, #34d399)',
                      }
                    : undefined
                }
                className={`rounded-md px-2.5 py-1 text-xs font-mono transition-colors ${
                  isActive
                    ? 'font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {title}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-md px-2 py-1 text-xs text-slate-400 transition hover:bg-slate-800 hover:text-slate-200"
          title="Copy code"
        >
          {copied ? (
            <>
              <Check className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <Copy className="h-3.5 w-3.5" />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>
      <div ref={contentRef} className="p-4 text-sm font-mono overflow-x-auto text-slate-200">
        {codeBlocks[activeIndex]}
      </div>
    </div>
  );
};
