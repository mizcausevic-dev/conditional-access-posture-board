import { describe, expect, test } from "vitest";

import {
  controlGaps,
  exceptionPosture,
  policyLane,
  summary,
  verification
} from "./conditionalAccessPostureBoardService.js";

describe("conditionalAccessPostureBoardService", () => {
  test("summary reflects the sample posture", () => {
    expect(summary()).toMatchObject({
      bundles: 2,
      currentBundles: 1,
      gaps: 6,
      blockingGaps: 4,
      deviceGaps: 1,
      riskGaps: 1
    });
  });

  test("policy lane stays mapped to owners", () => {
    const lanes = policyLane();
    expect(lanes).toHaveLength(4);
    expect(lanes.some((lane) => lane.lane === "Privileged admin lane" && lane.owner === "Entra IAM")).toBe(true);
  });

  test("control gaps sort high severity first", () => {
    const risks = controlGaps();
    expect(risks[0]?.severity).toBe("high");
    expect(risks.some((risk) => risk.code === "report-only-admin-policy")).toBe(true);
  });

  test("exception posture and verification stay populated", () => {
    expect(exceptionPosture()).toHaveLength(4);
    expect(verification().length).toBeGreaterThan(3);
  });
});
