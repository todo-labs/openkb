import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, FileText, Search, X } from 'lucide-react';

type SearchConfig = {
  results: number;
  titleWeight: number;
  descriptionWeight: number;
  tagsWeight: number;
  typeWeight: number;
};

type SearchResult = {
  url: string;
  excerpt?: string;
  meta?: { title?: string; type?: string; tags?: string; description?: string };
};

type Pagefind = {
  options: (options: { ranking: { metaWeights: Record<string, number> } }) => Promise<void>;
  search: (query: string) => Promise<{ results: { data: () => Promise<SearchResult> }[] }>;
};

declare global {
  interface Window { pagefind?: Pagefind }
}

export const SearchModal: React.FC<{ search: SearchConfig }> = ({ search }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [indexUnavailable, setIndexUnavailable] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setIsOpen((open) => !open);
      }
      if (event.key === 'Escape') setIsOpen(false);
    };
    const trigger = document.getElementById('openkb-search-trigger');
    const openSearch = () => setIsOpen(true);
    trigger?.addEventListener('click', openSearch);
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      trigger?.removeEventListener('click', openSearch);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setQuery('');
      setResults([]);
      setIndexUnavailable(false);
      return;
    }
    const timer = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const timer = window.setTimeout(async () => {
      const pagefind = window.pagefind;
      if (!pagefind) {
        if (!cancelled) setIndexUnavailable(true);
        return;
      }

      setLoading(true);
      setIndexUnavailable(false);
      try {
        await pagefind.options({
          ranking: {
            metaWeights: {
              title: search.titleWeight,
              description: search.descriptionWeight,
              tags: search.tagsWeight,
              type: search.typeWeight,
            },
          },
        });
        const match = await pagefind.search(query);
        const data = await Promise.all(match.results.slice(0, search.results).map((result) => result.data()));
        if (!cancelled) setResults(data);
      } catch (error) {
        console.error('Pagefind search error:', error);
        if (!cancelled) setIndexUnavailable(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 150);

    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [query, search]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-slate-950/55 px-4 pt-16 backdrop-blur-sm sm:pt-24" onClick={() => setIsOpen(false)} role="dialog" aria-modal="true" aria-label="Search documentation">
      <div className="w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-2xl dark:border-slate-700/80 dark:bg-slate-900" onClick={(event) => event.stopPropagation()}>
        <div className="relative flex items-center border-b border-slate-200/80 px-4 py-3 dark:border-slate-700/80">
          <Search className="h-5 w-5 text-[var(--primary-color,#10b981)]" aria-hidden="true" />
          <input ref={inputRef} type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search concepts, guides, and APIs…" className="w-full bg-transparent px-3 text-sm text-slate-900 outline-none placeholder:text-slate-400 dark:text-slate-100" />
          {query ? <button onClick={() => setQuery('')} className="rounded p-1 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-color,#10b981)] dark:hover:bg-slate-800 dark:hover:text-slate-100" aria-label="Clear search"><X className="h-4 w-4" /></button> : <kbd className="rounded bg-slate-100 px-2 py-0.5 font-mono text-[10px] text-slate-500 dark:bg-slate-800 dark:text-slate-400">ESC</kbd>}
        </div>

        <div className="max-h-96 overflow-y-auto p-2">
          {loading && <div className="py-7 text-center text-xs text-slate-500 dark:text-slate-400">Searching your local knowledge index…</div>}
          {!loading && results.length > 0 && <ul className="space-y-1">{results.map((item) => {
            const tags = item.meta?.tags?.split(/\s+/).filter(Boolean).slice(0, 3) ?? [];
            const excerpt = item.excerpt?.replace(/<(?!\/?mark\b)[^>]+>/gi, '') ?? item.meta?.description ?? '';
            return <li key={item.url}><a href={item.url} onClick={() => setIsOpen(false)} className="group block rounded-xl p-3 transition hover:bg-emerald-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary-color,#10b981)] dark:hover:bg-emerald-950/25"><div className="flex items-center justify-between gap-3"><span className="flex min-w-0 items-center gap-2 font-medium text-slate-900 dark:text-slate-100"><FileText className="h-4 w-4 shrink-0 text-[var(--primary-color,#10b981)]" /> <span className="truncate">{item.meta?.title || item.url}</span></span><ArrowRight className="h-3.5 w-3.5 shrink-0 text-slate-400 transition group-hover:translate-x-0.5 group-hover:text-[var(--primary-color,#10b981)]" /></div>{(item.meta?.type || tags.length > 0) && <div className="mt-2 flex flex-wrap gap-1.5">{item.meta?.type && <span className="rounded-md bg-emerald-50 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">{item.meta.type}</span>}{tags.map((tag) => <span key={tag} className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] text-slate-600 dark:bg-slate-800 dark:text-slate-300">{tag}</span>)}</div>}{excerpt && <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500 dark:text-slate-400" dangerouslySetInnerHTML={{ __html: excerpt }} />}</a></li>;
          })}</ul>}
          {!loading && indexUnavailable && <div className="px-4 py-8 text-center text-xs leading-5 text-slate-500 dark:text-slate-400">The local index is created during a production build. Run <code className="rounded bg-slate-100 px-1 py-0.5 font-mono text-slate-700 dark:bg-slate-800 dark:text-slate-200">pnpm build</code> to search this site locally.</div>}
          {!loading && !indexUnavailable && query && results.length === 0 && <div className="py-8 text-center text-xs text-slate-500 dark:text-slate-400">No local results for <span className="font-medium text-slate-700 dark:text-slate-200">“{query}”</span>.</div>}
          {!query && <div className="px-3 py-6 text-xs leading-5 text-slate-500 dark:text-slate-400">Search the local index. Titles, OKF types, tags, and descriptions are weighted before body text.</div>}
        </div>

        <div className="flex items-center justify-between border-t border-slate-200/80 bg-slate-50/70 px-4 py-2 text-[11px] text-slate-500 dark:border-slate-700/80 dark:bg-slate-950/35 dark:text-slate-400"><span>Local Pagefind index</span><span>⌘K to search</span></div>
      </div>
    </div>
  );
};
