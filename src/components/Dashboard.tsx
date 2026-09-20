import React from 'react';
import { Analysis, Repository } from '../types';
import { AnalysisStatusBadge } from './StatusBadge';
import { 
  Play, 
  GitFork, 
  GitBranch, 
  GitPullRequest, 
  ShieldAlert, 
  ShieldCheck, 
  Activity, 
  ArrowRight,
  Sparkles,
  ChevronRight,
  Clock,
  CheckCircle2,
  FolderGit2
} from 'lucide-react';

interface DashboardProps {
  analyses: Analysis[];
  repositories: Repository[];
  onStartNewAnalysis: () => void;
  onSelectAnalysis: (analysis: Analysis) => void;
  onNavigateToRepositories: () => void;
  onNavigateToFindings: () => void;
  onNavigateToVerification: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  analyses,
  repositories,
  onStartNewAnalysis,
  onSelectAnalysis,
  onNavigateToRepositories,
  onNavigateToFindings,
  onNavigateToVerification
}) => {
  const activeCount = analyses.filter(a => a.status === 'running').length;
  const totalFindings = analyses.reduce((acc, a) => acc + a.findings.length, 0);
  const verifiedFixesCount = analyses.reduce(
    (acc, a) => acc + a.findings.filter(f => f.status === 'verified').length, 
    0
  );

  return (
    <div className="flex flex-col h-full bg-[#0b0d11] text-zinc-200 overflow-y-auto">
      {/* Top Welcome Header */}
      <div className="p-6 sm:p-8 bg-[#121620] border-b border-[#212733] flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Autonomous Agent Ready</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
            Good morning.
          </h1>
          <p className="text-sm text-zinc-400 font-sans mt-1 max-w-2xl leading-relaxed">
            Let BugBuster investigate the code while you focus on building.
          </p>
        </div>

        {/* Primary CTA */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            id="dashboard-new-analysis-btn"
            onClick={onStartNewAnalysis}
            className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-semibold shadow-md transition-all hover:shadow-indigo-500/25 cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 fill-current" />
            <span>+ New Analysis</span>
          </button>
        </div>
      </div>

      <div className="p-6 sm:p-8 max-w-6xl space-y-8">
        {/* Developer Workspace Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Active Analyses Card */}
          <div 
            onClick={() => onSelectAnalysis(analyses[0])}
            className="p-4 rounded-lg bg-[#121620] border border-[#212733] hover:border-[#354054] transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-zinc-400 text-xs font-mono mb-1">
                <span>Active Analyses</span>
                <Activity className="w-4 h-4 text-indigo-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono mt-1 flex items-baseline gap-2">
                <span>{activeCount}</span>
                <span className="text-xs font-normal text-indigo-300 font-mono">running</span>
              </div>
            </div>
            <div className="text-[11px] font-mono text-zinc-400 mt-3 pt-2 border-t border-[#1e2533]">
              Latest: <span className="text-zinc-200">feature/security-fix</span>
            </div>
          </div>

          {/* Findings Card */}
          <div 
            onClick={onNavigateToFindings}
            className="p-4 rounded-lg bg-[#121620] border border-[#212733] hover:border-[#354054] transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-zinc-400 text-xs font-mono mb-1">
                <span>Findings</span>
                <ShieldAlert className="w-4 h-4 text-red-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono mt-1 flex items-baseline gap-2">
                <span>{totalFindings}</span>
                <span className="text-xs font-normal text-red-400 font-mono">1 critical</span>
              </div>
            </div>
            <div className="text-[11px] font-mono text-zinc-400 mt-3 pt-2 border-t border-[#1e2533]">
              SQLi in auth.py confirmed
            </div>
          </div>

          {/* Verified Fixes Card */}
          <div 
            onClick={onNavigateToVerification}
            className="p-4 rounded-lg bg-[#121620] border border-[#212733] hover:border-[#354054] transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-zinc-400 text-xs font-mono mb-1">
                <span>Verified Fixes</span>
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-emerald-400 font-mono mt-1 flex items-baseline gap-2">
                <span>{verifiedFixesCount}</span>
                <span className="text-xs font-normal text-emerald-300/80 font-mono">machine proven</span>
              </div>
            </div>
            <div className="text-[11px] font-mono text-zinc-400 mt-3 pt-2 border-t border-[#1e2533]">
              24/24 regression passed
            </div>
          </div>

          {/* Repositories Card */}
          <div 
            onClick={onNavigateToRepositories}
            className="p-4 rounded-lg bg-[#121620] border border-[#212733] hover:border-[#354054] transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-zinc-400 text-xs font-mono mb-1">
                <span>Repositories</span>
                <FolderGit2 className="w-4 h-4 text-zinc-400" />
              </div>
              <div className="text-2xl font-bold text-white font-mono mt-1 flex items-baseline gap-2">
                <span>{repositories.length}</span>
                <span className="text-xs font-normal text-zinc-400 font-mono">connected</span>
              </div>
            </div>
            <div className="text-[11px] font-mono text-zinc-400 mt-3 pt-2 border-t border-[#1e2533]">
              GitHub App authenticated
            </div>
          </div>
        </div>

        {/* Autonomous Pipeline Manifesto Banner */}
        <div className="p-4 rounded-lg bg-[#11151f] border border-[#222938] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-mono text-xs">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400 shrink-0">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <div className="text-white font-semibold">Autonomous Software Engineering Pipeline</div>
              <div className="text-zinc-400 text-[11px] mt-0.5">
                Input → Understand → Detect → Confirm → Fix → Test → Verify → Report
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={onStartNewAnalysis}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-mono flex items-center gap-1 shrink-0 cursor-pointer"
          >
            <span>Launch analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Recent Analyses List */}
        <div className="rounded-lg border border-[#212733] bg-[#121620] overflow-hidden shadow-sm">
          <div className="px-6 py-3.5 bg-[#161b24] border-b border-[#212733] flex items-center justify-between font-mono text-xs">
            <span className="font-semibold text-white uppercase tracking-wider">Recent Analyses</span>
            <span className="text-zinc-400">Developer Workspace</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left font-mono text-xs">
              <thead className="bg-[#0f131a] text-zinc-400 text-[11px] uppercase border-b border-[#1e2533]">
                <tr>
                  <th className="px-6 py-3 font-semibold">Repository</th>
                  <th className="px-6 py-3 font-semibold">Source</th>
                  <th className="px-6 py-3 font-semibold">Branch</th>
                  <th className="px-6 py-3 font-semibold">Findings</th>
                  <th className="px-6 py-3 font-semibold">Status</th>
                  <th className="px-6 py-3 font-semibold">Last Activity</th>
                  <th className="px-6 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1e2533]">
                {analyses.map(analysis => {
                  return (
                    <tr 
                      key={analysis.id}
                      onClick={() => onSelectAnalysis(analysis)}
                      className="hover:bg-[#161c28] transition-colors cursor-pointer group"
                    >
                      <td className="px-6 py-3.5 font-medium text-white flex items-center gap-2">
                        <GitFork className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span>{analysis.repoName}</span>
                      </td>

                      <td className="px-6 py-3.5 text-zinc-300">
                        {analysis.sourceType === 'pr' ? (
                          <span className="flex items-center gap-1 text-emerald-400">
                            <GitPullRequest className="w-3 h-3" />
                            {analysis.sourceLabel}
                          </span>
                        ) : (
                          <span className="text-zinc-400">{analysis.sourceLabel}</span>
                        )}
                      </td>

                      <td className="px-6 py-3.5 text-zinc-300">
                        <span className="flex items-center gap-1">
                          <GitBranch className="w-3 h-3 text-zinc-500" />
                          {analysis.branch}
                        </span>
                      </td>

                      <td className="px-6 py-3.5">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                          analysis.findings.length > 0 
                            ? 'bg-red-500/10 text-red-400 border border-red-500/20' 
                            : 'bg-zinc-800 text-zinc-400'
                        }`}>
                          {analysis.findings.length} findings
                        </span>
                      </td>

                      <td className="px-6 py-3.5">
                        <AnalysisStatusBadge status={analysis.status} />
                      </td>

                      <td className="px-6 py-3.5 text-zinc-400 text-[11px]">
                        {analysis.completedAt ? `Finished ${analysis.completedAt}` : analysis.startedAt}
                      </td>

                      <td className="px-6 py-3.5 text-right">
                        <span className="text-zinc-400 group-hover:text-white transition-colors inline-flex items-center gap-1 text-xs">
                          <span>Open</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
