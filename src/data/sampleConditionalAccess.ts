import type { ConditionalAccessExport } from "../types.js";

export const sampleConditionalAccessPayload: ConditionalAccessExport = {
  snapshots: [
    {
      id: "bundle-workforce",
      name: "Workforce access baseline",
      scope: "TENANT",
      policyStatus: "WATCH",
      snapshotStatus: "CURRENT",
      tenantPath: "/tenants/kg-prod/policy-bundles/workforce",
      coveredApps: 38,
      owner: "Identity Security",
      policyCount: 14,
      collectedAt: "2026-05-30T14:00:00Z"
    },
    {
      id: "bundle-privileged",
      name: "Privileged admin protections",
      scope: "POLICY_SET",
      policyStatus: "CRITICAL",
      snapshotStatus: "STALE",
      tenantPath: "/tenants/kg-prod/policy-bundles/privileged-admin",
      coveredApps: 12,
      owner: "Entra IAM",
      policyCount: 8,
      collectedAt: "2026-05-27T09:20:00Z"
    }
  ],
  gaps: [
    {
      id: "gap-admin-report-only",
      snapshotId: "bundle-privileged",
      resourcePath: "CA-PRIV-Require-MFA-Compliant-Device",
      resourceType: "ConditionalAccessPolicy",
      scope: "TENANT",
      controlFamily: "Policy",
      status: "REPORT_ONLY",
      expectedState: "Privileged admins must require MFA and compliant device enforcement.",
      observedState: "Policy switched to report-only during emergency change window.",
      changeWindowHours: 18,
      breaksGuardrail: true,
      impactsIdentity: true,
      note: "Admin policy no longer blocks risky sign-ins."
    },
    {
      id: "gap-breakglass-exclusion",
      snapshotId: "bundle-privileged",
      resourcePath: "CA-PRIV-Exclude-Emergency-Accounts",
      resourceType: "Group",
      scope: "GROUP",
      controlFamily: "Exclusion",
      status: "CHANGED",
      expectedState: "Only two monitored emergency accounts stay excluded.",
      observedState: "Nine identities are excluded, including a partner operations user and a legacy service account.",
      changeWindowHours: 31,
      breaksGuardrail: true,
      impactsIdentity: true
    },
    {
      id: "gap-device-requirement",
      snapshotId: "bundle-workforce",
      resourcePath: "CA-WF-Require-Compliant-Device",
      resourceType: "ConditionalAccessPolicy",
      scope: "TENANT",
      controlFamily: "Device",
      status: "CHANGED",
      expectedState: "Browser and desktop access require compliant or hybrid-joined devices.",
      observedState: "Device filter not enforced for unmanaged macOS browsers.",
      changeWindowHours: 14,
      breaksGuardrail: true
    },
    {
      id: "gap-risk-policy",
      snapshotId: "bundle-privileged",
      resourcePath: "CA-RISK-SignIn-Protection",
      resourceType: "RiskPolicy",
      scope: "TENANT",
      controlFamily: "Risk",
      status: "REMOVED",
      expectedState: "Medium-and-above sign-in risk requires MFA or session block.",
      observedState: "Sign-in risk policy missing from the privileged policy set.",
      changeWindowHours: 41,
      breaksGuardrail: true
    },
    {
      id: "gap-session-controls",
      snapshotId: "bundle-workforce",
      resourcePath: "CA-WF-SharePoint-Session-Controls",
      resourceType: "SessionControl",
      scope: "POLICY_SET",
      controlFamily: "Session",
      status: "CHANGED",
      expectedState: "SharePoint access uses sign-in frequency and app-enforced restrictions.",
      observedState: "Session controls not configured after recent template split.",
      changeWindowHours: 27
    },
    {
      id: "gap-uncovered-app",
      snapshotId: "bundle-workforce",
      resourcePath: "ServiceNow HR onboarding",
      resourceType: "ServicePrincipal",
      scope: "APP",
      controlFamily: "App",
      status: "ADDED",
      expectedState: "Critical SaaS apps are targeted by workforce Conditional Access.",
      observedState: "New app is not targeted by baseline policy coverage.",
      changeWindowHours: 9,
      breaksGuardrail: false
    }
  ]
};

export const policyLanePackets = [
  {
    id: "privileged-admin",
    lane: "Privileged admin lane",
    owner: "Entra IAM",
    focus: "Admin policies, exclusions, and role-sensitive sign-in controls",
    status: "red",
    note: "Privileged protections drifted into report-only mode with exclusion sprawl.",
    nextAction: "Restore admin enforcement and cut the exclusion list back to monitored emergency accounts."
  },
  {
    id: "device-trust",
    lane: "Device trust lane",
    owner: "Endpoint Engineering",
    focus: "Compliant-device enforcement and unmanaged endpoint containment",
    status: "red",
    note: "macOS browser traffic is bypassing the expected device-trust gate.",
    nextAction: "Reattach compliant-device logic and verify browser policy targeting."
  },
  {
    id: "risk-and-session",
    lane: "Risk and session lane",
    owner: "Identity Protection",
    focus: "Sign-in risk coverage, session control, and containment posture",
    status: "yellow",
    note: "Risk and session controls are partially missing in the current policy bundle.",
    nextAction: "Reintroduce risk enforcement and session restrictions before the next audit window."
  },
  {
    id: "app-targeting",
    lane: "App targeting lane",
    owner: "Application Access",
    focus: "Critical SaaS targeting and rollout completeness",
    status: "yellow",
    note: "New business apps are arriving faster than the baseline policy set covers them.",
    nextAction: "Add uncovered apps to workforce coverage and confirm scope inheritance."
  }
] as const;

export const exceptionPackets = [
  {
    packetId: "CA-ADM-11",
    lane: "Privileged admin recovery",
    owner: "Entra IAM",
    status: "red",
    completenessScore: 57,
    decisionNote: "Admin policy is report-only and exclusion scope is too wide for a healthy privileged posture.",
    blocker: "Privileged sign-in coverage cannot be called healthy until enforcement and exclusion hygiene are restored.",
    launchWindowHours: 8
  },
  {
    packetId: "CA-DEV-19",
    lane: "Device trust repair",
    owner: "Endpoint Engineering",
    status: "red",
    completenessScore: 63,
    decisionNote: "Compliant-device gating is incomplete for unmanaged browsers.",
    blocker: "Unmanaged endpoint access remains too permissive for workforce SaaS coverage.",
    launchWindowHours: 10
  },
  {
    packetId: "CA-RSK-24",
    lane: "Risk and session restoration",
    owner: "Identity Protection",
    status: "yellow",
    completenessScore: 74,
    decisionNote: "Risk and session controls can clear once the missing policies are republished and validated.",
    blocker: "Sign-in risk and session restrictions need one coordinated restoration cycle.",
    launchWindowHours: 16
  },
  {
    packetId: "CA-APP-31",
    lane: "App targeting cleanup",
    owner: "Application Access",
    status: "yellow",
    completenessScore: 82,
    decisionNote: "Critical SaaS rollout is close to clean but one onboarding path is still outside baseline coverage.",
    blocker: "ServiceNow HR onboarding must be added to the workforce bundle.",
    launchWindowHours: 24
  }
] as const;
