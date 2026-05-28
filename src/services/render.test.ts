// SPDX-License-Identifier: AGPL-3.0-or-later

import { describe, expect, test } from "vitest";

import {
  renderControlGaps,
  renderDocs,
  renderExceptionPosture,
  renderOverview,
  renderPolicyLane,
  renderVerification
} from "./render.js";

describe("render", () => {
  test("overview carries the Conditional Access framing", () => {
    expect(renderOverview()).toContain("Conditional Access policy drift");
  });

  test("detail pages expose their lane names", () => {
    expect(renderPolicyLane()).toContain("Policy Lane");
    expect(renderControlGaps()).toContain("Control Gaps");
    expect(renderExceptionPosture()).toContain("Exception Posture");
    expect(renderVerification()).toContain("Verification");
    expect(renderDocs()).toContain("Offline Conditional Access analysis");
  });
});
