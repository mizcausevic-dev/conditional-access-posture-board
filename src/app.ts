// SPDX-License-Identifier: AGPL-3.0-or-later

import express from "express";
import { fileURLToPath } from "node:url";

import {
  controlGaps,
  exceptionPosture,
  payload,
  policyLane,
  summary,
  verification
} from "./services/conditionalAccessPostureBoardService.js";
import {
  renderControlGaps,
  renderDocs,
  renderExceptionPosture,
  renderOverview,
  renderPolicyLane,
  renderVerification
} from "./services/render.js";

const app = express();
const port = Number(process.env.PORT ?? 5521);
const host = process.env.HOST || "0.0.0.0";

app.get("/", (_req, res) => res.type("html").send(renderOverview()));
app.get("/policy-lane", (_req, res) => res.type("html").send(renderPolicyLane()));
app.get("/control-gaps", (_req, res) => res.type("html").send(renderControlGaps()));
app.get("/exception-posture", (_req, res) => res.type("html").send(renderExceptionPosture()));
app.get("/verification", (_req, res) => res.type("html").send(renderVerification()));
app.get("/docs", (_req, res) => res.type("html").send(renderDocs()));

app.get("/api/dashboard/summary", (_req, res) => res.json(summary()));
app.get("/api/policy-lane", (_req, res) => res.json(policyLane()));
app.get("/api/control-gaps", (_req, res) => res.json(controlGaps()));
app.get("/api/exception-posture", (_req, res) => res.json(exceptionPosture()));
app.get("/api/verification", (_req, res) => res.json(verification()));
app.get("/api/sample", (_req, res) => res.json(payload()));

const currentFile = fileURLToPath(import.meta.url);
const invokedDirectly = process.argv[1] !== undefined && currentFile === process.argv[1];

if (invokedDirectly) {
  app.listen(port, host, () => {
    console.log(`Conditional Access Posture Board listening on http://${host}:${port}`);
  });
}

export default app;
