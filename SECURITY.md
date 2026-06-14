# Security

## Secrets

不要把以下內容 commit 到 repository：

- `LINE_CHANNEL_ACCESS_TOKEN`
- `LINE_CHANNEL_SECRET`
- `ADMIN_TOKEN`
- 使用者個資或內部營運資料

本專案預設 `.gitignore` 會忽略 `.env`。

## Logs

預設 `LOG_MESSAGE_TEXT=false`，不把使用者訊息文字寫進 logs。只有在本機除錯且確定資料可被記錄時，才短暫改成 `true`。

## Admin API

`/admin/metrics` 與 `/admin/broadcast` 需要 `ADMIN_TOKEN`。正式環境請使用長隨機字串，並定期更換。

## 回報安全問題

如果你發現 token 外洩、未授權廣播或 webhook 驗證問題，請先停用相關 token，再建立 private 修復分支處理。不要把有效 token 貼到 issue、PR 或 logs。
