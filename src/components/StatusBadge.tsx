import React from 'react';
import { SeverityLevel, FindingStatus, AnalysisStatus } from '../types';
import { ShieldAlert, AlertTriangle, AlertCircle, Info, CheckCircle2, Clock, PlayCircle, XCircle } from 'lucide-react';

interface SeverityBadgeProps {
  severity: SeverityLevel;
  showIcon?: boolean;
  size?: 'sm' | 'md';
}

export const SeverityBadge: React.FC<SeverityBadgeProps> = ({ 
  severity, 
  showIcon = true,
  size = 'sm'
}) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  switch (severity) {
    case 'critical':
      return (
        <span 
          id={`badge-severity-${severity}`}
          className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider font-semibold rounded border border-red-500/30 bg-red-500/10 text-red-400 ${sizeClasses}`}
        >
          {showIcon && <ShieldAlert className="w-3.5 h-3.5 text-red-400" />}
          Critical
        </span>
      );
    case 'high':
      return (
        <span 
          id={`badge-severity-${severity}`}
          className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider font-semibold rounded border border-orange-500/30 bg-orange-500/10 text-orange-400 ${sizeClasses}`}
        >
          {showIcon && <AlertTriangle className="w-3.5 h-3.5 text-orange-400" />}
          High
        </span>
      );
    case 'medium':
      return (
        <span 
          id={`badge-severity-${severity}`}
          className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider font-semibold rounded border border-amber-500/30 bg-amber-500/10 text-amber-300 ${sizeClasses}`}
        >
          {showIcon && <AlertCircle className="w-3.5 h-3.5 text-amber-300" />}
          Medium
        </span>
      );
    case 'low':
      return (
        <span 
          id={`badge-severity-${severity}`}
          className={`inline-flex items-center gap-1.5 font-mono uppercase tracking-wider font-semibold rounded border border-blue-500/30 bg-blue-500/10 text-blue-300 ${sizeClasses}`}
        >
          {showIcon && <Info className="w-3.5 h-3.5 text-blue-300" />}
          Low
        </span>
      );
  }
};

interface FindingStatusBadgeProps {
  status: FindingStatus;
  size?: 'sm' | 'md';
}

export const FindingStatusBadge: React.FC<FindingStatusBadgeProps> = ({ status, size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-[11px]' : 'px-2.5 py-1 text-xs';

  switch (status) {
    case 'verified':
      return (
        <span className={`inline-flex items-center gap-1 font-mono rounded border border-emerald-500/40 bg-emerald-500/10 text-emerald-300 font-medium ${sizeClasses}`}>
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          Verified
        </span>
      );
    case 'fix_generated':
      return (
        <span className={`inline-flex items-center gap-1 font-mono rounded border border-cyan-500/40 bg-cyan-500/10 text-cyan-300 font-medium ${sizeClasses}`}>
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          Fix Generated
        </span>
      );
    case 'confirmed':
      return (
        <span className={`inline-flex items-center gap-1 font-mono rounded border border-amber-500/40 bg-amber-500/10 text-amber-300 font-medium ${sizeClasses}`}>
          <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
          Confirmed
        </span>
      );
    case 'detected':
      return (
        <span className={`inline-flex items-center gap-1 font-mono rounded border border-zinc-700 bg-zinc-800 text-zinc-300 font-medium ${sizeClasses}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
          Detected
        </span>
      );
  }
};

interface AnalysisStatusBadgeProps {
  status: AnalysisStatus;
}

export const AnalysisStatusBadge: React.FC<AnalysisStatusBadgeProps> = ({ status }) => {
  switch (status) {
    case 'completed':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-mono rounded border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
          Completed
        </span>
      );
    case 'running':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-mono rounded border border-indigo-500/40 bg-indigo-500/15 text-indigo-300">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          Running
        </span>
      );
    case 'queued':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-mono rounded border border-zinc-700 bg-zinc-800 text-zinc-400">
          <Clock className="w-3 h-3" />
          Queued
        </span>
      );
    case 'failed':
      return (
        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-xs font-mono rounded border border-red-500/30 bg-red-500/10 text-red-400">
          <XCircle className="w-3 h-3" />
          Failed
        </span>
      );
  }
};
