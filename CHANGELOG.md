# Changelog

## Unreleased

- Aligned `express` and `dotenv` dependency ranges with the current patch/minor versions used by the lockfile.
- Recorded the 2026-06-16 maintenance pass, including audit status and major-upgrade notes.
- Added `npm run smoke` for a lightweight server startup and endpoint authorization check.
- Added a cross-platform test runner so smoke checks stay explicit.
- Added the smoke test to CI.
- Reworked public docs to be more direct and operational.
- Added editor settings and Git attributes to keep text files consistent across Windows and GitHub.
- Added a maintenance log with current project status and next operational steps.

## 1.0.0

- 建立 LINE webhook 自動回覆服務。
- 新增關鍵字規則檔 `data/replies.json`。
- 新增 GitHub Actions CI 與排程廣播。
- 新增健康檢查、管理 metrics、管理廣播 API。
- 新增規則檔驗證、維護文件與安全文件。
