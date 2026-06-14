# Maintenance Log

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
