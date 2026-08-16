import React, { useEffect, useState, useRef } from 'react';
import { Search, X, ArrowRight, FileText } from 'lucide-react';

export const SearchModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Global Cmd+K keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    const triggerBtn = document.getElementById('openkb-search-trigger');
    const handleTriggerClick = () => setIsOpen(true);

    if (triggerBtn) {
      triggerBtn.addEventListener('click', handleTriggerClick);
    }
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (triggerBtn) {
        triggerBtn.removeEventListener('click', handleTriggerClick);
      }
    };
  }, [isOpen]);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  // Pagefind search execution
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    let isCancelled = false;
    setLoading(true);

    const performSearch = async () => {
      try {
        if (typeof window !== 'undefined' && (window as any).pagefind) {
          const pagefind = (window as any).pagefind;
          const searchResult = await pagefind.search(query);
          const loadedResults = await Promise.all(
            searchResult.results.slice(0, 8).map((r: any) => r.data())
          );
          if (!isCancelled) {
            setResults(loadedResults);
            setLoading(false);
          }
        } else {
          // Fallback if pagefind isn't built yet (dev mode preview)
          if (!isCancelled) {
            setResults([
              {
                url: '/',
                meta: { title: 'Documentation Index' },
                excerpt: 'Search index is fully populated on static production build via Pagefind.',
              },
            ]);
            setLoading(false);
          }
        }
      } catch (err) {
        console.error('Pagefind search error:', err);
        if (!isCancelled) setLoading(false);
      }
    };

    const debounce = setTimeout(performSearch, 150);
    return () => {
      isCancelled = true;
      clearTimeout(debounce);
    };
  }, [query]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-900/60 backdrop-blur-sm"
      onClick={() => setIsOpen(false)}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all dark:border-slate-800 dark:bg-slate-900"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search input header */}
        <div className="relative flex items-center border-b border-slate-200 px-4 py-3 dark:border-slate-800">
          <Search className="h-5 w-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documentation, concepts, and guides..."
            className="w-full bg-transparent px-3 text-sm text-slate-900 placeholder-slate-400 outline-none dark:text-slate-100"
          />
          {query ? (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          ) : (
            <kbd className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-500 dark:bg-slate-800 dark:text-slate-400">
              ESC
            </kbd>
          )}
        </div>

        {/* Search results */}
        <div className="max-h-96 overflow-y-auto p-2">
          {loading && (
            <div className="py-6 text-center text-xs text-slate-400">
              Searching knowledge base...
            </div>
          )}

          {!loading && results.length > 0 && (
            <ul className="space-y-1">
              {results.map((item, idx) => {
                // Sanitize excerpt: allow only <mark> and </mark> tags for highlighting
                const sanitizedExcerpt = item.excerpt
                  ? item.excerpt.replace(/<(?!\/?mark\b)[^>]+>/gi, '')
                  : '';

                return (
                  <li key={idx}>
                    <a
                      href={item.url}
                      onClick={() => setIsOpen(false)}
                      className="flex flex-col gap-1 rounded-xl p-3 text-slate-700 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800/60"
                    >
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-2 font-medium text-slate-900 dark:text-slate-100">
                          <FileText className="h-4 w-4 text-[var(--primary-color,#10b981)]" />
                          {item.meta?.title || item.url}
                        </span>
                        <ArrowRight className="h-3.5 w-3.5 text-slate-400" />
                      </div>
                      {sanitizedExcerpt && (
                        <p
                          className="text-xs text-slate-500 line-clamp-2 dark:text-slate-400"
                          dangerouslySetInnerHTML={{ __html: sanitizedExcerpt }}
                        />
                      )}
                    </a>
                  </li>
                );
              })}
            </ul>
          )}

          {!loading && query && results.length === 0 && (
            <div className="py-8 text-center text-xs text-slate-400">
              No results found for "<span className="text-slate-600 dark:text-slate-200">{query}</span>"
            </div>
          )}

          {!query && (
            <div className="py-6 text-center text-xs text-slate-400">
              Type keywords to search documentation concepts, OKF types, or endpoints.
            </div>
          )}
        </div>

        {/* Modal footer */}
        <div className="flex items-center justify-between border-t border-slate-200 bg-slate-50/50 px-4 py-2 text-[11px] text-slate-400 dark:border-slate-800 dark:bg-slate-950/40">
          <span>Search powered by Pagefind (100% Client Static)</span>
          <span>Open Knowledge Format v0.2</span>
        </div>
      </div>
    </div>
  );
};
