import React from 'react';
import { PipelineStage } from '../types';
import { 
  GitPullRequest, 
  Binary, 
  Radar, 
  CheckCheck, 
  Wrench, 
  FlaskConical, 
  ShieldCheck, 
  FileText 
} from 'lucide-react';

interface PipelineStepBarProps {
  currentStage?: PipelineStage;
  interactive?: boolean;
  onStepClick?: (stage: PipelineStage) => void;
  compact?: boolean;
}

const STAGES: Array<{
  id: PipelineStage;
  label: string;
  icon: React.ElementType;
  description: string;
}> = [
  { id: 'input', label: 'INPUT', icon: GitPullRequest, description: 'Source repo, branch or PR ingestion' },
  { id: 'understand', label: 'UNDERSTAND', icon: Binary, description: 'AST parsing & call-graph modeling' },
  { id: 'detect', label: 'DETECT', icon: Radar, description: 'Static taint & boundary anomaly scanning' },
  { id: 'confirm', label: 'CONFIRM', icon: CheckCheck, description: 'Targeted vulnerability path validation' },
  { id: 'fix', label: 'FIX', icon: Wrench, description: 'Minimal scoped patch synthesis' },
  { id: 'test', label: 'TEST', icon: FlaskConical, description: 'Reproduction & regression test suite' },
  { id: 'verify', label: 'VERIFY', icon: ShieldCheck, description: 'Isolated sandbox machine proof' },
  { id: 'report', label: 'REPORT', icon: FileText, description: 'Actionable patch, diff & receipt' }
];

export const PipelineStepBar: React.FC<PipelineStepBarProps> = ({
  currentStage = 'report',
  interactive = false,
  onStepClick,
  compact = false
}) => {
  const currentIndex = STAGES.findIndex(s => s.id === currentStage);

  return (
    <div className="w-full bg-[#12151b] border border-[#21262d] rounded-lg p-3 shadow-sm">
      <div className="flex items-center justify-between gap-1 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
        {STAGES.map((stage, idx) => {
          const Icon = stage.icon;
          const isDone = idx < currentIndex || (currentStage === 'report' && idx === STAGES.length - 1);
          const isCurrent = idx === currentIndex && currentStage !== 'report';
          const isPending = idx > currentIndex && currentStage !== 'report';

          return (
            <React.Fragment key={stage.id}>
              <button
                type="button"
                id={`pipeline-step-${stage.id}`}
                disabled={!interactive}
                onClick={() => interactive && onStepClick && onStepClick(stage.id)}
                title={stage.description}
                className={`flex flex-col items-center flex-1 min-w-[72px] sm:min-w-[88px] py-1.5 px-1 rounded transition-all text-left ${
                  interactive ? 'cursor-pointer hover:bg-[#1c2129]' : 'cursor-default'
                } ${
                  isCurrent 
                    ? 'bg-indigo-500/10 border border-indigo-500/40 text-white' 
                    : isDone 
                    ? 'text-zinc-200' 
                    : 'text-zinc-500'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1">
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center text-xs font-mono transition-colors ${
                    isCurrent 
                      ? 'bg-indigo-500 text-white shadow-sm ring-2 ring-indigo-500/20' 
                      : isDone 
                      ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400' 
                      : 'bg-[#181d24] border border-[#262c36] text-zinc-500'
                  }`}>
                    {isCurrent ? (
                      <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                    ) : isDone ? (
                      <Icon className="w-3.5 h-3.5" />
                    ) : (
                      <Icon className="w-3.5 h-3.5" />
                    )}
                  </div>
                  <span className={`text-[10px] font-mono tracking-wider font-semibold uppercase ${
                    isCurrent 
                      ? 'text-indigo-300 font-bold' 
                      : isDone 
                      ? 'text-zinc-300' 
                      : 'text-zinc-500'
                  }`}>
                    {stage.label}
                  </span>
                </div>
                {!compact && (
                  <span className="text-[10px] text-zinc-400 font-mono hidden md:block truncate max-w-[90px]">
                    {isDone ? 'Verified' : isCurrent ? 'Active...' : 'Pending'}
                  </span>
                )}
              </button>

              {idx < STAGES.length - 1 && (
                <div className="flex items-center text-zinc-600 px-0.5 select-none">
                  <span className={`text-[10px] font-mono ${idx < currentIndex ? 'text-emerald-500/60' : 'text-zinc-700'}`}>
                    →
                  </span>
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
