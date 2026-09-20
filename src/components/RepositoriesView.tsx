import React, { useState } from 'react';
import { Repository } from '../types';
import { RepositoryCard } from './RepositoryCard';
import { ConnectRepoModal } from './ConnectRepoModal';
import { GitFork, Plus, Search, Filter, Github } from 'lucide-react';

interface RepositoriesViewProps {
  repositories: Repository[];
  onSelectRepo: (repo: Repository) => void;
  onStartAnalysis: (repo: Repository) => void;
  onAddRepository: (repoData: { owner: string; name: string; branch: string; language: string }) => void;
}

export const RepositoriesView: React.FC<RepositoriesViewProps> = ({
  repositories,
  onSelectRepo,
  onStartAnalysis,
  onAddRepository
}) => {
  const [modalOpen, setModalOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = repositories.filter(r => 
    r.name.toLowerCase().includes(search.toLowerCase()) ||
    r.owner.toLowerCase().includes(search.toLowerCase()) ||
    r.language.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full bg-[#0b0d11] text-zinc-200 overflow-y-auto">
      {/* Header */}
      <div className="p-6 bg-[#121620] border-b border-[#212733] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">GitHub App Connections</span>
            <span className="text-zinc-600 font-mono">•</span>
            <span className="text-xs font-mono text-emerald-400 font-medium">Auto-Sync Enabled</span>
          </div>
          <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-3">
            <span>Repositories</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
              {repositories.length} connected
            </span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Manage repository access, branches, and monitor autonomous vulnerability scanning across codebases.
          </p>
        </div>

        <button
          type="button"
          id="btn-connect-repository"
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-mono text-xs font-semibold shadow-md transition-all cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>+ Connect Repository</span>
        </button>
      </div>

      {/* Search & Filter Row */}
      <div className="p-6 max-w-6xl space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search repositories by name or language..."
              className="w-full bg-[#181d26] border border-[#2b3342] rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Repositories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          {filtered.map(repo => (
            <RepositoryCard
              key={repo.id}
              repository={repo}
              onSelectRepo={onSelectRepo}
              onStartAnalysis={onStartAnalysis}
            />
          ))}
        </div>
      </div>

      <ConnectRepoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onConnect={onAddRepository}
      />
    </div>
  );
};
