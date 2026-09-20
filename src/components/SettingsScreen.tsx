import React, { useState } from 'react';
import { Settings, Shield, Github, Cpu, Terminal, Check, Save } from 'lucide-react';

export const SettingsScreen: React.FC = () => {
  const [apiEndpoint, setApiEndpoint] = useState('http://localhost:8000/api/v1');
  const [sandboxNodes, setSandboxNodes] = useState('4');
  const [autoVerify, setAutoVerify] = useState(true);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="flex flex-col h-full bg-[#0b0d11] text-zinc-200 overflow-y-auto">
      <div className="p-6 bg-[#121620] border-b border-[#212733]">
        <h1 className="text-xl font-bold text-white font-mono flex items-center gap-2">
          <Settings className="w-5 h-5 text-indigo-400" />
          <span>Agent & Pipeline Settings</span>
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Configure FastAPI backend endpoints, GitHub app webhook tokens, and isolated sandbox runtime limits.
        </p>
      </div>

      <div className="p-6 max-w-3xl space-y-6">
        <form onSubmit={handleSave} className="space-y-6 text-xs font-mono">
          {/* Backend Connection */}
          <div className="p-5 rounded-lg bg-[#121620] border border-[#212733] space-y-4">
            <div className="flex items-center gap-2 text-zinc-200 font-bold uppercase text-[11px] tracking-wider">
              <Terminal className="w-4 h-4 text-indigo-400" />
              <span>FastAPI Backend Gateway</span>
            </div>
            <div>
              <label className="block text-zinc-400 mb-1.5">
                API Base URL (BugBuster Server)
              </label>
              <input
                type="text"
                value={apiEndpoint}
                onChange={(e) => setApiEndpoint(e.target.value)}
                className="w-full bg-[#181d26] border border-[#2b3342] rounded-md px-3 py-2 text-zinc-200 focus:outline-none focus:border-indigo-500"
              />
              <span className="text-[10px] text-zinc-500 mt-1 block">
                Structured UI connects to this FastAPI endpoint for live autonomous pipelines.
              </span>
            </div>
          </div>

          {/* Sandbox & Runner Configuration */}
          <div className="p-5 rounded-lg bg-[#121620] border border-[#212733] space-y-4">
            <div className="flex items-center gap-2 text-zinc-200 font-bold uppercase text-[11px] tracking-wider">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Isolated Execution Sandbox</span>
            </div>
            <div>
              <label className="block text-zinc-400 mb-1.5">
                Ephemeral Worker Concurrency
              </label>
              <input
                type="number"
                value={sandboxNodes}
                onChange={(e) => setSandboxNodes(e.target.value)}
                className="w-full bg-[#181d26] border border-[#2b3342] rounded-md px-3 py-2 text-zinc-200 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <label className="flex items-center gap-2 text-zinc-300 cursor-pointer pt-1">
              <input
                type="checkbox"
                checked={autoVerify}
                onChange={() => setAutoVerify(!autoVerify)}
                className="rounded accent-indigo-500"
              />
              <span>Enforce mandatory isolated sandbox machine verification before marking fixes as ready</span>
            </label>
          </div>

          {/* GitHub App Authentication */}
          <div className="p-5 rounded-lg bg-[#121620] border border-[#212733] space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-zinc-200 font-bold uppercase text-[11px] tracking-wider">
                <Github className="w-4 h-4 text-zinc-300" />
                <span>GitHub App Integration</span>
              </div>
              <span className="px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[10px]">
                Connected
              </span>
            </div>
            <p className="text-zinc-400 text-[11px] leading-relaxed font-sans">
              Connected as BugBuster Autonomous Agent with read repository, pull-request write, and check-run permissions.
            </p>
          </div>

          {/* Save Button */}
          <div className="flex items-center justify-end gap-3 pt-2">
            {saved && (
              <span className="flex items-center gap-1 text-emerald-400 text-xs">
                <Check className="w-4 h-4" />
                <span>Settings saved</span>
              </span>
            )}
            <button
              type="submit"
              className="flex items-center gap-2 px-4 py-2 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-medium shadow-sm transition-all cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Configurations</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
