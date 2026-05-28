import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

import { analyze } from "../src/analyze.js";
import { toMarkdown, toSummary } from "../src/format.js";
import type { ConditionalAccessExport } from "../src/types.js";

const here = fileURLToPath(new URL(".", import.meta.url));
const fixture = (name: string): ConditionalAccessExport =>
  JSON.parse(readFileSync(`${here}/../fixtures/${name}`, "utf8")) as ConditionalAccessExport;

const NOW = "2026-05-30T00:00:00Z";

describe("analyze", () => {
  it("counts bundles and gaps", () => {
    const report = analyze(fixture("conditional-access-posture.json"), { now: NOW });
    expect(report.bundles).toBe(2);
    expect(report.gaps).toBe(6);
  });

  it("flags stale snapshot exports", () => {
    const report = analyze(fixture("conditional-access-posture.json"), { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "stale-policy-export")?.subjectName).toContain("privileged-admin");
  });

  it("flags admin report-only and exclusion drift as high", () => {
    const report = analyze(fixture("conditional-access-posture.json"), { now: NOW });
    expect(report.findingsList.find((finding) => finding.code === "report-only-admin-policy")?.subjectName).toContain("CA-PRIV");
    expect(report.findingsList.find((finding) => finding.code === "emergency-access-exclusion-drift")?.subjectName).toContain("Exclude-Emergency");
  });

  it("flags device, risk, and session gaps", () => {
    const report = analyze(fixture("conditional-access-posture.json"), { now: NOW, staleGapAfterHours: 24 });
    expect(report.findingsList.find((finding) => finding.code === "compliant-device-gap")).toBeDefined();
    expect(report.findingsList.find((finding) => finding.code === "sign-in-risk-coverage-missing")).toBeDefined();
    expect(report.findingsList.find((finding) => finding.code === "session-control-gap")).toBeDefined();
  });

  it("reports ok=true on a clean fixture", () => {
    const report = analyze(fixture("conditional-access-clean.json"), { now: NOW });
    expect(report.findingsList.filter((finding) => finding.severity === "high")).toEqual([]);
    expect(report.ok).toBe(true);
  });
});

describe("formatters", () => {
  it("toMarkdown lists findings", () => {
    const markdown = toMarkdown(analyze(fixture("conditional-access-posture.json"), { now: NOW }));
    expect(markdown).toContain("Conditional Access posture");
    expect(markdown).toContain("report-only-admin-policy");
  });

  it("toSummary emits the compact one-liner", () => {
    const summary = toSummary(analyze(fixture("conditional-access-posture.json"), { now: NOW }));
    expect(summary).toMatch(/^2 bundles · 6 gaps/);
  });
});
