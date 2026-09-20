import React, { useState } from 'react';
import { Finding } from '../types';
import { bugbusterService } from '../services/bugbusterService';
import { SeverityBadge, FindingStatusBadge } from './StatusBadge';
import { CodeViewer } from './CodeViewer';
import { 
  FileCode, 
  ArrowLeft, 
  Wrench, 
  ShieldCheck, 
  FileText, 
  FlaskConical, 
  CheckCircle2, 
  AlertTriangle,
  Play,
  Terminal,
  ExternalLink
} from 'lucide-react';

interface FindingDetailProps {
  finding: Finding;
  onBack: () => void;
  onNavigateToVerification?: (finding: Finding) => void;
  onNavigateToDiff?: (finding: Finding) => void;
  onUpdateFinding?: (updated: Finding) => void;
}

export const FindingDetail: React.FC<FindingDetailProps> = ({
  finding,
  onBack,
  onNavigateToVerification,
  onNavigateToDiff,
  onUpdateFinding
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'evidence' | 'root_cause' | 'fix' | 'test' | 'verification'>('overview');
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleFetchRootCause = async () => {
    setLoadingAction('root_cause');
    setActionError(null);
    try {
      const updated = await bugbusterService.attachRootCause(finding);
      if (onUpdateFinding) onUpdateFinding(updated);
    } catch (err: any) {
      setActionError(err?.message || 'Failed to determine root cause from backend.');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleFetchFix = async () => {
    setLoadingAction('fix');
    setActionError(null);
    try {
      const updated = await bugbusterService.attachFix(finding);
      if (onUpdateFinding) onUpdateFinding(updated);
    } catch (err: any) {
      setActionError(err?.message || 'Failed to generate fix from backend.');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleFetchTest = async () => {
    setLoadingAction('test');
    setActionError(null);
    try {
      const updated = await bugbusterService.attachTest(finding);
      if (onUpdateFinding) onUpdateFinding(updated);
    } catch (err: any) {
      setActionError(err?.message || 'Failed to generate test from backend.');
    } finally {
      setLoadingAction(null);
    }
  };

  const handleFetchVerification = async () => {
    setLoadingAction('verification');
    setActionError(null);
    try {
      const updated = await bugbusterService.attachVerification(finding);
      if (onUpdateFinding) onUpdateFinding(updated);
    } catch (err: any) {
      setActionError(err?.message || 'Failed to run verification on backend.');
    } finally {
      setLoadingAction(null);
    }
  };

  const tabs: Array<{ id: typeof activeTab; label: string; icon: React.ElementType }> = [
    { id: 'overview', label: 'Overview', icon: FileText },
    { id: 'evidence', label: 'Evidence', icon: FileCode },
    { id: 'root_cause', label: 'Root Cause', icon: AlertTriangle },
    { id: 'fix', label: 'Fix', icon: Wrench },
    { id: 'test', label: 'Test', icon: FlaskConical },
    { id: 'verification', label: 'Verification', icon: ShieldCheck }
  ];

  return (
    <div className="flex flex-col h-full bg-[#0b0d11] text-zinc-200">
      {/* Top Header */}
      <div className="p-4 bg-[#121620] border-b border-[#212733] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 text-xs font-mono text-zinc-400 hover:text-white mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Findings</span>
          </button>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-lg font-bold text-white font-mono">{finding.title}</h1>
            <SeverityBadge severity={finding.severity} size="md" />
            <FindingStatusBadge status={finding.status} size="md" />
          </div>

          <div className="flex items-center gap-4 mt-1 text-xs font-mono text-zinc-400">
            <div className="flex items-center gap-1">
              <span className="text-zinc-500">File:</span>
              <span className="text-zinc-200 font-semibold">{finding.file}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-zinc-500">Lines:</span>
              <span className="text-zinc-200">{finding.lines[0]}–{finding.lines[1]}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-zinc-500">Confidence:</span>
              <span className="text-emerald-400 font-semibold">{Math.round(finding.confidence * 100)}%</span>
            </div>
          </div>
        </div>

        {/* Header Action CTA */}
        <div className="flex items-center gap-2">
          {finding.fix && (
            <button
              type="button"
              onClick={() => onNavigateToDiff && onNavigateToDiff(finding)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#1d2330] hover:bg-[#283142] border border-[#2f384a] text-xs font-mono text-indigo-300 transition-colors cursor-pointer"
            >
              <Wrench className="w-3.5 h-3.5" />
              <span>Inspect Full Diff</span>
            </button>
          )}

          {finding.verification && (
            <button
              type="button"
              onClick={() => onNavigateToVerification && onNavigateToVerification(finding)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-medium shadow-sm transition-all cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Machine Proof</span>
            </button>
          )}
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1 px-4 bg-[#0e1218] border-b border-[#212733] overflow-x-auto scrollbar-none select-none">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-mono border-b-2 font-medium transition-colors ${
                isActive
                  ? 'border-indigo-500 text-white bg-indigo-500/5'
                  : 'border-transparent text-zinc-400 hover:text-zinc-200 hover:border-zinc-700'
              }`}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-400' : 'text-zinc-500'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Content Panels */}
      <div className="flex-1 overflow-y-auto p-6 bg-[#0b0d11]">
        {/* 1. OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="max-w-4xl space-y-6">
            <div className="p-4 rounded-lg bg-[#121620] border border-[#212733]">
              <h3 className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Problem Description
              </h3>
              <p className="text-sm text-zinc-200 leading-relaxed font-sans">
                {finding.description}
              </p>
            </div>

            <div className="p-4 rounded-lg bg-[#121620] border border-[#212733]">
              <h3 className="text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider mb-2">
                Security Impact
              </h3>
              <p className="text-sm text-zinc-200 leading-relaxed font-sans">
                {finding.impact}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg bg-[#121620] border border-[#212733] font-mono text-xs space-y-2">
                <div className="text-zinc-400 uppercase tracking-wider text-[11px] font-semibold">
                  Detection Source
                </div>
                <div className="text-zinc-200 bg-[#171c26] p-2.5 rounded border border-[#262f3f]">
                  {finding.detectionSource}
                </div>
              </div>

              <div className="p-4 rounded-lg bg-[#121620] border border-[#212733] font-mono text-xs space-y-2">
                <div className="text-zinc-400 uppercase tracking-wider text-[11px] font-semibold">
                  Confidence Score
                </div>
                <div className="text-emerald-400 bg-[#171c26] p-2.5 rounded border border-[#262f3f] flex items-center justify-between">
                  <span>Statistical Taint Certainty</span>
                  <span className="font-bold text-sm">{Math.round(finding.confidence * 100)}%</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. EVIDENCE TAB */}
        {activeTab === 'evidence' && (
          <div className="max-w-5xl space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-400">
              <span>Code Location: <code className="text-zinc-200 font-bold">{finding.file}:{finding.lines[0]}-{finding.lines[1]}</code></span>
              <span className="text-red-400">Highlighted Line indicates taint sink</span>
            </div>

            <CodeViewer
              code={finding.evidenceCode}
              filename={finding.file}
              startLineNumber={finding.lines[0]}
              highlightLines={[finding.lines[0] + 1]}
              badge="Vulnerable Sink"
              badgeColor="bg-red-500/20 text-red-300 border-red-500/40"
            />
          </div>
        )}

        {actionError && (
          <div className="p-3 mb-4 rounded bg-red-500/10 border border-red-500/30 text-red-300 text-xs font-mono">
            {actionError}
          </div>
        )}

        {/* 3. ROOT CAUSE TAB */}
        {activeTab === 'root_cause' && (
          <div className="max-w-4xl space-y-4">
            <div className="p-5 rounded-lg bg-[#121620] border border-[#212733]">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-amber-400 font-mono text-xs uppercase font-semibold tracking-wider">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Technical Root Cause Analysis</span>
                </div>
                {!finding.rootCauseResult && (
                  <button
                    type="button"
                    onClick={handleFetchRootCause}
                    disabled={loadingAction === 'root_cause'}
                    className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-mono font-medium"
                  >
                    {loadingAction === 'root_cause' ? 'Analyzing Root Cause...' : 'Fetch Backend Root Cause'}
                  </button>
                )}
              </div>
              <p className="text-sm text-zinc-200 font-sans leading-relaxed">
                {finding.rootCauseResult?.root_cause || finding.rootCause || 'Root cause analysis pending.'}
              </p>
            </div>

            {finding.rootCauseResult?.affected_behavior && (
              <div className="p-4 rounded-lg bg-[#10141c] border border-[#1f2633] text-xs font-mono space-y-1.5">
                <div className="text-zinc-400 uppercase font-semibold text-[11px]">Affected Behavior</div>
                <p className="text-zinc-300">{finding.rootCauseResult.affected_behavior}</p>
              </div>
            )}

            {finding.rootCauseResult?.fix_strategy && (
              <div className="p-4 rounded-lg bg-[#10141c] border border-[#1f2633] text-xs font-mono space-y-1.5">
                <div className="text-indigo-300 uppercase font-semibold text-[11px]">Fix Strategy</div>
                <p className="text-zinc-300">{finding.rootCauseResult.fix_strategy}</p>
              </div>
            )}

            {finding.rootCauseResult?.required_files && finding.rootCauseResult.required_files.length > 0 && (
              <div className="p-4 rounded-lg bg-[#10141c] border border-[#1f2633] text-xs font-mono">
                <div className="text-zinc-400 uppercase font-semibold text-[11px] mb-2">Required Files</div>
                <div className="flex flex-wrap gap-1.5">
                  {finding.rootCauseResult.required_files.map(rf => (
                    <span key={rf} className="px-2 py-0.5 rounded bg-[#181f2c] border border-[#2b3548] text-zinc-300">
                      {rf}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 4. FIX TAB */}
        {activeTab === 'fix' && (
          <div className="max-w-5xl space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-300 font-medium">Targeted Fix & Minimal Patch</span>
              {!finding.fixResult && (
                <button
                  type="button"
                  onClick={handleFetchFix}
                  disabled={loadingAction === 'fix'}
                  className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-mono font-medium"
                >
                  {loadingAction === 'fix' ? 'Synthesizing Fix...' : 'Generate Fix via Backend'}
                </button>
              )}
            </div>

            {/* Side-by-side or Patch Display */}
            {finding.fixResult?.original_code || finding.fixResult?.fixed_code ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* BEFORE */}
                <div className="rounded-lg border border-red-500/30 bg-[#0d1117] overflow-hidden font-mono text-xs">
                  <div className="px-3 py-2 bg-red-950/20 border-b border-red-500/20 text-red-400 font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-red-500" />
                      <span>ORIGINAL CODE</span>
                    </div>
                    <span className="text-[11px] text-zinc-400">{finding.file}</span>
                  </div>
                  <pre className="p-3 text-[11px] leading-relaxed text-zinc-300 whitespace-pre overflow-x-auto">
                    {finding.fixResult.original_code || 'N/A'}
                  </pre>
                </div>

                {/* AFTER */}
                <div className="rounded-lg border border-emerald-500/30 bg-[#0d1117] overflow-hidden font-mono text-xs">
                  <div className="px-3 py-2 bg-emerald-950/20 border-b border-emerald-500/20 text-emerald-400 font-semibold flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>FIXED CODE</span>
                    </div>
                    <span className="text-[11px] text-zinc-400">Patched</span>
                  </div>
                  <pre className="p-3 text-[11px] leading-relaxed text-zinc-300 whitespace-pre overflow-x-auto">
                    {finding.fixResult.fixed_code || 'N/A'}
                  </pre>
                </div>
              </div>
            ) : finding.fixResult?.patch ? (
              <div className="rounded-lg border border-[#212733] bg-[#0d1117] overflow-hidden font-mono text-xs">
                <div className="px-3 py-2 bg-[#161b22] border-b border-[#21262d] text-zinc-300 font-semibold">
                  Unified Patch
                </div>
                <pre className="p-3 text-[11px] leading-relaxed text-zinc-300 whitespace-pre overflow-x-auto">
                  {finding.fixResult.patch}
                </pre>
              </div>
            ) : (
              <div className="p-6 rounded-lg bg-[#121620] border border-[#212733] text-center text-xs font-mono text-zinc-400">
                Fix not yet synthesized. Click "Generate Fix via Backend" to call <code>POST /api/fix/generate</code>.
              </div>
            )}

            {finding.fixResult && (
              <div className="p-4 rounded-lg bg-[#121620] border border-[#212733] text-xs font-mono text-zinc-300 space-y-2">
                <div>
                  <span className="text-indigo-400 font-semibold">Autonomous Fix Rationale: </span>
                  {finding.fixResult.explanation || finding.fix?.explanation}
                </div>
                {finding.fixResult.risk && (
                  <div>
                    <span className="text-amber-400 font-semibold">Risk Assessment: </span>
                    {finding.fixResult.risk}
                  </div>
                )}
                {finding.fixResult.changed_files && (
                  <div>
                    <span className="text-zinc-400 font-semibold">Changed Files: </span>
                    {finding.fixResult.changed_files.join(', ')}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* 5. TEST TAB */}
        {activeTab === 'test' && (
          <div className="max-w-5xl space-y-4">
            <div className="flex items-center justify-between text-xs font-mono text-zinc-300">
              <span>Synthesized Regression & Security Test</span>
              {!finding.testResult && (
                <button
                  type="button"
                  onClick={handleFetchTest}
                  disabled={loadingAction === 'test'}
                  className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-mono font-medium"
                >
                  {loadingAction === 'test' ? 'Synthesizing Test...' : 'Generate Test via Backend'}
                </button>
              )}
            </div>

            {finding.testResult?.test || finding.test?.testCode ? (
              <CodeViewer
                code={finding.testResult?.test || finding.test?.testCode || ''}
                filename="test_regression.py"
                language="python"
                badge="Backend Security Test"
                badgeColor="bg-indigo-500/20 text-indigo-300 border-indigo-500/40"
              />
            ) : (
              <div className="p-6 rounded-lg bg-[#121620] border border-[#212733] text-center text-xs font-mono text-zinc-400">
                No custom test synthesized for this finding yet. Click "Generate Test via Backend" to call <code>POST /api/test/generate</code>.
              </div>
            )}
          </div>
        )}

        {/* 6. VERIFICATION TAB */}
        {activeTab === 'verification' && (
          <div className="max-w-4xl space-y-4">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-zinc-300 font-medium">Machine Proof of Correctness</span>
              <button
                type="button"
                onClick={handleFetchVerification}
                disabled={loadingAction === 'verification'}
                className="px-2.5 py-1 rounded bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-xs font-mono font-medium"
              >
                {loadingAction === 'verification' ? 'Verifying in Sandbox...' : 'Run Sandbox Verification'}
              </button>
            </div>

            {finding.backendVerification ? (
              <div className="space-y-4">
                <div className={`p-4 rounded-lg border flex items-center justify-between ${
                  finding.backendVerification.verified 
                    ? 'bg-emerald-950/20 border-emerald-500/30' 
                    : 'bg-amber-950/20 border-amber-500/30'
                }`}>
                  <div className="flex items-center gap-3">
                    {finding.backendVerification.verified ? (
                      <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                    ) : (
                      <AlertTriangle className="w-6 h-6 text-amber-400" />
                    )}
                    <div>
                      <div className="text-sm font-semibold text-white font-mono">
                        Verdict: {finding.backendVerification.verdict || (finding.backendVerification.verified ? 'PASSED' : 'UNVERIFIED')}
                      </div>
                      <div className="text-xs text-zinc-400 font-mono">
                        Reason: {finding.backendVerification.reason || 'Verification executed'}
                      </div>
                    </div>
                  </div>
                  <div className="text-xs font-mono px-2.5 py-1 rounded bg-[#0b0e14] border border-[#212733] text-zinc-300">
                    Sandbox: {finding.backendVerification.sandbox_type || 'isolated'}
                  </div>
                </div>

                {/* Before & After Run Results */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-lg bg-[#121620] border border-red-500/30 font-mono text-xs">
                    <div className="text-red-400 font-semibold mb-2">BEFORE FIX RUN</div>
                    <pre className="text-[11px] text-zinc-300 bg-[#0b0e14] p-2.5 rounded border border-[#1e2533] overflow-x-auto whitespace-pre">
                      {typeof finding.backendVerification.before === 'string' 
                        ? finding.backendVerification.before 
                        : JSON.stringify(finding.backendVerification.before, null, 2)}
                    </pre>
                  </div>

                  <div className="p-4 rounded-lg bg-[#121620] border border-emerald-500/30 font-mono text-xs">
                    <div className="text-emerald-400 font-semibold mb-2">AFTER FIX RUN</div>
                    <pre className="text-[11px] text-zinc-300 bg-[#0b0e14] p-2.5 rounded border border-[#1e2533] overflow-x-auto whitespace-pre">
                      {typeof finding.backendVerification.after === 'string' 
                        ? finding.backendVerification.after 
                        : JSON.stringify(finding.backendVerification.after, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-6 rounded-lg bg-[#121620] border border-[#212733] text-center text-xs font-mono text-zinc-400">
                Verification pending sandbox execution. Click "Run Sandbox Verification" to call <code>POST /api/verify/run</code>.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
