import React from 'react';
import { 
  LayoutDashboard, 
  PlusCircle, 
  GitFork, 
  ShieldAlert, 
  FileDiff, 
  ShieldCheck, 
  Activity, 
  Settings, 
  Github, 
  Cpu, 
  Terminal,
  ChevronRight
} from 'lucide-react';
import { ScreenId } from '../types';

interface SidebarProps {
  currentScreen: ScreenId;
  onNavigate: (screen: ScreenId) => void;
  openFindingsCount: number;
  verifiedCount: number;
  activeAnalysesCount: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentScreen,
  onNavigate,
  openFindingsCount,
  verifiedCount,
  activeAnalysesCount
}) => {
  const navItems = [
    {
      id: 'dashboard' as ScreenId,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      id: 'new_analysis' as ScreenId,
      label: 'New Analysis',
      icon: PlusCircle,
      badge: 'New',
      isCta: true
    },
    {
      id: 'repositories' as ScreenId,
      label: 'Repositories',
      icon: GitFork,
      badge: '4'
    },
    {
      id: 'findings' as ScreenId,
      label: 'Findings',
      icon: ShieldAlert,
      badge: openFindingsCount > 0 ? String(openFindingsCount) : null,
      badgeColor: 'bg-red-500/20 text-red-300 border border-red-500/30'
    },
    {
      id: 'diff_viewer' as ScreenId,
      label: 'Fixes',
      icon: FileDiff,
      badge: '3'
    },
    {
      id: 'verification' as ScreenId,
      label: 'Verification',
      icon: ShieldCheck,
      badge: verifiedCount > 0 ? `${verifiedCount}✓` : null,
      badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
    },
    {
      id: 'activity' as ScreenId,
      label: 'Activity',
      icon: Activity,
      badge: activeAnalysesCount > 0 ? 'Live' : null,
      badgeColor: 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 animate-pulse'
    },
    {
      id: 'settings' as ScreenId,
      label: 'Settings',
      icon: Settings,
      badge: null
    }
  ];

  return (
    <aside 
      id="app-sidebar"
      className="w-64 h-screen bg-[#0e1117] border-r border-[#1e232b] flex flex-col justify-between select-none shrink-0 z-20"
    >
      {/* Top Brand Identity */}
      <div>
        <div className="p-4 border-b border-[#1e232b] flex items-center justify-between">
          <div 
            onClick={() => onNavigate('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            {/* Custom Brand Logo */}
            <div className="relative w-9 h-9 rounded-lg bg-[#161b22] border border-[#30363d] flex items-center justify-center text-indigo-400 group-hover:border-indigo-500/50 group-hover:text-indigo-300 transition-all shadow-inner">
              <Terminal className="w-5 h-5 text-indigo-400" />
              <div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-[#0e1117]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold tracking-tight text-white font-mono text-base">BugBuster</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400 border border-zinc-700">v1.2</span>
              </div>
              <p className="text-[11px] text-zinc-400 font-mono tracking-tight">Find it. Fix it. Prove it.</p>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1">
          <div className="px-3 py-1.5 text-[10px] font-mono font-semibold tracking-wider text-zinc-400 uppercase">
            Workspace
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentScreen === item.id;

            return (
              <button
                key={item.id}
                id={`sidebar-nav-${item.id}`}
                onClick={() => onNavigate(item.id)}
                type="button"
                className={`w-full flex items-center justify-between px-3 py-2 rounded-md text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#1a1f29] text-white border border-[#2b3340] shadow-sm'
                    : item.isCta 
                    ? 'text-indigo-300 hover:bg-indigo-500/10 hover:text-white border border-transparent'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-[#141820]'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-400' : item.isCta ? 'text-indigo-400' : 'text-zinc-400'}`} />
                  <span>{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    item.badgeColor || (isActive ? 'bg-zinc-700 text-zinc-200' : 'bg-[#181d24] text-zinc-400 border border-[#262c36]')
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom sidebar info */}
      <div className="p-3 border-t border-[#1e232b] space-y-2 bg-[#0a0d12]/50">
        {/* Isolated Sandbox Status */}
        <div className="px-2.5 py-2 rounded border border-[#1e232b] bg-[#12161f] text-[11px] font-mono text-zinc-400 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-zinc-300">Sandbox Cluster</span>
          </div>
          <span className="flex items-center gap-1 text-[10px] text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            4 Nodes Ready
          </span>
        </div>

        {/* GitHub Connection */}
        <div className="px-2.5 py-2 rounded border border-[#1e232b] bg-[#12161f] text-xs flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Github className="w-4 h-4 text-zinc-300" />
            <div>
              <div className="text-xs text-zinc-200 font-medium leading-none">GitHub App</div>
              <span className="text-[10px] text-zinc-400 font-mono">@dev-lead • 24ms</span>
            </div>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-500" title="Connected" />
        </div>

        {/* User Profile */}
        <div className="flex items-center justify-between px-2 pt-1">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-zinc-700 border border-zinc-600 flex items-center justify-center text-white text-xs font-semibold">
              BB
            </div>
            <div className="leading-tight">
              <div className="text-xs font-medium text-zinc-200">Autonomous Eng</div>
              <div className="text-[10px] text-zinc-400 font-mono">agent-worker-01</div>
            </div>
          </div>
          <button 
            type="button" 
            onClick={() => onNavigate('settings')} 
            className="text-zinc-400 hover:text-white p-1"
            title="Account Settings"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  );
};
