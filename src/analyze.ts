import type {
  ConditionalAccessExport,
  Finding,
  PolicySnapshot,
  PostureOptions,
  PostureReport
} from "./types.js";

function isCurrent(snapshot: PolicySnapshot): boolean {
  return snapshot.snapshotStatus === "CURRENT";
}

function includesAny(text: string, needles: string[]): boolean {
  const haystack = text.toLowerCase();
  return needles.some((needle) => haystack.includes(needle));
}

export function analyze(payload: ConditionalAccessExport, options: PostureOptions = {}): PostureReport {
  const now = options.now ?? new Date().toISOString();
  const staleGapAfterHours = options.staleGapAfterHours ?? 24;
  const snapshots = payload.snapshots ?? [];
  const gaps = payload.gaps ?? [];
  const findingsList: Finding[] = [];

  const currentBundles = snapshots.filter(isCurrent).length;
  if (currentBundles === 0) {
    findingsList.push({
      code: "no-current-policy-bundle",
      severity: "high",
      message: "No current Conditional Access policy bundle is available for posture review.",
      subject: "policy-bundle-currentness"
    });
  }

  for (const snapshot of snapshots) {
    if (snapshot.snapshotStatus === "STALE") {
      findingsList.push({
        code: "stale-policy-export",
        severity: snapshot.policyStatus === "CRITICAL" ? "high" : "medium",
        message: `Policy snapshot for "${snapshot.name}" is stale and should be refreshed before certifying Conditional Access posture.`,
        subject: snapshot.id,
        subjectName: snapshot.tenantPath,
        scope: snapshot.scope
      });
    }
  }

  for (const gap of gaps) {
    const observed = gap.observedState.toLowerCase();
    const expected = gap.expectedState.toLowerCase();

    if (
      gap.controlFamily === "Policy" &&
      gap.breaksGuardrail &&
      (gap.status === "REPORT_ONLY" || includesAny(observed, ["report-only", "disabled"]))
    ) {
      findingsList.push({
        code: "report-only-admin-policy",
        severity: "high",
        message: `Admin-facing Conditional Access policy on "${gap.resourcePath}" is no longer enforcing the expected control path.`,
        subject: gap.id,
        subjectName: gap.resourcePath,
        scope: gap.scope,
        controlFamily: gap.controlFamily,
        resourceType: gap.resourceType
      });
    }

    if (
      gap.controlFamily === "Exclusion" &&
      includesAny(observed, ["excluded", "break-glass", "emergency"])
    ) {
      findingsList.push({
        code: "emergency-access-exclusion-drift",
        severity: "high",
        message: `Emergency or break-glass exclusion drift is active on "${gap.resourcePath}" and should be tightened before the next access review cycle.`,
        subject: gap.id,
        subjectName: gap.resourcePath,
        scope: gap.scope,
        controlFamily: gap.controlFamily,
        resourceType: gap.resourceType
      });
    }

    if (
      gap.controlFamily === "Device" &&
      includesAny(observed, ["not required", "not enforced", "missing", "bypass"])
    ) {
      findingsList.push({
        code: "compliant-device-gap",
        severity: gap.breaksGuardrail ? "high" : "medium",
        message: `Compliant-device enforcement is weakened on "${gap.resourcePath}" and no longer matches the expected device-trust posture.`,
        subject: gap.id,
        subjectName: gap.resourcePath,
        scope: gap.scope,
        controlFamily: gap.controlFamily,
        resourceType: gap.resourceType
      });
    }

    if (
      gap.controlFamily === "Risk" &&
      (includesAny(observed, ["disabled", "missing", "not targeted"]) ||
        includesAny(expected, ["risk"]))
    ) {
      findingsList.push({
        code: "sign-in-risk-coverage-missing",
        severity: "high",
        message: `Risk-based Conditional Access coverage is incomplete on "${gap.resourcePath}" and should be restored before this policy set is called healthy.`,
        subject: gap.id,
        subjectName: gap.resourcePath,
        scope: gap.scope,
        controlFamily: gap.controlFamily,
        resourceType: gap.resourceType
      });
    }

    if (
      gap.controlFamily === "Session" &&
      includesAny(observed, ["missing", "disabled", "not configured"])
    ) {
      findingsList.push({
        code: "session-control-gap",
        severity: "medium",
        message: `Session controls are incomplete on "${gap.resourcePath}", reducing Conditional Access containment and auditability.`,
        subject: gap.id,
        subjectName: gap.resourcePath,
        scope: gap.scope,
        controlFamily: gap.controlFamily,
        resourceType: gap.resourceType
      });
    }

    if (
      gap.controlFamily === "App" &&
      includesAny(observed, ["not targeted", "missing", "uncovered"])
    ) {
      findingsList.push({
        code: "uncovered-app-gap",
        severity: gap.breaksGuardrail ? "high" : "medium",
        message: `A critical app or workload path is not fully targeted by Conditional Access on "${gap.resourcePath}".`,
        subject: gap.id,
        subjectName: gap.resourcePath,
        scope: gap.scope,
        controlFamily: gap.controlFamily,
        resourceType: gap.resourceType
      });
    }

    if (gap.changeWindowHours > staleGapAfterHours) {
      findingsList.push({
        code: "stale-gap-window",
        severity: gap.changeWindowHours > staleGapAfterHours * 2 ? "medium" : "low",
        message: `Gap on "${gap.resourcePath}" has remained unresolved for ${gap.changeWindowHours} hours.`,
        subject: gap.id,
        subjectName: gap.resourcePath,
        scope: gap.scope,
        controlFamily: gap.controlFamily,
        resourceType: gap.resourceType
      });
    }
  }

  const blockingGaps = gaps.filter((gap) => gap.breaksGuardrail).length;
  const deviceGaps = gaps.filter((gap) => gap.controlFamily === "Device").length;
  const riskGaps = gaps.filter((gap) => gap.controlFamily === "Risk").length;
  const ok = !findingsList.some((finding) => finding.severity === "high");

  return {
    generatedAt: now,
    bundles: snapshots.length,
    currentBundles,
    gaps: gaps.length,
    blockingGaps,
    deviceGaps,
    riskGaps,
    findingsList,
    ok
  };
}
