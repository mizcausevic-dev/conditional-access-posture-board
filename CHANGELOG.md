# Changelog

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
