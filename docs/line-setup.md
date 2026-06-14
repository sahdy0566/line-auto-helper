# LINE Messaging API Setup

These notes assume you already have a LINE Developers account and permission to create a Messaging API channel.

## 1. 建立 LINE Channel

1. 到 LINE Developers Console 建立 Provider。
2. 建立 Messaging API channel。
3. 到 Messaging API 頁籤啟用 webhook。
4. 產生 Channel access token。
5. 複製 Channel secret。

## 2. 本機啟動

```bash
cp .env.example .env
npm install
npm run validate:env
npm start
```

把 `.env` 補上：

```bash
LINE_CHANNEL_ACCESS_TOKEN=你的 token
LINE_CHANNEL_SECRET=你的 secret
```

For local webhook testing, expose `http://localhost:3000` with ngrok or cloudflared, then set LINE webhook URL to:

```text
https://你的公開網址/webhook
```

## 3. 修改自動回覆

編輯 `data/replies.json`：

- `match: "exact"`：文字完全相同才回覆。
- `match: "includes"`：訊息包含關鍵字就回覆。
- `match: "regex"`：用正規表達式比對。

`reply` 可以是一段文字、最多五段文字陣列，或 LINE message object。

## 4. GitHub Actions 排程廣播

到 GitHub repository 的 Settings -> Secrets and variables -> Actions：

1. 新增 Secret：`LINE_CHANNEL_ACCESS_TOKEN`
2. 新增 Variable：`LINE_BROADCAST_TEXT`

`.github/workflows/line-broadcast.yml` 會在每週一 09:00 台灣時間自動廣播，也可以在 Actions 頁面手動執行。

## 5. 部署

這個專案可以部署到支援 Node.js 22 的服務，例如 Render、Railway、Fly.io 或 Docker 主機。部署後把正式網址的 `/webhook` 填回 LINE Developers Console。

## 6. 常見檢查

- LINE 後台 webhook 要開啟。
- Channel secret 要對應同一個 Messaging API channel。
- Reply API 只接受 webhook 事件中的 `replyToken`，不能拿舊 token 重送。
- Broadcast 會發給官方帳號的所有好友，正式帳號要小心測試。
