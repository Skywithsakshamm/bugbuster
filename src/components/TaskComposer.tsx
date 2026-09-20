import React, { useState } from 'react';
import { 
  GitFork, 
  GitBranch, 
  GitPullRequest, 
  GitCommit, 
  FileCode, 
  Layers, 
  Shield, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  Info
} from 'lucide-react';
import { Repository, InputSourceType, AnalysisScope, AgentOptions } from '../types';

interface TaskComposerProps {
  repositories: Repository[];
  selectedRepo: Repository;
  onSelectRepo: (repo: Repository) => void;
  selectedBranch: string;
  onSelectBranch: (branch: string) => void;
  onStartAnalysis: (payload: {
    repoId: string;
    branch: string;
    sourceType: InputSourceType;
    sourceValue?: string;
    prompt: string;
    scope: AnalysisScope;
    options: AgentOptions;
  }) => void;
}

export const TaskComposer: React.FC<TaskComposerProps> = ({
  repositories,
  selectedRepo,
  onSelectRepo,
  selectedBranch,
  onSelectBranch,
  onStartAnalysis
}) => {
  const [sourceType, setSourceType] = useState<InputSourceType>('repository');
  const [localPath, setLocalPath] = useState('');
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [prUrl, setPrUrl] = useState('https://github.com/owner/repo/pull/142');
  const [commitHash, setCommitHash] = useState('');
  const [diffInput, setDiffInput] = useState('');
  
  const [prompt, setPrompt] = useState(
    'Find security vulnerabilities and correctness bugs. Generate minimal fixes and verify every fix with a reproducible test.'
  );

  const [scope, setScope] = useState<AnalysisScope>('changed_files');
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [options, setOptions] = useState<AgentOptions>({
    detectSecurity: true,
    detectBugs: true,
    generateFixes: true,
    generateRegressionTests: true,
    verifyBeforeAfter: true,
    runRegressionSuite: true
  });

  const handleOptionToggle = (key: keyof AgentOptions) => {
    setOptions(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // GitHub warning
    if (sourceType === 'pr' || sourceType === 'branch' || sourceType === 'commit') {
      setErrorMessage(
        'GitHub remote integration (PR/branch/commit) is not supported in the current backend. Please use "Repository" (local path or ZIP upload) or "Diff".'
      );
      return;
    }

    setLoading(true);
    try {
      let sourceValue: string | undefined = undefined;
      if (sourceType === 'repository') {
        sourceValue = localPath || selectedRepo?.name;
      } else if (sourceType === 'diff') {
        sourceValue = diffInput;
      }

      await onStartAnalysis({
        repoId: selectedRepo?.id || 'backend-repo',
        branch: selectedBranch,
        sourceType,
        sourceValue,
        prompt,
        scope,
        options
      });
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to start analysis');
    } finally {
      setLoading(false);
    }
  };

  const inputTypes: Array<{ id: InputSourceType; label: string; icon: React.ElementType }> = [
    { id: 'pr', label: 'Pull Request', icon: GitPullRequest },
    { id: 'repository', label: 'Repository', icon: GitFork },
    { id: 'branch', label: 'Branch', icon: GitBranch },
    { id: 'commit', label: 'Commit', icon: GitCommit },
    { id: 'diff', label: 'Diff', icon: FileCode }
  ];

  return (
    <div className="flex flex-col items-center justify-start min-h-full py-8 px-4 sm:px-6 bg-[#0b0d11] text-zinc-200 overflow-y-auto">
      <div className="w-full max-w-3xl">
        {/* Title Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-mono mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Autonomous AI Software Engineering Agent</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold font-mono text-white tracking-tight">
            Start an autonomous analysis
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-sans mt-2 max-w-xl mx-auto">
            Provide a repository, PR, or diff. BugBuster will discover vulnerabilities, synthesize minimal fixes, and prove correctness in an isolated sandbox.
          </p>
        </div>

        {/* Main Composer Box */}
        <form onSubmit={handleSubmit} className="bg-[#121620] border border-[#212733] rounded-xl p-5 sm:p-7 shadow-xl space-y-6">
          {/* Repo and Branch Selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
                Target Repository
              </label>
              <div className="relative">
                <select
                  id="composer-repo-select"
                  value={selectedRepo.id}
                  onChange={(e) => {
                    const found = repositories.find(r => r.id === e.target.value);
                    if (found) onSelectRepo(found);
                  }}
                  className="w-full bg-[#171c26] border border-[#2a3344] rounded-lg px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  {repositories.map(repo => (
                    <option key={repo.id} value={repo.id}>
                      {repo.owner}/{repo.name} ({repo.language})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
                Branch Context
              </label>
              <div className="relative">
                <select
                  id="composer-branch-select"
                  value={selectedBranch}
                  onChange={(e) => onSelectBranch(e.target.value)}
                  className="w-full bg-[#171c26] border border-[#2a3344] rounded-lg px-3.5 py-2.5 text-xs font-mono text-white focus:outline-none focus:border-indigo-500 transition-colors"
                >
                  {selectedRepo.branches.map(branch => (
                    <option key={branch} value={branch}>
                      {branch}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Input Type Selector Pills */}
          <div>
            <label className="block text-xs font-mono font-medium text-zinc-400 mb-2 uppercase tracking-wider">
              Input Source Type
            </label>
            <div className="flex flex-wrap gap-2">
              {inputTypes.map(t => {
                const Icon = t.icon;
                const isSelected = sourceType === t.id;
                return (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setSourceType(t.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-medium shadow-sm'
                        : 'bg-[#171c26] text-zinc-400 hover:text-zinc-200 border border-[#273040]'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{t.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Conditional Input Field based on Source Type */}
          {sourceType === 'repository' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-mono font-medium text-zinc-400 mb-1.5">
                  Local Repository Directory Path
                </label>
                <input
                  type="text"
                  value={localPath}
                  onChange={(e) => setLocalPath(e.target.value)}
                  placeholder="e.g. /workspace/my-python-app or ."
                  className="w-full bg-[#171c26] border border-[#2a3344] rounded-lg px-3.5 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-indigo-500"
                />
                <span className="text-[11px] text-zinc-500 mt-1 block">
                  Backend loads repository directly via <code>POST /api/repository/load</code>.
                </span>
              </div>
            </div>
          )}

          {sourceType === 'pr' && (
            <div className="space-y-2">
              <label className="block text-xs font-mono font-medium text-zinc-400 mb-1.5">
                GitHub Pull Request URL or Number
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={prUrl}
                  onChange={(e) => setPrUrl(e.target.value)}
                  placeholder="https://github.com/owner/repo/pull/142"
                  className="w-full bg-[#171c26] border border-[#2a3344] rounded-lg px-3.5 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-indigo-500 opacity-60"
                />
              </div>
              <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  GitHub remote PR integration is not currently supported by the backend. Please select <strong>Repository</strong> (local path or ZIP upload) or <strong>Diff</strong>.
                </span>
              </div>
            </div>
          )}

          {sourceType === 'branch' && (
            <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono flex items-start gap-2">
              <Info className="w-4 h-4 shrink-0 mt-0.5" />
              <span>
                Remote branch switching via GitHub is not enabled on the backend. Analysis operates on the loaded repository.
              </span>
            </div>
          )}

          {sourceType === 'commit' && (
            <div className="space-y-2">
              <label className="block text-xs font-mono font-medium text-zinc-400 mb-1.5">
                Commit SHA or Reference
              </label>
              <input
                type="text"
                value={commitHash}
                onChange={(e) => setCommitHash(e.target.value)}
                placeholder="a81f92c or HEAD~1"
                className="w-full bg-[#171c26] border border-[#2a3344] rounded-lg px-3.5 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-indigo-500 opacity-60"
              />
              <div className="p-2.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-300 text-[11px] font-mono flex items-start gap-2">
                <Info className="w-4 h-4 shrink-0 mt-0.5" />
                <span>
                  Remote commit fetching via GitHub is not enabled on the backend.
                </span>
              </div>
            </div>
          )}

          {sourceType === 'diff' && (
            <div>
              <label className="block text-xs font-mono font-medium text-zinc-400 mb-1.5">
                Raw Unified Diff / Patch Input
              </label>
              <textarea
                rows={4}
                value={diffInput}
                onChange={(e) => setDiffInput(e.target.value)}
                placeholder="diff --git a/auth.py b/auth.py&#10;--- a/auth.py&#10;+++ b/auth.py"
                className="w-full bg-[#171c26] border border-[#2a3344] rounded-lg p-3 text-xs font-mono text-zinc-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
          )}

          {/* Prompt Textarea */}
          <div>
            <label className="block text-xs font-mono font-medium text-zinc-400 mb-1.5 uppercase tracking-wider">
              Agent Directive
            </label>
            <div className="relative">
              <textarea
                id="composer-prompt-textarea"
                rows={3}
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Describe what you want BugBuster to investigate..."
                className="w-full bg-[#171c26] border border-[#2a3344] rounded-lg p-3.5 text-xs sm:text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 font-sans leading-relaxed transition-colors"
              />
            </div>
          </div>

          {/* Analysis Scope */}
          <div>
            <label className="block text-xs font-mono font-medium text-zinc-400 mb-2 uppercase tracking-wider">
              Analysis Scope
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
              <label 
                className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                  scope === 'changed_files' 
                    ? 'bg-indigo-500/10 border-indigo-500 text-white' 
                    : 'bg-[#171c26] border-[#273040] text-zinc-400 hover:border-zinc-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold">Changed files only</span>
                  <input
                    type="radio"
                    name="scope"
                    checked={scope === 'changed_files'}
                    onChange={() => setScope('changed_files')}
                    className="accent-indigo-500"
                  />
                </div>
                <span className="text-[11px] text-zinc-400">Targeted PR / commit changes</span>
              </label>

              <label 
                className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                  scope === 'dependency_graph' 
                    ? 'bg-indigo-500/10 border-indigo-500 text-white' 
                    : 'bg-[#171c26] border-[#273040] text-zinc-400 hover:border-zinc-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold">Relevant dependency graph</span>
                  <input
                    type="radio"
                    name="scope"
                    checked={scope === 'dependency_graph'}
                    onChange={() => setScope('dependency_graph')}
                    className="accent-indigo-500"
                  />
                </div>
                <span className="text-[11px] text-zinc-400">AST call-graph propagation</span>
              </label>

              <label 
                className={`p-3 rounded-lg border cursor-pointer transition-all flex flex-col justify-between ${
                  scope === 'full_repo' 
                    ? 'bg-indigo-500/10 border-indigo-500 text-white' 
                    : 'bg-[#171c26] border-[#273040] text-zinc-400 hover:border-zinc-600'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold">Full repository</span>
                  <input
                    type="radio"
                    name="scope"
                    checked={scope === 'full_repo'}
                    onChange={() => setScope('full_repo')}
                    className="accent-indigo-500"
                  />
                </div>
                <span className="text-[11px] text-zinc-400">Deep exhaustive codebase audit</span>
              </label>
            </div>
          </div>

          {/* Agent Options Checkboxes */}
          <div>
            <label className="block text-xs font-mono font-medium text-zinc-400 mb-2 uppercase tracking-wider">
              Agent Capabilities & Verification Guardrails
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              <label className="flex items-center gap-2 p-2 rounded bg-[#171c26] border border-[#273040] text-zinc-300 hover:bg-[#1c2330] cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.detectSecurity}
                  onChange={() => handleOptionToggle('detectSecurity')}
                  className="rounded accent-indigo-500"
                />
                <span>Detect security vulnerabilities</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded bg-[#171c26] border border-[#273040] text-zinc-300 hover:bg-[#1c2330] cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.detectBugs}
                  onChange={() => handleOptionToggle('detectBugs')}
                  className="rounded accent-indigo-500"
                />
                <span>Detect correctness bugs</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded bg-[#171c26] border border-[#273040] text-zinc-300 hover:bg-[#1c2330] cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.generateFixes}
                  onChange={() => handleOptionToggle('generateFixes')}
                  className="rounded accent-indigo-500"
                />
                <span>Generate minimal targeted fixes</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded bg-[#171c26] border border-[#273040] text-zinc-300 hover:bg-[#1c2330] cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.generateRegressionTests}
                  onChange={() => handleOptionToggle('generateRegressionTests')}
                  className="rounded accent-indigo-500"
                />
                <span>Generate regression tests</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded bg-[#171c26] border border-[#273040] text-zinc-300 hover:bg-[#1c2330] cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.verifyBeforeAfter}
                  onChange={() => handleOptionToggle('verifyBeforeAfter')}
                  className="rounded accent-indigo-500"
                />
                <span className="text-emerald-300 font-semibold">Verify before/after in sandbox</span>
              </label>

              <label className="flex items-center gap-2 p-2 rounded bg-[#171c26] border border-[#273040] text-zinc-300 hover:bg-[#1c2330] cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.runRegressionSuite}
                  onChange={() => handleOptionToggle('runRegressionSuite')}
                  className="rounded accent-indigo-500"
                />
                <span>Run regression test suite</span>
              </label>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono">
              {errorMessage}
            </div>
          )}

          {/* Primary Action CTA */}
          <div className="pt-2">
            <button
              type="submit"
              id="composer-start-analysis-button"
              disabled={loading}
              className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-white font-mono font-semibold text-sm shadow-md transition-all ${
                loading 
                  ? 'bg-indigo-700 opacity-70 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-500 hover:shadow-indigo-500/25 cursor-pointer'
              }`}
            >
              <span>{loading ? 'Connecting & Analyzing Repository...' : 'Start Analysis'}</span>
              <ArrowRight className={`w-4 h-4 ${loading ? 'animate-pulse' : ''}`} />
            </button>
          </div>

          {/* Small Trust Message */}
          <div className="flex items-center justify-center gap-2 text-center text-xs font-mono text-zinc-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>Changes are verified in an isolated workspace before they are reported as fixed.</span>
          </div>
        </form>
      </div>
    </div>
  );
};
