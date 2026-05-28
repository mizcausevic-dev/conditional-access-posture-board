// Operator surface for Conditional Access posture, exclusions, and policy drift.
//
// Inputs reflect exported or captured identity-control posture:
//   - policy bundle snapshots
//   - gap/exception events across policy, device, session, risk, app, and exclusion controls

export type ScopeKind = "TENANT" | "GROUP" | "POLICY_SET" | "APP";
export type PolicyHealth = "HEALTHY" | "WATCH" | "CRITICAL";
export type SnapshotStatus = "CURRENT" | "STALE";
export type GapStatus = "ADDED" | "REMOVED" | "CHANGED" | "REPORT_ONLY";
export type ControlFamily =
  | "Policy"
  | "Device"
  | "Session"
  | "Risk"
  | "App"
  | "Exclusion"
  | "Telemetry";

export type ResourceType =
  | "ConditionalAccessPolicy"
  | "NamedLocation"
  | "ServicePrincipal"
  | "Group"
  | "AuthenticationContext"
  | "SessionControl"
  | "RiskPolicy"
  | string;

export interface PolicySnapshot {
  id: string;
  name: string;
  scope: ScopeKind;
  policyStatus: PolicyHealth;
  snapshotStatus: SnapshotStatus;
  tenantPath: string;
  coveredApps: number;
  owner: string;
  policyCount: number;
  collectedAt: string;
}

export interface ConditionalAccessGap {
  id: string;
  snapshotId: string;
  resourcePath: string;
  resourceType: ResourceType;
  scope: ScopeKind;
  controlFamily: ControlFamily;
  status: GapStatus;
  expectedState: string;
  observedState: string;
  changeWindowHours: number;
  breaksGuardrail?: boolean;
  impactsIdentity?: boolean;
  note?: string;
}

export interface ConditionalAccessExport {
  snapshots?: PolicySnapshot[];
  gaps?: ConditionalAccessGap[];
}

export type FindingSeverity = "high" | "medium" | "low" | "info";

export type FindingCode =
  | "no-current-policy-bundle"
  | "stale-policy-export"
  | "report-only-admin-policy"
  | "emergency-access-exclusion-drift"
  | "compliant-device-gap"
  | "sign-in-risk-coverage-missing"
  | "session-control-gap"
  | "uncovered-app-gap"
  | "stale-gap-window";

export interface Finding {
  code: FindingCode;
  severity: FindingSeverity;
  message: string;
  subject: string;
  subjectName?: string;
  scope?: ScopeKind;
  controlFamily?: ControlFamily;
  resourceType?: ResourceType;
}

export interface PostureReport {
  generatedAt: string;
  bundles: number;
  currentBundles: number;
  gaps: number;
  blockingGaps: number;
  deviceGaps: number;
  riskGaps: number;
  findingsList: Finding[];
  ok: boolean;
}

export interface PostureOptions {
  now?: string;
  staleGapAfterHours?: number;
}
