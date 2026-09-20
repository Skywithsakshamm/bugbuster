import React, { useState, useEffect } from 'react';
import { 
  ScreenId, 
  Repository, 
  Analysis, 
  Finding, 
  InputSourceType, 
  AnalysisScope, 
  AgentOptions 
} from './types';
import { bugbusterService } from './services/bugbusterService';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';
import { Dashboard } from './components/Dashboard';
import { TaskComposer } from './components/TaskComposer';
import { AnalysisProgress } from './components/AnalysisProgress';
import { FindingsWorkspace } from './components/FindingsWorkspace';
import { FindingDetail } from './components/FindingDetail';
import { VerificationPanel } from './components/VerificationPanel';
import { DiffViewer } from './components/DiffViewer';
import { ActivityFeed } from './components/ActivityFeed';
import { RepositoriesView } from './components/RepositoriesView';
import { FinalReport } from './components/FinalReport';
import { SettingsScreen } from './components/SettingsScreen';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<ScreenId>('dashboard');
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [analyses, setAnalyses] = useState<Analysis[]>([]);
  const [selectedRepo, setSelectedRepo] = useState<Repository | null>(null);
  const [selectedBranch, setSelectedBranch] = useState<string>('main');
  
  // Selected contexts for detail views
  const [activeAnalysis, setActiveAnalysis] = useState<Analysis | null>(null);
  const [selectedFinding, setSelectedFinding] = useState<Finding | null>(null);

  // Load initial data through service layer
  useEffect(() => {
    async function loadData() {
      try {
        const repos = await bugbusterService.getRepositories();
        const allAnalyses = await bugbusterService.getAnalyses();
        setRepositories(repos);
        setAnalyses(allAnalyses);

        if (repos.length > 0) {
          setSelectedRepo(repos[0]);
          setSelectedBranch(repos[0].defaultBranch);
        }

        if (allAnalyses.length > 0) {
          setActiveAnalysis(allAnalyses[0]);
          if (allAnalyses[0].findings.length > 0) {
            setSelectedFinding(allAnalyses[0].findings[0]);
          }
        }
      } catch (err) {
        console.warn('Initial data load warning:', err);
      }
    }
    loadData();
  }, []);

  // Sync selected branch when selected repo changes
  const handleSelectRepo = (repo: Repository) => {
    setSelectedRepo(repo);
    setSelectedBranch(repo.defaultBranch);
    // If we have an analysis matching this repo, select it
    const matching = analyses.find(a => a.repoId === repo.id);
    if (matching) {
      setActiveAnalysis(matching);
      if (matching.findings.length > 0) {
        setSelectedFinding(matching.findings[0]);
      }
    }
  };

  // Start new analysis flow via real backend
  const handleStartAnalysis = async (payload: {
    repoId: string;
    branch: string;
    sourceType: InputSourceType;
    sourceValue?: string;
    prompt: string;
    scope: AnalysisScope;
    options: AgentOptions;
  }) => {
    try {
      const newAnalysis = await bugbusterService.createAnalysis(payload);
      setAnalyses(prev => [newAnalysis, ...prev]);
      setActiveAnalysis(newAnalysis);
      if (newAnalysis.findings.length > 0) {
        setSelectedFinding(newAnalysis.findings[0]);
      }
      setCurrentScreen('analysis_workspace');
    } catch (err: any) {
      console.error('Failed to run analysis on backend:', err);
    }
  };

  // State update callback when findings are modified via backend actions
  const handleUpdateFinding = (updated: Finding) => {
    setSelectedFinding(updated);
    setAnalyses(prev => prev.map(a => ({
      ...a,
      findings: a.findings.map(f => f.id === updated.id ? updated : f)
    })));
    setActiveAnalysis(curr => curr ? {
      ...curr,
      findings: curr.findings.map(f => f.id === updated.id ? updated : f)
    } : null);
  };

  // Quick navigation helpers
  const handleSelectFinding = (finding: Finding) => {
    setSelectedFinding(finding);
    setCurrentScreen('finding_detail');
  };

  const handleViewFix = (finding?: Finding) => {
    if (finding) {
      setSelectedFinding(finding);
    } else if (!selectedFinding && activeAnalysis?.findings.length) {
      setSelectedFinding(activeAnalysis.findings[0]);
    }
    setCurrentScreen('diff_viewer');
  };

  const handleViewVerification = (finding?: Finding) => {
    if (finding) {
      setSelectedFinding(finding);
    } else if (!selectedFinding && activeAnalysis?.findings.length) {
      setSelectedFinding(activeAnalysis.findings[0]);
    }
    setCurrentScreen('verification');
  };

  const handleSelectAnalysis = (analysis: Analysis) => {
    setActiveAnalysis(analysis);
    const repo = repositories.find(r => r.id === analysis.repoId);
    if (repo) setSelectedRepo(repo);
    setSelectedBranch(analysis.branch);
    if (analysis.findings.length > 0) {
      setSelectedFinding(analysis.findings[0]);
    }
    if (analysis.status === 'completed') {
      setCurrentScreen('final_report');
    } else {
      setCurrentScreen('analysis_workspace');
    }
  };

  const handleApproveFix = (findingId: string) => {
    setAnalyses(prev => prev.map(a => ({
      ...a,
      findings: a.findings.map(f => f.id === findingId && f.fix ? {
        ...f,
        fix: { ...f.fix, status: 'approved' }
      } : f)
    })));
  };

  const handleCreatePR = (findingId: string, branchName: string) => {
    setAnalyses(prev => prev.map(a => ({
      ...a,
      findings: a.findings.map(f => f.id === findingId && f.fix ? {
        ...f,
        fix: { ...f.fix, prCreated: true, branchName }
      } : f)
    })));
  };

  const handleAddRepository = (repoData: { owner: string; name: string; branch: string; language: string }) => {
    const newRepo: Repository = {
      id: `repo-${Date.now()}`,
      name: repoData.name,
      owner: repoData.owner,
      defaultBranch: repoData.branch,
      branches: [repoData.branch, 'dev'],
      openFindingsCount: 0,
      verifiedFixesCount: 0,
      isConnected: true,
      lastAnalysisAt: 'Never',
      language: repoData.language,
      stars: 12
    };
    setRepositories(prev => [newRepo, ...prev]);
    setSelectedRepo(newRepo);
    setSelectedBranch(repoData.branch);
  };

  // All findings across analyses
  const allFindings = analyses.flatMap(a => a.findings);
  const openFindingsCount = allFindings.filter(f => f.status !== 'verified').length;
  const verifiedCount = allFindings.filter(f => f.status === 'verified').length;
  const activeAnalysesCount = analyses.filter(a => a.status === 'running').length;

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0b0d11] text-[#e6edf3]">
      {/* Persistent Left Sidebar */}
      <Sidebar
        currentScreen={currentScreen}
        onNavigate={setCurrentScreen}
        openFindingsCount={openFindingsCount}
        verifiedCount={verifiedCount}
        activeAnalysesCount={activeAnalysesCount}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Persistent TopBar */}
        {selectedRepo && (
          <TopBar
            repositories={repositories}
            selectedRepo={selectedRepo}
            onSelectRepo={handleSelectRepo}
            selectedBranch={selectedBranch}
            onSelectBranch={setSelectedBranch}
            activeAnalysis={activeAnalysis || undefined}
            onStartNewAnalysis={() => setCurrentScreen('new_analysis')}
            onOpenReport={() => setCurrentScreen('final_report')}
          />
        )}

        {/* Dynamic Screen Routing */}
        <main className="flex-1 min-h-0 overflow-hidden relative">
          {currentScreen === 'dashboard' && (
            <Dashboard
              analyses={analyses}
              repositories={repositories}
              onStartNewAnalysis={() => setCurrentScreen('new_analysis')}
              onSelectAnalysis={handleSelectAnalysis}
              onNavigateToRepositories={() => setCurrentScreen('repositories')}
              onNavigateToFindings={() => setCurrentScreen('findings')}
              onNavigateToVerification={() => handleViewVerification()}
            />
          )}

          {currentScreen === 'new_analysis' && selectedRepo && (
            <TaskComposer
              repositories={repositories}
              selectedRepo={selectedRepo}
              onSelectRepo={handleSelectRepo}
              selectedBranch={selectedBranch}
              onSelectBranch={setSelectedBranch}
              onStartAnalysis={handleStartAnalysis}
            />
          )}

          {currentScreen === 'analysis_workspace' && (
            <AnalysisProgress
              analysis={activeAnalysis || analyses[0]}
              onSelectFinding={handleSelectFinding}
              onViewReport={() => setCurrentScreen('final_report')}
              onViewDiff={handleViewFix}
              onViewVerification={handleViewVerification}
            />
          )}

          {currentScreen === 'findings' && (
            <FindingsWorkspace
              findings={allFindings}
              onSelectFinding={handleSelectFinding}
              onViewFix={handleViewFix}
              onViewRootCause={handleSelectFinding}
            />
          )}

          {currentScreen === 'finding_detail' && selectedFinding && (
            <FindingDetail
              finding={selectedFinding}
              onBack={() => setCurrentScreen('findings')}
              onNavigateToVerification={handleViewVerification}
              onNavigateToDiff={handleViewFix}
              onUpdateFinding={handleUpdateFinding}
            />
          )}

          {currentScreen === 'verification' && selectedFinding && (
            <VerificationPanel
              finding={selectedFinding}
              onNavigateToDiff={handleViewFix}
              onApproveAndCreatePR={(f) => handleCreatePR(f.id, `bugbuster/fix-${f.file.replace('.', '-')}`)}
              onUpdateFinding={handleUpdateFinding}
            />
          )}

          {currentScreen === 'diff_viewer' && (
            <DiffViewer
              finding={selectedFinding || allFindings[0]}
              onApproveFix={handleApproveFix}
              onRunVerification={(findingId) => {
                const found = allFindings.find(f => f.id === findingId) || selectedFinding || undefined;
                handleViewVerification(found);
              }}
              onCreatePR={handleCreatePR}
            />
          )}

          {currentScreen === 'activity' && (
            <ActivityFeed
              activities={activeAnalysis?.activities || analyses[0]?.activities || []}
              repoName={selectedRepo?.name}
              branchName={selectedBranch}
              isLive={activeAnalysis?.status === 'running'}
            />
          )}

          {currentScreen === 'repositories' && (
            <RepositoriesView
              repositories={repositories}
              onSelectRepo={handleSelectRepo}
              onStartAnalysis={(repo) => {
                handleSelectRepo(repo);
                setCurrentScreen('new_analysis');
              }}
              onAddRepository={handleAddRepository}
            />
          )}

          {currentScreen === 'final_report' && (
            <FinalReport
              analysis={activeAnalysis || analyses[0]}
              onViewChanges={() => setCurrentScreen('diff_viewer')}
              onViewVerification={handleViewVerification}
              onSelectFinding={handleSelectFinding}
              onCreatePR={(branchName) => {
                if (selectedFinding) {
                  handleCreatePR(selectedFinding.id, branchName);
                }
              }}
            />
          )}

          {currentScreen === 'settings' && (
            <SettingsScreen />
          )}
        </main>
      </div>
    </div>
  );
}
