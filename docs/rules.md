# 自動回覆規則

規則檔位於 `data/replies.json`。每次修改後請執行：

```bash
npm run validate:rules
npm test
```

## 規則欄位

```json
{
  "name": "營業時間",
  "match": "includes",
  "keywords": ["營業時間", "服務時間"],
  "reply": "我們的服務時間是週一到週五 09:00-18:00。"
}
```

- `name`：規則名稱，會出現在 `/rules` 與 metrics 裡。
- `match`：`exact`、`includes` 或 `regex`。
- `keywords`：關鍵字陣列。
- `reply`：文字、文字陣列，或 LINE message object。

## 比對方式

- `exact`：使用者訊息完全等於關鍵字。
- `includes`：使用者訊息包含關鍵字。
- `regex`：關鍵字視為正規表達式。

## 回覆限制

LINE reply API 一次最多 5 則訊息。這個專案的驗證腳本會擋掉超過 5 則的規則，避免部署後才失敗。

## 隱私建議

不要把個資、內部電話、金流資訊或一次性密碼寫在公開 repository 的規則檔。如果規則需要私密內容，建議放在私有 repo 或改成由資料庫/API 載入。
