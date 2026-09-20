import React, { useState } from 'react';
import { ActivityEvent, PipelineStage } from '../types';
import { 
  Terminal, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Clock, 
  ChevronDown, 
  ChevronRight,
  Filter,
  RefreshCw
} from 'lucide-react';

interface ActivityFeedProps {
  activities: ActivityEvent[];
  repoName?: string;
  branchName?: string;
  isLive?: boolean;
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({
  activities,
  repoName = 'bugbuster-core',
  branchName = 'feature/security-fix',
  isLive = true
}) => {
  const [selectedStageFilter, setSelectedStageFilter] = useState<string>('all');
  const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({
    'act-1': true,
    'act-6': true,
    'act-9': true
  });

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredActivities = activities.filter(act => {
    if (selectedStageFilter === 'all') return true;
    return act.stage === selectedStageFilter;
  });

  return (
    <div className="flex flex-col h-full bg-[#0b0d11] text-zinc-200 overflow-y-auto">
      {/* Header */}
      <div className="p-6 bg-[#121620] border-b border-[#212733] flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Autonomous Agent Stream</span>
            <span className="text-zinc-600 font-mono">•</span>
            <span className="text-xs font-mono text-zinc-400">{repoName}@{branchName}</span>
          </div>
          <h1 className="text-xl font-bold text-white font-mono flex items-center gap-3">
            <span>Activity Feed</span>
            {isLive && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono bg-indigo-500/15 text-indigo-300 border border-indigo-500/40">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                Live Agent Telemetry
              </span>
            )}
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Transparent event stream of autonomous operations, static analysis passes, and machine verification executions.
          </p>
        </div>

        {/* Filter stage */}
        <div className="flex items-center gap-2">
          <Filter className="w-3.5 h-3.5 text-zinc-400" />
          <select
            value={selectedStageFilter}
            onChange={(e) => setSelectedStageFilter(e.target.value)}
            className="bg-[#181d26] border border-[#2d3545] rounded-md px-3 py-1.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-indigo-500"
          >
            <option value="all">All Stages (All Events)</option>
            <option value="input">Input / Cloning</option>
            <option value="understand">Understanding / AST</option>
            <option value="detect">Detect / Scanning</option>
            <option value="confirm">Confirm</option>
            <option value="fix">Patch Generation</option>
            <option value="test">Test Execution</option>
            <option value="verify">Verification</option>
          </select>
        </div>
      </div>

      {/* Chronological Activity Feed List */}
      <div className="p-6 max-w-4xl space-y-3">
        {filteredActivities.map((act) => {
          const isExpanded = expandedIds[act.id] || false;

          let icon = <Info className="w-4 h-4 text-blue-400" />;
          let iconBg = 'bg-blue-500/10 border-blue-500/20';

          if (act.type === 'success') {
            icon = <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
            iconBg = 'bg-emerald-500/10 border-emerald-500/20';
          } else if (act.type === 'warning') {
            icon = <AlertTriangle className="w-4 h-4 text-amber-400" />;
            iconBg = 'bg-amber-500/10 border-amber-500/20';
          } else if (act.type === 'running') {
            icon = <RefreshCw className="w-4 h-4 text-indigo-400 animate-spin" />;
            iconBg = 'bg-indigo-500/10 border-indigo-500/20';
          }

          return (
            <div 
              key={act.id}
              className="rounded-lg border border-[#212734] bg-[#121620] overflow-hidden transition-all text-xs font-mono"
            >
              <div 
                onClick={() => toggleExpand(act.id)}
                className="p-3.5 flex items-center justify-between cursor-pointer hover:bg-[#151a26] select-none"
              >
                <div className="flex items-center gap-3">
                  {/* Timestamp */}
                  <span className="text-zinc-500 font-mono text-[11px] w-16 shrink-0">
                    {act.timeDisplay}
                  </span>

                  {/* Stage Icon */}
                  <div className={`w-6 h-6 rounded-md flex items-center justify-center border shrink-0 ${iconBg}`}>
                    {icon}
                  </div>

                  {/* Message & Stage */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-zinc-100 font-semibold">{act.message}</span>
                      <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">
                        {act.stage}
                      </span>
                    </div>
                    {act.detail && (
                      <p className="text-[11px] text-zinc-400 font-sans mt-0.5">{act.detail}</p>
                    )}
                  </div>
                </div>

                <div className="text-zinc-500 p-1">
                  {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                </div>
              </div>

              {/* Expandable technical details & console snippets */}
              {isExpanded && (act.command || act.stdoutSnippet) && (
                <div className="px-4 py-3 bg-[#0a0d13] border-t border-[#1e2533] space-y-2 text-[11px] font-mono">
                  {act.command && (
                    <div className="flex items-start gap-2 text-zinc-400">
                      <Terminal className="w-3.5 h-3.5 text-zinc-500 mt-0.5 shrink-0" />
                      <span className="text-indigo-300 font-medium">{act.command}</span>
                    </div>
                  )}

                  {act.stdoutSnippet && (
                    <div className="p-2.5 rounded bg-[#10141c] border border-[#1d2432] text-zinc-300 whitespace-pre overflow-x-auto">
                      {act.stdoutSnippet}
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
