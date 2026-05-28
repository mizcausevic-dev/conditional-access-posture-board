#!/usr/bin/env node
// SPDX-License-Identifier: AGPL-3.0-or-later

import { readFileSync, writeFileSync } from "node:fs";

import { analyze } from "./analyze.js";
import { toMarkdown, toSummary } from "./format.js";
import type { ConditionalAccessExport, PostureOptions } from "./types.js";

type OutputFormat = "json" | "markdown" | "summary";

function fail(message: string): never {
  console.error(message);
  process.exit(1);
}

function parseArgs(argv: string[]) {
  if (argv.length === 0 || argv.includes("--help") || argv.includes("-h")) {
    console.log(HELP);
    process.exit(0);
  }

  const input = argv[0];
  let format: OutputFormat = "json";
  let out: string | undefined;
  let failOnHigh = false;
  const options: PostureOptions = {};

  for (let i = 1; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--format") {
      const value = argv[++i];
      if (value !== "json" && value !== "markdown" && value !== "summary") fail(`Unsupported format: ${value}`);
      format = value;
    } else if (arg === "--out") {
      out = argv[++i];
    } else if (arg === "--now") {
      options.now = argv[++i];
    } else if (arg === "--stale-gap-after-hours") {
      options.staleGapAfterHours = Number(argv[++i]);
    } else if (arg === "--fail-on-high") {
      failOnHigh = true;
    } else {
      fail(`Unknown flag: ${arg}`);
    }
  }

  return { input, format, out, failOnHigh, options };
}

const HELP = `conditional-access-posture-board - analyze Conditional Access posture exports

Usage:
  conditional-access-posture <export.json> [--format json|markdown|summary]
                              [--now <iso>] [--stale-gap-after-hours N]
                              [--fail-on-high] [--out <file>]
`;

const { input, format, out, failOnHigh, options } = parseArgs(process.argv.slice(2));
const payload = JSON.parse(readFileSync(input, "utf8")) as ConditionalAccessExport;
const report = analyze(payload, options);

const rendered =
  format === "json"
    ? JSON.stringify(report, null, 2)
    : format === "markdown"
      ? toMarkdown(report)
      : toSummary(report);

if (out) {
  writeFileSync(out, rendered);
} else {
  console.log(rendered);
}

if (failOnHigh && report.findingsList.some((finding) => finding.severity === "high")) {
  process.exit(2);
}
