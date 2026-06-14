# Maintaining

## 每次修改規則

```bash
npm run validate:rules
npm test
```

確認 `data/replies.json` 沒有超過 LINE 限制，也沒有壞掉的 regex。

## 每次修改程式

```bash
npm run validate
```

這會跑規則驗證、語法檢查與測試。

## 部署後檢查

```bash
curl https://your-app.example.com/healthz
curl https://your-app.example.com/readyz
```

如果 `/readyz` 不是 `ok: true`，先檢查環境變數與 `data/replies.json`。

## 查詢服務狀態

```bash
curl -H "Authorization: Bearer $ADMIN_TOKEN" \
  https://your-app.example.com/admin/metrics
```

metrics 是 in-memory，服務重啟後會歸零。它適合輕量維運，不取代正式監控。

## 發版紀錄

更新使用者可見行為時，同步更新 `CHANGELOG.md`。
