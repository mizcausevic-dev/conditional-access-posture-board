import { mkdirSync, writeFileSync, copyFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

import {
  controlGaps,
  exceptionPosture,
  payload,
  policyLane,
  summary,
  verification
} from "../src/services/conditionalAccessPostureBoardService.js";
import {
  renderControlGaps,
  renderDocs,
  renderExceptionPosture,
  renderOverview,
  renderPolicyLane,
  renderVerification
} from "../src/services/render.js";

const root = fileURLToPath(new URL("..", import.meta.url));
const site = path.join(root, "site");

mkdirSync(site, { recursive: true });

const pages: Record<string, string> = {
  "index.html": renderOverview(),
  [path.join("policy-lane", "index.html")]: renderPolicyLane(),
  [path.join("control-gaps", "index.html")]: renderControlGaps(),
  [path.join("exception-posture", "index.html")]: renderExceptionPosture(),
  [path.join("verification", "index.html")]: renderVerification(),
  [path.join("docs", "index.html")]: renderDocs()
};

for (const [relative, html] of Object.entries(pages)) {
  const target = path.join(site, relative);
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, html);
}

const apis: Record<string, unknown> = {
  [path.join("api", "dashboard", "summary.json")]: summary(),
  [path.join("api", "policy-lane.json")]: policyLane(),
  [path.join("api", "control-gaps.json")]: controlGaps(),
  [path.join("api", "exception-posture.json")]: exceptionPosture(),
  [path.join("api", "verification.json")]: verification(),
  [path.join("api", "sample.json")]: payload()
};

for (const [relative, data] of Object.entries(apis)) {
  const target = path.join(site, relative);
  mkdirSync(path.dirname(target), { recursive: true });
  writeFileSync(target, JSON.stringify(data, null, 2));
}

writeFileSync(
  path.join(site, "robots.txt"),
  "User-agent: *\nAllow: /\nSitemap: https://access.kineticgain.com/sitemap.xml\n"
);
writeFileSync(
  path.join(site, "sitemap.xml"),
  `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://access.kineticgain.com/</loc></url>
  <url><loc>https://access.kineticgain.com/policy-lane/</loc></url>
  <url><loc>https://access.kineticgain.com/control-gaps/</loc></url>
  <url><loc>https://access.kineticgain.com/exception-posture/</loc></url>
  <url><loc>https://access.kineticgain.com/verification/</loc></url>
  <url><loc>https://access.kineticgain.com/docs/</loc></url>
</urlset>`
);

const cname = path.join(root, "CNAME");
if (existsSync(cname)) {
  copyFileSync(cname, path.join(site, "CNAME"));
}
