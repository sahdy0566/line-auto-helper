# Maintenance Log

## 2026-06-20

- Updated `@line/bot-sdk` from `11.0.1` to `11.0.2`.
- Ran `npm ci` to confirm the lockfile can rebuild a clean install.
- Ran `npm run validate`; rule validation, syntax check, and tests passed.
- Ran `npm run smoke`; local server startup and admin authorization checks passed.
- Ran `npm audit --omit=dev --audit-level=low`; no vulnerabilities were reported.
- Checked outdated packages. `express` 5 and `dotenv` 17 are still major-version upgrades and were left for a separate migration branch.
- Docker CLI is installed, but the Docker daemon was not running in this background session. Docker Desktop was not launched to avoid opening a visible app window.

## 2026-06-16

- Ran the full local validation suite: rule validation, syntax check, and tests all passed.
- Ran `npm audit --audit-level=moderate`; no vulnerabilities were reported.
- Checked outdated packages. `express` and `dotenv` both have newer major versions available, but this service is staying on Express 4 and dotenv 16 until there is a dedicated migration pass.
- Updated the dependency ranges in `package.json` to match the latest installed patch/minor versions already resolved in `package-lock.json`.
- Added a reusable smoke test script for server startup, health checks, readiness, and admin endpoint authorization.
- Added a cross-platform test runner so `npm test` only executes `*.test.js` files under `test/`.
- Added the smoke test to GitHub Actions CI.
- Ran `npm ci` successfully to confirm the lockfile can rebuild a clean install.
- Installed Docker Desktop and verified Docker CLI/daemon locally.
- Built `line-auto-helper:maintenance` successfully.
- Ran the Docker image and checked `/healthz`, `/readyz`, unauthorized admin access, and authorized `/admin/metrics`.
- Added `.dockerignore` so Docker build context does not include local dependencies or Git metadata.

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
