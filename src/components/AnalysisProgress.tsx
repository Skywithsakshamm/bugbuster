import React, { useState } from 'react';
import { Analysis, Finding } from '../types';
import { SeverityBadge, FindingStatusBadge } from './StatusBadge';
import { PipelineStepBar } from './PipelineStepBar';
import { 
  GitBranch, 
  GitFork, 
  GitPullRequest, 
  Cpu, 
  CheckCircle2, 
  Clock, 
  ChevronDown, 
  ChevronRight, 
  Terminal, 
  ShieldAlert, 
  Wrench, 
  ShieldCheck, 
  ArrowRight,
  Pause,
  Play,
  FileCode
} from 'lucide-react';

interface AnalysisProgressProps {
  analysis: Analysis;
  onSelectFinding: (finding: Finding) => void;
  onViewReport: () => void;
  onViewDiff: (finding?: Finding) => void;
  onViewVerification: (finding?: Finding) => void;
}

export const AnalysisProgress: React.FC<AnalysisProgressProps> = ({
  analysis,
  onSelectFinding,
  onViewReport,
  onViewDiff,
  onViewVerification
}) => {
  const [expandedActivityIds, setExpandedActivityIds] = useState<Record<string, boolean>>({
    'act-2': true,
    'act-6': true
  });

  const toggleActivity = (id: string) => {
    setExpandedActivityIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const isCompleted = analysis.status === 'completed';

  // Standard autonomous pipeline steps to display in center timeline
  const autonomousSteps = [
    {
      id: 'step-1',
      title: 'Repository connected',
      status: 'done',
      summary: `Connected to ${analysis.owner}/${analysis.repoName} on ${analysis.branch}`,
      detail: 'Cloned into isolated sandbox workspace sbx-env-83921 with git depth=50'
    },
    {
      id: 'step-2',
      title: 'Repository snapshot created',
      status: 'done',
      summary: `Created read-only snapshot of commit ${analysis.commitHash || 'a81f92c'}`,
      detail: 'Sandboxed filesystem mounted with copy-on-write overlayfs semantics'
    },
    {
      id: 'step-3',
      title: 'Relevant files identified',
      status: 'done',
      summary: `Identified ${analysis.totalFilesScanned || 38} relevant modules & entrypoints`,
      detail: 'AST parser constructed dependency graph spanning auth, utils, and database drivers'
    },
    {
      id: 'step-4',
      title: 'Static analysis completed',
      status: 'done',
      summary: 'Completed AST taint-tracking and boundary anomaly sweeps',
      detail: 'Analyzed auth.py and 4 dependent modules. Flagged unescaped query sink.'
    },
    {
      id: 'step-5',
      title: 'Investigating potential vulnerability',
      status: isCompleted ? 'done' : 'active',
      summary: 'Confirmed SQL injection in auth.py:84 (CWE-89)',
      detail: 'Taint propagation path verified from user-input param to database execute cursor'
    },
    {
      id: 'step-6',
      title: 'Root cause analysis',
      status: isCompleted ? 'done' : 'pending',
      summary: 'Identified raw f-string interpolation without parameterization',
      detail: 'Synthesized root cause explanation and security blast radius assessment'
    },
    {
      id: 'step-7',
      title: 'Fix generation',
      status: isCompleted ? 'done' : 'pending',
      summary: 'Generated targeted minimal patch (auth.py: +2 -1 lines)',
      detail: 'Replaced query interpolation with parameterized query binding (%s placeholders)'
    },
    {
      id: 'step-8',
      title: 'Test generation',
      status: isCompleted ? 'done' : 'pending',
      summary: 'Synthesized reproducible test tests/test_auth_security.py',
      detail: 'Executed BEFORE test: FAILED as expected, reproducing vulnerability'
    },
    {
      id: 'step-9',
      title: 'Verification',
      status: isCompleted ? 'done' : 'pending',
      summary: 'Executed AFTER test & full regression suite in isolated sandbox',
      detail: 'AFTER test PASSED (0.38s). Full regression: 24/24 passed. Machine signature generated.'
    }
  ];

  return (
    <div className="flex flex-col h-full bg-[#0b0d11] text-zinc-200 overflow-hidden">
      {/* Top Status Header */}
      <div className="p-4 bg-[#121620] border-b border-[#212733] flex flex-wrap items-center justify-between gap-4 select-none shrink-0">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-zinc-400">Autonomous Analysis</span>
            <span className="text-zinc-600 font-mono">•</span>
            <span className="text-xs font-mono text-zinc-400">{analysis.sourceLabel}</span>
          </div>
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-white font-mono flex items-center gap-2">
              {isCompleted ? 'Analysis Complete' : 'BugBuster is investigating...'}
            </h1>
            {isCompleted ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono bg-emerald-500/15 text-emerald-300 border border-emerald-500/40">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Completed ({analysis.duration || '1m 11s'})
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-mono bg-indigo-500/15 text-indigo-300 border border-indigo-500/40">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                Running ({analysis.progressPercent}%)
              </span>
            )}
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2">
          {isCompleted && (
            <button
              type="button"
              id="analysis-workspace-report-btn"
              onClick={onViewReport}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-medium shadow-sm transition-all cursor-pointer"
            >
              <span>View Final Report</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={() => onViewDiff(analysis.findings[0])}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#1b212d] hover:bg-[#252d3d] border border-[#2d3748] text-xs font-mono text-zinc-200 transition-colors cursor-pointer"
          >
            <Wrench className="w-3.5 h-3.5 text-indigo-400" />
            <span>Inspect Patches</span>
          </button>
        </div>
      </div>

      {/* Persistent Pipeline Flow Header */}
      <div className="p-3 bg-[#0e1218] border-b border-[#212733] shrink-0">
        <PipelineStepBar currentStage={analysis.stage} />
      </div>

      {/* Signature 3-Column Layout */}
      <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
        {/* LEFT: Task Information & Repository Context */}
        <div className="w-full md:w-80 bg-[#0e1218] border-r border-[#1e242f] p-4 flex flex-col justify-between shrink-0 overflow-y-auto">
          <div className="space-y-4 text-xs font-mono">
            <div>
              <div className="text-zinc-400 uppercase tracking-wider text-[10px] font-semibold mb-1">
                Repository
              </div>
              <div className="flex items-center gap-2 text-white font-medium">
                <GitFork className="w-4 h-4 text-indigo-400" />
                <span>{analysis.owner}/{analysis.repoName}</span>
              </div>
            </div>

            <div>
              <div className="text-zinc-400 uppercase tracking-wider text-[10px] font-semibold mb-1">
                Branch & Commit
              </div>
              <div className="flex items-center gap-2 text-zinc-300">
                <GitBranch className="w-4 h-4 text-zinc-400" />
                <span>{analysis.branch}</span>
                <span className="text-zinc-400">({analysis.commitHash || 'a81f92c'})</span>
              </div>
            </div>

            {analysis.prNumber && (
              <div>
                <div className="text-zinc-400 uppercase tracking-wider text-[10px] font-semibold mb-1">
                  Pull Request
                </div>
                <div className="flex items-center gap-2 text-zinc-300">
                  <GitPullRequest className="w-4 h-4 text-emerald-400" />
                  <span>#{analysis.prNumber}</span>
                </div>
              </div>
            )}

            <div>
              <div className="text-zinc-400 uppercase tracking-wider text-[10px] font-semibold mb-1">
                Prompt Directive
              </div>
              <div className="p-2.5 rounded bg-[#131722] border border-[#212736] text-zinc-300 leading-relaxed font-sans text-xs">
                "{analysis.prompt}"
              </div>
            </div>

            <div>
              <div className="text-zinc-400 uppercase tracking-wider text-[10px] font-semibold mb-1">
                Analysis Scope
              </div>
              <div className="text-zinc-300 bg-[#131722] p-2 rounded border border-[#212736]">
                {analysis.scope.replace('_', ' ')}
              </div>
            </div>

            <div>
              <div className="text-zinc-400 uppercase tracking-wider text-[10px] font-semibold mb-1">
                Files Scanned
              </div>
              <div className="text-zinc-300">
                {analysis.totalFilesScanned || 38} source files evaluated
              </div>
            </div>
          </div>

          {/* Bottom Isolated Workspace Card */}
          <div className="mt-4 p-3 rounded-lg bg-[#121622] border border-[#232938] text-[11px] font-mono">
            <div className="flex items-center gap-2 text-emerald-400 font-semibold mb-1">
              <Cpu className="w-4 h-4" />
              <span>Isolated Ephemeral Workspace</span>
            </div>
            <div className="text-zinc-400">Container: sbx-env-83921</div>
            <div className="text-zinc-400">Security Sandbox: gVisor container</div>
            <div className="text-emerald-400/90 mt-1">✓ Verified zero network egress</div>
          </div>
        </div>

        {/* CENTER: Autonomous Activity Timeline */}
        <div className="flex-1 bg-[#0b0e14] p-4 sm:p-6 overflow-y-auto">
          <div className="max-w-2xl mx-auto space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#21262d]">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
                Autonomous Activity Timeline
              </span>
              <span className="text-xs font-mono text-zinc-400">
                {isCompleted ? '9 of 9 stages completed' : 'Investigating in progress...'}
              </span>
            </div>

            {/* Step list */}
            <div className="space-y-2.5">
              {autonomousSteps.map((step, idx) => {
                const isDone = step.status === 'done';
                const isActive = step.status === 'active';
                const isPending = step.status === 'pending';
                const isExpanded = expandedActivityIds[step.id] || false;

                return (
                  <div 
                    key={step.id}
                    className={`rounded-lg border transition-all text-xs font-mono overflow-hidden ${
                      isActive
                        ? 'bg-indigo-950/20 border-indigo-500/50 shadow-md'
                        : isDone
                        ? 'bg-[#121620] border-[#222836]'
                        : 'bg-[#0e1218]/60 border-[#1c222e] opacity-60'
                    }`}
                  >
                    <div 
                      onClick={() => toggleActivity(step.id)}
                      className="p-3 flex items-center justify-between cursor-pointer select-none"
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                          isDone 
                            ? 'bg-emerald-500/20 text-emerald-400' 
                            : isActive 
                            ? 'bg-indigo-500 text-white' 
                            : 'bg-zinc-800 text-zinc-600'
                        }`}>
                          {isDone ? (
                            <CheckCircle2 className="w-3.5 h-3.5" />
                          ) : isActive ? (
                            <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                          ) : (
                            <span className="w-2 h-2 rounded-full bg-zinc-600" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className={`font-semibold ${isActive ? 'text-indigo-300 font-bold' : isDone ? 'text-white' : 'text-zinc-500'}`}>
                              {step.title}
                            </span>
                          </div>
                          <p className="text-[11px] text-zinc-400 mt-0.5">{step.summary}</p>
                        </div>
                      </div>

                      <div className="text-zinc-500 hover:text-zinc-300 p-1">
                        {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                      </div>
                    </div>

                    {/* Expandable action summary (concise, no hidden CoT) */}
                    {isExpanded && (
                      <div className="px-4 pb-3 pt-1 border-t border-[#1c222e] text-[11px] text-zinc-300 bg-[#0c1017]">
                        <p className="leading-relaxed text-zinc-400">
                          {step.detail}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT: Live Findings / Status Panel */}
        <div className="w-full md:w-80 bg-[#0e1218] border-l border-[#1e242f] p-4 flex flex-col justify-between shrink-0 overflow-y-auto">
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-[#21262d]">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-zinc-400">
                Live Findings ({analysis.findings.length})
              </span>
              <span className="text-[11px] font-mono text-emerald-400">2 Verified</span>
            </div>

            <div className="space-y-3">
              {analysis.findings.map(finding => (
                <div
                  key={finding.id}
                  id={`live-finding-${finding.id}`}
                  onClick={() => onSelectFinding(finding)}
                  className="p-3 rounded-lg bg-[#121620] border border-[#212733] hover:border-[#354054] cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <SeverityBadge severity={finding.severity} />
                    <FindingStatusBadge status={finding.status} />
                  </div>
                  <div className="text-xs font-semibold text-white font-mono hover:text-indigo-400 transition-colors">
                    {finding.title}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] font-mono text-zinc-400">
                    <FileCode className="w-3 h-3" />
                    <span>{finding.file}:{finding.lines[0]}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Proof Status Card */}
          <div className="mt-4 p-3 rounded-lg bg-[#111622] border border-[#232a3d] text-xs font-mono">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold mb-1">
              <ShieldCheck className="w-4 h-4" />
              <span>Machine Proof Engine</span>
            </div>
            <p className="text-[11px] text-zinc-400 leading-relaxed font-sans">
              Every patch has undergone before & after test execution with isolated assertions.
            </p>
            <button
              type="button"
              onClick={() => onViewVerification(analysis.findings[0])}
              className="mt-2 text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1 cursor-pointer font-mono"
            >
              <span>View verification details</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
