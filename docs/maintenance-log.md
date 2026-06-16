# Maintenance Log

## 2026-06-16

- Ran the full local validation suite: rule validation, syntax check, and tests all passed.
- Ran `npm audit --audit-level=moderate`; no vulnerabilities were reported.
- Checked outdated packages. `express` and `dotenv` both have newer major versions available, but this service is staying on Express 4 and dotenv 16 until there is a dedicated migration pass.
- Updated the dependency ranges in `package.json` to match the latest installed patch/minor versions already resolved in `package-lock.json`.

Notes for next maintenance pass:

- test Express 5 in a separate branch before changing production dependencies
- keep `LOG_MESSAGE_TEXT=false` in any hosted environment
- verify the deployed `/readyz` endpoint after the first real deploy

## 2026-06-14

- Created the first GitHub version of the service.
- Added LINE webhook handling, reply rules, scheduled broadcast, and deployment checks.
- Added rule validation so broken `data/replies.json` changes fail in CI.
- Added admin metrics and broadcast endpoints behind `ADMIN_TOKEN`.
- Reworked public docs to describe actual behavior and current limits instead of selling the project.

Next useful work:

- deploy one staging instance
- add real LINE channel secrets in the host environment, not in GitHub
- send one test message through LINE Developers Console webhook verification
- decide whether broadcasts should stay global or move to a small allowlist first
