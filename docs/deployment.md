# 部署指南

## 必要環境變數

```bash
LINE_CHANNEL_ACCESS_TOKEN=你的 LINE channel access token
LINE_CHANNEL_SECRET=你的 LINE channel secret
ADMIN_TOKEN=長隨機字串
NODE_ENV=production
LOG_LEVEL=info
LOG_MESSAGE_TEXT=false
REPLY_TO_UNKNOWN=false
```

`LOG_MESSAGE_TEXT=false` 是建議預設值，避免 logs 留下使用者訊息內容。

## Render

本專案包含 `render.yaml`。建立 Render Blueprint 後，補上以下環境變數：

- `LINE_CHANNEL_ACCESS_TOKEN`
- `LINE_CHANNEL_SECRET`
- `ADMIN_TOKEN`

部署完成後，把 Render 網址加 `/webhook` 填回 LINE Developers Console。

## Docker

```bash
docker build -t line-auto-helper .
docker run --rm -p 3000:3000 --env-file .env line-auto-helper
```

健康檢查：

```bash
curl http://localhost:3000/healthz
curl http://localhost:3000/readyz
```

## GitHub Actions 廣播

排程廣播由 `.github/workflows/line-broadcast.yml` 負責。需要設定：

- Secret：`LINE_CHANNEL_ACCESS_TOKEN`
- Variable：`LINE_BROADCAST_TEXT`

GitHub Actions 的 cron 使用 UTC。檔案中的 `0 1 * * 1` 等於台灣時間每週一 09:00。
