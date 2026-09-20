import React, { useState } from 'react';
import { Finding, SeverityLevel, FindingStatus } from '../types';
import { FindingCard } from './FindingCard';
import { ShieldAlert, Search, Filter, Sparkles, CheckCircle2 } from 'lucide-react';

interface FindingsWorkspaceProps {
  findings: Finding[];
  onSelectFinding: (finding: Finding) => void;
  onViewFix: (finding: Finding) => void;
  onViewRootCause: (finding: Finding) => void;
}

export const FindingsWorkspace: React.FC<FindingsWorkspaceProps> = ({
  findings,
  onSelectFinding,
  onViewFix,
  onViewRootCause
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<string>('all');

  const filterOptions = [
    { id: 'all', label: 'All Findings' },
    { id: 'security', label: 'Security' },
    { id: 'bug', label: 'Bugs' },
    { id: 'critical', label: 'Critical' },
    { id: 'high', label: 'High' },
    { id: 'medium', label: 'Medium' },
    { id: 'low', label: 'Low' },
    { id: 'verified', label: 'Verified' },
    { id: 'unverified', label: 'Unverified' }
  ];

  const filteredFindings = findings.filter(finding => {
    // Search match
    const query = searchQuery.toLowerCase();
    const matchesSearch = 
      finding.title.toLowerCase().includes(query) ||
      finding.file.toLowerCase().includes(query) ||
      finding.description.toLowerCase().includes(query);

    if (!matchesSearch) return false;

    // Filter match
    if (activeFilter === 'all') return true;
    if (activeFilter === 'security') return finding.type === 'security';
    if (activeFilter === 'bug') return finding.type === 'bug';
    if (activeFilter === 'critical') return finding.severity === 'critical';
    if (activeFilter === 'high') return finding.severity === 'high';
    if (activeFilter === 'medium') return finding.severity === 'medium';
    if (activeFilter === 'low') return finding.severity === 'low';
    if (activeFilter === 'verified') return finding.status === 'verified';
    if (activeFilter === 'unverified') return finding.status !== 'verified';
    return true;
  });

  return (
    <div className="flex flex-col h-full bg-[#0b0d11] text-zinc-200 overflow-y-auto">
      {/* Top Header */}
      <div className="p-6 bg-[#121620] border-b border-[#212733] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Vulnerability & Defect Catalog</span>
            <span className="text-zinc-600 font-mono">•</span>
            <span className="text-xs font-mono text-emerald-400 font-medium">Machine Verified Fixes Available</span>
          </div>
          <h1 className="text-2xl font-bold text-white font-mono flex items-center gap-3">
            <span>Findings</span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
              {filteredFindings.length} issues
            </span>
          </h1>
          <p className="text-xs text-zinc-400 mt-1 max-w-2xl">
            Autonomous static analysis and taint-tracking discoveries with file & line evidence, reproducible tests, and verified patches.
          </p>
        </div>

        {/* Search bar */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter by file, title, or keyword..."
            className="w-full bg-[#181d26] border border-[#2b3342] rounded-lg pl-9 pr-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-indigo-500 transition-colors"
          />
        </div>
      </div>

      {/* Filter Tabs Row */}
      <div className="px-6 py-3 bg-[#0e1218] border-b border-[#212733] flex items-center gap-1.5 overflow-x-auto scrollbar-none select-none">
        <Filter className="w-3.5 h-3.5 text-zinc-500 mr-1 shrink-0" />
        {filterOptions.map(tab => (
          <button
            key={tab.id}
            type="button"
            id={`findings-filter-${tab.id}`}
            onClick={() => setActiveFilter(tab.id)}
            className={`px-3 py-1 rounded-md text-xs font-mono transition-all shrink-0 ${
              activeFilter === tab.id
                ? 'bg-indigo-600 text-white font-medium shadow-sm'
                : 'bg-[#151922] text-zinc-400 hover:text-zinc-200 border border-[#222938]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Findings Grid */}
      <div className="p-6 max-w-6xl">
        {filteredFindings.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredFindings.map(finding => (
              <FindingCard
                key={finding.id}
                finding={finding}
                onSelectFinding={onSelectFinding}
                onViewFix={onViewFix}
                onViewRootCause={onViewRootCause}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-[#121620] rounded-xl border border-[#212733] max-w-lg mx-auto">
            <ShieldAlert className="w-8 h-8 text-zinc-500 mx-auto mb-3" />
            <h3 className="text-sm font-mono font-semibold text-white">No findings matched criteria</h3>
            <p className="text-xs text-zinc-400 mt-1">
              Try adjusting your search query or switching the category filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setActiveFilter('all');
              }}
              className="mt-4 px-3 py-1.5 rounded bg-[#1b2230] text-xs font-mono text-indigo-300 hover:text-white"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
