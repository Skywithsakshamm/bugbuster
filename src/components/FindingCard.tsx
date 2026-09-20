import React from 'react';
import { Finding } from '../types';
import { SeverityBadge, FindingStatusBadge } from './StatusBadge';
import { FileCode, ArrowRight, Wrench, ShieldCheck, HelpCircle } from 'lucide-react';

interface FindingCardProps {
  finding: Finding;
  onSelectFinding: (finding: Finding) => void;
  onViewFix: (finding: Finding) => void;
  onViewRootCause: (finding: Finding) => void;
}

export const FindingCard: React.FC<FindingCardProps> = ({
  finding,
  onSelectFinding,
  onViewFix,
  onViewRootCause
}) => {
  return (
    <div 
      id={`finding-card-${finding.id}`}
      className="rounded-lg border border-[#232936] bg-[#12161f] p-4 hover:border-[#353f52] transition-all shadow-sm flex flex-col justify-between"
    >
      <div>
        {/* Top badges: Severity & Status */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <SeverityBadge severity={finding.severity} />
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700 uppercase">
              {finding.type}
            </span>
          </div>
          <FindingStatusBadge status={finding.status} />
        </div>

        {/* Title */}
        <h3 
          onClick={() => onSelectFinding(finding)}
          className="text-sm font-semibold text-white hover:text-indigo-400 cursor-pointer transition-colors"
        >
          {finding.title}
        </h3>

        {/* File & Line Location */}
        <div className="flex items-center gap-2 my-2 text-xs font-mono text-zinc-400">
          <FileCode className="w-3.5 h-3.5 text-zinc-400" />
          <span className="text-zinc-200">{finding.file}</span>
          <span className="text-zinc-400">Line {finding.lines[0]}–{finding.lines[1]}</span>
        </div>

        {/* Description */}
        <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed mb-3">
          "{finding.description}"
        </p>

        {/* Evidence preview snippet */}
        <div className="rounded border border-[#1e2533] bg-[#0b0e14] p-2.5 mb-3 font-mono text-[11px] text-zinc-300 overflow-hidden relative">
          <div className="text-[10px] text-zinc-400 uppercase tracking-wider mb-1 select-none flex justify-between">
            <span>Evidence</span>
            <span className="text-red-400">L{finding.lines[0]}</span>
          </div>
          <pre className="overflow-x-auto text-red-300/90 whitespace-pre scrollbar-none font-mono">
            {finding.evidenceCode.split('\n').slice(0, 3).join('\n')}
            {finding.evidenceCode.split('\n').length > 3 && '\n...'}
          </pre>
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-[#1e2533] gap-2">
        <button
          type="button"
          onClick={() => onViewRootCause(finding)}
          className="text-xs font-mono text-zinc-400 hover:text-zinc-200 flex items-center gap-1.5 py-1 px-2 rounded hover:bg-[#1a202c] transition-colors cursor-pointer"
        >
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Root cause</span>
        </button>

        <div className="flex items-center gap-2">
          {finding.fix ? (
            <button
              type="button"
              onClick={() => onViewFix(finding)}
              className="text-xs font-mono text-indigo-400 hover:text-indigo-300 flex items-center gap-1 py-1 px-2.5 rounded bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/30 transition-colors cursor-pointer"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>{finding.status === 'verified' ? 'View Verified Fix' : 'View Fix'}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={() => onViewFix(finding)}
              className="text-xs font-mono text-zinc-300 hover:text-white flex items-center gap-1 py-1 px-2.5 rounded bg-[#1c222e] hover:bg-[#252d3d] border border-[#2e3748] transition-colors cursor-pointer"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Generate fix</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => onSelectFinding(finding)}
            className="p-1 rounded text-zinc-400 hover:text-white hover:bg-[#1a202c] transition-colors"
            title="Inspect Finding"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
