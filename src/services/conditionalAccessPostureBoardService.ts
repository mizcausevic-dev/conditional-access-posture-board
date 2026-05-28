// SPDX-License-Identifier: AGPL-3.0-or-later

import { analyze } from "../analyze.js";
import { exceptionPackets, policyLanePackets, sampleConditionalAccessPayload } from "../data/sampleConditionalAccess.js";
import type { Finding } from "../types.js";

const NOW = "2026-05-30T00:00:00Z";
const report = analyze(sampleConditionalAccessPayload, {
  now: NOW,
  staleGapAfterHours: 24
});

function severityRank(finding: Finding): number {
  return finding.severity === "high"
    ? 0
    : finding.severity === "medium"
      ? 1
      : finding.severity === "low"
        ? 2
        : 3;
}

export function summary() {
  return {
    bundles: report.bundles,
    currentBundles: report.currentBundles,
    gaps: report.gaps,
    blockingGaps: report.blockingGaps,
    deviceGaps: report.deviceGaps,
    riskGaps: report.riskGaps,
    highFindings: report.findingsList.filter((finding) => finding.severity === "high").length,
    recommendation:
      "Restore admin enforcement, shrink emergency exclusions, reattach compliant-device checks, re-enable sign-in risk coverage, and close app-targeting gaps before calling Conditional Access posture healthy."
  };
}

export function policyLane() {
  return policyLanePackets.map((lane) => ({
    ...lane,
    relatedFindings: report.findingsList.filter((finding) => {
      if (lane.id === "privileged-admin") {
        return finding.code === "report-only-admin-policy" || finding.code === "emergency-access-exclusion-drift";
      }
      if (lane.id === "device-trust") {
        return finding.code === "compliant-device-gap";
      }
      if (lane.id === "risk-and-session") {
        return finding.code === "sign-in-risk-coverage-missing" || finding.code === "session-control-gap" || finding.code === "stale-policy-export";
      }
      if (lane.id === "app-targeting") {
        return finding.code === "uncovered-app-gap" || finding.code === "stale-gap-window";
      }
      return false;
    }).length
  }));
}

export function controlGaps() {
  return [...report.findingsList]
    .sort((left, right) => severityRank(left) - severityRank(right))
    .map((finding) => ({
      ...finding,
      owner:
        finding.code === "report-only-admin-policy" || finding.code === "emergency-access-exclusion-drift"
          ? "Entra IAM"
          : finding.code === "compliant-device-gap"
            ? "Endpoint Engineering"
            : finding.code === "sign-in-risk-coverage-missing" || finding.code === "session-control-gap"
              ? "Identity Protection"
              : finding.code === "uncovered-app-gap"
                ? "Application Access"
                : "Platform Reliability"
    }));
}

export function exceptionPosture() {
  return exceptionPackets;
}

export function verification() {
  return [
    "The dashboard is backed by a real offline posture analyzer and CLI, not static copy alone.",
    "Policy snapshots and gap packets are synthetic sample data only; no live tenant credentials, secrets, or production exports are published.",
    "The control plane keeps admin enforcement, exclusions, device trust, sign-in risk, session control, and app targeting visible for identity stakeholders.",
    "This surface demonstrates Conditional Access operator work, not a generic Microsoft keyword page.",
    "It complements Entra, Intune, Defender, AWS, and GCP proof with a concrete identity-policy governance lane."
  ];
}

export function payload() {
  return {
    summary: summary(),
    policyLane: policyLane(),
    controlGaps: controlGaps(),
    exceptionPosture: exceptionPosture(),
    verification: verification(),
    sample: sampleConditionalAccessPayload
  };
}
