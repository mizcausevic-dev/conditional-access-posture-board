# Security Policy

`conditional-access-posture-board` ships both an offline analyzer and a synthetic public dashboard surface. It reads JSON exports from Conditional Access posture snapshots (or synthetic data) and emits structured findings, route JSON, and prerendered HTML. No live tenant credential storage, no remote fetch of production policy data, and no execution of user-supplied code is included.

## Reporting

- Open a security advisory:
  [https://github.com/mizcausevic-dev/conditional-access-posture-board/security/advisories/new](https://github.com/mizcausevic-dev/conditional-access-posture-board/security/advisories/new)

## Scope notes

- sample data is synthetic and explicitly marked
- there is no live bridge into a production tenant
- there is no write path into Conditional Access policies
- this repo is recruiter-facing proof of operator posture, not an admin product
