export type SeverityLevel = 'critical' | 'high' | 'medium' | 'low';
export type FindingType = 'security' | 'bug';
export type FindingStatus = 'detected' | 'confirmed' | 'fix_generated' | 'verified';

export type AnalysisStatus = 'queued' | 'running' | 'completed' | 'failed';
export type PipelineStage = 
  | 'input' 
  | 'understand' 
  | 'detect' 
  | 'confirm' 
  | 'fix' 
  | 'test' 
  | 'verify' 
  | 'report';

export type InputSourceType = 'repository' | 'pr' | 'branch' | 'commit' | 'diff';
export type AnalysisScope = 'changed_files' | 'dependency_graph' | 'full_repo';

export interface AgentOptions {
  detectSecurity: boolean;
  detectBugs: boolean;
  generateFixes: boolean;
  generateRegressionTests: boolean;
  verifyBeforeAfter: boolean;
  runRegressionSuite: boolean;
}

export interface DiffHunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  lines: Array<{
    type: 'add' | 'remove' | 'context';
    content: string;
    oldLineNumber?: number;
    newLineNumber?: number;
  }>;
}

export interface FileDiff {
  filePath: string;
  language: string;
  additions: number;
  deletions: number;
  oldCode: string;
  newCode: string;
  hunks: DiffHunk[];
}

export interface FixPatch {
  id: string;
  findingId: string;
  summary: string;
  explanation: string;
  filesChanged: number;
  addedLines: number;
  removedLines: number;
  diffs: FileDiff[];
  status: 'draft' | 'applied' | 'verified' | 'approved';
  branchName?: string;
  prCreated?: boolean;
}

export interface TestRunResult {
  status: 'passed' | 'failed' | 'error';
  durationMs: number;
  stdout: string;
  exitCode: number;
  timestamp: string;
}

export interface TestDetail {
  id: string;
  testName: string;
  testPath: string;
  testCode: string;
  framework: 'pytest' | 'jest' | 'unittest';
  beforeRunResult: TestRunResult;
  afterRunResult: TestRunResult;
}

export interface VerificationResult {
  status: 'verified' | 'failed' | 'pending';
  securityTestBeforeFailed: boolean;
  patchApplied: boolean;
  securityTestAfterPassed: boolean;
  regressionSuitePassed: boolean;
  regressionCount: {
    passed: number;
    total: number;
  };
  environment: string;
  executionMode: string;
  verifiedAt: string;
  machineSignature: string;
  isolatedSandboxId: string;
}

export interface Finding {
  id: string;
  analysisId: string;
  title: string;
  severity: SeverityLevel;
  type: FindingType;
  category?: string;
  file: string;
  lines: [number, number];
  start_line?: number;
  end_line?: number;
  description: string;
  explanation?: string;
  rootCause: string;
  impact: string;
  confidence: number;
  detectionSource: string;
  source?: string;
  evidenceCode: string;
  code_snippet?: string;
  evidence?: string;
  suggested_fix?: string;
  status: FindingStatus;
  
  // Real backend operation results
  rootCauseResult?: RootCauseResult;
  fixResult?: FixResult;
  testResult?: TestGenerationResponse;
  backendVerification?: BackendVerificationResult;

  fix?: FixPatch;
  test?: TestDetail;
  verification?: VerificationResult;
}

// ==========================================
// REAL FASTAPI BACKEND API CONTRACT MODELS
// ==========================================

export interface BackendFinding {
  id: string;
  title: string;
  category: string;
  severity: string;
  confidence: number;
  file: string;
  start_line: number;
  end_line: number;
  code_snippet: string;
  evidence: string;
  explanation: string;
  source: string;
  suggested_fix?: string;
}

export interface RootCauseResult {
  finding_id: string;
  root_cause: string;
  affected_behavior: string;
  fix_strategy: string;
  required_files: string[];
}

export interface FixResult {
  patch: string;
  fixed_code: string;
  original_code: string;
  changed_files: string[];
  explanation: string;
  risk: string;
  is_valid: boolean;
  validation_error: string | null;
}

export interface TestGenerationResponse {
  test: string | any;
  workspaces?: any[];
}

export interface BackendVerificationResult {
  before: any;
  after: any;
  verified: boolean;
  verdict: string;
  reason: string;
  sandbox_type: string;
  regression_checks_passed: boolean;
  signature?: string;
  isolatedSandboxId?: string;
  environment?: string;
}

export interface RepoSummary {
  root_path: string;
  language: string;
  total_files: number;
  python_files: number;
  function_count: number;
  class_count: number;
  symbol_count: number;
  changed_files_count: number;
  has_git: boolean;
}

export interface StatusResponse {
  status: string;
  loaded: boolean;
  summary: RepoSummary | null;
}

export interface CodeSymbol {
  name: string;
  kind?: string;
  file?: string;
  line?: number;
  container_name?: string;
}

export interface RepoDiffResponse {
  changed_files: string[];
  diff: string;
}

export interface LoadRepoPayload {
  path?: string | null;
  raw_code?: string | null;
  raw_filename?: string | null;
  diff?: string | null;
  zip_path?: string | null;
  zip_bytes?: string | null;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  timeDisplay: string;
  stage: PipelineStage;
  message: string;
  detail?: string;
  type: 'info' | 'success' | 'running' | 'warning' | 'error';
  command?: string;
  stdoutSnippet?: string;
}

export interface Repository {
  id: string;
  name: string;
  owner: string;
  defaultBranch: string;
  branches: string[];
  openFindingsCount: number;
  verifiedFixesCount: number;
  isConnected: boolean;
  lastAnalysisAt: string;
  language: string;
  stars?: number;
}

export interface Analysis {
  id: string;
  repoId: string;
  repoName: string;
  owner: string;
  branch: string;
  sourceType: InputSourceType;
  sourceLabel: string;
  prNumber?: number;
  prUrl?: string;
  commitHash?: string;
  status: AnalysisStatus;
  stage: PipelineStage;
  progressPercent: number;
  prompt: string;
  scope: AnalysisScope;
  options: AgentOptions;
  findings: Finding[];
  activities: ActivityEvent[];
  startedAt: string;
  completedAt?: string;
  totalFilesScanned: number;
  duration?: string;
}

export type ScreenId = 
  | 'dashboard' 
  | 'new_analysis' 
  | 'analysis_workspace' 
  | 'findings' 
  | 'finding_detail' 
  | 'verification' 
  | 'diff_viewer' 
  | 'activity' 
  | 'repositories' 
  | 'final_report'
  | 'settings';
