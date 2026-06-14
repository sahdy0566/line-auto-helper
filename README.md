# LINE Auto Helper

這是一個可以直接放上 GitHub 的 LINE Messaging API 自動化專案。

它包含：

- LINE webhook 自動回覆
- `data/replies.json` 關鍵字規則
- 新好友加入歡迎訊息
- `/ping`、`/rules`、`選單` 指令
- GitHub Actions CI
- GitHub Actions 每週排程 LINE 廣播
- Docker 部署設定

## 快速開始

```bash
npm install
cp .env.example .env
npm run validate:env
npm start
```

編輯 `.env`，填入 LINE Developers Console 裡的：

```bash
LINE_CHANNEL_ACCESS_TOKEN=你的 channel access token
LINE_CHANNEL_SECRET=你的 channel secret
```

啟動後 webhook endpoint 是：

```text
POST /webhook
```

如果部署網址是 `https://your-app.example.com`，LINE webhook URL 就填：

```text
https://your-app.example.com/webhook
```

## 修改自動回覆

改 `data/replies.json` 就可以新增規則：

```json
{
  "name": "營業時間",
  "match": "includes",
  "keywords": ["營業時間", "服務時間"],
  "reply": "我們的服務時間是週一到週五 09:00-18:00。"
}
```

支援三種比對：

- `exact`：完全相同
- `includes`：包含關鍵字
- `regex`：正規表達式

## 手動廣播

```bash
npm run broadcast -- "今天有新活動，歡迎查看！"
```

需要環境變數：

```bash
LINE_CHANNEL_ACCESS_TOKEN=你的 channel access token
```

## GitHub Actions 排程廣播

到 repository 的 Settings -> Secrets and variables -> Actions 設定：

- Secret：`LINE_CHANNEL_ACCESS_TOKEN`
- Variable：`LINE_BROADCAST_TEXT`

預設 workflow 會在每週一 09:00 台灣時間廣播，也可以從 Actions 頁面手動輸入訊息執行。

## 常用指令

```bash
npm run dev
npm run lint
npm test
npm run broadcast -- "要廣播的文字"
```

## 更多設定

完整 LINE 設定流程看 [docs/line-setup.md](docs/line-setup.md)。
