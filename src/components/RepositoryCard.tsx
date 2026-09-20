import React from 'react';
import { Repository } from '../types';
import { GitFork, GitBranch, ShieldAlert, ShieldCheck, Play, Github, ExternalLink } from 'lucide-react';

interface RepositoryCardProps {
  repository: Repository;
  onSelectRepo: (repo: Repository) => void;
  onStartAnalysis: (repo: Repository) => void;
}

export const RepositoryCard: React.FC<RepositoryCardProps> = ({
  repository,
  onSelectRepo,
  onStartAnalysis
}) => {
  return (
    <div 
      id={`repo-card-${repository.id}`}
      className="rounded-lg border border-[#232936] bg-[#121620] p-5 hover:border-[#354054] transition-all flex flex-col justify-between"
    >
      <div>
        {/* Header: Name, owner, connection status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-md bg-[#181e28] border border-[#263040] flex items-center justify-center text-indigo-400">
              <Github className="w-4 h-4" />
            </div>
            <div>
              <h3 
                onClick={() => onSelectRepo(repository)}
                className="text-sm font-bold text-white font-mono hover:text-indigo-400 cursor-pointer transition-colors"
              >
                {repository.owner}/{repository.name}
              </h3>
              <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-400">
                <span className="text-zinc-500">Default:</span>
                <span className="text-zinc-300 flex items-center gap-1">
                  <GitBranch className="w-3 h-3 text-zinc-500" />
                  {repository.defaultBranch}
                </span>
                <span>• {repository.language}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-mono border border-emerald-500/30 bg-emerald-500/10 text-emerald-300">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span>Connected</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2 my-3 text-xs font-mono">
          <div className="p-2.5 rounded bg-[#161b24] border border-[#222938]">
            <div className="flex items-center gap-1.5 text-zinc-400 mb-0.5 text-[10px] uppercase">
              <ShieldAlert className="w-3 h-3 text-red-400" />
              <span>Open Findings</span>
            </div>
            <div className={`text-sm font-bold ${repository.openFindingsCount > 0 ? 'text-red-400' : 'text-zinc-400'}`}>
              {repository.openFindingsCount}
            </div>
          </div>

          <div className="p-2.5 rounded bg-[#161b24] border border-[#222938]">
            <div className="flex items-center gap-1.5 text-zinc-400 mb-0.5 text-[10px] uppercase">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Verified Fixes</span>
            </div>
            <div className="text-sm font-bold text-emerald-400">
              {repository.verifiedFixesCount}
            </div>
          </div>
        </div>

        <div className="text-[11px] font-mono text-zinc-400">
          Last analyzed: <span className="text-zinc-300">{repository.lastAnalysisAt}</span>
        </div>
      </div>

      {/* Footer CTA */}
      <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#1e2533] gap-2">
        <button
          type="button"
          onClick={() => onSelectRepo(repository)}
          className="text-xs font-mono text-zinc-400 hover:text-white px-2 py-1 rounded hover:bg-[#181e28] transition-colors cursor-pointer"
        >
          View Workspace
        </button>

        <button
          type="button"
          onClick={() => onStartAnalysis(repository)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-mono font-medium shadow-sm transition-all cursor-pointer"
        >
          <Play className="w-3 h-3 fill-current" />
          <span>Analyze</span>
        </button>
      </div>
    </div>
  );
};
