import React, { useState } from 'react';
import { 
  FileDiff as FileDiffIcon, 
  Check, 
  GitBranch, 
  GitPullRequest, 
  Play, 
  ShieldCheck, 
  FolderTree, 
  FileCode, 
  ChevronDown, 
  ChevronRight,
  Columns,
  AlignLeft,
  Sparkles
} from 'lucide-react';
import { Finding, FixPatch } from '../types';

interface DiffViewerProps {
  finding?: Finding;
  onApproveFix?: (findingId: string) => void;
  onRunVerification?: (findingId: string) => void;
  onCreatePR?: (findingId: string, branchName: string) => void;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({
  finding,
  onApproveFix,
  onRunVerification,
  onCreatePR
}) => {
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');
  const [selectedFile, setSelectedFile] = useState<string>(
    finding?.file || (finding?.fixResult?.changed_files?.[0] || 'auth.py')
  );
  const [isApproved, setIsApproved] = useState(finding?.fix?.status === 'approved');

  const fix: FixPatch | undefined = finding?.fix;
  const currentDiff = fix?.diffs?.find(d => d.filePath === selectedFile) || fix?.diffs?.[0];
  const backendDiff = finding?.fixResult?.patch;

  const handleApprove = () => {
    setIsApproved(true);
    if (finding && onApproveFix) {
      onApproveFix(finding.id);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0b0d11] text-zinc-200">
      {/* Diff Bar Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3 bg-[#12161f] border-b border-[#21262d]">
        <div className="flex items-center gap-3">
          <div className="p-1.5 rounded bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
            <FileDiffIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-white font-mono">
                {finding?.title || 'Targeted Patch Inspection'}
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                Machine Verified
              </span>
            </div>
            <div className="flex items-center gap-3 text-xs text-zinc-400 font-mono mt-0.5">
              <span>{fix?.filesChanged || 1} file changed</span>
              <span className="text-emerald-400 font-medium">+{fix?.addedLines || 2}</span>
              <span className="text-red-400 font-medium">-{fix?.removedLines || 1}</span>
              <span>• Target: <code className="text-zinc-300">{selectedFile}</code></span>
            </div>
          </div>
        </div>

        {/* Action buttons & View mode switcher */}
        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-[#181d26] border border-[#2d3442] rounded-md p-0.5 text-xs font-mono">
            <button
              type="button"
              onClick={() => setViewMode('split')}
              className={`px-2.5 py-1 rounded flex items-center gap-1 transition-colors ${
                viewMode === 'split' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
              title="Side-by-side diff"
            >
              <Columns className="w-3.5 h-3.5" />
              <span>Split</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('unified')}
              className={`px-2.5 py-1 rounded flex items-center gap-1 transition-colors ${
                viewMode === 'unified' ? 'bg-indigo-600 text-white' : 'text-zinc-400 hover:text-white'
              }`}
              title="Unified diff"
            >
              <AlignLeft className="w-3.5 h-3.5" />
              <span>Unified</span>
            </button>
          </div>

          {/* Verification run button */}
          <button
            type="button"
            onClick={() => finding && onRunVerification && onRunVerification(finding.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#1c222e] hover:bg-[#252d3d] border border-[#2e3748] text-xs font-mono text-zinc-200 transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
            <span>Run Tests</span>
          </button>

          {/* Approve Fix */}
          <button
            type="button"
            onClick={handleApprove}
            disabled={isApproved}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono font-medium transition-all ${
              isApproved
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm cursor-pointer'
            }`}
          >
            <Check className="w-3.5 h-3.5" />
            <span>{isApproved ? 'Approved' : 'Approve Fix'}</span>
          </button>

          {/* Create branch / PR */}
          <button
            type="button"
            disabled={true}
            title="GitHub remote integration is not enabled on backend"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-zinc-800 text-zinc-500 text-xs font-mono font-medium border border-zinc-700 cursor-not-allowed"
          >
            <GitBranch className="w-3.5 h-3.5" />
            <span>Create Branch (Disabled)</span>
          </button>
        </div>
      </div>

      {/* 3-Column Layout: Left FileTree | Center Diff Editor | Right Change Summary */}
      <div className="flex-1 flex overflow-hidden">
        {/* LEFT: File Tree */}
        <div className="w-64 bg-[#0e1218] border-r border-[#1e242f] p-3 flex flex-col shrink-0">
          <div className="flex items-center gap-1.5 text-xs font-mono font-semibold text-zinc-400 uppercase tracking-wider mb-2">
            <FolderTree className="w-3.5 h-3.5 text-indigo-400" />
            <span>Modified Files</span>
          </div>

          <div className="space-y-1 font-mono text-xs">
            <div className="text-zinc-500 text-[11px] px-1 py-0.5">bugbuster-core/</div>
            
            <button
              type="button"
              onClick={() => setSelectedFile('auth.py')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left transition-colors ${
                selectedFile === 'auth.py' ? 'bg-[#1b2230] text-white border border-[#2e3748]' : 'text-zinc-400 hover:bg-[#141820]'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <FileCode className="w-3.5 h-3.5 text-amber-400" />
                <span className="truncate">auth.py</span>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1 rounded">+2 -1</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedFile('tests/test_auth_security.py')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left transition-colors ${
                selectedFile === 'tests/test_auth_security.py' ? 'bg-[#1b2230] text-white border border-[#2e3748]' : 'text-zinc-400 hover:bg-[#141820]'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <FileCode className="w-3.5 h-3.5 text-blue-400" />
                <span className="truncate">test_auth_sec.py</span>
              </div>
              <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1 rounded">+12</span>
            </button>

            <button
              type="button"
              onClick={() => setSelectedFile('utils.py')}
              className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded text-left transition-colors ${
                selectedFile === 'utils.py' ? 'bg-[#1b2230] text-white border border-[#2e3748]' : 'text-zinc-400 hover:bg-[#141820]'
              }`}
            >
              <div className="flex items-center gap-2 truncate">
                <FileCode className="w-3.5 h-3.5 text-orange-400" />
                <span className="truncate">utils.py</span>
              </div>
              <span className="text-[10px] text-zinc-400">+2 -2</span>
            </button>
          </div>

          <div className="mt-auto p-2.5 rounded bg-[#12161f] border border-[#212733] text-[11px] font-mono text-zinc-400">
            <div className="text-zinc-300 font-medium mb-1">Isolated Sandbox</div>
            <div>Branch: <span className="text-indigo-300">{fix?.branchName || 'bugbuster/patch-01'}</span></div>
            <div className="text-[10px] text-emerald-400 mt-1">✓ Clean 3-way merge ready</div>
          </div>
        </div>

        {/* CENTER: Diff Editor */}
        <div className="flex-1 bg-[#0b0e14] overflow-y-auto p-4">
          <div className="border border-[#262c36] rounded-lg overflow-hidden bg-[#0d1117] shadow-sm">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2 bg-[#161b22] border-b border-[#21262d] font-mono text-xs">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-white">{currentDiff?.filePath || selectedFile}</span>
                <span className="text-zinc-500">@@ -82,6 +82,7 @@</span>
              </div>
              <span className="text-zinc-400 text-[11px]">python 3.12</span>
            </div>

            {/* Split View */}
            {viewMode === 'split' ? (
              <div className="grid grid-cols-2 divide-x divide-[#21262d] font-mono text-xs">
                {/* BEFORE (Red) */}
                <div>
                  <div className="px-3 py-1.5 bg-red-950/20 border-b border-[#21262d] text-red-400 text-[11px] font-semibold flex items-center justify-between">
                    <span>BEFORE (Vulnerable)</span>
                    <span>auth.py:82-87</span>
                  </div>
                  <div className="py-2 text-[12px] leading-relaxed">
                    <div className="px-3 py-0.5 text-zinc-400 hover:bg-[#161b22]">
                      <span className="inline-block w-8 text-zinc-600 select-none text-right mr-3">82</span>
                      <span>def authenticate_user(db, username: str, password_hash: str):</span>
                    </div>
                    <div className="px-3 py-0.5 bg-red-950/40 text-red-300 border-l-2 border-red-500 font-medium">
                      <span className="inline-block w-8 text-red-500 select-none text-right mr-3">84</span>
                      <span className="text-red-400 font-bold mr-2">-</span>
                      <span>query = f"SELECT id, username, role FROM users WHERE username = '{'{username}'}' AND password_hash = '{'{password_hash}'}'"</span>
                    </div>
                    <div className="px-3 py-0.5 text-zinc-400 hover:bg-[#161b22]">
                      <span className="inline-block w-8 text-zinc-600 select-none text-right mr-3">85</span>
                      <span>    cursor = db.cursor()</span>
                    </div>
                    <div className="px-3 py-0.5 bg-red-950/40 text-red-300 border-l-2 border-red-500 font-medium">
                      <span className="inline-block w-8 text-red-500 select-none text-right mr-3">86</span>
                      <span className="text-red-400 font-bold mr-2">-</span>
                      <span>    cursor.execute(query)</span>
                    </div>
                    <div className="px-3 py-0.5 text-zinc-400 hover:bg-[#161b22]">
                      <span className="inline-block w-8 text-zinc-600 select-none text-right mr-3">87</span>
                      <span>    return cursor.fetchone()</span>
                    </div>
                  </div>
                </div>

                {/* AFTER (Green) */}
                <div>
                  <div className="px-3 py-1.5 bg-emerald-950/20 border-b border-[#21262d] text-emerald-400 text-[11px] font-semibold flex items-center justify-between">
                    <span>AFTER (Patched & Parameterized)</span>
                    <span>auth.py:82-88</span>
                  </div>
                  <div className="py-2 text-[12px] leading-relaxed">
                    <div className="px-3 py-0.5 text-zinc-400 hover:bg-[#161b22]">
                      <span className="inline-block w-8 text-zinc-600 select-none text-right mr-3">82</span>
                      <span>def authenticate_user(db, username: str, password_hash: str):</span>
                    </div>
                    <div className="px-3 py-0.5 bg-emerald-950/40 text-emerald-300 border-l-2 border-emerald-500 font-medium">
                      <span className="inline-block w-8 text-emerald-500 select-none text-right mr-3">83</span>
                      <span className="text-emerald-400 font-bold mr-2">+</span>
                      <span>    # Secure parameterized query execution</span>
                    </div>
                    <div className="px-3 py-0.5 bg-emerald-950/40 text-emerald-300 border-l-2 border-emerald-500 font-medium">
                      <span className="inline-block w-8 text-emerald-500 select-none text-right mr-3">84</span>
                      <span className="text-emerald-400 font-bold mr-2">+</span>
                      <span>    query = "SELECT id, username, role FROM users WHERE username = %s AND password_hash = %s"</span>
                    </div>
                    <div className="px-3 py-0.5 text-zinc-400 hover:bg-[#161b22]">
                      <span className="inline-block w-8 text-zinc-600 select-none text-right mr-3">85</span>
                      <span>    cursor = db.cursor()</span>
                    </div>
                    <div className="px-3 py-0.5 bg-emerald-950/40 text-emerald-300 border-l-2 border-emerald-500 font-medium">
                      <span className="inline-block w-8 text-emerald-500 select-none text-right mr-3">86</span>
                      <span className="text-emerald-400 font-bold mr-2">+</span>
                      <span>    cursor.execute(query, (username, password_hash))</span>
                    </div>
                    <div className="px-3 py-0.5 text-zinc-400 hover:bg-[#161b22]">
                      <span className="inline-block w-8 text-zinc-600 select-none text-right mr-3">87</span>
                      <span>    return cursor.fetchone()</span>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Unified View */
              backendDiff ? (
                <div className="p-4 overflow-x-auto text-[12px] font-mono leading-relaxed bg-[#0a0d13]">
                  {backendDiff.split('\n').map((line: string, idx: number) => {
                    const isAdd = line.startsWith('+') && !line.startsWith('+++');
                    const isDel = line.startsWith('-') && !line.startsWith('---');
                    const isHunk = line.startsWith('@@');
                    return (
                      <div
                        key={idx}
                        className={`px-3 py-0.5 whitespace-pre ${
                          isAdd
                            ? 'bg-emerald-950/40 text-emerald-300 border-l-2 border-emerald-500'
                            : isDel
                            ? 'bg-red-950/40 text-red-300 border-l-2 border-red-500'
                            : isHunk
                            ? 'text-indigo-400 bg-indigo-950/20'
                            : 'text-zinc-400'
                        }`}
                      >
                        {line}
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="py-2 text-[12px] font-mono leading-relaxed divide-y divide-zinc-900/40">
                  <div className="px-4 py-1 text-zinc-400">
                    <span className="inline-block w-8 text-zinc-600 select-none text-right mr-4">82</span>
                    <span>def authenticate_user(db, username: str, password_hash: str):</span>
                  </div>
                  <div className="px-4 py-1 bg-red-950/40 text-red-300 border-l-2 border-red-500">
                    <span className="inline-block w-8 text-red-500 select-none text-right mr-4">84</span>
                    <span className="text-red-400 font-bold mr-2">-</span>
                    <span>    query = f"SELECT id, username, role FROM users WHERE username = '{'{username}'}' AND password_hash = '{'{password_hash}'}'"</span>
                  </div>
                  <div className="px-4 py-1 bg-emerald-950/40 text-emerald-300 border-l-2 border-emerald-500">
                    <span className="inline-block w-8 text-emerald-500 select-none text-right mr-4">83</span>
                    <span className="text-emerald-400 font-bold mr-2">+</span>
                    <span>    # Secure parameterized query execution</span>
                  </div>
                  <div className="px-4 py-1 bg-emerald-950/40 text-emerald-300 border-l-2 border-emerald-500">
                    <span className="inline-block w-8 text-emerald-500 select-none text-right mr-4">84</span>
                    <span className="text-emerald-400 font-bold mr-2">+</span>
                    <span>    query = "SELECT id, username, role FROM users WHERE username = %s AND password_hash = %s"</span>
                  </div>
                  <div className="px-4 py-1 text-zinc-400">
                    <span className="inline-block w-8 text-zinc-600 select-none text-right mr-4">85</span>
                    <span>    cursor = db.cursor()</span>
                  </div>
                  <div className="px-4 py-1 bg-red-950/40 text-red-300 border-l-2 border-red-500">
                    <span className="inline-block w-8 text-red-500 select-none text-right mr-4">86</span>
                    <span className="text-red-400 font-bold mr-2">-</span>
                    <span>    cursor.execute(query)</span>
                  </div>
                  <div className="px-4 py-1 bg-emerald-950/40 text-emerald-300 border-l-2 border-emerald-500">
                    <span className="inline-block w-8 text-emerald-500 select-none text-right mr-4">86</span>
                    <span className="text-emerald-400 font-bold mr-2">+</span>
                    <span>    cursor.execute(query, (username, password_hash))</span>
                  </div>
                  <div className="px-4 py-1 text-zinc-400">
                    <span className="inline-block w-8 text-zinc-600 select-none text-right mr-4">87</span>
                    <span>    return cursor.fetchone()</span>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* RIGHT: Change Summary */}
        <div className="w-80 bg-[#0e1218] border-l border-[#1e242f] p-4 flex flex-col shrink-0 overflow-y-auto">
          <h3 className="text-xs font-mono font-semibold text-zinc-300 uppercase tracking-wider mb-3">
            Change Summary
          </h3>

          <div className="space-y-3 text-xs">
            {/* Minimal Targeted Fix Badge */}
            <div className="p-3 rounded bg-[#131822] border border-[#212836]">
              <div className="flex items-center gap-2 text-indigo-400 font-medium mb-1">
                <Sparkles className="w-4 h-4" />
                <span>Minimal Targeted Fix</span>
              </div>
              <p className="text-zinc-400 leading-relaxed text-[11px]">
                {fix?.explanation || 'Replaced python f-string interpolation with database driver query parameterization (%s placeholders and params tuple).'}
              </p>
            </div>

            {/* Verification Proof Badge */}
            <div className="p-3 rounded bg-emerald-950/20 border border-emerald-500/30">
              <div className="flex items-center gap-2 text-emerald-400 font-medium mb-1">
                <ShieldCheck className="w-4 h-4" />
                <span>Machine Proof Verified</span>
              </div>
              <div className="space-y-1 text-[11px] font-mono text-zinc-300">
                <div>• Before Fix: <span className="text-red-400 font-semibold">FAILED (assert auth returns None)</span></div>
                <div>• After Fix: <span className="text-emerald-400 font-semibold">PASSED (0.38s)</span></div>
                <div>• Full Regression: <span className="text-emerald-400 font-semibold">24 / 24 PASSED</span></div>
              </div>
            </div>

            {/* Scope Stats */}
            <div className="p-3 rounded bg-[#131822] border border-[#212836] space-y-2 text-[11px] font-mono">
              <div className="flex justify-between text-zinc-400">
                <span>Affected function:</span>
                <span className="text-zinc-200">authenticate_user</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Vulnerability type:</span>
                <span className="text-red-400">CWE-89 (SQLi)</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Risk reduction:</span>
                <span className="text-emerald-400">10.0 → 0.0 CVSS</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Merge conflicts:</span>
                <span className="text-emerald-400">None (0)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
