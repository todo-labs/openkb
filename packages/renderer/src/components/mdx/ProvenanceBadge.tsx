import React from 'react';
import { ShieldCheck, Bot, User, Clock, FileCode, CheckCircle2 } from 'lucide-react';
import type { OkfFrontmatter } from '../../lib/okf';
import { formatActorLabel } from '../../lib/okf';

export interface ProvenanceBadgeProps {
  frontmatter: OkfFrontmatter;
}

export const ProvenanceBadge: React.FC<ProvenanceBadgeProps> = ({ frontmatter }) => {
  const { status, type, generated, verified, sources } = frontmatter;

  const statusColors = {
    stable: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800',
    draft: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800',
    deprecated: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/40 dark:text-rose-300 dark:border-rose-800',
  }[status || 'stable'];

  const formattedGenerated = generated?.by ? formatActorLabel(generated.by) : null;
  
  // Format verification if present
  const verifications = Array.isArray(verified) ? verified : verified ? [verified] : [];

  return (
    <div className="my-4 flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4 text-xs dark:border-slate-800">
      {/* OKF Concept Type */}
      <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 font-medium text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300">
        <FileCode className="h-3 w-3" />
        {type}
      </span>

      {/* Lifecycle Status */}
      <span className={`inline-flex items-center gap-1 rounded-md border px-2 py-0.5 font-medium ${statusColors}`}>
        <CheckCircle2 className="h-3 w-3" />
        {(status || 'stable').toUpperCase()}
      </span>

      {/* Generator Actor */}
      {formattedGenerated && (
        <span className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400">
          <Bot className="h-3 w-3 text-purple-500" />
          <span>Synthesized by <strong className="font-medium text-slate-900 dark:text-slate-200">{formattedGenerated.name}</strong></span>
        </span>
      )}

      {/* Verification Badge */}
      {verifications.length > 0 && (
        <span className="inline-flex items-center gap-1 rounded-md border border-emerald-200 bg-emerald-50/60 px-2 py-0.5 text-emerald-700 dark:border-emerald-900 dark:bg-emerald-950/30 dark:text-emerald-300">
          <ShieldCheck className="h-3 w-3 text-emerald-600 dark:text-emerald-400" />
          <span>Verified by {formatActorLabel(verifications[0].by).name}</span>
        </span>
      )}

      {/* Source count */}
      {sources && sources.length > 0 && (
        <span className="inline-flex items-center gap-1 text-slate-400 dark:text-slate-500">
          <span>•</span>
          <span>{sources.length} source {sources.length === 1 ? 'file' : 'files'}</span>
        </span>
      )}
    </div>
  );
};
