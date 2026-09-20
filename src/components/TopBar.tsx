import React, { useState } from 'react';
import { 
  GitBranch, 
  GitFork, 
  Bell, 
  Check, 
  Play, 
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { Repository, Analysis } from '../types';

interface TopBarProps {
  repositories: Repository[];
  selectedRepo: Repository;
  onSelectRepo: (repo: Repository) => void;
  selectedBranch: string;
  onSelectBranch: (branch: string) => void;
  activeAnalysis?: Analysis;
  onStartNewAnalysis: () => void;
  onOpenReport?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  repositories,
  selectedRepo,
  onSelectRepo,
  selectedBranch,
  onSelectBranch,
  activeAnalysis,
  onStartNewAnalysis,
  onOpenReport
}) => {
  const [repoDropdownOpen, setRepoDropdownOpen] = useState(false);
  const [branchDropdownOpen, setBranchDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header 
      id="app-topbar"
      className="h-14 bg-[#0e1117] border-b border-[#1e232b] px-4 flex items-center justify-between z-10 select-none"
    >
      {/* Left side: Repository & Branch Selectors */}
      <div className="flex items-center gap-3">
        {/* Repo selector dropdown */}
        <div className="relative">
          <button
            type="button"
            id="topbar-repo-selector"
            onClick={() => setRepoDropdownOpen(!repoDropdownOpen)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md bg-[#161a22] hover:bg-[#1f2430] border border-[#2d333f] text-sm text-zinc-200 transition-colors"
          >
            <GitFork className="w-4 h-4 text-indigo-400" />
            <span className="font-mono font-medium text-white">{selectedRepo.owner}/{selectedRepo.name}</span>
            <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
          </button>

          {repoDropdownOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-64 bg-[#141820] border border-[#2b323f] rounded-md shadow-xl py-1 z-50">
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-zinc-400 font-semibold border-b border-[#1e2430]">
                Connected Repositories
              </div>
              {repositories.map(repo => (
                <button
                  key={repo.id}
                  type="button"
                  onClick={() => {
                    onSelectRepo(repo);
                    setRepoDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between hover:bg-[#1b212c] ${
                    repo.id === selectedRepo.id ? 'text-indigo-400 bg-indigo-500/10' : 'text-zinc-300'
                  }`}
                >
                  <div className="truncate">
                    <span className="text-zinc-400">{repo.owner}/</span>
                    <span className="font-medium text-white">{repo.name}</span>
                  </div>
                  {repo.id === selectedRepo.id && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <span className="text-zinc-600 font-mono">/</span>

        {/* Branch selector dropdown */}
        <div className="relative">
          <button
            type="button"
            id="topbar-branch-selector"
            onClick={() => setBranchDropdownOpen(!branchDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md bg-[#161a22] hover:bg-[#1f2430] border border-[#2d333f] text-xs font-mono text-zinc-300 transition-colors"
          >
            <GitBranch className="w-3.5 h-3.5 text-zinc-400" />
            <span>{selectedBranch}</span>
            <ChevronDown className="w-3 h-3 text-zinc-400" />
          </button>

          {branchDropdownOpen && (
            <div className="absolute top-full left-0 mt-1.5 w-52 bg-[#141820] border border-[#2b323f] rounded-md shadow-xl py-1 z-50">
              <div className="px-3 py-1.5 text-[10px] font-mono uppercase text-zinc-400 font-semibold border-b border-[#1e2430]">
                Select Branch
              </div>
              {selectedRepo.branches.map(branch => (
                <button
                  key={branch}
                  type="button"
                  onClick={() => {
                    onSelectBranch(branch);
                    setBranchDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-1.5 text-xs font-mono flex items-center justify-between hover:bg-[#1b212c] ${
                    branch === selectedBranch ? 'text-indigo-400 bg-indigo-500/10' : 'text-zinc-300'
                  }`}
                >
                  <span>{branch}</span>
                  {branch === selectedBranch && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Analysis Status Pill */}
        {activeAnalysis && (
          <div className="hidden sm:flex items-center gap-2 pl-2">
            {activeAnalysis.status === 'running' ? (
              <div className="flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/15 border border-indigo-500/30 text-indigo-300 text-xs font-mono">
                <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
                <span>Autonomous Analysis: {activeAnalysis.stage.toUpperCase()} ({activeAnalysis.progressPercent}%)</span>
              </div>
            ) : (
              <button
                type="button"
                onClick={onOpenReport}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono hover:bg-emerald-500/20 transition-colors"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                <span>Last Analysis: 2 Verified Fixes</span>
              </button>
            )}
          </div>
        )}
      </div>

      {/* Right side: GitHub sync, Notifications, Profile, Action */}
      <div className="flex items-center gap-3">
        {/* GitHub Badge */}
        <div className="hidden md:flex items-center gap-1.5 text-xs font-mono text-zinc-400 bg-[#141820] border border-[#21262d] px-2.5 py-1 rounded-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          <span>GitHub Sync: Active</span>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            type="button"
            id="topbar-notifications-button"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 rounded-md text-zinc-400 hover:text-zinc-200 hover:bg-[#1a1f29] border border-transparent hover:border-[#2b3340] relative transition-colors"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-[#0e1117]" />
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-80 bg-[#141820] border border-[#2b323f] rounded-md shadow-2xl p-2 z-50">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-[#212733] px-2">
                <span className="text-xs font-semibold text-white">Agent Alerts</span>
                <span className="text-[10px] font-mono text-emerald-400">Isolated Container OK</span>
              </div>
              <div className="space-y-1.5 text-xs">
                <div className="p-2 rounded bg-[#181e28] border border-[#273040]">
                  <div className="text-zinc-200 font-medium">SQL Injection Patch Verified</div>
                  <div className="text-[11px] text-zinc-400 font-mono mt-0.5">Machine signature sha256:7f9a2b generated.</div>
                </div>
                <div className="p-2 rounded hover:bg-[#181e28] text-zinc-300">
                  <div className="text-zinc-200 font-medium">Command Injection Patch Verified</div>
                  <div className="text-[11px] text-zinc-400 font-mono mt-0.5">Isolated tests passed: 18/18.</div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Primary New Analysis CTA */}
        <button
          type="button"
          id="topbar-new-analysis-cta"
          onClick={onStartNewAnalysis}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium font-mono shadow-sm transition-all hover:shadow-indigo-500/20 cursor-pointer"
        >
          <Play className="w-3.5 h-3.5 fill-current" />
          <span>New Analysis</span>
        </button>

        {/* User avatar */}
        <div className="w-7 h-7 rounded-md bg-[#21262d] border border-zinc-700 flex items-center justify-center text-xs font-mono text-zinc-300">
          DEV
        </div>
      </div>
    </header>
  );
};
