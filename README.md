# LINE Auto Helper

LINE Auto Helper 是一個可部署、可維護的 LINE Messaging API 自動化服務。它不是只做 echo 的範例，而是把 webhook、規則檔、自動廣播、健康檢查、管理 API 和 GitHub Actions 放在同一個可長期維護的專案裡。

## 功能

- LINE webhook 自動回覆
- `data/replies.json` 關鍵字規則
- 新好友加入歡迎訊息
- `/ping`、`/rules`、`選單` 指令
- `/healthz` 與 `/readyz` 部署健康檢查
- 受 `ADMIN_TOKEN` 保護的 `/admin/metrics`
- 受 `ADMIN_TOKEN` 保護的 `/admin/broadcast`
- 結構化 JSON logs，預設不記錄使用者訊息文字
- GitHub Actions CI、規則檔驗證、排程 LINE 廣播
- Docker 與 Render 部署範本

## 快速開始

```bash
npm install
cp .env.example .env
npm run validate:env
npm run validate:rules
npm start
```

`.env` 至少要填：

```bash
LINE_CHANNEL_ACCESS_TOKEN=你的 channel access token
LINE_CHANNEL_SECRET=你的 channel secret
ADMIN_TOKEN=請換成一組長隨機字串
```

啟動後：

```text
GET  /healthz
GET  /readyz
POST /webhook
GET  /admin/metrics
POST /admin/broadcast
```

LINE Developers Console 的 Webhook URL 填部署網址加 `/webhook`，例如：

```text
https://your-app.example.com/webhook
```

## 自動回覆規則

修改 `data/replies.json` 即可調整關鍵字回覆。

```json
{
  "name": "營業時間",
  "match": "includes",
  "keywords": ["營業時間", "服務時間"],
  "reply": "我們的服務時間是週一到週五 09:00-18:00。"
}
```

支援：

- `exact`：完全相同
- `includes`：包含關鍵字
- `regex`：正規表達式

修改後先跑：

```bash
npm run validate:rules
npm test
```

更多規則格式看 [docs/rules.md](docs/rules.md)。

## 管理 API

所有 `/admin/*` endpoint 都需要：

```text
Authorization: Bearer <ADMIN_TOKEN>
```

查看目前服務狀態：

```bash
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  https://your-app.example.com/admin/metrics
```

手動廣播：

```bash
curl -X POST https://your-app.example.com/admin/broadcast \
  -H "Authorization: Bearer $ADMIN_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"message":"今天有新活動，歡迎查看。"}'
```

本機也可以直接跑：

```bash
npm run broadcast -- "今天有新活動，歡迎查看。"
```

## GitHub Actions

CI 會跑：

- JavaScript 語法檢查
- `data/replies.json` 規則驗證
- Node test runner 測試

排程廣播需要到 GitHub repository 的 Settings -> Secrets and variables -> Actions 設定：

- Secret：`LINE_CHANNEL_ACCESS_TOKEN`
- Variable：`LINE_BROADCAST_TEXT`

## 部署

部署方式看 [docs/deployment.md](docs/deployment.md)。LINE 設定流程看 [docs/line-setup.md](docs/line-setup.md)。

## 維護

日常維護流程看 [MAINTAINING.md](MAINTAINING.md)。安全回報看 [SECURITY.md](SECURITY.md)。
