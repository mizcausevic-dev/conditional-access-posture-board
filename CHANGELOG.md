# Changelog

## v1.0.0-prod — 2026-05-27

- Production hardening pass: confirmed CI (lint, typecheck, coverage, build, npm audit) + Pages workflow are green on `main` at HEAD before tagging v1.0-prod.
- v0.1 already arrived with LICENSE (AGPL-3.0-or-later), `CODE_OF_CONDUCT.md`, `SECURITY.md`, `.github/dependabot.yml` (npm + github-actions, weekly), and dual-Node 20/22 CI — Wave 15 baseline already at hardening parity with the rest of the multi-cloud lane.
- No `src/`, README narrative, docs, or screenshot edits — squad doctrine v1.1 respects the v0.1-shipped operator-surface as Codex shipped it.

## v0.1-shipped

- Initial release: operator surface for Conditional Access policy posture, exclusions, device trust, risk coverage, and exception remediation.
- Added public dashboard routes:
  - `/`
  - `/policy-lane`
  - `/control-gaps`
  - `/exception-posture`
  - `/verification`
  - `/docs`
- Added synthetic policy snapshots and gap packets covering report-only admin policies, exclusion drift, device-trust gaps, sign-in risk coverage gaps, session control gaps, and uncovered app targeting.
- Added `docs/KINETIC_GAIN_EMBEDDED.md`, `robots.txt`, `sitemap.xml`, and README proof screenshots.
- Added CLI: `conditional-access-posture <export.json>` with `--format json|markdown|summary`, `--now <iso>`, `--stale-gap-after-hours N`, `--fail-on-high`, and `--out FILE`.
